import { canonicalVerseId } from './canonical-verse-id';

export interface CommentaryAmbiguities {
  normalized: ReadonlySet<string>;
  raw: ReadonlySet<string>;
}

/** Build once from the entire chapter, not a filtered or paginated subset. */
export function commentaryAmbiguities(chapterId: number, numbers: Array<number | string>): CommentaryAmbiguities {
  const normalized = new Set<string>(), raw = new Set<string>();
  const seenNormalized = new Set<string>(), seenRaw = new Set<string>();
  for (const number of numbers) {
    const rawKey = `${chapterId}:${number}`;
    if (seenRaw.has(rawKey)) raw.add(rawKey);
    seenRaw.add(rawKey);
    const value = Number(canonicalVerseId(chapterId, number));
    if (!Number.isFinite(value)) continue;
    const key = `${chapterId}:${value}`;
    if (seenNormalized.has(key)) normalized.add(key);
    seenNormalized.add(key);
  }
  return { normalized, raw };
}

/** Prefer an exact identifier; use a shortened numeric key only when it is unambiguous. */
export function commentaryLookupKey<T>(all: Record<string, T> | undefined, chapterId: number, number: number | string, ambiguity?: CommentaryAmbiguities): string | undefined {
  if (!all) return undefined;
  const rawKey = `${chapterId}:${number}`;
  if (all[rawKey] != null) return ambiguity?.raw.has(rawKey) ? undefined : rawKey;
  const value = Number(canonicalVerseId(chapterId, number));
  if (!Number.isFinite(value)) return undefined;
  const normalizedKey = `${chapterId}:${value}`;
  if (normalizedKey !== rawKey && (!ambiguity || ambiguity.normalized.has(normalizedKey))) return undefined;
  return all[normalizedKey] != null ? normalizedKey : undefined;
}

export function lookupCommentary<T>(all: Record<string, T> | undefined, chapterId: number, number: number | string, ambiguity?: CommentaryAmbiguities): T | undefined {
  const key = commentaryLookupKey(all, chapterId, number, ambiguity);
  return key === undefined ? undefined : all?.[key];
}
