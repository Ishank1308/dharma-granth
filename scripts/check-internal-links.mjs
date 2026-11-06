/**
 * Internal-link check for the static export (audit 2026-10-25, findings 5 and 9).
 *
 * Reads every exported .html file outside _next/, takes each root-relative
 * href="/…", and resolves it the way Cloudflare Pages would: a file, a
 * directory with index.html, name.html, or a rule in _redirects.
 *
 *   node scripts/check-internal-links.mjs   (runs after every build)
 *
 * Fails on a broken link that is not in KNOWN_BROKEN. Links without a
 * trailing slash (dotted verse ids such as /verse/4.3.7, which Next's <Link>
 * leaves alone) are reported but do not fail yet.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.resolve(root, process.env.NEXT_DIST_DIR || 'dist');

/**
 * Broken targets present when this check was added. Remove an entry once
 * its link is fixed; the check then keeps it fixed. Never add new ones.
 */
const KNOWN_BROKEN = new Set([
  // /pathways/* link knowledge hubs that do not exist yet (data/wisdom-pathway-starters.ts).
  '/knowledge/faith/',
  '/knowledge/meditation/',
  '/knowledge/compassion/',
  '/knowledge/service/',
  '/knowledge/concentration/',
  '/knowledge/leadership/',
  '/knowledge/duty/',
  '/knowledge/equanimity/',
  '/knowledge/inner-peace/',
  '/knowledge/truth/',
  // /daily/ cites Chandogya 6.8 / 6.9 by khanda; the verse pages use chapter 105, verse 6.8.N.
  '/scripture/chandogya/chapter/6/verse/8/',
  '/scripture/chandogya/chapter/6/verse/9/',
]);

/** Served by Pages Functions (functions/), not by files in the export. */
const FUNCTION_PREFIXES = ['/api/'];

if (!fs.existsSync(dist)) {
  console.error(`check-internal-links: ${path.relative(root, dist)}/ not found — run the build first.`);
  process.exit(1);
}

const escapeRe = (s) => s.replace(/[.+?^${}()|[\]\\]/g, (c) => `\\${c}`);
const redirectsFile = path.join(dist, '_redirects');
const redirectRules = fs.existsSync(redirectsFile)
  ? fs
      .readFileSync(redirectsFile, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.startsWith('#'))
      .map((line) => line.trim().split(/\s+/)[0])
      .map((from) => new RegExp(`^${escapeRe(from).replace(/:\w+/g, '[^/]+').replace(/\\\*/g, '.*')}$`))
  : [];

const resolved = new Map();
function resolves(href) {
  if (resolved.has(href)) return resolved.get(href);
  let p = href;
  try {
    p = decodeURIComponent(href);
  } catch {}
  const file = path.join(dist, p);
  const ok =
    (fs.existsSync(file) && fs.statSync(file).isFile()) ||
    fs.existsSync(path.join(file, 'index.html')) ||
    fs.existsSync(`${file.replace(/[\\/]+$/, '')}.html`) ||
    redirectRules.some((re) => re.test(p));
  resolved.set(href, ok);
  return ok;
}

const broken = new Map(); // href -> { count, from }
const slashless = new Map(); // href -> count
let pages = 0;

(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '_next') walk(full);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    pages++;
    const html = fs.readFileSync(full, 'utf8');
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = m[1];
      if (href.startsWith('//') || FUNCTION_PREFIXES.some((p) => href.startsWith(p))) continue;
      if (!resolves(href)) {
        const seen = broken.get(href);
        if (seen) seen.count++;
        else broken.set(href, { count: 1, from: `/${path.relative(dist, full).replace(/\\/g, '/')}` });
      } else if (!href.endsWith('/') && !/\.[a-z][a-z0-9]{1,4}$/i.test(href)) {
        slashless.set(href, (slashless.get(href) || 0) + 1);
      }
    }
  }
})(dist);

const fresh = [...broken].filter(([href]) => !KNOWN_BROKEN.has(href));
const known = [...broken].filter(([href]) => KNOWN_BROKEN.has(href));
const fixed = [...KNOWN_BROKEN].filter((href) => !broken.has(href));

console.log(`check-internal-links: ${pages} pages, ${resolved.size} distinct internal targets`);
if (slashless.size > 0) {
  const total = [...slashless.values()].reduce((a, b) => a + b, 0);
  console.warn(`  ! ${total} link(s) to ${slashless.size} page(s) without a trailing slash (each costs a 308), e.g.:`);
  for (const [href] of [...slashless].slice(0, 5)) console.warn(`      ${href}`);
}
if (known.length > 0) console.warn(`  ! ${known.length} known broken target(s) still linked (KNOWN_BROKEN)`);
if (fixed.length > 0) console.log(`  ✓ fixed, remove from KNOWN_BROKEN: ${fixed.join(', ')}`);
if (fresh.length > 0) {
  console.error(`  ✗ ${fresh.length} new broken target(s):`);
  for (const [href, { count, from }] of fresh.slice(0, 40)) console.error(`      ${href}  (${count}×, first on ${from})`);
  process.exit(1);
}
console.log('check-internal-links: no new broken links');
