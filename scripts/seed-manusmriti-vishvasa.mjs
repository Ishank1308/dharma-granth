/**
 * Fill Manusmriti adhyayas 1-4 with their full Sanskrit (119, 249, 286 and 260 verses) from the vishvAsa project's
 * e-text of Govindaraja's commentary, which prints the mūla of each verse before the commentary.
 *
 *   node scripts/seed-manusmriti-vishvasa.mjs
 *
 * Source: vishvAsa/kalpAntaram (branch "content"), dharmaH/smRtiH/manuH/govindarAjaH/0N.md, pinned to SHA. Each verse
 * sits in a `<details><summary>मूलम्</summary>` block ending `॥ अ.श्लो ॥`; a block can hold several verses. Only the
 * mūla is used, never the commentary. A number repeated inside one block is a gloss copied after the verse and is
 * left out, and verses are numbered in reading order (the e-text labels 3.113 and 4.99 as 3.112 and 4.98).
 *
 * These four adhyayas held twelve hand-picked verses (several not from the Manusmriti at all), which publishing hid
 * as filler. They are replaced. Verse numbers are "adhyaya.shloka" as in adhyayas 5-12. Then `npm run shard:scriptures`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { iast } from './lib/vedic-text.mjs';

const OUT = path.join(process.cwd(), 'public/data/scriptures-full/manusmriti.json');
const SHA = 'd6ec9779475d6b5e45cb6db9d830fd08749d87b5';
const BASE = `https://raw.githubusercontent.com/vishvAsa/kalpAntaram/${SHA}/dharmaH/smRtiH/manuH/govindarAjaH`;
const EXPECTED = { 1: 119, 2: 249, 3: 286, 4: 260 };

const DIGITS = '०१२३४५६७८९';
const toInt = (s) => Number([...s].map((c) => DIGITS.indexOf(c)).join(''));

function parse(md) {
  const verses = [];
  for (const [, block] of md.matchAll(/<summary>मूलम्<\/summary>\s*([\s\S]*?)<\/details>/g)) {
    const text = block.replace(/\*\*/g, '').replace(/\[\^\d+\]/g, '');
    let last = null;
    let start = 0;
    for (const m of text.matchAll(/॥\s*([०-९]+)\.([०-९]+)\s*॥/g)) {
      const n = toInt(m[2]);
      const lines = text
        .slice(start, m.index)
        .split('\n')
        .map((l) => l.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
      start = m.index + m[0].length;
      if (n !== last && lines.length) verses.push(`${lines.join('\n')} ॥`);
      last = n;
    }
  }
  return verses;
}

const book = JSON.parse(fs.readFileSync(OUT, 'utf8'));
for (const [ch, count] of Object.entries(EXPECTED)) {
  const res = await fetch(`${BASE}/0${ch}.md`);
  if (!res.ok) throw new Error(`adhyaya ${ch}: HTTP ${res.status}`);
  const texts = parse(await res.text());
  if (texts.length !== count) throw new Error(`adhyaya ${ch}: ${texts.length} verses, expected ${count}`);
  for (const t of texts) {
    const lines = t.split('\n');
    if (lines.length !== 2 || !lines[0].includes('।')) throw new Error(`adhyaya ${ch}: odd verse ${t}`);
  }
  const chapter = book.chapters.find((c) => Number(c.number) === Number(ch));
  chapter.verses = texts.map((sanskrit, i) => ({ number: `${ch}.${i + 1}`, sanskrit, transliteration: iast(sanskrit) }));
  console.log(`adhyaya ${ch}: ${texts.length} verses`);
}
// Adhyaya 11: the Sanskrit lacks Bühler's 11.52 ("the stealer of a lamp will become blind"), so from there on each
// English verse sat one verse too early. Move every English from 11.53 onward back one verse and drop the one with no
// Sanskrit; 11.265, Bühler's 11.266, is left for data/written-meanings. Runs once: it checks for the stray verse.
{
  const verses = book.chapters.find((c) => Number(c.number) === 11).verses;
  const at = verses.findIndex((v) => v.number === '11.52');
  if (at > 0 && /^The stealer of a lamp/.test(verses[at].translation ?? '')) {
    for (let i = at; i < verses.length; i++) {
      const next = verses[i + 1];
      if (next?.translation) verses[i].translation = next.translation;
      else delete verses[i].translation;
      // Notes generated from the shifted English ("Sense: …") went with the wrong verse.
      for (const f of ['commentary', 'wordMeaning']) if (/^Sense: /.test(verses[i][f] ?? '')) delete verses[i][f];
    }
    console.log(`adhyaya 11: English realigned from 11.52 (${verses.length - at} verses)`);
  }
}

book.source = {
  ...book.source,
  adhyayas1to4Repo: `https://github.com/vishvAsa/kalpAntaram/tree/${SHA}/dharmaH/smRtiH/manuH/govindarAjaH`,
  adhyayas1to4License: 'Sanskrit mūla — public domain. E-text by the vishvAsa project.',
};
book.totalVerses = book.chapters.reduce((n, c) => n + c.verses.length, 0);
const pretty = fs.readFileSync(OUT, 'utf8').includes('\n  ');
fs.writeFileSync(OUT, pretty ? `${JSON.stringify(book, null, 2)}\n` : JSON.stringify(book));
console.log(`manusmriti: ${book.totalVerses} verses`);
