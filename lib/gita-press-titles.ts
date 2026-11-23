// English cover names follow the local Gita Press editions when that title is
// present in the source collection; all other scriptures use the catalogue name.
export const GITA_PRESS_COVER_TITLES: Readonly<Record<string, string>> = {
  ashtavakra: 'Ashtavakra Gita',
  bhagavadgita: 'Shrimad Bhagavad Gita',
  ishavasya: 'Ishavashya Upanishad',
  kena: 'Keno Upanishad',
  mundaka: 'Mundako Upanishad',
  chandogya: 'Chandogyo Upanishad',
  brihadaranyaka: 'Brihadaranyak Upanishad',
  shvetashvatara: 'Shwetashwatara Upanishad',
  taittiriya: 'Taitiriya Upanishad',
  prashna: 'Prashnopanishad',
  mahabharata: 'Mahabharat',
  garudpurana: 'Garuda Puran',
  harivanshpuran: 'Harivansh Puran',
  naradapuran: 'Narad Puran',
  padmapuran: 'Padma Puran',
  brahmasutra: 'Vedant Darshan (Brahma Sutra)',
  vivekchudamani: 'Vivek Chudamani',
  viduraniti: 'Vidura Niti',
  vinayapatrika: 'Vinaya Patrika',
};

/** Returns the edition-faithful English cover title when known, else the catalogue title. */
export function getCoverEnglishTitle(id: string, fallbackTitle: string): string {
  return GITA_PRESS_COVER_TITLES[id] ?? fallbackTitle;
}
