/**
 * Split full-book scriptures-full JSON into per-chapter shards for faster
 * chapter-page loads. Output: public/data/scriptures-full/{id}/ch-{n}.json
 *
 *   npm run shard:scriptures
 *   npm run shard:scriptures -- --write   (default)
 *   npm run shard:scriptures -- --dry-run
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { isTranslationEchoNote, TRANSLATION_ECHO_SCRIPTURES } from "../data/hi-commentary/quality";
import { findTemplateFields } from "./lib/template-text";
import { exemptFields, hideUnalignedMeanings } from "./lib/meaning-alignment";
import { fillerChapters } from "./lib/filler-chapters";
import { loadPilotOverlay, patchPublishedVerse } from "./pilot/overlay";
import { isHindiSourceReviewRequired } from "../lib/ocr-hindi-review";

const PILOT = loadPilotOverlay();

/** Bump when shard output logic changes (stubs, templates, echo rules, manifest shape). */
const SHARD_REV = "5";

interface ShardStamp {
  rev: string;
  /** sha256 over the full-book, pilot overlay, and Hindi review registry bytes. */
  stamp: string;
  /** Chapter numbers written, so a changed chapter set reshards. */
  chapters: number[];
}

function sha256Hex(data: string | Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

/** Bytes of every pilot input the shard overlay reads (see pilot/overlay.ts). */
function pilotBytes(): Buffer {
  const parts: Buffer[] = [];
  const root = path.resolve("data/pilot");
  for (const name of ["pilot-set.json", "pilot-baseline.json"]) {
    const file = path.join(root, name);
    if (fs.existsSync(file)) parts.push(fs.readFileSync(file));
  }
  const recordsDir = path.join(root, "records");
  if (fs.existsSync(recordsDir)) {
    for (const f of fs.readdirSync(recordsDir).filter((x) => x.endsWith(".json")).sort()) {
      parts.push(fs.readFileSync(path.join(recordsDir, f)));
    }
  }
  return Buffer.concat(parts);
}
const PILOT_BYTES = pilotBytes();
const HINDI_REVIEW_BYTES = fs.readFileSync(path.resolve("data/ocr-hindi-review.json"));

function readShardStamp(outDir: string): ShardStamp | null {
  const file = path.join(outDir, "_stamps.json");
  if (!fs.existsSync(file)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<ShardStamp>;
    if (parsed.rev !== SHARD_REV || typeof parsed.stamp !== "string" || !Array.isArray(parsed.chapters)) return null;
    return parsed as ShardStamp;
  } catch {
    return null;
  }
}

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
  let skipped = 0;

  for (const file of files.sort()) {
    const id = path.basename(file, ".json");
    const bookPath = path.join(SRC, file);
    const outDir = path.join(SRC, id);
    // Raw bytes feed the stamp and the parse below; read once.
    const bookRaw = fs.readFileSync(bookPath);
    if (!DRY) {
      const stamp = sha256Hex(Buffer.concat([bookRaw, PILOT_BYTES, HINDI_REVIEW_BYTES]));
      const prev = readShardStamp(outDir);
      if (
        prev?.stamp === stamp &&
        fs.existsSync(path.join(outDir, "manifest.json")) &&
        prev.chapters.every((n) => fs.existsSync(path.join(outDir, `ch-${n}.json`)))
      ) {
        skipped++;
        continue;
      }
    }
    const book = JSON.parse(bookRaw.toString("utf8")) as {
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

    // Filler chapters (scripts/lib/filler-chapters.ts): publish them empty, so the reader shows "text being added".
    {
      const filler = fillerChapters(id, book.chapters ?? []);
      let verses = 0;
      for (const ch of book.chapters ?? []) {
        if (!filler.has(Number(ch.number))) continue;
        verses += ch.verses?.length ?? 0;
        ch.verses = [];
      }
      if (filler.size) console.log(`  ${id}: ${filler.size} filler chapter(s) published without their ${verses} hand-picked verse(s)`);
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

    // Hide Hindi and English that belong to other verses (OCR laid over the Sanskrit in reading order), and the
    // notes generated from them. Pilot verses are left to the pilot step below, and verses in the Hindi review registry
    // to the step after it (it withholds their Hindi and keeps their English); the build check exempts both the same way.
    {
      const pilotVerses = new Set(PILOT.filter((p) => p.scriptureId === id).map((p) => `${p.chapter}:${p.verse}`));
      const hidden = hideUnalignedMeanings(book, {
        keepVerse: (chapter, verse) => pilotVerses.has(`${chapter}:${verse}`) || isHindiSourceReviewRequired(id, chapter, verse),
        skipFields: exemptFields(id),
      });
      if (hidden.translation || hidden.hindi || hidden.notes) {
        console.log(`  ${id}: hid ${hidden.translation} English, ${hidden.hindi} Hindi and ${hidden.notes} note field(s) not aligned to their verse`);
      }
    }

    // Editorial pilot: apply the reviewed-for-structure Artha and clear the superseded explanation fields.
    for (const p of PILOT.filter((x) => x.scriptureId === id)) {
      const ch = (book.chapters ?? []).find((c) => c.number === p.chapter);
      const v = ((ch?.verses ?? []) as Record<string, unknown>[]).find((x) => String(x.number) === p.verse);
      if (v) patchPublishedVerse(v, p.record);
      else console.warn(`  ${id}: pilot unit ${p.record.unitId} not found in ${p.chapter}:${p.verse}`);
    }

    // Keep the original transcription for edition review, but withhold its
    // unverified Hindi meaning from generated chapter shards.
    for (const ch of book.chapters ?? []) {
      for (const verse of (ch.verses ?? []) as Record<string, unknown>[]) {
        if (!isHindiSourceReviewRequired(id, ch.number, String(verse.number))) continue;
        if (typeof verse.hindi !== "string" || !verse.hindi.trim()) {
          throw new Error(`Hindi source-review entry has no source text: ${id}:${ch.number}:${String(verse.number)}`);
        }
        delete verse.hindi;
        verse.hindiReviewRequired = true;
      }
    }

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
      fs.writeFileSync(
        path.join(outDir, "_stamps.json"),
        JSON.stringify({
          rev: SHARD_REV,
          stamp: sha256Hex(Buffer.concat([bookRaw, PILOT_BYTES, HINDI_REVIEW_BYTES])),
          chapters: [...expectedShards]
            .map((name) => Number(name.slice(3, -".json".length)))
            .filter((number) => Number.isFinite(number))
            .sort((a, b) => a - b),
        }),
      );
    }

    totalBytes += shardBytes;
    console.log(
      `${id}: ${book.chapters?.length ?? 0} chapters → ${(shardBytes / 1024).toFixed(0)}KB shards` +
        (echoHidden ? ` (${echoHidden} filler research notes left out)` : ""),
    );
  }

  console.log(
    `\n${DRY ? "Dry-run" : "Wrote"} ${totalShards} chapter shards (${(totalBytes / 1024 / 1024).toFixed(1)}MB total)` +
      (skipped ? `, skipped ${skipped} unchanged scripture(s)` : ""),
  );
}

main();
