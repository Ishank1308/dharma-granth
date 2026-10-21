/**
 * Validates data/pilot/records/*.json against the editorial rules for the pilot.
 *
 *   npx tsx scripts/pilot/validate-pilot-records.ts
 *
 * A record may not exist for a unit whose canonical baseline is review-only. The canonical snapshot is checked
 * first; if it fails, no record is validated. Exits 1 on any error.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, type PilotUnit } from './lib';

const RECORDS = path.join(ROOT, 'data/pilot/records');
const SET = path.join(ROOT, 'data/pilot/pilot-set.json');
const BASELINE = path.join(ROOT, 'data/pilot/pilot-baseline.json');

const canon = spawnSync(process.execPath, [path.join(ROOT, 'node_modules/tsx/dist/cli.mjs'), path.join(__dirname, 'check-pilot-canonical.ts')], { encoding: 'utf8' });
if (canon.status !== 0) {
  console.error(canon.stdout + canon.stderr);
  console.error('✗ Canonical check failed; records were not validated.');
  process.exit(1);
}

export interface PilotRecord {
  unitId: string;
  reference: string;
  /** Hindi direct meaning. */
  artha: string;
  /** English direct meaning. */
  arthaEn: string;
  arthaDecision: 'preserve-existing' | 'revise-existing' | 'add-missing';
  arthaBasis: 'existing-data' | 'editor-rendering';
  /** Hindi exposition, 120 to 220 words. */
  vyakhya: string;
  /** Hindi modern perspective, 60 to 140 words, or an empty string. */
  vijnana: string;
  vijnanaCategory: string;
  evidenceLevel: 'editorial-observation' | 'none';
  /** One to three Hindi sentences. */
  lifeLesson: string;
  confidence: 'high' | 'medium' | 'low';
  /** English note about uncertainty, or an empty string. */
  reviewNote: string;
  reviewStatus: 'review-required';
  provenance: {
    author: string;
    originalText: string;
    artha: string;
    vyakhya: string;
    vijnana: string;
    traditionalCommentaryConsulted: boolean;
    externalSourcesConsulted: string[];
  };
}

const CATEGORIES = new Set(['psychological', 'observational', 'ethical', 'cognitive', 'contemplative', 'social', 'philosophical', 'ecological', 'linguistic', 'historical', '']);
const FILLER = [/यह श्लोक हमें सिखाता है/, /यह हमें याद दिलाता है/, /आज के तेज़-तर्रार/, /इस श्लोक का महत्व/, /\bin this verse\b/i, /this verse teaches us/i, /testament to/i, /delve into/i];
// Names of classical commentators, matched by title or by a bhashya attribution. Bare "Shankar" is a common name of Shiva and is allowed.
const ACHARYAS = /शंकराचार्य|शङ्कराचार्य|आदि शंकर|आदि शङ्कर|शंकर[-\s]?भाष्य|शाङ्कर|शांकर|रामानुजाचार्य|रामानुज|मध्वाचार्य|मध्व|वल्लभाचार्य|निम्बार्क|व्यास[-\s]?भाष्य|Shankaracharya|Adi Shankara|Shankara's|Shankara bhashya|Ramanuja|Madhvacharya|Madhva|Vallabhacharya|Nimbarka|Vyasa bhashya/i;
const OVERCLAIM = /क्वांटम|क्वान्टम|quantum|सिद्ध करता है|सिद्ध करती है|वैज्ञानिक रूप से प्रमाणित|विज्ञान ने सिद्ध|प्रमाणित कर दिया|अध्ययनों में पाया|शोध में पाया|शोध से पता|वैज्ञानिकों ने/i;
const DIAGNOSIS = /अवसाद|डिप्रेशन|मानसिक रोग|इलाज|उपचार करता|चिकित्सा/;
const BOUNDARY = /दावा नहीं|दावा नहीं करता|सिद्ध नहीं|प्रमाण नहीं|समानता|तुलना|परिप्रेक्ष्य/;

const set = JSON.parse(fs.readFileSync(SET, 'utf8')) as { units: PilotUnit[] };
const baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8')) as { units: { id: string; baselineStatus: string }[] };
const units = new Map(set.units.map((u) => [u.id, u]));
const base = new Map(baseline.units.map((u) => [u.id, u]));

const words = (s: string) => s.replace(/[।॥,.;:!?()'"‘’“”—–-]/g, ' ').split(/\s+/).filter(Boolean).length;
const script = (s: string) => {
  let d = 0;
  let l = 0;
  for (const ch of s) {
    if (ch >= 'ऀ' && ch <= 'ॿ') d++;
    else if (/[A-Za-z]/.test(ch)) l++;
  }
  return { d, l };
};
const sentences = (s: string) => s.split(/(?<=[।.!?])\s*/).map((x) => x.trim()).filter(Boolean).length;
const shingles = (s: string, n: number) => {
  const w = s.replace(/[।॥,.;:!?()'"‘’“”—–-]/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set<string>();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
};

const errors: string[] = [];
const err = (id: string, m: string) => errors.push(`${id}: ${m}`);
const files = fs.existsSync(RECORDS) ? fs.readdirSync(RECORDS).filter((f) => f.endsWith('.json')).sort() : [];
const seen = new Set<string>();
const REQUIRED = ['unitId', 'reference', 'artha', 'arthaEn', 'arthaDecision', 'arthaBasis', 'vyakhya', 'vijnana', 'vijnanaCategory', 'evidenceLevel', 'lifeLesson', 'confidence', 'reviewNote', 'reviewStatus', 'provenance'];

for (const f of files) {
  let r: PilotRecord;
  try {
    r = JSON.parse(fs.readFileSync(path.join(RECORDS, f), 'utf8')) as PilotRecord;
  } catch (e) {
    errors.push(`${f}: invalid JSON (${(e as Error).message})`);
    continue;
  }
  const id = r.unitId ?? f;
  for (const k of REQUIRED) if (!(k in r)) err(id, `missing field "${k}"`);
  if (f !== `${r.unitId}.json`) err(id, `file name must be ${r.unitId}.json`);
  if (seen.has(id)) err(id, 'duplicate record');
  seen.add(id);
  const u = units.get(id);
  if (!u) {
    err(id, 'not in the pilot set');
    continue;
  }
  if (base.get(id)?.baselineStatus !== 'clear') err(id, 'canonical baseline is not clear; no record may be written');
  if (r.reference !== u.reference) err(id, 'reference differs from the pilot set (canonical references are never edited)');

  // Artha
  if (!r.artha?.trim() || script(r.artha).d < 10) err(id, 'artha must be Hindi (Devanagari)');
  if (!r.arthaEn?.trim() || script(r.arthaEn).l < 10) err(id, 'arthaEn must be English');
  if (!['preserve-existing', 'revise-existing', 'add-missing'].includes(r.arthaDecision)) err(id, 'invalid arthaDecision');

  // Vyakhya
  const vw = words(r.vyakhya ?? '');
  if (vw < 120 || vw > 220) err(id, `vyakhya is ${vw} words; must be 120 to 220`);
  if (script(r.vyakhya ?? '').d < script(r.vyakhya ?? '').l * 3) err(id, 'vyakhya must be Hindi');
  if (r.artha && r.vyakhya) {
    const a = shingles(r.artha, 5);
    const v = shingles(r.vyakhya, 5);
    let hit = 0;
    for (const s of a) if (v.has(s)) hit++;
    if (a.size > 0 && hit / a.size > 0.5) err(id, 'vyakhya repeats the artha');
  }

  // Vijnana
  if (!CATEGORIES.has(r.vijnanaCategory ?? '')) err(id, `invalid vijnanaCategory "${r.vijnanaCategory}"`);
  if (r.vijnana?.trim()) {
    const n = words(r.vijnana);
    if (n < 60 || n > 140) err(id, `vijnana is ${n} words; must be 60 to 140 or empty`);
    if (!BOUNDARY.test(r.vijnana)) err(id, 'vijnana must state that it is a modern parallel, not a claim made by the verse');
    if (/[0-9०-९]/.test(r.vijnana)) err(id, 'vijnana contains a number; no statistics, dates or figures may be stated without a source');
    if (!r.vijnanaCategory) err(id, 'vijnana present but vijnanaCategory is empty');
    if (r.evidenceLevel !== 'editorial-observation') err(id, 'vijnana present requires evidenceLevel "editorial-observation"');
  } else {
    if (r.vijnanaCategory) err(id, 'vijnana is empty but vijnanaCategory is set');
    if (r.evidenceLevel !== 'none') err(id, 'vijnana is empty so evidenceLevel must be "none"');
  }

  // Life lesson
  const ls = sentences(r.lifeLesson ?? '');
  if (!r.lifeLesson?.trim()) err(id, 'lifeLesson is empty');
  else if (ls < 1 || ls > 3) err(id, `lifeLesson has ${ls} sentences; must be 1 to 3`);
  if (script(r.lifeLesson ?? '').d < 10) err(id, 'lifeLesson must be Hindi');

  // Confidence and review note
  if (!['high', 'medium', 'low'].includes(r.confidence)) err(id, 'invalid confidence');
  if (r.confidence !== 'high' && !r.reviewNote?.trim()) err(id, 'reviewNote is required when confidence is not high');
  if (r.reviewNote?.trim() && script(r.reviewNote).l < script(r.reviewNote).d) err(id, 'reviewNote must be English');
  if (r.reviewStatus !== 'review-required') err(id, 'reviewStatus must be "review-required" until a person has reviewed it');

  // Cross-field safety
  for (const field of ['artha', 'arthaEn', 'vyakhya', 'vijnana', 'lifeLesson'] as const) {
    const t = r[field] ?? '';
    for (const re of FILLER) if (re.test(t)) err(id, `${field} contains filler (${re})`);
    if (ACHARYAS.test(t)) err(id, `${field} names a classical commentator; no attribution is allowed without a supplied source`);
  }
  for (const field of ['vyakhya', 'vijnana', 'lifeLesson'] as const) {
    if (OVERCLAIM.test(r[field] ?? '')) err(id, `${field} makes an over-claim (${OVERCLAIM})`);
    if (DIAGNOSIS.test(r[field] ?? '')) err(id, `${field} uses diagnostic or treatment language`);
  }
  if (r.provenance?.traditionalCommentaryConsulted !== false) err(id, 'provenance.traditionalCommentaryConsulted must be false: none was consulted');
  if ((r.provenance?.externalSourcesConsulted ?? []).length > 0 && !r.provenance.author) err(id, 'external sources listed without an author field');
}

if (errors.length) {
  console.error(`✗ Pilot record validation failed (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ Pilot records valid: ${files.length} record(s); canonical snapshot matches.`);
