/**
 * Verse search over the large texts the reader has downloaded (src/content/downloads.ts).
 *
 * The bundled books ship a prebuilt index (scripts/build-search-index.mjs). A downloaded book gets the
 * same kind of index, built on the phone while it downloads, with the same fold (verseToCorpusLine), so
 * both match the same queries. It lives inside the book's own folder:
 *
 *   downloads/<id>/search/manifest.json   format, verse count and the list of chunks
 *   downloads/<id>/search/s-N.json        one SearchCorpus per chunk, whole verses, in reading order
 *
 * Deleting the book deletes its index with it. The Mahabharata's index alone is about 37 MB, so it is
 * cut into chunks of about 1.5 MB that are searched one at a time and dropped again: memory stays flat
 * however many texts are downloaded. A small cache keeps the last few chunks, so a short book (one or
 * two chunks) is read from storage only once per session.
 */
import { Directory, File } from 'expo-file-system';

import { CorpusChunker, prepareCorpus, type PreparedCorpus } from '@/lib/verse-search';
import type { BookChapter, SearchCorpus } from './types';

export const SEARCH_DIR = 'search';
/** Bumped when the fold or the chunk layout changes; an index in an older format is built again. */
export const INDEX_FORMAT = 1;
/** Characters of index text per chunk. */
const CHUNK_CHARS = 1_500_000;
/** Index text kept in memory between searches, across all downloaded books. */
const CACHE_CHARS = 8_000_000;
/** Verses folded between pauses that let the interface draw. */
const VERSES_PER_YIELD = 200;

export interface IndexChunk {
  file: string;
  /** Book-wide line of the chunk's first verse. */
  start: number;
  lines: number;
  /** Index, within its chapter, of the chunk's first verse (non-zero when a long chapter was split). */
  firstIndex: number;
}

export interface IndexManifest {
  format: number;
  verses: number;
  /** Bytes of index on the phone. */
  bytes: number;
  chunks: IndexChunk[];
}

export const yieldToUi = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Builds a downloaded book's index, chapter by chapter, into `dir` (created fresh). */
export class SearchIndexWriter {
  private bytes = 0;
  private chunks: IndexChunk[] = [];
  private chunker: CorpusChunker;

  constructor(private dir: Directory) {
    if (dir.exists) dir.delete();
    dir.create({ intermediates: true });
    this.chunker = new CorpusChunker(CHUNK_CHARS, ({ corpus, start, lines, firstIndex }) => {
      const file = `s-${this.chunks.length}.json`;
      const json = JSON.stringify(corpus);
      new File(this.dir, file).writeSync(json);
      // The index is ASCII apart from the odd verse number, so characters are close to bytes.
      this.bytes += json.length;
      this.chunks.push({ file, start, lines, firstIndex });
    });
  }

  /** Folds one whole chapter, pausing now and then so the interface stays responsive. */
  async addChapter(ch: BookChapter): Promise<void> {
    for (let i = 0; i < ch.verses.length; i++) {
      this.chunker.addVerse(ch.number, i, ch.verses[i]);
      if ((i + 1) % VERSES_PER_YIELD === 0) await yieldToUi();
    }
  }

  /** Writes the last chunk and the manifest. Returns the index size in bytes. */
  finish(): number {
    this.chunker.flush();
    const manifest: IndexManifest = { format: INDEX_FORMAT, verses: this.chunker.lines, bytes: this.bytes, chunks: this.chunks };
    new File(this.dir, 'manifest.json').writeSync(JSON.stringify(manifest));
    return this.bytes;
  }
}

/**
 * Builds the index of a book downloaded before the app could search downloads, from its chapter files.
 * Built beside the book and renamed into place at the end, so an interrupted build leaves nothing half
 * done. Returns false if the book disappeared or could not be read.
 */
export async function buildIndexFromChapters(bookDir: Directory, isCancelled: () => boolean): Promise<boolean> {
  const partial = new Directory(bookDir, '.search-partial');
  try {
    const numbers: number[] = [];
    for (const item of bookDir.list()) {
      const m = item instanceof File ? /^ch-(\d+)\.json$/.exec(item.name) : null;
      if (m) numbers.push(Number(m[1]));
    }
    if (numbers.length === 0) return false;
    numbers.sort((a, b) => a - b);
    const writer = new SearchIndexWriter(partial);
    for (const number of numbers) {
      if (isCancelled()) throw new Error('Cancelled');
      const ch = JSON.parse(new File(bookDir, `ch-${number}.json`).textSync()) as BookChapter;
      await writer.addChapter(ch);
      await yieldToUi();
    }
    if (isCancelled()) throw new Error('Cancelled');
    writer.finish();
    const final = new Directory(bookDir, SEARCH_DIR);
    if (final.exists) final.delete();
    partial.rename(SEARCH_DIR);
    return true;
  } catch {
    try {
      if (partial.exists) partial.delete();
    } catch {}
    return false;
  }
}

// ---- Reading ----

const manifests = new Map<string, IndexManifest | null>();
const chunkCache = new Map<string, { corpus: PreparedCorpus; chars: number }>();
let cachedChars = 0;

/** The book's index manifest, or null when it has none yet (or one in an older format). */
export function readIndexManifest(id: string, bookDir: Directory): IndexManifest | null {
  const known = manifests.get(id);
  if (known !== undefined) return known;
  let manifest: IndexManifest | null = null;
  try {
    const file = new File(new Directory(bookDir, SEARCH_DIR), 'manifest.json');
    if (file.exists) {
      const m = JSON.parse(file.textSync()) as IndexManifest;
      if (m.format === INDEX_FORMAT && Array.isArray(m.chunks)) manifest = m;
    }
  } catch {
    // Unreadable: treat as missing, and it is built again.
  }
  // Only a found index is remembered; a missing one is looked for again once it may have been built.
  if (manifest) manifests.set(id, manifest);
  return manifest;
}

/** One chunk of a downloaded book's index, ready to search. Undefined if it cannot be read. */
export function loadIndexChunk(id: string, bookDir: Directory, chunk: IndexChunk): PreparedCorpus | undefined {
  const key = `${id}:${chunk.file}`;
  const hit = chunkCache.get(key);
  if (hit) {
    // Most recently used goes last.
    chunkCache.delete(key);
    chunkCache.set(key, hit);
    return hit.corpus;
  }
  try {
    const raw = JSON.parse(new File(new Directory(bookDir, SEARCH_DIR), chunk.file).textSync()) as SearchCorpus;
    const corpus = prepareCorpus(id, raw);
    // The prepared chunk holds the text about twice over (display and search forms).
    const chars = 2 * (raw.d.length + raw.e.length) + raw.t.length;
    chunkCache.set(key, { corpus, chars });
    cachedChars += chars;
    while (cachedChars > CACHE_CHARS && chunkCache.size > 1) {
      const [oldest, entry] = chunkCache.entries().next().value!;
      chunkCache.delete(oldest);
      cachedChars -= entry.chars;
    }
    return corpus;
  } catch {
    return undefined;
  }
}

/** The chunk that holds book-wide line `line`. */
export function chunkForLine(manifest: IndexManifest, line: number): IndexChunk | undefined {
  let lo = 0;
  let hi = manifest.chunks.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const c = manifest.chunks[mid];
    if (line < c.start) hi = mid - 1;
    else if (line >= c.start + c.lines) lo = mid + 1;
    else return c;
  }
  return undefined;
}

/** Drops everything remembered about a book's index (after it is deleted or replaced). */
export function forgetSearchIndex(id: string): void {
  manifests.delete(id);
  for (const [key, entry] of [...chunkCache]) {
    if (key.startsWith(`${id}:`)) {
      chunkCache.delete(key);
      cachedChars -= entry.chars;
    }
  }
}
