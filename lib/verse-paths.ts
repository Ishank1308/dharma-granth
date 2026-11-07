/**
 * Scriptures that get a URL per verse (`/scripture/{id}/chapter/{n}/verse/{v}/`).
 *
 * The Gita, the principal Upanishads (including Chandogya and
 * Brihadaranyaka), and the published Ramayana and Ramcharitmanas verses.
 * Puranas and the Mahabharata stay on chapter pages: a URL per verse
 * there does not fit the static export.
 *
 * This module is imported by client components, so it must not touch node:fs.
 */
import { VERSE_PAGE_SUBSET } from '@/lib/verse-page-subset.generated';
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
] as const;

const VERSE_SLUG = /^[0-9A-Za-z]+(?:[.\-][0-9A-Za-z]+)*$/;

export function hasVersePages(scriptureId: string): boolean {
  return (VERSE_PAGE_SCRIPTURE_IDS as readonly string[]).includes(scriptureId);
}

// The Ramcharitmanas is too long for a page per verse: only the verses in lib/verse-page-subset.generated.ts get one.
const SUBSET = new Map(Object.entries(VERSE_PAGE_SUBSET).map(([id, keys]) => [id, new Set(keys)]));

/** Whether this verse has its own page (its scripture has verse pages, and the verse is in its subset if it has one). */
export function hasVersePage(scriptureId: string, chapterId: number, slug: string): boolean {
  if (!hasVersePages(scriptureId)) return false;
  const subset = SUBSET.get(scriptureId);
  return !subset || subset.has(`${chapterId}:${slug}`);
}

/** Path segment for a verse number, or null when it cannot be a static path. */
export function verseSlug(number: number | string | undefined): string | null {
  const slug = String(number ?? '').trim();
  return VERSE_SLUG.test(slug) ? slug : null;
}

export function versePageHref(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  const slug = verseSlug(verseNumber);
  if (!slug || !hasVersePage(scriptureId, chapterId, slug)) return undefined;
  return `/scripture/${scriptureId}/chapter/${chapterId}/verse/${slug}/`;
}

/** Share image for one verse, written by `npm run og:verses`. */
export function verseOgPath(
  scriptureId: string,
  chapterId: number,
  verseNumber: number | string,
): string | undefined {
  const slug = verseSlug(verseNumber);
  if (!slug || !hasVersePage(scriptureId, chapterId, slug)) return undefined;
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
    return versePageHref(scriptureId, chapterId, verseId)
      ?? `/scripture/${scriptureId}/chapter/${chapterId}/#verse-${verseId}`;
  }
  return `/scripture/${scriptureId}/chapter/${chapterId}/`;
}

/**
 * Absolute URL for sharing or embedding a verse. The site is exported with
 * `trailingSlash: true`, so the page lives at `…/verse/47/`; linking the slashed
 * form avoids a redirect and matches the page's canonical URL.
 */
export function shareVerseUrl(origin: string, scriptureId: string, chapterId: number, verseId: number | string): string {
  const path = readHref(scriptureId, chapterId, verseId);
  const [pathname, hash] = path.split('#', 2);
  const canonicalPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `${cleanOrigin}${canonicalPath}${hash ? `#${hash}` : ''}`;
}
