// Checks the bundled knowledge pages: every kind builds, every verse is whole, and every Wisdom for life
// verse that links into the reader lands on a verse that exists in the bundled chapter.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { buildKnowledge } from './build-knowledge.mjs';

const MOBILE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(MOBILE, 'src/content/generated');
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));

await buildKnowledge();

test('every knowledge kind has entries and category keys that exist', () => {
  for (const kind of ['concepts', 'dictionary', 'characters', 'places', 'timelines', 'wisdom']) {
    const data = read(join(GEN, 'knowledge', `${kind}.json`));
    assert.ok(data.items.length > 0, kind);
    const keys = new Set(data.categories.map((c) => c.key));
    for (const item of data.items) assert.ok(keys.has(item.category), `${kind}/${item.id} has category ${item.category}`);
    assert.equal(new Set(data.items.map((i) => i.id)).size, data.items.length, `${kind} ids are unique`);
  }
});

test('verses are whole: no empty Sanskrit, no trailing ellipsis', () => {
  const verses = [
    ...read(join(GEN, 'knowledge/concepts.json')).items.flatMap((c) => c.verses),
    ...read(join(GEN, 'knowledge/dictionary.json')).items.flatMap((c) => c.verses),
    ...read(join(GEN, 'knowledge/characters.json')).items.flatMap((c) => c.verses),
    ...read(join(GEN, 'knowledge/wisdom.json')).items.flatMap((t) => t.verses),
  ];
  assert.ok(verses.length > 100);
  for (const v of verses) {
    assert.ok(v.sanskrit && v.sanskrit.trim().length > 0, JSON.stringify(v.ref));
    assert.doesNotMatch(v.sanskrit.trim(), /(\.\.\.|…)$/, `cut verse ${JSON.stringify(v.ref)}`);
  }
});

test('Wisdom for life verse links land on a real verse in bundled books', { skip: !existsSync(join(GEN, 'catalog.json')) }, () => {
  const catalog = new Map(read(join(GEN, 'catalog.json')).map((b) => [b.id, b]));
  let checked = 0;
  for (const topic of read(join(GEN, 'knowledge/wisdom.json')).items) {
    for (const v of topic.verses) {
      const book = catalog.get(v.scriptureId);
      if (!book?.bundled) continue;
      const file = join(GEN, 'books', v.scriptureId, `ch-${v.chapter}.json`);
      assert.ok(existsSync(file), `${topic.id}: ${v.scriptureId} chapter ${v.chapter} is bundled`);
      const numbers = new Set(read(file).verses.map((x) => String(x.number)));
      assert.ok(numbers.has(String(v.verse)), `${topic.id}: ${v.ref.en} -> ${v.scriptureId} ${v.chapter}.${v.verse}`);
      checked++;
    }
  }
  assert.ok(checked > 30, `checked ${checked} links`);
});
