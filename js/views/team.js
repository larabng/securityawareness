/* =========================================================================
   Team mission (step 3) – in the app. The mission itself runs on the team
   table (team-mission.html) in the workshop; here every team opens it or
   enters the completion code the table shows at the end. The code carries
   group size, answers, decisions and duration (js/core/team.js).
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, T = App.team, state = App.state, icon = App.icon, $ = App.$;
  var DECISION = ["not safe", "safe", "best call"];

  function sumOf(a) { return a.reduce(function (s, x) { return s + x; }, 0); }

  function resultHTML(tm) {
    var sum = T.summary(tm);
    return '<div class="card tm-result">' +
      '<div class="tm-result-top"><span class="ico-tile">' + icon("users") + '</span><div>' +
        '<div class="eyebrow">Your group\'s result</div><h3>' + sum.score + ' of ' + T.maxScore() + ' points</h3>' +
        '<p class="note">Group of ' + tm.n + ' · ' + (tm.minutes < 1 ? 'under a minute' : tm.minutes + (tm.minutes === 1 ? ' minute' : ' minutes')) + ' · code <span class="mono">' + tm.code + '</span></p></div></div>' +
      '<div class="tm-rounds">' + T.rounds.map(function (r, ri) {
        var rr = tm.rounds[ri];
        return '<div class="tm-round-row"><span class="ico-tile sm">' + icon(r.icon) + '</span>' +
          '<div><b>' + r.kicker + '</b><small>' + sumOf(rr.q) + ' of ' + r.questions.length + ' questions · decision: ' + DECISION[rr.d] + '</small></div>' +
          '<span class="tm-pts">' + T.roundScore(rr) + '/' + T.maxRound(ri) + '</span></div>';
      }).join("") + '</div>' +
    '</div>';
  }

  App.views.team = function () {
    var sec = $("#team");
    if (!state.preDone) { sec.innerHTML = App.preGateHTML(); return; }
    if (App.keysCollected() < App.keysTotal()) {
      sec.innerHTML = App.gateHTML("door-closed", "The company gate is still closed",
        "Collect all " + App.keysTotal() + " keys in the modules – the team mission waits behind the gate.", "Go to the modules", "modules");
      return;
    }
    var tm = state.teamMission;
    var html = '<div class="wrap">' +
      App.pageHead("Step 3 · Team mission", "A live attack hits TalentBridge",
        "Behind the company gate, attackers try three ways in. You stop them in the workshop together with the teams at your table: " +
        C.team.minPlayers + "–" + C.team.maxPlayers + " people, one shared screen – and every person holds only part of the clues.");

    if (tm) {
      html += '<div class="tm-join">' + resultHTML(tm) +
        '<div class="card tm-next"><h3>' + icon("circle-check") + 'Result recorded</h3>' +
          '<p class="note">Your group\'s result is saved and adds ' + T.summary(tm).score * C.team.pointsPerScore + ' points to your team. ' +
          'Next, you guard the inbox as a team of two.</p>' +
          '<button class="btn accent" id="toDefense" data-go="defense">Continue to the defense level ' + icon("arrow-right") + '</button></div>' +
      '</div>';
    } else {
      html += '<div class="tm-join">' +
        '<div class="card tm-card"><div class="tm-card-top"><span class="tm-no">1</span><h3>Open the team table</h3></div>' +
          '<p class="note"><b>Only one laptop per table</b> does this – the other teams stay on this page. The table shows a QR code for every person; ' +
          'each phone then shows that person\'s clue cards.</p>' +
          '<ul class="tm-facts"><li>' + icon("users") + C.team.minPlayers + '–' + C.team.maxPlayers + ' people per table</li>' +
            '<li>' + icon("smartphone") + 'one phone per person</li><li>' + icon("clock") + 'about 15 minutes</li></ul>' +
          '<a class="btn" href="team-mission.html" target="_blank" rel="noopener" id="openTable">' + icon("external-link") + 'Open the team table</a></div>' +
        '<div class="card tm-card"><div class="tm-card-top"><span class="tm-no">2</span><h3>Enter the completion code</h3></div>' +
          '<p class="note">At the end, the table shows a code with ' + T.codeLength() + ' characters. <b>Every team</b> at the table enters it here – that records the result and opens the defense level.</p>' +
          '<form id="tmForm" novalidate><label class="field-label" for="tmCodeIn">Completion code</label>' +
            '<div class="tm-code-row"><input id="tmCodeIn" class="sv-input mono" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="12" placeholder="XXXX-XXXX">' +
            '<button class="btn accent" type="submit" id="tmSubmit">Submit ' + icon("arrow-right") + '</button></div>' +
            '<p class="tm-err" id="tmErr" role="alert" hidden></p></form></div>' +
      '</div>';
    }
    sec.innerHTML = html + '</div>';

    var form = $("#tmForm");
    if (form) form.onsubmit = function (e) {
      e.preventDefault();
      var res = T.decode($("#tmCodeIn").value), err = $("#tmErr");
      if (!res) {
        err.hidden = false;
        err.innerHTML = icon("circle-alert") + "This code isn't valid. Compare it with the code on the team table – it has " + T.codeLength() + " characters.";
        $("#tmCodeIn").focus();
        return;
      }
      res.enteredAt = new Date().toISOString();
      state.teamMission = res;
      App.addPoints(T.summary(res).score * C.team.pointsPerScore);
      App.save();
      App.toast("Team result recorded.", "users");
      App.views.team();
      App.updateProgress();
    };
  };
})(window.App);
