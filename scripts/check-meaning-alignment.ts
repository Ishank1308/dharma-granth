/**
 * Fail the build when a published chapter shard shows a Hindi or English meaning that belongs to another verse, or a
 * note made of the verse's line plus a stock sentence.
 *
 * The shard step (scripts/shard-scriptures-full.ts) leaves these out using scripts/lib/meaning-alignment.ts. This
 * check runs the same test over what was actually published, so a new import, a re-seed or a change to the shard
 * step cannot put them back unnoticed. Pilot verses, whose meaning an editor has replaced, and verses in the Hindi
 * review registry, whose Hindi is withheld and whose English is kept as it is, are not checked.
 *
 * Run: tsx scripts/check-meaning-alignment.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { canonicalVerseId } from "../lib/canonical-verse-id";
import { isReviewKept } from "../lib/ocr-hindi-review";
import { exemptFields, hideUnalignedMeanings } from "./lib/meaning-alignment";
import { loadPilotOverlay } from "./pilot/overlay";

const ROOT = resolve(__dirname, "..");
const FULL_DIR = join(ROOT, "public/data/scriptures-full");

const pilot = new Set(
  loadPilotOverlay().map((p) => `${p.scriptureId}:${p.chapter}:${Number(canonicalVerseId(p.chapter, p.verse))}`),
);

const failures: string[] = [];
let checked = 0;
for (const id of readdirSync(FULL_DIR).filter((name) => existsSync(join(FULL_DIR, name, "manifest.json"))).sort()) {
  const shards = readdirSync(join(FULL_DIR, id)).filter((f) => /^ch-\d+\.json$/.test(f));
  const chapters = shards.map(
    (f) => (JSON.parse(readFileSync(join(FULL_DIR, id, f), "utf8")) as { chapter: { number: number; verses: unknown[] } }).chapter,
  );
  const isKept = (chapter: number | string, verse: string, field: "hindi" | "translation") =>
    pilot.has(`${id}:${Number(chapter)}:${Number(canonicalVerseId(Number(chapter), verse))}`) ||
    isReviewKept(id, chapter, verse, field);
  const found = hideUnalignedMeanings({ chapters }, { keepVerse: isKept, measuredOnly: true, skipFields: exemptFields(id) });
  checked++;
  if (found.translation || found.hindi || found.notes) {
    failures.push(`${id}: ${found.translation} English, ${found.hindi} Hindi, ${found.notes} note field(s) not aligned to their verse`);
  }
}

if (failures.length) {
  console.error(`Meaning alignment check failed. Re-run \`npm run shard:scriptures\`, or fix the import:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ Meaning alignment: no misaligned Hindi, English or stock notes in ${checked} published scriptures.`);
