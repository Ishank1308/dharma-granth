/**
 * Apply hand-written Hindi and English meanings from data/written-meanings/<id>.json
 * to public/data/scriptures-full/<id>.json.
 *
 * File shape: { note, keyFormat: "chapter:verse", meanings: { "1:2": { hindi?, translation? } } }
 * These meanings are written from the Sanskrit for this site, so any machine-translation
 * label (hindiSource / translationSource) on the verse is removed.
 *
 * Run: npx tsx scripts/apply-written-meanings.ts yogasutra [more ids…]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");

type Meaning = { hindi?: string; translation?: string };
type Verse = { number: number; hindi?: string; translation?: string; hindiSource?: string; translationSource?: string };
type Scripture = { chapters: { number: number; verses: Verse[] }[] };

function apply(id: string) {
  const srcPath = resolve(ROOT, `data/written-meanings/${id}.json`);
  const pubPath = resolve(ROOT, `public/data/scriptures-full/${id}.json`);
  const { meanings } = JSON.parse(readFileSync(srcPath, "utf8")) as { meanings: Record<string, Meaning> };
  const raw = readFileSync(pubPath, "utf8");
  const scripture = JSON.parse(raw) as Scripture;
  // Keep the file's existing layout (some are one line, some are indented).
  const pretty = raw.includes("\n  ");

  const byKey = new Map<string, Verse>();
  for (const ch of scripture.chapters) for (const v of ch.verses) byKey.set(`${ch.number}:${v.number}`, v);

  for (const [key, m] of Object.entries(meanings)) {
    const v = byKey.get(key);
    if (!v) throw new Error(`${id}: no verse ${key}`);
    if (m.hindi) {
      v.hindi = m.hindi;
      delete v.hindiSource;
    }
    if (m.translation) {
      v.translation = m.translation;
      delete v.translationSource;
    }
  }

  writeFileSync(pubPath, pretty ? JSON.stringify(scripture, null, 2) + "\n" : JSON.stringify(scripture), "utf8");
  const verses = [...byKey.values()];
  const hi = verses.filter((v) => v.hindi).length;
  const en = verses.filter((v) => v.translation).length;
  console.log(`${id}: applied ${Object.keys(meanings).length}; Hindi ${hi}/${verses.length}, English ${en}/${verses.length}`);
}

const ids = process.argv.slice(2);
if (!ids.length) {
  console.error("usage: npx tsx scripts/apply-written-meanings.ts <scripture-id> [more…]");
  process.exit(2);
}
ids.forEach(apply);
