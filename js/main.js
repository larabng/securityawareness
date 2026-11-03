/* =========================================================================
   Navigation and start-up. App.go(id) renders a section and shows it;
   buttons with data-go="<section>" navigate without extra code.
   ========================================================================= */
(function (App) {
  "use strict";
  var state = App.state, icon = App.icon, $ = App.$, $$ = App.$$;
  var NAV = [["start", "Start"], ["survey-pre", "Survey"], ["modules", "Modules"], ["defense", "Defense"], ["survey-post", "Finish"]];

  App.show = function (id) {
    $$(".section").forEach(function (s) { s.classList.toggle("active", s.id === id); });
    $$(".nav a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-sec") === id); });
    window.scrollTo({ top: 0, behavior: "smooth" });
    App.updateProgress();
  };
  App.go = function (id, arg) {
    if (App.views[id]) App.views[id](arg);
    App.show(id);
  };

  App.updateProgress = function () {
    var steps = {
      "survey-pre": state.preDone,
      "modules": App.keysCollected() >= App.keysTotal(),
      "defense": App.defenseDone(),
      "survey-post": state.postDone
    };
    var done = 0;   // survey, any module, any defense answer, final survey
    if (state.preDone) done++;
    if (Object.keys(state.missionDone).length) done++;
    if (Object.keys(state.defense).length) done++;
    if (state.postDone) done++;
    $("#progbar").style.width = Math.round(done / 4 * 100) + "%";
    $$(".nav a").forEach(function (a) { a.classList.toggle("done", !!steps[a.getAttribute("data-sec")]); });
  };

  function buildNav() {
    $("#nav").innerHTML = NAV.map(function (it, i) {
      return '<a href="#" data-sec="' + it[0] + '">' + (i ? '<span class="nav-n">' + i + '</span>' + icon("check", "nav-check") : '') + it[1] + '</a>';
    }).join("");
    $$("#nav a").forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); App.go(a.getAttribute("data-sec")); };
    });
  }

  // any element with data-go navigates to that section
  document.addEventListener("click", function (e) {
    var g = e.target.closest("[data-go]");
    if (g) { e.preventDefault(); App.go(g.getAttribute("data-go")); }
  });

  // Progress lives only in this tab: warn before closing it with unexported answers
  window.addEventListener("beforeunload", function (e) {
    if (App.resetting || !state.started || state.exported) return;
    e.preventDefault(); e.returnValue = "";
  });

  document.addEventListener("DOMContentLoaded", function () {
    App.ensureDesign();
    buildNav();
    App.go("start");
  });
})(window.App);
