/**
 * Replace the Sanskrit of Manusmriti adhyayas 5-10 and 12 with clean mūla from the vishvAsa project's e-texts.
 *
 *   node scripts/seed-manusmriti-mula-5-12.mjs
 *
 * The old Sanskrit of these adhyayas ran verses into each other (a word of the last verse at the start of the next,
 * half-verses repeated) and carried a few verses from other texts. Its Hindi, "science" and "Sense:" notes were OCR
 * junk or copies of the English, and are dropped. Hindi is written afresh in data/written-meanings/manusmriti.json.
 *
 * Sources (vishvAsa/kalpAntaram, branch "content", pinned to SHA), dharmaH/smRtiH/manuH/:
 *   govindarAjaH/05-10,12.md  mūla in `<details><summary>मूलम्</summary>` blocks ending `॥ अ.श्लो ॥`
 *   medhAtithiH/09.md         for 9.72-336 (Govindaraja's commentary on them is lost); mūla in `> **…॥ ९.N ॥**`
 *   bhAruchiH/derrett-pAThaH/09.md  for 9.216, which Medhatithi's text lacks
 * Verses are numbered in reading order. Adhyaya 11 is left as it is (#175 realigned its English).
 *
 * The Bühler English already on each verse is kept and moved with its verse: each new verse takes the English of the
 * old verse whose Sanskrit it most resembles (character trigrams, within eight places). Where nothing resembles it
 * (the old text had another work's verse there) it keeps the English at its own place. The old 8.27 joined 8.27 and
 * 8.28 under 8.28's English, so 8.27 is left for data/written-meanings. Then `npm run shard:scriptures`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { iast } from './lib/vedic-text.mjs';

const OUT = path.join(process.cwd(), 'public/data/scriptures-full/manusmriti.json');
const SHA = 'd6ec9779475d6b5e45cb6db9d830fd08749d87b5';
const BASE = `https://raw.githubusercontent.com/vishvAsa/kalpAntaram/${SHA}/dharmaH/smRtiH/manuH`;
const EXPECTED = { 5: 169, 6: 97, 7: 226, 8: 420, 9: 336, 10: 131, 12: 126 };

const DIGITS = '०१२३४५६७८९';
const toInt = (s) => Number([...s].map((c) => DIGITS.indexOf(c)).join(''));
const tidy = (lines) => lines.map((l) => l.replace(/\\/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);

async function get(file) {
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  // Two verse marks are mistyped in the e-text: `॥ ८। ३७५ ॥` and `॥ ६.६ ।\**`.
  return (await res.text())
    .replace(/॥\s*([०-९]+)\s*।\s*([०-९]+)\s*॥/g, '॥ $1.$2 ॥')
    .replace(/(॥\s*[०-९]+\.[०-९]+\s*)।\\?\*\*/g, '$1॥**');
}

/** Govindaraja: mūla blocks; a number repeated inside one block is a gloss copied after the verse. */
function govindaraja(md) {
  const verses = [];
  for (const [, block] of md.matchAll(/<summary>मूलम्<\/summary>\s*([\s\S]*?)<\/details>/g)) {
    const text = block.replace(/\*\*/g, '').replace(/\[\^\d+\]/g, '');
    let last = null;
    let start = 0;
    for (const m of text.matchAll(/॥\s*([०-९]+)\.([०-९]+)\s*॥/g)) {
      const n = toInt(m[2]);
      const lines = tidy(text.slice(start, m.index).split('\n'));
      start = m.index + m[0].length;
      if (n !== last && lines.length) verses.push({ n, text: `${lines.join('\n')} ॥` });
      last = n;
    }
  }
  return verses;
}

/** Medhatithi and Bharuchi: the mūla is a block quote ending `॥ अ.श्लो ॥`. */
function blockQuoted(md) {
  const verses = [];
  let buf = [];
  for (const raw of md.split('\n')) {
    if (!raw.startsWith('>')) {
      buf = [];
      continue;
    }
    const line = raw.replace(/^>\s*/, '').replace(/\*\*/g, '').replace(/\[\^[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
    if (!line) continue;
    const m = line.match(/॥\s*[०-९]+\.([०-९]+)\s*॥\s*$/);
    if (!m) {
      buf.push(line);
      continue;
    }
    buf.push(line.slice(0, m.index).trim());
    verses.push({ n: toInt(m[1]), text: `${tidy(buf).join('\n')} ॥` });
    buf = [];
  }
  return verses;
}

async function mula(ch) {
  const parsed = govindaraja(await get(`govindarAjaH/${String(ch).padStart(2, '0')}.md`));
  if (ch === 5) {
    // 5.17's first line has a mūla block with no verse mark; its second line is only in the commentary heading.
    const at = parsed.findIndex((v) => v.n === 18);
    if (at !== 16 || parsed[at - 1].n !== 16) throw new Error('5.17: e-text changed');
    parsed.splice(at, 0, {
      n: 17,
      text: 'न भक्षयेद् एकचरान् अज्ञातांश् च मृगद्विजान् ।\nभक्ष्येष्व् अपि समुद्दिष्टान् सर्वान् पञ्चनखांस् तथा ॥',
    });
  }
  const g = parsed.map((v) => v.text);
  if (ch !== 9) return g;
  if (g.length !== 71) throw new Error(`govindaraja 9: ${g.length} verses, expected 71`);
  const medhatithi = blockQuoted(await get('medhAtithiH/09.md'));
  const bharuchi = blockQuoted(await get('bhAruchiH/derrett-pAThaH/09.md'));
  for (let n = 72; n <= 336; n++) {
    const v = medhatithi.find((x) => x.n === n) ?? bharuchi.find((x) => x.n === n);
    if (!v) throw new Error(`9.${n} not found`);
    g.push(v.text);
  }
  return g;
}

const trigrams = (s) => {
  const t = s.replace(/[\s।॥ऽ'\-().0-9०-९]/g, '');
  const set = new Set();
  for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3));
  return set;
};
const likeness = (a, b) => {
  let shared = 0;
  for (const g of a) if (b.has(g)) shared++;
  return shared / Math.max(1, Math.min(a.size, b.size));
};

const book = JSON.parse(fs.readFileSync(OUT, 'utf8'));
for (const [ch, count] of Object.entries(EXPECTED)) {
  const texts = await mula(Number(ch));
  if (texts.length !== count) throw new Error(`adhyaya ${ch}: ${texts.length} verses, expected ${count}`);
  for (const t of texts) {
    const lines = t.split('\n');
    if (lines.length !== 2) throw new Error(`adhyaya ${ch}: odd verse ${t}`);
  }
  const chapter = book.chapters.find((c) => Number(c.number) === Number(ch));
  const old = chapter.verses;
  const oldGrams = old.map((v) => trigrams(v.sanskrit));
  let moved = 0;
  chapter.verses = texts.map((sanskrit, i) => {
    const grams = trigrams(sanskrit);
    let from = i;
    let best = 0;
    for (let j = Math.max(0, i - 8); j < Math.min(old.length, i + 9); j++) {
      const s = likeness(grams, oldGrams[j]);
      if (s > best) [best, from] = [s, j];
    }
    if (best < 0.6) from = i;
    if (ch === '8' && i === 26 && old.length === 419) from = -1;
    if (from !== i) moved++;
    const verse = { number: `${ch}.${i + 1}`, sanskrit, transliteration: iast(sanskrit) };
    const translation = old[from]?.translation;
    if (translation) verse.translation = translation;
    return verse;
  });
  console.log(`adhyaya ${ch}: ${texts.length} verses (was ${old.length}), English moved for ${moved}`);
}
// Adhyaya 11 keeps its Sanskrit, but its Hindi and "science" are the same OCR junk and its notes "Sense:" copies.
// Its written Hindi comes from data/written-meanings.
for (const v of book.chapters.find((c) => Number(c.number) === 11).verses) {
  delete v.science;
  delete v.hindi;
  for (const f of ['commentary', 'wordMeaning']) if (/^Sense: /.test(v[f] ?? '')) delete v[f];
}

book.source = {
  ...book.source,
  adhyayas5to12Repo: `https://github.com/vishvAsa/kalpAntaram/tree/${SHA}/dharmaH/smRtiH/manuH`,
  adhyayas5to12License: 'Sanskrit mūla — public domain. E-texts of Govindaraja, Medhatithi and Bharuchi by the vishvAsa project.',
};
book.totalVerses = book.chapters.reduce((n, c) => n + c.verses.length, 0);
const pretty = fs.readFileSync(OUT, 'utf8').includes('\n  ');
fs.writeFileSync(OUT, pretty ? `${JSON.stringify(book, null, 2)}\n` : JSON.stringify(book));
console.log(`manusmriti: ${book.totalVerses} verses`);
