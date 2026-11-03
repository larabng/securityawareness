/* =========================================================================
   Inside the Mind of a Hacker – app namespace and small helpers
   -------------------------------------------------------------------------
   Vanilla JS without a build step: every file adds its part to the global
   App object (views, state, survey model, export). Content lives in
   content/*.js (window.CONTENT) and is never changed by the code.
   ========================================================================= */
(function () {
  "use strict";
  var App = window.App = { views: {} };

  App.$ = function (s, r) { return (r || document).querySelector(s); };
  App.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  App.el = function (tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  App.esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };

  // random order 0..n-1 (Fisher–Yates)
  App.shuffled = function (n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  };
  App.hash = function (s) { var h = 0; for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return Math.abs(h); };

  var toastTimer;
  App.toast = function (msg, icon) {
    var t = App.$("#toast");
    t.innerHTML = (icon ? App.icon(icon) : "") + "<span></span>";
    t.lastChild.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  };
})();
