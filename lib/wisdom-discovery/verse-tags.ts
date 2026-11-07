/**
 * Wisdom Discovery: verse discovery-tag helpers (Phase 2).
 * Migration-safe: every field is optional, missing data means "untagged",
 * and normalization never throws on absent or malformed input.
 */
import type { VerseLink, VerseQuestionLink } from '@/data/types';

export interface VerseDiscoveryInput {
  concepts?: string[] | null;
  relatedVerses?: VerseLink[] | null;
  relatedQuestions?: VerseQuestionLink[] | null;
  /** Phase 2 field: merged with relatedQuestions. */
  questions?: VerseQuestionLink[] | null;
  /** Phase 2 field: wisdom-concept slugs this verse speaks to. */
  lifeSituations?: string[] | null;
  /** Related-group slugs: resolved to existing pages only, unknown skipped. */
  relatedScriptures?: string[] | null;
  relatedPathways?: string[] | null;
  relatedSages?: string[] | null;
}

export interface NormalizedVerseDiscoveryTags {
  concepts: string[];
  questions: VerseQuestionLink[];
  lifeSituations: string[];
  relatedVerses: VerseLink[];
  relatedScriptures: string[];
  relatedPathways: string[];
  relatedSages: string[];
}

function cleanStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  const out: string[] = [];
  for (const v of values) {
    if (typeof v === 'string' && v.trim().length > 0 && !out.includes(v.trim())) {
      out.push(v.trim());
    }
  }
  return out;
}

function cleanLinks<T extends { href: string }>(values: T[] | null | undefined): T[] {
  if (!Array.isArray(values)) return [];
  const out: T[] = [];
  for (const v of values) {
    if (v && typeof v.href === 'string' && v.href.length > 0 && !out.some((o) => o.href === v.href)) {
      out.push(v);
    }
  }
  return out;
}

function cleanVerseLinks(values: VerseLink[] | null | undefined): VerseLink[] {
  if (!Array.isArray(values)) return [];
  const out: VerseLink[] = [];
  for (const v of values) {
    if (
      v &&
      typeof v.scriptureId === 'string' &&
      typeof v.chapterId === 'number' &&
      v.verseId != null &&
      !out.some(
        (o) =>
          o.scriptureId === v.scriptureId &&
          o.chapterId === v.chapterId &&
          String(o.verseId) === String(v.verseId),
      )
    ) {
      out.push(v);
    }
  }
  return out;
}

/**
 * Merge a verse's discovery fields into safe arrays. Old verses that only
 * carry relatedQuestions (and no questions) keep working unchanged.
 */
export function normalizeVerseDiscoveryTags(
  input: VerseDiscoveryInput | null | undefined,
): NormalizedVerseDiscoveryTags {
  if (!input || typeof input !== 'object') {
    return {
      concepts: [],
      questions: [],
      lifeSituations: [],
      relatedVerses: [],
      relatedScriptures: [],
      relatedPathways: [],
      relatedSages: [],
    };
  }
  return {
    concepts: cleanStrings(input.concepts),
    questions: cleanLinks([...(input.relatedQuestions ?? []), ...(input.questions ?? [])]),
    lifeSituations: cleanStrings(input.lifeSituations),
    relatedVerses: cleanVerseLinks(input.relatedVerses),
    relatedScriptures: cleanStrings(input.relatedScriptures),
    relatedPathways: cleanStrings(input.relatedPathways),
    relatedSages: cleanStrings(input.relatedSages),
  };
}
