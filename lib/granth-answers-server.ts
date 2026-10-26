/**
 * Build-time resolver for Granth se Poochhiye answer pages
 * (data/granth-answers). Reads each referenced verse from the published
 * scripture files, so the page shows the library's own Sanskrit, Hindi and
 * English and never a copy that can drift. Server only (uses node:fs).
 */
import { readSeededChapter } from './read-seeded-chapters';
import { readHref } from './verse-paths';
import type { AnswerVerse } from '../data/granth-answers';

export interface ResolvedAnswerVerse extends AnswerVerse {
  sanskrit: string;
  hindi: string;
  english: string;
  labelEn: string;
  labelHi: string;
  href: string;
}

const NAMES: Record<string, { en: string; hi: string }> = {
  bhagavadgita: { en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
  katha: { en: 'Katha Upanishad', hi: 'कठोपनिषद्' },
  mundaka: { en: 'Mundaka Upanishad', hi: 'मुण्डकोपनिषद्' },
  ishavasya: { en: 'Isha Upanishad', hi: 'ईशावास्योपनिषद्' },
  shvetashvatara: { en: 'Shvetashvatara Upanishad', hi: 'श्वेताश्वतरोपनिषद्' },
  kena: { en: 'Kena Upanishad', hi: 'केनोपनिषद्' },
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
}

export function resolveAnswerVerse(ref: AnswerVerse): ResolvedAnswerVerse | null {
  const chapter = readSeededChapter(ref.s, ref.c);
  const verse = (chapter?.chapter.verses as RawVerse[] | undefined)?.find((x) => String(x.number) === ref.v);
  if (!verse || isStub(verse.sanskrit) || isStub(verse.hindi) || isStub(verse.translation)) return null;
  const name = NAMES[ref.s] ?? { en: ref.s, hi: ref.s };
  const num = traditionalRef(ref.s, ref.c, ref.v);
  return {
    ...ref,
    sanskrit: verse.sanskrit!.trim(),
    hindi: verse.hindi!.trim(),
    english: verse.translation!.trim(),
    labelEn: `${name.en} ${num}`,
    labelHi: `${name.hi} ${num}`,
    href: readHref(ref.s, ref.c, ref.v),
  };
}
