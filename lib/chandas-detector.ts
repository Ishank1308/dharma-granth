/**
 * Classical & Vedic Sanskrit Chandas (Metrical Prosody) Detector
 * (छन्दोऽनुशासनम् · Prosody Analysis)
 *
 * Lightweight, zero-dependency analyzer counting Devanagari and IAST
 * vowel syllables (akṣaras) per pāda to identify classical and Vedic meters:
 * - अनुष्टुप् (Anuṣṭubh) · 32 syllables (8 × 4) — ~90% of Gita, Ramayana, Puranas
 * - त्रिष्टुप् (Triṣṭubh) · 44 syllables (11 × 4) — Gita 2.5, 2.8, 11th chapter
 * - जगती (Jagatī) · 48 syllables (12 × 4)
 * - गायत्री (Gāyatrī) · 24 syllables (8 × 3) — Vedic hymns & Gayatri Mantra
 * - बृहती (Bṛhatī) · 36 syllables (8 + 8 + 12 + 8)
 * - पङ्क्ति (Paṅkti) · 40 syllables (8 × 5 or 10 × 4)
 * - गद्य मन्त्र (Prose) · Upanishadic / Vedic prose
 */

export interface ChandasInfo {
  name: string;
  nameEn: string;
  syllables: number;
  padasCount: number;
  description: string;
  descriptionHi: string;
}

/**
 * Count Sanskrit akṣaras (vowel-bearing syllables) in Devanagari or IAST text.
 */
export function countSanskritAksharas(text: string): number {
  if (!text) return 0;
  // Strip punctuation, digits, dandas, and spaces
  const clean = text.replace(/[।॥0-9०-९\s,;.!?'"()\-–—]/g, '');
  if (!clean) return 0;

  let count = 0;
  const isDeva = /[\u0900-\u097F]/.test(clean);

  if (isDeva) {
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);

      // Independent vowels: अ to औ (0x0904 - 0x0914)
      if (code >= 0x0904 && code <= 0x0914) {
        count++;
      }
      // Consonants: क to ह (0x0915 - 0x0939), plus nukta consonants (0x0958 - 0x095F)
      else if ((code >= 0x0915 && code <= 0x0939) || (code >= 0x0958 && code <= 0x095f)) {
        // If followed by virama (0x094D / ्), this consonant does not form a vowel syllable
        const nextCode = clean.charCodeAt(i + 1);
        if (nextCode !== 0x094d) {
          count++;
        }
      }
      // Vowel signs (matras: 0x093E to 0x094C) modify the preceding consonant and do not add extra syllables
    }
    return count;
  }

  // Fallback for IAST / Roman transliterated Sanskrit
  const iastVowels = clean.match(/[aāiīuūṛṝḷḹeaiou]|ai|au/gi);
  return iastVowels ? iastVowels.length : 0;
}

/**
 * Detect metrical classification (Chandas) based on Sanskrit shloka text.
 */
export function detectChandas(sanskritText?: string): ChandasInfo | null {
  if (!sanskritText || sanskritText.trim().length === 0) return null;

  const totalSyllables = countSanskritAksharas(sanskritText);
  if (totalSyllables < 12) return null;

  // Split into pādas/hemistichs by dandas or newlines to determine pāda structure
  const lines = sanskritText
    .split(/[।॥\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const padasCount = lines.length >= 2 ? lines.length : 4;

  // 1. Anuṣṭubh (अनुष्टुप्): 32 syllables (4 × 8), tolerant of 30-34 syllables
  if (totalSyllables >= 30 && totalSyllables <= 34) {
    return {
      name: 'अनुष्टुप्',
      nameEn: 'Anuṣṭubh',
      syllables: totalSyllables,
      padasCount: 4,
      description: 'Classic 32-syllable meter (4 pādas of 8 syllables). The signature cadence of the Bhagavad Gita & Epics.',
      descriptionHi: '32 वर्णों का शास्त्रीय छन्द (8 वर्ण प्रति पाद)। श्रीमद्भगवद्गीता व रामायण का प्रधान छन्द।',
    };
  }

  // 2. Triṣṭubh (त्रिष्टुप्): 44 syllables (4 × 11), tolerant of 42-46 syllables
  if (totalSyllables >= 42 && totalSyllables <= 46) {
    return {
      name: 'त्रिष्टुप्',
      nameEn: 'Triṣṭubh',
      syllables: totalSyllables,
      padasCount: 4,
      description: 'Vedic & classical 44-syllable heroic meter (4 pādas of 11 syllables). Used in intense philosophical dialogues.',
      descriptionHi: '44 वर्णों का छन्द (11 वर्ण प्रति पाद)। गूढ़ संवादों व विश्वरूप दर्शन में प्रयुक्त।',
    };
  }

  // 3. Jagatī (जगती): 48 syllables (4 × 12), tolerant of 47-50 syllables
  if (totalSyllables >= 47 && totalSyllables <= 50) {
    return {
      name: 'जगती',
      nameEn: 'Jagatī',
      syllables: totalSyllables,
      padasCount: 4,
      description: 'Lyrical 48-syllable meter (4 pādas of 12 syllables). Flowing and melodious cadence.',
      descriptionHi: '48 वर्णों का छन्द (12 वर्ण प्रति पाद)। प्रवाहमयी व गेय वृत्ति।',
    };
  }

  // 4. Gāyatrī (गायत्री): 24 syllables (3 × 8), tolerant of 22-26 syllables
  if (totalSyllables >= 22 && totalSyllables <= 26) {
    return {
      name: 'गायत्री',
      nameEn: 'Gāyatrī',
      syllables: totalSyllables,
      padasCount: 3,
      description: 'Sacred 24-syllable Vedic meter (3 pādas of 8 syllables). The mother of Vedic mantras.',
      descriptionHi: '24 वर्णों का वैदिक छन्द (8 वर्ण प्रति पाद, 3 पाद)। वेदों का परम पवित्र छन्द।',
    };
  }

  // 5. Bṛhatī (बृहती): 36 syllables (tolerant 35-38)
  if (totalSyllables >= 35 && totalSyllables <= 38) {
    return {
      name: 'बृहती',
      nameEn: 'Bṛhatī',
      syllables: totalSyllables,
      padasCount: 4,
      description: 'Vedic 36-syllable meter with expansive resonance.',
      descriptionHi: '36 वर्णों का वैदिक छन्द।',
    };
  }

  // 6. Paṅkti (पङ्क्ति): 40 syllables (tolerant 39-41)
  if (totalSyllables >= 39 && totalSyllables <= 41) {
    return {
      name: 'पङ्क्ति',
      nameEn: 'Paṅkti',
      syllables: totalSyllables,
      padasCount: 4,
      description: 'Vedic 40-syllable rhythmic meter.',
      descriptionHi: '40 वर्णों का वैदिक छन्द।',
    };
  }

  // 7. Unmetered prose or irregular mantras (e.g. Upanishads)
  if (totalSyllables > 50 || lines.length <= 1) {
    return {
      name: 'गद्य मन्त्र',
      nameEn: 'Prose',
      syllables: totalSyllables,
      padasCount: 1,
      description: 'Continuous prose mantra / Vedic contemplative passage.',
      descriptionHi: 'गद्यात्मक मन्त्र अथवा उपनिषद् सूत्र।',
    };
  }

  return null;
}
