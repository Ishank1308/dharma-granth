/**
 * Split one printed line of a shloka into its two padas, so a narrow screen
 * wraps the line at the caesura and never inside a pada.
 *
 * Syllables (akshara) are counted from the Devanagari: every independent
 * vowel, and every consonant that is not silenced by a virama, is one
 * syllable. If a word boundary falls at exactly half the line's syllables
 * (or one off it, for lines that are not perfectly even), the line is split
 * there. Otherwise the line is returned whole and wraps as before.
 *
 * The text itself is never changed: joining the parts with one space gives
 * back the line with its whitespace normalised.
 */

const VOWEL = /[ऄ-औॠॡॲ-ॷ]/g;
// A consonant (with optional nukta) not followed by a virama.
const LIVE_CONSONANT = /[क-हक़-य़ॸ-ॿ]़?(?!्)/g;

export function countAksharas(text: string): number {
  return (text.match(VOWEL)?.length ?? 0) + (text.match(LIVE_CONSONANT)?.length ?? 0);
}

/** Below this many syllables a line fits on a phone anyway. */
const MIN_SYLLABLES = 12;

export function splitPadas(line: string): string[] {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return [line];
  const counts = words.map(countAksharas);
  const total = counts.reduce((a, b) => a + b, 0);
  if (total < MIN_SYLLABLES) return [line];

  const half = total / 2;
  let running = 0;
  let best = -1;
  let bestGap = Infinity;
  // Never split before the last word, so a closing danda stays with its pada.
  for (let i = 0; i < words.length - 1; i++) {
    running += counts[i];
    const gap = Math.abs(running - half);
    if (gap < bestGap) {
      bestGap = gap;
      best = i;
    }
  }
  if (best < 0 || bestGap > 1) return [line];
  // A bare danda or verse number on its own is not a pada.
  const tail = words.slice(best + 1);
  if (countAksharas(tail.join(' ')) === 0) return [line];
  return [words.slice(0, best + 1).join(' '), tail.join(' ')];
}
