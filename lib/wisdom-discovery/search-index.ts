/**
 * Wisdom Discovery: build-time searchable index (Phase 6).
 * Lightweight, dependency-free: plain arrays of small entries composed from
 * data modules. The result is cached in module scope and serialized to
 * public/wisdom-discovery-index.json by scripts/build-wisdom-discovery-index.ts.
 */
import { getAllWisdomConcepts, wisdomConceptHref } from '@/data/wisdom-concepts';
import { getAllWisdomQuestions } from '@/data/wisdom-questions';
import { questionHubHref } from './links';
import { getAllKnowledgeHubs, knowledgeHubHref } from '@/data/knowledge-hubs';

export type WisdomSearchEntryKind = 'concept' | 'question' | 'hub';

export interface WisdomSearchEntry {
  kind: WisdomSearchEntryKind;
  id: string;
  labelEn: string;
  labelHi: string;
  href: string;
  keywords: string[];
}

/** Pure builder: no fs, no network, deterministic order (concepts, hubs, questions). */
export function buildWisdomSearchIndex(): WisdomSearchEntry[] {
  const entries: WisdomSearchEntry[] = [];
  for (const concept of getAllWisdomConcepts()) {
    entries.push({
      kind: 'concept',
      id: concept.id,
      labelEn: concept.labelEn,
      labelHi: concept.labelHi,
      href: wisdomConceptHref(concept.id),
      keywords: [
        concept.labelEn.toLowerCase(),
        concept.labelHi,
        concept.sanskrit,
        concept.transliteration.toLowerCase(),
      ],
    });
  }
  for (const hub of getAllKnowledgeHubs()) {
    entries.push({
      kind: 'hub',
      id: hub.slug,
      labelEn: hub.taglineEn,
      labelHi: hub.taglineHi,
      href: knowledgeHubHref(hub.slug),
      keywords: [hub.slug, hub.taglineEn.toLowerCase(), hub.taglineHi],
    });
  }
  for (const q of getAllWisdomQuestions()) {
    entries.push({
      kind: 'question',
      id: q.id,
      labelEn: q.questionEn,
      labelHi: q.questionHi,
      href: questionHubHref(q.id),
      keywords: q.searchKeywords.map((k) => k.toLowerCase()),
    });
  }
  return entries;
}

let cached: WisdomSearchEntry[] | null = null;

/** Cached accessor for server components and API routes. */
export function getWisdomSearchIndex(): WisdomSearchEntry[] {
  if (!cached) cached = buildWisdomSearchIndex();
  return cached;
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Substring match across labels and keywords; cheap enough to run per keystroke count. */
export function searchWisdomDiscovery(query: string, limit = 8): WisdomSearchEntry[] {
  const needle = normalize(query.trim());
  if (needle.length < 2) return [];
  const scored: Array<{ entry: WisdomSearchEntry; score: number }> = [];
  for (const entry of getWisdomSearchIndex()) {
    const hay = normalize(`${entry.labelEn} ${entry.labelHi} ${entry.keywords.join(' ')}`);
    if (!hay.includes(needle)) continue;
    const labelHit = normalize(`${entry.labelEn} ${entry.labelHi}`).includes(needle);
    scored.push({ entry, score: labelHit ? 0 : 1 });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

/** Serialize the index for the static JSON artifact. */
export function wisdomSearchIndexJson(): string {
  return JSON.stringify({ version: 1, entries: buildWisdomSearchIndex() }, null, 2);
}
