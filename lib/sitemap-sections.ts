import type { MetadataRoute } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { lastChanged, scriptureLastChanged } from '@/lib/content-dates';
import { verseStaticParams } from '@/lib/verse-pages';
import { chapterPartHref, chapterParts } from '@/lib/chapter-parts';
import { topics } from '@/data/topics';
import { wisdomTopics } from '@/data/wisdom-for-life';
import { characters } from '@/data/characters';
import { dictionary } from '@/data/dictionary';
import { getAllConceptDetails } from '@/data/concept-details';
import { learningPaths } from '@/data/learning-paths';
import { READING_JOURNEYS } from '@/data/reading-journeys';
import { festivals } from '@/data/festivals';
import { buildWordIndex } from '@/lib/ashtavakra-words';
import { getChapterData, publishedChapterNumbers, verseHref } from '@/lib/ashtavakra';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in').replace(/\/+$/, '');

type Entry = MetadataRoute.Sitemap[number];

/**
 * lastModified comes from git history (see lib/content-dates): each URL's date
 * is when its content last changed, and it is omitted when unknown. A single
 * build timestamp on every URL is ignored by Google. No changefreq or priority
 * is emitted: there is no measured value behind either, and Google ignores both.
 */
function entry(path: string, lastModified: Date | undefined): Entry {
  return {
    url: `${SITE_URL}${path}`,
    ...(lastModified ? { lastModified } : {}),
  };
}

/** A top-level page: its own page file, plus the data file it renders. */
function pageDate(route: string, ...dataFiles: string[]): Date | undefined {
  const page = route === '/' ? 'app/page.tsx' : `app${route}/page.tsx`;
  return lastChanged(page, ...dataFiles);
}

/**
 * The sitemap is published as an index (/sitemap.xml) pointing at one file per
 * section. The total is far below Google's 50,000-URL limit; the split is for
 * Search Console, which reports indexing per sitemap file, so verse pages can
 * be monitored apart from chapters and the editorial pages.
 */
export type SitemapSection = 'pages' | 'scriptures' | 'chapters' | 'verses';

export const SITEMAP_SECTIONS: SitemapSection[] = ['pages', 'scriptures', 'chapters', 'verses'];

/** Top-level routes plus wisdom, topic, character and dictionary entries. */
function pagesSection(): MetadataRoute.Sitemap {
  // 1. Static Top-Level Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    entry('/', pageDate('/')),
    entry('/scriptures', pageDate('/scriptures', 'data/scripture-meta.ts')),
    entry('/learn', pageDate('/learn')),
    entry('/learn/pathways', pageDate('/learn/pathways', 'data/pathways.ts')),
    entry('/learn/faq', pageDate('/learn/faq', 'data/scripture-faqs.ts')),
    entry('/learn/paths', pageDate('/learn/paths', 'data/guided-reading-paths.ts')),
    entry('/learn/plans', pageDate('/learn/plans', 'data/reading-plans.ts')),
    entry('/wisdom-for-life', pageDate('/wisdom-for-life', 'data/wisdom-for-life.ts')),
    entry('/guidance', pageDate('/guidance', 'data/wisdom-for-life.ts')),
    entry('/concepts', pageDate('/concepts')),
    entry('/topics', pageDate('/topics', 'data/topics.ts')),
    entry('/characters', pageDate('/characters', 'data/characters.ts')),
    entry('/locations', pageDate('/locations')),
    entry('/festivals', pageDate('/festivals')),
    entry('/panchang', pageDate('/panchang')),
    entry('/timelines', pageDate('/timelines')),
    entry('/rituals', pageDate('/rituals')),
    entry('/dictionary', pageDate('/dictionary', 'data/dictionary.ts')),
    entry('/practice', pageDate('/practice')),
    entry('/start', pageDate('/start')),
    entry('/journeys', pageDate('/journeys', 'data/reading-journeys.ts')),
    entry('/story', pageDate('/story')),
    entry('/collections', pageDate('/collections')),
    entry('/compare', pageDate('/compare', 'data/scripture-comparisons.ts')),
    entry('/learn/academy', pageDate('/learn/academy', 'data/academy-index.ts')),
    entry('/ask', pageDate('/ask', 'data/wisdom-for-life.ts')),
    entry('/start-here', pageDate('/start-here')),
    entry('/daily', pageDate('/daily')),
    entry('/daily-verse', pageDate('/daily-verse', 'data/wisdom-for-life.ts')),
    entry('/methodology', pageDate('/methodology')),
    entry('/sources', pageDate('/sources')),
    entry('/concepts/relationships', pageDate('/concepts/relationships')),
    entry('/ashtavakra', pageDate('/ashtavakra')),
    entry('/ashtavakra/words', pageDate('/ashtavakra/words')),
  ];

  // 2. Individual Entity Pages
  const wisdomDate = lastChanged('data/wisdom-for-life.ts', 'app/wisdom-for-life/[slug]/page.tsx');
  const wisdomRoutes = wisdomTopics.map((w) => entry(`/wisdom-for-life/${w.slug}`, wisdomDate));
  // /guidance/<slug> serves the same page with a canonical to /wisdom-for-life/<slug>, so only the canonical URL is listed.

  const topicDate = lastChanged('data/topics.ts', 'app/topics/[id]/page.tsx');
  const topicRoutes = topics.map((t) => entry(`/topics/${t.id}`, topicDate));

  const characterDate = lastChanged('data/characters.ts', 'app/characters/[id]/page.tsx');
  const characterRoutes = characters.map((c) => entry(`/characters/${c.id}`, characterDate));

  const dictionaryDate = lastChanged('data/dictionary.ts', 'app/dictionary/[id]/page.tsx');
  const dictionaryRoutes = dictionary.map((d) => entry(`/dictionary/${d.id}`, dictionaryDate));

  const conceptDate = lastChanged('data/concept-details.ts', 'app/concepts/[id]/page.tsx');
  const conceptRoutes = getAllConceptDetails().map((c) => entry(`/concepts/${c.id}`, conceptDate));

  const courseDate = lastChanged('data/learning-paths.ts', 'app/learn/[courseId]/page.tsx');
  const courseRoutes = learningPaths.map((p) => entry(`/learn/${p.id}`, courseDate));

  const journeyDate = lastChanged('data/reading-journeys.ts', 'app/journeys/[id]/page.tsx');
  const journeyRoutes = READING_JOURNEYS.map((j) => entry(`/journeys/${j.id}`, journeyDate));

  const ashtavakraDate = lastChanged('app/ashtavakra/[chapter]/page.tsx');
  const ashtavakraRoutes = publishedChapterNumbers().map((n) => entry(`/ashtavakra/${n}`, ashtavakraDate));

  const wordDate = lastChanged('app/ashtavakra/words/[letter]/page.tsx', 'lib/ashtavakra-words.ts');
  const wordRoutes = buildWordIndex().groups.map((g) => entry(`/ashtavakra/words/${encodeURIComponent(g.letter)}`, wordDate));

  const festivalDate = lastChanged('data/festivals.ts', 'app/festivals/[id]/page.tsx');
  const festivalRoutes = festivals.map((f) => entry(`/festivals/${f.id}`, festivalDate));

  return [...staticRoutes, ...conceptRoutes, ...courseRoutes, ...journeyRoutes, ...festivalRoutes, ...ashtavakraRoutes, ...wordRoutes, ...wisdomRoutes, ...topicRoutes, ...characterRoutes, ...dictionaryRoutes];
}

/** Scripture landing pages and chapter pages (all seeded + curated chapters), dated by when the scripture's text or commentary last changed. */
function scriptureRoutes(): { scriptures: MetadataRoute.Sitemap; chapters: MetadataRoute.Sitemap } {
  const scriptures: MetadataRoute.Sitemap = [];
  const chapters: MetadataRoute.Sitemap = [];
  for (const meta of getAllScriptures()) {
    const date = scriptureLastChanged(meta.id);
    scriptures.push(entry(`/scripture/${meta.id}`, date));
    if (meta.id === 'bhagavadgita') {
      scriptures.push(entry('/scripture/bhagavadgita/summary', lastChanged('app/scripture/[id]/summary/page.tsx', 'data/gita-chapter-summaries.ts')));
    }

    const chapterSet = new Set<number>(readSeededChapterNumbers(meta.id));
    for (const ch of getScriptureChapters(meta.id)) chapterSet.add(ch.id);
    for (const chId of Array.from(chapterSet).sort((a, b) => a - b)) {
      chapters.push(entry(`/scripture/${meta.id}/chapter/${chId}`, date));
      // Parts 2…N of chapters too large for one page (lib/chapter-parts).
      for (const part of chapterParts(meta.id, chId)?.slice(1) ?? []) {
        chapters.push(entry(chapterPartHref(meta.id, chId, part.part), date));
      }
    }
  }

  return { scriptures, chapters };
}

function versesSection(): MetadataRoute.Sitemap {
  const scriptureVerses = verseStaticParams().map((p) =>
    entry(`/scripture/${p.id}/chapter/${p.chapterId}/verse/${p.verseId}`, scriptureLastChanged(p.id)),
  );
  // Ashtavakra Gita has its own verse pages (/ashtavakra/<chapter>/<verse>/).
  const ashtavakraDate = lastChanged('app/ashtavakra/[chapter]/[verse]/page.tsx');
  const ashtavakraVerses = publishedChapterNumbers().flatMap((c) =>
    getChapterData(c)!.verses.map((v) => entry(verseHref(v.verseNumber), ashtavakraDate)),
  );
  return [...scriptureVerses, ...ashtavakraVerses];
}

/** Google's per-file limit; a section must be split before it gets here. */
export const MAX_URLS_PER_SITEMAP = 50000;

/**
 * Entries with a trailing slash, each URL once (first occurrence wins).
 * Throws instead of silently truncating when a section outgrows one file.
 */
export function normalizeEntries(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const out: MetadataRoute.Sitemap = [];
  for (const e of entries) {
    const url = withTrailingSlash(e.url);
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ ...e, url });
  }
  if (out.length > MAX_URLS_PER_SITEMAP) {
    throw new Error(`Sitemap section has ${out.length} URLs (limit ${MAX_URLS_PER_SITEMAP}); split it into more sections.`);
  }
  return out;
}

export function sitemapSection(section: SitemapSection): MetadataRoute.Sitemap {
  const entries =
    section === 'pages'
      ? pagesSection()
      : section === 'scriptures'
        ? scriptureRoutes().scriptures
        : section === 'chapters'
          ? scriptureRoutes().chapters
          : versesSection();
  return normalizeEntries(entries);
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Serialises a section as a <urlset> sitemap document (loc and, when known, lastmod only). */
export function sitemapXml(entries: MetadataRoute.Sitemap): string {
  const urls = normalizeEntries(entries)
    .map((e) => {
      const lastmod = e.lastModified ? `<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>` : '';
      return `<url><loc>${escapeXml(e.url)}</loc>${lastmod}</url>`;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Serialises the <sitemapindex>; each section's lastmod is its newest entry (omitted when none is known). */
export function sitemapIndexXml(): string {
  const items = SITEMAP_SECTIONS.map((section) => {
    const times = sitemapSection(section)
      .map((e) => (e.lastModified ? new Date(e.lastModified).getTime() : 0))
      .filter((t) => t > 0);
    const lastmod = times.length ? `<lastmod>${new Date(Math.max(...times)).toISOString()}</lastmod>` : '';
    return `<sitemap><loc>${escapeXml(SITE_URL)}/sitemap-${section}.xml</loc>${lastmod}</sitemap>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}

/**
 * next.config sets `trailingSlash: true`, so pages are served at `/path/` and
 * `/path` redirects. List the final URLs so crawlers don't hit a redirect.
 */
function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}
