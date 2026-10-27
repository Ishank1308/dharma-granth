// Puts Gita Press Hindi from the extracted sample files (scripts/*_extracted.json) back on verses that have none.
//
//   node scripts/refill-hindi-from-extracted.mjs [--dry]
//
// The extracts hold only the first 25-35 verses of each parva/skandha, and many of their Hindi entries are shifted
// onto the wrong shloka, so nothing is taken on trust. A verse is filled only when all of these hold:
//   - its Sanskrit matches exactly one book verse (3-gram Jaccard >= 0.6 and >= 0.15 above the next candidate);
//   - the Hindi carries exactly one printed verse number (॥ N॥), it ends the text, and it equals the book verse number;
//   - the Hindi is Hindi (common Hindi function words, low Sanskrit overlap), not a copy of the shloka;
//   - the book verse has no Hindi and does not point to a range paragraph.
// Clean-up is mechanical only: the trailing ॥ N॥ and footnote digits are removed. Every filled verse goes into the
// review queue (data/ocr-hindi-review.json) and stays withheld until proofread, like the other printed-edition refills.
// Provenance per verse is written to data/refill/<id>-extracted-gitapress-<date>.json. Sanskrit is never changed.
import fs from 'node:fs';

const DATE = '2026-10-27';
const DRY = process.argv.includes('--dry');
const BOOKS = [
  { id: 'harivanshpuran', extract: 'scripts/harivansh_extracted.json', edition: 'Gita Press Gorakhpur, हरिवंशपुराण (सानुवाद), book code 38' },
  { id: 'bhagavatapurana', extract: 'scripts/bhagavata_extracted.json', edition: 'Gita Press Gorakhpur, श्रीमद्भागवतमहापुराण (सानुवाद)' },
  { id: 'devibhagavat', extract: 'scripts/devibhagavat_extracted.json', edition: 'Gita Press Gorakhpur, श्रीमद्देवीभागवतमहापुराण (सचित्र, सरल हिन्दी-व्याख्यासहित)' },
];

const DIGITS = { '०': 0, '१': 1, '२': 2, '३': 3, '४': 4, '५': 5, '६': 6, '७': 7, '८': 8, '९': 9 };
const toInt = (s) => Number([...s].map((c) => (c in DIGITS ? DIGITS[c] : c)).join(''));
const HINDI_WORDS = /(है|हैं|था|थे|थी|करते|किया|के|की|को|में|से|ने)/;

function norm(s) {
  return (s || '').replace(/\[[^\]]*\]/g, '').replace(/[॥।|\d०-९\s.\-:ः,;‘’'"()]/g, '');
}
function grams(s) {
  const t = norm(s);
  const g = new Set();
  for (let i = 0; i + 3 <= t.length; i++) g.add(t.slice(i, i + 3));
  return g;
}
function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / Math.max(1, a.size + b.size - inter);
}
const round = (x) => Math.round(x * 1000) / 1000;

const reviewPath = 'data/ocr-hindi-review.json';
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
const reviewKeys = new Set(review.entries.map((e) => `${e.scriptureId}:${e.chapter}:${e.verse}`));

for (const book of BOOKS) {
  const bookPath = `public/data/scriptures-full/${book.id}.json`;
  const data = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
  const extract = JSON.parse(fs.readFileSync(book.extract, 'utf8'));
  const queue = `${book.id}-extracted-gitapress-${DATE}`;

  const flat = [];
  for (const ch of data.chapters) for (const v of ch.verses) flat.push({ ch, v, g: grams(v.sanskrit) });
  const index = new Map();
  flat.forEach(({ g }, i) => {
    for (const x of g) {
      if (!index.has(x)) index.set(x, []);
      index.get(x).push(i);
    }
  });

  const counts = { extractVerses: 0, lackingHindiBefore: 0, filled: 0, skipped: {} };
  const skip = (why) => (counts.skipped[why] = (counts.skipped[why] || 0) + 1);
  for (const { v } of flat) if (!v.hindi && !v.hindiSeeVerse) counts.lackingHindiBefore++;
  const verses = {};

  for (const [part, list] of Object.entries(extract)) {
    for (const ev of list) {
      counts.extractVerses++;
      const g = grams(ev.sanskrit);
      const hits = new Map();
      for (const x of g) for (const i of index.get(x) || []) hits.set(i, (hits.get(i) || 0) + 1);
      const ranked = [...hits.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map(([i]) => [jaccard(g, flat[i].g), i])
        .sort((a, b) => b[0] - a[0]);
      if (!ranked.length) { skip('no Sanskrit match'); continue; }
      const [score, i] = ranked[0];
      const next = ranked[1] ? ranked[1][0] : 0;
      if (score < 0.6 || score - next < 0.15) { skip('Sanskrit match weak or ambiguous'); continue; }
      const { ch, v } = flat[i];
      if (v.hindi || v.hindiSeeVerse) { skip('verse already has Hindi'); continue; }
      const raw = (ev.hindi || '').trim();
      const nums = [...raw.matchAll(/॥\s*([०-९0-9]+)\s*॥/g)].map((m) => toInt(m[1]));
      if (nums.length !== 1 || !/॥\s*[०-९0-9]+\s*॥$/.test(raw) || nums[0] !== Number(String(v.number).split('-')[0])) {
        skip('printed verse number missing or not this verse'); continue;
      }
      if (!HINDI_WORDS.test(raw) || jaccard(grams(raw), g) >= 0.3) { skip('not Hindi prose'); continue; }
      const key = `${book.id}:${ch.number}:${String(v.number)}`;
      if (reviewKeys.has(key)) { skip('already in review queue'); continue; }

      const hindi = raw
        .replace(/\s*॥\s*[०-९0-9]+\s*॥$/, '')
        .replace(/([ऀ-ॿ])\d+/g, '$1')
        .trim();
      v.hindi = hindi;
      reviewKeys.add(key);
      review.entries.push({ scriptureId: book.id, chapter: ch.number, verse: String(v.number), queue });
      verses[`${ch.number}:${v.number}`] = { extractPart: part, extractNumber: ev.number, sanskritScore: round(score), nextScore: round(next) };
      counts.filled++;
    }
  }

  console.log(book.id, JSON.stringify(counts));
  if (DRY || !counts.filled) continue;
  fs.writeFileSync(bookPath, JSON.stringify(data, null, 2) + '\n');
  fs.writeFileSync(
    `data/refill/${queue}.json`,
    JSON.stringify(
      {
        note: `${data.title}: Hindi put back on verses that had none, from the extracted Gita Press sample in ${book.extract}, matched by Sanskrit content and the printed verse number. Mechanical clean-up only. Every entry is in data/ocr-hindi-review.json under this queue and is withheld until proofread against the printed page.`,
        source: { edition: book.edition, text: `${book.extract} (first verses of each part, extracted from the Gita Press e-book); built by scripts/refill-hindi-from-extracted.mjs` },
        guards: [
          'Sanskrit 3-gram Jaccard >= 0.6 and >= 0.15 above the next book verse',
          'exactly one printed verse number (॥ N॥), at the end of the Hindi, equal to the book verse number',
          'Hindi function words present and Sanskrit 3-gram overlap < 0.3 (not a copy of the shloka)',
          'book verse had no Hindi and no hindiSeeVerse',
        ],
        counts,
        verses,
      },
      null,
      2,
    ) + '\n',
  );
}

if (!DRY) fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2) + '\n');
