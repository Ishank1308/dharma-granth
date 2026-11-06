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
  inOneLineEn: 'Focus completely on your actions, not your anxiety about the result.',
  inOneLineHi: 'तुम्हारा अधिकार केवल कर्म करने में है, परिणाम की चिंता में नहीं।',

  // 2. SIMPLE MEANING
  simpleMeaningEn:
    'You are responsible for your efforts, decisions, and commitment, but you cannot dictate the final outcome. Results depend on countless external factors beyond any single person’s will. When you obsess over the outcome, you scatter your mental energy and invite anxiety. When you pour yourself into honest action, you find calm focus and mastery.',

  // 3. SIMPLE HINDI MEANING
  simpleMeaningHi:
    'आपका पूरा अधिकार केवल अपनी मेहनत, नीयत और कर्म पर है, उसके नतीजे पर नहीं। नतीजा कई बाहरी परिस्थितियों पर निर्भर करता है जो आपके वश में नहीं हैं। जब आप परिणाम की चिंता छोड़कर काम में तल्लीन हो जाते हैं, तो मन शांत और एकाग्र रहता है। कर्म से भागना भी कोई समाधान नहीं है।',

  // 4. KEY WORDS
  keyWords: [
    {
      pada: 'कर्मणि (Karmaṇi)',
      iast: 'karmaṇi',
      root: 'धातु: कृ (करना, यत्न करना)',
      functionalMeaning: 'In action, duty, and honest effort — your active sphere of influence.',
      functionalMeaningHi: 'आपके कर्तव्य और पुरुषार्थ में — जो आपके वश में है।',
    },
    {
      pada: 'अधिकारः (Adhikāraḥ)',
      iast: 'adhikāraḥ',
      root: 'अधि + कृ (कार्यक्षेत्र, अधिकार)',
      functionalMeaning: 'Sovereignty, jurisdiction, rightful responsibility — not an entitlement to claim rewards, but your domain of agency.',
      functionalMeaningHi: 'कार्यक्षेत्र, ज़िम्मेदारी और सामर्थ्य — पुरस्कार मांगने का दावा नहीं, बल्कि कर्म करने का अधिकार।',
    },
    {
      pada: 'मा फलेषु (Mā Phaleṣu)',
      iast: 'mā phaleṣu',
      root: 'मा (कदापि नहीं) + फलेषु (परिणामों में)',
      functionalMeaning: 'Never in the fruits — you control the cultivation and seeding, but cannot guarantee the harvest.',
      functionalMeaningHi: 'परिणाम या फल पर कभी नहीं — बीज बोना आपके हाथ में है, फल पर आपका एकाधिकार नहीं।',
    },
    {
      pada: 'अकर्मणि (Akarmaṇi)',
      iast: 'akarmaṇi',
      root: 'अ (अभाव) + कर्मणि (कर्म न करना)',
      functionalMeaning: 'In inaction, giving up, or apathy — a warning against cynicism and escapism.',
      functionalMeaningHi: 'निष्क्रियता, आलस्य या पलायन में — कर्म छोड़ देने में तुम्हारी आसक्ति न हो।',
    },
  ],

  // 5. WHY IT MATTERS TODAY
  whyItMattersToday: [
    {
      title: 'Exam & Interview Pressure',
      titleHi: 'परीक्षा व नौकरी का तनाव',
      text: 'You can prepare with genuine dedication for an exam or interview, but you cannot control the reviewer’s mood, grading curve, or competitor pool. Focusing on preparation removes paralyzing dread.',
    },
    {
      title: 'Career & Creative Projects',
      titleHi: 'करियर व रचनात्मक कार्य',
      text: 'Posting artwork, writing software, or launching a startup requires immense energy. You control craftsmanship; algorithms and public reception are outside your hands. Focusing on craft preserves stamina.',
    },
    {
      title: 'Social Comparison & Validation',
      titleHi: 'तुलना और सोशल मीडिया',
      text: 'Measuring self-worth by likes, views, or peer milestones surrenders your peace to strangers. Dedication to the work itself preserves inner dignity and freedom.',
    },
    {
      title: 'Fear of Failure & Procrastination',
      titleHi: 'असफलता का भय व टालमटोल',
      text: 'Procrastination is often perfectionism paralyzed by the fear of poor feedback. Detaching from the outcome frees you to take courageous, honest action today.',
    },
  ],

  // 6. A RELATABLE MODERN EXAMPLE (Explicitly labeled)
  modernExample: {
    context: 'Preparing for a Decisive University Exam or Job Interview',
    contextHi: 'प्रतियोगी परीक्षा या नौकरी के साक्षात्कार की तैयारी',
    scenarioEn:
      'Imagine preparing for an important university entrance exam or client presentation. You control how thoroughly you revise, how well you rest, and how honestly you respond during the test. However, the difficulty curve of the exam, unpredictable shifts in the job market, or how evaluators mark papers remain completely outside your personal control. If your mind is consumed by asking "What if I fail? What will relatives say?" while studying, you absorb far less knowledge. If you immerse yourself purely in understanding each topic with full care, your mind stays calm, sharp, and confident.',
    scenarioHi:
      'मान लीजिए आप किसी बड़ी प्रतियोगी परीक्षा या नौकरी के इंटरव्यू की तैयारी कर रहे हैं। आप कितनी लगन से पढ़ते हैं, कितना अभ्यास करते हैं और परीक्षा हॉल में कितनी एकाग्रता रखते हैं — यह पूरी तरह आपके हाथ में है। लेकिन प्रश्नपत्र का कठिन स्तर, परीक्षकों का मूड या कट-ऑफ क्या रहेगा — यह आपके वश में नहीं है। यदि पढ़ते समय मन में यही चलता रहे कि "अगर चयन नहीं हुआ तो क्या होगा?", तो आपकी तैयारी कमजोर हो जाती है। जब आप परिणाम का डर छोड़कर केवल आज के अध्याय को समझने में डूब जाते हैं, तो मन शांत और प्रदर्शन सर्वोत्तम होता है।',
    disclaimer: 'समसामयिक संपादकीय उदाहरण · प्राचीन शास्त्र का मूल भाग नहीं (Editorial Modern Illustration · Not Scripture)',
  },

  // 7. WHAT IT DOES NOT MEAN
  whatItDoesNotMean: [
    {
      title: 'It does NOT mean: "Do not set goals or plan ahead"',
      titleHi: 'यह लक्ष्य न बनाने या योजना न बनाने की बात नहीं है',
      text: 'Having clear objectives is sensible and necessary. The verse cautions against psychological obsession (āsakti) that turns goals into sources of paralyzing anxiety.',
    },
    {
      title: 'It does NOT mean: "Become passive or fatalistic"',
      titleHi: 'यह भाग्यवादी बनने या हाथ पर हाथ धरकर बैठने की बात नहीं है',
      text: 'The second half explicitly commands: mā te saṅgo\'stvakarmaṇi — never succumb to laziness, despair, or giving up on duty.',
    },
    {
      title: 'It does NOT mean: "Tolerate unfairness or injustice"',
      titleHi: 'यह अन्याय सहने या उदासीन रहने का उपदेश नहीं है',
      text: 'Krishna is speaking on a battlefield, urging Arjuna to stand up and courageously fulfill his duty for dharma, not retreat into escapism.',
    },
    {
      title: 'It does NOT mean: "Outcomes are unimportant"',
      titleHi: 'यह नहीं कि परिणाम का कोई महत्व नहीं है',
      text: 'Results will happen naturally in accordance with cause and effect. But worrying about them does not improve them; doing your best action does.',
    },
  ],

  // 8. TRY THIS TODAY (< 15 mins)
  tryThisToday: {
    title: 'The 15-Minute Uncluttered Focus Sprint',
    titleHi: '15 मिनट का एकाग्र कर्म-अभ्यास',
    instructionEn:
      'Pick one important pending task today (studying one difficult topic, writing an important email, or drafting a plan). Put your phone on "Do Not Disturb" for exactly 15 minutes. Commit to doing the task with complete care, with zero checking of notifications, views, or thoughts of external approval.',
    instructionHi:
      'आज अपनी टू-डू लिस्ट में से कोई एक महत्वपूर्ण काम चुनें (जैसे किसी कठिन विषय के दो पन्ने पढ़ना या कोई जरूरी काम निपटाना)। ठीक 15 मिनट के लिए फोन को साइलेंट करें और पूरी निष्ठा से केवल उस काम में डूब जाएं — बिना यह सोचे कि लोग क्या कहेंगे या इसका क्या नतीजा निकलेगा।',
    duration: '< 15 minutes',
  },

  // 9. THINK ABOUT IT (Reflection Question)
  reflectionQuestion: {
    en: 'Which upcoming result or validation are you trying too hard to control right now, and what would happen if you directed all that energy purely into your immediate next action?',
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
    reference: 'अध्याय 2, श्लोक 47 (Chapter 2, Verse 47)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 26 (Mahābhārata, Bhīṣma Parva 26.47)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern examples and psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};
