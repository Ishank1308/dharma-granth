/**
 * Analytical Perspective Taxonomy & Scientific Integrity Framework
 * For Dharma Granth (dharmagranth.in)
 * 
 * Implements Section 5 of Master Mission:
 * "The Vigyana layer must be intellectually honest.
 * Distinguish scripture from modern editorial analysis."
 */

export type AnalyticalPerspective =
  | 'psychological'
  | 'cognitive'
  | 'ethical'
  | 'linguistic'
  | 'philosophical'
  | 'historical'
  | 'ecological'
  | 'social'
  | 'contemplative'
  | 'observational'
  | 'not-applicable';

export interface AnalyticalPerspectiveMeta {
  id: AnalyticalPerspective;
  labelEn: string;
  labelHi: string;
  badgeEn: string;
  badgeHi: string;
  descriptionEn: string;
  descriptionHi: string;
  permittedThemes: string[];
}

export const ANALYTICAL_PERSPECTIVES: Record<AnalyticalPerspective, AnalyticalPerspectiveMeta> = {
  psychological: {
    id: 'psychological',
    labelEn: 'Psychological Analysis',
    labelHi: 'मनोवैज्ञानिक विश्लेषण',
    badgeEn: 'Psychology · Editorial',
    badgeHi: 'मनोविज्ञान · संपादकीय',
    descriptionEn: 'Responsible examination of human emotion, coping mechanisms, self-worth, and inner distress without claiming medical diagnosis.',
    descriptionHi: 'मानवीय संवेगों, मानसिक तनाव और आत्मबोध का संतुलित मनोवैज्ञानिक विश्लेषण।',
    permittedThemes: ['emotion', 'grief', 'anxiety', 'fear', 'attachment', 'identity', 'resilience'],
  },
  cognitive: {
    id: 'cognitive',
    labelEn: 'Cognitive Science & Attention',
    labelHi: 'संज्ञानात्मक व ध्यान विज्ञान',
    badgeEn: 'Cognitive Focus',
    badgeHi: 'संज्ञानात्मक विज्ञान',
    descriptionEn: 'Exploration of attentional focus, mental models, cognitive reframing, and habit loops.',
    descriptionHi: 'एकाग्रता, स्मृति, मानसिक प्रतिरूप और ध्यान-प्रक्रिया का वैज्ञानिक अवलोकन।',
    permittedThemes: ['attention', 'habit', 'reframing', 'focus', 'perception', 'mental-models'],
  },
  ethical: {
    id: 'ethical',
    labelEn: 'Ethical Reasoning & Decision Making',
    labelHi: 'नैतिक विमर्श व कर्तव्य-निर्णय',
    badgeEn: 'Ethical Inquiry',
    badgeHi: 'नैतिक विमर्श',
    descriptionEn: 'Analysis of duty (dharma), ethical dilemmas, fairness, non-injury (ahimsa), and moral agency.',
    descriptionHi: 'कर्तव्य, धर्म-संकट, अहिंसा, न्याय और नैतिक उत्तरदायित्व की निष्पक्ष समीक्षा।',
    permittedThemes: ['duty', 'justice', 'integrity', 'harm-reduction', 'responsibility', 'fairness'],
  },
  linguistic: {
    id: 'linguistic',
    labelEn: 'Linguistic & Metaphorical Analysis',
    labelHi: 'भाषा व रूपक विश्लेषण',
    badgeEn: 'Linguistics & Metaphor',
    badgeHi: 'भाषा व रूपक',
    descriptionEn: 'Investigation of etymology, verbal roots (dhatus), poetic meter (chandas), and allegorical imagery.',
    descriptionHi: 'संस्कृत धातु-प्रत्यय, व्युत्पत्ति, छंद और काव्यात्मक प्रतीकों का शास्त्रीय विवेचन।',
    permittedThemes: ['etymology', 'dhatu', 'chandas', 'symbolism', 'poetics', 'allegory'],
  },
  philosophical: {
    id: 'philosophical',
    labelEn: 'Philosophical Epistemology & Metaphysics',
    labelHi: 'दार्शनिक विमर्श (दर्शन-शास्त्र)',
    badgeEn: 'Philosophy of Mind',
    badgeHi: 'दार्शनिक विमर्श',
    descriptionEn: 'Comparative dialogue across traditional Darshanas (Advaita, Samkhya, Nyaya, Yoga) and epistemology.',
    descriptionHi: 'भारतीय दर्शन (अद्वैत, सांख्य, न्याय, योग) और ज्ञान-मीमांसा का तुलनात्मक अध्ययन।',
    permittedThemes: ['epistemology', 'ontology', 'consciousness', 'dualism', 'non-dualism', 'causation'],
  },
  historical: {
    id: 'historical',
    labelEn: 'Historical & Contextual Analysis',
    labelHi: 'ऐतिहासिक व सांस्कृतिक संदर्भ',
    badgeEn: 'Historical Context',
    badgeHi: 'ऐतिहासिक संदर्भ',
    descriptionEn: 'Textual recensions, period manuscript traditions, and geographical or cultural context of the composition.',
    descriptionHi: 'पाण्डुलिपि परम्परा, कालखंड, भौगोलिक संदर्भ और ऐतिहासिक परिप्रेक्ष्य।',
    permittedThemes: ['manuscript', 'period', 'recension', 'geography', 'chronology'],
  },
  ecological: {
    id: 'ecological',
    labelEn: 'Ecological & Environmental Harmony',
    labelHi: 'पर्यावरण व प्राकृतिक सामंजस्य',
    badgeEn: 'Ecology & Nature',
    badgeHi: 'पर्यावरण चेतना',
    descriptionEn: 'Traditional reverence for rivers, trees, animal species, soil, and cyclical natural balance.',
    descriptionHi: 'प्रकृति, नदियाँ, वनस्पति, जीव-जंतु और ऋतु-चक्र के प्रति पारंपरिक सह-अस्तित्व चेतना।',
    permittedThemes: ['nature', 'rivers', 'seasons', 'living-systems', 'interdependence'],
  },
  social: {
    id: 'social',
    labelEn: 'Social Observation & Community Life',
    labelHi: 'सामाजिक व्यवस्था व लोक-जीवन',
    badgeEn: 'Social Observation',
    badgeHi: 'सामाजिक विमर्श',
    descriptionEn: 'Analysis of social duties, governance, familial relationships, community solidarity, and leadership ethics.',
    descriptionHi: 'शासन-नीति, परिवार, समाज और लोक-कल्याण के व्यावहारिक नियमों का अध्ययन।',
    permittedThemes: ['community', 'leadership', 'governance', 'family', 'cohesion'],
  },
  contemplative: {
    id: 'contemplative',
    labelEn: 'Contemplative & Meditative Practice',
    labelHi: 'साधना व अंतर्मुखी अभ्यास',
    badgeEn: 'Contemplative Practice',
    badgeHi: 'साधना प्रयोग',
    descriptionEn: 'Practical guidance for breath control (pranayama), stillness (dhyana), witnessing consciousness (sakshi), and prayer.',
    descriptionHi: 'प्राणायाम, ध्यान, साक्षी-भाव और मानसिक शांति के व्यावहारिक अभ्यास।',
    permittedThemes: ['meditation', 'pranayama', 'witnessing', 'stillness', 'mantra-japa'],
  },
  observational: {
    id: 'observational',
    labelEn: 'Observable Human Behavior',
    labelHi: 'मानव स्वभाव व व्यवहार प्रेक्षण',
    badgeEn: 'Behavioral Observation',
    badgeHi: 'व्यवहार प्रेक्षण',
    descriptionEn: 'Empirical observation of how anger, greed, vanity, and compassion manifest in daily human interaction.',
    descriptionHi: 'दैनिक जीवन में क्रोध, लोभ, अहंकार और करुणा के दृश्य व्यवहार का यथार्थवादी प्रेक्षण।',
    permittedThemes: ['behavior', 'greed', 'anger', 'generosity', 'speech', 'interaction'],
  },
  'not-applicable': {
    id: 'not-applicable',
    labelEn: 'Direct Liturgical or Metaphysical Passage',
    labelHi: 'विशुद्ध उपासना या पारमार्थिक श्लोक',
    badgeEn: 'Scriptural Verse',
    badgeHi: 'मूल श्लोक',
    descriptionEn: 'Passages where modern scientific categorization is unhelpful or inappropriate, preserving pure scriptural depth.',
    descriptionHi: 'ऐसे श्लोक जहाँ आधुनिक वैज्ञानिक वर्गीकरण अनावश्यक है; विशुद्ध दार्शनिक या स्तवन पाठ।',
    permittedThemes: ['mantra', 'stotra', 'ritual', 'surrender'],
  },
};

/**
 * Classifies an analytical explanation text into its dominant analytical perspective.
 */
export function classifyAnalyticalPerspective(text: string | undefined): AnalyticalPerspective {
  if (!text || !text.trim()) return 'not-applicable';
  const lower = text.toLowerCase();

  // 1. Cognitive & attention
  if (
    lower.includes('cognitive') ||
    lower.includes('attention') ||
    lower.includes('एकाग्रता') ||
    lower.includes('चित्त') ||
    lower.includes('स्मृति') ||
    lower.includes('mental model') ||
    lower.includes('neuro') ||
    lower.includes('refram')
  ) {
    return 'cognitive';
  }

  // 2. Contemplative & meditation
  if (
    lower.includes('ध्यान') ||
    lower.includes('साधना') ||
    lower.includes('प्राणायाम') ||
    lower.includes('meditat') ||
    lower.includes('breath') ||
    lower.includes('साक्षी') ||
    lower.includes('stillness')
  ) {
    return 'contemplative';
  }

  // 3. Psychological & emotion
  if (
    lower.includes('psycholog') ||
    lower.includes('मनोवैज्ञानिक') ||
    lower.includes('भय') ||
    lower.includes('शोक') ||
    lower.includes('anxiety') ||
    lower.includes('stress') ||
    lower.includes('trauma') ||
    lower.includes('emotion') ||
    lower.includes('burnout') ||
    lower.includes('overthinking')
  ) {
    return 'psychological';
  }

  // 4. Linguistic & etymology
  if (
    lower.includes('धातु') ||
    lower.includes('व्युत्पत्ति') ||
    lower.includes('root') ||
    lower.includes('etymolog') ||
    lower.includes('छंद') ||
    lower.includes('linguistic') ||
    lower.includes('व्याकरण')
  ) {
    return 'linguistic';
  }

  // 5. Ethical reasoning
  if (
    lower.includes('नैतिक') ||
    lower.includes('कर्तव्य') ||
    lower.includes('अहिंसा') ||
    lower.includes('ethic') ||
    lower.includes('moral') ||
    lower.includes('justice') ||
    lower.includes('न्याय')
  ) {
    return 'ethical';
  }

  // 6. Ecological
  if (
    lower.includes('पर्यावरण') ||
    lower.includes('प्रकृति') ||
    lower.includes('ecolog') ||
    lower.includes('nature') ||
    lower.includes('environment') ||
    lower.includes('वनस्पति') ||
    lower.includes('नदी')
  ) {
    return 'ecological';
  }

  // 7. Social & governance
  if (
    lower.includes('समाज') ||
    lower.includes('शासन') ||
    lower.includes('राजा') ||
    lower.includes('social') ||
    lower.includes('community') ||
    lower.includes('leadership')
  ) {
    return 'social';
  }

  // 8. Behavioral observation
  if (
    lower.includes('व्यवहार') ||
    lower.includes('क्रोध') ||
    lower.includes('लोभ') ||
    lower.includes('habit') ||
    lower.includes('behavior') ||
    lower.includes('conduct')
  ) {
    return 'observational';
  }

  // 9. Philosophical
  if (
    lower.includes('दर्शन') ||
    lower.includes('अद्वैत') ||
    lower.includes('सांख्य') ||
    lower.includes('philosoph') ||
    lower.includes('चेतना') ||
    lower.includes('consciousness')
  ) {
    return 'philosophical';
  }

  // 10. Historical
  if (
    lower.includes('इतिहास') ||
    lower.includes('पाण्डुलिपि') ||
    lower.includes('historic') ||
    lower.includes('period') ||
    lower.includes('manuscript')
  ) {
    return 'historical';
  }

  return 'observational';
}
