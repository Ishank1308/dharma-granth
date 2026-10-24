const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const FULL_PATH = path.join(ROOT, "public/data/scriptures-full/brahmasutra.json");
const SHARD_DIR = path.join(ROOT, "public/data/scriptures-full/brahmasutra");
const REPAIRS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/brahmasutra-hindi-repairs.json"), "utf8"),
);
const LATIN = /[A-Za-z]{4,}/;

function serializeLike(source, data, indentation) {
  let output = JSON.stringify(data, null, indentation);
  if (source.includes("\r\n")) output = output.replace(/\n/g, "\r\n");
  if (source.endsWith("\r\n")) output += "\r\n";
  else if (source.endsWith("\n")) output += "\n";
  return output;
}

function walkVerses(scripture) {
  const verses = [];
  for (const chapter of scripture.chapters || []) {
    for (const verse of chapter.verses || []) verses.push(verse);
  }
  return verses;
}

function updateMatching(verses, required) {
  let changed = 0;
  const found = new Set();
  for (const verse of verses) {
    const ref = String(verse.number);
    const repair = REPAIRS[ref];
    if (!repair) continue;
    found.add(ref);
    if (verse.hindiSource !== "ai") {
      throw new Error(`${ref}: expected hindiSource=ai; preserving source text`);
    }
    if (LATIN.test(verse.hindi || "")) {
      verse.hindi = repair;
      changed++;
    } else if (required) {
      throw new Error(`${ref}: expected the known mixed-script Hindi source`);
    }
  }
  const missing = Object.keys(REPAIRS).filter((ref) => !found.has(ref));
  if (required && missing.length) throw new Error(`Repair references missing from file: ${missing.join(", ")}`);
  return changed;
}

const fullSource = fs.readFileSync(FULL_PATH, "utf8");
const full = JSON.parse(fullSource);
const targets = walkVerses(full).filter((verse) => verse.hindiSource === "ai" && LATIN.test(verse.hindi || ""));
const targetRefs = new Set(targets.map((verse) => String(verse.number)));
const mappingRefs = Object.keys(REPAIRS);
if (targetRefs.size !== mappingRefs.length || mappingRefs.some((ref) => !targetRefs.has(ref))) {
  throw new Error(
    `Source/mapping mismatch: ${targetRefs.size} flagged verses, ${mappingRefs.length} repairs`,
  );
}

const changedFull = updateMatching(walkVerses(full), true);
fs.writeFileSync(FULL_PATH, serializeLike(fullSource, full, 2), "utf8");

const shardFiles = fs.readdirSync(SHARD_DIR).filter((name) => /^ch-\d+\.json$/.test(name));
const shardRefs = new Set();
let changedShards = 0;
for (const name of shardFiles) {
  const filePath = path.join(SHARD_DIR, name);
  const source = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(source);
  const verses = data.chapter?.verses || [];
  const before = verses.filter((verse) => REPAIRS[String(verse.number)] && verse.hindiSource === "ai" && LATIN.test(verse.hindi || "")).length;
  const changed = updateMatching(verses, false);
  if (changed !== before) throw new Error(`${name}: shard update count changed unexpectedly`);
  for (const verse of verses) if (REPAIRS[String(verse.number)]) shardRefs.add(String(verse.number));
  if (changed) {
    changedShards += changed;
    fs.writeFileSync(filePath, serializeLike(source, data), "utf8");
  }
}

const missingShardRefs = mappingRefs.filter((ref) => !shardRefs.has(ref));
if (missingShardRefs.length || changedShards !== mappingRefs.length) {
  throw new Error(`Shard update incomplete: changed ${changedShards}; missing ${missingShardRefs.join(", ")}`);
}

console.log(`Repaired ${changedFull} Hindi meanings in the full scripture JSON and ${changedShards} across ${shardFiles.length} chapter shards.`);
