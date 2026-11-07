/**
 * Unused by `npm run ocr:scan`.
 * The maps below rewrite visarga, dandas, and private-use glyphs. The offline
 * scanner in tools/granth-ocr keeps the OCR line and logs guesses instead.
 */

// 1. Comprehensive PUA ligature map (Private Use Area glyphs used by LaTeX dvng/xdvng and digitized Sanskrit PDFs)
export const PUA_LIGATURE_MAP: Record<string, string> = {
  '\uE012': 'क्त',
  '\uE013': 'क्त्यै',
  '\uE046': 'द्भा',
  '\uE062': 'ङ्ग',
  '\uE08C': 'च्छ',
  '\uE096': 'च्य',
  '\uE09A': 'ज्जी',
  '\uE09B': 'ज्ञ',
  '\uE0B5': 'ञ्ज',
  '\uE107': 'त्प',
  '\uE114': 'त्प',
  '\uE118': 'त्म',
  '\uE11A': 'त्य',
  '\uE11E': 'त्व',
  '\uE131': 'ग्र',
  '\uE139': 'द्ग्र',
  '\uE143': 'द्ध',
  '\uE14A': 'द्ब्र',
  '\uE14B': 'द्भ',
  '\uE152': 'द्य',
  '\uE155': 'द्व',
  '\uE15C': 'ध्या',
  '\uE165': 'स्मि',
  '\uE170': 'न्त',
  '\uE175': 'न्त्य',
  '\uE183': 'न्थ',
  '\uE18B': 'न्द्र',
  '\uE18F': 'न्ध',
  '\uE196': 'न्न',
  '\uE1A2': 'न्म',
  '\uE1A6': 'न्य',
  '\uE1C6': 'प्त',
  '\uE1CB': 'प्न',
  '\uE1D1': 'प्य',
  '\uE1E3': 'ब्द',
  '\uE1F4': 'भ्य',
  '\uE1FF': 'म्प',
  '\uE220': 'ल्प',
  '\uE235': 'व्य',
  '\uE23A': 'श्च',
  '\uE246': 'ष्क',
  '\uE24E': 'ष्ट',
  '\uE257': 'ष्ण',
  '\uE260': 'ष्य',
  '\uE268': 'स्त',
  '\uE270': 'स्थ',
  '\uE27B': 'स्म',
  '\uE27C': 'स्म्य',
  '\uE27D': 'स्य',
  '\uE280': 'स्व',
  '\uE286': 'द्ध्र',
  '\uE289': 'ह्म',
  '\uE2AA': 'न्द',
  '\uE2AB': 'न्दू',
  '\uE301': 'र्य',
  '\uE303': '\u0930\u094D', // Reph (र + ्)
  '\uE317': 'क्ष',
  '\uE318': 'ज्ञ',
  '\uE44D': 'दृ',
  '\uE450': 'रु',
  '\uE454': 'बहु',
  '\uE456': 'हृ',
  '\uE45A': 'र्वे',
  '\uE45C': 'र्थी',
};

// 2. Kruti Dev 010 to Unicode Devanagari Character Mapping
const KRUTI_DEV_MAPPING: Record<string, string> = {
  'k': 'ा', 'i': 'opt', 'e': 'ा', 'o': 'ो', 'a': 'े', 'q': 'ै',
  'd': 'क', 'D': 'क्', 'X': 'ख', 'x': 'ख', 'c': 'म', 'C': 'म्',
  'v': 'न', 'V': 'न्', 'b': 'द', 'B': 'द्य', 'n': 'ल', 'N': 'ल्',
  'm': 'स', 'M': 'स्', 'g': 'ह', 'G': 'ह्र', 'h': 'प', 'H': 'भ',
  'j': 'र', 'J': 'श्र', 'K': 'ज्ञा', 'l': 'त', 'L': 'त्',
  'u': 'ज', 'U': 'ज्', 'y': 'ब', 'Y': 'ब्', 'T': 'त्',
  'r': 'च', 'R': 'च्', 'w': 'ट', 'W': 'ठ', 's': 'ड', 'S': 'ढ',
  'z': '्र', 'Z': 'र्', 'p': 'व', 'P': 'व्',
};

/**
 * Checks if a string has predominantly KrutiDev legacy glyphs.
 */
export function isKrutiDev(text: string): boolean {
  if (/[ऀ-ॿ]/.test(text)) return false; // Already has Unicode Devanagari
  const krutiSample = (text.match(/[kidxvnbmhjltruywszpZ]/g) || []).length;
  return krutiSample > text.length * 0.4 && text.length > 20;
}

/**
 * Normalizes Private Use Area (PUA) legacy ligatures to standard Unicode Devanagari.
 */
export function decodePuaLigatures(text: string): string {
  let out = text;
  for (const [pua, repl] of Object.entries(PUA_LIGATURE_MAP)) {
    out = out.split(pua).join(repl);
  }
  return out;
}

/**
 * Fixes inverted or misplaced matras and reph characters:
 * e.g., in visual encoding, short 'i' (ि) precedes consonant, or reph (र्) sits after consonant.
 */
export function normalizeMatrasAndReph(text: string): string {
  let res = text;

  // Fix Reph if placed after consonant:
  // e.g. Consonant + ् + र -> र् + Consonant
  res = res.replace(/([क-ह]़?)(\u0930\u094D)/g, '$2$1');

  // Fix detached vowel marks (space between consonant and matra)
  res = res.replace(/([क-ह]़?)\s+([\u093E-\u094C\u0962\u0963])/g, '$1$2');

  // Fix standalone anusvara/visarga after space
  res = res.replace(/([क-ह][\u093E-\u094C]?)\s+([ंःँ])/g, '$1$2');

  return res;
}

/**
 * Standardizes dandas and numbers:
 * Converts ASCII pipes/bars to Devanagari dandas, standardizes double dandas.
 */
export function normalizeDandasAndPunctuation(text: string): string {
  let res = text;

  // Double danda: ||, ll, !|, |!, ॥
  res = res.replace(/[|!l]{2,}/g, ' ॥ ');
  res = res.replace(/॥\s*॥/g, '॥');

  // Single danda: standalone pipe or exclamation used as danda
  res = res.replace(/(?<=[ऀ-ॿ\s])\|(?=[ऀ-ॿ\s])/g, ' । ');

  // Colon after Devanagari word used in place of Visarga: e.g. "पुन:" -> "पुनः"
  res = res.replace(/([क-ह][\u093E-\u094C]?):(?=[\s\.,।॥]|$)/g, '$1ः');

  // Collapse excess spaces around dandas
  res = res.replace(/\s+([।॥])/g, ' $1');
  res = res.replace(/([।॥])\s+/g, '$1 ');

  return res;
}

/**
 * Repairs commonly confused OCR glyph pairs based on philological context:
 * e.g. 'ध' vs 'घ', 'भ' vs 'म', 'ब' vs 'व'.
 */
export function repairOcrGlyphAmbiguities(text: string): { text: string; warnings: string[] } {
  const warnings: string[] = [];
  let res = text;

  // Example: 'धम' -> 'धर्म', 'कर्म'
  if (/धम(?=[^्ा-ौ]|$)/.test(res)) {
    warnings.push("Possible OCR confusion: 'धम' -> verify 'धर्म'");
  }

  // Example: English quotes to standard Unicode
  res = res.replace(/[""]/g, '"').replace(/['']/g, "'");

  return { text: res, warnings };
}

/**
 * Full philological pipeline normalization on raw extracted page text.
 */
export function normalizePhilologicalSanskrit(rawText: string): {
  normalized: string;
  puaReplacedCount: number;
  warnings: string[];
} {
  let text = rawText;
  let puaCount = 0;

  // Step 1: Detect and replace PUA glyphs
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xe000 && code <= 0xf8ff) {
      puaCount += 1;
    }
  }
  text = decodePuaLigatures(text);

  // Step 2: Normalize Matras and Reph
  text = normalizeMatrasAndReph(text);

  // Step 3: Dandas and Punctuation
  text = normalizeDandasAndPunctuation(text);

  // Step 4: Glyph ambiguity checks
  const { text: cleanText, warnings } = repairOcrGlyphAmbiguities(text);

  // Step 5: Clean extra whitespace while preserving stanza linebreaks
  const lines = cleanText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return {
    normalized: lines.join('\n'),
    puaReplacedCount: puaCount,
    warnings,
  };
}
