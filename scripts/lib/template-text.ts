/**
 * Detects explanation text that is a template rather than something written about one verse.
 *
 * A value is a template when the same long text (over MIN_LENGTH characters) sits on TEMPLATE_MIN or more verses
 * whose Sanskrit differs. Verses that genuinely repeat (a refrain printed in several places) share Sanskrit, so they
 * are not counted: only distinct-Sanskrit verses vote.
 *
 * One exception: a note written for a verse range (for example "श्लोक 4–6") is stored on each verse of the range.
 * A short run of neighbouring verses is therefore range commentary, not a template, and is kept.
 *
 * Used when publishing, never on the source data: the source files keep the text, the published shards and
 * commentary files leave the field empty, and the reader then shows its honest "not yet written" state.
 */
export const TEMPLATE_MIN = 3;
export const MIN_LENGTH = 40;
/** A run of this many neighbouring verses or fewer is treated as a range note. */
export const MAX_RANGE_RUN = 8;

export interface TemplateItem {
  /** "<chapter>:<position>"; the part after the last colon is used to spot neighbouring verses. */
  key: string;
  sanskrit: string;
  /** Field name -> text. */
  fields: Record<string, string | undefined>;
}

const norm = (s: string) => s.normalize('NFC').replace(/\s+/g, ' ').trim();

/** True when every key shares a chapter and the verse positions form one unbroken run of at most MAX_RANGE_RUN. */
function isRangeRun(keys: string[]): boolean {
  if (keys.length > MAX_RANGE_RUN) return false;
  const cut = keys.map((k) => k.lastIndexOf(':'));
  if (cut.some((c) => c < 0)) return false;
  const chapter = keys[0].slice(0, cut[0]);
  if (!keys.every((k, i) => k.slice(0, cut[i]) === chapter)) return false;
  const pos = keys.map((k, i) => parseInt(k.slice(cut[i] + 1), 10)).sort((a, b) => a - b);
  if (pos.some((n) => Number.isNaN(n))) return false;
  return pos[pos.length - 1] - pos[0] + 1 === pos.length;
}

/** Returns "<key>|<field>" for every field value that is a template. */
export function findTemplateFields(items: TemplateItem[]): Set<string> {
  const byValue = new Map<string, { sanskrit: Set<string>; where: string[] }>();
  for (const it of items) {
    const sk = norm(it.sanskrit);
    for (const [field, raw] of Object.entries(it.fields)) {
      if (typeof raw !== 'string') continue;
      const text = norm(raw);
      if (text.length <= MIN_LENGTH) continue;
      const id = `${field}\u0001${text}`;
      const entry = byValue.get(id) ?? { sanskrit: new Set<string>(), where: [] };
      entry.sanskrit.add(sk);
      entry.where.push(`${it.key}|${field}`);
      byValue.set(id, entry);
    }
  }
  const out = new Set<string>();
  for (const e of byValue.values()) {
    if (e.sanskrit.size < TEMPLATE_MIN) continue;
    if (isRangeRun(e.where.map((w) => w.slice(0, w.lastIndexOf('|'))))) continue;
    for (const w of e.where) out.add(w);
  }
  return out;
}
