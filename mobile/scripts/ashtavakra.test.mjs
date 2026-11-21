// The Ashtavakra Gita the app ships: every published verse arrives whole, with its meaning.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const GEN = new URL('../src/content/generated/ashtavakra/', import.meta.url);
const SRC = new URL('../../data/ashtavakra/', import.meta.url);

test('every published verse is in the app, Sanskrit untouched', { skip: !existsSync(new URL('meta.json', GEN)) && 'run npm run content first' }, () => {
  const meta = JSON.parse(readFileSync(new URL('meta.json', GEN), 'utf8'));
  assert.equal(meta.length, 20);
  for (const m of meta) {
    const src = new URL(`chapter-${m.number}.json`, SRC);
    if (!existsSync(src)) continue;
    const site = JSON.parse(readFileSync(src, 'utf8'));
    const app = JSON.parse(readFileSync(new URL(`ch-${m.number}.json`, GEN), 'utf8'));
    assert.equal(app.verses.length, site.verses.filter((v) => v.sanskrit).length, `prakarana ${m.number}`);
    app.verses.forEach((v, i) => {
      assert.equal(v.sanskrit, site.verses[i].sanskrit.trim());
      assert.ok(v.literalHindiMeaning || v.englishTranslation, `${v.verseNumber} has a meaning`);
    });
  }
});
