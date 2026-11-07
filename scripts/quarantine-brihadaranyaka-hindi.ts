/**
 * Takes the Brihadaranyaka Hindi out of the published data.
 *
 * The "hindi" field came from archive.org OCR of the Gita Press edition and was attached to the wrong mantras:
 * 2.1.1 (Gārgya and Ajātaśatru) carried the Hindi of 1.4.10 ("पहले यह ब्रह्म ही था"), and the text is mixed
 * with Śaṅkara-bhāṣya fragments and page numbers. The "science" notes and the hi-commentary entries repeat
 * that text (the science notes add an unsourced claim after it). Readers saw all of it, including in meta
 * descriptions.
 *
 * The text is kept in data/pending/brihadaranyaka-hindi.json, keyed by mantra number, so a re-alignment can
 * start from it. The English (Max Müller, SBE 15, public domain) is correctly aligned and stays.
 *
 *   npx tsx scripts/quarantine-brihadaranyaka-hindi.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FULL = path.join(ROOT, 'public/data/scriptures-full/brihadaranyaka.json');
const CURATED = path.join(ROOT, 'data/scriptures/brihadaranyaka.ts');
const HI_TS = path.join(ROOT, 'data/hi-commentary/brihadaranyaka.ts');
const HI_REST = path.join(ROOT, 'data/hi-commentary/brihadaranyaka-rest.json');
const PENDING = path.join(ROOT, 'data/pending/brihadaranyaka-hindi.json');

type Verse = { number: string; hindi?: string; science?: string };
const raw = fs.readFileSync(FULL, 'utf8');
const crlf = raw.includes('\r\n');
const book = JSON.parse(raw) as { chapters: Array<{ number: number; verses: Verse[] }> };

const entries: Record<string, { chapter: number; hindi?: string; science?: string }> = {};
for (const chapter of book.chapters) {
  for (const verse of chapter.verses) {
    if (verse.hindi === undefined && verse.science === undefined) continue;
    entries[verse.number] = { chapter: chapter.number, hindi: verse.hindi, science: verse.science };
    delete verse.hindi;
    delete verse.science;
  }
}
const eol = (text: string) => (crlf ? text.split('\n').join('\r\n') : text);
fs.writeFileSync(FULL, eol(JSON.stringify(book, null, 2) + '\n'));

// Curated mirror: the same two fields, one property per line, never the last property of a verse.
const curated = fs.readFileSync(CURATED, 'utf8');
const kept = curated.split(/(?<=\n)/).filter((line) => !/^\s*"(hindi|science)": .*,\r?\n?$/.test(line));
fs.writeFileSync(CURATED, kept.join(''));

const hiTs = fs.readFileSync(HI_TS, 'utf8');
const header = hiTs.slice(0, hiTs.indexOf('export const'));
const nl = hiTs.includes('\r\n') ? '\r\n' : '\n';
fs.writeFileSync(
  HI_TS,
  header +
    `// Emptied by scripts/quarantine-brihadaranyaka-hindi.ts: the OCR Hindi was attached to the wrong mantras.${nl}` +
    `// The text is kept in data/pending/brihadaranyaka-hindi.json.${nl}` +
    `export const brihadaranyakaHi: HiCommentaryFragment = {};${nl}`,
);
fs.writeFileSync(HI_REST, '{}\n');

fs.mkdirSync(path.dirname(PENDING), { recursive: true });
fs.writeFileSync(
  PENDING,
  JSON.stringify(
    {
      note:
        'Gita Press Hindi (archive.org OCR) removed from the Brihadaranyaka by scripts/quarantine-brihadaranyaka-hindi.ts. ' +
        'NOT published: attached to the wrong mantras, mixed with bhashya fragments and OCR errors, and the license of the ' +
        'Gita Press translation is unverified. "science" repeats the Hindi plus an unsourced claim; do not restore it.',
      keyFormat: 'mantra number (adhyaya.brahmana.mantra) as published; chapter is the reader chapter',
      entries,
    },
    null,
    2,
  ) + '\n',
);

const removedLines = curated.split(/(?<=\n)/).length - kept.length;
console.log(`moved ${Object.keys(entries).length} mantras to ${path.relative(ROOT, PENDING)}; removed ${removedLines} curated lines`);
