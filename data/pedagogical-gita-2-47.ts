/**
 * Pedagogical Breakdown for Bhagavad Gita 2.47 (कर्मण्येवाधिकारस्ते)
 * Designed for students, young professionals, first-time scripture readers, and Gen Z.
 *
 * Epistemic Integrity:
 * - Original Sanskrit and classical commentaries are clearly separated from modern editorial explanations.
 * - Modern psychological illustrations are explicitly labeled as contemporary educational aids.
 */

export interface PedagogicalWordGloss {
  pada: string;
  iast: string;
  root: string;
  functionalMeaning: string;
  functionalMeaningHi: string;
}

export interface PedagogicalModernScenario {
  title: string;
  titleHi: string;
  text: string;
}

export interface TraditionalCommentatorPerspective {
  author: string;
  tradition: string;
  work: string;
  summaryEn: string;
  summaryHi: string;
}

export interface PedagogicalVerseData {
  scriptureId: string;
  chapterId: number;
  verseId: number | string;
  scriptureTitle: string;
  scriptureTitleSanskrit: string;
  chapterTitle: string;
  chapterTitleSanskrit: string;
  sanskrit: string;
  transliteration: string;
  meter: string;
  epistemicTier: string;
  
  // 1. In One Line (<= 20 words)
  inOneLineEn: string;
  inOneLineHi: string;

  // 2. Simple Meaning (English: 2-4 short sentences)
  simpleMeaningEn: string;

  // 3. Simple Hindi Meaning (Hindi: 2-4 short sentences)
  simpleMeaningHi: string;

  // 4. Key Words (4 terms)
  keyWords: PedagogicalWordGloss[];

  // 5. Why It Matters Today
  whyItMattersToday: PedagogicalModernScenario[];

  // 6. A Relatable Modern Example (Explicitly labeled)
  modernExample: {
    context: string;
    contextHi: string;
    scenarioEn: string;
    scenarioHi: string;
    disclaimer: string;
  };

  // 7. What It Does Not Mean
  whatItDoesNotMean: Array<{
    title: string;
    titleHi: string;
    text: string;
  }>;

  // 8. Try This Today (< 15 mins)
  tryThisToday: {
    title: string;
    titleHi: string;
    instructionEn: string;
    instructionHi: string;
    duration: string;
  };

  // 9. Think About It (Reflection Question)
  reflectionQuestion: {
    en: string;
    hi: string;
  };

  // 10. Deeper Traditional Understanding
  /** Absent until reviewed commentary summaries are available for the verse. */
  traditionalCommentary?: {
    shankara: TraditionalCommentatorPerspective;
    ramanuja: TraditionalCommentatorPerspective;
    sridhara: TraditionalCommentatorPerspective;
  };
  commentaryPerspectives?: {
    shankara?: TraditionalCommentatorPerspective;
    ramanuja?: TraditionalCommentatorPerspective;
    sridhara?: TraditionalCommentatorPerspective;
    [key: string]: any;
  };

  // 11. Source Transparency
  sourceTransparency: {
    scripture: string;
    reference: string;
    epicContext: string;
    sanskritEdition: string;
    meter: string;
    epistemicTier: string;
    editorialNote: string;
  };
}

export const GITA_2_47_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 2,
  verseId: 47,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Sankhya Yoga',
  chapterTitleSanskrit: 'सांख्ययोग',
  sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
  transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  // 1. IN ONE LINE (<= 20 words)
  inOneLineEn: 'Your part is the action itself; its fruit is not yours to claim.',
  inOneLineHi: 'आपका अधिकार केवल कर्म पर है, उसके फल पर नहीं।',

  // 2. SIMPLE MEANING
  simpleMeaningEn:
    'Bhagavan Sri Krishna tells Arjuna that his rightful sphere is the action itself, never its fruit. Results arise from many causes that no single person commands. A mind that clings to the outcome grows anxious; a mind given wholly to the work at hand grows calm and steady. Yet giving up action is no answer either.',

  // 3. SIMPLE HINDI MEANING
  simpleMeaningHi:
    'भगवान श्रीकृष्ण अर्जुन से कहते हैं कि मनुष्य का अधिकार केवल कर्म पर है, उसके फल पर कभी नहीं। फल अनेक कारणों से उत्पन्न होता है, जो किसी एक व्यक्ति के वश में नहीं होते। जब मन परिणाम की चिंता छोड़कर कर्म में एकाग्र होता है, तब वह शान्त और स्थिर रहता है। परन्तु कर्म का त्याग भी इसका उत्तर नहीं है।',

  // 4. KEY WORDS
  keyWords: [
    {
      pada: 'कर्मणि (Karmaṇi)',
      iast: 'karmaṇi',
      root: 'धातु: कृ (करना, यत्न करना)',
      functionalMeaning: 'In action: duty and honest effort, the part that is within your power.',
      functionalMeaningHi: 'आपके कर्तव्य और पुरुषार्थ में, जो आपके वश में है।',
    },
    {
      pada: 'अधिकारः (Adhikāraḥ)',
      iast: 'adhikāraḥ',
      root: 'अधि + कृ (कार्यक्षेत्र, अधिकार)',
      functionalMeaning: 'Rightful sphere: your share of responsibility, not a claim on any reward.',
      functionalMeaningHi: 'कार्यक्षेत्र, उत्तरदायित्व और सामर्थ्य; पुरस्कार माँगने का दावा नहीं, अपितु कर्म करने का अधिकार।',
    },
    {
      pada: 'मा फलेषु (Mā Phaleṣu)',
      iast: 'mā phaleṣu',
      root: 'मा (कदापि नहीं) + फलेषु (परिणामों में)',
      functionalMeaning: 'Never in the fruits: one can sow the seed with care, but the harvest is not in one’s hands.',
      functionalMeaningHi: 'फल पर कभी नहीं; बीज बोना आपके हाथ में है, फसल आपके अधीन नहीं।',
    },
    {
      pada: 'अकर्मणि (Akarmaṇi)',
      iast: 'akarmaṇi',
      root: 'अ (अभाव) + कर्मणि (कर्म न करना)',
      functionalMeaning: 'In inaction: a caution against giving up, indifference and escape.',
      functionalMeaningHi: 'निष्क्रियता, आलस्य या पलायन में; कर्म छोड़ देने में भी आसक्ति न हो।',
    },
  ],

  // 5. WHY IT MATTERS TODAY
  whyItMattersToday: [
    {
      title: 'Exams and interviews',
      titleHi: 'परीक्षा व नौकरी का तनाव',
      text: 'You can prepare for an exam or interview with full dedication, yet the paper, the examiner and the other candidates are beyond your control. Giving yourself to the preparation frees the mind from fear.',
    },
    {
      title: 'Work and creative projects',
      titleHi: 'आजीविका व रचनात्मक कार्य',
      text: 'Making art, writing software or building a venture asks for great effort. The quality of the work is yours to give; how it is received is not. Attention on the work keeps your strength steady.',
    },
    {
      title: 'Comparison and approval',
      titleHi: 'तुलना और दूसरों की स्वीकृति',
      text: 'Measuring your worth by likes, views or the milestones of others hands your peace to strangers. Devotion to the work itself keeps your dignity and freedom intact.',
    },
    {
      title: 'Fear of failure and putting things off',
      titleHi: 'असफलता का भय और कर्म को टालना',
      text: 'Putting work off is often the fear of judgement in disguise. When the mind lets go of the outcome, it is free to act honestly today.',
    },
  ],

  // 6. A RELATABLE MODERN EXAMPLE (Explicitly labeled)
  modernExample: {
    context: 'Preparing for an important exam or interview',
    contextHi: 'प्रतियोगी परीक्षा या नौकरी के साक्षात्कार की तैयारी',
    scenarioEn:
      'Imagine preparing for an important entrance exam or interview. How thoroughly you revise, how well you rest and how honestly you answer are in your hands. How hard the paper is, how the job market moves and how the examiners mark are not. If the mind keeps asking "What if I fail? What will people say?" while you study, little is learned. If you give yourself to understanding each topic with full care, the mind stays calm, clear and steady.',
    scenarioHi:
      'मान लीजिए आप किसी महत्त्वपूर्ण प्रतियोगी परीक्षा या नौकरी के साक्षात्कार की तैयारी कर रहे हैं। आप कितनी लगन से पढ़ते हैं, कितना अभ्यास करते हैं और परीक्षा-कक्ष में कितनी एकाग्रता रखते हैं, यह पूर्णतः आपके हाथ में है। परन्तु प्रश्नपत्र कितना कठिन होगा, परीक्षक किस मनोदशा में होंगे या चयन-सीमा क्या रहेगी, यह आपके वश में नहीं है। यदि पढ़ते समय मन में यही चलता रहे कि "यदि चयन नहीं हुआ तो क्या होगा?", तो तैयारी दुर्बल हो जाती है। जब आप परिणाम का भय छोड़कर केवल आज के अध्याय को समझने में तल्लीन होते हैं, तब मन शान्त रहता है और प्रयास अपने श्रेष्ठ रूप में होता है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  // 7. WHAT IT DOES NOT MEAN
  whatItDoesNotMean: [
    {
      title: 'It does not mean: "Do not set goals or plan ahead"',
      titleHi: 'यह लक्ष्य न बनाने या योजना न बनाने की बात नहीं है',
      text: 'Clear aims are sensible and necessary. The verse cautions against attachment (āsakti), which turns an aim into a source of fear.',
    },
    {
      title: 'It does not mean: "Become passive or fatalistic"',
      titleHi: 'यह भाग्यवादी बनने या हाथ पर हाथ धरकर बैठने की बात नहीं है',
      text: 'The second half says plainly: mā te saṅgo ’stv akarmaṇi, let there be no attachment to inaction. Laziness, despair and abandoning one’s duty are not the way.',
    },
    {
      title: 'It does not mean: "Withdraw from the world"',
      titleHi: 'यह संसार से विमुख होने का उपदेश नहीं है',
      text: 'Bhagavan Sri Krishna speaks these words on a battlefield, calling Arjuna to rise and do his duty, not to withdraw from it.',
    },
    {
      title: 'It does not mean: "Outcomes are unimportant"',
      titleHi: 'यह नहीं कि परिणाम का कोई महत्व नहीं है',
      text: 'Results still matter, and they follow their causes. Anxiety about them does not improve them; wholehearted action does.',
    },
  ],

  // 8. TRY THIS TODAY (< 15 mins)
  tryThisToday: {
    title: 'Fifteen minutes of wholehearted work',
    titleHi: '१५ मिनट का एकाग्र कर्म-अभ्यास',
    instructionEn:
      'Choose one important task for today, such as studying a difficult topic, writing an important letter or preparing a plan. For fifteen minutes, set your phone aside and give the task your complete care, without checking messages and without thinking about how it will be received.',
    instructionHi:
      'आज के अपने कार्यों में से कोई एक महत्त्वपूर्ण कार्य चुनें, जैसे किसी कठिन विषय के दो पृष्ठ पढ़ना या कोई आवश्यक कार्य पूर्ण करना। पंद्रह मिनट के लिए फ़ोन को अलग रख दें और पूरी निष्ठा से केवल उसी कार्य में तल्लीन रहें, यह सोचे बिना कि लोग क्या कहेंगे या इसका परिणाम क्या होगा।',
    duration: '15 minutes',
  },

  // 9. THINK ABOUT IT (Reflection Question)
  reflectionQuestion: {
    en: 'Which result or approval are you trying hardest to control right now, and what would change if you gave that same energy to your very next action?',
    hi: 'वर्तमान में आप किस परिणाम या दूसरों की स्वीकृति को आवश्यकता से अधिक नियंत्रित करने का प्रयास कर रहे हैं, और यदि आप वही सारी मानसिक ऊर्जा केवल अपने अगले कर्तव्य में लगा दें तो क्या होगा?',
  },

  // 10. DEEPER TRADITIONAL UNDERSTANDING
  traditionalCommentary: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankaracharya)',
      tradition: 'अद्वैत वेदान्त (Advaita Vedanta)',
      work: 'श्रीमद्भगवद्गीताभाष्य (Gita Bhashya 2.47)',
      summaryEn:
        'Desire for fruits (phala-tṛṣṇā) binds the soul to the cycle of transmigratory agitation (saṃsāra) and fuels the ego-illusion of independent doership (kartṛtva). Performing obligatory duty without selfish craving (niṣkāma karma) purifies the mental faculty (citta-śuddhi), making the seeker eligible for liberating self-knowledge (ātma-jñāna).',
      summaryHi:
        'फल की तृष्णा मनुष्य को संसार-चक्र में बांधती है और कर्तापन के अहंकार को बढ़ाती है। जब निष्काम भाव से स्वधर्म का पालन किया जाता है, तो चित्त की शुद्धि होती है, जो आत्मज्ञान और मोक्ष का द्वार खोलती है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanujacharya)',
      tradition: 'विशिष्टाद्वैत वेदान्त (Vishishtadvaita Vedanta)',
      work: 'गीताभाष्य (Gita Bhashya 2.47)',
      summaryEn:
        'Actions should not be abandoned; rather, the sense of personal possessiveness and selfish entitlement must be renounced. Action is sanctified as an offering of loving service (kainkarya) to the Divine Indweller (Antaryāmin), releasing anxiety and cultivating unshakeable peace.',
      summaryHi:
        'कर्मों का त्याग नहीं, बल्कि कर्मफल में अपने स्वामित्व और भोग-बुद्धि का त्याग करना चाहिए। कर्म को परमात्मा की प्रसन्नता और सेवा (कैंकर्य) के रूप में करने से चित्त को परम शांति मिलती है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'सुबोधिनी टीका (Subodhini)',
      work: 'भगवद्गीता सुबोधिनी (Subodhini 2.47)',
      summaryEn:
        'Sridhara Swami emphasizes the phrase "mā karmaphalaheturbhūḥ": Do not make the anticipated fruit the primary motive for duty. If fruit is the motive, you suffer despondency upon failure and pride upon success. Equanimity in action is true yoga.',
      summaryHi:
        'कर्म के फल को अपनी प्रवृत्ति का एकमात्र कारण मत बनाओ। यदि फल ही उद्देश्य होगा तो असफलता में विषाद और सफलता में अहंकार होगा। समभाव से कर्तव्य करना ही योग है।',
    },
  },

  // 11. SOURCE TRANSPARENCY
  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय २, श्लोक ४७ (Chapter 2, Verse 47)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय २६ (Mahābhārata, Bhīṣma Parva 26.47)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern examples and psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};
