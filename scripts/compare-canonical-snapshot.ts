/** Compare two canonical snapshots and fail on identity or source drift. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface Snapshot { sha256: string; scriptureFiles: number; verses: number; files: Array<{ path: string; sha256: string }>; }
const arg = (name: string) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : undefined; };
const file = (name: string) => { const p = arg(name); if (!p) throw new Error(`Missing ${name}`); return JSON.parse(readFileSync(resolve(p), 'utf8')) as Snapshot; };
const main = () => {
  const before = file('--before'); const after = file('--after');
  const bm = new Map((before.files ?? []).map((x) => [x.path, x.sha256])); const am = new Map((after.files ?? []).map((x) => [x.path, x.sha256]));
  const keys = new Set([...bm.keys(), ...am.keys()]);
  const added: string[] = []; const removed: string[] = []; const changed: string[] = [];
  for (const key of [...keys].sort()) {
    if (!bm.has(key)) added.push(key); else if (!am.has(key)) removed.push(key); else if (bm.get(key) !== am.get(key)) changed.push(key);
  }
  const output = { format: 'dharma-granth-canonical-comparison', version: 1, before: { sha256: before.sha256, scriptureFiles: before.scriptureFiles, verses: before.verses }, after: { sha256: after.sha256, scriptureFiles: after.scriptureFiles, verses: after.verses }, added, removed, changed, passed: added.length === 0 && removed.length === 0 && changed.length === 0 };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (!output.passed) process.exitCode = 2;
};
main();
