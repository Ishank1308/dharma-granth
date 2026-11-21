// Shared by the app's content build (build-content.mjs) and the website's app-data build
// (../../scripts/build-app-data.mjs), so a bundled book and a downloaded book carry the same verse fields
// and the same rule decides which books ship inside the app.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

/** Bundled whatever their size: texts readers ask for offline even though they are larger than the cut-off. */
export const ALWAYS_BUNDLE = new Set(['ramcharitmanas']);

/** Alias ids redirect to a canonical book on the website (data/scripture-aliases.ts); never list them twice. */
export const ALIASES = new Set(['yogavasistha']);

/** Books with at most this much chapter data ship inside the app; larger ones are downloaded on demand. */
export const DEFAULT_MAX_MB = 2.6;

/** Verse fields the reader shows. Everything else (search keywords, generated notes) stays on the website. */
export const VERSE_FIELDS = [
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

export function readJson(path) {
  const buf = path.endsWith('.gz') ? gunzipSync(readFileSync(path)) : readFileSync(path);
  return JSON.parse(buf.toString('utf8'));
}

function clean(text) {
  if (typeof text !== 'string') return undefined;
  const t = text.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return t || undefined;
}

export function slimVerse(v) {
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

/** Book ids in the published data folder: a shard folder with a manifest, or a full-book JSON. */
export function listBookIds(dataDir) {
  const ids = new Set();
  for (const name of readdirSync(dataDir)) {
    const full = join(dataDir, name);
    if (statSync(full).isDirectory()) {
      if (existsSync(join(full, 'manifest.json'))) ids.add(name);
    } else if (name.endsWith('.json') || name.endsWith('.json.gz')) {
      ids.add(name.replace(/\.json(\.gz)?$/, ''));
    }
  }
  for (const alias of ALIASES) ids.delete(alias);
  return [...ids].sort();
}

/**
 * Opens one book: its catalog fields, its chapter list and the size of its chapter data.
 * `readVerses(number)` returns a chapter's slimmed verses, read from the shard when there is one.
 * Returns null when the book has no chapters.
 */
export function openBook(dataDir, id) {
  const shardDir = join(dataDir, id);
  const manifestPath = join(shardDir, 'manifest.json');
  const fullPath = existsSync(join(dataDir, `${id}.json`)) ? join(dataDir, `${id}.json`) : join(dataDir, `${id}.json.gz`);
  const hasShards = existsSync(manifestPath);
  const hasFull = existsSync(fullPath);

  // Title and category live only on the full book; chapter list comes from the shard manifest when present.
  const meta = hasShards ? readJson(manifestPath) : null;
  const full = hasFull ? readJson(fullPath) : null;
  if (!meta && !full) return null;

  const chapters = (meta?.chapters ?? full?.chapters ?? []).map((ch) => ({
    number: Number(ch.number),
    title: ch.title || `अध्याय ${ch.number}`,
    titleSanskrit: ch.titleSanskrit || undefined,
    verseCount: ch.verseCount ?? ch.verses?.length ?? 0,
  }));
  if (chapters.length === 0) return null;

  let size = 0;
  if (hasShards) {
    for (const ch of chapters) {
      const p = join(shardDir, `ch-${ch.number}.json`);
      if (existsSync(p)) size += statSync(p).size;
    }
  } else if (hasFull) {
    size = statSync(fullPath).size;
  }

  const readVerses = (number) => {
    let verses = [];
    if (hasShards) {
      const p = join(shardDir, `ch-${number}.json`);
      if (existsSync(p)) verses = readJson(p).chapter?.verses ?? [];
    } else {
      verses = full.chapters.find((c) => Number(c.number) === number)?.verses ?? [];
    }
    return verses.map(slimVerse);
  };

  return {
    id,
    title: full?.title ?? id,
    titleSanskrit: full?.titleSanskrit,
    category: full?.category ?? 'other',
    // A getter: the fallback sum reads verse counts the caller may correct after reading the chapters.
    get totalVerses() {
      return meta?.languageCoverage?.totalVerses ?? full?.totalVerses ?? chapters.reduce((a, c) => a + c.verseCount, 0);
    },
    chapters,
    size,
    fromShards: hasShards,
    readVerses,
  };
}

/** Whether a book ships inside the app. Size decides: the epics and Puranas would make the APK hundreds of MB. */
export function isBundled(book, maxBytes = DEFAULT_MAX_MB * 1024 * 1024) {
  return book.size > 0 && (book.size <= maxBytes || ALWAYS_BUNDLE.has(book.id));
}
