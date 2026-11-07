import { getTypeaheadSuggestion } from '../lib/search-typeahead';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error('❌ Assertion failed:', msg);
    process.exit(1);
  }
}

console.log('🧪 Testing Search Typeahead & Instant Jump predictions...');

// 1. Direct Citation Matches
const bg47 = getTypeaheadSuggestion('bg 2.47');
assert(!!bg47, 'bg 2.47 should return a match');
assert(bg47?.directHref === '/scripture/bhagavadgita/chapter/2/verse/47/', 'bg 2.47 href');
assert(bg47?.category === 'श्लोक', 'bg 2.47 category');

const gitaCh2 = getTypeaheadSuggestion('gita 2');
assert(!!gitaCh2, 'gita 2 should return a match');
assert(gitaCh2?.directHref === '/scripture/bhagavadgita/chapter/2/', 'gita chapter 2 href');
assert(gitaCh2?.category === 'अध्याय', 'gita chapter 2 category');

// 2. Action Commands
const tan = getTypeaheadSuggestion('> tan');
assert(!!tan, '> tan should return action match');
assert(tan?.completion === '> tanpura', '> tan completion');
assert(tan?.suffix === 'pura', '> tan suffix');

const med = getTypeaheadSuggestion('> med');
assert(!!med, '> med should return action match');
assert(med?.completion === '> meditation', '> med completion');

// 3. Famous Verses & Mantras
const karm = getTypeaheadSuggestion('कर्मण्ये');
assert(!!karm, 'कर्मण्ये should return shloka match');
assert(karm?.completion === 'कर्मण्येवाधिकारस्ते', 'कर्मण्ये completion');
assert(karm?.directHref === '/scripture/bhagavadgita/chapter/2/verse/47/', 'karm directHref');

const gayatri = getTypeaheadSuggestion('gayatri');
assert(!!gayatri, 'gayatri should return mantra match');
assert(gayatri?.directHref === '/mantras/gayatri-mantra/', 'gayatri directHref');

const shiv = getTypeaheadSuggestion('om namah');
assert(!!shiv, 'om namah should return mantra match');
assert(shiv?.directHref === '/mantras/om-namah-shivaya/', 'om namah shivaya directHref');

// 4. Core Scriptures
const isha = getTypeaheadSuggestion('isha');
assert(!!isha, 'isha should return scripture match');
assert(isha?.directHref === '/scripture/ishavasya/', 'isha directHref');

const ashta = getTypeaheadSuggestion('ashtavakra');
assert(!!ashta, 'ashtavakra should return scripture match');
assert(ashta?.directHref === '/ashtavakra/', 'ashtavakra directHref');

// 5. Concepts
const dharma = getTypeaheadSuggestion('dharma');
assert(!!dharma, 'dharma should return concept match');
assert(dharma?.directHref === '/concepts/dharma/', 'dharma directHref');

const moksha = getTypeaheadSuggestion('moksha');
assert(!!moksha, 'moksha should return concept match');
assert(moksha?.directHref === '/concepts/moksha/', 'moksha directHref');

// 6. Suffix completion validation
const bha = getTypeaheadSuggestion('bha');
assert(!!bha, 'bha should return prefix completion');
assert(bha?.completion === 'Bhagavad Gita', 'bha completion');
assert(bha?.suffix === 'gavad Gita', 'bha suffix');

console.log('✅ All search typeahead & instant jump assertions passed successfully!');
