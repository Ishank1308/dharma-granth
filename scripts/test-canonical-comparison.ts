import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'dharma-canonical-'));
const make = (name: string, sha: string) => writeFileSync(join(dir, name), JSON.stringify({ sha256: sha, scriptureFiles: 1, verses: 1, files: [{ path: 'x', sha256: sha }] }));
try {
  make('same-a.json', 'a'); make('same-b.json', 'a');
  const same = JSON.parse(readFileSync(join(dir, 'same-a.json'), 'utf8'));
  assert.equal(same.sha256, 'a');
  make('changed.json', 'b');
  const changed = JSON.parse(readFileSync(join(dir, 'changed.json'), 'utf8'));
  assert.notEqual(same.files[0].sha256, changed.files[0].sha256);
  console.log('Canonical comparison fixture checks passed.');
} finally { rmSync(dir, { recursive: true, force: true }); }
