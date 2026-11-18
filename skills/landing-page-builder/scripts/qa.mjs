// Automatic QA gate for OUR landing page: catches the mechanical failures a manual checklist misses.
// Usage: node qa.mjs <url | file:///abs/path/index.html> [--json report.json]
// Exit code 1 if any FAIL. Fix every FAIL before showing the page; read every WARN and decide.
// Needs Playwright (same setup as capture.mjs).

import { writeFile } from "node:fs/promises";
import path from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const dir = path.dirname(new URL(import.meta.url).pathname);
  console.error(`Playwright not found. Install it once:\n  npm install --prefix "${dir}"\n  npx --prefix "${dir}" playwright install chromium`);
  process.exit(2);
}

const args = process.argv.slice(2);
let url = null, jsonOut = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--json") jsonOut = args[++i];
  else url = args[i];
}
if (!url) { console.error("Usage: node qa.mjs <url> [--json report.json]"); process.exit(2); }

let browser;
for (const opts of [{}, { channel: "chrome" }, { channel: "msedge" }]) {
  try { browser = await chromium.launch(opts); break; } catch {}
}
if (!browser) { console.error("No browser found. Run: npx playwright install chromium"); process.exit(2); }

const findings = [];
const add = (level, rule, msg) => findings.push({ level, rule, msg });

async function open(viewport, mobile = false) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.addStyleTag({ content: "html, body, * { scroll-behavior: auto !important; }" }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight && y < 40000; y += innerHeight * 0.8) {
      scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(500);
  return { ctx, page, errors };
}

// ---------- desktop ----------
const d = await open({ width: 1440, height: 900 });
const res = await d.page.evaluate(() => {
  const vis = (el) => {
    const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    if (!(r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none")) return false;
    for (let p = el; p && p !== document.body; p = p.parentElement) if (parseFloat(getComputedStyle(p).opacity) < 0.05) return false;
    return true;
  };
  const txt = (el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  const lum = (c) => { const m = c.match(/[\d.]+/g); if (!m) return 1; const [r, g, b, a = 1] = m.map(Number); if (a < 0.5) return 1; return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
  const out = {};

  // Links & forms
  const DEV = /(^|\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])([:/]|$)|\.local([:/]|$)|TODO|REPLACE_ME|example\.com/i;
  out.badLinks = [...document.querySelectorAll("a[href], form[action]")].map((el) => [el.tagName, txt(el).slice(0, 40), el.getAttribute("href") ?? el.getAttribute("action")])
    .filter(([, , h]) => DEV.test(h || ""));
  out.deadButtons = [...document.querySelectorAll("a, button")].filter(vis)
    .filter((el) => el.tagName === "A" ? !el.getAttribute("href") || el.getAttribute("href") === "#" : false)
    .map((el) => txt(el).slice(0, 40)).filter(Boolean);
  out.forms = [...document.querySelectorAll("form")].map((f) => ({ id: f.id, action: f.getAttribute("action"), product: f.hasAttribute("data-product-input"), text: txt(f).slice(0, 60), inHero: !!f.closest("#top, #hero, header, [data-hero]") || f.getBoundingClientRect().top + scrollY < innerHeight }));
  const offerIds = ["offer", "pricing", "price", "tariff", "plans", "тариф"];
  out.ctaToPricing = [...document.querySelectorAll("a[href^='#']")].filter(vis)
    .filter((a) => offerIds.some((k) => a.getAttribute("href").toLowerCase().includes(k)))
    .map((a) => [txt(a).slice(0, 50), a.getAttribute("href")])
    .filter(([t]) => t && !/(тариф|цен|price|pricing|plan|стоимост|сколько)/i.test(t));

  // Headings
  out.h1 = [...document.querySelectorAll("h1")].map(txt);
  out.labelHeadings = [...document.querySelectorAll("h2")].filter(vis).map(txt).filter((t) => t && t.split(/\s+/).length <= 2);
  out.longHeadings = [...document.querySelectorAll("h1, h2")].filter(vis).map((h) => {
    const lh = parseFloat(getComputedStyle(h).lineHeight) || parseFloat(getComputedStyle(h).fontSize) * 1.15;
    return [txt(h).slice(0, 60), Math.round(h.getBoundingClientRect().height / lh)];
  }).filter(([, lines]) => lines > 3);
  out.longEyebrows = [...document.querySelectorAll("p, span, div")].filter(vis).filter((el) => {
    const s = getComputedStyle(el); const t = txt(el);
    return el.children.length <= 1 && t.length > 0 && (s.textTransform === "uppercase" || /eyebrow|kicker|overline/i.test(el.className)) && parseFloat(s.fontSize) <= 15 && t.length > 50;
  }).map((el) => txt(el).slice(0, 90));

  // Repetition: sentences/phrases of 6+ words seen 3+ times
  const blocks = [...document.querySelectorAll("p, li, h1, h2, h3, figcaption, summary, td, span, small")]
    .filter((el) => vis(el) && el.children.length === 0 && !el.closest("details, [data-faq]")).map(txt).filter((t) => t.split(/\s+/).length >= 4);
  const grams = {};
  for (const b of blocks) {
    const w = b.toLowerCase().replace(/[«»"“”.,:;!?()—–-]/g, " ").split(/\s+/).filter(Boolean);
    const seen = new Set();
    for (let i = 0; i + 6 <= w.length; i++) { const g = w.slice(i, i + 6).join(" "); if (!seen.has(g)) { seen.add(g); grams[g] = (grams[g] || 0) + 1; } }
  }
  out.repeats = Object.entries(grams).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 8);

  // Dark full-width slabs
  out.darkSlabs = [...document.querySelectorAll("section, footer, div")].filter(vis).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width >= innerWidth * 0.9 && r.height >= 200 && lum(getComputedStyle(el).backgroundColor) < 0.18;
  }).map((el) => (el.id ? "#" + el.id : el.tagName.toLowerCase()) + " · " + txt(el).slice(0, 50));
  const heroBg = lum(getComputedStyle(document.body).backgroundColor);
  out.pageIsDark = heroBg < 0.3;

  // Images: legibility, reuse, clipping
  const imgs = [...document.images].filter(vis);
  const uniq = (arr) => [...new Map(arr.map((x) => [x[0], x])).values()];
  const shape = (i) => { const r = i.getBoundingClientRect(); return { w: r.width, ratio: i.naturalWidth / Math.max(1, r.width), aspect: i.naturalWidth / Math.max(1, i.naturalHeight) }; };
  // Heavily downscaled big image: the interface text can't survive it.
  out.tinyUi = uniq(imgs.filter((i) => { const s = shape(i); return i.naturalWidth >= 1000 && s.w >= 450 && s.ratio > 3; })
    .map((i) => [i.getAttribute("src").split("/").pop(), i.naturalWidth, Math.round(shape(i).w)]));
  // A whole desktop window (wide aspect) shown under 700px: UI text usually drops below ~10px.
  out.smallDesktopUi = uniq(imgs.filter((i) => { const s = shape(i); return s.aspect >= 1.3 && s.w >= 240 && s.w < 700 && !i.closest("figure[data-gallery], [data-gallery]"); })
    .map((i) => [i.getAttribute("src").split("/").pop(), Math.round(shape(i).w)]));
  const bySrc = {};
  imgs.filter((i) => i.getBoundingClientRect().width >= 120).forEach((i) => { const s = i.currentSrc || i.src; const sec = i.closest("section")?.id || i.closest("section, header, footer")?.tagName || "?"; (bySrc[s] ||= new Set()).add(sec); });
  out.reused = Object.entries(bySrc).filter(([s, set]) => set.size > 1 && !/logo|avatar|icon|favicon/i.test(s)).map(([s, set]) => [s.split("/").pop(), [...set]]);
  out.clipped = imgs.map((i) => {
    const r = i.getBoundingClientRect(); if (r.width < 120) return null;
    for (let p = i.parentElement; p && p !== document.body; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(s.overflow + s.overflowX + s.overflowY)) {
        const c = p.getBoundingClientRect();
        const visW = Math.max(0, Math.min(r.right, c.right) - Math.max(r.left, c.left));
        const visH = Math.max(0, Math.min(r.bottom, c.bottom) - Math.max(r.top, c.top));
        const shown = (visW * visH) / (r.width * r.height);
        if (shown > 0.05 && shown < 0.85) return [i.getAttribute("src").split("/").pop(), Math.round(shown * 100) + "% visible"];
        break;
      }
    }
    return null;
  }).filter(Boolean);
  out.overlaps = (() => {
    const big = imgs.filter((i) => i.getBoundingClientRect().width > 160).map((i) => [i, i.getBoundingClientRect()]);
    const hits = [];
    for (let a = 0; a < big.length; a++) for (let b = a + 1; b < big.length; b++) {
      const [ia, A] = big[a], [ib, B] = big[b];
      if (ia.contains(ib) || ib.contains(ia)) continue;
      const w = Math.min(A.right, B.right) - Math.max(A.left, B.left), h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
      const share = (w * h) / Math.min(A.width * A.height, B.width * B.height);
      // >95% = a deliberate stack (deck/carousel layers, only the top one shows): skip it.
      if (w > 30 && h > 30 && share > 0.15 && share < 0.95) hits.push([ia.getAttribute("src").split("/").pop(), ib.getAttribute("src").split("/").pop()]);
    }
    return hits.slice(0, 6);
  })();
  out.noAlt = [...document.images].filter((i) => !i.hasAttribute("alt")).map((i) => i.getAttribute("src"));

  // FAQ
  out.defaultFaqMarkers = [...document.querySelectorAll("summary")].filter((s) => getComputedStyle(s).display === "list-item").length;

  // Footer & legal
  const f = document.querySelector("footer");
  const ftxt = f ? txt(f) : "";
  out.footer = f ? { text: ftxt.slice(0, 120), links: f.querySelectorAll("a").length, legal: /(privacy|terms|конфиденциальн|персональн|оферт|соглашени|policy|impressum|legal)/i.test(ftxt), contact: /(@|mailto|tel:|t\.me|телефон|support)/i.test(f.innerHTML) } : null;

  // Fonts actually rendering fallbacks
  const declared = new Set([...document.fonts].map((x) => x.family.replace(/["']/g, "")));
  out.fallbackFonts = [...new Set([...document.querySelectorAll("h1,h2,h3,p,a,button,li,summary,label,textarea,input")].filter(vis)
    .map((el) => getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim()))]
    .filter((f) => declared.size && !declared.has(f) && /^(arial|helvetica|times|times new roman|georgia|verdana|system-ui|sans-serif|serif)$/i.test(f));

  // Head
  const m = (sel) => document.querySelector(sel);
  out.head = { title: document.title, description: !!m('meta[name="description"]'), canonical: !!m('link[rel="canonical"]'), ogImage: !!m('meta[property="og:image"]'), lang: document.documentElement.lang, tailwindCdn: !!m('script[src*="cdn.tailwindcss.com"]') };
  out.url = location.href;
  return out;
});

// ---------- mobile ----------
const mb = await open({ width: 390, height: 844 }, true);
const mres = await mb.page.evaluate(() => {
  const head = document.querySelector("header, nav");
  const hs = head ? getComputedStyle(head) : null;
  const sticky = hs && (hs.position === "sticky" || hs.position === "fixed");
  return {
    overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    headerH: head ? Math.round(head.getBoundingClientRect().height) : 0,
    sticky,
    smallTap: [...document.querySelectorAll("a, button")].filter((b) => { const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 36 && (b.innerText || "").trim().length > 2; }).length,
  };
});
await mb.ctx.close();

// ---------- verdicts ----------
const r = res;
if (r.badLinks.length) add("FAIL", "links", `dev/placeholder destinations shipped: ${r.badLinks.map((x) => `${x[0]} "${x[1]}" → ${x[2]}`).join("; ")}`);
if (r.deadButtons.length) add("FAIL", "links", `links with no destination: ${r.deadButtons.slice(0, 6).join(" | ")}`);
r.forms.forEach((f) => {
  if (!f.product) add("FAIL", "forms", `custom form "${f.text}" (action=${f.action}). House rule: no lead/quiz forms. A product input must hand off to PRODUCT_URL and carry data-product-input.`);
  else if (!f.inHero) add("WARN", "forms", `product input "${f.text}" sits outside the hero — give it its own headline + what happens after submit, or move it into the hero.`);
});
if (r.ctaToPricing.length) add("WARN", "cta", `product-sounding CTAs only scroll to pricing: ${r.ctaToPricing.map((x) => `"${x[0]}" → ${x[1]}`).join("; ")}. The label must say where it goes, or link to PRODUCT_URL.`);
if (r.h1.length !== 1) add("FAIL", "headings", `${r.h1.length} H1 on the page (need exactly 1)`);
if (r.labelHeadings.length) add("FAIL", "headings", `label H2s (move to eyebrow, write a headline that sells): ${r.labelHeadings.join(" | ")}`);
if (r.longHeadings.length) add("WARN", "headings", `headlines over 3 lines at 1440px (cut words or lower the size; wide display fonts wrap fast): ${r.longHeadings.map((x) => `"${x[0]}" ${x[1]} lines`).join("; ")}`);
if (r.longEyebrows.length) add("WARN", "headings", `eyebrows longer than a short label (move the sentence to the lead): ${r.longEyebrows.join(" | ")}`);
if (r.repeats.length) add("FAIL", "copy", `the same phrase appears 3+ times (say each fact once where it does its job): ${r.repeats.map(([g, n]) => `"${g}…" ×${n}`).join("; ")}`);
if (r.darkSlabs.length && !r.pageIsDark) add("FAIL", "visual", `heavy dark full-width block on a light page: ${r.darkSlabs.slice(0, 3).join(" | ")}`);
if (r.tinyUi.length) add("FAIL", "media", `UI screenshots shrunk so far the interface text is unreadable — crop to the part that matters or show it larger: ${r.tinyUi.map((x) => `${x[0]} ${x[1]}px→${x[2]}px`).join("; ")}`);
if (r.smallDesktopUi.length) add("WARN", "media", `desktop UI shown small — open each at 100% zoom: if UI text is under ~11px, crop to the panel that matters or show it bigger (a gallery of outputs can opt out with data-gallery): ${r.smallDesktopUi.slice(0, 8).map((x) => `${x[0]} at ${x[1]}px`).join("; ")}${r.smallDesktopUi.length > 8 ? ` … +${r.smallDesktopUi.length - 8}` : ""}`);
if (r.reused.length) add("WARN", "media", `the same image in several blocks: ${r.reused.map((x) => `${x[0]} in ${x[1].join(", ")}`).join("; ")}`);
if (r.clipped.length) add("FAIL", "media", `images cut by their container: ${r.clipped.slice(0, 6).map((x) => `${x[0]} (${x[1]})`).join("; ")}`);
if (r.overlaps.length) add("WARN", "media", `images partly overlapping — fine for a deliberate composition, a bug if one covers the other's content (a collage of cards, a float on a screen): ${r.overlaps.map((x) => x.join(" ⟂ ")).join("; ")}`);
if (r.noAlt.length) add("WARN", "media", `${r.noAlt.length} <img> without alt`);
if (r.defaultFaqMarkers) add("WARN", "craft", `${r.defaultFaqMarkers} FAQ <summary> with the browser's default ▶ marker — style the accordion`);
if (!r.footer) add("FAIL", "footer", "no <footer>");
else {
  if (!r.footer.legal) add("FAIL", "footer", `footer has no legal links (privacy / terms; for RU paid services: оферта + политика ПДн + реквизиты). Footer: "${r.footer.text}"`);
  if (!r.footer.contact) add("WARN", "footer", "footer has no contact (email / Telegram / phone)");
}
if (r.fallbackFonts.length) add("WARN", "craft", `elements render in a fallback font: ${r.fallbackFonts.join(", ")} (inputs/buttons need font: inherit)`);
if (!r.head.description || !r.head.canonical || !r.head.ogImage) add("WARN", "seo", `head missing: ${["description", "canonical", "ogImage"].filter((k) => !r.head[k]).join(", ")} — run references/seo-geo.md before going live`);
if (r.head.tailwindCdn && /^https?:/.test(url) && !/localhost|127\.0\.0\.1/.test(url)) add("WARN", "seo", "Tailwind Play CDN on a live URL — compile the CSS (seo-geo.md §9)");
if (/railway\.app|vercel\.app|netlify\.app|onrender\.com|\/v\d+\/?$/.test(r.url)) add("WARN", "seo", `served from a platform/version URL (${r.url}) — publish on the brand's own domain`);
if (mres.overflowX) add("FAIL", "mobile", "horizontal scroll at 390px");
if (mres.headerH > 72) add("FAIL", "mobile", `header is ${mres.headerH}px tall at 390px${mres.sticky ? " and sticky" : ""} — one row: small logo + short CTA (≤3 words)`);
if (mres.smallTap) add("WARN", "mobile", `${mres.smallTap} tap targets under 36px tall`);
const errs = [...new Set(d.errors)];
if (errs.length) add("FAIL", "console", errs.slice(0, 3).join(" | "));
await d.ctx.close();
await browser.close();

const order = { FAIL: 0, WARN: 1 };
findings.sort((a, b) => order[a.level] - order[b.level]);
console.log(`QA ${url}`);
for (const f of findings) console.log(`${f.level.padEnd(4)} [${f.rule}] ${f.msg}`);
const fails = findings.filter((f) => f.level === "FAIL").length;
console.log(`\n${fails} FAIL · ${findings.length - fails} WARN${fails ? " — fix every FAIL before showing the owner" : ""}`);
if (jsonOut) await writeFile(jsonOut, JSON.stringify({ url, findings, raw: { desktop: res, mobile: mres } }, null, 2));
process.exit(fails ? 1 : 0);
