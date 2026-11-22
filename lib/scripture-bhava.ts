import type { ScriptureCategory } from '@/data/types';
import type { PhotoId } from './scene-photos';

/**
 * The bhāva of each scripture: the feeling its verses are read in, which the picture behind
 * a verse should carry. A chapter's picture is still chosen by what the chapter is about
 * (lib/chapter-scenes.ts, lib/chapter-paintings.ts); the bhāva then
 *   1. keeps that picture only when it belongs to this scripture's feeling, and otherwise
 *      (or when the chapter has no picture at all) shows one of the scripture's own pictures,
 *      so a battle painting never sits behind an Upanishad and no chapter is left bare; every
 *      third chapter also opens on the scripture's own picture (see bhavaPhoto);
 *   2. colours the picture (app/styles/scene-photos.css, [data-bhava]); and
 *   3. chooses the light that moves over a picture that has none of its own.
 * Server-only: nothing here ships to the browser.
 */
export const BHAVA_IDS = ['shanta', 'vira', 'karuna', 'bhakti', 'shakti', 'shaiva', 'tejas', 'vairagya', 'dharma'] as const;
export type BhavaId = (typeof BHAVA_IDS)[number];
export type PhotoLight = 'embers' | 'mist' | 'glints' | 'dust' | 'stars' | 'none';

interface Bhava {
  /** The feeling, for readers of this file. */
  feeling: string;
  /** The light over a picture that has none of its own. */
  light: PhotoLight;
  /** Pictures that belong to this feeling; 'all' for the encyclopedic texts. */
  fits: readonly PhotoId[] | 'all';
  /** The scripture's own pictures, for a chapter whose picture does not fit or is missing. */
  home: readonly PhotoId[];
}

/** Fire, water, forest, sky and mountain: the elements belong to every feeling. */
const ELEMENTS: readonly PhotoId[] = ['forest', 'dawn', 'dusk', 'stars', 'cosmos', 'ocean', 'ganga', 'lotus', 'kailash', 'lamp', 'storm', 'yajna'];

export const BHAVAS: Record<BhavaId, Bhava> = {
  // शान्त: the stillness of the forest teaching (Upanishads, Vedanta, Yoga).
  shanta: { feeling: 'stillness', light: 'mist', fits: [...ELEMENTS, 'ashram', 'gurukul', 'manuscript'], home: ['gurukul', 'forest', 'dawn', 'stars'] },
  // वीर: resolve on the field of dharma (Gita, Mahabharata, Vidura).
  vira: { feeling: 'resolve', light: 'dust', fits: [...ELEMENTS, 'gita-chariot', 'kurukshetra', 'vishvarupa', 'palace', 'vyasa', 'manuscript', 'ashram'], home: ['gita-chariot', 'kurukshetra'] },
  // करुण: tenderness and longing (Ramayana, Ramcharitmanas).
  karuna: { feeling: 'tenderness', light: 'mist', fits: [...ELEMENTS, 'rama', 'ashram', 'lanka', 'palace', 'kishkindha', 'setu'], home: ['rama', 'ashram'] },
  // भक्ति: loving devotion (Bhagavata, Harivamsha, the Vishnu Puranas, the bhakti sutras, Vinaya Patrika).
  bhakti: {
    feeling: 'devotion',
    light: 'glints',
    fits: [...ELEMENTS, 'krishna', 'vrindavan', 'vishnu', 'vishvarupa', 'rama', 'temple', 'ashram', 'palace', 'pillar', 'kurukshetra', 'vyasa', 'manuscript', 'lanka'],
    home: ['krishna', 'vrindavan', 'lotus'],
  },
  // शक्ति: the fierce, protecting power of the Goddess.
  shakti: { feeling: 'power', light: 'embers', fits: [...ELEMENTS, 'devi', 'shiva', 'temple', 'ashram', 'palace'], home: ['devi'] },
  // शैव: awe and silence on the mountain (the Shiva texts).
  shaiva: { feeling: 'awe', light: 'mist', fits: [...ELEMENTS, 'shiva', 'devi', 'temple', 'ashram', 'manuscript', 'lanka'], home: ['shiva', 'kailash', 'stars'] },
  // तेज: the sacred fire and the wonder of dawn (Vedas, daily rites).
  tejas: { feeling: 'radiance', light: 'embers', fits: [...ELEMENTS, 'ashram', 'temple', 'palace'], home: ['yajna', 'dawn'] },
  // वैराग्य: dusk, impermanence and release (Garuda Purana).
  vairagya: { feeling: 'release', light: 'none', fits: [...ELEMENTS, 'vishnu', 'temple', 'ashram', 'manuscript', 'kurukshetra'], home: ['dusk', 'lamp', 'ganga'] },
  // धर्म: the wide, lamp-lit telling of the Puranas, Smritis and Sutras. Every picture fits.
  dharma: { feeling: 'telling', light: 'embers', fits: 'all', home: ['vyasa', 'manuscript', 'temple', 'lamp'] },
};

/**
 * A scripture whose own pictures differ from its bhāva's: the same devotion turns to Vishnu
 * in the Vishnu Purana and to Rama in the Vinaya Patrika. `fits` narrows the bhāva's list.
 */
const OWN: Record<string, { home: readonly PhotoId[]; fits?: readonly PhotoId[] }> = {
  // The Gita is one conversation: its chapters keep to Krishna and Arjuna, and to the images Krishna himself names.
  bhagavadgita: { home: ['gita-chariot', 'kurukshetra'], fits: ['gita-chariot', 'kurukshetra', 'vishvarupa', 'cosmos', 'dawn', 'dusk', 'forest', 'kailash', 'lotus', 'ganga', 'stars', 'lamp', 'ocean'] },
  mahabharata: { home: ['kurukshetra', 'vyasa', 'gita-chariot'] },
  viduraniti: { home: ['palace', 'vyasa'] },
  vishnupurana: { home: ['vishnu', 'lotus', 'krishna'] },
  matsyapuran: { home: ['vishnu', 'ocean', 'lotus'] },
  varahapuran: { home: ['vishnu', 'ocean', 'lotus'] },
  vamanpuran: { home: ['vishnu', 'lotus', 'temple'] },
  padmapuran: { home: ['vishnu', 'lotus', 'temple'] },
  naradapuran: { home: ['vishnu', 'lotus', 'temple'] },
  kalkipuran: { home: ['vishnu', 'storm', 'dawn'] },
  narasimhapuran: { home: ['pillar', 'vishnu', 'lotus'] },
  garudpurana: { home: ['dusk', 'vishnu', 'lamp', 'ganga'] },
  // Tulsidas's petition to Rama: the temple photographs give way to Rama himself.
  vinayapatrika: { home: ['rama', 'lamp', 'temple'], fits: ['rama', 'lotus', 'lamp', 'ganga', 'dawn'] },
  // One-chapter Upanishads keep the picture of their own teaching.
  ishavasya: { home: ['dawn'] },
  mandukya: { home: ['stars'] },
  yogasutra: { home: ['dawn', 'stars', 'forest'] },
  yogarasayanam: { home: ['dawn', 'stars', 'forest'] },
};

const BY_CATEGORY: Record<ScriptureCategory, BhavaId> = {
  veda: 'tejas',
  upanishad: 'shanta',
  vedanta: 'shanta',
  sutra: 'dharma',
  shakta: 'shakti',
  purana: 'dharma',
  itihasa: 'vira',
  smriti: 'dharma',
  tantra: 'shaiva',
  stotra: 'bhakti',
  other: 'dharma',
};

const BY_ID: Record<string, BhavaId> = {
  ramayana: 'karuna',
  ramcharitmanas: 'karuna',
  // Krishna, Vishnu and his avatars
  bhagavatapurana: 'bhakti',
  harivanshpuran: 'bhakti',
  brahmavaivartapuran: 'bhakti',
  vishnupurana: 'bhakti',
  narasimhapuran: 'bhakti',
  naradapuran: 'bhakti',
  padmapuran: 'bhakti',
  kalkipuran: 'bhakti',
  vamanpuran: 'bhakti',
  varahapuran: 'bhakti',
  matsyapuran: 'bhakti',
  naradabhaktisutra: 'bhakti',
  shandilyabhaktisutra: 'bhakti',
  // Shiva
  shivpurana: 'shaiva',
  lingapuran: 'shaiva',
  skandapuran: 'shaiva',
  vayupuran: 'shaiva',
  kurmapuran: 'shaiva',
  // The Goddess
  devibhagavat: 'shakti',
  markandeypuran: 'shakti',
  // Others
  garudpurana: 'vairagya',
  nityakarmakriya: 'tejas',
  yogasutra: 'shanta',
  brahmasutra: 'shanta',
  yogarasayanam: 'shanta',
};

export function scriptureBhava(id: string, category: ScriptureCategory): BhavaId {
  return BY_ID[id] ?? BY_CATEGORY[category] ?? 'dharma';
}

/**
 * The picture a chapter shows in this scripture's feeling.
 *   - Every third chapter, starting with the first, opens on one of the scripture's own pictures
 *     (Krishna in the Bhagavata, Shiva in the Shiva Purana), turning through them, so the text's
 *     own figure is never far away. A chapter with a hand-drawn scene (`curated`) is left alone.
 *   - Otherwise the chapter's own picture stays when it fits the feeling.
 *   - A picture that does not fit, or a chapter with none, takes one of the scripture's pictures.
 * `has` says which pictures have files.
 */
export function bhavaPhoto(
  scriptureId: string,
  bhava: BhavaId,
  chapterId: number,
  own: PhotoId | undefined,
  has: (id: string) => boolean,
  curated = false,
): PhotoId | undefined {
  const mine = OWN[scriptureId];
  const fits = mine?.fits ?? BHAVAS[bhava].fits;
  const home = (mine?.home ?? BHAVAS[bhava].home).filter(has);
  const ownFits = !!own && has(own) && (fits === 'all' || fits.includes(own));
  const turn = Math.abs(Math.trunc(chapterId) - 1);
  if (home.length === 0) return own && has(own) ? own : undefined;
  if (curated) return ownFits ? own : home[turn % home.length];
  if (turn % 3 === 0) return home[(turn / 3) % home.length];
  return ownFits ? own : home[turn % home.length];
}
