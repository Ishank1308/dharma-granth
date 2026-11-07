/**
 * Publish the complete Rig Veda Saṃhitā from the DharmicData Sanskrit text.
 *
 *   node scripts/seed-rigveda.mjs                 # fetch the ten maṇḍala files
 *   node scripts/seed-rigveda.mjs --from <dir>    # read rigveda_mandala_N.json from a local folder
 *
 * Output: public/data/scriptures-full/rigveda.json (then `npm run shard:scriptures`).
 *
 * Each maṇḍala is a library chapter and each verse is numbered "sūkta.ṛk", so RV 1.164.46 is chapter 1,
 * verse 164.46. Every hymn's verse count must equal data/rigveda-hymn-verses.json, or nothing is written.
 *
 * The source marks verse ends inconsistently, so a verse ends at any of: ॥१॥, ॥ ४॥६॥, ७॥, or a bare ॥ at the
 * end of a line. Dvipadā hymns (1.66, 7.56…) number two verses per ॥n॥ and mark each line with its own verse
 * number; each such line is a verse (8.29 and 10.172 carry no line numbers, so there a two-line ॥n॥ is split
 * when that gives the hymn's count). Two source faults are handled by name: RV 8.66 is filed as hymn 67, and
 * RV 8.67 itself is absent (its 21 verses are not published until a source is found).
 *
 * Translations and notes come only from data/rigveda-curated.json, for verses checked by hand.
 * This replaces the earlier 67-entry "selection", most of which carried wrong references or texts that are
 * not in the Rig Veda (Asato mā, Gita 4.39).
 */
import fs from 'node:fs';
import path from 'node:path';
import { ACCENT, iast, letters, tidy, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const BASE = 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Rigveda';
const OUT = path.join(ROOT, 'public/data/scriptures-full/rigveda.json');
const COUNTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/rigveda-hymn-verses.json'), 'utf8')).mandalas;
const CURATED = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/rigveda-curated.json'), 'utf8')).verses;
/** Hymns the source does not have. */
const MISSING = new Set(['8.67']);
/** The source's hymn number → the real one. */
const RENUMBER = { '8.67': '8.66' };

const ORDINALS = ['प्रथम', 'द्वितीय', 'तृतीय', 'चतुर्थ', 'पञ्चम', 'षष्ठ', 'सप्तम', 'अष्टम', 'नवम', 'दशम'];

const D = '०-९';
const TERM = new RegExp(`(?:॥\\s*[${D}]+(?:\\s*॥\\s*[${D}]*)*\\s*॥?|[${D}]+\\s*॥|॥[ \\t]*(?=\\n|$))[ \\t${D}]*`, 'g');
const LINE_MARK = new RegExp(`[ \\t]{2,}[${D}]+[ \\t]*$|(?<=[^\\s${D}])[ \\t]+[${D}]+[ \\t]*$`);

async function readMandala(n, from) {
  const name = `rigveda_mandala_${n}.json`;
  if (from) return JSON.parse(fs.readFileSync(path.join(from, name), 'utf8'));
  const res = await fetch(`${BASE}/${name}`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.json();
}

/** One hymn's text → its verses, each a list of lines. */
function splitHymn(text) {
  let [head, ...rest] = text.split('\n');
  let body = rest.join('\n');
  if (!letters(body)) {
    // 5.1 has no line breaks: the anukramaṇī (seer । deity । metre ।) runs straight into verse 1.
    const m = /^(.*?।.*?।.*?।)([\s\S]*)$/.exec(text);
    head = m[1];
    body = m[2];
  }
  body = body.replace(/इति [^\n]*मण्डलं समाप्तम्॥?/g, '').replace(/^\s*\d+-\d+\s*$/gm, '');
  // The anukramaṇī can run over several lines; the hymn starts at its first accented line.
  const lines = body.split('\n');
  body = lines.slice(lines.findIndex((l) => ACCENT.test(l))).join('\n');

  const verses = [];
  for (const piece of body.split(TERM)) {
    if (!letters(piece)) continue;
    const ls = piece.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim().replace(/^,+|,+$/g, '').trim()).filter(Boolean);
    let cur = [];
    ls.forEach((l, i) => {
      cur.push(l);
      if (LINE_MARK.test(l) && i < ls.length - 1) {
        verses.push(cur);
        cur = [];
      }
    });
    if (cur.length) verses.push(cur);
  }
  return verses.map((v) => v.map((l) => tidy(l.replace(LINE_MARK, '').trim())));
}

async function main() {
  const fromIdx = process.argv.indexOf('--from');
  const from = fromIdx > 0 ? process.argv[fromIdx + 1] : null;
  const problems = [];
  const chapters = [];
  let total = 0;

  for (let m = 1; m <= 10; m++) {
    const hymns = new Map();
    for (const item of await readMandala(m, from)) {
      const ref = RENUMBER[`${m}.${item.sukta}`] ?? `${m}.${item.sukta}`;
      hymns.set(Number(ref.split('.')[1]), splitHymn(item.text));
    }
    const verses = [];
    COUNTS[m - 1].forEach((want, i) => {
      const h = i + 1;
      let got = hymns.get(h);
      // 8.29 and 10.172 are dvipadā without per-line numbers: each two-line ॥n॥ holds two verses.
      const split = got?.flatMap((lines) => (lines.length === 2 ? [[lines[0]], [lines[1]]] : [lines]));
      if (got && got.length !== want && split.length === want) got = split;
      if (!got) {
        if (!MISSING.has(`${m}.${h}`)) problems.push(`${m}.${h}: hymn missing from the source`);
        return;
      }
      if (got.length !== want) problems.push(`${m}.${h}: ${got.length} verses, the Saṃhitā has ${want}`);
      got.forEach((lines, k) => {
        const ref = `${m}.${h}.${k + 1}`;
        const sanskrit = verseText(lines);
        verses.push({
          number: `${h}.${k + 1}`,
          sanskrit,
          transliteration: iast(sanskrit),
          ...(CURATED[ref] ?? {}),
        });
      });
    });
    for (const h of hymns.keys()) if (!COUNTS[m - 1][h - 1]) problems.push(`${m}.${h}: not a hymn of the Saṃhitā`);
    chapters.push({ number: m, title: `Mandala ${m}`, titleSanskrit: `${ORDINALS[m - 1]} मण्डल`, verses });
    total += verses.length;
  }

  for (const ref of Object.keys(CURATED)) {
    const [m, h, k] = ref.split('.').map(Number);
    if (!chapters[m - 1]?.verses.some((v) => v.number === `${h}.${k}`)) problems.push(`curated ${ref} is not in the text`);
  }
  if (problems.length) {
    console.error(`✗ seed-rigveda: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
    process.exit(1);
  }

  const scripture = {
    id: 'rigveda',
    title: 'Rig Veda',
    titleSanskrit: 'ऋग्वेद',
    category: 'veda',
    source: {
      repo: 'https://github.com/bhavykhatri/DharmicData',
      license: 'Sanskrit mula text - public domain. Verify any translations separately.',
      fetchedAt: new Date().toISOString(),
      note: 'Śākala Saṃhitā with svara marks. Hymn 8.67 is missing from the source.',
    },
    totalVerses: total,
    totalChapters: chapters.length,
    chapters,
  };
  fs.writeFileSync(OUT, JSON.stringify(scripture, null, 2) + '\n');
  console.log(`✓ seed-rigveda: ${total} verses in ${chapters.length} mandalas → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
