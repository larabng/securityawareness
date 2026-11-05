/* =========================================================================
   Defense level – the roles flip: an inbox with attacks and genuine mail.
   Scoring: best action +15 (+10 from a streak of 3), defensible action +8
   (streak kept), anything else resets the streak.
   ========================================================================= */
(function (App) {
  "use strict";
  var state = App.state, icon = App.icon, $ = App.$, $$ = App.$$, INBOX = App.INBOX;

  function initials(from) {
    var words = from.replace(/\(.*?\)/g, "").split(",")[0].replace(/[^A-Za-zÀ-ÿ\s]/g, " ").trim().split(/\s+/);
    return (words[0].charAt(0) + (words[1] ? words[1].charAt(0) : "")).toUpperCase();
  }
  // a plausible morning in the inbox: newest message on top
  function timeOf(i) { var t = 11 * 60 + 52 - i * 21; return Math.floor(t / 60) + ":" + ("0" + t % 60).slice(-2); }
  function statusOf(ans) { return !ans ? "" : ans.correct ? "ok" : (ans.acceptable ? "meh" : "bad"); }
  var STATUS_ICON = { ok: "circle-check", meh: "thumbs-up", bad: "circle-x" };

  function barHTML() {
    var decided = Object.keys(state.defense).length;
    return '<div class="dbar-item">' + icon("flame") + 'Streak <b>' + state.streak + '</b>' +
        (state.streak >= 3 ? '<span class="tag warn">bonus active</span>' : '') + '</div>' +
      '<div class="dbar-item">' + icon("inbox") + 'Decided <b>' + decided + ' / ' + INBOX.length + '</b></div>' +
      '<div class="dbar-item">' + icon("star") + '<b>' + state.points + '</b> points</div>';
  }

  function itemHTML(mail, i, current) {
    var st = statusOf(state.defense[mail.id]);
    return '<button class="mitem' + (mail.id === current ? " active" : "") + (st ? " answered " + st : "") + '" data-mail="' + mail.id + '">' +
      '<span class="avatar av-' + App.hash(mail.from) % 6 + '">' + initials(mail.from) + '</span>' +
      '<span class="mi-body"><span class="mi-top"><b>' + mail.from + '</b><span class="mi-time">' + timeOf(i) + '</span></span>' +
        '<span class="mi-subj">' + mail.subject + '</span><span class="mi-prev">' + mail.preview + '</span></span>' +
      (st ? '<span class="mi-status">' + icon(STATUS_ICON[st]) + '</span>' : '<span class="mi-dot"></span>') +
    '</button>';
  }

  // gained = points just earned, or null when showing an earlier answer again
  function resultHTML(mail, ans, gained) {
    var pts = gained != null ? ' (+' + gained + ' pts)' : '';
    var bestLabel = '<b>Best action: ' + App.ACTION_LABEL[mail.action] + '.</b> ';
    if (ans.correct) return '<div class="result ok">' + icon("circle-check") + '<div><b>Correct' + pts + '. ' + mail.type + '.</b> ' + mail.why + '</div></div>';
    if (ans.acceptable) return '<div class="result meh">' + icon("thumbs-up") + '<div><b>Safe, but not the best call' + pts + '.</b> ' + bestLabel + mail.why + '</div></div>';
    return '<div class="result bad">' + icon("circle-x") + '<div><b>' + (mail.attack ? 'Not safe' : 'Over-cautious – this one is genuine') +
      (gained != null ? ' – streak reset' : '') + '. ' + mail.type + '.</b> ' + bestLabel + mail.why + '</div></div>';
  }

  function viewHTML(mail, i, gained) {
    var ans = state.defense[mail.id];
    var next = INBOX.filter(function (m) { return !state.defense[m.id]; })[0];
    return '<div class="mv-head"><span class="avatar lg av-' + App.hash(mail.from) % 6 + '">' + initials(mail.from) + '</span>' +
        '<div><div class="mv-from">' + mail.from + '</div><div class="note">to me · today ' + timeOf(i) + '</div></div></div>' +
      '<h3 class="mv-subj">' + mail.subject + '</h3>' +
      '<div class="mv-body">' + mail.preview + '</div>' +
      '<div class="mv-ask">What do you do with this message?</div>' +
      '<div class="actions">' + Object.keys(App.ACTION_LABEL).map(function (a) {
        var cls = ans ? (a === ans.action ? " chosen" : "") + (a === mail.action ? " best" : "") : "";
        return '<button data-act="' + a + '" class="' + cls.trim() + '"' + (ans ? " disabled" : "") + '>' + icon(App.ACTION_ICON[a]) + App.ACTION_LABEL[a] + '</button>';
      }).join("") + '</div>' +
      (ans ? resultHTML(mail, ans, gained) : '') +
      (ans && next ? '<button class="btn subtle sm next-mail" data-next="' + next.id + '">Next message ' + icon("arrow-right") + '</button>' : '');
  }

  App.views.defense = function () {
    var sec = $("#defense");
    if (!state.preDone) { sec.innerHTML = App.preGateHTML(); return; }
    var first = INBOX.filter(function (m) { return !state.defense[m.id]; })[0] || INBOX[0];
    var current = first.id;

    sec.innerHTML = '<div class="wrap">' +
      App.pageHead("Step 4 · Defense", "Now you guard the gate",
        "Your inbox contains attacks from the modules – but also harmless, genuine messages. Not every unusual message is an attack. Decide correctly for each one – a run of correct calls builds a streak bonus.") +
      '<div class="dbar" id="dbar">' + barHTML() + '</div>' +
      '<div class="mailclient">' +
        '<div class="mlist" id="mlist"></div>' +
        '<div class="mview" id="mview"></div>' +
      '</div>' +
      '<div class="page-foot"><button class="btn" id="toPost">Continue to the final survey ' + icon("arrow-right") + '</button></div>' +
      '</div>';

    function draw(gained) {
      $("#mlist").innerHTML = INBOX.map(function (m, i) { return itemHTML(m, i, current); }).join("");
      var i = INBOX.map(function (m) { return m.id; }).indexOf(current);
      $("#mview").innerHTML = viewHTML(INBOX[i], i, gained);
      $("#dbar").innerHTML = barHTML();
    }
    function select(id) {
      current = id; draw(null);
      if (window.matchMedia("(max-width: 860px)").matches) $("#mview").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    $("#mlist").onclick = function (e) { var it = e.target.closest("[data-mail]"); if (it) select(it.getAttribute("data-mail")); };
    $("#mview").onclick = function (e) {
      var nx = e.target.closest("[data-next]"); if (nx) { select(nx.getAttribute("data-next")); return; }
      var btn = e.target.closest("[data-act]"); if (!btn || state.defense[current]) return;
      var mail = INBOX.filter(function (x) { return x.id === current; })[0];
      var act = btn.getAttribute("data-act");
      var correct = (act === mail.action);
      var acceptable = !correct && (mail.accept || []).indexOf(act) > -1;
      state.defense[mail.id] = { action: act, correct: correct, acceptable: acceptable };
      var gained = 0;
      if (correct) {
        state.streak++; state.maxStreak = Math.max(state.maxStreak, state.streak);
        var bonus = state.streak >= 3 ? 10 : 0;
        gained = 15 + bonus; App.addPoints(gained);
      } else if (acceptable) {
        gained = 8; App.addPoints(gained);   // safe, but not the best call: streak is kept, not extended
      } else {
        state.streak = 0;
      }
      state.defenseScore = Object.keys(state.defense).filter(function (k) { return state.defense[k].correct; }).length;
      App.save();
      draw(gained);
      App.updateProgress();
    };
    $("#toPost").onclick = function () {
      if (Object.keys(state.defense).length < INBOX.length) {
        App.toast("Please decide on every message (" + Object.keys(state.defense).length + "/" + INBOX.length + ").", "inbox");
        return;
      }
      App.go("survey-post");
    };
    draw(null);
  };
})(window.App);
