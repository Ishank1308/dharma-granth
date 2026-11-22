/**
 * Watercolour artwork for each family of texts, the same paintings the website uses behind its verse cards
 * and home hero (public/verse-bg/*.webp, 800 × 533, about 25 KB each). The app lays them over a book's cover
 * colours, so every Upanishad shares the forest, every Purana the river and temple, and so on.
 *
 * Bundled, so they show offline. Keep in step with the website's files when those are repainted.
 */
import type { ImageSourcePropType } from 'react-native';

import { emblemFor, type EmblemName } from './emblems';

const ART: Record<string, ImageSourcePropType> = {
  veda: require('../../../assets/art/veda.webp'),
  upanishad: require('../../../assets/art/upanishad.webp'),
  itihasa: require('../../../assets/art/itihasa.webp'),
  purana: require('../../../assets/art/purana.webp'),
  smriti: require('../../../assets/art/smriti.webp'),
  stotra: require('../../../assets/art/stotra.webp'),
  other: require('../../../assets/art/other.webp'),
  default: require('../../../assets/art/default.webp'),
};

/** The painting for a book's category; Tantra & Yoga and the rest share the website's default wash. */
export function artFor(category: string): ImageSourcePropType {
  return ART[category] ?? ART.default;
}

/**
 * The painting pasted on a book's cover (src/components/art/cover-face). Books without one carry their gilt
 * emblem in the arch instead.
 */
const PLATES: Record<string, ImageSourcePropType> = {
  bhagavadgita: require('../../../assets/covers/plates/bhagavadgita.webp'),
  mahabharata: require('../../../assets/covers/plates/mahabharata.webp'),
  ramayana: require('../../../assets/covers/plates/ramayana.webp'),
  ramcharitmanas: require('../../../assets/covers/plates/ramcharitmanas.webp'),
  vinayapatrika: require('../../../assets/covers/plates/vinayapatrika.webp'),
  bhagavatapurana: require('../../../assets/covers/plates/bhagavatapurana.webp'),
  harivanshpuran: require('../../../assets/covers/plates/harivanshpuran.webp'),
  brahmavaivartapuran: require('../../../assets/covers/plates/brahmavaivartapuran.webp'),
  shivpurana: require('../../../assets/covers/plates/shivpurana.webp'),
  lingapuran: require('../../../assets/covers/plates/lingapuran.webp'),
  shivaswarodaya: require('../../../assets/covers/plates/shivaswarodaya.webp'),
  skandapuran: require('../../../assets/covers/plates/skandapuran.webp'),
  vishnupurana: require('../../../assets/covers/plates/vishnupurana.webp'),
  mahanarayana: require('../../../assets/covers/plates/mahanarayana.webp'),
  narasimhapuran: require('../../../assets/covers/plates/narasimhapuran.webp'),
  matsyapuran: require('../../../assets/covers/plates/matsyapuran.webp'),
  kurmapuran: require('../../../assets/covers/plates/kurmapuran.webp'),
  varahapuran: require('../../../assets/covers/plates/varahapuran.webp'),
  vamanpuran: require('../../../assets/covers/plates/vamanpuran.webp'),
  kalkipuran: require('../../../assets/covers/plates/kalkipuran.webp'),
  garudpurana: require('../../../assets/covers/plates/garudpurana.webp'),
  padmapuran: require('../../../assets/covers/plates/padmapuran.webp'),
  brahmapuran: require('../../../assets/covers/plates/brahmapuran.webp'),
  brahmandpuran: require('../../../assets/covers/plates/brahmandpuran.webp'),
  markandeypuran: require('../../../assets/covers/plates/markandeypuran.webp'),
  devibhagavat: require('../../../assets/covers/plates/devibhagavat.webp'),
  durgasaptashati: require('../../../assets/covers/plates/durgasaptashati.webp'),
  naradapuran: require('../../../assets/covers/plates/naradapuran.webp'),
  naradabhaktisutra: require('../../../assets/covers/plates/naradabhaktisutra.webp'),
  rigveda: require('../../../assets/covers/plates/rigveda.webp'),
  samaveda: require('../../../assets/covers/plates/samaveda.webp'),
  vivekchudamani: require('../../../assets/covers/plates/vivekchudamani.webp'),
  brahmasutra: require('../../../assets/covers/plates/brahmasutra.webp'),
};

export interface CoverArt {
  emblem: EmblemName;
  plate?: ImageSourcePropType;
}

/** What goes in the arch on a book's cover: its painting if it has one, and its emblem either way. */
export function coverArt(id: string, category: string): CoverArt {
  return { emblem: emblemFor(id, category), plate: PLATES[id] };
}
