/** Approve the explicitly named pending entries after inspecting their notes. */
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { sourceVerses, uniqueSource } from "./lib/commentary-source.mjs";

const [id, ...args] = process.argv.slice(2);
const keys = args.filter(a => !a.startsWith("--"));
const flags = args.filter(a => a.startsWith("--"));
if (!id || !keys.length || flags.some(f => !["--replace-handwritten", "--replacement", "--show"].includes(f)) || new Set(keys).size !== keys.length) {
  console.error("usage: node scripts/approve-commentary.mjs <scripture> <chapter:verse>... [--show] [--replacement] [--replace-handwritten]");
  process.exit(2);
}
const source = sourceVerses(id);
const queuePath = path.resolve("data/ai-commentary", `${id}.json`);
const originalQueue = fs.readFileSync(queuePath, "utf8");
const queue = JSON.parse(originalQueue);
const replacement = flags.includes("--replacement");
const proposalPath = path.resolve("data/ai-commentary/proposals", `${id}.json`);
const originalProposals = replacement ? fs.readFileSync(proposalPath, "utf8") : null;
const proposals = replacement ? JSON.parse(originalProposals) : {};
const publishedPath = path.resolve("public/data/hi-commentary", `${id}.json`);
const published = fs.existsSync(publishedPath) ? JSON.parse(fs.readFileSync(publishedPath, "utf8")) : {};
for (const key of keys) {
  const item = replacement ? proposals[key] : queue[key];
  if (!item || item.status !== "pending") throw new Error(`${key}: not pending`);
  if (replacement && JSON.stringify(item.replacesQueueSnapshot) !== JSON.stringify(queue[key])) throw new Error(`${key}: original entry changed since proposal; review it again`);
  if (!item.explanation?.trim()) throw new Error(`${key}: empty explanation`);
  if (item.sanskrit !== uniqueSource(source, key)) throw new Error(`${key}: Sanskrit changed; review against current source`);
  console.log(`${id} ${key} confidence=${item.confidence ?? "unspecified"} reviewNote=${item.reviewNote || "(none)"}`);
  if (replacement && queue[key]?.status !== "approved" && (queue[key]?.science || queue[key]?.lifeLesson)) {
    console.log(`${id} ${key}: existing unreviewed research/life fields will be retained separately and not published`);
  }
}
if (flags.includes("--show")) {
  console.log("Preview only; no entries approved.");
  process.exit(0);
}
if (fs.readFileSync(queuePath, "utf8") !== originalQueue) throw new Error("Queue changed during approval; retry after reviewing current entries");
if (replacement && fs.readFileSync(proposalPath, "utf8") !== originalProposals) throw new Error("Proposals changed during approval; retry after review");
if (replacement) {
  const dir = path.resolve("data/ai-commentary/history", id);
  fs.mkdirSync(dir, { recursive: true });
  const backup = path.join(dir, `${Date.now()}-${randomUUID()}.json`);
  fs.writeFileSync(backup, JSON.stringify(Object.fromEntries(keys.map(key => [key, queue[key]])), null, 2) + "\n", { flag: "wx" });
  console.log(`Previous entries saved to ${path.relative(process.cwd(), backup)}`);
}
for (const key of keys) {
  const pub = published[key];
  if (replacement) {
    const previous = queue[key];
    const { replacesQueueSnapshot: _old, ...candidate } = proposals[key];
    const held = { ...(previous.unreviewedFields ?? {}) };
    if (previous.status !== "approved") {
      if (previous.science) held.science = previous.science;
      if (previous.lifeLesson) held.lifeLesson = previous.lifeLesson;
    }
    queue[key] = {
      ...candidate,
      science: previous.status === "approved" ? previous.science ?? "" : "",
      lifeLesson: previous.status === "approved" ? previous.lifeLesson ?? "" : "",
      ...(Object.keys(held).length ? { unreviewedFields: held } : {}),
    };
  }
  queue[key].status = "approved";
  if (flags.includes("--replace-handwritten") && pub?.explanation && !pub.ai) queue[key].replacesHandWritten = true;
  else delete queue[key].replacesHandWritten;
}
const tmp = `${queuePath}.${randomUUID()}.tmp`;
try { fs.writeFileSync(tmp, JSON.stringify(queue, null, 2) + "\n", { flag: "wx" }); fs.renameSync(tmp, queuePath); }
finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
if (replacement) {
  if (fs.readFileSync(proposalPath, "utf8") !== originalProposals) console.warn("Proposals changed during approval; approved proposals were not removed automatically.");
  else {
    for (const key of keys) delete proposals[key];
    const proposalTmp = `${proposalPath}.${randomUUID()}.tmp`;
    try { fs.writeFileSync(proposalTmp, JSON.stringify(proposals, null, 2) + "\n", { flag: "wx" }); fs.renameSync(proposalTmp, proposalPath); }
    finally { if (fs.existsSync(proposalTmp)) fs.unlinkSync(proposalTmp); }
  }
}
console.log(`${keys.length} entries approved; run npm run publish:commentary to publish locally`);
