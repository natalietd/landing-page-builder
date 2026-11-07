# Build

Build from the approved plan (`framework.md` §5) and the visual lock (`visual-system.md`).
Quality bar: the owner should be able to ship it after small edits — no structural rewrite.

## 1. Technical target

- **Existing project** (`package.json`, framework, Tailwind/CSS modules, components): build in its
  stack and conventions; reuse components, tokens, routing.
- **Existing live LP in the repo:** that is Mode B — follow `redesign.md`; restyle in place, keep
  section order, IDs, IA.
- **Greenfield:** one self-contained `index.html`, Tailwind via CDN while designing (compile it before going live, see `seo-geo.md` §9), vanilla JS, designed fresh
  for this niche from the visual lock (no reused page or template). Tweakcn theme given → minimal
  Vite/Next + Tailwind + shadcn/ui so the theme variables apply.
- Ambiguous → pick the default above and say so.

## 2. Copy

- All visible text in the brief's language and register. Code identifiers/comments in English.
- Concrete, no filler; cut hedges and empty adjectives.
- Our facts only. Competitor patterns, never competitor sentences.
- **Describe how the product really works.** Usage, limits and cadence ("one a day", "unlimited",
  "custom topics") come from the owner or the product itself (code, settings, screens). Never infer
  them from a single screenshot label like "Today". Unsure → ask or leave it out.
- Keep original copy from the card/live LP unless asked to rewrite; tighten headlines, don't gut
  explanatory lines.
- Every CTA = action + benefit ("Start free — first clips in 5 minutes"), never "Submit"/"Learn more".
- Benefits restated right before the offer.

## 3. Media

- **Product media goes on the page**: screenshots, recordings, demos, real outputs/work samples,
  product photos, from the owner, the card, or the live product's own site.
- Format follows the niche (see visual lock). Video: autoplay muted loop + `playsinline` + poster.
- Missing asset → leave the space: a blank frame in the asset's real size/aspect with a quiet
  caption of what goes there (+ an HTML `TODO` comment). Never a fake screenshot, never stock in
  place of the product, never competitor assets — and never drop the slot because nothing is ready.
- **How it works = interface per step.** Every step has its screen slot, filled or blank.
- **Mobile apps: "how it works" is a zigzag.** Only that block: one row per step, the **whole** phone
  screenshot (never cropped mid-screen) in a device frame on a soft color field, text beside it, rows
  alternating left/right (stacked on mobile). **Other blocks use their own layouts** (cards, a grid, a
  list, a split…). Never repeat the zigzag, or any one layout, across the page; each block should look
  different from its neighbours.
- **No heavy dark block that steals the page.** A contrast band must stay lighter than the hero in
  attention: no black slab with cropped screens. For apps, prefer light pastel fields per row.
- **Several results = one gallery row**: each item is its own result with its own caption
  (category · source · fragment). Never group them in pairs by source, because two side by side
  read as before/after. Mix sources so the same one isn't adjacent, and give every item its own
  poster or first frame.
- Showing the product with sample numbers → label it "demo data" (in the page language).
- **Never crop away the point of a screen.** If a screenshot is shown, its key element (the
  correction, the button, the number, the level) must be fully visible. Prefer the whole screen. Crop
  only empty space, and look at the result before keeping it.
- Descriptive `alt`, reasonable file sizes, lazy-load below the fold.

## 4. CTA wiring

```js
// TODO: replace with the real destination
const PRODUCT_URL = "TODO_REPLACE_ME"; // or BOOKING_URL for book-a-call
```

- Into the product → all primary buttons use `PRODUCT_URL`. A product input (paste link / upload)
  may hand off to the product with the value in the URL or via the product's own flow.
- Book a call → embed the scheduler in the Offer block (Calendly-style iframe); buttons scroll to
  it or open `BOOKING_URL`. The scheduler owns its fields.
- No custom lead or quiz forms.

## 5. Offer & pricing

Benefit headline → what happens after click → plans with a CTA each → the better-value plan
highlighted (badge + border) → units translated for the avatar → risk reversal → objections/FAQ →
final CTA. Real prices only. Format follows the niche baseline from the teardown.

## 6. QA — in the browser, before handoff

Open the page (desktop ~1440px, then 375px). Click through every section, not just the hero.
Fastest way to compare: run the capture script on our own page too
(`node <skill>/scripts/capture.mjs --out research/qa "file://$PWD/index.html"`) and look at our
`sections/NN.png` next to the competitors'. In the browser also check: no horizontal scroll at
375px, no console errors.

**Against the plan**
- [ ] Every row of the plan table exists; weights look right (Benefits + Product ≈ 60%).
- [ ] Market baseline items are all present.
- [ ] Adopted practices are implemented in the planned block.
- [ ] The lead gap is visible on the first screen or first benefit.

**Against the reference standard** (`reference-standard.md`)
- [ ] All 10 bar items of §1 hold (product on the first screen, avatar eyebrow, highlighted
      headline, CTA microcopy, a real screen per step, result shown, eyebrows, numbers, recap
      before price, final CTA repeats the mechanic).
- [ ] Every block uses a named pattern from §2 and reads at the craft level of §3–4 — put our
      section shots next to the reference shots; ours shouldn't look a level below.

**Against the competitors** (screenshots side by side)
- [ ] Our hero is at least as clear as the leader's: what, for whom, why, CTA — in 5 seconds.
- [ ] We show the product at least as concretely as the best competitor does.
- [ ] Looks like it belongs in this niche (visual lock applied), yet isn't a clone.
- [ ] No competitor copy, numbers or assets.

**Base rules**
- [ ] Strong first screen; avatar named; **the product visual sits in the first 1440×900 viewport** (crop `full.png` to 900px and look).
- [ ] A stranger understands **what happens in the product** from the first screen alone: the core moment is on the screen, and numbered callouts explain it if it isn't obvious.
- [ ] Each CTA paired with a benefit; offer says what happens after the click.
- [ ] One primary action of the chosen type; `PRODUCT_URL`/`BOOKING_URL` constant; no lead/quiz form.
- [ ] How it works shows the real interface for every step — or a blank, labeled frame per step.
- [ ] Real product media or labeled TODOs; no invented proof/prices.
- [ ] Copy in the right language/register; not gutted.
- [ ] Read every headline aloud: one idea, one natural sentence. No clause stitched on from body
      copy to squeeze in a benefit (e.g. "3 steps and clips are ready, while the video is still processing").
- [ ] Headline pass done: every H1/H2 sells an outcome or a concrete product scene; labels live in eyebrows.
- [ ] Every claim about how the product works (cadence, limits, own topics, platforms) is checked
      against the owner or the product itself, not guessed from a screenshot.
- [ ] Pains block present only if the teardown counted it on most competitors / the leader.

**Screens & layout**
- [ ] Every screenshot shows its key element in full; no device frame is clipped by its container;
      no floating card covers screen content.
- [ ] Mobile app: how-it-works is a zigzag of whole phones; **no other block** repeats that layout.
- [ ] Neighbouring blocks look different from each other; no one layout repeated down the page.
- [ ] The contrast section supports the hero, doesn't outshout it.

**Craft**
- [ ] Tokens used; one accent within budget; depth not a flat void; hover + focus states.
- [ ] Mobile: no horizontal scroll, readable type, media and CTA fit; videos play.
- [ ] No console errors; images load; semantic headings; contrast OK.
- [ ] Every heading is readable on its own band: a global `h1–h3` color must not override a light
      band or a white card (use `:where()` for base colors).
- [ ] Multi-line display headlines don't touch: set the line-height on the heading itself (~1.1–1.2);
      Tailwind `text-*` sizes reset it.

Fix failures before showing the owner.

## 7. Handoff

- How to preview: if the page uses local assets (`assets/…`), **serve it over http** (e.g.
  `python3 -m http.server --directory <folder>`) and show that URL. A preview pane that renders a
  file as a static snapshot drops relative images, so the owner sees alt text instead of screens.
  Before handoff, open the exact URL you give the owner and confirm every image loads (scroll past lazy ones).
- Short summary: practices adopted, gap(s) led with, visual system followed.
- Every `TODO` (URLs, assets, proof, prices) and any house-rule conflicts still open.
- If pains were shrunk/skipped, say so and why (competitors don't use them / no real facts / owner).
- Next iterations worth testing (e.g. alternative headline formula seen in the teardown).
- Going live: run `seo-geo.md` and its handoff checklist (one address, robots/sitemap/llms.txt, og, JSON-LD, speed, Search Console).
