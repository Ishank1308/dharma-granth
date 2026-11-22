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

// ── Hindi व्याख्या (the website's verse commentary) ─────────────────────────────────────────────────
// public/data/hi-commentary/<id>/<chapter>-<unit>.json (or legacy <id>.json) is keyed `${chapter}:${verse}`
// and holds the व्याख्या (explanation), the research note (science) and जीवन सूत्र (lifeLesson).
// The app downloads it per book from the website (scripts/build-app-data.mjs), already resolved to the
// verse numbers the reader shows, so the app never needs the website's key-matching rules.
const COMMENTARY_UNIT_FILE = /^\d+-[a-z][A-Za-z0-9_]*\.json$/;

function readRawCommentary(dataDir, bookId) {
  const base = join(dataDir, '..', 'hi-commentary', bookId);
  const single = `${base}.json`;
  const sources = [];
  if (existsSync(single)) sources.push(single);
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const name of readdirSync(base).sort()) {
      if (COMMENTARY_UNIT_FILE.test(name)) sources.push(join(base, name));
    }
  }
  if (sources.length === 0) return null;
  const out = {};
  for (const file of sources) {
    Object.assign(out, readJson(file));
  }
  return Object.keys(out).length ? out : null;
}

/** Within-chapter verse id from a seeded `number` (ch 2 + "2.10" → "10"). Mirrors lib/canonical-verse-id.ts. */
export function canonicalVerseId(chapterNumber, verseNumber) {
  const s = String(verseNumber);
  if (!s.includes('.')) return s;
  const parts = s.split('.');
  if (parts.length >= 2 && Number(parts[0]) === chapterNumber) return parts.slice(1).join('.');
  return parts[parts.length - 1] ?? s;
}

/**
 * The commentary entry for one verse, as lib/commentary-lookup.ts resolves it: an exact key first, a
 * shortened numeric key only when no other verse of the chapter shares it.
 */
export function lookupCommentary(all, chapter, number, ambiguity) {
  const rawKey = `${chapter}:${number}`;
  if (all[rawKey] != null) return ambiguity.raw.has(rawKey) ? undefined : all[rawKey];
  const value = Number(canonicalVerseId(chapter, number));
  if (!Number.isFinite(value)) return undefined;
  const key = `${chapter}:${value}`;
  if (key !== rawKey && ambiguity.normalized.has(key)) return undefined;
  return all[key] ?? undefined;
}

function ambiguities(chapter, numbers) {
  const normalized = new Set();
  const raw = new Set();
  const seenN = new Set();
  const seenR = new Set();
  for (const number of numbers) {
    const rawKey = `${chapter}:${number}`;
    if (seenR.has(rawKey)) raw.add(rawKey);
    seenR.add(rawKey);
    const value = Number(canonicalVerseId(chapter, number));
    if (!Number.isFinite(value)) continue;
    const key = `${chapter}:${value}`;
    if (seenN.has(key)) normalized.add(key);
    seenN.add(key);
  }
  return { normalized, raw };
}

/**
 * A book's Hindi commentary for the app: { chapters: { [chapter]: { [verse number]: entry } }, verses }.
 * An entry is { v: व्याख्या, r: research note, l: जीवन सूत्र, vd/rd/ld: true when that note is a
 * reviewed AI draft, labelled as on the website }. Null when the book has none.
 */
export function readCommentary(dataDir, book) {
  const all = readRawCommentary(dataDir, book.id);
  if (!all) return null;
  const chapters = {};
  let verses = 0;
  for (const ch of book.chapters) {
    const list = book.readVerses(ch.number);
    const amb = ambiguities(ch.number, list.map((v) => v.number));
    const out = {};
    for (const verse of list) {
      const c = lookupCommentary(all, ch.number, verse.number, amb);
      if (!c) continue;
      const entry = {};
      const v = clean(c.explanation);
      const r = clean(c.science);
      const l = clean(c.lifeLesson);
      if (v) {
        entry.v = v;
        if (c.ai || c.explanationAi || c.editorial) entry.vd = true;
      }
      if (r) {
        entry.r = r;
        if (c.ai || c.scienceAi) entry.rd = true;
      }
      if (l) {
        entry.l = l;
        if (c.ai) entry.ld = true;
      }
      if (entry.v || entry.r || entry.l) {
        out[String(verse.number)] = entry;
        verses++;
      }
    }
    if (Object.keys(out).length) chapters[ch.number] = out;
  }
  return verses ? { chapters, verses } : null;
}
