#!/usr/bin/env node
/*
 * Сборка офлайн-версии: один самодостаточный HTML, работает по file:// без сети.
 *
 *   node tools/build-offline.js
 *   node tools/build-offline.js --with-pdf            встроить все PDF (~230 МБ)
 *   node tools/build-offline.js --out DIR --name FILE.html
 *
 * Что делает: вкладки вкладываются в index как srcdoc-iframe, скрипты и шрифты
 * встраиваются, картинки (sec_img, pfd/scan) лежат base64 в text/plain-блоках и
 * превращаются в blob-URL по требованию, service worker и manifest убираются.
 *
 * Отличия от прежней python-версии:
 *  - Python не нужен, только Node;
 *  - страницы декодируются лениво: при открытии собирается только видимая
 *    вкладка, остальные — при первом переключении (на 45 МБ это ощутимо);
 *  - пережатие JPEG делает sharp, если он установлен (`npm i sharp`); без него
 *    картинки встраиваются как есть и файл выходит примерно на 11 МБ больше.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);
// Тексты читаем с нормализованными переводами строк: рабочая копия на Windows
// может быть с CRLF, а все замены ниже рассчитаны на \n.
const read = (p, enc) =>
  enc === null ? fs.readFileSync(P(p)) : fs.readFileSync(P(p), 'utf8').replace(/\r\n/g, '\n');

const b64 = (buf) => Buffer.from(buf).toString('base64');

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(name);

const OUT = path.resolve(arg('--out', P('dist-offline')));
const NAME = arg('--name', 'TMK-plant-offline.html');
const WITH_PDF = flag('--with-pdf');

const PAGES = ['model', 'flow', 'pfd', 'interlocks', 'analyses', 'kip', 'docs', 'settings', 'help'];
const IDS = {
  model: 'f-model', flow: 'f-flow', pfd: 'f-pfd', interlocks: 'f-ilk', analyses: 'f-anl',
  kip: 'f-kip', docs: 'f-docs', settings: 'f-settings', help: 'f-help',
};

// --- шрифты -> data URI ------------------------------------------------
const FONT_STYLE = (() => {
  let css = read('fonts/fonts.css');
  css = css.replace(/url\(([^)]+\.woff2)\)/g, (_, f) =>
    'url(data:font/woff2;base64,' + b64(read('fonts/' + f, null)) + ')'
  );
  return '<style>' + css + '</style>';
})();

function inlineScripts(html) {
  return html.replace(/<script src="([^":]+\.js)"><\/script>/g, (_, src) => {
    const js = read(src);
    if (js.toLowerCase().includes('</script')) throw new Error('</script внутри ' + src);
    return '<script>' + js + '</script>';
  });
}

function stripNet(html) {
  html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, '');
  // Шрифты: локальный файл заменяется встроенным @font-face в base64
  html = html.replace(/<link rel="stylesheet" href="fonts\/fonts\.css">\s*/g, FONT_STYLE);
  html = html.replace(/<link rel="(manifest|apple-touch-icon)"[^>]*>\s*/g, '');
  return html;
}

const ICON = 'data:image/png;base64,' + b64(read('icon-192.png', null));
const LOGO = 'data:image/png;base64,' + b64(read('logo.png', null));

function common(html) {
  html = stripNet(html);
  html = html.replace('<link rel="icon" href="icon-192.png">', '<link rel="icon" href="' + ICON + '">');
  html = html.replace('src="logo.png"', 'src="' + LOGO + '"');
  return html;
}

// --- картинки ----------------------------------------------------------
let sharp = null;
try {
  sharp = require('sharp');
} catch (e) {
  sharp = null;
}

const assets = new Map();

async function optimizeJpeg(buf) {
  if (!sharp) return buf;
  try {
    const out = await sharp(buf)
      .resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 72, progressive: true })
      .toBuffer();
    return out.length < buf.length ? out : buf;
  } catch (e) {
    return buf;
  }
}

async function collectAssets() {
  for (const dir of ['sec_img', 'pfd/scan']) {
    const abs = P(dir);
    if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs).sort()) {
      if (!/\.(jpe?g|png)$/i.test(f)) continue;
      const rel = dir + '/' + f;
      const isPng = /\.png$/i.test(f);
      let data = read(rel, null);
      if (!isPng) data = await optimizeJpeg(data);
      assets.set(rel, { mime: isPng ? 'image/png' : 'image/jpeg', data });
    }
  }
  if (WITH_PDF) {
    for (const f of fs.readdirSync(P('docs_pdf')).sort()) {
      if (!f.toLowerCase().endsWith('.pdf')) continue;
      assets.set('docs_pdf/' + f, { mime: 'application/pdf', data: read('docs_pdf/' + f, null) });
    }
  }
}

// --- встраиваемый код страниц ------------------------------------------
const SHIM = '<script>window.A=function(p){try{return parent.__tmkAsset(p)}catch(e){return p}};</script>';
const PDF_CLICK =
  '<script>document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest(\'a[href^="docs_pdf/"]\');' +
  'if(!a)return;var u=parent.__tmkAsset(decodeURI(a.getAttribute("href")));' +
  'if(u&&u.indexOf("blob:")===0){e.preventDefault();window.open(u,"_blank")}});</script>';

// Ленивая загрузка: srcdoc ставится при первом показе вкладки, а не для всех сразу.
const LOADER = [
  '<script>',
  '(function(){',
  'var IDS=' + JSON.stringify(IDS) + ';',
  'var assetCache={};',
  'window.__tmkAsset=function(p){',
  '  if(assetCache[p])return assetCache[p];',
  '  var e=document.querySelector(\'script[data-asset="\'+p+\'"]\');',
  '  if(!e)return p;',
  '  var bin=atob(e.textContent.trim()),u=new Uint8Array(bin.length);',
  '  for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);',
  '  return assetCache[p]=URL.createObjectURL(new Blob([u],{type:e.getAttribute("data-mime")}));',
  '};',
  'function page(n){',
  '  var e=document.querySelector(\'script[data-page="\'+n+\'"]\');',
  '  if(!e)return "";',
  '  var bin=atob(e.textContent.trim()),u=new Uint8Array(bin.length);',
  '  for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);',
  '  return new TextDecoder("utf-8").decode(u);',
  '}',
  'window.__tmkFill=function(n){',
  '  var f=document.getElementById(IDS[n]);',
  '  if(!f||f.dataset.filled)return;',
  '  f.dataset.filled="1";',
  '  f.srcdoc=page(n);',
  '};',
  'window.addEventListener("DOMContentLoaded",function(){',
  '  var orig=window.showTab;',
  '  if(typeof orig==="function"){',
  '    window.showTab=function(t){window.__tmkFill(t);return orig(t)};',
  '  }',
  '  window.__tmkFill("model");',
  '});',
  '})();',
  '</script>',
].join('\n');

async function build() {
  const t0 = Date.now();
  await collectAssets();
  if (sharp) console.log('пережатие JPEG: sharp найден');

  const pages = new Map();
  for (const name of PAGES) {
    let h = common(inlineScripts(read(name + '.html')));
    h = h.replace('src="sec_img/${esc(f)}"', 'src="${A(\'sec_img/\'+f)}"');
    h = h.replace("src='sec_img/'+f", "src=A('sec_img/'+f)");
    h = h.replace("const u='pfd/scan/sheet'+sheet+'.jpg'", "const u=A('pfd/scan/sheet'+sheet+'.jpg')");
    if (WITH_PDF && name === 'docs') h = h.replace('</body>', PDF_CLICK + '</body>');
    h = h.replace('<head>', '<head>' + SHIM);
    pages.set(name, h);
  }

  let idx = inlineScripts(common(read('index.html')));
  idx = idx.replace(/if\('serviceWorker' in navigator\)\{[\s\S]*?\n\}\n/, '');
  if (idx.includes('serviceWorker')) throw new Error('не удалось вырезать service worker');
  for (const name of pages.keys()) idx = idx.replace(' src="' + name + '.html"', '');

  const blobs =
    PAGES.map((n) => '<script type="text/plain" data-page="' + n + '">' + b64(pages.get(n)) + '</script>\n').join('') +
    [...assets.entries()]
      .map(([r, a]) =>
        '<script type="text/plain" data-asset="' + r + '" data-mime="' + a.mime + '">' + b64(a.data) + '</script>\n')
      .join('');

  const lastFrame = idx.lastIndexOf('</iframe>');
  if (lastFrame < 0) throw new Error('в index.html нет </iframe>');
  const cut = lastFrame + '</iframe>'.length;
  idx = idx.slice(0, cut) + '\n' + blobs + LOADER + idx.slice(cut);
  // шапка: дата сборки, чтобы файл можно было опознать без git
  idx = idx.replace(
    /^<!doctype html>/i,
    '<!doctype html>\n<!-- Офлайн-сборка TMK, ' + new Date().toISOString().slice(0, 10) +
      '. Файл самодостаточен: открывается двойным щелчком, сеть не нужна. -->'
  );

  fs.mkdirSync(OUT, { recursive: true });
  const outFile = path.join(OUT, NAME);
  fs.writeFileSync(outFile, idx, 'utf8');

  // PDF рядом с html нужны, только если не встроены: ссылки открываются как файлы.
  if (!WITH_PDF) {
    const dst = path.join(OUT, 'docs_pdf');
    fs.rmSync(dst, { recursive: true, force: true });
    fs.cpSync(P('docs_pdf'), dst, { recursive: true });
  }

  const mb = (fs.statSync(outFile).size / 1e6).toFixed(1);
  console.log(
    'OK ' + path.relative(ROOT, outFile) + ' — ' + mb + ' МБ, ' +
      pages.size + ' страниц, ' + assets.size + ' встроенных файлов, ' +
      ((Date.now() - t0) / 1000).toFixed(0) + ' с' +
      (WITH_PDF ? '' : ', PDF лежат рядом в docs_pdf/') +
      (sharp ? '' : ' — без пережатия JPEG (npm i sharp ужмёт файл примерно на 11 МБ)')
  );
}

build().catch((e) => {
  console.error('FAIL: ' + e.message);
  process.exit(1);
});
