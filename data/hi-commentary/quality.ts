import type { HiCommentaryEntry } from "./_types";

/** Known machine-generated English templates (prefix match). */
export const BOILERPLATE_PREFIXES = [
  "Modern psychology and neuroscience increasingly validate ancient insights",
  "Ecopsychology: exposure to natural environments reduces cortisol",
  "Behavioral psychology (Bandura): every action creates neural pathways",
  "Meditation research (Davidson): sustained practice thickens the prefrontal cortex",
  "Evolutionary psychology: moral behavior evolved as a survival strategy",
  "Psychology of authenticity (Harter)",
  "Neuroscience of devotion (Newberg)",
  "Cognitive neuroscience: insight emerges from gamma-wave synchrony",
  "Reflect on this verse's teaching and find one practical way to apply it",
  "Ancient wisdom becomes living wisdom only when practiced",
] as const;

const DEVANAGARI = /[\u0900-\u097F]/;

export function hasDevanagari(text: string): boolean {
  return DEVANAGARI.test(text);
}

export function isBoilerplateField(text: string | undefined): boolean {
  if (!text || !text.trim()) return false;
  const trimmed = text.trim();
  if (!hasDevanagari(trimmed)) return true;
  return BOILERPLATE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

/**
 * Scriptures whose research notes (`science`) were bulk-generated as the
 * verse's own Hindi translation plus a stock sentence. Their filler notes are
 * left out at publish time; the source data is untouched.
 */
export const TRANSLATION_ECHO_SCRIPTURES = new Set(["bhagavadgita"]);

/** The stock sentences those generated notes end with (substring match). */
const STOCK_NOTE_FRAGMENTS = [
  "एक नियम की तरह",
  "वेगस तंत्रिका",
  "बार-बार मन में आता है",
  "अगली प्रवृत्ति को मजबूत",
  "जानने का बोध बना रहता",
  "खतरे की तैयारी छोड़कर",
  "एक ही प्राकृतिक चक्र",
  "इंद्रिय-भार",
];

const compact = (s: string) => s.replace(/[\s\-–—|।॥०-९0-9.,;:!?()'"]/g, "");

/** A note that opens with the verse's own Hindi translation, or ends in a stock sentence. */
export function isTranslationEchoNote(text: string | undefined, verseHindi: string | undefined): boolean {
  if (!text || !text.trim()) return false;
  const lead = compact(verseHindi ?? "").slice(0, 40);
  if (lead && compact(text).startsWith(lead)) return true;
  return STOCK_NOTE_FRAGMENTS.some((f) => text.includes(f));
}

export function stripBoilerplateEntry(entry: HiCommentaryEntry): HiCommentaryEntry {
  const out: HiCommentaryEntry = {};
  if (entry.explanation) out.explanation = entry.explanation;
  if (entry.science && !isBoilerplateField(entry.science)) out.science = entry.science;
  if (entry.lifeLesson && !isBoilerplateField(entry.lifeLesson)) out.lifeLesson = entry.lifeLesson;
  return out;
}

export function isCuratedAnalysisField(text: string | undefined): boolean {
  return !!text && !isBoilerplateField(text);
}