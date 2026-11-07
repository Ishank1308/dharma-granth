/**
 * Curated Offline Reading Packs for Dharma Granth (dharmagranth.dev)
 * 
 * Enables proactive, single-click downloads of entire scriptures and thematic
 * anthologies for offline retreats, flights, pilgrimages, and low-connectivity environments.
 */

import type { OfflineReadingPack } from '@/lib/study/types';

export const OFFLINE_READING_PACKS: OfflineReadingPack[] = [
  {
    id: 'pack-gita-complete',
    title: 'Bhagavad Gita Complete',
    titleHi: 'श्रीमद्भगवद्गीता सम्पूर्ण संग्रह',
    scriptureIds: ['bhagavadgita'],
    description: 'All 18 chapters and 700 verses with word-by-word meanings, Hindi explanation, and scientific reflections.',
    totalVerses: 700,
    estimatedBytes: 1_400_000, // ~1.4 MB
    versionHash: 'gita-v2-complete',
    isComplete: false,
  },
  {
    id: 'pack-mukhya-upanishads',
    title: 'Ten Principal Upanishads',
    titleHi: 'दश मुख्य उपनिषद् संग्रह',
    scriptureIds: [
      'ishavasya',
      'kena',
      'katha',
      'prashna',
      'mundaka',
      'mandukya',
      'taittiriya',
      'aitareya',
      'chandogya',
      'brihadaranyaka',
    ],
    description: 'The supreme foundation of Vedanta philosophy: from Isha to Brihadaranyaka with core mantras and translations.',
    totalVerses: 1040,
    estimatedBytes: 3_800_000, // ~3.8 MB
    versionHash: 'upanishads-mukhya-v2',
    isComplete: false,
  },
  {
    id: 'pack-yoga-advaita',
    title: 'Yoga & Non-Dual Wisdom',
    titleHi: 'योग एवं अद्वैत दर्शन संग्रह',
    scriptureIds: [
      'yogavasishtha',
      'shivasamhita',
      'vivekchudamani',
      'yogarasayanam',
    ],
    description: 'Master treatises on consciousness, mind control, and transcendental liberation (Moksha).',
    totalVerses: 1680,
    estimatedBytes: 4_500_000, // ~4.5 MB
    versionHash: 'yoga-advaita-v2',
    isComplete: false,
  },
  {
    id: 'pack-bhakti-sutras',
    title: 'Bhakti & Devotion Classics',
    titleHi: 'भक्ति सूत्र एवं विनय पत्रिका',
    scriptureIds: [
      'naradabhaktisutra',
      'shandilyabhaktisutra',
      'vinayapatrika',
    ],
    description: 'The nectar of divine love: Narada & Shandilya aphorisms paired with Goswami Tulsidas’s soulful prayers.',
    totalVerses: 450,
    estimatedBytes: 1_200_000, // ~1.2 MB
    versionHash: 'bhakti-v2-complete',
    isComplete: false,
  },
  {
    id: 'pack-ethics-dharma',
    title: 'Dharma, Ethics & Daily Wisdom',
    titleHi: 'धर्म नीति एवं व्यावहारिक ज्ञान',
    scriptureIds: [
      'viduraniti',
      'manusmriti',
      'durgasaptashati',
    ],
    description: 'Classic treatises on statecraft, family ethics, moral discernment, and sacred strength.',
    totalVerses: 1850,
    estimatedBytes: 4_200_000, // ~4.2 MB
    versionHash: 'dharma-ethics-v2',
    isComplete: false,
  },
];
