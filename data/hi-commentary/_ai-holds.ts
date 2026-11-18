/**
 * Explicit per-verse editorial holds for AI commentary.
 *
 * A hold denies automatic publication even when an imported queue entry is
 * labelled "approved". It does not alter the Sanskrit or the existing
 * hand-written commentary and does not grant approval when the key is removed.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.resolve("data/ai-commentary/review-holds");

export function aiCommentaryReviewHolds(scriptureId: string): Set<string> {
  if (!/^[a-z0-9-]+$/.test(scriptureId)) throw new Error("Invalid scripture id");
  const file = path.join(DIR, `${scriptureId}.json`);
  if (!fs.existsSync(file)) return new Set();
  const payload = JSON.parse(fs.readFileSync(file, "utf8")) as {
    scripture?: string;
    keys?: unknown;
  };
  if (payload.scripture !== scriptureId ||
      !Array.isArray(payload.keys) ||
      payload.keys.some((key) => typeof key !== "string" || !/^\d+:\d+(?:\.\d+)?$/.test(key))) {
    throw new Error(`Invalid editorial review hold registry for ${scriptureId}`);
  }
  if (new Set(payload.keys).size !== payload.keys.length) {
    throw new Error(`Duplicate editorial hold key for ${scriptureId}`);
  }
  return new Set(payload.keys);
}
