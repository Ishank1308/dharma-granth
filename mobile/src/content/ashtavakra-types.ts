/** The Ashtavakra Gita as the app ships it (scripts/build-ashtavakra.mjs, from data/ashtavakra on the website). */
export interface AshtavakraVerse {
  verseNumber: string;
  speaker?: string;
  sanskrit: string;
  iast?: string;
  padaccheda?: string;
  wordMeanings?: { sanskrit: string; hindi: string }[];
  literalHindiMeaning?: string;
  englishTranslation?: string;
  bookBasedHindiExplanation?: string;
  simpleHindiExplanation?: string;
  simpleEnglishExplanation?: string;
  philosophicalExplanationHindi?: string;
  analogyHindi?: string;
  commonMisunderstandingHindi?: string;
  modernExampleHindi?: string;
  messageForTodayHindi?: string;
  practicalApplicationHindi?: string;
  reflectionQuestionHindi?: string;
  shortPracticeHindi?: string;
  oneLineSummaryHindi?: string;
  verificationStatus?: 'verified' | 'review-required';
}

export interface AshtavakraChapterMeta {
  number: number;
  bookTitle: string;
  title: string;
  essence: string;
  symbol: string;
  palette: [string, string, string];
  verseCount: number;
  summary?: string;
  readingTime?: string;
}

export interface AshtavakraChapter {
  number: number;
  titleBook?: string;
  title: string;
  speakers?: Record<string, string>;
  closingLine?: string;
  hero: { oneLineSummary?: string; keySanskritTerms?: string[]; mainTopics?: string[]; estimatedReadingTime?: string };
  introduction?: string;
  centralQuestion?: string;
  mainTeaching?: string;
  concepts: { term: string; definition: string }[];
  beforeYouRead: string[];
  verses: AshtavakraVerse[];
  end: {
    simpleSummary?: string;
    fiveTeachings?: { teaching: string; verses: string[] }[];
    misunderstandings?: string[];
    reflectionQuestions?: string[];
    fiveMinutePractice?: string;
    faqs?: { q: string; a: string }[];
  };
  source?: { title?: string; publisher?: string; rightsNote?: string };
}
