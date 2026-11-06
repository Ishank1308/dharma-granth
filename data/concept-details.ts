/**
 * Deep Scripture Concept Encyclopedia for Dharma Granth
 * Detailed philosophical analysis, Sanskrit derivations, verses, tradition comparisons,
 * and corrections of modern misunderstandings.
 */

export interface ConceptVerse {
  sanskrit: string;
  transliteration: string;
  translationEn: string;
  translationHi: string;
  reference: string;
  referenceHi: string;
  href?: string;
}

export interface ConceptContextualMeaning {
  context: string;
  contextHi: string;
  meaningEn: string;
  meaningHi: string;
}

export interface ConceptTraditionView {
  tradition: string;
  traditionHi: string;
  viewEn: string;
  viewHi: string;
}

export interface ConceptMisunderstanding {
  myth: string;
  mythHi: string;
  correction: string;
  correctionHi: string;
}

export interface ConceptDetail {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  category: 'core' | 'metaphysics' | 'practice' | 'psychology' | 'cosmology';
  colorGradient: string;
  simpleDefinition: {
    en: string;
    hi: string;
  };
  derivation: {
    root: string;
    rootMeaning: string;
    rootMeaningHi: string;
    etymologyEn: string;
    etymologyHi: string;
  };
  contextualMeanings: ConceptContextualMeaning[];
  verses: ConceptVerse[];
  traditions: ConceptTraditionView[];
  misunderstandings: ConceptMisunderstanding[];
  relatedConceptIds: string[];
  sources: string[];
}

export const CONCEPT_DETAILS: Record<string, ConceptDetail> = {
  dharma: {
    id: 'dharma',
    label: 'Dharma',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    category: 'core',
    colorGradient: 'from-amber-600 via-saffron-700 to-stone-900',
    simpleDefinition: {
      en: 'The eternal cosmic and moral order, righteousness, sacred duty, and inherent nature that upholds, supports, and harmonizes the entire universe.',
      hi: 'सृष्टि का वह शाश्वत नियम, सत्य, कर्तव्य और मर्यादा जो संपूर्ण ब्रह्मांड, समाज और व्यक्ति के जीवन को धारण और संगठित करता है।',
    },
    derivation: {
      root: 'धृ (dhṛ)',
      rootMeaning: 'To uphold, sustain, preserve, or support',
      rootMeaningHi: 'धारण करना, सम्भालना, सहारा देना',
      etymologyEn: 'Derived from the verbal root "dhṛ" with the suffix "man" (dhri + man = dharma). Classical scriptures define it: "Dhāraṇād dharmam ityāhuḥ dharmo dhārayate prajāḥ" — That which sustains and preserves the living cosmos is Dharma.',
      etymologyHi: 'संस्कृत धातु "धृ" (धारण करना) से धर्म शब्द सिद्ध होता है। महाभारत में कहा गया है: "धारणाद्धर्ममित्याहुर्धर्मो धारयते प्रजाः" — जो समस्त सृष्टि को मर्यादा और संतुलन में धारण करे, वही धर्म है।',
    },
    contextualMeanings: [
      {
        context: 'Cosmic & Universal Order (Sanātana Dharma)',
        contextHi: 'सार्वभौमिक सनातन धर्म',
        meaningEn: 'The inexorable physical, biological, and moral laws that sustain life across galaxies and epochs.',
        meaningHi: 'सृष्टि का शाश्वत नियम जो ऋतुओं, ग्रहों और समस्त जीवन चक्र को संतुलित रखता है।',
      },
      {
        context: 'Universal Human Virtues (Sādhāraṇa Dharma)',
        contextHi: 'साधारण (मानव) धर्म',
        meaningEn: 'Universal ethical values binding upon every human being: truthfulness, compassion, self-restraint, clean conscience, and harmlessness.',
        meaningHi: 'सत्य, अहिंसा, अस्तेय, क्षमा और शुचिता जैसे गुण जो प्रत्येक मनुष्य के लिए आवश्यक हैं।',
      },
      {
        context: 'Contextual Life Duty (Svadharma)',
        contextHi: 'स्वधर्म (व्यक्तिगत कर्तव्य)',
        meaningEn: 'Duty tailored to an individual’s internal temperament (svabhāva), familial obligations, and life situation.',
        meaningHi: 'अपनी प्रकृति, क्षमता और परिस्थिति के अनुसार निभाया जाने वाला निष्कपट व्यक्तिगत कर्तव्य।',
      },
      {
        context: 'Essential Inherent Nature (Svabhāva-Dharma)',
        contextHi: 'वस्तु का स्वभाव',
        meaningEn: 'The intrinsic property of an entity—as burning is the dharma of fire, and compassion is the dharma of enlightened consciousness.',
        meaningHi: 'किसी वस्तु का मूलभूत स्वभाव—जैसे अग्नि का धर्म ताप है और जल का धर्म शीतलता।',
      },
    ],
    verses: [
      {
        sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् ।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
        transliteration: 'śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt |\nsvadharme nidhanaṁ śreyaḥ paradharmo bhayāvahaḥ ||',
        translationEn: 'Better is one’s own duty, though deficient in outer polish, than the duty of another well performed. Death in the performance of one’s own duty is blessed; the duty of another is fraught with danger.',
        translationHi: 'अच्छी तरह आचरण किए हुए दूसरे के धर्म से गुणरहित भी अपना धर्म श्रेष्ठ है। अपने धर्म में तो मरना भी कल्याणकारक है और दूसरे का धर्म भय को देने वाला है।',
        reference: 'Bhagavad Gita 3.35',
        referenceHi: 'भगवद्गीता ३.३५',
        href: '/scripture/bhagavadgita/chapter/3/verse/35',
      },
      {
        sanskrit: 'धारणाद्धर्ममित्याहुर्धर्मेण विधृताः प्रजाः ।\nयत्स्याद्धारणसंयुक्तं स धर्म इति निश्चयः ॥',
        transliteration: 'dhāraṇād dharmam ityāhur dharmeṇa vidhṛtāḥ prajāḥ |\nyat syād dhāraṇa-saṁyuktaṁ sa dharma iti niścayaḥ ||',
        translationEn: 'Dharma is named from upholding; all created beings are held together by Dharma. That which possesses the power of upholding and sustaining is assuredly Dharma.',
        translationHi: 'धारण करने के कारण ही धर्म को धर्म कहा जाता है; धर्म ही प्रजा को संभाले रखता है। जो धारण करने की शक्ति से संपन्न हो, वही निश्चय ही धर्म है।',
        reference: 'Mahabharata, Karna Parva 69.58',
        referenceHi: 'महाभारत, कर्णपर्व ६९.५८',
      },
      {
        sanskrit: 'सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ॥',
        transliteration: 'satyaṁ vada | dharmaṁ cara | svādhyāyān mā pramadaḥ ||',
        translationEn: 'Speak the truth. Practice righteousness. Do not neglect daily sacred self-study.',
        translationHi: 'सत्य बोलो। धर्म का आचरण करो। स्वाध्याय में कभी प्रमाद मत करो।',
        reference: 'Taittiriya Upanishad 1.11.1',
        referenceHi: 'तैत्तिरीयोपनिषद् १.११.१',
        href: '/scripture/taittiriya/chapter/1',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Dharma is essential for purifying the mind (citta-śuddhi). It prepares the intellect for self-inquiry (Vichara), though final liberation is attained solely through direct knowledge (Jnana) of non-dual Brahman.',
        viewHi: 'धर्म अंतःकरण की शुद्धि का परम साधन है। यह चित्त को निर्मल कर आत्म-विचार के योग्य बनाता है, यद्यपि परम मुक्ति केवल ब्रह्मज्ञान से होती है।',
      },
      {
        tradition: 'Vishishtadvaita Vedanta',
        traditionHi: 'विशिष्टाद्वैत वेदान्त',
        viewEn: 'Dharma is not an abstract dry code, but joyful loving service (Kainkarya) offered to Lord Narayana, who is the inner ruler (Antaryamin) of all beings.',
        viewHi: 'धर्म कोई निर्जीव नियम नहीं, अपितु भगवान नारायण की प्रसन्नता के लिए किया गया पावन कैंकर्य (भगवत्सेवा) है।',
      },
      {
        tradition: 'Purva Mimamsa',
        traditionHi: 'पूर्व मीमांसा',
        viewEn: 'Dharma is the supreme purpose of the Vedas—injunctive righteous duty (Codana-laksana) that produces unseen positive moral force (Apurva).',
        viewHi: 'वेद विहित कर्तव्य का पालन ही धर्म है। यह कर्म व्यक्ति को अभ्युदय (कल्याण) और अपूर्व आध्यात्मिक फल प्रदान करता है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Dharma is just the Sanskrit word for sectarian religion or belief system.',
        mythHi: 'धर्म का अर्थ कोई संप्रदाय या मजहब (Religion) है।',
        correction: 'Dharma has no sectarian creed. It signifies natural cosmic order, moral virtue, duty, and inherent truth. Sectarian dogmas are sampradayas or panths, not Dharma.',
        correctionHi: 'धर्म का अर्थ संप्रदाय नहीं है। यह सार्वभौमिक सत्य, कर्तव्य और सृष्टि की मर्यादा है। संप्रदाय अलग-अलग हो सकते हैं, धर्म एक है।',
      },
      {
        myth: 'Swadharma means you are trapped in a hereditary social caste with no choice.',
        mythHi: 'स्वधर्म का अर्थ जन्म आधारित जाति में बंधे रहना है।',
        correction: 'Swadharma refers to aligning one’s actions with one’s authentic psychological constitution (svabhāva) and conscience, rather than imitating another’s nature.',
        correctionHi: 'स्वधर्म का संबंध व्यक्ति के आंतरिक स्वभाव, गुणों और कर्तव्यनिष्ठा से है, न कि किसी रूढ़िवादी बंधन से।',
      },
    ],
    relatedConceptIds: ['karma', 'ahimsa', 'yajna', 'satya', 'moksha'],
    sources: ['Rigveda 10.90', 'Taittiriya Upanishad 1.11', 'Bhagavad Gita 3.35, 18.47', 'Mahabharata Shanti Parva & Karna Parva', 'Manusmriti 2.6'],
  },

  karma: {
    id: 'karma',
    label: 'Karma',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    category: 'core',
    colorGradient: 'from-amber-700 via-orange-800 to-stone-950',
    simpleDefinition: {
      en: 'The universal moral and metaphysical law of cause and effect, where every intentional action of thought, speech, and deed generates matching fruit and shapes future consciousness.',
      hi: 'कारण और कार्य का सार्वभौमिक आध्यात्मिक नियम, जिसके अनुसार मनुष्य के प्रत्येक मन, वचन और शरीर के कर्म का निश्चित फल और संस्कार बनता है।',
    },
    derivation: {
      root: 'कृ (kṛ)',
      rootMeaning: 'To do, make, perform, or execute',
      rootMeaningHi: 'करना, रचना, आचरण करना',
      etymologyEn: 'Formed from root "kṛ" (to do) + suffix "man". Grammatically signifies an intentional action, as well as the latent imprint (samskāra) left in the causal mind.',
      etymologyHi: 'संस्कृत धातु "कृ" (करना) में "मन्" प्रत्यय लगने से कर्म शब्द बनता है। इसका अर्थ केवल बाह्य क्रिया ही नहीं, अपितु चित्त पर पड़ने वाले सूक्ष्म संस्कार भी हैं।',
    },
    contextualMeanings: [
      {
        context: 'Action & Execution (Kriyā)',
        contextHi: 'दैनिक शारीरिक व मानसिक क्रिया',
        meaningEn: 'Any physical, vocal, or mental act undertaken by an embodied being.',
        meaningHi: 'मनुष्य द्वारा शरीर, वाणी या मन से किया जाने वाला कोई भी कार्य।',
      },
      {
        context: 'Latent Impressions (Saṁskāra & Vāsanā)',
        contextHi: 'संस्कार एवं वासना',
        meaningEn: 'The psychological grooves etched in the subconscious that incline the mind toward recurring habits and tendencies.',
        meaningHi: 'कर्म द्वारा अंतःकरण में जमने वाले सूक्ष्म संस्कार जो भविष्य के विचारों और प्रवृत्तियों को दिशा देते हैं।',
      },
      {
        context: 'Universal Moral Harvest (Karma-Phala)',
        contextHi: 'कर्मफल (संचित, प्रारब्ध, क्रियमाण)',
        meaningEn: 'The ripening of past actions across three dimensions: Sanchita (accumulated reservoir), Prarabdha (currently unfolding destiny), and Agami/Kriyamana (fresh actions being created now).',
        meaningHi: 'संचित (संग्रहीत), प्रारब्ध (वर्तमान में भोग जाने वाला) और क्रियमाण (वर्तमान में किए जा रहे) कर्मों का फल।',
      },
      {
        context: 'Selfless Offering (Karma Yoga)',
        contextHi: 'निष्काम कर्मयोग',
        meaningEn: 'Action dedicated to the Divine without selfish anxiety over outcomes, which burns bondage rather than creating it.',
        meaningHi: 'फल की आसक्ति छोड़कर लोक-कल्याण और ईश्वरार्पण भाव से किया गया कर्म, जो बंधन नहीं बल्कि मुक्ति देता है।',
      },
    ],
    verses: [
      {
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
        transliteration: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
        translationEn: 'You have a right only to perform your prescribed duty; the fruits thereof are never your entitlement. Let not the fruit of action be your motive, nor let attachment to inaction take hold of you.',
        translationHi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तुम कर्मफल के हेतु मत बनो और तुम्हारी अकर्मण्यता (कर्म न करने) में भी आसक्ति न हो।',
        reference: 'Bhagavad Gita 2.47',
        referenceHi: 'भगवद्गीता २.४७',
        href: '/scripture/bhagavadgita/chapter/2/verse/47',
      },
      {
        sanskrit: 'यथाकारी यथाचारी तथा भवति —\nसाधुकारी साधुर्भवति, पापकारी पापो भवति ।\nपुण्यः पुण्येन कर्मणा भवति, पापः पापेन ॥',
        transliteration: 'yathākārī yathācārī tathā bhavati —\nsādhukārī sādhur bhavati, pāpakārī pāpo bhavati |\npuṇyaḥ puṇyena karmaṇā bhavati, pāpaḥ pāpena ||',
        translationEn: 'According as one acts and according as one behaves, so does one become. The doer of good becomes good; the doer of evil becomes evil. One becomes virtuous by virtuous deeds, and unrighteous by unrighteous deeds.',
        translationHi: 'मनुष्य जैसा कर्म करता है और जैसा आचरण करता है, वैसा ही वह बन जाता है। शुभ कर्म करने वाला साधु बनता है और पाप कर्म करने वाला पापी। पुण्य कर्मों से पुण्य आत्मा और पाप कर्मों से पापात्मा बनता है।',
        reference: 'Brihadaranyaka Upanishad 4.4.5',
        referenceHi: 'बृहदारण्यकोपनिषद् ४.४.५',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'The pure Atman is non-acting (Akarta) and untouched by karma. Karma belongs to the ego-mind vehicle (Upadhi). When knowledge of the Self dawns, all accumulated Sanchita karma is dissolved.',
        viewHi: 'शुद्ध आत्मा नित्य अकर्ता और असंग है। कर्म केवल मन और अहंकार का विषय है। आत्मज्ञान होते ही संचित कर्म भस्म हो जाते हैं।',
      },
      {
        tradition: 'Nyaya-Vaisheshika',
        traditionHi: 'न्याय-वैशेषिक',
        viewEn: 'Karma operates as an unseen moral potency (Adrishta). Because karma itself is insentient, God (Ishvara) serves as the impartial dispenser of fruits matching exact justice.',
        viewHi: 'कर्म स्वयं अचेतन है; ईश्वर ही कर्मफलदाता के रूप में जीवों को उनके कर्मों का यथायोग्य न्यायपूर्ण फल प्रदान करते हैं।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Karma is fatalism; since everything is pre-ordained by past karma, personal effort is useless.',
        mythHi: 'कर्म भाग्यवादिता (Fatalism) है; सब कुछ पहले से तय है तो प्रयास का क्या लाभ?',
        correction: 'Karma is the exact opposite of fatalism: it is radical responsibility. While past karma forms present circumstances (Prarabdha), our conscious response right now (Purushartha) shapes future destiny completely.',
        correctionHi: 'कर्म भाग्य का खेल नहीं, बल्कि पुरुषार्थ की प्रेरणा है। अतीत ने वर्तमान परिस्थितियाँ बनाई हैं, परंतु आज का हमारा श्रेष्ठ कर्म भविष्य का निर्माण करता है।',
      },
      {
        myth: 'You can blame victims of injustice or tragedy by saying "it was just their karma".',
        mythHi: 'पीड़ितों या असहायों को यह कहकर छोड़ देना कि "यह उनके कर्मों का फल है"।',
        correction: 'Scripture commands compassion and immediate help. When another suffers, our duty (Dharma) is to alleviate their distress; withholding help creates negative karma for us.',
        correctionHi: 'शास्त्र पीड़ित की सहायता करने का आदेश देते हैं। दूसरों के दुख पर उदासीन रहना स्वयं घोर अधर्म है।',
      },
    ],
    relatedConceptIds: ['dharma', 'samsara', 'moksha', 'vairagya', 'yoga'],
    sources: ['Brihadaranyaka Upanishad 4.4.5', 'Chandogya Upanishad 5.10', 'Bhagavad Gita 2.47, 3.8, 4.17', 'Yoga Sutras 2.12–14'],
  },

  atman: {
    id: 'atman',
    label: 'Atman',
    sanskrit: 'आत्मन्',
    transliteration: 'ātman',
    category: 'core',
    colorGradient: 'from-amber-600 via-yellow-700 to-stone-900',
    simpleDefinition: {
      en: 'The immortal, self-luminous witness consciousness within every living being, utterly distinct from the physical body, the senses, and the changing mind.',
      hi: 'प्रत्येक प्राणी के भीतर विद्यमान अमर, नित्य और स्वयंप्रकाश साक्षी चेतना, जो शरीर, इंद्रियों और मन के परिवर्तनों से सर्वथा परे है।',
    },
    derivation: {
      root: 'अत् (at) / आप् (āp)',
      rootMeaning: 'To move continuously / to pervade everywhere',
      rootMeaningHi: 'निरंतर गतिमान रहना / सर्वत्र व्याप्त होना',
      etymologyEn: 'Traced to the root "at" (to move continually) or "āp" (to pervade/encompass). Shankara notes in the Katha Bhashya: that which obtains, consumes experiences, and constantly pervades all phenomena is Atman.',
      etymologyHi: 'शांकर भाष्य के अनुसार जो विषयों का अनुभव करता है, सर्वत्र व्याप्त है और जिसका कभी नाश नहीं होता, वह आत्मन् है।',
    },
    contextualMeanings: [
      {
        context: 'Empirical Self (Jīva)',
        contextHi: 'व्यावहारिक जीवात्मा',
        meaningEn: 'The individual soul reflected through the mind, experiencing joy, sorrow, and worldly transmigration.',
        meaningHi: 'मन और अहंकार से युक्त वह चेतना जो संसार में सुख-दुख का अनुभव करती है।',
      },
      {
        context: 'Pure Witness Consciousness (Sākṣin)',
        contextHi: 'साक्षी चैतन्य',
        meaningEn: 'The silent, unattached observer of the waking, dreaming, and deep sleep states.',
        meaningHi: 'जाग्रत, स्वप्न और सुषुप्ति तीनों अवस्थाओं को बिना लिप्त हुए देखने वाला साक्षी।',
      },
      {
        context: 'Supreme Non-Dual Identity (Brahman)',
        contextHi: 'परब्रह्म से अभिन्न',
        meaningEn: 'In the Upanishads, the innermost Self (Atman) is identical with the cosmic ground of reality (Brahman: "Ayam Ātmā Brahma").',
        meaningHi: 'उपनिषदों का परम रहस्य कि अंतरात्मा ही संपूर्ण ब्रह्मांड का मूल आधार (ब्रह्म) है।',
      },
    ],
    verses: [
      {
        sanskrit: 'न जायते म्रियते वा कदाचिन्\nनायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥',
        transliteration: 'na jāyate mriyate vā kadācin\nnāyaṁ bhūtvā bhavitā vā na bhūyaḥ |\najo nityaḥ śāśvato\'yaṁ purāṇo\nna hanyate hanyamāne śarīre ||',
        translationEn: 'The soul is never born, nor does it die at any time. It has not come to be, nor does it cease to be. Unborn, eternal, ever-existing and primeval, it is not slain when the body is slain.',
        translationHi: 'यह आत्मा किसी काल में भी न तो जन्म लेता है और न मरता ही है; तथा न यह उत्पन्न होकर फिर होने वाला ही है। यह अजन्मा, नित्य, सनातन और पुरातन है; शरीर के मारे जाने पर भी यह नहीं मारा जाता।',
        reference: 'Bhagavad Gita 2.20 / Katha Upanishad 1.2.18',
        referenceHi: 'भगवद्गीता २.२० / कठोपनिषद् १.२.१८',
        href: '/scripture/bhagavadgita/chapter/2/verse/20',
      },
      {
        sanskrit: 'अयमात्मा ब्रह्म ॥',
        transliteration: 'ayam ātmā brahma ||',
        translationEn: 'This Self is Brahman.',
        translationHi: 'यह आत्मा ही ब्रह्म है।',
        reference: 'Mandukya Upanishad 2',
        referenceHi: 'माण्डूक्योपनिषद् २',
        href: '/scripture/mandukya',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'There is only one universal Atman; the multiplicity of souls is an illusion caused by the limiting adjuncts of body-minds (Upadhis), like space enclosed in jars.',
        viewHi: 'आत्मा एक और अद्वितीय है। शरीरों के भेद से आत्मा में अनेकता केवल घटाकाश की भांति आभासी है।',
      },
      {
        tradition: 'Vishishtadvaita Vedanta',
        traditionHi: 'विशिष्टाद्वैत वेदान्त',
        viewEn: 'Individual souls (Jivatmans) are real, conscious, eternal sparks (Amsha) of God, existing in organic relationship as His divine body.',
        viewHi: 'जीवात्माएं सत्य, चेतन और अनंत हैं तथा वे परमात्मा के दिव्य शरीर का अभिन्न अंश हैं।',
      },
      {
        tradition: 'Samkhya',
        traditionHi: 'सांख्य दर्शन',
        viewEn: 'There is a plurality of pure conscious witnesses (Purushas), forever independent of material nature (Prakriti).',
        viewHi: 'पुरुष (चेतना) अनेक हैं और वे प्रकृति से सर्वथा स्वतंत्र और साक्षी हैं।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Atman is a tiny glowing ghost or miniature human sitting in the physical heart.',
        mythHi: 'आत्मा शरीर के भीतर रहने वाली कोई छोटी सी छाया या भौतिक वस्तु है।',
        correction: 'Atman is not a material object with dimensions; it is non-physical pure awareness itself, omnipresent and formless.',
        correctionHi: 'आत्मा कोई भौतिक वस्तु नहीं, बल्कि वह शुद्ध चेतना है जिसके प्रकाश में शरीर और मन प्रकाशित होते हैं।',
      },
    ],
    relatedConceptIds: ['brahman', 'moksha', 'samsara', 'maya', 'vairagya'],
    sources: ['Katha Upanishad 1.2.18–20', 'Mandukya Upanishad 2', 'Brihadaranyaka Upanishad 4.4', 'Bhagavad Gita 2.11–30'],
  },

  brahman: {
    id: 'brahman',
    label: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    transliteration: 'brahman',
    category: 'core',
    colorGradient: 'from-amber-600 via-indigo-900 to-stone-950',
    simpleDefinition: {
      en: 'The ultimate, infinite, and unconditioned reality—the transcendent and immanent ground of all existence, consciousness, and bliss (Sat-Chit-Ananda).',
      hi: 'परम, अनंत और अद्वैत सत्य—जो संपूर्ण सृष्टि का अधिष्ठान है तथा सत्, चित् और आनंद स्वरूप है।',
    },
    derivation: {
      root: 'बृह् (bṛh)',
      rootMeaning: 'To expand, swell, grow, or be infinitely vast',
      rootMeaningHi: 'बढ़ना, फैलना, असीम होना',
      etymologyEn: 'From root "bṛh" (to expand/exceed). That which is boundless, unsurpassable, and out of which the universe grows without diminishing its own infinitude.',
      etymologyHi: 'संस्कृत धातु "बृह्" (बढ़ना या असीम होना) से ब्रह्मन् शब्द बना है। जो सबसे बड़ा, व्यापक और सीमा-रहित है, वही ब्रह्म है।',
    },
    contextualMeanings: [
      {
        context: 'Nirguṇa Brahman (Attribute-Free Ground)',
        contextHi: 'निर्गुण ब्रह्म',
        meaningEn: 'The unconditioned, formless, timeless reality beyond conceptual definitions and sensory attributes.',
        meaningHi: 'नाम, रूप और गुणों से परे शुद्ध परम सत्य।',
      },
      {
        context: 'Saguṇa Brahman / Īśvara (The Divine Manifested)',
        contextHi: 'सगुण ब्रह्म / ईश्वर',
        meaningEn: 'The same ultimate reality appearing with divine attributes, wisdom, and grace as the Lord and cosmic steward.',
        meaningHi: 'भक्तों के कल्याण के लिए दिव्य गुणों, करुणा और रूप के साथ प्रकट होने वाला परमात्मा।',
      },
      {
        context: 'Śabda Brahman (Sound Reality)',
        contextHi: 'शब्द ब्रह्म (ॐ)',
        meaningEn: 'The cosmic creative vibration that expresses through the sacred syllable OM and Vedic mantras.',
        meaningHi: 'नाद और ॐकार की वह आदिम ध्वनि जिससे ब्रह्मांड का स्पंदन संचालित होता है।',
      },
    ],
    verses: [
      {
        sanskrit: 'सत्यं ज्ञानमनन्तं ब्रह्म ॥',
        transliteration: 'satyaṁ jñānam anantaṁ brahma ||',
        translationEn: 'Brahman is Truth, Consciousness, and Infinitude.',
        translationHi: 'ब्रह्म सत्य, ज्ञान और अनंत स्वरूप है।',
        reference: 'Taittiriya Upanishad 2.1',
        referenceHi: 'तैत्तिरीयोपनिषद् २.१',
        href: '/scripture/taittiriya/chapter/2',
      },
      {
        sanskrit: 'सर्वं खल्विदं ब्रह्म तज्जलानिति शान्त उपासीत ॥',
        transliteration: 'sarvaṁ khalv idaṁ brahma tajjalān iti śānta upāsīta ||',
        translationEn: 'All this universe is verily Brahman. From It all things arise, into It they dissolve, and by It they are sustained. In tranquility, meditate on this.',
        translationHi: 'यह सब कुछ निश्चय ही ब्रह्म है। उसी से सब उत्पन्न होता है, उसी में विलीन होता है और उसी में चेष्टा करता है। शांत होकर उसकी उपासना करें।',
        reference: 'Chandogya Upanishad 3.14.1',
        referenceHi: 'छान्दोग्योपनिषद् ३.१४.१',
        href: '/scripture/chandogya',
      },
      {
        sanskrit: 'तत्त्वमसि ॥',
        transliteration: 'tat tvam asi ||',
        translationEn: 'You are That.',
        translationHi: 'तू वही (ब्रह्म) है।',
        reference: 'Chandogya Upanishad 6.8.7',
        referenceHi: 'छान्दोग्योपनिषद् ६.८.७',
        href: '/scripture/chandogya',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Brahman alone is real (Brahma Satyam); the changing world is a dependent appearance (Jagan Mithya); the inner Self is non-different from Brahman (Jivo Brahmaiva Naparah).',
        viewHi: 'केवल ब्रह्म ही सत्य है; यह दृश्य जगत व्यावहारिक रूप से परिवर्तनशील है तथा जीव वस्तुतः ब्रह्म से भिन्न नहीं है।',
      },
      {
        tradition: 'Vishishtadvaita Vedanta',
        traditionHi: 'विशिष्टाद्वैत वेदान्त',
        viewEn: 'Brahman is the Supreme Person (Purushottama / Narayana) qualified by the sentient souls and insentient nature as His inseparable cosmic body.',
        viewHi: 'ब्रह्म परम पुरुष नारायण हैं, और समस्त जड़-चेतन जगत उनका दिव्य शरीर है।',
      },
      {
        tradition: 'Dvaita Vedanta',
        traditionHi: 'द्वैत वेदान्त',
        viewEn: 'Brahman is Lord Vishnu, completely independent (Svatantra), while souls and matter are eternally dependent (Paratantra).',
        viewHi: 'ब्रह्म (विष्णु) स्वतंत्र तत्व हैं और जीव व प्रकृति उनसे भिन्न व उन पर आश्रित हैं।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Brahman is just another name for the creator god Brahmā.',
        mythHi: 'ब्रह्म और ब्रह्मा (Brahmā) एक ही हैं।',
        correction: 'Brahma (masculine) is the creator deity within the cosmic cycle. Brahman (neuter) is the infinite, uncreated Supreme Ground of all being.',
        correctionHi: 'ब्रह्मा जी सृष्टि के रचयिता देव हैं; जबकि ब्रह्मन् वह असीम, अनादि परम सत्य है जिससे समस्त देव और ब्रह्मांड प्रकट होते हैं।',
      },
    ],
    relatedConceptIds: ['atman', 'maya', 'moksha', 'om', 'yoga'],
    sources: ['Taittiriya Upanishad 2.1', 'Chandogya Upanishad 3.14, 6.8', 'Brihadaranyaka Upanishad 3.8', 'Brahma Sutras 1.1.1–4'],
  },

  moksha: {
    id: 'moksha',
    label: 'Moksha',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    category: 'metaphysics',
    colorGradient: 'from-amber-600 via-rose-700 to-stone-900',
    simpleDefinition: {
      en: 'The ultimate spiritual liberation—freedom from the cycle of birth, death, and suffering (samsara), and the timeless realization of fullness, peace, and divine unity.',
      hi: 'जीवन का परम लक्ष्य—जन्म, मृत्यु और दुखों के चक्र (संसार) से आत्यंतिक मुक्ति तथा परमानंद और आत्मसाक्षात्कार की स्थिति।',
    },
    derivation: {
      root: 'मुच् (muc)',
      rootMeaning: 'To free, release, untie, loosen, or liberate',
      rootMeaningHi: 'छोड़ना, मुक्त करना, बंधन से छुड़ाना',
      etymologyEn: 'Formed from root "muc" (to release) + suffix "sa". Signifies absolute freedom from the bondage of ignorance, desire, and mortality.',
      etymologyHi: 'संस्कृत धातु "मुच्" (मुक्त करना) से मोक्ष शब्द निष्पन्न होता है। इसका अर्थ अज्ञान और कर्म के बंधनों से पूर्ण छुटकारा पाना है।',
    },
    contextualMeanings: [
      {
        context: 'Liberation While Living (Jīvanmukti)',
        contextHi: 'जीवन्मुक्ति',
        meaningEn: 'Awakening to freedom right here in this life, walking the world in uninterrupted serenity, compassion, and equanimity.',
        meaningHi: 'इसी जीवन में शरीर रहते हुए अज्ञान के बंधनों से मुक्त होकर समभाव और परमानंद में जीना।',
      },
      {
        context: 'Liberation Beyond the Body (Videhamukti)',
        contextHi: 'विदेहमुक्ति',
        meaningEn: 'The final cessation of bodily transmigration upon physical death, merging seamlessly into the infinite reality.',
        meaningHi: 'प्रारब्ध समाप्त होने पर स्थूल शरीर त्यागने के बाद परमात्मा में पूर्ण लीन हो जाना।',
      },
      {
        context: 'Four Devotional Abodes (Sālokya, Sāmīpya, Sārūpya, Sāyujya)',
        contextHi: 'भक्तिमार्ग के चार मोक्ष',
        meaningEn: 'Devotional traditions describe liberation as dwelling in the Lord’s realm, near His presence, reflecting His glory, or merging into His being.',
        meaningHi: 'ईश्वर के धाम में वास, सामीप्य, उनके जैसा दिव्य रूप या उनमें एकात्मता।',
      },
    ],
    verses: [
      {
        sanskrit: 'ब्रह्म वेद ब्रह्मैव भवति ।\nतरति शोकं तरति पाप्मानं गुहाग्रन्थिभ्यो विमुक्तोऽमृतो भवति ॥',
        transliteration: 'brahma veda brahmaiva bhavati |\ntarati śokaṁ tarati pāpmānaṁ guhā-granthibhyo vimukto\'mṛto bhavati ||',
        translationEn: 'He who knows the supreme Brahman becomes Brahman indeed. He crosses beyond sorrow; he crosses beyond sin; freed from the knots of the heart, he becomes immortal.',
        translationHi: 'जो ब्रह्म को जान लेता है, वह ब्रह्म ही हो जाता है। वह शोक को पार कर जाता है, पाप को पार कर जाता है और हृदय की ग्रंथियों से मुक्त होकर अमर हो जाता है।',
        reference: 'Mundaka Upanishad 3.2.9',
        referenceHi: 'मुण्डकोपनिषद् ३.२.९',
        href: '/scripture/mundaka',
      },
      {
        sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
        transliteration: 'sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja |\nahaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
        translationEn: 'Abandoning all reliances, surrender to Me alone. I will liberate you from all sins and sorrows; grieve not.',
        translationHi: 'संपूर्ण धर्मों और आश्रयों को छोड़कर केवल मेरी शरण में आ जाओ। मैं तुम्हें समस्त पापों और बंधनों से मुक्त कर दूँगा; तुम शोक मत करो।',
        reference: 'Bhagavad Gita 18.66',
        referenceHi: 'भगवद्गीता १८.६६',
        href: '/scripture/bhagavadgita/chapter/18/verse/66',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Moksha is not a new state created or reached; it is recognizing what always was. The Self was never truly bound.',
        viewHi: 'मोक्ष कोई नई वस्तु पाना नहीं, बल्कि अज्ञान का पर्दा हटते ही अपने नित्य-मुक्त स्वरूप को पहचानना है।',
      },
      {
        tradition: 'Vishishtadvaita Vedanta',
        traditionHi: 'विशिष्टाद्वैत वेदान्त',
        viewEn: 'Moksha is reaching the supreme abode of Vaikuntha to enjoy intimate, uninterrupted loving service of Bhagavan Narayana.',
        viewHi: 'मोक्ष परमधाम वैकुंठ में पहुंचकर भगवान नारायण की नित्य प्रेममयी सेवा और सान्निध्य पाना है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Moksha is an escapist paradise where you go after death to indulge in sensory luxuries.',
        mythHi: 'मोक्ष मरने के बाद किसी स्वर्ग में जाकर सांसारिक सुख भोगने का नाम है।',
        correction: 'Heaven (Swarga) is a temporary realm of sensory reward, after which one returns to earth. Moksha is permanent spiritual liberation beyond all cycles.',
        correctionHi: 'स्वर्ग पुण्य क्षीण होते ही छूट जाता है। मोक्ष संसार चक्र का अंत और नित्य आत्मिक शांति है।',
      },
    ],
    relatedConceptIds: ['samsara', 'atman', 'brahman', 'karma', 'vairagya'],
    sources: ['Mundaka Upanishad 3.2.9', 'Katha Upanishad 2.3.14–15', 'Bhagavad Gita 5.24–28, 18.66'],
  },

  maya: {
    id: 'maya',
    label: 'Maya',
    sanskrit: 'माया',
    transliteration: 'māyā',
    category: 'metaphysics',
    colorGradient: 'from-purple-700 via-indigo-800 to-stone-950',
    simpleDefinition: {
      en: 'The mysterious, creative power of the Divine that projects the diverse universe of names and forms while concealing the underlying non-dual reality.',
      hi: 'परमात्मा की वह अलौकिक शक्ति जो एक ही सत्य को अनेक रूपों में दिखाती है तथा नाम और रूप के संसार का विस्तार करती है।',
    },
    derivation: {
      root: 'मा (mā)',
      rootMeaning: 'To measure, outline, or display / that which measures the unmeasurable',
      rootMeaningHi: 'मापना, निर्माण करना, रूप देना',
      etymologyEn: 'From root "mā" (to measure or fashion). Maya is that power which defines and "measures" the immeasurable Brahman into finite forms.',
      etymologyHi: 'संस्कृत में "मा" धातु का अर्थ मापना या रचना करना है। जो असीम को सीमित रूपों में प्रस्तुत करे, वही माया है।',
    },
    contextualMeanings: [
      {
        context: 'Creative Potency of God (Daivī Śakti)',
        contextHi: 'ईश्वर की दिव्य शक्ति',
        meaningEn: 'The wondrous creative capacity by which the Lord manifests the majestic cosmic order.',
        meaningHi: 'ईश्वर की वह सामर्थ्य जिससे वे इस विचित्र और सुंदर ब्रह्मांड की रचना करते हैं।',
      },
      {
        context: 'Veiling & Projecting Powers (Āvaraṇa & Vikṣepa)',
        contextHi: 'आवरण और विक्षेप शक्ति',
        meaningEn: 'The veil that hides the non-dual Truth (Avarana) and projects plurality and misidentification (Vikshepa).',
        meaningHi: 'सत्य को छुपाने वाली (आवरण) और भ्रमपूर्ण दृश्य खड़ा करने वाली (विक्षेप) शक्ति।',
      },
    ],
    verses: [
      {
        sanskrit: 'दैवी ह्येषा गुणमयी मम माया दुरत्यया ।\nमामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते ॥',
        transliteration: 'daivī hy eṣā guṇamayī mama māyā duratyayā |\nmām eva ye prapadyante māyām etāṁ taranti te ||',
        translationEn: 'Verily this divine illusion of Mine, composed of the three gunas, is difficult to cross. But those who take refuge in Me alone cross beyond this Maya.',
        translationHi: 'मेरी यह अलौकिक त्रिगुणमयी माया बड़ी दुस्तर है; परंतु जो केवल मेरी ही शरण में आते हैं, वे इस माया को सरलता से पार कर जाते हैं।',
        reference: 'Bhagavad Gita 7.14',
        referenceHi: 'भगवद्गीता ७.१४',
        href: '/scripture/bhagavadgita/chapter/7/verse/14',
      },
      {
        sanskrit: 'मायां तु प्रकृतिं विद्यान्मायिनं च महेश्वरम् ।',
        transliteration: 'māyāṁ tu prakṛtiṁ vidyān māyinaṁ ca maheśvaram |',
        translationEn: 'Know then nature (prakriti) to be Maya, and the Supreme Lord to be the master of Maya.',
        translationHi: 'प्रकृति को ही माया जानो और उस माया के स्वामी परमेश्वर हैं।',
        reference: 'Shvetashvatara Upanishad 4.10',
        referenceHi: 'श्वेताश्वतरोपनिषद् ४.१०',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Maya is Anirvachaniya (inexplicable as either absolutely real or completely non-existent); it is sublated upon direct realization of Brahman.',
        viewHi: 'माया अनिर्वचनीय है—न पूर्ण सत्य, न पूर्ण असत्य। ज्ञान होते ही यह रस्सी में सांप के भ्रम की भांति विलीन हो जाती है।',
      },
      {
        tradition: 'Kashmir Shaivism',
        traditionHi: 'कश्मीर शैव दर्शन',
        viewEn: 'Maya is the free playful creative pulsation (Spanda / Svatantrya Shakti) of Lord Shiva, not an error but divine self-expression.',
        viewHi: 'माया शिव की स्वतंत्र इच्छा और लीला शक्ति है जिसके द्वारा वे स्वयं को विश्व रूप में अभिव्यक्त करते हैं।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Maya means the world does not exist physically and you can ignore practical reality.',
        mythHi: 'माया का अर्थ है कि दुनिया सच में है ही नहीं, इसलिए जिम्मेदारियों से भाग जाना चाहिए।',
        correction: 'The world possesses practical, empirical reality (Vyavaharika Satya). Maya means the world is changing and dependent, not that hunger, pain, or ethics are unreal.',
        correctionHi: 'जगत व्यावहारिक रूप से सत्य है। माया का अर्थ है कि संसार नश्वर है, यह नहीं कि भूख, दर्द और कर्तव्य झूठे हैं।',
      },
    ],
    relatedConceptIds: ['brahman', 'atman', 'moksha', 'samsara', 'vairagya'],
    sources: ['Shvetashvatara Upanishad 4.10', 'Bhagavad Gita 7.14, 18.61', 'Vivekachudamani 108–110'],
  },

  bhakti: {
    id: 'bhakti',
    label: 'Bhakti',
    sanskrit: 'भक्ति',
    transliteration: 'bhakti',
    category: 'practice',
    colorGradient: 'from-rose-600 via-amber-700 to-stone-900',
    simpleDefinition: {
      en: 'Supreme, selfless love and unconditional devotion toward the Divine, transforming every action, thought, and emotion into a sacred offering.',
      hi: 'परमात्मा के प्रति अहैतुक, निष्कपट और परम प्रेम, जिसमें अहंकार समर्पित होकर ईश्वरीय अनुग्रह में लीन हो जाता है।',
    },
    derivation: {
      root: 'भज् (bhaj)',
      rootMeaning: 'To share in, partake of, revere, belong to, or adore',
      rootMeaningHi: 'सेवा करना, भजना, प्रेम करना, सहभागी होना',
      etymologyEn: 'From root "bhaj" (to adore, serve, revere) with suffix "ktin". Implies an intimate, loving participation in the Divine life.',
      etymologyHi: 'संस्कृत धातु "भज्" (भजना, सेवा करना) में "क्तिन्" प्रत्यय से भक्ति शब्द बनता है। इसका अर्थ ईश्वर के साथ प्रेममयी सहभागिता है।',
    },
    contextualMeanings: [
      {
        context: 'Supreme Transcendent Love (Parama-Prema-Rūpā)',
        contextHi: 'परम प्रेम स्वरूप',
        meaningEn: 'Love free from commercial desire or self-seeking bargaining with God.',
        meaningHi: 'बिना किसी स्वार्थ या सौदेबाजी के केवल ईश्वर के प्रति अगाध निष्काम प्रेम।',
      },
      {
        context: 'Ninefold Practice (Navadhā Bhakti)',
        contextHi: 'नवधा भक्ति',
        meaningEn: 'Hearing (Śravaṇa), chanting (Kīrtana), remembering (Smaraṇa), serving the feet (Pāda-sevana), worship (Arcana), bowing (Vandana), servitude (Dāsya), friendship (Sakhya), and self-surrender (Ātma-nivedana).',
        meaningHi: 'श्रवण, कीर्तन, स्मरण, पादसेवन, अर्चन, वंदन, दास्य, सख्य और आत्मनिवेदन।',
      },
    ],
    verses: [
      {
        sanskrit: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति ।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥',
        transliteration: 'patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati |\ntad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ ||',
        translationEn: 'Whoever offers to Me with devotion even a leaf, a flower, a fruit, or water—that offering of love from the pure-hearted seeker I accept with joy.',
        translationHi: 'जो कोई भक्त मेरे लिए प्रेमपूर्वक एक पत्ता, फूल, फल या जल भी भेंट करता है, उस शुद्ध अंतःकरण वाले निष्काम भक्त द्वारा प्रेम से अर्पित उस उपहार को मैं साक्षात् स्वीकार करता हूँ।',
        reference: 'Bhagavad Gita 9.26',
        referenceHi: 'भगवद्गीता ९.२६',
        href: '/scripture/bhagavadgita/chapter/9/verse/26',
      },
      {
        sanskrit: 'सा त्वस्मिन् परमप्रेमरूपा ॥\nअमृतस्वरूपा च ॥',
        transliteration: 'sā tv asmin parama-prema-rūpā || amṛta-svarūpā ca ||',
        translationEn: 'Bhakti is of the nature of supreme love toward the Divine. And it is of the nature of immortality.',
        translationHi: 'वह भक्ति ईश्वर के प्रति परम प्रेम स्वरूपा है। और वह अमृत स्वरूपा भी है।',
        reference: 'Narada Bhakti Sutras 2–3',
        referenceHi: 'नारद भक्ति सूत्र २–३',
      },
    ],
    traditions: [
      {
        tradition: 'Vaishnavism',
        traditionHi: 'वैष्णव परंपरा',
        viewEn: 'Bhakti is both the means (Sadhana) and the supreme end itself (Panchama Purushartha), far surpassing intellectual dryness.',
        viewHi: 'भक्ति ही साधन है और वही जीवन का परम साध्य (पंचम पुरुषार्थ) है, जो मोक्ष से भी अधिक मधुर है।',
      },
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Saguna Bhakti purifies and softens the heart, spontaneously ripening into non-dual contemplation of the all-pervading Self.',
        viewHi: 'भक्ति अंतःकरण को पिघलाकर शुद्ध करती है और साधक को सहज ही अद्वैत ज्ञान की ओर ले जाती है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Bhakti is just emotionalism and noisy outward rituals without depth.',
        mythHi: 'भक्ति केवल भावुकता या बाहरी कर्मकांड है।',
        correction: 'True Bhakti (Para Bhakti) is quiet self-mastery, humility, and seeing the Divine seated in every human being.',
        correctionHi: 'सच्ची भक्ति चित्त की निर्मलता, अहंकार का विसर्जन और हर जीव में ईश्वर को देखकर सेवा करना है।',
      },
    ],
    relatedConceptIds: ['yoga', 'dharma', 'moksha', 'brahman', 'vairagya'],
    sources: ['Bhagavad Gita Chapters 9 & 12', 'Narada Bhakti Sutras', 'Shandilya Bhakti Sutras', 'Shrimad Bhagavatam 7.5.23'],
  },

  yoga: {
    id: 'yoga',
    label: 'Yoga',
    sanskrit: 'योग',
    transliteration: 'yoga',
    category: 'practice',
    colorGradient: 'from-amber-600 via-emerald-700 to-stone-900',
    simpleDefinition: {
      en: 'The holistic spiritual discipline of uniting individual awareness with the Divine through mental stillness, equanimity in action, and self-mastery.',
      hi: 'मन की चंचलता को शांत कर अंतरात्मा में स्थिर होने तथा कर्म में समत्व और कुशलता प्राप्त करने की समग्र आध्यात्मिक साधना।',
    },
    derivation: {
      root: 'युज् (yuj)',
      rootMeaning: 'To yoke, unite, join, or enter deep absorption (samādhi)',
      rootMeaningHi: 'जोड़ना, एकाग्र करना, समाधि में लीन होना',
      etymologyEn: 'From root "yuj" (yuj samādhau / yujir yoge). Signifies both the state of spiritual union and the methodical practice leading to it.',
      etymologyHi: 'संस्कृत धातु "युज्" (जोड़ना या समाधि में स्थिर होना) से योग शब्द बनता है। यह आत्मा के परमात्मा से मिलन और मन के ठहराव का नाम है।',
    },
    contextualMeanings: [
      {
        context: 'Equanimity of Mind (Samatvaṁ Yogaḥ)',
        contextHi: 'मन का समत्व',
        meaningEn: 'Maintaining mental balance across triumph and defeat, praise and blame, gain and loss.',
        meaningHi: 'सुख-दुख, जय-पराजय और लाभ-हानि में चित्त का अविचल और शांत रहना।',
      },
      {
        context: 'Skill in Action (Karmasu Kauśalam)',
        contextHi: 'कर्म में कुशलता',
        meaningEn: 'Performing duties with full concentration and excellence, free from egoic anxiety.',
        meaningHi: 'अहंकार और व्यर्थ के तनाव से मुक्त होकर पूर्ण निष्ठा और निपुणता से कार्य करना।',
      },
      {
        context: 'Stilling Mental Waves (Citta-Vṛtti-Nirodha)',
        contextHi: 'चित्तवृत्तियों का निरोध',
        meaningEn: 'Halting the turbulent fluctuations of thought to reveal the silent witness within.',
        meaningHi: 'मन की चंचल वृत्तियों को शांत करके अपने वास्तविक स्वरूप में प्रतिष्ठित होना।',
      },
    ],
    verses: [
      {
        sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
        transliteration: 'yogasthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya |\nsiddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||',
        translationEn: 'Perform your duty established in Yoga, abandoning attachment, O Dhananjaya. Be even-minded in both success and failure; equanimity of mind is called Yoga.',
        translationHi: 'हे धनंजय! आसक्ति को त्यागकर तथा सिद्धि और असिद्धि में समान रहकर अपने कर्तव्य कर्म करो; यह समत्व (समभाव) ही योग कहलाता है।',
        reference: 'Bhagavad Gita 2.48',
        referenceHi: 'भगवद्गीता २.४८',
        href: '/scripture/bhagavadgita/chapter/2/verse/48',
      },
      {
        sanskrit: 'योगश्चित्तवृत्तिनिरोधः ॥\nतदा द्रष्टुः स्वरूपेऽवस्थानम् ॥',
        transliteration: 'yogaś citta-vṛtti-nirodhaḥ || tadā draṣṭuḥ svarūpe\'vasthānam ||',
        translationEn: 'Yoga is the cessation of the modifications of the mind. Then the Seer abides in its own true nature.',
        translationHi: 'चित्त की वृत्तियों का निरोध ही योग है। तब दृष्टा (साक्षी आत्मा) अपने वास्तविक स्वरूप में स्थित हो जाता है।',
        reference: 'Patanjali Yoga Sutras 1.2–3',
        referenceHi: 'पातंजल योगसूत्र १.२–३',
      },
    ],
    traditions: [
      {
        tradition: 'Classical Patanjala Yoga',
        traditionHi: 'पातंजल अष्टांग योग',
        viewEn: 'An eight-limbed systematic discipline (Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi) liberating the conscious Seer (Purusha) from nature (Prakriti).',
        viewHi: 'यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान और समाधि—इन आठ अंगों द्वारा कैवल्य (मुक्ति) की प्राप्ति।',
      },
      {
        tradition: 'Bhagavad Gita',
        traditionHi: 'भगवद्गीता का समग्र योग',
        viewEn: 'A living synthesis of Karma Yoga (selfless work), Bhakti Yoga (devotional surrender), and Jnana Yoga (spiritual wisdom) in daily life.',
        viewHi: 'कर्म, भक्ति और ज्ञान का एक सुंदर समन्वय जो युद्धभूमि जैसी कठिन परिस्थितियों में भी जीवन जीने की कला सिखाता है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Yoga is purely physical stretching, contortions, and fitness poses.',
        mythHi: 'योग केवल शारीरिक कसरत, पसीना बहाने या शरीर को लचीला बनाने का नाम है।',
        correction: 'Physical postures (Asana) are just one preparatory step. Yoga is fundamentally about mental equilibrium, inner stillness, and spiritual realization.',
        correctionHi: 'आसन केवल शरीर को स्थिर करने का एक अंग है। योग का वास्तविक उद्देश्य चित्त की शांति और आत्मसाक्षात्कार है।',
      },
    ],
    relatedConceptIds: ['dharma', 'karma', 'atman', 'vairagya', 'ahimsa'],
    sources: ['Patanjali Yoga Sutras', 'Bhagavad Gita Chapters 2 & 6', 'Shvetashvatara Upanishad 2', 'Hatha Yoga Pradipika'],
  },

  ahimsa: {
    id: 'ahimsa',
    label: 'Ahimsa',
    sanskrit: 'अहिंसा',
    transliteration: 'ahiṁsā',
    category: 'practice',
    colorGradient: 'from-emerald-600 via-teal-700 to-stone-900',
    simpleDefinition: {
      en: 'The foundational virtue of universal non-harm, harmlessness, and gentle reverence in thought, speech, and deed toward all sentient life.',
      hi: 'मन, वचन और कर्म से किसी भी प्राणी को कष्ट न पहुँचाना तथा समस्त सृष्टि के प्रति दया, करुणा और आदर का भाव रखना।',
    },
    derivation: {
      root: 'हिंस् (hiṁs) with prefix अ (a)',
      rootMeaning: 'Non-striking, non-harming, harmlessness',
      rootMeaningHi: 'चोट न पहुँचाना, किसी का अहित न करना',
      etymologyEn: 'From prefix "a" (non) + "hiṁsā" (wishing to kill or harm, from desiderative of root "hiṁs"). Literally: absence of any desire to inflict suffering.',
      etymologyHi: 'नकारात्मक उपसर्ग "अ" के साथ "हिंसा" शब्द मिलकर बनता है। इसका अर्थ किसी को पीड़ा पहुँचाने के भाव का पूर्ण अभाव है।',
    },
    contextualMeanings: [
      {
        context: 'First Great Restraint (Maha-Vrata / Yama)',
        contextHi: 'अष्टांग योग का प्रथम यम',
        meaningEn: 'The supreme ethical vow that serves as the root and foundation for all other spiritual virtues.',
        meaningHi: 'योग साधना का वह प्रथम स्तंभ जिसके बिना कोई भी ध्यान या आध्यात्मिक उन्नति संभव नहीं है।',
      },
      {
        context: 'Non-Violence of Thought and Speech',
        contextHi: 'मानसिक व वाचिक अहिंसा',
        meaningEn: 'Refraining from malicious gossip, vengeful thoughts, sarcastic cruelty, and emotional invalidation.',
        meaningHi: 'कटु वाणी, निंदा, ईर्ष्या और किसी के प्रति मन में भी दुर्भाव न रखना।',
      },
      {
        context: 'Protection of the Innocent (Dharmic Courage)',
        contextHi: 'दीन-रक्षण व शौर्य',
        meaningEn: 'Ahimsa is not cowardly surrender to tyrants; protecting the vulnerable from violence is an expression of true Dharma.',
        meaningHi: 'अहिंसा का अर्थ कायरता नहीं है; असहायों और निर्दोषों की रक्षा के लिए खड़ा होना धर्म का अंग है।',
      },
    ],
    verses: [
      {
        sanskrit: 'अहिंसा परमो धर्मस्तथाहिंसा परं दमः ।\nअहिंसा परमं दानमहिंसा परमं तपः ॥',
        transliteration: 'ahiṁsā paramo dharmas tathāhiṁsā paraṁ damaḥ |\nahiṁsā paramaṁ dānam ahiṁsā paramaṁ tapaḥ ||',
        translationEn: 'Ahimsa is the highest virtue; Ahimsa is the highest self-restraint. Ahimsa is the supreme gift; Ahimsa is the supreme austerity.',
        translationHi: 'अहिंसा ही परम धर्म है, अहिंसा ही परम संयम है, अहिंसा ही सबसे बड़ा दान है और अहिंसा ही सर्वोच्च तपस्या है।',
        reference: 'Mahabharata, Anushasana Parva 115.1',
        referenceHi: 'महाभारत, अनुशासन पर्व ११५.१',
      },
      {
        sanskrit: 'अहिंसाप्रतिष्ठायां तत्सन्निधौ वैरत्यागः ॥',
        transliteration: 'ahiṁsā-pratiṣṭhāyāṁ tat-sannidhau vaira-tyāgaḥ ||',
        translationEn: 'When one is firmly established in Ahimsa, all living beings cease their hostility in their presence.',
        translationHi: 'अहिंसा में प्रतिष्ठित हो जाने पर योगी के सान्निध्य में सभी प्राणियों का वैर-भाव समाप्त हो जाता है।',
        reference: 'Patanjali Yoga Sutras 2.35',
        referenceHi: 'पातंजल योगसूत्र २.३५',
      },
    ],
    traditions: [
      {
        tradition: 'Classical Yoga',
        traditionHi: 'योग दर्शन',
        viewEn: 'Ahimsa is the root of truthfulness, honesty, and purity. If a spoken truth inflicts wanton cruelty, it violates Ahimsa.',
        viewHi: 'अहिंसा ही समस्त यमों की जननी है। सत्य भी ऐसा होना चाहिए जो दूसरों के कल्याणकारी हो, न कि विनाशकारी।',
      },
      {
        tradition: 'Mahabharata & Gita',
        traditionHi: 'महाभारत व गीता',
        viewEn: 'Harmonizes personal harmlessness with the duty of the warrior or citizen to defend society against unprovoked aggression.',
        viewHi: 'व्यक्तिगत जीवन में दया और शांति तथा समाज की सुरक्षा के लिए अन्याय का प्रतिकार करने में सामंजस्य।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Ahimsa means passive submission when criminals or oppressors attack innocent people.',
        mythHi: 'अहिंसा का अर्थ है कि कोई अत्याचारी हमला करे तो चुपचाप अन्याय सहते रहो।',
        correction: 'Ahimsa is grounded in moral courage. When adharma threatens society, stopping perpetrators with righteous strength is dharmic protection.',
        correctionHi: 'अहिंसा दुर्बलता नहीं है। निर्दोषों की रक्षा और समाज को अराजकता से बचाना भी धर्म का अनिवार्य अंग है।',
      },
    ],
    relatedConceptIds: ['dharma', 'yoga', 'satya', 'yajna', 'vairagya'],
    sources: ['Mahabharata Anushasana Parva 115–116', 'Patanjali Yoga Sutras 2.30, 2.35', 'Bhagavad Gita 13.7, 16.2', 'Chandogya Upanishad 3.17.4'],
  },

  yajna: {
    id: 'yajna',
    label: 'Yajna',
    sanskrit: 'यज्ञ',
    transliteration: 'yajña',
    category: 'practice',
    colorGradient: 'from-orange-600 via-amber-700 to-stone-900',
    simpleDefinition: {
      en: 'The sacred principle of sacrifice, selfless offering, and cosmic reciprocity that sustains the ecological and moral harmony of the universe.',
      hi: 'त्याग, परोपकार और पारस्परिक सहयोग का वह पावन सिद्धांत जिसके द्वारा प्रकृति, समाज और समस्त ब्रह्मांड का संतुलन बना रहता है।',
    },
    derivation: {
      root: 'यज् (yaj)',
      rootMeaning: 'To revere, worship, offer, or unite',
      rootMeaningHi: 'पूजन करना, आहुति देना, संगठन और दान करना',
      etymologyEn: 'From root "yaj" (to worship, sacrifice, unite) with suffix "na". In classical Sanskrit, Yajna signifies devotion to the sacred, charitable sharing (Dāna), and collective unity (Saṅgatikaraṇa).',
      etymologyHi: 'संस्कृत धातु "यज्" से यज्ञ बना है। इसके तीन मुख्य अर्थ हैं: देवपूजा (दिव्यता का आदर), संगतिकरण (संगठन व सहयोग) और दान (परोपकार)।',
    },
    contextualMeanings: [
      {
        context: 'Vedic Liturgy (Homa / Havanam)',
        contextHi: 'वैदिक अग्निहोत्र',
        meaningEn: 'The outward ritual offering of herbs, grains, and clarified butter into the sacred consecrated fire.',
        meaningHi: 'पवित्र अग्नि में सुगन्धित द्रव्यों और मंत्रों के साथ दी जाने वाली आहुति।',
      },
      {
        context: 'Cosmic Mutual Reciprocity (Parasparya)',
        contextHi: 'पारस्परिक पोषण का नियम',
        meaningEn: 'The cosmic cycle where the sun, clouds, earth, and beings nourish each other without hoarding.',
        meaningHi: 'प्रकृति का वह नियम जहाँ सूर्य, बादल, नदियाँ और वृक्ष बिना स्वार्थ के दूसरों को जीवन देते हैं।',
      },
      {
        context: 'Internal Contemplative Offering (Jñāna Yajña)',
        contextHi: 'ज्ञान यज्ञ एवं आत्म-समर्पण',
        meaningEn: 'The higher sacrifice where sensory desires, ego, and ignorance are offered into the blazing fire of spiritual knowledge.',
        meaningHi: 'भौतिक आहुति से बढ़कर मन के विकारों और अज्ञान को ज्ञान की अग्नि में होम करना।',
      },
    ],
    verses: [
      {
        sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धनः ।\nतदर्थं कर्म कौन्तेय मुक्तसङ्गः समाचर ॥',
        transliteration: 'yajñārthāt karmaṇo\'nyatra loko\'yaṁ karma-bandhanaḥ |\ntad-arthaṁ karma kaunteya mukta-saṅgaḥ samācara ||',
        translationEn: 'Work done as a sacrifice for the Divine binds not; all other work causes bondage in this world. Therefore, O son of Kunti, perform your actions for the sake of Yajna, free from attachment.',
        translationHi: 'यज्ञ (परोपकार व ईश्वरीय कार्य) के अतिरिक्त अन्य कर्मों में लगा हुआ यह मनुष्य संसार में बंधता है। इसलिए हे कुंतीपुत्र! आसक्ति रहित होकर यज्ञ के निमित्त ही कर्म करो।',
        reference: 'Bhagavad Gita 3.9',
        referenceHi: 'भगवद्गीता ३.९',
        href: '/scripture/bhagavadgita/chapter/3/verse/9',
      },
      {
        sanskrit: 'श्रेयान्द्रव्यमयाद्यज्ञाज्ज्ञानयज्ञः परन्तप ।\nसर्वं कर्माखिलं पार्थ ज्ञाने परिसमाप्यते ॥',
        transliteration: 'śreyān dravyamayād yajñāj jñāna-yajñaḥ parantapa |\nsarvaṁ karmākhilaṁ pārtha jñāne parisamāpyate ||',
        translationEn: 'Superior is the sacrifice of wisdom (Jnana Yajna) to any material sacrifice, O scorcher of foes. All action without exception culminates in wisdom.',
        translationHi: 'द्रव्यमय (सामग्रियों के) यज्ञ की अपेक्षा ज्ञानयज्ञ अत्यंत श्रेष्ठ है। हे पार्थ! संपूर्ण कर्म ज्ञान में ही समाप्त होते हैं।',
        reference: 'Bhagavad Gita 4.33',
        referenceHi: 'भगवद्गीता ४.३३',
        href: '/scripture/bhagavadgita/chapter/4/verse/33',
      },
    ],
    traditions: [
      {
        tradition: 'Purva Mimamsa',
        traditionHi: 'पूर्व मीमांसा',
        viewEn: 'Yajna is the primary injunction of the Vedas; exact performance of ritual sacrifices produces celestial well-being and moral order.',
        viewHi: 'वेदों का मुख्य ध्येय यज्ञ है। विधिपूर्वक किया गया यज्ञ अदृष्ट पुण्य और कल्याण की सृष्टि करता है।',
      },
      {
        tradition: 'Bhagavad Gita',
        traditionHi: 'भगवद्गीता का दृष्टिकोण',
        viewEn: 'Internalizes Yajna: anyone who serves food to the hungry, practices breath restraint, or shares knowledge without selfish greed is performing Yajna.',
        viewHi: 'यज्ञ का व्यापक अर्थ: केवल हवन कुंड नहीं, बल्कि समाज सेवा, प्राणायाम, दान और ज्ञान का प्रसार भी महायज्ञ है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Yajna is only burning material wood in a pit for magical favors.',
        mythHi: 'यज्ञ केवल कुछ लकड़ी जलाकर वरदान मांगने का अंधविश्वास है।',
        correction: 'Yajna is the profound spirit of selfless contribution. When we contribute more to the world than we consume, our entire life becomes a Yajna.',
        correctionHi: 'यज्ञ प्रकृति और समाज से जितना लिया है, उससे अधिक लौटाने का जीवन-मंत्र है।',
      },
    ],
    relatedConceptIds: ['karma', 'dharma', 'seva', 'ahimsa', 'vairagya'],
    sources: ['Rigveda Purusha Sukta 10.90', 'Bhagavad Gita 3.9–16, 4.24–33', 'Taittiriya Samhita', 'Shatapatha Brahmana'],
  },

  samsara: {
    id: 'samsara',
    label: 'Samsara',
    sanskrit: 'संसार',
    transliteration: 'saṁsāra',
    category: 'metaphysics',
    colorGradient: 'from-amber-800 via-rose-900 to-stone-950',
    simpleDefinition: {
      en: 'The continuous cycle of birth, death, and rebirth driven by karma and desire—the ocean of changing worldly existence.',
      hi: 'जन्म, मृत्यु और पुनर्जन्म का वह निरंतर प्रवाह जो अज्ञान, वासना और कर्म के कारण चलता रहता है।',
    },
    derivation: {
      root: 'सृ (sṛ) with prefix सम् (sam)',
      rootMeaning: 'To flow, glide, move continuously together',
      rootMeaningHi: 'निरंतर बहना, चक्कर काटना, भटकना',
      etymologyEn: 'From prefix "sam" (intensely/continually) + root "sṛ" (to flow). Literally: "saṁsarati iti saṁsāraḥ" — that which is constantly in perpetual flux and transmigration.',
      etymologyHi: 'संस्कृत में "सम्" उपसर्ग और "सृ" (बहना) धातु से संसार शब्द बनता है: "संसरतीति संसारः" — जो निरंतर बदलता और बहता रहे, वही संसार है।',
    },
    contextualMeanings: [
      {
        context: 'Wheel of Rebirth (Punarjanma)',
        contextHi: 'पुनर्जन्म का चक्र',
        meaningEn: 'The continuous round of embodiment across different realms until spiritual liberation is attained.',
        meaningHi: 'जब तक आत्मज्ञान न हो, तब तक जीव का बार-बार नए शरीरों में आना-जाना।',
      },
      {
        context: 'Psychological Restlessness (Chitta-Bhrama)',
        contextHi: 'मानसिक अशांति व भटकाव',
        meaningEn: 'The inner state of chasing external pleasures, alternating endlessly between euphoria and despair.',
        meaningHi: 'बाहरी सुखों के पीछे भागते हुए मन का कभी प्रसन्न और कभी दुखी होना।',
      },
    ],
    verses: [
      {
        sanskrit: 'मामुपेत्य पुनर्जन्म दुःखालयमशाश्वतम् ।\nनाप्नुवन्ति महात्मानः संसिद्धिं परमां गताः ॥',
        transliteration: 'mām upetya punarjanma duḥkhālayam aśāśvatam |\nnāpnuvanti mahātmānaḥ saṁsiddhiṁ paramāṁ gatāḥ ||',
        translationEn: 'Having attained Me, these great souls do not take rebirth in this transient world which is the abode of miseries; they have reached the highest perfection.',
        translationHi: 'परम सिद्धि को प्राप्त हुए वे महात्मा मुझे पाकर दुखों के घर और क्षणभंगुर पुनर्जन्म को प्राप्त नहीं होते।',
        reference: 'Bhagavad Gita 8.15',
        referenceHi: 'भगवद्गीता ८.१५',
        href: '/scripture/bhagavadgita/chapter/8/verse/15',
      },
      {
        sanskrit: 'पुनरपि जननं पुनरपि मरणं\nपुनरपि जननीजठरे शयनम् ।\nइह संसारे बहुदुस्तारे\nकृपयाऽपारे पाहि मुरारे ॥',
        transliteration: 'punar api jananaṁ punar api maraṇaṁ\npunar api jananī-jaṭhare śayanam |\niha saṁsāre bahu-dustāre\nkṛpayā\'pāre pāhi murāre ||',
        translationEn: 'Birth again, death again, and again lying in a mother’s womb! This cycle of worldly transmigration is terribly hard to cross; protect me, O Lord, through Your boundless compassion.',
        translationHi: 'फिर जन्म, फिर मृत्यु और फिर गर्भ में वास! यह संसार पार करना अत्यंत कठिन है; हे प्रभु! अपनी असीम कृपा से मेरी रक्षा करो।',
        reference: 'Adi Shankaracharya, Bhaja Govindam 21',
        referenceHi: 'आदि शंकराचार्य, भज गोविंदम् २१',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta',
        traditionHi: 'अद्वैत वेदान्त',
        viewEn: 'Samsara is fundamentally an illusion born of superimposition (Adhyasa). Awakening to one’s true identity as Brahman ends Samsara instantly.',
        viewHi: 'संसार अज्ञान और अहंकार का भ्रम है। आत्मज्ञान होते ही साधक समझ जाता है कि वह कभी बंधा ही नहीं था।',
      },
      {
        tradition: 'Vaishnavism',
        traditionHi: 'वैष्णव दर्शन',
        viewEn: 'Samsara is a real field of moral consequence; only the unmerited grace and refuge (Sharanagati) of the Supreme Lord can transport the soul across the ocean.',
        viewHi: 'संसार भवसागर है जिसे पार करने के लिए केवल भगवान की शरणागति और कृपा ही एकमात्र नौका है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Samsara means the earth is evil and must be despised.',
        mythHi: 'संसार बुरा है इसलिए जीवन और प्रकृति से घृणा करनी चाहिए।',
        correction: 'Samsara is a sacred school of wisdom and evolution. It is called transient (ashashvatam) to prevent foolish clinginess, not to cultivate cynicism.',
        correctionHi: 'संसार आत्मा की शिक्षा का विद्यालय है। इसे नश्वर इसलिए कहा गया है ताकि हम इसमें अंधों की तरह न उलझें, घृणा करने के लिए नहीं।',
      },
    ],
    relatedConceptIds: ['karma', 'moksha', 'maya', 'atman', 'vairagya'],
    sources: ['Katha Upanishad 1.3.7', 'Bhagavad Gita 8.15–16', 'Shvetashvatara Upanishad 1.6', 'Bhaja Govindam'],
  },

  vairagya: {
    id: 'vairagya',
    label: 'Vairagya',
    sanskrit: 'वैराग्य',
    transliteration: 'vairāgya',
    category: 'practice',
    colorGradient: 'from-amber-600 via-stone-800 to-stone-950',
    simpleDefinition: {
      en: 'Spiritual dispassion and inner freedom—the peaceful cessation of craving and aversion toward transient worldly attachments.',
      hi: 'राग और द्वेष से मुक्ति—नश्वर सांसारिक आकर्षणों के प्रति विरक्ति तथा आंतरिक स्वतंत्रता और अनासक्ति की शांत अवस्था।',
    },
    derivation: {
      root: 'रञ्ज् (rañj) with prefix वि (vi)',
      rootMeaning: 'Without coloring, without clinging attraction',
      rootMeaningHi: 'रंग से रहित, आसक्ति व लोभ का अभाव',
      etymologyEn: 'From prefix "vi" (free from / without) + "rāga" (coloring, passion, clinginess). Signifies a mind whose lens is no longer clouded or dyed by selfish cravings.',
      etymologyHi: 'संस्कृत में "वि" (रहित) उपसर्ग और "राग" (आसक्ति) से वैराग्य बनता है: "विगतो रागो यस्मात्" — जिसके मन से आसक्ति का मैल धुल चुका हो।',
    },
    contextualMeanings: [
      {
        context: 'Wise Dispassion (Viveka-Pūrvaka Vairāgya)',
        contextHi: 'विवेकपूर्ण वैराग्य',
        meaningEn: 'Dispassion born from clearly discerning that transient objects can never yield permanent happiness.',
        meaningHi: 'यह जानकर शांत होना कि नश्वर सांसारिक वस्तुएं कभी भी सच्चा और स्थायी आनंद नहीं दे सकतीं।',
      },
      {
        context: 'Freedom from Craving & Aversion (Rāga-Dveṣa-Muktī)',
        contextHi: 'राग-द्वेष से मुक्ति',
        meaningEn: 'Not only dropping greed for what is pleasant, but also releasing bitter resentment toward what is unpleasant.',
        meaningHi: 'केवल प्रिय वस्तुओं की चाहत छोड़ना ही नहीं, बल्कि अप्रिय के प्रति भी घृणा और क्रोध का त्याग।',
      },
      {
        context: 'Spiritual Wing with Practice (Abhyāsa-Vairāgya)',
        contextHi: 'अभ्यास और वैराग्य के दो पंख',
        meaningEn: 'In both the Gita and Yoga Sutras, spiritual flight requires two balanced wings: steady practice (Abhyasa) and non-attachment (Vairagya).',
        meaningHi: 'पक्षी के दो पंखों की भांति साधना में प्रगति के लिए नियमित अभ्यास और अनासक्ति दोनों अनिवार्य हैं।',
      },
    ],
    verses: [
      {
        sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
        transliteration: 'asaṁśayaṁ mahā-bāho mano durnigrahaṁ calam |\nabhyāsena tu kaunteya vairāgyeṇa ca gṛhyate ||',
        translationEn: 'Without doubt, O mighty-armed Arjuna, the mind is restless and difficult to curb. But by patient practice (Abhyasa) and by dispassion (Vairagya), it can be restrained.',
        translationHi: 'हे महाबाहो! इसमें तनिक भी संदेह नहीं कि मन चंचल और कठिनता से वश में होने वाला है। परंतु हे कुंतीपुत्र! अभ्यास और वैराग्य से इसे वश में किया जा सकता है।',
        reference: 'Bhagavad Gita 6.35',
        referenceHi: 'भगवद्गीता ६.३५',
        href: '/scripture/bhagavadgita/chapter/6/verse/35',
      },
      {
        sanskrit: 'अभ्यासवैराग्याभ्यां तन्निरोधः ॥',
        transliteration: 'abhyāsa-vairāgyābhyāṁ tan-nirodhaḥ ||',
        translationEn: 'The stilling of the mental modifications is achieved through practice and non-attachment.',
        translationHi: 'चित्तवृत्तियों का निरोध अभ्यास और वैराग्य दोनों के द्वारा होता है।',
        reference: 'Patanjali Yoga Sutras 1.12',
        referenceHi: 'पातंजल योगसूत्र १.१२',
      },
      {
        sanskrit: 'भोगे रोगभयं कुले च्युतिभयं वित्ते नृपालाद्भयं...\nसर्वं वस्तु भयान्वितं भुवि नृणां वैराग्यमेवाभयम् ॥',
        transliteration: 'bhoge roga-bhayaṁ kule cyuti-bhayaṁ vitte nṛpālād bhayam...\nsarvaṁ vastu bhayānvitaṁ bhuvi nṛṇāṁ vairāgyam evābhayam ||',
        translationEn: 'In enjoyment there is fear of disease; in family status fear of decline; in wealth fear of rulers... Everything in this world is accompanied by fear; dispassion alone bestows fearlessness.',
        translationHi: 'भोगों में रोग का भय है, कुल में पतन का भय है, धन में राजा का भय है... संसार की हर वस्तु भय से युक्त है; केवल वैराग्य ही पूर्ण निर्भयता प्रदान करता है।',
        reference: 'Bhartrihari, Vairagya Shatakam 100',
        referenceHi: 'भर्तृहरि, वैराग्य शतकम् १००',
      },
    ],
    traditions: [
      {
        tradition: 'Classical Vedanta',
        traditionHi: 'वेदान्त साधना-चतुष्टय',
        viewEn: 'Vairagya is one of the four essential qualifications for spiritual inquiry (Sadhana Chatushtaya), freeing the mind from obsession with worldly results.',
        viewHi: 'वेदान्त के चार प्रमुख साधनों में से एक—इहलोक और परलोक के नश्वर सुखों के प्रति आसक्ति का अभाव।',
      },
      {
        tradition: 'Yukta Vairagya (Vaishnavism)',
        traditionHi: 'युक्त वैराग्य (भक्ति परंपरा)',
        viewEn: 'True dispassion is not dry escapism or hatred of objects, but engaging everything in the world in loving service of God.',
        viewHi: 'संसार को छोड़ना नहीं, बल्कि संसार की प्रत्येक वस्तु को भगवान की सेवा में समर्पित कर देना ही सच्चा युक्त वैराग्य है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Vairagya means becoming depressed, cold, or walking away into the forest neglecting responsibilities.',
        mythHi: 'वैराग्य का अर्थ उदास, भावनाहीन होना या जिम्मेदारियों को छोड़कर जंगल भाग जाना है।',
        correction: 'Vairagya is not depression or cold numbness. It is profound inner freedom and peace. Because you no longer cling to people for selfish demands, you can love them far more purely.',
        correctionHi: 'वैराग्य कोई अवसाद या उदासीनता नहीं है। यह मन की वह स्वतंत्रता है जो आपको बिना किसी स्वार्थ के दूसरों से सच्चा प्रेम करने की क्षमता देती है।',
      },
    ],
    relatedConceptIds: ['yoga', 'viveka', 'moksha', 'samsara', 'dharma'],
    sources: ['Bhagavad Gita 6.35, 13.8', 'Patanjali Yoga Sutras 1.12–16', 'Bhartrihari Vairagya Shatakam', 'Vivekachudamani 19–30'],
  },
  jnana: {
    "id": "jnana",
    "label": "Jnana",
    "sanskrit": "ज्ञान",
    "transliteration": "jñāna",
    "category": "core",
    "colorGradient": "from-sky-700 via-indigo-800 to-stone-950",
    "simpleDefinition": {
      "en": "Knowledge: in the scriptures, especially the kind of knowing that changes how a person sees themselves and the world, and not only the gathering of information.",
      "hi": "ज्ञान: शास्त्रों में विशेषकर वह जानना जो मनुष्य के स्वयं और संसार को देखने के ढंग को बदल दे, केवल सूचनाओं का संग्रह नहीं।"
    },
    "derivation": {
      "root": "ज्ञा (jñā)",
      "rootMeaning": "To know, to understand",
      "rootMeaningHi": "जानना, समझना",
      "etymologyEn": "The word comes from the verbal root jñā, “to know”. It is related to English “know” and Greek “gnosis” through a shared ancient root. This is a general account of the word’s origin; a reviewed etymology has not yet been added.",
      "etymologyHi": "यह शब्द धातु ज्ञा (जानना) से बना है। यह शब्द की उत्पत्ति का सामान्य परिचय है; समीक्षित व्युत्पत्ति अभी जोड़ी नहीं गई है।"
    },
    "contextualMeanings": [
      {
        "context": "Ordinary knowing",
        "contextHi": "सामान्य जानकारी",
        "meaningEn": "In everyday use, knowledge of a fact or a skill.",
        "meaningHi": "दैनिक प्रयोग में किसी तथ्य या कौशल की जानकारी।"
      },
      {
        "context": "Knowledge of the Self",
        "contextHi": "आत्म-ज्ञान",
        "meaningEn": "In Vedanta, the knowing that is said to remove ignorance about one’s own nature. Traditions describe it differently, so read the commentary alongside the verses.",
        "meaningHi": "वेदांत में वह ज्ञान जो अपने स्वरूप के विषय में अज्ञान को हटाने वाला कहा गया है। परंपराएँ इसे अलग-अलग ढंग से बताती हैं, इसलिए श्लोकों के साथ टीका भी पढ़ें।"
      },
      {
        "context": "Knowledge in the Gita",
        "contextHi": "गीता में ज्ञान",
        "meaningEn": "The Gita praises knowledge as a purifier (4.38), places it at the end of all action (4.33) and describes seeing one undivided reality in all beings as knowledge (18.20).",
        "meaningHi": "गीता ज्ञान को पवित्र करने वाला कहती है (४.३८), उसे सब कर्मों की परिणति बताती है (४.३३) और सब प्राणियों में एक अविभक्त भाव को देखना ज्ञान कहती है (१८.२०)।"
      }
    ],
    "verses": [
      {
        "sanskrit": "श्रेयान्द्रव्यमयाद्यज्ञाज्ज्ञानयज्ञः परन्तप।\nसर्वं कर्माखिलं पार्थ ज्ञाने परिसमाप्यते",
        "transliteration": "śhreyān dravya-mayād yajñāj jñāna-yajñaḥ parantapa\nsarvaṁ karmākhilaṁ pārtha jñāne parisamāpyate",
        "translationEn": "The sacrifice of knowledge is superior to material sacrifice. O Arjuna, all actions and everything else culminate in knowledge.",
        "translationHi": "हे परन्तप अर्जुन ! द्रव्यमय यज्ञसे ज्ञानयज्ञ श्रेष्ठ है। सम्पूर्ण कर्म और पदार्थ ज्ञान-(तत्त्वज्ञान-) में समाप्त हो जाते हैं।",
        "reference": "Bhagavad Gita 4.33",
        "referenceHi": "भगवद्गीता ४.३३",
        "href": "/scripture/bhagavadgita/chapter/4/verse/33"
      },
      {
        "sanskrit": "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति",
        "transliteration": "na hi jñānena sadṛiśhaṁ pavitramiha vidyate\ntatsvayaṁ yogasansiddhaḥ kālenātmani vindati",
        "translationEn": "For there is no purifier equal to knowledge; he who is perfected in Karma Yoga finds this knowledge of his own accord in himself in due time.",
        "translationHi": "इस मनुष्यलोकमें ज्ञानके समान पवित्र करनेवाला निःसन्देह दूसरा कोई साधन नहीं है। जिसका योग भली-भाँति सिद्ध हो गया है, वह (कर्मयोगी) उस तत्त्वज्ञानको अवश्य ही स्वयं अपने-आपमें पा लेता है।",
        "reference": "Bhagavad Gita 4.38",
        "referenceHi": "भगवद्गीता ४.३८",
        "href": "/scripture/bhagavadgita/chapter/4/verse/38"
      },
      {
        "sanskrit": "ज्ञानेन तु तदज्ञानं येषां नाशितमात्मनः।\nतेषामादित्यवज्ज्ञानं प्रकाशयति तत्परम्",
        "transliteration": "jñānena tu tad ajñānaṁ yeṣhāṁ nāśhitam ātmanaḥ\nteṣhām āditya-vaj jñānaṁ prakāśhayati tat param",
        "translationEn": "But for those in whom this ignorance is destroyed by the knowledge of the Self, that knowledge, in their case, is supreme and shines brightly like the sun.",
        "translationHi": "परन्तु जिन्होंने अपने जिस ज्ञान-(विवक-) के द्वारा उस अज्ञानका नाश कर दिया है, उनका वह ज्ञान सूर्यकी तरह परमतत्त्व परमात्माको प्रकाशित कर देता है।",
        "reference": "Bhagavad Gita 5.16",
        "referenceHi": "भगवद्गीता ५.१६",
        "href": "/scripture/bhagavadgita/chapter/5/verse/16"
      },
      {
        "sanskrit": "सर्वभूतेषु येनैकं भावमव्ययमीक्षते।अविभक्तं विभक्तेषु तज्ज्ञानं विद्धि सात्त्विकम्",
        "transliteration": "sarva-bhūteṣhu yenaikaṁ bhāvam avyayam īkṣhate\navibhaktaṁ vibhakteṣhu taj jñānaṁ viddhi sāttvikam",
        "translationEn": "Know that knowledge to be sattvika, by which one sees in all beings an immutable existence, undivided even in the divided.",
        "translationHi": "जिस ज्ञानके द्वारा साधक सम्पूर्ण विभक्त प्राणियोंमें विभागरहित एक अविनाशी भाव-(सत्ता-) को देखता है, उस ज्ञानको तुम सात्त्विक समझो।",
        "reference": "Bhagavad Gita 18.20",
        "referenceHi": "भगवद्गीता १८.२०",
        "href": "/scripture/bhagavadgita/chapter/18/verse/20"
      }
    ],
    "traditions": [
      {
        "tradition": "Advaita Vedanta",
        "traditionHi": "अद्वैत वेदांत",
        "viewEn": "Emphasises knowledge of the Self as the means by which ignorance is removed.",
        "viewHi": "अज्ञान को हटाने के साधन के रूप में आत्म-ज्ञान पर बल देता है।"
      },
      {
        "tradition": "Devotional traditions",
        "traditionHi": "भक्ति परंपराएँ",
        "viewEn": "Often present knowledge of the Lord and of the self as growing together with devotion, and not apart from it.",
        "viewHi": "प्रायः ज्ञान को भक्ति के साथ बढ़ने वाला मानती हैं, उससे अलग नहीं।"
      }
    ],
    "misunderstandings": [
      {
        "myth": "Jnana just means knowing a lot of information.",
        "mythHi": "ज्ञान का अर्थ केवल बहुत-सी जानकारी होना है।",
        "correction": "In these texts the word usually points to understanding that changes how one sees, and the Gita asks for it to be joined with action and with devotion, not collected for its own sake.",
        "correctionHi": "इन ग्रंथों में यह शब्द प्रायः उस समझ की ओर संकेत करता है जो देखने का ढंग बदल दे, और गीता उसे कर्म तथा भक्ति से जोड़ने को कहती है।"
      }
    ],
    "relatedConceptIds": [
      "atman",
      "moksha",
      "yoga",
      "maya",
      "karma",
      "bhakti"
    ],
    "sources": [
      "Bhagavad Gita 4.33, 4.38, 5.16 and 18.20",
      "Editorial summary: a draft, not yet reviewed"
    ]
  },
  vedanta: {
    id: 'vedanta',
    label: 'Vedanta',
    sanskrit: 'वेदान्त',
    transliteration: 'vedānta',
    category: 'metaphysics',
    colorGradient: 'from-purple-600 to-indigo-700',
    simpleDefinition: {
      en: 'The culmination of Vedic wisdom exploring non-dual reality, the nature of consciousness, and direct liberation.',
      hi: 'वेदों का शिरोभाग व परम निष्कर्ष — जीव, ब्रह्म और जगत के यथार्थ संबंध का निरूपण करने वाला अद्वैत दर्शन।',
    },
    derivation: {
      root: 'वेद + अंत (Culmination of Knowledge)',
      rootMeaning: 'Veda (sacred wisdom) + Anta (culmination, essence, or final conclusion)',
      rootMeaningHi: 'वेद (ज्ञान) + अंत (शिखर, पराकाष्ठा या सारभाग)',
      etymologyEn: 'Literally "the end or ultimate goal of the Vedas"—specifically referring to the Upanishads, Bhagavad Gita, and Brahma Sutras.',
      etymologyHi: 'वेदों के अंतिम दार्शनिक भाग (उपनिषदों) और उनके तात्विक निष्कर्ष को वेदान्त कहा जाता है।',
    },
    contextualMeanings: [
      {
        context: 'The Triple Canon (Prasthānatrayī)',
        contextHi: 'प्रस्थानत्रयी (उपनिषद्, गीता, ब्रह्मसूत्र)',
        meaningEn: 'The three authoritative pillars: Shruti (revealed intuition), Smriti (practical duty), and Nyaya (logical coherence).',
        meaningHi: 'श्रुति प्रस्थान (उपनिषद्), स्मृति प्रस्थान (गीता), और न्याय प्रस्थान (ब्रह्मसूत्र) — वेदान्त के तीन आधार।',
      },
      {
        context: 'Non-Dual Realization (Advaita)',
        contextHi: 'अद्वैत साक्षात्कार',
        meaningEn: 'The profound realization that individual consciousness (Atman) and universal reality (Brahman) are non-different.',
        meaningHi: 'यह परम बोध कि आत्मा और ब्रह्म में कोई तात्विक भेद नहीं है (« अहं ब्रह्मास्मि »)।',
      },
      {
        context: 'Practical Living (Applied Vedanta)',
        contextHi: 'व्यावहारिक वेदान्त',
        meaningEn: 'Translating transcendent non-duality into fearless compassion, service, and dignity in everyday life.',
        meaningHi: 'अद्वैत सत्य को समाज में निर्भयता, समभाव और सर्वभूत-हित के रूप में जीना।',
      },
    ],
    verses: [
      {
        sanskrit: 'अहं ब्रह्मास्मि ।',
        transliteration: 'ahaṁ brahmāsmi |',
        translationEn: 'I am the Absolute Brahman.',
        translationHi: 'मैं ही वह शुद्ध, अविनाशी परब्रह्म हूँ।',
        reference: 'Brihadaranyaka Upanishad 1.4.10',
        referenceHi: 'बृहदारण्यकोपनिषद् १.४.१०',
      },
      {
        sanskrit: 'सर्वं खल्विदं ब्रह्म तज्जलानिति शांत उपासीत ।',
        transliteration: 'sarvaṁ khalvidaṁ brahma tajjalāniti śānta upāsīta |',
        translationEn: 'All this universe is verily Brahman; from It it arises, into It it dissolves, in It it breathes. Thus should one meditate with a peaceful mind.',
        translationHi: 'यह सब कुछ निश्चय ही ब्रह्म है; उसी से उत्पन्न होता है, उसी में विलीन होता है और उसी में चेष्टा करता है। इसलिए शांत होकर उसकी उपासना करनी चाहिए।',
        reference: 'Chandogya Upanishad 3.14.1',
        referenceHi: 'छांदोग्योपनिषद् ३.१४.१',
      },
      {
        sanskrit: 'वेदान्तकृद्वेदविदेव चाहम् ।',
        transliteration: 'vedāntakṛd vedavideva cāham |',
        translationEn: 'I am the author of the Vedanta and the knower of the Vedas.',
        translationHi: 'मैं ही वेदान्त का रचयिता और वेदों का यथार्थ ज्ञाता हूँ।',
        reference: 'Bhagavad Gita 15.15',
        referenceHi: 'भगवद्गीता १५.१५',
        href: '/scripture/bhagavadgita/chapter/15/verse/15',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita (Adi Shankara)',
        traditionHi: 'अद्वैत वेदान्त (आदि शंकराचार्य)',
        viewEn: 'Absolute non-duality: Brahman alone is real, the world is transient appearance, and the soul is Brahman itself.',
        viewHi: '« ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः » — अद्वैत में आत्मा और ब्रह्म की पूर्ण एकता है।',
      },
      {
        tradition: 'Vishishtadvaita (Ramanuja)',
        traditionHi: 'विशिष्टाद्वैत (रामानुजाचार्य)',
        viewEn: 'Qualified non-dualism: Souls and universe are real, forming the divine body of Narayana.',
        viewHi: 'जीव और प्रकृति सत्य हैं, जो परमात्मा (नारायण) के शरीर रूप में स्थित हैं।',
      },
      {
        tradition: 'Dvaita (Madhvacharya)',
        traditionHi: 'द्वैत वेदान्त (मध्वाचार्य)',
        viewEn: 'Dualism: Eternal real distinction between the independent Lord (Vishnu) and dependent souls.',
        viewHi: 'ईश्वर और जीव में नित्य वास्तविक भेद है; भगवान की कृपा ही मोक्ष का साधन है।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Vedanta is purely dry intellectual philosophy with no room for heart or devotion.',
        mythHi: 'वेदान्त केवल शुष्क बौद्धिक तर्क है, जिसमें भक्ति या भावना का कोई स्थान नहीं।',
        correction: 'Vedanta without devotion is incomplete; Adi Shankara composed some of the greatest devotional stotras (Bhaja Govindam, Saundarya Lahari). Highest Jnana and highest Bhakti merge as pure divine love.',
        correctionHi: 'वेदान्त शुष्क नहीं है; आदि शंकराचार्य ने स्वयं भज गोविंदम् आदि महान स्तोत्रों की रचना की। ज्ञान की परिपक्वता ही निष्काम पराभक्ति है।',
      },
      {
        myth: 'Saying "Jagat Mithya" means the world does not exist and you should abandon all duties.',
        mythHi: '"जगत मिथ्या" का अर्थ है कि संसार अस्तित्वहीन है और सब कर्म छोड़ देने चाहिए।',
        correction: '"Mithya" in Vedanta means dependent and ever-changing (anitya), not non-existent. One lives with complete excellence and compassion while anchored in the eternal.',
        correctionHi: 'मिथ्या का अर्थ काल्पनिक या शून्य नहीं, बल्कि परिवर्तनशील व ब्रह्म पर आश्रित होना है। ज्ञानी लोकसंग्रह हेतु श्रेष्ठ कर्म करता है।',
      },
    ],
    relatedConceptIds: ['brahman', 'atman', 'maya', 'moksha', 'karma', 'yoga'],
    sources: [
      'Brahma Sutras 1.1.1-4',
      'Principal Upanishads (Brihadaranyaka, Chandogya, Mandukya)',
      'Bhagavad Gita Chapter 15',
    ],
  },

  lokasamgraha: {
    id: 'lokasamgraha',
    label: 'Lokasamgraha',
    sanskrit: 'लोकसंग्रह',
    transliteration: 'lokasaṅgraha',
    category: 'practice',
    colorGradient: 'from-amber-600 via-saffron-700 to-emerald-950',
    simpleDefinition: {
      en: 'The universal welfare, upliftment, holding together, and protection of all beings—the supreme compassionate duty that drives enlightened seers and saints to act selflessly in the world.',
      hi: 'समस्त प्राणियों का कल्याण, समाज का संधारण, संरक्षण और आत्मिक उत्थान—वह निष्काम पावन कर्तव्य जिसके लिए आत्मज्ञानी सन्त, ऋषि और महापुरुष लोक-कल्याण और विश्व-व्यवस्था की रक्षा हेतु निरंतर कर्म करते हैं।',
    },
    derivation: {
      root: 'लोक् (lok) + सम् (sam) + ग्रह् (grah)',
      rootMeaning: 'To see / perceive (loka = all beings/world) + hold together completely (samgraha)',
      rootMeaningHi: 'लोक (समस्त प्राणी व संसार) का सम्यक् संग्रह (धारण, पोषण व कल्याण)',
      etymologyEn: 'Formed from "loka" (the living world/society) + prefix "sam" (thoroughly, harmoniously) + verbal root "grah" (to hold, support, gather). In Paninian grammar: "Lokānāṁ saṅgrahaḥ lokasaṅgrahaḥ" — that which holds human society together in righteousness, preventing moral fragmentation and despair.',
      etymologyHi: 'संस्कृत में "लोकानां संग्रहः लोकसंग्रहः" — अर्थात् संसार के जीवों को सन्मार्ग पर स्थिर रखना, समाज को पतन और अव्यवस्था से बचाना और सबका कल्याण साधन करना ही लोकसंग्रह है।',
    },
    contextualMeanings: [
      {
        context: 'Exemplary Moral Leadership (श्रेष्ठ पुरुष का आदर्श)',
        contextHi: 'श्रेष्ठ पुरुष का आदर्श आचरण',
        meaningEn: 'The enlightened leader acts with unswerving dedication, not for personal profit, but to set a living standard that inspires and elevates society (Gita 3.21).',
        meaningHi: 'ज्ञानी महापुरुष स्वयं किसी स्वार्थ के बिना भी समाज के मार्गदर्शन और आदर्श स्थापित करने के लिए श्रेष्ठ कर्म करते हैं (गीता ३.२१)।',
      },
      {
        context: 'Universal Compassion in Action (सर्वभूतहित)',
        contextHi: 'प्राणिमात्र का कल्याण (सर्वभूतहिते रताः)',
        meaningEn: 'Active benevolence seeing the same divine Self residing in all creatures (Atmavat Sarvabhuteshu), translating spiritual realization into loving service.',
        meaningHi: 'सब प्राणियों में एक ही परमात्मा को देखकर (आत्मवत् सर्वभूतेषु) उनकी सेवा और भलाई में निरंतर संलग्न रहना।',
      },
      {
        context: 'Cosmic Stewardship & Reciprocity (यज्ञ-चक्र संधारण)',
        contextHi: 'सृष्टि-चक्र का पोषण',
        meaningEn: 'Sustaining the cosmic wheel of mutual nourishment, giving back selflessly to nature and community more than one consumes.',
        meaningHi: 'प्रकृति और समाज से जो कुछ मिला है, उससे अधिक निःस्वार्थ भाव से लौटाकर सृष्टि-संतुलन को बनाए रखना।',
      },
      {
        context: 'Refusal of Escapism (अकर्मण्यता व पलायन का निषेध)',
        contextHi: 'पलायनवाद का त्याग',
        meaningEn: 'True renunciation is the surrender of ego and selfishness, never the abandonment of moral and social duty.',
        meaningHi: 'सच्चा संन्यास अहंकार और वासना का त्याग है, समाज और कर्तव्य से भागना नहीं।',
      },
    ],
    verses: [
      {
        sanskrit: 'कर्मणैव हि संसिद्धिमास्थिता जनकादयः ।\nलोकसंग्रहमेवापि संपश्यन्कर्तुमर्हसि ॥',
        transliteration: 'karmaṇaiva hi saṁsiddhim āsthitā janakādayaḥ |\nlokasaṅgraham evāpi sampaśyan kartum arhasi ||',
        translationEn: 'King Janaka and other illuminated seers attained perfection through selfless action alone. Therefore, even with a view to the holding together and welfare of the world, you should perform action.',
        translationHi: 'राजा जनक जैसे ज्ञानी महापुरुष भी निष्काम कर्म के द्वारा ही परम सिद्धि को प्राप्त हुए। इसलिए लोकसंग्रह (संसार के कल्याण व व्यवस्था) को देखते हुए भी तुम्हें कर्म करना ही योग्य है।',
        reference: 'Bhagavad Gita 3.20',
        referenceHi: 'भगवद्गीता ३.२०',
        href: '/scripture/bhagavadgita/chapter/3/verse/20',
      },
      {
        sanskrit: 'सक्ताः कर्मण्यविद्वांसो यथा कुर्वन्ति भारत ।\nकुर्याद्विद्वांस्तथासक्तश्चिकीर्षुर्लोकसंग्रहम् ॥',
        transliteration: 'saktāḥ karmaṇy avidvāṁso yathā kurvanti bhārata |\nkuryād vidvāṁs tathāsaktaś cikīrṣur lokasaṅgraham ||',
        translationEn: 'As the unenlightened act attached to the fruits of action, O Bharata, so should the enlightened act without attachment, desiring the guidance and welfare of humanity (Lokasamgraha).',
        translationHi: 'हे भारत! अज्ञानी मनुष्य जिस प्रकार फल में आसक्त होकर कर्म करते हैं, ज्ञानी पुरुष को आसक्तिरहित होकर लोकसंग्रह (संसार के कल्याण) की इच्छा से वैसे ही कर्म करना चाहिए।',
        reference: 'Bhagavad Gita 3.25',
        referenceHi: 'भगवद्गीता ३.२५',
        href: '/scripture/bhagavadgita/chapter/3/verse/25',
      },
      {
        sanskrit: 'लभन्ते ब्रह्मनिर्वाणमृषयः क्षीणकल्मषाः ।\nछिन्नद्वैधा यतात्मानः सर्वभूतहिते रताः ॥',
        transliteration: 'labhante brahma-nirvāṇam ṛṣayaḥ kṣīṇa-kalmaṣāḥ |\nchinna-dvaidhā yatātmānaḥ sarva-bhūta-hite ratāḥ ||',
        translationEn: 'Those holy seers whose sins are cleansed, whose doubts are resolved, whose minds are disciplined, and who rejoice in the welfare of all beings, attain eternal liberation in Brahman.',
        translationHi: 'जिनके सब संशय कट चुके हैं, जिनका मन संयमित है और जो सब प्राणियों के हित में रत रहते हैं (सर्वभूतहिते रताः), वे निष्पाप ऋषि ब्रह्मनिर्वाण (परम मोक्ष) को प्राप्त होते हैं।',
        reference: 'Bhagavad Gita 5.25',
        referenceHi: 'भगवद्गीता ५.२५',
        href: '/scripture/bhagavadgita/chapter/5/verse/25',
      },
    ],
    traditions: [
      {
        tradition: 'Advaita Vedanta (Adi Shankara)',
        traditionHi: 'अद्वैत वेदान्त (आदि शंकराचार्य)',
        viewEn: 'In his Gita Bhashya (3.20), Shankara explains that even for the Knower of Brahman who has no personal desires remaining, engagement in action is necessary for Lokasamgraha—to safeguard society from moral dissolution.',
        viewHi: 'शांकर भाष्य में स्पष्ट किया गया है कि आत्मज्ञानी को अपने लिए कुछ नहीं चाहिए, फिर भी वह समाज को सन्मार्ग पर रखने और अव्यवस्था रोकने के लिए लोकसंग्रह हेतु कर्म करता है।',
      },
      {
        tradition: 'Vishishtadvaita (Ramanujacharya)',
        traditionHi: 'विशिष्टाद्वैत (रामानुजाचार्य)',
        viewEn: 'Since all beings constitute the divine body of Narayana (Sarira-Sariri Bhava), Lokasamgraha is the direct loving worship (Kainkarya) of the Divine immanent in society.',
        viewHi: 'समस्त संसार भगवान का दिव्य शरीर है; अतः समाज और प्राणिमात्र की निःस्वार्थ सेवा (लोकसंग्रह) भगवान नारायण की साक्षात् पूजा है।',
      },
      {
        tradition: 'Sant Parampara (Tulsidas, Jnaneshwar, Tukaram)',
        traditionHi: 'सन्त-परम्परा (तुलसीदास, ज्ञानेश्वर, तुकाराम)',
        viewEn: 'The saints lived Lokasamgraha: Tulsidas declared "Parahita sarisa dharama nahi bhai" (no dharma equals serving others). They renounced privilege to bring sacred wisdom to the common people.',
        viewHi: 'सन्तों ने लोकसंग्रह को जिया—"परहित सरिस धरम नहिं भाई।" उन्होंने आम जन के कल्याण हेतु जनभाषा में अमृत ज्ञान बांटा और सामाजिक समरसता स्थापित की।',
      },
      {
        tradition: 'Modern Dharmic Renaissance (Vivekananda & Tilak)',
        traditionHi: 'आधुनिक नवजागरण (विवेकानन्द व तिलक)',
        viewEn: 'Bal Gangadhar Tilak established Lokasamgraha as the master-key of Gita Rahasya, while Swami Vivekananda synthesized it as "Atmano mokshartham jagaddhitaya cha" (for one\'s own liberation and the welfare of the world).',
        viewHi: 'लोकमान्य तिलक ने "गीता रहस्य" में लोकसंग्रह को गीता का मूल रहस्य सिद्ध किया, और स्वामी विवेकानन्द ने इसे "आत्मनो मोक्षार्थं जगद्धिताय च" का आदर्श बनाया।',
      },
    ],
    misunderstandings: [
      {
        myth: 'Spirituality means abandoning society, ignoring public welfare, and meditating in isolation.',
        mythHi: 'अध्यात्म का अर्थ समाज और परिवार को छोड़कर जंगल में भाग जाना और दुनिया से उदासीन हो जाना है।',
        correction: 'Hindu saints never taught passive escapism. The supreme mark of spiritual illumination in Sanatana Dharma is Lokasamgraha—acting with fearless, selfless love to uplift and sustain humanity.',
        correctionHi: 'सनातन धर्म में पलायनवाद का कोई स्थान नहीं है। आत्मज्ञान की वास्तविक परिणति लोकसंग्रह (समाज का कल्याण और निःस्वार्थ सेवा) में ही होती है।',
      },
      {
        myth: 'Lokasamgraha is just modern corporate philanthropy or political social work.',
        mythHi: 'लोकसंग्रह केवल भौतिक समाज-सेवा या राजनीतिक गतिविधि है।',
        correction: 'Unlike superficial philanthropy driven by ego or PR, Lokasamgraha is sacred work rooted in recognizing the non-dual Self in all beings, performed without personal craving.',
        correctionHi: 'लोकसंग्रह केवल भौतिक सहायता नहीं, अपितु सबमें एक ही आत्म-तत्त्व को देखकर अहंकाररहित होकर की गई पावन सेवा है।',
      },
    ],
    relatedConceptIds: ['dharma', 'karma', 'yajna', 'ahimsa', 'moksha', 'vedanta'],
    sources: [
      'Bhagavad Gita 3.20, 3.25, 5.25, 12.4',
      'Mahabharata Shanti Parva (Rajadharma & Apaddharma)',
      'Gita Rahasya by Bal Gangadhar Tilak',
      'Complete Works of Swami Vivekananda',
      'Ramcharitmanas by Goswami Tulsidas',
    ],
  },
};

export function getConceptDetail(id: string): ConceptDetail | undefined {
  return CONCEPT_DETAILS[id];
}

export function getAllConceptDetails(): ConceptDetail[] {
  return Object.values(CONCEPT_DETAILS);
}
