/** Stage one chapter as pending. Replacements remain separate until approval. */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { sourceVerses, uniqueSource } from "./lib/commentary-source.mjs";

const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith("--"));
const files = args.filter(a => !a.startsWith("--"));
if (files.length !== 1 || flags.some(f => f !== "--replace")) {
  console.error("usage: node scripts/stage-commentary.mjs <scripture-chapter.json> [--replace]");
  process.exit(2);
}
const match = path.basename(files[0], ".json").match(/^([a-z0-9-]+)-(\d+)$/);
if (!match) throw new Error("Name the file <scripture>-<chapter>.json");
const [, id, chapter] = match;
const read = p => JSON.parse(fs.readFileSync(p, "utf8"));
const drafts = read(files[0]);
if (!drafts || Array.isArray(drafts) || typeof drafts !== "object" || !Object.keys(drafts).length) throw new Error("Draft file must contain verse entries");
const queuePath = path.resolve("data/ai-commentary", `${id}.json`);
const originalQueue = fs.existsSync(queuePath) ? fs.readFileSync(queuePath, "utf8") : null;
const queue = originalQueue === null ? {} : JSON.parse(originalQueue);
const source = sourceVerses(id);
const replacement = flags.includes("--replace");
const prepared = {};
for (const [key, draft] of Object.entries(drafts)) {
  if (!key.startsWith(`${Number(chapter)}:`)) throw new Error(`${key}: outside chapter ${chapter}`);
  if (!draft || typeof draft.explanation !== "string" || !draft.explanation.trim()) throw new Error(`${key}: empty explanation`);
  if (draft.confidence && !["high", "medium", "low"].includes(draft.confidence)) throw new Error(`${key}: invalid confidence`);
  if (draft.reviewNote != null && typeof draft.reviewNote !== "string") throw new Error(`${key}: reviewNote must be text`);
  if (queue[key]) {
    if (!replacement) throw new Error(`${key}: entry already exists; use --replace to propose a replacement`);
  } else if (replacement) {
    throw new Error(`${key}: --replace requires an existing entry; stage new entries separately`);
  }
  prepared[key] = { explanation: draft.explanation.trim(), science: "", lifeLesson: "", confidence: draft.confidence ?? "high", reviewNote: draft.reviewNote ?? "", status: "pending", model: draft.model ?? "unknown", generatedAt: new Date().toISOString(), sanskrit: uniqueSource(source, key), ...(replacement ? { replacesQueueSnapshot: queue[key] } : {}) };
}
const currentQueue = fs.existsSync(queuePath) ? fs.readFileSync(queuePath, "utf8") : null;
if (currentQueue !== originalQueue) throw new Error("Queue changed during staging; retry after reviewing current entries");
const outputPath = replacement ? path.resolve("data/ai-commentary/proposals", `${id}.json`) : queuePath;
const originalOutput = replacement && fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : replacement ? null : originalQueue;
const output = replacement ? (originalOutput === null ? {} : JSON.parse(originalOutput)) : queue;
for (const key of Object.keys(prepared)) if (replacement && output[key]) throw new Error(`${key}: a replacement proposal already exists`);
Object.assign(output, prepared);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const currentOutput = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
if (currentOutput !== originalOutput) throw new Error("Output changed during staging; retry after reviewing current entries");
const tmp = `${outputPath}.${randomUUID()}.tmp`;
try { fs.writeFileSync(tmp, JSON.stringify(output, null, 2) + "\n", { flag: "wx" }); fs.renameSync(tmp, outputPath); }
finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
console.log(`${id}: ${Object.keys(prepared).length} ${replacement ? "replacement proposals" : "pending entries"} staged; approve explicitly before publishing`);
