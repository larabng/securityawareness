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
- **Defense level**: an inbox with attacks and harmless messages
- **Final survey** after the defense level: the same self-assessment and attitude questions, 8 new parallel situations, feedback
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

Everything is in two files, no code needed:

- `js/data.js` – surveys (pre/post), feedback, teams, company name
- `js/modules.js` – modules (videos, missions, reveals) and the defense inbox

### Add a video
In `js/modules.js`, fill in `video.url` for the module:
- YouTube: `url: "https://www.youtube.com/embed/VIDEO_ID"`
- own file: put the video e.g. at `media/modul1.mp4` and set `url: "media/modul1.mp4"`

### Unlock a module
Set `available: true` on the module.

## Structure

```
index.html          Skeleton + sections
css/style.css       Design in ManpowerGroup colours
js/data.js          Surveys & configuration
js/modules.js       Modules & defense level
js/app.js           Flow logic (vanilla JS)
tools/              merge_results.py – merges the CSV exports
```

## Measuring the effect (pre / post)

The surveys are built so the before/after comparison is clean (details in `js/data.js`):

- **Same questions before and after** for everything we compare: self-assessment per threat (`prep`), how attractive a
  target one feels (`target`), attitude (`att`) and the warning-signs question (`k1`).
- **Parallel scenario forms A and B**: 8 situations each – 5 attacks (one per module), 1 own mistake, 2 harmless messages.
  Every slot tests the same mechanism in a different situation, none is a copy of a training item.
  Each run gets A before and B after, or the other way round (random, `form_order`), so a harder form cannot fake an effect.
- **Answers like in the defense level** (Process / Verify / Report / Reject), scored 2 = best, 1 = defensible, 0 = unsafe.
  No answer is longer or more detailed than another, and the solutions are never shown.
- **"How sure are you?"** for every situation and for `k1` – this shows whether confidence fits the actual performance.
- Submitted surveys are locked; the final survey opens only after the defense level, and the defense level only after the pre-survey.
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

For a pilot of 20–30 people, use the Wilcoxon signed-rank test on the `_pre`/`_post` pairs and report the effect size.
Limits to name in the report: there is no control group (part of a gain can come from taking the survey twice), and one run
is played per team of two – so one export describes a pair, not a single person.

## Evaluation (test phase)

1. At the end of each run, click **Export results as CSV** on the result page.
   The file is named `imoah_<RUN-ID>_<team>.csv`. The page warns before the tab is closed without an export.
2. Collect all exports in one folder and merge them into one table (one row per run):
   ```
   python3 tools/merge_results.py path/to/exports
   ```
   This writes `merged_results.csv` into that folder (opens in Excel / SPSS / R).

Useful columns: `run_id`, `started_at`, `duration_min`, `form_order`, `modules_done`, the summary columns above,
`pre_*` / `post_*` (every single answer; scenarios as `<pre|post>_sc_<slot>` + `_quality` + `_conf`),
`mod_step<n>_correct_<module>` and `mod_score_<module>` (did the participant spot the strongest building block?),
`def_quality_<mail>` (2 = best action, 1 = safe but not best, 0 = unsafe), `post_fb_*` (feedback).
Only use runs with `pre_done = 1` and `post_done = 1` for the before/after comparison.

## Notes

- The company and all data are **fictional** (TalentBridge Ltd).
- Progress is kept only in the browser (sessionStorage); evaluation runs via the CSV export.
- The meter values are fictional and only illustrate the order of magnitude.
