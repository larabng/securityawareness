/* =========================================================================
   CSV export for the test facilitator – one file per run (field,value).
   tools/merge_results.py merges the files into one table.
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state;

  // Every single survey answer (prefix pre_ / post_; codebook = content/surveys.js)
  function surveyRows(which) {
    var out = [], store = state[which], conf = state[which + "Conf"];
    App.surveyItems(which, true).forEach(function (q) {
      var v = store[q.id], k = which + "_" + q.id;
      switch (q.type) {
        case "text": case "textarea": out.push([k, v || ""]); break;
        case "slider": out.push([k, v != null ? v : ""]); break;
        case "single":
          out.push([k, v != null ? q.options[v] : ""]);
          if (q.correct != null) out.push([k + "_correct", v === q.correct ? "1" : "0"]);
          break;
        case "multi":
          var sel = v || [];
          out.push([k, sel.map(function (i) { return q.options[i]; }).join("; ")]);
          q.options.forEach(function (o, i) { out.push([k + "_opt" + (i + 1), sel.indexOf(i) > -1 ? "1" : "0"]); });
          if (q.correct) out.push([k + "_score", v ? App.multiScore(q, sel) : ""]);
          break;
        case "number":
          out.push([k + "_usd", v ? v.usd : ""]);
          out.push([k + "_input", v ? v.amount + " " + v.unit : ""]);
          break;
        case "matrix":
          q.rows.forEach(function (r, i) { out.push([k + "_" + App.rowKey(q, i), v && v[i] != null ? v[i] + 1 : ""]); });
          break;
        case "dual":
          q.rows.forEach(function (r, i) {
            var a = v && v[i] && v[i].a != null ? v[i].a + 1 : "", b = v && v[i] && v[i].b != null ? v[i].b + 1 : "";
            out.push([k + "_" + App.rowKey(q, i) + "_a", a]);
            out.push([k + "_" + App.rowKey(q, i) + "_b", b]);
          });
          break;
        case "scenario":
          out.push([k, v || ""]);
          out.push([k + "_quality", v != null ? App.quality(q, v) : ""]);
          break;
      }
      if (q.conf) out.push([k + "_conf", conf[q.id] != null ? conf[q.id] + 1 : ""]);
    });
    return out;
  }

  // Summary columns: <measure>_pre / _post / _delta (README → Measuring the effect)
  function compareRows() {
    var a = App.surveyStats("pre"), b = App.surveyStats("post"), out = [];
    function num(x) { return x == null ? "" : Math.round(x * 100) / 100; }
    var names = { score: "score", attack: "attack_score", harmless: "harmless_ok", accuracy: "accuracy",
                  conf: "conf_mean", calibration: "calibration", k1: "signs_score", prep: "prep_mean" };
    Object.keys(names).forEach(function (k) {
      var x = a ? a[k] : null, y = b ? b[k] : null;
      out.push([names[k] + "_pre", num(x)]);
      out.push([names[k] + "_post", num(y)]);
      out.push([names[k] + "_delta", x != null && y != null ? num(y - x) : ""]);
    });
    // per-row change of the repeated rating items
    ["prep", "att"].forEach(function (id) {
      var q = C.surveys.repeated[id], x = state.pre[id], y = state.post[id];
      q.rows.forEach(function (r, i) { out.push(["delta_" + id + "_" + App.rowKey(q, i), x && y && x[i] != null && y[i] != null ? y[i] - x[i] : ""]); });
    });
    out.push(["delta_target", state.pre.target != null && state.post.target != null ? state.post.target - state.pre.target : ""]);
    return out;
  }

  App.exportCSV = function () {
    var now = new Date();
    var rows = [["field", "value"]];
    rows.push(["run_id", state.runId || ""]);
    rows.push(["app_version", App.APP_VERSION]);
    rows.push(["started_at", state.startedAt || ""]);
    rows.push(["exported_at", now.toISOString()]);
    rows.push(["duration_min", state.startedAt ? Math.round((now - new Date(state.startedAt)) / 60000) : ""]);
    rows.push(["team", state.team || ""]);
    rows.push(["season", C.config.season]);
    rows.push(["points", state.points]);
    rows.push(["max_streak", state.maxStreak]);
    rows.push(["keys_collected", App.keysCollected() + "/" + App.keysTotal()]);
    rows.push(["modules_done", Object.keys(state.missionDone).length]);
    rows.push(["pre_done", state.preDone ? "1" : "0"]);
    rows.push(["post_done", state.postDone ? "1" : "0"]);
    rows.push(["form_order", state.formOrder || ""]);
    rows.push(["anchor_group", state.anchor == null ? "" : (state.anchor ? "anchor" : "none")]);
    compareRows().forEach(function (r) { rows.push(r); });
    surveyRows("pre").forEach(function (r) { rows.push(r); });
    surveyRows("post").forEach(function (r) { rows.push(r); });
    C.modules.forEach(function (m) {
      rows.push(["mod_done_" + m.id, state.missionDone[m.id] ? "1" : "0"]);
      rows.push(["mod_key_" + m.id, state.keys[m.id] ? "1" : "0"]);
      rows.push(["mod_hints_" + m.id, state.hints[m.id] || 0]);
      // per step: risk of the chosen option (3 = strongest building block recognised)
      var mp = (state.missionPicks || {})[m.id] || [];
      m.mission.steps.forEach(function (s, i) {
        rows.push(["mod_step" + (i + 1) + "_risk_" + m.id, mp[i] != null ? mp[i] : ""]);
        rows.push(["mod_step" + (i + 1) + "_correct_" + m.id, mp[i] === 3 ? "1" : (mp[i] != null ? "0" : "")]);
      });
      if (m.mission.steps.length) rows.push(["mod_score_" + m.id, mp.length ? mp.filter(function (r) { return r === 3; }).length + "/" + m.mission.steps.length : ""]);
    });
    App.INBOX.forEach(function (m) {
      var a = state.defense[m.id];
      rows.push(["def_" + m.id, a ? a.action : ""]);
      rows.push(["def_correct_" + m.id, a && a.correct ? "1" : "0"]);
      rows.push(["def_quality_" + m.id, a ? (a.correct ? 2 : (a.acceptable ? 1 : 0)) : ""]);
    });
    var csv = rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(","); }).join("\n");
    var blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "imoah_" + (state.runId || "run") + "_" + (state.team || "team").replace(/\s+/g, "_") + ".csv";
    a.click();
    state.exported = true; App.save();
  };
})(window.App);
