import fs from "node:fs";
import path from "node:path";
import type { HiCommentaryFragment } from "./_types";
import { canonicalVerseId } from "../../lib/canonical-verse-id";
import { aiCommentaryReviewHolds } from "./_ai-holds";

/** Review queue written by scripts/generate-verse-commentary.ts. */
export const AI_QUEUE_DIR = path.resolve("data/ai-commentary");
const FULL_DIR = path.resolve("public/data/scriptures-full");

interface QueuedEntry {
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  /** 'source-checked' means AI commentary passed a specific source-reading gate, NOT scholar reviewed. */
  status?: "pending" | "approved" | "rejected" | "source-checked";
  sanskritOpening?: string;
  sourceWitness?: string;
  sanskrit?: string;
  /** The draft's explanation replaces this verse's hand-written व्याख्या. */
  replacesHandWritten?: boolean;
}

const norm = (s = "") => s.replace(/[\s|।॥०-९\d.]/g, "");

/** Current Sanskrit per "chapter:verse", to catch drafts whose verse has since moved. */
function currentSanskrit(scriptureId: string): Map<string, string> {
  const out = new Map<string, string>();
  const file = path.join(FULL_DIR, `${scriptureId}.json`);
  if (!fs.existsSync(file)) return out;
  const book = JSON.parse(fs.readFileSync(file, "utf8")) as {
    chapters?: Array<{ number: number | string; verses?: Array<{ number: number | string; sanskrit?: string }> }>;
  };
  const ambiguous = new Set<string>();
  for (const ch of book.chapters ?? []) {
    for (const v of ch.verses ?? []) {
      // Match both the reader's canonical key and its raw-number fallback.
      const chapter = Number(ch.number);
      const number = Number(canonicalVerseId(chapter, v.number));
      const keys = new Set([`${chapter}:${v.number}`]);
      if (Number.isFinite(number)) keys.add(`${chapter}:${number}`);
      for (const key of keys) {
        if (out.has(key)) { out.delete(key); ambiguous.add(key); }
        else if (!ambiguous.has(key)) out.set(key, norm(v.sanskrit));
      }
    }
  }
  return out;
}

/**
 * Approved or explicitly Sanskrit-source-checked AI entries for one scripture, ready to publish. Pending and
 * rejected drafts are never returned, nor are drafts whose verse text no
 * longer matches what was reviewed (e.g. after a data repair renumbered it).
 */
export function approvedAiEntries(scriptureId: string): {
  entries: HiCommentaryFragment;
  stale: string[];
  /** Keys whose approved explanation replaces the hand-written one. */
  replaces: Set<string>;
} {
  const file = path.join(AI_QUEUE_DIR, `${scriptureId}.json`);
  const entries: HiCommentaryFragment = {};
  const stale: string[] = [];
  const replaces = new Set<string>();
  if (!fs.existsSync(file)) return { entries, stale, replaces };

  const queue = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, QueuedEntry>;
  const sanskritNow = currentSanskrit(scriptureId);
  const held = aiCommentaryReviewHolds(scriptureId);

  for (const [key, q] of Object.entries(queue)) {
    // Explicit editorial holds take precedence over old approved/source-checked flags.
    if (held.has(key)) continue;
    const sourceChecked = q.status === "source-checked";
    if (q.status !== "approved" && !sourceChecked) continue;
    if (sourceChecked) {
      // Explicitly allowlisted source-reading releases for Skandha 1 chapters 1 and 2, chapter 3 verses 1–43, and chapter 4 verses 1–30.
      // A source URL by itself never counts as independent scholarly review.
      const allowedVerse = scriptureId === "devibhagavat" &&
        /^(?:1:(?:[1-9]|1[0-9]|2[0-5])|2:(?:[1-9]|[1-3][0-9]|40)|3:(?:[1-9]|[1-3][0-9]|4[0-3])|4:(?:[1-9]|[12][0-9]|30))$/.test(key);
      const opening = norm(q.sanskritOpening ?? "");
      if (!allowedVerse || !opening || opening.length < 8 ||
        q.sourceWitness !== "https://sanskritdocuments.org/doc_purana/devIbhAgavatam01.html" ||
        !sanskritNow.get(key)?.includes(opening)) {
        stale.push(key);
        continue;
      }
    } else if (q.sanskrit && sanskritNow.get(key) !== norm(q.sanskrit)) {
      stale.push(key);
      continue;
    }
    const entry: HiCommentaryFragment[string] = { ai: true };
    if (q.explanation?.trim()) entry.explanation = q.explanation.trim();
    if (q.science?.trim()) entry.science = q.science.trim();
    if (q.lifeLesson?.trim()) entry.lifeLesson = q.lifeLesson.trim();
    if (entry.explanation || entry.science || entry.lifeLesson) entries[key] = entry;
    if (q.replacesHandWritten && entry.explanation) replaces.add(key);
  }
  return { entries, stale, replaces };
}

export function aiQueueScriptureIds(): string[] {
  if (!fs.existsSync(AI_QUEUE_DIR)) return [];
  return fs
    .readdirSync(AI_QUEUE_DIR)
    // <id>-research.json holds rewritten research notes, not a queue.
    .filter((f) => f.endsWith(".json") && !f.endsWith("-research.json"))
    .map((f) => path.basename(f, ".json"));
}
