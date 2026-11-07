/**
 * Search over the verse index (/search-index/verses.json): the Sanskrit,
 * transliteration, Hindi and English text of every verse that has its own page.
 * Client-safe (no fs); the index is fetched lazily the first time search opens.
 *
 * Matching is built for how people actually type verses they half-remember:
 * Devanagari ignores word breaks and punctuation, Roman text ignores spaces,
 * diacritics and common spelling variants ("karmanye vadhikaraste" finds
 * "karmaṇy-evādhikāras te"), and a trigram fallback forgives typos.
 */
import {
  compactTransliteration,
  isDevanagari,
  normalizeDevanagari,
  normalizeForSearch,
} from '@/lib/normalize-search';
import { phoneticIndex } from '@/lib/searchNormalizer';

/** [scriptureIndex, chapter, verseSlug, sanskrit, transliteration, hindi, english, explanation, flags] */
export type VerseRow = [number, number, string, string, string, string, string, string, number];

export interface VerseIndexFile {
  v: 1;
  scriptures: string[];
  rows: VerseRow[];
}

export const FLAG_EXPLANATION_AI = 1;
export const FLAG_HINDI_AI = 2;
export const FLAG_ENGLISH_AI = 4;

export interface VerseEntry {
  id: string;
  scriptureId: string;
  chapter: number;
  verse: string;
  sanskrit: string;
  transliteration: string;
  hindi: string;
  english: string;
  explanation: string;
  flags: number;
  /** Sanskrit with every space and mark of punctuation removed. */
  devKey: string;
  /** Transliteration folded to a single phonetic string. */
  romanKey: string;
  /** Lower-cased translation and explanation text, for word matching. */
  textKey: string;
  /** The same Sanskrit appears under several references in the library: 0 = unique, 1 = first of a group, 2 = a repeat. */
  dup: 0 | 1 | 2;
  grams?: Set<string>;
  /** romanKey without the vowel "a", built on first use. */
  skeleton?: string;
}

export type VerseMatchKind = 'sanskrit' | 'roman' | 'english' | 'hindi' | 'explanation' | 'fuzzy';

export interface VerseHit {
  entry: VerseEntry;
  score: number;
  kind: VerseMatchKind;
}

/** Words that describe the request, not the verse ("verses about anger", "gita chapter 2 verse 47"). */
export const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'for', 'from', 'in', 'is', 'of', 'on', 'or', 'the', 'to', 'with',
  'verse', 'verses', 'shloka', 'shlokas', 'shlok', 'sloka', 'slokas', 'chapter', 'chapters', 'adhyaya', 'ch',
  'show', 'find', 'me', 'quotes', 'quote', 'teaching', 'teachings', 'scripture', 'scriptures',
  'how', 'what', 'why', 'when', 'who', 'do', 'does', 'i', 'am', 'are', 'was', 'be', 'my', 'you', 'your', 'can', 'should', 'stop', 'get', 'help', 'tell', 'give', 'want',
  'श्लोक', 'अध्याय', 'के', 'में', 'का', 'की', 'को', 'पर', 'बारे', 'से',
]);

let entries: VerseEntry[] = [];
const byRef = new Map<string, VerseEntry>();

export const verseRef = (scriptureId: string, chapter: number, verse: string | number) => `${scriptureId}:${chapter}:${verse}`;

export function loadVerseIndex(file: VerseIndexFile): void {
  entries = file.rows.map(([s, chapter, verse, sanskrit, transliteration, hindi, english, explanation, flags]) => {
    const scriptureId = file.scriptures[s];
    return {
      id: `verse-${scriptureId}-${chapter}-${verse}`,
      scriptureId,
      chapter,
      verse,
      sanskrit,
      transliteration,
      hindi,
      english,
      explanation,
      flags,
      devKey: normalizeDevanagari(sanskrit).replace(/ /g, ''),
      romanKey: compactTransliteration(transliteration),
      textKey: normalizeForSearch(`${english} ${hindi} ${explanation}`),
      dup: 0 as 0 | 1 | 2,
    };
  });
  // Repeated Sanskrit under different references is a data problem (templated or copied rows).
  // Search shows each such text once, below genuine matches, instead of flooding the results.
  const seen = new Map<string, VerseEntry>();
  for (const e of entries) {
    if (e.devKey.length < 12) continue;
    const key = `${e.scriptureId}|${e.devKey}`;
    const first = seen.get(key);
    if (!first) seen.set(key, e);
    else {
      first.dup = 1;
      e.dup = 2;
    }
  }
  byRef.clear();
  for (const e of entries) byRef.set(verseRef(e.scriptureId, e.chapter, e.verse), e);
}

export const isVerseIndexLoaded = (): boolean => entries.length > 0;

export function lookupVerse(scriptureId: string, chapter: number, verse: string | number): VerseEntry | undefined {
  return byRef.get(verseRef(scriptureId, chapter, verse));
}

/** "worrying" → "worry", "fears" → "fear": enough to match a query to a keyword. Used for prefix matching only. */
export function stem(word: string): string {
  if (word.length <= 4) return word;
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ies') && word.length > 5) return `${word.slice(0, -3)}y`;
  if (word.endsWith('ed') && word.length > 5) return word.slice(0, -2);
  if (word.endsWith('es') && word.length > 5) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

/** Content words of a query, in order, stemmed. A query made only of filler words has none. */
export function contentTokens(query: string): string[] {
  return normalizeForSearch(query)
    .split(' ')
    .filter((t) => t && !STOP_WORDS.has(t))
    .map(stem);
}

function trigrams(s: string): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3));
  return out;
}

function dice(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach((g) => b.has(g) && shared++);
  return (2 * shared) / (a.size + b.size);
}

const wordHit = (haystack: string, token: string): boolean =>
  haystack.startsWith(token) || haystack.indexOf(` ${token}`) !== -1;

/**
 * Finds verses for a free-text query. `options.fuzzy` lets the caller switch
 * the typo-tolerant pass on only when exact matching came up empty.
 */
export function searchVerses(query: string, options: { fuzzy?: boolean; limit?: number } = {}): VerseHit[] {
  const q = query.trim();
  if (!q || entries.length === 0) return [];
  const hits = new Map<string, VerseHit>();
  const keep = (entry: VerseEntry, rawScore: number, kind: VerseMatchKind) => {
    if (entry.dup === 2) return;
    const score = entry.dup === 1 ? Math.round(rawScore * 0.5) : rawScore;
    const prev = hits.get(entry.id);
    if (!prev || score > prev.score) hits.set(entry.id, { entry, score, kind });
  };

  const devQuery = isDevanagari(q);
  const tokens = contentTokens(q);

  if (devQuery) {
    // Sanskrit: compare with spaces and punctuation removed, so word breaks and sandhi spacing do not matter.
    const devKey = normalizeDevanagari(q).replace(/ /g, '');
    if (devKey.length >= 4) {
      for (const e of entries) {
        const at = e.devKey.indexOf(devKey);
        if (at === -1) continue;
        keep(e, e.devKey === devKey ? 2000 : at === 0 ? 1600 : 1300, 'sanskrit');
      }
    }
    // Hindi words: every word must appear in the Hindi translation or explanation.
    const hiTokens = normalizeDevanagari(q).split(' ').filter((t) => t && !STOP_WORDS.has(t));
    if (hiTokens.length > 0) {
      for (const e of entries) {
        if (hits.has(e.id)) continue;
        const hay = normalizeDevanagari(`${e.hindi} ${e.explanation}`);
        if (hiTokens.every((t) => hay.includes(t))) {
          const inTranslation = normalizeDevanagari(e.hindi).includes(hiTokens[0]);
          keep(e, 500 + hiTokens.length * 30 + (inTranslation ? 60 : 0), inTranslation ? 'hindi' : 'explanation');
        }
      }
    }
    // The same verse typed in IAST or Hinglish shares this key with the Devanagari.
    const phone = phoneticIndex(q);
    if (phone.length >= 4) {
      for (const e of entries) {
        if (hits.has(e.id)) continue;
        if (e.romanKey.includes(phone)) keep(e, e.romanKey === phone ? 1500 : 1100, 'roman');
      }
    }
  } else {
    const roman = compactTransliteration(q);
    // Roman text: spaces, diacritics and spelling variants are folded away on both sides.
    if (roman.length >= 5) {
      for (const e of entries) {
        const at = e.romanKey.indexOf(roman);
        if (at === -1) continue;
        keep(e, e.romanKey === roman ? 1800 : at === 0 ? 1500 : 1200, 'roman');
      }
      // Hinglish often drops the inherent "a" inside a word (upnishad, bhagwad, karmnye): compare with every "a" removed,
      // ranked below a true roman match and only when that found nothing.
      const skeleton = roman.replace(/a/g, '');
      if (hits.size === 0 && skeleton.length >= 5) {
        for (const e of entries) {
          e.skeleton ??= e.romanKey.replace(/a/g, '');
          if (e.skeleton.includes(skeleton)) keep(e, e.skeleton === skeleton ? 1150 : 1000, 'roman');
        }
      }
    }
    // English: every content word must appear, as the start of a word.
    if (tokens.length > 0 && !(tokens.length === 1 && tokens[0].length < 3)) {
      for (const e of entries) {
        if (hits.has(e.id)) continue;
        if (!tokens.every((t) => wordHit(e.textKey, t))) continue;
        const inEnglish = normalizeForSearch(e.english);
        const inTranslation = tokens.every((t) => wordHit(inEnglish, t));
        keep(e, 500 + tokens.length * 40 + (inTranslation ? 80 : 0), inTranslation ? 'english' : 'explanation');
      }
    }
  }

  // Typo tolerance: only when nothing matched, and only for a query long enough to be a verse fragment.
  const romanQ = compactTransliteration(q);
  if (options.fuzzy && hits.size === 0 && !devQuery && romanQ.length >= 8) {
    const qGrams = trigrams(romanQ);
    for (const e of entries) {
      if (e.romanKey.length < 6) continue;
      e.grams ??= trigrams(e.romanKey);
      // A short query is a fragment of a longer verse, so compare against the best window of the verse.
      const window = e.romanKey.length > romanQ.length * 2 ? windowGrams(e.romanKey, romanQ.length) : [e.grams];
      let best = 0;
      for (const g of window) best = Math.max(best, dice(qGrams, g));
      if (best >= 0.55) keep(e, 300 + Math.round(best * 400), 'fuzzy');
    }
  }

  return Array.from(hits.values())
    .sort((a, b) => b.score - a.score || a.entry.scriptureId.localeCompare(b.entry.scriptureId) || a.entry.chapter - b.entry.chapter)
    .slice(0, options.limit ?? 40);
}

/** Trigram sets of overlapping slices of `key`, each about `len` characters wide. */
function windowGrams(key: string, len: number): Set<string>[] {
  const out: Set<string>[] = [];
  const width = Math.round(len * 1.3);
  const step = Math.max(2, Math.floor(len / 3));
  for (let i = 0; i < key.length; i += step) {
    out.push(trigrams(key.slice(i, i + width)));
    if (i + width >= key.length) break;
  }
  return out;
}
