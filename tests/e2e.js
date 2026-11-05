/* =========================================================================
   End-to-end test: plays one complete run in a real (headless) Chrome and
   checks gates, locking, the team mission (table, phone view, completion
   code) and the CSV export.

   Setup once:   npm install            (installs puppeteer-core only)
   Run:          python3 -m http.server 8000   (in the project folder)
                 npm test
   Options:      BASE_URL=http://localhost:8000  CHROME_PATH=/path/to/chrome
   ========================================================================= */
const puppeteer = require("puppeteer-core");

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";
const CHROME_PATH = process.env.CHROME_PATH || {
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  linux: "/usr/bin/google-chrome"
}[process.platform];

const sleep = ms => new Promise(r => setTimeout(r, ms));
let failures = 0;
function check(name, ok, detail) {
  console.log((ok ? "  ✓ " : "  ✗ ") + name + (ok || detail == null ? "" : "  → " + detail));
  if (!ok) failures++;
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("dialog", d => d.accept());
  // fixed random numbers: same form order, anchor group and option order on every run
  await page.evaluateOnNewDocument(() => {
    let a = 12345;
    Math.random = () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  });
  await page.goto(BASE_URL + "/?t=" + Date.now(), { waitUntil: "networkidle0" });
  await page.evaluate(() => {   // capture the CSV instead of downloading it
    const create = URL.createObjectURL;
    URL.createObjectURL = b => { b.text().then(t => { window.__csv = t; }); return create(b); };
    HTMLAnchorElement.prototype.click = function () {};
  });

  const nav = async id => { await page.click(`[data-sec=${id}]`); await sleep(150); };
  const heading = id => page.$eval("#" + id + " h2", e => e.textContent).catch(() => "");
  const active = () => page.$eval(".section.active", e => e.id);

  console.log("Gates");
  await page.click("#goStart"); await sleep(200);
  for (const id of ["modules", "team", "defense", "survey-post"]) {
    await nav(id);
    check(id + " is locked before the pre-survey", (await heading(id)).includes("pre-survey comes first"));
  }

  // answers: pre = always "process" + "Very sure", post = the best action + "Fairly sure"
  const fill = (secId, best, confIdx) => page.evaluate((secId, best, confIdx) => {
    const sec = document.getElementById(secId), S = window.CONTENT.surveys;
    const st = JSON.parse(localStorage.getItem("imoah"));
    const form = st.formOrder.charAt(secId === "survey-pre" ? 0 : 1);
    const fire = el => { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); };
    sec.querySelectorAll(".q-card").forEach(card => {
      const id = card.dataset.qid;
      if (id.startsWith("sc_")) {
        const v = best ? S.scenarios.find(s => "sc_" + s.slot === id)[form].best : "process";
        const inp = card.querySelector(`input[value="${v}"]`); inp.checked = true; fire(inp);
      } else if (card.querySelector("input[type=range]")) { const r = card.querySelector("input[type=range]"); r.value = best ? 7 : 4; fire(r); }
      else if (card.querySelector("input[type=number]")) { const n = card.querySelector("input[type=number]"); n.value = "5"; fire(n); }
      else if (card.querySelector("table")) {
        const names = [...new Set([...card.querySelectorAll("input[type=radio]")].map(i => i.name))];
        names.forEach(nm => { const i = card.querySelectorAll(`input[name="${nm}"]`)[best ? 3 : 1]; i.checked = true; fire(i); });
      } else if (card.querySelector("input[type=checkbox]")) {
        const boxes = card.querySelectorAll("input[type=checkbox]");
        (id === "k1" ? (best ? S.repeated.k1.correct : [1, 3]) : [0]).forEach(i => { boxes[i].checked = true; fire(boxes[i]); });
      } else if (card.querySelector("input[type=radio]")) { const i = card.querySelector("input[type=radio]"); i.checked = true; fire(i); }
      else if (card.querySelector("textarea")) { const t = card.querySelector("textarea"); t.value = "Call back on a known number."; fire(t); }
      const c = card.querySelector('.scale button[data-v="' + confIdx + '"]'); if (c) c.click();
    });
  }, secId, best, confIdx);

  console.log("Pre-survey");
  await nav("survey-pre");
  await page.click("#survey-pre #surveyNext"); await sleep(100);
  const cards = await page.$$eval("#survey-pre .q-card", x => x.length);
  check("empty submit marks every question", (await page.$$eval("#survey-pre .q-card.missing", x => x.length)) === cards);
  await fill("survey-pre", false, 4);
  await page.click("#survey-pre #surveyNext"); await sleep(200);
  check("submit opens the modules", (await active()) === "modules");
  await nav("survey-pre");
  check("pre-survey is locked afterwards", (await heading("survey-pre")).includes("completed"));
  await nav("survey-post");
  check("final survey waits for the team mission", (await heading("survey-post")).includes("team mission"));

  console.log("Modules");
  await nav("modules");
  for (const id of ["m1", "m2", "m3", "m4", "m5"]) {
    await page.click(`[data-mod=${id}]`); await sleep(100);
    await page.click("#toMission"); await sleep(100);
    for (let s = 0; s < 3; s++) {
      await page.click("#termbody .opt"); await sleep(400);
      await page.click("#termbody .btn.accent"); await sleep(150);
    }
    await page.click("#revBack"); await sleep(150);
  }
  check("all five keys collected", (await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("imoah")).keys).length)) === 5);

  // the run survives closing the tab (modules at home, workshop later)
  const later = await browser.newPage();
  later.on("pageerror", e => errors.push("later: " + e.message));
  await later.goto(BASE_URL + "/?t=" + Date.now(), { waitUntil: "networkidle0" });
  const resume = await later.$("#goResume");
  if (resume) { await resume.click(); await sleep(150); }
  check("a saved run continues where it stopped", !!resume && (await later.$eval(".section.active", e => e.id)) === "team");
  await later.close();
  await page.bringToFront();

  console.log("Team mission");
  await page.click("#toTeam"); await sleep(150);
  check("modules lead to the team mission", (await active()) === "team");
  await page.type("#tmCodeIn", "ABCD-EFGH"); await page.click("#tmSubmit"); await sleep(100);
  check("an invalid code is rejected", await page.$eval("#tmErr", e => !e.hidden) && (await page.evaluate(() => JSON.parse(localStorage.getItem("imoah")).teamMission)) === null);

  const table = await browser.newPage();
  table.on("pageerror", e => errors.push("table: " + e.message));
  table.on("dialog", d => d.accept());
  await table.goto(BASE_URL + "/team-mission.html?t=" + Date.now(), { waitUntil: "networkidle0" });
  check("both cards of every question sit with two different people (2–6)", await table.evaluate(() => {
    const T = App.team;
    for (let n = 2; n <= 6; n++) for (let r = 0; r < T.rounds.length; r++) {
      if (T.rounds[r].questions.some(q => T.owner(q.cards[0], r, n) === T.owner(q.cards[1], r, n))) return false;
      for (let p = 1; p <= n; p++) if (!T.cardsFor(p, r, n).length) return false;
    }
    return true;
  }));
  await table.click("[data-size='3']"); await sleep(100);
  const tokens = await table.$$eval(".qr-link", x => x.map(e => e.dataset.token));
  check("one QR code per person", tokens.length === 3 && (await table.$$eval(".qr-img svg", x => x.length)) === 3);

  const phone = await browser.newPage();
  phone.on("pageerror", e => errors.push("phone: " + e.message));
  await phone.setViewport({ width: 390, height: 800 });
  await phone.goto(BASE_URL + "/team-mission.html?s=" + tokens[1], { waitUntil: "networkidle0" });
  check("the phone shows person 2 of 3 with their 2 cards", (await phone.$eval(".seat-head .note", e => e.textContent)).includes("Person 2 of 3") && (await phone.$$eval(".clue", x => x.length)) === 2);
  await phone.goto(BASE_URL + "/team-mission.html?s=ZZZZ", { waitUntil: "networkidle0" });
  check("an edited phone link is rejected", (await phone.$eval("h2", e => e.textContent)).includes("doesn't work"));
  await phone.close();

  // play the table: everything right except round 1, question 1 → 14 of 15
  const plan = await table.evaluate(() => CONTENT.team.rounds.map(r => ({ q: r.questions.map(q => q.correct), n: r.questions.map(q => q.options.length), best: r.decision.best })));
  await table.click("#tmStart"); await sleep(100);
  for (let r = 0; r < plan.length; r++) {
    for (let q = 0; q < plan[r].q.length; q++) {
      const pick = r === 0 && q === 0 ? (plan[r].q[q] + 1) % plan[r].n[q] : plan[r].q[q];
      await table.click(`.qblock.current [data-opt='${pick}']`); await sleep(30);
      await table.click("#tmLock"); await sleep(60);
      if (r === 0 && q === 0) {
        await table.reload({ waitUntil: "networkidle0" });
        check("the table resumes after a reload", (await table.$$eval(".qblock.done", x => x.length)) === 1);
      }
    }
    await table.click(`.qblock.current [data-act='${plan[r].best}']`); await sleep(30);
    await table.click("#tmLock"); await sleep(60);
    check("round " + (r + 1) + " reveal names who held each card", (await table.$$eval(".rcard .ptag", x => x.length)) === 6);
    await table.click("#tmNext"); await sleep(80);
  }
  const code = await table.$eval("#tmCode", e => e.textContent.trim());
  check("the table shows a completion code", /^[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(code), code);
  await table.close();

  await page.bringToFront();
  await page.$eval("#tmCodeIn", e => { e.value = ""; });
  await page.type("#tmCodeIn", code.toLowerCase()); await page.click("#tmSubmit"); await sleep(150);
  const tm = await page.evaluate(() => JSON.parse(localStorage.getItem("imoah")).teamMission);
  check("the code records group size and answers", tm && tm.n === 3 && tm.rounds[0].q[0] === 0 && tm.rounds[2].d === 2, JSON.stringify(tm));

  console.log("Defense level");
  await page.click("#toDefense"); await sleep(150);
  const ids = await page.$$eval("#mlist [data-mail]", x => x.map(e => e.dataset.mail));
  for (const id of ids) { await page.click(`#mlist [data-mail=${id}]`); await sleep(30); await page.click("#mview [data-act=report]"); await sleep(30); }
  check("every message decided", (await page.$$eval("#mlist .mitem.answered", x => x.length)) === ids.length);
  await page.click("#toPost"); await sleep(200);
  check("final survey opens", (await active()) === "survey-post");

  console.log("Final survey and export");
  await fill("survey-post", true, 3);
  await page.click("#survey-post #surveyNext"); await sleep(200);
  check("submit opens the evaluation", (await active()) === "result");
  await page.click("#expBtn"); await sleep(300);
  const csv = await page.evaluate(() => window.__csv || "");
  const data = Object.fromEntries(csv.replace(/^\uFEFF/, "").split("\n").slice(1).map(r => r.slice(1, -1).split('","')));
  const expect = { score_pre: "4", score_post: "16", score_delta: "12", harmless_ok_pre: "2", harmless_ok_post: "2",
                   calibration_pre: "0.75", calibration_post: "-0.19", signs_score_post: "8", modules_done: "5", pre_done: "1", post_done: "1",
                   team_done: "1", team_size: "3", team_score: "14", team_questions_correct: "8", team_r1_q1: "0", team_r1_score: "4",
                   delta_att_discuss_first: "2", post_fb_teamwork: "4" };
  Object.keys(expect).forEach(k => check("export " + k + " = " + expect[k], data[k] === expect[k], data[k]));
  check("export has a form order", /^(AB|BA)$/.test(data.form_order || ""), data.form_order);

  check("no JavaScript errors", errors.length === 0, errors.join(" | "));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
  process.exit(failures ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
