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
import { findTemplateFields } from "./lib/template-text";

/**
 * A meaning that only says a meaning belongs here, for example "Adhyaya 1, Shloka 4: विदुरनीति श्लोक का अर्थ।".
 * Left out when publishing so the reader shows its "no meaning yet" state instead of a stub.
 */
const isMeaningStub = (t: unknown) => typeof t === "string" && t.length < 90 && /श्लोक का अर्थ[।.]?\s*$/.test(t.trim());

/** Verse fields that carry explanation, not scripture or translation. */
const EDITORIAL_FIELDS = ["explanation", "commentary", "science", "lifeLesson"] as const;

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

    for (const ch of book.chapters ?? []) {
      for (const v of (ch.verses ?? []) as Record<string, unknown>[]) {
        for (const f of ["translation", "hindi", "explanation", "commentary", "science", "lifeLesson", "wordMeaning"]) if (isMeaningStub(v[f])) delete v[f];
      }
    }

    // Hide text that is the same template on many different verses; the source file is not touched.
    {
      const items = (book.chapters ?? []).flatMap((ch) =>
        ((ch.verses ?? []) as Record<string, unknown>[]).map((v, i) => ({
          key: `${ch.number}:${i}`,
          sanskrit: String(v.sanskrit ?? ""),
          fields: Object.fromEntries(EDITORIAL_FIELDS.map((f) => [f, typeof v[f] === "string" ? (v[f] as string) : undefined])),
        })),
      );
      const hidden = findTemplateFields(items);
      if (hidden.size > 0) {
        for (const ch of book.chapters ?? []) {
          ((ch.verses ?? []) as Record<string, unknown>[]).forEach((v, i) => {
            for (const f of EDITORIAL_FIELDS) if (hidden.has(`${ch.number}:${i}|${f}`)) delete v[f];
          });
        }
        console.log(`  ${id}: hid ${hidden.size} template explanation field(s)`);
      }
    }

    const outDir = path.join(SRC, id);
    if (!DRY) fs.mkdirSync(outDir, { recursive: true });

    let shardBytes = 0;
    for (const ch of book.chapters ?? []) {
      const num = typeof ch.number === "number" ? ch.number : Number(ch.number);
      if (!Number.isFinite(num)) continue;

      const shard: ChapterShard = {
        id,
        chapter: {
          number: num,
          title: ch.title,
          titleSanskrit: ch.titleSanskrit,
          summary: ch.summary,
          verses: ch.verses ?? [],
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
    }

    totalBytes += shardBytes;
    console.log(
      `${id}: ${book.chapters?.length ?? 0} chapters → ${(shardBytes / 1024).toFixed(0)}KB shards`,
    );
  }

  console.log(
    `\n${DRY ? "Dry-run" : "Wrote"} ${totalShards} chapter shards (${(totalBytes / 1024 / 1024).toFixed(1)}MB total)`,
  );
}

main();