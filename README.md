# Inside the Mind of a Hacker

Prototype of the training website for the WI-Projekt HS26 (Topic 10 – Cybersecurity Clinic, CyrenZH).
Client: ManpowerGroup Switzerland · Team: Michele, Daniele, Lara.

A gamified cybersecurity awareness training from the attacker's perspective – but **recognition- and
defense-oriented**: participants see through the mechanism of an attack and practise the protective
action. No real tools, templates or attack instructions are taught on purpose
(guardrail from the concept: "You learn the mechanism, not the instructions").

## What's inside

- **Pre-survey** (mandatory): 23-question cybersecurity survey – demographics, self-assessment sliders, an anchoring estimate, experience, behaviour matrices, scenario questions and a dual matrix (relevance vs. preparedness)
- **Expert videos** per module (placeholders until the real videos are available)
- **Hacker missions** in a dark terminal interface + the two meters (loot value / company damage)
- **Reveal** "What would have stopped you?" per module
- **Defense level**: an inbox with attacks and harmless messages
- **Post-survey** + feedback
- **Team leaderboard** (only top 3 visible) and a personal evaluation
- **CSV export** of all answers for the test facilitator

Unlocked for the test phase: **Module 1 (Phishing)** and **Module 3 (CEO fraud)**.

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
```

## Notes

- The company and all data are **fictional** (TalentBridge Ltd).
- Progress is kept only in the browser (sessionStorage); evaluation runs via the CSV export.
- The meter values are fictional and only illustrate the order of magnitude.
