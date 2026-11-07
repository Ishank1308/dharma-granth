#!/usr/bin/env node
/**
 * What readers see for each scripture, after publishing: how many verses have their Hindi and
 * English meaning, how many point to a passage translation on another verse, and how many show
 * the "not yet available" line. Reads the published chapter shards, so run
 * `npm run shard:scriptures` first.
 *
 *   npm run audit:verses            # Markdown table to stdout
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('public/data/scriptures-full');
const has = (v, k) => typeof v[k] === 'string' && v[k].trim().length > 0;
const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : '–');

const rows = [];
for (const id of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  const c = { verses: 0, sa: 0, tr: 0, hi: 0, hiWith: 0, en: 0, enWith: 0, none: 0 };
  for (const f of fs.readdirSync(dir).filter((x) => /^ch-\d+\.json$/.test(x))) {
    const { chapter } = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const v of chapter.verses ?? []) {
      c.verses++;
      if (has(v, 'sanskrit')) c.sa++;
      if (has(v, 'transliteration')) c.tr++;
      const hi = has(v, 'hindi');
      const hiWith = !hi && v.hindiSeeVerse != null;
      const en = has(v, 'translation');
      const enWith = !en && v.translationSeeVerse != null;
      if (hi) c.hi++;
      if (hiWith) c.hiWith++;
      if (en) c.en++;
      if (enWith) c.enWith++;
      if (!hi && !hiWith && !en && !enWith && !v.hindiReviewRequired) c.none++;
    }
  }
  if (c.verses) rows.push({ id, ...c });
}

console.log('| Scripture | Verses | Sanskrit | IAST | Hindi | Hindi in passage | English | English in passage | No meaning yet |');
console.log('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of rows) {
  console.log(
    `| ${r.id} | ${r.verses} | ${pct(r.sa, r.verses)} | ${pct(r.tr, r.verses)} | ${pct(r.hi, r.verses)} | ${r.hiWith || ''} | ${pct(r.en, r.verses)} | ${r.enWith || ''} | ${r.none ? `${r.none} (${pct(r.none, r.verses)})` : ''} |`,
  );
}
const total = rows.reduce((a, r) => a + r.verses, 0);
const none = rows.reduce((a, r) => a + r.none, 0);
console.log(`\n${rows.length} scriptures, ${total} verses; ${none} (${pct(none, total)}) show "not yet available" for both meanings.`);
