/** Run: npm run test:embed */
import assert from 'node:assert/strict';
import { verseEmbedHtml } from '../lib/embed';

const base = {
  reference: 'Bhagavad Gita 2.47',
  sanskrit: 'कर्मण्येवाधिकारस्ते\nमा फलेषु कदाचन',
  hindi: 'तुम्हारा अधिकार कर्म पर है।',
  english: 'You have a right to action alone.',
  url: 'https://dharmagranth.dev/scripture/bhagavadgita/chapter/2/verse/47/',
};

const hi = verseEmbedHtml({ ...base, meaning: 'hindi' });
assert.match(hi, /^<blockquote cite="https:\/\/dharmagranth\.dev\/scripture\/bhagavadgita\/chapter\/2\/verse\/47\/"/);
assert.ok(hi.includes('कर्मण्येवाधिकारस्ते<br>मा फलेषु कदाचन'), 'Sanskrit lines keep their break');
assert.ok(hi.includes('lang="hi"') && hi.includes('तुम्हारा अधिकार'), 'Hindi meaning');
assert.ok(!hi.includes('You have a right'), 'other language left out');
assert.ok(hi.includes('<a href="https://dharmagranth.dev/scripture/bhagavadgita/chapter/2/verse/47/"'), 'credit link');

const en = verseEmbedHtml({ ...base, meaning: 'english' });
assert.ok(en.includes('lang="en"') && en.includes('You have a right to action alone.'));

const none = verseEmbedHtml({ ...base, meaning: 'none' });
assert.ok(!none.includes('<p lang="hi"') && !none.includes('<p lang="en"'), 'no meaning paragraph');

// Verse text is data, never markup.
const hostile = verseEmbedHtml({ ...base, sanskrit: '<script>alert(1)</script>', english: '"><img src=x onerror=1>', url: base.url + '"><b>', meaning: 'english' });
assert.ok(!hostile.includes('<script>') && !hostile.includes('<img') && !hostile.includes('"><b>'), 'escaped');

// Long meanings are clipped.
const long = verseEmbedHtml({ ...base, english: 'word '.repeat(300), meaning: 'english' });
assert.ok(long.includes('…') && long.length < 1500, 'clipped');

console.log('embed: all assertions passed');
