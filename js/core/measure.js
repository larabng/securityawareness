/* =========================================================================
   Survey model – which items a run sees, and how answers are scored.
   -------------------------------------------------------------------------
   { use } pulls in an item asked identically before and after,
   { scenarios } expands to this run's parallel form (A or B).
   Answers live in state.pre / state.post (+ preConf / postConf for
   "How sure are you?"), keyed by item id. See README → Measuring the effect.
   ========================================================================= */
(function (App) {
  "use strict";
  var S = window.CONTENT.surveys, state = App.state;

  // Decided once per run, at random: which scenario form comes first, and whether the anchor is shown
  App.ensureDesign = function () {
    if (state.formOrder) return;
    state.formOrder = Math.random() < .5 ? "AB" : "BA";
    state.anchor = Math.random() < .5;
    App.save();
  };
  function formOf(which) { App.ensureDesign(); return state.formOrder.charAt(which === "pre" ? 0 : 1); }

  // all = true also returns items hidden for this run (so every export has the same columns)
  App.surveyItems = function (which, all) {
    var form = formOf(which), out = [];
    S[which].forEach(function (ref) {
      if (ref.scenarios) {
        S.scenarios.forEach(function (s) {
          var v = s[form];
          out.push({ id: "sc_" + s.slot, section: ref.section, type: "scenario", conf: true,
                     attack: s.attack, text: v.text, best: v.best, accept: v.accept || [] });
        });
      } else if (ref.use) {
        out.push(Object.assign({ id: ref.use }, S.repeated[ref.use], { section: ref.section }));
      } else if (all || !(ref.onlyIf === "anchor" && !state.anchor)) {
        out.push(ref);
      }
    });
    return out;
  };

  App.isAnswered = function (q, v) {
    if (q.required === false) return true;
    switch (q.type) {
      case "text": case "textarea": return !!(v && v.length);
      case "single": case "slider": case "scenario": return v != null;
      case "multi": return !!(v && v.length);
      case "number": return !!(v && isFinite(v.usd));
      case "matrix": return !!v && q.rows.every(function (r, i) { return v[i] != null; });
      case "dual": return !!v && q.rows.every(function (r, i) { return v[i] && v[i].a != null && v[i].b != null; });
    }
    return true;
  };

  // scored like the defense level: best action 2, defensible 1, unsafe 0
  App.quality = function (q, a) { return a == null ? null : (a === q.best ? 2 : (q.accept.indexOf(a) > -1 ? 1 : 0)); };
  // multi-choice score = number of options classified correctly (ticked if a sign, left empty if not)
  App.multiScore = function (q, sel) {
    return q.options.filter(function (o, i) { return (sel.indexOf(i) > -1) === (q.correct.indexOf(i) > -1); }).length;
  };
  App.matrixMean = function (v, q) {
    if (!v || !q.rows.every(function (r, i) { return v[i] != null; })) return null;
    return q.rows.reduce(function (a, r, i) { return a + v[i] + 1; }, 0) / q.rows.length;
  };
  App.rowKey = function (q, i) { return q.keys ? q.keys[i] : "r" + (i + 1); };

  // Summary measures for the before/after comparison
  App.surveyStats = function (which) {
    var store = state[which], conf = state[which + "Conf"];
    var sc = App.surveyItems(which).filter(function (q) { return q.type === "scenario" && store[q.id] != null; });
    if (!sc.length) return null;
    var s = { score: 0, attack: 0, harmless: 0, best: 0, conf: 0, prob: 0 };
    sc.forEach(function (q) {
      var ql = App.quality(q, store[q.id]), c = conf[q.id] || 0;
      s.score += ql;
      if (q.attack) s.attack += ql; else if (ql === 2) s.harmless++;
      if (ql === 2) s.best++;
      s.conf += c + 1;
      s.prob += .25 + c * .1875;   // "Guessed" = 25 % (1 of 4 actions) … "Very sure" = 100 %
    });
    s.accuracy = s.best / sc.length;
    s.conf = s.conf / sc.length;
    s.calibration = s.prob / sc.length - s.accuracy;   // > 0 = more confident than correct
    s.k1 = store.k1 ? App.multiScore(S.repeated.k1, store.k1) : null;
    s.prep = App.matrixMean(store.prep, S.repeated.prep);
    return s;
  };
})(window.App);
