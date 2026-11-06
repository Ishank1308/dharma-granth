import fs from "node:fs";
import path from "node:path";
import type { HiCommentaryFragment } from "./_types";
import { sharedShortKeys, verseCommentaryKeys } from "../../lib/verse-commentary-key";

/** Review queue written by scripts/generate-verse-commentary.ts. */
export const AI_QUEUE_DIR = path.resolve("data/ai-commentary");
const FULL_DIR = path.resolve("public/data/scriptures-full");

interface QueuedEntry {
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  status?: "pending" | "approved" | "rejected";
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
  for (const ch of book.chapters ?? []) {
    const chapterId = Number(ch.number);
    const verses = ch.verses ?? [];
    const shared = sharedShortKeys(chapterId, verses.map((v) => v.number));
    for (const v of verses) {
      // Same keys the reader tries (lib/verse-commentary-key.ts): dotted numbers like "2.1.1" in reader
      // chapter 7 key as "7:1", and verses whose short key collides only by their full number ("1:56.33").
      for (const key of verseCommentaryKeys(chapterId, v.number, shared)) out.set(key, norm(v.sanskrit));
    }
  }
  return out;
}

/**
 * Approved AI entries for one scripture, ready to publish. Pending and
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

  for (const [key, q] of Object.entries(queue)) {
    if (q.status !== "approved") continue;
    if (q.sanskrit && sanskritNow.get(key) !== norm(q.sanskrit)) {
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
