/**
 * Shapes of the knowledge pages bundled by scripts/build-knowledge.mjs from the website's data/*.ts.
 * The website writes some of this content in one language only: concept summaries are Hindi; the
 * dictionary, characters and places are English; timelines are mostly Hindi. Where both exist the
 * field is a { en, hi } pair and the app shows the reader's language.
 */
import type { Msg } from '@/i18n/strings';

export interface KCategory {
  key: string;
  en: string;
  hi: string;
  sanskrit?: string;
  /** Colour family from the website's gradient (blue, emerald, saffron…), mapped to the app's hues. */
  hue?: string;
  icon?: string;
  note?: string;
}

export interface KVerse {
  sanskrit: string;
  translit: string;
  en: string;
  hi?: string;
  ref: string | Msg;
  scriptureId?: string;
  chapter?: number;
  verse?: number | string;
}

export interface Concept {
  id: string;
  label: string;
  sanskrit: string;
  translit: string;
  category: string;
  short: Msg;
  descriptionHi: string;
  connections: string[];
  detail: {
    derivation: { root: string; rootMeaning: string; rootMeaningHi: string; etymologyEn: string; etymologyHi: string };
    contextual: { context: string; contextHi: string; meaningEn: string; meaningHi: string }[];
    traditions: { tradition: string; traditionHi: string; viewEn: string; viewHi: string }[];
    misunderstandings: { myth: string; mythHi: string; correction: string; correctionHi: string }[];
    sources: string[];
  } | null;
  verses: KVerse[];
}

export interface Term {
  id: string;
  term: string;
  sanskrit: string;
  translit: string;
  category: string;
  short: string;
  definition: string;
  etymology: string;
  keyTexts: string[];
  related: string[];
  crossTradition: { tradition: string; view: string }[];
  verses: KVerse[];
}

export interface Character {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  icon: string;
  hue: string;
  short: string;
  biography: string;
  relations: { name: string; relation: string; characterId?: string }[];
  events: { title: string; description: string }[];
  dialogues: { speaker: string; context: string; text: string; reference: string }[];
  dilemmas: { title: string; description: string; resolution: string }[];
  verses: KVerse[];
  interpretations: { tradition: string; view: string }[];
}

export interface Place {
  id: string;
  name: string;
  sanskrit: string;
  category: string;
  icon: string;
  hue: string;
  short: string;
  description: string;
  significance: string;
  associations: string[];
  identifications: { traditional: string; presentDay: string; debated?: string; symbolic?: string };
  coordinates: { lat: number; lng: number };
  presentDay: string;
}

export interface Timeline {
  id: string;
  title: string;
  sanskrit: string;
  description: string;
  category: string;
  events: {
    id: string;
    title: string;
    sanskrit: string;
    date: string;
    description: string;
    significance: string;
    texts: string[];
    figures: string[];
  }[];
}

export interface WisdomVerse {
  id: string;
  scriptureId: string;
  scripture: Msg;
  chapter: number;
  verse: number | string;
  ref: Msg;
  sanskrit: string;
  translit: string;
  meaning: Msg;
  speaker: string;
  addressee: string;
  setting: Msg;
  note: Msg;
}

export interface WisdomTopic {
  id: string;
  title: Msg;
  sanskrit: string;
  category: string;
  accent: string;
  short: Msg;
  keywords: string[];
  minutes: number;
  intro: { lead: Msg; body: Msg; foundation: Msg };
  verses: WisdomVerse[];
  context: { title: Msg; body: Msg };
  reflections: { title: Msg; insight: Msg; prompt: Msg; practice: Msg }[];
  concepts: { id: string | null; label: Msg; sanskrit: string; description: Msg }[];
  scriptures: { id: string; title: Msg; sanskrit: string }[];
  sources: string[];
  care: { headline: Msg; body: Msg; disclaimer: Msg };
}

/** A verse a pathway reads, from a validated Wisdom for life topic: always the whole shloka. */
export interface PathwayVerse {
  scriptureId: string;
  chapter: number;
  verse: number | string;
  ref: Msg;
  sanskrit: string;
  translit: string;
  meaning: Msg;
}

export interface WisdomPathway {
  id: string;
  title: Msg;
  sanskrit: string;
  question: Msg;
  /** Whose teaching the pathway follows (English only on the website). */
  masters: string;
  minutes: number;
  intro: Msg;
  why: Msg;
  foundations: Msg;
  lenses: { topic: string; verse: PathwayVerse; arth: Msg; vyakhya: Msg; modern: Msg; lineage: string[] }[];
  lineage: string[];
  sageNote: Msg;
  reflections: Msg[];
  contemplations: Msg[];
  related: string[];
  /** Concept pages in the app this pathway touches. */
  concepts: string[];
}

export interface LineageMaster {
  id: string;
  name: Msg;
  kind: Msg;
  era: string;
  tradition: string;
  teaching: Msg;
}

/** A life-question entrance; with a pathway it walks that pathway in stages (indexes into its lenses etc.). */
export interface PathwayStarter {
  id: string;
  title: Msg;
  question: Msg;
  intro: Msg;
  pathway: string | null;
  stages: { title: Msg; focus: Msg; lenses: number[]; reflections: number[]; contemplations: number[] }[];
  /** Wisdom for life topics to begin from while no pathway exists yet. */
  topics: string[];
}

export interface PathwaysData extends KSet<WisdomPathway> {
  masters: Record<string, LineageMaster>;
  starters: PathwayStarter[];
  discovery: { key: string; label: Msg; entries: { label: Msg; pathway: string }[] }[];
}

export type RelationshipType = 'supporting' | 'parallel' | 'contrasting' | 'cross_scripture' | 'concept_connection';

export interface NetworkNode {
  id: string;
  type: RelationshipType;
  label: string;
  labelHi: string;
  scripture: string;
  scriptureSa: string;
  sanskrit: string;
  translation: string;
  /** Why the two are linked (English on the website). */
  reason: string;
  /** Where the verse is in the library, when the link names one verse. */
  target: { id: string; chapter: number; verse: number | string } | null;
  /** A concept page in the app. */
  concept: string | null;
}

export interface NetworkSeed {
  id: string;
  target: { id: string; chapter: number; verse: number | string };
  scripture: Msg;
  ref: string;
  theme: Msg;
  sanskrit: string;
  translation: string;
  description: string;
  nodes: NetworkNode[];
}

export interface KSet<T> {
  categories: KCategory[];
  items: T[];
}

export interface KnowledgeData {
  concepts: KSet<Concept>;
  dictionary: KSet<Term>;
  characters: KSet<Character>;
  places: KSet<Place>;
  timelines: KSet<Timeline>;
  wisdom: KSet<WisdomTopic>;
  pathways: PathwaysData;
  network: KSet<NetworkSeed>;
}

export type KnowledgeKind = Exclude<keyof KnowledgeData, 'wisdom' | 'pathways' | 'network'>;
