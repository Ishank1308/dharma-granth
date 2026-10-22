import assert from 'node:assert/strict';
import { createBackup, restoreBackup, type BackupFile } from '@/lib/backup';

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
storage.setItem('bookmarkedSections', '["gita-2"]');
storage.setItem('unrelated-site-key', 'leave me');

const exported = createBackup(storage);
assert.equal(exported.schemaVersion, 1);
assert.ok(exported.exportedAt);
assert.deepEqual(exported.data, {
  'dharma.japa.count': '12',
  dharmagranth_reflections: '["saved"]',
  bookmarkedSections: '["gita-2"]',
});

const imported: BackupFile = {
  format: 'dharma-granth-backup',
  schemaVersion: 1,
  version: 1,
  exportedAt: new Date().toISOString(),
  data: { 'dharma.japa.count': '20', 'dharmagranth_vows': '["one"]' },
};
assert.equal(restoreBackup(JSON.stringify(imported), 'merge', storage), 2);
assert.equal(storage.getItem('dharma.japa.count'), '20');
assert.equal(storage.getItem('dharmagranth_reflections'), '["saved"]');

assert.equal(restoreBackup(JSON.stringify(imported), 'replace', storage), 2);
assert.equal(storage.getItem('dharmagranth_reflections'), null);
assert.equal(storage.getItem('dharma.japa.count'), '20');
assert.equal(storage.getItem('unrelated-site-key'), 'leave me');

const beforeInvalid = storage.getItem('dharma.japa.count');
assert.throws(() => restoreBackup('{"format":"foreign","version":1,"data":{}}', 'replace', storage));
assert.equal(storage.getItem('dharma.japa.count'), beforeInvalid);
assert.throws(() => restoreBackup(JSON.stringify({ ...imported, data: { 'other-site-secret': 'x' } }), 'merge', storage));

console.log('✓ Backup export, schema validation, merge, replace and invalid-file safety passed.');
