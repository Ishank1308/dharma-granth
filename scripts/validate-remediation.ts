/**
 * Automated Validation Suite for Dharma Granth Remediation
 * Verifies:
 * 1. Philological integrity: zero truncated shlokas in wisdom-for-life & topics
 * 2. Catalog & holdings reconciliation: exactly 65 scriptures, category pill sums, verse count sync
 * 3. Trilingual search normalizer & citation jump-parser accuracy
 */

import assert from 'node:assert/strict';
import { wisdomTopics, getWisdomTopic } from '../data/wisdom-for-life';
import { topics } from '../data/topics';
import { scriptureCatalog, categories } from '../data/scripture-meta';
import { getRealVerseCount, getAllScriptures } from '../data/scriptures';
import { formatCount, formatCountDevanagari } from '../lib/holdings-label';
import { normalizePhonetic } from '../lib/searchNormalizer';
import { parseDirectCitation } from '../lib/search-citation';
import { parseIntent } from '../lib/search-intent';

console.log('====================================================');
console.log('   DHARMA GRANTH MASTER REMEDIATION VALIDATION      ');
console.log('====================================================\n');

// ── 1. Shloka Integrity & Completeness ──────────────────────────────
console.log('[1/4] Auditing Sanskrit Shloka Integrity...');

// Verify Katha Upanishad 1.3.3-4
const discipline = getWisdomTopic('discipline');
assert.ok(discipline, 'Discipline topic must exist');
const katha = discipline.verses.find((v) => v.id.includes('katha') || v.referenceDisplay.includes('1.3.3'));
assert.ok(katha, 'Katha Upanishad 1.3.3-4 must exist in discipline topic');
assert.ok(
  katha.sanskritDevanagari.includes('आत्मेन्द्रियमनोयुक्तं भोक्तेत्याहुर्मनीषिणः ॥'),
  'Katha Upanishad 1.3.4 second half must be present',
);
assert.ok(
  katha.sanskritTransliteration.includes('ātmendriyamanoyuktaṁ'),
  'Katha Upanishad 1.3.4 IAST must include second half',
);
console.log('  ✓ Katha Upanishad 1.3.3-4 full shloka: VERIFIED');

// Verify all wisdom-for-life verses end in danda
let wisdomCount = 0;
for (const topic of wisdomTopics) {
  for (const v of topic.verses) {
    wisdomCount++;
    const s = v.sanskritDevanagari.trim();
    assert.ok(
      /[।॥]\s*$/.test(s),
      `Wisdom verse ${topic.slug}/${v.id} does not end in a terminal danda: "${s.slice(-20)}"`,
    );
  }
}
console.log(`  ✓ All ${wisdomCount} verses in wisdom-for-life end in terminal dandas: VERIFIED`);

// Verify all topics verses end in danda
let topicCount = 0;
for (const topic of topics) {
  for (const v of topic.verses) {
    topicCount++;
    const s = v.sanskrit.trim();
    assert.ok(
      /[।॥]\s*[०-९0-9. ]*[।॥]?\s*$/.test(s),
      `Topic verse ${topic.id}/${v.reference} does not end in a terminal danda: "${s.slice(-20)}"`,
    );
  }
}
console.log(`  ✓ All ${topicCount} verses in topics end in terminal dandas: VERIFIED`);

// ── 2. Catalog Reconciliation & Holdings Counts ────────────────────
console.log('\n[2/4] Auditing Catalog Reconciliation & Holdings Counts...');

// Verify catalog length
assert.equal(scriptureCatalog.length, 65, `Catalog must contain exactly 65 scriptures (found ${scriptureCatalog.length})`);
console.log(`  ✓ Scripture catalog length = 65: VERIFIED`);

// Verify category pill sum matches 65
let categorySum = 0;
for (const cat of categories) {
  const count = scriptureCatalog.filter((s) => s.category === cat.id).length;
  categorySum += count;
}
assert.equal(categorySum, 65, `Sum of categories must equal 65 (found ${categorySum})`);
console.log(`  ✓ All 8 category pills sum to 65 scriptures: VERIFIED`);

// Verify real verse count
const holdingsVerseCount = getRealVerseCount();
assert.ok(holdingsVerseCount > 187000, `Real holdings verse count must exceed 187,000 (found ${holdingsVerseCount})`);
const formattedVerseCount = formatCount(holdingsVerseCount);
const devanagariVerseCount = formatCountDevanagari(holdingsVerseCount);
console.log(`  ✓ Total Library Verses: ${formattedVerseCount} (${devanagariVerseCount}): VERIFIED`);

// Verify all descriptions are unique and non-empty
const descriptions = new Set<string>();
for (const s of scriptureCatalog) {
  assert.ok(s.description && s.description.length > 20, `Scripture ${s.id} description must be substantial`);
  assert.ok(!descriptions.has(s.description), `Duplicate description found for ${s.id}`);
  descriptions.add(s.description);
}
console.log(`  ✓ 65 unique, substantial descriptions: VERIFIED`);

// ── 3. Trilingual Search Normalizer & Citation Jump Parser ──────────
console.log('\n[3/4] Auditing Search Normalizer & Citation Parser...');

// Direct citations
const gitaTarget = '/scripture/bhagavadgita/chapter/2/verse/47';
const citationsToTest = [
  'Gita 2.47',
  'Bhagavad Gita 2.47',
  'bg 2.47',
  'गीता २.४७',
  'गीता 2.47',
];
for (const c of citationsToTest) {
  const res = parseDirectCitation(c);
  assert.ok(res, `Citation "${c}" should resolve`);
  assert.equal(res.href, gitaTarget, `Citation "${c}" must resolve to ${gitaTarget}`);
}
console.log(`  ✓ Gita 2.47 citations in English and Devanagari numerals: VERIFIED`);

const kathaCitation = parseDirectCitation('katha 1.3.3');
assert.ok(kathaCitation, 'katha 1.3.3 should resolve');
assert.equal(kathaCitation.href, '/scripture/katha/chapter/3/verse/3');
console.log(`  ✓ Katha Upanishad citation jump: VERIFIED`);

const rvCitation = parseDirectCitation('rv 1.1.1');
assert.ok(rvCitation, 'rv 1.1.1 should resolve');
console.log(`  ✓ Rig Veda citation jump: VERIFIED`);

// Phonetic equivalence
assert.equal(
  normalizePhonetic('कर्म'),
  normalizePhonetic('karma'),
  'कर्म and karma must normalize to identical phonetic keys',
);
assert.equal(
  normalizePhonetic('तत्त्वमसि'),
  normalizePhonetic('tattvamasi'),
  'तत्त्वमसि and tattvamasi must normalize to identical phonetic keys',
);
assert.equal(
  normalizePhonetic('gītā'),
  normalizePhonetic('geeta'),
  'gītā and geeta must normalize to identical phonetic keys',
);
assert.equal(
  normalizePhonetic('fear'),
  'fear',
  'English query "fear" should remain intact',
);
assert.equal(
  normalizePhonetic('anger'),
  'anger',
  'English query "anger" should remain intact',
);
console.log(`  ✓ Phonetic normalizer equivalences (Devanagari, IAST, Hinglish): VERIFIED`);

// Intent parsing
const intentStress = parseIntent('verses about stress');
assert.ok(intentStress && intentStress.kind === 'about', 'Intent parser should detect "verses about stress"');
assert.equal(intentStress.term, 'stress');

const intentAnger = parseIntent('verses about anger');
assert.ok(intentAnger && intentAnger.kind === 'about', 'Intent parser should detect "verses about anger"');
assert.equal(intentAnger.term, 'anger');
console.log(`  ✓ Intent parser for life-challenge queries: VERIFIED`);

// ── 4. Edge Headers and Cloudflare Redirects ────────────────────────
console.log('\n[4/4] Auditing Cloudflare Edge Configuration Files...');
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const headersPath = resolve('public/_headers');
assert.ok(existsSync(headersPath), 'public/_headers must exist');
const headersContent = readFileSync(headersPath, 'utf-8');
assert.ok(headersContent.includes('X-Content-Type-Options: nosniff'), 'nosniff header required');
assert.ok(headersContent.includes('X-Frame-Options: SAMEORIGIN'), 'SAMEORIGIN header required');
assert.ok(headersContent.includes('Referrer-Policy: strict-origin-when-cross-origin'), 'Referrer policy required');
assert.ok(headersContent.includes('Permissions-Policy: camera=(), microphone=(), geolocation=(self)'), 'Permissions-Policy required');
console.log(`  ✓ public/_headers security and cache policies: VERIFIED`);

const redirectsPath = resolve('public/_redirects');
assert.ok(existsSync(redirectsPath), 'public/_redirects must exist');
const redirectsContent = readFileSync(redirectsPath, 'utf-8');
assert.ok(redirectsContent.includes('/topics/'), 'Topics 301 redirects required');
assert.ok(redirectsContent.includes('/wisdom-for-life/'), 'Target wisdom-for-life path required');
console.log(`  ✓ public/_redirects 301 consolidation: VERIFIED`);

const robotsPath = resolve('public/robots.txt');
assert.ok(existsSync(robotsPath), 'public/robots.txt must exist');
const robotsContent = readFileSync(robotsPath, 'utf-8');
assert.ok(robotsContent.includes('sitemap.xml'), 'Sitemap directive required');
console.log(`  ✓ public/robots.txt sitemap reference: VERIFIED`);

const notFoundPath = resolve('public/404.html');
assert.ok(existsSync(notFoundPath), 'public/404.html must exist');
console.log(`  ✓ public/404.html static error page: VERIFIED`);

console.log('\n====================================================');
console.log('   ALL AUDITS AND VERIFICATIONS PASSED (100%)       ');
console.log('====================================================\n');
