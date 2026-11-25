import type { ScriptureCategory } from '@/data/types';
import type { PhotoId } from './scene-photos';
import { AVAILABLE_PHOTOS } from './scene-photos.generated';

/**
 * The picture facing each scripture's title page when its book opens on the scripture page
 * (app/components/vibe/ScriptureBook): a frontispiece, as in a printed devotional edition.
 * Only the licensed photos and paintings already in app/styles/photos/ are used (credits on
 * /sources/#picture-credits); a text with no fitting picture, or one whose file is missing,
 * shows its emblem on the page instead. Server-only: nothing here ships to the browser.
 */
const BY_CATEGORY: Record<ScriptureCategory, PhotoId> = {
  veda: 'yajna',
  upanishad: 'forest',
  vedanta: 'gurukul',
  sutra: 'manuscript',
  shakta: 'devi',
  purana: 'vyasa',
  itihasa: 'kurukshetra',
  smriti: 'manuscript',
  tantra: 'cosmos',
  stotra: 'lamp',
  other: 'lotus',
};

const BY_ID: Record<string, PhotoId> = {
  // The two epics and the Gita: the classical paintings of their own scenes.
  bhagavadgita: 'gita-chariot',
  mahabharata: 'kurukshetra',
  ramayana: 'ashram',
  ramcharitmanas: 'rama',
  viduraniti: 'palace',
  // Shiva
  shivpurana: 'shiva',
  lingapuran: 'shiva',
  skandapuran: 'shiva',
  shivasamhita: 'kailash',
  // Krishna and Vishnu
  bhagavatapurana: 'krishna',
  harivanshpuran: 'vrindavan',
  brahmavaivartapuran: 'krishna',
  vishnupurana: 'vishnu',
  matsyapuran: 'vishnu',
  kurmapuran: 'vishnu',
  varahapuran: 'vishnu',
  vamanpuran: 'vishnu',
  padmapuran: 'lotus',
  narasimhapuran: 'pillar',
  // The Goddess (the Markandeya Purana holds the Devi Mahatmya)
  devibhagavat: 'devi',
  markandeypuran: 'devi',
  durgasaptashati: 'devi',
  // Upanishads with a picture of their own story
  katha: 'dusk',
  ishavasya: 'dawn',
  mandukya: 'stars',
  // Others
  rigveda: 'dawn',
  samaveda: 'ganga',
  garudpurana: 'dusk',
  brahmasutra: 'gurukul',
  vivekchudamani: 'gurukul',
  yogasutra: 'dawn',
  naradabhaktisutra: 'lamp',
  shandilyabhaktisutra: 'lamp',
  vinayapatrika: 'rama',
};

const available = new Set<string>(AVAILABLE_PHOTOS);

/** The frontispiece picture for a scripture, only when its file exists. */
export function bookFrontispiece(id: string, category: ScriptureCategory): PhotoId | undefined {
  const photo = BY_ID[id] ?? BY_CATEGORY[category] ?? BY_CATEGORY.other;
  return available.has(photo) ? photo : undefined;
}
