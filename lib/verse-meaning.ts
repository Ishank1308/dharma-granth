/**
 * Does a verse have a meaning a reader can use? Shared by the verse page (its title and robots tag) and the verse
 * sitemap, so a page is only promoted to search engines when it carries a real meaning or explanation.
 *
 * Reads the published data (shards with template text already removed, and the published Hindi commentary),
 * so boilerplate that publishing hides does not count as meaning.
 */
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { lookupVerseCommentary, sharedShortKeys, verseCommentaryKeys } from './verse-commentary-key';
import { readChapterCommentary, readSeededChapter } from './read-seeded-chapters';
import { withPassageMeaning } from './verse-format';

export interface VerseLike {
  number?: number | string;
  hindi?: string;
  hindiSeeVerse?: number | string;
  translation?: string;
  translationSeeVerse?: number | string;
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

const sharedCache = new Map<string, Set<string>>();

/** Short keys that several verses of the chapter share (see lib/verse-commentary-key.ts), read once per chapter. */
function chapterSharedKeys(scriptureId: string, chapterId: number): Set<string> {
  const key = `${scriptureId}:${chapterId}`;
  let shared = sharedCache.get(key);
  if (!shared) {
    const verses = (readSeededChapter(scriptureId, chapterId)?.chapter.verses as VerseLike[] | undefined) ?? [];
    shared = sharedShortKeys(chapterId, verses.flatMap((v) => (v.number === undefined ? [] : [v.number])));
    sharedCache.set(key, shared);
  }
  return shared;
}

/** The key the published commentary uses for this verse, the same one the chapter reader looks up ("2:47", "3:28" for "1.3.28"). */
export function verseCommentaryKey(scriptureId: string, chapterId: number, verseNumber: number | string): string {
  return verseCommentaryKeys(chapterId, verseNumber, chapterSharedKeys(scriptureId, chapterId))[0];
}

export function commentaryFor(scriptureId: string, chapterId: number, verseNumber: number | string): HiCommentaryEntry | undefined {
  const all = readChapterCommentary<HiCommentaryEntry>(scriptureId, chapterId);
  return lookupVerseCommentary(all, chapterId, verseNumber, chapterSharedKeys(scriptureId, chapterId));
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
  const verses = chapterCache.get(key);
  const verse = verses?.find((v) => String(v.number) === verseId);
  return verses && verse ? verseMeaningSummary(scriptureId, chapterId, withPassageMeaning(verses, verse)) : null;
}
