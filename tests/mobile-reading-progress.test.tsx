import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MobileReadingProgress } from '../app/components/reader/MobileReadingProgress';

test('dotted verse identifier and ordinal progress are distinct', () => {
  const html = renderToStaticMarkup(<MobileReadingProgress currentVerseNumber="1.9" currentIndex={8} totalVerses={16} chapterTitle="प्रश्न 1" />);
  assert.match(html, /aria-valuenow="56"/);
  assert.match(html, /Verse 1\.9, position 9 of 16/);
  assert.match(html, /transform:scaleX\(0\.56\)/);
  assert.match(html, /motion-reduce:transition-none/);
});

test('invalid or unavailable position is exposed as indeterminate', () => {
  for (const [currentIndex, totalVerses] of [[-1, 16], [16, 16], [0, 0]]) {
    const html = renderToStaticMarkup(<MobileReadingProgress currentVerseNumber="1.9" currentIndex={currentIndex} totalVerses={totalVerses} />);
    assert.doesNotMatch(html, /aria-valuenow=/);
    assert.match(html, /Progress unavailable/);
    assert.doesNotMatch(html, /NaN|Infinity/);
  }
});
