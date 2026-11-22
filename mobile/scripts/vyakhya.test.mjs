// Hindi व्याख्या: the build resolves website commentary keys to the verse numbers the reader shows,
// and the reader splits and formats it as the website does.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { lookupCommentary, readCommentary } from './content-lib.mjs';
import { lightMarkdown, parseModernContext } from '../src/lib/modern-context.ts';
import { splitVyakhyaCommentary } from '../src/lib/verse-format.ts';
import { normalizeSettings } from '../src/lib/backup.ts';

const none = { normalized: new Set(), raw: new Set() };

test('commentary keys: exact first, a shortened key only when unambiguous', () => {
  const all = { '2:47': { explanation: 'a' }, '2:10': { explanation: 'b' } };
  assert.equal(lookupCommentary(all, 2, 47, none).explanation, 'a');
  assert.equal(lookupCommentary(all, 2, '2.10', none).explanation, 'b');
  assert.equal(lookupCommentary(all, 2, '2.10', { normalized: new Set(['2:10']), raw: new Set() }), undefined);
  assert.equal(lookupCommentary(all, 3, 47, none), undefined);
});

test('the Gita gets व्याख्या for its famous verse, keyed by the reader’s verse number', () => {
  const book = {
    id: 'bhagavadgita',
    chapters: [{ number: 2 }],
    readVerses: () => [{ number: 47 }],
  };
  const dataDir = fileURLToPath(new URL('../../public/data/scriptures-full', import.meta.url));
  const publishedDir = join(dataDir, '..', 'hi-commentary', 'bhagavadgita');
  const out = readCommentary(dataDir, book);
  if (!existsSync(publishedDir) && !out) return; // clean checkout before publish:commentary
  assert.ok(out, 'expected readCommentary to load published sharded hi-commentary/bhagavadgita/*.json');
  const entry = out.chapters[2]['47'];
  assert.ok(entry.v && /[ऀ-ॿ]/.test(entry.v));
  assert.equal(out.verses, 1);
});

test('Hindi prose is the व्याख्या, English the commentary, a word gloss neither', () => {
  const gloss = 'a—b; c—d; e—f; g—h';
  const r = splitVyakhyaCommentary(['यह हिन्दी व्याख्या है', gloss, 'English commentary'], gloss);
  assert.equal(r.vyakhya, 'यह हिन्दी व्याख्या है');
  assert.equal(r.commentary, 'English commentary');
});

test('जीवन सूत्र sections and light Markdown', () => {
  const m = parseModernContext('### आधुनिक संदर्भ\nसंदर्भ।\n\n### आज के जीवन में प्रयोग\n- **पहचानें**: रुकें।\n\n### चिंतन प्रश्न\nक्या?');
  assert.equal(m.context, 'संदर्भ।');
  assert.equal(m.question, 'क्या?');
  const [li] = lightMarkdown(m.application);
  assert.equal(li.kind, 'li');
  assert.deepEqual(li.parts[0], { text: 'पहचानें', bold: true });
  assert.equal(parseModernContext('बस एक पंक्ति').context, 'बस एक पंक्ति');
});

test('the व्याख्या layer is on unless turned off', () => {
  assert.equal(normalizeSettings({}).showVyakhya, true);
  assert.equal(normalizeSettings({ showVyakhya: false }).showVyakhya, false);
});
