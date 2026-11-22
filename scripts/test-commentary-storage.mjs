/**
 * Published commentary is stored one file per section (docs/commentary-storage.md). This check keeps it that way:
 * no per-book file comes back, every file holds only its own section's keys, no file nears Cloudflare's 25 MiB
 * limit, and the split and merge helpers round-trip a record exactly.
 *
 *   node scripts/test-commentary-storage.mjs
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  commentaryCandidateKeys,
  commentaryUnitOf,
  commentaryUnitsForVerses,
  commentaryUnitUrl,
} from "../lib/commentary-units.mjs";
import {
  legacyPublishedFiles,
  publishedCommentaryIds,
  publishedDir,
  readRecord,
  recordSnapshot,
  removeRecord,
  unitFiles,
  UNIT_MAX_BYTES,
  writeRecord,
} from "./lib/commentary-store.mjs";

// ── Where a key goes ──
assert.equal(commentaryUnitOf("2:47"), "2-b0");
assert.equal(commentaryUnitOf("2:250"), "2-b0");
assert.equal(commentaryUnitOf("2:251"), "2-b1");
assert.equal(commentaryUnitOf("1:5.12"), "1-s5");
assert.equal(commentaryUnitOf("1:1.3.3"), "1-s1");
assert.equal(commentaryUnitOf("4:2.d3"), "4-s2");
assert.equal(commentaryUnitOf("3:12a"), "3-b0");
assert.equal(commentaryUnitOf("3:abc"), "3-x");
assert.equal(commentaryUnitOf("07:005.3"), "7-s5");
assert.equal(commentaryUnitOf("no-colon"), null);
assert.deepEqual(commentaryCandidateKeys(1, "1.9"), ["1:1.9", "1:9"]);
assert.deepEqual(commentaryCandidateKeys(2, 47), ["2:47"]);
assert.deepEqual(commentaryUnitsForVerses(1, ["1.9", "1.10", "2.1"]), ["1-s1", "1-b0", "1-s2"]);
assert.equal(commentaryUnitUrl("", "", "gita", "2-b0"), "/data/hi-commentary/gita/2-b0.json");
assert.equal(commentaryUnitUrl("https://c.example/", "/base", "gita", "2-b0"), "https://c.example/data/hi-commentary/gita/2-b0.json");

// ── Write and read back ──
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "commentary-storage-"));
try {
  const record = { "2:10": { explanation: "क" }, "2:2.10": { explanation: "ख" }, "1:300": { explanation: "ग" }, "1:1": { explanation: "घ" } };
  const base = path.join(tmp, "book");
  const stats = writeRecord(base, record, { split: "always", stringify: (v) => JSON.stringify(v) });
  assert.equal(stats.files, 4);
  assert.deepEqual(unitFiles(base), ["1-b0.json", "1-b1.json", "2-b0.json", "2-s2.json"]);
  assert.deepEqual(readRecord(base), { "1:1": record["1:1"], "1:300": record["1:300"], "2:10": record["2:10"], "2:2.10": record["2:2.10"] });
  // Rewriting the same record touches nothing; dropping a section deletes its file.
  assert.equal(writeRecord(base, record, { split: "always", stringify: (v) => JSON.stringify(v) }).written, 0);
  const { "1:300": _dropped, ...rest } = record;
  assert.equal(writeRecord(base, rest, { split: "always", stringify: (v) => JSON.stringify(v) }).removed, 1);
  assert.ok(!fs.existsSync(path.join(base, "1-b1.json")));
  // A key stored twice (a per-book file left beside its folder) is refused, not silently merged.
  fs.writeFileSync(`${base}.json`, JSON.stringify({ "2:10": { explanation: "दूसरा" } }));
  assert.throws(() => readRecord(base), /stored twice/);
  fs.unlinkSync(`${base}.json`);
  // A source record stays one file until it is large, and stays a folder once it is one.
  const queue = path.join(tmp, "queue");
  writeRecord(queue, { "1:1": { status: "pending" } });
  assert.ok(fs.existsSync(`${queue}.json`) && unitFiles(queue).length === 0);
  const before = recordSnapshot(queue);
  writeRecord(queue, { "1:1": { status: "approved" } });
  assert.notEqual(recordSnapshot(queue), before);
  removeRecord(queue);
  fs.mkdirSync(queue);
  writeRecord(queue, { "1:1": { status: "pending" }, "5:3.1": { status: "pending" } });
  assert.deepEqual(unitFiles(queue), ["1-b0.json", "5-s3.json"]);
  assert.ok(!fs.existsSync(`${queue}.json`));
  assert.throws(() => writeRecord(queue, { "not a key": {} }), /chapter:verse/);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

// ── The published folder ──
const legacy = legacyPublishedFiles();
assert.deepEqual(legacy, [], `Per-book commentary files are back in public/data/hi-commentary (${legacy.join(", ")}); run npm run publish:commentary`);
let files = 0;
let entries = 0;
for (const id of publishedCommentaryIds()) {
  const dir = path.join(publishedDir(), id);
  const strays = fs.readdirSync(dir).filter((f) => !unitFiles(dir).includes(f));
  assert.deepEqual(strays, [], `${id}: unexpected files in the published folder`);
  for (const f of unitFiles(dir)) {
    const file = path.join(dir, f);
    const size = fs.statSync(file).size;
    assert.ok(size <= UNIT_MAX_BYTES, `${id}/${f} is ${(size / 1048576).toFixed(1)} MB`);
    const unit = f.slice(0, -5);
    const part = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const key of Object.keys(part)) {
      assert.equal(commentaryUnitOf(key), unit, `${id}/${f} holds ${key}, which belongs in ${commentaryUnitOf(key)}.json`);
      entries++;
    }
    files++;
  }
}
console.log(`✓ Published commentary: ${entries} entries in ${files} section files, each in its own section.`);
