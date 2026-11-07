/**
 * Dharma Copilot without a model.
 *
 * Answers are assembled from wisdom topics and concept pages already in the
 * library. Sanskrit, Hindi, and English lines are copied from those records.
 * Nothing here calls an API or writes a new commentary.
 */
import { concepts, type Concept } from '@/data/concepts';
import { getWisdomTopic, wisdomTopics, type WisdomTopic } from '@/data/wisdom-for-life';

export interface CopilotVerse {
  refHi: string;
  refEn: string;
  sanskrit: string;
  hindi: string;
  english: string;
  href: string;
  /** Existing note on the wisdom page. Empty when that page has none. */
  noteHi: string;
}

export interface CopilotLink {
  href: string;
  labelHi: string;
  labelEn: string;
}

export interface CopilotAnswer {
  kind: 'topic' | 'concept' | 'empty';
  titleHi: string;
  titleEn: string;
  simpleHi: string;
  simpleEn: string;
  /** Library text already stored for this topic or concept. */
  contextHi: string;
  contextEn: string;
  applicationHi: string;
  applicationEn: string;
  dailyHi: string;
  dailyEn: string;
  disclaimerHi: string;
  disclaimerEn: string;
  verses: CopilotVerse[];
  related: CopilotLink[];
  pageHref: string;
}

export const COPILOT_EXAMPLES = [
  { hi: 'गीता चिंता पर क्या कहती है?', en: 'What does the Gita say about anxiety?' },
  { hi: 'क्रोध कैसे संभालें?', en: 'How do I work with anger?' },
  { hi: 'फल की चिंता कैसे छोड़ें?', en: 'How can I stop worrying about outcomes?' },
  { hi: 'धर्म क्या है?', en: 'What is Dharma?' },
  { hi: 'कर्मयोग क्या है?', en: 'What is Karma Yoga?' },
] as const;

const withSlash = (path: string) => {
  if (!path) return '/wisdom-for-life/';
  const hashAt = path.indexOf('#');
  const hash = hashAt >= 0 ? path.slice(hashAt) : '';
  const base = hashAt >= 0 ? path.slice(0, hashAt) : path;
  return `${base.endsWith('/') ? base : `${base}/`}${hash}`;
};

function keywordHit(query: string, keyword: string): boolean {
  const q = query.toLowerCase();
  const k = keyword.toLowerCase().trim();
  if (k.length < 3) return false;
  if (/[\u0900-\u097F]/.test(k)) return q.includes(k);
  if (k.includes(' ')) return q.includes(k);
  const tokens = q.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  return tokens.some((t) => t === k || (k.length >= 4 && t.startsWith(k)));
}

function topicScore(query: string, topic: WisdomTopic): number {
  let score = 0;
  for (const keyword of topic.searchKeywords) if (keywordHit(query, keyword)) score += 2;
  if (keywordHit(query, topic.titleEn)) score += 3;
  if (query.includes(topic.titleHi)) score += 3;
  return score;
}

function conceptScore(query: string, concept: Concept): number {
  const phrase = concept.label.toLowerCase();
  const idPhrase = concept.id.replace(/-/g, ' ');
  let score = 0;
  if (query.includes(phrase)) score += 4;
  if (query.includes(idPhrase)) score += 3;
  if (concept.sanskrit && query.includes(concept.sanskrit)) score += 4;
  if (keywordHit(query, concept.transliteration)) score += 3;
  return score;
}

/** Example questions from the product spec, matched before the general score. */
function routed(query: string): { topic?: string; concept?: string } | null {
  const q = query.toLowerCase();
  if (/self-?control|impulse|आत्मसंयम|निग्रह/.test(q)) return { topic: 'self-control' };
  if (/contentment|santosha|gratitude|कृतज्ञ|संतोष|संतुष्ट/.test(q)) return { topic: 'contentment' };
  if (/detach|vairagya|वैराग्य|अनासक्ति/.test(q)) return { topic: 'detachment' };
  if ((/attachment|आसक्ति|clinging/.test(q)) && !/अनासक्ति|detach/.test(q)) return { topic: 'attachment' };
  if (/\bfailure\b|\bfailed\b|\bsetback\b|असफल|पराजय/.test(q)) return { topic: 'failure-and-setbacks' };
  if (/\bsuccess\b|सफलता/.test(q)) return { topic: 'success' };
  if (/productiv|skill in action|कौशल/.test(q)) return { topic: 'skill-in-work' };
  if (/grief|bereave|mourning|शोक|वियोग/.test(q)) return { topic: 'grief-and-loss' };
  if (/\bdeath\b|\bdying\b|mortality|मृत्यु/.test(q)) return { topic: 'death' };
  if (/karma\s*yoga|कर्म\s*योग|कर्मयोग/.test(q)) return { concept: 'karma-yoga' };
  if (/outcome|results of action|phala|फल/.test(q)) return { topic: 'duty-and-decision-making' };
  if (/anger|krodha|क्रोध|गुस्स/.test(q)) return { topic: 'anger' };
  if (/anxiet|worry|stress|चिंता|चिन्ता|तनाव|उद्वेग/.test(q)) return { topic: 'stress-and-worry' };
  if (/what is dharma|dharma क्या|धर्म क्या|^dharma$|^धर्म$/.test(q.trim())) return { concept: 'dharma' };
  return null;
}

function fromTopic(topic: WisdomTopic): CopilotAnswer {
  const reflection = topic.reflections[0];
  const related: CopilotLink[] = [
    { href: withSlash(`/wisdom-for-life/${topic.slug}`), labelHi: 'पूरा विषय-पृष्ठ', labelEn: topic.titleEn },
    ...topic.relatedConcepts.slice(0, 3).map((item) => ({
      href: withSlash(item.href),
      labelHi: item.labelHi,
      labelEn: item.labelEn,
    })),
  ];
  return {
    kind: 'topic',
    titleHi: topic.titleHi,
    titleEn: topic.titleEn,
    simpleHi: topic.shortDescHi,
    simpleEn: topic.shortDescEn,
    contextHi: topic.traditionalContextOverview.bodyHi,
    contextEn: topic.traditionalContextOverview.bodyEn,
    applicationHi: reflection?.insightHi ?? topic.compassionateIntro.leadHi,
    applicationEn: reflection?.insight ?? topic.compassionateIntro.leadEn,
    dailyHi: reflection?.dailyPracticeHi ?? 'इस विषय का पृष्ठ खोलकर वहाँ लिखा एक अभ्यास चुनें।',
    dailyEn: reflection?.dailyPractice ?? 'Open the topic page and use one practice written there.',
    disclaimerHi: topic.contextualNote.clinicalDisclaimerHi,
    disclaimerEn: topic.contextualNote.clinicalDisclaimerEn,
    verses: topic.verses.slice(0, 3).map((verse) => ({
      refHi: verse.referenceDisplayHi,
      refEn: verse.referenceDisplay,
      sanskrit: verse.sanskritDevanagari.trim(),
      hindi: verse.literalTranslationHi,
      english: verse.literalTranslationEn,
      href: withSlash(verse.readerHref),
      noteHi: verse.traditionalContext.commentaryNoteHi.trim(),
    })),
    related,
    pageHref: withSlash(`/wisdom-for-life/${topic.slug}`),
  };
}

function fromConcept(concept: Concept): CopilotAnswer {
  const related: CopilotLink[] = [
    { href: withSlash(`/concepts/${concept.id}`), labelHi: concept.sanskrit, labelEn: concept.label },
    ...concept.connections.slice(0, 4).map((id) => {
      const linked = concepts.find((item) => item.id === id);
      return {
        href: withSlash(`/concepts/${id}`),
        labelHi: linked?.sanskrit ?? id,
        labelEn: linked?.label ?? id,
      };
    }),
  ];
  return {
    kind: 'concept',
    titleHi: concept.sanskrit,
    titleEn: concept.label,
    simpleHi: concept.shortDesc,
    simpleEn: concept.label,
    contextHi: concept.description,
    contextEn: '',
    applicationHi: 'यह परिभाषा पुस्तकालय के अवधारणा-पृष्ठ से है। आज के एक काम पर इसे रखकर देखें, और नीचे दिए पृष्ठ पर लिखा श्लोक पढ़ें।',
    applicationEn: 'This definition is the concept page already in the library. Hold it next to one task today, and read the verse cited on that page.',
    dailyHi: 'संबंधित पृष्ठ खोलें। जो वाक्य किसी श्लोक को उद्धृत करता है, उसे आज के एक कर्म के साथ रखें।',
    dailyEn: 'Open the concept page. Keep the sentence that cites a verse beside one action you will take today.',
    disclaimerHi: 'यह शैक्षिक परिभाषा है। यह दैवीय आदेश नहीं है, और चिकित्सा या कानूनी सलाह नहीं है।',
    disclaimerEn: 'This is an educational definition. It is not a divine command, and it is not medical or legal advice.',
    verses: [],
    related,
    pageHref: withSlash(`/concepts/${concept.id}`),
  };
}

const EMPTY: CopilotAnswer = {
  kind: 'empty',
  titleHi: 'इस प्रश्न का पृष्ठ अभी नहीं जुड़ा',
  titleEn: 'No library page matched',
  simpleHi: 'सहायक केवल उन विषयों का उत्तर देता है जिनका पृष्ठ पुस्तकालय में पहले से है। नीचे दिए प्रश्नों में से एक चुनें, या जीवन-ज्ञान के पृष्ठ खोलें।',
  simpleEn: 'The guide only answers from topic and concept pages already in the library.',
  contextHi: '',
  contextEn: '',
  applicationHi: '',
  applicationEn: '',
  dailyHi: '',
  dailyEn: '',
  disclaimerHi: '',
  disclaimerEn: '',
  verses: [],
  related: [{ href: '/wisdom-for-life/', labelHi: 'जीवन के लिए ज्ञान', labelEn: 'Wisdom for life' }],
  pageHref: '/wisdom-for-life/',
};

/** Match a question to one library page. The returned lines are copies, not a paraphrase. */
export function answerQuestion(raw: string): CopilotAnswer {
  const query = raw.trim().toLowerCase();
  if (query.length < 2) return EMPTY;

  const route = routed(query);
  if (route?.topic) {
    const topic = getWisdomTopic(route.topic);
    if (topic) return fromTopic(topic);
  }
  if (route?.concept) {
    const concept = concepts.find((item) => item.id === route.concept);
    if (concept) return fromConcept(concept);
  }

  let bestTopic: WisdomTopic | undefined;
  let bestTopicScore = 0;
  for (const topic of wisdomTopics) {
    const score = topicScore(query, topic);
    if (score > bestTopicScore) {
      bestTopic = topic;
      bestTopicScore = score;
    }
  }

  let bestConcept: Concept | undefined;
  let bestConceptScore = 0;
  for (const concept of concepts) {
    const score = conceptScore(query, concept);
    if (score > bestConceptScore) {
      bestConcept = concept;
      bestConceptScore = score;
    }
  }

  const asksDefinition = /what is|what are|meaning of|define|क्या है|का अर्थ/.test(query);
  if (bestConcept && asksDefinition && bestConceptScore >= bestTopicScore) return fromConcept(bestConcept);
  if (bestTopic && bestTopicScore > 0) return fromTopic(bestTopic);
  if (bestConcept && bestConceptScore > 0) return fromConcept(bestConcept);
  return EMPTY;
}

/** Slug of a wisdom page, when the current path is one. */
export function wisdomSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/wisdom-for-life\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
