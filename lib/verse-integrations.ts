import { concepts, type Concept, type ConceptCategory } from '@/data/concepts';
import { conceptVerses, type ConceptVerse } from '@/data/concept-verses';
import { topics, type Topic } from '@/data/topics';
import { readHref } from '@/lib/verse-paths';

export interface IntegratedConcept {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  category: ConceptCategory;
  shortDesc: string;
  icon?: string;
  matchType: 'direct' | 'keyword' | 'topic';
}

export interface IntegratedTopic {
  id: string;
  title: string;
  sanskrit?: string;
  icon: string;
  shortDesc: string;
  category: Topic['category'];
  gradient: string;
  directVerseMatch: boolean;
}

export interface CrossScriptureVerse {
  conceptId: string;
  conceptLabel: string;
  scriptureId: string;
  chapterId?: number;
  verseId?: number | string;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  reference: string;
  href: string;
  isExternalScripture: boolean;
}

export interface VerseIntegrationData {
  concepts: IntegratedConcept[];
  topics: IntegratedTopic[];
  crossReferences: CrossScriptureVerse[];
}

const CATEGORY_ICONS: Record<ConceptCategory, string> = {
  core: '🕉️',
  metaphysics: '🌌',
  practice: '🧘',
  psychology: '🧠',
  cosmology: '✨',
};

// Keyword dictionary for concepts
const CONCEPT_KEYWORDS: Record<string, string[]> = {
  brahman: ['brahman', 'ब्रह्म', 'ब्रह्मन्', 'परब्रह्म', 'सच्चिदानन्द', 'supreme reality'],
  atman: ['atman', 'आत्मन्', 'आत्मा', 'जीवात्मा', 'साक्षी', 'soul', 'self'],
  karma: ['karma', 'कर्म', 'कर्मण्येवाधिकारस्ते', 'कर्मफल', 'क्रिया', 'action'],
  dharma: ['dharma', 'धर्म', 'स्वधर्म', 'सत्य', 'कर्तव्य', 'righteousness'],
  maya: ['maya', 'माया', 'भ्रम', 'अविद्या', 'illusion'],
  moksha: ['moksha', 'मोक्ष', 'मुक्ति', 'कैवल्य', 'निर्वाण', 'liberation'],
  samsara: ['samsara', 'संसार', 'पुनर्जन्म', 'भवसागर', 'cycle of birth'],
  prakriti: ['prakriti', 'प्रकृति', 'त्रिगुण', 'सृष्टि', 'nature'],
  purusha: ['purusha', 'पुरुष', 'चेतन', 'साक्षी चेतना', 'supreme person'],
  // Not 'युक्त': in Hindi it is mostly 'endowed with' (a chariot yoked to horses), not yoga.
  yoga: ['yoga', 'योग', 'समाधि', 'चित्तवृत्ति', 'union'],
  bhakti: ['bhakti', 'भक्ति', 'भक्त', 'प्रेम', 'समर्पण', 'devotion'],
  jnana: ['jnana', 'ज्ञान', 'विवेक', 'बोध', 'प्रज्ञा', 'wisdom'],
  'karma-yoga': ['karma-yoga', 'कर्मयोग', 'निष्काम', 'अनासक्ति', 'selfless action'],
  dhyana: ['dhyana', 'ध्यान', 'एकाग्रता', 'धारणा', 'meditation'],
  guna: ['guna', 'गुण', 'सत्त्व', 'रजस्', 'तमस्', 'sattva', 'rajas', 'tamas'],
  avidya: ['avidya', 'अविद्या', 'अज्ञान', 'मोह', 'ignorance'],
  viveka: ['viveka', 'विवेक', 'भेदज्ञान', 'discrimination'],
  manas: ['manas', 'मन', 'मनस्', 'चित्त', 'संकल्प', 'mind'],
  vasana: ['vasana', 'वासना', 'संस्कार', 'प्रवृत्ति', 'latent impressions'],
  om: ['om', 'ॐ', 'प्रणव', 'ओंकार', 'aum'],
  ishvara: ['ishvara', 'ईश्वर', 'परमेश्वर', 'भगवान्', 'lord'],
  avatar: ['avatar', 'अवतार', 'संभवामि', 'यदा यदा हि', 'incarnation'],
  yuga: ['yuga', 'युग', 'कालचक्र', 'सत्ययुग', 'कलियुग', 'cosmic age'],
};

/** Phrases where a concept word means something else ("ध्यान दीजिये" = pay attention, not meditation). */
const CONCEPT_IDIOMS: Record<string, RegExp> = {
  dhyana: /ध्यान\s+(दे|दी|दो|रख)[ऀ-ॿ]*/g,
};

/** Devanagari letters and signs, without the danda (।) and double danda (॥). */
const DEVANAGARI_WORD = /[ऀ-ॣ०-ॿ]+/g;

/**
 * Whole-word keyword test. Raw substring search tagged nonsense: "om" inside
 * "commanders", "मन" inside "मनुष्य", "manas" inside "brahmanas". Latin
 * keywords must stand as words; a Devanagari keyword must equal a word, or,
 * when it is a stem of four or more characters (कर्म), begin one so inflected
 * forms (कर्मणि, कर्मफल) still count. Multi-word phrases match as phrases.
 */
function keywordInText(keyword: string, latinText: string, devanagariWords: string[], fullText: string): boolean {
  const kw = keyword.toLowerCase();
  if (/\s/.test(kw)) return fullText.includes(kw);
  if (/[ऀ-ॿ]/.test(kw)) {
    return devanagariWords.some((w) => w === kw || (kw.length >= 4 && w.startsWith(kw)));
  }
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`).test(latinText);
}

/**
 * Returns integrated concepts, life application topics, and cross-scripture
 * parallel verses for any given verse.
 */
export function getVerseIntegrations(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
  verseData?: {
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
    explanation?: string;
    keywords?: string[];
  },
): VerseIntegrationData {
  const vIdStr = String(verseId).trim();
  const matchedConceptMap = new Map<string, IntegratedConcept['matchType']>();

  // 1. Direct match in conceptVerses
  for (const [cId, list] of Object.entries(conceptVerses)) {
    for (const cv of list) {
      const cvVerseStr = cv.verseId != null ? String(cv.verseId).trim() : null;
      const cvChapterNum = cv.chapterId;
      if (
        cv.scriptureId === scriptureId &&
        (cvChapterNum === chapterId || !cvChapterNum) &&
        (cvVerseStr === vIdStr || (!cvVerseStr && cv.reference.includes(`${chapterId}.${vIdStr}`)))
      ) {
        matchedConceptMap.set(cId, 'direct');
      }
    }
  }

  // 2. Keyword & text matching if fewer than 3 concepts matched directly
  const textCorpus = [
    verseData?.sanskrit,
    verseData?.transliteration,
    verseData?.hindi,
    verseData?.translation,
    verseData?.explanation,
    ...(verseData?.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (textCorpus) {
    const devanagariWords = textCorpus.match(DEVANAGARI_WORD) ?? [];
    for (const concept of concepts) {
      if (matchedConceptMap.size >= 4) break;
      if (matchedConceptMap.has(concept.id)) continue;

      const keywords = CONCEPT_KEYWORDS[concept.id] ?? [concept.id, concept.label.toLowerCase()];
      // Everyday idioms that use a concept word in another sense are taken out first.
      const idiom = CONCEPT_IDIOMS[concept.id];
      const text = idiom ? textCorpus.replace(idiom, ' ') : textCorpus;
      const words = idiom ? (text.match(DEVANAGARI_WORD) ?? []) : devanagariWords;
      const matches = keywords.some((kw) => keywordInText(kw, text, words, text));
      if (matches) {
        matchedConceptMap.set(concept.id, 'keyword');
      }
    }
  }

  // Build the IntegratedConcept list
  const integratedConcepts: IntegratedConcept[] = [];
  const conceptIdSet = new Set<string>();
  matchedConceptMap.forEach((matchType, cId) => {
    conceptIdSet.add(cId);
    const found = concepts.find((c) => c.id === cId);
    if (found) {
      integratedConcepts.push({
        id: found.id,
        label: found.label,
        sanskrit: found.sanskrit,
        transliteration: found.transliteration,
        category: found.category,
        shortDesc: found.shortDesc,
        icon: CATEGORY_ICONS[found.category] || '🕉️',
        matchType,
      });
    }
  });

  // 3. Match Topics (Direct verse references or related concept overlap)
  const matchedTopics: IntegratedTopic[] = [];

  for (const topic of topics) {
    const directVerseMatch = topic.verses.some((tv) => {
      const tvVerseStr = tv.verseId != null ? String(tv.verseId).trim() : null;
      return (
        tv.scriptureId === scriptureId &&
        (tv.chapterId === chapterId || !tv.chapterId) &&
        (tvVerseStr === vIdStr || (!tvVerseStr && tv.reference.includes(`${chapterId}.${vIdStr}`)))
      );
    });

    const relatedConceptMatch = topic.relatedConcepts?.some((rc) => conceptIdSet.has(rc));

    if (directVerseMatch || relatedConceptMatch) {
      matchedTopics.push({
        id: topic.id,
        title: topic.title,
        sanskrit: topic.sanskrit,
        icon: topic.icon,
        shortDesc: topic.shortDesc,
        category: topic.category,
        gradient: topic.gradient,
        directVerseMatch,
      });
    }
  }

  // Sort topics so direct verse matches appear first, up to 3
  matchedTopics.sort((a, b) => (b.directVerseMatch ? 1 : 0) - (a.directVerseMatch ? 1 : 0));
  const finalTopics = matchedTopics.slice(0, 3);

  // 4. Cross-Scriptural Parallel Verses
  // Gather other verses from conceptVerses for the matched concepts
  const crossReferences: CrossScriptureVerse[] = [];
  const seenRefs = new Set<string>();

  for (const c of integratedConcepts) {
    const list = conceptVerses[c.id] ?? [];
    for (const cv of list) {
      const cvVerseStr = cv.verseId != null ? String(cv.verseId).trim() : null;
      const isSelf =
        cv.scriptureId === scriptureId &&
        cv.chapterId === chapterId &&
        cvVerseStr === vIdStr;

      const refKey = `${cv.scriptureId}:${cv.chapterId}:${cv.verseId ?? cv.reference}`;
      if (isSelf || seenRefs.has(refKey)) continue;
      seenRefs.add(refKey);

      const isExternalScripture = cv.scriptureId !== scriptureId;
      const href = readHref(cv.scriptureId, cv.chapterId ?? 1, cv.verseId);

      crossReferences.push({
        conceptId: c.id,
        conceptLabel: c.label,
        scriptureId: cv.scriptureId,
        chapterId: cv.chapterId,
        verseId: cv.verseId,
        sanskrit: cv.sanskrit,
        transliteration: cv.transliteration,
        translation: cv.translation,
        reference: cv.reference,
        href,
        isExternalScripture,
      });

      if (crossReferences.length >= 3) break;
    }
    if (crossReferences.length >= 3) break;
  }

  // Sort cross references so external scriptures appear first (more enlightening context)
  crossReferences.sort((a, b) => (b.isExternalScripture ? 1 : 0) - (a.isExternalScripture ? 1 : 0));

  return {
    concepts: integratedConcepts.slice(0, 4),
    topics: finalTopics,
    crossReferences: crossReferences.slice(0, 3),
  };
}

/**
 * Fast lookup of miniature concept tags for verse cards in reader views.
 */
export function getVerseConceptTags(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
): Array<{ id: string; label: string; sanskrit: string }> {
  const vIdStr = String(verseId).trim();
  const tags: Array<{ id: string; label: string; sanskrit: string }> = [];

  for (const [cId, list] of Object.entries(conceptVerses)) {
    for (const cv of list) {
      const cvVerseStr = cv.verseId != null ? String(cv.verseId).trim() : null;
      if (
        cv.scriptureId === scriptureId &&
        (cv.chapterId === chapterId || !cv.chapterId) &&
        (cvVerseStr === vIdStr || (!cvVerseStr && cv.reference.includes(`${chapterId}.${vIdStr}`)))
      ) {
        const found = concepts.find((c) => c.id === cId);
        if (found && !tags.some((t) => t.id === found.id)) {
          tags.push({ id: found.id, label: found.label, sanskrit: found.sanskrit });
        }
      }
    }
  }

  return tags.slice(0, 2);
}
