/**
 * Personal Study System Type Definitions for Dharma Granth (dharmagranth.dev)
 * 
 * 100% Client-Side, Local-First, Zero-Account, Privacy-Sovereign Data Models.
 * Personal annotations, journal entries, and collections are strictly isolated
 * from canonical scripture data.
 */

export type PersonalRecordStatus = 'active' | 'archived';

export interface PersonalStudyReference {
  scriptureId: string;
  scriptureTitle?: string;
  chapterId: number;
  verseId: string | number;
  canonicalReference: string; // e.g. "भगवद्गीता २.४७ · Bhagavad Gita 2.47"
  sanskritSnippet?: string;
  translationSnippet?: string;
}

export interface PersonalAnnotation {
  id: string; // "anno:scripture:chapter:verse:uuid"
  reference: PersonalStudyReference;
  note: string;
  tags: string[];
  color?: 'saffron' | 'amber' | 'rose' | 'emerald' | 'indigo';
  highlightSpan?: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
  status: PersonalRecordStatus;
}

export type JournalMood =
  | 'peaceful'       // शांत
  | 'contemplative'  // विचारशील / मनन
  | 'restless'       // अशांत / व्यथित
  | 'seeking'        // जिज्ञासु / मुमुक्षु
  | 'grateful'       // कृतज्ञ
  | 'grief';         // शोक / विछोह

export interface JournalEntry {
  id: string; // "journal:uuid"
  title: string;
  body: string; // Markdown supported
  linkedReferences: PersonalStudyReference[];
  moodTag?: JournalMood;
  tags: string[];
  createdAt: string; // ISO 8601
  updatedAt: string;
  status: PersonalRecordStatus;
}

export interface SavedVerse {
  id: string; // "saved:scripture:chapter:verse"
  reference: PersonalStudyReference;
  collectionIds: string[];
  savedAt: string; // ISO 8601
  personalNote?: string;
}

export interface PersonalCollection {
  id: string;
  name: string;
  nameHi?: string;
  description?: string;
  colourToken: string; // Tailwind/CSS color or gradient token
  icon?: string;
  isBuiltin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReadingHistoryEntry {
  id: string; // "hist:scripture:chapter:timestamp"
  reference: PersonalStudyReference;
  visitedAt: string;
  progressPercent: number; // 0 to 100
  timeSpentSeconds: number;
}

export interface ReadingPosition {
  scriptureId: string;
  chapterId: number;
  verseId: string | number;
  scrollAnchor?: string;
  percentage: number;
  updatedAt: string;
}

export interface OfflineReadingPack {
  id: string; // e.g. "pack-gita-complete"
  title: string;
  titleHi: string;
  scriptureIds: string[];
  description: string;
  totalVerses: number;
  estimatedBytes: number;
  downloadedAt?: string;
  versionHash: string;
  isComplete: boolean;
}

export interface DharmaStudyBackupV2 {
  version: 2;
  exportedAt: string;
  source: 'dharmagranth.dev' | 'dharmagranth.in';
  stats: {
    journalCount: number;
    annotationCount: number;
    savedVerseCount: number;
    collectionCount: number;
    historyCount: number;
  };
  collections: PersonalCollection[];
  savedVerses: SavedVerse[];
  annotations: PersonalAnnotation[];
  journal: JournalEntry[];
  readingHistory: ReadingHistoryEntry[];
  readingPositions: ReadingPosition[];
  preferences: Record<string, string>;
}
