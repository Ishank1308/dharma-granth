import type {
  EditorialEnrichment,
  EditorialLayer,
  ReviewQueueItem,
} from './types';

const PART = /^[a-z0-9]+(?:[._-][a-z0-9]+)*$/;
const CANONICAL_KEYS = new Set([
  'sanskrit', 'sanskrit_devanagari', 'originalText', 'transliteration', 'iast',
  'scriptureId', 'chapterId', 'verseId', 'number', 'verseNumber',
  'sourceCitations', 'publisherMetadata', 'traditionalCommentaryAttribution',
]);

function fail(message: string): never {
  throw new Error(message);
}

function reference(ref: EditorialEnrichment['canonicalRef']): void {
  for (const [key, value] of Object.entries(ref)) {
    if (typeof value !== 'string' || !PART.test(value.trim().toLowerCase())) fail(`Invalid canonical reference ${key}`);
  }
}

function date(value: string | undefined, label: string): void {
  if (value !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)))) fail(`Invalid ${label}`);
}

/** Reject data that could silently replace canonical text or misrepresent authority. */
export function validateEditorialEnrichment(value: unknown): EditorialEnrichment {
  if (!value || typeof value !== 'object') return fail('Editorial enrichment must be an object');
  const record = value as Partial<EditorialEnrichment> & Record<string, unknown>;
  for (const key of Object.keys(record)) if (CANONICAL_KEYS.has(key)) fail(`Canonical field is not editable: ${key}`);
  if (typeof record.id !== 'string' || !/^[a-zA-Z0-9_.:-]{1,160}$/.test(record.id)) fail('Invalid enrichment id');
  if (!record.canonicalRef || typeof record.canonicalRef !== 'object') fail('Missing canonical reference');
  reference(record.canonicalRef as EditorialEnrichment['canonicalRef']);
  if (typeof record.text !== 'string' || record.text.trim().length === 0 || record.text.length > 20000) fail('Invalid enrichment text');
  if (!record.provenance || typeof record.provenance !== 'object') fail('Missing provenance');
  const provenance = record.provenance as EditorialEnrichment['provenance'];
  if (!Array.isArray(provenance.sources)) fail('Provenance sources must be an array');
  date(provenance.reviewedOn, 'review date');
  date(record.status === 'published' || record.status === 'approved' ? provenance.reviewedOn : undefined, 'required review date');
  if (record.layer === 'modern-application') {
    if (record.notScripture !== true || record.epistemicLabel !== 'editorial-application') fail('Modern application must be labeled Editorial Application · Not Scripture');
  }
  if (record.layer === 'traditional-commentary') {
    if (provenance.sources.length === 0 || !provenance.sources.some((source) => source.kind === 'traditional-commentary')) fail('Traditional commentary requires an attributed commentary source');
    if (provenance.method === 'editor-authored' || provenance.method === 'analytical-synthesis') fail('Traditional commentary cannot be model- or editor-authored');
  }
  if (record.layer === 'vigyana') {
    if (!record.analyticalPerspective || record.epistemicLabel !== 'analytical-perspective') fail('Vigyana requires an analytical perspective label');
    if (provenance.sources.length === 0) fail('Vigyana requires a source or clearly recorded analytical basis');
  }
  return record as EditorialEnrichment;
}

export function validateReviewQueueItem(value: unknown): ReviewQueueItem {
  if (!value || typeof value !== 'object') return fail('Review queue item must be an object');
  const item = value as Partial<ReviewQueueItem>;
  if (typeof item.id !== 'string' || !/^[a-zA-Z0-9_.:-]{1,160}$/.test(item.id)) fail('Invalid review item id');
  if (!item.canonicalRef || typeof item.canonicalRef !== 'object') fail('Review item is missing canonical reference');
  reference(item.canonicalRef as EditorialEnrichment['canonicalRef']);
  if (typeof item.evidence !== 'string' || item.evidence.trim().length === 0) fail('Review item requires evidence');
  date(item.createdOn, 'created date');
  date(item.resolvedOn, 'resolved date');
  if ((item.status === 'resolved' || item.status === 'wont-fix') && !item.resolution?.trim()) fail('Resolved review item requires a resolution');
  return item as ReviewQueueItem;
}
