// Validates the sitemap files in dist/ against the exported site
// (npm run check:sitemap; wired into postbuild after check:export, before prune).
// Fails the build when the sitemap would mislead crawlers:
//   • the index or a urlset is not well-formed, or is over Google's limits;
//   • a URL is on another origin, duplicated, lacks the trailing slash, has a
//     query or fragment, or looks like localhost / a preview deployment;
//   • a URL has no exported page (it would 404), the page is noindex, or its
//     <link rel="canonical"> is a different URL;
//   • robots.txt is missing, lacks the Sitemap line, or blocks a sitemap URL
//     or the assets pages need to render;
//   • the homepage, scripture, chapter or verse pages are missing.
// The expected origin is NEXT_PUBLIC_SITE_URL (the same value the canonical
// tags are built with), so a sitemap/canonical mismatch cannot ship.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), process.env.NEXT_DIST_DIR || 'dist');
const ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in').replace(/\/+$/, '');
const SECTIONS = ['pages', 'scriptures', 'chapters', 'verses'];
const MAX_URLS = 50000;
const MAX_BYTES = 50 * 1024 * 1024;

const errors = [];
const fail = (scope, msg) => errors.push(`[${scope}] ${msg}`);

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const read = (file) => (existsSync(join(DIST, file)) ? readFileSync(join(DIST, file), 'utf8') : null);

const decode = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

/** Minimal strict parse of the two sitemap document shapes: returns <loc> and <lastmod> text per child element. */
function parse(file, root, child) {
  const xml = read(file);
  if (xml === null) {
    fail(file, 'file missing from dist/');
    return [];
  }
  if (Buffer.byteLength(xml) > MAX_BYTES) fail(file, `larger than ${MAX_BYTES} bytes`);
  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) fail(file, 'missing UTF-8 XML declaration');
  const open = new RegExp(`<${root} xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);
  if (!open.test(xml) || !xml.trimEnd().endsWith(`</${root}>`)) fail(file, `not a well-formed <${root}> document`);
  // Anything between tags other than whitespace means a broken document.
  const stripped = xml
    .replace(/<\?xml[^>]*\?>/, '')
    .replace(new RegExp(`<${child}>(?:<loc>[^<]*</loc>)(?:<lastmod>[^<]*</lastmod>)?</${child}>`, 'g'), '')
    .replace(new RegExp(`</?${root}[^>]*>`, 'g'), '');
  if (stripped.trim() !== '') fail(file, `unexpected content: ${stripped.trim().slice(0, 80)}`);
  const out = [];
  for (const m of xml.matchAll(new RegExp(`<${child}><loc>([^<]*)</loc>(?:<lastmod>([^<]*)</lastmod>)?</${child}>`, 'g'))) {
    const lastmod = m[2];
    if (lastmod && Number.isNaN(Date.parse(lastmod))) fail(file, `invalid lastmod "${lastmod}"`);
    out.push({ loc: decode(m[1]), lastmod });
  }
  if (out.length > MAX_URLS) fail(file, `${out.length} entries (limit ${MAX_URLS})`);
  return out;
}

// ── robots.txt ──
const robots = read('robots.txt');
const disallowed = [];
if (robots === null) fail('robots.txt', 'not exported');
else {
  const lines = robots.split(/\r?\n/).map((l) => l.trim());
  if (!lines.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', `missing "Sitemap: ${ORIGIN}/sitemap.xml"`);
  if (lines.filter((l) => /^sitemap:/i.test(l)).length !== 1) fail('robots.txt', 'expected exactly one Sitemap line');
  for (const l of lines) {
    const m = /^disallow:\s*(\S*)/i.exec(l);
    if (m && m[1]) disallowed.push(m[1]);
  }
  // Rendering assets and every sitemap URL must stay crawlable.
  for (const d of disallowed) {
    if (/^\/(_next|fonts|og|icons|data|scripture|scriptures|sitemap)/.test(d) || d === '/') {
      fail('robots.txt', `Disallow: ${d} blocks public content or rendering assets`);
    }
  }
}

// ── index and sections ──
const index = parse('sitemap.xml', 'sitemapindex', 'sitemap');
const indexed = index.map((e) => e.loc);
for (const s of SECTIONS) {
  if (!indexed.includes(`${ORIGIN}/sitemap-${s}.xml`)) fail('sitemap.xml', `does not list sitemap-${s}.xml`);
}
for (const loc of indexed) if (!loc.startsWith(`${ORIGIN}/`)) fail('sitemap.xml', `${loc} is not on ${ORIGIN}`);

const seen = new Map();
const counts = {};
let noCanonical = 0;
const canonicalOf = (html) => {
  const tag = /<link[^>]*rel="canonical"[^>]*>/.exec(html)?.[0];
  return tag ? decode(/href="([^"]*)"/.exec(tag)?.[1] ?? '') : null;
};
const isNoindex = (html) => /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);

for (const section of SECTIONS) {
  const entries = parse(`sitemap-${section}.xml`, 'urlset', 'url');
  counts[section] = entries.length;
  if (entries.length === 0) fail(`sitemap-${section}.xml`, 'has no URLs');
  for (const { loc } of entries) {
    const scope = `sitemap-${section}.xml`;
    if (seen.has(loc)) {
      fail(scope, `duplicate ${loc} (also in ${seen.get(loc)})`);
      continue;
    }
    seen.set(loc, scope);
    if (!loc.startsWith(`${ORIGIN}/`)) {
      fail(scope, `${loc} is not on ${ORIGIN}`);
      continue;
    }
    if (/localhost|127\.0\.0\.1|\.pages\.dev/.test(loc) && !ORIGIN.endsWith('.pages.dev')) fail(scope, `${loc} is a local or preview URL`);
    if (/^https:\/\/[0-9a-f]{6,}\.[\w-]+\.pages\.dev/.test(loc)) fail(scope, `${loc} is a preview-deployment URL`);
    if (/[?#]/.test(loc)) fail(scope, `${loc} has a query or fragment`);
    if (!loc.endsWith('/')) fail(scope, `${loc} lacks the trailing slash`);
    const path = decodeURI(loc.slice(ORIGIN.length)); // dist/ folders are unencoded
    if (disallowed.some((d) => path.startsWith(d))) fail(scope, `${loc} is disallowed by robots.txt`);
    const html = read(join(path, 'index.html'));
    if (html === null) {
      fail(scope, `${loc} has no exported page (404)`);
      continue;
    }
    if (isNoindex(html)) fail(scope, `${loc} is noindex`);
    const canonical = canonicalOf(html);
    if (canonical === null) noCanonical++;
    else if (canonical !== loc) fail(scope, `${loc} canonical is ${canonical}`);
  }
}

for (const [label, loc] of [
  ['homepage', `${ORIGIN}/`],
  ['scripture page', `${ORIGIN}/scripture/bhagavadgita/`],
  ['chapter page', `${ORIGIN}/scripture/bhagavadgita/chapter/2/`],
  ['verse page', `${ORIGIN}/scripture/bhagavadgita/chapter/2/verse/47/`],
  ['sources page', `${ORIGIN}/sources/`],
  ['topics hub', `${ORIGIN}/wisdom-for-life/`],
  ['privacy page', `${ORIGIN}/privacy/`],
  ['terms page', `${ORIGIN}/terms/`],
  ['contact page', `${ORIGIN}/contact/`],
]) {
  if (!seen.has(loc)) fail('coverage', `${label} ${loc} is not in the sitemap`);
}

if (counts.scriptures < 65) fail('coverage', `scriptures sitemap has ${counts.scriptures} entries; expected all 65+ library texts`);
if (noCanonical > 0) fail('canonical', `${noCanonical} sitemap page(s) have no canonical URL`);

if (errors.length) {
  console.error(`✗ sitemap check failed (${errors.length}):`);
  for (const e of errors.slice(0, 60)) console.error(`  ${e}`);
  if (errors.length > 60) console.error(`  … and ${errors.length - 60} more`);
  process.exit(1);
}
const noCanonicalNote = noCanonical ? `; ${noCanonical} pages carry no canonical tag` : '';
console.log(
  `✓ sitemap check passed: ${seen.size} URLs on ${ORIGIN} (${SECTIONS.map((s) => `${s} ${counts[s]}`).join(', ')})${noCanonicalNote}`,
);
