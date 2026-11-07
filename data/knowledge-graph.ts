/**
 * Milestone 1 of the knowledge graph: a fixed taxonomy of 25 concepts.
 * Pages and verse links are assembled from concept articles, concept-verse
 * citations, and wisdom topics that already exist. This file does not store
 * new scripture or new recommendations.
 */

export interface GraphConcept {
  id: string;
  label: string;
  labelHi: string;
  sanskrit: string;
  transliteration: string;
  /** One of the ten milestone pages at /concepts/<id>/. */
  page: boolean;
  /** Id in data/concepts.ts, when that entry is the stored source. */
  libraryConceptId?: string;
  /** Id in data/concept-details.ts, when a full article already exists. */
  conceptDetailId?: string;
  /** Slug in wisdom topics, when a stored life page already exists. */
  wisdomSlug?: string;
  related: string[];
}

export const GRAPH_CONCEPTS: GraphConcept[] = [
  { id: 'dharma', label: 'Dharma', labelHi: 'धर्म', sanskrit: 'धर्म', transliteration: 'dharma', page: true, libraryConceptId: 'dharma', conceptDetailId: 'dharma', related: ['karma', 'duty', 'moksha'] },
  { id: 'karma', label: 'Karma', labelHi: 'कर्म', sanskrit: 'कर्म', transliteration: 'karma', page: true, libraryConceptId: 'karma', conceptDetailId: 'karma', related: ['dharma', 'detachment', 'discipline'] },
  { id: 'bhakti', label: 'Bhakti', labelHi: 'भक्ति', sanskrit: 'भक्ति', transliteration: 'bhakti', page: true, libraryConceptId: 'bhakti', conceptDetailId: 'bhakti', wisdomSlug: 'devotion', related: ['faith', 'jnana', 'moksha'] },
  { id: 'jnana', label: 'Jnana', labelHi: 'ज्ञान', sanskrit: 'ज्ञान', transliteration: 'jñāna', page: false, libraryConceptId: 'jnana', related: ['wisdom', 'moksha', 'mind'] },
  { id: 'moksha', label: 'Moksha', labelHi: 'मोक्ष', sanskrit: 'मोक्ष', transliteration: 'mokṣa', page: false, libraryConceptId: 'moksha', conceptDetailId: 'moksha', related: ['jnana', 'bhakti', 'detachment'] },
  { id: 'mind', label: 'Mind', labelHi: 'मन', sanskrit: 'मनस्', transliteration: 'manas', page: true, libraryConceptId: 'manas', related: ['fear', 'anger', 'meditation', 'concentration'] },
  { id: 'fear', label: 'Fear', labelHi: 'भय', sanskrit: 'भय', transliteration: 'bhaya', page: true, wisdomSlug: 'fear-and-courage', related: ['mind', 'equanimity', 'faith'] },
  { id: 'anger', label: 'Anger', labelHi: 'क्रोध', sanskrit: 'क्रोध', transliteration: 'krodha', page: true, wisdomSlug: 'anger', related: ['mind', 'self-control', 'attachment'] },
  { id: 'duty', label: 'Duty', labelHi: 'कर्तव्य', sanskrit: 'कर्तव्य', transliteration: 'kartavya', page: false, wisdomSlug: 'duty-and-decision-making', related: ['dharma', 'leadership', 'service'] },
  { id: 'discipline', label: 'Discipline', labelHi: 'अनुशासन', sanskrit: 'अनुशासन', transliteration: 'anuśāsana', page: true, wisdomSlug: 'discipline', related: ['self-control', 'concentration', 'meditation'] },
  { id: 'purpose', label: 'Purpose', labelHi: 'प्रयोजन', sanskrit: 'प्रयोजन', transliteration: 'prayojana', page: false, wisdomSlug: 'meaning-of-life', related: ['dharma', 'wisdom', 'moksha'] },
  { id: 'wisdom', label: 'Wisdom', labelHi: 'ज्ञान', sanskrit: 'ज्ञान', transliteration: 'jñāna', page: true, libraryConceptId: 'jnana', wisdomSlug: 'self-knowledge', related: ['jnana', 'reflection', 'truth'] },
  { id: 'detachment', label: 'Detachment', labelHi: 'वैराग्य', sanskrit: 'वैराग्य', transliteration: 'vairāgya', page: true, conceptDetailId: 'vairagya', wisdomSlug: 'detachment', related: ['attachment', 'karma', 'equanimity'] },
  { id: 'attachment', label: 'Attachment', labelHi: 'आसक्ति', sanskrit: 'आसक्ति', transliteration: 'āsakti', page: true, wisdomSlug: 'attachment', related: ['anger', 'mind', 'detachment'] },
  { id: 'compassion', label: 'Compassion', labelHi: 'करुणा', sanskrit: 'करुणा', transliteration: 'karuṇā', page: false, related: ['dharma', 'service', 'bhakti'] },
  { id: 'self-control', label: 'Self-Control', labelHi: 'संयम', sanskrit: 'संयम', transliteration: 'saṃyama', page: false, wisdomSlug: 'self-control', related: ['anger', 'discipline', 'mind'] },
  { id: 'patience', label: 'Patience', labelHi: 'धैर्य', sanskrit: 'धैर्य', transliteration: 'dhairya', page: false, related: ['anger', 'equanimity', 'discipline'] },
  { id: 'meditation', label: 'Meditation', labelHi: 'ध्यान', sanskrit: 'ध्यान', transliteration: 'dhyāna', page: false, libraryConceptId: 'dhyana', related: ['mind', 'concentration', 'moksha'] },
  { id: 'truth', label: 'Truth', labelHi: 'सत्य', sanskrit: 'सत्य', transliteration: 'satya', page: false, related: ['wisdom', 'dharma', 'jnana'] },
  { id: 'leadership', label: 'Leadership', labelHi: 'नेतृत्व', sanskrit: 'नेतृत्व', transliteration: 'netṛtva', page: false, wisdomSlug: 'leadership', related: ['duty', 'service', 'dharma'] },
  { id: 'service', label: 'Service', labelHi: 'सेवा', sanskrit: 'सेवा', transliteration: 'sevā', page: false, related: ['leadership', 'duty', 'karma'] },
  { id: 'faith', label: 'Faith', labelHi: 'श्रद्धा', sanskrit: 'श्रद्धा', transliteration: 'śraddhā', page: false, related: ['bhakti', 'fear', 'truth'] },
  { id: 'reflection', label: 'Reflection', labelHi: 'मनन', sanskrit: 'मनन', transliteration: 'manana', page: false, related: ['wisdom', 'mind', 'meditation'] },
  { id: 'equanimity', label: 'Equanimity', labelHi: 'समत्व', sanskrit: 'समत्व', transliteration: 'samatva', page: false, related: ['detachment', 'mind', 'karma'] },
  { id: 'concentration', label: 'Concentration', labelHi: 'एकाग्रता', sanskrit: 'एकाग्रता', transliteration: 'ekāgratā', page: false, wisdomSlug: 'concentration', related: ['meditation', 'discipline', 'mind'] },
];

const byId = new Map(GRAPH_CONCEPTS.map((concept) => [concept.id, concept]));

export function getGraphConcept(id: string): GraphConcept | undefined {
  return byId.get(id);
}

/** Concept pages introduced by this milestone that are not already full articles. */
export function graphPageIds(): string[] {
  return GRAPH_CONCEPTS.filter((concept) => concept.page).map((concept) => concept.id);
}
