/**
 * Scripture pages side by side (website /compare), and each text's edition (website /sources), from the
 * website's own data (scripts/build-study.mjs). These notes list pages beside each other; they do not
 * decide a school.
 */
import compareJson from './generated/study/compare.json';
import sourcesJson from './generated/study/sources.json';
import { getEntry, loadChapter } from './catalog';
import type { Verse } from './types';
import { formatVerseRef } from '@/lib/verse-format';

export type CompareTarget =
  | { kind: 'verse'; id: string; chapter: number; verse: string }
  | { kind: 'chapter'; id: string; chapter: number }
  | { kind: 'book'; id: string }
  | { kind: 'knowledge'; section: string; id: string }
  | { kind: 'wisdom'; id: string }
  | { kind: 'web'; url: string };

export interface CompareLink {
  title: { en: string; hi: string };
  note: { en: string; hi: string };
  target: CompareTarget;
}

export interface CompareSet {
  id: string;
  title: { en: string; hi: string };
  blurb: { en: string; hi: string };
  links: CompareLink[];
}

export const COMPARE_SETS = compareJson as CompareSet[];

export function compareSet(id: string): CompareSet | undefined {
  return COMPARE_SETS.find((c) => c.id === id);
}

export interface SourceEdition {
  sourceScriptureTitle?: string;
  sourceScriptureTitleSanskrit?: string;
  sanskritEdition: string;
  publisherArchive?: string;
  archiveUrl?: string;
  primaryTranslator?: string;
  traditionalCommentaryAuthor?: string;
  numberingSystemNote?: string;
}

export const SOURCES = sourcesJson as Record<string, SourceEdition>;

/** One verse from a book on the phone (bundled or downloaded), or undefined. */
export function loadVerse(id: string, chapter: number, verse: string | number): Verse | undefined {
  return loadChapter(id, chapter)?.verses.find((v) => String(v.number) === String(verse));
}

/** "Bhagavad Gita 2.47" (English) or "श्रीमद्भगवद्गीता 2.47" (Hindi, where the book has a Sanskrit title). */
export function verseLabel(id: string, chapter: number, verse: string | number, lang: 'en' | 'hi'): string {
  const entry = getEntry(id);
  const name = (lang === 'hi' && entry?.titleSanskrit) || entry?.title || id;
  return `${name} ${formatVerseRef(id, chapter, verse)}`;
}
