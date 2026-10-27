/**
 * Publish the Mahabharata's Sanskrit from the BORI critical edition as GRETIL distributes it.
 *
 *   node scripts/seed-mahabharata-gretil.mjs              # fetch the 18 parvas (pinned commit)
 *   node scripts/seed-mahabharata-gretil.mjs --from <dir> # read a local copy of vyAsaH/gretil-mUlam
 *
 * Source: vishvAsa/mahAbhAratam (branch "content"), vyAsaH/gretil-mUlam: GRETIL's e-text of the critical
 * edition ("Electronic text (C) Bhandarkar Oriental Research Institute, Pune, 1999; on the basis of the text
 * entered by Muneo Tokunaga et al., revised by John Smith"), in Devanagari, one line per half-verse:
 * `०६,००१।००१अ कथं युयुधिरे …`. DharmicData's Mahabharata (scripts/seed-mahabharata.ts) is the same e-text but
 * lost most viramas and र-conjuncts on conversion (दरॊणे for द्रोणे, राजन for राजन्), and parvas 1–7 were never
 * published (their chapters held a few hand-picked verses, which publishing hides as filler).
 *
 * Only critical-edition lines are kept. Lines numbered with `--` (passages the edition prints in its apparatus)
 * or `@` (its appendix) are left out, so verse numbers are the critical edition's and match DharmicData's.
 * A speaker line (`जनमेजय उवाच`) opens the verse it stands before.
 *
 * Output: public/data/scriptures-full/mahabharata.json (then `npm run shard:scriptures`). Every chapter is a parva;
 * a verse number is "adhyāya.śloka". Parvas 8–18 keep their English, Hindi and notes; where the new text of a verse
 * differs from the old one by more than spelling (the old source split some long verses differently), its English
 * is dropped, since it was made from the old verse.
 */
import fs from 'node:fs';
import path from 'node:path';
import { iast, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public/data/scriptures-full/mahabharata.json');
const SHA = '4c20eb64fab3697d6fd93d33d4da3a5e75e30969';
const BASE = `https://raw.githubusercontent.com/vishvAsa/mahAbhAratam/${SHA}/vyAsaH/gretil-mUlam`;
const UDYOGA_ADHYAYAS = 197;

const FILES = {
  1: '01_Adiparvan.md', 2: '02_sabhaparvan.md', 3: '03_aranyakaparvan.md', 4: '04_virataparvan.md',
  6: '06_bhismaparvan.md', 7: '07_dronaparvan.md', 8: '08_karnaparvan.md', 9: '09_salyaparvan.md',
  10: '10_sauptikaparvan.md', 11: '11_striparvan.md', 12: '12_santiparvan.md', 13: '13_anusasanaparvan.md',
  14: '14_asvamedhikaparvan.md', 15: '15_asramavasikaparvan.md', 16: '16_mausalaparvan.md',
  17: '17_mahaprasthanikaparvan.md', 18: '18_svargarohanaparvan.md',
};
/** Ślokas per parva in the critical edition (73,816 in all). */
const COUNTS = [7197, 2390, 10316, 1824, 6063, 5406, 8152, 3871, 3315, 772, 730, 12866, 6536, 2743, 1062, 273, 106, 194];

const num = (s) => Number(s.replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d)));
const FULL = /^([०-९]{2}),([०-९]{3})।([०-९]{3})(\S*)\s+(.*)$/;
const SHORT = /^([०-९]{3})(\S*)\s+(.*)$/;

const fromIdx = process.argv.indexOf('--from');
const FROM = fromIdx > 0 ? process.argv[fromIdx + 1] : null;

async function read(rel) {
  if (FROM) return fs.readFileSync(path.join(FROM, rel), 'utf8');
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${BASE}/${rel}`);
    if (res.ok) return res.text();
    if (attempt === 4) throw new Error(`${rel}: HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
}

/** One parva: Map "adhyāya.śloka" → { speaker[], lines[] } in source order. */
async function parseParva(parva) {
  const files =
    parva === 5
      ? Array.from({ length: UDYOGA_ADHYAYAS }, (_, i) => [i + 1, `05_udyogaparvan/${String(i + 1).padStart(3, '0')}.md`])
      : [[null, FILES[parva]]];
  const verses = new Map();
  for (const [adhyaya, rel] of files) {
    for (const raw of (await read(rel)).split('\n')) {
      const line = raw.trimEnd().replace('<>', ' ');
      let ch, v, suffix, text;
      const m = FULL.exec(line);
      if (m) {
        if (num(m[1]) !== parva) throw new Error(`${rel}: line from parva ${num(m[1])}: ${line}`);
        [ch, v, suffix, text] = [num(m[2]), num(m[3]), m[4], m[5]];
      } else if (adhyaya !== null) {
        // Udyoga Parva comes one file per adhyāya, mostly without the "05,adhyāya।" prefix.
        const s = SHORT.exec(line);
        if (!s) continue;
        [ch, v, suffix, text] = [adhyaya, num(s[1]), s[2], s[3]];
      } else continue;
      if (/--|@|x/.test(suffix)) continue; // apparatus and appendix passages
      const key = `${ch}.${v}`;
      if (!verses.has(key)) verses.set(key, { speaker: [], lines: [] });
      const t = text.replace(/;\s*/g, ' ').replace(/\s+/g, ' ').trim();
      if (!t) continue;
      if (suffix === '') verses.get(key).speaker.push(t);
      else verses.get(key).lines.push(t);
    }
  }
  return verses;
}

/** Consonants and vowels only, so a text compares the same however the old source spelled it. */
const skeleton = (s) =>
  String(s ?? '')
    .replace(/ॊ/g, 'ो')
    .replace(/ॆ/g, 'े')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[^क-हा-ौअ-औंः]/g, '');

function bigrams(s) {
  const m = new Map();
  for (let i = 0; i < s.length - 1; i++) m.set(s.slice(i, i + 2), (m.get(s.slice(i, i + 2)) ?? 0) + 1);
  return m;
}
/** Dice similarity of two texts' skeletons, 0–1. */
function similarity(a, b) {
  const [x, y] = [bigrams(skeleton(a)), bigrams(skeleton(b))];
  let both = 0;
  let total = 0;
  for (const [k, n] of x) {
    both += Math.min(n, y.get(k) ?? 0);
    total += n;
  }
  for (const n of y.values()) total += n;
  return total ? (2 * both) / total : 1;
}
const SAME_VERSE = 0.85;

async function main() {
  const book = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const old = new Map(book.chapters.map((c) => [Number(c.number), c]));
  const chapters = [];
  const report = [];
  let total = 0;
  let droppedEnglish = 0;

  for (let parva = 1; parva <= 18; parva++) {
    const parsed = await parseParva(parva);
    const prev = old.get(parva);
    if (!prev) throw new Error(`parva ${parva} missing from ${OUT}`);
    // Parvas 1–7 held only hand-picked verses from elsewhere; their meanings do not belong to these numbers.
    const keep = parva >= 8 ? new Map(prev.verses.map((v) => [String(v.number), v])) : new Map();
    const verses = [];
    for (const [key, { speaker, lines }] of parsed) {
      if (!lines.length) throw new Error(`${parva}.${key}: speaker line with no verse`);
      const sanskrit = verseText([...speaker, ...lines]);
      const before = keep.get(key);
      const verse = { ...(before ?? {}), number: key, sanskrit, transliteration: iast(sanskrit) };
      if (before?.translation && similarity(lines.join(' '), before.sanskrit) < SAME_VERSE) {
        delete verse.translation;
        delete verse.translationSource;
        droppedEnglish++;
      }
      verses.push(verse);
    }
    if (verses.length !== COUNTS[parva - 1]) {
      throw new Error(`parva ${parva}: ${verses.length} ślokas, expected ${COUNTS[parva - 1]}`);
    }
    // DharmicData filed the second half of two Anushasana verses (13.33.1, 13.74.1) as "33.1-2" and "74.1-2";
    // the critical edition has them inside the verse.
    const lost = [...keep.keys()].filter((k) => !parsed.has(k) && !parsed.has(k.replace(/-2$/, '')));
    if (lost.length) throw new Error(`parva ${parva}: published verses not in the critical edition: ${lost.slice(0, 5)}`);
    const { verses: _old, ...meta } = prev;
    chapters.push({ ...meta, verses });
    total += verses.length;
    report.push(`  ${String(parva).padStart(2)} ${meta.title}: ${verses.length}`);
  }

  book.chapters = chapters;
  book.totalVerses = total;
  book.totalChapters = chapters.length;
  book.source = {
    ...book.source,
    repo: `https://github.com/vishvAsa/mahAbhAratam/tree/${SHA}/vyAsaH/gretil-mUlam`,
    license:
      'Critical edition, electronic text (C) Bhandarkar Oriental Research Institute, Pune, 1999, from the text entered by Muneo Tokunaga et al., revised by John Smith (GRETIL).',
    fetchedAt: new Date().toISOString(),
  };
  fs.writeFileSync(OUT, JSON.stringify(book));
  console.log(report.join('\n'));
  console.log(`Wrote ${total} ślokas in 18 parvas to ${path.relative(ROOT, OUT)}; English dropped on ${droppedEnglish} re-split verses.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
