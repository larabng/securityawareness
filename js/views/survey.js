/* =========================================================================
   Surveys – pre and post share one renderer (items: js/core/measure.js).
   Submitted surveys are locked so the before/after comparison stays clean.
   ========================================================================= */
(function (App) {
  "use strict";
  var S = window.CONTENT.surveys, state = App.state, icon = App.icon, esc = App.esc, $ = App.$, $$ = App.$$;
  var UNITS = { thousand: 1e3, million: 1e6, billion: 1e9 };

  function optionHTML(type, name, value, label, on, ic) {
    return '<label class="q-opt' + (on ? " sel" : "") + '"><input type="' + type + '" name="' + name + '" value="' + value + '"' + (on ? " checked" : "") + '>' +
      (ic ? icon(ic) : '') + '<span>' + label + '</span></label>';
  }

  function fieldHTML(q, v) {
    var h = "";
    switch (q.type) {
      case "text":
        return '<input class="sv-input" type="text" data-k="' + q.id + '" value="' + esc(v || "") + '" autocomplete="off">';
      case "textarea":
        return '<textarea class="sv-input" rows="3" data-k="' + q.id + '">' + esc(v || "") + '</textarea>';
      case "single":
      case "multi":
        var multi = q.type === "multi";
        h = '<div class="q-opts' + (multi ? " multi" : "") + '">';
        q.options.forEach(function (o, i) {
          h += optionHTML(multi ? "checkbox" : "radio", q.id, i, o, multi ? (v || []).indexOf(i) > -1 : v === i);
        });
        return h + '</div>';
      case "scenario":
        h = '<div class="q-opts sc-opts">';
        Object.keys(S.actions).forEach(function (a) { h += optionHTML("radio", q.id, a, S.actions[a], v === a, App.ACTION_ICON[a]); });
        return h + '</div>';
      case "slider":
        var mid = Math.round((q.min + q.max) / 2);
        return '<div class="sv-slider' + (v == null ? " unset" : "") + '">' +
          '<input type="range" min="' + q.min + '" max="' + q.max + '" step="1" data-k="' + q.id + '" value="' + (v != null ? v : mid) + '">' +
          '<div class="sv-slider-labels"><span>' + q.min + ' · ' + q.minLabel + '</span><output>' + (v != null ? v : "move the slider") + '</output><span>' + q.max + ' · ' + q.maxLabel + '</span></div></div>';
      case "number":
        var unit = v ? v.unit : "million";
        h = '<div class="sv-number"><span>USD</span><input class="sv-input" type="number" min="0" step="any" inputmode="decimal" data-k="' + q.id + '" value="' + (v ? v.amount : "") + '" placeholder="e.g. 250">' +
          '<select class="sv-input" data-unit="' + q.id + '">';
        Object.keys(UNITS).forEach(function (u) { h += '<option value="' + u + '"' + (u === unit ? " selected" : "") + '>' + u + '</option>'; });
        return h + '</select><span>per year</span></div>';
      case "matrix":
        h = '<div class="mx-wrap"><table class="mx" style="--n:' + q.scale.length + '"><thead><tr><th></th>';
        q.scale.forEach(function (s) { h += '<th>' + s + '</th>'; });
        h += '</tr></thead><tbody>';
        q.rows.forEach(function (r, ri) {
          h += '<tr><td class="mx-row">' + r + '</td>';
          q.scale.forEach(function (s, si) {
            var on = v && v[ri] === si;
            h += '<td data-label="' + esc(s) + '"><input type="radio" name="' + q.id + '__' + ri + '" value="' + si + '" aria-label="' + esc(r + ": " + s) + '"' + (on ? " checked" : "") + '></td>';
          });
          h += '</tr>';
        });
        return h + '</tbody></table></div>';
      case "dual":
        h = '<div class="mx-wrap"><table class="mx dual"><thead><tr><th></th>';
        q.cols.forEach(function (c) { h += '<th colspan="' + c.scale.length + '" class="mx-group">' + c.label + '</th>'; });
        h += '</tr><tr><th></th>';
        q.cols.forEach(function (c, ci) { c.scale.forEach(function (s, si) { h += '<th class="' + (ci && !si ? "mx-split" : "") + '">' + s + '</th>'; }); });
        h += '</tr></thead><tbody>';
        q.rows.forEach(function (r, ri) {
          h += '<tr><td class="mx-row">' + r + '</td>';
          q.cols.forEach(function (c, ci) {
            var key = ci ? "b" : "a";
            c.scale.forEach(function (s, si) {
              var on = v && v[ri] && v[ri][key] === si;
              h += '<td class="' + (ci && !si ? "mx-split" : "") + '"><input type="radio" name="' + q.id + '__' + ri + '__' + key + '" value="' + si + '" aria-label="' + esc(r + " – " + c.label + ": " + s) + '"' + (on ? " checked" : "") + '></td>';
            });
          });
          h += '</tr>';
        });
        return h + '</tbody></table></div>';
    }
    return "";
  }

  function confHTML(q, c) {
    return '<div class="confidence"><div class="conf-label">How sure are you?</div><div class="scale" data-conf="' + q.id + '">' +
      S.confidenceLabels.map(function (lab, i) { return '<button type="button" class="' + (c === i ? "sel" : "") + '" data-v="' + i + '">' + lab + '</button>'; }).join("") +
      '</div></div>';
  }

  function renderSurvey(which) {
    var pre = which === "pre", sec = $("#survey-" + which);
    if (pre ? state.preDone : state.postDone) {
      sec.innerHTML = App.gateHTML("circle-check", pre ? "Survey completed" : "Final survey completed",
        "Your answers are saved and locked, so the before/after comparison stays clean.",
        pre ? "Go to the modules" : "See the evaluation", pre ? "modules" : "result");
      return;
    }
    if (!pre && !state.preDone) { sec.innerHTML = App.preGateHTML(); return; }
    if (!pre && !App.defenseDone()) {
      sec.innerHTML = App.gateHTML("lock", "Finish the defense level first",
        "The final survey measures what changed through the training, so it opens after the modules and the defense level.",
        "Go to the defense level", "defense");
      return;
    }

    var qs = App.surveyItems(which), store = state[which], conf = state[which + "Conf"];
    var html = '<div class="wrap narrow">' + (pre
      ? App.pageHead("Step 1 · Before the training", "Cybersecurity survey",
          qs.length + ' questions, about 10 minutes. Answer the way you really act at work – there is no penalty for honest answers, and no solutions are shown.')
      : App.pageHead("Final step · After the training", "To finish: the survey once more",
          qs.length + ' questions, about 6 minutes. Some questions are the same as at the start, the situations are new. Answer the way you would act now – no solutions are shown.'));
    html += '<div class="sv-progress"><span><b id="svCount">0</b> of ' + qs.length + ' answered</span><div class="sv-bar"><div id="svBar"></div></div></div>';
    var lastSection = null, sectionNo = 0;
    qs.forEach(function (q, qi) {
      if (q.section !== lastSection) {
        sectionNo++;
        html += '<h3 class="sv-section"><span>' + (sectionNo < 10 ? "0" : "") + sectionNo + '</span>' + q.section + '</h3>';
        lastSection = q.section;
        if (q.type === "scenario") html += '<p class="note sv-intro">For each situation, choose what you would actually do – then say how sure you are.</p>';
      }
      html += '<div class="q-card" data-qid="' + q.id + '">' +
        '<p class="sv-q"><span class="q-n">' + (qi + 1) + '</span><span>' + q.text + (q.required === false ? ' <span class="optional">optional</span>' : '') + '</span></p>' +
        (q.hint ? '<p class="note sv-hint">' + q.hint + '</p>' : '') +
        fieldHTML(q, store[q.id]) +
        (q.conf ? confHTML(q, conf[q.id]) : '') +
      '</div>';
    });
    html += '<div class="sv-submit"><button class="btn lg" id="surveyNext">' + (pre ? "Continue to the modules" : "See the evaluation") + ' ' + icon("arrow-right") + '</button>' +
            '<p class="note">' + icon("lock") + 'Your answers are anonymous and used only for the evaluation of this project. Once submitted, they can no longer be changed.</p></div>' +
            '</div>';
    sec.innerHTML = html;

    function isDone(q) { return App.isAnswered(q, store[q.id]) && !(q.conf && conf[q.id] == null); }
    function updateCount() {
      var n = qs.filter(function (q) { return q.required !== false && isDone(q); }).length;
      var total = qs.filter(function (q) { return q.required !== false; }).length;
      $("#svCount", sec).textContent = n;
      $("#svBar", sec).style.width = Math.round(n / total * 100) + "%";
    }

    function onField(e) {
      var t = e.target, card = t.closest(".q-card"); if (!card) return;
      var id = card.getAttribute("data-qid"), q = qs.filter(function (x) { return x.id === id; })[0]; if (!q) return;
      card.classList.remove("missing");
      switch (q.type) {
        case "text": case "textarea":
          store[q.id] = t.value.trim(); break;
        case "single": case "scenario":
          store[q.id] = q.type === "single" ? parseInt(t.value, 10) : t.value;
          $$(".q-opt", card).forEach(function (l) { l.classList.toggle("sel", l.querySelector("input").checked); });
          break;
        case "multi":
          store[q.id] = $$("input:checked", card).map(function (x) { return parseInt(x.value, 10); });
          $$(".q-opt", card).forEach(function (l) { l.classList.toggle("sel", l.querySelector("input").checked); });
          break;
        case "slider":
          store[q.id] = parseInt(t.value, 10);
          $("output", card).textContent = t.value;
          $(".sv-slider", card).classList.remove("unset");
          break;
        case "number":
          var amt = parseFloat($("input", card).value), unit = $("select", card).value;
          if (isFinite(amt) && amt >= 0) store[q.id] = { amount: amt, unit: unit, usd: amt * UNITS[unit] };
          else delete store[q.id];
          break;
        case "matrix":
          var p = t.name.split("__");
          store[q.id] = store[q.id] || {}; store[q.id][p[1]] = parseInt(t.value, 10); break;
        case "dual":
          var d = t.name.split("__");
          store[q.id] = store[q.id] || {}; store[q.id][d[1]] = store[q.id][d[1]] || {};
          store[q.id][d[1]][d[2]] = parseInt(t.value, 10); break;
      }
      App.save(); updateCount();
    }
    sec.onchange = onField;
    sec.oninput = onField;
    // "How sure are you?" buttons
    sec.onclick = function (e) {
      var b = e.target.closest(".scale button"); if (!b) return;
      var sc = b.parentNode;
      conf[sc.getAttribute("data-conf")] = parseInt(b.getAttribute("data-v"), 10);
      $$("button", sc).forEach(function (x) { x.classList.toggle("sel", x === b); });
      b.closest(".q-card").classList.remove("missing");
      App.save(); updateCount();
    };
    updateCount();

    $("#surveyNext", sec).onclick = function () {
      var missing = qs.filter(function (q) { return !isDone(q); });
      $$(".q-card.missing", sec).forEach(function (c) { c.classList.remove("missing"); });
      if (missing.length) {
        missing.forEach(function (q) { $('.q-card[data-qid="' + q.id + '"]', sec).classList.add("missing"); });
        App.toast("Please answer every question and say how sure you are (" + missing.length + " still open).", "circle-alert");
        $('.q-card[data-qid="' + missing[0].id + '"]', sec).scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (pre) {
        state.preDone = true; App.save();
        App.toast("Survey done – modules unlocked!", "lock-open");
        App.go("modules");
      } else {
        state.postDone = true; App.save();
        App.go("result");
      }
    };
  }

  App.views["survey-pre"] = function () { renderSurvey("pre"); };
  App.views["survey-post"] = function () { renderSurvey("post"); };
})(window.App);
