/**
 * Server-side loader for the Ashtavakra Gita content. Only chapters that have
 * been transcribed, checked and composed (data/ashtavakra/chapter-N.json) are
 * published; everything else is shown as not yet available rather than guessed.
 */
import chapter1 from '@/data/ashtavakra/chapter-1.json';
import chapter2 from '@/data/ashtavakra/chapter-2.json';
import chapter3 from '@/data/ashtavakra/chapter-3.json';
import chapter4 from '@/data/ashtavakra/chapter-4.json';
import chapter5 from '@/data/ashtavakra/chapter-5.json';
import chapter6 from '@/data/ashtavakra/chapter-6.json';
import chapter7 from '@/data/ashtavakra/chapter-7.json';
import chapter8 from '@/data/ashtavakra/chapter-8.json';
import chapter9 from '@/data/ashtavakra/chapter-9.json';
import chapter10 from '@/data/ashtavakra/chapter-10.json';
import chapter11 from '@/data/ashtavakra/chapter-11.json';
import chapter12 from '@/data/ashtavakra/chapter-12.json';
import chapter13 from '@/data/ashtavakra/chapter-13.json';
import chapter14 from '@/data/ashtavakra/chapter-14.json';
import chapter15 from '@/data/ashtavakra/chapter-15.json';
import chapter16 from '@/data/ashtavakra/chapter-16.json';
import chapter17 from '@/data/ashtavakra/chapter-17.json';
import chapter18 from '@/data/ashtavakra/chapter-18.json';
import chapter19 from '@/data/ashtavakra/chapter-19.json';
import chapter20 from '@/data/ashtavakra/chapter-20.json';
import { CHAPTERS, getChapterMeta } from '@/data/ashtavakra/chapters-meta';
import { toAsciiDigits } from '@/lib/verse-format';

function asciiDeep<T>(val: T): T {
  if (typeof val === 'string') return toAsciiDigits(val) as T;
  if (Array.isArray(val)) return val.map(asciiDeep) as T;
  if (val && typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) out[k] = asciiDeep(v);
    return out as T;
  }
  return val;
}

export interface AshtavakraVerse {
  scripture: string;
  chapterNumber: string;
  chapterTitleHindi: string;
  verseNumber: string;
  speaker: string;
  sanskrit: string;
  iast: string;
  simplePronunciation: string;
  padaccheda: string;
  wordMeanings: Array<{ sanskrit: string; hindi: string }>;
  literalHindiMeaning: string;
  bookBasedHindiExplanation: string;
  simpleHindiExplanation: string;
  philosophicalExplanationHindi: string;
  analogyHindi: string;
  modernExampleHindi: string;
  messageForTodayHindi: string;
  commonMisunderstandingHindi: string;
  practicalApplicationHindi: string;
  reflectionQuestionHindi: string;
  shortPracticeHindi: string;
  oneLineSummaryHindi: string;
  englishTranslation: string;
  simpleEnglishExplanation: string;
  themes: string[];
  searchTags: string[];
  relatedVerses: Array<{ id: string; reason: string }>;
  sourcePage: string;
  verificationStatus: 'verified' | 'review-required';
  editorialNotes: string;
}

export interface AshtavakraChapterData {
  chapterNumber: string;
  chapterTitleBook: string;
  chapterTitleEditorial: string;
  sourceStatus: string;
  source: { title: string; publisher: string; pageMapping: string; rightsNote: string; verificationMethod: string };
  hero: { oneLineSummary: string; keySanskritTerms: string[]; mainTopics: string[]; estimatedReadingTime: string; totalVerses: number };
  introduction: string;
  centralQuestion: string;
  mainTeaching: string;
  concepts: Array<{ term: string; definition: string }>;
  beforeYouRead: string[];
  verses: AshtavakraVerse[];
  end: {
    simpleSummary: string;
    fiveTeachings: Array<{ teaching: string; verses: string[] }>;
    misunderstandings: string[];
    reflectionQuestions: string[];
    fiveMinutePractice: string;
    faqs: Array<{ q: string; a: string }>;
    seo: { title: string; metaDescription: string; primaryKeyword: string };
  };
}

const DATA: Record<number, AshtavakraChapterData> = {
  1: asciiDeep(chapter1 as unknown as AshtavakraChapterData),
  2: asciiDeep(chapter2 as unknown as AshtavakraChapterData),
  3: asciiDeep(chapter3 as unknown as AshtavakraChapterData),
  4: asciiDeep(chapter4 as unknown as AshtavakraChapterData),
  5: asciiDeep(chapter5 as unknown as AshtavakraChapterData),
  6: asciiDeep(chapter6 as unknown as AshtavakraChapterData),
  7: asciiDeep(chapter7 as unknown as AshtavakraChapterData),
  8: asciiDeep(chapter8 as unknown as AshtavakraChapterData),
  9: asciiDeep(chapter9 as unknown as AshtavakraChapterData),
  10: asciiDeep(chapter10 as unknown as AshtavakraChapterData),
  11: asciiDeep(chapter11 as unknown as AshtavakraChapterData),
  12: asciiDeep(chapter12 as unknown as AshtavakraChapterData),
  13: asciiDeep(chapter13 as unknown as AshtavakraChapterData),
  14: asciiDeep(chapter14 as unknown as AshtavakraChapterData),
  15: asciiDeep(chapter15 as unknown as AshtavakraChapterData),
  16: asciiDeep(chapter16 as unknown as AshtavakraChapterData),
  17: asciiDeep(chapter17 as unknown as AshtavakraChapterData),
  18: asciiDeep(chapter18 as unknown as AshtavakraChapterData),
  19: asciiDeep(chapter19 as unknown as AshtavakraChapterData),
  20: asciiDeep(chapter20 as unknown as AshtavakraChapterData),
};

export const getChapterData = (n: number): AshtavakraChapterData | undefined => DATA[n];
export const publishedChapterNumbers = (): number[] => Object.keys(DATA).map(Number).sort((a, b) => a - b);

/** Keeps a danda or verse-number marker on the same line as the word before it. */
export const keepDanda = (t: string) =>
  toAsciiDigits(t).replace(/ ॥ ([0-9]+) ॥/g, ' ॥ $1 ॥').replace(/ (॥|।)/g, ' $1');

/** "2.14" to { chapter: 2, verse: 14 }. */
export function parseVerseId(id: string): { chapter: number; verse: number } | null {
  const m = /^(\d+)\.(\d+)$/.exec(id);
  return m ? { chapter: +m[1], verse: +m[2] } : null;
}

export function getVerse(chapter: number, verse: number): AshtavakraVerse | undefined {
  return DATA[chapter]?.verses.find((v) => v.verseNumber === `${chapter}.${verse}`);
}

export function verseNeighbours(chapter: number, verse: number) {
  const c = DATA[chapter];
  const idx = c ? c.verses.findIndex((v) => v.verseNumber === `${chapter}.${verse}`) : -1;
  let prev = c && idx > 0 ? c.verses[idx - 1] : undefined;
  let next = c && idx >= 0 && idx < c.verses.length - 1 ? c.verses[idx + 1] : undefined;
  let prevCrossesChapter = false;
  let nextCrossesChapter = false;
  if (!prev && c && idx === 0) {
    const earlier = DATA[chapter - 1];
    const last = earlier?.verses[earlier.verses.length - 1];
    if (last) {
      prev = last;
      prevCrossesChapter = true;
    }
  }
  if (!next && c && idx === c.verses.length - 1) {
    const following = DATA[chapter + 1];
    const first = following?.verses[0];
    if (first) {
      next = first;
      nextCrossesChapter = true;
    }
  }
  return { prev, next, prevCrossesChapter, nextCrossesChapter };
}

export const verseHref = (id: string) => {
  const p = parseVerseId(id);
  return p ? `/ashtavakra/${p.chapter}/${p.verse}/` : '/ashtavakra/';
};

/** Totals from published data only. */
export function publishedTotals() {
  const nums = publishedChapterNumbers();
  return { chapters: nums.length, verses: nums.reduce((s, n) => s + DATA[n].verses.length, 0), allChapters: CHAPTERS.length };
}

export { CHAPTERS, getChapterMeta };
