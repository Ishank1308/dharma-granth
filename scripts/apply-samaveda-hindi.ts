/**
 * Apply the hand-written Sama Veda Hindi meanings (data/samaveda-hindi.json)
 * to public/data/scriptures-full/samaveda.json.
 *
 * These meanings are written from the Sanskrit and carry no hindiSource label.
 * A verse whose Sanskrit is identical to a listed verse (the Uttara Archika
 * repeats many Purva Archika mantras) gets the same meaning.
 *
 * Run: npx tsx scripts/apply-samaveda-hindi.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";

const ROOT = resolve(__dirname, "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/samaveda.json");
const SRC_PATH = resolve(ROOT, "data/samaveda-hindi.json");

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function main() {
  const { meanings } = JSON.parse(readFileSync(SRC_PATH, "utf8")) as { meanings: Record<string, string> };
  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;

  type V = { number: number; sanskrit: string; hindi?: string; hindiSource?: string };
  const byKey = new Map<string, V>();
  for (const ch of scripture.chapters) {
    for (const v of ch.verses as V[]) byKey.set(`${ch.number}:${v.number}`, v);
  }

  const bySanskrit = new Map<string, string>();
  let direct = 0;
  for (const [key, hindi] of Object.entries(meanings)) {
    const v = byKey.get(key);
    if (!v) throw new Error(`No Sama Veda verse ${key}`);
    v.hindi = hindi;
    delete v.hindiSource;
    bySanskrit.set(norm(v.sanskrit), hindi);
    direct++;
  }

  const repeats: string[] = [];
  for (const [key, v] of byKey) {
    if (key in meanings) continue;
    const hindi = bySanskrit.get(norm(v.sanskrit));
    if (!hindi) continue;
    v.hindi = hindi;
    delete v.hindiSource;
    repeats.push(key);
  }

  writeFileSync(PUB_PATH, JSON.stringify(scripture, null, 2) + "\n", "utf8");
  const total = [...byKey.values()].filter((v) => v.hindi).length;
  console.log(`Applied ${direct} meanings, ${repeats.length} repeated mantras (${repeats.join(", ") || "none"}); ${total} of ${byKey.size} verses now have Hindi.`);
}

main();
