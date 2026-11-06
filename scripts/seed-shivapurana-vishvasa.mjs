/**
 * Fill the Shiva Purana chapters that had no text: Vidyeshvara Samhita (chapter 1) and Rudra Samhita, Kumara Khanda
 * (chapter 5), in Sanskrit, from the vishvAsa project's e-texts.
 *
 *   node scripts/seed-shivapurana-vishvasa.mjs              # clone the pinned source commit (sparse, small)
 *   node scripts/seed-shivapurana-vishvasa.mjs --from <dir> # read a local checkout of vishvAsa/purANam
 *
 * Source: vishvAsa/purANam, shaivam/shiva-purANam. The Vidyeshvara Samhita is GRETIL's e-text, one half-verse per
 * line numbered `॥ ॥१,२।१अब्।` (samhita, adhyaya, verse, pada); the Kumara Khanda is numbered `॥ N ॥` per verse, as
 * printed. Speaker lines (सूत उवाच) open the verse they stand before. Headings, the closing colophon of each adhyaya
 * and three glosses the e-text carries between verses (GLOSSES) are left out. Only the Sanskrit is used.
 *
 * The other Rudra Samhita khandas (chapters 2, 3, 4 and 6: Srishti, Sati, Parvati, Yuddha) are not in the source and
 * stay as they are (publishing hides their placeholder verses).
 *
 * Output: public/data/scriptures-full/shivpurana.json, chapters 1 and 5 replaced; verse numbers "adhyaya.shloka", and
 * "0.1", "0.2" for the opening invocation of the Vidyeshvara Samhita. Then `npm run shard:scriptures`.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { iast, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/data/scriptures-full/shivpurana.json');
const REPO = 'https://github.com/vishvAsa/purANam.git';
const SHA = 'f57ecd8d1f5e418feb108b35f175ef67c593f7dd';
const BASE = 'shaivam/shiva-purANam';

const PARTS = [
  {
    chapter: 1,
    dir: '1_vidyeshvara-saMhitA',
    title: 'Vidyeshvara Samhita',
    titleSanskrit: 'विद्येश्वर संहिता',
    adhyayas: 25,
    verses: 1542,
    format: 'gretil',
  },
  {
    chapter: 5,
    dir: '2_rudra-saMhitA/4_kumAra-khaNDaH',
    title: 'Rudra Samhita — Kumara Khanda',
    titleSanskrit: 'रुद्र संहिता — कुमार खण्ड',
    adhyayas: 20,
    verses: 1080,
    format: 'printed',
  },
];

/** The other chapters' Sanskrit titles did not match their English ones. */
const TITLES_SANSKRIT = {
  2: 'रुद्र संहिता — सृष्टि खण्ड',
  3: 'रुद्र संहिता — सती खण्ड',
  4: 'रुद्र संहिता — पार्वती खण्ड',
  6: 'रुद्र संहिता — युद्ध खण्ड',
};

/** Glosses the e-text has between verses (a commentator's word list, not mūla). */
const GLOSSES = new Set(['गजकोमेडो गजवक्त्रः', 'छिन्नं खण्डितं भिन्नं विदीर्ण']);

const DIGITS = '०१२३४५६७८९';
const toInt = (s) => Number(s.replace(/[०-९]/g, (d) => DIGITS.indexOf(d)));
const GRETIL = /\s*॥\s*॥\s*[०-९]+,\s*(मन्ग्_|[०-९]+।\s*([०-९]+))[^।]*।\s*$/;
// `॥ १२ ॥`, and the e-text's slips: `। ४० ॥`, `॥ ३४` with no closing mark, `॥ ३१ ।`, `॥ १ ० ॥`.
const PRINTED = /\s*(?:॥\s*।?\s*|।\s*|\s)([०-९](?:\s?[०-९])*)\s*[॥।]?\s*$/;
/** Verse numbers the e-text mistypes, "adhyaya:position" → the number it prints there; checked, then renumbered. */
const TYPOS = { '3:26': 25, '4:57': 27, '8:35': 358, '8:45': 46, '9:18': 16, '9:35': 39, '17:55': 95 };
const SPEAKER = /(वाच|वच|ऊचुः|ूचुः|ऊचतुः|ूचतुः)$/;
const HEADING = /^॥[^०-९]*॥$|^श्रीशिवमहापुराणम्|संहितायां|ऽध्यायः$|^श्रीगौरीशङ्करार्पणमस्तु/;

function sourceDir() {
  const i = process.argv.indexOf('--from');
  if (i > 0) return path.join(process.argv[i + 1], BASE);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'shivapurana-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: ['ignore', 'ignore', 'inherit'] });
  git('init', '-q');
  git('remote', 'add', 'origin', REPO);
  git('sparse-checkout', 'set', ...PARTS.map((p) => `${BASE}/${p.dir}`));
  git('fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', SHA);
  git('checkout', '-q', 'FETCH_HEAD');
  return path.join(dir, BASE);
}

const body = (file) => fs.readFileSync(file, 'utf8').split('+++').slice(2).join('+++');
// `## रथः` lines are section headings the vishvAsa editors added (Kumara Khanda 5).
const lines = (text) =>
  text.split('\n').map((l) => l.replace(/\+\+\+.*$/, '').trim()).filter((l) => l && !l.startsWith('#'));
const titleOf = (file) => (/title = "[०-९]+\s*(.*?)\s*"/.exec(fs.readFileSync(file, 'utf8'))?.[1] ?? '');

/** GRETIL e-text of one adhyaya (or the samhita's opening): [{ n, lines }]. */
function parseGretil(text, where) {
  const out = [];
  let pending = [];
  for (const line of lines(text)) {
    if (/^इति श्री/.test(line)) break;
    if (GLOSSES.has(line)) continue;
    const m = GRETIL.exec(line);
    if (!m) {
      pending.push(line);
      continue;
    }
    const half = line.slice(0, m.index).replace(/[।॥\s]+$/, '').trim();
    const n = m[1] === 'मन्ग्_' ? 0 : toInt(m[2]);
    // A speaker line opens a verse; "नमः" alone (Vidyeshvara 10.29) is the first word of the next half-line; the
    // list of the fourteen rudraksha mantras (25.81) closes the verse before it.
    const lead = pending.filter((p) => SPEAKER.test(p));
    const joinWord = pending.filter((p) => p === 'नमः');
    const tail = pending.filter((p) => !SPEAKER.test(p) && p !== 'नमः');
    // Before the first verse, unnumbered lines are headings (श्रीगणेशाय नमः ॥).
    if (tail.length && out.length) {
      if (!tail.every((t) => /[०-९]/.test(t))) throw new Error(`${where}: unexpected lines ${tail}`);
      out[out.length - 1].lines.push(...tail);
    }
    pending = [];
    const text1 = joinWord.length ? `नमः ${half}` : half;
    const last = out[out.length - 1];
    // A speaker line can also fall between the two halves of a verse (Vidyeshvara 3.10).
    if (last && last.n === n && n !== 0) last.lines.push(...lead, text1);
    else if (n === 0) out.push({ n: out.length + 1, invocation: true, lines: [text1] });
    else out.push({ n, lines: [...lead, text1] });
  }
  if (pending.some((p) => !SPEAKER.test(p))) throw new Error(`${where}: lines after the last verse`);
  return out;
}

/** A printed-style adhyaya: a verse number closes the lines since the previous one. */
function parsePrinted(text, where, title) {
  const out = [];
  let buf = [];
  for (const line of lines(text)) {
    if (/^इति श्री/.test(line)) break;
    if (!out.length && !buf.length && HEADING.test(line)) continue;
    if ((HEADING.test(line) && /^॥/.test(line)) || (title && line === title)) continue;
    const m = PRINTED.exec(line);
    if (!m || !/॥/.test(line.slice(Math.max(0, m.index - 1)))) {
      buf.push(line);
      continue;
    }
    const before = line.slice(0, m.index).trim();
    if (before) buf.push(before);
    out.push({ n: toInt(m[1].replace(/\s/g, '')), lines: buf });
    buf = [];
  }
  if (buf.length) throw new Error(`${where}: ${buf.length} lines after the last verse number`);
  return out;
}

function adhyayaFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}(_.*)?\.md$/.test(f))
    .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)))
    .map((f) => path.join(dir, f));
}

function main() {
  const src = sourceDir();
  const book = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const report = [];
  for (const part of PARTS) {
    const dir = path.join(src, part.dir);
    const files = adhyayaFiles(dir);
    if (files.length !== part.adhyayas) throw new Error(`${part.title}: ${files.length} adhyayas, expected ${part.adhyayas}`);
    const verses = [];
    if (part.format === 'gretil') {
      for (const v of parseGretil(body(path.join(dir, '_index.md')), `${part.chapter}.0`)) {
        verses.push({ number: `0.${v.n}`, lines: v.lines });
      }
    }
    files.forEach((file, i) => {
      const a = i + 1;
      if (Number(path.basename(file).slice(0, 2)) !== a) throw new Error(`${part.title}: adhyaya ${a} missing`);
      const parse = part.format === 'gretil' ? parseGretil : parsePrinted;
      const records = parse(body(file), `${part.chapter}.${a}`, titleOf(file));
      records.forEach((r, j) => {
        const typo = part.format === 'printed' ? TYPOS[`${a}:${j + 1}`] : undefined;
        if (r.n !== j + 1 && r.n !== typo) throw new Error(`${part.title} ${a}: verse ${j + 1} is numbered ${r.n}`);
        if (typo !== undefined && r.n !== typo) throw new Error(`${part.title} ${a}: typo at ${j + 1} is gone`);
        r.n = j + 1;
        verses.push({ number: `${a}.${r.n}`, lines: r.lines });
      });
    });
    const out = verses.map(({ number, lines: ls }) => {
      const tidy = ls.map((l) => l.replace(/[‌‍]/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      if (!tidy.length) throw new Error(`${part.title} ${number}: empty verse`);
      if (/[A-Za-z]/.test(tidy.join(''))) throw new Error(`${part.title} ${number}: Latin letters`);
      const sanskrit = verseText(tidy);
      return { number, sanskrit, transliteration: iast(sanskrit) };
    });
    if (out.length !== part.verses) throw new Error(`${part.title}: ${out.length} verses, expected ${part.verses}`);
    const ch = book.chapters.find((c) => Number(c.number) === part.chapter);
    if (!ch) throw new Error(`chapter ${part.chapter} missing from ${OUT}`);
    ch.title = part.title;
    ch.titleSanskrit = part.titleSanskrit;
    ch.verses = out;
    report.push(`  ${part.chapter} ${part.title}: ${files.length} adhyayas, ${out.length} verses`);
  }
  for (const [n, t] of Object.entries(TITLES_SANSKRIT)) {
    const ch = book.chapters.find((c) => Number(c.number) === Number(n));
    if (ch) ch.titleSanskrit = t;
  }
  book.totalVerses = book.chapters.reduce((n, c) => n + c.verses.length, 0);
  book.source = {
    ...book.source,
    vidyeshvaraKumaraRepo: `https://github.com/vishvAsa/purANam/tree/${SHA}/${BASE}`,
    vidyeshvaraKumaraLicense:
      'Sanskrit mūla (public domain). Vidyeshvara Samhita from the GRETIL e-text, Kumara Khanda as digitised by the vishvAsa project.',
  };
  fs.writeFileSync(OUT, JSON.stringify(book));
  console.log(report.join('\n'));
  console.log(`Wrote ${path.relative(ROOT, OUT)}: ${book.totalVerses} verses in all.`);
}

main();
