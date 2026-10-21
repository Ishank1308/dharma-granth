/**
 * Literary Commentary & Situational Wisdom Layer for Dharma Granth (dharmagranth.in)
 * 
 * Blends the warmth of Indian Kathā storytelling with the psychological clarity
 * of contemporary essayists (The School of Life, Substack essayists).
 * 
 * Strict Guardrails:
 * 1. Never alters or replaces canonical Sanskrit, Devanagari shlokas, or source citations.
 * 2. Zero robotic filler phrases ("In this verse...", "This highlights...", "Delve into...").
 * 3. Human, second-person prose connecting ancient metaphysics to modern struggles:
 *    overthinking, burnout, career anxiety, heartbreak, imposter syndrome, and digital distraction.
 */

export interface SituationalMoment {
  id: string;
  labelEn: string;
  labelHi: string;
  emoji: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const SITUATIONAL_MOMENTS: Record<string, SituationalMoment> = {
  overthinking: {
    id: 'overthinking',
    labelEn: 'Overthinking & Paralysis',
    labelHi: 'अति-विचार और अनिर्णय',
    emoji: '🌊',
    descriptionEn: 'When the brain spins endless scenarios and the present action slips away.',
    descriptionHi: 'जब मन भविष्य की आशंकाओं में उलझकर वर्तमान का कर्म भूल जाए।',
  },
  burnout: {
    id: 'burnout',
    labelEn: 'Burnout & Hustle Fatigue',
    labelHi: 'थकान और आंतरिक शून्यता',
    emoji: '🔥',
    descriptionEn: 'When nonstop ambition drains your spirit and work feels like empty labor.',
    descriptionHi: 'जब निरंतर दौड़ने के बाद भी भीतर एक गहरा खालीपन महसूस हो।',
  },
  failure: {
    id: 'failure',
    labelEn: 'Fear of Failure & Career Pressure',
    labelHi: 'असफलता का भय और अपेक्षाओं का बोझ',
    emoji: '🧭',
    descriptionEn: 'When expectations from family, society, or yourself turn suffocating.',
    descriptionHi: 'जब परीक्षाओं, करियर और दूसरों की अपेक्षाओं का तनाव भारी लगने लगे।',
  },
  heartbreak: {
    id: 'heartbreak',
    labelEn: 'Heartbreak, Detachment & Letting Go',
    labelHi: 'मोह, बिछोह और स्वीकार',
    emoji: '🌧️',
    descriptionEn: 'When clinging to what has ended prevents you from healing.',
    descriptionHi: 'जब बिछोह या छूटे हुए रिश्तों को पकड़ कर रखना केवल पीड़ा दे रहा हो।',
  },
  imposter: {
    id: 'imposter',
    labelEn: 'Imposter Syndrome & Self-Doubt',
    labelHi: 'आत्म-संदेह और आत्मबल',
    emoji: '🌱',
    descriptionEn: 'When you secretly feel unqualified and question your inherent worth.',
    descriptionHi: 'जब भीतर यह डर सताए कि आप पर्याप्त नहीं हैं और सब एक भ्रम है।',
  },
  distraction: {
    id: 'distraction',
    labelEn: 'Digital Distraction & Monkey Mind',
    labelHi: 'भटकाव और एकाग्रता',
    emoji: '🏔️',
    descriptionEn: 'When notifications, feeds, and fragmented attention scatter your calm.',
    descriptionHi: 'जब स्क्रीन के भटकाव और अंतहीन सूचनाएँ चित्त की शांति छीन लें।',
  },
};

export type EditorialReviewStatus = 'draft' | 'review-required' | 'reviewed' | 'approved';

export interface VerseEditorialLayer {
  /** True only when an explicit editorial overlay exists for this verse. */
  isCurated: boolean;
  editorialStatus: EditorialReviewStatus;
  editorialLabel: 'Editorial · Not Scripture';
  coreShiftEn: string;
  coreShiftHi: string;
  situationalMoments: SituationalMoment[];
  misreadingEn: string;
  misreadingHi: string;
  deeperTruthEn: string;
  deeperTruthHi: string;
  humanQuestionEn: string;
  humanQuestionHi: string;
  dhatuAnalysis?: {
    rootWord: string;
    rootMeaning: string;
    breakdownEn: string;
    breakdownHi: string;
  };
  microPracticeEn: string;
  microPracticeHi: string;
}

/**
 * Curated flagship verses across Gita, Upanishads, Ashtavakra, and Yoga Sutras.
 */
export const FLAGSHIP_LITERARY_MAP: Record<string, Omit<VerseEditorialLayer, 'isCurated' | 'editorialStatus' | 'editorialLabel'>> = {
  // Bhagavad Gita 2.47 (Karmanye Vadhikaraste)
  'bhagavadgita:2:47': {
    coreShiftEn: 'Pour your entire vitality into the craft before you; abandon the paralyzing addiction to the prize.',
    coreShiftHi: 'कर्म के सौंदर्य में अपनी पूरी शक्ति झोंक दो; परिणाम के नशे से स्वयं को मुक्त कर लो।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.overthinking,
      SITUATIONAL_MOMENTS.failure,
      SITUATIONAL_MOMENTS.burnout,
    ],
    misreadingEn: 'Stop caring about your career goals, ambition, or the outcomes of your exams.',
    misreadingHi: 'अपने लक्ष्यों, करियर या परीक्षाओं के परिणाम की कोई परवाह ही न करना।',
    deeperTruthEn: 'Give 100% of your energy to the present action while unburdening your nervous system from the terror of what happens tomorrow. Results depend on a thousand variables outside your control; your effort is the only territory you truly own.',
    deeperTruthHi: 'वर्तमान में किए जा रहे कार्य में संपूर्ण एकाग्रता दें, किंतु भविष्य के भय से स्नायुतंत्र को मुक्त रखें। परिणाम हजारों बाहरी कारणों पर निर्भर करता है, आपका अधिकार केवल इस क्षण के प्रयास पर है।',
    humanQuestionEn: 'How do you keep creating, studying, or building when the fear of failure makes every next step feel terrifying?',
    humanQuestionHi: 'जब असफलता का भय हर कदम पर घेर ले, तो बिना घबराए कर्म कैसे जारी रखें?',
    dhatuAnalysis: {
      rootWord: 'कर्मन् (from √कृ) + फल (Phala)',
      rootMeaning: '√कृ = to act, bring forth; फल = ripe fruit or harvest',
      breakdownEn: 'Action is the sowing; the harvest ripens through the whole ecosystem of life. You control the planting, not the seasons.',
      breakdownHi: 'कर्म बीज बोना है; फल प्रकृति की संपूर्ण व्यवस्था से पकता है। आप केवल बीज बोने के स्वामी हैं, मौसमों के नहीं।',
    },
    microPracticeEn: 'Set a timer for 25 minutes. Pour your complete care into one single task without once checking views, grades, or replies.',
    microPracticeHi: 'अगले २५ मिनट के लिए फोन दूर रखें और केवल एक कार्य में डूब जाएँ। परिणाम की चिंता को एक तरफ रख दें।',
  },

  // Bhagavad Gita 2.14 (Matra-sparshas tu kaunteya)
  'bhagavadgita:2:14': {
    coreShiftEn: 'Pleasure and pain are transient weather patterns of the senses; let them blow across your sky without mistaking them for who you are.',
    coreShiftHi: 'सुख और दुःख इंद्रियों के बदलते मौसम हैं; उन्हें आने-जाने दें, स्वयं को वह आकाश समझें जो कभी नहीं बदलता।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.heartbreak,
      SITUATIONAL_MOMENTS.burnout,
      SITUATIONAL_MOMENTS.overthinking,
    ],
    misreadingEn: 'Turn into an unfeeling stone, suppressing emotions and pretending grief does not hurt.',
    misreadingHi: 'पत्थर बन जाना और किसी भी भावना या दुःख को महसूस न करने का ढोंग करना।',
    deeperTruthEn: 'Feel joy and sorrow completely without letting either define your core worth or panic your spirit. Life has cold winters and warm springs; both pass.',
    deeperTruthHi: 'सुख और दुःख का अनुभव करें किंतु उनमें बह न जाएँ। शीत और ग्रीष्म आते-जाते हैं; आपका आत्म-स्वरूप उनसे कहीं विशाल है।',
    humanQuestionEn: 'How do you survive emotional turbulence and grief without letting it tear your peace to shreds?',
    humanQuestionHi: 'भावनात्मक उतार-चढ़ाव और बिछोह के समय आंतरिक संतुलन कैसे बनाए रखें?',
    dhatuAnalysis: {
      rootWord: 'मात्रा-स्पर्श (Mātrā-sparśa)',
      rootMeaning: 'मात्रा = sensory contact-points; स्पर्श = touch, stimulus',
      breakdownEn: 'Sensory touches are physical contacts with changing matter; they are physiological events, not the eternal Self.',
      breakdownHi: 'इंद्रियों का विषयों से स्पर्श केवल भौतिक प्रतिक्रिया है; यह आपका आंतरिक चैतन्य नहीं है।',
    },
    microPracticeEn: 'When anxiety or longing flares up today, close your eyes and silently breathe: "This is a passing weather pattern. The sky remains untouched."',
    microPracticeHi: 'जब भी आज बेचैनी या दुःख उठे, गहरी सांस लेकर स्वयं से कहें: "यह केवल एक बादल है, आकाश शांत है।"',
  },

  // Bhagavad Gita 2.56 (Dukheshvanudvigna-manah)
  'bhagavadgita:2:56': {
    coreShiftEn: 'The steady mind does not collapse under heartbreak nor lose its wits in celebration; it anchors in its own depth.',
    coreShiftHi: 'स्थितप्रज्ञ मन दुःख में बिखरता नहीं और सुख में होश नहीं खोता; वह अपनी आंतरिक गहराई में स्थिर रहता है।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.overthinking,
      SITUATIONAL_MOMENTS.heartbreak,
      SITUATIONAL_MOMENTS.burnout,
    ],
    misreadingEn: 'Living a dull, passionless life stripped of all joy, celebration, and affection.',
    misreadingHi: 'उत्साहहीन और नीरस जीवन जीना जहाँ न कोई आनंद हो न कोई स्नेह।',
    deeperTruthEn: 'Enjoying triumphs without vanity, and facing loss without despondency. You remain the calm captain of the vessel, no matter the ocean swells.',
    deeperTruthHi: 'सफलताओं का आनंद लें बिना अहंकार के, और पराजय का सामना करें बिना निराशा के। जहाज का कप्तान लहरों से भयभीत नहीं होता।',
    humanQuestionEn: 'How can we maintain quiet dignity when circumstance constantly swings between praise and humiliation?',
    humanQuestionHi: 'प्रशंसा और निंदा के बीच अपने आत्म-सम्मान और चित्त की शांति को कैसे अक्षुण्ण रखें?',
    microPracticeEn: 'Notice the next piece of good or bad news today. Pause for three breaths before reacting. Anchor in the silence behind the reaction.',
    microPracticeHi: 'आज जब भी कोई अच्छी या बुरी खबर मिले, तुरंत प्रतिक्रिया न दें। तीन बार गहरी सांस लें और भीतर की स्थिरता को छुएं।',
  },

  // Bhagavad Gita 6.5 (Uddhared atmanatmanam)
  'bhagavadgita:6:5': {
    coreShiftEn: 'No savior is coming to rescue you from your own neglect; lift yourself with your own resolve, for you are your own closest friend or your own bitterest saboteur.',
    coreShiftHi: 'अपनी उपेक्षा से आपको बचाने कोई दूसरा नहीं आएगा; अपने संकल्प से स्वयं को उठाएं, क्योंकि आप ही अपने सच्चे मित्र हैं या अपने सबसे बड़े शत्रु।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.imposter,
      SITUATIONAL_MOMENTS.distraction,
      SITUATIONAL_MOMENTS.failure,
    ],
    misreadingEn: 'You must battle life in isolation, rejecting all human support, community, or teachers.',
    misreadingHi: 'अकेले ही हर युद्ध लड़ना और किसी की सहायता या मार्गदर्शन को अस्वीकार कर देना।',
    deeperTruthEn: 'Others can inspire or illuminate the path, but the actual courage to close social media, sit down, and transform your character must be chosen by you.',
    deeperTruthHi: 'मार्गदर्शक राह दिखा सकते हैं, किंतु भटकाव छोड़कर आगे बढ़ने का साहस केवल आपको ही जुटाना होगा। आत्म-उत्तरदायित्व ही मुक्ति का द्वार है।',
    humanQuestionEn: 'Why do we repeatedly sabotage our own goals, and how do we break out of chronic self-doubt?',
    humanQuestionHi: 'हम बार-बार अपने ही बनाए नियमों को क्यों तोड़ते हैं, और आत्म-संदेह की जंजीर कैसे काटें?',
    dhatuAnalysis: {
      rootWord: 'उद्धरेत् (from उत् + √धृ)',
      rootMeaning: 'उत् = upward; √धृ = to uphold, bear, elevate',
      breakdownEn: 'Lifting yourself above gravity. You are the lever and you are the fulcrum.',
      breakdownHi: 'स्वयं को नीचे गिरने से बचाना और ऊपर उठाना। आपकी चेतना ही आपका उत्तोलक है।',
    },
    microPracticeEn: 'Identify one promise you broke to yourself this week. Do not shame yourself; simply fulfill a tiny 5-minute version of it right now.',
    microPracticeHi: 'इस सप्ताह अपने आप से किया गया कोई एक छोटा वादा याद करें और बिना आत्म-ग्लानि के उसे अभी ५ मिनट में पूरा करें।',
  },

  // Isha Upanishad 1 (Isha Vasyam Idam Sarvam)
  'ishavasya:1:1': {
    coreShiftEn: 'The whole living universe is saturated with the sacred; savor life with boundless joy by surrendering the fever to possess it.',
    coreShiftHi: 'यह संपूर्ण चर-अचर जगत चैतन्य से व्याप्त है; इसे पूरी तरह भोगो, किंतु इसके स्वामित्व की तृष्णा छोड़कर।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.burnout,
      SITUATIONAL_MOMENTS.heartbreak,
      SITUATIONAL_MOMENTS.distraction,
    ],
    misreadingEn: 'Give away all your possessions and retreat to a forest cave in rags.',
    misreadingHi: 'सब कुछ त्यागकर वन में चले जाना और भौतिक साधनों से नफरत करना।',
    deeperTruthEn: 'Live richly in the world, appreciate fine things, but hold them loosely like a bird perched on your wrist. Joy evaporates the moment love turns into possessiveness.',
    deeperTruthHi: 'संसार में आनंद से रहें, किंतु किसी वस्तु या व्यक्ति पर मालिकाना हक जताने का अहंकार छोड़ दें। जो मुक्त है, वही वास्तव में आनंद ले सकता है।',
    humanQuestionEn: 'How can we engage fully in a hyper-consumerist world without letting possessions own our souls?',
    humanQuestionHi: 'उपभोक्तावादी युग में वस्तुओं के पीछे भागने की अंधी दौड़ से स्वयं को कैसे मुक्त रखें?',
    microPracticeEn: 'Look at your workspace or room. Whisper to yourself: "This serves my journey for a season; it does not define who I am."',
    microPracticeHi: 'अपने आस-पास की प्रिय वस्तुओं को देखें और कहें: "यह मेरे जीवन की यात्रा का साधन हैं, मेरा स्वरूप नहीं।"',
  },

  // Katha Upanishad 1.2.2 (Shreyas ca preyas ca)
  'katha:1:2': {
    coreShiftEn: 'At every crossroads, two voices whisper: the quick dopamine hit that dissolves into regret, and the quieter discipline that builds an enduring soul.',
    coreShiftHi: 'हर मोड़ पर दो राहें मिलती हैं: एक जो तुरंत सुख देती है पर बाद में पछतावा, और दूसरी जो कठिन है पर आत्मिक शांति देती है।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.distraction,
      SITUATIONAL_MOMENTS.failure,
      SITUATIONAL_MOMENTS.overthinking,
    ],
    misreadingEn: 'Rejecting every innocent comfort and treating pleasure as a mortal sin.',
    misreadingHi: 'हर प्रकार के सुख को पाप समझना और स्वयं को अनावश्यक कष्ट देना।',
    deeperTruthEn: 'Discerning between immediate sensory gratification (Preya) and long-term spiritual flourishing (Shreya). The wise choose what makes them whole, not what is merely easy.',
    deeperTruthHi: 'प्रेय (तात्कालिक आकर्षण) और श्रेय (कल्याणकारी सत्य) में विवेक करना। ज्ञानी वह चुनता है जो उसे भीतर से सशक्त बनाता है।',
    humanQuestionEn: 'Why is it so painful to resist short-term temptation even when we know our long-term dreams depend on it?',
    humanQuestionHi: 'क्षणभंगुर सुखों के आकर्षण से बचकर अपने दीर्घकालिक लक्ष्यों पर टिके रहना इतना कठिन क्यों है?',
    microPracticeEn: 'Next time you reach for your phone during deep work, pause for 10 seconds and ask: "Is this Preya (instant escape) or Shreya (what truly serves me)?"',
    microPracticeHi: 'जब भी काम के बीच फोन उठाने का मन हो, १० सेकंड रुकें और पूछें: "क्या यह केवल तात्कालिक भटकाव है या मेरे कल्याण का मार्ग?"',
  },

  // Ashtavakra Gita 1.15 (Muktabhimani mukto hi)
  'ashtavakra:1:15': {
    coreShiftEn: 'Whoever considers themselves bound remains bound; whoever knows themselves to be free is already free. As you think within, so you become.',
    coreShiftHi: 'जो स्वयं को बंधा मानता है वह बंधा ही रहता है; जो स्वयं को मुक्त जानता है वह मुक्त ही है। जैसी हमारी आंतरिक दृष्टि, वैसा ही हमारा जीवन।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.imposter,
      SITUATIONAL_MOMENTS.overthinking,
      SITUATIONAL_MOMENTS.heartbreak,
    ],
    misreadingEn: 'Magical thinking—imagining that positive self-talk alone will pay your bills without disciplined action.',
    misreadingHi: 'केवल कल्पनाओं में रहना और बिना किसी कर्म के सब कुछ ठीक होने की झूठी उम्मीद पालना।',
    deeperTruthEn: 'Your deepest consciousness is not broken, tainted, or unlovable. Your trauma and mistakes are events that visited your awareness; they are not your essential nature.',
    deeperTruthHi: 'आपकी मूल चेतना कभी मलिन या पराजित नहीं हुई। अतीत की गलतियाँ या पीड़ा केवल अनुभव थे, वे आपका मूल अस्तित्व नहीं हैं।',
    humanQuestionEn: 'How do you stop defining yourself by your past failures and childhood conditioning?',
    humanQuestionHi: 'अतीत की गलतियों और अपराधबोध से स्वयं को कैसे मुक्त करें?',
    microPracticeEn: 'Drop the heavy story of who you were yesterday. Right here, in this breath, meet yourself with clean slate forgiveness.',
    microPracticeHi: 'कल आप क्या थे उस बोझ को छोड़ दें। इस क्षण में एक नई शुरुआत करें और स्वयं को क्षमा करें।',
  },

  // Yoga Sutra 1.2 (Yogas citta-vritti-nirodha)
  'yogasutras:1:2': {
    coreShiftEn: 'Yoga is not contorting your limbs on a mat; it is the quiet settling of the mental turbulence so reality can shine through unwarped.',
    coreShiftHi: 'योग केवल शारीरिक आसन नहीं है; यह चित्त के चंचल भंवरों का शांत हो जाना है ताकि सत्य अपने शुद्ध रूप में चमक सके।',
    situationalMoments: [
      SITUATIONAL_MOMENTS.distraction,
      SITUATIONAL_MOMENTS.overthinking,
      SITUATIONAL_MOMENTS.burnout,
    ],
    misreadingEn: 'Forcibly emptying your brain of every thought until you become a blank zombie.',
    misreadingHi: 'जबरदस्ती विचारों को दबाना और मस्तिष्क को शून्य करने का संघर्ष करना।',
    deeperTruthEn: 'Allowing the mud of compulsive mental chatter to settle naturally so the pure lake of consciousness becomes mirror-clear.',
    deeperTruthHi: 'विचारों से युद्ध किए बिना उनके प्रवाह के साक्षी बन जाना, जिससे मन की झील स्वतः निर्मल हो जाए।',
    humanQuestionEn: 'How do you quiet a racing brain in an era of information overload?',
    humanQuestionHi: 'सूचनाओं के इस दौर में अशांत मन को कैसे स्थिर और शांत किया जाए?',
    microPracticeEn: 'Sit still for 2 minutes. Do not suppress thoughts; simply watch them like traffic passing on a road below your balcony.',
    microPracticeHi: '२ मिनट के लिए आंखें बंद करें। विचारों को रोकने का प्रयास न करें, केवल एक दर्शक की भाँति उन्हें आते-जाते देखें।',
  },
};

/** Backwards-compatible name for consumers that still call this literary metadata. */
export type LiteraryVerseMeta = VerseEditorialLayer;

/**
 * Returns an explicitly marked editorial layer only when reviewed source material exists.
 * Raw verse keywords and lifeLesson fields are not used to infer interpretive content.
 */
export function getLiteraryVerseMeta(
  scriptureSlug: string,
  chapter: number,
  verseNum: number | string,
): VerseEditorialLayer {
  const key = `${scriptureSlug.toLowerCase()}:${chapter}:${verseNum}`;
  const curated = FLAGSHIP_LITERARY_MAP[key];

  if (!curated) {
    return {
      isCurated: false,
      editorialStatus: 'draft',
      editorialLabel: 'Editorial · Not Scripture',
      coreShiftEn: '',
      coreShiftHi: '',
      situationalMoments: [],
      misreadingEn: '',
      misreadingHi: '',
      deeperTruthEn: '',
      deeperTruthHi: '',
      humanQuestionEn: '',
      humanQuestionHi: '',
      microPracticeEn: '',
      microPracticeHi: '',
    };
  }

  return {
    ...curated,
    isCurated: true,
    editorialStatus: 'review-required',
    editorialLabel: 'Editorial · Not Scripture',
  };
}
