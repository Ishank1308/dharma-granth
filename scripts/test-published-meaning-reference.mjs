/** Regression guard: published passage targets may be numbers or dotted string IDs. */
import assert from 'node:assert/strict';
import { hasPassageReference } from './lib/published-meaning-reference.mjs';

for (const value of [1, 23, 0, '1', '2.3', '17b', ' 4 ']) {
  assert.equal(hasPassageReference(value), true, `should count a linked meaning target: ${String(value)}`);
}
for (const value of [undefined, null, '', '  ', NaN, Infinity, {}, []]) {
  assert.equal(hasPassageReference(value), false, `should not count invalid target: ${String(value)}`);
}
console.log('✓ published Hindi and English passage links accept numeric and string verse references');
