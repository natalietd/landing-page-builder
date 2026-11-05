# House framework — the 5 jobs

Our structure ("Схема лендинга, который конвертит"). Same in every niche. Competitor research
decides *how* each job is done; this file decides *which jobs* and *how much page* each gets.

## 1. The skeleton

| # | Job | Weight | Job in one line |
|---|-----|--------|-----------------|
| 1 | First screen | 5% | What it is or the payoff, for whom, in one glance |
| 2 | Pains & situation | 15% | Name the reader's problem sharply — only if competitors do |
| 3 | Benefits (преимущества) | 20% | Advantages the reader gets, each proved |
| 4 | Product | 40% | What it is and how it works — shown, not told |
| 5 | Offer & CTA | 20% | Recap, what happens next, price, objections, one action |

- A job is not one section. Competitor patterns like logo bars, testimonials, FAQ, comparison
  tables, integrations, use-case grids are placed *inside* the job they serve.
- Weights are the shape: tiny first screen, short pains, Benefits + Product ≈ 60%.
- Existing live LP or owner-given order: keep it, map jobs onto it. Owner overrides win.

## 2. Per-job rules (+ where competitor practice plugs in)

### 1 — First screen (5%)
- Headline is **a direct description** ("AI e-mail replier") **or a hook benefit** ("Save 10+ hours
  a month on e-mail"). Choose the formula the teardown shows working in this niche — unless a gap
  says otherwise (e.g. everyone is vague → we win by being literal).
- Name the **avatar** (headline or subline) and say **how** in a phrase.
- One primary CTA paired with its promise. Pre-product/validation → no product CTA.
- Proof above the fold if it's market baseline (logos, rating, user count) — only real proof.
- Hero media = the product (see Product rules).

### 2 — Pains & situation (15% — only if competitors use it)
- **The block exists only when the competitors have it**: the teardown shows a pains block on most
  of them or on the leader. No competitor names pains → skip the block; its share goes to Benefits
  and Product. Say so in the handoff.
- **Real facts only.** Every number in a pain (hours, money, delays, the price of the alternative)
  comes from the owner, the project card, or a public source you can name. No source → describe the
  situation without a number, or ask the owner. Never estimate things like "how long manual
  work takes".
- Sharp, concrete, **no filler**; max one screen: 2–3 lines + a one-line bridge. One device, not
  grid + stat + list.
- **Shrink** further when the owner says so or the product visual already shows the problem.
- Pains the competitors ignore can sharpen the wording — they never create the block on their own.

### 3 — Benefits (20%)
- Heading reads as **advantages** (преимущества / "why it works"), not "features" / "what's inside".
- Source: card rows **«Выгода от решения»** + **«Конкурентное преимущество»** + gaps from the teardown.
- Lead with the main benefit; each advantage has **its proof**: a product visual, a number, a
  quote, a before/after — use the proof types that are baseline in this niche.
- Keep the explanatory line under each advantage.

### 4 — Product (40%)
- Unmistakable what it does. **How it works in one screen**: 3–4 numbered steps + a product visual
  is the reliable default; replace with the niche's stronger format if competitors use one
  (interactive demo, live input, video walkthrough, gallery of real outputs, before/after).
  **Mobile app → zigzag rows**, one whole phone screenshot per step (`build.md` §3).
- **Always the real interface.** Each step gets its own screen of the product at that step (one
  screen per step, or one screen with the steps marked on it). Real screenshots/recordings only.
  No screenshot yet → a **blank frame** in the right format (phone 9:16, browser 16:10…) with a
  short caption of what goes there ("Screenshot: connecting the API key"). A text list of
  features, icons or an invented UI is never a substitute for the interface.
- If competitors let people touch the product on the page, we must too.
- Real media in the niche's format (UI screenshots, app phone frames, vertical video, product
  photos, real work samples for services). Examples visible as cards — don't hide them in tabs.

### 5 — Offer & CTA (20%)
- Restate the main benefits right before the offer — never a cold CTA.
- Say **what happens after the click** (instant access, trial length, call agenda, delivery time).
- Pricing: not a bare name+price table. Benefit headline, CTA on each plan, highlight the plan with
  better unit economics, translate abstract units into what the avatar feels. Format follows the
  niche baseline (tiers, calculator, "from" price, packages). Real prices from the card only.
- Risk reversal (trial, guarantee, first month free) if we have one.
- **Objections**: list the niche's automatic objections (works? for me? why you? safe? price?
  switching?) plus those competitors' FAQs reveal; answer each before the final CTA.

## 3. CTA types (two only)

| Type | When | CTA |
|------|------|-----|
| **Into the product** | Live, self-serve | Start / Try / Download / Sign up / real next step. Product input on the page allowed if that's how the niche lets people try. |
| **Book a call** | Sales-led, service, prototype/demo | Book a call / demo, ideally an embedded scheduler in the Offer block |

No lead or quiz forms on the page; qualifying questions live in the product or on the call.
Card row **Тип продукта**: 3 = into the product; 1 (service) or 2 (prototype/demo) = book a call.
Destination in one constant: `PRODUCT_URL` or `BOOKING_URL`.

## 4. Market maturity

- **Known category** (buyers know what it is): compete on clarity, proof, the gap, and matching
  the visual system buyers trust. Shorter pains, more proof and comparison.
- **New category**: more situation framing, more how-it-works, more education, more proof that it
  works at all. Pains (if competitors use them) can take the full 15%.

## 5. The page plan (output of phase 4)

Before building, fill this — one row per section, in page order:

| # | Section | Our job | Content (our facts) | Competitor practice used | Reference pattern | Gap addressed | Media / proof | CTA |
|---|---------|---------|---------------------|--------------------------|-------------------|---------------|---------------|-----|

Each section picks a pattern from `reference-standard.md` §2 (or says why none fits). Check the
plan against the weights, the base rules and the reference bar (§1) before the checkpoint.
