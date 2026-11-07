/**
 * Merge validated OCR verses into an existing scripture shard.
 *
 *   npm run ocr:import -- --slug "my-granth" --scripture jabala
 *   npm run ocr:import -- --slug "my-granth" --dry-run
 *
 * Needs-review verses are skipped. An existing non-empty shloka is kept
 * unless --force. Ashtavakra chapters 19–20 are never written.
 * Search rows are appended to public/search/shards/{id}.json when that file exists.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readArgs, slugOf, requireString } from './ocr/args';
import type { LibraryVerse, OcrVerse } from './ocr/types';

const REVIEW_BLOCKED = new Set(['ashtavakra']);

function loadVerses(cache: string): OcrVerse[] {
  const file = join(cache, 'verses.json');
  if (!existsSync(file)) throw new Error(`Missing ${file}. Run ocr:scan first.`);
  return (JSON.parse(readFileSync(file, 'utf8')) as { verses: OcrVerse[] }).verses;
}

function toLibrary(verse: OcrVerse): LibraryVerse {
  return {
    number: verse.verse ?? 0,
    sanskrit: verse.sanskrit_devanagari,
    transliteration: verse.sanskrit_iast,
    translation: verse.english,
    hindi: verse.bhashya_hi,
    commentary: '',
    wordMeaning: verse.word_meanings || verse.padaccheda,
  };
}

function scriptureIdOf(args: Record<string, string | boolean>, slug: string): string {
  if (typeof args.scripture === 'string') return args.scripture.trim();
  if (slug === 'ashtavakra-gita') return 'ashtavakra';
  return slug;
}

function main(): void {
  const args = readArgs(process.argv.slice(2));
  const slug = slugOf(requireString(args, 'slug'));
  const scriptureId = scriptureIdOf(args, slug);
  const dry = args['dry-run'] === true;
  const force = args.force === true;
  const cache = resolve(typeof args.out === 'string' ? args.out : join('.ocr-cache', slug));
  const verses = loadVerses(cache).filter((verse) => {
    if (verse.ocr_confidence === 'needs_review' && args['include-review'] !== true) return false;
    if (!verse.sanskrit_devanagari.trim() || verse.verse == null || verse.chapter == null) return false;
    if (REVIEW_BLOCKED.has(scriptureId) && verse.chapter >= 19) return false;
    return true;
  });

  const readyDir = join(cache, 'import-ready');
  mkdirSync(readyDir, { recursive: true });
  const byChapter = new Map<number, LibraryVerse[]>();
  for (const verse of verses) {
    const list = byChapter.get(verse.chapter!) ?? [];
    list.push(toLibrary(verse));
    byChapter.set(verse.chapter!, list);
  }
  writeFileSync(join(readyDir, 'verses.json'), `${JSON.stringify({ scriptureId, chapters: [...byChapter] }, null, 2)}\n`);

  if (REVIEW_BLOCKED.has(scriptureId)) {
    console.log(`${scriptureId}: wrote ${readyDir}. Chapters 19–20 stay review-required and the study corpus was not changed.`);
    return;
  }

  const shardDir = join('public', 'data', 'scriptures-full', scriptureId);
  const monolith = join('public', 'data', 'scriptures-full', `${scriptureId}.json`);
  if (!existsSync(shardDir) && !existsSync(monolith)) {
    console.log(`No catalog shard for ${scriptureId}. Staged ${verses.length} verses at ${readyDir}.`);
    process.exitCode = 2;
    return;
  }

  let added = 0;
  let kept = 0;
  for (const [chapter, incoming] of byChapter) {
    const shardFile = join(shardDir, `ch-${chapter}.json`);
    if (!existsSync(shardFile)) {
      console.log(`skip chapter ${chapter}: ${shardFile} does not exist`);
      continue;
    }
    const shard = JSON.parse(readFileSync(shardFile, 'utf8')) as {
      chapter?: { verses?: Array<LibraryVerse & { sanskrit?: string }> };
    };
    const list = shard.chapter?.verses ?? [];
    for (const verse of incoming) {
      const index = list.findIndex((item) => Number(item.number) === verse.number);
      if (index >= 0 && list[index]?.sanskrit?.trim() && !force) {
        kept += 1;
        continue;
      }
      if (index >= 0) list[index] = { ...list[index], ...verse };
      else list.push(verse);
      added += 1;
    }
    list.sort((a, b) => Number(a.number) - Number(b.number));
    if (!dry) writeFileSync(shardFile, JSON.stringify(shard));
  }

  const searchShard = join('public', 'search', 'shards', `${scriptureId}.json`);
  if (!dry && existsSync(searchShard) && added > 0) {
    const file = JSON.parse(readFileSync(searchShard, 'utf8')) as {
      v: 1;
      id: string;
      verses: Array<[number, string, string, string, string]>;
    };
    const have = new Set(file.verses.map((row) => `${row[0]}:${row[1]}`));
    for (const verse of verses) {
      const key = `${verse.chapter}:${verse.verse}`;
      if (have.has(key)) continue;
      const href = `/scripture/${scriptureId}/chapter/${verse.chapter}/verse/${verse.verse}/`;
      file.verses.push([verse.chapter!, String(verse.verse), verse.sanskrit_devanagari, verse.english, href]);
    }
    writeFileSync(searchShard, JSON.stringify(file));
  }

  console.log(`${dry ? 'dry-run' : 'import'} ${scriptureId}: ${added} written, ${kept} existing shlokas kept`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
