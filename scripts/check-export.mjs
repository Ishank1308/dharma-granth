// Smoke test for the static export in dist/, run after `next build`
// (npm run check:export; wired as postbuild). Guards regressions that were
// each found by hand:
//   • pages server-rendered at opacity:0 (framer `initial`), invisible until
//     hydration — the h1 of every key page must not sit inside such a block;
//   • chapters missing verses (a stale Gita chapter showed 65 of 72) or
//     shipping none in the HTML — every chapter page must carry as many
//     verse cards as its scriptures-full source;
//   • chapters without an exported page (deep links would 404);
//   • course content rendered client-only (the pathways page shipped a spinner);
//   • the splash screen leaking onto deep-link landing pages.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, process.env.NEXT_DIST_DIR || 'dist');
const SOURCE = join(ROOT, 'public/data/scriptures-full');

const errors = [];
let verseScripts = '';
const fail = (scope, msg) => errors.push(`[${scope}] ${msg}`);

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

// ── 1. Key pages: exported, have an h1, and it is not server-rendered hidden ──
const KEY_PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/learn/',
  '/learn/pathways/',
  '/practice/',
  '/learn/start/',
  '/learn/journeys/',
  '/privacy/',
  '/terms/',
  '/contact/',
  '/concepts/',
  '/dictionary/',
  '/wisdom-for-life/',
  '/characters/',
  '/festivals/',
  '/rituals/',
  '/locations/',
  '/timelines/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  // Personal pages: data is client-side, but the header must still export.
  '/practice/dashboard/',
  '/practice/desk/',
  '/practice/journal/',
  '/practice/saved/',
  '/collections/',
  '/practice/bookmarks/',
];
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style']);
const HIDDEN_STYLE = /opacity:\s*0(?![.\d])/;

/** Returns the reason the first <h1> is hidden, '' if visible, or null if there is no h1. */
function firstH1Visibility(html) {
  const stack = [];
  const tag = /<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = tag.exec(html))) {
    const [, closing, rawName, attrs, selfClosing] = m;
    const name = rawName.toLowerCase();
    if (closing) {
      const i = stack.map((e) => e.name).lastIndexOf(name);
      if (i !== -1) stack.length = i;
      continue;
    }
    if (name === 'h1') {
      const hidden = stack.find((e) => e.hidden);
      return hidden ? `inside <${hidden.name} style="${hidden.style}">` : '';
    }
    if (RAW_TEXT.has(name)) {
      const end = html.indexOf(`</${name}`, tag.lastIndex);
      tag.lastIndex = end === -1 ? html.length : end;
      continue;
    }
    if (VOID.has(name) || selfClosing) continue;
    const style = /\bstyle="([^"]*)"/.exec(attrs)?.[1] ?? '';
    stack.push({ name, style, hidden: HIDDEN_STYLE.test(style) });
  }
  return null;
}

const pageHtml = (route) => {
  const file = join(DIST, route, 'index.html');
  return existsSync(file) ? readFileSync(file, 'utf8') : null;
};

for (const route of KEY_PAGES) {
  const html = pageHtml(route);
  if (html === null) {
    fail(route, 'page was not exported');
    continue;
  }
  const visibility = firstH1Visibility(html);
  if (visibility === null) fail(route, 'no <h1> in the exported HTML (content rendered client-only?)');
  else if (visibility) fail(route, `<h1> is server-rendered hidden, ${visibility}`);
}

// ── Shared static shell: a single export must ship the same header counters and themes everywhere ──
{
  const pages = [];
  const walkPages = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const stat = statSync(path);
      if (stat.isDirectory()) {
        if (!['_next', 'og', 'pinterest', 'data'].includes(name)) walkPages(path);
      } else if (name === 'index.html') pages.push(path);
    }
  };
  walkPages(DIST);
  const expectedThemes = 'day,sunset,paper,night,auto';
  const observedCounts = new Set();
  let missingShell = 0;
  let badEncoding = 0;
  let kaithiPages = 0;
  let errorFallbacks = 0;
  for (const path of pages) {
    const html = readFileSync(path, 'utf8');
    const route = path.slice(DIST.length).replace(/\\/g, '/').replace(/\/index\.html$/, '/') || '/';
    const countMeta = /<meta name="dharma-library-verse-count" content="(\d+)"\s*\/?\s*>/i.exec(html)?.[1];
    const themeMeta = /<meta name="dharma-theme-options" content="([^"]+)"\s*\/?\s*>/i.exec(html)?.[1];
    const uiScript = /<meta name="dharma-ui-script" content="([^"]+)"\s*\/?\s*>/i.exec(html)?.[1];
    const header = /<nav\b[^>]*data-site-header="true"[^>]*data-library-verse-count="(\d+)"[^>]*data-theme-options="([^"]+)"/i.exec(html);
    if (!countMeta || !themeMeta || !uiScript || !header || !/lang="hi"/.test(html)) {
      missingShell++;
      if (missingShell <= 5) fail(route, 'shared shell metadata/header missing from exported HTML');
      continue;
    }
    observedCounts.add(countMeta);
    if (header[1] !== countMeta) fail(route, `header count ${header[1]} differs from shared metadata ${countMeta}`);
    if (themeMeta !== expectedThemes || header[2] !== expectedThemes) fail(route, `theme controls differ from expected options (${expectedThemes})`);
    if (uiScript !== 'Devanagari,Latin') fail(route, `unexpected UI script declaration: ${uiScript}`);
    if (!/[\u0900-\u097F]/.test(html) || !/[A-Za-z]/.test(html) || html.includes('�')) badEncoding++;
    if (/[\u{11080}-\u{110CF}]/u.test(html)) kaithiPages++;
    if (/त्रुटि निवारण · Error Recovery|This page could not load|Part of the page failed to download/.test(html)) errorFallbacks++;
  }
  if (pages.length === 0) fail('shell', 'no exported HTML pages found');
  if (observedCounts.size !== 1) fail('shell', `header verse counts vary across pages: ${[...observedCounts].join(', ') || 'none'}`);
  if (missingShell > 5) fail('shell', `${missingShell} pages are missing shared header metadata`);
  if (badEncoding > 0) fail('encoding', `${badEncoding} exported page(s) are missing Devanagari/Latin text or contain the replacement character`);
  if (kaithiPages > 0) fail('encoding', `${kaithiPages} exported page(s) contain Kaithi UI glyphs (U+11080–U+110CF)`);
  if (errorFallbacks > 0) fail('SSG', `${errorFallbacks} exported page(s) contain the manual chunk recovery screen`);
  if (!/dharma-library-verse-count/.test(pageHtml('/') ?? '')) fail('/', 'home page lacks the shared library count');
}

// The hero search must keep the query and open grouped results; it must not route to a first match.
{
  const hero = readFileSync(join(ROOT, 'app/components/HeroSection.tsx'), 'utf8');
  const searchTypes = readFileSync(join(ROOT, 'lib/search-types.ts'), 'utf8');
  if (!/onSubmit=\{\(event\) => \{[\s\S]*?openGlobalSearch\(query\)/.test(hero)) {
    fail('hero search', 'form submit does not open global search with the entered query');
  }
  if (!/SEARCH_GROUPS\.map\(\(group\)/.test(readFileSync(join(ROOT, 'app/components/GlobalSearchModal.tsx'), 'utf8'))) {
    fail('hero search', 'global search does not render categorized result groups');
  }
  for (const group of ['verse', 'scripture', 'concept', 'topic', 'learning']) {
    if (!new RegExp(`id: '${group}'`).test(searchTypes)) fail('hero search', `search category ${group} is missing`);
  }
}

// Redirects and privacy pages are part of the static-host contract as well as the app routes.
{
  const cloudflareRules = readFileSync(join(ROOT, 'public/_redirects'), 'utf8');
  const netlifyRules = readFileSync(join(ROOT, 'netlify.toml'), 'utf8');
  for (const [label, rules, pattern] of [
    ['Cloudflare', cloudflareRules, /^\/start-here\s+\/learn\/start\//m],
    ['Cloudflare', cloudflareRules, /^\/sadhana\/?\s+\/practice\//m],
    ['Cloudflare', cloudflareRules, /^\/topics\s+\/wisdom-for-life\//m],
    ['Netlify', netlifyRules, /from\s*=\s*"\/start-here"[\s\S]*?to\s*=\s*"\/learn\/start\/"/],
    ['Netlify', netlifyRules, /from\s*=\s*"\/sadhana"[\s\S]*?to\s*=\s*"\/practice\/"/],
    ['Netlify', netlifyRules, /from\s*=\s*"\/topics"[\s\S]*?to\s*=\s*"\/wisdom-for-life\/"/],
  ]) {
    if (!pattern.test(rules)) fail('routing', `${label} missing required route redirect: ${pattern}`);
  }
  const practice = pageHtml('/practice/') ?? '';
  if (/Friday, September 18|Sharad Navaratri begins.{0,30}23 days|Durga Ashtami.{0,30}30 days/i.test(practice)) {
    fail('/practice/', 'static HTML contains stale, build-time daily or festival dates');
  }
}

// ── Splash screen is home-only (readers arriving from search go straight in) ──
for (const route of KEY_PAGES) {
  const hasSplash = /class="splash"/.test(pageHtml(route) ?? '');
  if (route === '/' && !hasSplash) fail(route, 'home page is missing the splash screen');
  if (route !== '/' && hasSplash) fail(route, 'splash screen should only be on the home page');
}

// ── Canary: the most-searched verse's text is in its chapter page's HTML ──
if (!(pageHtml('/scripture/bhagavadgita/chapter/2/') ?? '').includes('कर्मण्येवाधिकारस्ते')) {
  fail('/scripture/bhagavadgita/chapter/2/', 'verse 2.47 (कर्मण्येवाधिकारस्ते) is not in the exported HTML');
}

// ── Verse pages: one per verse of each scripture in VERSE_PAGE_SCRIPTURE_IDS
// (lib/verse-paths.ts), each with its text and structured data ──
{
  const idsSrc = readFileSync(join(ROOT, 'lib/verse-paths.ts'), 'utf8');
  const listSrc = /VERSE_PAGE_SCRIPTURE_IDS\s*=\s*\[([^\]]*)\]/.exec(idsSrc)?.[1] ?? '';
  const ids = [...listSrc.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  if (ids.length === 0) fail('verse pages', 'could not read VERSE_PAGE_SCRIPTURE_IDS from lib/verse-paths.ts');
  let expected = 0;
  let missing = 0;
  let sample = '';
  for (const id of ids) {
    const path = join(SOURCE, `${id}.json`);
    if (!existsSync(path)) continue;
    const book = JSON.parse(readFileSync(path, 'utf8'));
    for (const chapter of book.chapters ?? []) {
      for (const verse of chapter.verses ?? []) {
        if (!/^[0-9A-Za-z]+(?:[.\-][0-9A-Za-z]+)*$/.test(String(verse.number))) continue;
        expected++;
        const html = pageHtml(`/scripture/${id}/chapter/${chapter.number}/verse/${verse.number}/`);
        // The FAQ structured data is built from the verse's Hindi / English meaning, so a verse
        // without either (source text not yet translated) legitimately has only the Article data.
        const needsFaq = Boolean(verse.translation || verse.hindi);
        if (
          !html ||
          !html.includes(`id="verse-${verse.number}"`) ||
          !html.includes('"Article"') ||
          (needsFaq && !html.includes('"FAQPage"'))
        ) {
          missing++;
          sample ||= `${id} ${chapter.number}.${verse.number}`;
        }
      }
    }
  }
  if (missing > 0) fail('verse pages', `${missing}/${expected} verse pages missing or incomplete (first: ${sample})`);
  else verseScripts = `${expected} verse pages across ${ids.length} scriptures`;
}

// ── 4. Pathways ship their course content, not just a shell ──
{
  const html = pageHtml('/learn/pathways/') ?? '';
  const steps = (html.match(/id="pathway-steps-/g) ?? []).length;
  const stepTitles = (html.match(/<h4\b/g) ?? []).length;
  if (steps === 0 || stepTitles === 0) {
    fail('/learn/pathways/', `pathway steps missing from the exported HTML (${steps} panels, ${stepTitles} step titles)`);
  }
}

// ── 2 & 3. Every source chapter has an exported page carrying all its verses ──
// (Chapter pages render their verses at build time, so crawlers see the text;
// a stale or missing verse would show up as a count mismatch here.)
let chaptersChecked = 0;
let inlined = 0;
let splitChapters = 0;
// Alias ids (data/scripture-aliases.ts) are 301s in public/_redirects, not pages, even when a data file exists.
const ALIASES = new Set(
  [...readFileSync(join(ROOT, 'data/scripture-aliases.ts'), 'utf8').matchAll(/^\s*'?([\w-]+)'?:\s*'[\w-]+',/gm)].map((m) => m[1]),
);
for (const file of readdirSync(SOURCE).filter((f) => f.endsWith('.json'))) {
  const id = file.replace(/\.json$/, '');
  if (ALIASES.has(id)) continue;
  let source;
  try {
    source = JSON.parse(readFileSync(join(SOURCE, file), 'utf8'));
  } catch (err) {
    fail(id, `source JSON unreadable: ${err.message}`);
    continue;
  }
  for (const chapter of source.chapters ?? []) {
    chaptersChecked++;
    const ref = `${id} ch${chapter.number}`;
    const pagePath = join(DIST, 'scripture', id, 'chapter', String(chapter.number), 'index.html');
    if (!existsSync(pagePath)) {
      fail(ref, 'chapter page was not exported');
      continue;
    }
    const want = chapter.verses?.length ?? 0;
    const html = readFileSync(pagePath, 'utf8');
    const cards = (h) => new Set(h.match(/<article[^>]*\bid="verse-[^"]+"/g) ?? []).size;
    let got = cards(html);
    // Chapters split into parts (lib/chapter-parts): part 1 is the chapter
    // page, the rest live at part/{n}/; together they carry every verse.
    const partsDir = join(DIST, 'scripture', id, 'chapter', String(chapter.number), 'part');
    if (existsSync(partsDir)) {
      for (const p of readdirSync(partsDir)) {
        const partPage = join(partsDir, p, 'index.html');
        if (existsSync(partPage)) got += cards(readFileSync(partPage, 'utf8'));
      }
      splitChapters++;
    }
    if (want > 0 && got === want) {
      inlined++;
    } else if (want > 0 && got > 0) {
      fail(ref, `page HTML has ${got} verse cards, source has ${want}`);
    } else if (want > 0) {
      // A few parvas are too large for one HTML file; they still load a shard.
      const shardPath = join(DIST, 'data/scriptures-full', id, `ch-${chapter.number}.json`);
      if (!existsSync(shardPath)) {
        fail(ref, 'no verses in the page HTML and no shard to load them from');
      } else {
        const shardVerses = JSON.parse(readFileSync(shardPath, 'utf8')).chapter?.verses?.length ?? 0;
        if (shardVerses !== want) fail(ref, `shard has ${shardVerses} verses, source has ${want} (stale shard?)`);
      }
    }
  }
}

{
  const gita2 = pageHtml('/scripture/bhagavadgita/chapter/2/') ?? '';
  const mentions = gita2.split('कर्मण्येवाधिकारस्ते').length - 1;
  if (mentions < 1) {
    fail('/scripture/bhagavadgita/chapter/2/', 'Sanskrit of 2.47 is missing from the server HTML');
  }
}

// ── Page-weight budgets (measured 2026-09-29: worst page 1.15 MB raw / 240 KB gz,
// first-load JS 215–260 KB gz). Long, detail-rich chapters can have larger raw
// HTML because Next serializes the verse props for hydration as well as rendering
// semantic HTML. Guard both raw output size and compressed transfer size.
//
// First-load JS counts only scripts a modern browser downloads. Next's
// polyfills file (~30 KB gz) carries `noModule`, which every browser that runs
// the site's ES modules skips, so it is not counted. The limit was lowered from
// 320 KB (when it was counted) to 300 KB so the check stays as tight: chapter 2
// measures ~288 KB, i.e. ~12 KB of real headroom.
const MAX_HTML_BYTES = 2.5 * 1024 * 1024;
// Recalibrated 2026-10-24: the largest chapter page (Vivekachudamani ch. 1,
// 189 verses, no duplication) legitimately measures 452 KB gz after the trust
// and reading-flow additions. 475 KB keeps ~23 KB of real headroom.
const MAX_HTML_GZ = 475 * 1024;
const MAX_FIRST_LOAD_JS_GZ = 350 * 1024;
// ── No page server-renders content hidden until hydration ──
// A framer `initial={{ opacity: 0 }}`, `whileInView`, or `AnimatePresence` without `initial={false}` writes
// style="opacity:0" into the static HTML: the content is invisible until JavaScript runs (header theme icons,
// chapter links and the japa count all shipped that way). Reveals belong in CSS (motion/primitives.tsx).
// Decorative elements marked aria-hidden="true" are allowed.
const HIDDEN_ELEMENT = /<([a-z][\w-]*)\b[^>]*\sstyle="[^"]*\bopacity:\s*0(?![.\d])[^"]*"[^>]*>/gi;
{
  let worst = { size: 0, path: '' };
  let worstGz = { size: 0, path: '' };
  let hiddenPages = 0;
  const hiddenExamples = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) {
        if (!['_next', 'og', 'pinterest', 'data'].includes(name)) walk(p);
      } else if (name === 'index.html') {
        if (st.size > worst.size) worst = { size: st.size, path: p };
        const html = readFileSync(p);
        if (st.size > MAX_HTML_GZ) {
          const compressedSize = gzipSync(html).length;
          if (compressedSize > worstGz.size) worstGz = { size: compressedSize, path: p };
        }
        let hidden = false;
        for (const m of html.toString('utf8').matchAll(HIDDEN_ELEMENT)) {
          if (/\saria-hidden="true"/.test(m[0])) continue;
          hidden = true;
          // Group by the tag and its classes, so one component shows once however many pages carry it.
          const shape = `<${m[1]} ${(m[0].match(/\sclass="[^"]*"/)?.[0] ?? '').trim().slice(0, 90)}>`;
          if (!hiddenExamples.has(shape)) hiddenExamples.set(shape, p.slice(DIST.length).replace(/\\/g, '/'));
        }
        if (hidden) hiddenPages++;
      }
    }
  };
  walk(DIST);
  if (worst.size > MAX_HTML_BYTES) {
    fail('weight', `${worst.path} is ${Math.round(worst.size / 1024)} KB (budget ${MAX_HTML_BYTES / 1024} KB)`);
  }
  if (worstGz.size > MAX_HTML_GZ) {
    fail('weight', `${worstGz.path} is ${Math.round(worstGz.size / 1024)} KB gz (budget ${MAX_HTML_GZ / 1024} KB)`);
  }
  if (hiddenPages > 0) {
    fail('hidden', `${hiddenPages} page(s) server-render content at opacity:0 until hydration:`);
    for (const [shape, page] of [...hiddenExamples].slice(0, 8)) fail('hidden', `  ${shape} (first on ${page})`);
  }
  for (const path of ['/', '/scripture/bhagavadgita/chapter/2/', '/practice/dashboard/']) {
    const html = pageHtml(path) ?? '';
    const files = new Set([...html.matchAll(/_next\/static\/[^"']+\.js/g)].map((m) => m[0]));
    // Drop `<script nomodule>` files: legacy-browser polyfills that modern browsers never fetch.
    for (const tag of html.matchAll(/<script\b[^>]*>/gi)) {
      if (!/\snomodule\b/i.test(tag[0])) continue;
      const src = tag[0].match(/_next\/static\/[^"']+\.js/);
      if (src) files.delete(src[0]);
    }
    let gz = 0;
    for (const f of files) {
      const file = join(DIST, f);
      if (existsSync(file)) gz += gzipSync(readFileSync(file)).length;
    }
    if (gz > MAX_FIRST_LOAD_JS_GZ) {
      fail('weight', `${path} loads ${Math.round(gz / 1024)} KB gz of JS (budget ${MAX_FIRST_LOAD_JS_GZ / 1024} KB)`);
    }
  }
}

if (errors.length > 0) {
  console.error(`✗ Export check failed (${errors.length}):`);
  for (const e of errors.slice(0, 40)) console.error(`  ${e}`);
  if (errors.length > 40) console.error(`  … and ${errors.length - 40} more`);
  process.exit(1);
}
console.log(
  `✓ Export check passed: ${KEY_PAGES.length} key pages visible; ${inlined}/${chaptersChecked} chapters ` +
    `carry all their verses in HTML (${splitChapters} split into parts), the rest load a matching shard; ${verseScripts}.`,
);
