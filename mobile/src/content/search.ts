/**
 * Offline verse search over the bundled books. Nothing loads until the first search: each book's
 * corpus is read lazily (generated/search-loaders.android.ts: an APK asset; search-loaders.ts on web),
 * prepared once and kept for later queries.
 * The search runs book by book and yields between books, so typing stays smooth.
 */
import { CATALOG, CATEGORIES } from './catalog';
import { SEARCH_LOADERS } from './generated/search-loaders';
import {
  makeSnippet,
  parseQuery,
  prepareCorpus,
  rankHits,
  searchCorpus,
  type PreparedCorpus,
  type QueryToken,
  type Snippet,
  type VerseHit,
} from '@/lib/verse-search';

export type { QueryToken, Snippet, VerseHit };

/** Results kept per search. Enough to browse; the count says when there were more. */
export const MAX_RESULTS = 300;

/** Tie order for equal scores: the Gita first, then the library sections in a reader's order. */
const SECTION_ORDER = ['upanishad', 'smriti', 'stotra', 'other', 'tantra', 'itihasa', 'purana', 'veda'];

const searchable = CATALOG.filter((b) => b.bundled && SEARCH_LOADERS[b.id]).sort((a, b) => {
  if (a.id === 'bhagavadgita' || b.id === 'bhagavadgita') return a.id === 'bhagavadgita' ? -1 : 1;
  return SECTION_ORDER.indexOf(a.category) - SECTION_ORDER.indexOf(b.category);
});

const ORDER = new Map(searchable.map((b, i) => [b.id, i]));

/** Library sections that have searchable books, for the filter chips. */
export const SEARCH_SECTIONS = CATEGORIES.filter((c) => searchable.some((b) => b.category === c.key));

export const SEARCHABLE_COUNT = searchable.length;

const prepared = new Map<string, PreparedCorpus>();

function corpus(id: string): PreparedCorpus | undefined {
  const cached = prepared.get(id);
  if (cached) return cached;
  const load = SEARCH_LOADERS[id];
  if (!load) return undefined;
  let book: PreparedCorpus;
  try {
    book = prepareCorpus(id, load());
  } catch {
    return undefined;
  }
  prepared.set(id, book);
  return book;
}

export interface SearchResult {
  tokens: QueryToken[];
  hits: VerseHit[];
  /** Matches found before the result list was cut at MAX_RESULTS. */
  total: number;
}

const yieldToUi = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Searches every bundled book (or one library section). Returns undefined when `isStale()` turns
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
  for (const entry of searchable) {
    if (section && entry.category !== section) continue;
    const book = corpus(entry.id);
    if (book) {
      const found = searchCorpus(book, tokens);
      total += found.length;
      hits = hits.concat(found);
      // Keep memory flat on broad queries: trim to the best results as we go.
      if (hits.length > MAX_RESULTS * 2) hits = rankHits(hits, ORDER).slice(0, MAX_RESULTS);
    }
    await yieldToUi();
    if (isStale()) return undefined;
  }
  return { tokens, hits: rankHits(hits, ORDER).slice(0, MAX_RESULTS), total };
}

export function snippetFor(hit: VerseHit, tokens: QueryToken[]): Snippet | undefined {
  const book = corpus(hit.id);
  return book ? makeSnippet(book, hit.line, tokens) : undefined;
}
