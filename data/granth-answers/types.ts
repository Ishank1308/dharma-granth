/**
 * Granth se Poochhiye (ग्रन्थ से पूछिए): one answer page per life question.
 *
 * Every answer starts from a reader's question, gives the answer in one line
 * (सार), then the verses that carry it, a traditional story where one fits, the
 * common misreading, and one step for today. Verse text is never copied here:
 * pages read Sanskrit, Hindi and English from the published scripture files by
 * reference, so a later text repair shows up everywhere.
 *
 * The notes are editorial, and the page labels them as such, apart from scripture.
 */

export type AnswerThemeId = 'mind' | 'health' | 'work' | 'relations' | 'family' | 'spirit' | 'practice' | 'life';

/** A verse that answers the question, by its published reference. */
export interface AnswerVerse {
  /** Scripture id, e.g. `bhagavadgita`. */
  s: string;
  /** Chapter number as stored in the scripture file. */
  c: number;
  /** Verse number as stored in the scripture file. */
  v: string;
  /** One line on why this verse answers the question. */
  whyHi: string;
  whyEn: string;
}

/** A traditional story (दृष्टान्त), always with the text it comes from. */
export interface AnswerStory {
  titleHi: string;
  titleEn: string;
  hi: string;
  en: string;
  sourceHi: string;
  sourceEn: string;
}

/** A common misreading and what the scripture actually says. */
export interface AnswerMyth {
  hi: string;
  en: string;
  truthHi: string;
  truthEn: string;
}

/**
 * What well-established research says alongside the teaching ("विज्ञान की
 * दृष्टि से"). A parallel, never proof that the scripture is right; only where
 * the evidence is solid, always with the study or review it rests on.
 */
export interface AnswerScience {
  hi: string;
  en: string;
  source: string;
}

/** A helpline for this problem, shown in the care note above the verses. */
export interface AnswerHelp {
  nameHi: string;
  nameEn: string;
  /** As dialled, e.g. `14446` or `1800-891-4416`. */
  number: string;
}

export interface GranthAnswer {
  slug: string;
  theme: AnswerThemeId;
  questionHi: string;
  questionEn: string;
  /** Words people type for this question: Hindi, Hinglish and English. */
  terms: string[];
  sarHi: string;
  sarEn: string;
  verses: AnswerVerse[];
  story?: AnswerStory;
  myth?: AnswerMyth;
  science?: AnswerScience;
  practiceHi: string;
  practiceEn: string;
  /** Slugs of the likely next questions. */
  next: string[];
  /** Emotional topics show the study-not-treatment note. */
  care?: boolean;
  /** Helplines for this problem, listed before Tele-MANAS in the care note. */
  help?: AnswerHelp[];
  /** Thoughts of not wanting to live: the page opens with Tele-MANAS and 112, before the सार. */
  crisis?: boolean;
}

export interface AnswerTheme {
  id: AnswerThemeId;
  titleHi: string;
  titleEn: string;
}

export const ANSWER_THEMES: AnswerTheme[] = [
  { id: 'mind', titleHi: 'मन और भावनाएँ', titleEn: 'Mind and emotions' },
  { id: 'health', titleHi: 'शरीर, नींद और नशा', titleEn: 'Body, sleep and addiction' },
  { id: 'work', titleHi: 'कर्म और जीवन‑मार्ग', titleEn: 'Work and purpose' },
  { id: 'relations', titleHi: 'सम्बन्ध और व्यवहार', titleEn: 'People and conduct' },
  { id: 'family', titleHi: 'परिवार और गृहस्थ जीवन', titleEn: 'Family and home' },
  { id: 'spirit', titleHi: 'आत्मा और ईश्वर', titleEn: 'Self and God' },
  { id: 'practice', titleHi: 'साधना, आहार और आचार', titleEn: 'Practice, food and ritual' },
  { id: 'life', titleHi: 'सुख, शान्ति और मार्ग', titleEn: 'Happiness, peace and the path' },
];
