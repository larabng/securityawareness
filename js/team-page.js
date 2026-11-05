/* =========================================================================
   Team mission page (team-mission.html)
   -------------------------------------------------------------------------
   Without parameters: the TEAM TABLE on the shared laptop – choose the
   group size, show one QR code per person, then play three rounds
   (3 questions + 1 decision + reveal each) and show the completion code.
   With ?s=<token>: the PHONE view of one person – their clue cards per round.
   Nothing is sent anywhere: the phones and the table are not connected,
   the group combines the clues by talking. Table progress survives a reload
   of this tab (sessionStorage "imoah_table") – a game takes about 15 minutes.
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, TC = C.team, T = App.team, icon = App.icon, esc = App.esc, $ = App.$, $$ = App.$$;
  var root = $("#tm"), chip = $("#tmChip");
  var ACTION_ICON = { process: "check", verify: "phone", report: "flag", reject: "ban" };
  var LETTERS = "ABCD";

  function personTag(p) { return '<span class="ptag p' + p + '">Person ' + p + '</span>'; }
  function store(key, val) { try { if (val == null) sessionStorage.removeItem(key); else sessionStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  function load(key) { try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; } }

  var params = new URLSearchParams(location.search);
  if (params.has("s")) seatView(params.get("s")); else tableView();

  /* =====================================================================
     PHONE: one person's clue cards
     ===================================================================== */
  function seatView(tok) {
    document.body.classList.add("tm-phone");
    var seat = T.parseSeat(tok);
    if (!seat) {
      chip.textContent = "Link not valid";
      root.innerHTML = '<div class="wrap narrow"><div class="gate card"><span class="gate-ic">' + icon("qr-code") + '</span>' +
        '<h2>This link doesn\'t work</h2><p class="lead">Part of the link is missing or was changed. Scan the QR code on the team table again.</p></div></div>';
      return;
    }
    var key = "imoah_seat_" + tok, round = Math.min(T.rounds.length - 1, Math.max(0, load(key) || 0));
    chip.innerHTML = icon("smartphone") + "Person " + seat.p + " of " + seat.n;

    function draw() {
      var r = T.rounds[round], mine = T.cardsFor(seat.p, round, seat.n);
      root.innerHTML = '<div class="wrap seat">' +
        '<div class="seat-head"><span class="pbig p' + seat.p + '">P' + seat.p + '</span>' +
          '<div><h1>Your clue cards</h1><p class="note">Person ' + seat.p + ' of ' + seat.n + ' · only you see these cards</p></div></div>' +
        '<div class="tell">' + icon("messages-square") + '<div><b>Tell, don\'t show.</b> Describe your cards to the others in your own words – don\'t pass your phone around.</div></div>' +
        '<div class="tabs" role="tablist">' + T.rounds.map(function (x, i) {
          return '<button role="tab" aria-selected="' + (i === round) + '" class="' + (i === round ? "on" : "") + '" data-round="' + i + '">Round ' + (i + 1) + '</button>';
        }).join("") + '</div>' +
        '<div class="seat-round"><span class="ico-tile sm">' + icon(r.icon) + '</span><div><div class="eyebrow">Round ' + (round + 1) + ' · ' + r.kicker + '</div><h2>' + r.title + '</h2></div></div>' +
        '<div class="clues">' + mine.map(function (c) {
          var card = r.cards[c - 1];
          return '<article class="clue"><div class="clue-top"><span class="clue-n">Card ' + c + '</span><span class="clue-t">' + card.title + '</span></div>' +
            '<div class="clue-b">' + card.body + '</div></article>';
        }).join("") + '</div>' +
        '<p class="note seat-foot">' + icon("info") + 'When the table moves on to the next round, switch the round here.</p>' +
      '</div>';
      $$("[data-round]").forEach(function (b) {
        b.onclick = function () { round = +b.getAttribute("data-round"); store(key, round); draw(); window.scrollTo(0, 0); };
      });
    }
    draw();
  }

  /* =====================================================================
     TABLE: the shared laptop
     ===================================================================== */
  function tableView() {
    var KEY = "imoah_table";
    var st = load(KEY) || { phase: "setup", n: null };

    function save() { store(KEY, st); }
    function seatBase() {
      var local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
      return { url: local ? TC.publicUrl : location.origin + location.pathname, local: local };
    }

    function draw() {
      if (st.phase === "round") drawRound();
      else if (st.phase === "done") drawDone();
      else drawSetup();
    }

    /* ---------- setup: group size + QR codes ---------- */
    function qrHTML(n) {
      var base = seatBase();
      return '<div class="qrs">' + Array.apply(null, { length: n }).map(function (_, i) {
        var p = i + 1, tok = T.seatToken(n, p), url = base.url + "?s=" + tok, svg = "";
        try { var q = qrcode(0, "M"); q.addData(url); q.make(); svg = q.createSvgTag({ cellSize: 4, margin: 2, scalable: true, alt: "QR code for person " + p }); } catch (e) {}
        return '<div class="qr p' + p + '"><div class="qr-img">' + svg + '</div>' +
          '<div class="qr-meta">' + personTag(p) + '<span class="mono qr-tok">' + tok + '</span></div>' +
          '<a class="qr-link" href="team-mission.html?s=' + tok + '" target="_blank" rel="noopener" data-token="' + tok + '">' + icon("external-link") + 'Open on this device</a></div>';
      }).join("") + '</div>' +
      (base.local ? '<p class="note qr-note">' + icon("info") + '<span>This laptop runs a local copy, so the QR codes point to the online version: <span class="mono">' + esc(TC.publicUrl) + '</span></span></p>' : '');
    }

    function drawSetup() {
      chip.innerHTML = icon("users") + "Team table";
      var sizes = [];
      for (var n = TC.minPlayers; n <= TC.maxPlayers; n++) sizes.push(n);
      root.innerHTML =
        '<section class="tm-hero dark"><div class="wrap">' +
          '<span class="pill">' + icon("users") + 'Team mission · Workshop</span>' +
          '<h1>A live attack hits <span class="grad">TalentBridge</span></h1>' +
          '<p class="lead">Three rounds, one attack chain. Every person at this table holds some of the clues on their phone – ' +
            '<b>nobody can answer the questions alone.</b> Talk, combine what you see, and decide together.</p>' +
          '<div class="rules">' +
            '<div>' + icon("smartphone") + '<span><b>One phone per person</b> – this laptop is the shared table.</span></div>' +
            '<div>' + icon("messages-square") + '<span><b>Tell, don\'t show</b> – describe your cards in your own words.</span></div>' +
            '<div>' + icon("clock") + '<span><b>About 15 minutes</b> – 3 rounds of 3 questions and one decision.</span></div>' +
          '</div>' +
        '</div></section>' +
        '<div class="wrap setup">' +
          '<div class="card setup-step"><div class="step-no">1</div><div class="step-body">' +
            '<h3>How many of you are at this table?</h3>' +
            '<div class="sizes" role="group" aria-label="Group size">' + sizes.map(function (n) {
              return '<button type="button" class="' + (st.n === n ? "on" : "") + '" data-size="' + n + '"><b>' + n + '</b><span>people</span></button>';
            }).join("") + '</div>' +
            '<p class="note">' + TC.minPlayers + ' to ' + TC.maxPlayers + ' people. More than ' + TC.maxPlayers + '? Split up and use a second laptop as another table.</p>' +
          '</div></div>' +
          '<div class="card setup-step' + (st.n ? "" : " muted") + '"><div class="step-no">2</div><div class="step-body">' +
            '<h3>Everyone scans one code with their phone</h3>' +
            (st.n ? '<p class="note">Each person takes a different code. No phone? Open the link on a second laptop instead.</p>' + qrHTML(st.n)
                  : '<p class="note">Choose the group size first.</p>') +
          '</div></div>' +
          '<div class="start-row"><button class="btn accent lg" id="tmStart"' + (st.n ? "" : " disabled") + '>Start round 1 ' + icon("arrow-right") + '</button>' +
            '<span class="note">Start once every person sees their cards.</span></div>' +
        '</div>';
      $$("[data-size]").forEach(function (b) {
        b.onclick = function () { st.n = +b.getAttribute("data-size"); save(); drawSetup(); };
      });
      $("#tmStart").onclick = function () {
        if (!st.n) return;
        st = { phase: "round", n: st.n, round: 0, step: 0, sel: null, answers: T.rounds.map(function () { return []; }), decisions: [], startedAt: Date.now() };
        save(); draw(); window.scrollTo(0, 0);
      };
    }

    /* ---------- one round ---------- */
    function redact(c) { return '<span class="redact">' + icon("eye-off") + 'Card ' + c + '</span>'; }
    function viewHTML(r) {
      function row(x) {
        return '<div class="doc-row"><span class="doc-k">' + (x.label || "") + '</span><span class="doc-v">' +
          (x.text ? esc(x.text) + (x.card ? " " : "") : "") + (x.card ? redact(x.card) : "") + '</span></div>';
      }
      return '<div class="doc"><div class="doc-head">' + icon(r.icon) + r.kicker + '</div>' + r.view.rows.map(row).join("") + '</div>' +
        (r.view.outside && r.view.outside.length ? '<div class="doc outside"><div class="doc-head">' + icon("search") + 'What you can check yourselves</div>' + r.view.outside.map(row).join("") + '</div>' : '');
    }

    function progressHTML(r) {
      var labels = r.questions.map(function (q, i) { return "Question " + (i + 1); }).concat(["Decision", "Reveal"]);
      return '<ol class="rprog">' + labels.map(function (l, i) {
        return '<li class="' + (i < st.step ? "done" : i === st.step ? "on" : "") + '">' + l + '</li>';
      }).join("") + '</ol>';
    }

    function questionHTML(r, qi) {
      var q = r.questions[qi], ans = st.answers[st.round][qi], done = ans != null;
      return '<div class="qblock' + (done ? " done" : " current") + '" id="q' + qi + '">' +
        '<div class="q-top"><span class="q-no">Question ' + (qi + 1) + '</span>' +
          '<span class="needs">' + icon("users") + 'needs card ' + q.cards.join(" + ") + '</span></div>' +
        '<p class="q-text">' + q.text + '</p>' +
        '<div class="opts">' + q.options.map(function (o, oi) {
          var cls = done ? (oi === q.correct ? " ok" : (oi === ans ? " bad" : "")) : (st.sel === oi ? " sel" : "");
          return '<button type="button" class="opt' + cls + '" data-opt="' + oi + '"' + (done ? " disabled" : "") + '><span class="opt-l">' + LETTERS.charAt(oi) + '</span><span>' + o + '</span></button>';
        }).join("") + '</div>' +
        (done ? '<div class="result ' + (ans === q.correct ? "ok" : "bad") + '">' + icon(ans === q.correct ? "circle-check" : "circle-x") +
            '<div><b>' + (ans === q.correct ? "Correct." : "Not quite – the right answer is " + LETTERS.charAt(q.correct) + ".") + '</b> ' + q.why + '</div></div>'
              : '<button class="btn" id="tmLock"' + (st.sel == null ? " disabled" : "") + '>Lock in answer ' + icon("check") + '</button>') +
      '</div>';
    }

    function decisionHTML(r) {
      var act = st.decisions[st.round], done = act != null;
      var qual = done ? T.decisionQuality(st.round, act) : null;
      return '<div class="qblock decision' + (done ? " done" : " current") + '" id="qdec">' +
        '<div class="q-top"><span class="q-no">Decision</span><span class="needs">' + icon("users") + 'the whole group</span></div>' +
        '<p class="q-text">' + r.ask + '</p>' +
        '<div class="acts">' + Object.keys(TC.actions).map(function (a) {
          var cls = done ? (a === act ? " chosen" : "") + (a === r.decision.best ? " best" : "") : (st.sel === a ? " sel" : "");
          return '<button type="button" class="act' + cls + '" data-act="' + a + '"' + (done ? " disabled" : "") + '>' + icon(ACTION_ICON[a]) + '<span>' + TC.actions[a] + '</span></button>';
        }).join("") + '</div>' +
        (done ? '<div class="result ' + (qual === 2 ? "ok" : qual === 1 ? "meh" : "bad") + '">' + icon(qual === 2 ? "circle-check" : qual === 1 ? "thumbs-up" : "circle-x") +
            '<div><b>' + (qual === 2 ? "The best call." : qual === 1 ? "Safe, but not the best call." : "Not safe.") + '</b> ' +
            (qual === 2 ? "" : "Best action: " + TC.actions[r.decision.best] + ".") + '</div></div>'
              : '<button class="btn" id="tmLock"' + (st.sel == null ? " disabled" : "") + '>Lock in decision ' + icon("check") + '</button>') +
      '</div>';
    }

    function revealHTML(r) {
      var rr = resultOf(st.round), last = st.round === T.rounds.length - 1;
      return '<section class="reveal" id="reveal"><div class="wrap">' +
        '<div class="reveal-head"><div><div class="eyebrow">Reveal · Round ' + (st.round + 1) + '</div><h2>The clues together</h2></div>' +
          '<div class="rscore"><b>' + T.roundScore(rr) + '</b><span>/ ' + T.maxRound(st.round) + ' points</span></div></div>' +
        '<div class="reveal-grid">' + r.cards.map(function (c, i) {
          return '<article class="rcard"><div class="clue-top"><span class="clue-n">Card ' + (i + 1) + '</span>' + personTag(T.owner(i + 1, st.round, st.n)) + '</div>' +
            '<div class="clue-t">' + c.title + '</div><div class="clue-b">' + c.body + '</div><div class="rwhy">' + icon("lightbulb") + '<span>' + c.why + '</span></div></article>';
        }).join("") + '</div>' +
        '<div class="lesson">' + icon("shield-check") + '<div><b>The mechanism</b><p>' + r.lesson + '</p></div></div>' +
        '<div class="reveal-foot"><button class="btn accent lg" id="tmNext">' + (last ? "See your result" : "Start round " + (st.round + 2)) + ' ' + icon("arrow-right") + '</button>' +
          (last ? '' : '<span class="note">' + icon("smartphone") + 'Everyone: switch your phone to round ' + (st.round + 2) + '.</span>') + '</div>' +
      '</div></section>';
    }

    function drawRound() {
      var r = T.rounds[st.round], Q = r.questions.length;
      chip.innerHTML = icon("users") + st.n + " people · round " + (st.round + 1) + "/" + T.rounds.length;
      var panel = "";
      for (var qi = 0; qi < Math.min(st.step + 1, Q); qi++) panel += questionHTML(r, qi);
      if (st.step >= Q) panel += decisionHTML(r);
      root.innerHTML =
        '<div class="rbar"><div class="wrap rbar-in">' +
          '<span class="rpill">' + icon(r.icon) + 'Round ' + (st.round + 1) + ' of ' + T.rounds.length + ' · ' + r.kicker + '</span>' +
          progressHTML(r) +
          '<span class="phones">' + icon("smartphone") + 'Phones: round ' + (st.round + 1) + '</span>' +
        '</div></div>' +
        '<div class="wrap round">' +
          '<div class="round-left">' +
            '<h2>' + r.title + '</h2><p class="scene">' + r.scene + '</p>' + viewHTML(r) +
            '<p class="note hint">' + icon("eye-off") + 'Blacked-out parts are on someone\'s phone. Find out who holds which card.</p>' +
          '</div>' +
          '<div class="round-right" id="tmPanel">' + panel + '</div>' +
        '</div>' +
        (st.step > Q ? revealHTML(r) : '');

      $$("#tmPanel .current [data-opt]").forEach(function (b) {
        b.onclick = function () { st.sel = +b.getAttribute("data-opt"); save(); drawRound(); };
      });
      $$("#tmPanel .current [data-act]").forEach(function (b) {
        b.onclick = function () { st.sel = b.getAttribute("data-act"); save(); drawRound(); };
      });
      var lock = $("#tmLock");
      if (lock) lock.onclick = function () {
        if (st.sel == null) return;
        if (st.step < Q) st.answers[st.round][st.step] = st.sel;
        else st.decisions[st.round] = st.sel;
        st.step++; st.sel = null; save(); drawRound();
        var target = st.step > Q ? $("#reveal") : $(st.step < Q ? "#q" + st.step : "#qdec");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      var next = $("#tmNext");
      if (next) next.onclick = function () {
        if (st.round < T.rounds.length - 1) { st.round++; st.step = 0; st.sel = null; }
        else { st.phase = "done"; st.finishedAt = Date.now(); }
        save(); draw(); window.scrollTo(0, 0);
      };
    }

    function resultOf(ri) {
      var r = T.rounds[ri];
      return {
        q: r.questions.map(function (q, qi) { return st.answers[ri][qi] === q.correct ? 1 : 0; }),
        d: st.decisions[ri] != null ? T.decisionQuality(ri, st.decisions[ri]) : 0
      };
    }

    /* ---------- result + completion code ---------- */
    function drawDone() {
      var res = { n: st.n, minutes: Math.round(((st.finishedAt || Date.now()) - st.startedAt) / 60000), rounds: T.rounds.map(function (r, ri) { return resultOf(ri); }) };
      var sum = T.summary(res), code = T.encode(res), max = T.maxScore();
      chip.innerHTML = icon("users") + st.n + " people · finished";
      root.innerHTML =
        '<section class="tm-hero dark done-hero"><div class="wrap done-grid">' +
          '<div><span class="pill">' + icon("shield-check") + 'Team mission complete</span>' +
            '<h1>' + (sum.score >= max * 0.8 ? "Attack stopped" : "Mission complete") + '</h1>' +
            '<p class="lead">Your group of ' + st.n + ' scored <b>' + sum.score + ' of ' + max + ' points</b> in ' + (res.minutes < 1 ? 'under a minute' : res.minutes + (res.minutes === 1 ? ' minute' : ' minutes')) + ': ' +
              sum.questions + ' questions right and ' + sum.decisions + ' of ' + T.rounds.length * 2 + ' decision points.</p>' +
            '<div class="round-sum">' + T.rounds.map(function (r, ri) {
              return '<div>' + icon(r.icon) + '<span>' + r.kicker + '</span><b>' + T.roundScore(res.rounds[ri]) + '/' + T.maxRound(ri) + '</b></div>';
            }).join("") + '</div>' +
          '</div>' +
          '<div class="card code-card">' +
            '<div class="eyebrow">Completion code</div>' +
            '<div class="code mono" id="tmCode">' + code + '</div>' +
            '<p class="note">Every team at this table enters this code in its own app: <b>step 3 · Team mission</b>. That records your result and opens the defense level.</p>' +
            '<button class="btn subtle sm" id="tmCopy">' + icon("copy") + 'Copy code</button>' +
          '</div>' +
        '</div></section>' +
        '<div class="wrap done-foot"><button class="btn subtle sm" id="tmReset">' + icon("rotate-ccw") + 'New game for another group</button>' +
          '<span class="note">Write the code down before you start a new game.</span></div>';
      $("#tmCopy").onclick = function () {
        try { navigator.clipboard.writeText(code).then(function () { App.toast("Code copied.", "copy"); }, function () { App.toast("Copy failed – please note the code by hand.", "info"); }); }
        catch (e) { App.toast("Copy failed – please note the code by hand.", "info"); }
      };
      $("#tmReset").onclick = function () {
        if (!confirm("Start a new game? Make sure every team has entered the code " + code + ".")) return;
        st = { phase: "setup", n: null }; save(); draw(); window.scrollTo(0, 0);
      };
    }

    draw();
  }
})(window.App);
