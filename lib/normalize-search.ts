// Kept separate from lib/search.ts (which bundles the whole search index) so
// light consumers like the chapter verse filter can import it cheaply.
import { unifyAnusvara } from '@/lib/searchNormalizer';

// Built via the constructor because the tsconfig target (ES5) rejects the
// `u` flag in regex literals; every supported browser handles it at runtime.
const NON_WORD = new RegExp('[^\\p{L}\\p{M}\\p{N}]+', 'gu');
const DEVANAGARI_DIGITS = '०१२३४५६७८९';

/**
 * Check if a string contains any Devanagari Unicode characters (U+0900 to U+097F).
 */
export function isDevanagari(value: string): boolean {
  return /[\u0900-\u097F]/.test(value);
}

/**
 * Normalise text for matching: lowercase, strip Latin diacritics (so "gita"
 * matches IAST "gītā"), map Devanagari numerals to ASCII digits,
 * turn punctuation into spaces and collapse whitespace.
 * Devanagari matras are outside the stripped range, so Hindi/Sanskrit
 * queries still match exactly.
 */
export function normalizeForSearch(value: string): string {
  if (!value) return '';
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)))
    .replace(NON_WORD, ' ')
    .trim();
}

/**
 * Normalise Devanagari text for matching:
 * - normalises Unicode (NFC)
 * - removes danda (।), double danda (॥), avagraha (ऽ), and punctuation
 * - converts Devanagari digits to ASCII
 * - collapses spaces
 */
export function normalizeDevanagari(value: string): string {
  if (!value) return '';
  return unifyAnusvara(value)
    .normalize('NFC')
    .replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)))
    .replace(/[।॥ऽ.,:;!?'"()\[\]{}\-_\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Casual romanisations (Harvard-Kyoto, IAST without accents, common Indian English spellings)
// Order matters: longer digraphs first.
const PHONETIC_FOLDS: ReadonlyArray<[RegExp, string]> = [
  [/chh/g, 'c'],
  [/ch/g, 'c'],
  [/shh/g, 's'],
  [/sh/g, 's'],
  [/kṣ/g, 'ks'],
  [/ksh/g, 'ks'],
  [/jñ/g, 'gy'],
  [/jn/g, 'gy'],
  [/dny/g, 'gy'],
  [/ri/g, 'r'],
  [/ru/g, 'r'],
  [/aa/g, 'a'],
  [/(ee|ii)/g, 'i'],
  [/(oo|uu)/g, 'u'],
  [/w/g, 'v'],
  [/bh/g, 'b'],
  [/dh/g, 'd'],
  [/th/g, 't'],
  [/ph/g, 'p'],
  [/kh/g, 'k'],
  [/gh/g, 'g'],
  [/jh/g, 'j'],
];

/**
 * Looser match key for romanised Sanskrit: normalizeForSearch plus phonetic
 * folding, so "dharmakshetre" and IAST "dharmakṣetre" both become
 * "dharmaksetre", and "krishna" / "kṛṣṇa" both become "krsna".
 */
export function normalizeTransliteration(value: string): string {
  if (!value) return '';
  let out = normalizeForSearch(value);
  for (const [pattern, replacement] of PHONETIC_FOLDS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/**
 * Strip all whitespace and punctuation from transliterated text.
 * Used for comparing compounds like "karmanyevadhikaraste" with "karmanye vadhikaraste".
 */
export function compactTransliteration(value: string): string {
  if (!value) return '';
  return normalizeTransliteration(value).replace(/[^a-z0-9]/g, '');
}

/**
 * Standard Levenshtein distance for typo detection.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min(row[j] + 1, prev + 1, row[j - 1] + cost);
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}
