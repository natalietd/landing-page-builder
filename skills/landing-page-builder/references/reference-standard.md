# Reference standard — the quality bar

Competitors show *how this niche does it*. These four pages show *how well it should be done*:
how blocks are built, how copy reads, how much craft goes into each screen. They were picked by the
owner as good landing pages. Use them in both modes (scratch and redesign).

| Ref | URL | Niche | Mood | Why it's here |
|-----|-----|-------|------|---------------|
| **M** | https://muestralo.netlify.app/ | AI UGC video for e-shops (ES) | Light, grey/white, yellow marker + red CTA | Real UI in hero, result gallery, one real screen per step, savings calculator, no-fine-print block |
| **C** | https://aicarouselmaker.vercel.app/ | AI carousel maker (EN) | Light, soft pastel gradient, one blue accent | Product input *is* the hero, output wall, tabbed live demo, honest Free vs Pro |
| **U** | https://ups-fit.ru/ | App for personal trainers (RU) | Dark + light cards, lime accent, mascot | Device trio hero, 4 phones = 4 steps, feature zigzag with real screens, benefits recap before tariffs |
| **S** | https://saytext.ru | Audio → text transcription (RU) | White, violet accent, line illustrations | Upload widget in hero, mini-UI per step, interactive example of the result, monthly/yearly toggle |

To look at them again: `node <skill>/scripts/capture.mjs --out research/reference <url>…`
Take **patterns and craft**, never their copy, numbers, assets or brand.

## 1. What all four do (non-negotiable bar)

1. **The product is visible on the first screen** — in the hero itself, **without scrolling** (1440×900:
   fully visible next to the headline; 390×844: at least starting to show). A real interface, or the
   product's own input. Never a centered headline with the product pushed below the fold, and no
   abstract illustration in the hero.
2. **The avatar is named before or above the headline**, in plain words: an eyebrow line such as
   "For online stores in Spain that run their own ads" or "App for personal trainers who train online and in the gym".
3. **The headline is literal + result.** Key words carry a highlight: a marker, an accent color, or a second line in the accent.
4. **Microcopy under every primary CTA removes the risk**: "no card", "14 days free", "first 10
   minutes free", "you see the result before paying".
5. **How it works = 3–4 steps, each with its own real screen of that step.**
6. **The result is shown, not described**: a gallery of real outputs, or an interactive example.
7. **Every section has an eyebrow label** (small caps: KNOW THIS? / HOW IT WORKS / PRICING) +
   a headline that states a benefit, not a topic.
8. **Numbers everywhere**: price per unit, time saved, cost of the alternative, limits.
9. **The benefits are recapped right before the prices** (a strip or a checklist), so no CTA is cold.
10. **The final CTA repeats the core mechanic** ("Upload a photo, pick an actor, see it before
    paying"), or repeats the hero input.

## 2. Pattern library by job

Pick per page based on the product and the niche baseline. More than one can be right.

### First screen
| Pattern | Use when | Seen in |
|---------|----------|---------|
| **Split: copy left, real UI right**, browser frame + phone overlapping, a sticker with the key differentiator | SaaS / app with a visual flow | M |
| **Device trio** (tablet + 2 phones) + caption under it + slider with pause | Mobile-first app, several roles | U |
| **Product input as hero**: prompt box/upload zone + example chips + "⌘+Enter" hint | The product starts from one input (text, file, link) | C, S |
| Spec chips under the CTA (format · duration · language · currency) | The output has hard specs buyers check | M |
| Social proof line under the input (stars + "1,500+ creators") | Only when real | C |

### Pains & situation
Only when the competitors use a pains block (framework §2), and only with real numbers.

| Pattern | Seen in |
|---------|---------|
| Eyebrow "Know this?" + headline left, 3 pains right as ✕ rows (bold lead + grey line), **bridge in a highlighted box** ↓ | M |
| Big headline + 4 icon rows + a mascot illustration + a bold bridge line | U |
| 4 cards with soft icons (headline + one line) | S |
Concrete pain numbers (the price and delay of the alternative) beat adjectives.

### Benefits
| Pattern | Seen in |
|---------|---------|
| **Savings calculator vs the alternative** (slider → "you save X/month · Y/year", a source footnote) | M |
| Before/after time ("text in minutes instead of an evening") with a visual metaphor | S |
| 3 benefit cards with an icon, headline and outcome line | C |
| "No fine print" grid (free correction, no watermark, a human answers, prices with VAT) + **"Not for you if…"** line | M |
| Real testimonials with name + role + photo, one large + two small | C |

### Product
| Pattern | Seen in |
|---------|---------|
| **Zigzag steps**: real browser screen ↔ step text, a cost badge per step ("€0") | M |
| **Mobile app, how it works only: zigzag rows**: one full phone screenshot per step on a color field, text beside it, alternating sides. Other blocks use other layouts | owner rule |
| **N phones in a row = N steps**, loop line "and so every week": web product with a companion app only, **not** an app's how-it-works (that is the zigzag above) | U |
| Step cards with a **mini UI fragment** per step + a progress line 01–04 | S |
| **Tabbed live demo** (01 Enter idea · 02 Generate · 03 Download) inside an app frame | C |
| **Result gallery / marquee** of real outputs, right after the hero: one row, each item with its own caption (category · source · fragment). No pairs per source — they read as before/after | M, C |
| **Interactive example of the output** (player + transcript, "Example" label) + CTA "Try on your own file" | S |
| **Feature zigzag**: real screen + feature name + one line about the outcome ("everything you kept in your head, now in the app") | U |
| Capabilities grid (6 cards) for secondary features | S |

### Offer & CTA
| Pattern | Seen in |
|---------|---------|
| Dark **benefit strip** (3 ✓ with an outcome + one line) above the plans | M |
| Benefit list (5 rows) right above "Tariffs" | U |
| Two-column offer: headline + ✓ list + CTA left, plan cards right | C |
| **Price per unit** under the plan price ("€5.90 per video") + a savings badge on the best plan | M |
| Monthly / yearly toggle with a "−17%" chip | S |
| Plan ladder by usage ("up to 5 / 10 / 15 clients") + a "more? write to us" card | U |
| Free tier as the entry ("First carousel is on us", "Start with 10 free minutes") | C, S |
| Footnote under the plans: VAT included, no card, cancel anytime | M, U |
| FAQ = the real objections (is it legal, accent, do I ship the product, can I cancel) | M, S |
| Final CTA block repeating the mechanic + the hero input again | M, C |

## 3. Copy craft

- **Bold lead + grey explanation** in every list row ("**Your ads tire out** — your audience has
  already seen those videos").
- Headlines talk to the reader and promise an outcome: "Four steps and you see your product in
  the actor's hands *before paying*".
- Name the alternative and its cost (a freelancer, manual work, a spreadsheet) — the reader compares anyway.
- One idea per line; no "innovative", "powerful", "seamless".
- **Headline pass before handoff:** every H1/H2 must sell. It names an outcome or a concrete scene from
  the product ("Rehearse the conversations Portugal will throw at you"), never a label or a vague claim
  ("Situations", "Built for speaking", "Why it works" — those belong in the eyebrow). Step titles say
  what the user gets, not the menu item ("See every correction", not "Session summary"). Facts only.
- CTA text = action + object: "Create my first video", "Try it on your own file", "Start with the monthly plan".

## 4. Visual craft

- **Display + body pair**: a characterful display font for headlines (Bricolage Grotesque, Unbounded,
  tight DM Sans) + a quiet body font (Figtree, Manrope, Onest). H1 54–82px, negative tracking.
- **One accent** + neutrals; the accent marks key words, CTA, steps, the best plan.
- **Section rhythm**: alternate the page bg and a surface tone; **one contrast section** (a calculator,
  a benefit strip, a closing CTA) breaks the page. It supports the hero, never outshouts it: no black
  slab with cropped screens. On soft/pastel brands, use a color field instead of black.
- Cards: radius 16–28px, hairline border or soft shadow, generous padding; content max ~1200px.
- **Real UI is framed**: browser chrome (3 dots + title), a device bezel, or a white card with a
  shadow. Frames tilt or overlap only in the hero. The frame is never clipped by its container, and
  floating cards sit beside or below a screen, never on top of its content.
- Small personality is allowed (a mascot, line illustrations) — in pains/offer, never instead of the product.
- Pill or soft-rounded CTAs with a colored shadow; an arrow → in the CTA.
