/**
 * Shared loading for the Phase 2 pilot: reads a unit's canonical fields from source data and measures the
 * state of its existing Artha, Vyakhya and Vigyana layers. Read-only; nothing here edits scripture data.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(__dirname, '..', '..');
export const SOURCE_DIR = path.join(ROOT, 'public/data/scriptures-full');
export const SHARD_DIR = SOURCE_DIR;

export interface PilotUnit {
  id: string;
  group: string;
  scriptureId: string;
  chapter: number;
  verse: string;
  reference: string;
  unitType: string;
  reason: string;
  risk: string;
  reviewer: string;
  traditionalCommentary: string;
  observation: string;
  source?: 'ashtavakra';
  forceReviewOnly?: boolean;
}

/** Fields that no editorial step may change. */
export interface ProtectedFields {
  scriptureId: string;
  chapter: number;
  chapterTitle: string | null;
  verse: string;
  reference: string;
  sanskrit: string;
  iast: string | null;
  sourceCitation: string | null;
}

export interface LayerState {
  artha: { hindi: boolean; english: boolean; hindiLength: number; englishLength: number };
  vyakhya: { present: boolean; length: number; language: 'hi' | 'en' | 'mixed' | 'none'; wordGlossOnly: boolean; hiddenAtPublish: boolean };
  vigyana: { present: boolean; length: number; startsWithHindiMeaning: boolean; endsWithRepeatedSentence: boolean; hiddenAtPublish: boolean };
  other: { wordMeaning: boolean; speaker: string | null; attribution: string | null };
}

const nfc = (s: unknown) => (typeof s === 'string' ? s.normalize('NFC').replace(/\s+/g, ' ').trim() : '');

export function sha256(obj: unknown): string {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

const has = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

function script(s: string) {
  let d = 0;
  let l = 0;
  for (const ch of s) {
    if (ch >= 'ऀ' && ch <= 'ॿ') d++;
    else if (/[A-Za-z]/.test(ch)) l++;
  }
  return { d, l };
}

interface RawVerse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
  commentary?: string;
  science?: string;
  wordMeaning?: string;
}

function readJson<T>(p: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as T;
  } catch {
    return null;
  }
}

export interface LoadedUnit {
  protectedFields: ProtectedFields | null;
  layers: LayerState | null;
  missingReason?: string;
  /** Count of other verses in the same scripture with identical Sanskrit (information only). */
  sameSanskritElsewhere: number;
}

export function loadUnit(u: PilotUnit): LoadedUnit {
  if (u.source === 'ashtavakra') return loadAshtavakra(u);

  const mono = readJson<{ chapters: { number: number; title?: string; verses: RawVerse[] }[]; source?: unknown }>(
    path.join(SOURCE_DIR, `${u.scriptureId}.json`),
  );
  if (!mono) return { protectedFields: null, layers: null, missingReason: `source file ${u.scriptureId}.json not found`, sameSanskritElsewhere: 0 };
  const ch = mono.chapters.find((c) => c.number === u.chapter);
  const v = ch?.verses.find((x) => String(x.number) === u.verse);
  if (!ch || !v) return { protectedFields: null, layers: null, missingReason: `chapter ${u.chapter} verse ${u.verse} not found in source`, sameSanskritElsewhere: 0 };

  const shard = readJson<{ chapter: { verses: RawVerse[] } }>(path.join(SHARD_DIR, u.scriptureId, `ch-${u.chapter}.json`));
  const pub = shard?.chapter.verses.find((x) => String(x.number) === u.verse) ?? v;

  const key = nfc(v.sanskrit).replace(/[\s।॥\d.\-]+/g, '');
  let same = 0;
  for (const c of mono.chapters) for (const x of c.verses) if (x !== v && nfc(x.sanskrit).replace(/[\s।॥\d.\-]+/g, '') === key) same++;

  const protectedFields: ProtectedFields = {
    scriptureId: u.scriptureId,
    chapter: u.chapter,
    chapterTitle: ch.title ?? null,
    verse: u.verse,
    reference: u.reference,
    sanskrit: nfc(v.sanskrit),
    iast: has(v.transliteration) ? nfc(v.transliteration) : null,
    sourceCitation: mono.source ? JSON.stringify(mono.source) : null,
  };

  const srcExpl = v.explanation ?? v.commentary ?? '';
  const pubExpl = pub.explanation ?? pub.commentary ?? '';
  const sciSentences = new Map<string, number>();
  for (const c of mono.chapters)
    for (const x of c.verses) for (const s of tailSentences(x.science)) sciSentences.set(s, (sciSentences.get(s) ?? 0) + 1);
  const sciTail = lastSentence(pub.science);
  const lang = (t: string): 'hi' | 'en' | 'mixed' | 'none' => {
    if (!has(t)) return 'none';
    const { d, l } = script(t);
    if (d > l * 2) return 'hi';
    if (l > d * 2) return 'en';
    return 'mixed';
  };

  const layers: LayerState = {
    artha: { hindi: has(pub.hindi), english: has(pub.translation), hindiLength: (pub.hindi ?? '').length, englishLength: (pub.translation ?? '').length },
    vyakhya: {
      present: has(pubExpl),
      length: pubExpl.length,
      language: lang(pubExpl),
      wordGlossOnly: has(pubExpl) && (looksLikeWordGloss(pubExpl) || nfc(pubExpl) === nfc(v.wordMeaning)),
      hiddenAtPublish: has(srcExpl) && !has(pubExpl),
    },
    vigyana: {
      present: has(pub.science),
      length: (pub.science ?? '').length,
      startsWithHindiMeaning: has(pub.science) && has(pub.hindi) && nfc(pub.science).startsWith(nfc(pub.hindi).slice(0, 30)),
      endsWithRepeatedSentence: has(pub.science) && (sciSentences.get(sciTail) ?? 0) >= 5,
      hiddenAtPublish: has(v.science) && !has(pub.science),
    },
    other: { wordMeaning: has(v.wordMeaning), speaker: null, attribution: null },
  };
  return { protectedFields, layers, sameSanskritElsewhere: same };
}

function tailSentences(t?: string): string[] {
  if (!has(t)) return [];
  const parts = (t as string).split(/(?<=[।.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts.slice(1) : [];
}
function lastSentence(t?: string): string {
  const parts = tailSentences(t);
  return parts.length ? parts[parts.length - 1] : '';
}
function looksLikeWordGloss(t: string): boolean {
  return (t.match(/—/g) ?? []).length >= 3 && (t.match(/;/g) ?? []).length >= 2;
}

interface AshtavakraVerse {
  text_title?: string;
  commentator?: string;
  prakaran_number?: number;
  prakaran_title?: string;
  verse_number?: number;
  speaker?: string;
  mula_sloka?: string;
  padachheda?: string[];
  anvaya_sabdartha?: { sanskrit: string; hindi: string }[];
  bhavartha?: string;
}

function loadAshtavakra(u: PilotUnit): LoadedUnit {
  const list = readJson<AshtavakraVerse[]>(path.join(ROOT, 'data/ashtavakra', `ashtavakra_prakaran_${u.chapter}.json`));
  const v = list?.find((x) => String(x.verse_number) === u.verse);
  if (!v) return { protectedFields: null, layers: null, missingReason: `prakaran ${u.chapter} verse ${u.verse} not found in data/ashtavakra`, sameSanskritElsewhere: 0 };
  const protectedFields: ProtectedFields = {
    scriptureId: u.scriptureId,
    chapter: u.chapter,
    chapterTitle: v.prakaran_title ?? null,
    verse: u.verse,
    reference: u.reference,
    sanskrit: nfc(v.mula_sloka),
    iast: null,
    sourceCitation: [v.text_title, v.commentator].filter(Boolean).join(' / ') || null,
  };
  const bh = v.bhavartha ?? '';
  const layers: LayerState = {
    artha: { hindi: false, english: false, hindiLength: 0, englishLength: 0 },
    vyakhya: { present: has(bh), length: bh.length, language: has(bh) ? (script(bh).d > script(bh).l ? 'hi' : 'en') : 'none', wordGlossOnly: false, hiddenAtPublish: false },
    vigyana: { present: false, length: 0, startsWithHindiMeaning: false, endsWithRepeatedSentence: false, hiddenAtPublish: false },
    other: { wordMeaning: (v.anvaya_sabdartha ?? []).length > 0, speaker: v.speaker ?? null, attribution: v.commentator ?? null },
  };
  return { protectedFields, layers, sameSanskritElsewhere: 0 };
}

/** Why the canonical baseline of a unit is not clear enough to edit, or null when it is. */
export function ambiguityReason(u: PilotUnit, loaded: LoadedUnit): string | null {
  if (u.forceReviewOnly) return 'Canonical fields are mixed with commentary in the stored record (see observation).';
  if (!loaded.protectedFields) return loaded.missingReason ?? 'Source record not found.';
  const sk = loaded.protectedFields.sanskrit;
  if (!sk) return 'Original text is empty.';
  if (script(sk).l > script(sk).d) return 'Original text field is mostly Latin script.';
  return null;
}
