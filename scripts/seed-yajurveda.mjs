/**
 * Publish the White Yajur Veda (Vājasaneyi Mādhyandina Saṃhitā) from the DharmicData Sanskrit text.
 *
 *   node scripts/seed-yajurveda.mjs              # fetch the Saṃhitā
 *   node scripts/seed-yajurveda.mjs --from <f>   # read vajasneyi_madhyadina_samhita.json from a local file
 *
 * Output: public/data/scriptures-full/yajurveda.json (then `npm run shard:scriptures`).
 *
 * Each adhyāya is a library chapter and its mantras are numbered 1…n, so VS 34.1 is chapter 34, verse 1.
 * A mantra ends with ।। n ।। (sometimes ॥, ASCII digits, spaced digits or a single closing ।). Nothing is
 * written unless every mantra's number follows the one before and each adhyāya has the mantra count in
 * COUNTS. The source misnumbers two mantras (6.3 as २, 12.56 as ४६); those are allowed in LABEL_TYPOS.
 *
 * English: Griffith's translation from data/yajurveda-griffith.json (scripts/extract-yajurveda-griffith.mjs),
 * one verse per mantra, for adhyāyas 5–40. Adhyāyas 1–4 have no English yet, and Griffith leaves out 12.41
 * (the same as 12.40), 17.23–24 (given in book 8) and 23.20–31.
 */
import fs from 'node:fs';
import path from 'node:path';
import { iast, letters, tidy, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const URL = 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Yajurveda/vajasneyi_madhyadina_samhita.json';
const OUT = path.join(ROOT, 'public/data/scriptures-full/yajurveda.json');
const GRIFFITH = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/yajurveda-griffith.json'), 'utf8')).books;

/** Mantras per adhyāya in the Mādhyandina Saṃhitā (1,975 in all). */
const COUNTS = [
  31, 34, 63, 37, 43, 37, 48, 63, 40, 34, 83, 117, 58, 31, 65, 66, 99, 77, 95, 90,
  61, 34, 65, 40, 47, 26, 45, 46, 60, 22, 22, 16, 97, 58, 22, 24, 21, 28, 13, 17,
];
/** Mantras the source numbers wrongly: "adhyāya.mantra" → the number it prints. */
const LABEL_TYPOS = { '6.3': 2, '12.56': 46 };

const num = (s) => Number(String(s).replace(/\s/g, '').replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d)));
const TERM = /(?:।।|॥)\s*([०-९0-9][०-९0-9\s]*?)\s*।।?/g;
const deva = (n) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[d]);

async function readSource(from) {
  if (from) return JSON.parse(fs.readFileSync(from, 'utf8'));
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`${URL}: HTTP ${res.status}`);
  return res.json();
}

/**
 * Typing slips in the source: j and k for the Yajurvedic anusvāra ꣳ (त्रि॒jशद्), ¬ inside a word, | for
 * a danda, and an en dash between repeated words (वने॑ – वने).
 */
function clean(text) {
  return text
    .replace(/(?<=[ऀ-ॿ])k ?|(?<=[ऀ-ॿ])j/g, 'ᳪ')
    .replace(/¬/g, '')
    .replace(/\|/g, '।')
    .replace(/\s*–\s*/g, '-');
}

function lines(text) {
  return text
    .split('\n')
    .map((l) => tidy(l.replace(/[ \t]+/g, ' ').trim()).replace(/(?<=[^\s।])।/g, ' ।'))
    .filter((l) => letters(l));
}

/** IAST for a mantra; the Yajurvedic anusvāra ꣳ is read as ṃ. */
const transliterate = (sanskrit) => iast(sanskrit.replace(/ᳪ/g, 'ं'));

function english(a, n) {
  const text = GRIFFITH[a]?.[n];
  // Griffith's verse 1 opens each book in capitals ("HOMAGE be paid"); the rest is sentence case.
  return text?.replace(/^([A-Z])([A-Z]+)\b/, (_, f, rest) => f + rest.toLowerCase());
}

async function main() {
  const args = process.argv.slice(2);
  const from = args.includes('--from') ? args[args.indexOf('--from') + 1] : null;
  const source = await readSource(from);
  const problems = [];
  const chapters = [];
  let total = 0;

  for (let a = 1; a <= 40; a++) {
    const item = source.find((x) => Number(x.adhyaya) === a);
    if (!item) {
      problems.push(`adhyāya ${a}: missing from the source`);
      continue;
    }
    const text = clean(item.text);
    const verses = [];
    let at = 0;
    for (const m of text.matchAll(TERM)) {
      const n = verses.length + 1;
      const printed = num(m[1]);
      if (printed !== n && LABEL_TYPOS[`${a}.${n}`] !== printed) problems.push(`${a}.${n}: numbered ${printed}`);
      const ls = lines(text.slice(at, m.index));
      if (!ls.length) problems.push(`${a}.${n}: no text`);
      const sanskrit = verseText(ls);
      const verse = { number: n, sanskrit, transliteration: transliterate(sanskrit) };
      const en = english(a, n);
      if (en) verse.translation = en;
      verses.push(verse);
      at = m.index + m[0].length;
    }
    if (letters(text.slice(at))) problems.push(`adhyāya ${a}: text after the last numbered mantra`);
    if (verses.length !== COUNTS[a - 1]) problems.push(`adhyāya ${a}: ${verses.length} mantras, expected ${COUNTS[a - 1]}`);
    chapters.push({ number: a, title: `Adhyāya ${a}`, titleSanskrit: `अध्याय ${deva(a)}`, verses });
    total += verses.length;
  }

  if (problems.length) {
    console.error(`✗ seed-yajurveda: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
    process.exit(1);
  }

  const scripture = {
    id: 'yajurveda',
    title: 'Yajur Veda',
    titleSanskrit: 'यजुर्वेद',
    category: 'veda',
    source: {
      repo: 'https://github.com/bhavykhatri/DharmicData',
      license: "Sanskrit mula text and R. T. H. Griffith's English (1899) - public domain.",
      fetchedAt: new Date().toISOString(),
      note: 'Vājasaneyi Mādhyandina Saṃhitā (Śukla Yajurveda) with svara marks. English: Griffith, The Texts of the White Yajurveda, for adhyāyas 5–40.',
    },
    totalVerses: total,
    totalChapters: chapters.length,
    chapters,
  };
  fs.writeFileSync(OUT, JSON.stringify(scripture, null, 2) + '\n');
  const withEnglish = chapters.reduce((s, c) => s + c.verses.filter((v) => v.translation).length, 0);
  console.log(`✓ seed-yajurveda: ${total} mantras in ${chapters.length} adhyāyas (${withEnglish} with English) → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
