import catalogJson from './generated/catalog.json';
import { readDownloadedChapter } from './downloads';
import { CHAPTER_LOADERS } from './generated/loaders';
import type { BookChapter, CatalogEntry } from './types';

export const SITE = 'https://dharmagranth.dev';

export const CATALOG = catalogJson as CatalogEntry[];

const byId = new Map(CATALOG.map((b) => [b.id, b]));

export function getEntry(id: string): CatalogEntry | undefined {
  return byId.get(id);
}

/**
 * Loads one bundled chapter. Each chapter is its own module, so opening a chapter parses only that
 * chapter, not the whole book (Ramcharitmanas alone is 5 MB). Metro keeps a required module for the
 * rest of the session, so memory grows only with the chapters the reader has actually opened.
 * Books too large to bundle are read from the phone once the reader has downloaded them
 * (src/content/downloads.ts); otherwise this returns undefined.
 */
export function loadChapter(id: string, chapter: number): BookChapter | undefined {
  const loader = CHAPTER_LOADERS[id]?.[chapter];
  return loader ? loader() : readDownloadedChapter(id, chapter);
}

export function webUrl(id: string, chapter?: number): string {
  return chapter == null ? `${SITE}/scripture/${id}/` : `${SITE}/scripture/${id}/chapter/${chapter}/`;
}

/** Library sections, in reading order. Labels are kept as separate English and Hindi strings. */
export const CATEGORIES: { key: string; en: string; hi: string }[] = [
  { key: 'veda', en: 'Vedas', hi: 'वेद' },
  { key: 'upanishad', en: 'Upanishads', hi: 'उपनिषद्' },
  { key: 'itihasa', en: 'Itihasa', hi: 'इतिहास' },
  { key: 'purana', en: 'Puranas', hi: 'पुराण' },
  { key: 'smriti', en: 'Smriti', hi: 'स्मृति' },
  { key: 'stotra', en: 'Stotra', hi: 'स्तोत्र' },
  { key: 'tantra', en: 'Tantra & Yoga', hi: 'तन्त्र एवं योग' },
  { key: 'other', en: 'Darshana & more', hi: 'दर्शन एवं अन्य' },
];

/**
 * The verse of the day: the same Gita verse for everyone on a given date. Picked from the catalog's
 * verse counts, so only the one chapter that holds the verse is loaded at startup.
 */
export function dailyVerse(date = new Date()): { id: string; chapter: number; index: number } | undefined {
  const entry = getEntry('bhagavadgita');
  if (!entry?.bundled) return undefined;
  const total = entry.chapters.reduce((n, c) => n + c.verseCount, 0);
  if (total === 0) return undefined;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  let i = day % total;
  for (const ch of entry.chapters) {
    if (i < ch.verseCount) return { id: entry.id, chapter: ch.number, index: i };
    i -= ch.verseCount;
  }
  return undefined;
}
