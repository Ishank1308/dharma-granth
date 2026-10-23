import { canonicalRef } from './canonical';
import type { CanonicalVerseRef, StudyRecord } from './types';

export type CanonicalResolution =
  | {
      status: 'resolved';
      ref: CanonicalVerseRef;
      /** Canonical site path supplied by the host content layer. */
      href: string;
    }
  | {
      status: 'rejected';
      reason: 'invalid' | 'not-found' | 'ambiguous' | 'unpublished';
    };

/**
 * Boundary implemented by the canonical content layer after Phase 7 lands.
 * Private-study code must not infer identity from display labels or verse text.
 */
export interface CanonicalReferenceResolver {
  resolve(ref: CanonicalVerseRef): Promise<CanonicalResolution>;
}

/** Optional host hooks; storage remains functional when no UI subscribes. */
export interface PrivateStudyHost {
  canonical: CanonicalReferenceResolver;
  onRecordsChanged?(records: readonly StudyRecord[]): void;
}

/**
 * Normalizes identifier syntax, then requires the host to prove that the
 * reference exists and is publishable. A rejected result is never persisted.
 */
export async function resolveForStudy(
  resolver: CanonicalReferenceResolver,
  candidate: CanonicalVerseRef,
): Promise<CanonicalResolution> {
  let normalized: CanonicalVerseRef;
  try {
    normalized = canonicalRef(candidate);
  } catch {
    return { status: 'rejected', reason: 'invalid' };
  }
  const result = await resolver.resolve(normalized);
  if (result.status === 'rejected') return result;
  return {
    status: 'resolved',
    ref: canonicalRef(result.ref),
    href: result.href,
  };
}
