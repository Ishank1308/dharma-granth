/**
 * Turns the pilot editorial records into what the reader publishes. Used by the publish scripts only.
 *
 * - Commentary entry: written into public/data/hi-commentary/<scripture>.json under "<chapter>:<verse>".
 *   Vyakhya becomes the explanation, Vijnana the science field (omitted when empty), and the life lesson.
 * - Chapter patch: the Artha replaces the stored Hindi and English when the record revises or adds one, and the
 *   old explanation, science and lesson fields are removed from the published chapter so they cannot show beside
 *   the reviewed-for-structure draft. Original text, transliteration and verse numbers are never touched.
 *
 * Nothing here edits files under data/ or the source scripture JSON.
 */
import fs from 'node:fs';
import path from 'node:path';
import { canonicalVerseId } from '../../lib/canonical-verse-id';
import type { PilotUnit } from './lib';
import type { PilotRecord } from './validate-pilot-records';

const ROOT = path.resolve(__dirname, '..', '..');

export interface PilotOverlayItem {
  scriptureId: string;
  chapter: number;
  /** Stored verse number, as in the chapter data. */
  verse: string;
  /** Key used by the published commentary file. */
  commentaryKey: string;
  record: PilotRecord;
}

export interface EditorialMeta {
  reviewStatus: 'review-required';
  confidence: 'high' | 'medium' | 'low';
  vijnanaCategory: string;
  evidenceLevel: 'editorial-observation' | 'none';
  arthaDecision: string;
}

export function loadPilotOverlay(): PilotOverlayItem[] {
  const setPath = path.join(ROOT, 'data/pilot/pilot-set.json');
  const baselinePath = path.join(ROOT, 'data/pilot/pilot-baseline.json');
  const recordsDir = path.join(ROOT, 'data/pilot/records');
  if (!fs.existsSync(setPath) || !fs.existsSync(baselinePath) || !fs.existsSync(recordsDir)) return [];

  const set = JSON.parse(fs.readFileSync(setPath, 'utf8')) as { units: PilotUnit[] };
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8')) as { units: { id: string; baselineStatus: string }[] };
  const clear = new Set(baseline.units.filter((u) => u.baselineStatus === 'clear').map((u) => u.id));
  const items: PilotOverlayItem[] = [];

  for (const f of fs.readdirSync(recordsDir).filter((x) => x.endsWith('.json')).sort()) {
    const record = JSON.parse(fs.readFileSync(path.join(recordsDir, f), 'utf8')) as PilotRecord;
    const unit = set.units.find((u) => u.id === record.unitId);
    // Only units in the published scripture data are overlaid; Ashtavakra lives in its own pipeline.
    if (!unit || unit.source || unit.supersededBy || !clear.has(unit.id) || record.reviewStatus !== 'review-required') continue;
    const verseKey = Number(canonicalVerseId(unit.chapter, unit.verse));
    items.push({
      scriptureId: unit.scriptureId,
      chapter: unit.chapter,
      verse: unit.verse,
      commentaryKey: `${unit.chapter}:${verseKey}`,
      record,
    });
  }
  return items;
}

export function commentaryEntry(r: PilotRecord): Record<string, unknown> {
  const entry: Record<string, unknown> = { explanation: r.vyakhya.trim() };
  if (r.vijnana.trim()) entry.science = r.vijnana.trim();
  entry.lifeLesson = r.lifeLesson.trim();
  const editorial: EditorialMeta = {
    reviewStatus: r.reviewStatus,
    confidence: r.confidence,
    vijnanaCategory: r.vijnanaCategory,
    evidenceLevel: r.evidenceLevel,
    arthaDecision: r.arthaDecision,
  };
  entry.editorial = editorial;
  return entry;
}

/** Applies the Artha and clears superseded explanation fields on one published verse object. */
export function patchPublishedVerse(verse: Record<string, unknown>, r: PilotRecord): void {
  const norm = (t: unknown) => (typeof t === 'string' ? t.replace(/\s+/g, ' ').trim() : '');
  const oldTranslation = norm(verse.translation);
  const oldNote = (norm(verse.explanation) || norm(verse.commentary)).replace(/^Sense:\s*/, '');
  if (r.arthaDecision !== 'preserve-existing') {
    verse.hindi = r.artha.trim();
    verse.translation = r.arthaEn.trim();
    // These are editor drafts, so the reader must not present them as a source translation.
    delete verse.translationSource;
    delete verse.hindiSource;
  }
  // In several texts the stored word-meaning field is a copy of the old explanation or of the old English. Left in
  // place it would show the superseded text beside the new one, so it is removed when it repeats either.
  const wm = norm(verse.wordMeaning).replace(/^Sense:\s*/, '');
  const repeats = (other: string) => other.length > 0 && (wm === other || wm.startsWith(other.slice(0, 40)) || other.startsWith(wm.slice(0, 40)));
  if (wm && (repeats(oldNote) || repeats(oldTranslation))) delete verse.wordMeaning;
  for (const f of ['explanation', 'commentary', 'science', 'lifeLesson']) delete verse[f];
}
