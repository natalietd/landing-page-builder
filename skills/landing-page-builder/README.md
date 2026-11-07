# Landing Page Builder — Skill (v2)

Builds converting landing pages in **any niche** with one formula:

> **our structure × competitors' best practices, built to the reference standard**

- **Our structure** — 5 jobs with weights (first screen 5% · pains 15% · benefits 20% ·
  product 40% · offer & CTA 20%; pains only if competitors use them), two CTA types, base rules.
  Same everywhere.
- **Competitors** — 3–5 real landing pages are captured and torn down block by block. What the
  whole market does becomes our baseline, what the leaders do well gets adopted, what nobody does
  becomes our positioning, and the visual system follows the niche.
- **Reference standard** — four landings the owner picked as good (muestralo, aicarouselmaker,
  ups-fit, saytext). They set the quality bar: block patterns, copy craft, visual craft.

## Two modes

- **A. Build from scratch** — the flow below.
- **B. Improve the design** of an existing landing — capture it, audit it against the house
  structure + reference standard, plan keep / restyle / re-pattern per section, owner checkpoint,
  edit in place, before/after QA (`references/redesign.md`).

## Flow (Mode A)

1. **Brief**: project card or a few questions.
2. **Competitor research**: find competitors and capture their pages (`scripts/capture.mjs`).
3. **Teardown**: per-block market view → baseline, best practices, gaps, visual lock
   (`research/teardown.md`).
4. **Page plan**: our 5 blocks filled with adopted practices. **The owner approves it here.**
5. **Build**: the page.
6. **QA**: in the browser, against the plan and against the competitors.

## Files

```
landing-page-builder/
├── SKILL.md                         # workflow + how structure and competitors combine
├── references/
│   ├── reference-standard.md        # the 4 reference landings: bar, patterns, craft
│   ├── redesign.md                  # Mode B: improve an existing landing's design
│   ├── brief.md                     # card-first brief, card row → block mapping
│   ├── competitor-research.md       # find, capture, tear down, synthesize (the core)
│   ├── framework.md                 # the 5 jobs, per-block rules, page plan table
│   ├── visual-system.md             # lock the visual system from competitors
│   ├── build.md                     # stack, copy, media, CTA, offer, QA, handoff
│   ├── seo-geo.md                   # before going live: SEO + GEO (AI search) checklist
│   └── examples.md                  # worked examples in different niches
├── templates/teardown.md            # teardown file to fill
└── scripts/
    ├── capture.mjs                  # screenshots + structure/visual extraction
    └── package.json
```

## Capture script setup (once)

```bash
npm install --prefix .cursor/skills/landing-page-builder/scripts
```

It uses Playwright's Chromium if downloaded, otherwise your installed Google Chrome. If you have
neither, also run `npx playwright install chromium`.

```bash
node .cursor/skills/landing-page-builder/scripts/capture.mjs --out research/competitors https://a.com https://b.com
```

Per URL: `full.png`, `mobile.png`, `sections/NN.png`, and `page.json`. The JSON holds the outline,
CTAs, prices, proof signals, fonts and colors. Cookie banners are hidden, never accepted. The
CTA/colour extraction is heuristic, so always check it against the screenshots.

## Install

- **Claude Code:** copy the folder to `.claude/skills/` (project) or `~/.claude/skills/` (global).
- **Cursor:** keep it in `.cursor/skills/`, or add a rule that says "Follow
  `.cursor/skills/landing-page-builder/SKILL.md`".
- **claude.ai:** zip the folder (without `scripts/node_modules`) and upload it as a skill.

v1 (with the separate `landing-designer` skill) is archived in `skill-v1-backup.zip` at the repo root.
