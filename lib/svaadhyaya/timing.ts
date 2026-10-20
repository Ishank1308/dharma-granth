/**
 * Svaadhyaya Engine — recitation timing model.
 *
 * Two timing sources are supported:
 *  1. Real aligned tracks (`VerseTimingTrack[]`) — used verbatim when provided.
 *  2. A deterministic cadence estimator — derives per-word intervals from the
 *     IAST transliteration (syllable count, vowel length) at a base recitation
 *     tempo. This is what powers word-level highlighting until studio-recorded
 *     chanting with force alignment ships; it contains no network access and no
 *     randomness, so a verse always renders the same timing grid.
 */

import type { SvaadhyayaVerse, TimedWord, VerseTimingTrack } from './types';

/** Base tempo: milliseconds per (light) syllable at 1.0x speed. */
export const BASE_MS_PER_SYLLABLE = 210;
/** Extra time absorbed by dandas / line breaks / verse-final cadence (ms). */
export const VERSE_TAIL_MS = 900;

const LONG_VOWELS = new Set(['ā', 'ī', 'ū', 'ṛ', 'ṝ', 'e', 'ai', 'o', 'au']);
const SHORT_VOWELS = new Set(['a', 'i', 'u', 'ṛ'.normalize('NFD')[0]]);

/** Count light/heavy syllable units in one IAST word (approximate mātrā count). */
export function syllableWeight(word: string): number {
  const w = word.normalize('NFD').toLowerCase();
  let units = 0;
  for (let i = 0; i < w.length; i++) {
    const ch = w[i];
    if (LONG_VOWELS.has(ch)) units += 2;
    else if (SHORT_VOWELS.has(ch) && !LONG_VOWELS.has(w[i - 1] ?? '')) units += 1;
  }
  return Math.max(1, units);
}

/** Split a transliteration string into recitable words (strips danda/punctuation-only tokens). */
export function splitWords(transliteration: string | undefined): string[] {
  if (!transliteration) return [];
  return transliteration
    .split(/[\s|।॥\-–—]+/)
    .map((t) => t.trim())
    .filter((t) => /[A-Za-zĀĪŪṚṜṢṆÑṬḌṀḤāīūṛṝṣṇñṭḍṁḥ]/.test(t));
}

/**
 * Build a per-verse timing track from the cadence estimator.
 * `speed` scales the tempo; returned intervals are in real milliseconds.
 */
export function buildCadenceTrack(
  verse: SvaadhyayaVerse,
  speed = 1,
  baseMsPerSyllable = BASE_MS_PER_SYLLABLE,
): VerseTimingTrack {
  const words = splitWords(verse.transliteration);
  const msPerUnit = baseMsPerSyllable / speed;
  const timed: TimedWord[] = [];
  let cursor = 240; // small lead-in before the first syllable lands
  for (const word of words) {
    const units = syllableWeight(word);
    const duration = units * msPerUnit + 60; // 60ms inter-word breath
    timed.push({ word, startTimeMs: cursor, endTimeMs: cursor + duration });
    cursor += duration;
  }
  return {
    verseNumber: verse.number,
    durationMs: Math.max(cursor + VERSE_TAIL_MS, 1800),
    words: timed,
  };
}

/**
 * Resolve the timing track for a verse: pre-aligned track if provided,
 * otherwise the cadence estimator.
 */
export function resolveTrack(
  verse: SvaadhyayaVerse,
  tracks: VerseTimingTrack[] | undefined,
  speed = 1,
): VerseTimingTrack {
  const aligned = tracks?.find((t) => String(t.verseNumber) === String(verse.number));
  if (aligned && aligned.words.length > 0) return aligned;
  return buildCadenceTrack(verse, speed);
}

/** Binary search: index of the word active at `timeMs`, or -1 in a gap. */
export function activeWordAt(words: TimedWord[], timeMs: number): number {
  let lo = 0;
  let hi = words.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (timeMs < words[mid].startTimeMs) hi = mid - 1;
    else if (timeMs >= words[mid].endTimeMs) lo = mid + 1;
    else return mid;
  }
  return -1;
}
