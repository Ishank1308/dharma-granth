/**
 * Resolves the milestone-1 knowledge graph from stored citations.
 * Explicit verse fields win. Curated concept-verse lists and wisdom topics
 * that already cite the verse are included. Keyword guesses are not.
 */
import { getConceptDetail } from '@/data/concept-details';
import { relationsFor } from '@/data/concept-relations';
import { conceptVerses } from '@/data/concept-verses';
import { concepts } from '@/data/concepts';
import { GRAPH_CONCEPTS, getGraphConcept, type GraphConcept } from '@/data/knowledge-graph';
import type { VerseLink, VerseQuestionLink } from '@/data/types';
import { getWisdomTopic, wisdomTopics } from '@/data/wisdom-for-life';
import { wisdomVerseHref } from '@/lib/wisdom-links';
import { wisdomTopicsForVerse } from '@/lib/wisdom-verse-topics';
import { readHref } from '@/lib/verse-paths';

export interface GraphLink {
  id?: string;
  href: string;
  labelHi: string;
  labelEn: string;
  sanskrit?: string;
}

export interface GraphVerseLink extends GraphLink {
  reference: string;
}

export interface GraphPageModel {
  id: string;
  label: string;
  labelHi: string;
  sanskrit: string;
  transliteration: string;
  overviewHi: string;
  overviewEn: string;
  fullerArticleHref?: string;
  verses: GraphVerseLink[];
  teachings: GraphLink[];
  applications: GraphLink[];
  concepts: GraphLink[];
}

export interface VerseKnowledge {
  concepts: GraphLink[];
  questions: GraphLink[];
  verses: GraphVerseLink[];
}

const CONCEPT_CAP = 4;
const LINK_CAP = 3;
const PAGE_VERSE_CAP = 4;

function conceptHref(concept: GraphConcept): string {
  if (concept.page) return `/concepts/${concept.id}/`;
  if (concept.wisdomSlug) return `/wisdom-for-life/${concept.wisdomSlug}/`;
  if (concept.conceptDetailId && getConceptDetail(concept.conceptDetailId)) {
    return `/concepts/${concept.conceptDetailId}/`;
  }
  return '/concepts/';
}

export function graphConceptLink(id: string): GraphLink | undefined {
  const concept = getGraphConcept(id);
  if (!concept) return undefined;
  return {
    id: concept.id,
    href: conceptHref(concept),
    labelHi: concept.labelHi,
    labelEn: concept.label,
    sanskrit: concept.sanskrit,
  };
}

function pushLink<T extends GraphLink>(list: T[], link: T | undefined, cap: number) {
  if (!link || list.length >= cap) return;
  if (list.some((item) => item.href === link.href)) return;
  list.push(link);
}

function verseLink(scriptureId: string, chapterId: number | undefined, verseId: number | string | undefined, reference: string, sanskrit?: string): GraphVerseLink | undefined {
  if (chapterId == null || verseId == null || verseId === '') return undefined;
  return {
    href: readHref(scriptureId, chapterId, verseId),
    labelHi: reference,
    labelEn: reference,
    sanskrit,
    reference,
  };
}

function sameVerse(scriptureId: string, chapterId: number, verseId: string, link: { scriptureId: string; chapterId?: number; verseId?: number | string }): boolean {
  return link.scriptureId === scriptureId && link.chapterId === chapterId && String(link.verseId) === verseId;
}

function taxonomyForLibraryConcept(libraryId: string): GraphConcept | undefined {
  return GRAPH_CONCEPTS.find((concept) => concept.id === libraryId || concept.libraryConceptId === libraryId || concept.conceptDetailId === libraryId);
}

function directConceptIds(scriptureId: string, chapterId: number, verseId: string): string[] {
  const ids: string[] = [];
  for (const [conceptId, list] of Object.entries(conceptVerses)) {
    for (const cited of list) {
      const citedVerse = cited.verseId != null ? String(cited.verseId) : '';
      if (cited.scriptureId === scriptureId && cited.chapterId === chapterId && citedVerse === verseId) {
        ids.push(conceptId);
        break;
      }
    }
  }
  return ids;
}

export function resolveVerseKnowledge(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
  explicit?: {
    concepts?: string[];
    relatedVerses?: VerseLink[];
    relatedQuestions?: VerseQuestionLink[];
  },
): VerseKnowledge {
  const verseKey = String(verseId);
  const conceptsOut: GraphLink[] = [];
  const questions: GraphLink[] = [];
  const verses: GraphVerseLink[] = [];

  for (const id of explicit?.concepts ?? []) pushLink(conceptsOut, graphConceptLink(id), CONCEPT_CAP);
  for (const question of explicit?.relatedQuestions ?? []) {
    pushLink(questions, { href: question.href, labelHi: question.labelHi, labelEn: question.labelEn }, LINK_CAP);
  }
  for (const related of explicit?.relatedVerses ?? []) {
    pushLink(verses, verseLink(related.scriptureId, related.chapterId, related.verseId, `${related.scriptureId} ${related.chapterId}.${related.verseId}`), LINK_CAP);
  }

  const libraryIds = directConceptIds(scriptureId, chapterId, verseKey);
  for (const libraryId of libraryIds) {
    const node = taxonomyForLibraryConcept(libraryId);
    if (node) pushLink(conceptsOut, graphConceptLink(node.id), CONCEPT_CAP);
    else if (getConceptDetail(libraryId)) {
      const detail = getConceptDetail(libraryId);
      pushLink(conceptsOut, detail && { id: libraryId, href: `/concepts/${libraryId}/`, labelHi: detail.sanskrit, labelEn: detail.label, sanskrit: detail.sanskrit }, CONCEPT_CAP);
    }
    for (const cited of conceptVerses[libraryId] ?? []) {
      if (sameVerse(scriptureId, chapterId, verseKey, cited)) continue;
      pushLink(verses, verseLink(cited.scriptureId, cited.chapterId, cited.verseId, cited.reference, cited.sanskrit), LINK_CAP);
    }
  }

  for (const topic of wisdomTopicsForVerse(scriptureId, chapterId, verseKey)) {
    pushLink(questions, { href: topic.href, labelHi: topic.titleHi, labelEn: topic.titleEn }, LINK_CAP);
    const stored = wisdomTopics.find((item) => item.slug === topic.slug);
    for (const cited of stored?.verses ?? []) {
      const { chapter, verse } = citedVerseLocation(cited);
      if (cited.scriptureId === scriptureId && chapter === chapterId && verse === verseKey) continue;
      pushLink(verses, verseLink(cited.scriptureId, chapter, verse, cited.referenceDisplayHi || cited.referenceDisplay, cited.sanskritDevanagari), LINK_CAP);
    }
  }

  return { concepts: conceptsOut, questions, verses };
}

function citedVerseLocation(cited: { scriptureId: string; chapterNumber: number; verseNumber: number | string; libraryRef?: { chapter: number; verse: number | string } }): { chapter: number; verse: string } {
  const chapter = cited.libraryRef?.chapter ?? cited.chapterNumber;
  const verse = String(cited.libraryRef?.verse ?? cited.verseNumber).split(/[–-]/)[0];
  return { chapter, verse };
}

export function buildGraphPage(id: string): GraphPageModel | null {
  const node = getGraphConcept(id);
  if (!node?.page) return null;

  const detail = node.conceptDetailId ? getConceptDetail(node.conceptDetailId) : undefined;
  const topic = node.wisdomSlug ? getWisdomTopic(node.wisdomSlug) : undefined;
  const library = node.libraryConceptId ? concepts.find((concept) => concept.id === node.libraryConceptId) : undefined;

  const overviewHi = detail?.simpleDefinition.hi || topic?.shortDescHi || library?.shortDesc || 'इस नाम का अलग लेख अभी नहीं लिखा गया।';
  const overviewEn = detail?.simpleDefinition.en || topic?.shortDescEn || library?.shortDesc || '';

  const verses: GraphVerseLink[] = [];
  for (const cited of detail?.verses ?? []) {
    if (!cited.href) continue;
    pushLink(verses, { href: cited.href, labelHi: cited.referenceHi || cited.reference, labelEn: cited.reference, sanskrit: cited.sanskrit, reference: cited.reference }, PAGE_VERSE_CAP);
  }
  for (const cited of (node.libraryConceptId ? conceptVerses[node.libraryConceptId] : undefined) ?? []) {
    pushLink(verses, verseLink(cited.scriptureId, cited.chapterId, cited.verseId, cited.reference, cited.sanskrit), PAGE_VERSE_CAP);
  }
  for (const cited of topic?.verses ?? []) {
    pushLink(verses, {
      href: wisdomVerseHref(cited),
      labelHi: cited.referenceDisplayHi || cited.referenceDisplay,
      labelEn: cited.referenceDisplay,
      sanskrit: cited.sanskritDevanagari,
      reference: cited.referenceDisplay,
    }, PAGE_VERSE_CAP);
  }

  const teachings: GraphLink[] = [];
  for (const scripture of topic?.relatedScriptures ?? []) {
    pushLink(teachings, { href: scripture.href, labelHi: scripture.titleHi, labelEn: scripture.title }, LINK_CAP);
  }
  const relationId = node.conceptDetailId || node.libraryConceptId;
  if (relationId) {
    for (const relation of relationsFor(relationId)) {
      pushLink(teachings, {
        href: readHref(relation.evidence.scriptureId, relation.evidence.chapter, relation.evidence.verse),
        labelHi: relation.note,
        labelEn: relation.note,
      }, LINK_CAP);
    }
  }

  const applications: GraphLink[] = [];
  if (topic) {
    pushLink(applications, { href: `/wisdom-for-life/${topic.slug}/`, labelHi: topic.titleHi, labelEn: topic.titleEn }, LINK_CAP);
  }

  const related: GraphLink[] = [];
  for (const relatedId of node.related) pushLink(related, graphConceptLink(relatedId), 6);

  const fullerArticleHref = node.conceptDetailId && node.conceptDetailId !== node.id && detail
    ? `/concepts/${node.conceptDetailId}/`
    : undefined;

  return {
    id: node.id,
    label: node.label,
    labelHi: node.labelHi,
    sanskrit: node.sanskrit,
    transliteration: node.transliteration,
    overviewHi,
    overviewEn,
    fullerArticleHref,
    verses,
    teachings,
    applications,
    concepts: related,
  };
}
