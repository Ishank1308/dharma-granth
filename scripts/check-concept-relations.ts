/**
 * Verifies concept relationships: both concepts have pages, the relation type
 * is defined, the evidence verse exists in the library and contains the
 * expected Sanskrit, and every one of the twelve explorer concepts appears in
 * at least one relationship.
 * Run: npm run check:concept-relations
 */
import fs from 'node:fs';
import path from 'node:path';
import { CONCEPT_RELATIONS, RELATION_LABEL } from '../data/concept-relations';
import { CONCEPT_DETAILS } from '../data/concept-details';

const strip = (s: string) => s.replace(/[\s|।॥0-9०-९.‌‍]+/g, '');
const EXPLORER = ['dharma', 'karma', 'atman', 'brahman', 'moksha', 'bhakti', 'jnana', 'yoga', 'maya', 'ahimsa', 'yajna', 'samsara', 'vairagya'];
let bad = 0;
const fail = (m: string) => { bad++; console.error(`FAIL ${m}`); };

for (const id of EXPLORER) if (!CONCEPT_DETAILS[id]) fail(`concept page missing: ${id}`);
for (const r of CONCEPT_RELATIONS) {
  const name = `${r.from} -> ${r.to} (${r.type})`;
  if (!CONCEPT_DETAILS[r.from] || !CONCEPT_DETAILS[r.to]) fail(`${name}: unknown concept`);
  if (!(r.type in RELATION_LABEL)) fail(`${name}: undefined relation type`);
  if (r.from === r.to) fail(`${name}: relates a concept to itself`);
  if (!r.note.trim()) fail(`${name}: no note`);
  const e = r.evidence;
  const file = path.join('public', 'data', 'scriptures-full', e.scriptureId, `ch-${e.chapter}.json`);
  let text = '';
  try {
    text = JSON.parse(fs.readFileSync(file, 'utf8')).chapter.verses.find((v: { number: number | string }) => String(v.number) === String(e.verse))?.sanskrit ?? '';
  } catch { /* reported below */ }
  if (!strip(text).includes(strip(e.expect))) fail(`${name}: ${e.scriptureId} ${e.chapter}.${e.verse} does not contain "${e.expect}"`);
}
for (const id of EXPLORER) if (!CONCEPT_RELATIONS.some((r) => r.from === id || r.to === id)) fail(`${id} has no relationship`);
const seen = new Set<string>();
for (const r of CONCEPT_RELATIONS) { const k = `${r.from}|${r.to}|${r.type}`; if (seen.has(k)) fail(`duplicate relationship ${k}`); seen.add(k); }
console.log(bad === 0 ? `All ${CONCEPT_RELATIONS.length} relationships check out.` : `${bad} problem(s).`);
process.exit(bad === 0 ? 0 : 1);
