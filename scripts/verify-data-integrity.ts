import assert from 'node:assert/strict';
import { getWisdomTopic } from '../data/wisdom-for-life';
import { scriptureCatalog, categories } from '../data/scripture-meta';
import { getRealVerseCount } from '../data/scriptures';

console.log('--- RUNNING DATA INTEGRITY AUDIT ---');

// 1. Verify Katha Upanishad 1.3.3-4 on /wisdom-for-life/discipline/
const discipline = getWisdomTopic('discipline');
assert.ok(discipline, 'Discipline topic should exist');
const katha = discipline.verses.find((v) => v.referenceDisplay.includes('1.3.3') || v.id.includes('katha'));
assert.ok(katha, 'Katha Upanishad 1.3.3-4 should exist in discipline topic');
assert.ok(
  katha.sanskritDevanagari.includes('आत्मेन्द्रियमनोयुक्तं भोक्तेत्याहुर्मनीषिणः ॥'),
  'Katha Upanishad 1.3.4 second half must not be truncated',
);
assert.ok(
  katha.sanskritTransliteration.includes('ātmendriyamanoyuktaṁ'),
  'Katha Upanishad IAST should include verse 1.3.4 second half',
);
console.log('✓ Katha Upanishad 1.3.3-4 untruncated verse: VERIFIED');

// 2. Verify all 65 scriptures in catalog have unique descriptions (zero duplicate copy-pastes)
console.log(`Auditing ${scriptureCatalog.length} scriptures in catalog...`);
assert.equal(scriptureCatalog.length, 65, 'Exactly 65 scriptures must be cataloged');

const descriptions = new Map<string, string>();
for (const scripture of scriptureCatalog) {
  const id = scripture.id;
  assert.ok(scripture.description && scripture.description.length > 10, `Scripture ${id} must have description`);

  // Ensure no duplicate copy-paste across different scriptures
  if (descriptions.has(scripture.description)) {
    throw new Error(`Duplicate description between ${descriptions.get(scripture.description)} and ${id}`);
  }
  descriptions.set(scripture.description, id);
}
console.log('✓ 65 scripture descriptions & zero duplicate descriptions: VERIFIED');

// 3. Verify total verse count reconciliation
const realCount = getRealVerseCount();
assert.ok(realCount >= 187392, `Real verse count should be at least 187,392 (found ${realCount})`);
console.log(`✓ Real holdings verse count verified (${realCount} verses)`);

// 4. Verify category pill sum
let categoryTotal = 0;
for (const cat of categories) {
  const count = scriptureCatalog.filter((s) => s.category === cat.id).length;
  categoryTotal += count;
}
assert.equal(categoryTotal, 65, `Category pill count sum must equal 65 (found ${categoryTotal})`);
console.log('✓ Category pills sum to 65 scriptures: VERIFIED');

console.log('--- ALL DATA INTEGRITY AUDITS PASSED ---');
