/**
 * Reference-jump settings for texts beyond the Gita, Katha, Ashtavakra and Rigveda parsers in
 * lib/search-citation.ts. Which verses exist comes from lib/citation-map.generated.ts
 * (scripts/build-citation-map.ts), so a jump is only offered for a verse in the library.
 * Client-safe: no node imports.
 */

export interface CitationScheme {
  id: string;
  title: string;
  titleHi: string;
  /** Lower-case, as typed after search cleaning (Devanagari digits already ASCII). */
  aliases: string[];
  /**
   * Traditional three-part numbering folded into library chapters, e.g. Mundaka 3.1.1:
   * three mundakas of two khandas each are library chapters 1–6.
   */
  groups?: number[];
  /** Taittiriya-style "2.4.1": the third number is a part of anuvaka 4, which is one library verse. */
  subPartsInVerse?: boolean;
}

export const CITATION_SCHEMES: CitationScheme[] = [
  {
    id: 'bhagavadgita', title: 'Bhagavad Gita', titleHi: 'भगवद्गीता',
    aliases: ['bg', 'gita', 'geeta', 'geetha', 'bhagavad gita', 'bhagavadgita', 'bhagavad geeta', 'bhagwat geeta', 'bhagwat gita', 'bhagvad gita', 'bhagvat gita', 'bhagavat gita', 'shrimad bhagavad gita', 'srimad bhagavad gita', 'गीता', 'भगवद्गीता', 'श्रीमद्भगवद्गीता', 'भगवत गीता', 'श्रीमद् भगवद्गीता'],
  },
  {
    id: 'ishavasya', title: 'Isha Upanishad', titleHi: 'ईशावास्योपनिषद्',
    aliases: ['isha', 'isa', 'ishavasya', 'isavasya', 'ishopanishad', 'isopanishad', 'isha upanishad', 'ishavasya upanishad', 'ईश', 'ईशावास्य', 'ईशोपनिषद्', 'ईशावास्योपनिषद्'],
  },
  {
    id: 'kena', title: 'Kena Upanishad', titleHi: 'केनोपनिषद्',
    aliases: ['kena', 'kena upanishad', 'kenopanishad', 'केन', 'केनोपनिषद्'],
  },
  {
    id: 'katha', title: 'Katha Upanishad', titleHi: 'कठोपनिषद्',
    aliases: ['katha', 'katha upanishad', 'kathopanishad', 'kathaka', 'कठ', 'कठोपनिषद्'],
    groups: [3, 3],
  },
  {
    id: 'prashna', title: 'Prashna Upanishad', titleHi: 'प्रश्नोपनिषद्',
    aliases: ['prashna', 'prasna', 'prashna upanishad', 'prashnopanishad', 'प्रश्न', 'प्रश्नोपनिषद्'],
  },
  {
    id: 'mundaka', title: 'Mundaka Upanishad', titleHi: 'मुण्डकोपनिषद्',
    aliases: ['mundaka', 'mundaka upanishad', 'mundakopanishad', 'मुण्डक', 'मुंडक', 'मुण्डकोपनिषद्'],
    groups: [2, 2, 2],
  },
  {
    id: 'mandukya', title: 'Mandukya Upanishad', titleHi: 'माण्डूक्योपनिषद्',
    aliases: ['mandukya', 'mandukya upanishad', 'mandukyopanishad', 'माण्डूक्य', 'माण्डूक्योपनिषद्'],
  },
  {
    id: 'taittiriya', title: 'Taittiriya Upanishad', titleHi: 'तैत्तिरीयोपनिषद्',
    aliases: ['taittiriya', 'taittiriya upanishad', 'taittiriyopanishad', 'तैत्तिरीय', 'तैत्तिरीयोपनिषद्'],
    subPartsInVerse: true,
  },
  {
    id: 'aitareya', title: 'Aitareya Upanishad', titleHi: 'ऐतरेयोपनिषद्',
    aliases: ['aitareya', 'aitareya upanishad', 'aitareyopanishad', 'ऐतरेय', 'ऐतरेयोपनिषद्'],
    groups: [3, 1, 1],
  },
  {
    id: 'shvetashvatara', title: 'Shvetashvatara Upanishad', titleHi: 'श्वेताश्वतरोपनिषद्',
    aliases: ['shvetashvatara', 'svetasvatara', 'shvetashvatara upanishad', 'svetasvatara upanishad', 'श्वेताश्वतर', 'श्वेताश्वतरोपनिषद्'],
  },
  {
    id: 'chandogya', title: 'Chandogya Upanishad', titleHi: 'छान्दोग्योपनिषद्',
    aliases: ['chandogya', 'chhandogya', 'chandogya upanishad', 'chandogyopanishad', 'छान्दोग्य', 'छांदोग्य', 'छान्दोग्योपनिषद्'],
  },
  {
    id: 'brihadaranyaka', title: 'Brihadaranyaka Upanishad', titleHi: 'बृहदारण्यकोपनिषद्',
    aliases: ['brihadaranyaka', 'brhadaranyaka', 'brihadaranyak', 'brihadaranyaka upanishad', 'बृहदारण्यक', 'बृहदारण्यकोपनिषद्'],
  },
  {
    id: 'yogasutra', title: 'Yoga Sutras of Patanjali', titleHi: 'पातञ्जल योगसूत्र',
    aliases: ['ys', 'yoga sutra', 'yoga sutras', 'yogasutra', 'yogasutras', 'patanjali yoga sutra', 'patanjali', 'योगसूत्र', 'योग सूत्र', 'पातञ्जल योगसूत्र'],
  },
  {
    id: 'brahmasutra', title: 'Brahma Sutras', titleHi: 'ब्रह्मसूत्र',
    aliases: ['brahma sutra', 'brahma sutras', 'brahmasutra', 'brahmasutras', 'ब्रह्मसूत्र', 'ब्रह्म सूत्र'],
  },
  {
    id: 'naradabhaktisutra', title: 'Narada Bhakti Sutras', titleHi: 'नारद भक्ति सूत्र',
    aliases: ['nbs', 'narada bhakti sutra', 'narada bhakti sutras', 'narada', 'नारद भक्ति सूत्र', 'नारदभक्तिसूत्र'],
  },
  {
    id: 'vivekchudamani', title: 'Vivekachudamani', titleHi: 'विवेकचूडामणि',
    aliases: ['vivekachudamani', 'vivekchudamani', 'viveka chudamani', 'विवेकचूडामणि', 'विवेकचूडामणिः'],
  },
];
