import assert from "node:assert/strict";
import { assertWrittenMeaningsReady } from "./lib/written-meaning-review";

assert.doesNotThrow(() => assertWrittenMeaningsReady("approved", { note: "Independently reviewed Sanskrit meanings." }));
assert.doesNotThrow(() => assertWrittenMeaningsReady("legacy", { note: "Meanings written for this site." }));
assert.throws(() => assertWrittenMeaningsReady("devibhagavat", { note: "UNREVIEWED DRAFT: check each verse" }), /explicitly unreviewed/);
assert.throws(() => assertWrittenMeaningsReady("devibhagavat", { reviewStatus: "draft" }), /explicitly unreviewed/);
assert.throws(() => assertWrittenMeaningsReady("devibhagavat", { reviewStatus: "needs-review" }), /explicitly unreviewed/);
console.log("✓ Explicitly unreviewed written meaning files are blocked from publication.");
