/**
 * Split full-book scriptures-full JSON into per-chapter shards for faster
 * chapter-page loads. Output: public/data/scriptures-full/{id}/ch-{n}.json
 *
 *   npm run shard:scriptures
 *   npm run shard:scriptures -- --write   (default)
 *   npm run shard:scriptures -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { isTranslationEchoNote, TRANSLATION_ECHO_SCRIPTURES } from "../data/hi-commentary/quality";

const SRC = path.resolve("public/data/scriptures-full");
const DRY = process.argv.includes("--dry-run");

interface ChapterShard {
  id: string;
  chapter: {
    number: number;
    title?: string;
    titleSanskrit?: string;
    summary?: string;
    verses: unknown[];
  };
  source?: unknown;
}

interface LanguageCounts {
  sa: number;
  hi: number;
  en: number;
}

function hasText(record: unknown, key: 'sanskrit' | 'hindi' | 'translation'): boolean {
  if (!record || typeof record !== 'object') return false;
  const value = (record as Record<string, unknown>)[key];
  return typeof value === 'string' && value.trim().length > 0;
}

function main(): void {
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".json"));
  let totalShards = 0;
  let totalBytes = 0;

  for (const file of files.sort()) {
    const id = path.basename(file, ".json");
    const bookPath = path.join(SRC, file);
    const book = JSON.parse(fs.readFileSync(bookPath, "utf8")) as {
      id?: string;
      source?: unknown;
      chapters?: Array<{
        number: number | string;
        title?: string;
        titleSanskrit?: string;
        summary?: string;
        verses?: unknown[];
      }>;
    };

    const outDir = path.join(SRC, id);
    if (!DRY) fs.mkdirSync(outDir, { recursive: true });

    let shardBytes = 0;
    let echoHidden = 0;
    const languageCoverage: LanguageCounts = { sa: 0, hi: 0, en: 0 };
    let totalVerses = 0;
    for (const ch of book.chapters ?? []) {
      const num = typeof ch.number === "number" ? ch.number : Number(ch.number);
      if (!Number.isFinite(num)) continue;

      for (const verse of ch.verses ?? []) {
        totalVerses++;
        if (hasText(verse, 'sanskrit')) languageCoverage.sa++;
        if (hasText(verse, 'hindi')) languageCoverage.hi++;
        if (hasText(verse, 'translation')) languageCoverage.en++;
      }

      // Research notes that only repeat the translation plus a stock sentence stay out of the shards.
      const verses = TRANSLATION_ECHO_SCRIPTURES.has(id)
        ? (ch.verses ?? []).map((v) => {
            const verse = v as { science?: string; hindi?: string };
            if (!isTranslationEchoNote(verse.science, verse.hindi)) return v;
            echoHidden++;
            const { science: _filler, ...kept } = verse;
            return kept;
          })
        : ch.verses ?? [];

      const shard: ChapterShard = {
        id,
        chapter: {
          number: num,
          title: ch.title,
          titleSanskrit: ch.titleSanskrit,
          summary: ch.summary,
          verses,
        },
        source: book.source,
      };
      const json = JSON.stringify(shard);
      shardBytes += Buffer.byteLength(json);
      totalShards++;
      if (!DRY) {
        fs.writeFileSync(path.join(outDir, `ch-${num}.json`), json);
      }
    }

    if (!DRY) {
      const manifest = {
        id,
        totalChapters: book.chapters?.length ?? 0,
        languageCoverage: { totalVerses, ...languageCoverage },
        chapters: (book.chapters ?? []).map((ch) => ({
          number: typeof ch.number === "number" ? ch.number : Number(ch.number),
          title: ch.title || `अध्याय ${ch.number}`,
          titleSanskrit: ch.titleSanskrit,
          summary: ch.summary,
          verseCount: ch.verses?.length ?? 0,
        })),
        source: book.source,
      };
      fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest));

      // Old chapter shard files can survive after a book's chapter set changes.
      // They are not in the new manifest and must not be mistaken for published chapters.
      const expectedShards = new Set(
        (book.chapters ?? [])
          .map((chapter) => (typeof chapter.number === "number" ? chapter.number : Number(chapter.number)))
          .filter((number) => Number.isFinite(number))
          .map((number) => `ch-${number}.json`),
      );
      for (const existing of fs.readdirSync(outDir)) {
        if (/^ch-\d+\.json$/.test(existing) && !expectedShards.has(existing)) {
          fs.unlinkSync(path.join(outDir, existing));
        }
      }
    }

    totalBytes += shardBytes;
    console.log(
      `${id}: ${book.chapters?.length ?? 0} chapters → ${(shardBytes / 1024).toFixed(0)}KB shards` +
        (echoHidden ? ` (${echoHidden} filler research notes left out)` : ""),
    );
  }

  console.log(
    `\n${DRY ? "Dry-run" : "Wrote"} ${totalShards} chapter shards (${(totalBytes / 1024 / 1024).toFixed(1)}MB total)`,
  );
}

main();
