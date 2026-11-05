#!/usr/bin/env node
// Capture competitor landing pages for the teardown.
// Usage: node capture.mjs [--out research/competitors] [--max-sections 20] <url> [url...]
// Per URL writes <out>/<host-slug>/{full.png, mobile.png, sections/NN.png, page.json}.
// Needs Playwright: `npm install --prefix <this scripts dir>` (see package.json), then
// `npx playwright install chromium` if no browser is cached.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  const dir = path.dirname(new URL(import.meta.url).pathname);
  console.error(
    `Playwright not found. Install it once:\n  npm install --prefix "${dir}"\n  npx --prefix "${dir}" playwright install chromium`
  );
  process.exit(2);
}

const args = process.argv.slice(2);
let out = "research/competitors";
let maxSections = 20;
const urls = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") out = args[++i];
  else if (args[i] === "--max-sections") maxSections = Number(args[++i]);
  else urls.push(args[i]);
}
if (!urls.length) {
  console.error("Usage: node capture.mjs [--out dir] [--max-sections N] <url> [url...]");
  process.exit(1);
}

const MAX_SHOT_HEIGHT = 16000;
const slug = (u) => {
  const { protocol, hostname, pathname } = new URL(u);
  // Local files: name the folder after the file ("index", "before"), not the whole disk path.
  if (protocol === "file:") return decodeURIComponent(pathname).split("/").pop().replace(/\.html?$/i, "").replace(/[^a-z0-9]+/gi, "-") || "local";
  const p = pathname.replace(/\/+$/, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return (hostname.replace(/^www\./, "") + (p ? "_" + p : "")).slice(0, 80);
};

// Hide cookie/consent overlays without clicking them (no consent is given).
async function hideOverlays(page) {
  await page.evaluate(() => {
    const re = /cookie|consent|onetrust|cmp|gdpr|privacy-banner|cc-window|didomi|usercentrics/i;
    document.querySelectorAll("body *").forEach((el) => {
      const s = getComputedStyle(el);
      const tag = `${el.id} ${typeof el.className === "string" ? el.className : ""}`;
      if (re.test(tag) && (s.position === "fixed" || s.position === "sticky" || s.position === "absolute")) {
        el.setAttribute("data-capture-hidden", "1");
        el.style.setProperty("display", "none", "important");
      }
    });
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
  });
}

async function settle(page) {
  await hideOverlays(page);
  // Scroll to the bottom in steps so lazy content loads, then back to top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight && y < 40000; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

// Runs in the page: structure, CTAs, prices, proof, visual tokens.
function extract(maxSections) {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none";
  };
  const txt = (el) => (el.innerText || "").replace(/\s+/g, " ").trim();
  const absTop = (el) => el.getBoundingClientRect().top + window.scrollY;

  // Sections: semantic blocks first, then large direct children of main/body wrappers.
  let cands = [...document.querySelectorAll("header, section, footer, main > *, body > div > *, [class*='section' i]")]
    .filter((el) => vis(el) && el.getBoundingClientRect().height >= 160 && el.getBoundingClientRect().width >= window.innerWidth * 0.6);
  // Drop elements that contain another candidate (keep the finest top-level blocks), then sort.
  cands = cands.filter((el) => !cands.some((o) => o !== el && el.contains(o) && o.getBoundingClientRect().height >= 160));
  const seen = new Set();
  cands = cands
    .sort((a, b) => absTop(a) - absTop(b))
    .filter((el) => {
      const k = Math.round(absTop(el) / 40);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, maxSections);

  // Fill uncovered vertical gaps (e.g. a hero built from plain divs) with synthetic slices.
  const pageH = document.body.scrollHeight;
  const blocks = cands.map((el) => ({ el, top: absTop(el), height: el.getBoundingClientRect().height }));
  const filled = [];
  let cursor = 0;
  for (const b of [...blocks, { el: null, top: pageH, height: 0 }]) {
    if (b.top - cursor > 300) filled.push({ el: null, top: cursor, height: b.top - cursor });
    if (b.el) filled.push(b);
    cursor = Math.max(cursor, b.top + b.height);
  }
  const inRange = (el, top, h) => {
    const t = absTop(el);
    return t >= top && t < top + h;
  };

  const isCta = (el) => {
    const t = txt(el);
    if (!t || t.length > 70) return false; // benefit-linked CTAs are often long
    if (el.closest("nav, [data-capture-hidden]")) return false;
    if (/^(skip|перейти к содерж|к содержани|to content|to main)/i.test(t)) return false;
    if (el.tagName === "BUTTON" || el.getAttribute("role") === "button") return true;
    const s = getComputedStyle(el);
    const bg = s.backgroundColor;
    const padded = parseFloat(s.paddingLeft) >= 10;
    const filled = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    const outlined = parseFloat(s.borderTopWidth) >= 1 && s.borderTopStyle !== "none";
    const named = /btn|button|cta/i.test(typeof el.className === "string" ? el.className : "");
    return (padded && (filled || outlined)) || named;
  };
  const ctas = (root) =>
    [...root.querySelectorAll("a, button, [role=button]")].filter((el) => vis(el) && isCta(el)).map((el) => ({
      text: txt(el),
      href: el.getAttribute("href") || null,
    }));

  const priceRe = /(?:[$€£₽¥₹]\s?\d[\d\s.,]*|\d[\d\s.,]*\s?(?:₽|руб|р\.|\$|€|£|USD|EUR|RUB)(?:\s?\/\s?\S+)?|\/\s?(?:mo|month|мес|year|год))/gi;
  const proofRe = /(\d[\d\s.,]*\s?(?:\+|k\b|K\b|тыс|млн|M\b|%)|отзыв|review|testimonial|trusted by|нам доверяют|клиент|customers|users|пользовател|рейтинг|rating|★|⭐)/gi;

  // For real elements query inside them; for synthetic slices query the document by position.
  const q = (b, sel) =>
    b.el ? [...b.el.querySelectorAll(sel)] : [...document.querySelectorAll(sel)].filter((x) => vis(x) && inRange(x, b.top, b.height));
  const sections = filled.slice(0, maxSections).map((b, i) => {
    const t = b.el ? txt(b.el) : q(b, "h1,h2,h3,h4,p,li,a,button").map(txt).join(" ");
    return {
      index: i + 1,
      tag: b.el ? b.el.tagName.toLowerCase() : "slice",
      id: b.el?.id || null,
      top: Math.round(b.top),
      height: Math.round(b.height),
      headings: q(b, "h1,h2,h3").filter(vis).map((h) => `${h.tagName}: ${txt(h)}`).slice(0, 8),
      text: t.slice(0, 400),
      ctas: q(b, "a, button, [role=button]").filter((el) => vis(el) && isCta(el)).map((el) => ({ text: txt(el), href: el.getAttribute("href") || null })).slice(0, 6),
      media: { img: q(b, "img, picture").length, video: q(b, "video, iframe[src*='youtube'], iframe[src*='vimeo'], iframe[src*='wistia']").length },
      forms: q(b, "form").length,
      inputs: q(b, "input:not([type=hidden]), textarea, select").length,
      prices: [...new Set(t.match(priceRe) || [])].slice(0, 10),
      proofSignals: [...new Set((t.match(proofRe) || []).map((s) => s.trim()))].slice(0, 10),
    };
  });

  // Visual tokens.
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const h1 = document.querySelector("h1");
  // Primary CTA: first filled button in the first ~1.5 screens.
  const filledBg = (el) => {
    const bg = getComputedStyle(el).backgroundColor;
    return bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
  };
  const firstCta =
    [...document.querySelectorAll("a, button")].find((el) => vis(el) && isCta(el) && filledBg(el) && absTop(el) < window.innerHeight * 1.5) ||
    [...document.querySelectorAll("a, button")].find((el) => vis(el) && isCta(el));
  const bgCount = {};
  document.querySelectorAll("body, body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width * r.height < 40000) return;
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== "rgba(0, 0, 0, 0)") bgCount[bg] = (bgCount[bg] || 0) + Math.round((r.width * r.height) / 10000);
  });
  const fonts = {};
  document.querySelectorAll("h1,h2,h3,p,li,a,button").forEach((el) => {
    const f = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim();
    fonts[f] = (fonts[f] || 0) + 1;
  });

  return {
    title: document.title,
    description: document.querySelector("meta[name=description]")?.content || null,
    lang: document.documentElement.lang || null,
    h1: h1 ? txt(h1) : null,
    pageHeight: document.body.scrollHeight,
    screens: +(document.body.scrollHeight / window.innerHeight).toFixed(1),
    outline: [...document.querySelectorAll("h1,h2,h3")].filter(vis).map((h) => `${h.tagName}: ${txt(h)}`).slice(0, 60),
    ctaTexts: [...new Set(ctas(document).map((c) => c.text))].slice(0, 25),
    formsTotal: document.querySelectorAll("form").length,
    visual: {
      bodyBg: cs(document.body).backgroundColor,
      bodyText: cs(document.body).color,
      bodyFont: cs(document.body).fontFamily,
      h1: h1 ? { font: cs(h1).fontFamily, size: cs(h1).fontSize, weight: cs(h1).fontWeight, color: cs(h1).color, letterSpacing: cs(h1).letterSpacing } : null,
      primaryCta: firstCta
        ? { text: txt(firstCta), bg: cs(firstCta).backgroundColor, color: cs(firstCta).color, radius: cs(firstCta).borderRadius, font: cs(firstCta).fontFamily, padding: cs(firstCta).padding }
        : null,
      dominantBackgrounds: Object.entries(bgCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([c]) => c),
      fontFamilies: Object.entries(fonts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f]) => f),
    },
    sections,
  };
}

// Bundled Chromium first; fall back to the system Chrome / Edge if it isn't downloaded.
let browser;
for (const opts of [{}, { channel: "chrome" }, { channel: "msedge" }]) {
  try {
    browser = await chromium.launch(opts);
    break;
  } catch {}
}
if (!browser) {
  console.error("No browser found. Run: npx playwright install chromium  (or install Google Chrome)");
  process.exit(2);
}
const summary = [];
for (const url of urls) {
  const dir = path.join(out, slug(url));
  await mkdir(path.join(dir, "sections"), { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await settle(page);

    const data = await page.evaluate(extract, maxSections);
    data.url = url;
    data.finalUrl = page.url();
    data.capturedAt = new Date().toISOString();

    const h = Math.min(data.pageHeight, MAX_SHOT_HEIGHT);
    await page.screenshot({ path: path.join(dir, "full.png"), clip: { x: 0, y: 0, width: 1440, height: h }, fullPage: true });
    // Sticky headers / promo bars would be stamped over every section shot — drop them now.
    await page.evaluate(() => {
      document.querySelectorAll("body *").forEach((el) => {
        const p = getComputedStyle(el).position;
        if (p === "fixed" || p === "sticky") el.style.setProperty("display", "none", "important");
      });
    });
    for (const s of data.sections) {
      const y = Math.max(0, s.top);
      const hh = Math.min(s.height, 2400);
      if (y + hh > MAX_SHOT_HEIGHT) break;
      const file = `sections/${String(s.index).padStart(2, "0")}.png`;
      // Scroll-reveal animations only fire when a block is really in the viewport, and a stitched
      // full-page shot leaves them blank. Grow the viewport to the section, scroll to it, wait.
      await page.setViewportSize({ width: 1440, height: Math.max(900, hh) });
      const sy = await page.evaluate((top) => { window.scrollTo(0, top); return window.scrollY; }, y);
      await page.waitForTimeout(900);
      const vh = Math.max(900, hh);
      await page.screenshot({ path: path.join(dir, file), clip: { x: 0, y: y - sy, width: 1440, height: Math.min(hh, vh - (y - sy)) } }).catch(() => {});
      s.screenshot = file;
    }
    await page.setViewportSize({ width: 1440, height: 900 });

    const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const mp = await m.newPage();
    await mp.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await mp.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
    await settle(mp);
    const mh = await mp.evaluate(() => document.body.scrollHeight);
    await mp.screenshot({ path: path.join(dir, "mobile.png"), clip: { x: 0, y: 0, width: 390, height: Math.min(mh, MAX_SHOT_HEIGHT) }, fullPage: true });
    await m.close();

    await writeFile(path.join(dir, "page.json"), JSON.stringify(data, null, 2));
    summary.push({ url, dir, sections: data.sections.length, screens: data.screens, h1: data.h1 });
    console.log(`✓ ${url} → ${dir} (${data.sections.length} sections, ${data.screens} screens)`);
  } catch (e) {
    summary.push({ url, error: String(e.message || e) });
    console.error(`✗ ${url}: ${e.message || e}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
// Merge with earlier runs into the same folder (latest result per URL wins).
let prev = [];
try {
  prev = JSON.parse(await readFile(path.join(out, "summary.json"), "utf8"));
} catch {}
const merged = [...prev.filter((p) => !summary.some((s) => s.url === p.url)), ...summary];
await writeFile(path.join(out, "summary.json"), JSON.stringify(merged, null, 2));
