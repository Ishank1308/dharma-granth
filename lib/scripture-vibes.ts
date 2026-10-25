import type { ScriptureCategory } from '@/data/types';

export type MotifId = 'flame' | 'leaf' | 'feather' | 'bow' | 'lotus' | 'trishula' | 'om' | 'sutra';
export type CoverMaterial = 'palm-leaf' | 'silk' | 'velvet' | 'bark' | 'cloth';

/**
 * How each scripture looks when it opens: the cover's material and colours,
 * the gold-foil motif, and one well-known line for its title page.
 * Every quotation belongs to the text it opens, verbatim with its exact
 * citation; texts with no line chosen here open on their own title, never on
 * an invented quote or one borrowed from another book.
 */
export interface ScriptureVibe {
  motif: MotifId;
  material: CoverMaterial;
  /** Cover gradient: deep, mid, light. */
  cover: [string, string, string];
  foil: string;
  epigraph?: { sa: string; source: string };
}

const BY_CATEGORY: Record<ScriptureCategory, ScriptureVibe> = {
  veda: { motif: 'flame', material: 'palm-leaf', cover: ['#4a1d0a', '#9a3412', '#ea580c'], foil: '#f6c768' },
  upanishad: { motif: 'leaf', material: 'bark', cover: ['#0b2e2a', '#115e59', '#2dd4bf'], foil: '#e9d8a6' },
  vedanta: { motif: 'om', material: 'cloth', cover: ['#151436', '#3730a3', '#818cf8'], foil: '#e5d3a1' },
  sutra: { motif: 'sutra', material: 'palm-leaf', cover: ['#3b2a12', '#92400e', '#d6a35a'], foil: '#f3e3b3' },
  shakta: { motif: 'trishula', material: 'velvet', cover: ['#3f0816', '#9f1239', '#f43f5e'], foil: '#f6c768' },
  purana: { motif: 'lotus', material: 'silk', cover: ['#0c1d4a', '#1d4ed8', '#f472b6'], foil: '#f6d27a' },
  itihasa: { motif: 'bow', material: 'velvet', cover: ['#3b0d0c', '#9a3412', '#7c3aed'], foil: '#f6c768' },
  smriti: { motif: 'sutra', material: 'cloth', cover: ['#2e1a47', '#6b21a8', '#c084fc'], foil: '#ead9b0' },
  tantra: { motif: 'trishula', material: 'velvet', cover: ['#1e0b3a', '#6d28d9', '#db2777'], foil: '#f3c77a' },
  stotra: { motif: 'lotus', material: 'silk', cover: ['#4a2a05', '#b45309', '#f43f5e'], foil: '#fde68a' },
  other: { motif: 'om', material: 'cloth', cover: ['#062e26', '#047857', '#6366f1'], foil: '#ead9b0' },
};

const BY_ID: Record<string, Partial<ScriptureVibe>> = {
  bhagavadgita: { motif: 'feather', material: 'silk', cover: ['#0a1a44', '#1e40af', '#0d9488'], foil: '#f6c768', epigraph: { sa: 'योगः कर्मसु कौशलम्', source: 'भगवद्गीता 2.50' } },
  ramayana: { motif: 'bow', material: 'silk', cover: ['#3a1406', '#c2410c', '#1d4ed8'], foil: '#f6c768', epigraph: { sa: 'रामो विग्रहवान् धर्मः', source: 'वाल्मीकि रामायण, अरण्यकाण्ड 37.13' } },
  ramcharitmanas: { motif: 'bow', material: 'silk', cover: ['#3a1406', '#c2410c', '#1d4ed8'], foil: '#f6c768', epigraph: { sa: 'सीय राममय सब जग जानी', source: 'रामचरितमानस, बालकाण्ड' } },
  ishavasya: { epigraph: { sa: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्', source: 'ईशावास्योपनिषद् 1' } },
  katha: { epigraph: { sa: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत', source: 'कठोपनिषद् 1.3.14' } },
  mundaka: { epigraph: { sa: 'सत्यमेव जयते', source: 'मुण्डकोपनिषद् 3.1.6' } },
  mandukya: { motif: 'om' },
  chandogya: { epigraph: { sa: 'तत्त्वमसि', source: 'छान्दोग्योपनिषद् 6.8.7' } },
  taittiriya: { epigraph: { sa: 'सत्यं वद। धर्मं चर।', source: 'तैत्तिरीयोपनिषद् 1.11.1' } },
  yogasutra: { epigraph: { sa: 'योगश्चित्तवृत्तिनिरोधः', source: 'योगसूत्र 1.2' } },
  brahmasutra: { motif: 'om' },
  mahabharata: { epigraph: { sa: 'यतो धर्मस्ततो जयः', source: 'महाभारत' } },
  rigveda: { epigraph: { sa: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्', source: 'ऋग्वेद 1.1.1' } },
  brihadaranyaka: { epigraph: { sa: 'असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्माऽमृतं गमय॥', source: 'बृहदारण्यक उपनिषद् 1.3.28' } },
  durgasaptashati: { epigraph: { sa: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता', source: 'दुर्गासप्तशती 5' } },
  bhagavatapurana: { epigraph: { sa: 'ॐ नमो भगवते वासुदेवाय', source: 'द्वादशाक्षर मन्त्र' } },
  shivpurana: { motif: 'trishula', epigraph: { sa: 'ॐ नमः शिवाय', source: 'पञ्चाक्षर मन्त्र' } },
};

export function scriptureVibe(id: string, category: ScriptureCategory): ScriptureVibe {
  return { ...(BY_CATEGORY[category] ?? BY_CATEGORY.other), ...(BY_ID[id] ?? {}) };
}
