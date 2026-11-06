/**
 * The key a verse's published Hindi commentary is stored under (`public/data/hi-commentary/<id>.json`).
 *
 * Most books use the short key: the chapter, then the verse number with any leading chapter part dropped
 * ("2:47"; "3:28" for Katha "1.3.28"). Some books number verses so that several verses of one chapter share
 * a short key: the Mahabharata prints "adhyaya.verse" inside each parva, so 1.1, 2.1 and 3.1 of parva 1 all
 * shorten to "1:1", and Brahma Sutra 1.1.1 and 1.1.10 both shorten to "1:1.1". Those verses are looked up only
 * by their full number ("1:5.1", "1:1.1.10"), so an entry never shows on a verse it was not written for.
 *
 * Writing an entry under the full number always works; the short key is kept so existing entries still match.
 */
import { canonicalVerseId } from './canonical-verse-id';

export type VerseNumber = number | string;

/** "2:47"; "3:28" for "1.3.28" in chapter 3. Lossy: "1.10" and "1.1" give the same key. */
export function shortVerseKey(chapterId: number, verseNumber: VerseNumber): string {
  return `${chapterId}:${Number(canonicalVerseId(chapterId, verseNumber))}`;
}

/** The verse number as printed: "1:5.1", "2:0.d1". */
export function fullVerseKey(chapterId: number, verseNumber: VerseNumber): string {
  return `${chapterId}:${String(verseNumber).trim()}`;
}

/** Short keys that two or more verses of the chapter share. */
export function sharedShortKeys(chapterId: number, verseNumbers: Iterable<VerseNumber>): Set<string> {
  const seen = new Set<string>();
  const shared = new Set<string>();
  for (const n of verseNumbers) {
    const key = shortVerseKey(chapterId, n);
    if (seen.has(key)) shared.add(key);
    else seen.add(key);
  }
  return shared;
}

/**
 * The keys to try for a verse, best first. `shared` comes from `sharedShortKeys` over the whole chapter;
 * without it a verse is looked up the old way (short key first).
 */
export function verseCommentaryKeys(chapterId: number, verseNumber: VerseNumber, shared?: ReadonlySet<string>): string[] {
  const short = shortVerseKey(chapterId, verseNumber);
  const full = fullVerseKey(chapterId, verseNumber);
  if (shared?.has(short)) return [full];
  return short === full ? [short] : [short, full];
}

/** The verse's entry in a commentary table, or undefined. */
export function lookupVerseCommentary<T>(
  all: Record<string, T> | undefined,
  chapterId: number,
  verseNumber: VerseNumber,
  shared?: ReadonlySet<string>,
): T | undefined {
  if (!all) return undefined;
  for (const key of verseCommentaryKeys(chapterId, verseNumber, shared)) {
    const hit = all[key];
    if (hit !== undefined) return hit;
  }
  return undefined;
}
