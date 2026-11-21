/** Run: npm run test:chandas */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { countSanskritAksharas, detectChandas, stripSpeakerLines } from '../lib/chandas-detector';
import { extractVerseSpeaker, splitGluedSpeaker, verseLines } from '../lib/verse-format';

type Verse = { number: number | string; sanskrit?: string };
type Chapter = { number: number; verses: Verse[] };
const gita = JSON.parse(readFileSync('public/data/scriptures-full/bhagavadgita.json', 'utf8')) as { chapters: Chapter[] };
const verse = (chapter: number, number: number) => {
  const found = gita.chapters.find((c) => c.number === chapter)?.verses.find((v) => Number(v.number) === number);
  assert.ok(found?.sanskrit, `Gita ${chapter}.${number} has Sanskrit text`);
  return found.sanskrit;
};

// A speaker line is not part of the metre.
for (const [chapter, number] of [[1, 1], [2, 1], [2, 2], [2, 54]] as const) {
  const info = detectChandas(verse(chapter, number));
  assert.equal(info?.name, 'अनुष्टुप्', `Gita ${chapter}.${number} is anushtubh`);
  assert.ok(info.syllables >= 31 && info.syllables <= 33, `Gita ${chapter}.${number} counts about 32 syllables, got ${info.syllables}`);
}
// The eleven-syllable verses of chapter 11 keep their metre when a speaker line precedes them.
for (const number of [15, 32, 35, 36, 47, 50]) {
  assert.equal(detectChandas(verse(11, number))?.name, 'त्रिष्टुप्', `Gita 11.${number} is trishtubh`);
}
// A verse with no speaker line is unchanged.
assert.equal(stripSpeakerLines(verse(2, 47)), verse(2, 47));
assert.equal(detectChandas(verse(2, 47))?.syllables, 32);

// "उवाच" inside the verse stays: only a short line of its own is a speaker line.
const stripped = stripSpeakerLines(verse(2, 1));
assert.ok(!stripped.includes('सञ्जय उवाच'));
assert.ok(stripped.includes('वाक्यमुवाच मधुसूदनः'));
assert.equal(countSanskritAksharas(stripped), 32);

// Danda-separated speaker lines, sandhi forms, plural and dual.
assert.equal(detectChandas('हयग्रीव उवाच । नमो देव्यै महामाये सृष्टिस्थित्यन्तकारिणि । भक्तानुग्रहचतुरे कामदे मोक्षदे शिवे ॥ ९३ ॥')?.name, 'अनुष्टुप्');
assert.equal(stripSpeakerLines('ब्रह्मोवाच । इति व्यास मया विष्णोः पुराणं मुक्तिदं श्रुतम् ।').trim().startsWith('ब्रह्मोवाच'), false);
assert.equal(
  detectChandas('ब्रह्मविष्णू ऊचतुः\nसर्गादिपञ्चकृत्यस्य लक्षणं ब्रूहि नौ प्रभो\nशिव उवाच\nमत्कृत्यबोधनं गुह्यं कृपया प्रब्रवीमि वाम् ॥')?.name,
  'अनुष्टुप्',
);

// A verse that is only a speaker line is left alone, and a long sentence ending in उवाच is not a speaker line.
assert.equal(stripSpeakerLines('देवा ऊचुः'), 'देवा ऊचुः');
const prose = 'दृष्ट्वा स्मयोत्फुल्लदृग् अद्रिराजं स मन्त्रिणौ रावण इत्य् उवाच । अन्यत् पदम् ॥';
assert.equal(stripSpeakerLines(prose), prose);

// Chapters 12 to 18 store the speaker line run into the verse ("अर्जुन उवाचनष्टो मोहः…").
// Readers set the speaker on its own line and the metre ignores it; the stored text is untouched.
for (const [chapter, number] of [[12, 1], [12, 2], [13, 2], [14, 1], [14, 21], [14, 22], [15, 1], [17, 1], [17, 2], [18, 73], [18, 74]] as const) {
  const text = verse(chapter, number);
  const glued = splitGluedSpeaker(text);
  assert.ok(glued, `Gita ${chapter}.${number} has a joined speaker line`);
  assert.match(glued.speaker, /^(?:अर्जुन उवाच|सञ्जय उवाच|श्री भगवानुवाच)$/);
  const lines = verseLines(text);
  assert.equal(lines[0], glued.speaker);
  assert.equal(lines.length, 3, `Gita ${chapter}.${number} sets speaker plus two half-verses`);
  assert.equal(extractVerseSpeaker(undefined, lines).speaker, glued.speaker);
  assert.equal(lines.slice(1).join(''), glued.verse.replace(/[\s|।॥0-9०-९.]+$/, ''), 'no letter of the verse is lost');
  assert.equal(detectChandas(text)?.name, 'अनुष्टुप्', `Gita ${chapter}.${number} is anushtubh`);
}
// Sandhi after उवाच and ordinary verses are not split.
assert.equal(splitGluedSpeaker('तमुवाचेदं वचनं राजा'), null);
assert.equal(splitGluedSpeaker('भूगोवाचस्त्विडा इलाः प्रगाढं भृषकृच्छ्रयोः'), null);
assert.equal(splitGluedSpeaker(verse(2, 47)), null);
assert.equal(splitGluedSpeaker(verse(2, 1)), null);
assert.equal(splitGluedSpeaker(verse(2, 10)), null);
assert.equal(splitGluedSpeaker(verse(3, 10)), null);

console.log('chandas tests passed');
