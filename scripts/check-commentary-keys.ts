/** Check queue and published keys against the reader's canonical and raw verse identifiers. */
import fs from "node:fs";
import path from "node:path";
import { canonicalVerseId } from "../lib/canonical-verse-id";

const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--scripture" || !/^[a-z0-9-]+$/.test(args[1]))) {
  console.error("usage: npx tsx scripts/check-commentary-keys.ts [--scripture <id>]");
  process.exit(2);
}
const selected = args[1];
const queueDir = path.resolve("data/ai-commentary");
const publishedDir = path.resolve("public/data/hi-commentary");
const proposalDir = path.resolve("data/ai-commentary/proposals");
const names = (dir: string) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.endsWith("-research.json")).map(f => f.slice(0, -5)) : [];
const ids = selected ? [selected] : [...new Set([...names(queueDir), ...names(publishedDir), ...names(proposalDir)])].sort();
let problems = 0, checked = 0, files = 0;
function report(message: string) { if (problems < 50) console.error(message); problems++; }
for (const id of ids) {
  const sourcePath = path.resolve("public/data/scriptures-full", `${id}.json`);
  if (!fs.existsSync(sourcePath)) { report(`${id}: scripture source missing`); continue; }
  const book = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const verses = new Map<string, string[]>();
  for (const chapter of book.chapters ?? []) for (const verse of chapter.verses ?? []) {
    const n = Number(chapter.number), numeric = Number(canonicalVerseId(n, verse.number));
    const keys = new Set([`${n}:${verse.number}`]);
    if (Number.isFinite(numeric)) keys.add(`${n}:${numeric}`);
    for (const key of keys) verses.set(key, [...(verses.get(key) ?? []), verse.sanskrit]);
  }
  const queueFile = path.join(queueDir, `${id}.json`);
  const queue = fs.existsSync(queueFile) ? JSON.parse(fs.readFileSync(queueFile, "utf8")) : {};
  for (const [kind, dir] of [["queue", queueDir], ["published", publishedDir], ["proposal", proposalDir]] as const) {
    const file = path.join(dir, `${id}.json`);
    if (!fs.existsSync(file)) continue;
    files++;
    const entries = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) { report(`${id} ${kind}: expected an object`); continue; }
    for (const [key, raw] of Object.entries(entries)) {
      checked++;
      const entry = raw as { sanskrit?: string; replacesQueueSnapshot?: unknown } | null;
      const matching = verses.get(key) ?? [];
      if (matching.length !== 1) { report(`${id} ${kind} ${key}: ${matching.length ? "ambiguous source key" : "no source verse"}`); continue; }
      if (!entry || typeof entry !== "object") { report(`${id} ${kind} ${key}: invalid entry`); continue; }
      if (kind !== "published" && (typeof entry.sanskrit !== "string" || !entry.sanskrit.trim())) report(`${id} ${kind} ${key}: Sanskrit snapshot is missing`);
      else if (kind !== "published" && entry.sanskrit !== matching[0]) report(`${id} ${kind} ${key}: Sanskrit snapshot is stale`);
      if (kind === "proposal" && JSON.stringify(entry.replacesQueueSnapshot) !== JSON.stringify(queue[key])) report(`${id} ${kind} ${key}: original queue entry changed`);
    }
  }
}
if (problems > 50) console.error(`... ${problems - 50} additional problems omitted`);
console.log(`Checked ${checked} entries in ${files} files; ${problems} problems.`);
if (problems) process.exitCode = 1;
