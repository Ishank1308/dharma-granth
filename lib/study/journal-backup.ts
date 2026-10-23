import type { JournalEntry, JournalMood, PersonalStudyReference } from './types';

export const JOURNAL_BACKUP_FORMAT = 'dharma-granth-journal-backup';
export const JOURNAL_BACKUP_SCHEMA_VERSION = 1 as const;
const MAX_ENTRIES = 10_000;
const MAX_ENTRY_TEXT = 250_000;
const MAX_TAGS = 100;
const MAX_REFERENCES = 50;

export interface JournalBackupFile {
  format: typeof JOURNAL_BACKUP_FORMAT;
  schemaVersion: typeof JOURNAL_BACKUP_SCHEMA_VERSION;
  exportedAt: string;
  entries: JournalEntry[];
}

export type JournalRestoreMode = 'merge' | 'replace';

const MOODS = new Set<JournalMood>([
  'peaceful',
  'contemplative',
  'restless',
  'seeking',
  'grateful',
  'grief',
]);

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function boundedString(value: unknown, max: number, field: string, allowEmpty = true): string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim())) {
    throw new Error(`Invalid journal backup: ${field}`);
  }
  return value;
}

function timestamp(value: unknown, field: string): string {
  const result = boundedString(value, 64, field, false);
  if (Number.isNaN(Date.parse(result))) throw new Error(`Invalid journal backup: ${field}`);
  return result;
}

function parseReference(value: unknown): PersonalStudyReference {
  const ref = record(value);
  if (!ref) throw new Error('Invalid journal backup: reference');
  const scriptureId = boundedString(ref.scriptureId, 120, 'scriptureId', false);
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(scriptureId)) throw new Error('Invalid journal backup: scriptureId');
  if (!Number.isSafeInteger(ref.chapterId) || Number(ref.chapterId) < 1 || Number(ref.chapterId) > 100_000) {
    throw new Error('Invalid journal backup: chapterId');
  }
  const verseId = typeof ref.verseId === 'number'
    ? Number.isSafeInteger(ref.verseId) && ref.verseId > 0 ? ref.verseId : null
    : typeof ref.verseId === 'string' && ref.verseId.length <= 32 && ref.verseId.trim() ? ref.verseId : null;
  if (verseId === null) throw new Error('Invalid journal backup: verseId');

  const result: PersonalStudyReference = {
    scriptureId,
    chapterId: Number(ref.chapterId),
    verseId,
    canonicalReference: boundedString(ref.canonicalReference, 300, 'canonicalReference', false),
  };
  if (ref.scriptureTitle !== undefined) result.scriptureTitle = boundedString(ref.scriptureTitle, 200, 'scriptureTitle');
  if (ref.sanskritSnippet !== undefined) result.sanskritSnippet = boundedString(ref.sanskritSnippet, 2_000, 'sanskritSnippet');
  if (ref.translationSnippet !== undefined) result.translationSnippet = boundedString(ref.translationSnippet, 2_000, 'translationSnippet');
  return result;
}

function parseEntry(value: unknown): JournalEntry {
  const entry = record(value);
  if (!entry) throw new Error('Invalid journal backup: entry');
  const id = boundedString(entry.id, 200, 'entry id', false);
  const title = boundedString(entry.title, 500, 'title');
  const body = boundedString(entry.body, MAX_ENTRY_TEXT, 'body', false);
  const createdAt = timestamp(entry.createdAt, 'createdAt');
  const updatedAt = timestamp(entry.updatedAt ?? entry.createdAt, 'updatedAt');
  const status = entry.status === undefined ? 'active' : entry.status;
  if (status !== 'active' && status !== 'archived') throw new Error('Invalid journal backup: status');

  const rawTags = entry.tags === undefined ? [] : entry.tags;
  if (!Array.isArray(rawTags) || rawTags.length > MAX_TAGS) throw new Error('Invalid journal backup: tags');
  const tags = rawTags.map((tag) => boundedString(tag, 100, 'tag', false));

  const rawReferences = entry.linkedReferences === undefined ? [] : entry.linkedReferences;
  if (!Array.isArray(rawReferences) || rawReferences.length > MAX_REFERENCES) {
    throw new Error('Invalid journal backup: linkedReferences');
  }
  const linkedReferences = rawReferences.map(parseReference);

  const result: JournalEntry = {
    id,
    title,
    body,
    linkedReferences,
    tags,
    createdAt,
    updatedAt,
    status,
  };
  if (entry.moodTag !== undefined) {
    if (typeof entry.moodTag !== 'string' || !MOODS.has(entry.moodTag as JournalMood)) {
      throw new Error('Invalid journal backup: moodTag');
    }
    result.moodTag = entry.moodTag as JournalMood;
  }
  return result;
}

export function createJournalBackup(
  entries: readonly JournalEntry[],
  exportedAt = new Date().toISOString(),
): JournalBackupFile {
  if (entries.length > MAX_ENTRIES) throw new Error('Journal contains too many entries to export');
  const checkedExportTime = timestamp(exportedAt, 'exportedAt');
  return {
    format: JOURNAL_BACKUP_FORMAT,
    schemaVersion: JOURNAL_BACKUP_SCHEMA_VERSION,
    exportedAt: checkedExportTime,
    entries: entries.map(parseEntry),
  };
}

/** Reads this journal's format and the earlier full-study V2 backup format. */
export function parseJournalBackup(raw: string): JournalEntry[] {
  if (raw.length > 10 * 1024 * 1024) throw new Error('Journal backup file is too large');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Journal backup file is not valid JSON');
  }
  const file = record(parsed);
  if (!file) throw new Error('Not a Dharma Granth journal backup');

  let entries: unknown;
  if (file.format === JOURNAL_BACKUP_FORMAT) {
    if (file.schemaVersion !== JOURNAL_BACKUP_SCHEMA_VERSION) {
      throw new Error('Unsupported Dharma Granth journal backup version');
    }
    timestamp(file.exportedAt, 'exportedAt');
    entries = file.entries;
  } else if (file.version === 2 && (file.source === 'dharmagranth.in' || file.source === 'dharmagranth.dev')) {
    // Full Study V2 exports predate the journal-only file; restore just their journal records.
    entries = file.journal;
  } else {
    throw new Error('Not a supported Dharma Granth journal backup');
  }

  if (!Array.isArray(entries) || entries.length > MAX_ENTRIES) {
    throw new Error('Invalid journal backup: entries');
  }
  return entries.map(parseEntry);
}
