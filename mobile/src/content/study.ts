/**
 * Chapter summaries (सार), from the website's data (scripts/build-study.mjs).
 *
 * Summaries are editorial text, not scripture: a plain retelling of what each chapter covers, in Hindi
 * and English, with the chapter's key verses.
 */
import summariesJson from './generated/study/summaries.json';

export interface KeyVerse {
  verse: number;
  note: string;
}

export interface ChapterSummary {
  chapter: number;
  nameHi?: string;
  nameEn?: string;
  hi: string;
  en: string;
  keyVerses: KeyVerse[];
  /** True once an editor has read the summary against the text; the website marks the rest as drafts. */
  reviewed: boolean;
}

export interface SummaryCollection {
  /** What a chapter is called in this text: chapter / अध्याय, pada / पाद. */
  unit: { en: string; hi: string };
  heading: { en: string; hi: string };
  /** A sutra text: its key verses are "key sutras". */
  sutras: boolean;
  chapters: ChapterSummary[];
}

const SUMMARIES = summariesJson as Record<string, SummaryCollection>;

export function summaryCollection(id: string): SummaryCollection | undefined {
  return SUMMARIES[id];
}

export function chapterSummary(id: string, chapter: number): ChapterSummary | undefined {
  return SUMMARIES[id]?.chapters.find((c) => c.chapter === chapter);
}
