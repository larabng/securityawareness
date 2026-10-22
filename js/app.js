/* =========================================================================
   Inside the Mind of a Hacker – App-Logik (Prototyp für die Testphase)
   Vanilla JS, kein Build nötig. Fortschritt im Speicher (sessionStorage),
   Auswertung per CSV-Export für die Testleitung.
   ========================================================================= */
(function () {
  "use strict";
  var D = window.APP_DATA, MODULES = window.MODULES, INBOX = window.DEFENSE_INBOX;

  // Zustand des Durchlaufs
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
    var total = 4; // Umfrage, Module, Verteidigung, Abschluss
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
        '<p class="lead">'+D.config.subtitle+'. Du schlüpfst kurz in die Rolle einer angreifenden Person – nicht um anzugreifen, sondern um Angriffe zu <b>durchschauen</b> und sie danach als Mitarbeitende:r abzuwehren.</p>'+
        '<p class="tagline">«Wer wie ein Angreifer denkt, entscheidet im Alltag sicherer.»</p>'+
        '<div class="chips">'+MODULES.map(function(m){return '<span class="chip">'+m.icon+' '+m.title+'</span>';}).join("")+'</div>'+
      '</div></div>'+
      '<div class="wrap" style="margin-top:28px">'+
        '<div class="grid two">'+
          '<div class="card"><h3>So läuft es ab</h3><ol style="padding-left:18px;color:var(--ink-soft)">'+
            '<li><b>Vorher-Umfrage</b> – ohne Lösungen, mit Selbsteinschätzung</li>'+
            '<li><b>Module</b> – Expertenvideo → Hacker-Mission → zwei Balken → Auflösung</li>'+
            '<li><b>Verteidigungslevel</b> – Angriffe im Posteingang erkennen und melden</li>'+
            '<li><b>Nachher-Umfrage</b> – Auswertung & Rangliste der Teams</li>'+
          '</ol></div>'+
          '<div class="card"><h3>Dein Team</h3>'+
            '<p class="note">Du spielst in einem Zweierteam. Wähle dein Team – nur die besten drei Teams werden am Ende öffentlich gezeigt.</p>'+
            '<label style="font-weight:600;font-size:14px">Team<br><select id="teamSel" style="margin-top:6px;width:100%;padding:11px;border-radius:10px;border:1px solid var(--line);font-family:inherit;font-size:15px">'+teams+'</select></label>'+
            '<div style="margin-top:18px"><button class="btn" id="goStart">Schulung starten →</button></div>'+
            '<p class="note" style="margin-top:12px">Die Vorher-Umfrage ist Pflicht, bevor die Module freigeschaltet werden.</p>'+
          '</div>'+
        '</div>'+
      '</div>';
    $("#goStart").onclick = function(){
      state.team = $("#teamSel").value; state.started = true; save();
      toast("Viel Erfolg, "+state.team+"!"); show("survey-pre");
    };
  }

  /* =========================================================================
     UMFRAGE (generisch für pre / post)
     ========================================================================= */
  function renderSurvey(which){
    var isPre = which === "pre";
    var sec = $(isPre ? "#survey-pre" : "#survey-post");
    var qs = D.surveys[which];
    var store = isPre ? state.pre : state.post;
    var conf = isPre ? state.preConf : state.postConf;

    var html = '<div class="wrap">'+
      '<div class="eyebrow">'+(isPre?"Schritt 1 · Vorher":"Letzter Schritt · Nachher")+'</div>'+
      '<h2>'+(isPre?"Wie schätzt du dich ein?":"Zum Abschluss: dieselben Situationen, neu gedacht")+'</h2>'+
      '<p class="lead">Es gibt hier keine sichtbaren Lösungen. Beantworte jede Frage und sag dazu, wie sicher du dir bist.</p>';

    if (isPre){
      html += '<div class="q-card"><div class="topic">Über dich</div>';
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
        '<div class="confidence"><div class="note" style="margin-bottom:6px">Wie sicher bist du dir?</div><div class="scale" data-conf="'+q.id+'">';
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

    html += '<button class="btn" id="surveyNext">'+(isPre?"Weiter zu den Modulen →":"Auswertung ansehen →")+'</button>'+
            '<p class="note" style="margin-top:10px">Deine Antworten bleiben privat. Für die Testauswertung kann die Testleitung alle Antworten anonymisiert als CSV exportieren.</p>'+
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
      if (got < need){ toast("Bitte beantworte alle "+need+" Fragen ("+got+"/"+need+")."); return; }
      save(); updateProgress();
      if (isPre){ toast("Vorher-Umfrage erledigt – Module freigeschaltet!"); renderModules(); show("modules"); }
      else { renderResult(); show("result"); }
    };
  }

  /* =========================================================================
     MODULE – Übersicht
     ========================================================================= */
  function renderModules(){
    var locked = !Object.keys(state.pre).length;
    var sec = $("#modules");
    if (locked){
      sec.innerHTML = '<div class="wrap"><div class="gate card"><div class="ic">🔒</div><h2>Zuerst die Vorher-Umfrage</h2>'+
        '<p class="lead" style="margin:0 auto">Die Module werden erst nach der Vorher-Umfrage freigeschaltet.</p>'+
        '<div style="margin-top:16px"><button class="btn" onclick="document.querySelector(\'[data-sec=survey-pre]\').click()">Zur Umfrage</button></div></div></div>';
      return;
    }
    var cards = MODULES.map(function(m){
      var done = state.missionDone[m.id];
      return '<div class="card'+(m.available?"":" lock")+'">'+
        '<h3><span class="ic">'+m.icon+'</span> Modul '+m.number+'</h3>'+
        '<p style="font-weight:700;margin:0 0 4px">'+m.title+'</p>'+
        '<p class="note">'+m.why+'</p>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">'+
          (m.available?'<span class="badge on">'+(done?"✓ abgeschlossen":"spielbar")+'</span>':'<span class="badge off">Testphase: gesperrt</span>')+
          '<span class="badge loot">Beute: '+m.loot+'</span>'+
        '</div>'+
        (m.available?'<button class="btn sm" data-mod="'+m.id+'">'+(done?"Nochmals ansehen":"Modul starten")+' →</button>':'')+
      '</div>';
    }).join("");
    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Schritt 2 · Module</div>'+
      '<h2>Fünf Schwachstellen im Recruiting</h2>'+
      '<p class="lead">Für die Testphase sind die Module 1 (Phishing) und 3 (CEO-Fraud) freigeschaltet. Jedes Modul: Expertenvideo → Hacker-Mission → Auflösung.</p>'+
      '<div class="bars card" style="margin:18px 0">'+barsHTML()+'</div>'+
      '<div class="grid two">'+cards+'</div>'+
      '<div style="margin-top:22px"><button class="btn alt" id="toDefense">Weiter zum Verteidigungslevel →</button></div>'+
      '</div>';
    $$("[data-mod]", sec).forEach(function(b){ b.onclick=function(){ openModule(b.getAttribute("data-mod")); }; });
    $("#toDefense").onclick = function(){ renderDefense(); show("defense"); };
  }

  function barsHTML(){
    var lootPct = Math.min(100, state.loot);
    var dmgPct = Math.min(100, state.damage);
    return '<div class="bar-row"><div class="bar-top"><span>💰 Beutewert (CyberCoins)</span><span>'+Math.round(lootPct)+'%</span></div>'+
      '<div class="bar-track"><div class="bar-fill loot" style="width:'+lootPct+'%"></div></div></div>'+
      '<div class="bar-row"><div class="bar-top"><span>🏢 Unternehmensschaden (fiktive CHF)</span><span>'+Math.round(dmgPct)+'%</span></div>'+
      '<div class="bar-track"><div class="bar-fill damage" style="width:'+dmgPct+'%"></div></div></div>'+
      '<p class="note" style="margin:10px 0 0">Die Werte sind fiktiv und veranschaulichen nur die Grössenordnung – keine echten Marktpreise.</p>';
  }

  /* =========================================================================
     MODUL – Ablauf (Video → Mission → Auflösung)
     ========================================================================= */
  function openModule(id){
    var m = MODULES.filter(function(x){return x.id===id;})[0];
    var sec = $("#module-detail");
    var phase = 0; // 0 video, 1 mission, 2 reveal
    var picks = [];

    function pills(){
      var names=["Expertenvideo","Hacker-Mission","Auflösung"];
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
        : '<div class="placeholder"><div class="play">▶</div><p>Expertenvideo folgt<br><span class="note" style="color:#9fc0e4">'+v.expert+' · '+v.duration+'</span></p></div>';
      var pts = v.points.map(function(p){ return '<li><b>'+p[0]+'</b> '+p[1]+'</li>'; }).join("");
      sec.innerHTML = '<div class="wrap">'+pills()+
        '<div class="eyebrow">Modul '+m.number+'</div><h2>'+m.icon+' '+m.title+'</h2>'+
        '<div class="grid two" style="align-items:start">'+
          '<div class="video-frame">'+media+'</div>'+
          '<div class="card"><h3>Darum geht es</h3><p class="note">'+v.summary+'</p><ul style="padding-left:18px;color:var(--ink-soft)">'+pts+'</ul></div>'+
        '</div>'+
        '<div style="margin-top:20px"><button class="btn" id="toMission">Weiter zur Hacker-Mission →</button> '+
        '<button class="btn ghost" style="border-color:var(--line);color:var(--ink-soft)" id="backMods">Zurück zur Übersicht</button></div>'+
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
        var body = '<div class="mission-q mono">root@talentbridge:~$ ziel = "'+mi.target+'"</div>'+
          '<p class="mission-q">'+(stepIdx+1)+'/'+mi.steps.length+' · '+st.q+'</p>'+opts+
          '<div class="risk-meter"><div id="riskfill"></div></div>'+
          '<p class="note" style="color:#8fb4da;margin-top:8px">Tipp: Wähle, was den Angriff am gefährlichsten macht – gleich siehst du, woran man genau das erkannt hätte.</p>';
        $("#termbody").innerHTML = body;
        $$("#termbody .opt").forEach(function(btn){
          btn.onclick=function(){
            var i=parseInt(btn.getAttribute("data-i"),10); var opt=st.options[i];
            $$("#termbody .opt").forEach(function(b){b.classList.remove("pick");}); btn.classList.add("pick");
            $("#riskfill").style.width = Math.round(opt.risk/3*100)+"%";
            picks.push(opt);
            setTimeout(function(){
              // kurze Mikro-Auflösung je Schritt
              var note = el("div","reveal"); note.style.marginTop="12px";
              note.innerHTML = '<b style="color:var(--mp-navy)">Erkennungszeichen:</b> '+opt.why;
              $("#termbody").appendChild(note);
              var nx = el("button","btn alt", (stepIdx<mi.steps.length-1?"Nächster Schritt →":"Mission auswerten →"));
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
        '<div class="body"><h3>🎯 Auftrag: '+mi.target+'</h3><p style="color:#9fc0e4">'+mi.intro+'</p>'+
          '<div id="termbody"></div>'+
        '</div></div></div>';
      drawStep();
    }

    function finishMission(){
      // Balken erhöhen (fiktiv) – je nach eingeschätztem Risiko
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
        '<div class="eyebrow">Moment der Wahrheit</div>'+
        '<h2>'+m.icon+' '+m.title+' – Auflösung</h2>'+
        '<div class="card">'+barsHTML()+'</div>'+
        '<div class="reveal"><h3>'+r.question+'</h3><p>'+r.answer+'</p>'+
          '<p style="font-weight:700;margin-bottom:6px">Das hätte den Angriff unterbrochen:</p>'+
          '<ul class="stops">'+r.stops.map(function(s){return '<li>✅ '+s+'</li>';}).join("")+'</ul>'+
        '</div>'+
        '<div style="margin-top:20px"><button class="btn" id="revBack">Zurück zu den Modulen →</button></div>'+
        '</div>';
      $("#revBack").onclick=function(){ renderModules(); show("modules"); };
    }

    renderVideo(); show("module-detail");
  }

  /* =========================================================================
     VERTEIDIGUNGSLEVEL
     ========================================================================= */
  function renderDefense(){
    var sec = $("#defense");
    var html = '<div class="wrap">'+
      '<div class="eyebrow">Schritt 3 · Verteidigung</div>'+
      '<h2>🛡️ Jetzt bist du das Personal</h2>'+
      '<p class="lead">In deinem Posteingang stecken Angriffe aus den Modulen – aber auch harmlose, echte Nachrichten. Nicht jede ungewöhnliche Nachricht ist ein Angriff. Entscheide pro Nachricht richtig.</p>'+
      '<div class="inbox">';
    INBOX.forEach(function(mail){
      var ans = state.defense[mail.id];
      html += '<div class="mail'+(ans?" answered":"")+'" data-mail="'+mail.id+'">'+
        '<div class="head"><span class="from">'+mail.from+'</span></div>'+
        '<div class="subj">'+mail.subject+'</div><div class="prev">'+mail.preview+'</div>'+
        '<div class="actions">'+
          '<button data-act="bearbeiten">Bearbeiten</button>'+
          '<button data-act="zurückfragen">Zweiter Kanal</button>'+
          '<button data-act="melden">Melden</button>'+
          '<button data-act="ablehnen">Ablehnen</button>'+
        '</div><div class="resbox"></div></div>';
    });
    html += '</div>'+
      '<div style="margin-top:22px"><button class="btn alt" id="toPost">Weiter zur Nachher-Umfrage →</button></div>'+
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
            (correct?"✅ Richtig. ":"✖ Nicht optimal. ")+
            '<b>'+mail.type+'.</b> '+mail.why+'</div>';
          $$(".actions button", mailEl).forEach(function(b){b.disabled=true;b.style.opacity=.5;});
          updateProgress();
        };
      });
    });
    $("#toPost").onclick=function(){
      if (Object.keys(state.defense).length < INBOX.length){ toast("Bitte entscheide bei allen Nachrichten ("+Object.keys(state.defense).length+"/"+INBOX.length+")."); return; }
      renderSurvey("post"); show("survey-post");
    };
  }

  /* =========================================================================
     AUSWERTUNG + RANGLISTE
     ========================================================================= */
  function renderResult(){
    var sec = $("#result");
    // Lernzuwachs grob: Anteil, bei dem Selbsteinschätzung zur Leistung passt (Demo)
    var defPct = Math.round(state.defenseScore / INBOX.length * 100);

    // Fiktive Team-Rangliste: eigenes Team echt, andere als Demo-Werte
    var rows = D.config.teams.map(function(t){
      var base = t===state.team ? (40 + state.defenseScore*8 + Object.keys(state.missionDone).length*6)
                                : (35 + (hash(t)%45));
      return {team:t, score: Math.min(100, base), me: t===state.team};
    }).sort(function(a,b){return b.score-a.score;});
    var top = rows.slice(0, D.config.topTeamsVisible);

    sec.innerHTML = '<div class="wrap">'+
      '<div class="eyebrow">Auswertung</div>'+
      '<h2>Geschafft, '+(state.team||"")+'! 🎉</h2>'+
      '<p class="lead">Dein persönliches Ergebnis siehst nur du. Öffentlich sind nur die besten '+D.config.topTeamsVisible+' Teams.</p>'+
      '<div class="grid three" style="margin:18px 0">'+
        statTile("🛡️", defPct+"%", "richtig abgewehrt") +
        statTile("🧩", Object.keys(state.missionDone).length+"/"+MODULES.filter(function(m){return m.available;}).length, "Module gespielt") +
        statTile("🏅", (defPct>=80?"Cyber Champion":defPct>=50?"Wachsam":"Weiter üben"), "dein Badge") +
      '</div>'+
      '<div class="card"><h3>Dein verhinderter Schaden</h3>'+
        '<p class="note">Im Verteidigungslevel hast du '+state.defenseScore+' von '+INBOX.length+' Nachrichten richtig behandelt. Jede richtige Entscheidung verhindert in der Realität möglichen Schaden – vom Datenabfluss bis zum Betriebsunterbruch.</p></div>'+
      '<h3 style="margin-top:28px">🏆 Top-Teams</h3><div class="lb">'+
        top.map(function(r,i){ return '<div class="lb-row top'+(i+1)+'">'+
          '<div class="lb-rank">'+(i+1)+'</div><div class="lb-name">'+r.team+(r.me?' <span class="badge on">du</span>':'')+'</div>'+
          '<div class="lb-score">'+r.score+'</div>'+
          '<div class="lb-bar"><div style="width:'+r.score+'%"></div></div></div>'; }).join("")+
      '</div>'+
      (top.some(function(r){return r.me;})?'<p class="note" style="margin-top:10px">Stark – dein Team ist in den Top '+D.config.topTeamsVisible+'!</p>':'<p class="note" style="margin-top:10px">Dein Rang bleibt privat. Nur die Top '+D.config.topTeamsVisible+' werden gezeigt.</p>')+
      '<div style="margin-top:26px" class="card"><h3>Für die Testleitung</h3>'+
        '<p class="note">Alle Antworten (Vorher/Nachher inkl. Selbsteinschätzung, Verteidigung, Feedback) können anonymisiert exportiert werden.</p>'+
        '<button class="btn sm" id="expBtn">📊 Ergebnisse als CSV exportieren</button></div>'+
      '</div>';
    $("#expBtn").onclick = exportCSV;
  }
  function statTile(ic,big,label){
    return '<div class="card" style="text-align:center"><div style="font-size:30px">'+ic+'</div>'+
      '<div style="font-size:26px;font-weight:800;color:var(--mp-navy)">'+big+'</div>'+
      '<div class="note">'+label+'</div></div>';
  }
  function hash(s){ var h=0; for(var i=0;i<s.length;i++){h=(h<<5)-h+s.charCodeAt(i);h|=0;} return Math.abs(h); }

  /* ---------- CSV Export ---------- */
  function exportCSV(){
    var rows = [["feld","wert"]];
    rows.push(["team", state.team||""]);
    D.surveys.pre.forEach(function(q){ rows.push(["pre_"+q.id, labelOf(q,state.pre[q.id])]); rows.push(["pre_conf_"+q.id, state.preConf[q.id]!=null?state.preConf[q.id]+1:""]); rows.push(["pre_correct_"+q.id, state.pre[q.id]===q.correct?"1":"0"]); });
    D.surveys.post.forEach(function(q){ rows.push(["post_"+q.id, labelOf(q,state.post[q.id])]); rows.push(["post_conf_"+q.id, state.postConf[q.id]!=null?state.postConf[q.id]+1:""]); rows.push(["post_correct_"+q.id, state.post[q.id]===q.correct?"1":"0"]); });
    INBOX.forEach(function(m){ var a=state.defense[m.id]; rows.push(["def_"+m.id, a?a.action:""]); rows.push(["def_correct_"+m.id, a&&a.correct?"1":"0"]); });
    D.surveys.feedback.forEach(function(f){ rows.push(["fb_"+f.id, state.feedback[f.id]||""]); });
    var csv = rows.map(function(r){ return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(","); }).join("\n");
    var blob = new Blob(["﻿"+csv], {type:"text/csv;charset=utf-8"});
    var a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download = "imoah_ergebnisse_"+(state.team||"team").replace(/\s+/g,"_")+".csv"; a.click();
    toast("CSV exportiert.");
  }
  function labelOf(q,i){ return i!=null ? q.options[i] : ""; }

  /* =========================================================================
     INIT
     ========================================================================= */
  function buildNav(){
    var items = [
      ["start","Start"],["survey-pre","Umfrage"],["modules","Module"],
      ["defense","Verteidigung"],["survey-post","Abschluss"]
    ];
    $("#nav").innerHTML = items.map(function(it){ return '<a href="#" data-sec="'+it[0]+'">'+it[1]+'</a>'; }).join("");
    $$("#nav a").forEach(function(a){ a.onclick=function(e){ e.preventDefault(); var id=a.getAttribute("data-sec");
      if(id==="modules") renderModules();
      if(id==="defense") renderDefense();
      if(id==="survey-pre") renderSurvey("pre");
      if(id==="survey-post"){ if(!Object.keys(state.missionDone).length && !Object.keys(state.defense).length){ toast("Spiele zuerst die Module und das Verteidigungslevel."); } renderSurvey("post"); }
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
