/**
 * Each scripture's cover colours and title-page line, the same as the website (lib/scripture-vibes.ts):
 * a deep, a mid and a light cover colour, the gold foil drawn over them, and one well-known line from
 * the text itself, quoted verbatim with its citation. Books without a chosen line open on their own title.
 *
 * Keep the two files in step: a book's colours here should match what the reader sees on dharmagranth.dev.
 */
export interface Cover {
  /** Cover gradient: deep, mid, light. */
  colors: [string, string, string];
  foil: string;
  epigraph?: { sa: string; source: string };
}

const BY_CATEGORY: Record<string, Cover> = {
  veda: { colors: ['#4a1d0a', '#9a3412', '#ea580c'], foil: '#f6c768' },
  upanishad: { colors: ['#0b2e2a', '#115e59', '#2dd4bf'], foil: '#e9d8a6' },
  vedanta: { colors: ['#151436', '#3730a3', '#818cf8'], foil: '#e5d3a1' },
  sutra: { colors: ['#3b2a12', '#92400e', '#d6a35a'], foil: '#f3e3b3' },
  shakta: { colors: ['#3f0816', '#9f1239', '#f43f5e'], foil: '#f6c768' },
  purana: { colors: ['#0c1d4a', '#1d4ed8', '#f472b6'], foil: '#f6d27a' },
  itihasa: { colors: ['#3b0d0c', '#9a3412', '#7c3aed'], foil: '#f6c768' },
  smriti: { colors: ['#2e1a47', '#6b21a8', '#c084fc'], foil: '#ead9b0' },
  tantra: { colors: ['#1e0b3a', '#6d28d9', '#db2777'], foil: '#f3c77a' },
  stotra: { colors: ['#4a2a05', '#b45309', '#f43f5e'], foil: '#fde68a' },
  other: { colors: ['#062e26', '#047857', '#6366f1'], foil: '#ead9b0' },
};

const BY_ID: Record<string, Partial<Cover>> = {
  bhagavadgita: { colors: ['#0a1a44', '#1e40af', '#0d9488'], foil: '#f6c768', epigraph: { sa: 'योगः कर्मसु कौशलम्', source: 'भगवद्गीता 2.50' } },
  ramayana: { colors: ['#3a1406', '#c2410c', '#1d4ed8'], foil: '#f6c768', epigraph: { sa: 'रामो विग्रहवान् धर्मः', source: 'वाल्मीकि रामायण, अरण्यकाण्ड 37.13' } },
  ramcharitmanas: { colors: ['#3a1406', '#c2410c', '#1d4ed8'], foil: '#f6c768', epigraph: { sa: 'सीय राममय सब जग जानी', source: 'रामचरितमानस, बालकाण्ड' } },
  ishavasya: { epigraph: { sa: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्', source: 'ईशावास्योपनिषद् 1' } },
  katha: { epigraph: { sa: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत', source: 'कठोपनिषद् 1.3.14' } },
  mundaka: { epigraph: { sa: 'सत्यमेव जयते', source: 'मुण्डकोपनिषद् 3.1.6' } },
  chandogya: { epigraph: { sa: 'तत्त्वमसि', source: 'छान्दोग्योपनिषद् 6.8.7' } },
  taittiriya: { epigraph: { sa: 'सत्यं वद। धर्मं चर।', source: 'तैत्तिरीयोपनिषद् 1.11.1' } },
  yogasutra: { epigraph: { sa: 'योगश्चित्तवृत्तिनिरोधः', source: 'योगसूत्र 1.2' } },
  mahabharata: { epigraph: { sa: 'यतो धर्मस्ततो जयः', source: 'महाभारत' } },
  rigveda: { epigraph: { sa: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्', source: 'ऋग्वेद 1.1.1' } },
  brihadaranyaka: { epigraph: { sa: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्माऽमृतं गमय॥', source: 'बृहदारण्यक उपनिषद् 1.3.28' } },
  durgasaptashati: { epigraph: { sa: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता', source: 'दुर्गासप्तशती 5' } },
  bhagavatapurana: { epigraph: { sa: 'ॐ नमो भगवते वासुदेवाय', source: 'द्वादशाक्षर मन्त्र' } },
  shivpurana: { epigraph: { sa: 'ॐ नमः शिवाय', source: 'पञ्चाक्षर मन्त्र' } },
  // The website's Ashtavakra palette (app/ashtavakra/ashtavakra.css): midnight indigo, saffron, lamp gold.
  ashtavakra: { colors: ['#0d1428', '#17213f', '#d7862a'], foil: '#e3b23c', epigraph: { sa: 'मुक्ताभिमानी मुक्तो हि बद्धा बद्धाभिमान्यपि', source: 'अष्टावक्र गीता 1.11' } },
};

export function coverFor(id: string, category: string): Cover {
  return { ...(BY_CATEGORY[category] ?? BY_CATEGORY.other), ...(BY_ID[id] ?? {}) };
}
