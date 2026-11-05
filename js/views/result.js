/* =========================================================================
   Evaluation – company gate, personal stats, badges, team leaderboard,
   facilitator export
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon, $ = App.$, INBOX = App.INBOX;

  function teamHTML() {
    var tm = state.teamMission;
    if (!tm) return '';
    var T = App.team, sum = T.summary(tm);
    return '<section class="card team-res"><h3>' + icon("users") + 'Team mission</h3>' +
      '<p class="note">In a group of ' + tm.n + ' you scored <b>' + sum.score + ' of ' + T.maxScore() + '</b> points – by combining clues nobody had alone.</p>' +
      '<div class="team-res-rounds">' + T.rounds.map(function (r, ri) {
        return '<span class="tag info">' + icon(r.icon) + r.kicker + ' ' + T.roundScore(tm.rounds[ri]) + '/' + T.maxRound(ri) + '</span>';
      }).join("") + '</div></section>';
  }

  App.views.result = function () {
    var sec = $("#result");
    var defSafe = Object.keys(state.defense).filter(function (k) { return state.defense[k].correct || state.defense[k].acceptable; }).length;
    var defPct = Math.round(defSafe / INBOX.length * 100);
    var totalKeys = App.keysTotal(), keysGot = App.keysCollected(), gateOpen = keysGot >= totalKeys;

    // Team leaderboard: own team uses real points, others are demo values
    var rows = C.config.teams.map(function (t) {
      var base = t === state.team ? state.points : (90 + (App.hash(t) % 140));
      return { team: t, score: base, me: t === state.team };
    }).sort(function (a, b) { return b.score - a.score; });
    var maxScore = Math.max.apply(null, rows.map(function (r) { return r.score; })) || 1;
    var top = rows.slice(0, C.config.topTeamsVisible);

    var badges = C.modules.map(function (m) {
      var got = state.missionDone[m.id];
      return '<div class="badge-tile' + (got ? " got" : "") + '"><span class="ico-tile' + (got ? " gold" : "") + '">' + icon(got ? m.badge.icon : "lock") + '</span>' +
        '<div><b>' + m.badge.name + '</b><small>' + (got ? "Module " + m.number + " completed" : "Not earned yet") + '</small></div></div>';
    }).join("");

    sec.innerHTML =
      '<div class="result-hero dark"><div class="wrap">' +
        '<div class="eyebrow">Evaluation · Season ' + C.config.season + '</div>' +
        '<h1>Well done, ' + (state.team || "") + '!</h1>' +
        '<p class="lead">Only you see your personal result. Only the top ' + C.config.topTeamsVisible + ' teams are shown publicly.</p>' +
        '<div class="result-grid">' +
          '<div class="company-gate ' + (gateOpen ? "open" : "closed") + '">' +
            '<div class="cg-doors"><div class="cg-door l"></div><div class="cg-door r"></div><span class="cg-icon">' + icon(gateOpen ? "door-open" : "door-closed") + '</span></div>' +
            '<div class="cg-text"><h3>' + (gateOpen ? "Company gate unlocked" : "Company gate still closed") + '</h3>' +
              '<p class="note">You collected <b>' + keysGot + ' / ' + totalKeys + '</b> keys. ' + (gateOpen ? "With every key, you have seen through every weakness." : "Collect a key from every module to open the gate.") + '</p>' +
              App.keyringHTML(true) +
            '</div>' +
          '</div>' +
          '<div class="stats">' +
            App.statTile("star", state.points, "total points", "gold") +
            App.statTile("shield-check", defPct + "%", "messages handled safely", "green") +
            App.statTile("flame", state.maxStreak, "best streak", "red") +
          '</div>' +
        '</div>' +
      '</div></div>' +
      '<div class="wrap">' +
        '<section class="card"><h3>' + icon("award") + 'Your badges</h3><div class="badge-grid">' + badges + '</div></section>' +
        teamHTML() +
        '<div class="result-cols">' +
        '<section class="card"><h3>' + icon("trophy") + 'Top teams</h3><div class="lb">' +
          top.map(function (r, i) {
            return '<div class="lb-row top' + (i + 1) + (r.me ? " me" : "") + '">' +
              '<div class="lb-rank">' + (i + 1) + '</div><div class="lb-name">' + r.team + (r.me ? ' <span class="tag info">you</span>' : '') + '</div>' +
              '<div class="lb-score">' + r.score + '</div>' +
              '<div class="lb-bar"><div style="width:' + Math.round(r.score / maxScore * 100) + '%"></div></div></div>';
          }).join("") +
          '</div>' +
          '<p class="note">' + (top.some(function (r) { return r.me; }) ? 'Strong – your team is in the top ' + C.config.topTeamsVisible + '!' : 'Your rank stays private. Only the top ' + C.config.topTeamsVisible + ' are shown.') +
          ' Prototype: the scores of the other teams are demo values.</p>' +
        '</section>' +
        '<section class="card"><h3>' + icon("shield-check") + 'The damage you prevented</h3>' +
          '<p class="note">In the defense level you handled ' + defSafe + ' of ' + INBOX.length + ' messages safely – ' + state.defenseScore + ' of them with the best action. In reality, every safe decision prevents possible damage – from data loss to business disruption.</p>' +
          '<div class="meter"><div class="meter-track"><div class="meter-fill safe" style="width:' + defPct + '%"></div></div></div></section>' +
        '</div>' +
        '<section class="card facilitator"><h3>' + icon("clipboard-list") + 'For the test facilitator</h3>' +
          '<p class="note">All answers (pre/post incl. self-assessment, missions, team mission, defense, feedback, points) can be exported anonymised. Run ID: <b class="mono">' + (state.runId || "–") + '</b></p>' +
          '<p class="export-warn' + (state.exported ? " done" : "") + '" id="expWarn">' + (state.exported ? icon("circle-check") + "Results exported." : icon("triangle-alert") + "Answers are only kept in this browser on this device – export them before resetting.") + '</p>' +
          '<div class="btn-row"><button class="btn sm" id="expBtn">' + icon("download") + 'Export results as CSV</button>' +
          '<button class="btn sm subtle" id="resetBtn">' + icon("rotate-ccw") + 'Reset for new season</button></div>' +
        '</section>' +
      '</div>';

    $("#expBtn").onclick = function () {
      App.exportCSV();
      var w = $("#expWarn"); w.className = "export-warn done"; w.innerHTML = icon("circle-check") + "Results exported.";
      App.toast("CSV exported.", "download");
    };
    $("#resetBtn").onclick = function () {
      if (!confirm("Reset all progress on this device for a new season run?" + (state.exported ? "" : "\n\nThe results have NOT been exported yet."))) return;
      App.reset();
    };
  };
})(window.App);
