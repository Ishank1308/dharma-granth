// Guards the project rules in CLAUDE.md that the other post-build checks do not
// (npm run check:rules; wired into postbuild after check:export). Several tools
// edit this checkout at once, so each rule fails the build instead of relying
// on someone remembering it:
//   1. every error-boundary fallback carries <meta name="robots" content="noindex, nofollow">;
//   2. public/_headers keeps HTML revalidated at the edge, and asset rules reset
//      Cache-Control with `! Cache-Control` so they never merge with the HTML rule;
//   3. the shared header links all six primary routes, and its English and Hindi
//      labels are separate elements, so crawlers never read "Homeमुख";
//   6. canonicals, internal links and _redirects targets keep their trailing slash;
//      every indexable page names itself as canonical, and Next's RSC payloads
//      (index.txt) are noindex, so Search Console never reports
//      "Duplicate without user-selected canonical".
// Rule 4 (whole verses) is covered by check:export (verse counts per chapter) and
// check-wisdom.ts (cited ranges quoted in full).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = resolve(ROOT, process.env.NEXT_DIST_DIR || 'dist');
const ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');

const errors = [];
const fail = (scope, msg) => errors.push(`[${scope}] ${msg}`);

if (!existsSync(DIST)) {
  console.error('✗ dist/ not found — run `npm run build` first.');
  process.exit(1);
}

const NOINDEX = /<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/?>/;

// ── 1. Error boundaries are noindex ──
// The fallbacks only render in the browser, so this reads their source: every
// file that renders the fallback heading must also render the noindex meta.
{
  const FALLBACK = 'पृष्ठ लोड नहीं हो सका';
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.tsx$/.test(name)) files.push(path);
    }
  };
  walk(join(ROOT, 'app'));
  for (const required of ['app/error.tsx', 'app/global-error.tsx']) {
    if (!files.includes(join(ROOT, required))) fail('noindex', `${required} is missing`);
  }
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const rel = file.slice(ROOT.length + 1);
    const isBoundary = src.includes(FALLBACK) || /app[\\/](global-)?error\.tsx$/.test(file);
    if (!isBoundary) continue;
    if (!NOINDEX.test(src)) fail('noindex', `${rel} renders an error fallback without <meta name="robots" content="noindex, nofollow" />`);
  }
  // A fallback that did get exported as static HTML must also be noindex.
  for (const page of htmlPages()) {
    const html = readFileSync(page, 'utf8');
    if (html.includes(FALLBACK) && !NOINDEX.test(html)) fail('noindex', `${routeOf(page)} exports the error fallback without noindex`);
  }
}

// ── 2. Cloudflare cache headers ──
for (const file of ['public/_headers', join(DIST.slice(ROOT.length + 1), '_headers')]) {
  const path = join(ROOT, file);
  if (!existsSync(path)) {
    fail('headers', `${file} is missing`);
    continue;
  }
  const rules = new Map();
  let current = null;
  for (const raw of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      current = raw.trim();
      rules.set(current, []);
    } else if (current) rules.get(current).push(raw.trim());
  }
  const cache = (pattern) => (rules.get(pattern) ?? []).filter((l) => /^Cache-Control:/i.test(l)).map((l) => l.replace(/^Cache-Control:\s*/i, ''));
  const expect = (pattern, value) => {
    const values = cache(pattern);
    if (values.length !== 1 || values[0] !== value) fail('headers', `${file}: ${pattern} must set "Cache-Control: ${value}" (has ${values.join(' | ') || 'none'})`);
  };
  expect('/*', 'public, max-age=0, must-revalidate');
  expect('/_next/static/*', 'public, max-age=31536000, immutable');
  expect('/fonts/*', 'public, max-age=31536000, immutable');
  expect('/search/*', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
  for (const [pattern, lines] of rules) {
    if (pattern === '/*' || cache(pattern).length === 0) continue;
    if (lines[0] !== '! Cache-Control') fail('headers', `${file}: ${pattern} sets Cache-Control without first resetting it ("! Cache-Control"), so it merges with the HTML rule`);
  }
  for (const pattern of ['/index.txt', '/*/index.txt']) {
    if (!(rules.get(pattern) ?? []).some((l) => /^X-Robots-Tag:\s*noindex/i.test(l))) {
      fail('headers', `${file}: ${pattern} must set "X-Robots-Tag: noindex" (RSC payloads repeat page text without a canonical)`);
    }
  }
}

// ── 3. One shared header: primary routes, bilingual labels kept apart ──
const PRIMARY = [['/'], ['/scriptures/'], ['/scripture/bhagavadgita/', '/bhagavad-gita/'], ['/practice/'], ['/panchang/']];
// Tags a crawler's text extraction treats as a break; inline tags (span, a, strong…) run together.
const BLOCK = new Set(['address', 'article', 'aside', 'br', 'button', 'dd', 'div', 'dl', 'dt', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'section', 'ul']);

/** The outer HTML of the first <nav data-site-header>, or null. */
function headerHtml(html) {
  const start = html.search(/<nav\b[^>]*data-site-header="true"/);
  if (start < 0) return null;
  const tag = /<(\/?)nav\b[^>]*>/g;
  tag.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = tag.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, tag.lastIndex);
  }
  return null;
}

/** Text as a crawler reads it: tags dropped, block boundaries become spaces. */
function crawlText(fragment) {
  return fragment
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/?([a-zA-Z][\w-]*)\b[^>]*>/g, (_, name) => (BLOCK.has(name.toLowerCase()) ? ' ' : ''))
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, 'x');
}

{
  const seen = new Set();
  // The header differs per page only by its active link, so the same problem repeats: report it once.
  const problems = new Map();
  const report = (msg, route) => problems.set(msg, [...(problems.get(msg) ?? []), route]);
  for (const page of htmlPages()) {
    const html = readFileSync(page, 'utf8');
    const nav = headerHtml(html);
    if (!nav) continue; // check:export already fails pages without the shared header
    if (seen.has(nav)) continue;
    seen.add(nav);
    const route = routeOf(page);
    const hrefs = new Set([...nav.matchAll(/<a\b[^>]*\shref="([^"#?]*)/g)].map((m) => m[1]));
    for (const options of PRIMARY) {
      if (!options.some((href) => hrefs.has(href))) report(`shared header has no link to ${options[0]}`, route);
    }
    const text = crawlText(nav);
    const at = text.search(/[A-Za-z][\u0900-\u097F]|[\u0900-\u097F][A-Za-z]/);
    if (at >= 0) {
      report(`English and Hindi labels run together for crawlers: "${text.slice(Math.max(0, at - 20), at + 20).trim()}"`, route);
    }
  }
  if (seen.size === 0) fail('header', 'no exported page has the shared header');
  for (const [msg, routes] of problems) fail('header', `${msg} (${routes.length} header variant(s), first on ${routes[0]})`);
}

// ── 6. Trailing slashes ──
// Files (an extension, or an extensionless file such as /.well-known/api-catalog) and
// Pages Functions (functions/) are served as-is and take no slash.
const isFile = (path) =>
  /\.[a-z0-9]+$/i.test(path.split('/').pop() ?? '') ||
  (existsSync(join(DIST, path)) && statSync(join(DIST, path)).isFile()) ||
  ['.ts', '.js'].some((ext) => existsSync(join(ROOT, 'functions', `${path}${ext}`)));
const needsSlash = (path) => !path.endsWith('/') && !isFile(path);
{
  const badCanonical = [];
  const missingCanonical = [];
  const badLinks = new Map();
  for (const page of htmlPages()) {
    const html = readFileSync(page, 'utf8');
    const route = routeOf(page);
    const canonical = /<link\s+rel="canonical"\s+href="([^"]+)"/.exec(html)?.[1];
    if (canonical) {
      const ok = canonical.startsWith(`${ORIGIN}/`) && !needsSlash(new URL(canonical).pathname) && !/[?#]/.test(canonical);
      if (!ok) badCanonical.push(`${route} → ${canonical}`);
      else if (!/<meta\s+name="robots"\s+content="noindex/.test(html) && new URL(canonical).pathname !== encodeURI(decodeURI(route))) {
        badCanonical.push(`${route} → ${canonical} (an indexable page must name itself)`);
      }
    } else if (!/<meta\s+name="robots"\s+content="noindex/.test(html)) missingCanonical.push(route);
    for (const m of html.matchAll(/<a\b[^>]*\shref="(\/[^"]*)"/g)) {
      const path = m[1].split(/[?#]/)[0];
      if (path.startsWith('//') || !needsSlash(path)) continue;
      if (!badLinks.has(path)) badLinks.set(path, route);
    }
  }
  if (missingCanonical.length) fail('canonical', `${missingCanonical.length} indexable page(s) have no <link rel="canonical">, e.g. ${missingCanonical.slice(0, 5).join(', ')}`);
  if (badCanonical.length) fail('slash', `${badCanonical.length} canonical(s) off-origin or without a trailing slash, e.g. ${badCanonical.slice(0, 3).join('; ')}`);
  if (badLinks.size) {
    fail('slash', `${badLinks.size} internal link target(s) lack a trailing slash (Cloudflare answers each with a 308):`);
    for (const [href, route] of [...badLinks].slice(0, 10)) fail('slash', `  ${href} (first on ${route})`);
  }
  const redirects = readFileSync(join(ROOT, 'public/_redirects'), 'utf8');
  for (const line of redirects.split(/\r?\n/)) {
    const [from, to] = line.trim().split(/\s+/);
    if (!from || from.startsWith('#') || !to?.startsWith('/')) continue;
    const path = to.split(/[?#]/)[0];
    if (needsSlash(path) && !/:splat|\*$/.test(path)) fail('slash', `_redirects: ${from} → ${to} targets a path without a trailing slash`);
  }
}

function htmlPages() {
  if (htmlPages.cache) return htmlPages.cache;
  const pages = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) {
        if (!['_next', 'og', 'pinterest', 'data'].includes(name)) walk(path);
      } else if (name === 'index.html') pages.push(path);
    }
  };
  walk(DIST);
  return (htmlPages.cache = pages);
}

function routeOf(page) {
  return page.slice(DIST.length).replace(/\\/g, '/').replace(/\/index\.html$/, '/') || '/';
}

if (errors.length) {
  console.error(`✗ check-site-rules: ${errors.length} problem(s)\n${errors.map((e) => `  ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`✓ check-site-rules: noindex fallbacks, cache headers, shared header, trailing slashes (${htmlPages().length} pages)`);
