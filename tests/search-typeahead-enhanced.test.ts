import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getTypeaheadSuggestion,
  getTypeaheadSuggestions,
  getTrilingualEquivalent,
} from '../lib/search-typeahead';

test('direct citations resolve with exact href, category and title', () => {
  const bg = getTypeaheadSuggestion('bg 2.47');
  assert.ok(bg, 'bg 2.47 must resolve');
  assert.equal(bg.directHref, '/scripture/bhagavadgita/chapter/2/verse/47/');
  assert.equal(bg.category, 'श्लोक');

  const gitaCh2 = getTypeaheadSuggestion('gita 2');
  assert.ok(gitaCh2, 'gita 2 must resolve');
  assert.equal(gitaCh2.directHref, '/scripture/bhagavadgita/chapter/2/');
  assert.equal(gitaCh2.category, 'अध्याय');

  const rv = getTypeaheadSuggestion('rv 1.1.1');
  assert.ok(rv, 'rv 1.1.1 must resolve');
  assert.equal(rv.category, 'श्लोक');
});

test('phonetic normalization enables cross-script typeahead matching', () => {
  // Casual Roman Hinglish vs Devanagari vs IAST for Gita 2.47
  const byHinglish = getTypeaheadSuggestion('karmanye');
  assert.ok(byHinglish, 'karmanye must match');
  assert.equal(byHinglish.completion, 'कर्मण्येवाधिकारस्ते');
  assert.equal(byHinglish.directHref, '/scripture/bhagavadgita/chapter/2/verse/47/');

  const byDevanagari = getTypeaheadSuggestion('कर्मण्ये');
  assert.ok(byDevanagari, 'कर्मण्ये must match');
  assert.equal(byDevanagari.completion, 'कर्मण्येवाधिकारस्ते');

  // Ashtavakra Gita
  const ashtaRoman = getTypeaheadSuggestion('ashtavakra');
  const ashtaDev = getTypeaheadSuggestion('अष्टावक्र');
  assert.ok(ashtaRoman, 'ashtavakra must match');
  assert.ok(ashtaDev, 'अष्टावक्र must match');
  assert.equal(ashtaRoman.directHref, '/ashtavakra/');
  assert.equal(ashtaDev.directHref, '/ashtavakra/');
});

test('trilingual alignment dictionary resolves philosophical concepts', () => {
  const karma = getTrilingualEquivalent('karma');
  assert.ok(karma, 'karma trilingual equivalent');
  assert.equal(karma.devanagari, 'कर्म');
  assert.equal(karma.iast, 'karma');
  assert.ok(karma.english.includes('Action'));

  const tattvamasi = getTrilingualEquivalent('tat tvam asi');
  assert.ok(tattvamasi, 'tat tvam asi trilingual equivalent');
  assert.equal(tattvamasi.devanagari, 'तत्त्वमसि');

  const shanti = getTrilingualEquivalent('शान्ति');
  assert.ok(shanti, 'शान्ति trilingual equivalent');
  assert.equal(shanti.iast, 'śānti');
});

test('panchang observances and calendar resolve to instant jumps', () => {
  const panchang = getTypeaheadSuggestion('panchang');
  assert.ok(panchang, 'panchang match');
  assert.equal(panchang.directHref, '/panchang/');
  assert.equal(panchang.category, 'पंचांग');

  const calendar = getTypeaheadSuggestion('calendar');
  assert.ok(calendar, 'calendar match');
  assert.equal(calendar.directHref, '/panchang/calendar/');
  assert.equal(calendar.category, 'पंचांग');

  const ekadashi = getTypeaheadSuggestion('ekadashi');
  assert.ok(ekadashi, 'ekadashi match');
  assert.equal(ekadashi.directHref, '/panchang/ekadashi/');
  assert.equal(ekadashi.category, 'पंचांग');
});

test('sacred mantras and stotras resolve accurately', () => {
  const gayatri = getTypeaheadSuggestion('gayatri');
  assert.ok(gayatri, 'gayatri match');
  assert.equal(gayatri.directHref, '/mantras/gayatri-mantra/');
  assert.equal(gayatri.category, 'मंत्र');

  const shiv = getTypeaheadSuggestion('om namah');
  assert.ok(shiv, 'om namah match');
  assert.equal(shiv.directHref, '/mantras/om-namah-shivaya/');
  assert.equal(shiv.category, 'मंत्र');

  const mrityunjaya = getTypeaheadSuggestion('mahamrityun');
  assert.ok(mrityunjaya, 'mahamrityunjaya match');
  assert.equal(mrityunjaya.directHref, '/mantras/mahamrityunjaya/');
});

test('wisdom pathways direct jumps provide guidance from life questions', () => {
  const fear = getTypeaheadSuggestion('gita on fear');
  assert.ok(fear, 'gita on fear match');
  assert.equal(fear.directHref, '/wisdom-pathways/gita-on-fear/');
  assert.equal(fear.category, 'मार्ग');

  const duty = getTypeaheadSuggestion('krishna on duty');
  assert.ok(duty, 'krishna on duty match');
  assert.equal(duty.directHref, '/wisdom-pathways/krishna-on-duty/');
  assert.equal(duty.category, 'मार्ग');
});

test('multi-suggestion query returns ranked distinct quick-picks', () => {
  const results = getTypeaheadSuggestions('gita', 4);
  assert.ok(results.length >= 2, 'should return multiple gita suggestions');
  const hrefs = results.map((r) => r.directHref);
  assert.equal(new Set(hrefs).size, hrefs.length, 'suggestions must have distinct targets');
  assert.ok(hrefs.includes('/scripture/bhagavadgita/'), 'includes Bhagavad Gita');
});
