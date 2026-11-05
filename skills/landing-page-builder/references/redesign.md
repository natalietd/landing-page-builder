# Mode B — Improve the design of an existing landing

The page already exists (URL, repo file, or a screenshot). The owner wants it to **look and work
better**, not a new product story. Keep their facts and words; **design it anew**.

**"Redesign" means a new look.** The current palette, fonts and styling are what we are replacing,
not a brand to protect. A result that only re-lays out blocks in the old colors and fonts is a fail.

## 1. What stays, what changes

| Stays (unless the owner says otherwise) | Changes |
|------------------------------------------|---------|
| Product facts, prices, offer, CTA destinations | Visual system: tokens, type pair, accent, rhythm, cards |
| Section order and anchors/IDs | Hierarchy inside each block: eyebrow, headline, lead, media, CTA |
| The owner's copy (headlines may be tightened, explanations are never cut) | Block *pattern* (e.g. text list → steps with real screens) |
| Logo and product name | **The whole look**: palette, fonts, shapes, backgrounds, rhythm — built fresh (§3 Visual) |
| Brand colors **only** if there is a brand guide or the owner names them as brand | Media framing: real UI in browser/device frames, blank labeled frames where missing |
| Stack and components of the repo | CTA microcopy, spacing, mobile layout, states |

A structural gap (no pains *while the competitors have them*, no how-it-works, CTA without a benefit, no recap before the price) is
**proposed, not silently added**. List it at the checkpoint with the house rule it breaks.

## 2. Workflow

| # | Phase | Output |
|---|-------|--------|
| 0 | **Work on a copy** if the page is live/deployed: keep `before.html` untouched, build in `index.html` next to it; replace the live file only on the owner's OK | `before.html` + working copy |
| 1 | **Capture the current page**: `capture.mjs` on the live URL or `file://…/before.html` | `research/before/` sections + `page.json` |
| 2 | **Audit**: score every section against the house structure (5 jobs + base rules) and the reference standard (`reference-standard.md` §1 bar, §2 patterns, §3–4 craft) | Audit table |
| 3 | **Competitor check** (2–3 pages, required): the niche look, how they show the product, whether they use a pains block. It feeds the **new** visual system | 3–5 lines in the audit + a new visual lock |
| 4 | **Redesign plan**: per section, keep / restyle / re-pattern + the chosen pattern + the visual lock → **checkpoint with the owner** | Plan table |
| 5 | **Build**: edit in place (same stack, same order, same IDs), at the quality level of `examples.md` §D, in the **new** visual system (old look not reused) | The page |
| 6 | **QA**: recapture to `research/after/`, compare before/after section by section, run `build.md` §QA | Before/after + handoff |

### Audit table

| # | Section (as on the page) | Our job | Problems (hierarchy · media · copy · CTA · mobile) | Bar item / base rule broken | Fix: keep / restyle / re-pattern → pattern |
|---|---|---|---|---|---|

Typical findings:
- the hero shows an illustration instead of the product;
- the avatar isn't named;
- no microcopy under the CTA;
- how-it-works without screens;
- a wall of equal cards with no hierarchy;
- the price without a recap or per-unit price;
- many accents;
- flat, empty sections;
- a broken mobile layout;
- invisible text (a heading colored for another background);
- **facts that disagree across sections**: the same clip or number captioned differently in two places. Cross-check every repeated fact.

## 3. Rules

- **Content first, decoration never.** Every change must make the job of its block clearer. Don't add
  sections, tabs or effects "to look nicer".
- **Real interface rule applies**: when a section re-patterns into steps or a feature zigzag and
  the screenshots don't exist, put blank, correctly sized, labeled frames there, with a `TODO`.
- **Visual: build a new system** with `visual-system.md`, using the niche + competitors + reference
  craft. Keep the logo/name. Keep a brand color only when a brand guide exists or the owner says
  so. Then it may stay as the accent, and everything else is still new.
- Before building, write down **3 visible differences** from the old look (e.g. "beige paper →
  clean white + deep green band", "system font → characterful display pair", "flat cards →
  framed devices on color fields"). If you can't name three, it's not a redesign yet.
- Copy edits are limited to: tightening headlines, adding eyebrows, CTA microcopy, bold leads.
  Anything bigger → propose at the checkpoint.
- **A new benefit headline may only reuse facts already on the page.** Don't let "make it a
  benefit" invent a claim ("publish without edits", "an hour → 5 clips" over a 15-minute example).
  Chips and counters follow the same rule: "source 14:45", not "14:45 → 2 clips" when only two are shown.
- **FAQ and a closing CTA** are low-risk additions when every answer uses facts already on the
  page. Propose them, and build after the owner's OK. A pains block follows framework §2: only
  if competitors use it, and only with real numbers.
- Show **before/after** pairs (same section, same width) in the handoff, plus the list of
  proposed-but-not-done structural changes.
