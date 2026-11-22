/** Shapes of the Learn data that scripts/build-learn.mjs bundles from the website. */
import type { Msg } from '@/i18n/strings';

export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface PlainVerse {
  sanskrit: string;
  translit: string;
  en: string;
  ref: string;
}

export interface MindNode {
  id: string;
  label: string;
  sanskrit: string;
  description: string;
  children: MindNode[];
}

export interface Course {
  id: string;
  title: string;
  sanskrit: string;
  subtitle: string;
  objective: string;
  level: Level;
  levelLabel: string;
  minutes: number;
  icon: string;
  hue: string;
  overview: {
    mangal: { sanskrit: string; translit: string; meaning: string; source: string };
    premise: string;
    context: string;
    prerequisites: string;
    method: string;
    outcomes: string[];
  };
  lessons: {
    id: string;
    title: string;
    sanskrit: string;
    description: string;
    minutes: number;
    href: string;
    verse: PlainVerse | null;
    concepts: string[];
  }[];
  concepts: { id: string; term: string; sanskrit: string; translit: string; definition: string; context: string; anchor: string }[];
  scriptures: { id: string; title: string; sanskrit: string; description: string; href: string }[];
  flashcards: { sanskrit: string; translit: string; question: string; hi: string; en: string; note: string }[];
  slides: { id: string; sanskrit: string; translit: string; hi: string; en: string; explanation: string; keywords: string[] }[];
  mindmap: MindNode;
  timeline: { id: string; year: string; title: string; description: string; sanskrit: string }[];
  revision: {
    cadence: string;
    today: string[];
    verses: (PlainVerse & { key: string })[];
    reflection: { title: string; sanskritFocus: string; prompt: string; practicalApplication: string };
    checklist: string[];
  };
}

export interface JourneyLesson {
  id: string;
  scriptureId: string;
  chapter: number;
  verse: string;
  ref: Msg;
  /** The verse as the library prints it; null only if the bundled text lacks it. */
  text: { sanskrit: string; translit: string; hi: string; en: string } | null;
  context: string;
  explanation: string;
  reflection: string;
  activity: string;
}

export interface Journey {
  id: string;
  title: Msg;
  objective: string;
  audience: string;
  minutes: number;
  curator: string;
  reviewedOn: string | null;
  review: string;
  category: 'foundations' | 'yoga' | 'life' | 'healing';
  level: Level;
  icon: string;
  sources: string[];
  lessons: JourneyLesson[];
}

export interface GitaShatka {
  id: 'karma' | 'bhakti' | 'jnana';
  name: Msg;
  mahavakya: string;
  theme: Msg;
  range: string;
  description: Msg;
}

export interface GitaChapter {
  chapter: number;
  title: Msg;
  sanskrit: string;
  translit: string;
  shatka: GitaShatka['id'];
  verses: number;
  dilemma: Msg;
  crisis: Msg;
  counsel: Msg;
  keyVerse: { ref: string; verse: number; sanskrit: string; translit: string; meaning: Msg };
  life: Msg;
  tag: Msg;
}

export interface DailyItem {
  id: string;
  scriptureId: string;
  scripture: Msg;
  chapter: number;
  chapterTitle: string;
  verse: string;
  sanskrit: string;
  translit: string;
  meter: string;
  meaning: Msg;
  words: { word: string; meaning: string }[];
  teaching: Msg;
  reflection: Msg;
  challenge: Msg;
  theme: string;
}

export interface Faq {
  id: string;
  category: string;
  question: Msg;
  answer: Msg;
  refs: string[];
  reviewer: string;
  reviewed: string;
}

export interface Recommendation {
  kind: string;
  kindHi: string;
  id: string;
  title: Msg;
  summary: string;
  href: string;
  reason: string;
}

export interface LearnData {
  courses: { items: Course[] };
  journeys: { items: Journey[] };
  gita: { shatkas: GitaShatka[]; items: GitaChapter[] };
  daily: { items: DailyItem[] };
  faq: { categories: ({ key: string } & Msg)[]; items: Faq[] };
  discover: {
    questions: { key: string; question: Msg; options: { value: string; label: Msg; icon: string }[] }[];
    /** The questions whose answers change the recommendations, in table-key order. */
    keys: string[];
    recs: Recommendation[];
    summaries: string[];
    /** "practical|duty|new|5" -> five indexes into recs, then one into summaries. */
    table: Record<string, number[]>;
  };
}
