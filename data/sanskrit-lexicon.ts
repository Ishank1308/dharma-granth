/**
 * Sanskrit Lexicon & Word Explorer Database
 * Epistemic Integrity:
 * - Dhatu (roots), etymologies, grammatical cases, and contextual meanings
 * - Strict reviewed status: only verified classical etymologies and definitions are included.
 * - Explicit separation between grammatical facts, contextual usage, and common modern misunderstandings.
 */

export interface LexiconMisunderstanding {
  myth: string;
  mythHi: string;
  correction: string;
  correctionHi: string;
}

export interface LexiconRelatedVerse {
  scriptureId: string;
  chapter: number;
  verse: number;
  snippet?: string;
  snippetHi?: string;
}

export interface SanskritLexiconEntry {
  id: string;
  termDevanagari: string;
  termIast: string;
  rootDhatu: string;
  rootMeaning: string;
  rootMeaningHi: string;
  grammarCategory: string;
  contextualMeaning: string;
  contextualMeaningHi: string;
  simpleEnglish: string;
  simpleHindi: string;
  commonMisunderstandings: LexiconMisunderstanding[];
  relatedVerses: LexiconRelatedVerse[];
  conceptId?: string;
  reviewStatus: 'approved' | 'draft_reviewed';
  classicalAttribution?: string;
}

export const SANSKRIT_LEXICON: Record<string, SanskritLexiconEntry> = {
  karma: {
    id: 'karma',
    termDevanagari: 'कर्म (कर्मणि)',
    termIast: 'karma (karmaṇi)',
    rootDhatu: 'कृ (डुDef: करणे) — to do, act, create',
    rootMeaning: 'Act, action, conscious deed, deliberate work',
    rootMeaningHi: 'करना, यत्न करना, कर्तव्य का संपादन',
    grammarCategory: 'नपुंसकलिङ्ग संज्ञा (कर्मन्) · कर्मणि: सप्तमी विभक्ति, एकवचन',
    contextualMeaning: 'In the sphere of rightful duty, righteous effort, and active agency. In Gita 2.47, it denotes the sphere of action belonging to the seeker—neither fatalistic passivity nor arrogant entitlement.',
    contextualMeaningHi: 'कर्तव्य और पुरुषार्थ के क्षेत्र में। गीता २.४७ में इसका अर्थ मनुष्य के अधिकार और सामर्थ्य का सक्रिय क्षेत्र है, न कि भाग्यवादी अकर्मण्यता।',
    simpleEnglish: 'Action, duty, or intentional deed.',
    simpleHindi: 'कर्तव्य, कर्म, सचेत यत्न।',
    commonMisunderstandings: [
      {
        myth: 'Karma means inescapable fatalism or passive acceptance of suffering.',
        mythHi: 'कर्म का अर्थ भाग्य पर सब कुछ छोड़ देना या लाचारी है।',
        correction: 'Karma emphasizes sovereign agency and responsibility in the present moment. Past actions shape circumstances, but present choices dictate character and growth.',
        correctionHi: 'कर्म वर्तमान में निर्णय लेने की स्वायत्तता और दायित्व पर बल देता है। भूतकाल केवल परिस्थिति बनाता है, पर वर्तमान का संकल्प व्यक्ति का अपना होता है।'
      },
      {
        myth: 'Karma Yoga means doing hard work without caring if it succeeds or benefits anyone.',
        mythHi: 'कर्मयोग का अर्थ है बिना सोचे-समझे काम करना।',
        correction: 'Karma Yoga demands peak craftsmanship and excellence, but frees the mind from emotional anxiety over outcomes.',
        correctionHi: 'कर्मयोग श्रेष्ठता और कुशलता की मांग करता है, पर मन को परिणाम के भय व अहंकार से मुक्त रखता है।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 47, snippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि' },
      { scriptureId: 'bhagavadgita', chapter: 3, verse: 8, snippet: 'नियतं कुरु कर्म त्वं कर्म ज्यायो ह्यकर्मणः। शरीरयात्रापि च ते न प्रसिद्ध्येदकर्मणः' },
      { scriptureId: 'bhagavadgita', chapter: 4, verse: 18, snippet: 'कर्मण्यकर्म यः पश्येदकर्मणि च कर्म यः। स बुद्धिमान् मनुष्येषु स युक्तः कृत्स्नकर्मकृत्' }
    ],
    conceptId: 'karma',
    reviewStatus: 'approved',
    classicalAttribution: 'पाणिनि धातुपाठ (कृञ् करणे) व शाङ्करभाष्य'
  },

  adhikara: {
    id: 'adhikara',
    termDevanagari: 'अधिकारः',
    termIast: 'adhikāraḥ',
    rootDhatu: 'अधि (उपसर्ग: ऊपर/प्रभुत्व) + कृ (करना) + घञ् प्रत्यय',
    rootMeaning: 'Jurisdiction, competency, rightful sphere of duty, eligibility',
    rootMeaningHi: 'सामर्थ्य, योग्यता, कार्यक्षेत्र, दायित्व',
    grammarCategory: 'पुंल्लिङ्ग संज्ञा, प्रथमा विभक्ति, एकवचन',
    contextualMeaning: 'Not an entitlement to demand privileges or claim rewards, but the sovereign agency and moral duty to act with integrity.',
    contextualMeaningHi: 'पुरस्कार मांगने का दावा या स्वार्थ नहीं, बल्कि कर्म करने की योग्यता, दायित्व और नैतिक संप्रभुता।',
    simpleEnglish: 'Rightful sphere of duty, jurisdiction, agency.',
    simpleHindi: 'कार्यक्षेत्र, सामर्थ्य, दायित्व का अधिकार।',
    commonMisunderstandings: [
      {
        myth: 'Adhikāra here means consumer rights or legal entitlement to claim benefits.',
        mythHi: 'अधिकार का अर्थ यहां सुख या फल मांगने का हक है।',
        correction: 'Classical Sanskrit uses adhikāra for inner qualification and moral stewardship, contrasting directly with entitlement over rewards.',
        correctionHi: 'शास्त्रीय संस्कृत में अधिकार का अर्थ आंतरिक पात्रता, उत्तरदायित्व और कार्यक्षेत्र है, न कि उपभोक्ता का दावा।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 47, snippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि' },
      { scriptureId: 'bhagavadgita', chapter: 18, verse: 47, snippet: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वभावनियतं कर्म कुर्वन्नाप्नोति किल्बिषम्' }
    ],
    conceptId: 'dharma',
    reviewStatus: 'approved',
    classicalAttribution: 'मीमांसा दर्शन (अधिकार लक्षण) व गीताभाष्य'
  },

  phala: {
    id: 'phala',
    termDevanagari: 'फल (फलेषु)',
    termIast: 'phala (phaleṣu)',
    rootDhatu: 'फल् (निष्पत्तौ / विकसने) — to bear fruit, mature, yield results',
    rootMeaning: 'Fruit, outcome, reward, ripened consequence',
    rootMeaningHi: 'परिणाम, प्रतिफल, फलित होना',
    grammarCategory: 'नपुंसकलिङ्ग संज्ञा (फलम्) · फलेषु: सप्तमी विभक्ति, बहुवचन',
    contextualMeaning: 'The external outcomes, societal rewards, validation, or future harvest resulting from actions. The text warns that outcomes depend on numerous collective variables beyond single individual control.',
    contextualMeaningHi: 'बाहरी परिणाम, लाभ, जय-पराजय या सामाजिक प्रशंसा। परिणाम केवल आपके वश में नहीं हैं क्योंकि वे अनेक प्राकृतिक व सामाजिक कारकों पर निर्भर करते हैं।',
    simpleEnglish: 'Fruits, outcomes, results.',
    simpleHindi: 'परिणाम, फल, प्रतिफल।',
    commonMisunderstandings: [
      {
        myth: 'Not expecting fruits means working with indifference, carelessness, or having zero goals.',
        mythHi: 'फल की इच्छा न रखने का अर्थ है बिना लक्ष्य या लापरवाही से काम करना।',
        correction: 'Planning and clarity of purpose are essential; detachment is about emotional sovereignty so setbacks do not cause despair nor victories cause arrogance.',
        correctionHi: 'लक्ष्य और योजना आवश्यक हैं; अनासक्ति का अर्थ है परिणाम से मानसिक संतुलन न खोना ताकि असफलता में अवसाद न हो और सफलता में घमंड न हो।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 47, snippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि' },
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 51, snippet: 'कर्मजं बुद्धियुक्ता हि फलं त्यक्त्वा मनीषिणः। जन्मबन्धविनिर्मुक्ताः पदं गच्छन्त्यनामयम्' },
      { scriptureId: 'bhagavadgita', chapter: 5, verse: 12, snippet: 'युक्तः कर्मफलं त्यक्त्वा शान्तिमाप्नोति नैष्ठिकीम्। अयुक्तः कामकारेण फले सक्तो निबध्यते' }
    ],
    conceptId: 'karma',
    reviewStatus: 'approved',
    classicalAttribution: 'रामानुजभाष्य एवं श्रीधरस्वामी सुबोधिनी'
  },

  akarma: {
    id: 'akarma',
    termDevanagari: 'अकर्म (अकर्मणि)',
    termIast: 'akarma (akarmaṇi)',
    rootDhatu: 'नञ् (अभाव) + कर्म (कृ धातु)',
    rootMeaning: 'Inaction, cessation of duty, inertia, apathy',
    rootMeaningHi: 'कर्म न करना, निष्क्रियता, आलस्य, पलायन',
    grammarCategory: 'नपुंसकलिङ्ग संज्ञा (अकर्मन्) · अकर्मणि: सप्तमी विभक्ति, एकवचन',
    contextualMeaning: 'Refusal to act due to cynicism, fatigue, fear of failure, or emotional despair. In Gita 2.47, Krishna warns Arjuna not to confuse detachment from fruits with irresponsible withdrawal.',
    contextualMeaningHi: 'निराशा, भय या आलस्यवश कर्तव्य छोड़ देना। श्रीकृष्ण अर्जुन को चेतावनी देते हैं कि फल की आसक्ति छोड़ने का अर्थ यह नहीं कि तुम कर्म करना ही छोड़ दो।',
    simpleEnglish: 'Inaction, inertia, apathy, withdrawal.',
    simpleHindi: 'निष्क्रियता, आलस्य, कर्तव्य-त्याग।',
    commonMisunderstandings: [
      {
        myth: 'Spiritual detachment means retiring from worldly responsibility and doing nothing.',
        mythHi: 'आध्यात्मिकता का अर्थ संसार छोड़कर कुछ न करना है।',
        correction: 'The Gita explicitly condemns escapism (akarma) and insists that noble engagement (nishkama karma) is the true spiritual path.',
        correctionHi: 'गीता पलायनवाद और अकर्मण्यता का स्पष्ट खंडन करती है और निष्काम कर्म को सच्चा आध्यात्मिक मार्ग बताती है।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 47, snippet: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि' },
      { scriptureId: 'bhagavadgita', chapter: 3, verse: 4, snippet: 'न कर्मणामनारम्भान्नैष्कर्म्यं पुरुषोऽश्नुते। न च संन्यसनादेव सिद्धिं समधिगच्छति' },
      { scriptureId: 'bhagavadgita', chapter: 4, verse: 17, snippet: 'कर्मणो ह्यपि बोद्धव्यं बोद्धव्यं च विकर्मणः। अकर्मणश्च बोद्धव्यं गहना कर्मणो गतिः' }
    ],
    conceptId: 'karma',
    reviewStatus: 'approved',
    classicalAttribution: 'शाङ्करभाष्य एवं मधुसूदन सरस्वती गूढार्थदीपिका'
  },

  dharma: {
    id: 'dharma',
    termDevanagari: 'धर्मः',
    termIast: 'dharmaḥ',
    rootDhatu: 'धृ (धृञ् धारणे) — that which upholds, sustains, and supports',
    rootMeaning: 'Cosmic order, righteousness, intrinsic nature, ethical responsibility',
    rootMeaningHi: 'धारण करना, स्थिरता देना, जो संपूर्ण सृष्टि और समाज को संतुलित रखे',
    grammarCategory: 'पुंल्लिङ्ग संज्ञा, प्रथमा विभक्ति, एकवचन',
    contextualMeaning: 'The foundational cosmic and ethical harmony that sustains individual integrity and communal well-being. Not sectarian dogma, but living truth and duty.',
    contextualMeaningHi: 'सत्य, न्याय, कर्तव्य और संतुलन का वह शाश्वत नियम जो समाज और जीवन को नष्ट होने से बचाता है।',
    simpleEnglish: 'Cosmic harmony, duty, intrinsic nature, righteous living.',
    simpleHindi: 'कर्तव्य, सदाचार, स्वभाव, धारक शक्ति।',
    commonMisunderstandings: [
      {
        myth: 'Dharma is equivalent to religious dogma or sectarian ritualism.',
        mythHi: 'धर्म का अर्थ केवल पूजा-पाठ या संप्रदाय है।',
        correction: 'Dharma is rooted in the Sanskrit root dhṛ (to uphold). It signifies foundational ethics, civic harmony, and self-nature across all traditions.',
        correctionHi: 'धर्म का मूल अर्थ धारण करने वाला शाश्वत नैतिक और प्राकृतिक नियम है, न कि संकीर्ण संप्रदायवाद।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 1, verse: 1, snippet: 'धृतराष्ट्र उवाच धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय' },
      { scriptureId: 'bhagavadgita', chapter: 4, verse: 7, snippet: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदाऽऽत्मानं सृजाम्यहम्' },
      { scriptureId: 'bhagavadgita', chapter: 18, verse: 66, snippet: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः' }
    ],
    conceptId: 'dharma',
    reviewStatus: 'approved',
    classicalAttribution: 'वैशेषिक सूत्र (यतोऽभ्युदयनिःश्रेयससिद्धिः स धर्मः)'
  },

  yoga: {
    id: 'yoga',
    termDevanagari: 'योगः',
    termIast: 'yogaḥ',
    rootDhatu: 'युज् (युजिँर् योगे / युजँ समाधौ) — to yoke, integrate, unite, harmonize',
    rootMeaning: 'Integration, disciplined harmony, equanimity of mind',
    rootMeaningHi: 'जोड़ना, समन्वय, समत्व, चित्त की स्थिरता',
    grammarCategory: 'पुंल्लिङ्ग संज्ञा, प्रथमा विभक्ति, एकवचन',
    contextualMeaning: 'Equanimity in success and failure (samatvam yoga ucyate) and excellence in all actions (yogah karmasu kaushalam).',
    contextualMeaningHi: 'सुख-दुःख, लाभ-हानि में चित्त का समभाव तथा कर्तव्य-कर्मों में निष्काम कुशलता।',
    simpleEnglish: 'Disciplined integration, equanimity, skilful living.',
    simpleHindi: 'समत्व, मानसिक संतुलन, कर्म-कुशलता।',
    commonMisunderstandings: [
      {
        myth: 'Yoga is solely physical gymnastics or contortion exercises.',
        mythHi: 'योग केवल शारीरिक व्यायाम और आसन है।',
        correction: 'In classical scripture, Yoga is psychological equanimity, mastery over thoughts, and communion with truth.',
        correctionHi: 'शास्त्रों में योग का मुख्य अर्थ मन की स्थिरता, अहंकार से मुक्ति और सत्य से एकाकार होना है।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 48, snippet: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय। सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते' },
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 50, snippet: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते। तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम्' },
      { scriptureId: 'bhagavadgita', chapter: 6, verse: 5, snippet: 'उद्धरेदात्मनाऽऽत्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः' }
    ],
    conceptId: 'yoga',
    reviewStatus: 'approved',
    classicalAttribution: 'पातञ्जल योगसूत्र व भगवद्गीता २.४८, २.५०'
  },

  atman: {
    id: 'atman',
    termDevanagari: 'आत्मन् (आत्मा)',
    termIast: 'ātman (ātmā)',
    rootDhatu: 'अत् (सातत्यगमने) / आप् (व्याप्तौ) — that which is constantly conscious, all-pervading',
    rootMeaning: 'True self, pure consciousness, immortal observer',
    rootMeaningHi: 'शाश्वत चेतन तत्त्व, नित्य साक्षी, आत्मा',
    grammarCategory: 'पुंल्लिङ्ग संज्ञा, प्रथमा विभक्ति, एकवचन',
    contextualMeaning: 'The unchanging witness of physical and mental modifications, distinct from the perishable body, fluctuating ego, and thoughts.',
    contextualMeaningHi: 'शरीर, मन और बुद्धि से परे अविनाशी चेतन साक्षी तत्त्व जो जन्म और मृत्यु से परे है।',
    simpleEnglish: 'The true self, immortal consciousness.',
    simpleHindi: 'शाश्वत आत्मा, विशुद्ध चेतना।',
    commonMisunderstandings: [
      {
        myth: 'Atman is a physical spark or psychological ghost inside the brain.',
        mythHi: 'आत्मा दिमाग के भीतर कोई छोटा भूत या भौतिक अंश है।',
        correction: 'Atman is pure subjective awareness itself—unbounded by space, time, or physical matter.',
        correctionHi: 'आत्मा स्वयं विशुद्ध बोध स्वरूप है जो देश, काल और पदार्थों की सीमाओं से अतीत है।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 20, snippet: 'न जायते म्रियते वा कदाचि न्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे' },
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 22, snippet: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि। तथा शरीराणि विहाय जीर्णा न्यन्यानि संयाति नवानि देही' }
    ],
    conceptId: 'atman',
    reviewStatus: 'approved',
    classicalAttribution: 'कठोपनिषद् एवं माण्डूक्योपनिषद्'
  },

  moksha: {
    id: 'moksha',
    termDevanagari: 'मोक्षः',
    termIast: 'mokṣaḥ',
    rootDhatu: 'मुच् (मुचॢँ मोक्षणे) — to release, liberate, untie, unbind',
    rootMeaning: 'Liberation, release from ignorance and suffering, ultimate spiritual freedom',
    rootMeaningHi: 'बंधन-मुक्ति, अविद्या की समाप्ति, परम स्वतंत्रता',
    grammarCategory: 'पुंल्लिङ्ग संज्ञा, प्रथमा विभक्ति, एकवचन',
    contextualMeaning: 'Freedom from the cycle of compulsive attachment, existential ignorance, and suffering, realizing one’s inherent wholeness.',
    contextualMeaningHi: 'अहंकार, अज्ञान और वासनाओं के बंधनों से आत्यंतिक मुक्ति तथा परमानंद की प्राप्ति।',
    simpleEnglish: 'Spiritual liberation, ultimate freedom.',
    simpleHindi: 'मुक्ति, परम स्वतंत्रता, अज्ञान-विनाश।',
    commonMisunderstandings: [
      {
        myth: 'Moksha is an extraterrestrial geographical place reached only after bodily death.',
        mythHi: 'मोक्ष मरने के बाद किसी दूसरे ग्रह या लोक पर जाना है।',
        correction: 'Advaita and traditional Vedanta affirm Jivanmukti—living in liberation and deep peace right here and now.',
        correctionHi: 'वेदांत जीवनमुक्ति का प्रतिपादन करता है—इसी शरीर और जीवन में अज्ञान से मुक्त होकर शांत भाव से जीना।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 5, verse: 28, snippet: 'यतेन्द्रियमनोबुद्धिर्मुनिर्मोक्षपरायणः। विगतेच्छाभयक्रोधो यः सदा मुक्त एव सः' },
      { scriptureId: 'bhagavadgita', chapter: 18, verse: 66, snippet: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः' }
    ],
    conceptId: 'moksha',
    reviewStatus: 'approved',
    classicalAttribution: 'ब्रह्मसूत्र एवं विवेकचूड़ामणि'
  },

  sthitaprajna: {
    id: 'sthitaprajna',
    termDevanagari: 'स्थितप्रज्ञः',
    termIast: 'sthitaprajñaḥ',
    rootDhatu: 'स्था (स्थिति) + प्र (प्रकर्षेण) + ज्ञा (अवबोधने)',
    rootMeaning: 'One whose wisdom is firm, steady in discernment, unwavering in peace',
    rootMeaningHi: 'स्थिर बुद्धि वाला, समत्व में प्रतिष्ठित पुरुष',
    grammarCategory: 'समास: स्थिता प्रज्ञा यस्य सः (बहुव्रीहि समास)',
    contextualMeaning: 'The ideal sage depicted in Gita Chapter 2, who remains unaffected by praise or censure, joy or grief, resting contented in the Self.',
    contextualMeaningHi: 'वह व्यक्ति जिसकी बुद्धि कामनाओं और उद्वेगों से विचलित नहीं होती और जो सुख-दुःख में समान रहता है।',
    simpleEnglish: 'A person of steady wisdom and unwavering clarity.',
    simpleHindi: 'स्थिर बुद्धि वाला, समचित्त साधक।',
    commonMisunderstandings: [
      {
        myth: 'A Sthitaprajna has turned into an emotionless stone or unfeeling zombie.',
        mythHi: 'स्थितप्रज्ञ का हृदय पत्थर जैसा कठोर या भावहीन हो जाता है।',
        correction: 'A Sthitaprajna experiences immense compassion and universal love, free from reactive anger, anxiety, and greed.',
        correctionHi: 'स्थितप्रज्ञ में विश्व-कल्याण की असीम करुणा होती है, पर वह राग, द्वेष और भय के मानसिक तूफानों से मुक्त होता है।'
      }
    ],
    relatedVerses: [
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 54, snippet: 'अर्जुन उवाच स्थितप्रज्ञस्य का भाषा समाधिस्थस्य केशव। स्थितधीः किं प्रभाषेत किमासीत व्रजेत किम्' },
      { scriptureId: 'bhagavadgita', chapter: 2, verse: 56, snippet: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः। वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते' }
    ],
    conceptId: 'psychology',
    reviewStatus: 'approved',
    classicalAttribution: 'गीता २.५४-७२ शाङ्करभाष्य'
  }
};

/**
 * Normalizes text for matching lexicon entries:
 * strips punctuation, diacritics approximations, case differences.
 */
export function normalizeSanskritQuery(raw: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/[।॥,;.!?()[\]{}'"`\-_]/g, '')
    .trim();
}

/**
 * Searches the reviewed Sanskrit Lexicon for an exact or fuzzy match.
 */
export function findLexiconEntry(query: string): SanskritLexiconEntry | null {
  if (!query) return null;
  const q = normalizeSanskritQuery(query);

  // Exact key match
  if (SANSKRIT_LEXICON[q]) {
    return SANSKRIT_LEXICON[q];
  }

  // Iterate entries
  for (const entry of Object.values(SANSKRIT_LEXICON)) {
    if (entry.id === q) return entry;

    // Partial matches only for words of four letters or more: a short word such as
    // mā ("not") or na would otherwise match inside ātman, jñāna and others.
    const partial = Array.from(q).length >= 4;

    // Check Devanagari normalized
    const devNormalized = normalizeSanskritQuery(entry.termDevanagari);
    if (partial && (devNormalized.includes(q) || q.includes(devNormalized))) return entry;

    // Check IAST
    const iastNormalized = normalizeSanskritQuery(entry.termIast);
    if (partial && (iastNormalized.includes(q) || q.includes(iastNormalized))) return entry;

    // Specific mapping checks for inflected forms
    if (q === 'कर्मणि' || q === 'karmani' || q === 'karmaṇi') {
      if (entry.id === 'karma') return entry;
    }
    if (q === 'अधिकारः' || q === 'adhikara' || q === 'adhikāraḥ' || q === 'adhikaras') {
      if (entry.id === 'adhikara') return entry;
    }
    if (q === 'फलेषु' || q === 'phaleshu' || q === 'phaleṣu' || q === 'phala') {
      if (entry.id === 'phala') return entry;
    }
    if (q === 'अकर्मणि' || q === 'akarmani' || q === 'akarmaṇi' || q === 'akarma') {
      if (entry.id === 'akarma') return entry;
    }
  }

  return null;
}
