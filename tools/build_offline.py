#!/usr/bin/env python3
"""Сборка офлайн-версии: один самодостаточный HTML (работает по file://, без сети).

Запуск:  python3 tools/build_offline.py [--out DIR] [--no-recompress] [--with-pdf --name TMK-plant-offline-pdf.html]
Результат: DIR/TMK-plant-offline.html (+ DIR/docs_pdf/ — PDF-чертежи, открываются ссылками рядом с html).

Что делает: вкладки (model/flow/pfd/interlocks/docs/settings/help) вкладываются в index как srcdoc-iframe,
скрипты/шрифты/логотип встроены, картинки (sec_img, pfd/scan) лежат base64 в text/plain-блоках
и превращаются в blob-URL по требованию; service worker и manifest убраны.
"""
import re, sys, os, io, base64, json, shutil, argparse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('--out', default=os.path.join(ROOT, 'dist-offline'))
ap.add_argument('--no-recompress', action='store_true')
ap.add_argument('--with-pdf', action='store_true', help='встроить PDF из docs_pdf в сам html (файл ~230 МБ)')
ap.add_argument('--name', default='TMK-plant-offline.html')
a = ap.parse_args()
P = lambda *p: os.path.join(ROOT, *p)
rd = lambda p, m='r': open(P(p), m, **({'encoding': 'utf-8'} if m == 'r' else {})).read()
b64 = lambda b: base64.b64encode(b).decode()

# --- шрифты -> data URI
fonts = rd('tools/offline-fonts/fonts.css')
fonts = re.sub(r'url\(([^)]+\.woff2)\)', lambda m: 'url(data:font/woff2;base64,%s)' % b64(rd('tools/offline-fonts/' + m.group(1), 'rb')), fonts)
FONT_STYLE = '<style>' + fonts + '</style>'

def inline_scripts(html, base=''):
    def rep(m):
        src = m.group(1)
        js = rd(src)
        assert '</script' not in js.lower(), src
        return '<script>' + js + '</script>'
    return re.sub(r'<script src="([^":]+\.js)"></script>', rep, html)

def strip_net(html):
    html = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', html)
    html = re.sub(r'<link rel="stylesheet" href="https://fonts[^>]*>', FONT_STYLE, html)
    html = re.sub(r'<link rel="(manifest|apple-touch-icon)"[^>]*>\s*', '', html)
    return html

ICON = 'data:image/png;base64,' + b64(rd('icon-192.png', 'rb'))
LOGO = 'data:image/png;base64,' + b64(rd('logo.png', 'rb'))
def common(html):
    html = strip_net(html)
    html = html.replace('<link rel="icon" href="icon-192.png">', '<link rel="icon" href="%s">' % ICON)
    html = html.replace('src="logo.png"', 'src="%s"' % LOGO)
    return html

# --- картинки
assets = {}
def add_asset(rel):
    data = rd(rel, 'rb')
    mime = 'image/png' if rel.endswith('.png') else 'image/jpeg'
    if not a.no_recompress and rel.endswith('.jpg'):
        try:
            from PIL import Image
            im = Image.open(io.BytesIO(data)); im.load()
            if im.mode != 'RGB': im = im.convert('RGB')
            if max(im.size) > 1800: im.thumbnail((1800, 1800), Image.LANCZOS)
            buf = io.BytesIO(); im.save(buf, 'JPEG', quality=72, optimize=True, progressive=True)
            if len(buf.getvalue()) < len(data): data = buf.getvalue()
        except ImportError: pass
    assets[rel] = (mime, data)
for d in ('sec_img', 'pfd/scan'):
    for f in sorted(os.listdir(P(d))):
        if f.lower().endswith(('.jpg', '.png')): add_asset(d + '/' + f)

if a.with_pdf:
    for f in sorted(os.listdir(P('docs_pdf'))):
        if f.lower().endswith('.pdf'): assets['docs_pdf/' + f] = ('application/pdf', rd('docs_pdf/' + f, 'rb'))

# --- страницы-вкладки
# Динамические ссылки на картинки идут через A() (определён в каждой странице), см. ASSET_SHIM.
SHIM = '<script>window.A=function(p){try{return parent.__tmkAsset(p)}catch(e){return p}};</script>'
PDF_CLICK = '''<script>document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="docs_pdf/"]');
if(!a)return;var u=parent.__tmkAsset(decodeURI(a.getAttribute('href')));if(u&&u.indexOf('blob:')===0){e.preventDefault();window.open(u,'_blank')}});</script>'''
pages = {}
for name in ('model', 'flow', 'pfd', 'interlocks', 'analyses', 'docs', 'settings', 'help'):
    h = common(inline_scripts(rd(name + '.html')))
    h = h.replace('src="sec_img/${esc(f)}"', 'src="${A(\'sec_img/\'+f)}"')
    h = h.replace("src='sec_img/'+f", "src=A('sec_img/'+f)")
    h = h.replace("const u='pfd/scan/sheet'+sheet+'.jpg'", "const u=A('pfd/scan/sheet'+sheet+'.jpg')")
    if a.with_pdf and name == 'docs':
        # ссылки на PDF открываем через blob-URL, собранный из встроенных данных
        h = h.replace('</body>', PDF_CLICK + '</body>', 1)
    h = h.replace('<head>', '<head>' + SHIM, 1)
    pages[name] = h

# --- index
idx = common(rd('index.html'))
idx = inline_scripts(idx)
idx = re.sub(r"if\('serviceWorker' in navigator\)\{.*?\n\}\n", '', idx, count=1, flags=re.S)
assert 'serviceWorker' not in idx
for name in pages:
    idx = idx.replace(' src="%s.html"' % name, '')
loader = '''<script>
(function(){
var cache={};
window.__tmkAsset=function(p){
  if(cache[p])return cache[p];
  var e=document.querySelector('script[data-asset="'+p+'"]');
  if(!e)return p;
  var bin=atob(e.textContent.trim()),u=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return cache[p]=URL.createObjectURL(new Blob([u],{type:e.getAttribute('data-mime')}));
};
function page(n){
  var bin=atob(document.querySelector('script[data-page="'+n+'"]').textContent.trim()),u=new Uint8Array(bin.length);
  for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(u);
}
var ids={model:'f-model',flow:'f-flow',pfd:'f-pfd',interlocks:'f-ilk',analyses:'f-anl',docs:'f-docs',settings:'f-settings',help:'f-help'};
for(var n in ids)document.getElementById(ids[n]).srcdoc=page(n);
})();
</script>'''
blobs = ''.join('<script type="text/plain" data-page="%s">%s</script>\n' % (n, b64(h.encode('utf-8'))) for n, h in pages.items())
blobs += ''.join('<script type="text/plain" data-asset="%s" data-mime="%s">%s</script>\n' % (r, m, b64(d)) for r, (m, d) in assets.items())
# загрузчик ставим сразу после последнего iframe (до скриптов приложения)
last = idx.rindex('</iframe>') + len('</iframe>')
idx = idx[:last] + '\n' + blobs + loader + idx[last:]

os.makedirs(a.out, exist_ok=True)
out = os.path.join(a.out, a.name)
open(out, 'w', encoding='utf-8').write(idx)
if not a.with_pdf:
    dst = os.path.join(a.out, 'docs_pdf')
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(P('docs_pdf'), dst)
print('OK', out, round(os.path.getsize(out) / 1e6, 1), 'MB')
