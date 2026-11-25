/** Regression: editorial review holds block publication; all 990 Yajurveda 18-40 entries are now verified high-confidence and published. */
import assert from "node:assert/strict";
import { aiCommentaryReviewHolds } from "../data/hi-commentary/_ai-holds";
import { approvedAiEntries } from "../data/hi-commentary/_ai-queue";
import { readPublishedCommentary, readRecord } from "./lib/commentary-store.mjs";

const scripture = "yajurveda";
const held = aiCommentaryReviewHolds(scripture);
const queue = readRecord("data/ai-commentary/yajurveda") as Record<
  string, { status?: string; confidence?: string; sanskrit?: string; explanation?: string; lifeLesson?: string }
>;
// What readers get: the per-section files written by npm run publish:commentary (docs/commentary-storage.md).
const published = readPublishedCommentary(scripture) as Record<string, { explanation?: string; lifeLesson?: string; ai?: boolean }>;
const publishedFromQueue = approvedAiEntries(scripture).entries;

// Hold-gate invariant: any key present in review-holds/<scripture>.json must never leak to readers.
for (const key of held) {
  assert.match(key, /^[0-9]+:[0-9]+$/, `Invalid held verse key: ${key}`);
  const draft = queue[key];
  assert.ok(draft, `Missing held AI draft at ${key}`);
  assert.ok(!publishedFromQueue[key], `Editorial hold leaked into approved AI queue: ${key}`);
  if (draft.explanation?.trim()) {
    assert.notEqual(published[key]?.explanation, draft.explanation.trim(), `Held draft published to readers: ${key}`);
  }
}

// All 990 formerly held Yajurveda 18:37..40:17 entries were replaced with verified high-confidence entries in Wave 12.
assert.equal(held.size, 0, "Expected 0 remaining Yajurveda review holds after Wave 12");
let verified18To40 = 0;
for (const [key, entry] of Object.entries(queue)) {
  const [ch, v] = key.split(":").map(Number);
  if (ch < 18 || (ch === 18 && v < 37)) continue;
  verified18To40++;
  assert.equal(entry.status, "approved", `Expected approved status at ${key}`);
  assert.equal(entry.confidence, "high", `Expected high confidence at ${key}`);
  assert.ok(entry.sanskrit?.trim(), `Missing Sanskrit witness at ${key}`);
  assert.ok(entry.explanation?.trim(), `Missing explanation at ${key}`);
  assert.ok(entry.lifeLesson?.trim(), `Missing lifeLesson at ${key}`);
  assert.ok(publishedFromQueue[key], `Verified Yajurveda entry missing from approved AI queue: ${key}`);
  assert.ok(published[key]?.explanation?.trim(), `Verified Yajurveda entry not published to readers: ${key}`);
}
assert.equal(verified18To40, 990, "Expected all 990 Yajurveda 18:37..40:17 entries to be verified high-confidence and published");
console.log(`✓ 0 Yajurveda review holds remaining; all ${verified18To40} Yajurveda 18:37–40:17 entries verified high-confidence and published.`);
