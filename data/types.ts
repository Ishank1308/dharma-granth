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
