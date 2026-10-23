import assert from 'node:assert/strict';
import {
  createJournalBackup,
  JOURNAL_BACKUP_FORMAT,
  parseJournalBackup,
} from '../lib/study/journal-backup';
import type { JournalEntry } from '../lib/study/types';

const entry: JournalEntry = {
  id: 'journal:test-1',
  title: 'A private reflection',
  body: 'A thought connected with a passage.',
  linkedReferences: [{
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterId: 2,
    verseId: 47,
    canonicalReference: 'भगवद्गीता २.४७ · Bhagavad Gita 2.47',
    sanskritSnippet: 'कर्मण्येवाधिकारस्ते',
    translationSnippet: 'Your right is to action alone.',
  }],
  moodTag: 'contemplative',
  tags: ['svadhyaya'],
  createdAt: '2026-10-23T10:00:00.000Z',
  updatedAt: '2026-10-23T10:05:00.000Z',
  status: 'active',
};

const backup = createJournalBackup([entry], '2026-10-23T10:10:00.000Z');
assert.equal(backup.format, JOURNAL_BACKUP_FORMAT);
assert.equal(backup.schemaVersion, 1);
assert.equal(backup.exportedAt, '2026-10-23T10:10:00.000Z');
assert.deepEqual(parseJournalBackup(JSON.stringify(backup)), [entry]);

const fullStudyV2In = {
  version: 2,
  source: 'dharmagranth.in',
  exportedAt: '2026-10-23T10:10:00.000Z',
  journal: [entry],
  annotations: [{ note: 'must not be imported by journal restore' }],
};
assert.deepEqual(parseJournalBackup(JSON.stringify(fullStudyV2In)), [entry]);

const fullStudyV2Dev = {
  version: 2,
  source: 'dharmagranth.dev',
  exportedAt: '2026-10-23T10:10:00.000Z',
  journal: [entry],
  annotations: [{ note: 'must not be imported by journal restore' }],
};
assert.deepEqual(parseJournalBackup(JSON.stringify(fullStudyV2Dev)), [entry]);

assert.throws(() => parseJournalBackup('{broken'), /valid JSON/);
assert.throws(() => parseJournalBackup(JSON.stringify({ ...backup, schemaVersion: 99 })), /version/);
assert.throws(() => parseJournalBackup(JSON.stringify({
  ...backup,
  entries: [{ ...entry, body: ' ' }],
})), /body/);
assert.throws(() => parseJournalBackup(JSON.stringify({
  ...backup,
  entries: [{ ...entry, linkedReferences: [{ ...entry.linkedReferences[0], chapterId: 0 }] }],
})), /chapterId/);

console.log('Journal backup checks passed: schema, round trip, legacy V2 extraction, and invalid-input rejection.');
