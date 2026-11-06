/**
 * Move a staged chapter of व्याख्या drafts into the AI commentary queue as
 * approved (see docs/vyakhya-guide.md). One staged file per chapter, so several
 * tools can draft in parallel:
 *
 *   node scripts/stage-commentary.mjs data/ai-commentary/staged/bhagavadgita-04.json [--force]
 *
 * For each verse it records the current Sanskrit (so a later text repair marks
 * the entry stale), flags verses whose published व्याख्या is hand-written so the
 * draft replaces it, and refuses to overwrite an already approved entry unless
 * --force is passed. Then run `npm run publish:commentary`.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const force = args.includes("--force");
const files = args.filter((a) => !a.startsWith("--"));
if (!files.length) {
  console.error("usage: node scripts/stage-commentary.mjs <data/ai-commentary/staged/<scripture>-<chapter>.json> [--force]");
  process.exit(2);
}

const readJson = (p, fallback) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback);

for (const file of files) {
  const m = path.basename(file, ".json").match(/^(.+)-\d+$/);
  if (!m) throw new Error(`${file}: name it <scripture>-<chapter>.json, e.g. bhagavadgita-04.json`);
  const scriptureId = m[1];

  const drafts = readJson(file, {});
  const book = readJson(path.resolve("public/data/scriptures-full", `${scriptureId}.json`), null);
  if (!book) throw new Error(`${scriptureId}: no public/data/scriptures-full/${scriptureId}.json`);
  const published = readJson(path.resolve("public/data/hi-commentary", `${scriptureId}.json`), {});
  const queuePath = path.resolve("data/ai-commentary", `${scriptureId}.json`);
  const queue = readJson(queuePath, {});

  const sanskrit = new Map();
  for (const ch of book.chapters ?? []) {
    for (const v of ch.verses ?? []) {
      sanskrit.set(`${Number(ch.number)}:${Number(v.number)}`, v.sanskrit);
      // Full-number keys ("1:56.33"), used where short keys collide (lib/verse-commentary-key.ts).
      sanskrit.set(`${Number(ch.number)}:${String(v.number).trim()}`, v.sanskrit);
    }
  }

  const now = new Date().toISOString();
  let staged = 0;
  let replaced = 0;
  for (const [key, d] of Object.entries(drafts)) {
    if (!sanskrit.has(key)) throw new Error(`${scriptureId} ${key}: no such verse in the published book`);
    if (!d.explanation?.trim()) throw new Error(`${scriptureId} ${key}: empty explanation`);
    if (queue[key]?.status === "approved" && !force) {
      throw new Error(`${scriptureId} ${key}: already approved in the queue; pass --force to replace it`);
    }
    const pub = published[key];
    // A published व्याख्या that is not a fully AI entry is hand-written (or a draft that already replaced one).
    const replacesHandWritten = Boolean(pub?.explanation && !pub.ai);
    queue[key] = {
      explanation: d.explanation.trim(),
      science: "",
      lifeLesson: "",
      confidence: d.confidence ?? "high",
      reviewNote: d.reviewNote ?? "",
      status: "approved",
      model: d.model ?? "claude-opus-5-5",
      generatedAt: now,
      sanskrit: sanskrit.get(key),
      ...(replacesHandWritten ? { replacesHandWritten: true } : {}),
    };
    staged++;
    if (replacesHandWritten) replaced++;
  }

  const order = (k) => k.split(":").map(Number);
  const sorted = Object.fromEntries(
    Object.entries(queue).sort(([a], [b]) => {
      const [x, y] = order(a);
      const [p, q] = order(b);
      return x - p || y - q;
    }),
  );
  fs.mkdirSync(path.dirname(queuePath), { recursive: true });
  fs.writeFileSync(queuePath, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`${path.basename(file)}: ${staged} approved into ${path.relative(process.cwd(), queuePath)} (${replaced} replace hand-written व्याख्या)`);
}
