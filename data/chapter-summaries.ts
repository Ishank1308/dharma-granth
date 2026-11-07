/**
 * Chapter summaries (सार) by scripture: the data behind
 * /scripture/{id}/summary/ and the summary box at the top of each chapter.
 *
 * Editorial text, not scripture. Each scripture keeps its entries in its own
 * file; this registry adds the page copy. Key verses come from the entry, or
 * else from the chapter's orientation in data/chapter-orientation.ts.
 */

import type { ReviewState } from './chapter-orientation';
import { gitaChapterSummaries } from './gita-chapter-summaries';
import { yogasutraPadaSummaries } from './yogasutra-pada-summaries';

export interface ChapterSummary {
  chapter: number;
  /** Chapter name, when there is no chapter orientation to take it from. */
  nameHi?: string;
  nameEn?: string;
  summaryHi: string;
  summaryEn: string;
  /** Key verses, when there is no chapter orientation to take them from. */
  keyVerses?: Array<{ verse: number; note: string }>;
  review: ReviewState;
  reviewer?: string;
  reviewDate?: string;
}

export interface ChapterSummaryCollection {
  scriptureId: string;
  /** Data file the entries live in, for the sitemap's lastmod. */
  source: string;
  scriptureNameHi: string;
  scriptureNameEn: string;
  /** What a chapter is called in this text: अध्याय, पाद … */
  unitHi: string;
  unitEn: string;
  /** Heading over each chapter's key verses: मुख्य श्लोक, मुख्य सूत्र … */
  keyVersesHi: string;
  /** Anchor prefix for each chapter on the summary page. */
  anchor: string;
  title: string;
  description: string;
  keywords: string[];
  headingHi: string;
  headingEn: string;
  introHi: string;
  /** Link text from a chapter's summary box to the summary page. */
  allLinkHi: string;
  chapters: ChapterSummary[];
}

export const chapterSummaryCollections: ChapterSummaryCollection[] = [
  {
    scriptureId: 'bhagavadgita',
    source: 'data/gita-chapter-summaries.ts',
    scriptureNameHi: 'श्रीमद्भगवद्गीता',
    scriptureNameEn: 'Bhagavad Gita',
    unitHi: 'अध्याय',
    unitEn: 'chapter',
    keyVersesHi: 'मुख्य श्लोक',
    anchor: 'adhyay',
    title: 'भगवद्गीता सार: 18 अध्यायों का सारांश · Bhagavad Gita Chapter Summaries',
    description:
      'श्रीमद्भगवद्गीता के सभी 18 अध्यायों का सरल हिंदी सार, मुख्य श्लोकों के साथ। Bhagavad Gita summary, chapter by chapter, in Hindi and English.',
    keywords: [
      'bhagavad gita summary',
      'bhagavad gita chapter summary',
      'gita saar',
      'गीता सार',
      'गीता के 18 अध्याय',
      'भगवद्गीता अध्याय सारांश',
    ],
    headingHi: 'भगवद्गीता सार',
    headingEn: 'Summaries of all 18 chapters',
    introHi:
      'हर अध्याय में क्या है, सरल हिंदी में, साथ में अंग्रेज़ी सार और उस अध्याय के मुख्य श्लोक। पूरा अध्याय पढ़ने के लिए अध्याय के नाम पर जाएँ।',
    allLinkHi: 'सभी 18 अध्यायों का सार',
    chapters: gitaChapterSummaries,
  },
  {
    scriptureId: 'yogasutra',
    source: 'data/yogasutra-pada-summaries.ts',
    scriptureNameHi: 'पातञ्जल योगसूत्र',
    scriptureNameEn: 'Patanjali Yoga Sutras',
    unitHi: 'पाद',
    unitEn: 'pada',
    keyVersesHi: 'मुख्य सूत्र',
    anchor: 'pada',
    title: 'योगसूत्र सार: चारों पादों का सारांश · Patanjali Yoga Sutras Summary',
    description:
      'पातञ्जल योगसूत्र के चारों पादों (समाधि, साधन, विभूति, कैवल्य) का सरल हिंदी सार, मुख्य सूत्रों के साथ। Yoga Sutras of Patanjali summary, pada by pada, in Hindi and English.',
    keywords: [
      'yoga sutra summary',
      'patanjali yoga sutras summary',
      'yoga sutras four padas',
      'योगसूत्र सार',
      'पतंजलि योगसूत्र',
      'योगसूत्र के चार पाद',
    ],
    headingHi: 'योगसूत्र सार',
    headingEn: 'Summaries of the four padas',
    introHi:
      'हर पाद में क्या है, सरल हिंदी में, साथ में अंग्रेज़ी सार और उस पाद के मुख्य सूत्र। पूरा पाद पढ़ने के लिए पाद के नाम पर जाएँ।',
    allLinkHi: 'चारों पादों का सार',
    chapters: yogasutraPadaSummaries,
  },
];

export function getChapterSummaryCollection(scriptureId: string): ChapterSummaryCollection | undefined {
  return chapterSummaryCollections.find((c) => c.scriptureId === scriptureId);
}

export function getChapterSummary(scriptureId: string, chapter: number): ChapterSummary | undefined {
  return getChapterSummaryCollection(scriptureId)?.chapters.find((s) => s.chapter === chapter);
}
