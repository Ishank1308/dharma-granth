// Sanskrit in other scripts must match the website letter for letter, and the new reading settings must
// survive a restart and a backup.
import assert from 'node:assert/strict';
import test from 'node:test';

import { toScript as siteToScript } from '../../lib/sanskrit-script-view.ts';
import { SANSKRIT_SCRIPTS, toScript } from '../src/lib/sanskrit-script.ts';
import { normalizeSettings } from '../src/lib/backup.ts';

const SAMPLES = [
  'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।२.४७।।',
  'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते',
  'तस्मिन् धर्मक्षेत्रे कुरुक्षेत्रे कार्यं तत् सौम्य ळ',
  'पड़े बढ़ि रघुबीर',
];

test('every script matches the website', () => {
  for (const script of SANSKRIT_SCRIPTS) {
    for (const text of SAMPLES) {
      const expected = script === 'deva' ? text : siteToScript(text, script);
      assert.equal(toScript(text, script), expected, `${script}: ${text}`);
    }
  }
});

test('script and line spacing are kept, and bad values fall back', () => {
  assert.equal(normalizeSettings({}).sanskritScript, 'deva');
  assert.equal(normalizeSettings({ sanskritScript: 'telu' }).sanskritScript, 'telu');
  assert.equal(normalizeSettings({ sanskritScript: 'latn' }).sanskritScript, 'deva');
  assert.equal(normalizeSettings({}).lineSpacing, 'normal');
  assert.equal(normalizeSettings({ lineSpacing: 'relaxed' }).lineSpacing, 'relaxed');
  assert.equal(normalizeSettings({ lineSpacing: 'huge' }).lineSpacing, 'normal');
});
