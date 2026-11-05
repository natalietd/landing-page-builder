# Landing Page Builder: a Claude skill

Builds landing pages that convert, in **any niche**, with one formula:

> **our structure × competitors' best practices, built to the reference standard**

- **Structure:** every page covers the same 5 jobs, each with a weight. The weights add up to 100% of the page.

  | Job | Weight |
  |---|---|
  | First screen | 5% |
  | Pains | 15%, only if competitors use a pains block |
  | Benefits | 20% |
  | Product | 40% |
  | Offer & CTA | 20% |

  There are two CTA types, into the product or book a call, and never lead or quiz forms.
- **Competitors:** the skill finds 3–5 real landing pages, screenshots them section by section and tears them down.
  - What the whole market does becomes the baseline.
  - What the leaders do well gets adopted, in our own words.
  - What nobody does becomes the positioning.
- **Reference standard:** four hand-picked landings set the quality bar for block patterns, copy and visual craft.

Every page gets **its own design**, built from the niche and its competitors. There is no shared template.

## Two modes

- **A. Build from scratch**
  1. Brief.
  2. Competitor capture.
  3. Teardown.
  4. Page plan, then a check-in with you.
  5. Build.
  6. QA: screenshots on desktop and mobile.
- **B. Improve the design** of an existing landing
  1. Capture the current page.
  2. Audit it against the structure and the reference standard.
  3. Plan a **new look**. Your facts, copy and logo stay; the palette, fonts and style are replaced.
  4. Check-in with you.
  5. Edit the page in place.
  6. Compare before and after.

## What's inside

```
skills/
├── landing-page-builder/      # English
└── landing-page-builder-ru/   # Русская версия
    ├── SKILL.md               # workflow, structure, base rules
    ├── references/            # brief, competitor research, framework, reference standard,
    │                          # redesign (mode B), visual system, build + QA, examples
    ├── templates/teardown.md  # teardown file to fill
    └── scripts/capture.mjs    # Playwright: section screenshots + structure/visual extraction
```

## Install

**Claude Code:** copy one or both skill folders into your skills directory.

```bash
git clone https://github.com/natalietd/landing-page-builder.git
```

```bash
mkdir -p ~/.claude/skills && cp -R landing-page-builder/skills/landing-page-builder ~/.claude/skills/
```

To install it for a single project instead, copy the folder into `<project>/.claude/skills/`. For Cursor, use `.cursor/skills/`.

**claude.ai:** zip a skill folder and upload it in Settings → Capabilities → Skills.

```bash
cd landing-page-builder/skills && zip -r landing-page-builder.zip landing-page-builder -x '*/node_modules/*'
```

**The capture script** needs Node 18+. The first run installs Playwright. If Playwright's bundled browser isn't installed, the script falls back to your system Chrome or Edge.

```bash
npm install --prefix ~/.claude/skills/landing-page-builder/scripts
```

## Use

Ask Claude for a landing page as you normally would, for example:

> Build a landing page for my app. Here are the screenshots and pricing.

> Redesign this landing: https://example.com

The skill picks the mode, researches competitors, shows you the plan, then builds and checks the page.
