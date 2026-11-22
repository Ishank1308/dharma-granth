/**
 * Reading and writing commentary records that may be split into per-section files
 * (docs/commentary-storage.md).
 *
 * A record named `<dir>/<id>` is stored either as one file, `<dir>/<id>.json`, or as a folder of units,
 * `<dir>/<id>/<chapter>-<unit>.json` (lib/commentary-units.mjs). Published commentary
 * (public/data/hi-commentary) is always a folder. Review queues and modern-context files
 * (data/ai-commentary/<id>.json, data/hi-commentary/<id>-rest.json) stay one file until they would pass
 * SINGLE_FILE_MAX_BYTES, then become a folder, so no file comes near GitHub's 100 MB limit.
 */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { compareCommentaryUnits, splitCommentaryUnits, PUBLISHED_COMMENTARY_DIR } from "../../lib/commentary-units.mjs";

/** A source record larger than this is written as a folder of units (GitHub warns at 50 MB, refuses 100 MB). */
export const SINGLE_FILE_MAX_BYTES = 40 * 1024 * 1024;
/** No unit may be larger than this (Cloudflare Pages refuses files over 25 MiB). */
export const UNIT_MAX_BYTES = 8 * 1024 * 1024;

export const publishedDir = (root = process.cwd()) => path.resolve(root, PUBLISHED_COMMENTARY_DIR);

const UNIT_FILE = /^\d+-[a-z][A-Za-z0-9_]*\.json$/;

/** Unit files in a record's folder, in stable order. */
export function unitFiles(folder) {
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) return [];
  return fs
    .readdirSync(folder)
    .filter((f) => UNIT_FILE.test(f))
    .sort((a, b) => compareCommentaryUnits(a.slice(0, -5), b.slice(0, -5)));
}

/** Whether a record exists in either form. */
export function recordExists(base) {
  return fs.existsSync(`${base}.json`) || unitFiles(base).length > 0;
}

/**
 * The whole record, merged from its single file and/or unit files. A key stored twice is an error:
 * it would make the published text depend on read order.
 * @param {string} base path without ".json"
 * @returns {Record<string, any>}
 */
export function readRecord(base) {
  const out = {};
  const sources = [];
  if (fs.existsSync(`${base}.json`)) sources.push(`${base}.json`);
  for (const f of unitFiles(base)) sources.push(path.join(base, f));
  for (const file of sources) {
    const part = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const [key, value] of Object.entries(part)) {
      if (Object.prototype.hasOwnProperty.call(out, key)) throw new Error(`${key} is stored twice under ${base}`);
      out[key] = value;
    }
  }
  return out;
}

/**
 * A fingerprint of the record's files, for the read-check-write guards in the staging scripts
 * (the record must not change between reading and writing it).
 */
export function recordSnapshot(base) {
  const parts = [];
  if (fs.existsSync(`${base}.json`)) parts.push(`=${fs.readFileSync(`${base}.json`, "utf8")}`);
  for (const f of unitFiles(base)) parts.push(`${f}=${fs.readFileSync(path.join(base, f), "utf8")}`);
  return parts.length ? parts.join("\u0000") : null;
}

function writeAtomic(file, text) {
  const tmp = `${file}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(tmp, text, { flag: "wx" });
    fs.renameSync(tmp, file);
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

/**
 * Write a record. `split: "always"` writes a folder of units (published commentary); `"auto"` keeps one
 * file unless the record already is a folder or would pass SINGLE_FILE_MAX_BYTES. Only changed files are
 * rewritten; units that no longer have entries are deleted.
 * @param {string} base path without ".json"
 * @param {Record<string, any>} record
 * @param {{ split?: "always" | "auto", stringify?: (value: any) => string }} [options]
 * @returns {{ files: number, written: number, removed: number, bytes: number, largest: { file: string, bytes: number } }}
 */
export function writeRecord(base, record, options = {}) {
  const split = options.split ?? "auto";
  const stringify = options.stringify ?? ((value) => JSON.stringify(value, null, 2) + "\n");
  const stats = { files: 0, written: 0, removed: 0, bytes: 0, largest: { file: "", bytes: 0 } };
  const single = `${base}.json`;

  // An existing folder (even an empty one, made to start a big book split) stays a folder.
  let asFolder = split === "always" || (fs.existsSync(base) && fs.statSync(base).isDirectory());
  let singleText = "";
  if (!asFolder) {
    singleText = stringify(record);
    if (Buffer.byteLength(singleText) > SINGLE_FILE_MAX_BYTES) asFolder = true;
  }

  if (!asFolder) {
    fs.mkdirSync(path.dirname(single), { recursive: true });
    if (!fs.existsSync(single) || fs.readFileSync(single, "utf8") !== singleText) {
      writeAtomic(single, singleText);
      stats.written++;
    }
    stats.files = 1;
    stats.bytes = Buffer.byteLength(singleText);
    stats.largest = { file: single, bytes: stats.bytes };
    return stats;
  }

  const { units, invalid } = splitCommentaryUnits(record);
  if (invalid.length) throw new Error(`Keys that are not "chapter:verse" cannot be stored by section: ${invalid.slice(0, 5).join(", ")}`);
  fs.mkdirSync(base, { recursive: true });
  const keep = new Set();
  for (const [unit, entries] of units) {
    const file = path.join(base, `${unit}.json`);
    const text = stringify(entries);
    const bytes = Buffer.byteLength(text);
    if (bytes > UNIT_MAX_BYTES) throw new Error(`${file} would be ${(bytes / 1048576).toFixed(1)} MB (limit ${UNIT_MAX_BYTES / 1048576} MB)`);
    keep.add(`${unit}.json`);
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== text) {
      writeAtomic(file, text);
      stats.written++;
    }
    stats.files++;
    stats.bytes += bytes;
    if (bytes > stats.largest.bytes) stats.largest = { file, bytes };
  }
  for (const f of unitFiles(base)) {
    if (keep.has(f)) continue;
    fs.unlinkSync(path.join(base, f));
    stats.removed++;
  }
  if (fs.existsSync(single)) {
    fs.unlinkSync(single);
    stats.removed++;
  }
  if (units.size === 0 && fs.existsSync(base) && fs.readdirSync(base).length === 0) fs.rmdirSync(base);
  return stats;
}

/** Delete a record in both forms. */
export function removeRecord(base) {
  let removed = 0;
  if (fs.existsSync(`${base}.json`)) {
    fs.unlinkSync(`${base}.json`);
    removed++;
  }
  for (const f of unitFiles(base)) {
    fs.unlinkSync(path.join(base, f));
    removed++;
  }
  if (fs.existsSync(base) && fs.statSync(base).isDirectory() && fs.readdirSync(base).length === 0) fs.rmdirSync(base);
  return removed;
}

/** Scriptures with published commentary (one folder each). */
export function publishedCommentaryIds(root = process.cwd()) {
  const dir = publishedDir(root);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => /^[a-z0-9-]+$/.test(name) && unitFiles(path.join(dir, name)).length > 0)
    .sort();
}

/** One scripture's published commentary, merged ({} when it has none). */
export function readPublishedCommentary(id, root = process.cwd()) {
  return readRecord(path.join(publishedDir(root), id));
}

/** Within-chapter verse id from a seeded `number` (mirrors lib/canonical-verse-id.ts). */
export function canonicalVerseId(chapterNumber, verseNumber) {
  const s = String(verseNumber);
  if (!s.includes(".")) return s;
  const parts = s.split(".");
  if (parts.length >= 2 && Number(parts[0]) === chapterNumber) {
    return parts.slice(1).join(".");
  }
  return parts[parts.length - 1] ?? s;
}

/** Build ambiguity sets once from the entire chapter (mirrors lib/commentary-lookup.ts). */
export function chapterCommentaryAmbiguities(chapterId, numbers) {
  const normalized = new Set();
  const raw = new Set();
  const seenNormalized = new Set();
  const seenRaw = new Set();
  for (const number of numbers) {
    const rawKey = `${chapterId}:${number}`;
    if (seenRaw.has(rawKey)) raw.add(rawKey);
    seenRaw.add(rawKey);
    const value = Number(canonicalVerseId(chapterId, number));
    if (!Number.isFinite(value)) continue;
    const key = `${chapterId}:${value}`;
    if (seenNormalized.has(key)) normalized.add(key);
    seenNormalized.add(key);
  }
  return { normalized, raw };
}

/** Resolve a verse's published commentary entry using the exact reader lookup rules (lib/commentary-lookup.ts). */
export function lookupPublishedCommentary(all, chapterId, number, ambiguity) {
  if (!all) return undefined;
  const rawKey = `${chapterId}:${number}`;
  if (all[rawKey] != null) return ambiguity?.raw.has(rawKey) ? undefined : all[rawKey];
  const value = Number(canonicalVerseId(chapterId, number));
  if (!Number.isFinite(value)) return undefined;
  const normalizedKey = `${chapterId}:${value}`;
  if (normalizedKey !== rawKey && (!ambiguity || ambiguity.normalized.has(normalizedKey))) return undefined;
  return all[normalizedKey];
}

/** Per-book files from before the split; publishing removes them, and the build refuses them. */
export function legacyPublishedFiles(root = process.cwd()) {
  const dir = publishedDir(root);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
}
