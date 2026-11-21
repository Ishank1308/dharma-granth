// Build the scripture content the Android app bundles.
//
//   node scripts/build-content.mjs               rebuild everything
//   node scripts/build-content.mjs --if-missing  skip when the generated files already exist
//   node scripts/build-content.mjs --max-mb=4    bundle books up to 4 MB of chapter data (default 2.6;
//                                                ALWAYS_BUNDLE in content-lib.mjs lists larger books that ship anyway)
//
// Source of truth is the same published data the website reads:
//   ../public/data/scriptures-full/<id>/manifest.json + ch-N.json   (chapter shards, preferred)
//   ../public/data/scriptures-full/<id>.json                        (full book, fallback)
// Run `npm run shard:scriptures` at the repo root first so the app gets the cleaned shard text
// (aligned meanings, review flags, passage ranges) and not the raw full-book JSON.
//
// Output (git-ignored, regenerated on every EAS build by the eas-build-post-install hook):
//   src/content/generated/catalog.json   every scripture with its chapter list
//   src/content/generated/assets/content/books/<id>/ch-N.json   verse text of each chapter of a bundled scripture
//   src/content/generated/loaders.android.ts   per-chapter loader map that reads those files from the APK's
//                                        assets (plugins/with-smaller-android.js adds generated/assets/ to them)
//   src/content/generated/loaders.ts     the same map as lazy require()s, for web and iOS
//                                        Either way opening a chapter parses only that chapter
//                                        (Ramcharitmanas is 5 MB; one kanda is under 1 MB).
//   src/content/generated/assets/content/search/…   offline verse search index (scripts/build-search-index.mjs)
//
// On Android the text ships as compressed APK assets, not inside the Hermes JS bundle. The JS bundle is
// stored uncompressed in the APK (Hermes maps it into memory), so 35 MB of verses there cost 35 MB on the
// phone; as deflated assets they cost about a third of that, and the download is smaller too.
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Buffer } from 'node:buffer';

import { buildSearchIndex } from './build-search-index.mjs';
import { DEFAULT_MAX_MB, isBundled, listBookIds, openBook } from './content-lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MOBILE = resolve(HERE, '..');
const DATA = resolve(MOBILE, '../public/data/scriptures-full');
const OUT = join(MOBILE, 'src/content/generated');
/** Files under here become Android assets at the same relative path (asset:///content/…). */
const ASSETS = join(OUT, 'assets');
const BOOKS = join(ASSETS, 'content/books');

const args = process.argv.slice(2);
const ifMissing = args.includes('--if-missing');
const maxMbArg = args.find((a) => a.startsWith('--max-mb='));
const MAX_BYTES = Math.round(Number(maxMbArg ? maxMbArg.split('=')[1] : DEFAULT_MAX_MB) * 1024 * 1024);

if (
  ifMissing &&
  existsSync(join(OUT, 'catalog.json')) &&
  existsSync(join(OUT, 'loaders.ts')) &&
  existsSync(join(OUT, 'loaders.android.ts')) &&
  existsSync(join(OUT, 'search-loaders.ts')) &&
  existsSync(join(OUT, 'search-loaders.android.ts'))
) {
  console.log('[content] generated content present; skipping (run `npm run content` to rebuild)');
  process.exit(0);
}

if (!existsSync(DATA)) {
  console.error(`[content] ${DATA} not found. Run this from a full checkout of the dharma-granth repo.`);
  process.exit(1);
}

rmSync(BOOKS, { recursive: true, force: true });
// Layout before chapter text moved to assets/; clear it so Metro never bundles stale copies.
rmSync(join(OUT, 'books'), { recursive: true, force: true });
mkdirSync(BOOKS, { recursive: true });

const catalog = [];
let bundledBytes = 0;
let usedShards = 0;
/** Bundled book id -> chapter numbers written, for the loader map. */
const chapterFiles = new Map();

for (const id of listBookIds(DATA)) {
  const src = openBook(DATA, id);
  if (!src) continue;
  const chapters = src.chapters;
  // Books over the cut-off are not bundled; the app downloads them from dharmagranth.dev/app-data/ on demand.
  const bundled = isBundled(src, MAX_BYTES);

  if (bundled) {
    const dir = join(BOOKS, id);
    mkdirSync(dir, { recursive: true });
    const written = [];
    for (const ch of chapters) {
      const verses = src.readVerses(ch.number);
      const json = JSON.stringify({ number: ch.number, verses });
      bundledBytes += Buffer.byteLength(json);
      writeFileSync(join(dir, `ch-${ch.number}.json`), json);
      // The catalog's count must match what the reader shows (the verse of the day picks by index).
      ch.verseCount = verses.length;
      written.push(ch.number);
    }
    chapterFiles.set(id, written);
    if (src.fromShards) usedShards++;
  }

  catalog.push({
    id,
    title: src.title,
    titleSanskrit: src.titleSanskrit,
    category: src.category,
    totalVerses: src.totalVerses,
    bundled,
    chapters,
  });
}

writeFileSync(join(OUT, 'catalog.json'), JSON.stringify(catalog));

const bundledIds = catalog.filter((b) => b.bundled).map((b) => b.id);
const loaderMap = (entry) => [
  'export const CHAPTER_LOADERS: Record<string, Record<number, () => BookChapter>> = {',
  ...bundledIds.map((id) =>
    [
      `  ${JSON.stringify(id)}: {`,
      ...chapterFiles.get(id).map((n) => `    ${n}: ${entry(`books/${id}/ch-${n}.json`)},`),
      '  },',
    ].join('\n'),
  ),
  '};',
  '',
];
writeFileSync(
  join(OUT, 'loaders.ts'),
  [
    '// Generated by scripts/build-content.mjs. Do not edit.',
    '// Web and iOS: chapters are lazy require()s. Android uses loaders.android.ts (APK assets) instead.',
    "import type { BookChapter } from '../types';",
    '',
    '/** Each require() runs only when its chapter is opened, so only that chapter is parsed and kept in memory. */',
    ...loaderMap((path) => `() => require('./assets/content/${path}') as BookChapter`),
  ].join('\n'),
);
writeFileSync(
  join(OUT, 'loaders.android.ts'),
  [
    '// Generated by scripts/build-content.mjs. Do not edit.',
    "import { readBundledJson } from '../bundled-assets';",
    "import type { BookChapter } from '../types';",
    '',
    '/** Each chapter is a compressed APK asset, read and parsed only when it is opened. */',
    ...loaderMap((path) => `() => readBundledJson<BookChapter>(${JSON.stringify(path)})`),
  ].join('\n'),
);

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `[content] ${catalog.length} scriptures in catalog, ${bundledIds.length} bundled (${mb(bundledBytes)} MB), ` +
    `${usedShards}/${bundledIds.length} from published shards`,
);
if (usedShards < bundledIds.length) {
  console.warn('[content] some books came from full-book JSON. Run `npm run shard:scriptures` at the repo root for the cleaned text.');
}

await buildSearchIndex();
