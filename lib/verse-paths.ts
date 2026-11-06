import VERSE_PAGE_SUBSETS from './verse-page-subsets.json';

/**
 * Scriptures that get a URL per verse (`/scripture/{id}/chapter/{n}/verse/{v}/`).
 *
 * The Gita, the principal Upanishads (including Chandogya and
 * Brihadaranyaka), the Ramayana verses that carry a meaning, the
 * Ramcharitmanas, the Narada Bhakti Sutras and the Vivekachudamani.
 * Puranas and the Mahabharata stay on chapter pages: a URL
 * per verse there does not fit the static export.
 *
 * This module is imported by client components, so it must not touch node:fs.
 */
export const VERSE_PAGE_SCRIPTURE_IDS = [
  'bhagavadgita',
  'ishavasya',
  'kena',
  'katha',
  'prashna',
  'mundaka',
  'mandukya',
  'taittiriya',
  'aitareya',
  'shvetashvatara',
  'chandogya',
  'brihadaranyaka',
  'ramayana',
  'ramcharitmanas',
  // Added by demand and completeness (audit 2026-10-22, P2): every verse carries printed
  // Hindi and English or a published व्याख्या, so none is a thin, noindexed page.
  'naradabhaktisutra',
  'vivekchudamani',
] as const;

/**
 * Of the scriptures above, those whose full text is too long for a page per
 * verse (the Ramayana's 22,742 shlokas would pass Cloudflare Pages' 20,000-file
 * limit on their own). Only their verses that carry a meaning get a page; the
 * rest are read in the chapter. The verses are listed in verse-page-subsets.json,
 * written by `npx tsx scripts/verse-page-subsets.ts --write` from the published
 * shards and checked by scripts/check-all.mjs.
 */
export const PARTIAL_VERSE_PAGE_SCRIPTURE_IDS = ['ramayana'] as const;

const SUBSETS = new Map<string, ReadonlySet<string>>(
  Object.entries(VERSE_PAGE_SUBSETS as Record<string, string[]>).map(([id, keys]) => [id, new Set(keys)]),
);

const VERSE_SLUG = /^[0-9A-Za-z]+(?:[.\-][0-9A-Za-z]+)*$/;

export function hasVersePages(scriptureId: string): boolean {
  return (VERSE_PAGE_SCRIPTURE_IDS as readonly string[]).includes(scriptureId);
}

/** Path segment for a verse number, or null when it cannot be a static path. */
export function verseSlug(number: number | string | undefined): string | null {
  const slug = String(number ?? '').trim();
  return VERSE_SLUG.test(slug) ? slug : null;
}

/**
 * Does this verse have its own page? The one test behind every verse-page link,
 * the static params, the share images and the search index.
 */
export function hasVersePage(scriptureId: string, chapterId: number, verseNumber: number | string | undefined): boolean {
  if (!hasVersePages(scriptureId)) return false;
  const slug = verseSlug(verseNumber);
  if (!slug) return false;
  if (!(PARTIAL_VERSE_PAGE_SCRIPTURE_IDS as readonly string[]).includes(scriptureId)) return true;
  return SUBSETS.get(scriptureId)?.has(`${chapterId}:${slug}`) ?? false;
}

export function versePageHref(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  if (!hasVersePage(scriptureId, chapterId, verseNumber)) return undefined;
  return `/scripture/${scriptureId}/chapter/${chapterId}/verse/${verseSlug(verseNumber)}/`;
}

/** Share image for one verse, written by `npm run og:verses`. */
export function verseOgPath(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  const slug = verseSlug(verseNumber);
  if (!slug || !hasVersePage(scriptureId, chapterId, verseNumber)) return undefined;
  return `/og/verse/${scriptureId}/${chapterId}-${slug.replace(/\./g, '-')}.jpg`;
}

/**
 * The chapter reader, scrolled to a verse. For the reader's own marks (notes,
 * highlights, bookmarks), which only show on the chapter's verse cards.
 */
export function chapterVerseHref(scriptureId: string, chapterId: number, verseId?: number | string): string {
  const base = `/scripture/${scriptureId}/chapter/${chapterId}/`;
  return verseId != null && String(verseId) !== '' ? `${base}#verse-${verseId}` : base;
}

/** Verse page when this scripture has one; otherwise the chapter, scrolled to the verse. */
export function readHref(scriptureId: string, chapterId: number, verseId?: number | string): string {
  if (verseId != null && String(verseId) !== '') {
    return versePageHref(scriptureId, chapterId, verseId) ?? chapterVerseHref(scriptureId, chapterId, verseId);
  }
  return chapterVerseHref(scriptureId, chapterId);
}

/**
 * Absolute URL for sharing or embedding a verse. The site is exported with
 * `trailingSlash: true`, so the page lives at `…/verse/47/`; linking the slashed
 * form avoids a redirect and matches the page's canonical URL.
 */
export function shareVerseUrl(origin: string, scriptureId: string, chapterId: number, verseId: number | string): string {
  const path = readHref(scriptureId, chapterId, verseId);
  return `${origin}${path.includes('#') || path.endsWith('/') ? path : `${path}/`}`;
}
