# Competitor research & teardown

The core of the skill. Goal: know how *this niche* sells before writing a word, then fill our
structure with the practices that already work here.

Time box: ~3–5 competitors, one pass. Depth over breadth.

---

## 1. Find the competitors

Sources, in order:
1. URLs the owner sent, or the card rows **«Рынок и конкуренты» / «Конкурент + ссылка»**.
2. If fewer than 3: web search for the category the way a buyer would search it
   (`"<job to be done> tool"`, `"<category> for <avatar>"`, `"<category>" + city/country` for local
   services, the same in the landing's language). Add the obvious category leader.
3. Ask the owner only if the niche is so new that search returns nothing relevant.

Pick a balanced set:
- **The leader** (most known / most traffic / most reviews) — the buyer's mental benchmark.
- **1–2 direct competitors** — same avatar, same price range, same market/language.
- **Optional: 1 adjacent or rising player** with a sharp page — often the best ideas.

Confirm the list with the owner in one line (no waiting if they want speed).

**Alternatives without a landing page count too.** Official marketplace/platform features, free
bots, spreadsheets, an agency, "do nothing" — anything the buyer would use instead. They have no
page to tear down, but they are the source of the hardest objection ("why pay if X is free?").
List them in the teardown as *Alternatives* and answer them in the Offer/FAQ.

## 2. Pick the right page for each

The homepage is often not the page that converts. Prefer, in order:
1. **Paid-traffic landing pages** — pages competitors pay to send traffic to are their tested ones.
   If the `ad-library-checker` skill or ad libraries (Google Ads Transparency, Meta Ad Library)
   are available, find the ad and follow its destination URL.
2. A dedicated landing for the same avatar/use case (`/for-<segment>`, `/<use-case>`).
3. Homepage + pricing page.

Capture the market version that matches ours (same language/country when it exists).

## 3. Capture

Run the script (screenshots per section + structured extraction):

```bash
node <skill>/scripts/capture.mjs --out research/competitors <url1> <url2> <url3>
```

It writes per competitor: `full.png`, `mobile.png`, `sections/NN.png`, and `page.json` (section
outline, headings, CTA texts, prices, proof signals, fonts, colors). **Look at the screenshots** —
the JSON tells structure, the images tell quality; the "primary CTA" and colors are heuristics.

Some sites will fail (timeouts, geo-blocking, certificates the browser doesn't trust — common for
RU sites on the national CA). Then: try the browser tools (screenshot + read the page), or a web
fetch for text only; if still nothing, swap in the next competitor. Never weaken TLS or security
settings to get a capture. Record failed sites in the teardown so the owner knows the set.

Competitor screenshots are research material. They never go on our page.

## 4. Teardown (fill `research/teardown.md`)

Copy `templates/teardown.md`. For each competitor, record per **our 5 jobs**:

| Job | What to record |
|-----|----------------|
| First screen | Headline formula (product-first / benefit-first / outcome number / audience call-out), subhead, CTA text + what it promises, hero media type, proof above the fold |
| Pains | Do they name pains at all? **Count them — this decides whether we have the block.** How (list, story, stat, before/after)? How long? Which numbers, and is a source given? |
| Benefits | Which benefits they claim, how each is proved (screenshot, number, quote, demo) |
| Product | How they show it working: steps, video, interactive demo, live input, UI tour, gallery of outputs |
| Offer & CTA | Pricing model and format, free tier/trial, risk reversal, what happens after click, FAQ topics, final CTA, guarantees |
| Proof (anywhere) | Logos, numbers, reviews, case studies, ratings, media mentions — and where they sit |
| Visual | Palette roles (bg / surface / text / accent), fonts, density, radius, media format, CTA shape |
| Length & order | Section list in order, approx. screens per job |

Then for each competitor: **one thing they do best** and **one weakness** (vague hero, no real
product shown, hidden price, unanswered objection…).

## 5. Synthesis (the part that matters)

Write these four lists at the end of the teardown:

1. **Market baseline** — patterns most of the set uses. Buyers expect them. Missing one reads as
   "less serious". Include each, mapped to a block.
2. **Best practices to adopt (3–7)** — each with: the pattern, who uses it, which of our blocks it
   goes into, why it serves that block's job. Rule: used by the leader or ≥2 competitors or on an ad
   landing, *and* it serves the job.
3. **Gaps to attack (1–3)** — what nobody answers/shows/names. Check: unanswered objections
   (price, trust, "will it work for me", switching cost, time to result), unproven claims, ignored
   segments, nobody showing real output, nobody stating what happens after the click. The strongest
   gap goes into the first screen or the first benefit.
4. **Conflicts with house rules** — e.g. everyone gates price behind a form, everyone runs a quiz.
   Default: house rule wins; list it for the owner.

Also lock the **visual system** here (see `visual-system.md`) and note the **market maturity**
(known category vs new — see `framework.md` §4).

## 6. What never to take

Competitor copy (headlines, taglines, paragraphs), their numbers, testimonials, logos, client
lists, illustrations, photos, video or any asset. Take the *pattern*, write *our* version with *our*
facts. If we don't have the fact the pattern needs (e.g. a customer count), use a different proof
type or a `TODO` — never a made-up number.

## 7. At the checkpoint, show the owner

Five short lines, not the whole teardown:
- Competitors analyzed (and which page of each).
- Market baseline we'll match.
- Practices we're adopting → which block.
- Gap(s) we lead with.
- Visual lock (bg / accent / type / CTA shape / media) and whose system it follows.
Plus any house-rule conflicts that need a decision. Link `research/teardown.md` for detail.
