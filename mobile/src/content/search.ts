/**
 * Offline verse search over the bundled books and the large texts the reader has downloaded.
 *
 * Bundled books: each corpus is a lazy require() (generated/search-loaders.ts), prepared on the first
 * search and kept for later queries. Downloaded books: an index built on the phone during the download
 * (src/content/download-index.ts), read a chunk at a time so memory stays flat.
 * The search runs book by book (chunk by chunk) and yields in between, so typing stays smooth.
 */
import { useSyncExternalStore } from 'react';

import { CATALOG, CATEGORIES } from './catalog';
import {
  buildIndexFromChapters,
  chunkForLine,
  loadIndexChunk,
  readIndexManifest,
  yieldToUi,
  type IndexManifest,
} from './download-index';
import { downloadedBookDir, isDownloaded } from './downloads';
import { SEARCH_LOADERS } from './generated/search-loaders';
import {
  makeSnippet,
  parseQuery,
  prepareCorpus,
  rankHits,
  searchCorpus,
  shiftChunkHits,
  type PreparedCorpus,
  type QueryToken,
  type Snippet,
  type VerseHit,
} from '@/lib/verse-search';
import type { CatalogEntry } from './types';

export type { QueryToken, Snippet, VerseHit };

/** Results kept per search. Enough to browse; the count says when there were more. */
export const MAX_RESULTS = 300;

/** Tie order for equal scores: the Gita first, then the library sections in a reader's order. */
const SECTION_ORDER = ['upanishad', 'smriti', 'stotra', 'other', 'tantra', 'itihasa', 'purana', 'veda'];

const isBundledSearchable = (b: CatalogEntry) => b.bundled && Boolean(SEARCH_LOADERS[b.id]);

/** Every book that is or can become searchable, in tie order. Downloaded books join when present. */
const ordered = CATALOG.filter((b) => isBundledSearchable(b) || !b.bundled).sort((a, b) => {
  if (a.id === 'bhagavadgita' || b.id === 'bhagavadgita') return a.id === 'bhagavadgita' ? -1 : 1;
  return SECTION_ORDER.indexOf(a.category) - SECTION_ORDER.indexOf(b.category);
});

const ORDER = new Map(ordered.map((b, i) => [b.id, i]));

/** Books searchable right now: the bundled ones and whatever has been downloaded. */
function searchableNow(): CatalogEntry[] {
  return ordered.filter((b) => isBundledSearchable(b) || isDownloaded(b.id));
}

/** Library sections that have searchable books, for the filter chips. Pass the downloaded ids so it updates. */
export function searchSections(downloaded: string[]): typeof CATEGORIES {
  const have = new Set(downloaded);
  return CATEGORIES.filter((c) => ordered.some((b) => b.category === c.key && (isBundledSearchable(b) || have.has(b.id))));
}

export const BUNDLED_SEARCHABLE_COUNT = ordered.filter(isBundledSearchable).length;

const prepared = new Map<string, PreparedCorpus>();

function corpus(id: string): PreparedCorpus | undefined {
  const cached = prepared.get(id);
  if (cached) return cached;
  const load = SEARCH_LOADERS[id];
  if (!load) return undefined;
  const book = prepareCorpus(id, load());
  prepared.set(id, book);
  return book;
}

export interface SearchResult {
  tokens: QueryToken[];
  hits: VerseHit[];
  /** Matches found before the result list was cut at MAX_RESULTS. */
  total: number;
}

/** Snippets of downloaded-book hits, made while their chunks were at hand. */
const downloadedSnippets = new WeakMap<VerseHit, Snippet>();

/**
 * Searches every searchable book (or one library section). Returns undefined when `isStale()` turns
 * true part way, because a newer query has replaced this one.
 */
export async function searchVerses(
  query: string,
  { section, isStale }: { section?: string | null; isStale: () => boolean },
): Promise<SearchResult | undefined> {
  const tokens = parseQuery(query);
  if (tokens.length === 0) return { tokens, hits: [], total: 0 };
  let hits: VerseHit[] = [];
  let total = 0;
  const manifests = new Map<string, IndexManifest>();
  const add = (found: VerseHit[]) => {
    total += found.length;
    hits = hits.concat(found);
    // Keep memory flat on broad queries: trim to the best results as we go.
    if (hits.length > MAX_RESULTS * 2) hits = rankHits(hits, ORDER).slice(0, MAX_RESULTS);
  };

  for (const entry of searchableNow()) {
    if (section && entry.category !== section) continue;
    if (entry.bundled) {
      const book = corpus(entry.id);
      if (book) add(searchCorpus(book, tokens));
      await yieldToUi();
      if (isStale()) return undefined;
      continue;
    }
    const dir = downloadedBookDir(entry.id);
    const manifest = readIndexManifest(entry.id, dir);
    // Not indexed yet (downloaded by an older app version): prepareSearchIndexes() builds it.
    if (!manifest) continue;
    manifests.set(entry.id, manifest);
    for (const chunk of manifest.chunks) {
      const book = loadIndexChunk(entry.id, dir, chunk);
      if (book) {
        add(shiftChunkHits(searchCorpus(book, tokens), book, chunk));
      }
      await yieldToUi();
      if (isStale()) return undefined;
    }
  }
  hits = rankHits(hits, ORDER).slice(0, MAX_RESULTS);

  // Make the snippets of downloaded-book results now, a chunk at a time, so scrolling the list never
  // reads from storage.
  const byChunk = new Map<string, VerseHit[]>();
  for (const h of hits) {
    const manifest = manifests.get(h.id);
    const chunk = manifest && chunkForLine(manifest, h.line);
    if (!chunk) continue;
    const key = `${h.id}\u0000${chunk.file}`;
    const list = byChunk.get(key);
    if (list) list.push(h);
    else byChunk.set(key, [h]);
  }
  for (const list of byChunk.values()) {
    const id = list[0].id;
    const chunk = chunkForLine(manifests.get(id)!, list[0].line)!;
    const book = loadIndexChunk(id, downloadedBookDir(id), chunk);
    if (!book) continue;
    for (const h of list) downloadedSnippets.set(h, makeSnippet(book, h.line - chunk.start, tokens));
    if (isStale()) return undefined;
  }

  return { tokens, hits, total };
}

export function snippetFor(hit: VerseHit, tokens: QueryToken[]): Snippet | undefined {
  const made = downloadedSnippets.get(hit);
  if (made) return made;
  const book = corpus(hit.id);
  return book ? makeSnippet(book, hit.line, tokens) : undefined;
}

// ---- Indexes of books downloaded before the app could search them ----

let indexing: { pending: string[]; generation: number } = { pending: [], generation: 0 };
const indexListeners = new Set<() => void>();
let indexRun: Promise<void> | null = null;

function setIndexing(next: typeof indexing) {
  indexing = next;
  indexListeners.forEach((l) => l());
}

/**
 * Downloaded books whose search index is being built, and a counter that goes up each time one is
 * finished (so the search screen can search again).
 */
export function useSearchIndexing(): { pending: string[]; generation: number } {
  return useSyncExternalStore(
    (l) => {
      indexListeners.add(l);
      return () => indexListeners.delete(l);
    },
    () => indexing,
    () => indexing,
  );
}

/** Builds the missing indexes of the given downloaded books, one book at a time, in the background. */
export function prepareSearchIndexes(ids: string[]): void {
  if (indexRun) return;
  const missing = ids.filter((id) => isDownloaded(id) && !readIndexManifest(id, downloadedBookDir(id)));
  if (missing.length === 0) return;
  setIndexing({ ...indexing, pending: missing });
  indexRun = (async () => {
    for (const id of missing) {
      await buildIndexFromChapters(downloadedBookDir(id), () => !isDownloaded(id));
      setIndexing({ pending: indexing.pending.filter((p) => p !== id), generation: indexing.generation + 1 });
    }
  })().finally(() => {
    indexRun = null;
  });
}
