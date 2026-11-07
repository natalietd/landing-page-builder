# SEO & GEO: before the page goes live

Do this once the design is approved and the page is about to go live, or when the owner asks for SEO/GEO.
The goal: a search or AI bot can find the page, read its text and save it to the index. The page
then shows in Google and Bing, and assistants such as ChatGPT, Perplexity, Claude and Gemini can
quote it. The work is technical and doesn't change the design or the copy's voice.

Facts only, as everywhere else in the skill. Schema, `llms.txt` and FAQ answers repeat what the page and the product
really say. Never add ratings, reviews, user counts or prices that don't exist.

## 1. Domain, HTTPS, one address

- Pick one main address, for example `https://www.site.com`. The other variants (`http://`, the
  other www/non-www form, a trailing slash, `/index.html`, `/page.html`) must answer with a
  **permanent** redirect (301 or 308) to it.
- **Check:** `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" <each variant>` returns 200 for
  the main address only. A certificate error on the variant without www usually means stray
  A records at the registrar, such as a parking or forwarding record. Remove them and keep only
  the host's records.

## 2. Webmaster accounts

- **Google Search Console:** a Domain property (verified by DNS) covers every variant. Submit
  `sitemap.xml` there, then use URL inspection → Request indexing on the main page.
- **Bing Webmaster Tools:** import the site from Search Console. Copilot runs on Bing's index,
  and Bing is a major source for ChatGPT search.
- **Yandex Webmaster and Metrica:** only when the audience is in Russia or the CIS.
- **Analytics:** GA4 or Metrica. Ask the owner, because it needs their account and usually a cookie banner.
- These are the owner's accounts. They sign in; you act in the browser with their permission. Never
  enter passwords yourself.

## 3. robots.txt

- `User-agent: *` with `Allow: /` (or `Disallow:` lines for service paths only), plus explicit
  `Allow: /` blocks for the AI search bots: `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`,
  `Claude-SearchBot`. Add `GPTBot`, `ClaudeBot`, `Google-Extended` and `Applebot-Extended` unless
  the owner wants to opt out of AI training. Blocking training bots doesn't affect search.
- End the file with `Sitemap: https://<main address>/sitemap.xml`.
- Never `Disallow: /`, and never block CSS or JS.
- A bot obeys only the block that names it, so repeat any service `Disallow:` lines in each named block.

## 4. sitemap.xml

- List every page that answers 200, isn't `noindex` and isn't a duplicate. Use the main-address
  URLs, each with `<lastmod>`.
- **Check:** after you submit it in Search Console, its status reads Success.

## 5. Status codes, canonical, noindex

- A missing page must answer **404**, not 200, with its own 404 page that links back to the main
  sections.
- Put `<link rel="canonical">` on every page, pointing at its own main-address URL, never at a
  URL that redirects.
- Service pages (thank-you, test pages, the 404 page) get `noindex`. Never also block those pages in robots.txt,
  or the bot can't read the `noindex`.

## 6. Text is in the HTML

- Every heading, the FAQ and the prices must be in the raw HTML, not rendered by JS. A static
  `index.html` passes. On React or Vue, use SSR or static generation.
- **Check:** `curl -A "OAI-SearchBot/1.0" <url>` returns 200 and contains the H1, the FAQ and the price.
  Run the same check with `PerplexityBot`, `Claude-SearchBot`, `Googlebot` and `bingbot`. The CDN
  or firewall must not answer 403 or a challenge page.
- Key facts are text, never only inside an image. Every `<img>` has a real `alt`, and decorative
  images get `alt=""`.

## 7. Structure and links

- Clean URLs: lowercase with hyphens, one or two levels deep.
- Every page is reachable from the main page, and the legal and support pages link back to it.
- Link text says where the link goes.

## 8. Title, description, headings, Open Graph

- `<title>` up to about 60 characters: what the product is and who it's for, with the brand. Unique per page.
- `<meta name="description">` of 140–160 characters: answer, benefit, terms.
- Exactly one H1 per page.
- `lang` on `<html>`, `og:title`, `og:description`, `og:url`, `og:image` (**1200×630**, with
  `og:image:width`/`height`/`alt`), `twitter:card=summary_large_image`, `theme-color`.
- Icons: `/favicon.ico` (32×32), `/apple-touch-icon.png` (180×180) and a 192×192 PNG. Crop the
  source square on the subject; never squash a non-square image.
- The share image is its own 1200×630 render, made from the hero copy and the real product screen
  shown whole. Don't screenshot the page at 1200×630: floats and phones get clipped at that size.
  Look at the result before using it.
- A mobile app on iOS also gets `<meta name="apple-itunes-app" content="app-id=…">`, the Safari
  smart banner.

## 9. Speed and mobile

The target on mobile Lighthouse is LCP under 2.5 s, CLS under 0.1 and INP under 200 ms. Run
`npx lighthouse <url> --only-categories=performance,seo,accessibility,best-practices`. The
PageSpeed API often runs out of quota, so run Lighthouse locally.

- **Tailwind:** the Play CDN (`cdn.tailwindcss.com`) is for prototypes only. Before going live, compile
  the CSS with `npx tailwindcss@<same version> -i in.css -o site.css --minify`, with `content`
  pointing at the page. Inline it in a `<style>` tag if it's under about 20 KB, otherwise link it.
  Then remove the CDN script and compare screenshots before and after.
- **Images:** use WebP at about 2× the largest size they're shown at. A phone screenshot shown
  about 300 px wide becomes a 600 px WebP. If `cwebp` or `sharp` isn't installed, encode
  with headless Chromium (`canvas.toDataURL('image/webp', 0.82)`). Every `<img>` gets
  `width`/`height` and `loading="lazy"` below the first screen. The hero image gets
  `fetchpriority="high"` plus a `<link rel="preload" as="image">`. Keep the JPGs for og and schema.
- **Fonts:** load Google Fonts without blocking rendering
  (`rel="preload" as="style"` plus `media="print" onload="this.media='all'"` plus `<noscript>`), with
  `display=swap`.
- **Contrast:** secondary text on pastel fields often fails 4.5:1. Darken the token rather than
  dropping the field.
- **Caching:** put long cache headers on `/assets/*` through the host config, such as `vercel.json`
  `headers`.

## 10. Structured data (JSON-LD)

Put it in one `@graph` in `<head>`, and keep it the same as the visible text.

| Type | When | Key fields |
|---|---|---|
| `Organization` | always | name, url, logo, email, `sameAs` (App Store page, socials), founder |
| `WebSite` | always | url, name, inLanguage, publisher |
| `MobileApplication` / `SoftwareApplication` / `Product` / `Service` | the product | description, operatingSystem, applicationCategory, `offers` (real prices and currency), screenshot, featureList, downloadUrl |
| `FAQPage` | the page has a FAQ | generate it **from the visible FAQ markup**, so the two can't drift |
| `Person` | a named founder or author | name, url, email |
| `AggregateRating` / `Review` | **only real ones** | Google flags it as missing; leave it missing until real ratings exist |

**Check:** Google's Rich Results Test (`search.google.com/test/rich-results?url=…`) shows valid items and no critical errors.

## 11. GEO: what AI search adds

- **Extractable answers:** the first FAQ item is a 40–60 word definition: "What is X? X is a [category]
  for [who] that [does what]…". Add FAQ items for the questions people actually ask an
  assistant: price ("How much does X cost?" with real numbers and currency), "What can I do with
  it?", platform and availability, level or requirements. Every answer must make sense on its own,
  without the surrounding page.
- **llms.txt** at the root: one blockquote summary, then key facts (platform, language, how it works,
  price, who it's for), then links (site, store, support, privacy, terms). Use only facts that are
  already on the page.
- **Trust:** a named maker (founder or team) and a contact email, with the same brand name and
  description on the site, in the schema, the store and the socials (`sameAs`).
- **Bot access:** the AI search bots get 200 (section 6). Behind Cloudflare, check AI Crawl
  Control and Bots: allow the search bots, and the owner decides about the training bots.
- **Tracking:** in analytics, set up a segment for traffic from chatgpt.com, perplexity.ai,
  copilot.microsoft.com and gemini.google.com (ChatGPT adds `utm_source=chatgpt.com`).

## Handoff checklist

```
[ ] one main address; the other variants redirect permanently; HTTPS valid on all of them
[ ] robots.txt allows the AI search bots and lists the sitemap
[ ] sitemap.xml lists the 200 pages; submitted in Search Console with status Success
[ ] main page: Request indexing done in Search Console
[ ] own 404 page that answers 404, with links back
[ ] canonical on every page points at the main address
[ ] curl as OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, bingbot: 200, H1, FAQ and price in the HTML
[ ] title ≤60 characters, description 140–160 characters, one H1, alt on every img
[ ] og 1200×630 checked by eye; favicon, apple-touch-icon, theme-color
[ ] JSON-LD valid in the Rich Results Test; FAQPage matches the visible FAQ; no invented ratings
[ ] Lighthouse mobile: LCP <2.5 s, CLS <0.1; no Tailwind Play CDN in production
[ ] llms.txt with real facts
[ ] told the owner: Bing import, analytics, and adding ratings to the schema once real reviews exist
```
