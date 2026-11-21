/**
 * Watercolour artwork for each family of texts, the same paintings the website uses behind its verse cards
 * and home hero (public/verse-bg/*.webp, 800 × 533, about 25 KB each). The app lays them over a book's cover
 * colours, so every Upanishad shares the forest, every Purana the river and temple, and so on.
 *
 * Bundled, so they show offline. Keep in step with the website's files when those are repainted.
 */
import type { ImageSourcePropType } from 'react-native';

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
