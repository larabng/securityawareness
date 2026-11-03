/* =========================================================================
   Start page – hero, team choice, how it works
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon, $ = App.$;

  var STEPS = [
    ["clipboard-list", "Pre-survey", "Your starting point – no solutions are shown."],
    ["terminal", "Modules", "Expert video, hacker mission and reveal – each earns a key, a badge and points."],
    ["building-2", "Company gate", "One key per module – together they open the gate."],
    ["shield-check", "Defense level", "The roles flip: spot the attacks in an inbox and build a streak."],
    ["clipboard-check", "Final survey", "New situations, the same questions – then your evaluation."]
  ];
  var PRINCIPLES = [
    ["eye", "The mechanism, not the instructions", "No real tools, templates or attack guides – only recognising and stopping attacks."],
    ["building-2", "Fictional company", "TalentBridge Ltd and all people and data in it are made up."],
    ["lock", "Anonymous", "No names are stored. Answers are exported only for the project evaluation."]
  ];

  App.views.start = function () {
    var sec = $("#start");
    var teams = C.config.teams.map(function (t) {
      return '<option' + (t === state.team ? " selected" : "") + '>' + App.esc(t) + '</option>';
    }).join("");
    sec.innerHTML =
      '<div class="hero dark"><div class="wrap hero-grid">' +
        '<div class="hero-copy">' +
          '<span class="pill">' + icon("sparkles") + 'Cybersecurity awareness · ' + C.config.season + '</span>' +
          '<h1>Inside the Mind<br>of a <span class="grad">Hacker</span></h1>' +
          '<p class="lead">' + C.config.subtitle + '. For a moment you step into the role of an attacker – not to attack, ' +
            'but to <b>see through</b> attacks and then fend them off as an employee.</p>' +
          '<blockquote class="quote">“Whoever thinks like an attacker makes safer decisions every day.”</blockquote>' +
          '<div class="chips">' + C.modules.map(function (m) {
            return '<span class="chip">' + icon(m.icon) + m.title + '</span>';
          }).join("") + '</div>' +
        '</div>' +
        '<div class="card start-card">' +
          '<div class="eyebrow">' + C.config.company + '</div>' +
          '<h3>Start your run</h3>' +
          '<p class="note">You play in a team of two. Only the top three teams are shown publicly at the end.</p>' +
          '<label class="field-label" for="teamSel">Your team</label>' +
          '<select id="teamSel" class="select">' + teams + '</select>' +
          '<button class="btn accent block" id="goStart">Start training ' + icon("arrow-right") + '</button>' +
          '<p class="note small">' + icon("info") + 'The pre-survey comes first – the modules open afterwards.</p>' +
        '</div>' +
      '</div></div>' +
      '<div class="wrap">' +
        '<header class="page-head center"><div class="eyebrow">How it works</div><h2>From attacker to defender in five steps</h2></header>' +
        '<ol class="timeline">' + STEPS.map(function (s, i) {
          return '<li><div class="tl-top"><span class="ico-tile">' + icon(s[0]) + '</span><span class="tl-n">0' + (i + 1) + '</span></div>' +
            '<h3>' + s[1] + '</h3><p>' + s[2] + '</p></li>';
        }).join("") + '</ol>' +
        '<div class="principles">' + PRINCIPLES.map(function (p) {
          return '<div class="principle"><span class="ico-tile sm">' + icon(p[0]) + '</span><div><b>' + p[1] + '</b><p>' + p[2] + '</p></div></div>';
        }).join("") + '</div>' +
      '</div>';

    $("#goStart").onclick = function () {
      state.team = $("#teamSel").value; state.started = true;
      if (!state.runId) { state.runId = Math.random().toString(36).slice(2, 8).toUpperCase(); state.startedAt = new Date().toISOString(); }
      App.save();
      App.toast("Good luck, " + state.team + "!", "sparkles");
      App.go("survey-pre");
    };
  };
})(window.App);
