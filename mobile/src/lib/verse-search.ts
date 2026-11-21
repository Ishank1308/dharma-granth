/**
 * Offline verse search: text folding plus the search engine. Pure functions over one book's prebuilt corpus
 * (scripts/build-search-index.mjs), so the same code folds the index at build time, runs in the app and in `npm test`.
 *
 * Matching is by substring on folded text: Sanskrit compounds (धर्मक्षेत्रे) are found by any part
 * of the word, and every query word must appear somewhere in the verse.
 *
 * Two scripts, two corpora:
 *  - Devanagari (Sanskrit and Hindi): Vedic accents, nukta, avagraha, dandas and digits are dropped, and
 *    each remaining letter is stored as one printable ASCII character (DEV_ALPHABET). Hermes keeps
 *    ASCII strings at one byte per character instead of two, so this halves the index in the bundle and in memory.
 *  - Latin: transliteration is folded hard (no diacritics, no aspiration, sh → s, ri → r) so "krishna",
 *    "kṛṣṇa" and "krsna" meet. English keeps its case and punctuation for display; search lower-cases it.
 */
import type { SearchCorpus } from '../content/types';

// ---- Folding ----

/** Devanagari letters kept in the index, in code point order. Everything else becomes a space. */
const DEV_KEEP: number[] = [
  0x0902, 0x0903, // anusvara, visarga
  ...range(0x0904, 0x0914), // independent vowels
  ...range(0x0915, 0x0939), // consonants
  ...range(0x093e, 0x094c), // vowel signs
  0x094d, // virama
  0x0950, // om
  ...range(0x0960, 0x0963), // vocalic rr, ll and their signs
];

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let c = from; c <= to; c++) out.push(c);
  return out;
}

/** Printable ASCII minus `"`, `\` (no JSON escapes) and `|` (the field separator). */
const ASCII_POOL = range(0x21, 0x7e)
  .filter((c) => c !== 0x22 && c !== 0x5c && c !== 0x7c)
  .map((c) => String.fromCharCode(c))
  .join('');

if (DEV_KEEP.length > ASCII_POOL.length) throw new Error('search-fold: Devanagari alphabet does not fit in ASCII');

export const DEV_ALPHABET = ASCII_POOL.slice(0, DEV_KEEP.length);

/** Separates the fields of one verse inside a corpus line (Sanskrit | Hindi, transliteration | English). */
export const FIELD_SEP = '|';

const DEV_TO_ASCII = new Map<string, string>(DEV_KEEP.map((cp, i) => [String.fromCharCode(cp), DEV_ALPHABET[i]]));
const ASCII_TO_DEV = new Map<string, string>(DEV_KEEP.map((cp, i) => [DEV_ALPHABET[i], String.fromCharCode(cp)]));

const ANUSVARA = DEV_TO_ASCII.get('\u0902')!;
const VIRAMA = DEV_TO_ASCII.get('\u094d')!;
const NASALS = ['ङ', 'ञ', 'ण', 'न', 'म'].map((c) => DEV_TO_ASCII.get(c)!);
const CONSONANTS = range(0x0915, 0x0939).map((c) => DEV_TO_ASCII.get(String.fromCharCode(c))!);

function charClass(chars: string[]): string {
  return '[' + chars.map((c) => c.replace(/[\]\\^-]/g, '\\$&')).join('') + ']';
}

/** A nasal consonant with virama before another consonant (शान्ति) reads the same as an anusvara (शांति). */
const NASAL_CLUSTER = new RegExp(charClass(NASALS) + escapeRegExp(VIRAMA) + '(?=' + charClass(CONSONANTS) + ')', 'g');

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');
}

export function hasDevanagari(s: string): boolean {
  return /[\u0900-\u097f]/.test(s);
}

/**
 * Devanagari text → index alphabet, for display (letters exact, punctuation and accents gone).
 * Lines and fields are joined by the caller, so newlines become spaces here.
 */
export function devToIndex(text: string): string {
  let out = '';
  let space = true;
  const s = text.normalize('NFD').replace(/\u0901/g, '\u0902'); // chandrabindu reads as anusvara
  for (const ch of s) {
    const mapped = DEV_TO_ASCII.get(ch);
    if (mapped) {
      out += mapped;
      space = false;
    } else if (isDropped(ch)) {
      continue;
    } else if (!space) {
      out += ' ';
      space = true;
    }
  }
  return out.trimEnd();
}

/** Marks that vanish without leaving a word break: nukta, avagraha, Vedic accents, zero-width joiners. */
function isDropped(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return (
    c === 0x093c ||
    c === 0x093d ||
    c === 0x0900 ||
    (c >= 0x0951 && c <= 0x0954) ||
    (c >= 0x1cd0 && c <= 0x1cff) ||
    (c >= 0xa8e0 && c <= 0xa8ff) ||
    c === 0x200c ||
    c === 0x200d ||
    (c >= 0x0300 && c <= 0x036f)
  );
}

/** Index alphabet → Devanagari, for snippets. */
export function indexToDev(text: string): string {
  let out = '';
  for (const ch of text) out += ASCII_TO_DEV.get(ch) ?? ch;
  return out;
}

/** The searchable form of index-alphabet text: nasal clusters fold to anusvara. */
export function devSearchForm(indexText: string): string {
  return indexText.replace(NASAL_CLUSTER, ANUSVARA);
}

function stripMarks(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** English for the index: diacritics dropped (so it stays ASCII), case and punctuation kept for display. */
export function englishToIndex(text: string): string {
  return stripMarks(text)
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/["\\|]/g, ' ')
    .replace(/[^\x20-\x7e]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** English search form: lower case. Same length as the input, so offsets map back to the display text. */
export function englishSearchForm(indexText: string): string {
  return indexText.toLowerCase();
}

/**
 * Transliteration, folded hard so the common spellings meet:
 * kṛṣṇa / krishna / krsna → krsna, dharmakṣetre / dharmakshetre → darmaksetre, chandra / candra → candra.
 */
export function foldLatin(text: string): string {
  return stripMarks(text)
    .toLowerCase()
    .replace(/['’‘ʼ\-]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/chh/g, 'c')
    .replace(/([kgcjtdpbs])h/g, '$1')
    .replace(/ri/g, 'r')
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/w/g, 'v')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface QueryToken {
  /** What the person typed, for display. */
  raw: string;
  script: 'dev' | 'lat';
  /** dev: the searchable index form. lat: the folded transliteration form. */
  form: string;
  /** lat only: lower-cased English form. */
  en?: string;
  /** A little word ("of", "the", "का", "में") that the verse need not contain when other words are given. */
  stop?: boolean;
}

const STOP_EN = new Set('a an and are as at be by for from in into is it of on or so that the this to was with'.split(' '));
const STOP_HI = new Set('का की के को में से है हैं और ने तो भी ही'.split(' '));

/** Splits a query into tokens by script. Latin tokens shorter than two letters are ignored. */
export function parseQuery(query: string): QueryToken[] {
  const tokens: QueryToken[] = [];
  for (const raw of query.normalize('NFC').split(/[\s,;:!?।॥|.()"“”]+/)) {
    if (!raw) continue;
    if (hasDevanagari(raw)) {
      const form = devSearchForm(devToIndex(raw));
      for (const part of form.split(' ')) if (part) tokens.push({ raw, script: 'dev', form: part });
    } else {
      const en = englishSearchForm(englishToIndex(raw)).replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
      const form = foldLatin(raw);
      if (en.length < 2 && form.length < 2) continue;
      tokens.push({ raw, script: 'lat', form, en });
    }
  }
  for (const t of tokens) t.stop = t.script === 'lat' ? STOP_EN.has(t.en ?? '') : STOP_HI.has(indexToDev(t.form));
  // A query of only little words still searches for them.
  if (tokens.every((t) => t.stop)) for (const t of tokens) t.stop = false;
  return tokens;
}

/**
 * A pattern that finds a dev search form in index-alphabet display text, where an anusvara in the
 * query may stand for a nasal cluster in the verse (शांति finds शान्ति).
 */
export function devDisplayPattern(form: string): RegExp {
  const alt = '(?:' + escapeRegExp(ANUSVARA) + '|' + charClass(NASALS) + escapeRegExp(VIRAMA) + ')';
  let src = '';
  for (const ch of form) src += ch === ANUSVARA ? alt : escapeRegExp(ch);
  return new RegExp(src, 'g');
}

// ---- Search ----

export interface PreparedCorpus {
  id: string;
  /** Sanskrit | Hindi, index alphabet as bundled (for snippets). */
  d: string;
  /** Searchable form of d (same line breaks). */
  ds: string;
  t: string;
  e: string;
  /** Lower-cased e, same length. */
  es: string;
  dLines: Int32Array;
  /** Line starts of d, which differ from ds once nasal clusters fold. */
  dShowLines: Int32Array;
  tLines: Int32Array;
  eLines: Int32Array;
  /** First line index of each chapter, parallel to chapters. */
  chapterStart: number[];
  chapters: number[];
  numbers: string[];
}

function lineStarts(s: string, count: number): Int32Array {
  const starts = new Int32Array(count + 1);
  let line = 1;
  let i = s.indexOf('\n');
  while (i !== -1 && line < count) {
    starts[line++] = i + 1;
    i = s.indexOf('\n', i + 1);
  }
  // Sentinel: one past the last character, so every line ends at starts[l + 1] - 1.
  starts[count] = s.length + 1;
  return starts;
}

export function prepareCorpus(id: string, corpus: SearchCorpus): PreparedCorpus {
  const numbers = corpus.n ? corpus.n.split('\n') : [];
  const count = numbers.length;
  const ds = devSearchForm(corpus.d);
  const es = englishSearchForm(corpus.e);
  const chapterStart: number[] = [];
  const chapters: number[] = [];
  let at = 0;
  for (const [number, verses] of corpus.c) {
    chapters.push(number);
    chapterStart.push(at);
    at += verses;
  }
  return {
    id,
    d: corpus.d,
    ds,
    t: corpus.t,
    e: corpus.e,
    es,
    dLines: lineStarts(ds, count),
    dShowLines: lineStarts(corpus.d, count),
    tLines: lineStarts(corpus.t, count),
    eLines: lineStarts(es, count),
    chapterStart,
    chapters,
    numbers,
  };
}

/** Line that contains offset `pos`, by binary search over the line starts. */
function lineAt(starts: Int32Array, pos: number): number {
  let lo = 0;
  let hi = starts.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= pos) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

/** Lines of `text` that contain `needle` (at the start of a word when `wordStart`). */
function scan(text: string, starts: Int32Array, needle: string, into: Set<number>, wordStart = false) {
  if (!needle) return;
  let i = text.indexOf(needle);
  while (i !== -1) {
    if (wordStart && !atWordStart(text, i)) {
      i = text.indexOf(needle, i + 1);
      continue;
    }
    const line = lineAt(starts, i);
    into.add(line);
    i = text.indexOf(needle, starts[line + 1]);
  }
}

/** Position of `needle` within line `line` of `text` (at a word start when `wordStart`), or -1. */
function findInLine(text: string, starts: Int32Array, line: number, needle: string, wordStart = false): number {
  if (!needle) return -1;
  const end = starts[line + 1] - 1;
  let i = text.indexOf(needle, starts[line]);
  while (i !== -1 && i < end) {
    if (!wordStart || atWordStart(text, i)) return i;
    i = text.indexOf(needle, i + 1);
  }
  return -1;
}

/**
 * Word boundaries. In the Devanagari index every printable character is a letter, so only a space,
 * a line break or the field separator ends a word; in Latin text anything but a letter or digit does.
 */
function isWordChar(c: number, dev: boolean): boolean {
  if (dev) return c !== 0x20 && c !== 0x0a && c !== 0x7c && !Number.isNaN(c);
  return (c >= 0x61 && c <= 0x7a) || (c >= 0x41 && c <= 0x5a) || (c >= 0x30 && c <= 0x39);
}

function atWordStart(text: string, pos: number, dev = false): boolean {
  return pos <= 0 || !isWordChar(text.charCodeAt(pos - 1), dev);
}

function atWordEnd(text: string, pos: number, dev = false): boolean {
  return pos >= text.length || !isWordChar(text.charCodeAt(pos), dev);
}

/** 2 for a whole word, 1 for the start of a word, 0 for the middle of one. */
function wordScore(text: string, pos: number, len: number, dev = false): number {
  if (!atWordStart(text, pos, dev)) return 0;
  return atWordEnd(text, pos + len, dev) ? 2 : 1;
}

export interface VerseHit {
  id: string;
  line: number;
  chapter: number;
  /** Index of the verse in its chapter. */
  index: number;
  number: string;
  score: number;
}

function tokenStrength(tok: QueryToken): number {
  return tok.script === 'dev' ? tok.form.length : Math.max(tok.form.length, tok.en?.length ?? 0);
}

/** Every verse in the book that contains all the query tokens, scored. */
export function searchCorpus(book: PreparedCorpus, query: QueryToken[], limit = Infinity): VerseHit[] {
  const tokens = query.filter((t) => !t.stop);
  if (tokens.length === 0 || book.numbers.length === 0) return [];
  // Scan for the longest token (usually the rarest), then check the rest line by line.
  const driver = tokens.reduce((a, b) => (tokenStrength(b) > tokenStrength(a) ? b : a));
  const lines = new Set<number>();
  if (driver.script === 'dev') {
    scan(book.ds, book.dLines, driver.form, lines);
  } else {
    if (driver.form.length >= 2) scan(book.t, book.tLines, driver.form, lines);
    if ((driver.en?.length ?? 0) >= 2) scan(book.es, book.eLines, driver.en!, lines, true);
  }

  const hits: VerseHit[] = [];
  const sorted = [...lines].sort((a, b) => a - b);
  for (const line of sorted) {
    let score = 0;
    let all = true;
    for (const tok of tokens) {
      if (tok.script === 'dev') {
        const p = findInLine(book.ds, book.dLines, line, tok.form);
        if (p === -1) {
          all = false;
          break;
        }
        score += wordScore(book.ds, p, tok.form.length, true);
      } else {
        // English matches whole words or their beginnings ("fruit" finds "fruits", "om" skips "from");
        // transliteration matches anywhere, since Sanskrit joins words into compounds.
        const pe = tok.en && tok.en.length >= 2 ? findInLine(book.es, book.eLines, line, tok.en, true) : -1;
        const pt = tok.form.length >= 2 ? findInLine(book.t, book.tLines, line, tok.form) : -1;
        if (pe === -1 && pt === -1) {
          all = false;
          break;
        }
        score += Math.max(
          pe === -1 ? 0 : wordScore(book.es, pe, tok.en!.length),
          pt === -1 ? 0 : wordScore(book.t, pt, tok.form.length),
        );
      }
    }
    if (!all) continue;
    if (query.length > 1 && hasPhrase(book, line, query)) score += 4;
    hits.push({ id: book.id, line, score, ...verseAt(book, line) });
    if (hits.length >= limit) break;
  }
  return hits;
}

function hasPhrase(book: PreparedCorpus, line: number, tokens: QueryToken[]): boolean {
  const dev = tokens.filter((t) => t.script === 'dev');
  const lat = tokens.filter((t) => t.script === 'lat');
  if (dev.length === tokens.length) return findInLine(book.ds, book.dLines, line, dev.map((t) => t.form).join(' ')) !== -1;
  if (lat.length === tokens.length) {
    return (
      findInLine(book.es, book.eLines, line, lat.map((t) => t.en ?? '').join(' '), true) !== -1 ||
      findInLine(book.t, book.tLines, line, lat.map((t) => t.form).join(' ')) !== -1
    );
  }
  return false;
}

export function verseAt(book: PreparedCorpus, line: number): { chapter: number; index: number; number: string } {
  let c = 0;
  let lo = 0;
  let hi = book.chapterStart.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (book.chapterStart[mid] <= line) {
      c = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return { chapter: book.chapters[c], index: line - book.chapterStart[c], number: book.numbers[line] };
}

/** Best hits first; ties go to the order given (the app puts the Gita and Upanishads first), then reading order. */
export function rankHits(hits: VerseHit[], order: Map<string, number>): VerseHit[] {
  return hits.sort(
    (a, b) => b.score - a.score || (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0) || a.line - b.line,
  );
}

export interface Snippet {
  field: 'sa' | 'hi' | 'en';
  text: string;
  /** [start, end) ranges of `text` to highlight. */
  marks: [number, number][];
}

const WINDOW = 160;

function lineText(text: string, starts: Int32Array, line: number): string {
  return text.slice(starts[line], starts[line + 1] - 1);
}

/** The piece of the verse to show under a result, with the query words marked. */
export function makeSnippet(book: PreparedCorpus, line: number, tokens: QueryToken[]): Snippet {
  const dLine = lineText(book.d, book.dShowLines, line);
  const sep = dLine.indexOf(FIELD_SEP);
  const sa = sep === -1 ? dLine : dLine.slice(0, sep);
  const hi = sep === -1 ? '' : dLine.slice(sep + 1);
  const en = lineText(book.e, book.eLines, line);
  const enLower = lineText(book.es, book.eLines, line);

  const devMarks = (field: string): [number, number][] => {
    const out: [number, number][] = [];
    for (const tok of tokens) {
      if (tok.script !== 'dev' || tok.stop) continue;
      const re = devDisplayPattern(tok.form);
      for (const m of field.matchAll(re)) if (m[0].length) out.push([m.index!, m.index! + m[0].length]);
    }
    return out;
  };
  const enMarks = (): [number, number][] => {
    const out: [number, number][] = [];
    const lat = tokens.filter((t) => t.script === 'lat');
    if (lat.length > 1 && lat.length === tokens.length) {
      const phrase = lat.map((t) => t.en ?? '').join(' ');
      for (let i = enLower.indexOf(phrase); i !== -1; i = enLower.indexOf(phrase, i + phrase.length)) {
        if (atWordStart(enLower, i)) out.push([i, i + phrase.length]);
      }
    }
    for (const tok of lat) {
      if (tok.stop || !tok.en || tok.en.length < 2) continue;
      let i = enLower.indexOf(tok.en);
      while (i !== -1) {
        if (atWordStart(enLower, i)) out.push([i, i + tok.en.length]);
        i = enLower.indexOf(tok.en, i + tok.en.length);
      }
    }
    return out;
  };

  const candidates: Snippet[] = [];
  const saMarks = devMarks(sa);
  const hiMarks = devMarks(hi);
  const eMarks = enMarks();
  if (saMarks.length) candidates.push({ field: 'sa', text: indexToDev(sa), marks: saMarks });
  if (hiMarks.length) candidates.push({ field: 'hi', text: indexToDev(hi), marks: hiMarks });
  if (eMarks.length) candidates.push({ field: 'en', text: en, marks: eMarks });
  // A transliteration-only match shows the Sanskrit it spells.
  const pick =
    candidates.sort((a, b) => b.marks.length - a.marks.length)[0] ??
    (sa ? { field: 'sa' as const, text: indexToDev(sa), marks: [] } : hi ? { field: 'hi' as const, text: indexToDev(hi), marks: [] } : { field: 'en' as const, text: en, marks: [] });
  return clip(pick);
}

/**
 * Trims a long Hindi or English meaning to a window around the first mark, on word boundaries.
 * Sanskrit is never cut: a verse shows whole or not at all (CLAUDE.md rule 4).
 */
function clip(s: Snippet): Snippet {
  const marks = merge(s.marks);
  if (s.field === 'sa' || s.text.length <= WINDOW) return { ...s, marks };
  const first = marks[0]?.[0] ?? 0;
  let start = Math.max(0, first - Math.floor(WINDOW / 3));
  if (start > 0) {
    const space = s.text.lastIndexOf(' ', start);
    start = space > 0 && first - space < WINDOW / 2 ? space + 1 : start;
  }
  let end = Math.min(s.text.length, start + WINDOW);
  if (end < s.text.length) {
    const space = s.text.indexOf(' ', end);
    end = space !== -1 && space - end < 24 ? space : end;
  }
  const lead = start > 0 ? '… ' : '';
  const tail = end < s.text.length ? ' …' : '';
  const text = lead + s.text.slice(start, end) + tail;
  const shifted = marks
    .filter(([a, b]) => b > start && a < end)
    .map(([a, b]): [number, number] => [Math.max(a, start) - start + lead.length, Math.min(b, end) - start + lead.length]);
  return { ...s, text, marks: shifted };
}

function merge(marks: [number, number][]): [number, number][] {
  const sorted = [...marks].sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [];
  for (const m of sorted) {
    const last = out[out.length - 1];
    if (last && m[0] <= last[1]) last[1] = Math.max(last[1], m[1]);
    else out.push([m[0], m[1]]);
  }
  return out;
}
