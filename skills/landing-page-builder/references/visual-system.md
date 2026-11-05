# Visual system — derived from competitors

The look comes from the niche, not from taste. Lock it during the teardown, before any CSS.

## 1. Which system to follow

1. Owner's **brand guide** (or colors the owner explicitly calls brand) → those win; fit them to the niche patterns below.
   The current page's styling is **not** a brand guide. In a redesign it is what we replace.
2. Owner names a reference site → that reference is the system.
3. Otherwise → the **category leader** (or the pattern most of the set shares). Buyers already
   trust this look; matching it signals "serious player". Differentiate through content and one
   accent, not a conflicting aesthetic.
4. Optional: owner supplies a tweakcn.com theme → that sets color/type/radius (shadcn/ui + Tailwind).

## 2. Extract (from `page.json` + screenshots)

| Note | Record |
|------|--------|
| Color roles | page bg · surface/card · text · muted text · **one** accent · border/hairline |
| Type | display + body family, weights, headline size/tracking |
| Density | section padding, radius, content per screen, max width |
| Media | format (UI screenshots, phone frames, vertical video, photos, illustrations, 3D), framing, motion |
| CTA | shape (pill / rounded / square), fill, primary vs secondary, count |
| Mood | light / dark, flat / atmospheric, playful / corporate / premium |

Write the lock in the teardown as hex + fonts + CTA shape + media rule.

## 3. Turn it into tokens

```css
:root {
  --bg: …;         /* page background */
  --surface: …;    /* cards, one step from --bg */
  --fg: …;         /* body text */
  --fg-strong: …;  /* headings */
  --muted: …;
  --border: …;
  --accent: …;     /* one family */
  --radius: …;
  --font-display: …;
  --font-body: …;
}
```

Use tokens everywhere — no one-off colors. Fonts: use the leader's if freely available
(Google Fonts / open license); otherwise the closest free equivalent.

## 4. Craft rules (any niche, light or dark)

The niche sets palette, mood and media format; the craft level comes from
`reference-standard.md` §4 (display + body pair, one accent, section rhythm with one contrast band,
framed real UI, eyebrows). Apply both.

- **Depth, not a void.** Surfaces one step off the page bg, hairline borders, a soft gradient/glow
  if the niche uses atmosphere. Avoid pure `#000`/`#fff` flat pages unless the leader does it.
- **One accent, small budget** (3–5 places): key word or underline in H1, CTA hover/focus,
  highlighted plan, step indices or a product-frame hairline. No rainbow, no accent on every heading.
- **Body text** readable (15–17px), slightly softer than pure black/white; real type scale.
- **Two CTA styles max**: primary + secondary (ghost/outline). Shape copied from the reference.
  Always hover + `:focus-visible`.
- **Media treatment from the niche**: frame product media the way the leader does (browser frame,
  device frame, vertical video, raw photo). Real product media only.
- Mobile first: the hero, the how-it-works visual and the CTA must work at 375px.

## 5. Don't

- Invent an aesthetic that fights the niche (editorial serif on a devtool, neon on a law firm,
  corporate blue on a creator tool) unless the owner asks.
- Copy competitor logos, illustrations, photos, screenshots, icons or brand colors 1:1 as *their*
  identity — match the system, keep our identity.
- Add sections, tabs or decorations "to make it look nicer". Structure belongs to the plan.
