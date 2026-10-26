/**
 * Publish the Atharva Veda (Śaunaka Saṃhitā) from the DharmicData Sanskrit text.
 *
 *   node scripts/seed-atharvaveda.mjs                 # fetch the twenty kāṇḍa files
 *   node scripts/seed-atharvaveda.mjs --from <dir>    # read atharvaveda_kaanda_N.json from a local folder
 *   node scripts/seed-atharvaveda.mjs --write-counts  # after a reviewed change, record the hymn verse counts
 *
 * Output: public/data/scriptures-full/atharvaveda.json (then `npm run shard:scriptures`).
 *
 * Each kāṇḍa is a library chapter and each verse is numbered "sūkta.mantra", so AV 12.1.12 is chapter 12,
 * verse 1.12. Nothing is written unless every hymn's numbering is consistent (see checkNumbering) and its
 * verse count equals data/atharvaveda-hymn-verses.json.
 *
 * How the source marks verses:
 *   - a mantra ends with ॥n॥ (sometimes n॥, or ।।n।।); headings (seer, deity, metre, paryāya titles)
 *     carry no accent marks and are dropped;
 *   - in the prose paryāya hymns a verse is several sentences numbered ॥1॥…॥k॥ and closed by the verse
 *     number: ॥7॥ 32॥ (11.3) or ॥4॥ 5। 2 (16.8, where 2 is the verse);
 *   - a bare ॥ ends a verse only where a number is plainly missing (11.7.2); elsewhere it ends a line
 *     inside a verse (6.139.1);
 *   - hymn 4.12 is stored twice, and 13.4 is split into 13.4–13.9 by paryāya.
 * Hymns 20.3 and 20.13 have no text in the source, so they are not published.
 *
 * Translations: none yet. The earlier English (Griffith) and Hindi were attached to the wrong verses,
 * so they are not carried over; a verse-by-verse realignment is the next step.
 */
import fs from 'node:fs';
import path from 'node:path';
import { ACCENT, iast, letters, tidy, verseText } from './lib/vedic-text.mjs';

const ROOT = process.cwd();
const BASE = 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/AtharvaVeda';
const OUT = path.join(ROOT, 'public/data/scriptures-full/atharvaveda.json');
const COUNTS_FILE = path.join(ROOT, 'data/atharvaveda-hymn-verses.json');
/** Hymns with no text in the source. */
const MISSING = new Set(['20.3', '20.13']);
/** Source hymns that are paryāyas of an earlier hymn: 13.5–13.9 continue 13.4. */
const CONTINUES = { '13.5': '13.4', '13.6': '13.4', '13.7': '13.4', '13.8': '13.4', '13.9': '13.4' };

const ORDINALS = [
  'प्रथम', 'द्वितीय', 'तृतीय', 'चतुर्थ', 'पञ्चम', 'षष्ठ', 'सप्तम', 'अष्टम', 'नवम', 'दशम',
  'एकादश', 'द्वादश', 'त्रयोदश', 'चतुर्दश', 'पञ्चदश', 'षोडश', 'सप्तदश', 'अष्टादश', 'एकोनविंश', 'विंश',
];

const D = '०-९';
const num = (s) => Number(String(s).replace(/[०-९]/g, (d) => '०१२३४५६७८९'.indexOf(d)));
/**
 * A numbered verse end. Groups: 1 the number in ॥n॥ (or 4 in n॥); 2 a closing verse number written ॥k॥ N॥;
 * 3 a closing verse number written ॥k॥ N। P (P is the verse).
 */
const TERM = new RegExp(
  `॥\\s*([${D}]+)\\s*॥?(?:[ \\t]*([${D}]+)[ \\t]*॥|[ \\t]*[${D}]+[ \\t]*।[ \\t]*([${D}]+)|[ \\t]*[${D}]+[ \\t]*।?)?|([${D}]+)\\s*॥`,
  'g',
);
const BARE = /॥[ \t]*(?=\n|$)/;

async function readKanda(n, from) {
  const name = `atharvaveda_kaanda_${n}.json`;
  if (from) return JSON.parse(fs.readFileSync(path.join(from, name), 'utf8'));
  const res = await fetch(`${BASE}/${name}`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  return res.json();
}

/** A hymn's mantra lines: accented lines, without the headings. */
function hymnBody(text) {
  let lines = text.replace(/।।/g, '॥').split('\n').filter((l) => l.trim());
  // 4.12 is stored twice in a row: keep the first copy.
  const again = lines.indexOf(lines[0], 1);
  if (again > 0) lines = lines.slice(0, again);
  return lines.filter((l) => ACCENT.test(l)).join('\n');
}

/**
 * The hymn's verses, each a list of lines, plus any numbering problems.
 * Pieces between numbered ends are sentences; sentences closed by a verse number (॥k॥ N॥) are one verse,
 * and otherwise each numbered piece is a verse.
 */
function splitHymn(body) {
  const pieces = [];
  let at = 0;
  for (const m of body.matchAll(TERM)) {
    pieces.push({ text: body.slice(at, m.index), n: num(m[1] ?? m[4]), closes: m[2] ?? m[3] ? num(m[2] ?? m[3]) : null, prose: m[3] != null });
    at = m.index + m[0].length;
  }
  const tail = body.slice(at);
  if (letters(tail)) pieces.push({ text: tail, n: (pieces.at(-1)?.n ?? 0) + 1, closes: null });

  // A bare ॥ ends a verse only where the numbering skips one (…॥1॥ a ॥ b ॥3॥).
  const expanded = [];
  for (const p of pieces) {
    const prev = expanded.at(-1)?.n ?? 0;
    const bare = p.text.split(BARE);
    if (p.n === prev + 2 && bare.length === 2 && letters(bare[0]) && letters(bare[1])) {
      expanded.push({ text: bare[0], n: prev + 1, closes: null }, { ...p, text: bare[1] });
    } else expanded.push(p);
  }

  const problems = [];
  const verses = [];
  // The number of the last verse, as the source wrote it, to check that each verse follows on.
  let last = 0;
  // Sentences that may still turn out to be one prose verse, if a closing verse number follows.
  let pending = [];
  const single = (p) => {
    // 15.6 numbers its last verse 26 twice; any other repeat or gap is an error.
    const n = p.n === last && p === expanded.at(-1) ? last + 1 : p.n;
    if (n !== last + 1 && n !== 1) problems.push(`verse ${n} follows ${last}`);
    verses.push(lines(p.text));
    last = n;
  };
  const flush = () => {
    pending.forEach(single);
    pending = [];
  };
  for (const p of expanded) {
    if (p.n === 1 && pending.length) flush();
    if (p.closes == null) {
      pending.push(p);
    } else if (!p.prose && p.n === last + pending.length + 1) {
      // ॥36॥1॥ (10.5): the hymn's verse number followed by the paryāya's own. The sentences before it were
      // verses too.
      flush();
      single(p);
    } else {
      // ॥7॥ 32॥ (11.3), ॥4॥ 5। 2 (16.8): sentences 1…k close verse 32 (or 2). A sentence may lack its number.
      if (p.closes !== last + 1) problems.push(`verse ${p.closes} follows ${last}`);
      verses.push([...pending, p].flatMap((x) => lines(x.text)));
      last = p.closes;
      pending = [];
    }
  }
  flush();
  return { verses: verses.filter((v) => v.length), problems };
}

function lines(text) {
  // The source sometimes runs a danda into the word before it (पृथि॒व्याः।).
  return text.split('\n').map((l) => tidy(l.replace(/[ \t]+/g, ' ').trim()).replace(/(?<=[^\s।])।/g, ' ।')).filter((l) => letters(l));
}

async function main() {
  const args = process.argv.slice(2);
  const from = args.includes('--from') ? args[args.indexOf('--from') + 1] : null;
  const writeCounts = args.includes('--write-counts');
  const counts = writeCounts ? null : JSON.parse(fs.readFileSync(COUNTS_FILE, 'utf8')).kandas;
  const problems = [];
  const chapters = [];
  const found = [];
  let total = 0;

  for (let k = 1; k <= 20; k++) {
    const hymns = new Map();
    for (const item of await readKanda(k, from)) {
      const ref = `${k}.${item.sukta}`;
      const target = CONTINUES[ref] ?? ref;
      const body = hymnBody(item.text);
      if (!letters(body)) {
        if (!MISSING.has(ref)) problems.push(`${ref}: no text in the source`);
        continue;
      }
      hymns.set(target, `${hymns.get(target) ?? ''}${hymns.has(target) ? '\n' : ''}${body}`);
    }
    const verses = [];
    const kandaCounts = [];
    for (const [ref, body] of [...hymns].sort((a, b) => Number(a[0].split('.')[1]) - Number(b[0].split('.')[1]))) {
      const h = Number(ref.split('.')[1]);
      const split = splitHymn(body);
      // 13.4 continues its numbering across the source's split, so a restart there is the next paryāya.
      for (const p of split.problems) problems.push(`${ref}: ${p}`);
      kandaCounts[h - 1] = split.verses.length;
      const want = counts?.[k - 1]?.[h - 1];
      if (counts && want !== split.verses.length) problems.push(`${ref}: ${split.verses.length} verses, expected ${want}`);
      split.verses.forEach((ls, i) => {
        const sanskrit = verseText(ls);
        verses.push({ number: `${h}.${i + 1}`, sanskrit, transliteration: iast(sanskrit) });
      });
    }
    found.push(Array.from(kandaCounts, (c) => c ?? 0));
    chapters.push({ number: k, title: `Kanda ${k}`, titleSanskrit: `${ORDINALS[k - 1]} काण्ड`, verses });
    total += verses.length;
  }

  if (problems.length) {
    console.error(`✗ seed-atharvaveda: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
    process.exit(1);
  }
  if (writeCounts) {
    const note =
      'Verses per hymn (sūkta) of the Atharva Veda, Śaunaka recension, as scripts/seed-atharvaveda.mjs reads the DharmicData text. ' +
      'kandas[k-1][h-1] is the verse count of hymn k.h; 0 marks a hymn missing from the source (20.3, 20.13). ' +
      'Regenerate with --write-counts only after reviewing a change in the source.';
    const body = JSON.stringify({ note, kandas: found }, null, 2).replace(/\[\s+([\d,\s]+?)\s+\]/g, (_, xs) => `[${xs.replace(/\s+/g, '').replace(/,/g, ', ')}]`);
    fs.writeFileSync(COUNTS_FILE, `${body}\n`);
    console.log(`wrote ${path.relative(ROOT, COUNTS_FILE)}`);
  }

  const scripture = {
    id: 'atharvaveda',
    title: 'Atharva Veda',
    titleSanskrit: 'अथर्ववेद',
    category: 'veda',
    source: {
      repo: 'https://github.com/bhavykhatri/DharmicData',
      license: 'Sanskrit mula text - public domain. Verify any translations separately.',
      fetchedAt: new Date().toISOString(),
      note: 'Śaunaka Saṃhitā with svara marks. Hymns 20.3 and 20.13 are missing from the source.',
    },
    totalVerses: total,
    totalChapters: chapters.length,
    chapters,
  };
  fs.writeFileSync(OUT, JSON.stringify(scripture, null, 2) + '\n');
  console.log(`✓ seed-atharvaveda: ${total} verses in ${chapters.length} kandas → ${path.relative(ROOT, OUT)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
