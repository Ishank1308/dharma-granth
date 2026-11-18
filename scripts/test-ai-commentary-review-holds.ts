/** Regression: no newly staged Yajurveda AI notes publish before editorial review. */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aiCommentaryReviewHolds } from "../data/hi-commentary/_ai-holds";
import { approvedAiEntries } from "../data/hi-commentary/_ai-queue";

const scripture = "yajurveda";
const held = aiCommentaryReviewHolds(scripture);
const queue = JSON.parse(readFileSync("data/ai-commentary/yajurveda.json", "utf8")) as Record<
  string, { status?: string; confidence?: string; sanskrit?: string }
>;
const publishedFromQueue = approvedAiEntries(scripture).entries;

// The 990 *new* queue entries were machine-assisted drafts, not human-approved
// meanings. Neither a passing CI test nor a medium confidence score approves one.
assert.equal(held.size, 990, "Every new Yajurveda draft must stay on review hold");
let low = 0;
let medium = 0;
for (const key of held) {
  assert.match(key, /^[0-9]+:[0-9]+$/, `Invalid held verse key: ${key}`);
  const draft = queue[key];
  assert.ok(draft, `Missing held AI draft at ${key}`);
  assert.equal(draft.status, "approved", `Unexpected queue status at ${key}`);
  assert.ok(draft.sanskrit?.trim(), `Missing Sanskrit witness for ${key}`);
  assert.ok(!publishedFromQueue[key], `Editorial hold leaked into approved AI queue: ${key}`);
  if (draft.confidence === "low") low++;
  else if (draft.confidence === "medium") medium++;
  else assert.fail(`Unexpected confidence for held verse ${key}: ${draft.confidence}`);
}
assert.equal(low, 283);
assert.equal(medium, 707);
console.log(`✓ ${held.size} new Yajurveda AI drafts held (low: ${low}, medium: ${medium}) pending editorial review.`);
