// Общий помощник переключения языка интерфейса (RU ⇄ UZ) между index.html
// (родительский документ, держит все 4 вкладки в <iframe>) и самими вкладками
// (model.html, flow.html, docs.html, drive.html).
//
// Каждый file:// документ в WebView — это отдельный источник (origin), поэтому
// напрямую достучаться из index.html до window внутри чужого <iframe> нельзя
// (SecurityError), и localStorage тоже не гарантированно общий между ними.
// Поэтому язык синхронизируется через postMessage — тем же способом, что и
// события Google Диска (см. window.tmkDriveEvent в index.html/drive.html).
(function (global) {
  var KEY = 'tmk_lang';

  function getLang() {
    try { return localStorage.getItem(KEY) === 'uz' ? 'uz' : 'ru'; }
    catch (e) { return 'ru'; }
  }
  function setLang(l) {
    try { localStorage.setItem(KEY, l === 'uz' ? 'uz' : 'ru'); }
    catch (e) { /* ignore */ }
  }
  // dict = {ru:{key:'...'}, uz:{key:'...'}}; falls back to ru, then to the key itself.
  function t(dict, key) {
    var l = getLang();
    if (dict && dict[l] && key in dict[l]) return dict[l][key];
    if (dict && dict.ru && key in dict.ru) return dict.ru[key];
    return key;
  }

  // For index.html: owns the four <iframe> elements and rebroadcasts the
  // current language into each of them whenever it changes or (re)loads.
  function initParent(frameEls) {
    var lang = getLang();
    function sendTo(win) { try { win && win.postMessage({ __tmkLangSet: true, lang: lang }, '*'); } catch (e) {} }
    function broadcastAll() { frameEls.forEach(function (f) { sendTo(f.contentWindow); }); }
    frameEls.forEach(function (f) { f.addEventListener('load', function () { sendTo(f.contentWindow); }); });
    global.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.__tmkLangChange) {
        lang = d.lang === 'uz' ? 'uz' : 'ru';
        setLang(lang);
        broadcastAll();
      }
    });
    return { getLang: function () { return lang; }, broadcastAll: broadcastAll };
  }

  // For each tab page: onChange(lang) is called on load (once the parent's
  // first postMessage arrives) and whenever the language changes, and should
  // re-render every translated string/element on the page.
  function initChild(onChange) {
    var lang = getLang();
    global.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.__tmkLangSet) {
        lang = d.lang === 'uz' ? 'uz' : 'ru';
        setLang(lang);
        onChange(lang);
      }
    });
    function apply(l) {
      lang = l === 'uz' ? 'uz' : 'ru';
      setLang(lang);
      onChange(lang);
      try { global.parent.postMessage({ __tmkLangChange: true, lang: lang }, '*'); } catch (e) {}
    }
    function toggle() { apply(lang === 'uz' ? 'ru' : 'uz'); }
    return { getLang: function () { return lang; }, toggle: toggle, setLang: apply };
  }

  global.TmkLang = { getLang: getLang, setLang: setLang, t: t, initParent: initParent, initChild: initChild };
})(window);
