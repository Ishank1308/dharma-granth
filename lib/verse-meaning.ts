/**
 * Does a verse have a meaning a reader can use? Shared by the verse page (its title and robots tag) and the verse
 * sitemap, so a page is only promoted to search engines when it carries a real meaning or explanation.
 *
 * Reads the published data (shards with template text already removed, and the published Hindi commentary),
 * so boilerplate that publishing hides does not count as meaning.
 */
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { canonicalVerseId } from './canonical-verse-id';
import { readChapterCommentary, readSeededChapter } from './read-seeded-chapters';

export interface VerseLike {
  number?: number | string;
  hindi?: string;
  translation?: string;
  explanation?: string;
  commentary?: string;
}

export interface VerseMeaningSummary {
  hindi: boolean;
  english: boolean;
  explanation: boolean;
  /** At least one of the above. */
  any: boolean;
}

/** The key the published commentary uses, the same one the chapter reader looks up ("2:47", "3:28" for "1.3.28"). */
export function verseCommentaryKey(chapterId: number, verseNumber: number | string): string {
  return `${chapterId}:${Number(canonicalVerseId(chapterId, verseNumber))}`;
}

export function commentaryFor(scriptureId: string, chapterId: number, verseNumber: number | string): HiCommentaryEntry | undefined {
  const all = readChapterCommentary<HiCommentaryEntry>(scriptureId, chapterId);
  if (!all) return undefined;
  return all[verseCommentaryKey(chapterId, verseNumber)] ?? all[`${chapterId}:${verseNumber}`];
}

const real = (s: unknown) => typeof s === 'string' && s.replace(/\s+/g, ' ').trim().length > 20;

export function verseMeaningSummary(scriptureId: string, chapterId: number, verse: VerseLike): VerseMeaningSummary {
  const c = verse.number !== undefined ? commentaryFor(scriptureId, chapterId, verse.number) : undefined;
  const hindi = real(verse.hindi);
  const english = real(verse.translation);
  const explanation = real(verse.explanation) || real(verse.commentary) || real(c?.explanation);
  return { hindi, english, explanation, any: hindi || english || explanation };
}

const chapterCache = new Map<string, VerseLike[] | null>();

/** Summary for a verse given only its ids (used by the sitemap). */
export function verseMeaningById(scriptureId: string, chapterId: number, verseId: string): VerseMeaningSummary | null {
  const key = `${scriptureId}:${chapterId}`;
  if (!chapterCache.has(key)) chapterCache.set(key, (readSeededChapter(scriptureId, chapterId)?.chapter.verses as VerseLike[] | undefined) ?? null);
  const verse = chapterCache.get(key)?.find((v) => String(v.number) === verseId);
  return verse ? verseMeaningSummary(scriptureId, chapterId, verse) : null;
}

const chapterMeaningCache = new Map<string, boolean>();

/**
 * False only when the seeded chapter exists and none of its verses has a Hindi
 * or English meaning or an explanation. Such a chapter is noindex and left out
 * of the sitemap until a meaning is written. Not cached with the verses: the
 * sitemap asks this for every chapter of every scripture.
 */
export function chapterHasMeaning(scriptureId: string, chapterId: number): boolean {
  const key = `${scriptureId}:${chapterId}`;
  const known = chapterMeaningCache.get(key);
  if (known !== undefined) return known;
  const verses = readSeededChapter(scriptureId, chapterId)?.chapter.verses as VerseLike[] | undefined;
  const has = !verses?.length || verses.some((v) => verseMeaningSummary(scriptureId, chapterId, v).any);
  chapterMeaningCache.set(key, has);
  return has;
}

/** Shown above a chapter that has only the original text so far. */
export const ORIGINAL_ONLY_NOTICE_HI = 'मूल पाठ — इस अध्याय का हिन्दी/अंग्रेज़ी अर्थ अभी उपलब्ध नहीं है; शीघ्र जोड़ा जाएगा।';
export const ORIGINAL_ONLY_NOTICE_EN = 'Original text only: a Hindi or English meaning for this chapter has not been added yet.';
