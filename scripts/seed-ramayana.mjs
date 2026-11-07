/**
 * Publish the full Valmiki Ramayana in Sanskrit: all seven kandas, 648 sargas, Gita Press verse numbers.
 *
 *   node scripts/seed-ramayana.mjs              # clone the pinned source commit (sparse, about 60 MB)
 *   node scripts/seed-ramayana.mjs --from <dir> # read a local checkout of vishvAsa/rAmAyaNam (branch "content")
 *
 * Source: vishvAsa/rAmAyaNam, vAlmIkIyam/goraxapura-pAThaH/sarva-prastutiH. One file per sarga; each verse group
 * carries a `<details><summary>मूलम्</summary>` block with the mūla as the Gita Press (Gorakhpur) edition prints it,
 * numbered `॥ N ॥`. Only that Sanskrit is used. The same files also hold the Gita Press Hindi and other translations
 * and commentaries: none of that is read, because it is not ours to publish (see docs and memory on Gita Press).
 *
 * The mūla blocks need a few repairs, all made here so a rerun gives the same text:
 *   - a `_________________` line starts a second, noisier copy of the verse from another digitisation: dropped;
 *   - a verse number closes every line since the previous number, as in print, even where the source puts a
 *     half-line in the block before (it files Gita Press's "18½" Hindi with it);
 *   - a handful of numbering slips (a number typed twice, a Hindi gloss filed as a verse, Sundara 44 with no
 *     numbers at all) are fixed in FIXES below and each one is checked, so a changed source fails loudly;
 *   - bold markers, zero-width joiners and "(/variant)" notes are removed.
 *
 * Output: public/data/scriptures-full/ramayana.json (then `npm run shard:scriptures`). Every chapter is a kanda; a
 * verse number is "sarga.shloka". Meanings come only from data/ramayana-meanings.json (written from the Sanskrit, see
 * that file), applied by verse number.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { iast, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/data/scriptures-full/ramayana.json');
const MEANINGS = path.join(ROOT, 'data/ramayana-meanings.json');
const REPO = 'https://github.com/vishvAsa/rAmAyaNam.git';
const SHA = 'b2d4ab23cc81bc84cbf2a056057646f6f7f5435f';
const SUBDIR = 'vAlmIkIyam/goraxapura-pAThaH/sarva-prastutiH';

const KANDAS = [
  { dir: '1_bAlakANDam', title: 'Bala Kanda', titleSanskrit: 'बालकाण्ड', sargas: 77, verses: 2270 },
  { dir: '2_ayodhyAkANDam', title: 'Ayodhya Kanda', titleSanskrit: 'अयोध्याकाण्ड', sargas: 119, verses: 4304 },
  { dir: '3_araNyakANDam', title: 'Aranya Kanda', titleSanskrit: 'अरण्यकाण्ड', sargas: 75, verses: 2447 },
  { dir: '4_kiShkindhAkANDam', title: 'Kishkindha Kanda', titleSanskrit: 'किष्किन्धाकाण्ड', sargas: 67, verses: 2462 },
  { dir: '5_sundarakANDam', title: 'Sundara Kanda', titleSanskrit: 'सुन्दरकाण्ड', sargas: 68, verses: 2865 },
  { dir: '6_yuddhakANDam', title: 'Yuddha Kanda', titleSanskrit: 'युद्धकाण्ड', sargas: 128, verses: 5788 },
  { dir: '7_uttarakANDam', title: 'Uttara Kanda', titleSanskrit: 'उत्तरकाण्ड', sargas: 111, verses: 3459 },
];

/**
 * Numbering slips in the source, keyed "kanda.sarga". `renumber`: [index of the record in the sarga, number it
 * should carry, number the source gives]. `dropGloss`: a verse number whose second record is a Hindi gloss.
 */
const FIXES = {
  '2.13': { renumber: [[16, 17, 16]] },
  '2.17': { renumber: [[14, 15, 16]] },
  '2.55': { renumber: [[6, 7, 5]] },
  '2.57': { dropGloss: [23] },
  '2.93': { dropGloss: [8] },
  '4.22': { renumber: [[13, 14, 13]] },
  '4.24': { renumber: [[33, 34, 33]] },
  '4.39': { renumber: [[8, 9, 8]] },
  '6.17': { renumber: [[63, 64, 63]] },
  '6.30': { renumber: [[31, 32, 31]] },
  '7.20': { renumber: [[22, 23, 22]] },
};

/** Lines the source garbles, replaced by the Gita Press reading (checked against the source's other copy). */
const LINE_FIXES = new Map([
  // Aranya 31.47: the last pada was left in ITRANS.
  ['शराङ्गपूर्णो niSitAsi-daMSTraH', 'शराङ्गपूर्णो निशितासिदंष्ट्रः'],
]);

const DIGITS = '०१२३४५६७८९';
const toInt = (s) => Number(s.replace(/[०-९]/g, (d) => DIGITS.indexOf(d)));
const BLOCK = /<details><summary>मूलम्<\/summary>\s*([\s\S]*?)<\/details>/g;
// `॥ १२ ॥`, and once `॥ ॥ ४०` (Aranya 73.39–40).
const NUM = /॥\s*([०-९]+)\s*॥|॥\s*॥\s*([०-९]+)/;
const HINDI_GLOSS = /(?:^|\s)(?:है|हैं|हुए|किया|सुनकर|रहा|रही)(?:\s|$|[।,])/;

function clean(line) {
  const fixed = LINE_FIXES.get(line.trim()) ?? line;
  return fixed
    .replace(/[‌‍]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s*\(\/[^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sourceDir() {
  const i = process.argv.indexOf('--from');
  if (i > 0) return path.join(process.argv[i + 1], SUBDIR);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ramayana-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: ['ignore', 'ignore', 'inherit'] });
  git('init', '-q');
  git('remote', 'add', 'origin', REPO);
  git('sparse-checkout', 'set', SUBDIR);
  git('fetch', '-q', '--depth', '1', '--filter=blob:none', 'origin', SHA);
  git('checkout', '-q', 'FETCH_HEAD');
  return path.join(dir, SUBDIR);
}

function sargaFiles(kandaDir) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/^\d{3}_.*\.md$/.test(e.name)) out.push(p);
    }
  };
  walk(kandaDir);
  return out.sort((a, b) => Number(path.basename(a).slice(0, 3)) - Number(path.basename(b).slice(0, 3)));
}

/**
 * One sarga's mūla as [{ n, lines }] in source order, before FIXES. As in the printed edition, a verse number closes
 * the lines since the previous number, whatever block they sit in: the source files Gita Press's "18½" Hindi with
 * the half-line after ॥ १८ ॥, but in the mūla that half-line opens verse 19.
 */
function parseSarga(text, where) {
  const blocks = [...text.matchAll(BLOCK)].map(([, body]) => body.split('_________________')[0]);
  const records = [];
  let buf = [];
  for (const block of blocks) {
    for (const raw of block.split('\n')) {
      let line = raw.trim();
      while (line) {
        const m = NUM.exec(line);
        if (!m) {
          buf.push(line);
          break;
        }
        const before = line.slice(0, m.index).trim();
        if (before) buf.push(before);
        records.push({ n: toInt(m[1] ?? m[2]), lines: buf });
        buf = [];
        line = line.slice(m.index + m[0].length).trim();
      }
    }
  }
  // Sundara 44 has no verse numbers at all: one block per verse.
  if (!records.length) return blocks.map((b, i) => ({ n: i + 1, lines: b.split('\n').map((l) => l.trim()).filter(Boolean) }));
  if (buf.length) throw new Error(`${where}: ${buf.length} lines after the last verse number`);
  return records;
}

function applyFixes(records, key) {
  const fix = FIXES[key] ?? {};
  for (const [index, want, given] of fix.renumber ?? []) {
    const r = records[index];
    if (!r || r.n !== given) throw new Error(`${key}: expected record ${index} to be numbered ${given}`);
    r.n = want;
  }
  for (const n of fix.dropGloss ?? []) {
    const i = records.findIndex((r, j) => j > 0 && r.n === n && records[j - 1].n === n);
    if (i < 0 || !HINDI_GLOSS.test(records[i].lines.join(' '))) throw new Error(`${key}: no Hindi gloss after verse ${n}`);
    records.splice(i, 1);
  }
  records.forEach((r, i) => {
    if (r.n !== i + 1) throw new Error(`${key}: record ${i} is numbered ${r.n}, expected ${i + 1}`);
    if (HINDI_GLOSS.test(r.lines.join(' '))) throw new Error(`${key}.${r.n}: looks like Hindi, not mūla`);
  });
  return records;
}

function loadMeanings() {
  if (!fs.existsSync(MEANINGS)) return new Map();
  const data = JSON.parse(fs.readFileSync(MEANINGS, 'utf8'));
  return new Map(Object.entries(data.verses ?? {}));
}

function main() {
  const src = sourceDir();
  const meanings = loadMeanings();
  const used = new Set();
  const chapters = [];
  let total = 0;
  const report = [];

  KANDAS.forEach((k, ki) => {
    const kanda = ki + 1;
    const files = sargaFiles(path.join(src, k.dir));
    if (files.length !== k.sargas) throw new Error(`${k.title}: ${files.length} sargas, expected ${k.sargas}`);
    const verses = [];
    files.forEach((file, si) => {
      const sarga = Number(path.basename(file).slice(0, 3));
      if (sarga !== si + 1) throw new Error(`${k.title}: sarga ${sarga} out of order`);
      const records = applyFixes(parseSarga(fs.readFileSync(file, 'utf8'), `${kanda}.${sarga}`), `${kanda}.${sarga}`);
      for (const { n, lines } of records) {
        const tidy = lines.map(clean).filter(Boolean);
        if (!tidy.length) throw new Error(`${kanda}.${sarga}.${n}: empty verse`);
        if (/[A-Za-z]/.test(tidy.join(''))) throw new Error(`${kanda}.${sarga}.${n}: Latin letters in the mūla`);
        const number = `${sarga}.${n}`;
        const sanskrit = verseText(tidy);
        const verse = { number, sanskrit, transliteration: iast(sanskrit) };
        const m = meanings.get(`${kanda}:${number}`);
        if (m) {
          used.add(`${kanda}:${number}`);
          if (m.hindi) verse.hindi = m.hindi;
          if (m.translation) verse.translation = m.translation;
        }
        verses.push(verse);
      }
    });
    if (verses.length !== k.verses) throw new Error(`${k.title}: ${verses.length} verses, expected ${k.verses}`);
    chapters.push({ number: kanda, title: k.title, titleSanskrit: k.titleSanskrit, verses });
    total += verses.length;
    report.push(`  ${kanda} ${k.title}: ${files.length} sargas, ${verses.length} verses`);
  });

  const unused = [...meanings.keys()].filter((key) => !used.has(key));
  if (unused.length) throw new Error(`meanings for verses not in the text: ${unused.slice(0, 5).join(', ')}`);

  const book = {
    id: 'ramayana',
    title: 'Valmiki Ramayana',
    titleSanskrit: 'वाल्मीकि रामायण',
    category: 'itihasa',
    source: {
      repo: `https://github.com/vishvAsa/rAmAyaNam/tree/${SHA}/${SUBDIR}`,
      license:
        'Sanskrit mūla of the Valmiki Ramayana (public domain), as printed in the Gita Press, Gorakhpur edition and digitised by the vishvAsa project. Only the Sanskrit is used.',
      fetchedAt: new Date().toISOString(),
    },
    totalVerses: total,
    totalChapters: chapters.length,
    chapters,
  };
  fs.writeFileSync(OUT, JSON.stringify(book));
  console.log(report.join('\n'));
  console.log(`Wrote ${total} verses in 7 kandas to ${path.relative(ROOT, OUT)}; ${used.size} with a meaning.`);
}

main();
