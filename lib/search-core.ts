// Tier-1 search index (/search/core-index.json) and one lazy scripture shard.
// The browser fetches these. They are not part of the first-load bundle.

import { phoneticIndex } from '@/lib/searchNormalizer';
import { citationScriptureHint } from '@/lib/search-citation';
import type { SearchResultItem } from '@/lib/search-types';

/** [id, title, sanskrit, href] */
export type CoreScripture = [string, string, string, string];
/** [id, chapter, title, sanskrit] */
export type CoreChapter = [string, number, string, string];
/** [id, title, sanskrit] */
export type CorePathway = [string, string, string];
/** [slug, title, hindi] */
export type CoreTopic = [string, string, string];
/** [id, library chapter, verse, label, href] */
export type CoreVerse = [string, number, string, string, string];

export interface CoreIndexFile {
  v: 1;
  scriptures: CoreScripture[];
  chapters: CoreChapter[];
  pathways: CorePathway[];
  topics: CoreTopic[];
  verses: CoreVerse[];
}

/** [chapter, verse, sanskrit, translation, href] */
export type ShardVerse = [number, string, string, string, string];

export interface SearchShardFile {
  v: 1;
  id: string;
  verses: ShardVerse[];
}

interface Prepared {
  item: SearchResultItem;
  p: string;
}

let core: CoreIndexFile | null = null;
let shard: SearchShardFile | null = null;
let prepared: Prepared[] | null = null;
let shardPrepared: Prepared[] | null = null;

export function isCoreIndexLoaded(): boolean {
  return core !== null;
}

export function loadCoreIndex(data: CoreIndexFile): void {
  if (!data || data.v !== 1 || !Array.isArray(data.scriptures)) return;
  core = data;
  prepared = null;
}

export function loadSearchShard(data: SearchShardFile): void {
  if (!data || data.v !== 1 || typeof data.id !== 'string' || !Array.isArray(data.verses)) return;
  shard = data;
  shardPrepared = null;
}

export function coreScriptureHint(query: string): string | null {
  return citationScriptureHint(query);
}

function chapterHref(id: string, n: number): string {
  if (id === 'ashtavakra') return `/ashtavakra/${n}/`;
  return `/scripture/${id}/chapter/${n}`;
}

function row(item: SearchResultItem, p: string): Prepared {
  return { item, p };
}

function ensurePrepared(): Prepared[] {
  if (prepared || !core) return prepared ?? [];
  const next: Prepared[] = [];
  for (const [id, title, sanskrit, href] of core.scriptures) {
    next.push(row({
      id: `core-scripture-${id}`,
      title,
      subtitle: sanskrit,
      group: 'scripture',
      groupLabel: 'ग्रंथ · Scripture',
      category: 'scripture',
      categoryLabel: 'ग्रंथ · Scripture',
      href,
      matchingText: title,
      matchReason: 'Matches a scripture name',
      languageLabel: 'Sanskrit & English',
      actionLabel: 'Open scripture →',
    }, phoneticIndex(`${title} ${sanskrit} ${id}`)));
  }
  for (const [id, n, title, sanskrit] of core.chapters) {
    const label = title || sanskrit || `Chapter ${n}`;
    next.push(row({
      id: `core-chapter-${id}-${n}`,
      title: label,
      subtitle: sanskrit && sanskrit !== label ? sanskrit : undefined,
      group: 'chapter',
      groupLabel: 'अध्याय · Chapter',
      category: 'chapter',
      categoryLabel: 'अध्याय · Chapter',
      href: chapterHref(id, n),
      reference: `${id} ${n}`,
      matchingText: `${label} ${sanskrit}`,
      matchReason: 'Matches a chapter',
      languageLabel: 'Sanskrit & English',
      actionLabel: 'Read chapter →',
    }, phoneticIndex(`${id} ${n} ${title} ${sanskrit}`)));
  }
  for (const [id, title, sanskrit] of core.pathways) {
    next.push(row({
      id: `core-pathway-${id}`,
      title,
      subtitle: sanskrit,
      group: 'learning',
      groupLabel: 'अध्ययन · Learning',
      category: 'pathway',
      categoryLabel: 'अध्ययन · Learning',
      href: `/learn/${id}/`,
      matchingText: title,
      matchReason: 'Matches a learning pathway',
      languageLabel: 'English & Sanskrit',
      actionLabel: 'Open pathway →',
    }, phoneticIndex(`${title} ${sanskrit} ${id}`)));
  }
  for (const [slug, title, hindi] of core.topics) {
    next.push(row({
      id: `core-topic-${slug}`,
      title,
      subtitle: hindi,
      group: 'topic',
      groupLabel: 'विषय · Wisdom for Life',
      category: 'topic',
      categoryLabel: 'जीवन के लिए · Wisdom for Life',
      href: `/wisdom-for-life/${slug}/`,
      matchingText: `${title} ${hindi}`,
      matchReason: 'Matches a life topic',
      languageLabel: 'English & Hindi',
      actionLabel: 'Explore topic →',
    }, phoneticIndex(`${title} ${hindi} ${slug}`)));
  }
  for (const [id, chapter, verse, label, href] of core.verses) {
    next.push(row({
      id: `core-verse-${id}-${chapter}-${verse}`,
      title: label,
      subtitle: 'Key verse',
      group: 'verse',
      groupLabel: 'श्लोक · Exact Verse',
      category: 'verse',
      categoryLabel: 'श्लोक · Exact Verse',
      href,
      reference: label,
      matchingText: label,
      matchReason: 'Key verse',
      languageLabel: 'Reference',
      actionLabel: 'Open verse →',
    }, phoneticIndex(`${label} ${id} ${chapter} ${verse}`)));
  }
  prepared = next;
  return next;
}

function ensureShard(): Prepared[] {
  if (shardPrepared || !shard) return shardPrepared ?? [];
  shardPrepared = shard.verses.map(([chapter, verse, sanskrit, translation, href]) => row({
    id: `shard-${shard!.id}-${chapter}-${verse}`,
    title: sanskrit.split('\n')[0]?.slice(0, 80) || `${shard!.id} ${chapter}.${verse}`,
    subtitle: translation.slice(0, 120),
    group: 'verse',
    groupLabel: 'श्लोक · Exact Verse',
    category: 'verse',
    categoryLabel: 'श्लोक · Exact Verse',
    href,
    reference: `${shard!.id} ${chapter}.${verse}`,
    matchingText: sanskrit,
    translationExcerpt: translation,
    matchedField: 'sanskrit',
    matchReason: 'Matches this scripture',
    languageLabel: 'Sanskrit',
    actionLabel: 'Open verse →',
  }, phoneticIndex(`${sanskrit} ${translation} ${chapter} ${verse}`)));
  return shardPrepared;
}

function scorePrepared(p: string, rowP: string): number {
  if (!p || p.length < 3 || !rowP) return 0;
  if (rowP === p) return 1400;
  if (rowP.startsWith(p)) return 900;
  if (rowP.includes(p)) return 650;
  return 0;
}

/** Results from the Tier-1 index, plus the open scripture shard when the query names that book. */
export function searchCoreIndex(query: string): Array<{ item: SearchResultItem; score: number }> {
  const p = phoneticIndex(query);
  const out: Array<{ item: SearchResultItem; score: number }> = [];
  for (const entry of ensurePrepared()) {
    const score = scorePrepared(p, entry.p);
    if (score > 0) out.push({ item: entry.item, score });
  }
  const hint = citationScriptureHint(query);
  if (shard && hint === shard.id) {
    for (const entry of ensureShard()) {
      const score = scorePrepared(p, entry.p);
      if (score > 0) out.push({ item: entry.item, score: score + 50 });
    }
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, 24);
}
