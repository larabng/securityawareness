/* =========================================================================
   Run state – kept in this browser on this device (localStorage "imoah"),
   so a run survives closing the tab between the modules and the workshop.
   It stays until "Reset" on the result page or "Start a new run" on the
   start page. Evaluation runs via the CSV export (js/export.js).
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT;

  App.APP_VERSION = "2026-11-05";
  App.DIFF_POINTS = { easy: 30, medium: 50, hard: 80 };
  App.DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };
  App.ACTION_LABEL = { process: "Process", verify: "Verify (2nd channel)", report: "Report", reject: "Reject" };
  App.ACTION_ICON = { process: "check", verify: "phone", report: "flag", reject: "ban" };

  // Mails tied to a module only show up once that module is available
  App.INBOX = C.inbox.filter(function (mail) {
    return !mail.module || C.modules.some(function (m) { return m.id === mail.module && m.available; });
  });

  var state = App.state = {
    started: false,
    runId: null, startedAt: null, exported: false,
    preDone: false, postDone: false,
    formOrder: null,   // "AB" or "BA": scenario form before / after (random per run)
    anchor: null,      // true = sees the anchoring question (random per run)
    team: null,
    pre: {}, preConf: {},
    post: {}, postConf: {},
    missionDone: {},   // moduleId -> true
    missionPicks: {},  // moduleId -> risk of the chosen option per step (first run)
    keys: {},          // moduleId -> true (collected key)
    hints: {},         // moduleId -> number of hints used
    points: 0,
    streak: 0, maxStreak: 0,
    loot: 0, damage: 0,
    defense: {},       // mailId -> {action, correct, acceptable}
    defenseScore: 0,
    teamMission: null  // decoded completion code of the workshop table (js/core/team.js)
  };
  try { var saved = localStorage.getItem("imoah"); if (saved) Object.assign(state, JSON.parse(saved)); } catch (e) {}

  App.save = function () { try { localStorage.setItem("imoah", JSON.stringify(state)); } catch (e) {} };
  App.addPoints = function (n) { state.points = Math.max(0, state.points + n); };

  // One key per module; the company gate opens once every key is collected
  App.keysTotal = function () { return C.modules.length; };
  App.keysCollected = function () { return C.modules.filter(function (m) { return state.keys[m.id]; }).length; };
  App.isUnlocked = function (m) {
    if (!m.available) return false;
    if (m.requiresKeys && App.keysCollected() < m.requiresKeys) return false;
    return true;
  };
  App.teamDone = function () { return !!state.teamMission; };
  // where a saved run continues: the first step that is not finished yet
  App.nextStep = function () {
    if (!state.preDone) return "survey-pre";
    if (App.keysCollected() < App.keysTotal()) return "modules";
    if (!App.teamDone()) return "team";
    if (!App.defenseDone()) return "defense";
    if (!state.postDone) return "survey-post";
    return "result";
  };
  App.defenseDone = function () { return App.INBOX.every(function (m) { return state.defense[m.id]; }); };

  App.resetting = false;
  App.reset = function () {
    App.resetting = true;
    try { localStorage.removeItem("imoah"); } catch (e) {}
    location.reload();
  };
})(window.App);
