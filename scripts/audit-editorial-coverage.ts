/**
 * Read-only audit of the explanation layers on every verse in the library.
 *
 *   npx tsx scripts/audit-editorial-coverage.ts          # prints the table, writes docs/editorial-coverage-report.md
 *
 * Changes nothing. For each scripture it counts verses that have each layer (English meaning, Hindi meaning,
 * explanation, research note) and flags quality problems that can be detected without judging the text:
 *   - template text: the same explanation value repeated on several unrelated verses of one scripture (the same rule
 *     the publish step uses to leave such text out; a note for a short run of neighbouring verses is not counted);
 *   - filler phrases from the editorial ban list;
 *   - wrong language in a field (Hindi field in Latin script, English field in Devanagari);
 *   - very short or very long values.
 * A flag is a prompt for a human reader, not a verdict.
 */
import fs from 'node:fs';
import path from 'node:path';
import { findTemplateFields } from './lib/template-text';

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'public/data/scriptures-full');

const FILLER = [
  /\bin this verse\b/i,
  /\bthis verse teaches us\b/i,
  /\bthis highlights the importance of\b/i,
  /\bit is crucial to remember\b/i,
  /\bdelve into\b/i,
  /\btestament to\b/i,
  /\btapestry of\b/i,
  /\bin today'?s fast-paced world\b/i,
  /\btimeless wisdom reminds us\b/i,
  /यह श्लोक हमें सिखाता है/,
  /यह हमें याद दिलाता है/,
  /आज के तेज़-तर्रार जीवन में/,
];

interface Verse {
  __key?: string;
  number?: number | string;
  sanskrit?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
  commentary?: string;
  science?: string;
  lifeLesson?: string;
}

const script = (s: string) => {
  let d = 0;
  let l = 0;
  for (const ch of s) {
    if (ch >= 'ऀ' && ch <= 'ॿ') d++;
    else if (/[A-Za-z]/.test(ch)) l++;
  }
  return { d, l };
};
const has = (s: unknown) => typeof s === 'string' && s.trim().length > 0;

interface Row {
  id: string;
  verses: number;
  en: number;
  hi: number;
  expl: number;
  sci: number;
  template: number;
  filler: number;
  wrongLang: number;
  tooShort: number;
}

const rows: Row[] = [];
for (const f of fs.readdirSync(DIR).sort()) {
  if (!f.endsWith('.json')) continue;
  const id = f.replace(/\.json$/, '');
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as { chapters?: { verses?: Verse[] }[] };
  const verses = (j.chapters ?? []).flatMap((c) => (c.verses ?? []).map((v, i) => ({ ...v, __key: `${c.number}:${i}` })));
  const hidden = findTemplateFields(
    verses.map((v) => ({ key: v.__key, sanskrit: v.sanskrit ?? '', fields: { explanation: v.explanation, commentary: v.commentary, science: v.science, lifeLesson: v.lifeLesson } })),
  );
  const r: Row = { id, verses: verses.length, en: 0, hi: 0, expl: 0, sci: 0, template: 0, filler: 0, wrongLang: 0, tooShort: 0 };
  for (const v of verses) {
    const expl = v.explanation ?? v.commentary;
    if (has(v.translation)) r.en++;
    if (has(v.hindi)) r.hi++;
    if (has(expl)) r.expl++;
    if (has(v.science)) r.sci++;
  }
  for (const v of verses) {
    const expl = v.explanation ?? v.commentary;
    const fields: [string, string | undefined][] = [['en', v.translation], ['hi', v.hindi], ['expl', expl], ['sci', v.science], ['lesson', v.lifeLesson]];
    let tmpl = ['explanation', 'commentary', 'science', 'lifeLesson'].some((k) => hidden.has(`${v.__key}|${k}`));
    let fill = false;
    let wrong = false;
    let short = false;
    for (const [k, t] of fields) {
      if (!has(t)) continue;
      const s = t as string;
      if (FILLER.some((re) => re.test(s))) fill = true;
      const { d, l } = script(s);
      if ((k === 'hi' && l > d * 2 && l > 20) || (k === 'en' && d > l && d > 20)) wrong = true;
      if (s.trim().length < 12) short = true;
    }
    if (tmpl) r.template++;
    if (fill) r.filler++;
    if (wrong) r.wrongLang++;
    if (short) r.tooShort++;
  }
  rows.push(r);
}

const pct = (n: number, t: number) => (t ? `${Math.round((n / t) * 100)}%` : '-');
const total = rows.reduce(
  (a, r) => ({ verses: a.verses + r.verses, en: a.en + r.en, hi: a.hi + r.hi, expl: a.expl + r.expl, sci: a.sci + r.sci, template: a.template + r.template, filler: a.filler + r.filler, wrongLang: a.wrongLang + r.wrongLang, tooShort: a.tooShort + r.tooShort }),
  { verses: 0, en: 0, hi: 0, expl: 0, sci: 0, template: 0, filler: 0, wrongLang: 0, tooShort: 0 },
);

const lines = [
  '# Editorial coverage audit',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} by scripts/audit-editorial-coverage.ts. Read-only: no verse was changed.`,
  '',
  'Layers counted: English meaning (`translation`), Hindi meaning (`hindi`), explanation (`explanation`/`commentary`), research note (`science`).',
  'Flags are prompts for a human reader: **template** = the same long explanation repeated on 3+ unrelated verses of one text (left out of the published data, shown to readers as "not yet written"); **filler** = a phrase from the editorial ban list; **wrong lang** = Hindi field in Latin script or English field in Devanagari; **short** = a value under 12 characters.',
  '',
  `**Library total: ${total.verses.toLocaleString('en-IN')} verses in ${rows.length} scriptures.** English ${pct(total.en, total.verses)}, Hindi ${pct(total.hi, total.verses)}, explanation ${pct(total.expl, total.verses)}, research note ${pct(total.sci, total.verses)}. Flags: ${total.template.toLocaleString('en-IN')} template, ${total.filler} filler, ${total.wrongLang} wrong language, ${total.tooShort} short.`,
  '',
  '| Scripture | Verses | English | Hindi | Explanation | Research | Template | Filler | Wrong lang | Short |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...rows
    .sort((a, b) => b.verses - a.verses)
    .map((r) => `| ${r.id} | ${r.verses.toLocaleString('en-IN')} | ${pct(r.en, r.verses)} | ${pct(r.hi, r.verses)} | ${pct(r.expl, r.verses)} | ${pct(r.sci, r.verses)} | ${r.template} | ${r.filler} | ${r.wrongLang} | ${r.tooShort} |`),
  '',
];
fs.writeFileSync(path.join(ROOT, 'docs/editorial-coverage-report.md'), lines.join('\n'));
console.log(lines.slice(4, 8).join('\n'));
console.log(`wrote docs/editorial-coverage-report.md (${rows.length} scriptures)`);
