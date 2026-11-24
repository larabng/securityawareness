/* =========================================================================
   Demo mode – for presentations and testing, not for participants.
   Open the app with ?demo, e.g. https://larabng.github.io/securityawareness/?demo
   A toolbar fills the steps up to a chosen point with sample answers, so
   you can jump straight to any part of the training.
   Such a run stays marked as a demo (export: demo_run = 1);
   tools/merge_results.py leaves demo runs out of the merged table.
   Without ?demo in the address the toolbar is hidden, even for a demo run.
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon, $ = App.$, $$ = App.$$;
  var SHOW = /[?&]demo\b/.test(location.search) || /#demo\b/.test(location.hash);
  if (SHOW) { state.demo = true; App.save(); }

  function ensureStarted() {
    if (!state.team) state.team = C.config.teams[0];
    if (!state.runId) { state.runId = Math.random().toString(36).slice(2, 8).toUpperCase(); state.startedAt = new Date().toISOString(); }
    state.started = true;
  }
  function mid(n) { return Math.floor((n - 1) / 2); }

  // Sample answers for every open item. Before: mixed choices; after: the best ones.
  function fillSurvey(which) {
    var store = state[which], conf = state[which + "Conf"], after = which === "post";
    App.surveyItems(which).forEach(function (q, i) {
      var v = store[q.id];
      if (v != null && App.isAnswered(q, v) && (!q.conf || conf[q.id] != null)) return;
      switch (q.type) {
        case "text": case "textarea": store[q.id] = "Demo"; break;
        case "single": store[q.id] = mid(q.options.length); break;
        case "multi": store[q.id] = [0]; break;
        case "slider": store[q.id] = Math.round((q.min + q.max) / 2); break;
        case "number": store[q.id] = { amount: 100, unit: "million", usd: 1e8 }; break;
        case "matrix":
          store[q.id] = {}; q.rows.forEach(function (r, ri) { store[q.id][ri] = mid(q.scale.length); }); break;
        case "dual":
          store[q.id] = {}; q.rows.forEach(function (r, ri) { store[q.id][ri] = { a: mid(q.cols[0].scale.length), b: mid(q.cols[1].scale.length) }; }); break;
        case "scenario": store[q.id] = after || i % 2 ? q.best : "process"; break;
      }
      if (q.conf) conf[q.id] = after ? 3 : 2;
    });
  }

  // Each step completes everything before it as well ("fill up to here")
  var STEPS = [
    { label: "Pre-survey", done: function () { return state.preDone; }, go: "modules",
      run: function () { ensureStarted(); App.ensureDesign(); fillSurvey("pre"); state.preDone = true; } },
    { label: "All five modules", done: function () { return App.keysCollected() >= App.keysTotal(); }, go: "modules",
      run: function () {
        C.modules.forEach(function (m) {
          state.keys[m.id] = true;
          if (state.missionDone[m.id]) return;
          state.missionDone[m.id] = true;
          state.missionPicks[m.id] = m.mission.steps.map(function () { return 3; });
          App.addPoints(App.DIFF_POINTS[m.difficulty || "medium"]);
          var gain = 12 + m.lootLevel * 4;
          state.loot = Math.min(100, state.loot + gain);
          state.damage = Math.min(100, state.damage + Math.round(gain * 1.3));
        });
      } },
    { label: "Team mission result", done: function () { return App.teamDone(); }, go: "team",
      run: function () {
        var T = App.team;
        var res = T.decode(T.encode({ n: 3, minutes: 14, rounds: T.rounds.map(function (r, ri) {
          return { q: r.questions.map(function (x, qi) { return ri === 0 && qi === 0 ? 0 : 1; }), d: 2 };
        }) }));
        res.enteredAt = new Date().toISOString();
        state.teamMission = res;
        App.addPoints(T.summary(res).score * C.team.pointsPerScore);
      } },
    { label: "Defense level", done: function () { return App.defenseDone(); }, go: "defense",
      run: function () {
        App.INBOX.forEach(function (mail) {
          if (state.defense[mail.id]) return;
          state.defense[mail.id] = { action: mail.action, correct: true, acceptable: false };
          state.streak++; state.maxStreak = Math.max(state.maxStreak, state.streak);
          App.addPoints(15 + (state.streak >= 3 ? 10 : 0));
        });
        state.defenseScore = Object.keys(state.defense).filter(function (k) { return state.defense[k].correct; }).length;
      } },
    { label: "Final survey", done: function () { return state.postDone; }, go: "result",
      run: function () { fillSurvey("post"); state.postDone = true; } }
  ];

  function fillUpTo(n) {
    for (var i = 0; i <= n; i++) if (!STEPS[i].done()) STEPS[i].run();
    App.save();
    App.go(STEPS[n].go);
    $("#demoBar").classList.add("min");   // fold away so the toolbar doesn't cover the page you jumped to
    draw();
    App.toast("Demo: filled up to “" + STEPS[n].label + "”.", "zap");
  }

  function draw() {
    var bar = $("#demoBar"); if (!bar) return;
    bar.innerHTML =
      '<button class="demo-head" id="demoToggle" aria-expanded="' + !bar.classList.contains("min") + '">' + icon("zap") + 'Demo mode</button>' +
      '<div class="demo-body"><p>Fill up to …</p>' +
        STEPS.map(function (s, i) {
          var d = s.done();
          return '<button class="demo-step' + (d ? " done" : "") + '" data-demo="' + i + '"' + (d ? " disabled" : "") + '>' +
            icon(d ? "circle-check" : "arrow-right") + s.label + '</button>';
        }).join("") +
        '<div class="demo-row"><button class="demo-link" data-demo-go="result"' + (state.postDone ? "" : " disabled") + '>Evaluation</button>' +
        '<button class="demo-link" id="demoReset">' + icon("rotate-ccw") + 'New run</button></div>' +
        '<small>Marked as demo in the export · hide: open the app without ?demo</small>' +
      '</div>';
    $("#demoToggle").onclick = function () { bar.classList.toggle("min"); draw(); };
    $$("[data-demo]", bar).forEach(function (b) { b.onclick = function () { fillUpTo(+b.getAttribute("data-demo")); }; });
    $$("[data-demo-go]", bar).forEach(function (b) { b.onclick = function () { App.go(b.getAttribute("data-demo-go")); }; });
    $("#demoReset").onclick = function () { if (confirm("Delete this demo run and start fresh?")) App.reset(); };
  }

  App.demoActive = SHOW;
  if (SHOW) document.addEventListener("DOMContentLoaded", function () {
    var bar = document.createElement("aside");
    bar.id = "demoBar"; bar.className = "demo-bar"; bar.setAttribute("aria-label", "Demo mode");
    document.body.appendChild(bar);
    draw();
    // keep the ticks current while you click through the app normally
    document.addEventListener("click", function () { setTimeout(draw, 60); });
  });
})(window.App);
