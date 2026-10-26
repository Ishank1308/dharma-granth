/**
 * Does a published verse carry a meaning the reader shows? The same fields VerseCard checks before it falls back to
 * its "meaning not yet added" state. Shared by the chapter page (to count those verses once, at the top) and the
 * chapter reader (to link each one to the nearest verses that do have a meaning).
 */
import { canonicalVerseId } from './canonical-verse-id';
import { splitVyakhyaCommentary } from './verse-format';

export interface MeaningFields {
  number: number | string;
  hindi?: string;
  translation?: string;
  hindiSeeVerse?: number | string;
  hindiReviewRequired?: boolean;
  explanation?: string;
  commentary?: string;
  science?: string;
  lifeLesson?: string;
  wordMeaning?: string;
}

export interface CommentaryFields {
  explanation?: string;
  science?: string;
  lifeLesson?: string;
}

const has = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

export function verseHasMeaning(v: MeaningFields, c?: CommentaryFields): boolean {
  // An explanation that only repeats the word gloss is not shown (FullChapterVerses → VerseCard), so it does not count.
  const { vyakhya, commentary } = splitVyakhyaCommentary([c?.explanation, v.explanation, v.commentary], v.wordMeaning);
  return (
    has(v.hindi) || has(v.translation) || v.hindiSeeVerse != null || Boolean(v.hindiReviewRequired) ||
    Boolean(vyakhya || commentary) || has(c?.science ?? v.science) || has(c?.lifeLesson ?? v.lifeLesson)
  );
}

/** The published commentary entry of a verse ("2:47"; "3:28" for "1.3.28"), as the chapter reader looks it up. */
export function commentaryOf<T>(all: Record<string, T> | undefined, chapterId: number, verse: number | string): T | undefined {
  return all?.[`${chapterId}:${Number(canonicalVerseId(chapterId, verse))}`];
}

export interface NearbyMeaning {
  prev?: string;
  next?: string;
}

/** For every verse without a meaning, the nearest verse before and after it (in reading order) that has one. */
export function nearestWithMeaning(numbers: string[], hasMeaning: boolean[]): Map<string, NearbyMeaning> {
  const out = new Map<string, NearbyMeaning>();
  let prev: string | undefined;
  for (let i = 0; i < numbers.length; i++) {
    if (hasMeaning[i]) prev = numbers[i];
    else out.set(numbers[i], { prev });
  }
  let next: string | undefined;
  for (let i = numbers.length - 1; i >= 0; i--) {
    if (hasMeaning[i]) next = numbers[i];
    else out.get(numbers[i])!.next = next;
  }
  return out;
}
