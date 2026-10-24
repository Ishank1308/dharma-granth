/**
 * Wisdom Discovery: internal linking utilities (Phase 7).
 * verse<->concept, verse<->verse, question->verse/concept.
 * Every helper returns hrefs only for data that exists; unknown slugs
 * resolve to [] instead of broken links.
 */
import { getWisdomConcept, wisdomConceptHref, type WisdomConcept } from '@/data/wisdom-concepts';
import {
  getWisdomQuestion,
  questionsForConcept,
  questionsForVerse,
  type WisdomQuestion,
} from '@/data/wisdom-questions';
import { getAllKnowledgeHubs, getKnowledgeHub, knowledgeHubHref } from '@/data/knowledge-hubs';
import { conceptVerses } from '@/data/concept-verses';
import { getWisdomTopic } from '@/data/wisdom-for-life';
import { topicHref } from '@/lib/topic-links';
import { readHref } from '@/lib/verse-paths';
import { resolveVerseKnowledge } from '@/lib/knowledge-graph';
import type { VerseDiscoveryInput } from './verse-tags';
import { normalizeVerseDiscoveryTags } from './verse-tags';

export interface VerseRef {
  scriptureId: string;
  chapter: number;
  verse: number | string;
  reference: string;
  href: string;
}

function verseRef(
  scriptureId: string,
  chapter: number,
  verse: number | string,
  reference: string,
): VerseRef {
  return { scriptureId, chapter, verse, reference, href: readHref(scriptureId, chapter, verse) };
}

/** Verses that teach a wisdom concept: its hub keyVerses plus curated library citations. */
export function versesForWisdomConcept(conceptSlug: string): VerseRef[] {
  const concept = getWisdomConcept(conceptSlug);
  if (!concept) return [];
  const out: VerseRef[] = [];
  const seen = new Set<string>();
  const push = (scriptureId: string, chapter: number, verse: number | string, reference: string) => {
    const key = `${scriptureId}:${chapter}:${verse}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(verseRef(scriptureId, chapter, verse, reference));
  };
  for (const v of concept.keyVerses) push(v.scriptureId, v.chapter, v.verse, v.reference);
  const hub = getKnowledgeHub(conceptSlug);
  for (const v of hub?.extraVerses ?? []) push(v.scriptureId, v.chapter, v.verse, v.reference);
  if (concept.libraryConceptId) {
    for (const cited of conceptVerses[concept.libraryConceptId] ?? []) {
      if (cited.chapterId == null || cited.verseId == null) continue;
      push(cited.scriptureId, cited.chapterId, cited.verseId, cited.reference);
    }
  }
  return out;
}

/** Concepts attached to a verse: explicit tags plus lifeSituations, resolved to hubs. */
export function conceptsForVerse(input: VerseDiscoveryInput & { scriptureId: string; chapter: number; verseId: number | string }): Array<{ slug: string; href: string; labelEn: string; labelHi: string }> {
  const tags = normalizeVerseDiscoveryTags(input);
  const out: Array<{ slug: string; href: string; labelEn: string; labelHi: string }> = [];
  const seen = new Set<string>();
  const pushConcept = (slug: string) => {
    const key = slug.toLowerCase();
    if (seen.has(key)) return;
    const concept: WisdomConcept | undefined = getWisdomConcept(key);
    if (!concept) return;
    seen.add(key);
    out.push({ slug: concept.id, href: wisdomConceptHref(concept.id), labelEn: concept.labelEn, labelHi: concept.labelHi });
  };
  for (const id of tags.concepts) pushConcept(id);
  for (const id of tags.lifeSituations) pushConcept(id);
  const knowledge = resolveVerseKnowledge(input.scriptureId, input.chapter, input.verseId, tags);
  for (const link of knowledge.concepts) {
    const match = link.href.match(/^\/knowledge\/([^/]+)\//);
    if (match) pushConcept(match[1]);
  }
  return out;
}

/** Verses an editor connected to this verse (stored links only). */
export function relatedVersesFor(
  input: VerseDiscoveryInput & { scriptureId?: string; chapterId?: number; verseId?: number | string },
): VerseRef[] {
  const tags = normalizeVerseDiscoveryTags(input);
  return tags.relatedVerses.map((r) =>
    verseRef(r.scriptureId, r.chapterId, r.verseId, `${r.scriptureId} ${r.chapterId}.${r.verseId}`),
  );
}

/** Canonical hub page that renders a discovery question (it carries the #question- anchor). */
export function questionHubHref(questionId: string): string {
  const q = getWisdomQuestion(questionId);
  if (!q) return '/wisdom-for-life/';
  const hubbed = q.conceptSlugs.find((slug) => getKnowledgeHub(slug));
  if (hubbed) return `${knowledgeHubHref(hubbed)}#question-${q.id}`;
  for (const hub of getAllKnowledgeHubs()) {
    if (hub.featuredQuestions.includes(q.id)) return `${knowledgeHubHref(hub.slug)}#question-${q.id}`;
  }
  return '/wisdom-for-life/';
}

/** Questions answered by a verse: discovery questions citing it plus stored question links. */
export function questionsForVerseLink(
  scriptureId: string,
  chapter: number,
  verse: number | string,
  input?: VerseDiscoveryInput,
): Array<{ href: string; labelEn: string; labelHi: string }> {
  const out: Array<{ href: string; labelEn: string; labelHi: string }> = [];
  for (const q of questionsForVerse(scriptureId, chapter, verse)) {
    out.push({
      href: questionHubHref(q.id),
      labelEn: q.questionEn,
      labelHi: q.questionHi,
    });
  }
  for (const link of normalizeVerseDiscoveryTags(input).questions) {
    if (!out.some((o) => o.href === link.href)) {
      out.push({ href: link.href, labelEn: link.labelEn, labelHi: link.labelHi });
    }
  }
  return out;
}

/** Verses + concepts a discovery question points at. */
export function questionTargets(questionId: string): { verses: VerseRef[]; concepts: Array<{ slug: string; href: string }> } {
  const q: WisdomQuestion | undefined = getWisdomQuestion(questionId);
  if (!q) return { verses: [], concepts: [] };
  return {
    verses: q.verses.map((v) => verseRef(v.scriptureId, v.chapter, v.verse, v.reference)),
    concepts: q.conceptSlugs
      .filter((slug) => getWisdomConcept(slug))
      .map((slug) => ({ slug, href: wisdomConceptHref(slug) })),
  };
}

/** Topic pages a concept links to (wisdom-for-life slugs that exist). */
export function topicsForConcept(conceptSlug: string): Array<{ slug: string; href: string }> {
  const concept = getWisdomConcept(conceptSlug);
  if (!concept) return [];
  const out: Array<{ slug: string; href: string }> = [];
  for (const slug of concept.topicSlugs) {
    if (!getWisdomTopic(slug)) continue;
    out.push({ slug, href: topicHref(slug) });
  }
  return out;
}

/** Hubs related to a concept hub (via relatedConcepts), for hub-to-hub nav. */
export function relatedHubs(conceptSlug: string): Array<{ slug: string; href: string; labelEn: string; labelHi: string }> {
  const concept = getWisdomConcept(conceptSlug);
  if (!concept) return [];
  const out: Array<{ slug: string; href: string; labelEn: string; labelHi: string }> = [];
  for (const slug of concept.relatedConcepts) {
    if (!getKnowledgeHub(slug)) continue;
    const target = getWisdomConcept(slug);
    if (!target) continue;
    out.push({ slug, href: knowledgeHubHref(slug), labelEn: target.labelEn, labelHi: target.labelHi });
  }
  return out;
}

/** Discovery questions mapped to a concept hub. */
export function hubQuestions(conceptSlug: string) {
  return questionsForConcept(conceptSlug);
}
