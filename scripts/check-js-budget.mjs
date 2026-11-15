/**
 * JavaScript budget for the exported site (audit 2026-10-22, P1): the gzip size of the scripts a
 * page loads up front, read from the exported HTML itself. `nomodule` scripts (legacy polyfills)
 * are not counted, because modern browsers skip them.
 *
 *   node scripts/check-js-budget.mjs            report only
 *   node scripts/check-js-budget.mjs --strict   exit 1 when a page is over budget (npm run check:js-budget, after every build)
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const dist = path.resolve(root, process.env.NEXT_DIST_DIR || 'dist');
const strict = process.argv.includes('--strict');

/**
 * Budgets in KB gzip. The audit's target for reading pages was 150 KB; about 118 KB of every page is React,
 * the Next runtime and the layout, so the reader pages are held at their 2026-11 size (chapter 211 KB, verse
 * 180 KB) plus a few KB of headroom, and the build fails if they grow back.
 */
const PAGES = [
  { path: '/scripture/bhagavadgita/chapter/2/', budget: 215, label: 'chapter (reading)' },
  { path: '/scripture/bhagavadgita/chapter/2/verse/47/', budget: 185, label: 'verse (reading)' },
  { path: '/', budget: 200, label: 'home' },
  { path: '/wisdom-for-life/anger/', budget: 180, label: 'topic hub' },
];

if (!fs.existsSync(dist)) {
  console.error(`check-js-budget: ${path.relative(root, dist)}/ not found — run the build first.`);
  process.exit(strict ? 1 : 0);
}

const cache = new Map();
function gzipKb(src) {
  if (cache.has(src)) return cache.get(src);
  const rel = src.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '').split('?')[0];
  const file = path.join(dist, decodeURIComponent(rel));
  const kb = fs.existsSync(file) ? zlib.gzipSync(fs.readFileSync(file)).length / 1024 : NaN;
  cache.set(src, kb);
  return kb;
}

let over = 0;
let measured = 0;
for (const page of PAGES) {
  const html = path.join(dist, page.path, 'index.html');
  if (!fs.existsSync(html)) {
    console.log(`  ?  ${page.label.padEnd(18)} ${page.path} not exported`);
    continue;
  }
  measured++;
  const tags = [...fs.readFileSync(html, 'utf8').matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  const srcs = [...new Set(tags.filter((a) => !/\bnomodule\b/i.test(a)).map((a) => a.match(/\bsrc="([^"]+)"/)?.[1]).filter(Boolean))];
  const missing = srcs.filter((s) => Number.isNaN(gzipKb(s)));
  const total = srcs.reduce((sum, s) => sum + (gzipKb(s) || 0), 0);
  const ok = total <= page.budget;
  if (!ok) over++;
  console.log(
    `  ${ok ? '✓' : '✗'}  ${page.label.padEnd(18)} ${total.toFixed(0).padStart(4)} KB / ${page.budget} KB  (${srcs.length} scripts${missing.length ? `, ${missing.length} not found` : ''})`,
  );
}
console.log(
  measured === 0
    ? 'check-js-budget: no exported pages to measure'
    : over
      ? `check-js-budget: ${over} of ${measured} page(s) over budget`
      : `check-js-budget: all ${measured} pages within budget`,
);
process.exit(strict && over ? 1 : 0);
