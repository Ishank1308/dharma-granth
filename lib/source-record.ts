/**
 * Reusable source metadata schema (Phase 7): one record describing every
 * layer a verse page can show — original text, translations, commentarial
 * traditions, cross-references, and editorial / research notes.
 *
 * Built from the existing registry (data/sources-registry) plus the page's
 * recorded provenance flags; nothing is invented. Client-safe.
 */

import {
  getScriptureSourceMeta,
  SCRIPTURE_SOURCES,
  type ScriptureSourceMeta,
} from '@/data/sources-registry';

export interface SourceTextRecord {
  kind: 'original';
  /** The Sanskrit edition or archive, as recorded. */
  edition: string;
  archive: string;
  archiveUrl?: string;
  fetched?: string;
  license?: string;
}

export interface TranslationRecord {
  kind: 'translation';
  translator: string;
  hindiIsAi: boolean;
  englishIsAi: boolean;
  review: string;
}

export interface CommentarialTraditionRecord {
  kind: 'commentarial-tradition';
  /** Recorded traditional commentator, or the registry's honest fallback. */
  author: string;
  note: string;
}

export interface CrossReferenceRecord {
  kind: 'cross-reference';
  /** Numbering follows the imported source; variants only when recorded. */
  numberingNote: string;
  variantNote?: string;
}

export interface EditorialNoteRecord {
  kind: 'editorial-note';
  commentaryIsAi: boolean;
  reviewer: string;
  dateReviewed: string;
}

export interface SourceRecord {
  scriptureId: string;
  original: SourceTextRecord;
  translations: TranslationRecord;
  commentarialTraditions: CommentarialTraditionRecord;
  crossReferences: CrossReferenceRecord;
  editorialNotes: EditorialNoteRecord;
}

export interface SourceRecordInput {
  hindiIsAi: boolean;
  englishIsAi: boolean;
  commentaryIsAi: boolean;
  translationReview?: string;
  sourceLicense?: string;
  sourceFetched?: string;
}

export function buildSourceRecord(
  scriptureId: string,
  scriptureTitle: string,
  scriptureTitleSanskrit: string | undefined,
  input: SourceRecordInput,
): SourceRecord {
  const meta: ScriptureSourceMeta = getScriptureSourceMeta(
    scriptureId,
    scriptureTitle,
    scriptureTitleSanskrit,
  );
  return {
    scriptureId,
    original: {
      kind: 'original',
      edition: meta.sanskritEdition,
      archive: meta.publisherArchive,
      archiveUrl: meta.archiveUrl,
      fetched: input.sourceFetched,
      license: input.sourceLicense,
    },
    translations: {
      kind: 'translation',
      translator: meta.primaryTranslator,
      hindiIsAi: input.hindiIsAi,
      englishIsAi: input.englishIsAi,
      review: input.translationReview ?? 'Not yet reviewed',
    },
    commentarialTraditions: {
      kind: 'commentarial-tradition',
      author: meta.traditionalCommentaryAuthor,
      note: meta.numberingSystemNote,
    },
    crossReferences: {
      kind: 'cross-reference',
      numberingNote: meta.numberingSystemNote,
      variantNote: SCRIPTURE_SOURCES[scriptureId]?.alternativeReadingNote,
    },
    editorialNotes: {
      kind: 'editorial-note',
      commentaryIsAi: input.commentaryIsAi,
      reviewer: meta.editorialReviewer,
      dateReviewed: meta.dateReviewed,
    },
  };
}
