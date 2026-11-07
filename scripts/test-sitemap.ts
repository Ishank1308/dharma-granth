/** Run: npm run test:sitemap */
import assert from 'node:assert/strict';
import { chapterPartHasMeaning } from '../lib/verse-meaning';
import {
  MAX_URLS_PER_SITEMAP,
  SITE_URL,
  SITEMAP_SECTIONS,
  escapeXml,
  normalizeEntries,
  sitemapIndexXml,
  sitemapSection,
  sitemapXml,
} from '../lib/sitemap-sections';

// XML escaping covers all five predefined entities, ampersand first.
assert.equal(escapeXml(`a&b<c>"d"'e'`), 'a&amp;b&lt;c&gt;&quot;d&quot;&apos;e&apos;');

// Duplicates collapse (also across slash variants) and slashes are normalised.
const dup = normalizeEntries([{ url: 'https://x.test/a' }, { url: 'https://x.test/a/' }, { url: 'https://x.test/b/' }]);
assert.deepEqual(
  dup.map((e) => e.url),
  ['https://x.test/a/', 'https://x.test/b/'],
);

// A section that outgrows one sitemap file fails loudly instead of truncating.
assert.throws(
  () => normalizeEntries(Array.from({ length: MAX_URLS_PER_SITEMAP + 1 }, (_, i) => ({ url: `https://x.test/${i}/` }))),
  /split it/,
);

// Serialised XML: UTF-8 declaration, escaped locs, no changefreq/priority, lastmod only when given.
const xml = sitemapXml([
  { url: 'https://x.test/q?a=1&b=2', lastModified: new Date('2026-01-02T03:04:05Z') },
  { url: 'https://x.test/no-date/' },
]);
assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
assert.ok(xml.includes('<loc>https://x.test/q?a=1&amp;b=2/</loc>'));
assert.equal((xml.match(/<lastmod>/g) ?? []).length, 1);
assert.ok(!/changefreq|priority/.test(xml));

// Generated sections: right origin, unique, slash-terminated, no query/hash, no non-public hosts.
const all = new Set<string>();
for (const section of SITEMAP_SECTIONS) {
  const entries = sitemapSection(section);
  assert.ok(entries.length > 0, `${section} is empty`);
  for (const { url } of entries) {
    assert.ok(url.startsWith(`${SITE_URL}/`), `${url} is not on ${SITE_URL}`);
    assert.ok(url.endsWith('/'), `${url} has no trailing slash`);
    assert.ok(!/[?#]/.test(url), `${url} has a query or fragment`);
    assert.ok(!/localhost|127\.0\.0\.1/.test(url), `${url} is a local URL`);
    assert.ok(!all.has(url), `${url} appears twice across sections`);
    all.add(url);
  }
}
const pages = sitemapSection('pages').map((e) => e.url);
assert.ok(pages.includes(`${SITE_URL}/`), 'homepage missing');
assert.ok(pages.includes(`${SITE_URL}/sources/`), '/sources/ missing');
assert.ok(pages.includes(`${SITE_URL}/methodology/`), '/methodology/ missing');
assert.ok(sitemapSection('scriptures').some((e) => e.url === `${SITE_URL}/scripture/bhagavadgita/`));
assert.ok(sitemapSection('chapters').some((e) => e.url === `${SITE_URL}/scripture/bhagavadgita/chapter/2/`));
assert.ok(sitemapSection('verses').some((e) => e.url === `${SITE_URL}/scripture/bhagavadgita/chapter/2/verse/47/`));
assert.equal(chapterPartHasMeaning('rigveda', 1, 1), true);
assert.equal(chapterPartHasMeaning('rigveda', 1, 2), false);
assert.equal(chapterPartHasMeaning('rigveda', 1, 6), true);
const chapterUrls = sitemapSection('chapters').map((e) => e.url);
assert.ok(chapterUrls.includes(`${SITE_URL}/scripture/rigveda/chapter/1/`));
assert.ok(!chapterUrls.includes(`${SITE_URL}/scripture/rigveda/chapter/1/part/2/`));
assert.ok(chapterUrls.includes(`${SITE_URL}/scripture/rigveda/chapter/1/part/6/`));

assert.ok(sitemapSection('verses').some((e) => e.url === `${SITE_URL}/ashtavakra/2/14/`), 'Ashtavakra verse pages missing');

assert.ok(pages.some((u) => u.startsWith(`${SITE_URL}/ashtavakra/words/%`)), 'Ashtavakra word-letter pages missing or not percent-encoded');

// Non-public routes never appear.
for (const url of all) {
  assert.ok(!/\/(dashboard|bookmarks|desk|pack|editorial|search-index)\//.test(url), `${url} is not public`);
}

// Index lists every section once.
const index = sitemapIndexXml();
for (const s of SITEMAP_SECTIONS) assert.equal(index.split(`/sitemap-${s}.xml</loc>`).length - 1, 1, `${s} listed once`);

console.log(`✓ sitemap tests passed (${all.size} URLs)`);
