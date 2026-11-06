/**
 * Every published व्याख्या must show on one verse only: the one it was written for.
 *
 * The reader looks a verse up by a short key ("2:47"), or by its full number when other verses of the chapter
 * share that short key (lib/verse-commentary-key.ts). This check fails when one entry would still land on two
 * verses with different text, and lists entries that match no verse (written under a key the reader never asks
 * for), so they can be re-keyed.
 *
 *   npx tsx scripts/check-commentary-keys.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { lookupVerseCommentary, sharedShortKeys, shortVerseKey, verseCommentaryKeys } from '../lib/verse-commentary-key';

// The key rules themselves.
assert.equal(shortVerseKey(2, 47), '2:47');
assert.equal(shortVerseKey(2, '2.47'), '2:47');
assert.equal(shortVerseKey(3, '1.3.28'), '3:28');
assert.equal(shortVerseKey(1, '5.1'), '1:1');
const mbh = sharedShortKeys(1, ['1.1', '1.2', '2.1', '56.33']);
assert.deepEqual([...mbh], ['1:1']);
assert.deepEqual(verseCommentaryKeys(1, '2.1', mbh), ['1:2.1']);
assert.deepEqual(verseCommentaryKeys(1, '1.2', mbh), ['1:2', '1:1.2']);
assert.deepEqual(verseCommentaryKeys(2, 47), ['2:47']);
// A short-key entry never reaches a verse whose short key is shared.
assert.equal(lookupVerseCommentary({ '1:1': 'x' }, 1, '2.1', mbh), undefined);
assert.equal(lookupVerseCommentary({ '1:2.1': 'y' }, 1, '2.1', mbh), 'y');
// Brahma Sutra 1.1.1 and 1.1.10 both shorten to "1:1.1".
assert.deepEqual([...sharedShortKeys(1, ['1.1.1', '1.1.10'])], ['1:1.1']);

const real = (s: unknown) => typeof s === 'string' && s.replace(/\s+/g, ' ').trim().length > 20;
const HC = path.resolve('public/data/hi-commentary');
const SF = path.resolve('public/data/scriptures-full');

interface Verse { number: number | string; sanskrit?: string }
interface Book { chapters?: Array<{ number: number | string; verses?: Verse[] }> }

let failures = 0;
let unreachable = 0;
for (const file of fs.readdirSync(HC).filter((f) => f.endsWith('.json')).sort()) {
  const id = file.slice(0, -5);
  const bookPath = path.join(SF, `${id}.json`);
  if (!fs.existsSync(bookPath)) continue;
  const commentary = JSON.parse(fs.readFileSync(path.join(HC, file), 'utf8')) as Record<string, { explanation?: string }>;
  const book = JSON.parse(fs.readFileSync(bookPath, 'utf8')) as Book;
  const landed = new Map<string, Set<string>>();
  for (const ch of book.chapters ?? []) {
    const chapterId = Number(ch.number);
    const verses = ch.verses ?? [];
    const shared = sharedShortKeys(chapterId, verses.map((v) => v.number));
    for (const v of verses) {
      const key = verseCommentaryKeys(chapterId, v.number, shared).find((k) => commentary[k] !== undefined);
      if (!key || !real(commentary[key]?.explanation)) continue;
      const texts = landed.get(key) ?? new Set<string>();
      texts.add((v.sanskrit ?? '').replace(/\s+/g, ' ').trim());
      landed.set(key, texts);
    }
  }
  for (const [key, texts] of landed) {
    if (texts.size > 1) {
      failures++;
      console.error(`✗ ${id} ${key}: one व्याख्या shows on ${texts.size} different verses`);
    }
  }
  const orphans = Object.keys(commentary).filter((k) => real(commentary[k]?.explanation) && !landed.has(k));
  if (orphans.length) {
    unreachable += orphans.length;
    console.log(`  ${id}: ${orphans.length} entr${orphans.length === 1 ? 'y matches' : 'ies match'} no verse (${orphans.slice(0, 6).join(', ')}${orphans.length > 6 ? ', …' : ''})`);
  }
}

if (failures) {
  console.error(`\ncheck-commentary-keys: ${failures} व्याख्या entr${failures === 1 ? 'y shows' : 'ies show'} on more than one verse.`);
  process.exit(1);
}
console.log(`✓ check-commentary-keys: every व्याख्या shows on one verse (${unreachable} entries match no verse; see above).`);
