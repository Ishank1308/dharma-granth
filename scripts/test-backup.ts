import assert from 'node:assert/strict';
import { clearOwnData, createBackup, restoreBackup, type BackupFile } from '@/lib/backup';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, String(value)); }
}

const storage = new MemoryStorage();
storage.setItem('dharma.japa.count', '12');
storage.setItem('dharmagranth_reflections', '["saved"]');
storage.setItem('dharmagranth:note:bhagavadgita:2:47', 'Act without clinging to results.');
storage.setItem('bookmarkedSections', '["gita-2"]');
storage.setItem('unrelated-site-key', 'leave me');

const exported = createBackup(storage);
assert.equal(exported.schemaVersion, 1);
assert.ok(exported.exportedAt);
assert.deepEqual(exported.data, {
  'dharma.japa.count': '12',
  dharmagranth_reflections: '["saved"]',
  'dharmagranth:note:bhagavadgita:2:47': 'Act without clinging to results.',
  bookmarkedSections: '["gita-2"]',
});

const imported: BackupFile = {
  format: 'dharma-granth-backup',
  schemaVersion: 1,
  version: 1,
  exportedAt: new Date().toISOString(),
  data: {
    'dharma.japa.count': '20',
    'dharmagranth_vows': '["one"]',
    'dharmagranth:practice:bhagavadgita:2:47': '{"completedDate":"2026-11-23"}',
  },
};
assert.equal(restoreBackup(JSON.stringify(imported), 'merge', storage), 3);
assert.equal(storage.getItem('dharma.japa.count'), '20');
assert.equal(storage.getItem('dharmagranth_reflections'), '["saved"]');
assert.equal(storage.getItem('dharmagranth:note:bhagavadgita:2:47'), 'Act without clinging to results.');
assert.equal(storage.getItem('dharmagranth:practice:bhagavadgita:2:47'), '{"completedDate":"2026-11-23"}');

assert.equal(restoreBackup(JSON.stringify(imported), 'replace', storage), 3);
assert.equal(storage.getItem('dharmagranth_reflections'), null);
assert.equal(storage.getItem('dharmagranth:note:bhagavadgita:2:47'), null);
assert.equal(storage.getItem('dharma.japa.count'), '20');
assert.equal(storage.getItem('unrelated-site-key'), 'leave me');

assert.equal(clearOwnData(storage), 3);
assert.equal(storage.getItem('dharmagranth:practice:bhagavadgita:2:47'), null);
assert.equal(storage.getItem('unrelated-site-key'), 'leave me');
restoreBackup(JSON.stringify(imported), 'merge', storage);

const beforeInvalid = storage.getItem('dharma.japa.count');
assert.throws(() => restoreBackup('{"format":"foreign","version":1,"data":{}}', 'replace', storage));
assert.equal(storage.getItem('dharma.japa.count'), beforeInvalid);
assert.throws(() => restoreBackup(JSON.stringify({ ...imported, data: { 'other-site-secret': 'x' } }), 'merge', storage));

// A stored credential is never exported, and an older backup that carries one restores without it.
storage.setItem('dharma_muse_spark_key', 'sk-not-a-real-key');
assert.equal('dharma_muse_spark_key' in createBackup(storage).data, false);
storage.removeItem('dharma_muse_spark_key');
const withCredential = { ...imported, data: { 'dharma.japa.count': '21', dharma_muse_spark_key: 'sk-not-a-real-key' } };
assert.equal(restoreBackup(JSON.stringify(withCredential), 'merge', storage), 1);
assert.equal(storage.getItem('dharma.japa.count'), '21');
assert.equal(storage.getItem('dharma_muse_spark_key'), null);

console.log('✓ Backup export, schema validation, merge, replace, credential exclusion and invalid-file safety passed.');
