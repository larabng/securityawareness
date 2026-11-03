/* =========================================================================
   Module flow: expert video → hacker mission → reveal
   ========================================================================= */
(function (App) {
  "use strict";
  var C = window.CONTENT, state = App.state, icon = App.icon, $ = App.$, $$ = App.$$;

  App.views["module-detail"] = function (id) {
    var m = C.modules.filter(function (x) { return x.id === id; })[0];
    var sec = $("#module-detail");
    var phase = 0; // 0 video, 1 mission, 2 reveal
    var picks = [];

    function pills() {
      var names = [["play", "Expert video"], ["terminal", "Hacker mission"], ["lightbulb", "Reveal"]];
      return '<div class="steps">' + names.map(function (n, i) {
        var cls = i < phase ? "done" : (i === phase ? "current" : "");
        return '<div class="step-pill ' + cls + '">' + icon(i < phase ? "check" : n[0]) + n[1] + '</div>';
      }).join('<span class="step-sep"></span>') + '</div>';
    }
    function head(suffix) {
      return '<div class="mod-head"><span class="ico-tile acc-' + m.number + '">' + icon(m.icon) + '</span><div>' +
        '<div class="eyebrow">Module ' + m.number + ' · ' + App.DIFF_LABEL[m.difficulty || "medium"] + ' · reward: ' + m.key.name + '</div>' +
        '<h2>' + m.title + (suffix || "") + '</h2></div></div>';
    }

    function renderVideo() {
      var v = m.video;
      var media = v.url
        ? (/youtube|youtu\.be|vimeo/.test(v.url)
            ? '<iframe src="' + v.url + '" allowfullscreen></iframe>'
            : '<video controls playsinline preload="metadata" src="' + v.url + '"></video>')
        : '<div class="placeholder">' + icon("video") + '<p>Expert video to follow<br><span class="note">' + v.expert + ' · ' + v.duration + '</span></p></div>';
      var pts = v.points.map(function (p) { return '<li><b>' + p[0] + '</b> ' + p[1] + '</li>'; }).join("");
      sec.innerHTML = '<div class="wrap">' + pills() + head() +
        '<div class="video-layout">' +
          '<div class="video-frame">' + media + '</div>' +
          '<aside class="card"><h3>What this is about</h3>' +
            '<div class="video-meta">' + icon("user") + v.expert + '<span>·</span>' + v.duration + '</div>' +
            '<p class="note">' + v.summary + '</p><ul class="points">' + pts + '</ul></aside>' +
        '</div>' +
        '<div class="page-foot"><button class="btn accent" id="toMission">Continue to the hacker mission ' + icon("arrow-right") + '</button>' +
        '<button class="btn glass" id="backMods" data-go="modules">Back to overview</button></div>' +
        '</div>';
      $("#toMission").onclick = function () { phase = 1; renderMission(); window.scrollTo({ top: 0, behavior: "smooth" }); };
    }

    function renderMission() {
      var mi = m.mission, stepIdx = 0;
      function drawStep() {
        var st = mi.steps[stepIdx];
        // random order so the strongest option isn't always first
        var opts = App.shuffled(st.options.length).map(function (i) {
          return '<button class="opt" data-i="' + i + '">' + st.options[i].t + '</button>';
        }).join("");
        var hintBtn = st.hint ? '<button class="hint-btn" id="hintBtn">' + icon("lightbulb") + 'Show hint (−10 pts)</button><div id="hintBox"></div>' : '';
        $("#termbody").innerHTML =
          '<div class="prompt mono"><span>root@talentbridge:~$</span> target = "' + mi.target + '"</div>' +
          '<div class="step-count mono">step ' + (stepIdx + 1) + '/' + mi.steps.length + '</div>' +
          '<p class="mission-q">' + st.q + '</p>' + opts +
          hintBtn +
          '<div class="risk"><span class="mono">risk</span><div class="risk-meter"><div id="riskfill"></div></div></div>' +
          '<p class="note">Tip: choose what makes the attack most dangerous – you' + "'" + 'll then see exactly how that could have been recognised.</p>';
        if (st.hint) {
          $("#hintBtn").onclick = function () {
            state.hints[m.id] = (state.hints[m.id] || 0) + 1; App.save();
            $("#hintBox").innerHTML = '<div class="hint-text">' + st.hint + '</div>';
            this.disabled = true;
            App.toast("Hint used – −10 points", "lightbulb");
          };
        }
        $$("#termbody .opt").forEach(function (btn) {
          btn.onclick = function () {
            var i = parseInt(btn.getAttribute("data-i"), 10), opt = st.options[i];
            $$("#termbody .opt").forEach(function (b) { b.classList.remove("pick"); }); btn.classList.add("pick");
            $("#riskfill").style.width = Math.round(opt.risk / 3 * 100) + "%";
            picks.push(opt);
            var hb = $("#hintBtn"); if (hb) hb.disabled = true;
            setTimeout(function () {
              // short per-step micro-reveal: mark the strongest option and explain it
              var best = st.options.filter(function (o) { return o.risk === 3; })[0];
              $$("#termbody .opt").forEach(function (b) {
                if (st.options[parseInt(b.getAttribute("data-i"), 10)] === best) b.classList.add("best");
              });
              var found = opt === best;
              var note = App.el("div", "giveaway " + (found ? "ok" : "miss"));
              note.innerHTML = found
                ? icon("circle-check") + '<div><b>Strongest building block.</b> ' + opt.why + '</div>'
                : icon("circle-alert") + '<div><b>Not the strongest choice.</b> ' + opt.why +
                  '<div class="gv-best"><b>Strongest:</b> ' + best.t + ' – ' + best.why + '</div></div>';
              $("#termbody").appendChild(note);
              var nx = App.el("button", "btn accent", (stepIdx < mi.steps.length - 1 ? "Next step" : "Score the mission") + " " + icon("arrow-right"));
              nx.onclick = function () { stepIdx++; if (stepIdx < mi.steps.length) drawStep(); else finishMission(); };
              $("#termbody").appendChild(nx);
              $$("#termbody .opt").forEach(function (b) { b.disabled = true; });
            }, 250);
          };
        });
      }
      sec.innerHTML = '<div class="wrap">' + pills() +
        '<div class="terminal"><div class="term-bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>' +
          '<span class="mono">mission // ' + m.title + '</span></div>' +
        '<div class="term-body"><h3>' + icon("target") + 'Objective: ' + mi.target + '</h3><p class="term-intro">' + mi.intro + '</p>' +
          '<div id="termbody"></div>' +
        '</div></div></div>';
      drawStep();
    }

    function finishMission() {
      var firstTime = !state.missionDone[m.id];
      // meters (fictional) – based on assessed risk
      var score = picks.reduce(function (a, o) { return a + o.risk; }, 0);
      var maxScore = m.mission.steps.length * 3;
      var gain = Math.round(score / maxScore * (12 + m.lootLevel * 4));
      var earnedPts = 0;
      if (firstTime) {
        state.loot = Math.min(100, state.loot + gain);
        state.damage = Math.min(100, state.damage + Math.round(gain * 1.3));
        // points: difficulty base scaled by how well the steps were assessed,
        // minus hints used (floor 10), plus key + badge
        var base = App.DIFF_POINTS[m.difficulty || "medium"];
        var hintsUsed = state.hints[m.id] || 0;
        earnedPts = Math.max(10, Math.round(base * score / maxScore) - hintsUsed * 10);
        App.addPoints(earnedPts);
        state.keys[m.id] = true;        // collect the key
        state.missionPicks[m.id] = picks.map(function (o) { return o.risk; });
      }
      state.missionDone[m.id] = true; App.save();
      if (firstTime) App.toast("+" + earnedPts + " points · " + m.key.name + " collected!", "key-round");
      phase = 2; renderReveal(firstTime, earnedPts);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderReveal(firstTime, earnedPts) {
      var r = m.reveal;
      var reward = firstTime
        ? '<div class="reward">' +
            '<div class="reward-item"><span class="ico-tile gold">' + icon("key-round") + '</span><div><small>Key collected</small><b>' + m.key.name + '</b></div></div>' +
            '<div class="reward-item"><span class="ico-tile gold">' + icon(m.badge.icon) + '</span><div><small>Badge unlocked</small><b>' + m.badge.name + '</b></div></div>' +
            '<div class="reward-item"><span class="ico-tile gold">' + icon("star") + '</span><div><small>Points</small><b>+' + earnedPts + '</b></div></div>' +
          '</div>'
        : '<div class="reward done">' + icon(m.badge.icon) + 'Already completed – <b>' + m.badge.name + '</b> earned, key in your ring.</div>';
      sec.innerHTML = '<div class="wrap">' + pills() + head(' – reveal') +
        reward +
        '<div class="reveal-grid">' +
          '<div class="reveal card"><div class="eyebrow">Moment of truth</div><h3>' + r.question + '</h3><p>' + r.answer + '</p>' +
            '<p class="stops-title">This would have interrupted the attack:</p>' +
            '<ul class="stops">' + r.stops.map(function (s) { return '<li>' + icon("shield-check") + '<span>' + s + '</span></li>'; }).join("") + '</ul>' +
          '</div>' +
          '<div class="card">' + App.metersHTML() + '</div>' +
        '</div>' +
        '<div class="page-foot"><button class="btn accent" id="revBack" data-go="modules">Back to the modules ' + icon("arrow-right") + '</button></div>' +
        '</div>';
    }

    renderVideo();
  };
})(window.App);
