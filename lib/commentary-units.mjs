/**
 * Where a verse's published commentary lives (docs/commentary-storage.md).
 *
 * `npm run publish:commentary` writes one small JSON file per section of a chapter,
 * `public/data/hi-commentary/<scripture>/<chapter>-<unit>.json`, keyed "chapter:verse" as before:
 *
 * - a dotted verse number ("12.45", "1.3.3") goes to its section: `<chapter>-s12`;
 * - a plain number goes to a block of 250 verses: verse 1–250 → `<chapter>-b0`, 251–500 → `<chapter>-b1`;
 * - anything else goes to `<chapter>-x`.
 *
 * The unit depends only on the key, never on the verse data, so a data repair never moves commentary
 * between files, and the reader can work out which files a page needs from its verse numbers alone.
 * Plain JavaScript so node scripts, tsx scripts and the browser bundle share one copy.
 */

/** Verses per block for plain verse numbers. */
export const COMMENTARY_BLOCK = 250;

/** Published commentary, relative to the repository root. */
export const PUBLISHED_COMMENTARY_DIR = 'public/data/hi-commentary';

const SAFE = /[^A-Za-z0-9]/g;

/**
 * The unit ("12-s45", "3-b0") that holds a commentary key, or null for a key that is not "chapter:verse".
 * @param {string} key
 * @returns {string | null}
 */
export function commentaryUnitOf(key) {
  const m = /^(\d+):(.+)$/.exec(String(key));
  if (!m) return null;
  const chapter = String(Number(m[1]));
  const verse = m[2];
  const dot = verse.indexOf('.');
  if (dot > 0) {
    const section = verse.slice(0, dot);
    return `${chapter}-s${/^\d+$/.test(section) ? String(Number(section)) : section.replace(SAFE, '_')}`;
  }
  const lead = /^(\d+)/.exec(verse);
  if (lead) return `${chapter}-b${Math.floor(Math.max(0, Number(lead[1]) - 1) / COMMENTARY_BLOCK)}`;
  return `${chapter}-x`;
}

/** The chapter a unit belongs to ("12-s45" → 12). */
export function commentaryUnitChapter(unit) {
  return Number(String(unit).split('-')[0]);
}

/**
 * Same rule as lib/canonical-verse-id.ts (duplicated so this file has no TypeScript import).
 * @param {number} chapterNumber
 * @param {number | string} verseNumber
 */
function canonicalVerseId(chapterNumber, verseNumber) {
  const s = String(verseNumber);
  if (!s.includes('.')) return s;
  const parts = s.split('.');
  if (parts.length >= 2 && Number(parts[0]) === chapterNumber) return parts.slice(1).join('.');
  return parts[parts.length - 1] ?? s;
}

/**
 * Every key the reader may look a verse up by (lib/commentary-lookup.ts): its exact "chapter:number"
 * and the shortened numeric key.
 * @param {number} chapterId
 * @param {number | string} number
 * @returns {string[]}
 */
export function commentaryCandidateKeys(chapterId, number) {
  const keys = [`${chapterId}:${number}`];
  const value = Number(canonicalVerseId(chapterId, number));
  if (Number.isFinite(value) && `${chapterId}:${value}` !== keys[0]) keys.push(`${chapterId}:${value}`);
  return keys;
}

/**
 * The units that can hold commentary for these verses, in first-seen order.
 * @param {number} chapterId
 * @param {Array<number | string>} numbers
 * @returns {string[]}
 */
export function commentaryUnitsForVerses(chapterId, numbers) {
  const units = new Set();
  for (const number of numbers) {
    for (const key of commentaryCandidateKeys(chapterId, number)) {
      const unit = commentaryUnitOf(key);
      if (unit) units.add(unit);
    }
  }
  return [...units];
}

/**
 * Split a book's commentary into units, keeping each unit's keys in their original order.
 * Keys that are not "chapter:verse" are returned separately so the caller can refuse them.
 * @template T
 * @param {Record<string, T>} entries
 * @returns {{ units: Map<string, Record<string, T>>, invalid: string[] }}
 */
export function splitCommentaryUnits(entries) {
  /** @type {Map<string, Record<string, T>>} */
  const units = new Map();
  const invalid = [];
  for (const [key, value] of Object.entries(entries)) {
    const unit = commentaryUnitOf(key);
    if (!unit) {
      invalid.push(key);
      continue;
    }
    let bucket = units.get(unit);
    if (!bucket) units.set(unit, (bucket = {}));
    bucket[key] = value;
  }
  return { units, invalid };
}

/**
 * Order units by chapter, then kind and number, so listings and merged reads are stable.
 * @param {string} a
 * @param {string} b
 */
export function compareCommentaryUnits(a, b) {
  const pa = /^(\d+)-([a-z])(.*)$/.exec(a);
  const pb = /^(\d+)-([a-z])(.*)$/.exec(b);
  if (!pa || !pb) return a < b ? -1 : a > b ? 1 : 0;
  return (
    Number(pa[1]) - Number(pb[1]) ||
    (pa[2] < pb[2] ? -1 : pa[2] > pb[2] ? 1 : 0) ||
    (/^\d+$/.test(pa[3]) && /^\d+$/.test(pb[3]) ? Number(pa[3]) - Number(pb[3]) : pa[3] < pb[3] ? -1 : pa[3] > pb[3] ? 1 : 0)
  );
}

/**
 * Where the browser loads one unit from. `origin` is NEXT_PUBLIC_COMMENTARY_ORIGIN (the Pages project's
 * `commentary` deployment on the live site, empty for a local build, which serves public/ itself).
 * @param {string} origin
 * @param {string} basePath
 * @param {string} scriptureId
 * @param {string} unit
 */
export function commentaryUnitUrl(origin, basePath, scriptureId, unit) {
  const base = origin ? origin.replace(/\/+$/, '') : basePath;
  return `${base}/data/hi-commentary/${scriptureId}/${unit}.json`;
}
