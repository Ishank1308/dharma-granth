/**
 * Phase 2 checks: phonetic key, direct citations, and sadhana restore
 * that refuses a bad file without writing.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { phoneticIndex } from '../lib/normalize-search';
import { parseDirectCitation } from '../lib/search-citation';
import { createSadhanaBackup, restoreSadhanaBackup, SADHANA_FORMAT } from '../lib/sadhana-backup';
import { searchIndex } from '../lib/search';

assert.equal(phoneticIndex('कृष्ण'), phoneticIndex('kṛṣṇa'));
assert.equal(phoneticIndex('kṛṣṇa'), phoneticIndex('krishna'));
assert.equal(phoneticIndex('शान्ति'), phoneticIndex('śānti'));
assert.equal(phoneticIndex('śānti'), phoneticIndex('shanti'));
assert.equal(phoneticIndex('geeta'), phoneticIndex('gītā'));
assert.equal(phoneticIndex('bhoomi'), phoneticIndex('bhūmi'));
assert.equal(phoneticIndex('संसार'), phoneticIndex('सन्सार'));

const gita = parseDirectCitation('bg 2.47');
assert.ok(gita);
assert.equal(gita.href, '/scripture/bhagavadgita/chapter/2/verse/47');
assert.equal(parseDirectCitation('gita 6.16')?.href, '/scripture/bhagavadgita/chapter/6/verse/16');
assert.equal(parseDirectCitation('katha 1.3.3')?.href, '/scripture/katha/chapter/3/verse/3');

const rig = parseDirectCitation('rv 1.1.1');
assert.ok(rig);
// The full Rig Veda has no verse pages: the citation opens the mandala at the mantra.
assert.equal(rig.href, '/scripture/rigveda/chapter/1/#verse-1.1');
assert.equal(rig.href.includes('/verse/'), false);
assert.match(rig.subtitle, /सूक्त 1, मन्त्र 1/);

const root = path.join(process.cwd(), 'public', 'data', 'scriptures-full');
function hasVerse(id: string, chapter: number, verse: string) {
  const json = JSON.parse(fs.readFileSync(path.join(root, id, `ch-${chapter}.json`), 'utf8')) as {
    chapter?: { verses?: Array<{ number?: number | string }> };
  };
  return json.chapter?.verses?.some((v) => String(v.number) === verse) ?? false;
}
assert.equal(hasVerse('bhagavadgita', 2, '47'), true);
assert.equal(hasVerse('bhagavadgita', 6, '16'), true);
assert.equal(hasVerse('katha', 3, '3'), true);
assert.equal(hasVerse('rigveda', 1, '1.1'), true);

const top = searchIndex('bg 2.47').results[0];
assert.equal(top?.href, '/scripture/bhagavadgita/chapter/2/verse/47');
assert.equal(searchIndex('katha 1.3.3').results[0]?.href, '/scripture/katha/chapter/3/verse/3');
assert.equal(searchIndex('rv 1.1.1').results[0]?.href, '/scripture/rigveda/chapter/1/#verse-1.1');

class Mem implements Storage {
  private map = new Map<string, string>();
  get length() { return this.map.size; }
  clear() { this.map.clear(); }
  getItem(key: string) { return this.map.has(key) ? this.map.get(key)! : null; }
  key(index: number) { return [...this.map.keys()][index] ?? null; }
  removeItem(key: string) { this.map.delete(key); }
  setItem(key: string, value: string) { this.map.set(key, value); }
}

const storage = new Mem();
storage.setItem('dharma.practice.reflections', JSON.stringify({ '2026-10-18': { note: 'keep me' } }));
storage.setItem('dharma.practice.pin', '9999');
const backup = createSadhanaBackup(storage);
assert.equal(backup.format, SADHANA_FORMAT);
assert.equal(typeof backup.data['dharma.practice.reflections'], 'string');
assert.equal(backup.data['dharma.practice.pin'], undefined);

storage.setItem('dharma.practice.japa', JSON.stringify({ date: '', count: 1, rounds: 0, lifetimeRounds: 0, mantra: '' }));
const bad = JSON.stringify({ ...backup, data: { ...backup.data, 'dharma.practice.japa': 'not-json' } });
assert.throws(() => restoreSadhanaBackup(bad, storage));
assert.equal(storage.getItem('dharma.practice.reflections'), JSON.stringify({ '2026-10-18': { note: 'keep me' } }));

const other = new Mem();
other.setItem('dharma.practice.sankalpa', JSON.stringify([{ text: 'stay' }]));
assert.throws(() => restoreSadhanaBackup('{"format":"nope","version":1,"data":{}}', other));
assert.equal(other.getItem('dharma.practice.sankalpa'), JSON.stringify([{ text: 'stay' }]));

const fresh = new Mem();
const written = restoreSadhanaBackup(JSON.stringify(createSadhanaBackup(storage)), fresh);
assert.ok(written >= 1);
assert.match(fresh.getItem('dharma.practice.reflections') ?? '', /keep me/);

console.log('phase 2 feature checks passed');
