import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MeaningPendingNotice, MeaningPendingNote } from '../app/components/MeaningPending';

test('pending notice describes this page without claiming source verification', () => {
  const html = renderToStaticMarkup(<MeaningPendingNotice chapterId={1} pending={3} total={3} withMeaning={[]} />);
  assert.match(html, /इस पृष्ठ के सभी 3 श्लोकों/);
  assert.match(html, /all 3 verses.*on this page/);
  assert.doesNotMatch(html, /printed edition|छपे हुए संस्करण/);
  const partial = renderToStaticMarkup(<MeaningPendingNotice chapterId={1} pending={2} total={3} withMeaning={['2.1']} />);
  assert.match(partial, /2 verses.*on this page/);
  assert.match(partial, /href="#verse-2\.1"/);
});

test('nearby verse links identify direction for assistive technology', () => {
  const html = renderToStaticMarkup(<MeaningPendingNote chapterId={1} nearby={{ prev: '2.1', next: '2.3' }} />);
  assert.match(html, /aria-label="पिछला अर्थ सहित श्लोक 1\.2\.1 · Previous verse with meaning 1\.2\.1"/);
  assert.match(html, /aria-label="अगला अर्थ सहित श्लोक 1\.2\.3 · Next verse with meaning 1\.2\.3"/);
  assert.match(html, /href="#verse-2\.1"/);
  assert.match(html, /href="#verse-2\.3"/);
  assert.doesNotMatch(html, /printed edition|छपे हुए संस्करण/);
});
