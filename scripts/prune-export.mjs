// Remove files from the static export that no deployed page needs, then check
// the result against Cloudflare Pages' deployment limits. Run after
// `next build` (postbuild), after check-export.
//
// dist/data/scriptures-full/ (~400 MB) holds the full-book JSONs and the
// per-chapter shards. Chapter pages carry their verses in the HTML (read at
// build time from public/data/scriptures-full), so:
//   • full-book JSONs are never fetched by the browser → removed;
//   • a chapter's shard is removed when its page already carries its verses,
//     and kept for the few giant chapters that still load client-side.
// The copies in public/ stay: the build and the data scripts read them.
import { appendFileSync, existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const DATA = join(DIST, 'data/scriptures-full');

function sizeOf(path) {
  const st = statSync(path);
  if (!st.isDirectory()) return st.size;
  return readdirSync(path).reduce((sum, name) => sum + sizeOf(join(path, name)), 0);
}

function remove(path) {
  const bytes = sizeOf(path);
  rmSync(path, { recursive: true, force: true });
  return bytes;
}

let freed = 0;
let kept = 0;

// Content hashes for the verse-image cache. Not a page asset.
const verseStamps = join(DIST, 'og/verse/_stamps.json');
if (existsSync(verseStamps)) freed += remove(verseStamps);
if (existsSync(DATA)) {
  for (const name of readdirSync(DATA)) {
    const path = join(DATA, name);
    if (!statSync(path).isDirectory()) {
      freed += remove(path); // full-book JSON
      continue;
    }
    for (const file of readdirSync(path)) {
      const match = /^ch-(\d+)\.json$/.exec(file);
      if (!match) {
        freed += remove(join(path, file)); // manifest.json etc.
        continue;
      }
      const page = join(DIST, 'scripture', name, 'chapter', match[1], 'index.html');
      const inlined = existsSync(page) && readFileSync(page, 'utf8').includes('id="verse-');
      if (inlined) freed += remove(join(path, file));
      else kept++;
    }
    if (readdirSync(path).length === 0) rmSync(path, { recursive: true, force: true });
  }
}

// Archives in public/ (e.g. pinterest/katha/katha-pinterest-jpg.zip, 26 MB)
// are working bundles no page links to; one exceeds the 25 MiB file limit.
(function dropArchives(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) dropArchives(path);
    else if (name.endsWith('.zip')) {
      freed += remove(path);
      console.log(`  pruned dist/${path.slice(DIST.length + 1)} (archive, not linked)`);
    }
  }
})(DIST);

// Cloudflare Pages limits (free plan): 20,000 files per deployment and
// 25 MiB per file. Fail the build here rather than at upload.
const MAX_FILES = 20_000;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
let files = 0;
let total = 0;
const oversized = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      walk(path);
      continue;
    }
    files++;
    total += st.size;
    if (st.size > MAX_FILE_BYTES) oversized.push(`${path.slice(DIST.length + 1)} (${(st.size / 1024 / 1024).toFixed(1)} MB)`);
  }
})(DIST);

console.log(
  `✓ Export pruned: freed ${(freed / 1024 / 1024).toFixed(0)} MB, kept ${kept} shard(s) for client-loaded chapters; ` +
    `dist is ${(total / 1024 / 1024).toFixed(0)} MB in ${files} files.`,
);

if (process.env.GITHUB_STEP_SUMMARY) {
  try {
    const summary = [
      '### 📦 Cloudflare Pages Export Summary',
      '',
      '| Metric | Value | Limit | Headroom |',
      '|---|---|---|---|',
      `| **Total Files** | \`${files.toLocaleString()}\` | \`${MAX_FILES.toLocaleString()}\` | **\`${(MAX_FILES - files).toLocaleString()} files remaining\`** |`,
      `| **Export Size** | \`${(total / 1024 / 1024 / 1024).toFixed(2)} GB\` (\`${(total / 1024 / 1024).toFixed(0)} MB\`) | — | — |`,
      `| **Pruned / Freed** | \`${(freed / 1024 / 1024).toFixed(0)} MB\` | — | — |`,
      '',
    ].join('\n');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
  } catch {}
}
let ok = true;
if (files > MAX_FILES) {
  console.error(`✗ ${files} files — Cloudflare Pages allows ${MAX_FILES} per deployment.`);
  ok = false;
}
if (oversized.length > 0) {
  console.error(`✗ ${oversized.length} file(s) over Cloudflare Pages' 25 MiB limit: ${oversized.slice(0, 5).join(', ')}`);
  ok = false;
}
if (!ok) process.exit(1);
