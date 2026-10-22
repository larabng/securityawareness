/* =========================================================================
   Inside the Mind of a Hacker – app logic (prototype for the test phase)
   Vanilla JS, no build needed. Progress kept in memory (sessionStorage),
   evaluation via CSV export for the test facilitator.
   ========================================================================= */
(function () {
  "use strict";
  var D = window.APP_DATA, MODULES = window.MODULES, INBOX = window.DEFENSE_INBOX;

  // Run state
  var state = {
    started: false,
    team: null,
    pre: {}, preConf: {},
    post: {}, postConf: {},
    feedback: {},
    missionDone: {},   // moduleId -> true
    loot: 0, damage: 0,
    defense: {},       // mailId -> {action, correct}
    defenseScore: 0
  };
  try { var saved = sessionStorage.getItem("imoah"); if (saved) state = JSON.parse(saved); } catch (e) {}
  function save(){ try{ sessionStorage.setItem("imoah", JSON.stringify(state)); }catch(e){} }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, cls, html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

  function toast(msg){ var t=$("#toast"); t.textContent=msg; t.classList.add("show"); setTimeout(function(){t.classList.remove("show");},2200); }

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
            '<li><b>Modules</b> – expert video → hacker mission → two meters → reveal</li>'+
            '<li><b>Defense level</b> – spot and report attacks in the inbox</li>'+
            '<li><b>Post-survey</b> – evaluation & team leaderboard</li>'+
          '</ol></div>'+
          '<div class="card"><h3>Your team</h3>'+
            '<p class="note">You play in a team of two. Choose your team – only the top three teams are shown publicly at the end.</p>'+
            '<label style="font-weight:600;font-size:14px">Team<br><select id="teamSel" style="margin-top:6px;width:100%;padding:11px;border-radius:10px;border:1px solid var(--line);font-family:inherit;font-size:15px">'+teams+'</select></label>'+
            '<div style="margin-top:18px"><button class="btn" id="goStart">Start training →</button></div>'+
            '<p class="note" style="margin-top:12px">The pre-survey is mandatory before the modules are unlocked.</p>'+
          '</div>'+
        '</div>'+
      '</div>';
    $("#goStart").onclick = function(){
      state.team = $("#teamSel").value; state.started = true; save();
      toast("Good luck, "+state.team+"!"); show("survey-pre");
    };
  }

  /* =========================================================================
     SURVEY (generic for pre / post)
     ========================================================================= */
  function renderSurvey(which){
    var isPre = which === "pre";
    var sec = $(isPre ? "#survey-pre" : "#survey-post");
    var qs = D.surveys[which];
    var store = isPre ? state.pre : state.post;
    var conf = isPre ? state.preConf : state.postConf;

    var html = '<div class="wrap">'+
      '<div class="eyebrow">'+(isPre?"Step 1 · Before":"Final step · After")+'</div>'+
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
      return '<div class="card'+(m.available?"":" lock")+'">'+
        '<h3><span class="ic">'+m.icon+'</span> Module '+m.number+'</h3>'+
        '<p style="font-weight:700;margin:0 0 4px">'+m.title+'</p>'+
        '<p class="note">'+m.why+'</p>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">'+
          (m.available?'<span class="badge on">'+(done?"✓ completed":"playable")+'</span>':'<span class="badge off">Test phase: locked</span>')+
          '<span class="badge loot">Loot: '+m.loot+'</span>'+
        '</div>'+
        (m.available?'<button class="btn sm" data-mod="'+m.id+'">'+(done?"View again":"Start module")+' →</button>':'')+
      '</div>';
    }).join("");
    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Step 2 · Modules</div>'+
      '<h2>Five weaknesses in recruiting</h2>'+
      '<p class="lead">For the test phase, modules 1 (phishing) and 3 (CEO fraud) are unlocked. Each module: expert video → hacker mission → reveal.</p>'+
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
        '<div class="eyebrow">Module '+m.number+'</div><h2>'+m.icon+' '+m.title+'</h2>'+
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
        var body = '<div class="mission-q mono">root@talentbridge:~$ target = "'+mi.target+'"</div>'+
          '<p class="mission-q">'+(stepIdx+1)+'/'+mi.steps.length+' · '+st.q+'</p>'+opts+
          '<div class="risk-meter"><div id="riskfill"></div></div>'+
          '<p class="note" style="color:#8fb4da;margin-top:8px">Tip: choose what makes the attack most dangerous – you'+"'"+'ll then see exactly how that could have been recognised.</p>';
        $("#termbody").innerHTML = body;
        $$("#termbody .opt").forEach(function(btn){
          btn.onclick=function(){
            var i=parseInt(btn.getAttribute("data-i"),10); var opt=st.options[i];
            $$("#termbody .opt").forEach(function(b){b.classList.remove("pick");}); btn.classList.add("pick");
            $("#riskfill").style.width = Math.round(opt.risk/3*100)+"%";
            picks.push(opt);
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
      // raise meters (fictional) – based on assessed risk
      var score = picks.reduce(function(a,o){return a+o.risk;},0);
      var maxScore = m.mission.steps.length*3;
      var gain = Math.round(score/maxScore * (12 + m.lootLevel*4));
      if (!state.missionDone[m.id]){
        state.loot = Math.min(100, state.loot + gain);
        state.damage = Math.min(100, state.damage + Math.round(gain*1.3));
      }
      state.missionDone[m.id] = true; save();
      phase=2; renderReveal();
    }

    function renderReveal(){
      var r = m.reveal;
      sec.innerHTML = '<div class="wrap">'+pills()+
        '<div class="eyebrow">Moment of truth</div>'+
        '<h2>'+m.icon+' '+m.title+' – reveal</h2>'+
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
      '<h2>🛡️ Now you are the staff</h2>'+
      '<p class="lead">Your inbox contains attacks from the modules – but also harmless, genuine messages. Not every unusual message is an attack. Decide correctly for each one.</p>'+
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
          var act = btn.getAttribute("data-act");
          var correct = (act===mail.action);
          state.defense[id] = {action:act, correct:correct};
          state.defenseScore = Object.keys(state.defense).filter(function(k){return state.defense[k].correct;}).length;
          save();
          mailEl.classList.add("answered");
          var box = $(".resbox", mailEl);
          box.innerHTML = '<div class="result '+(correct?"ok":"bad")+'">'+
            (correct?"✅ Correct. ":"✖ Not optimal. ")+
            '<b>'+mail.type+'.</b> '+mail.why+'</div>';
          $$(".actions button", mailEl).forEach(function(b){b.disabled=true;b.style.opacity=.5;});
          updateProgress();
        };
      });
    });
    $("#toPost").onclick=function(){
      if (Object.keys(state.defense).length < INBOX.length){ toast("Please decide on every message ("+Object.keys(state.defense).length+"/"+INBOX.length+")."); return; }
      renderSurvey("post"); show("survey-post");
    };
  }

  /* =========================================================================
     EVALUATION + LEADERBOARD
     ========================================================================= */
  function renderResult(){
    var sec = $("#result");
    // rough learning gain: share where self-assessment matches performance (demo)
    var defPct = Math.round(state.defenseScore / INBOX.length * 100);

    // Fictional team leaderboard: own team real, others as demo values
    var rows = D.config.teams.map(function(t){
      var base = t===state.team ? (40 + state.defenseScore*8 + Object.keys(state.missionDone).length*6)
                                : (35 + (hash(t)%45));
      return {team:t, score: Math.min(100, base), me: t===state.team};
    }).sort(function(a,b){return b.score-a.score;});
    var top = rows.slice(0, D.config.topTeamsVisible);

    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Evaluation</div>'+
      '<h2>Well done, '+(state.team||"")+'! 🎉</h2>'+
      '<p class="lead">Only you see your personal result. Only the top '+D.config.topTeamsVisible+' teams are shown publicly.</p>'+
      '<div class="grid three" style="margin:18px 0">'+
        statTile("🛡️", defPct+"%", "fended off correctly") +
        statTile("🧩", Object.keys(state.missionDone).length+"/"+MODULES.filter(function(m){return m.available;}).length, "modules played") +
        statTile("🏅", (defPct>=80?"Cyber Champion":defPct>=50?"Vigilant":"Keep practising"), "your badge") +
      '</div>'+
      '<div class="card"><h3>The damage you prevented</h3>'+
        '<p class="note">In the defense level you handled '+state.defenseScore+' of '+INBOX.length+' messages correctly. In reality, every correct decision prevents possible damage – from data loss to business disruption.</p></div>'+
      '<h3 style="margin-top:28px">🏆 Top teams</h3><div class="lb">'+
        top.map(function(r,i){ return '<div class="lb-row top'+(i+1)+'">'+
          '<div class="lb-rank">'+(i+1)+'</div><div class="lb-name">'+r.team+(r.me?' <span class="badge on">you</span>':'')+'</div>'+
          '<div class="lb-score">'+r.score+'</div>'+
          '<div class="lb-bar"><div style="width:'+r.score+'%"></div></div></div>'; }).join("")+
      '</div>'+
      (top.some(function(r){return r.me;})?'<p class="note" style="margin-top:10px">Strong – your team is in the top '+D.config.topTeamsVisible+'!</p>':'<p class="note" style="margin-top:10px">Your rank stays private. Only the top '+D.config.topTeamsVisible+' are shown.</p>')+
      '<div style="margin-top:26px" class="card"><h3>For the test facilitator</h3>'+
        '<p class="note">All answers (pre/post incl. self-assessment, defense, feedback) can be exported anonymised.</p>'+
        '<button class="btn sm" id="expBtn">📊 Export results as CSV</button></div>'+
      '</div>';
    $("#expBtn").onclick = exportCSV;
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
    D.surveys.pre.forEach(function(q){ rows.push(["pre_"+q.id, labelOf(q,state.pre[q.id])]); rows.push(["pre_conf_"+q.id, state.preConf[q.id]!=null?state.preConf[q.id]+1:""]); rows.push(["pre_correct_"+q.id, state.pre[q.id]===q.correct?"1":"0"]); });
    D.surveys.post.forEach(function(q){ rows.push(["post_"+q.id, labelOf(q,state.post[q.id])]); rows.push(["post_conf_"+q.id, state.postConf[q.id]!=null?state.postConf[q.id]+1:""]); rows.push(["post_correct_"+q.id, state.post[q.id]===q.correct?"1":"0"]); });
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
