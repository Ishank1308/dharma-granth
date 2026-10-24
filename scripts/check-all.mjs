// Run the read-only content checks concurrently (one tsx process each) and
// report every failure. Same pass/fail contract as the old sequential chain:
// exit 0 only when all checks pass.
//
//   node scripts/check-all.mjs            run every check
//   node scripts/check-all.mjs wisdom     run checks whose script name matches
//
// Concurrency is capped so the data-heavy checks (each parses megabytes of
// scripture JSON) do not exhaust CI runners: 4 workers maximum.
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const TSX = path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');

const CHECKS = [
  'scripts/check-canonical-integrity.ts',
  'scripts/pilot/check-pilot-canonical.ts',
  'scripts/pilot/validate-pilot-records.ts',
  'scripts/check-data.ts',
  'scripts/check-topic-shlokas.ts',
  'scripts/check-filler.ts',
  'scripts/check-wisdom.ts',
  'scripts/check-commentary-quality.ts',
  'scripts/check-published-scriptures.ts',
];

const filters = process.argv.slice(2).map((f) => f.toLowerCase());
const selected = filters.length
  ? CHECKS.filter((c) => filters.some((f) => c.toLowerCase().includes(f)))
  : CHECKS;

if (selected.length === 0) {
  console.error(`check-all: no checks match: ${filters.join(' ')}`);
  process.exit(2);
}

const MAX_WORKERS = Math.max(1, Math.min(4, os.cpus().length));

function run(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [TSX, script], { stdio: 'inherit' });
    child.on('error', (err) => resolve({ script, code: 1, error: String(err) }));
    child.on('close', (code) => resolve({ script, code: code ?? 1 }));
  });
}

const started = Date.now();
const queue = [...selected];
const results = [];
async function worker() {
  while (queue.length > 0) {
    const script = queue.shift();
    results.push(await run(script));
  }
}
await Promise.all(Array.from({ length: Math.min(MAX_WORKERS, selected.length) }, worker));

const failed = results.filter((r) => r.code !== 0);
const seconds = ((Date.now() - started) / 1000).toFixed(1);
if (failed.length > 0) {
  console.error(`\ncheck-all: ${failed.length} of ${results.length} check(s) failed in ${seconds}s:`);
  for (const f of failed) console.error(`  ✗ ${f.script} (exit ${f.code})${f.error ? `: ${f.error}` : ''}`);
  process.exit(1);
}
console.log(`\ncheck-all: all ${results.length} checks passed in ${seconds}s.`);
