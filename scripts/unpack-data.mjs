// Unpack the gzip copies of full-book JSONs that are too big for GitHub.
//
// GitHub rejects files over 100 MB, so a few scriptures-full books are
// committed as <id>.json.gz (see scripts/pack-data.mjs). Every data script and
// the build read the plain <id>.json, so this writes it next to the .gz when
// the JSON does not match the gzip contents. Runs on npm install and before
// each build; `--force` always rewrites.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';

const DIR = resolve(process.cwd(), 'public/data/scriptures-full');
const force = process.argv.includes('--force');

if (existsSync(DIR)) {
  for (const name of readdirSync(DIR).filter((f) => f.endsWith('.json.gz')).sort()) {
    const gz = join(DIR, name);
    const json = gz.slice(0, -3);
    // Timestamps alone can be stale across checkout/cache restores. Always
    // compare actual bytes so a newer but incorrect JSON can never win.
    const decoded = gunzipSync(readFileSync(gz));
    if (!force && existsSync(json) && readFileSync(json).equals(decoded)) continue;
    writeFileSync(json, decoded);
    console.log(`unpacked ${name} -> ${name.slice(0, -3)} (${(statSync(json).size / 1024 / 1024).toFixed(1)} MB)`);
  }
}
