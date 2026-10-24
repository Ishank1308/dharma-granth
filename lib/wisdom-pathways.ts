/**
 * Wisdom Pathways bridge (Phases 2, 6–8).
 * Resolves pathway verse lenses against validated wisdom topics so Sanskrit
 * always comes from the library, never from pathway prose. The pathway adds
 * Arth, Vyakhya, modern context, lineage, and reflection around that verse.
 */
import { getWisdomTopic, type ScriptureReference } from '@/data/wisdom-for-life';
import { getLineageMaster } from '@/data/wisdom-lineage';
import { getPathway, wisdomPathways, type PathwaySection, type WisdomPathway } from '@/data/wisdom-pathways';
import type { StarterPathway } from '@/data/wisdom-pathway-starters';
import type { WisdomPathwayStage } from '@/data/wisdom-pathway-types';
import { getWisdomConcept, wisdomConceptHref, type WisdomConcept } from '@/data/wisdom-concepts';
import { getAllWisdomQuestions, getWisdomQuestion, type WisdomQuestion } from '@/data/wisdom-questions';
import { topicHref } from '@/lib/topic-links';
import { wisdomVerseHref } from '@/lib/wisdom-links';
import { questionHubHref } from '@/lib/wisdom-discovery/links';

export interface ResolvedPathwayVerse {
  verse: ScriptureReference;
  topicSlug: string;
  arthEn: string;
  arthHi: string;
  vyakhyaEn: string;
  vyakhyaHi: string;
  modernContextEn: string;
  modernContextHi: string;
  lineageIds: string[];
  href: string;
}

export function resolvePathwayVerses(pathway: WisdomPathway): ResolvedPathwayVerse[] {
  const out: ResolvedPathwayVerse[] = [];
  for (const lens of pathway.verseLenses) {
    const topic = getWisdomTopic(lens.topicSlug);
    if (!topic) continue;
    const verse =
      (lens.verseId ? topic.verses.find((v) => v.id === lens.verseId) : undefined) ??
      topic.verses[0];
    if (!verse) continue;
    out.push({
      verse,
      topicSlug: topic.slug,
      arthEn: lens.arthEn,
      arthHi: lens.arthHi,
      vyakhyaEn: lens.vyakhyaEn,
      vyakhyaHi: lens.vyakhyaHi,
      modernContextEn: lens.modernContextEn,
      modernContextHi: lens.modernContextHi,
      lineageIds: lens.lineageIds.filter((id) => getLineageMaster(id)),
      href: wisdomVerseHref(verse),
    });
  }
  return out;
}

/** Genuine questions answered by pathways (Phase 8). */
export const PATHWAY_QUESTIONS: Array<{ questionEn: string; href: string }> =
  wisdomPathways.map((p) => ({ questionEn: p.questionEn, href: `/wisdom-pathways/${p.slug}/` }));

export interface DiscoveryGroup {
  key: 'emotion' | 'challenge' | 'question' | 'scripture' | 'saint' | 'concept';
  labelEn: string;
  labelHi: string;
  entries: Array<{ label: string; href: string }>;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Discovery paths (Phase 6): start from life, arrive at scripture. */
export function pathwayDiscovery(): DiscoveryGroup[] {
  const bySlug = (slug: string) => `/wisdom-pathways/${slug}/`;
  const collect = (pick: (p: WisdomPathway) => string[]) => {
    const map = new Map<string, Set<string>>();
    for (const p of wisdomPathways) {
      for (const v of pick(p)) {
        const set = map.get(v) ?? new Set<string>();
        set.add(p.slug);
        map.set(v, set);
      }
    }
    return map;
  };
  const groups: DiscoveryGroup[] = [];
  const defs: Array<{ key: DiscoveryGroup['key']; labelEn: string; labelHi: string; map: Map<string, Set<string>> }> = [
    { key: 'emotion', labelEn: 'Start from an emotion', labelHi: 'भाव से आरंभ करें', map: collect((p) => p.discovery.emotions) },
    { key: 'challenge', labelEn: 'Start from a life challenge', labelHi: 'जीवन-चुनौती से आरंभ करें', map: collect((p) => p.discovery.challenges) },
    { key: 'question', labelEn: 'Start from a question', labelHi: 'प्रश्न से आरंभ करें', map: collect((p) => p.discovery.questions) },
    { key: 'scripture', labelEn: 'Start from a scripture', labelHi: 'ग्रंथ से आरंभ करें', map: collect((p) => p.discovery.scriptures) },
    { key: 'saint', labelEn: 'Start from a sage or saint', labelHi: 'ऋषि या संत से आरंभ करें', map: collect((p) => [...p.discovery.saints, ...p.lineageIds]) },
    { key: 'concept', labelEn: 'Start from a concept', labelHi: 'अवधारणा से आरंभ करें', map: collect((p) => p.discovery.concepts) },
  ];
  for (const d of defs) {
    const entries = Array.from(d.map.entries()).map(([label, slugs]) => ({
      label,
      href: bySlug(Array.from(slugs)[0]),
    }));
    groups.push({ key: d.key, labelEn: d.labelEn, labelHi: d.labelHi, entries });
  }
  return groups;
}

/** Knowledge-graph integration (Phase 7): verse -> pathway, concept -> pathway. */
export function pathwaysForVerse(scriptureId: string, chapterId: number, verseId: string): WisdomPathway[] {
  const out: WisdomPathway[] = [];
  for (const pathway of wisdomPathways) {
    const resolved = resolvePathwayVerses(pathway);
    if (
      resolved.some(
        (r) =>
          r.verse.scriptureId === scriptureId &&
          (r.verse.libraryRef?.chapter ?? r.verse.chapterNumber) === chapterId &&
          String(r.verse.libraryRef?.verse ?? r.verse.verseNumber).split(/[–-]/)[0] === verseId,
      )
    ) {
      out.push(pathway);
    }
  }
  return out;
}

export function pathwaysForConcept(conceptId: string): WisdomPathway[] {
  const needle = conceptId.toLowerCase();
  return wisdomPathways.filter((p) =>
    p.discovery.concepts.some((c) => c.toLowerCase() === needle),
  );
}

export function relatedPathways(slug: string): WisdomPathway[] {
  const current = getPathway(slug);
  if (!current) return [];
  const explicit = current.relatedPathways
    .map((s) => getPathway(s))
    .filter((p): p is WisdomPathway => Boolean(p));
  if (explicit.length > 0) return explicit;
  return wisdomPathways.filter((p) => p.slug !== slug).slice(0, 3);
}

export function pathwayReadingHref(slug: string): string {
  return `/wisdom-pathways/${slug}/`;
}

export { unique as uniqueStrings };

/* Phase 4 graph resolvers: Concept <-> Pathway <-> Verse <-> Question.
 * Every resolver returns stored editorial links only; unknown slugs
 * resolve to [] instead of broken links. */

function verseKeyOf(r: ResolvedPathwayVerse): string {
  const chapter = r.verse.libraryRef?.chapter ?? r.verse.chapterNumber;
  const verse = String(r.verse.libraryRef?.verse ?? r.verse.verseNumber).split(/[–-]/)[0];
  return `${r.verse.scriptureId}:${chapter}:${verse}`.toLowerCase();
}

function pathwayVerseKeys(pathway: WisdomPathway): Set<string> {
  return new Set(resolvePathwayVerses(pathway).map(verseKeyOf));
}

function pathwayTopicSlugs(pathway: WisdomPathway): Set<string> {
  const out = new Set<string>();
  for (const lens of pathway.verseLenses) {
    if (getWisdomTopic(lens.topicSlug)) out.add(lens.topicSlug.toLowerCase());
  }
  return out;
}

function pathwayConceptSlugs(pathway: WisdomPathway): Set<string> {
  return new Set(pathway.discovery.concepts.map((c) => c.toLowerCase()));
}

/**
 * Question -> Pathway: questions whose anchor verses, topics or concepts
 * overlap the pathway's resolved verses, lens topics or discovery concepts.
 */
export function pathwaysForQuestion(questionId: string): WisdomPathway[] {
  const q = getWisdomQuestion(questionId);
  if (!q) return [];
  const qVerses = new Set(
    q.verses.map((v) => `${v.scriptureId}:${v.chapter}:${String(v.verse).split(/[–-]/)[0]}`.toLowerCase()),
  );
  const qTopics = new Set(q.topicSlugs.map((t) => t.toLowerCase()));
  const qConcepts = new Set(q.conceptSlugs.map((c) => c.toLowerCase()));
  return wisdomPathways.filter((p) => {
    let hit = false;
    pathwayVerseKeys(p).forEach((k) => { if (qVerses.has(k)) hit = true; });
    pathwayTopicSlugs(p).forEach((t) => { if (qTopics.has(t)) hit = true; });
    pathwayConceptSlugs(p).forEach((c) => { if (qConcepts.has(c)) hit = true; });
    return hit;
  });
}

export interface PathwayQuestionLink {
  question: WisdomQuestion;
  href: string;
}

/**
 * Pathway -> Question: discovery questions sharing the pathway's verses,
 * topics or concepts. Unknown question ids never occur (data-driven), but
 * hrefs still resolve through the canonical hub helper.
 */
export function questionsForPathway(slug: string): PathwayQuestionLink[] {
  const pathway = getPathway(slug);
  if (!pathway) return [];
  const verseKeys = pathwayVerseKeys(pathway);
  const topics = pathwayTopicSlugs(pathway);
  const concepts = pathwayConceptSlugs(pathway);
  const out: PathwayQuestionLink[] = [];
  for (const q of getAllWisdomQuestions()) {
    const hitVerse = q.verses.some((v) =>
      verseKeys.has(`${v.scriptureId}:${v.chapter}:${String(v.verse).split(/[–-]/)[0]}`.toLowerCase()),
    );
    const hitTopic = q.topicSlugs.some((t) => topics.has(t.toLowerCase()));
    const hitConcept = q.conceptSlugs.some((c) => concepts.has(c.toLowerCase()));
    if (hitVerse || hitTopic || hitConcept) {
      out.push({ question: q, href: questionHubHref(q.id) });
    }
  }
  return out;
}

export interface PathwayConceptLink {
  concept: WisdomConcept;
  href: string;
}

/** Pathway -> Concept: discovery concepts filtered to concepts that exist. */
export function conceptsForPathway(slug: string): PathwayConceptLink[] {
  const pathway = getPathway(slug);
  if (!pathway) return [];
  const out: PathwayConceptLink[] = [];
  const seen = new Set<string>();
  for (const slugOrId of pathway.discovery.concepts) {
    const concept = getWisdomConcept(slugOrId);
    if (!concept || seen.has(concept.id)) continue;
    seen.add(concept.id);
    out.push({ concept, href: wisdomConceptHref(concept.id) });
  }
  return out;
}

export interface PathwayTopicLink {
  slug: string;
  href: string;
}

/** Validated topic links for a starter (unknown slugs skipped). */
export function topicsForStarter(starter: StarterPathway): PathwayTopicLink[] {
  const out: PathwayTopicLink[] = [];
  for (const slug of starter.topicSlugs) {
    if (!getWisdomTopic(slug)) continue;
    if (out.some((o) => o.slug === slug)) continue;
    out.push({ slug, href: topicHref(slug) });
  }
  return out;
}

/** Validated question links for a starter (unknown ids skipped). */
export function questionsForStarter(starter: StarterPathway): PathwayQuestionLink[] {
  const out: PathwayQuestionLink[] = [];
  for (const id of starter.questionIds) {
    const question = getWisdomQuestion(id);
    if (!question) continue;
    out.push({ question, href: questionHubHref(question.id) });
  }
  return out;
}

export interface ResolvedStarterStage {
  stage: WisdomPathwayStage;
  verses: ResolvedPathwayVerse[];
  reflections: PathwaySection[];
  contemplations: PathwaySection[];
  concepts: PathwayConceptLink[];
}

/**
 * Resolve a starter's stage arc against its canonical pathway.
 * Out-of-range indexes and unknown concept slugs are skipped.
 */
export function resolveStarterStages(starter: StarterPathway): ResolvedStarterStage[] {
  if (!starter.pathwaySlug) return [];
  const pathway = getPathway(starter.pathwaySlug);
  if (!pathway) return [];
  const resolved = resolvePathwayVerses(pathway);
  return starter.stages.map((stage) => ({
    stage,
    verses: stage.lensIndexes
      .map((i) => resolved[i])
      .filter((v): v is ResolvedPathwayVerse => Boolean(v)),
    reflections: stage.reflectionIndexes
      .map((i) => pathway.reflectionQuestions[i])
      .filter((v): v is PathwaySection => Boolean(v)),
    contemplations: stage.contemplationIndexes
      .map((i) => pathway.contemplationPrompts[i])
      .filter((v): v is PathwaySection => Boolean(v)),
    concepts: stage.conceptSlugs.flatMap((slug) => {
      const concept = getWisdomConcept(slug);
      return concept ? [{ concept, href: wisdomConceptHref(concept.id) }] : [];
    }),
  }));
}
