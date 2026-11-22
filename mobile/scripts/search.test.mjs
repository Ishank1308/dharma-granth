// Unit tests for offline verse search (src/lib/verse-search.ts). Run with `npm test`.
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  CorpusChunker,
  devSearchForm,
  devToIndex,
  englishToIndex,
  FIELD_SEP,
  foldLatin,
  indexToDev,
  makeSnippet,
  parseQuery,
  prepareCorpus,
  rankHits,
  searchCorpus,
  shiftChunkHits,
  snapToClusters,
  verseToCorpusLine,
} from '../src/lib/verse-search.ts';

function corpusOf(verses) {
  return {
    d: verses.map((v) => devToIndex(v.sanskrit ?? '') + FIELD_SEP + devToIndex(v.hindi ?? '')).join('\n'),
    t: verses.map((v) => foldLatin(v.transliteration ?? '')).join('\n'),
    e: verses.map((v) => englishToIndex(v.translation ?? '')).join('\n'),
    c: [[2, verses.length]],
    n: verses.map((v) => String(v.number)).join('\n'),
  };
}

const GITA = prepareCorpus(
  'bhagavadgita',
  corpusOf([
    {
      number: 47,
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।',
      transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana\nmā karma-phala-hetur bhūr mā te saṅgo ’stvakarmaṇi',
      hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं।',
      translation: 'Your entitlement is to action alone, never to its fruits.',
    },
    {
      number: 48,
      sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।',
      transliteration: 'yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya',
      hindi: 'हे धनंजय! आसक्ति त्यागकर योग में स्थित होकर कर्म करो। शान्ति मिलती है।',
      translation: 'Perform your duty, O Arjuna, from the conference of yoga, abandoning attachment.',
    },
  ]),
);

const find = (q) => searchCorpus(GITA, parseQuery(q)).map((h) => h.number);

test('the Devanagari index is one-byte ASCII and round-trips letters', () => {
  const idx = devToIndex('धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।');
  assert.match(idx, /^[\x20-\x7e]*$/);
  assert.ok(!idx.includes('"') && !idx.includes('\\') && !idx.includes(FIELD_SEP));
  assert.equal(indexToDev(idx), 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः');
  // Vedic accents, avagraha and digits drop out.
  assert.equal(indexToDev(devToIndex('अ॒ग्निमी॑ळे पु॒रोहि॑तं ॥१॥')), 'अग्निमीळे पुरोहितं');
  assert.equal(indexToDev(devToIndex('सङ्गोऽस्त्व')), 'सङ्गोस्त्व');
});

test('nasal clusters and anusvara meet', () => {
  assert.equal(devSearchForm(devToIndex('शान्ति')), devSearchForm(devToIndex('शांति')));
  assert.equal(devSearchForm(devToIndex('गङ्गा')), devSearchForm(devToIndex('गंगा')));
  // A final म् before a space stays as it is.
  assert.equal(indexToDev(devSearchForm(devToIndex('अहम् अस्मि'))), 'अहम् अस्मि');
});

test('transliteration spellings fold together', () => {
  assert.equal(foldLatin('kṛṣṇa'), foldLatin('krishna'));
  assert.equal(foldLatin('Krsna'), foldLatin('Krishna'));
  assert.equal(foldLatin('phaleṣhu'), foldLatin('phaleshu'));
  assert.equal(foldLatin('kadāchana'), foldLatin('kadacana'));
});

test('finds verses by Sanskrit, part of a compound, Hindi, transliteration and English', () => {
  assert.deepEqual(find('कर्मण्येवाधिकारस्ते'), ['47']);
  assert.deepEqual(find('अधिकार'), ['47']); // inside the compound, and in the Hindi
  assert.deepEqual(find('धनञ्जय'), ['48']); // matches धनंजय in the Hindi too
  assert.deepEqual(find('शांति'), ['48']);
  assert.deepEqual(find('karmanye'), ['47']);
  assert.deepEqual(find('phaleshu kadachana'), ['47']);
  assert.deepEqual(find('fruit'), ['47']);
  assert.deepEqual(find('FRUITS action'), ['47']);
  assert.deepEqual(find('कर्म'), ['47', '48']);
  assert.deepEqual(find('fruits nowhere'), []);
});

test('English matches at word starts only', () => {
  // "fer" is inside "conference" and "Perform" but starts no word.
  assert.deepEqual(find('fer'), []);
  assert.deepEqual(parseQuery('a'), []);
});

test('whole words and phrases rank first', () => {
  const tokens = parseQuery('yoga');
  const hits = searchCorpus(GITA, tokens);
  assert.equal(hits[0].number, '48');
  const order = new Map([['bhagavadgita', 0]]);
  const ranked = rankHits(searchCorpus(GITA, parseQuery('कर्म')), order);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].chapter, 2);
});

test('snippets mark the match and never cut the Sanskrit', () => {
  const tokens = parseQuery('धनंजय');
  const [hit] = searchCorpus(GITA, tokens);
  const s = makeSnippet(GITA, hit.line, tokens);
  assert.ok(s.marks.length > 0);
  const marked = s.marks.map(([a, b]) => s.text.slice(a, b));
  assert.ok(marked.every((m) => m === 'धनञ्जय' || m === 'धनंजय'), marked.join(','));

  const long = 'अ'.repeat(10) + ' ' + 'क'.repeat(400) + ' धर्म';
  const book = prepareCorpus('x', corpusOf([{ number: 1, sanskrit: long, translation: 'word '.repeat(80) + 'dharma' }]));
  const sa = makeSnippet(book, 0, parseQuery('धर्म'));
  assert.equal(sa.field, 'sa');
  assert.ok(!sa.text.includes('…') && sa.text.endsWith('धर्म'));
  const en = makeSnippet(book, 0, parseQuery('dharma'));
  assert.equal(en.field, 'en');
  assert.ok(en.text.startsWith('…') && en.text.length < 200);
  assert.equal(en.text.slice(...en.marks[0]), 'dharma');
});

const SEARCH = new URL('../src/content/generated/assets/content/search/', import.meta.url).pathname;
test('the built index finds the Gita verse 2.47', { skip: !existsSync(SEARCH) && 'run `npm run content` first' }, () => {
  const files = readdirSync(SEARCH);
  assert.ok(files.length > 0);
  const gita = prepareCorpus('bhagavadgita', JSON.parse(readFileSync(SEARCH + 'bhagavadgita.json', 'utf8')));
  const hits = searchCorpus(gita, parseQuery('कर्मण्येवाधिकारस्ते'));
  assert.deepEqual(hits.map((h) => [h.chapter, h.number]), [[2, '47']]);
  for (const f of files) {
    const c = JSON.parse(readFileSync(SEARCH + f, 'utf8'));
    const lines = c.n.split('\n').length;
    assert.equal(c.d.split('\n').length, lines, f);
    assert.equal(c.t.split('\n').length, lines, f);
    assert.equal(c.e.split('\n').length, lines, f);
    assert.equal(c.c.reduce((a, [, n]) => a + n, 0), lines, f);
    assert.match(c.d, /^[\x0a\x20-\x7e]*$/, `${f}: index must stay one-byte`);
  }
});

test('the built index finds the Ashtavakra Gita verse 1.11', { skip: !existsSync(SEARCH + 'ashtavakra.json') && 'run `npm run content` first' }, () => {
  const corpus = JSON.parse(readFileSync(SEARCH + 'ashtavakra.json', 'utf8'));
  assert.equal(corpus.c.length, 20);
  const book = prepareCorpus('ashtavakra', corpus);
  const first = (q) => searchCorpus(book, parseQuery(q)).map((h) => [h.chapter, h.number])[0];
  assert.deepEqual(first('मुक्ताभिमानी'), [1, '11']);
  assert.deepEqual(first('considers oneself free'), [1, '11']);
});

test('little words need not match, but count towards the phrase', () => {
  assert.deepEqual(find('fruits of action'), ['47']); // "of" is not required
  assert.deepEqual(find('fruits nothing'), []);
  const tokens = parseQuery('to action');
  assert.equal(tokens.find((t) => t.en === 'to').stop, true);
  assert.equal(parseQuery('of the').every((t) => !t.stop), true);
  const s = makeSnippet(GITA, 0, parseQuery('to action alone'));
  assert.deepEqual(s.marks.map(([a, b]) => s.text.slice(a, b)), ['to action alone']);
});

// Downloaded books are indexed on the phone in chunks (src/content/download-index.ts) and searched one
// chunk at a time. That must find exactly what one whole-book corpus finds, with the same verse places.
function chunkedSearch(chapters, chunkChars, queries) {
  const whole = { d: [], t: [], e: [], n: [], c: [] };
  for (const ch of chapters) {
    whole.c.push([ch.number, ch.verses.length]);
    for (const v of ch.verses) {
      const line = verseToCorpusLine(v);
      for (const k of ['d', 't', 'e', 'n']) whole[k].push(line[k]);
    }
  }
  const book = prepareCorpus('x', { d: whole.d.join('\n'), t: whole.t.join('\n'), e: whole.e.join('\n'), n: whole.n.join('\n'), c: whole.c });
  const chunks = [];
  const chunker = new CorpusChunker(chunkChars, (chunk) => chunks.push(chunk));
  for (const ch of chapters) ch.verses.forEach((v, i) => chunker.addVerse(ch.number, i, v));
  chunker.flush();
  assert.equal(chunks.reduce((a, c) => a + c.lines, 0), whole.n.length);
  const prepared = chunks.map((c) => ({ ...c, book: prepareCorpus('x', c.corpus) }));
  for (const q of queries) {
    const tokens = parseQuery(q);
    const expected = searchCorpus(book, tokens);
    const got = prepared.flatMap((c) => shiftChunkHits(searchCorpus(c.book, tokens), c.book, c));
    assert.deepEqual(got, expected, q);
    for (const h of got) {
      const c = prepared.find((p) => h.line >= p.start && h.line < p.start + p.lines);
      assert.deepEqual(makeSnippet(c.book, h.line - c.start, tokens), makeSnippet(book, h.line, tokens), q);
    }
  }
  return chunks;
}

test('a book searched chunk by chunk finds the same verses in the same places', () => {
  const words = ['धर्म', 'कर्म', 'शान्ति', 'योग'];
  const chapters = [1, 2, 3].map((number) => ({
    number,
    verses: Array.from({ length: number === 2 ? 40 : 7 }, (_, i) => ({
      number: `${number}.${i + 1}`,
      sanskrit: `${words[i % 4]} श्लोक ${number} पद ${words[(i + number) % 4]}`,
      hindi: 'अर्थ',
      transliteration: `dharma shloka ${i}`,
      translation: `Verse ${i} of chapter ${number} about ${['duty', 'action', 'peace', 'union'][i % 4]}.`,
    })),
  }));
  const chunks = chunkedSearch(chapters, 300, ['धर्म', 'शांति', 'kshetra', 'dharma', 'peace', 'action duty', 'chapter 2']);
  assert.ok(chunks.length > 5, 'small chunks split the long chapter');
  assert.ok(chunks.some((c) => c.firstIndex > 0), 'a chapter continues across chunks');
});

const DATA = new URL('../../public/data/scriptures-full/', import.meta.url).pathname;
test('the Mahabharata searched in chunks matches the whole book', { skip: !existsSync(DATA + 'mahabharata') && !existsSync(DATA + 'mahabharata.json.gz') && 'no published data' }, async () => {
  const { openBook } = await import('./content-lib.mjs');
  const book = openBook(DATA, 'mahabharata');
  const chapters = book.chapters.map((c) => ({ number: c.number, verses: book.readVerses(c.number) }));
  const chunks = chunkedSearch(chapters, 1_500_000, ['धर्म', 'krishna', 'arjuna', 'नारायणं नमस्कृत्य', 'king']);
  assert.ok(chunks.length > 1);
});

test('a highlight never ends inside a conjunct', () => {
  const text = devToIndex('एतच्छ्रुत्वा धर्म्यमणुमेतमाप्य');
  const at = text.indexOf(devToIndex('धर्म'));
  const [a, b] = snapToClusters(text, at, at + devToIndex('धर्म').length);
  assert.equal(indexToDev(text.slice(a, b)), 'धर्म्य');
  const mid = text.indexOf(devToIndex('य'));
  // ध is its own akshara; र्म्य is one conjunct.
  assert.equal(indexToDev(text.slice(...snapToClusters(text, mid, mid + 1))), 'र्म्य');
  const plain = devToIndex('धर्म का');
  assert.deepEqual(snapToClusters(plain, 0, devToIndex('धर्म').length), [0, devToIndex('धर्म').length]);
});
