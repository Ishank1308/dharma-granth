/**
 * Read-only list of explanation fields that a person should look at before anything is changed.
 *
 *   npx tsx scripts/list-editorial-fix-candidates.ts
 *
 * Writes docs/editorial-fix-candidates.tsv (one row per field) and docs/editorial-fix-candidates.md (counts and a few
 * examples per scripture). Nothing in the data is modified. Two kinds of candidate:
 *   - wrong-language: a Hindi field written in Latin script, or an English field written in Devanagari;
 *   - filler: a phrase from the editorial ban list ("In this verse", "यह श्लोक हमें सिखाता है", ...).
 * Template text is not listed here; publishing already leaves it out.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'public/data/scriptures-full');

const FILLER: [string, RegExp][] = [
  ['in this verse', /\bin this verse\b/i],
  ['this verse teaches us', /\bthis verse teaches us\b/i],
  ['highlights the importance of', /\bthis highlights the importance of\b/i],
  ['it is crucial to remember', /\bit is crucial to remember\b/i],
  ['delve into', /\bdelve into\b/i],
  ['testament to', /\btestament to\b/i],
  ['tapestry of', /\btapestry of\b/i],
  ["today's fast-paced world", /\bin today'?s fast-paced world\b/i],
  ['timeless wisdom reminds us', /\btimeless wisdom reminds us\b/i],
  ['यह श्लोक हमें सिखाता है', /यह श्लोक हमें सिखाता है/],
  ['यह हमें याद दिलाता है', /यह हमें याद दिलाता है/],
  ['आज के तेज़-तर्रार जीवन में', /आज के तेज़-तर्रार जीवन में/],
];

interface Verse { number?: number | string; reference?: string; translation?: string; hindi?: string; explanation?: string; commentary?: string; science?: string; lifeLesson?: string }

const script = (s: string) => {
  let d = 0;
  let l = 0;
  for (const ch of s) {
    if (ch >= 'ऀ' && ch <= 'ॿ') d++;
    else if (/[A-Za-z]/.test(ch)) l++;
  }
  return { d, l };
};

const rows: { id: string; ref: string; field: string; kind: string; detail: string; excerpt: string }[] = [];
for (const f of fs.readdirSync(DIR).sort()) {
  if (!f.endsWith('.json')) continue;
  const id = f.replace(/\.json$/, '');
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as { chapters?: { number?: number | string; verses?: Verse[] }[] };
  for (const c of j.chapters ?? []) {
    for (const v of c.verses ?? []) {
      const ref = v.reference ?? `${c.number}.${v.number}`;
      const fields: [string, string | undefined][] = [['translation', v.translation], ['hindi', v.hindi], ['explanation', v.explanation ?? v.commentary], ['science', v.science], ['lifeLesson', v.lifeLesson]];
      for (const [field, t] of fields) {
        if (typeof t !== 'string' || !t.trim()) continue;
        const { d, l } = script(t);
        const excerpt = t.replace(/\s+/g, ' ').slice(0, 110);
        if (field === 'hindi' && l > d * 2 && l > 20) rows.push({ id, ref, field, kind: 'wrong-language', detail: 'Hindi field in Latin script', excerpt });
        if (field === 'translation' && d > l && d > 20) rows.push({ id, ref, field, kind: 'wrong-language', detail: 'English field in Devanagari', excerpt });
        const hit = FILLER.find(([, re]) => re.test(t));
        if (hit) rows.push({ id, ref, field, kind: 'filler', detail: hit[0], excerpt });
      }
    }
  }
}

fs.writeFileSync(
  path.join(ROOT, 'docs/editorial-fix-candidates.tsv'),
  ['scripture\tverse\tfield\tkind\tdetail\texcerpt', ...rows.map((r) => [r.id, r.ref, r.field, r.kind, r.detail, r.excerpt].join('\t'))].join('\n') + '\n',
);

const by = new Map<string, typeof rows>();
for (const r of rows) by.set(r.id, [...(by.get(r.id) ?? []), r]);
const count = (kind: string) => rows.filter((r) => r.kind === kind).length;
const md = [
  '# Editorial fix candidates',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} by scripts/list-editorial-fix-candidates.ts. Read-only: no verse was changed. Full list: [editorial-fix-candidates.tsv](editorial-fix-candidates.tsv).`,
  '',
  `**${rows.length.toLocaleString('en-IN')} fields:** ${count('wrong-language').toLocaleString('en-IN')} wrong language, ${count('filler').toLocaleString('en-IN')} filler phrase.`,
  '',
  'A wrong-language field is best fixed by moving the text to the right field or removing it, not by translating it here. A filler phrase is best fixed by rewriting the sentence by hand. Each fix needs a person to confirm it.',
  '',
  '| Scripture | Wrong language | Filler | First example |',
  '|---|---:|---:|---|',
  ...[...by.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([id, rs]) => `| ${id} | ${rs.filter((r) => r.kind === 'wrong-language').length} | ${rs.filter((r) => r.kind === 'filler').length} | ${rs[0].ref}: ${rs[0].excerpt.replace(/\|/g, '/').slice(0, 70)} |`),
  '',
];
fs.writeFileSync(path.join(ROOT, 'docs/editorial-fix-candidates.md'), md.join('\n'));
console.log(md.slice(4, 6).join('\n'));
console.log(`wrote docs/editorial-fix-candidates.{md,tsv} (${by.size} scriptures)`);
