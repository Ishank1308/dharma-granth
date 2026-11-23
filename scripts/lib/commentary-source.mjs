import fs from "node:fs";
import path from "node:path";

// Mirrors lib/canonical-verse-id.ts and the reader's raw-number fallback.
export function verseKeys(chapter, number) {
  const raw = String(number);
  const parts = raw.split(".");
  const canonical = parts.length === 1 ? raw : Number(parts[0]) === chapter ? parts.slice(1).join(".") : parts.at(-1);
  const numeric = Number(canonical);
  const keys = [`${chapter}:${raw}`];
  if (Number.isFinite(numeric)) keys.unshift(`${chapter}:${numeric}`);
  return [...new Set(keys)];
}

export function sourceVerses(id) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid scripture id: ${id}`);
  const book = JSON.parse(fs.readFileSync(path.resolve("public/data/scriptures-full", `${id}.json`), "utf8"));
  const rawMap = new Map();
  const normMap = new Map();
  for (const ch of book.chapters ?? []) for (const verse of ch.verses ?? []) {
    const chapter = Number(ch.number);
    const rawKey = `${chapter}:${verse.number}`;
    rawMap.set(rawKey, [...(rawMap.get(rawKey) ?? []), verse.sanskrit]);
    for (const key of verseKeys(chapter, verse.number)) {
      if (key === rawKey) continue;
      normMap.set(key, [...(normMap.get(key) ?? []), verse.sanskrit]);
    }
  }
  const map = new Map(normMap);
  for (const [key, entries] of rawMap) map.set(key, entries);
  return map;
}

export function uniqueSource(map, key) {
  const matches = map.get(key) ?? [];
  if (matches.length !== 1 || typeof matches[0] !== "string" || !matches[0].trim()) {
    throw new Error(`${key}: expected one source verse with Sanskrit, found ${matches.length}`);
  }
  return matches[0];
}
