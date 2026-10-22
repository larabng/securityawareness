/* =========================================================================
   Inside the Mind of a Hacker – app logic (prototype for the test phase)
   Vanilla JS, no build needed. Progress kept in memory (sessionStorage),
   evaluation via CSV export for the test facilitator.
   Gamification: points, keys + company gate, themed badges, hints,
   defense streaks, difficulty weighting, season.
   ========================================================================= */
(function () {
  "use strict";
  var D = window.APP_DATA, MODULES = window.MODULES, INBOX = window.DEFENSE_INBOX;

  var DIFF_POINTS = { easy: 30, medium: 50, hard: 80 };
  var DIFF_LABEL  = { easy: "Easy", medium: "Medium", hard: "Hard" };

  // Run state
  var state = {
    started: false,
    team: null,
    pre: {}, preConf: {},
    post: {}, postConf: {},
    feedback: {},
    missionDone: {},   // moduleId -> true
    keys: {},          // moduleId -> true (collected key)
    hints: {},         // moduleId -> number of hints used
    points: 0,
    streak: 0, maxStreak: 0,
    loot: 0, damage: 0,
    defense: {},       // mailId -> {action, correct}
    defenseScore: 0
  };
  try { var saved = sessionStorage.getItem("imoah"); if (saved) state = Object.assign(state, JSON.parse(saved)); } catch (e) {}
  function save(){ try{ sessionStorage.setItem("imoah", JSON.stringify(state)); }catch(e){} }
  function addPoints(n){ state.points = Math.max(0, state.points + n); }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  function toast(msg){ var t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(function(){t.classList.remove("show");},2200); }

  // Modules playable in this phase, and keys collected among them
  function availableModules(){ return MODULES.filter(function(m){ return m.available; }); }
  function keysCollected(){ return availableModules().filter(function(m){ return state.keys[m.id]; }).length; }

  /* ---------- Navigation ---------- */
  function show(id){
    $$(".section").forEach(function(s){ s.classList.toggle("active", s.id===id); });
    $$(".nav a").forEach(function(a){ a.classList.toggle("active", a.getAttribute("data-sec")===id); });
    window.scrollTo({top:0,behavior:"smooth"});
    updateProgress();
  }
  function updateProgress(){
    var total = 4; // survey, modules, defense, result
    var done = 0;
    if (Object.keys(state.pre).length) done++;
    if (Object.keys(state.missionDone).length) done++;
    if (Object.keys(state.defense).length) done++;
    if (Object.keys(state.post).length) done++;
    $("#progbar").style.width = Math.round(done/total*100) + "%";
  }

  /* ---------- Shared gamification widgets ---------- */
  function scoreStripHTML(){
    var avail = availableModules().length;
    return '<div class="scorestrip">'+
      '<div class="score-chip"><span class="sc-ic">⭐</span><b>'+state.points+'</b> points</div>'+
      '<div class="score-chip"><span class="sc-ic">🔑</span><b>'+keysCollected()+' / '+avail+'</b> keys</div>'+
      '<div class="score-chip"><span class="sc-ic">🔥</span><b>'+state.maxStreak+'</b> best streak</div>'+
    '</div>';
  }

  function keyringHTML(){
    var avail = availableModules();
    var slots = avail.map(function(m){
      var got = !!state.keys[m.id];
      return '<div class="keyslot'+(got?" got":"")+'" title="'+m.key.name+'">'+
        '<span class="kic">'+(got?m.key.icon:"🔓")+'</span><span class="klabel">'+m.key.name+'</span></div>';
    }).join("");
    return '<div class="keyring"><div class="kr-head">🔑 Your keyring – collect all keys to reach the company gate</div>'+
      '<div class="kr-slots">'+slots+'</div></div>';
  }

  /* =========================================================================
     START
     ========================================================================= */
  function renderStart(){
    var sec = $("#start");
    var teams = D.config.teams.map(function(t){ return '<option>'+t+'</option>'; }).join("");
    sec.innerHTML =
      '<div class="hero"><div class="wrap">'+
        '<div class="eyebrow" style="color:#9fc0e4">'+D.config.company+'</div>'+
        '<h1>'+D.config.title+'</h1>'+
        '<p class="lead">'+D.config.subtitle+'. For a moment you step into the role of an attacker – not to attack, but to <b>see through</b> attacks and then fend them off as an employee.</p>'+
        '<p class="tagline">“Whoever thinks like an attacker makes safer decisions every day.”</p>'+
        '<div class="chips">'+MODULES.map(function(m){return '<span class="chip">'+m.icon+' '+m.title+'</span>';}).join("")+'</div>'+
      '</div></div>'+
      '<div class="wrap" style="margin-top:28px">'+
        '<div class="grid two">'+
          '<div class="card"><h3>How it works</h3><ol style="padding-left:18px;color:var(--ink-soft)">'+
            '<li><b>Pre-survey</b> – no solutions, with self-assessment</li>'+
            '<li><b>Modules</b> – expert video → hacker mission → earn a <b>key</b> + badge + points</li>'+
            '<li><b>Company gate</b> – all keys together open the gate</li>'+
            '<li><b>Defense level</b> – spot and report attacks, build a streak</li>'+
            '<li><b>Post-survey</b> – evaluation & team leaderboard</li>'+
          '</ol></div>'+
          '<div class="card"><h3>Your team</h3>'+
            '<p class="note">You play in a team of two. Choose your team – only the top three teams are shown publicly at the end.</p>'+
            '<label style="font-weight:600;font-size:14px">Team<br><select id="teamSel" style="margin-top:6px;width:100%;padding:11px;border-radius:10px;border:1px solid var(--line);font-family:inherit;font-size:15px">'+teams+'</select></label>'+
            '<div style="margin-top:18px"><button class="btn" id="goStart">Start training →</button></div>'+
            '<p class="note" style="margin-top:12px">Season: <b>'+D.config.season+'</b>. The pre-survey is mandatory before the modules are unlocked.</p>'+
          '</div>'+
        '</div>'+
      '</div>';
    $("#goStart").onclick = function(){
      state.team = $("#teamSel").value; state.started = true; save();
      toast("Good luck, "+state.team+"!"); show("survey-pre");
    };
  }

  /* =========================================================================
     SURVEY (generic for pre / post)  –  pre = Guided, post = Assessment
     ========================================================================= */
  function renderSurvey(which){
    var isPre = which === "pre";
    var sec = $(isPre ? "#survey-pre" : "#survey-post");
    var qs = D.surveys[which];
    var store = isPre ? state.pre : state.post;
    var conf = isPre ? state.preConf : state.postConf;

    var html = '<div class="wrap">'+
      '<div class="eyebrow">'+(isPre?"Step 1 · Before · Guided mode":"Final step · After · Assessment mode")+'</div>'+
      '<h2>'+(isPre?"How would you rate yourself?":"To finish: the same situations, rethought")+'</h2>'+
      '<p class="lead">There are no visible solutions here. Answer each question and tell us how sure you are.</p>';

    if (isPre){
      html += '<div class="q-card"><div class="topic">About you</div>';
      D.surveys.profileQuestions.forEach(function(pq){
        html += '<p style="font-weight:600;margin:14px 0 8px">'+pq.text+'</p><div class="q-opts">';
        pq.options.forEach(function(o,i){
          html += '<label class="q-opt"><input type="radio" name="'+pq.id+'" value="'+i+'"><span>'+o+'</span></label>';
        });
        html += '</div>';
      });
      html += '</div>';
    }

    qs.forEach(function(q, qi){
      html += '<div class="q-card" data-qid="'+q.id+'">'+
        '<div class="topic">'+q.topic+'</div>'+
        '<p style="font-weight:600;margin:6px 0 2px">'+(qi+1)+'. '+q.text+'</p>'+
        '<div class="q-opts">';
      q.options.forEach(function(o,i){
        var sel = store[q.id]===i ? " sel":"";
        html += '<label class="q-opt'+sel+'"><input type="radio" name="'+q.id+'" value="'+i+'"'+(store[q.id]===i?" checked":"")+'><span>'+o+'</span></label>';
      });
      html += '</div>'+
        '<div class="confidence"><div class="note" style="margin-bottom:6px">How sure are you?</div><div class="scale" data-conf="'+q.id+'">';
      D.surveys.confidenceLabels.forEach(function(lab,i){
        var cs = conf[q.id]===i?" sel":"";
        html += '<button class="'+cs.trim()+'" data-v="'+i+'">'+lab+'</button>';
      });
      html += '</div></div></div>';
    });

    if (!isPre){
      html += '<div class="q-card"><div class="topic">Feedback</div>';
      D.surveys.feedback.forEach(function(fb){
        html += '<p style="font-weight:600;margin:14px 0 6px">'+fb.text+'</p><div class="scale" data-fb="'+fb.id+'">';
        for (var i=1;i<=5;i++){ var s=state.feedback[fb.id]===i?" sel":""; html+='<button class="'+s.trim()+'" data-v="'+i+'">'+i+'</button>'; }
        html += '</div>';
      });
      html += '</div>';
    }

    html += '<button class="btn" id="surveyNext">'+(isPre?"Continue to the modules →":"See the evaluation →")+'</button>'+
            '<p class="note" style="margin-top:10px">Your answers stay private. For the test evaluation, the facilitator can export all answers anonymised as a CSV.</p>'+
            '</div>';
    sec.innerHTML = html;

    // Events
    $$(".q-opt input", sec).forEach(function(inp){
      inp.onchange = function(){
        store[inp.name] = parseInt(inp.value,10);
        var card = inp.closest(".q-card");
        $$(".q-opt", card).forEach(function(l){ l.classList.remove("sel"); });
        inp.closest(".q-opt").classList.add("sel");
        save();
      };
    });
    $$(".scale[data-conf]", sec).forEach(function(sc){
      $$("button", sc).forEach(function(b){ b.onclick=function(){
        conf[sc.getAttribute("data-conf")] = parseInt(b.getAttribute("data-v"),10);
        $$("button",sc).forEach(function(x){x.classList.remove("sel");}); b.classList.add("sel"); save();
      };});
    });
    $$(".scale[data-fb]", sec).forEach(function(sc){
      $$("button", sc).forEach(function(b){ b.onclick=function(){
        state.feedback[sc.getAttribute("data-fb")] = parseInt(b.getAttribute("data-v"),10);
        $$("button",sc).forEach(function(x){x.classList.remove("sel");}); b.classList.add("sel"); save();
      };});
    });

    $("#surveyNext", sec).onclick = function(){
      var need = qs.length, got = qs.filter(function(q){return store[q.id]!=null;}).length;
      if (got < need){ toast("Please answer all "+need+" questions ("+got+"/"+need+")."); return; }
      save(); updateProgress();
      if (isPre){ toast("Pre-survey done – modules unlocked!"); renderModules(); show("modules"); }
      else { renderResult(); show("result"); }
    };
  }

  /* =========================================================================
     MODULES – overview
     ========================================================================= */
  function isUnlocked(m){
    if (!m.available) return false;
    if (m.requiresKeys && keysCollected() < m.requiresKeys) return false;
    return true;
  }

  function renderModules(){
    var locked = !Object.keys(state.pre).length;
    var sec = $("#modules");
    if (locked){
      sec.innerHTML = '<div class="wrap"><div class="gate card"><div class="ic">🔒</div><h2>The pre-survey comes first</h2>'+
        '<p class="lead" style="margin:0 auto">The modules are unlocked only after the pre-survey.</p>'+
        '<div style="margin-top:16px"><button class="btn" onclick="document.querySelector(\'[data-sec=survey-pre]\').click()">Go to the survey</button></div></div></div>';
      return;
    }
    var cards = MODULES.map(function(m){
      var done = state.missionDone[m.id];
      var unlocked = isUnlocked(m);
      var diff = m.difficulty || "medium";
      var statusBadge = unlocked
        ? '<span class="badge on">'+(done?"✓ completed":"playable")+'</span>'
        : (m.available
            ? '<span class="badge off">Locked: needs '+m.requiresKeys+' keys</span>'
            : '<span class="badge off">Test phase: locked</span>');
      return '<div class="card'+(unlocked?"":" lock")+'">'+
        '<h3><span class="ic">'+m.icon+'</span> Module '+m.number+'</h3>'+
        '<p style="font-weight:700;margin:0 0 4px">'+m.title+'</p>'+
        '<p class="note">'+m.why+'</p>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">'+
          statusBadge+
          '<span class="badge diff '+diff+'">'+DIFF_LABEL[diff]+'</span>'+
          '<span class="badge key">'+m.key.icon+' '+m.key.name+'</span>'+
          (done?'<span class="badge award">'+m.badge.icon+' '+m.badge.name+'</span>':'')+
        '</div>'+
        (unlocked?'<button class="btn sm" data-mod="'+m.id+'">'+(done?"View again":"Start module")+' →</button>':'')+
      '</div>';
    }).join("");
    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Step 2 · Modules</div>'+
      '<h2>Five weaknesses in recruiting</h2>'+
      '<p class="lead">For the test phase, modules 1 (phishing) and 3 (CEO fraud) are unlocked. Each module: expert video → hacker mission → reveal, and earns you a key, a badge and points.</p>'+
      scoreStripHTML()+
      keyringHTML()+
      '<div class="bars card" style="margin:18px 0">'+barsHTML()+'</div>'+
      '<div class="grid two">'+cards+'</div>'+
      '<div style="margin-top:22px"><button class="btn alt" id="toDefense">Continue to the defense level →</button></div>'+
      '</div>';
    $$("[data-mod]", sec).forEach(function(b){ b.onclick=function(){ openModule(b.getAttribute("data-mod")); }; });
    $("#toDefense").onclick = function(){ renderDefense(); show("defense"); };
  }

  function barsHTML(){
    var lootPct = Math.min(100, state.loot);
    var dmgPct = Math.min(100, state.damage);
    return '<div class="bar-row"><div class="bar-top"><span>💰 Loot value (CyberCoins)</span><span>'+Math.round(lootPct)+'%</span></div>'+
      '<div class="bar-track"><div class="bar-fill loot" style="width:'+lootPct+'%"></div></div></div>'+
      '<div class="bar-row"><div class="bar-top"><span>🏢 Company damage (fictional CHF)</span><span>'+Math.round(dmgPct)+'%</span></div>'+
      '<div class="bar-track"><div class="bar-fill damage" style="width:'+dmgPct+'%"></div></div></div>'+
      '<p class="note" style="margin:10px 0 0">The values are fictional and only illustrate the order of magnitude – not real market prices.</p>';
  }

  /* =========================================================================
     MODULE – flow (video → mission → reveal)
     ========================================================================= */
  function openModule(id){
    var m = MODULES.filter(function(x){return x.id===id;})[0];
    var sec = $("#module-detail");
    var phase = 0; // 0 video, 1 mission, 2 reveal
    var picks = [];

    function pills(){
      var names=["Expert video","Hacker mission","Reveal"];
      return '<div class="steps">'+names.map(function(n,i){
        var cls = i<phase?"done":(i===phase?"current":"");
        return '<div class="step-pill '+cls+'"><span class="n">'+(i<phase?"✓":(i+1))+'</span>'+n+'</div>';
      }).join("")+'</div>';
    }

    function renderVideo(){
      var v = m.video;
      var media = v.url
        ? (/youtube|youtu\.be|vimeo/.test(v.url)
            ? '<iframe src="'+v.url+'" allowfullscreen></iframe>'
            : '<video controls src="'+v.url+'"></video>')
        : '<div class="placeholder"><div class="play">▶</div><p>Expert video to follow<br><span class="note" style="color:#9fc0e4">'+v.expert+' · '+v.duration+'</span></p></div>';
      var pts = v.points.map(function(p){ return '<li><b>'+p[0]+'</b> '+p[1]+'</li>'; }).join("");
      sec.innerHTML = '<div class="wrap">'+pills()+
        '<div class="eyebrow">Module '+m.number+' · '+DIFF_LABEL[m.difficulty||"medium"]+' · reward '+m.key.icon+' '+m.key.name+'</div><h2>'+m.icon+' '+m.title+'</h2>'+
        '<div class="grid two" style="align-items:start">'+
          '<div class="video-frame">'+media+'</div>'+
          '<div class="card"><h3>What this is about</h3><p class="note">'+v.summary+'</p><ul style="padding-left:18px;color:var(--ink-soft)">'+pts+'</ul></div>'+
        '</div>'+
        '<div style="margin-top:20px"><button class="btn" id="toMission">Continue to the hacker mission →</button> '+
        '<button class="btn ghost" style="border-color:var(--line);color:var(--ink-soft)" id="backMods">Back to overview</button></div>'+
        '</div>';
      $("#toMission").onclick=function(){ phase=1; renderMission(); };
      $("#backMods").onclick=function(){ renderModules(); show("modules"); };
    }

    function renderMission(){
      var mi = m.mission, stepIdx = 0;
      function drawStep(){
        var st = mi.steps[stepIdx];
        var opts = st.options.map(function(o,i){
          return '<button class="opt" data-i="'+i+'">'+o.t+'</button>';
        }).join("");
        var hintBtn = st.hint ? '<button class="hint-btn" id="hintBtn">💡 Show hint (−10 pts)</button><div id="hintBox"></div>' : '';
        var body = '<div class="mission-q mono">root@talentbridge:~$ target = "'+mi.target+'"</div>'+
          '<p class="mission-q">'+(stepIdx+1)+'/'+mi.steps.length+' · '+st.q+'</p>'+opts+
          hintBtn+
          '<div class="risk-meter"><div id="riskfill"></div></div>'+
          '<p class="note" style="color:#8fb4da;margin-top:8px">Tip: choose what makes the attack most dangerous – you'+"'"+'ll then see exactly how that could have been recognised.</p>';
        $("#termbody").innerHTML = body;
        if (st.hint){
          $("#hintBtn").onclick = function(){
            state.hints[m.id] = (state.hints[m.id]||0) + 1; save();
            $("#hintBox").innerHTML = '<div class="hint-text">'+st.hint+'</div>';
            this.disabled = true; this.style.opacity = .55;
            toast("Hint used – −10 points");
          };
        }
        $$("#termbody .opt").forEach(function(btn){
          btn.onclick=function(){
            var i=parseInt(btn.getAttribute("data-i"),10); var opt=st.options[i];
            $$("#termbody .opt").forEach(function(b){b.classList.remove("pick");}); btn.classList.add("pick");
            $("#riskfill").style.width = Math.round(opt.risk/3*100)+"%";
            picks.push(opt);
            var hb = $("#hintBtn"); if (hb) hb.disabled = true;
            setTimeout(function(){
              // short per-step micro-reveal
              var note = el("div","reveal"); note.style.marginTop="12px";
              note.innerHTML = '<b style="color:var(--mp-navy)">Giveaway:</b> '+opt.why;
              $("#termbody").appendChild(note);
              var nx = el("button","btn alt", (stepIdx<mi.steps.length-1?"Next step →":"Score the mission →"));
              nx.style.marginTop="14px";
              nx.onclick=function(){ stepIdx++; if(stepIdx<mi.steps.length) drawStep(); else finishMission(); };
              $("#termbody").appendChild(nx);
              $$("#termbody .opt").forEach(function(b){ b.disabled=true; b.style.opacity=.6; });
            }, 250);
          };
        });
      }
      sec.innerHTML = '<div class="wrap">'+pills()+
        '<div class="terminal"><div class="bar"><span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>'+
          '<span class="mono" style="margin-left:8px">mission // '+m.title+'</span></div>'+
        '<div class="body"><h3>🎯 Objective: '+mi.target+'</h3><p style="color:#9fc0e4">'+mi.intro+'</p>'+
          '<div id="termbody"></div>'+
        '</div></div></div>';
      drawStep();
    }

    function finishMission(){
      var firstTime = !state.missionDone[m.id];
      // meters (fictional) – based on assessed risk
      var score = picks.reduce(function(a,o){return a+o.risk;},0);
      var maxScore = m.mission.steps.length*3;
      var gain = Math.round(score/maxScore * (12 + m.lootLevel*4));
      var earnedPts = 0;
      if (firstTime){
        state.loot = Math.min(100, state.loot + gain);
        state.damage = Math.min(100, state.damage + Math.round(gain*1.3));
        // points: difficulty base minus hints used (floor 10), plus key + badge
        var base = DIFF_POINTS[m.difficulty||"medium"];
        var hintsUsed = state.hints[m.id]||0;
        earnedPts = Math.max(10, base - hintsUsed*10);
        addPoints(earnedPts);
        state.keys[m.id] = true;        // collect the key
      }
      state.missionDone[m.id] = true; save();
      if (firstTime) toast("+"+earnedPts+" points · "+m.key.icon+" "+m.key.name+" collected!");
      phase=2; renderReveal(firstTime, earnedPts);
    }

    function renderReveal(firstTime, earnedPts){
      var r = m.reveal;
      var rewardLine = firstTime
        ? '<div class="reward-banner"><span>'+m.key.icon+'</span> Key collected: <b>'+m.key.name+'</b> &nbsp;·&nbsp; <span>'+m.badge.icon+'</span> Badge unlocked: <b>'+m.badge.name+'</b> &nbsp;·&nbsp; <span>⭐</span> <b>+'+earnedPts+'</b> points</div>'
        : '<div class="reward-banner done"><span>'+m.badge.icon+'</span> Already completed – <b>'+m.badge.name+'</b> earned, key in your ring.</div>';
      sec.innerHTML = '<div class="wrap">'+pills()+
        '<div class="eyebrow">Moment of truth</div>'+
        '<h2>'+m.icon+' '+m.title+' – reveal</h2>'+
        rewardLine+
        '<div class="card">'+barsHTML()+'</div>'+
        '<div class="reveal"><h3>'+r.question+'</h3><p>'+r.answer+'</p>'+
          '<p style="font-weight:700;margin-bottom:6px">This would have interrupted the attack:</p>'+
          '<ul class="stops">'+r.stops.map(function(s){return '<li>✅ '+s+'</li>';}).join("")+'</ul>'+
        '</div>'+
        '<div style="margin-top:20px"><button class="btn" id="revBack">Back to the modules →</button></div>'+
        '</div>';
      $("#revBack").onclick=function(){ renderModules(); show("modules"); };
    }

    renderVideo(); show("module-detail");
  }

  /* =========================================================================
     DEFENSE LEVEL
     ========================================================================= */
  function renderDefense(){
    var sec = $("#defense");
    var html = '<div class="wrap">'+
      '<div class="eyebrow">Step 3 · Defense</div>'+
      '<h2>🛡️ Now you guard the gate</h2>'+
      '<p class="lead">Your inbox contains attacks from the modules – but also harmless, genuine messages. Not every unusual message is an attack. Decide correctly for each one – a run of correct calls builds a streak bonus.</p>'+
      '<div class="combo-bar" id="comboBar">'+comboText()+'</div>'+
      '<div class="inbox">';
    INBOX.forEach(function(mail){
      var ans = state.defense[mail.id];
      html += '<div class="mail'+(ans?" answered":"")+'" data-mail="'+mail.id+'">'+
        '<div class="head"><span class="from">'+mail.from+'</span></div>'+
        '<div class="subj">'+mail.subject+'</div><div class="prev">'+mail.preview+'</div>'+
        '<div class="actions">'+
          '<button data-act="process">Process</button>'+
          '<button data-act="verify">Verify (2nd channel)</button>'+
          '<button data-act="report">Report</button>'+
          '<button data-act="reject">Reject</button>'+
        '</div><div class="resbox"></div></div>';
    });
    html += '</div>'+
      '<div style="margin-top:22px"><button class="btn alt" id="toPost">Continue to the post-survey →</button></div>'+
      '</div>';
    sec.innerHTML = html;

    $$(".mail", sec).forEach(function(mailEl){
      var id = mailEl.getAttribute("data-mail");
      var mail = INBOX.filter(function(x){return x.id===id;})[0];
      $$(".actions button", mailEl).forEach(function(btn){
        btn.onclick=function(){
          if (state.defense[id]) return;
          var act = btn.getAttribute("data-act");
          var correct = (act===mail.action);
          state.defense[id] = {action:act, correct:correct};
          var gained = 0;
          if (correct){
            state.streak++; state.maxStreak = Math.max(state.maxStreak, state.streak);
            var bonus = state.streak>=3 ? 10 : 0;
            gained = 15 + bonus; addPoints(gained);
          } else {
            state.streak = 0;
          }
          state.defenseScore = Object.keys(state.defense).filter(function(k){return state.defense[k].correct;}).length;
          save();
          mailEl.classList.add("answered");
          var box = $(".resbox", mailEl);
          box.innerHTML = '<div class="result '+(correct?"ok":"bad")+'">'+
            (correct?"✅ Correct (+"+gained+" pts). ":"✖ Not optimal – streak reset. ")+
            '<b>'+mail.type+'.</b> '+mail.why+'</div>';
          $$(".actions button", mailEl).forEach(function(b){b.disabled=true;b.style.opacity=.5;});
          $("#comboBar").innerHTML = comboText();
          updateProgress();
        };
      });
    });
    $("#toPost").onclick=function(){
      if (Object.keys(state.defense).length < INBOX.length){ toast("Please decide on every message ("+Object.keys(state.defense).length+"/"+INBOX.length+")."); return; }
      renderSurvey("post"); show("survey-post");
    };
  }
  function comboText(){
    var fire = state.streak>=3 ? " 🔥 bonus active!" : "";
    return '<span>Current streak: <b>'+state.streak+'</b> in a row'+fire+'</span>'+
      '<span style="margin-left:auto">⭐ <b>'+state.points+'</b> points</span>';
  }

  /* =========================================================================
     EVALUATION + LEADERBOARD
     ========================================================================= */
  function renderResult(){
    var sec = $("#result");
    var defPct = Math.round(state.defenseScore / INBOX.length * 100);
    var availCount = availableModules().length;
    var keysGot = keysCollected();
    var gateOpen = availCount>0 && keysGot>=availCount;

    // Team leaderboard: own team uses real points, others are demo values
    var rows = D.config.teams.map(function(t){
      var base = t===state.team ? state.points
                                : (90 + (hash(t)%140));
      return {team:t, score: base, me: t===state.team};
    }).sort(function(a,b){return b.score-a.score;});
    var maxScore = Math.max.apply(null, rows.map(function(r){return r.score;})) || 1;
    var top = rows.slice(0, D.config.topTeamsVisible);

    // Earned badges (one per completed available module)
    var badges = availableModules().filter(function(m){return state.missionDone[m.id];})
      .map(function(m){ return '<div class="badge-tile"><span class="bt-ic">'+m.badge.icon+'</span><span>'+m.badge.name+'</span></div>'; }).join("");
    if (!badges) badges = '<p class="note">No module badges yet – play a module to earn one.</p>';

    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Evaluation · Season '+D.config.season+'</div>'+
      '<h2>Well done, '+(state.team||"")+'! 🎉</h2>'+
      '<p class="lead">Only you see your personal result. Only the top '+D.config.topTeamsVisible+' teams are shown publicly.</p>'+
      // Company gate
      '<div class="company-gate '+(gateOpen?"open":"closed")+'">'+
        '<div class="cg-doors"><div class="cg-door l"></div><div class="cg-door r"></div><div class="cg-icon">'+(gateOpen?"🏢":"🚪")+'</div></div>'+
        '<div class="cg-text"><h3>'+(gateOpen?"Company gate unlocked":"Company gate still closed")+'</h3>'+
          '<p class="note">You collected <b>'+keysGot+' / '+availCount+'</b> keys. '+(gateOpen?"With every key, you have seen through every weakness in this phase.":"Finish the remaining modules to collect all keys.")+'</p>'+
          keyringMini()+
        '</div>'+
      '</div>'+
      '<div class="grid three" style="margin:18px 0">'+
        statTile("⭐", String(state.points), "total points") +
        statTile("🛡️", defPct+"%", "defense correct") +
        statTile("🔥", String(state.maxStreak), "best streak") +
      '</div>'+
      '<div class="card"><h3>Your badges</h3><div class="badge-grid">'+badges+'</div></div>'+
      '<div class="card" style="margin-top:18px"><h3>The damage you prevented</h3>'+
        '<p class="note">In the defense level you handled '+state.defenseScore+' of '+INBOX.length+' messages correctly. In reality, every correct decision prevents possible damage – from data loss to business disruption.</p></div>'+
      '<h3 style="margin-top:28px">🏆 Top teams</h3><div class="lb">'+
        top.map(function(r,i){ return '<div class="lb-row top'+(i+1)+'">'+
          '<div class="lb-rank">'+(i+1)+'</div><div class="lb-name">'+r.team+(r.me?' <span class="badge on">you</span>':'')+'</div>'+
          '<div class="lb-score">'+r.score+'</div>'+
          '<div class="lb-bar"><div style="width:'+Math.round(r.score/maxScore*100)+'%"></div></div></div>'; }).join("")+
      '</div>'+
      (top.some(function(r){return r.me;})?'<p class="note" style="margin-top:10px">Strong – your team is in the top '+D.config.topTeamsVisible+'!</p>':'<p class="note" style="margin-top:10px">Your rank stays private. Only the top '+D.config.topTeamsVisible+' are shown.</p>')+
      '<div style="margin-top:26px" class="card"><h3>For the test facilitator</h3>'+
        '<p class="note">All answers (pre/post incl. self-assessment, defense, feedback, points) can be exported anonymised. A reset starts a fresh season run on this device.</p>'+
        '<button class="btn sm" id="expBtn">📊 Export results as CSV</button> '+
        '<button class="btn sm ghost" id="resetBtn" style="border:1px solid var(--line);color:var(--ink-soft);background:#fff">↻ Reset for new season</button></div>'+
      '</div>';
    $("#expBtn").onclick = exportCSV;
    $("#resetBtn").onclick = function(){
      if (!confirm("Reset all progress on this device for a new season run?")) return;
      try { sessionStorage.removeItem("imoah"); } catch(e){}
      location.reload();
    };
  }
  function keyringMini(){
    return '<div class="kr-slots mini">'+availableModules().map(function(m){
      var got=!!state.keys[m.id];
      return '<span class="keyslot '+(got?"got":"")+'" title="'+m.key.name+'"><span class="kic">'+(got?m.key.icon:"🔓")+'</span></span>';
    }).join("")+'</div>';
  }
  function statTile(ic,big,label){
    return '<div class="card" style="text-align:center"><div style="font-size:30px">'+ic+'</div>'+
      '<div style="font-size:26px;font-weight:800;color:var(--mp-navy)">'+big+'</div>'+
      '<div class="note">'+label+'</div></div>';
  }
  function hash(s){ var h=0; for(var i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i);h|=0;} return Math.abs(h); }

  /* ---------- CSV export ---------- */
  function exportCSV(){
    var rows = [["field","value"]];
    rows.push(["team", state.team||""]);
    rows.push(["season", D.config.season]);
    rows.push(["points", state.points]);
    rows.push(["max_streak", state.maxStreak]);
    rows.push(["keys_collected", keysCollected()+"/"+availableModules().length]);
    D.surveys.pre.forEach(function(q){ rows.push(["pre_"+q.id, labelOf(q,state.pre[q.id])]); rows.push(["pre_conf_"+q.id, state.preConf[q.id]!=null?state.preConf[q.id]+1:""]); rows.push(["pre_correct_"+q.id, state.pre[q.id]===q.correct?"1":"0"]); });
    D.surveys.post.forEach(function(q){ rows.push(["post_"+q.id, labelOf(q,state.post[q.id])]); rows.push(["post_conf_"+q.id, state.postConf[q.id]!=null?state.postConf[q.id]+1:""]); rows.push(["post_correct_"+q.id, state.post[q.id]===q.correct?"1":"0"]); });
    MODULES.forEach(function(m){ rows.push(["mod_done_"+m.id, state.missionDone[m.id]?"1":"0"]); rows.push(["mod_key_"+m.id, state.keys[m.id]?"1":"0"]); rows.push(["mod_hints_"+m.id, state.hints[m.id]||0]); });
    INBOX.forEach(function(m){ var a=state.defense[m.id]; rows.push(["def_"+m.id, a?a.action:""]); rows.push(["def_correct_"+m.id, a&&a.correct?"1":"0"]); });
    D.surveys.feedback.forEach(function(f){ rows.push(["fb_"+f.id, state.feedback[f.id]||""]); });
    var csv = rows.map(function(r){ return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(","); }).join("\n");
    var blob = new Blob(["﻿"+csv], {type:"text/csv;charset=utf-8"});
    var a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download = "imoah_results_"+(state.team||"team").replace(/\s+/g,"_")+".csv"; a.click();
    toast("CSV exported.");
  }
  function labelOf(q,i){ return i!=null ? q.options[i] : ""; }

  /* =========================================================================
     INIT
     ========================================================================= */
  function buildNav(){
    var items = [
      ["start","Start"],["survey-pre","Survey"],["modules","Modules"],
      ["defense","Defense"],["survey-post","Finish"]
    ];
    $("#nav").innerHTML = items.map(function(it){ return '<a href="#" data-sec="'+it[0]+'">'+it[1]+'</a>'; }).join("");
    $$("#nav a").forEach(function(a){ a.onclick=function(e){ e.preventDefault(); var id=a.getAttribute("data-sec");
      if(id==="modules") renderModules();
      if(id==="defense") renderDefense();
      if(id==="survey-pre") renderSurvey("pre");
      if(id==="survey-post"){ if(!Object.keys(state.missionDone).length && !Object.keys(state.defense).length){ toast("Play the modules and the defense level first."); } renderSurvey("post"); }
      show(id);
    };});
  }

  document.addEventListener("DOMContentLoaded", function(){
    buildNav();
    renderStart();
    renderSurvey("pre");
    show("start");
    updateProgress();
  });
})();
