import type { CanonicalVerseRef, StudyRecord, StudyRecordKind } from './types';

const PART = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const KINDS: readonly string[] = ['bookmark', 'note', 'highlight', 'reading'];

/** Reject malformed references before they become persistent keys or URLs. */
export function canonicalRef(input: CanonicalVerseRef): CanonicalVerseRef {
  const scriptureId = input.scriptureId.trim().toLowerCase();
  const chapterId = input.chapterId.trim();
  const verseId = input.verseId.trim();
  if (!PART.test(scriptureId) || !PART.test(chapterId) || !PART.test(verseId)) {
    throw new Error('Invalid scripture reference');
  }
  return { scriptureId, chapterId, verseId };
}

/** JSON tuple avoids collisions between scripture, chapter and verse segments. */
export function verseKey(ref: CanonicalVerseRef): string {
  const v = canonicalRef(ref);
  return JSON.stringify([v.scriptureId, v.chapterId, v.verseId]);
}

export function validateStudyRecord(value: unknown): StudyRecord {
  if (!value || typeof value !== 'object') throw new Error('Invalid study record');
  const v = value as Partial<StudyRecord>;
  if (typeof v.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(v.id)) throw new Error('Invalid record id');
  if (!KINDS.includes(v.kind as StudyRecordKind)) throw new Error('Invalid record kind');
  if (!v.ref || typeof v.ref.scriptureId !== 'string' || typeof v.ref.chapterId !== 'string' || typeof v.ref.verseId !== 'string') {
    throw new Error('Invalid scripture reference');
  }
  if (v.text !== undefined && (typeof v.text !== 'string' || v.text.length > 20000)) throw new Error('Invalid record text');
  if (v.color !== undefined && (typeof v.color !== 'string' || !/^[a-zA-Z0-9_-]{1,30}$/.test(v.color))) throw new Error('Invalid highlight color');
  if (typeof v.createdAt !== 'string' || !Number.isFinite(Date.parse(v.createdAt)) ||
      typeof v.updatedAt !== 'string' || !Number.isFinite(Date.parse(v.updatedAt))) throw new Error('Invalid record date');
  return { id: v.id, kind: v.kind!, ref: canonicalRef(v.ref),
    ...(v.text === undefined ? {} : { text: v.text }),
    ...(v.color === undefined ? {} : { color: v.color }),
    createdAt: v.createdAt, updatedAt: v.updatedAt };
}
