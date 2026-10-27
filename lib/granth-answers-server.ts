/**
 * Build-time resolver for Granth se Poochhiye answer pages
 * (data/granth-answers). Reads each referenced verse from the published
 * scripture files, so the page shows the library's own Sanskrit, Hindi and
 * English and never a copy that can drift. Server only (uses node:fs).
 */
import { readSeededChapter } from './read-seeded-chapters';
import { commentaryFor } from './verse-meaning';
import { splitVyakhyaCommentary } from './verse-format';
import { readHref } from './verse-paths';
import type { AnswerVerse } from '../data/granth-answers';

export interface ResolvedAnswerVerse extends AnswerVerse {
  sanskrit: string;
  hindi: string;
  english: string;
  labelEn: string;
  labelHi: string;
  href: string;
  /** The library's Hindi व्याख्या for this verse, when it has one. */
  vyakhya?: string;
}

/** One card on the page: a verse, or consecutive verses the printed Hindi translates together. */
export interface AnswerVerseGroup {
  verses: ResolvedAnswerVerse[];
  hindi: string;
  labelEn: string;
  labelHi: string;
}

const NAMES: Record<string, { en: string; hi: string }> = {
  bhagavadgita: { en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
  katha: { en: 'Katha Upanishad', hi: 'कठोपनिषद्' },
  mundaka: { en: 'Mundaka Upanishad', hi: 'मुण्डकोपनिषद्' },
  ishavasya: { en: 'Isha Upanishad', hi: 'ईशावास्योपनिषद्' },
  shvetashvatara: { en: 'Shvetashvatara Upanishad', hi: 'श्वेताश्वतरोपनिषद्' },
  kena: { en: 'Kena Upanishad', hi: 'केनोपनिषद्' },
  mandukya: { en: 'Mandukya Upanishad', hi: 'माण्डूक्योपनिषद्' },
  vivekchudamani: { en: 'Vivekachudamani', hi: 'विवेकचूडामणि' },
};

/** Same stub test the shard step uses to hide "… श्लोक का अर्थ।" filler. */
const isStub = (t: unknown) => typeof t !== 'string' || t.trim() === '' || (t.length < 90 && /श्लोक का अर्थ[।.]?\s*$/.test(t.trim()));

/**
 * Traditional reference. The library stores Katha's six vallis and Mundaka's
 * six khandas as chapters 1–6; readers know them as 1.3.3 or 3.1.6.
 */
export function traditionalRef(s: string, c: number, v: string): string {
  if (s === 'katha') return `${Math.ceil(c / 3)}.${((c - 1) % 3) + 1}.${v}`;
  if (s === 'mundaka') return `${Math.ceil(c / 2)}.${((c - 1) % 2) + 1}.${v}`;
  if (s === 'ishavasya') return v;
  return `${c}.${v}`;
}

interface RawVerse {
  number?: number | string;
  sanskrit?: string;
  hindi?: string;
  translation?: string;
  explanation?: string;
  commentary?: string;
  wordMeaning?: string;
}

export function resolveAnswerVerse(ref: AnswerVerse): ResolvedAnswerVerse | null {
  const chapter = readSeededChapter(ref.s, ref.c);
  const verse = (chapter?.chapter.verses as RawVerse[] | undefined)?.find((x) => String(x.number) === ref.v);
  if (!verse || isStub(verse.sanskrit) || isStub(verse.hindi) || isStub(verse.translation)) return null;
  const name = NAMES[ref.s] ?? { en: ref.s, hi: ref.s };
  const num = traditionalRef(ref.s, ref.c, ref.v);
  // Same choice of व्याख्या as the verse page, so both show the same text.
  const { vyakhya } = splitVyakhyaCommentary(
    [commentaryFor(ref.s, ref.c, ref.v)?.explanation, verse.explanation, verse.commentary],
    verse.wordMeaning,
  );
  return {
    ...ref,
    sanskrit: verse.sanskrit!.trim(),
    hindi: verse.hindi!.trim(),
    english: verse.translation!.trim(),
    labelEn: `${name.en} ${num}`,
    labelHi: `${name.hi} ${num}`,
    href: readHref(ref.s, ref.c, ref.v),
    vyakhya: vyakhya?.trim() || undefined,
  };
}

const sameText = (a: string, b: string) => a.replace(/[^\u0900-\u097f]/g, '') === b.replace(/[^\u0900-\u097f]/g, '');

/**
 * Printed Hindi translations often render two verses as one sentence
 * ("(श्लोक 62–63) …"), stored on both. Neighbouring verses that share it
 * become one card with every Sanskrit verse in full and the Hindi once.
 */
export function groupAnswerVerses(verses: ResolvedAnswerVerse[]): AnswerVerseGroup[] {
  const groups: AnswerVerseGroup[] = [];
  for (const v of verses) {
    const last = groups[groups.length - 1];
    const prev = last?.verses[last.verses.length - 1];
    if (last && prev && prev.s === v.s && prev.c === v.c && Number(v.v) === Number(prev.v) + 1 && sameText(last.hindi, v.hindi)) {
      last.verses.push(v);
      const first = last.verses[0];
      last.labelEn = `${first.labelEn}–${v.v}`;
      last.labelHi = `${first.labelHi}–${v.v}`;
    } else {
      groups.push({ verses: [v], hindi: v.hindi, labelEn: v.labelEn, labelHi: v.labelHi });
    }
  }
  return groups;
}
