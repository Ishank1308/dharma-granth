/**
 * Pure logic for the scripture library: facets, filtering, sorting,
 * pluralisation and "did you mean" suggestions. No React and no fs, so it can
 * be unit-checked and shared by the server page and the client component.
 *
 * Nothing here invents content. A facet is either read from the catalogue
 * (category, author, verse counts, tags) or derived by a rule documented next
 * to it; fields the catalogue does not hold are reported as missing.
 */
import type { ScriptureMeta } from '@/data/types';
import type { BookExplanation } from '@/data/book-explanations';
import { normalizeTransliteration } from '@/lib/normalize-search';

/** Facts measured from the published data files at build time (lib/library-server.ts). */
export interface LibraryFacts {
  /** Languages with text present in at least one published verse. */
  languages: { sa: boolean; hi: boolean; en: boolean };
  /** Full-corpus counts, measured across the published chapter shards. */
  languageCoverage?: { totalVerses: number; sa: number; hi: number; en: number };
  /** A Hindi verse-commentary file exists for this text. */
  hindiCommentary: boolean;
  /** Host of the Sanskrit source (e.g. sanskritdocuments.org). */
  sourceHost?: string;
  /** ISO date the source text was fetched. */
  sourceFetched?: string;
  /** ISO date the text or its commentary last changed (git history). */
  lastUpdated?: string;
}

export interface LibraryItem extends ScriptureMeta {
  explanation?: BookExplanation;
  facts: LibraryFacts;
}

/* ── Facet definitions ─────────────────────────────────────────────── */

export type FacetKey =
  | 'category'
  | 'tradition'
  | 'language'
  | 'topic'
  | 'author'
  | 'length'
  | 'explained'
  | 'beginner';

export interface Filters {
  q: string;
  category: string[];
  tradition: string[];
  language: string[];
  topic: string[];
  author: string[];
  length: string[];
  explained: boolean;
  beginner: boolean;
}

export const EMPTY_FILTERS: Filters = {
  q: '',
  category: [],
  tradition: [],
  language: [],
  topic: [],
  author: [],
  length: [],
  explained: false,
  beginner: false,
};

export type SortMode = 'featured' | 'az' | 'verses' | 'chapters' | 'fewest';
export type ViewMode = 'compact' | 'detailed';

export const SORT_OPTIONS: Array<{ id: SortMode; label: string }> = [
  { id: 'featured', label: 'Featured' },
  { id: 'az', label: 'A–Z' },
  { id: 'verses', label: 'Most verses' },
  { id: 'chapters', label: 'Most chapters' },
  { id: 'fewest', label: 'Shortest first' },
];

/**
 * Tradition is derived from tags and category, because the catalogue has no
 * tradition field. A text can belong to several traditions or to none.
 */
export const TRADITIONS: Array<{ id: string; label: string; hi: string }> = [
  { id: 'vedic', label: 'Vedic (Shruti)', hi: 'वैदिक' },
  { id: 'vedanta', label: 'Vedanta', hi: 'वेदान्त' },
  { id: 'vaishnava', label: 'Vaishnava', hi: 'वैष्णव' },
  { id: 'shaiva', label: 'Shaiva', hi: 'शैव' },
  { id: 'shakta', label: 'Shakta', hi: 'शाक्त' },
  { id: 'yoga', label: 'Yoga & Tantra', hi: 'योग व तंत्र' },
];

const TRADITION_TAGS: Record<string, string[]> = {
  vaishnava: ['vishnu', 'krishna', 'rama', 'narasimha', 'hanuman', 'bhagavata'],
  shaiva: ['shiva', 'shaiva', 'rudra'],
  shakta: ['devi', 'shakti', 'durga'],
  vedanta: ['advaita', 'nondual', 'brahman', 'vedanta'],
  yoga: ['yoga', 'nadayoga', 'tantra', 'kundalini'],
};

export function traditionsOf(item: ScriptureMeta): string[] {
  const tags = item.tags.map((t) => t.toLowerCase());
  const out: string[] = [];
  if (item.category === 'veda' || item.category === 'upanishad') out.push('vedic');
  Object.keys(TRADITION_TAGS).forEach((id) => {
    if (TRADITION_TAGS[id].some((t) => tags.indexOf(t) !== -1)) out.push(id);
  });
  if (item.category === 'tantra' && out.indexOf('yoga') === -1) out.push('yoga');
  return out;
}

export const LENGTHS: Array<{ id: string; label: string; hint: string }> = [
  { id: 'short', label: 'Short', hint: 'under 100 verses' },
  { id: 'medium', label: 'Medium', hint: '100 – 1,000 verses' },
  { id: 'long', label: 'Long', hint: 'over 1,000 verses' },
];

export function lengthOf(item: ScriptureMeta): string {
  if (item.totalVerses < 100) return 'short';
  if (item.totalVerses <= 1000) return 'medium';
  return 'long';
}

/**
 * Editorial choice, not derived data: well-known, compact texts that suit a
 * first read. Edit this list to change what "Beginner friendly" means.
 */
export const BEGINNER_IDS = [
  'bhagavadgita',
  'ishavasya',
  'kena',
  'katha',
  'mundaka',
  'mandukya',
  'naradabhaktisutra',
  'viduraniti',
];

export const isBeginnerFriendly = (item: ScriptureMeta): boolean => BEGINNER_IDS.indexOf(item.id) !== -1;

/** A rule-of-thumb estimate, labelled as such in the UI. */
export function readingLevelOf(item: ScriptureMeta): { id: 'introductory' | 'intermediate' | 'advanced'; label: string } {
  if (isBeginnerFriendly(item)) return { id: 'introductory', label: 'Introductory' };
  if (item.category === 'veda' || item.category === 'tantra' || item.totalVerses > 5000) {
    return { id: 'advanced', label: 'Advanced' };
  }
  return { id: 'intermediate', label: 'Intermediate' };
}

export const LANGUAGES: Array<{ id: 'sa' | 'hi' | 'en'; label: string; native: string }> = [
  { id: 'sa', label: 'Sanskrit', native: 'संस्कृत' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'en', label: 'English', native: 'English' },
];

/** The library's topic taxonomy; a text has a topic when one of its keywords is a whole word in its title, description or tags. */
export const TOPICS: Array<{ id: string; label: string; hi: string; keywords: string[] }> = [
  { id: 'dharma', label: 'Dharma & duty', hi: 'धर्म व कर्तव्य', keywords: ['dharma', 'कर्तव्य', 'duty', 'moral', 'righteousness', 'ethics'] },
  { id: 'karma', label: 'Karma & action', hi: 'कर्म व योग', keywords: ['karma', 'कर्म', 'action', 'sacrifice'] },
  { id: 'bhakti', label: 'Bhakti & devotion', hi: 'भक्ति व समर्पण', keywords: ['bhakti', 'भक्ति', 'devotion', 'surrender', 'love', 'prayer'] },
  { id: 'jnana', label: 'Jnana & the Self', hi: 'ज्ञान व आत्मबोध', keywords: ['jnana', 'ज्ञान', 'knowledge', 'self', 'brahman', 'atman', 'upanishad'] },
  { id: 'dhyana', label: 'Dhyana & meditation', hi: 'ध्यान व साधना', keywords: ['dhyana', 'ध्यान', 'meditation', 'yoga', 'mind', 'stillness'] },
  { id: 'moksha', label: 'Moksha & liberation', hi: 'मोक्ष व मुक्ति', keywords: ['moksha', 'मोक्ष', 'liberation', 'freedom', 'immortality'] },
];

const topicCache = new WeakMap<ScriptureMeta, string[]>();

export function topicsOf(item: ScriptureMeta): string[] {
  const hit = topicCache.get(item);
  if (hit) return hit;
  const words = normalizeTransliteration([item.title, item.description, ...item.tags].join(' ')).split(' ');
  const ids = TOPICS.filter((t) => t.keywords.some((k) => words.indexOf(normalizeTransliteration(k)) !== -1)).map((t) => t.id);
  topicCache.set(item, ids);
  return ids;
}

/** Tags worth showing as "major themes" (those that merely restate the category are dropped). */
const GENERIC_TAGS = ['purana', 'upanishad', 'mahapurana', 'veda', 'tantra', 'gita'];
export function themesOf(item: ScriptureMeta): string[] {
  return item.tags.filter((t) => GENERIC_TAGS.indexOf(t.toLowerCase()) === -1);
}

export type VerificationStatus = { id: 'partial' | 'curated' | 'published' | 'catalog'; label: string; hint: string };

/**
 * Presence of files, not a source review. No badge says "verified" unless a
 * review record exists; this library does not invent that record.
 */
export function verificationOf(item: ScriptureMeta): VerificationStatus {
  const catalogue = item.canonicalTotalVerses;
  const partial = catalogue != null && catalogue > item.totalVerses;
  if (!item.hasData || item.totalVerses === 0) {
    return { id: 'catalog', label: 'Catalogue entry', hint: 'सूची में है। श्लोक पाठ अभी प्रकाशित नहीं है।' };
  }
  if (item.selectedVerses) {
    return {
      id: 'curated',
      label: 'चयनित श्लोक · Selected verses',
      hint: 'पुस्तकालय में इस ग्रंथ के चुने हुए श्लोक हैं, पूरा पाठ नहीं।',
    };
  }
  if (item.isCurated || partial) {
    return {
      id: item.isCurated ? 'curated' : 'partial',
      label: item.isCurated ? 'Curated selection' : 'Partial text',
      hint: 'पुस्तकालय में चयन है, पूरा पारंपरिक पाठ नहीं।',
    };
  }
  return {
    id: 'published',
    label: 'Text in the library',
    hint: 'श्लोक पुस्तकालय में हैं। स्रोत-सत्यापन अलग से दर्ज होता है।',
  };
}

/* ── Matching ──────────────────────────────────────────────────────── */

export interface Searchable {
  item: LibraryItem;
  haystack: string;
  /** Words from names, titles and tags, used to suggest corrections: `key` is matched, `display` is shown. */
  vocab: Array<{ key: string; display: string }>;
}

export function buildSearchable(items: LibraryItem[]): Searchable[] {
  return items.map((item) => {
    const nameText = [item.title, item.titleSanskrit, item.titleIast, item.author, ...item.tags].filter(Boolean).join(' ');
    const haystack = normalizeTransliteration(
      [nameText, item.description, item.category, item.explanation?.overview.en, item.explanation?.overview.hi]
        .filter(Boolean)
        .join(' '),
    );
    const vocab = nameText
      .split(/[^A-Za-zÀ-ɏ]+/)
      .filter((w) => w.length > 2)
      .map((w) => ({ key: normalizeTransliteration(w), display: w }))
      .filter((w) => w.key.length > 2);
    return { item, haystack, vocab };
  });
}

export function queryTokens(q: string): string[] {
  const n = normalizeTransliteration(q);
  return n ? n.split(' ') : [];
}

function matchesFacet(item: LibraryItem, key: FacetKey, f: Filters): boolean {
  switch (key) {
    case 'category':
      return f.category.length === 0 || f.category.indexOf(item.category) !== -1;
    case 'tradition':
      return f.tradition.length === 0 || traditionsOf(item).some((t) => f.tradition.indexOf(t) !== -1);
    case 'language':
      return f.language.length === 0 || f.language.some((l) => item.facts.languages[l as 'sa' | 'hi' | 'en']);
    case 'topic':
      return f.topic.length === 0 || topicsOf(item).some((t) => f.topic.indexOf(t) !== -1);
    case 'author':
      return f.author.length === 0 || (!!item.author && f.author.indexOf(item.author) !== -1);
    case 'length':
      return f.length.length === 0 || f.length.indexOf(lengthOf(item)) !== -1;
    case 'explained':
      // Presence of verse files. The control must not say each verse is explained.
      return !f.explained || item.hasData;
    case 'beginner':
      return !f.beginner || isBeginnerFriendly(item);
  }
}

const FACET_KEYS: FacetKey[] = ['category', 'tradition', 'language', 'topic', 'author', 'length', 'explained', 'beginner'];

/** Does the item pass every active facet and the text query? `skip` leaves one facet out (for option counts). */
export function matches(entry: Searchable, f: Filters, tokens: string[], skip?: FacetKey): boolean {
  if (tokens.length > 0 && !tokens.every((t) => entry.haystack.indexOf(t) !== -1)) return false;
  return FACET_KEYS.every((key) => key === skip || matchesFacet(entry.item, key, f));
}

export function applyFilters(all: Searchable[], f: Filters): LibraryItem[] {
  const tokens = queryTokens(f.q);
  return all.filter((e) => matches(e, f, tokens)).map((e) => e.item);
}

/** How many results each option of a facet would give with the *other* filters held fixed. */
export function facetCounts(all: Searchable[], f: Filters, key: FacetKey, options: string[]): Record<string, number> {
  const tokens = queryTokens(f.q);
  const pool = all.filter((e) => matches(e, f, tokens, key));
  const out: Record<string, number> = {};
  const isToggle = key === 'explained' || key === 'beginner';
  options.forEach((opt) => {
    const probe = { ...EMPTY_FILTERS, [key]: isToggle ? true : [opt] } as Filters;
    out[opt] = pool.filter((e) => matchesFacet(e.item, key, probe)).length;
  });
  return out;
}

export function activeFilterCount(f: Filters): number {
  return (
    f.category.length + f.tradition.length + f.language.length + f.topic.length + f.author.length + f.length.length +
    (f.explained ? 1 : 0) + (f.beginner ? 1 : 0)
  );
}

export function sortItems(items: LibraryItem[], mode: SortMode): LibraryItem[] {
  const out = items.slice();
  switch (mode) {
    case 'az':
      return out.sort((a, b) => a.title.localeCompare(b.title));
    case 'verses':
      return out.sort((a, b) => b.totalVerses - a.totalVerses);
    case 'chapters':
      return out.sort((a, b) => b.totalChapters - a.totalChapters);
    case 'fewest':
      return out.sort((a, b) => a.totalVerses - b.totalVerses);
    default:
      // Verse-by-verse texts first; the sort is stable so catalogue order holds within each group.
      return out.sort((a, b) => Number(b.hasData) - Number(a.hasData));
  }
}

/* ── Labels ────────────────────────────────────────────────────────── */

const pluralRules = new Intl.PluralRules('en');
const numberFormat = new Intl.NumberFormat('en-IN');

/** `plural(1, 'chapter')` → "1 chapter"; `plural(20, 'verse')` → "20 verses". */
export function plural(count: number, noun: string, pluralNoun = `${noun}s`): string {
  const isSingular = count === 1 || pluralRules.select(count) === 'one';
  return `${numberFormat.format(count)} ${isSingular ? noun : pluralNoun}`;
}

export const formatNumber = (n: number): string => numberFormat.format(n);

export function countLabel(item: ScriptureMeta): { chapters: string; verses: string } {
  return {
    chapters: plural(item.totalChapters, 'chapter'),
    verses: plural(item.totalVerses, 'verse'),
  };
}

/** First sentence(s) of a description, capped, for the three-line card summary. */
export function summaryOf(description: string, max = 220): string {
  const clean = description.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const firstSentence = clean.match(/^.{40,}?[.!?](?=\s|$)/);
  if (firstSentence && firstSentence[0].length <= max) return firstSentence[0];
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

/* ── "Did you mean" ────────────────────────────────────────────────── */

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  let prev: number[] = [];
  for (let j = 0; j <= b.length; j++) prev.push(j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur.push(Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    }
    prev = cur;
  }
  return prev[b.length];
}

/**
 * Suggests a corrected query when `q` finds nothing: each unmatched word is
 * swapped for the closest word in the catalogue's titles and tags. Returns
 * null unless the corrected query would actually return results.
 */
export function suggestCorrection(all: Searchable[], q: string): string | null {
  const tokens = queryTokens(q);
  if (tokens.length === 0) return null;
  const vocab: Array<{ key: string; display: string }> = [];
  all.forEach((e) => e.vocab.forEach((w) => vocab.some((v) => v.key === w.key) || vocab.push(w)));

  // Match on normalised keys, but show readable words ("Upanishad", not "upanisad").
  const fixedKeys: string[] = [];
  const shown = tokens.map((token) => {
    if (all.some((e) => e.haystack.indexOf(token) !== -1)) {
      fixedKeys.push(token);
      return token;
    }
    const limit = token.length <= 4 ? 1 : token.length <= 8 ? 2 : 3;
    let best: { key: string; display: string } | null = null;
    let bestDistance = limit + 1;
    vocab.forEach((word) => {
      if (Math.abs(word.key.length - token.length) > limit) return;
      const d = editDistance(token, word.key);
      if (d < bestDistance) {
        best = word;
        bestDistance = d;
      }
    });
    const hit = best as { key: string; display: string } | null;
    fixedKeys.push(hit ? hit.key : token);
    return hit ? hit.display : token;
  });
  if (fixedKeys.join(' ') === tokens.join(' ')) return null;
  return all.some((e) => fixedKeys.every((t) => e.haystack.indexOf(t) !== -1)) ? shown.join(' ') : null;
}
