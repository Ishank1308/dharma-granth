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
import { join, resolve, sep } from 'node:path';

const DIST = resolve(process.cwd(), process.env.NEXT_DIST_DIR || 'dist');
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

// Archives and generator scratch folders in public/ (e.g. pinterest/, 224 MB)
// are working bundles no page links to; one exceeds the 25 MiB file limit.
const PINTEREST_DIR = join(DIST, 'pinterest');
if (existsSync(PINTEREST_DIR)) {
  freed += remove(PINTEREST_DIR);
  console.log(`  pruned dist/pinterest (generator scratch, not linked)`);
}

(function dropArchives(dir) {
  if (!existsSync(dir)) return;
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
// Warn while there is still room to act. A new page costs two files (index.html and its
// index.txt payload), and a verse page a third (its share image), so 1,000 files is about
// 330 to 500 pages.
const WARN_FILES = 19_000;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
let files = 0;
let total = 0;
const oversized = [];
// What the files are, so the build log shows which kind is growing.
const kinds = { 'Pages (index.html)': 0, 'Page payloads (index.txt)': 0, 'Verse share images (og/verse)': 0, 'Published commentary (data/hi-commentary)': 0, 'Everything else': 0 };
const VERSE_IMAGES = join(DIST, 'og', 'verse') + sep;
const COMMENTARY = join(DIST, 'data', 'hi-commentary') + sep;
// With NEXT_PUBLIC_SHARE_IMAGE_ORIGIN set, the deploy uploads the verse share images as their own
// deployment (the Pages project's `share` branch), so they count toward that deployment's limit
// and not the site's. See docs/deploy-cloudflare.md, "Verse share images".
const SHARE_IMAGES_SPLIT = Boolean(process.env.NEXT_PUBLIC_SHARE_IMAGE_ORIGIN);
// Likewise NEXT_PUBLIC_COMMENTARY_ORIGIN: published commentary (one file per section of every book) goes up
// as the `commentary` branch deployment (docs/commentary-storage.md).
const COMMENTARY_SPLIT = Boolean(process.env.NEXT_PUBLIC_COMMENTARY_ORIGIN);
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
    if (name === 'index.html') kinds['Pages (index.html)']++;
    else if (name === 'index.txt') kinds['Page payloads (index.txt)']++;
    else if (path.startsWith(VERSE_IMAGES)) kinds['Verse share images (og/verse)']++;
    else if (path.startsWith(COMMENTARY)) kinds['Published commentary (data/hi-commentary)']++;
    else kinds['Everything else']++;
    if (st.size > MAX_FILE_BYTES) oversized.push(`${path.slice(DIST.length + 1)} (${(st.size / 1024 / 1024).toFixed(1)} MB)`);
  }
})(DIST);

console.log(
  `✓ Export pruned: freed ${(freed / 1024 / 1024).toFixed(0)} MB, kept ${kept} shard(s) for client-loaded chapters; ` +
    `dist is ${(total / 1024 / 1024).toFixed(0)} MB in ${files} files.`,
);
console.log(`  ${Object.entries(kinds).map(([kind, count]) => `${kind}: ${count}`).join(' · ')}`);
const shareImages = kinds['Verse share images (og/verse)'];
const commentaryFiles = kinds['Published commentary (data/hi-commentary)'];
const siteFiles = files - (SHARE_IMAGES_SPLIT ? shareImages : 0) - (COMMENTARY_SPLIT ? commentaryFiles : 0);
if (SHARE_IMAGES_SPLIT) console.log(`  The site deployment is ${siteFiles} files; the ${shareImages} verse share images deploy separately.`);
if (COMMENTARY_SPLIT) console.log(`  The ${commentaryFiles} published commentary files deploy separately.`);

if (process.env.GITHUB_STEP_SUMMARY) {
  try {
    const summary = [
      '### 📦 Cloudflare Pages Export Summary',
      '',
      '| Metric | Value | Limit | Headroom |',
      '|---|---|---|---|',
      `| **${SHARE_IMAGES_SPLIT || COMMENTARY_SPLIT ? 'Site Files' : 'Total Files'}** | \`${siteFiles.toLocaleString()}\` | \`${MAX_FILES.toLocaleString()}\` | **\`${(MAX_FILES - siteFiles).toLocaleString()} files remaining\`** |`,
      ...(SHARE_IMAGES_SPLIT
        ? [`| **Share Images (own deployment)** | \`${shareImages.toLocaleString()}\` | \`${MAX_FILES.toLocaleString()}\` | \`${(MAX_FILES - shareImages).toLocaleString()} files remaining\` |`]
        : []),
      ...(COMMENTARY_SPLIT
        ? [`| **Commentary (own deployment)** | \`${commentaryFiles.toLocaleString()}\` | \`${MAX_FILES.toLocaleString()}\` | \`${(MAX_FILES - commentaryFiles).toLocaleString()} files remaining\` |`]
        : []),
      `| **Export Size** | \`${(total / 1024 / 1024 / 1024).toFixed(2)} GB\` (\`${(total / 1024 / 1024).toFixed(0)} MB\`) | — | — |`,
      `| **Pruned / Freed** | \`${(freed / 1024 / 1024).toFixed(0)} MB\` | — | — |`,
      '',
      '| Kind of file | Count |',
      '|---|---|',
      ...Object.entries(kinds).map(([kind, count]) => `| ${kind} | \`${count.toLocaleString()}\` |`),
      '',
    ].join('\n');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary, 'utf8');
  } catch {}
}
let ok = true;
// Each deployment has its own limit: the site, and the share images and commentary when they are split off.
const deployments = SHARE_IMAGES_SPLIT || COMMENTARY_SPLIT
  ? [
      ['The site', siteFiles],
      ...(SHARE_IMAGES_SPLIT ? [['The verse share images', shareImages]] : []),
      ...(COMMENTARY_SPLIT ? [['The published commentary', commentaryFiles]] : []),
    ]
  : [['The export', files]];
for (const [what, count] of deployments) {
  if (count > MAX_FILES) {
    console.error(`✗ ${what}: ${count} files — Cloudflare Pages allows ${MAX_FILES} per deployment.`);
    ok = false;
  } else if (count >= WARN_FILES) {
    const message = `${what}: ${count} files; Cloudflare Pages allows ${MAX_FILES} per deployment, so ${MAX_FILES - count} are left.`;
    // An annotation on the workflow run, where it is seen without opening the log.
    if (process.env.GITHUB_ACTIONS) console.log(`::warning title=Close to the Cloudflare Pages file limit::${message}`);
    else console.warn(`⚠ ${message}`);
  }
}
if (oversized.length > 0) {
  console.error(`✗ ${oversized.length} file(s) over Cloudflare Pages' 25 MiB limit: ${oversized.slice(0, 5).join(', ')}`);
  ok = false;
}
if (!ok) process.exit(1);
