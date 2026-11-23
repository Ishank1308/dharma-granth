/**
 * Pedagogical Breakdowns for Core Bhagavad Gita Chapter 3 Verses:
 * - BG 3.9 (यज्ञार्थात्कर्मणोऽन्यत्र - Yajna vs Bondage)
 * - BG 3.21 (यद्यदाचरति श्रेष्ठः - Leadership by Example)
 * - BG 3.30 (मयि सर्वाणि कर्माणि - Surrender of Action & Vigata-jvara)
 * - BG 3.35 (श्रेयान्स्वधर्मो विगुणः - Svadharma vs Paradharma)
 * - BG 3.42 (इन्द्रियाणि पराण्याहुः - Hierarchy of Faculties)
 *
 * Epistemic Integrity:
 * - Original Sanskrit and classical commentaries (Shankara, Ramanuja, Sridhara)
 *   are strictly separated from contemporary reflections.
 * - Modern psychological analogies carry explicit educational disclaimers.
 */

import type { PedagogicalVerseData } from './pedagogical-gita-2-47';

export const GITA_3_9_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 3,
  verseId: 9,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Karma Yoga',
  chapterTitleSanskrit: 'कर्मयोग',
  sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः ।\nतदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर ॥',
  transliteration: "yajñārthāt karmaṇo 'nyatra loko 'yaṁ karma-bandhanaḥ |\ntad-arthaṁ karma kaunteya mukta-saṅgaḥ samācara ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Action creates bondage unless done as a sacrifice; act for that higher purpose, free from clinging attachment.',
  inOneLineHi: 'यज्ञ (समर्पण भाव) के अलावा अन्य कारणों से किया कर्म बंधन बनाता है; अतः हे अर्जुन, आसक्ति छोड़कर उसी हेतु कर्म करो।',

  simpleMeaningEn:
    'When work is driven purely by self-centered craving, every task generates anxiety, possessiveness, and karmic entanglement. But when action is transformed into yajña—a dedicated offering for the collective good and cosmic order—it liberates the mind instead of binding it. Krishna instructs Arjuna to act with complete commitment while remaining inwardly untethered from personal cravings.',
  simpleMeaningHi:
    'जब मनुष्य केवल अपने संकीर्ण स्वार्थ के लिए काम करता है, तो वह कर्म के फलों और मानसिक चिंताओं में उलझकर बंध जाता है। इसके विपरीत, जब कर्म को समाज, प्रकृति और ईश्वर के प्रति निःस्वार्थ समर्पण (यज्ञ) मानकर किया जाता है, तो वही कर्म मुक्तिदायक बन जाता है। श्रीकृष्ण निष्काम भाव से कर्तव्य निभाने का आदेश देते हैं।',

  keyWords: [
    {
      pada: 'यज्ञार्थात् (Yajñārthāt)',
      iast: 'yajñārthāt',
      root: 'यज् + अर्थात् (यज्ञ / समर्पण के निमित्त)',
      functionalMeaning: 'For the sake of selfless sacrifice, divine offering, or cosmic harmony.',
      functionalMeaningHi: 'निःस्वार्थ समर्पण या लोककल्याण के निमित्त।',
    },
    {
      pada: 'कर्मबन्धनः (Karma-bandhanaḥ)',
      iast: 'karma-bandhanaḥ',
      root: 'कर्मन् + बन्ध् (कर्म से बंधने वाला)',
      functionalMeaning: 'Bound and psychologically entangled by the reactive residue of selfish action.',
      functionalMeaningHi: 'कर्म के बंधनों और मानसिक तनाव में जकड़ा हुआ।',
    },
    {
      pada: 'मुक्तसङ्गः (Mukta-saṅgaḥ)',
      iast: 'mukta-saṅgaḥ',
      root: 'मुच् + सङ्ग (आसक्ति से रहित)',
      functionalMeaning: 'Free from clinging attachment, possessive bias, and personal greed.',
      functionalMeaningHi: 'फल की आसक्ति, ममता और संकीर्णता से पूरी तरह मुक्त।',
    },
    {
      pada: 'समाचर (Samācara)',
      iast: 'samācara',
      root: 'सम् + आ + चर् (भली-भांति आचरण करना)',
      functionalMeaning: 'Execute thoroughly, conscientiously, and with undivided craftsmanship.',
      functionalMeaningHi: 'श्रेष्ठ भाव से भली-भांति कर्तव्य का पालन करो।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Breaking Transactional Burnout',
      titleHi: 'सौदेबाजी की मानसिकता से मुक्ति',
      text: 'Viewing work strictly as a quid-pro-quo exchange makes every setback feel like personal exploitation. Shifting to an attitude of craftsmanship and societal contribution restores vitality.',
    },
    {
      title: 'Ecological and Social Reciprocity',
      titleHi: 'पारिस्थितिक और सामाजिक संतुलन',
      text: 'Yajña is the original ancient model of circular responsibility—acknowledging that we take constantly from nature and society, and must reciprocate through noble effort.',
    },
  ],

  modernExample: {
    context: 'Software Open Source Contribution vs Closed Hoarding',
    contextHi: 'ओपन-सोर्स योगदान बनाम स्वार्थी संग्रहण',
    scenarioEn:
      'A software engineer contributes to a public public-health tool without demanding applause or instant remuneration. By viewing the skill as an offering to society, they build mastery and peace of mind rather than feeling chronically bitter about external credit.',
    scenarioHi:
      'एक सॉफ्टवेयर इंजीनियर जनहित के काम में बिना श्रेय की चिंता किए अपना योगदान देता है। इस सेवा भाव से उसका कौशल और मानसिक शांति बढ़ती है, जबकि लगातार फल की सौदेबाजी करने वाला केवल तनाव पाता है।',
    disclaimer:
      'Modern open-source or workplace analogies are educational aids only; classical Vedic yajña involves cosmic, ritual, and spiritual dimensions of sacrifice.',
  },

  whatItDoesNotMean: [
    {
      title: 'Not an excuse to tolerate workplace abuse',
      titleHi: 'शोषण स्वीकार करने का लाइसेंस नहीं',
      text: 'Sacrifice means inner unselfishness, not passive acceptance of injustice or economic exploitation.',
    },
    {
      title: 'Not sloppy or careless work',
      titleHi: 'लापरवाह या घटिया काम नहीं',
      text: 'The verse demands "samācara"—performing action with the highest quality and dedication.',
    },
  ],

  tryThisToday: {
    title: 'Dedicate One Task as an Offering',
    titleHi: 'आज एक कार्य को समर्पण मानकर करें',
    instructionEn:
      'Choose one mundane or challenging task today. Before starting, silently state: "I perform this for the well-being of all involved, not for personal praise." Observe how anxiety drops.',
    instructionHi:
      'आज कोई एक कठिन काम चुनें। शुरू करने से पहले मन में कहें: "मैं यह काम बिना प्रशंसा की चाह के सेवा भाव से कर रहा हूँ।" देखें कैसे दबाव कम होता है।',
    duration: '10 mins during active work',
  },

  reflectionQuestion: {
    en: 'Which of your daily efforts feel like a heavy burden, and what would happen if you reframed them as a generous contribution?',
    hi: 'आपके दैनिक कार्यों में से कौन सा काम आपको बोझ लगता है, और यदि आप इसे समाज के प्रति सेवा मान लें तो क्या बदलेगा?',
  },

  commentaryPerspectives: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankara)',
      tradition: 'अद्वैत वेदान्त',
      work: 'श्रीमद्भगवद्गीताभाष्य',
      summaryEn:
        'Yajña refers to Ishvara (the Supreme Lord). Works performed for the Lord do not bind the performer; all other work binds to the wheel of samsara.',
      summaryHi:
        'यज्ञ का अर्थ ईश्वर है। ईश्वर के निमित्त किया गया कर्म कर्ता को नहीं बांधता; केवल अपने स्वार्थ के लिए किया गया कर्म ही संसार में बांधता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanuja)',
      tradition: 'विशिष्टाद्वैत वेदान्त',
      work: 'गीताभाष्य',
      summaryEn:
        'Actions performed as worship of the Supreme Ruler purify the soul of beginningless vasanas and foster spontaneous devotion.',
      summaryHi:
        'परमेश्वर की आराधना मानकर किए गए कर्म अनादि काल के विकारों को धो डालते हैं और आत्म-साक्षात्कार का मार्ग खोलते हैं।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'भक्ति-वेदान्त',
      work: 'सुबोधिनी टीका',
      summaryEn:
        'Selfish labor knots the heart; labor offered to the Lord dissolves bondage and yields liberation.',
      summaryHi:
        'स्वार्थ से किया गया परिश्रम हृदय की ग्रंथियों को बांधता है; भगवदर्पण बुद्धि से किया गया कर्म मुक्ति देता है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 3, श्लोक 9 (Chapter 3, Verse 9)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 27 (Mahābhārata, Bhīṣma Parva 27.9)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_3_21_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 3,
  verseId: 21,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Karma Yoga',
  chapterTitleSanskrit: 'कर्मयोग',
  sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
  transliteration: "yad yad ācarati śreṣṭhas tat tad evetaro janaḥ |\nsa yat pramāṇaṁ kurute lokas tad anuvartate ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Whatever an exemplary person does, common people follow; whatever standard they set, the world adopts.',
  inOneLineHi: 'श्रेष्ठ पुरुष जैसा आचरण करते हैं, अन्य लोग भी वैसा ही करते हैं; वे जो मानक स्थापित करते हैं, संसार उसी पर चलता है।',

  simpleMeaningEn:
    'Leaders, preceptors, and elders wield immense social influence. People instinctively emulate the actions, integrity, and discipline of those they look up to. Therefore, even those who have realized personal peace must never abandon constructive action or ethical vigilance, knowing that their standard directly shapes the moral fabric of society.',
  simpleMeaningHi:
    'समाज के श्रेष्ठ और सम्मानित व्यक्ति जैसा व्यवहार करते हैं, साधारण लोग भी उसी का अनुकरण करते हैं। नेता या विद्वान जो आचरण और मानक स्थापित करते हैं, समस्त समाज उसी पथ पर अग्रसर होता है। इसलिए ज्ञानी और उत्तरदायी व्यक्तियों को सदैव मर्यादा और धर्म का पालन करना चाहिए ताकि समाज में अव्यवस्था न फैले।',

  keyWords: [
    {
      pada: 'श्रेष्ठः (Śreṣṭhaḥ)',
      iast: 'śreṣṭhaḥ',
      root: 'प्रशस्य + तम (श्रेष्ठ / अग्रणी)',
      functionalMeaning: 'The exemplary individual, leader, elder, or moral authority in society.',
      functionalMeaningHi: 'समाज का अग्रणी, आदरणीय या प्रभावशाली व्यक्ति।',
    },
    {
      pada: 'आचरति (Ācarati)',
      iast: 'ācarati',
      root: 'आ + चर् (आचरण करना)',
      functionalMeaning: 'Practices, lives out, and embodies in daily action.',
      functionalMeaningHi: 'अपने जीवन और व्यवहार में उतारता है।',
    },
    {
      pada: 'प्रमाणम् (Pramāṇam)',
      iast: 'pramāṇam',
      root: 'प्र + मा (मानक / प्रामाणिक आदर्श)',
      functionalMeaning: 'The authoritative standard, benchmark, or model of conduct.',
      functionalMeaningHi: 'प्रामाणिक आदर्श, कसौटी या मर्यादा।',
    },
    {
      pada: 'अनुवर्तते (Anuvartate)',
      iast: 'anuvartate',
      root: 'अनु + वृत् (पीछे चलना / अनुकरण करना)',
      functionalMeaning: 'Follows suit, adopts, and conforms to in behavior.',
      functionalMeaningHi: 'पीछे-पीछे चलता है, वैसा ही आचरण अपनाता है।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Accountability of Cultural & Corporate Influencers',
      titleHi: 'प्रभावशाली व्यक्तियों की नैतिक जिम्मेदारी',
      text: 'Public figures and organizational leaders cannot preach one standard and practice another; their unvarnished behavior sets the real cultural benchmark.',
    },
    {
      title: 'Family and Mentorship Dynamics',
      titleHi: 'परिवार और गुरु-शिष्य संबंध',
      text: 'Children and students absorb how adults handle adversity and integrity far more through observed behavior than through formal lectures.',
    },
  ],

  modernExample: {
    context: 'Tech Lead Upholding Work Ethics',
    contextHi: 'टीम लीडर द्वारा कार्य-मर्यादा का पालन',
    scenarioEn:
      'A senior engineering manager could easily cut ethical corners or skip documentation without getting caught. By choosing transparency and thoroughness, the entire junior team adopts the same high benchmark naturally without needing policing.',
    scenarioHi:
      'एक वरिष्ठ प्रबंधक यदि स्वयं ईमानदारी से नियमों का पालन करता है और अपनी गलतियों को स्वीकार करता है, तो पूरी टीम में स्वतः विश्वास और उच्च मानकों की संस्कृति स्थापित हो जाती है।',
    disclaimer:
      'Modern leadership case studies are pedagogical parallels; Krishna addresses Arjuna as a royal Kshatriya responsible for cosmic social order (loka-sangraha).',
  },

  whatItDoesNotMean: [
    {
      title: 'Not mindless conformism or blind idolatry',
      titleHi: 'अंधानुकरण या चापलूसी नहीं',
      text: 'The verse emphasizes the leader’s moral duty to set virtuous standards, not a recommendation for people to blindly follow hypocrites.',
    },
    {
      title: 'Not an excuse to show off righteousness',
      titleHi: 'दिखावे का धार्मिक प्रदर्शन नहीं',
      text: 'The conduct must spring from authentic integrity (śreṣṭhatva), not PR management or virtue signaling.',
    },
  ],

  tryThisToday: {
    title: 'Examine Your Footprint as an Example',
    titleHi: 'अपने प्रभाव का आत्मनिरीक्षण करें',
    instructionEn:
      'Think of someone younger or less experienced who looks up to you. Identify one habit you want them to adopt, and practice it scrupulously today without lecturing.',
    instructionHi:
      'अपने किसी छोटे भाई-बहन या कनिष्ठ सहकर्मी के बारे में सोचें जो आपका सम्मान करता है। आज बिना उपदेश दिए स्वयं उस सद्गुण का पालन करें जो आप उनमें देखना चाहते हैं।',
    duration: 'All day awareness',
  },

  reflectionQuestion: {
    en: 'If everyone in your environment adopted the exact ethical shortcuts you take when nobody is looking, what kind of world would it create?',
    hi: 'यदि आपके आस-पास के सभी लोग वही गुप्त समझौते करने लगें जो आप अकेले में करते हैं, तो वह समाज कैसा बनेगा?',
  },

  commentaryPerspectives: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankara)',
      tradition: 'अद्वैत वेदान्त',
      work: 'श्रीमद्भगवद्गीताभाष्य',
      summaryEn:
        'Even if an enlightened sage has no personal desires left, they must continue performing righteous works for loka-sangraha (protecting the masses from moral collapse).',
      summaryHi:
        'यद्यपि आत्मज्ञानी को अपने लिए कोई कर्म नहीं करना होता, फिर भी लोक-संग्रह (संसार को पतन से बचाने) के लिए उसे धर्मानुकूल कर्म करना अनिवार्य है।',
    },
    ramanujan: {
      author: 'रामानुजाचार्य (Ramanuja)',
      tradition: 'विशिष्टाद्वैत वेदान्त',
      work: 'गीताभाष्य',
      summaryEn:
        'The noble must live so that seekers are not confused or discouraged by seeing the great shirk their sacred duties.',
      summaryHi:
        'श्रेष्ठ व्यक्तियों को ऐसा जीवन जीना चाहिए जिससे सामान्य साधकों की आस्था न डगमगाए और वे कर्तव्य-मार्ग पर दृढ़ रहें।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'भक्ति-वेदान्त',
      work: 'सुबोधिनी टीका',
      summaryEn:
        'The conduct of the virtuous is the living scripture of the masses. A leader who fails in duty harms thousands.',
      summaryHi:
        'सज्जनों का आचरण ही समाज के लिए सजीव शास्त्र होता है। यदि श्रेष्ठ व्यक्ति धर्म छोड़ दे, तो समाज दिशाहीन हो जाता है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 3, श्लोक 21 (Chapter 3, Verse 21)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 27 (Mahābhārata, Bhīṣma Parva 27.21)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_3_30_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 3,
  verseId: 30,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Karma Yoga',
  chapterTitleSanskrit: 'कर्मयोग',
  sanskrit: 'मयि सर्वाणि कर्माणि संन्यस्याध्यात्मचेतसा ।\nनिराशीर्निर्ममो भूत्वा युध्यस्व विगतज्वरः ॥',
  transliteration: "mayi sarvāṇi karmāṇi saṁnasyādhyātma-cetasā |\nnirāśīr nirmamo bhūtvā yudhyasva vigata-jvaraḥ ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Surrender all actions to Me with a spiritual mindset; free from expectation and possessiveness, fight without mental fever.',
  inOneLineHi: 'विवेकपूर्ण बुद्धि से सब कर्म मुझमें समर्पित कर, आशा और ममतारहित होकर, संताप-मुक्त होकर कर्तव्य रूपी युद्ध करो।',

  simpleMeaningEn:
    'This verse provides the master formula for high-stakes action. Krishna instructs Arjuna to dedicate every deed to the Divine with a mind centered on the witness Self. By shedding selfish expectations (nirāśīḥ), relinquishing proprietary pride (nirmamaḥ), and quelling mental fever or neurotic agitation (vigata-jvaraḥ), one can fight life’s hardest battles with supreme clarity and poise.',
  simpleMeaningHi:
    'यह श्लोक कठिन परिस्थितियों में कर्म करने का स्वर्णिम सूत्र है। श्रीकृष्ण कहते हैं कि सब कर्मों को ईश्वर को अर्पित करो, मन को आत्म-भाव में स्थित रखो, व्यक्तिगत फल की तृष्णा (आशा) छोड़ो, ममता त्यागो, और मानसिक संताप या उत्तेजना से मुक्त होकर अपने कर्तव्य में डट जाओ।',

  keyWords: [
    {
      pada: 'संन्यस्य (Saṁnyasya)',
      iast: 'saṁnyasya',
      root: 'सम् + नि + अस् (समर्पण करना / न्यास करना)',
      functionalMeaning: 'Completely entrusting, dedicating, or offering up without claiming sole authorship.',
      functionalMeaningHi: 'ईश्वर में भली-भांति समर्पित कर देना।',
    },
    {
      pada: 'अध्यात्मचेतसा (Adhyātma-cetasā)',
      iast: 'adhyātma-cetasā',
      root: 'अधि + आत्मन् + चेतस् (आत्म-बुद्धि से)',
      functionalMeaning: 'With a mind anchored in the higher spiritual witness rather than the petty ego.',
      functionalMeaningHi: 'विवेकवती आत्म-निष्ठ बुद्धि के द्वारा।',
    },
    {
      pada: 'निर्ममः (Nirmamaḥ)',
      iast: 'nirmamaḥ',
      root: 'निर् + मम (ममता-रहित)',
      functionalMeaning: 'Free from possessive clinging, proprietary pride, and the illusion of "this is mine."',
      functionalMeaningHi: 'ममता और "यह मेरा है" के अहंकार से शून्य।',
    },
    {
      pada: 'विगतज्वरः (Vigata-jvaraḥ)',
      iast: 'vigata-jvaraḥ',
      root: 'विगत + ज्वर (संताप-रहित / शांत)',
      functionalMeaning: 'Free from inner fever, panic, acute mental friction, and burning anxiety.',
      functionalMeaningHi: 'मानसिक संताप, बेचैनी और उद्वेग से पूरी तरह मुक्त।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Cooling the "Mental Fever" of Hyper-Productivity',
      titleHi: 'आधुनिक मानसिक संताप को शांत करना',
      text: 'Workplace burnout is largely psychological "fever" (jvara)—frantic worry about credit, promotion, and control. Discarding possessiveness brings surgical precision without exhaustion.',
    },
    {
      title: 'Decisive Action Under Pressure',
      titleHi: 'दबाव में सटीक निर्णय लेना',
      text: 'Surrendering outcomes to a higher power allows surgeons, crisis responders, and leaders to act decisively without being paralyzed by dread.',
    },
  ],

  modernExample: {
    context: 'Surgeon Performing an Emergency Operation',
    contextHi: 'आपातकालीन शल्य-चिकित्सा में एकाग्रता',
    scenarioEn:
      'A surgeon enters an emergency trauma surgery. If they obsess over lawsuits, career reputation, or panic about failure, their hands tremble. When they dedicate their skill fully to the life before them without egoic fever, their precision reaches its highest pinnacle.',
    scenarioHi:
      'एक चिकित्सक गंभीर ऑपरेशन करते समय यदि अपने व्यक्तिगत लाभ या असफलता के भय में खो जाएगा तो उसके हाथ कांपेंगे। जब वह पूर्ण एकाग्रता और शांत मन (विगतज्वर) से केवल कर्तव्य पर ध्यान देता है, तो परिणाम सर्वोत्तम होते हैं।',
    disclaimer:
      'Modern high-pressure vocational examples illustrate the psychological state of "vigata-jvara"; Krishna’s battlefield command addresses existential spiritual surrender.',
  },

  whatItDoesNotMean: [
    {
      title: 'Not fatalistic passivity or apathy',
      titleHi: 'भाग्यवादिता या आलस्य नहीं',
      text: 'Krishna explicitly commands "yudhyasva" (fight!). Surrender does not mean laying down tools; it means acting with maximum energy and zero neurosis.',
    },
    {
      title: 'Not abdicating ethical responsibility',
      titleHi: 'नैतिक जिम्मेदारी से भागना नहीं',
      text: 'Surrendering action to God does not justify committing atrocities and calling it divine will.',
    },
  ],

  tryThisToday: {
    title: 'The "Vigata-Jvara" Reset Breath',
    titleHi: 'संताप-मुक्त होने का क्षण',
    instructionEn:
      'When you feel your heartbeat accelerate from deadline stress, pause. Exhale slowly, let go of the proprietary grip on the result, and say: "I offer the effort; the outcome belongs to the whole." Step back into action calm and clear.',
    instructionHi:
      'जब काम के तनाव से घबराहट हो, तो ठहरें। गहरी श्वास लें और अहंकार को छोड़ें: "मैं केवल श्रेष्ठ प्रयास कर सकता हूँ, परिणाम प्रकृति के हाथ में है।" शांत होकर पुनः कार्य में लगें।',
    duration: '2 mins',
  },

  reflectionQuestion: {
    en: 'What specific "fever" or proprietary anxiety is currently draining your energy in your most important project?',
    hi: 'आपके जीवन के महत्वपूर्ण काम में कौन सी व्यर्थ चिंता या अहंकार आपकी ऊर्जा को चूस रहा है?',
  },

  commentaryPerspectives: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankara)',
      tradition: 'अद्वैत वेदान्त',
      work: 'श्रीमद्भगवद्गीताभाष्य',
      summaryEn:
        'With consciousness resting in the inner ruler (Antaryamin), perform your ordained duty as an instrument of Ishvara, free from sorrow, desire, and mental fever.',
      summaryHi:
        'अन्तर्यामी ईश्वर में बुद्धि को स्थिर करके, अपने को ईश्वर का निमित्त मानकर शोक, आशा और मानसिक ज्वर से रहित होकर कर्तव्य करो।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanuja)',
      tradition: 'विशिष्टाद्वैत वेदान्त',
      work: 'गीताभाष्य',
      summaryEn:
        'Recognize the soul as belonging to the Supreme Lord, who is the real inner prompter of all faculties. When all ownership is surrendered to Him, all anxiety departs.',
      summaryHi:
        'यह समझो कि आत्मा और सब साधन परमेश्वर के हैं। जब समस्त स्वामित्व परमात्मा को सौंप दिया जाता है, तो समस्त संताप समाप्त हो जाता है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'भक्ति-वेदान्त',
      work: 'सुबोधिनी टीका',
      summaryEn:
        'Lacking ownership of fruit and free from envy, battle without the fever of grief or hesitation.',
      summaryHi:
        'फल की ममता छोड़कर और संताप रूपी ज्वर से मुक्त होकर उत्साहपूर्वक युद्ध रूपी स्वधर्म का पालन करो।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 3, श्लोक 30 (Chapter 3, Verse 30)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 27 (Mahābhārata, Bhīṣma Parva 27.30)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_3_35_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 3,
  verseId: 35,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Karma Yoga',
  chapterTitleSanskrit: 'कर्मयोग',
  sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् ।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
  transliteration: "śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt |\nsva-dharme nidhanaṁ śreyaḥ para-dharmo bhayāvahaḥ ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'Better is one’s own duty, even if flawed, than another’s duty done well; dying in one’s own path is preferable to copying another.',
  inOneLineHi: 'दूसरे के भली-भांति किए धर्म से अपना गुणरहित धर्म भी श्रेष्ठ है; अपने धर्म में मृत्यु भी कल्याणकारी है, पराया धर्म भय देने वाला है।',

  simpleMeaningEn:
    'Living someone else’s life out of peer pressure, social prestige, or cowardice fractures human integrity. Your authentic calling (svadharma), aligned with your inherent constitution and ethical responsibilities, nurtures organic inner growth even when practiced with imperfections. Mimicking another’s path generates chronic psychological friction, impostor dread, and existential disorientation.',
  simpleMeaningHi:
    'दूसरों की देखा-देखी या सामाजिक दबाव में आकर अपनी वास्तविक प्रकृति को नकारना आत्मा के लिए अत्यंत हानिकारक है। अपने स्वाभाविक कर्तव्य (स्वधर्म) का पालन करना, भले ही उसमें कमियां हों, दूसरे के जीवन की नकल करने से कहीं श्रेष्ठ है। पराये धर्म की नकल अंततः आंतरिक भय, अपराधबोध और विनाश की ओर ले जाती है।',

  keyWords: [
    {
      pada: 'स्वधर्मः (Sva-dharmaḥ)',
      iast: 'sva-dharmaḥ',
      root: 'स्व + धर्मन् (अपना स्वाभाविक कर्तव्य)',
      functionalMeaning: 'One’s authentic vocation, natural psychological orientation, and moral duty.',
      functionalMeaningHi: 'अपनी प्रकृति और स्थिति के अनुकूल वास्तविक कर्तव्य।',
    },
    {
      pada: 'विगुणः (Viguṇaḥ)',
      iast: 'viguṇaḥ',
      root: 'वि + गुण (गुणों से हीन / त्रुटिपूर्ण)',
      functionalMeaning: 'Lacking external sparkle, imperfect, or socially perceived as modest.',
      functionalMeaningHi: 'बाहरी चमक-दमक से रहित अथवा कमियों वाला।',
    },
    {
      pada: 'परधर्मात् (Para-dharmāt)',
      iast: 'para-dharmāt',
      root: 'पर + धर्मन् (दूसरे का कर्तव्य)',
      functionalMeaning: 'From the alien path or calling that does not fit one’s innate nature.',
      functionalMeaningHi: 'दूसरे के स्वभाव और स्थिति के अनुकूल कर्तव्य से।',
    },
    {
      pada: 'भयावहः (Bhayāvahaḥ)',
      iast: 'bhayāvahaḥ',
      root: 'भय + आ + वह् (भय उत्पन्न करने वाला)',
      functionalMeaning: 'Fraught with existential terror, moral dislocation, and psychic harm.',
      functionalMeaningHi: 'गंभीर भय, अशांति और पतन का कारण बनने वाला।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Resisting Social Comparison and Mimicry',
      titleHi: 'सामाजिक तुलना और नकल से बचाव',
      text: 'Social media pressures people into chasing careers and lifestyles that do not suit their genuine strengths, causing pervasive impostor anxiety and emptiness.',
    },
    {
      title: 'Authenticity as the Foundation of Mental Health',
      titleHi: 'प्रामाणिकता ही मानसिक स्वास्थ्य का आधार',
      text: 'True peace comes from mastering your own genuine domain, rather than masquerading in prestigious roles for external applause.',
    },
  ],

  modernExample: {
    context: 'Choosing Authentic Craftsmanship Over Hyped Careers',
    contextHi: 'दिखावे के करियर के बदले अपनी वास्तविक रुचि चुनना',
    scenarioEn:
      'A gifted teacher feels pressured by peers to take an executive finance role that they detest, merely for social status. Though they might earn high praise, the constant misalignment leaves them chronically anxious. Returning to teaching—their authentic svadharma—brings deep fulfillment.',
    scenarioHi:
      'एक व्यक्ति जो अध्यापन में कुशल है, सामाजिक दबाव में आकर कॉर्पोरेट फाइनेंस में चला जाता है। वहाँ सफलता के बावजूद वह अंदर से घुटन महसूस करता है। जब वह अपने स्वाभाविक क्षेत्र (स्वधर्म) में लौटता है, तो उसे आत्मिक शांति मिलती है।',
    disclaimer:
      'Modern career alignment analogies are educational parallels; classical svadharma encompasses psycho-spiritual temperament (svabhāva), stage of life (āśrama), and ethical duty.',
  },

  whatItDoesNotMean: [
    {
      title: 'Not a justification for complacency',
      titleHi: 'लापरवाही या अकर्मण्यता का बहाना नहीं',
      text: 'Svadharma does not mean staying stagnant or refusing to grow; it means cultivating your genuine soil rather than coveting someone else’s field.',
    },
    {
      title: 'Not rigid social determinism',
      titleHi: 'कठोर रूढ़िवादी बंधन नहीं',
      text: 'The Gita grounds svadharma in inherent psycho-physical nature (svabhāva-niyata karma), not blind hereditary limitation.',
    },
  ],

  tryThisToday: {
    title: 'Audit One "Borrowed" Obligation',
    titleHi: 'किसी पराई अपेक्षा की पहचान करें',
    instructionEn:
      'Identify one major task on your plate that you are doing only because of fear of looking bad to others. Ask yourself: "Does this align with my authentic duty?" Make a conscious choice.',
    instructionHi:
      'अपनी दिनचर्या में से कोई एक ऐसा काम पहचानें जो आप सिर्फ दूसरों को दिखाने या दबाव के कारण कर रहे हैं। विचार करें कि क्या यह आपके स्वभाव से मेल खाता है।',
    duration: '10 mins of self-reflection',
  },

  reflectionQuestion: {
    en: 'Where in your life are you exhausting yourself trying to excel at a role that is fundamentally alien to who you are?',
    hi: 'आप अपने जीवन में किस क्षेत्र में ऐसा मुखौटा पहनकर थक रहे हैं जो आपकी मूल प्रकृति के बिल्कुल विपरीत है?',
  },

  commentaryPerspectives: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankara)',
      tradition: 'अद्वैत वेदान्त',
      work: 'श्रीमद्भगवद्गीताभाष्य',
      summaryEn:
        'A person’s own duty, though imperfect, is safe because it is natural to them; attempting an alien duty creates fear of moral ruin like taking the wrong medicine.',
      summaryHi:
        'अपनी प्रकृति के अनुकूल धर्म में रहना सुरक्षित है; दूसरे का धर्म चाहे कितना भी आकर्षक लगे, अनुचित औषधि के समान विनाशकारी सिद्ध होता है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanuja)',
      tradition: 'विशिष्टाद्वैत वेदान्त',
      work: 'गीताभाष्य',
      summaryEn:
        'Karma Yoga suited to one’s inherent nature is easier to practice without mistake. Forcing oneself into another’s path invites constant stumbling.',
      summaryHi:
        'अपने स्वभाव के अनुकूल कर्मयोग में प्रमाद की संभावना कम होती है। दूसरे के मार्ग पर चलने से बार-बार पतन और भय की संभावना रहती है।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'भक्ति-वेदान्त',
      work: 'सुबोधिनी टीका',
      summaryEn:
        'Performing one’s own duty brings spiritual purification; taking up another’s duty out of pride or fear of battle leads to degradation.',
      summaryHi:
        'स्वधर्म का पालन अंतःकरण को शुद्ध करता है; अहंकार या कायरता से परधर्म अपनाना नरक और भय का कारण बनता है।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 3, श्लोक 35 (Chapter 3, Verse 35)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 27 (Mahābhārata, Bhīṣma Parva 27.35)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};

export const GITA_3_42_PEDAGOGICAL: PedagogicalVerseData = {
  scriptureId: 'bhagavadgita',
  chapterId: 3,
  verseId: 42,
  scriptureTitle: 'Bhagavad Gita',
  scriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
  chapterTitle: 'Karma Yoga',
  chapterTitleSanskrit: 'कर्मयोग',
  sanskrit: 'इन्द्रियाणि पराण्याहुरिन्द्रियेभ्यः परं मनः ।\nमनसस्तु परा बुद्धिर्यो बुद्धेः परतस्तु सः ॥',
  transliteration: "indriyāṇi parāṇyāhur indriyebhyaḥ paraṁ manaḥ |\nmanasas tu parā buddhir yo buddheḥ paratas tu saḥ ||",
  meter: 'अनुष्टुप् (Anuṣṭubh — 32 syllables)',
  epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',

  inOneLineEn: 'The senses are subtle and strong; higher than senses is mind; higher than mind is intellect; beyond intellect is the Atman.',
  inOneLineHi: 'इंद्रियाँ स्थूल शरीर से श्रेष्ठ हैं; इंद्रियों से श्रेष्ठ मन है; मन से श्रेष्ठ बुद्धि है; और बुद्धि से भी परे आत्मा है।',

  simpleMeaningEn:
    'To overcome compulsive cravings and reactivity, one must understand the ascending architecture of consciousness. The physical senses reign over inert matter, the mind synthesizes sensory data, the discerning intellect directs and judges thoughts, and the supreme conscious Self (Atman) transcends the intellect. By identifying with this innermost witness, one gains sovereignty over all lower impulses.',
  simpleMeaningHi:
    'इच्छाओं और आवेगों पर नियंत्रण पाने के लिए चेतना के स्तरों को समझना आवश्यक है। जड़ शरीर से सूक्ष्म और शक्तिशाली इंद्रियाँ हैं, इंद्रियों का नियामक मन है, मन को परखने और निर्णय देने वाली बुद्धि है, और बुद्धि को भी प्रकाशित करने वाली नित्य आत्मा है। अपने आत्म-स्वरूप को पहचानकर ही मनुष्य इच्छाओं का स्वामी बन सकता है।',

  keyWords: [
    {
      pada: 'पराणि (Parāṇi)',
      iast: 'parāṇi',
      root: 'पर (सूक्ष्म / श्रेष्ठ)',
      functionalMeaning: 'Subtler, more pervasive, and endowed with greater executive authority.',
      functionalMeaningHi: 'अधिक सूक्ष्म, व्यापक और शक्तिशाली।',
    },
    {
      pada: 'मनः (Manaḥ)',
      iast: 'manaḥ',
      root: 'मन् (संकल्प-विकल्प करने वाला)',
      functionalMeaning: 'The faculty of emotional impulses, desires, doubt, and sensory processing.',
      functionalMeaningHi: 'संकल्प-विकल्प और इच्छाओं को पैदा करने वाला अंतःकरण।',
    },
    {
      pada: 'बुद्धिः (Buddhiḥ)',
      iast: 'buddhiḥ',
      root: 'बुध् (निश्चयात्मिका शक्ति)',
      functionalMeaning: 'The faculty of reflective discernment, ethical judgment, and resolute decision.',
      functionalMeaningHi: 'विवेक, निर्णय और सही-गलत की परख करने वाली शक्ति।',
    },
    {
      pada: 'परतः (Parataḥ)',
      iast: 'parataḥ',
      root: 'पर + तस् (परे / सर्वोपरि)',
      functionalMeaning: 'Transcending, higher than all, referring to the innermost Atman/Witness.',
      functionalMeaningHi: 'सबके परे, जो साक्षी और नित्य चैतन्य आत्मा है।',
    },
  ],

  whyItMattersToday: [
    {
      title: 'Mastering Digital Addiction and Impulse Traps',
      titleHi: 'डिजिटल लत और आवेगी प्रवृत्तियों पर विजय',
      text: 'Notification pings appeal to the senses; cravings erupt in the mind. Only by anchoring in the discerning intellect and conscious self can one stop compulsive reflex loops.',
    },
    {
      title: 'The Blueprint for Emotional Regulation',
      titleHi: 'भावनात्मक संतुलन का प्रामाणिक मार्ग',
      text: 'Knowing you are not your passing emotion or your thought pattern gives you the vantage point of the witness, restoring instant self-governance.',
    },
  ],

  modernExample: {
    context: 'The Chariot Hierarchy of Impulse Control',
    contextHi: 'रथ रूपक: आवेगी इच्छाओं पर नियंत्रण',
    scenarioEn:
      'Late at night, your eyes see junk food and phone notifications (senses). The mind demands instant dopamine ("just one hour"). Instead of being hijacked, your intellect steps in: "This ruins tomorrow’s health." By resting in conscious awareness, the impulse loses its hypnotic grip.',
    scenarioHi:
      'देर रात फोन की घंटी बजती है (इंद्रिय)। मन कहता है: "आधा घंटा और रील देख लो।" तुरंत विवेकशील बुद्धि हस्तक्षेप करती है: "कल सुबह महत्वपूर्ण कार्य है, अभी सोना आवश्यक है।" साक्षी चेतना में स्थित होकर मनुष्य मन के भटकाव से बच जाता है।',
    disclaimer:
      'Contemporary neuro-psychological parallels to the sensory hierarchy mirror the ancient Katha Upanishad chariot model (1.3.3–4).',
  },

  whatItDoesNotMean: [
    {
      title: 'Not brutal physical suppression',
      titleHi: 'शरीर का हिंसक दमन नहीं',
      text: 'The verse does not recommend torturing the senses, but governing them from the higher vantage point of intellect and Self.',
    },
    {
      title: 'Not purely academic intellectualism',
      titleHi: 'केवल किताबी ज्ञान नहीं',
      text: 'The supreme faculty is not intellectual debate, but the spiritual Self (saḥ = the Atman) beyond conceptual thought.',
    },
  ],

  tryThisToday: {
    title: 'The Hierarchy Witness Drill',
    titleHi: 'चार स्तरों का अवलोकन अभ्यास',
    instructionEn:
      'When an irritating trigger occurs today: 1) Notice the sensation in the body, 2) Notice the emotional thought in the mind, 3) Activate the discerning intellect, 4) Rest as the silent witness that observes all three. Feel the irritation evaporate.',
    instructionHi:
      'जब कोई क्रोध दिलाने वाली बात हो: 1) शरीर में तनाव देखें, 2) मन में उठते विचार को देखें, 3) विवेक से निर्णय लें, 4) इन तीनों को देखने वाले शांत साक्षी में टिकें।',
    duration: '3 mins',
  },

  reflectionQuestion: {
    en: 'In your daily decision-making, which level usually drives the vehicle: the senses, emotional cravings of the mind, or the calm intellect?',
    hi: 'आपके दैनिक निर्णयों में रथ का सारथी कौन बनता है: चंचल इंद्रियाँ, मन की इच्छाएं, या विवेकपूर्ण बुद्धि?',
  },

  commentaryPerspectives: {
    shankara: {
      author: 'आदि शंकराचार्य (Adi Shankara)',
      tradition: 'अद्वैत वेदान्त',
      work: 'श्रीमद्भगवद्गीताभाष्य',
      summaryEn:
        'Senses are subtler than the gross body; mind is subtler than senses; intellect is subtler than mind; and the Atman (the ultimate seer) is the supreme witness beyond all.',
      summaryHi:
        'स्थूल शरीर से इंद्रियाँ सूक्ष्म हैं; इंद्रियों से मन, मन से बुद्धि और बुद्धि का साक्षी स्वयं आत्मा सबके परे और सर्वोपरि है।',
    },
    ramanuja: {
      author: 'रामानुजाचार्य (Ramanuja)',
      tradition: 'विशिष्टाद्वैत वेदान्त',
      work: 'गीताभाष्य',
      summaryEn:
        'Recognizing the Atman as superior to all material evolutes, one should stabilize the mind in the Self and slay desire.',
      summaryHi:
        'आत्मा को समस्त प्राकृत तत्वों से श्रेष्ठ समझकर, बुद्धि के द्वारा मन को आत्मा में स्थिर करे और काम रूपी शत्रु का नाश करे।',
    },
    sridhara: {
      author: 'श्रीधर स्वामी (Sridhara Swami)',
      tradition: 'भक्ति-वेदान्त',
      work: 'सुबोधिनी टीका',
      summaryEn:
        'Knowing that the Self is higher than the intellect, conquer the formidable enemy of lust through spiritual awareness.',
      summaryHi:
        'बुद्धि से भी श्रेष्ठ आत्मा को जानकर, अध्यात्म-ज्ञान द्वारा काम रूपी दुर्जय शत्रु को परास्त करो।',
    },
  },

  sourceTransparency: {
    scripture: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    reference: 'अध्याय 3, श्लोक 42 (Chapter 3, Verse 42)',
    epicContext: 'महाभारत, भीष्म पर्व, अध्याय 27 (Mahābhārata, Bhīṣma Parva 27.42)',
    sanskritEdition: 'गीताप्रेस गोरखपुर (Gita Press Gorakhpur) & भांडारकर प्राच्य विद्या संशोधन मंदिर (BORI Critical Edition)',
    meter: 'अनुष्टुप् छन्द (Anuṣṭubh — 8 syllables × 4 quarters)',
    epistemicTier: 'मूल स्मृति पाठ (Canonical Smriti Scripture)',
    editorialNote:
      'Modern psychological reflections are contemporary educational aids, strictly distinct from ancient revealed text.',
  },
};
