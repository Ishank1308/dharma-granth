/** Device-local study records. No account or network identity is stored here. */
export type StudyRecordKind = 'bookmark' | 'note' | 'highlight' | 'reading';

export interface CanonicalVerseRef {
  scriptureId: string;
  chapterId: string;
  verseId: string;
}

export interface StudyRecord {
  id: string;
  kind: StudyRecordKind;
  ref: CanonicalVerseRef;
  text?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyArchive {
  format: 'dharma-private-study';
  version: 1;
  exportedAt: string;
  records: StudyRecord[];
}
