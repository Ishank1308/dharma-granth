/**
 * Fails when a protected canonical field of any pilot unit differs from the stored snapshot.
 *
 *   npx tsx scripts/pilot/check-pilot-canonical.ts
 *
 * Run before editorial work, after every batch, and as part of `npm run check`. It never updates the snapshot.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadUnit, sha256, type PilotUnit } from './lib';

const set = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/pilot/pilot-set.json'), 'utf8')) as { units: PilotUnit[] };
const baselinePath = path.join(ROOT, 'data/pilot/pilot-baseline.json');
if (!fs.existsSync(baselinePath)) {
  console.error('✗ data/pilot/pilot-baseline.json is missing. Run scripts/pilot/build-pilot-baseline.ts first.');
  process.exit(1);
}
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as { units: { id: string; sha256: string | null; baselineStatus: string }[] };
const byId = new Map(baseline.units.map((u) => [u.id, u]));

const problems: string[] = [];
for (const u of set.units) {
  const snap = byId.get(u.id);
  if (!snap) {
    problems.push(`${u.id}: not in the baseline snapshot`);
    continue;
  }
  const loaded = loadUnit(u);
  const now = loaded.protectedFields ? sha256(loaded.protectedFields) : null;
  if (now !== snap.sha256) problems.push(`${u.id}: protected canonical fields changed (${snap.sha256?.slice(0, 8) ?? 'none'} → ${now?.slice(0, 8) ?? 'none'})`);
}
for (const id of byId.keys()) if (!set.units.some((u) => u.id === id)) problems.push(`${id}: in the snapshot but not in the pilot set`);

if (problems.length) {
  console.error(`✗ Pilot canonical check failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ Pilot canonical check passed (${set.units.length} units; protected fields match the snapshot).`);
