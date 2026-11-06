/**
 * JavaScript budget for the exported site (audit 2026-10-22, P1): the gzip size of the scripts a
 * page loads up front, read from the exported HTML itself. `nomodule` scripts (legacy polyfills)
 * are not counted, because modern browsers skip them.
 *
 *   node scripts/check-js-budget.mjs            exit 1 when a page grows past its ceiling (runs after every build)
 *   node scripts/check-js-budget.mjs --strict   also exit 1 when a page is over its budget
 *
 * `ceiling` is a ratchet: measured size on 2026-10-25 plus about 5 KB of slack. When a page
 * gets smaller, lower its ceiling to the new size; never raise it to let a page grow.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const dist = path.resolve(root, process.env.NEXT_DIST_DIR || 'dist');
const strict = process.argv.includes('--strict');

/** Budgets and ceilings in KB gzip. Reading pages carry the audit's 150 KB target. */
const PAGES = [
  { path: '/scripture/bhagavadgita/chapter/2/', budget: 150, ceiling: 365, label: 'chapter (reading)' },
  { path: '/scripture/bhagavadgita/chapter/2/verse/47/', budget: 150, ceiling: 368, label: 'verse (reading)' },
  { path: '/', budget: 200, ceiling: 352, label: 'home' },
  { path: '/wisdom-for-life/anger/', budget: 180, ceiling: 247, label: 'topic hub' },
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
let grew = 0;
let measured = 0;
for (const page of PAGES) {
  const html = path.join(dist, page.path, 'index.html');
  if (!fs.existsSync(html)) {
    console.log(`  ?  ${page.label.padEnd(18)} ${page.path} not exported`);
    continue;
  }
  measured++;
  const tags = [...fs.readFileSync(html, 'utf8').matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]);
  const srcs = [...new Set(tags.filter((a) => !/\bnomodule\b/.test(a)).map((a) => a.match(/\bsrc="([^"]+)"/)?.[1]).filter(Boolean))];
  const missing = srcs.filter((s) => Number.isNaN(gzipKb(s)));
  const total = srcs.reduce((sum, s) => sum + (gzipKb(s) || 0), 0);
  const ok = total <= page.budget;
  const held = total <= page.ceiling;
  if (!ok) over++;
  if (!held) grew++;
  const mark = ok ? '✓' : held ? '·' : '✗';
  const note = held ? '' : `  GREW past ceiling ${page.ceiling} KB`;
  console.log(
    `  ${mark}  ${page.label.padEnd(18)} ${total.toFixed(0).padStart(4)} KB / ${page.budget} KB  (${srcs.length} scripts${missing.length ? `, ${missing.length} not found` : ''})${note}`,
  );
}
console.log(
  measured === 0
    ? 'check-js-budget: no exported pages to measure'
    : grew
      ? `check-js-budget: ${grew} page(s) grew past their ceiling — cut the new JS or explain why in review`
      : over
        ? `check-js-budget: ${over} of ${measured} page(s) over budget, none above its ceiling`
        : `check-js-budget: all ${measured} pages within budget`,
);
process.exit(grew || (strict && over) ? 1 : 0);
