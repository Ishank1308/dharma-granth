/** Validate that the compressed-source unpacker never accepts stale JSON. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const script = fileURLToPath(new URL('./unpack-data.mjs', import.meta.url));
const cwd = mkdtempSync(join(tmpdir(), 'dharma-packed-data-'));
const folder = join(cwd, 'public/data/scriptures-full');
const json = join(folder, 'sample.json');
const archive = json + '.gz';

function run(...args) {
  const r = spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr || r.stdout || 'unpacker failed');
}
try {
  mkdirSync(folder, { recursive: true });
  const original = '{"chapters":[{"number":8,"verses":[{"number":1}]}]}';
  writeFileSync(archive, gzipSync(Buffer.from(original)));
  run();
  assert.equal(readFileSync(json, 'utf8'), original, 'missing JSON must be generated');

  writeFileSync(json, '{"stale":true}');
  const future = new Date('2040-01-01T00:00:00Z');
  utimesSync(json, future, future);
  run();
  assert.equal(readFileSync(json, 'utf8'), original, 'newer stale JSON must be replaced');

  const past = new Date('2020-01-01T00:00:00Z');
  utimesSync(json, past, past);
  const earlierMtime = statSync(json).mtimeMs;
  run();
  assert.equal(statSync(json).mtimeMs, earlierMtime, 'matching JSON must not be rewritten');

  const updated = '{"chapters":[{"number":8,"verses":[{"number":2}]}]}';
  writeFileSync(archive, gzipSync(Buffer.from(updated)));
  run();
  assert.equal(readFileSync(json, 'utf8'), updated, 'changed archive must win');
  run('--force');
  assert.equal(readFileSync(json, 'utf8'), updated);
  console.log('✓ packed scripture data integrity and idempotence');
} finally {
  rmSync(cwd, { recursive: true, force: true });
}
