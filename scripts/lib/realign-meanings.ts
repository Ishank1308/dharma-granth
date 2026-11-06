/**
 * Re-seeding a text from its source renumbers verses. These helpers carry the
 * meanings already published for that text onto the re-seeded copy without
 * moving a meaning onto a different verse.
 *
 * A reviewed realignment table (data/realign/*.json) maps each old position
 * "chapter:number" to its new position, or to null when the verse is not in
 * the source text at all (a misattributed quotation). Positions not in the
 * table keep their meaning only when the same position still holds the same
 * Sanskrit, which is what a later re-run of a seeder sees.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Sanscript from "@indic-transliteration/sanscript";
import type { FullChapter, FullScripture, FullVerse } from "./scripture-schema";

/** "chapter:number" → "chapter:number", or null when the verse is not in the text. */
export type Realignment = Record<string, string | null>;

export interface RealignFile {
  note?: string;
  scriptures: Record<string, { entries: Realignment }>;
}

export function readRealignment(file: string, scriptureId: string): Realignment | undefined {
  const path = resolve(file);
  if (!existsSync(path)) throw new Error(`realignment table not found: ${path}`);
  const parsed = JSON.parse(readFileSync(path, "utf8")) as RealignFile;
  return parsed.scriptures[scriptureId]?.entries;
}

export function readPreviousScripture(file: string): FullScripture | undefined {
  const path = resolve(file);
  return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as FullScripture) : undefined;
}

/** Letters only: no accents, punctuation, spacing or verse markers. Equal for the same verse text. */
export function letterFingerprint(s: string | undefined): string {
  return (s ?? "")
    .normalize("NFC")
    .replace(/[॑-॔᳐-᳿꣠-ꣿ]/g, "")
    .replace(/[^ऀ-ॣॱ-ॿ]/g, "");
}

const TEXT_FIELDS = new Set(["number", "sanskrit", "transliteration"]);

function meaningFields(verse: FullVerse): Partial<FullVerse> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(verse)) {
    if (TEXT_FIELDS.has(key) || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as Partial<FullVerse>;
}

export interface CarryOverResult {
  chapters: FullChapter[];
  /** "old → new" for every meaning moved. */
  carried: string[];
  /** Old positions whose meaning was not carried, with the reason. */
  dropped: string[];
}

export function carryOverMeanings(
  previous: FullChapter[],
  seeded: FullChapter[],
  realign: Realignment = {},
): CarryOverResult {
  const index = new Map<string, FullVerse>();
  for (const chapter of seeded) {
    for (const verse of chapter.verses) index.set(`${chapter.number}:${verse.number}`, verse);
  }

  const carried: string[] = [];
  const dropped: string[] = [];
  const filled = new Map<string, string>();

  for (const chapter of previous) {
    for (const verse of chapter.verses) {
      const fields = meaningFields(verse);
      if (Object.keys(fields).length === 0) continue;
      const from = `${chapter.number}:${verse.number}`;

      let to: string | null;
      if (Object.prototype.hasOwnProperty.call(realign, from)) {
        to = realign[from];
        if (to === null) {
          dropped.push(`${from}: not in the source text`);
          continue;
        }
      } else {
        to = from;
        const same = index.get(to);
        if (!same || letterFingerprint(same.sanskrit) !== letterFingerprint(verse.sanskrit)) {
          dropped.push(`${from}: no realignment entry and the position now holds different text`);
          continue;
        }
      }

      const target = index.get(to);
      if (!target) {
        dropped.push(`${from}: realigned to ${to}, which the source does not have`);
        continue;
      }
      const earlier = filled.get(to);
      if (earlier) {
        dropped.push(`${from}: repeat of ${earlier} (both realign to ${to})`);
        continue;
      }
      Object.assign(target, fields);
      filled.set(to, from);
      carried.push(`${from} → ${to}`);
    }
  }

  return { chapters: seeded, carried, dropped };
}

/** Gives a repeated verse number in one chapter a letter suffix ("34.1", "34.1b", "34.1c"), in text order. */
export function uniqueVerseNumbers(verses: FullVerse[]): number {
  const seen = new Map<string, number>();
  let renamed = 0;
  for (const verse of verses) {
    const key = String(verse.number);
    const count = (seen.get(key) ?? 0) + 1;
    seen.set(key, count);
    if (count > 1) {
      verse.number = `${key}${String.fromCharCode(96 + count)}`;
      renamed++;
    }
  }
  return renamed;
}

const VEDIC_ACCENTS = /[॑-॔᳐-᳿꣠-ꣿ]/g;

/** IAST for a Devanagari verse, without Vedic accents (same rules as scripts/fill-transliteration.ts). */
export function iastFromDevanagari(sanskrit: string): string {
  const src = sanskrit.replace(VEDIC_ACCENTS, "").replace(/["'“”]/g, "").trim();
  try {
    return Sanscript.t(src, "devanagari", "iast").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}
