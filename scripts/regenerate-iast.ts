/**
 * Regenerates a scripture's IAST transliteration from its stored Devanagari, only for verses whose stored
 * transliteration is not IAST (for example raw ITRANS or Harvard-Kyoto with markers such as `{\m+}`).
 *
 *   npx tsx scripts/regenerate-iast.ts <id>            # dry run: counts and samples, writes nothing
 *   npx tsx scripts/regenerate-iast.ts <id> --write    # updates public/data/scriptures-full/<id>.json
 *   add --skip-refused to write the rest when a few verses convert to non-IAST characters; those keep their
 *   stored transliteration and are listed for review.
 *
 * The Devanagari is never changed. The conversion is mechanical (the same Sanscript call rebuild-upanishads.ts
 * uses). It refuses to write if any converted line contains characters outside the IAST set, so nothing odd is
 * written silently. Transliteration is a canonical field: after --write, re-baseline the canonical manifest with
 * `npx tsx scripts/check-canonical-integrity.ts --update` in the same commit, after review.
 */
import fs from 'node:fs';
import path from 'node:path';
import Sanscript from '@indic-transliteration/sanscript';

const [id, ...flags] = process.argv.slice(2);
if (!id) {
  console.error('usage: npx tsx scripts/regenerate-iast.ts <id> [--write] [--skip-refused]');
  process.exit(1);
}
const write = flags.includes('--write');
const skipRefused = flags.includes('--skip-refused');
const file = path.resolve(__dirname, '..', 'public/data/scriptures-full', `${id}.json`);
const raw = fs.readFileSync(file, 'utf8');
const doc = JSON.parse(raw) as { chapters: { number: number; verses: { number: number | string; sanskrit?: string; transliteration?: string }[] }[] };

/** Signs of a non-IAST romanization: ITRANS braces, internal capitals (aNi, sarvaM), ITRANS vowels (R^i), dot-avagraha. */
const NOT_IAST = /\{\\|[a-z][A-Z]|\b[a-z]*[A-Z]\b|R\^i|\.a[A-Za-z]|~N|\bOM\b/;
/** Characters allowed in the output: IAST letters, punctuation used in the data, digits and spaces. */
const IAST_OK = /^[a-zāīūṛṝḷḹēōṃḥṅñṭḍṇśṣm̐'’|.,;:!?()\-\s0-9०-९]*$/i;

const toIast = (deva: string) =>
  Sanscript.t(deva, 'devanagari', 'iast')
    .replace(/~/g, 'm̐') // Sanscript writes chandrabindu as '~'; IAST uses m̐
    .replace(/।/g, '|')
    .replace(/॥/g, '||');

let changed = 0;
let skippedOk = 0;
const rejects: string[] = [];
const samples: string[] = [];
for (const ch of doc.chapters) {
  for (const v of ch.verses) {
    const t = v.transliteration ?? '';
    if (!v.sanskrit || !NOT_IAST.test(t)) {
      skippedOk++;
      continue;
    }
    const next = toIast(v.sanskrit).replace(/\s+/g, ' ').trim();
    if (!IAST_OK.test(next)) {
      rejects.push(`${ch.number}:${v.number} → ${next.replace(IAST_OK, '').slice(0, 60)} | ${[...new Set(next.replace(/[a-zāīūṛṝḷḹēōṃḥṅñṭḍṇśṣ'’|.,;:!?()\-\s0-9०-९]/gi, ''))].join(' ')}`);
      continue;
    }
    if (samples.length < 3) samples.push(`${ch.number}:${v.number}\n  was: ${t.slice(0, 100)}\n  now: ${next.slice(0, 100)}`);
    v.transliteration = next;
    changed++;
  }
}

console.log(`${id}: ${changed} transliteration(s) regenerated, ${skippedOk} left as they were, ${rejects.length} refused.`);
for (const s of samples) console.log(s);
if (rejects.length) {
  console.error('Refused (characters outside IAST after conversion; usually stray marks in the Devanagari itself):');
  for (const r of rejects.slice(0, 20)) console.error('  ' + r);
  if (!skipRefused) {
    console.error('Nothing written. Fix these verses, or pass --skip-refused to leave them unchanged and write the rest.');
    process.exit(1);
  }
  console.error(`--skip-refused: these ${rejects.length} verse(s) keep their stored transliteration and need a person to look at the Devanagari.`);
}
if (write) {
  const crlf = raw.includes('\r\n');
  // Keep the file's existing shape: indentation (pretty or minified) and trailing newline.
  const body = JSON.stringify(doc, null, raw.startsWith('{\n') || raw.startsWith('{\r\n') ? 2 : undefined);
  const out = /\r?\n$/.test(raw) ? `${body}\n` : body;
  fs.writeFileSync(file, crlf ? out.replace(/\n/g, '\r\n') : out);
  console.log(`wrote ${path.relative(process.cwd(), file)}. Now review, then: npx tsx scripts/check-canonical-integrity.ts --update`);
} else {
  console.log('Dry run: nothing written. Re-run with --write to apply.');
}
