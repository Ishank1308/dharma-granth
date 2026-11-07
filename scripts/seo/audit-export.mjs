/**
 * Read-only technical SEO audit of the static export (dist/). Run after `npm run build`.
 *
 *   node scripts/seo/audit-export.mjs            # prints a summary, writes docs/seo/audit-export.md
 *
 * Checks every sitemap URL against the exported HTML and every exported page against the sitemaps:
 * existence, canonical tag, robots meta, title and description (presence, length, duplicates), H1, html lang,
 * JSON-LD, and visible text length (a thin-page signal, not a verdict). Nothing is changed.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..');
const DIST = path.join(ROOT, 'dist');
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';

const read = (p) => fs.readFileSync(p, 'utf8');
const locs = (file) => [...read(path.join(DIST, file)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

// ── sitemaps ────────────────────────────────────────────────────────────────
const index = locs('sitemap.xml');
const sitemapUrls = new Map(); // url -> sitemap file
for (const sm of index) {
  const file = sm.replace(ORIGIN + '/', '');
  if (!fs.existsSync(path.join(DIST, file))) continue;
  for (const u of locs(file)) sitemapUrls.set(u, file);
}

// ── exported pages ──────────────────────────────────────────────────────────
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '_next' || e.name === 'data' || e.name === 'og' || e.name === 'search' || e.name === 'fonts') continue;
      walk(p);
    } else if (e.name === 'index.html' || (e.name.endsWith('.html') && e.name !== '404.html')) pages.push(p);
  }
})(DIST);

const urlFor = (file) => {
  let rel = path.relative(DIST, file).split(path.sep).join('/');
  rel = rel === 'index.html' ? '' : rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  return `${ORIGIN}/${rel}`;
};
const fileFor = (url) => {
  const rel = decodeURIComponent(url.replace(ORIGIN, '').replace(/^\//, ''));
  const a = path.join(DIST, rel, 'index.html');
  const b = path.join(DIST, rel.replace(/\/$/, '') + '.html');
  return fs.existsSync(a) ? a : fs.existsSync(b) ? b : null;
};

const meta = (html, name) => (html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, 'i')) || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+name="${name}"`, 'i')) || [])[1] ?? null;
const textLen = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(header|nav|footer)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;

const rows = [];
for (const file of pages) {
  const html = read(file);
  const url = urlFor(file);
  const canonical = (html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) || [])[1] ?? null;
  const robots = meta(html, 'robots');
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] ?? '';
  const desc = meta(html, 'description') ?? '';
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const lang = (html.match(/<html[^>]+lang="([^"]+)"/i) || [])[1] ?? null;
  const jsonld = (html.match(/application\/ld\+json/gi) || []).length;
  const hreflang = (html.match(/hreflang=/gi) || []).length;
  rows.push({ url, file, canonical, robots, title, desc, h1, lang, jsonld, hreflang, text: textLen(html), inSitemap: sitemapUrls.has(url) || sitemapUrls.has(encodeURI(url)) });
}
const byUrl = new Map(rows.map((r) => [r.url, r]));

// ── findings ────────────────────────────────────────────────────────────────
const f = {};
const add = (k, v) => (f[k] ??= []).push(v);
for (const [u, sm] of sitemapUrls) {
  // Sitemaps percent-encode Devanagari paths; pages are keyed by the decoded path.
  const decoded = `${ORIGIN}${decodeURI(u.replace(ORIGIN, ''))}`;
  const r = byUrl.get(u) ?? byUrl.get(decoded) ?? (fileFor(u) ? byUrl.get(urlFor(fileFor(u))) : null);
  if (!r) add('sitemap URL with no exported page', `${u} (${sm})`);
  else if (r.robots && /noindex/i.test(r.robots)) add('sitemap URL marked noindex', u);
  else if (r.canonical && r.canonical !== u) add('sitemap URL whose canonical points elsewhere', `${u} -> ${r.canonical}`);
  if (!u.endsWith('/')) add('sitemap URL without trailing slash', u);
}
const titles = new Map();
const descs = new Map();
for (const r of rows) {
  const indexable = !(r.robots && /noindex/i.test(r.robots));
  if (indexable && !r.inSitemap && (!r.canonical || r.canonical === r.url)) add('indexable page missing from sitemaps', r.url);
  if (!r.canonical && indexable) add('indexable page without canonical', r.url);
  if (r.canonical && !r.canonical.endsWith('/') && !/\.\w+$/.test(r.canonical)) add('canonical without trailing slash', `${r.url} -> ${r.canonical}`);
  if (!r.title) add('page without <title>', r.url);
  if (indexable && !r.desc) add('indexable page without meta description', r.url);
  if (r.title.length > 70) add('title longer than 70 characters', `${r.url} (${r.title.length})`);
  if (indexable && r.desc && (r.desc.length < 70 || r.desc.length > 170)) add('description length outside 70-170', `${r.url} (${r.desc.length})`);
  if (indexable && r.h1 !== 1) add('indexable page without exactly one H1', `${r.url} (${r.h1})`);
  if (!r.lang) add('page without html lang', r.url);
  if (indexable && r.text < 400) add('indexable page with under 400 characters of body text', `${r.url} (${r.text})`);
  if (indexable) {
    (titles.get(r.title) ?? titles.set(r.title, []).get(r.title)).push(r.url);
    if (r.desc) (descs.get(r.desc) ?? descs.set(r.desc, []).get(r.desc)).push(r.url);
  }
}
for (const [t, us] of titles) if (us.length > 1) add('duplicate title (indexable pages)', `${us.length}× "${t.slice(0, 80)}" e.g. ${us[0]}`);
for (const [d, us] of descs) if (us.length > 1) add('duplicate description (indexable pages)', `${us.length}× "${d.slice(0, 60)}…" e.g. ${us[0]}`);

const indexable = rows.filter((r) => !(r.robots && /noindex/i.test(r.robots)));
const summary = {
  exportedPages: rows.length,
  indexablePages: indexable.length,
  noindexPages: rows.length - indexable.length,
  sitemapUrls: sitemapUrls.size,
  pagesWithJsonLd: rows.filter((r) => r.jsonld > 0).length,
  pagesWithHreflang: rows.filter((r) => r.hreflang > 0).length,
  htmlLangValues: [...new Set(rows.map((r) => r.lang))],
};
console.log(JSON.stringify(summary, null, 1));
const order = Object.entries(f).sort((a, b) => b[1].length - a[1].length);
for (const [k, v] of order) console.log(`${String(v.length).padStart(6)}  ${k}${v.length ? `  e.g. ${v[0]}` : ''}`);

fs.mkdirSync(path.join(ROOT, 'docs/seo'), { recursive: true });
const md = ['# Static export SEO audit', '', `Generated by scripts/seo/audit-export.mjs from dist/. Read-only.`, '', '```json', JSON.stringify(summary, null, 2), '```', '', '| Finding | Count | Examples |', '|---|---:|---|'];
for (const [k, v] of order) md.push(`| ${k} | ${v.length} | ${v.slice(0, 3).map((x) => '`' + x.replace(/\|/g, '/') + '`').join('<br>')} |`);
fs.writeFileSync(path.join(ROOT, 'docs/seo/audit-export.md'), md.join('\n') + '\n');
fs.writeFileSync(path.join(ROOT, 'docs/seo/audit-export-findings.json'), JSON.stringify(f, null, 1));
console.log('wrote docs/seo/audit-export.md and docs/seo/audit-export-findings.json');
