export const scriptureCategories = [
  'veda',
  'upanishad',
  'vedanta',
  'sutra',
  'shakta',
  'purana',
  'itihasa',
  'smriti',
  'tantra',
  'stotra',
  'other',
] as const;

export type ScriptureCategory = (typeof scriptureCategories)[number];

/** A stored link to another library verse. Editorial. Not an inferred recommendation. */
export interface VerseLink {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
}

/** A stored question or life-topic that cites this verse. */
export interface VerseQuestionLink {
  href: string;
  labelHi: string;
  labelEn: string;
}

export interface Verse {
  id: number | string;
  number?: number | string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  hindi?: string;
  meaning?: string;
  explanation: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
  /** Knowledge-graph concept ids. Absent means the verse has not been tagged. */
  concepts?: string[];
  /** Other library verses an editor has connected. */
  relatedVerses?: VerseLink[];
  /** Questions or topic pages an editor has connected. */
  relatedQuestions?: VerseQuestionLink[];
}

export interface Chapter {
  id: number;
  title: string;
  titleSanskrit?: string;
  verses: Verse[];
  summary?: string;
}

export interface Scripture {
  id: string;
  title: string;
  titleSanskrit: string;
  titleIast?: string;
  category: ScriptureCategory;
  description: string;
  author?: string;
  chapters: Chapter[];
  totalVerses: number;
  tags: string[];
  isCurated?: boolean;
  canonicalTotalVerses?: number;
}

export interface ScriptureMeta {
  id: string;
  title: string;
  titleSanskrit: string;
  titleIast?: string;
  category: Scripture['category'];
  description: string;
  author?: string;
  totalChapters: number;
  totalVerses: number;
  tags: string[];
  hasData: boolean;
  isCurated?: boolean;
  canonicalTotalVerses?: number;
}
