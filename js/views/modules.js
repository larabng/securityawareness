/* =========================================================================
   Module overview – score, keyring, meters and the five module cards
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon, $ = App.$, $$ = App.$$;

  function cardHTML(m) {
    var done = state.missionDone[m.id], unlocked = App.isUnlocked(m), diff = m.difficulty || "medium";
    var status = done ? '<span class="tag ok">' + icon("circle-check") + 'Completed</span>'
      : unlocked ? '<span class="tag info">' + icon("play") + 'Playable</span>'
      : '<span class="tag muted">' + icon("lock") + (m.available ? 'Needs ' + m.requiresKeys + ' keys' : 'Test phase: locked') + '</span>';
    return '<article class="mod-card acc-' + m.number + (done ? " done" : "") + (unlocked ? "" : " locked") + '">' +
      '<div class="mod-top"><span class="ico-tile">' + icon(m.icon) + '</span>' +
        '<span class="mod-no">Module 0' + m.number + '</span><span class="tag diff ' + diff + '">' + App.DIFF_LABEL[diff] + '</span></div>' +
      '<h3>' + m.title + '</h3>' +
      '<p class="note">' + m.why + '</p>' +
      '<div class="mod-meta">' + status +
        '<span class="tag key">' + icon("key-round") + m.key.name + '</span>' +
        (done ? '<span class="tag award">' + icon(m.badge.icon) + m.badge.name + '</span>' : '') +
      '</div>' +
      (unlocked ? '<button class="btn sm ' + (done ? "glass" : "accent") + '" data-mod="' + m.id + '">' + (done ? "View again" : "Start module") + ' ' + icon("arrow-right") + '</button>' : '') +
    '</article>';
  }

  // sixth tile: the company gate all keys lead to
  function gateCardHTML() {
    var got = App.keysCollected(), all = App.keysTotal(), open = got >= all;
    return '<article class="mod-card gate-card">' +
      '<div class="mod-top"><span class="ico-tile gold">' + icon(open ? "door-open" : "door-closed") + '</span>' +
        '<span class="mod-no">Company gate</span><span class="tag key">' + got + ' / ' + all + ' keys</span></div>' +
      '<h3>' + (open ? "The gate is open" : "Collect all " + all + " keys") + '</h3>' +
      '<p class="note">' + (open
        ? "You have seen through every weakness. Behind the gate a live attack is waiting – you stop it together in the team mission."
        : "Every module gives you one key. With all of them the company gate opens – behind it waits the team mission.") + '</p>' +
      App.keyringHTML(true) +
    '</article>';
  }

  App.views.modules = function () {
    var sec = $("#modules");
    if (!state.preDone) { sec.innerHTML = App.preGateHTML(); return; }
    sec.innerHTML = '<div class="wrap">' +
      App.pageHead("Step 2 · Modules", "Five weaknesses in recruiting",
        "All five modules are playable – module 5 opens once you hold 4 keys. Each module: expert video → hacker mission → reveal, and earns you a key, a badge and points.") +
      '<div class="hud">' + App.statsHTML() + '<div class="card">' + App.metersHTML() + '</div></div>' +
      App.keyringHTML() +
      '<div class="mod-grid">' + C.modules.map(cardHTML).join("") + gateCardHTML() + '</div>' +
      '<div class="page-foot"><button class="btn accent" id="toTeam" data-go="team">Continue to the team mission ' + icon("arrow-right") + '</button></div>' +
      '</div>';
    $$("[data-mod]", sec).forEach(function (b) { b.onclick = function () { App.go("module-detail", b.getAttribute("data-mod")); }; });
  };
})(window.App);
