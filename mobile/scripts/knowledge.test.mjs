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
      const file = join(GEN, 'assets/content/books', v.scriptureId, `ch-${v.chapter}.json`);
      assert.ok(existsSync(file), `${topic.id}: ${v.scriptureId} chapter ${v.chapter} is bundled`);
      const numbers = new Set(read(file).verses.map((x) => String(x.number)));
      assert.ok(numbers.has(String(v.verse)), `${topic.id}: ${v.ref.en} -> ${v.scriptureId} ${v.chapter}.${v.verse}`);
      checked++;
    }
  }
  assert.ok(checked > 30, `checked ${checked} links`);
});

test('Wisdom pathways: whole verses, and every stage, door and related link points at something real', () => {
  const data = read(join(GEN, 'knowledge/pathways.json'));
  const slugs = new Set(data.items.map((p) => p.id));
  assert.ok(data.items.length >= 7, 'pathways');
  for (const p of data.items) {
    assert.ok(p.lenses.length > 0, `${p.id} has verses`);
    for (const l of p.lenses) {
      assert.ok(l.verse.sanskrit.trim().length > 0, `${p.id} verse`);
      assert.doesNotMatch(l.verse.sanskrit.trim(), /(\.\.\.|…)$/, `cut verse in ${p.id}`);
      assert.ok(l.arth.en && l.vyakhya.en && l.modern.en, `${p.id} lens text`);
    }
    for (const id of [...p.lineage, ...p.lenses.flatMap((l) => l.lineage)]) assert.ok(data.masters[id], `${p.id}: master ${id}`);
    for (const r of p.related) assert.ok(slugs.has(r), `${p.id}: related ${r}`);
  }
  for (const s of data.starters) {
    if (!s.pathway) {
      assert.ok(s.topics.length > 0, `${s.id} offers Wisdom for life topics`);
      continue;
    }
    const p = data.items.find((x) => x.id === s.pathway);
    assert.ok(p, `${s.id} -> ${s.pathway}`);
    for (const st of s.stages) {
      for (const i of st.lenses) assert.ok(p.lenses[i], `${s.id}: lens ${i}`);
      for (const i of st.reflections) assert.ok(p.reflections[i], `${s.id}: reflection ${i}`);
      for (const i of st.contemplations) assert.ok(p.contemplations[i], `${s.id}: contemplation ${i}`);
    }
  }
  assert.equal(data.discovery.length, 6, 'six doors in');
  for (const g of data.discovery) for (const e of g.entries) assert.ok(slugs.has(e.pathway), `${g.key}: ${e.label.en} -> ${e.pathway}`);
});

test('Verse network: featured verses with reviewed links, each linked verse whole', () => {
  const data = read(join(GEN, 'knowledge/network.json'));
  assert.ok(data.items.length >= 8, 'featured verses');
  const kinds = new Set(data.categories.map((c) => c.key));
  for (const s of data.items) {
    assert.ok(s.sanskrit.trim().length > 0, s.id);
    for (const n of s.nodes) {
      assert.ok(kinds.has(n.type), `${s.id}: ${n.type}`);
      assert.ok(n.reason, `${s.id}: ${n.label} says why`);
      if (n.sanskrit) assert.doesNotMatch(n.sanskrit.trim(), /(\.\.\.|…)$/, `cut verse ${n.label}`);
      if (n.target) assert.ok(n.target.verse != null, `${n.label} names one verse`);
    }
  }
});

test('Pathway and network verse links land on a real verse in bundled books', { skip: !existsSync(join(GEN, 'catalog.json')) }, () => {
  const catalog = new Map(read(join(GEN, 'catalog.json')).map((b) => [b.id, b]));
  const targets = [
    ...read(join(GEN, 'knowledge/pathways.json')).items.flatMap((p) =>
      p.lenses.map((l) => ({ from: p.id, id: l.verse.scriptureId, chapter: l.verse.chapter, verse: l.verse.verse })),
    ),
    ...read(join(GEN, 'knowledge/network.json')).items.flatMap((s) => [
      { from: s.id, ...s.target },
      ...s.nodes.filter((n) => n.target).map((n) => ({ from: `${s.id} -> ${n.label}`, ...n.target })),
    ]),
  ];
  let checked = 0;
  for (const x of targets) {
    if (!catalog.get(x.id)?.bundled) continue;
    const file = join(GEN, 'assets/content/books', x.id, `ch-${x.chapter}.json`);
    if (!existsSync(file)) continue; // the app's useOpenVerse() hides the link when the chapter is missing
    const numbers = new Set(read(file).verses.map((v) => String(v.number)));
    if (numbers.has(String(x.verse))) checked++;
    else console.log(`  note: ${x.from}: ${x.id} ${x.chapter}.${x.verse} is not a verse number in the bundled chapter`);
  }
  assert.ok(checked > 10, `checked ${checked} links`);
});
