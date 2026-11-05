# Inside the Mind of a Hacker

Prototype of the training website for the WI-Projekt HS26 (Topic 10 – Cybersecurity Clinic, CyrenZH).
Client: ManpowerGroup Switzerland · Team: Michele, Daniele, Lara.

A gamified cybersecurity awareness training from the attacker's perspective – but **recognition- and
defense-oriented**: participants see through the mechanism of an attack and practise the protective
action. No real tools, templates or attack instructions are taught on purpose
(guardrail from the concept: "You learn the mechanism, not the instructions").

## What's inside

- **Pre-survey** (mandatory before the training): anonymous baseline – a few coarse demographics, experience, habits,
  self-assessment, attitude, an anchoring estimate and 8 everyday situations with a confidence rating each
- **Expert videos** per module (animated explainers, in `media/`)
- **Hacker missions** in a dark terminal interface + the two meters (loot value / company damage)
- **Reveal** "What would have stopped you?" per module
- **Team mission** in the workshop (cooperative, 2–6 people): every person holds part of the clues on their phone,
  the group combines them by talking (see "Team mission" below)
- **Defense level**: an inbox with attacks and harmless messages
- **Final survey** after the team mission and the defense level: the same self-assessment and attitude questions, 8 new parallel situations, feedback
- **Team leaderboard** (only top 3 visible) and a personal evaluation
- **CSV export** of all answers for the test facilitator

All five modules are playable; module 5 (Ransomware) opens once 4 keys are collected. All five modules have an expert video.

## View locally

Just open `index.html` in a browser – no build, no installation needed.
(For testing embedded video, a small local server is best, e.g. `python -m http.server`.)

## Publish online (GitHub Pages)

1. Push the files to the `larabng/securityawareness` repo (branch `main`).
2. On GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
3. After a few minutes the site is available at `https://larabng.github.io/securityawareness/`.

## Edit content

All texts live in `content/` – plain data files, no code needed:

- `content/config.js` – title, company, season, teams
- `content/surveys.js` – pre/post surveys, parallel scenarios, feedback
- `content/modules.js` – modules (videos, missions, reveals, keys, badges)
- `content/defense.js` – the defense inbox
- `content/team.js` – the team mission: rounds, clue cards, questions, decisions

Icons are referenced by name (e.g. `icon: "mail"`); the available names are listed in `js/core/icons.js`.

### Add a video
In `content/modules.js`, fill in `video.url` for the module:
- YouTube: `url: "https://www.youtube.com/embed/VIDEO_ID"`
- own file: put the video e.g. at `media/modul1.mp4` and set `url: "media/modul1.mp4"`

### Unlock a module
Set `available: true` on the module.

## Team mission (workshop)

The cooperative part follows the jigsaw method: knowledge is built alone in the modules and combined in a group.

**Flow of the test:** pre-survey and modules on their own (each team of two) → **workshop**: team mission → defense level → final survey.

1. In the workshop, 2–6 people sit at one table (e.g. two or three teams of two). **One** laptop opens the team table:
   app → step 3 · Team mission → *Open the team table* (or `team-mission.html` directly).
2. The table asks for the group size and shows one QR code per person. Each person scans one code; their phone shows
   only their own clue cards. The phones are not connected to anything – the group combines the clues by talking.
3. Three rounds (phishing → CEO fraud → fake candidate), each with 6 clue cards, 3 questions and 1 decision, then a reveal
   that shows who held which card. About 15 minutes.
4. At the end the table shows an 8-character **completion code**. Every team at the table enters it in its own app;
   that records the result and opens the defense level (the final survey needs both).

Why nobody can answer alone: the cards are dealt round-robin, and every question needs two neighbouring cards
(1+2, 3+4, 5+6) – those always sit with two different people, whatever the group size. The answer options combine one
fact from each card, so one card alone leaves at least two options open. The deal moves on by one person every round.

The QR codes point to the online version (`publicUrl` in `content/team.js`) when the table runs from a local file or
localhost, so phones can reach them. The completion code carries group size, every answer, the decisions and the
duration plus a checksum, so typos are caught (`js/core/team.js`). QR codes are drawn with qrcode-generator
(Kazuhiko Arase, MIT licence, `js/vendor/qrcode.js`).

## Structure

Vanilla HTML/CSS/JS without a build step. Every script adds its part to one global `App` object;
`index.html` loads them in order (content first, then the app).

```
index.html            Page skeleton, loads styles and scripts
team-mission.html     Team mission: shared table (laptop) and clue cards (phone, ?s=<token>)
content/              What participants see (see "Edit content")
css/base.css          Design tokens, typography, layout, header/footer
css/components.css    Buttons, cards, tags, stats, meters, keyring, form controls
css/views.css         Start, surveys, modules, mission, team mission step, defense, result
css/team.css          Team mission page (table and phone)
js/core/util.js       App namespace, DOM helpers, toast
js/core/icons.js      Inline SVG icons (Lucide subset, ISC licence)
js/core/state.js      Run state (localStorage), points and keys
js/core/measure.js    Survey model: items per run, scoring, summary measures
js/core/team.js       Team mission logic: dealing the cards, seat links, completion code
js/views/*.js         One file per screen (+ widgets.js for shared pieces)
js/export.js          CSV export
js/main.js            Navigation (App.go) and start-up
js/team-page.js       Team mission page (table + phone view)
js/vendor/qrcode.js   QR code generator (MIT)
tools/                merge_results.py – merges the CSV exports
tests/e2e.js          Browser test of a complete run
media/                Expert videos
```

Design: a light "office" world (start, surveys, defense, result) and a dark "hacker" world (modules, missions);
components adapt automatically inside an element with the class `dark`.

### Test
The browser test plays a complete run in headless Chrome and checks the gates, the locking, the team mission
(table, phone view, completion code) and the CSV export:

```
npm install                  # once – installs puppeteer-core (uses your installed Chrome)
python3 -m http.server 8000  # in a second terminal
npm test
```

## Measuring the effect (pre / post)

The surveys are built so the before/after comparison is clean (details in `content/surveys.js`):

- **Same questions before and after** for everything we compare: self-assessment per threat (`prep`), how attractive a
  target one feels (`target`), attitude (`att`) and the warning-signs question (`k1`).
- **Parallel scenario forms A and B**: 8 situations each – 5 attacks (one per module), 1 own mistake, 2 harmless messages.
  Every slot tests the same mechanism in a different situation, none is a copy of a training item.
  Each run gets A before and B after, or the other way round (random, `form_order`), so a harder form cannot fake an effect.
- **Answers like in the defense level** (Process / Verify / Report / Reject), scored 2 = best, 1 = defensible, 0 = unsafe.
  No answer is longer or more detailed than another, and the solutions are never shown.
- **"How sure are you?"** for every situation and for `k1` – this shows whether confidence fits the actual performance.
- Submitted surveys are locked; the final survey opens only after the team mission and the defense level, and both only after the pre-survey.
- Anchoring question: only a random half sees the USD 80 million anchor (`anchor_group`), so the anchoring effect can be compared.

Hypotheses and the export columns that answer them:

| Question | Columns |
|---|---|
| Do they act more safely? | `score_pre/post/delta` (0–16), `attack_score_*` (0–12), `accuracy_*` (share of best actions) |
| Do they now report everything, even harmless messages? | `harmless_ok_*` (0–2 – should not drop) |
| Does confidence fit performance better? | `conf_mean_*` (1–5), `calibration_*` (> 0 = more confident than correct, 0 = well calibrated) |
| Do they recognise the warning signs? | `signs_score_*` (0–8 options classified correctly) |
| Do they feel better prepared? | `prep_mean_*`, `delta_prep_<threat>`, `delta_target` |
| Has their attitude changed? | `delta_att_<item>` (`rules_slow`: lower is better) |
| Do they talk suspicious messages through with colleagues? | `delta_att_discuss_first` |
| How well did the group combine its clues? | `team_score` (0–15), `team_questions_correct` (0–9), `team_decision_score` (0–6), `team_size`, `team_minutes` |
| Did the teamwork help, in their own view? | `post_fb_teamwork` (1–5) |

For a pilot of 20–30 people, use the Wilcoxon signed-rank test on the `_pre`/`_post` pairs and report the effect size.
Limits to name in the report: there is no control group (part of a gain can come from taking the survey twice), and one run
is played per team of two – so one export describes a pair, not a single person.

## Evaluation (test phase)

1. At the end of each run, click **Export results as CSV** on the result page.
   The file is named `imoah_<RUN-ID>_<team>.csv`. The run stays saved on the device until it is reset.
2. Collect all exports in one folder and merge them into one table (one row per run):
   ```
   python3 tools/merge_results.py path/to/exports
   ```
   This writes `merged_results.csv` into that folder (opens in Excel / SPSS / R).

Useful columns: `run_id`, `started_at`, `duration_min`, `form_order`, `modules_done`, the summary columns above,
`pre_*` / `post_*` (every single answer; scenarios as `<pre|post>_sc_<slot>` + `_quality` + `_conf`),
`mod_step<n>_correct_<module>` and `mod_score_<module>` (did the participant spot the strongest building block?),
`def_quality_<mail>` (2 = best action, 1 = safe but not best, 0 = unsafe), `team_<round>_q<n>` (1 = correct),
`team_<round>_decision` (2 / 1 / 0) and `team_<round>_score`, `post_fb_*` (feedback).
All teams at one table share the same `team_code` – group by it to analyse the team mission per table.
Only use runs with `pre_done = 1` and `post_done = 1` for the before/after comparison.

## Notes

- The company and all data are **fictional** (TalentBridge Ltd).
- Progress is kept in the browser on the device (localStorage), so a run survives closing the tab between the
  modules and the workshop. On a shared laptop, the next team clicks **Start a new run** on the start page
  (or **Reset** on the result page) – export first. Private/incognito windows forget the run when they are closed.
- `duration_min` in the export counts from the start of the run, so it includes any break before the workshop.
- Evaluation runs only via the CSV export; nothing is sent anywhere.
- The meter values are fictional and only illustrate the order of magnitude.
