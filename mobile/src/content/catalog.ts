import catalogJson from './generated/catalog.json';
import { BOOK_LOADERS } from './generated/loaders';
import type { Book, BookChapter, CatalogEntry } from './types';

export const SITE = 'https://dharmagranth.dev';

export const CATALOG = catalogJson as CatalogEntry[];

const byId = new Map(CATALOG.map((b) => [b.id, b]));

export function getEntry(id: string): CatalogEntry | undefined {
  return byId.get(id);
}

const bookCache = new Map<string, Book>();

/** Parses a bundled book the first time it is opened. Returns undefined for books that live only on the website. */
export function loadBook(id: string): Book | undefined {
  const cached = bookCache.get(id);
  if (cached) return cached;
  const loader = BOOK_LOADERS[id];
  if (!loader) return undefined;
  const book = loader();
  bookCache.set(id, book);
  return book;
}

export function loadChapter(id: string, chapter: number): BookChapter | undefined {
  return loadBook(id)?.chapters.find((c) => c.number === chapter);
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

/** The verse of the day: the same Gita verse for everyone on a given date. */
export function dailyVerse(date = new Date()): { id: string; chapter: number; index: number } | undefined {
  const book = loadBook('bhagavadgita');
  if (!book) return undefined;
  const all: { chapter: number; index: number }[] = [];
  for (const ch of book.chapters) ch.verses.forEach((_, index) => all.push({ chapter: ch.number, index }));
  if (all.length === 0) return undefined;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  const pick = all[day % all.length];
  return { id: 'bhagavadgita', ...pick };
}
