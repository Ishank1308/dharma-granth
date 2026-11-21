/**
 * Chapter summaries (सार) and quizzes, from the website's data (scripts/build-study.mjs).
 *
 * Summaries are editorial text, not scripture: a plain retelling of what each chapter covers, in Hindi
 * and English, with the chapter's key verses. Quizzes are the website's knowledge checks; their
 * questions are written in English only, so the quiz screens say so when the app is in Hindi.
 */
import quizzesJson from './generated/study/quizzes.json';
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

export interface QuizQuestion {
  id: string;
  q: string;
  options: string[];
  /** Index of the right option. */
  answer: number;
  /** Why that answer is right, shown once the reader has answered. */
  why: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Quiz {
  id: string;
  title: string;
  /** The website's title in Devanagari (titleSanskrit). */
  titleHi?: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  /** Books this quiz is offered on (their book pages link to it). */
  books: string[];
  /** The /learn/ course the quiz closes, when it is a course's knowledge check. */
  course?: { title: string; titleHi?: string; icon?: string };
  questions: QuizQuestion[];
}

const SUMMARIES = summariesJson as Record<string, SummaryCollection>;
export const QUIZZES = quizzesJson as Quiz[];

export function summaryCollection(id: string): SummaryCollection | undefined {
  return SUMMARIES[id];
}

export function chapterSummary(id: string, chapter: number): ChapterSummary | undefined {
  return SUMMARIES[id]?.chapters.find((c) => c.chapter === chapter);
}

export function getQuiz(id: string): Quiz | undefined {
  return QUIZZES.find((q) => q.id === id);
}

export function quizzesForBook(id: string): Quiz[] {
  return QUIZZES.filter((q) => q.books.includes(id));
}
