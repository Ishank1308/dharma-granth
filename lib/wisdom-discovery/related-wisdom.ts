/**
 * Wisdom Discovery: Related Wisdom engine (Phases 3 + 7).
 * Server-safe (no node:fs): composes stored links only, never guesses.
 * Ordering is fixed: Related Concepts / Related Questions /
 * Related Teachings / Related Verses / Related Scriptures /
 * Wisdom Paths / Related Sages.
 */
import { CONNECTIONS, CONNECTION_LABEL, verseKey, type Connection } from '@/data/study-content';
import { getCharacter } from '@/data/characters';
import { getPathway } from '@/data/wisdom-pathways';
import type { GraphLink, GraphVerseLink, VerseKnowledge } from '@/lib/knowledge-graph';
import { resolveVerseKnowledge } from '@/lib/knowledge-graph';
import { getScriptureRegistry, resolveScriptureId, scripturePath } from '@/lib/scripture-registry';
import { readHref } from '@/lib/verse-paths';
import { pathwaysForVerse } from '@/lib/wisdom-pathways';
import type { VerseDiscoveryInput } from './verse-tags';
import { normalizeVerseDiscoveryTags } from './verse-tags';

export interface RelatedTeachingItem {
  kind: Connection['kind'];
  kindLabel: string;
  title: string;
  href?: string;
  summary: string;
  reason: string;
}

export interface RelatedWisdom {
  concepts: GraphLink[];
  questions: GraphLink[];
  teachings: RelatedTeachingItem[];
  verses: GraphVerseLink[];
  scriptures: GraphLink[];
  pathways: GraphLink[];
  sages: GraphLink[];
  isEmpty: boolean;
}

export interface RelatedWisdomInput extends VerseDiscoveryInput {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
}

function toTeaching(item: Connection): RelatedTeachingItem {
  return {
    kind: item.kind,
    kindLabel: CONNECTION_LABEL[item.kind],
    title: `${item.scriptureTitle} ${item.reference}`,
    href: item.href,
    summary: item.summary,
    reason: item.reason,
  };
}

const SCRIPTURE_CAP = 4;
const PATHWAY_CAP = 3;
const SAGE_CAP = 6;

/** Stored scripture slugs only; aliases resolve, unknown ids are skipped. */
function resolveScriptureLinks(ids: string[]): GraphLink[] {
  const registry = getScriptureRegistry();
  const out: GraphLink[] = [];
  for (const raw of ids) {
    const id = resolveScriptureId(raw);
    if (!id) continue;
    const href = scripturePath(id);
    if (!href || out.some((o) => o.href === href)) continue;
    const record = registry.find((r) => r.scriptureId === id);
    out.push({
      href,
      labelHi: record?.sanskritName ?? id,
      labelEn: record?.englishName ?? id,
      sanskrit: record?.sanskritName,
    });
    if (out.length >= SCRIPTURE_CAP) break;
  }
  return out;
}

/** Stored pathway slugs only; unknown slugs are skipped, never linked. */
function resolvePathwayLinks(slugs: string[]): GraphLink[] {
  const out: GraphLink[] = [];
  for (const raw of slugs) {
    const pathway = getPathway(raw.trim().toLowerCase());
    if (!pathway) continue;
    const href = `/wisdom-pathways/${pathway.slug}/`;
    if (out.some((o) => o.href === href)) continue;
    out.push({
      href,
      labelHi: pathway.titleHi,
      labelEn: pathway.titleEn,
      sanskrit: pathway.sanskritSubtitle,
    });
    if (out.length >= PATHWAY_CAP) break;
  }
  return out;
}

/** Stored character ids only; unknown ids are skipped, never linked. */
function resolveSageLinks(ids: string[]): GraphLink[] {
  const out: GraphLink[] = [];
  for (const raw of ids) {
    const sage = getCharacter(raw.trim().toLowerCase());
    if (!sage) continue;
    const href = `/characters/${sage.id}/`;
    if (out.some((o) => o.href === href)) continue;
    out.push({ href, labelHi: sage.sanskrit, labelEn: sage.name, sanskrit: sage.sanskrit });
    if (out.length >= SAGE_CAP) break;
  }
  return out;
}

/**
 * Build the seven ordered discovery groups for one verse. Explicit verse
 * fields win; curated graph citations follow; reviewed study-content
 * connections supply teachings. Wisdom paths also include the canonical
 * pathways whose stored verse lenses teach this verse. Renders nothing
 * when all groups are empty.
 */
export function getRelatedWisdom(input: RelatedWisdomInput): RelatedWisdom {
  const tags = normalizeVerseDiscoveryTags(input);
  const knowledge: VerseKnowledge = resolveVerseKnowledge(
    input.scriptureId,
    input.chapterId,
    input.verseId,
    tags,
  );

  const teachings: RelatedTeachingItem[] = [];
  const reviewed = CONNECTIONS[verseKey(input.scriptureId, input.chapterId, input.verseId)] ?? [];
  for (const item of reviewed) {
    if (teachings.some((t) => t.title === `${item.scriptureTitle} ${item.reference}`)) continue;
    teachings.push(toTeaching(item));
    if (teachings.length >= 3) break;
  }

  // The Phase 2 questions field merges with relatedQuestions so neither
  // editorial field is silently dropped.
  const questions = [...knowledge.questions];
  for (const q of tags.questions) {
    if (!questions.some((o) => o.href === q.href)) {
      questions.push({ href: q.href, labelHi: q.labelHi, labelEn: q.labelEn });
    }
    if (questions.length >= 6) break;
  }

  // Stored relatedVerses that the graph did not include (e.g. capped out)
  // are appended so no editorial link is silently dropped.
  const verses = [...knowledge.verses];
  for (const related of tags.relatedVerses) {
    const href = readHref(related.scriptureId, related.chapterId, related.verseId);
    const label = `${related.scriptureId} ${related.chapterId}.${related.verseId}`;
    if (!verses.some((v) => v.href === href)) {
      verses.push({ href, labelHi: label, labelEn: label, reference: label });
    }
    if (verses.length >= 6) break;
  }

  const scriptures = resolveScriptureLinks(tags.relatedScriptures);
  const pathways = resolvePathwayLinks([
    ...tags.relatedPathways,
    ...pathwaysForVerse(input.scriptureId, input.chapterId, String(input.verseId)).map((p) => p.slug),
  ]);
  const sages = resolveSageLinks(tags.relatedSages);

  return {
    concepts: knowledge.concepts,
    questions,
    teachings,
    verses,
    scriptures,
    pathways,
    sages,
    isEmpty:
      knowledge.concepts.length === 0 &&
      questions.length === 0 &&
      teachings.length === 0 &&
      verses.length === 0 &&
      scriptures.length === 0 &&
      pathways.length === 0 &&
      sages.length === 0,
  };
}
