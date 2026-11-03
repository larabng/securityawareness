/* =========================================================================
   Shared gamification widgets: stat tiles, keyring, loot/damage meters,
   gates. Used by the module overview, the reveal and the result page.
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon;

  App.statTile = function (ic, value, label, cls) {
    return '<div class="stat' + (cls ? " " + cls : "") + '"><span class="stat-ic">' + icon(ic) + '</span>' +
      '<span class="stat-val">' + value + '</span><span class="stat-label">' + label + '</span></div>';
  };

  App.statsHTML = function () {
    return '<div class="stats">' +
      App.statTile("star", state.points, "points", "gold") +
      App.statTile("key-round", App.keysCollected() + '<small>/' + App.keysTotal() + '</small>', "keys", "orange") +
      App.statTile("flame", state.maxStreak, "best streak", "red") +
    '</div>';
  };

  App.keyringHTML = function (mini) {
    var slots = C.modules.map(function (m) {
      var got = !!state.keys[m.id];
      var locked = !App.isUnlocked(m) && !got;
      return '<div class="keyslot' + (got ? " got" : "") + (locked ? " locked" : "") + '" title="Module ' + m.number + ': ' + m.key.name + '">' +
        '<span class="kic">' + icon(got ? "key-round" : (locked ? "lock" : "lock-open")) + '</span>' +
        (mini ? '' : '<span class="klabel">' + m.key.name + '</span>') + '</div>';
    }).join("");
    if (mini) return '<div class="kr-slots mini">' + slots + '</div>';
    return '<div class="keyring"><div class="kr-head">' + icon("key-round") + ' Your keyring <span>one key per module – collect all ' +
      App.keysTotal() + ' to open the company gate</span></div><div class="kr-slots">' + slots + '</div></div>';
  };

  // Loot value / company damage (fictional, order of magnitude only)
  App.metersHTML = function () {
    var loot = Math.min(100, state.loot), dmg = Math.min(100, state.damage);
    function meter(ic, label, pct, cls) {
      return '<div class="meter"><div class="meter-top"><span>' + icon(ic) + label + '</span><b>' + Math.round(pct) + '%</b></div>' +
        '<div class="meter-track"><div class="meter-fill ' + cls + '" style="width:' + pct + '%"></div></div></div>';
    }
    return '<div class="meters">' +
      meter("coins", "Loot value (CyberCoins)", loot, "loot") +
      meter("building-2", "Company damage (fictional CHF)", dmg, "damage") +
      '<p class="note">The values are fictional and only illustrate the order of magnitude – not real market prices.</p></div>';
  };

  App.gateHTML = function (ic, title, text, btnLabel, goId) {
    return '<div class="wrap"><div class="gate card"><span class="gate-ic">' + icon(ic) + '</span><h2>' + title + '</h2>' +
      '<p class="lead">' + text + '</p>' +
      (btnLabel ? '<button class="btn" data-go="' + goId + '">' + btnLabel + ' ' + icon("arrow-right") + '</button>' : '') +
      '</div></div>';
  };
  App.preGateHTML = function () {
    return App.gateHTML("lock", "The pre-survey comes first",
      "The training opens after the pre-survey – that way we can measure what it changes.", "Go to the survey", "survey-pre");
  };

  App.pageHead = function (eyebrow, title, lead) {
    return '<header class="page-head"><div class="eyebrow">' + eyebrow + '</div><h2>' + title + '</h2>' +
      (lead ? '<p class="lead">' + lead + '</p>' : '') + '</header>';
  };
})(window.App);
