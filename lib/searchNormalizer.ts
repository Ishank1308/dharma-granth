// Phonetic key shared by Devanagari, IAST, and casual Hinglish.
// The app lives in lib/, not src/lib/. This module is the normalizer the
// search box and the Tier-1 index both use.

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

const CLASS_NASAL: Record<string, string> = {};
function nasalClass(chars: string, nasal: string) {
  for (const ch of chars) CLASS_NASAL[ch] = nasal;
}
nasalClass('कखगघङ', 'ङ');
nasalClass('चछजझञ', 'ञ');
nasalClass('टठडढण', 'ण');
nasalClass('तथदधन', 'न');
nasalClass('पफबभम', 'म');
// Sibilants and ह: Hindi writes the anusvara as n (संसार / sansar).
nasalClass('यरलवशषसह', 'न');

/**
 * Rewrite anusvara and chandrabindu as the matching nasal, and drop dandas.
 * सं and सन् become the same string when the following consonant is dental.
 */
export function unifyAnusvara(value: string): string {
  if (!value) return '';
  const s = value.replace(/[।॥]/g, ' ');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch !== 'ं' && ch !== 'ँ') {
      out += ch;
      continue;
    }
    let j = i + 1;
    while (j < s.length && (s[j] === '़' || s[j] === '\u200c' || s[j] === '\u200d')) j++;
    out += `${CLASS_NASAL[s[j]] ?? 'म'}्`;
  }
  return out;
}

const VOWELS: Record<string, string> = {
  अ: 'a', आ: 'a', इ: 'i', ई: 'i', उ: 'u', ऊ: 'u', ऋ: 'ri', ॠ: 'ri', ऌ: 'l', ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au',
};
const MATRAS: Record<string, string> = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'ॄ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
};
const CONS: Record<string, string> = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'n',
  च: 'ch', छ: 'chh', ज: 'j', झ: 'jh', ञ: 'n',
  ट: 't', ठ: 'th', ड: 'd', ढ: 'dh', ण: 'n',
  त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm',
  य: 'y', र: 'r', ल: 'l', व: 'v', श: 'sh', ष: 'sh', स: 's', ह: 'h',
};

function transliterateDevanagari(input: string): string {
  const s = unifyAnusvara(input);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const digit = DEVANAGARI_DIGITS.indexOf(ch);
    if (digit >= 0) {
      out += String(digit);
      continue;
    }
    if (VOWELS[ch]) {
      out += VOWELS[ch];
      continue;
    }
    if (MATRAS[ch]) {
      out += MATRAS[ch];
      continue;
    }
    if (ch === '्' || ch === '़' || ch === 'ऽ' || ch === '\u200c' || ch === '\u200d') continue;
    if (ch === 'ः') {
      out += 'h';
      continue;
    }
    if (ch === 'ॐ') {
      out += 'om';
      continue;
    }
    const cons = CONS[ch];
    if (cons) {
      out += cons;
      const next = s[i + 1];
      if (!(next && (MATRAS[next] || next === '्'))) out += 'a';
      continue;
    }
    out += ch;
  }
  return out;
}

/** IAST letters become the same roman spellings a reader types (ś→sh, ṛ→ri, ṇ→n, long vowels short). */
function mapIast(value: string): string {
  return value
    .replace(/[śṣŚṢ]/g, 'sh')
    .replace(/[ṛṝṚṜ]/g, 'ri')
    .replace(/[ṇñṅṆÑṄ]/g, 'n')
    .replace(/[āĀ]/g, 'a')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ṃṁṂṀ]/g, 'm')
    .replace(/[ḥḤ]/g, 'h')
    .replace(/[ṭṬ]/g, 't')
    .replace(/[ḍḌ]/g, 'd')
    .replace(/[ḷḶ]/g, 'l');
}

/**
 * Hinglish folds. Aspirates collapse (kh, gh, ch, th, dh, ph, bh, sh) and
 * long roman vowels shorten (ee, oo). `ri` folds after `sh`, so कृष्ण, kṛṣṇa,
 * and krishna share one key (the `ri` inside krishna is the vowel, not a prefix).
 */
function foldLatin(value: string): string {
  let out = value.toLowerCase();
  out = out.replace(/aa/g, 'a').replace(/ee|ii/g, 'i').replace(/oo|uu/g, 'u');
  out = out.replace(/chh/g, 'c').replace(/shh/g, 's').replace(/ksh/g, 'ks');
  out = out.replace(/ch/g, 'c').replace(/sh/g, 's');
  out = out.replace(/bh/g, 'b').replace(/dh/g, 'd').replace(/th/g, 't').replace(/ph/g, 'p').replace(/kh/g, 'k').replace(/gh/g, 'g').replace(/jh/g, 'j');
  out = out.replace(/ri/g, 'r').replace(/w/g, 'v');
  out = out.replace(/[^a-z0-9]/g, '');
  // A nasal before a stop or sibilant is the same sound however it is written (saṃsāra, sansar, संसार).
  return out.replace(/[nm](?=[kgcjtdpbsvly])/g, 'n');
}

/** One phonetic key for Devanagari, IAST, and Hinglish. */
export function phoneticIndex(value: string): string {
  if (!value) return '';
  return foldLatin(mapIast(transliterateDevanagari(value)));
}

/** Public name for the single phonetic key shared by Devanagari, IAST, and Hinglish input. */
export const normalizePhonetic = phoneticIndex;
