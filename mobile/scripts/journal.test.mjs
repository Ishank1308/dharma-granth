// Journal and verse collections (src/lib/journal.ts), and their place in the backup file. Run with `npm test`.
import assert from 'node:assert/strict';
import test from 'node:test';

import { makeBackup, parseBackup, DEFAULT_SETTINGS } from '../src/lib/backup.ts';
import {
  allCollections,
  collectionCounts,
  collectionOf,
  createCollection,
  deleteCollection,
  EMPTY_JOURNAL,
  entriesForVerse,
  filterEntries,
  mergeJournal,
  moveVerse,
  normalizeJournal,
  renameCollection,
  saveEntry,
} from '../src/lib/journal.ts';

const gita = { id: 'bhagavadgita', chapter: 2, verse: '47' };

test('a reflection is saved, edited in place and found by verse, mood and text', () => {
  const first = saveEntry(EMPTY_JOURNAL, { title: 'Action', body: 'Do the work, let go of the fruit.', mood: 'seeking', refs: [gita], tags: '#karma, Work, karma' }, undefined, new Date('2026-11-21T10:00:00Z'));
  assert.ok(first.id);
  const [entry] = first.data.entries;
  assert.deepEqual(entry.tags, ['karma', 'Work']);
  assert.equal(entriesForVerse(first.data, gita).length, 1);

  const edited = saveEntry(first.data, { title: 'Action', body: 'Edited', mood: 'peaceful', refs: [gita], tags: [] }, first.id, new Date('2026-11-22T10:00:00Z'));
  assert.equal(edited.data.entries.length, 1);
  assert.equal(edited.data.entries[0].createdAt, entry.createdAt);
  assert.equal(edited.data.entries[0].updatedAt, '2026-11-22T10:00:00.000Z');

  assert.equal(filterEntries(edited.data.entries, { mood: 'peaceful' }).length, 1);
  assert.equal(filterEntries(edited.data.entries, { mood: 'grief' }).length, 0);
  assert.equal(filterEntries(edited.data.entries, { query: 'EDIT' }).length, 1);
});

test('an empty draft is not saved', () => {
  const res = saveEntry(EMPTY_JOURNAL, { title: '  ', body: '\n', refs: [], tags: [] });
  assert.equal(res.id, undefined);
  assert.equal(res.data.entries.length, 0);
});

test('collections: built-ins always exist, custom ones can be made, renamed and deleted without losing verses', () => {
  assert.equal(allCollections(EMPTY_JOURNAL).length, 5);
  assert.equal(collectionOf(EMPTY_JOURNAL, gita), 'read-later');
  assert.equal(createCollection(EMPTY_JOURNAL, 'Favourites').error, 'taken');
  assert.equal(createCollection(EMPTY_JOURNAL, 'पसंदीदा').error, 'taken');
  assert.equal(createCollection(EMPTY_JOURNAL, '   ').error, 'empty');

  const made = createCollection(EMPTY_JOURNAL, 'Morning verses', 1);
  assert.ok(made.id);
  let data = moveVerse(made.data, gita, made.id);
  assert.equal(collectionOf(data, gita), made.id);
  assert.deepEqual(collectionCounts(data, [gita, { id: 'katha', chapter: 1, verse: '1.3.14' }]), { [made.id]: 1, 'read-later': 1 });

  assert.equal(renameCollection(data, 'favourites', 'X').error, 'builtin');
  data = renameCollection(data, made.id, 'Dawn').data;
  assert.equal(data.collections[0].name, 'Dawn');

  data = deleteCollection(data, made.id).data;
  assert.equal(collectionOf(data, gita), 'read-later');
  assert.deepEqual(data.assign, {});
});

test('normalising drops junk and keeps what is valid', () => {
  const data = normalizeJournal({
    entries: [{ id: 'a', title: 'ok', body: '', refs: [gita, gita, { id: '' }], mood: 'bogus' }, { id: 'b' }, null, { title: 'no id' }],
    collections: [{ id: 'favourites', name: 'dup of built-in' }, { id: 'ok-1', name: ' Mine ' }, { id: 'BAD ID', name: 'x' }],
    assign: { 'bhagavadgita:2:47': 'ok-1', 'katha:1:1.3.14': 'gone', 'x:1:1': 'read-later' },
  });
  assert.equal(data.entries.length, 1);
  assert.equal(data.entries[0].refs.length, 1);
  assert.equal(data.entries[0].mood, undefined);
  assert.deepEqual(data.collections, [{ id: 'ok-1', name: 'Mine', builtin: false }]);
  assert.deepEqual(data.assign, { 'bhagavadgita:2:47': 'ok-1' });
  assert.deepEqual(normalizeJournal('nonsense'), { entries: [], collections: [], assign: {} });
});

test('restoring a backup merges journals and loses nothing', () => {
  const mine = normalizeJournal({
    entries: [{ id: 'e1', title: 'Mine', body: 'x', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-05T00:00:00Z' }],
    collections: [{ id: 'dawn-1', name: 'Dawn' }],
    assign: { 'bhagavadgita:2:47': 'dawn-1' },
  });
  const theirs = normalizeJournal({
    entries: [
      { id: 'e1', title: 'Older copy', body: 'y', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z' },
      { id: 'e2', title: 'New', body: 'z', createdAt: '2026-02-01T00:00:00Z' },
    ],
    collections: [{ id: 'dawn-2', name: 'dawn' }, { id: 'night-1', name: 'Night' }],
    assign: { 'bhagavadgita:2:47': 'night-1', 'katha:1:1.3.14': 'dawn-2' },
  });
  const merged = mergeJournal(mine, theirs);
  assert.deepEqual(merged.entries.map((e) => e.title), ['New', 'Mine']);
  assert.deepEqual(merged.collections.map((c) => c.id), ['dawn-1', 'night-1']);
  // Already sorted on this phone: stays. Sorted into a same-named collection: folded into ours.
  assert.equal(merged.assign['bhagavadgita:2:47'], 'dawn-1');
  assert.equal(merged.assign['katha:1:1.3.14'], 'dawn-1');
});

test('the journal travels in the backup file, and older backups without it still read', () => {
  const journal = saveEntry(EMPTY_JOURNAL, { title: 'T', body: 'B', refs: [gita], tags: [] }).data;
  const file = makeBackup({ settings: DEFAULT_SETTINGS, bookmarks: [], lastRead: null }, new Date(), { journal });
  const parsed = parseBackup(JSON.stringify(file));
  assert.equal(normalizeJournal(parsed.journal).entries.length, 1);

  const old = makeBackup({ settings: DEFAULT_SETTINGS, bookmarks: [], lastRead: null });
  assert.equal(parseBackup(JSON.stringify(old)).journal, undefined);
});
