import { readSeededChapter } from '@/lib/read-seeded-chapters';

/**
 * Splitting giant chapters into pages (build time only).
 *
 * A handful of chapters (Mahabharata parvas, Shiva Purana samhitas) run to
 * thousands of verses and several MB. As one page they are unusable on a
 * phone and too big to inline, so their text was invisible to crawlers.
 * They are served in parts instead: part 1 at the chapter URL, the rest at
 * `/chapter/{n}/part/{p}/`, each carrying its verses in the HTML.
 *
 * Parts follow the chapter's own sections (the "12" in verse 12.45), adding
 * whole sections until a part holds about PART_MAX_BYTES of verse data; a
 * section larger than that on its own is split by verse count.
 */

/**
 * Chapters whose verse data is larger than this are split into parts. Just
 * above PART_MAX_BYTES, so no page carries much more than one part's worth
 * (at 1 MB, chapters just under the line made 2.5 MB pages).
 */
export const INLINE_CHAPTER_MAX_BYTES = 450 * 1024;
/**
 * Short verses render far heavier than their JSON (each carries the same card markup), so a chapter of
 * more than this many verses is split even when its data is small (Sama Veda's Uttarārcika: 404 KB of
 * data, 1,223 mantras, a 1.5 MB page).
 */
export const INLINE_CHAPTER_MAX_VERSES = 1000;
/**
 * Target verse data per part. A recent 655 KB chapter now produces five parts;
 * its largest part is 2.3 MB raw but 430 KB gzipped because the semantic HTML
 * is also serialized for hydration. The export guard checks both raw safety
 * and compressed transfer size.
 */
const PART_MAX_BYTES = 150 * 1024;

export interface ChapterPart {
  /** 1-based part number. */
  part: number;
  /** Index range into the chapter's verses: [start, end). */
  start: number;
  end: number;
  /** Verse numbers at either end, for labels and hash redirects. */
  first: string;
  last: string;
}

type Verse = { number: number | string };

const cache = new Map<string, ChapterPart[] | null>();

function section(number: number | string): string {
  return String(number).split('.')[0];
}

function verseBytes(verse: unknown): number {
  return Buffer.byteLength(JSON.stringify(verse));
}

/** The chapter's parts, or null when it fits on one page. */
export function chapterParts(scriptureId: string, chapterId: number): ChapterPart[] | null {
  const cacheKey = `${scriptureId}:${chapterId}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  const seeded = readSeededChapter(scriptureId, chapterId);
  const verses = (seeded?.chapter.verses ?? []) as Verse[];
  const sizes = verses.map(verseBytes);
  const total = sizes.reduce((sum, n) => sum + n, 0);
  if (verses.length === 0 || (total <= INLINE_CHAPTER_MAX_BYTES && verses.length <= INLINE_CHAPTER_MAX_VERSES)) {
    cache.set(cacheKey, null);
    return null;
  }

  // Group consecutive verses by section, then pack sections into parts.
  const groups: Array<{ start: number; end: number; bytes: number }> = [];
  for (let i = 0; i < verses.length; i++) {
    const last = groups[groups.length - 1];
    if (last && section(verses[last.end - 1].number) === section(verses[i].number)) {
      last.end = i + 1;
      last.bytes += sizes[i];
    } else {
      groups.push({ start: i, end: i + 1, bytes: sizes[i] });
    }
  }

  const ranges: Array<{ start: number; end: number }> = [];
  let current: { start: number; end: number; bytes: number } | null = null;
  const flush = () => {
    if (current) ranges.push({ start: current.start, end: current.end });
    current = null;
  };
  for (const group of groups) {
    if (group.bytes > PART_MAX_BYTES) {
      // An oversized section gets parts of its own, split by size.
      flush();
      let chunk = { start: group.start, end: group.start, bytes: 0 };
      for (let i = group.start; i < group.end; i++) {
        if (chunk.end > chunk.start && chunk.bytes + sizes[i] > PART_MAX_BYTES) {
          ranges.push({ start: chunk.start, end: chunk.end });
          chunk = { start: i, end: i, bytes: 0 };
        }
        chunk.end = i + 1;
        chunk.bytes += sizes[i];
      }
      ranges.push({ start: chunk.start, end: chunk.end });
      continue;
    }
    if (current && current.bytes + group.bytes > PART_MAX_BYTES) flush();
    if (!current) current = { start: group.start, end: group.end, bytes: group.bytes };
    else {
      current.end = group.end;
      current.bytes += group.bytes;
    }
  }
  flush();

  const parts = ranges.map((range, i) => ({
    part: i + 1,
    start: range.start,
    end: range.end,
    first: String(verses[range.start].number),
    last: String(verses[range.end - 1].number),
  }));
  cache.set(cacheKey, parts);
  return parts;
}

export function chapterPartHref(scriptureId: string, chapterId: number, part: number): string {
  const base = `/scripture/${scriptureId}/chapter/${chapterId}`;
  return part <= 1 ? base : `${base}/part/${part}`;
}
