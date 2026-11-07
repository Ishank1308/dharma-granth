import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

test("commentary staging protects drafts and approval checks the source", () => {
  const root = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "commentary-workflow-"));
  const stage = path.join(root, "scripts/stage-commentary.mjs");
  const approve = path.join(root, "scripts/approve-commentary.mjs");
  const tsx = path.join(root, "node_modules/tsx/dist/cli.mjs");
  const checker = path.join(root, "scripts/check-commentary-keys.ts");
  const run = (script, args, succeeds = true) => {
    const result = spawnSync(process.execPath, [script, ...args], { cwd: tmp, encoding: "utf8" });
    assert.equal(result.status === 0, succeeds, result.stderr + result.stdout);
    return result;
  };
  try {
    for (const dir of ["public/data/scriptures-full", "public/data/hi-commentary", "data/ai-commentary/staged"]) fs.mkdirSync(path.join(tmp, dir), { recursive: true });
    const source = path.join(tmp, "public/data/scriptures-full/testbook.json");
    const book = { chapters: [{ number: 2, verses: [{ number: "2.10", sanskrit: "धर्मः" }, { number: 11, sanskrit: "सत्यम्" }] }] };
    const writeSource = () => fs.writeFileSync(source, JSON.stringify(book));
    writeSource();
    const draft = path.join(tmp, "data/ai-commentary/staged/testbook-02.json");
    fs.writeFileSync(draft, JSON.stringify({ "2:10": { explanation: "व्याख्या", confidence: "medium", reviewNote: "समीक्षा", model: "fixture" } }));
    const queuePath = path.join(tmp, "data/ai-commentary/testbook.json");
    const read = () => JSON.parse(fs.readFileSync(queuePath, "utf8"));

    run(stage, [draft]);
    assert.equal(read()["2:10"].status, "pending");
    const pendingWithFields = read();
    pendingWithFields["2:10"].science = "असमीक्षित शोध";
    pendingWithFields["2:10"].lifeLesson = "असमीक्षित सीख";
    fs.writeFileSync(queuePath, JSON.stringify(pendingWithFields));
    const previous = fs.readFileSync(queuePath, "utf8");
    run(stage, [draft], false);
    assert.equal(fs.readFileSync(queuePath, "utf8"), previous);
    run(stage, [draft, "--replace"]);
    assert.equal(fs.readFileSync(queuePath, "utf8"), previous);
    run(stage, [draft, "--replace"], false);
    const preview = run(approve, ["testbook", "2:10", "--replacement", "--show"]);
    assert.match(preview.stdout, /समीक्षा/);
    assert.equal(read()["2:10"].status, "pending");
    book.chapters[0].verses[0].sanskrit = "परिवर्तनम्";
    writeSource();
    run(approve, ["testbook", "2:10", "--replacement"], false);
    assert.equal(read()["2:10"].status, "pending");
    book.chapters[0].verses[0].sanskrit = "धर्मः";
    writeSource();
    const altered = read();
    altered["2:10"].reviewNote = "changed by another editor";
    fs.writeFileSync(queuePath, JSON.stringify(altered));
    run(approve, ["testbook", "2:10", "--replacement"], false);
    fs.writeFileSync(queuePath, previous);

    fs.writeFileSync(path.join(tmp, "public/data/hi-commentary/testbook.json"), JSON.stringify({ "2:2.10": { explanation: "मानवीय" }, "2:10": { explanation: "मानवीय" } }));
    run(tsx, [checker, "--scripture", "testbook"]);
    run(approve, ["testbook", "2:10", "--replacement"]);
    assert.equal(read()["2:10"].status, "approved");
    assert.equal(read()["2:10"].replacesHandWritten, undefined);
    assert.equal(read()["2:10"].science, "");
    assert.equal(read()["2:10"].lifeLesson, "");
    assert.deepEqual(read()["2:10"].unreviewedFields, { science: "असमीक्षित शोध", lifeLesson: "असमीक्षित सीख" });
    const history = path.join(tmp, "data/ai-commentary/history/testbook");
    const backups = fs.readdirSync(history);
    assert.equal(backups.length, 1);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(history, backups[0]), "utf8"))["2:10"], JSON.parse(previous)["2:10"]);
    const approvedWithFields = read();
    approvedWithFields["2:10"].science = "समीक्षित शोध";
    approvedWithFields["2:10"].lifeLesson = "समीक्षित सीख";
    fs.writeFileSync(queuePath, JSON.stringify(approvedWithFields));
    run(stage, [draft], false);
    run(stage, [draft, "--replace"]);
    assert.equal(read()["2:10"].status, "approved");
    run(approve, ["testbook", "2:10", "--replacement", "--replace-handwritten"]);
    assert.equal(read()["2:10"].replacesHandWritten, true);
    assert.equal(read()["2:10"].science, "समीक्षित शोध");
    assert.equal(read()["2:10"].lifeLesson, "समीक्षित सीख");

    const queue = read();
    queue["2:2.10"] = { ...queue["2:10"], replacesHandWritten: false };
    delete queue["2:10"];
    fs.writeFileSync(queuePath, JSON.stringify(queue));
    const moduleUrl = pathToFileURL(path.join(root, "data/hi-commentary/_ai-queue.ts")).href;
    const expression = `import(${JSON.stringify(moduleUrl)}).then(m => { const r = m.approvedAiEntries('testbook'); if (!r.entries['2:2.10'] || r.stale.length) process.exit(1); });`;
    run(tsx, ["-e", expression]);
    queue["2:999"] = { status: "pending", sanskrit: "अन्य" };
    fs.writeFileSync(queuePath, JSON.stringify(queue));
    const invalid = run(tsx, [checker, "--scripture", "testbook"], false);
    assert.match(invalid.stderr, /2:999/);
    fs.writeFileSync(draft, JSON.stringify({ "2:11": { explanation: "नया", confidence: "high" } }));
    run(stage, [draft]);
    assert.equal(read()["2:11"].status, "pending");
    run(approve, ["testbook", "2:11"]);
    assert.equal(read()["2:11"].status, "approved");
  } finally {
    const resolved = path.resolve(tmp);
    if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith("commentary-workflow-")) throw new Error("Unsafe temporary path");
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});

test("key report distinguishes shard differences and shadowed raw keys", () => {
  const root = process.cwd();
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "commentary-workflow-"));
  try {
    for (const dir of ["public/data/scriptures-full/testbook", "public/data/hi-commentary", "data/ai-commentary"]) fs.mkdirSync(path.join(tmp, dir), { recursive: true });
    const book = JSON.stringify({ chapters: [{ number: 2, verses: [{ number: "2.10", sanskrit: "धर्मः" }] }] });
    fs.writeFileSync(path.join(tmp, "public/data/scriptures-full/testbook.json"), book);
    fs.writeFileSync(path.join(tmp, "public/data/scriptures-full/testbook/ch-2.json"), JSON.stringify({ chapter: { verses: [{ number: "2.11", sanskrit: "सत्यम्" }, { number: "3.11", sanskrit: "भिन्नम्" }] } }));
    fs.writeFileSync(path.join(tmp, "public/data/hi-commentary/testbook.json"), JSON.stringify({ "2:10": {}, "2:11": {}, "2:2.11": {}, "2:99": {} }));
    fs.writeFileSync(path.join(tmp, "data/ai-commentary/testbook.json"), JSON.stringify({ "2:10": { status: "pending", sanskrit: "भिन्नः" } }));
    const out = path.join(tmp, "report.json");
    const cli = path.join(root, "node_modules/tsx/dist/cli.mjs");
    const script = path.join(root, "scripts/report-commentary-keys.ts");
    const args = [cli, script, "--out", out, "--scripture", "testbook"];
    const result = spawnSync(process.execPath, args, { cwd: tmp, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(fs.readFileSync(out, "utf8"));
    const finding = (kind, key) => report.findings.find(f => f.kind === kind && f.key === key);
    assert.ok(finding("published", "2:10").reasons.includes("reader_monolith_disagree"));
    assert.equal(finding("published", "2:2.11").readerMatches[0].selectedKey, "2:2.11");
    assert.ok(finding("published", "2:11").reasons.includes("reader_alias_suppressed"));
    assert.equal(finding("published", "2:11").readerMatchCount, 2);
    assert.ok(finding("published", "2:99").reasons.includes("reader_key_unmatched"));
    assert.ok(finding("queue", "2:10").reasons.includes("snapshot_stale"));
    assert.equal(fs.readFileSync(path.join(tmp, "public/data/scriptures-full/testbook.json"), "utf8"), book);
    assert.notEqual(spawnSync(process.execPath, args, { cwd: tmp, encoding: "utf8" }).status, 0);
  } finally {
    const resolved = path.resolve(tmp);
    if (!resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) || !path.basename(resolved).startsWith("commentary-workflow-")) throw new Error("Unsafe temporary path");
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});
