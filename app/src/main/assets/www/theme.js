// Shared theme module (RU/UZ language has its own twin, lang.js — same
// pattern): index.html is the "parent" that owns the persisted choice and
// relays it into every tab's <iframe> via postMessage, since localStorage is
// NOT reliably shared between file:// documents (each one is its own
// isolated/opaque origin in the WebView). 'system' means "follow the
// device's light/dark setting" (the CSS already does this via
// prefers-color-scheme when no data-theme attribute is set); 'light'/'dark'
// force an explicit choice via the data-theme attribute that every page's
// <style> block already reacts to.
(function (global) {
  var KEY = 'tmk_theme';
  function getTheme() {
    try {
      var v = localStorage.getItem(KEY);
      return (v === 'light' || v === 'dark') ? v : 'system';
    } catch (e) { return 'system'; }
  }
  function setTheme(t) {
    try { localStorage.setItem(KEY, (t === 'light' || t === 'dark') ? t : 'system'); } catch (e) {}
  }
  function apply(t) {
    var root = document.documentElement;
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
  }
  function initParent(frameEls) {
    var theme = getTheme();
    apply(theme);
    function sendTo(win) { try { win && win.postMessage({ __tmkThemeSet: true, theme: theme }, '*'); } catch (e) {} }
    function broadcastAll() { frameEls.forEach(function (f) { sendTo(f.contentWindow); }); }
    frameEls.forEach(function (f) { f.addEventListener('load', function () { sendTo(f.contentWindow); }); });
    global.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.__tmkThemeChange) { theme = d.theme; setTheme(theme); apply(theme); broadcastAll(); }
    });
    return { getTheme: function () { return theme; }, broadcastAll: broadcastAll };
  }
  function initChild(onChange) {
    var theme = getTheme();
    apply(theme);
    global.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.__tmkThemeSet) { theme = d.theme; setTheme(theme); apply(theme); onChange && onChange(theme); }
    });
    function change(t) {
      theme = t; setTheme(theme); apply(theme);
      onChange && onChange(theme);
      try { global.parent.postMessage({ __tmkThemeChange: true, theme: theme }, '*'); } catch (e) {}
    }
    return { getTheme: function () { return theme; }, setTheme: change };
  }
  global.TmkTheme = { getTheme: getTheme, setTheme: setTheme, apply: apply, initParent: initParent, initChild: initChild };
})(window);
