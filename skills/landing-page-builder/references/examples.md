# Worked examples

Illustrations of *how the method plays out* in different niches. They are not rules: never carry a
color, format or section from one example into another niche — the teardown decides.

---

## A. AI clip tool (self-serve SaaS, known category) — Vidpeak

- **Brief:** turns long videos into Shorts/Reels; avatar = podcasters, speakers, creators; live
  product → CTA into the product; RU market.
- **Competitors:** OpusClip (leader), Vizard, Klap, plus RU players.
- **Market baseline found:** product input in the hero ("drop a link → get clips"), free start,
  vertical video examples playing on the page, platform icons, usage numbers, FAQ, tiered pricing
  by minutes.
- **Practices adopted:** link input as the hero CTA (Product job pulled into the first screen);
  gallery of real 9:16 output clips with the source video named (Product); minutes translated into
  "hours of source video" on plans (Offer).
- **Gap attacked:** competitors show viral scores but not *why* a moment was picked → our first
  benefit is "you see why each moment was chosen".
- **Visual lock:** followed the leader's dark, cinematic system — lifted near-black bg, geometric
  sans, white pill primary CTA, one violet accent, full-frame playing 9:16 phones.
- **Pains:** none in the current page. Decide by the competitor count (framework §2), not by taste.

## B. Telegram bot for marketplace sellers (subscription) — test run 2026-11-04

(Test run by the skill author; its files are not part of this repo.)

- **Brief:** a bot sends a daily 10:00 sales report (finance metrics + funnel); avatar =
  WB/Ozon sellers and managers; prototype → CTA book a call; 490₽/mo, first month free.
- **Competitors:** MPSTATS (leader), Uniseller, MarketGuru. **Alternatives without a page:** Ozon's
  free official digest bot, WB's WBot.
- **Market baseline found:** free period under the CTA, WB/Ozon named near the CTA, FAQ on
  accuracy/safety, demo call as a CTA, dark violet-black UI with one bright pill CTA.
- **Practices adopted:** product UI in the hero labeled "демо-данные" (Uniseller); "30 min, on your
  data" call framing; "price is not hidden behind a form"; FAQ as "questions that decide".
- **Gaps attacked:** everyone sells a cabinet you must open → headline "report comes to you every
  morning"; market price 2 000–12 000 ₽ vs 490 ₽ → "≈16 ₽ a day"; nobody answers "why pay if Ozon's
  bot is free" → first FAQ question.
- **Conflict flagged:** MPSTATS gates the demo behind a lead form → kept our embedded scheduler.
- **Visual lock:** *not* what we guessed before research (we expected light) — the niche is dark:
  `#0f0b15` bg, Onest, green pill CTA, violet glow, phone frame with the Telegram report.

## C. Local service (done-for-you, known category) — pattern sketch

- e.g. apartment renovation, dental clinic, accounting outsourcing.
- **Typical baseline:** real work photos/before-after, price "from" or calculator, guarantees,
  licenses/reviews with platform ratings, steps of working together, response time, map/area.
- **House rule conflict to flag:** many competitors use quiz calculators and callback forms → we
  keep **book a call** (embedded scheduler or messenger link) and move the calculator idea into a
  static price table with "what affects the price". Owner decides.
- **Typical gap:** nobody states a fixed timeline or what exactly is in the price → lead with it.
- **Visual lock:** usually light and trustworthy; real photos of the team/work, never stock.

---

## D. Vidpeak redesign (Mode B) — the quality target

Approved by the owner on 2026-11-05 ("it's good"). It is a reference for the **quality level**, not a look to reuse:
another niche gets its own design from its topic and competitors.

- **Kept:** the copy, prices, section order, Telegram CTA, brand (dark, violet `#7c5cff`, Geist).
- **Fixed:**
  - the "Про" plan name was invisible (white on white);
  - a clip caption had the wrong timestamp;
  - how-it-works used HTML-drawn mockups instead of real screens.
- **What made it good:**
  - the audience line became an eyebrow above the headline;
  - a display font (Unbounded) for headings, Geist for body;
  - spec chips under the CTA;
  - results as one gallery row of 6 clips with category · source · fragment captions, never pairs;
  - how-it-works on a light contrast band, in a zigzag, with a real-screen frame per step (blank and labeled until the screenshots exist) and a fact badge per step;
  - benefits with source captions;
  - a ✓ recap above the plans;
  - FAQ built from facts already on the page;
  - a closing CTA band that repeats the mechanic.
- **Not added:** a pains block. No competitor check had been done, and there were no real numbers.

## E. Anti-example: AI presentation editor (aideck, 2026-11-18) — what went wrong

A page built with an earlier version of this skill. `qa.mjs` on it: 8 FAIL, 11 WARN. Every item
below is now a rule (`build.md` §2–4, §6) and most are caught automatically.

- **The main CTA went to a dev address.** "Начать работу" and the idea form pointed at
  `https://127.0.0.1:8000`. The hero CTA "build a presentation" only scrolled to the pricing block.
  → Every link goes where its label says; no dev addresses.
- **An orphan form between hero and how-it-works.** "Опишите вашу идею" with a textarea, with no lead and
  no line on what happens next. → A product input lives in the hero or its own explained block, and
  hands off to `PRODUCT_URL`.
- **The hero did the next blocks' jobs.** Eyebrow, H1, lead, CTA, trial terms, a 3-item format list
  (PPTX / PPTX / PDF pills) and an annotated screenshot. The format list repeated step 1, and the
  screenshot reappeared as step 4. → The first screen holds only its own elements; one
  screenshot per block.
- **The same lines over and over.** Trial terms ×5, "PPTX, POTX or a brand book in PDF" ×4, "on
  your master slides, no manual layout after AI" ×4, including as the pricing H2. → Say each fact
  once, where it does its job.
- **Unreadable interface.** Whole desktop editor windows shrunk to 560px; the UI text came out at ~6px.
  → Crop to the panel that matters; UI text ≥ ~11px.
- **A messy template carousel.** Overlapping translucent cards, cards cut by the container edge,
  arrows over the content. → Every gallery item whole.
- **Label headings and an all-caps sentence as the eyebrow.** H2 "Примеры", "Шаблоны"; a 14-word
  eyebrow; a 4-line pricing H2 in a wide display face (Unbounded). → Headline pass, short eyebrows,
  ≤3 lines.
- **A black closing slab on a cream page**, browser-default FAQ markers, Arial in the form field.
- **No Benefits block** (why editable objects in your template beat picture-slides from other
  generators: the page's own gap, never argued).
- **No legal footer** (just the domain) for a paid Russian service, with no offer, privacy policy or
  contact. Published on a Railway `/v3/` URL with no og or canonical.
