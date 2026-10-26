/**
 * Shared clean-up for the accented Saṃhitā texts in DharmicData (scripts/seed-rigveda.mjs,
 * scripts/seed-atharvaveda.mjs).
 */
import Sanscript from '@indic-transliteration/sanscript';

/** Udātta and anudātta marks: every line of mantra text in the sources carries them, headings never do. */
export const ACCENT = /[॒॑]/;

/** Letters only, for "is there any text here" and for comparing texts. */
export const letters = (s) => s.replace(/[^ऀ-ॣ॰-ॿ]|[।॥]/g, '');

/**
 * The sources type visarga as a colon (नर॒:) and sometimes space out the in-word markers १ (kampa) and
 * ३ (pluti) that printed Saṃhitās place inside the word (स्व १ र्दृशीके → स्व१र्दृशीके).
 */
export function tidy(line) {
  return line
    .replace(/(?<=[ऀ-ॿ᳐-᳿])\s*:/g, 'ः')
    // Visarga belongs to the syllable, the accent mark after it: वि॒श्वत॑ः → वि॒श्वतः॑.
    .replace(/([॒॑])ः/g, 'ः$1')
    .replace(/(?<=[ऀ-ॣ᳐-᳿])\s+([१३])\s*(?=[ऀ-ॣ])/g, '$1');
}

/** IAST without accents or the in-word markers. */
export function iast(devanagari) {
  const plain = devanagari.replace(/[॒॑᳐-᳿]/g, '').replace(/\s*[०-९]+(?=\S)|(?<=\S)[०-९]+/g, '');
  return Sanscript.t(plain, 'devanagari', 'iast').replace(/l̤h/g, 'ḷh').replace(/l̤/g, 'ḷ').replace(/~/g, 'm̐');
}

/** A verse's lines as the library stores them: one line per half-verse, closed with ॥. */
export function verseText(lines) {
  const last = lines.length - 1;
  return lines.map((l, j) => (j === last ? `${l.replace(/[।|]\s*$/, '')} ॥` : l)).join('\n');
}
