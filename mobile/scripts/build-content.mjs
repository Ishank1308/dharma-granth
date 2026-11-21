// Build the scripture content the Android app bundles.
//
//   node scripts/build-content.mjs               rebuild everything
//   node scripts/build-content.mjs --if-missing  skip when the generated files already exist
//   node scripts/build-content.mjs --max-mb=4    bundle books up to 4 MB of chapter data (default 2.6;
//                                                ALWAYS_BUNDLE below lists larger books that ship anyway)
//
// Source of truth is the same published data the website reads:
//   ../public/data/scriptures-full/<id>/manifest.json + ch-N.json   (chapter shards, preferred)
//   ../public/data/scriptures-full/<id>.json                        (full book, fallback)
// Run `npm run shard:scriptures` at the repo root first so the app gets the cleaned shard text
// (aligned meanings, review flags, passage ranges) and not the raw full-book JSON.
//
// Output (git-ignored, regenerated on every EAS build by the eas-build-post-install hook):
//   src/content/generated/catalog.json   every scripture with its chapter list
//   src/content/generated/books/<id>/ch-N.json   verse text of each chapter of a bundled scripture
//   src/content/generated/loaders.ts     lazy require() map per chapter, so opening a chapter parses only
//                                        that chapter (Ramcharitmanas is 5 MB; one kanda is under 1 MB)
//   src/content/generated/search/…       offline verse search index (scripts/build-search-index.mjs)
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';
import { gunzipSync } from 'node:zlib';

import { buildSearchIndex } from './build-search-index.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const DATA = resolve(MOBILE, '../public/data/scriptures-full');
const OUT = join(MOBILE, 'src/content/generated');
const BOOKS = join(OUT, 'books');

const args = process.argv.slice(2);
const ifMissing = args.includes('--if-missing');
const maxMbArg = args.find((a) => a.startsWith('--max-mb='));
const MAX_BYTES = Math.round(Number(maxMbArg ? maxMbArg.split('=')[1] : 2.6) * 1024 * 1024);

/** Bundled whatever their size: texts readers ask for offline even though they are larger than the cut-off. */
const ALWAYS_BUNDLE = new Set(['ramcharitmanas']);

/** Alias ids redirect to a canonical book on the website (data/scripture-aliases.ts); never list them twice. */
const ALIASES = new Set(['yogavasistha']);

/** Verse fields the reader shows. Everything else (search keywords, generated notes) stays on the website. */
const VERSE_FIELDS = [
  'number',
  'sanskrit',
  'transliteration',
  'hindi',
  'hindiSource',
  'hindiRange',
  'hindiSeeVerse',
  'hindiReviewRequired',
  'translation',
  'translationSource',
  'translationRange',
  'translationSeeVerse',
  'wordMeaning',
  'commentary',
  'explanation',
];

if (
  ifMissing &&
  existsSync(join(OUT, 'catalog.json')) &&
  existsSync(join(OUT, 'loaders.ts')) &&
  existsSync(join(OUT, 'search-loaders.ts'))
) {
  console.log('[content] generated content present; skipping (run `npm run content` to rebuild)');
  process.exit(0);
}

if (!existsSync(DATA)) {
  console.error(`[content] ${DATA} not found. Run this from a full checkout of the dharma-granth repo.`);
  process.exit(1);
}

function readJson(path) {
  const buf = path.endsWith('.gz') ? gunzipSync(readFileSync(path)) : readFileSync(path);
  return JSON.parse(buf.toString('utf8'));
}

function clean(text) {
  if (typeof text !== 'string') return undefined;
  const t = text.replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return t || undefined;
}

function slimVerse(v) {
  const out = {};
  for (const key of VERSE_FIELDS) {
    const value = v[key];
    if (value == null || value === false) continue;
    if (typeof value === 'string') {
      const c = key === 'number' ? value : clean(value);
      if (c) out[key] = c;
    } else {
      out[key] = value;
    }
  }
  return out;
}

const ids = new Set();
for (const name of readdirSync(DATA)) {
  const full = join(DATA, name);
  if (statSync(full).isDirectory()) {
    if (existsSync(join(full, 'manifest.json'))) ids.add(name);
  } else if (name.endsWith('.json') || name.endsWith('.json.gz')) {
    ids.add(name.replace(/\.json(\.gz)?$/, ''));
  }
}
for (const alias of ALIASES) ids.delete(alias);

rmSync(BOOKS, { recursive: true, force: true });
mkdirSync(BOOKS, { recursive: true });

const catalog = [];
let bundledBytes = 0;
let usedShards = 0;
/** Bundled book id -> chapter numbers written, for the loader map. */
const chapterFiles = new Map();

for (const id of [...ids].sort()) {
  const shardDir = join(DATA, id);
  const manifestPath = join(shardDir, 'manifest.json');
  const fullPath = existsSync(join(DATA, `${id}.json`)) ? join(DATA, `${id}.json`) : join(DATA, `${id}.json.gz`);
  const hasShards = existsSync(manifestPath);
  const hasFull = existsSync(fullPath);

  // Title and category live only on the full book; chapter list comes from the shard manifest when present.
  let full = null;
  const meta = hasShards ? readJson(manifestPath) : null;
  if (hasFull) full = readJson(fullPath);
  if (!meta && !full) continue;

  const chapters = (meta?.chapters ?? full?.chapters ?? []).map((ch) => ({
    number: Number(ch.number),
    title: ch.title || `अध्याय ${ch.number}`,
    titleSanskrit: ch.titleSanskrit || undefined,
    verseCount: ch.verseCount ?? ch.verses?.length ?? 0,
  }));
  if (chapters.length === 0) continue;

  // Size decides what ships inside the app: the epics and Puranas would make the APK hundreds of MB.
  let size = 0;
  if (hasShards) {
    for (const ch of chapters) {
      const p = join(shardDir, `ch-${ch.number}.json`);
      if (existsSync(p)) size += statSync(p).size;
    }
  } else if (hasFull) {
    size = statSync(fullPath).size;
  }
  const bundled = size > 0 && (size <= MAX_BYTES || ALWAYS_BUNDLE.has(id));

  if (bundled) {
    const dir = join(BOOKS, id);
    mkdirSync(dir, { recursive: true });
    const written = [];
    for (const ch of chapters) {
      let verses = [];
      if (hasShards) {
        const p = join(shardDir, `ch-${ch.number}.json`);
        if (existsSync(p)) verses = readJson(p).chapter?.verses ?? [];
      } else {
        verses = full.chapters.find((c) => Number(c.number) === ch.number)?.verses ?? [];
      }
      const json = JSON.stringify({ number: ch.number, verses: verses.map(slimVerse) });
      bundledBytes += Buffer.byteLength(json);
      writeFileSync(join(dir, `ch-${ch.number}.json`), json);
      // The catalog's count must match what the reader shows (the verse of the day picks by index).
      ch.verseCount = verses.length;
      written.push(ch.number);
    }
    chapterFiles.set(id, written);
    if (hasShards) usedShards++;
  }

  catalog.push({
    id,
    title: full?.title ?? id,
    titleSanskrit: full?.titleSanskrit,
    category: full?.category ?? 'other',
    totalVerses: meta?.languageCoverage?.totalVerses ?? full?.totalVerses ?? chapters.reduce((a, c) => a + c.verseCount, 0),
    bundled,
    chapters,
  });
}

writeFileSync(join(OUT, 'catalog.json'), JSON.stringify(catalog));

const bundledIds = catalog.filter((b) => b.bundled).map((b) => b.id);
const loaders = [
  '// Generated by scripts/build-content.mjs. Do not edit.',
  "import type { BookChapter } from '../types';",
  '',
  '/** Each require() runs only when its chapter is opened, so only that chapter is parsed and kept in memory. */',
  'export const CHAPTER_LOADERS: Record<string, Record<number, () => BookChapter>> = {',
  ...bundledIds.map((id) =>
    [
      `  ${JSON.stringify(id)}: {`,
      ...chapterFiles.get(id).map((n) => `    ${n}: () => require('./books/${id}/ch-${n}.json') as BookChapter,`),
      '  },',
    ].join('\n'),
  ),
  '};',
  '',
].join('\n');
writeFileSync(join(OUT, 'loaders.ts'), loaders);

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `[content] ${catalog.length} scriptures in catalog, ${bundledIds.length} bundled (${mb(bundledBytes)} MB), ` +
    `${usedShards}/${bundledIds.length} from published shards`,
);
if (usedShards < bundledIds.length) {
  console.warn('[content] some books came from full-book JSON. Run `npm run shard:scriptures` at the repo root for the cleaned text.');
}

await buildSearchIndex();
