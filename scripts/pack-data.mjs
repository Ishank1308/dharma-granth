// Write the gzip copy of a full-book JSON that is too big for GitHub (100 MB).
//
//   node scripts/pack-data.mjs mahabharata
//
// Commit public/data/scriptures-full/<id>.json.gz; the plain <id>.json is
// git-ignored and rebuilt by scripts/unpack-data.mjs. The output is
// deterministic (no timestamp in the gzip header), so an unchanged book gives
// an unchanged .gz.
import { readFileSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { constants, gzipSync } from 'node:zlib';

const DIR = resolve(process.cwd(), 'public/data/scriptures-full');
const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error('usage: node scripts/pack-data.mjs <scripture-id> [...]');
  process.exit(1);
}
for (const id of ids) {
  const json = join(DIR, `${id}.json`);
  const gz = `${json}.gz`;
  writeFileSync(gz, gzipSync(readFileSync(json), { level: constants.Z_BEST_COMPRESSION }));
  // Keep the JSON at least as new as its .gz so unpack-data does not rewrite it.
  const now = new Date();
  utimesSync(json, now, now);
  const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1);
  console.log(`packed ${id}.json (${mb(json)} MB) -> ${id}.json.gz (${mb(gz)} MB)`);
}
