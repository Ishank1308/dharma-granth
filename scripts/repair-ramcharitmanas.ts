/**
 * Repairs the Ramcharitmanas records, which were parsed half a unit out of step:
 * each record's "sanskrit" held the second half of one unit followed by the Gita Press Hindi prose, and its
 * "hindi" / "translation" held the first half of the NEXT unit's verse (Awadhi, not a translation).
 *
 *   npx tsx scripts/repair-ramcharitmanas.ts            # dry run: counts and samples, writes nothing
 *   npx tsx scripts/repair-ramcharitmanas.ts --write    # applies the repair
 *
 * For each record: original = the first half carried in the previous record's "hindi" + this record's verse
 * segments (cut at each "॥", taken until the first segment that reads as modern Hindi prose); the prose after it
 * is the Hindi translation. Kāṇḍa headers ("श्रीजानकीवल्लभो विजयते … सोपान") are dropped.
 *
 * The Gita Press Hindi translation is NOT published: its license is unverified (the standard Gita Press tīkā is
 * by Hanuman Prasad Poddar, d. 1971). It is saved to data/pending/ramcharitmanas-hindi.json so it can be restored
 * once confirmed. With --write this updates public/data/scriptures-full/ramcharitmanas.json and the mirrored
 * data/scriptures/ramcharitmanas.ts. The original text is canonical: re-baseline with
 * `npx tsx scripts/check-canonical-integrity.ts --update` in the same commit, after review.
 */
import fs from 'node:fs';
import path from 'node:path';
import Sanscript from '@indic-transliteration/sanscript';
import { ramcharitmanas } from '../data/scriptures/ramcharitmanas';

const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'public/data/scriptures-full/ramcharitmanas.json');
const TS_PATH = path.join(ROOT, 'data/scriptures/ramcharitmanas.ts');
const PENDING = path.join(ROOT, 'data/pending/ramcharitmanas-hindi.json');
const write = process.argv.includes('--write');

const HEADER = /^\s*श्रीजानकीवल्लभो विजयते\s+श्रीरामचरितमानस\s+\S+\s+सोपान\s+(?:श्लोक|मङ्गलाचरण)?\s*/;
const SEG = /॥(?:\s*[०-९0-9]+\s*॥)?/g;
// Words of modern Hindi prose. "आप" and "मैं" are left out: Tulsidas uses both (2:8 "आप अछत जुबराज पद…").
const PROSE = /[([]|(?:^|\s)(?:है|हैं|था|थे|थी|करते|करता|करती|होता|होते|होती|जाता|जाते|जाती|गये|गयी|गया|लिये|लिया|दिया|किया|वाले|वाली|वाला|जिनके|जिनकी|जिनसे|जिसने|उन्होंने|अपने|अपनी|हुए|हुई|रहे|रही)(?=[\s,;।॥]|$)/;
// Modern Hindi prose uses several of these; no verse line in this text uses more than one (checked in the dry run).
const FUNC = /(?:^|\s)(और|को|से|में|का|की|के|ने|कि|यह|वह|उसे|उससे|तो)(?=[\s,;।॥!]|$)/g;
// Distinctly modern Hindi forms: polite imperatives in -िये (Tulsidas writes -िअ / -ै), futures in -ूँगा / -ेंगे,
// and the speech dash "कहा—". Needed where the prose has few loose function words (4:28 "सुग्रीवने कहा—…").
const MODERN = /कहा—|\S+िये(?=[\s,;।॥!]|$)|\S+ूँगा(?=[\s,;।॥!]|$)|\S+ेंगे(?=[\s,;।॥!]|$)/;
const isProse = (seg: string) => PROSE.test(seg) || MODERN.test(seg) || (seg.match(FUNC) ?? []).length >= 2;
const toIast = (deva: string) => Sanscript.t(deva, 'devanagari', 'iast').replace(/~/g, 'm̐').replace(/।/g, '|').replace(/॥/g, '||');

interface Verse { number: number | string; sanskrit?: string; transliteration?: string; translation?: string; hindi?: string; commentary?: string; wordMeaning?: string; [k: string]: unknown }
const raw = fs.readFileSync(JSON_PATH, 'utf8');
const doc = JSON.parse(raw) as { chapters: { number: number; verses: Verse[] }[] };

const pending: Record<string, { original: string; hindi: string }> = {};
const problems: string[] = [];
let repaired = 0;
let droppedHalves = 0;
const samples: string[] = [];

for (const ch of doc.chapters) {
  let carry: string | null = null;
  for (const v of ch.verses) {
    let sk = (v.sanskrit ?? '').replace(/\s+/g, ' ').trim();
    const h = HEADER.exec(sk);
    if (h) sk = sk.slice(h[0].length);
    const segs: string[] = [];
    let from = 0;
    let m: RegExpExecArray | null;
    SEG.lastIndex = 0;
    while ((m = SEG.exec(sk))) {
      segs.push(sk.slice(from, m.index + m[0].length).trim());
      from = m.index + m[0].length;
    }
    if (from < sk.length) segs.push(sk.slice(from).trim());
    let k = 0;
    while (k < segs.length && !isProse(segs[k])) k++;
    // Structural rule, independent of vocabulary: in dohās and ślokas the verse number closes the verse and then its
    // translation ("॥ १॥ … ॥ १॥"), so everything up to the first of a repeated number is verse.
    const numOf = (s: string) => /॥\s*([०-९0-9]+)\s*॥\s*$/.exec(s)?.[1];
    const firstNum = segs.findIndex((s) => numOf(s) !== undefined);
    if (firstNum >= 0 && segs.slice(firstNum + 1).some((s) => numOf(s) === numOf(segs[firstNum]))) k = Math.max(k, firstNum + 1);
    const own = segs.slice(0, k).join(' ');
    const hindi = segs.slice(k).join(' ').replace(/॥\s*[०-९0-9]+\s*॥\s*$/, '').replace(/॥\s*$/, '').trim();
    const original = [carry, own].filter(Boolean).join(' ').trim();
    const key = `${ch.number}:${v.number}`;
    // A record may hold only prose when its whole verse line arrived as the carried half (e.g. 1:24).
    if (!original) problems.push(`${key}: no verse text at all`);
    if (!hindi) problems.push(`${key}: no Hindi prose found`);
    if (segs.slice(0, k).some(isProse)) problems.push(`${key}: prose inside the original`);
    // Independent check: the translation must not open with a short line closed by a verse number repeated later
    // (that would be a verse line misread as prose).
    const firstTrans = segs[k] ?? '';
    if (numOf(firstTrans) && segs.slice(k + 1).some((s) => numOf(s) === numOf(firstTrans)) && firstTrans.length < 160) {
      problems.push(`${key}: translation starts with what looks like a verse line: ${firstTrans.slice(0, 60)}`);
    }
    if (samples.length < 3) samples.push(`${key}\n  was: ${(v.sanskrit ?? '').replace(/\s+/g, ' ').slice(0, 110)}\n  now: ${original.slice(0, 110)}`);
    pending[key] = { original, hindi };
    carry = (v.hindi ?? '').trim() || null;
    v.sanskrit = original;
    v.transliteration = toIast(original);
    // The "hindi" and "translation" fields held the next unit's verse, not a meaning.
    delete v.hindi;
    delete v.translation;
    if (v.wordMeaning && v.wordMeaning === v.commentary) delete v.wordMeaning;
    repaired++;
  }
  // The last record's "hindi" is the first half of a unit that is not in the data.
  if (carry) droppedHalves++;
}

console.log(`ramcharitmanas: ${repaired} records reassembled; ${droppedHalves} trailing half-lines with no unit in the data; problems: ${problems.length}`);
for (const s of samples) console.log(s);
for (const p of problems) console.error('  ' + p);
if (problems.length) {
  console.error('Nothing written.');
  process.exit(1);
}
if (!write) {
  console.log('Dry run: nothing written. Re-run with --write to apply.');
  process.exit(0);
}

const crlf = raw.includes('\r\n');
const pretty = raw.startsWith('{\n') || raw.startsWith('{\r\n');
let out = JSON.stringify(doc, null, pretty ? 2 : undefined) + (/\r?\n$/.test(raw) ? '\n' : '');
fs.writeFileSync(JSON_PATH, crlf ? out.replace(/\n/g, '\r\n') : out);

// Mirror into the curated module: keep chapter titles and summaries, take verses from the repaired data.
const ts = fs.readFileSync(TS_PATH, 'utf8');
const nl = ts.includes('\r\n') ? '\r\n' : '\n';
const chapters = ramcharitmanas.chapters.map((c) => {
  const src = doc.chapters.find((x) => x.number === c.id);
  return {
    ...c,
    verses: c.verses.map((cv) => {
      const v = src?.verses.find((x) => String(x.number) === String(cv.number ?? cv.id));
      if (!v) return cv;
      // The curated type requires translation and explanation; there is no translation yet.
      const { hindi: _h, ...rest } = cv as typeof cv & { hindi?: string };
      void _h;
      return { ...rest, sanskrit: v.sanskrit as string, transliteration: v.transliteration as string, translation: '' };
    }),
  };
});
const start = ts.indexOf('  chapters: [');
if (start < 0) throw new Error('data/scriptures/ramcharitmanas.ts: no "chapters: [" line');
const body = `  chapters: ${JSON.stringify(chapters, null, 2).replace(/\n/g, '\n  ')}\n};\n`;
fs.writeFileSync(TS_PATH, (ts.slice(0, start) + body).replace(/\r?\n/g, nl));

fs.mkdirSync(path.dirname(PENDING), { recursive: true });
fs.writeFileSync(
  PENDING,
  JSON.stringify(
    {
      note: 'Gita Press Hindi translation separated from the Ramcharitmanas records by scripts/repair-ramcharitmanas.ts. NOT published: license unverified (the standard Gita Press tika is by Hanuman Prasad Poddar, d. 1971). Restore to the "hindi" field only after the license is confirmed.',
      keyFormat: 'kanda:record',
      entries: pending,
    },
    null,
    2,
  ) + '\n',
);
console.log('wrote public/data/scriptures-full/ramcharitmanas.json, data/scriptures/ramcharitmanas.ts, data/pending/ramcharitmanas-hindi.json');
