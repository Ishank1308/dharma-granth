/**
 * Detects explanation text that is a template rather than something written about one verse.
 *
 * A value is a template when the same long text (over MIN_LENGTH characters) sits on TEMPLATE_MIN or more verses
 * whose Sanskrit differs. Verses that genuinely repeat (a refrain printed in several places) share Sanskrit, so they
 * are not counted: only distinct-Sanskrit verses vote. Digits are ignored when comparing, so numbered boilerplate
 * ("… (दोहा/चौपाई 7)", "Chapter 1, Shloka 4: …") counts as one template.
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
/** Digits are ignored when grouping, so a template that only changes its verse number ("(दोहा/चौपाई 7)") is still one template. */
const shape = (s: string) => norm(s).replace(/[0-9०-९]+/g, '#');

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
      const id = `${field}\u0001${shape(text)}`;
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

/**
 * Translations (Hindi, English) and word glosses get a stricter test than explanations.
 *
 * A meaning sits on one verse, so the same meaning on three verses whose Sanskrit differs is a template, a running
 * header ("# अग्निपुराण"), a chapter colophon or an OCR fragment ("प्राप्त करता है") that the import put under the
 * wrong verse, however short it is. Two exceptions keep real translations:
 *  - a passage translated as one (Gita Press often renders several verses in one paragraph) is stored on each verse
 *    of the passage, so copies that all sit inside one chapter within MAX_PASSAGE_SPAN verses are kept;
 *  - a mantra the text repeats is printed with small spelling changes ("पवस आसुवोर्जमिषं" / "पवसे आ सुवोर्जं इषं"),
 *    so Sanskrit is compared by its consonants and near matches count as the same verse.
 */
export const MAX_PASSAGE_SPAN = 16;

/** The consonants of a verse, without vowel signs, accents, punctuation or digits. */
function skeleton(s: string): string {
  return s.normalize('NFC').replace(/[^ऄ-हक़-ॡॲ-ॿ]/g, '');
}

function bigrams(s: string): Map<string, number> {
  const out = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) {
    const g = s.slice(i, i + 2);
    out.set(g, (out.get(g) ?? 0) + 1);
  }
  return out;
}

/** Dice similarity of two consonant skeletons; 0.8 or more is the same verse with spelling variants. */
function sameVerse(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 2 || b.length < 2) return false;
  const ga = bigrams(a);
  const gb = bigrams(b);
  let shared = 0;
  for (const [g, n] of ga) shared += Math.min(n, gb.get(g) ?? 0);
  return (2 * shared) / (a.length - 1 + b.length - 1) >= 0.8;
}

function isPassage(keys: string[]): boolean {
  const cut = keys.map((k) => k.lastIndexOf(':'));
  if (cut.some((c) => c < 0)) return false;
  const chapter = keys[0].slice(0, cut[0]);
  if (!keys.every((k, i) => k.slice(0, cut[i]) === chapter)) return false;
  const pos = keys.map((k, i) => parseInt(k.slice(cut[i] + 1), 10));
  if (pos.some((n) => Number.isNaN(n))) return false;
  return Math.max(...pos) - Math.min(...pos) + 1 <= MAX_PASSAGE_SPAN;
}

/** Returns "<key>|<field>" for every translation or gloss that is a template (see above). */
export function findMeaningTemplates(items: TemplateItem[]): Set<string> {
  const byValue = new Map<string, { verses: string[]; distinct: number; where: string[] }>();
  for (const it of items) {
    const sk = skeleton(it.sanskrit);
    for (const [field, raw] of Object.entries(it.fields)) {
      if (typeof raw !== 'string' || !raw.trim()) continue;
      const id = `${field}\u0001${shape(raw)}`;
      const entry = byValue.get(id) ?? { verses: [], distinct: 0, where: [] };
      // Only whether there are TEMPLATE_MIN different verses matters, so stop comparing once there are.
      if (entry.distinct < TEMPLATE_MIN && !entry.verses.some((v) => sameVerse(v, sk))) {
        entry.verses.push(sk);
        entry.distinct++;
      }
      entry.where.push(`${it.key}|${field}`);
      byValue.set(id, entry);
    }
  }
  const out = new Set<string>();
  for (const e of byValue.values()) {
    if (e.distinct < TEMPLATE_MIN) continue;
    if (isPassage(e.where.map((w) => w.slice(0, w.lastIndexOf('|'))))) continue;
    for (const w of e.where) out.add(w);
  }
  return out;
}

export interface PassageVerse {
  number: number | string;
  sanskrit?: string;
  [field: string]: unknown;
}

/**
 * A passage translated as one and copied onto each of its verses is shown once: the first verse keeps the text and
 * names the range (`hindiRange: "1.73-1.76"`), the others point to it (`hindiSeeVerse: "1.73"`), the way
 * Harivamsha and the Atharva Veda hymns are already stored. A refrain (same Sanskrit, same meaning) is left alone.
 * Returns how many verses now point to another.
 */
export function collapsePassages(verses: PassageVerse[], field: 'hindi' | 'translation'): number {
  const rangeKey = field === 'hindi' ? 'hindiRange' : 'translationRange';
  const seeKey = field === 'hindi' ? 'hindiSeeVerse' : 'translationSeeVerse';
  let collapsed = 0;
  let i = 0;
  while (i < verses.length) {
    const text = typeof verses[i][field] === 'string' ? norm(verses[i][field] as string) : '';
    let j = i + 1;
    if (text) {
      while (j < verses.length && typeof verses[j][field] === 'string' && norm(verses[j][field] as string) === text) j++;
    }
    const run = verses.slice(i, j);
    const refrain = run.every((v) => sameVerse(skeleton(String(v.sanskrit ?? '')), skeleton(String(run[0].sanskrit ?? ''))));
    const untouched = run.every((v) => v[rangeKey] == null && v[seeKey] == null);
    if (run.length > 1 && run.length <= MAX_PASSAGE_SPAN && !refrain && untouched) {
      const first = run[0];
      const last = run[run.length - 1];
      // The text often opens with its own range ("(श्लोक 4–6) …"); the label now says it.
      first[field] = (first[field] as string).replace(/^\s*\((?:श्लोक|verses?)\s*[0-9०-९.]+\s*[-–]\s*[0-9०-९.]+\)\s*/i, '');
      first[rangeKey] = `${first.number}-${last.number}`;
      for (const v of run.slice(1)) {
        delete v[field];
        v[seeKey] = first.number;
        collapsed++;
      }
    }
    i = j;
  }
  return collapsed;
}

/** Hindi words that a Sanskrit verse does not use; a "translation" with none of them may be Sanskrit. */
const HINDI_WORDS = /(?:^|[\s,;।—-])(?:है|हैं|हूँ|के|की|का|में|और|से|को|ने|था|थे|थी|हुए|हुआ|करते|करता|गया|गये|गए|वाले|वाली|हो|भी|ही|यह|वह)(?=$|[\s,;।—!?-])/;

/**
 * A "Hindi meaning" that is the verse's own Sanskrit again (Durga Saptashati has dozens, OCR'd from the
 * facing page), not a translation. It shares most of the verse's consonants and has no Hindi word or comma;
 * a real Hindi rendering of a list of names keeps a comma or a के / और / है.
 */
export function isSanskritCopy(meaning: string | undefined, sanskrit: string | undefined): boolean {
  if (!meaning || !sanskrit) return false;
  if (meaning.includes(',') || HINDI_WORDS.test(meaning)) return false;
  const a = skeleton(meaning);
  const b = skeleton(sanskrit);
  if (a.length < 8 || b.length < 8) return false;
  const ga = bigrams(a);
  const gb = bigrams(b);
  let shared = 0;
  for (const [g, n] of ga) shared += Math.min(n, gb.get(g) ?? 0);
  return (2 * shared) / (a.length - 1 + b.length - 1) >= 0.8;
}
