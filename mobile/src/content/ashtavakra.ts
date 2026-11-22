import type { AshtavakraChapter, AshtavakraVerse } from './ashtavakra-types';
import { ASHTAVAKRA_LOADERS, ASHTAVAKRA_META } from './generated/ashtavakra-loaders';

export const ASHTAVAKRA_CHAPTERS = ASHTAVAKRA_META;
export const ASHTAVAKRA_VERSES = ASHTAVAKRA_META.reduce((n, c) => n + c.verseCount, 0);
export const ASHTAVAKRA_WEB = 'https://dharmagranth.dev/ashtavakra/';

/** One chapter, parsed only when it is opened. */
export function loadAshtavakraChapter(n: number): AshtavakraChapter | undefined {
  return ASHTAVAKRA_LOADERS[n]?.();
}

export function findAshtavakraVerse(chapter: number, verse: string): AshtavakraVerse | undefined {
  return loadAshtavakraChapter(chapter)?.verses.find((v) => v.verseNumber === `${chapter}.${verse}` || v.verseNumber === verse);
}

/** "जनक (पुस्तक में: जनक उवाच)" → "जनक": the editorial note stays on the website's source page. */
export function speakerName(speaker: string | undefined): string | undefined {
  return speaker?.replace(/\s*\(.*$/, '').trim() || undefined;
}

/** The verse number within its chapter: "1.11" → "11". */
export function verseInChapter(verseNumber: string): string {
  return verseNumber.includes('.') ? verseNumber.split('.').slice(1).join('.') : verseNumber;
}
