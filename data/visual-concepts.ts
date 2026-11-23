/**
 * Sacred Visual Learning Layer Data
 *
 * Implements interactive visual representations for the 10 foundational Vedic concepts:
 * 1. Dharma (धर्म) - Cosmic order, righteousness, svadharma
 * 2. Karma (कर्म) - Cause & effect, sanchita, prarabdha, kriyamana
 * 3. Moksha (मोक्ष) - Transcendent liberation, jivanmukti
 * 4. Atman (आत्मन्) - Witness consciousness, pancha koshas (5 sheaths)
 * 5. Brahman (ब्रह्मन्) - Ultimate reality, Sat-Chit-Ananda
 * 6. Maya (माया) - Cosmic appearance, avarana & vikshepa shaktis
 * 7. Yoga (योग) - Sacred union, 8 limbs of Patanjali, 4 spiritual paths
 * 8. Vedanta (वेदान्त) - Upanishadic wisdom, Prasthanatrayi
 * 9. Bhakti (भक्ति) - Pure divine love, Navadha Bhakti (9-fold devotion)
 * 10. Samsara (संसार) - The cyclic wheel of transmigration and rebirth
 */

export type VisualArchetype =
  | 'mandala-order'
  | 'cyclical-wheel'
  | 'concentric-sheaths'
  | 'infinite-bindu'
  | 'transcendent-portal'
  | 'dual-veil'
  | 'ashtanga-ladder'
  | 'prasthanatrayi-triad'
  | 'navadha-lotus'
  | 'bhavachakra-spokes';

export interface VisualLayerRing {
  id: string;
  nameHi: string;
  nameEn: string;
  descHi: string;
  descEn: string;
  radiusPercent: number; // 20 to 90
  glowColor: string;
}

export interface FlowNode {
  id: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  badge?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  labelHi?: string;
  labelEn?: string;
}

export interface ConceptStage {
  step: number;
  nameHi: string;
  nameEn: string;
  sanskrit: string;
  descHi: string;
  descEn: string;
  scriptureRef?: string;
}

export interface VisualConceptData {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  coreMantra: string;
  coreMantraEn: string;
  scriptureSource: string;
  archetype: VisualArchetype;
  theme: {
    primary: string;
    secondary: string;
    glow: string;
    bgGradient: string;
  };
  binduSymbol: string;
  geometry: {
    titleHi: string;
    titleEn: string;
    interpretationHi: string;
    interpretationEn: string;
    layers: VisualLayerRing[];
  };
  flowchart: {
    titleHi: string;
    titleEn: string;
    descriptionHi: string;
    descriptionEn: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  knowledgeMap: {
    scriptures: { name: string; ref: string }[];
    corePillars: { hi: string; en: string }[];
    practices: { hi: string; en: string }[];
    ultimateFruit: { hi: string; en: string };
  };
  stages: {
    titleHi: string;
    titleEn: string;
    items: ConceptStage[];
  };
}

export const VISUAL_CONCEPTS: Record<string, VisualConceptData> = {
  // ── 1. DHARMA (धर्म) ────────────────────────────────────────────────────────
  dharma: {
    id: 'dharma',
    label: 'Dharma',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    coreMantra: 'धर्मो रक्षति रक्षितः',
    coreMantraEn: 'Dharma protects those who protect it.',
    scriptureSource: 'Mahabharata, Vana Parva 313.128',
    archetype: 'mandala-order',
    theme: {
      primary: '#d97706',
      secondary: '#b45309',
      glow: 'rgba(217, 119, 6, 0.4)',
      bgGradient: 'from-amber-950/40 via-amber-900/20 to-neutral-950',
    },
    binduSymbol: 'ध',
    geometry: {
      titleHi: 'ऋत एवं धर्म का समकालिक मण्डल',
      titleEn: 'Cosmic Order & Harmonious Duty Mandala',
      interpretationHi: 'धर्म ब्रह्माण्ड का वह धारण तत्त्व है जो व्यक्ति, समाज और सम्पूर्ण सृष्टि को व्यवस्था में बांधे रखता है।',
      interpretationEn: 'Dharma is the universal substratum of coherence that sustains the individual, society, and cosmos in harmony.',
      layers: [
        { id: 'l1', nameHi: 'ऋत (Ṛta)', nameEn: 'Cosmic Law', descHi: 'सम्पूर्ण ब्रह्माण्ड का प्राकृतिक एवं नैतिक संतुलन।', descEn: 'The inexorable cosmic order governing sun, seasons, and elements.', radiusPercent: 88, glowColor: '#fbbf24' },
        { id: 'l2', nameHi: 'सामान्य धर्म (Sāmānya)', nameEn: 'Universal Ethics', descHi: 'अहिंसा, सत्य, अस्तेय, शौच और इंद्रिय-निग्रह।', descEn: 'Universal virtues binding on all beings regardless of role.', radiusPercent: 70, glowColor: '#f59e0b' },
        { id: 'l3', nameHi: 'स्वधर्म (Svadharma)', nameEn: 'Individual Calling', descHi: 'व्यक्ति के स्वभाव और कर्तव्य का निष्ठापूर्वक पालन।', descEn: 'One’s innate duty aligned with natural temperament.', radiusPercent: 50, glowColor: '#d97706' },
        { id: 'l4', nameHi: 'परम धर्म (Moksha-Dharma)', nameEn: 'Supreme Liberation', descHi: 'ईश्वरार्पण भाव और आत्म-साक्षात्कार का परम मार्ग।', descEn: 'Total spiritual surrender and conscious realization of the Self.', radiusPercent: 28, glowColor: '#b45309' },
      ],
    },
    flowchart: {
      titleHi: 'धर्म का व्यावहारिक एवं आध्यात्मिक प्रवाह',
      titleEn: 'The Architecture of Dharmic Action',
      descriptionHi: 'स्वभाव से स्वधर्म और कर्तव्य-पालन से अंतःकरण शुद्धि का क्रमिक प्रवाह।',
      descriptionEn: 'The progressive movement from innate nature (Svabhāva) to spiritual liberation.',
      nodes: [
        { id: 'n1', titleHi: 'स्वभाव (Svabhāva)', titleEn: 'Innate Temperament', subtitleHi: 'प्राकृतिक गुण व प्रवृत्तियाँ', subtitleEn: 'Inner constitutional qualities' },
        { id: 'n2', titleHi: 'स्वधर्म (Svadharma)', titleEn: 'Prescribed Duty', subtitleHi: 'कर्तव्यनिष्ठ निष्काम कर्म', subtitleEn: 'Action without outcome attachment' },
        { id: 'n3', titleHi: 'लोकसंग्रह (Lokasaṅgraha)', titleEn: 'Cosmic Welfare', subtitleHi: 'समाज एवं सृष्टि का पोषण', subtitleEn: 'Upholding community harmony' },
        { id: 'n4', titleHi: 'चित्तशुद्धि (Citta-Śuddhi)', titleEn: 'Mental Purification', subtitleHi: 'कामनाओं से मुक्ति', subtitleEn: 'Freedom from selfish craving' },
        { id: 'n5', titleHi: 'मोक्ष (Mokṣa)', titleEn: 'Final Liberation', subtitleHi: 'परम शांति व अमरत्व', subtitleEn: 'Supreme peace and self-realization' },
      ],
      edges: [
        { from: 'n1', to: 'n2', labelHi: 'निर्धारित करता है', labelEn: 'Informs' },
        { from: 'n2', to: 'n3', labelHi: 'पोषण करता है', labelEn: 'Sustains' },
        { from: 'n3', to: 'n4', labelHi: 'शुद्ध करता है', labelEn: 'Purifies' },
        { from: 'n4', to: 'n5', labelHi: 'मार्ग खोलता है', labelEn: 'Leads to' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'श्रीमद्भगवद्गीता', ref: '3.35 — श्रेयान्स्वधर्मो विगुणः' },
        { name: 'महाभारत (शान्तिपर्व)', ref: '109.10 — धारणाद्धर्म इत्याहुः' },
        { name: 'मनुस्मृति', ref: '6.92 — धृतिः क्षमा दमोऽस्तेयं' },
      ],
      corePillars: [
        { hi: 'धृति (धैर्य एवं स्थिरता)', en: 'Steadfast Patience' },
        { hi: 'सत्य (यथार्थ वाणी व कर्म)', en: 'Truthfulness' },
        { hi: 'अहिंसा (सर्वभूतहित)', en: 'Non-harming Compassion' },
        { hi: 'अस्तेय (अलोभ व निष्कलुषता)', en: 'Non-stealing & Non-greed' },
      ],
      practices: [
        { hi: 'निष्काम कर्म का नित्य अभ्यास', en: 'Selfless performance of duty' },
        { hi: 'पंच महायज्ञ (सृष्टि-ऋण शोधन)', en: 'Five sacred daily duties' },
        { hi: 'विवेक द्वारा उचित-अनुचित निर्णय', en: 'Discerning justice through Viveka' },
      ],
      ultimateFruit: {
        hi: 'चित्त की निर्मलता एवं आत्यंतिक शांति',
        en: 'Unshakable peace and liberation from inner discord',
      },
    },
    stages: {
      titleHi: 'धर्म के चार मुख्य रूप',
      titleEn: 'Four Dimensions of Dharma',
      items: [
        { step: 1, nameHi: 'सामान्य धर्म', nameEn: 'Universal Ethics', sanskrit: 'सत्य, अहिंसा, दया, क्षमा', descHi: 'मानव मात्र के लिए अनिवार्य सार्वभौमिक नैतिक मूल्य।', descEn: 'Foundational universal ethical precepts binding on every human.' },
        { step: 2, nameHi: 'वर्ण-आश्रम धर्म', nameEn: 'Role & Life-Stage Duty', sanskrit: 'अवस्था एवं उत्तरदायित्व', descHi: 'विद्यार्थी, गृहस्थ, वानप्रस्थ और संन्यास की समयानुसार जिम्मेदारियाँ।', descEn: 'Duties proportional to one’s stage of life (Student, Parent, Renunciant).' },
        { step: 3, nameHi: 'आपद्धर्म', nameEn: 'Emergency Adaptation', sanskrit: 'संकटकालीन विवेक', descHi: 'असाधारण संकट की स्थिति में जीवन-रक्षा हेतु तात्कालिक छूट।', descEn: 'Dharmic exceptions applied during crises to preserve life and fundamental truth.' },
        { step: 4, nameHi: 'परम धर्म (मोक्ष)', nameEn: 'Supreme Transcendence', sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', descHi: 'सभी अहंकार-युक्त कर्तव्यों से ऊपर उठकर परमात्मा में समर्पित होना।', descEn: 'Transcending all egoic ritual in total surrender to the Supreme Truth.' },
      ],
    },
  },

  // ── 2. KARMA (कर्म) ─────────────────────────────────────────────────────────
  karma: {
    id: 'karma',
    label: 'Karma',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    coreMantra: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    coreMantraEn: 'Your right is to action alone, never to the fruits thereof.',
    scriptureSource: 'Bhagavad Gita 2.47',
    archetype: 'cyclical-wheel',
    theme: {
      primary: '#ea580c',
      secondary: '#c2410c',
      glow: 'rgba(234, 88, 12, 0.4)',
      bgGradient: 'from-orange-950/40 via-orange-900/20 to-neutral-950',
    },
    binduSymbol: 'कृ',
    geometry: {
      titleHi: 'कर्म-चक्र एवं संस्कार मण्डल',
      titleEn: 'The Wheel of Causality and Latent Impressions',
      interpretationHi: 'प्रत्येक विचार और क्रिया चित्त में संस्कार छोड़ती है, जो वासना बनकर पुनः नए कर्म को जन्म देती है।',
      interpretationEn: 'Every deed and intention plants seeds (Saṁskāras) in the subconscious, fueling desires and future action.',
      layers: [
        { id: 'k1', nameHi: 'क्रियमाण कर्म (Kriyamāṇa)', nameEn: 'Present Action', descHi: 'वर्तमान क्षण में लिया जा रहा निर्णय और कार्य।', descEn: 'Seeds being planted in the soil of this present moment.', radiusPercent: 88, glowColor: '#f97316' },
        { id: 'k2', nameHi: 'प्रारब्ध कर्म (Prārabdha)', nameEn: 'Unfolding Destiny', descHi: 'वे संचित कर्म जो वर्तमान जीवन में फल देने के लिए पक चुके हैं।', descEn: 'Past actions that have begun bearing fruit in this current embodiment.', radiusPercent: 68, glowColor: '#ea580c' },
        { id: 'k3', nameHi: 'संचित कर्म (Sañcita)', nameEn: 'Accumulated Reservoir', descHi: 'अनेकानेक जन्मों का एकत्रित अव्यक्त कर्म-संग्रह।', descEn: 'The vast cosmic storehouse of past actions awaiting future ripening.', radiusPercent: 48, glowColor: '#c2410c' },
        { id: 'k4', nameHi: 'अकर्म / नैष्कर्म्य (Naiṣkarmya)', nameEn: 'Action in Inaction', descHi: 'ज्ञान की अग्नि में कर्मफल की आसक्ति का भस्म होना।', descEn: 'The transcendence of karma through selfless wisdom and detachment.', radiusPercent: 26, glowColor: '#9a3412' },
      ],
    },
    flowchart: {
      titleHi: 'कर्म-संस्कार-पुनर्जन्म की श्रृंखला',
      titleEn: 'The Causal Chain of Karma and Samskara',
      descriptionHi: 'संकल्प से कर्म, कर्म से संस्कार और संस्कार से भविष्य का निर्माण।',
      descriptionEn: 'How intentions manifest as actions, etch subconscious grooves, and generate future states.',
      nodes: [
        { id: 'kn1', titleHi: 'संकल्प / विचार (Saṅkalpa)', titleEn: 'Intention & Thought', subtitleHi: 'मन में उठने वाली इच्छा', subtitleEn: 'Subtle mental motive' },
        { id: 'kn2', titleHi: 'कर्म (Karma)', titleEn: 'Deed & Expression', subtitleHi: 'काया, वाचा व मनसा क्रिया', subtitleEn: 'Physical, verbal, or mental act' },
        { id: 'kn3', titleHi: 'संस्कार (Saṁskāra)', titleEn: 'Subconscious Imprint', subtitleHi: 'चित्त में जमी हुई छाप', subtitleEn: 'Deep latent psychological groove' },
        { id: 'kn4', titleHi: 'कर्मफल (Phala)', titleEn: 'Ripening Consequence', subtitleHi: 'अनुकूल या प्रतिकूल फल', subtitleEn: 'Moral and existential harvest' },
        { id: 'kn5', titleHi: 'ज्ञानाग्नि (Jñānāgni)', titleEn: 'Fire of Knowledge', subtitleHi: 'कर्म-बंधन का विसर्जन', subtitleEn: 'Burning of residual karma' },
      ],
      edges: [
        { from: 'kn1', to: 'kn2', labelHi: 'जन्म देता है', labelEn: 'Drives' },
        { from: 'kn2', to: 'kn3', labelHi: 'अंकित करता है', labelEn: 'Etches' },
        { from: 'kn3', to: 'kn4', labelHi: 'परिपक्व होता है', labelEn: 'Ripens into' },
        { from: 'kn4', to: 'kn1', labelHi: 'चक्र चलाता है', labelEn: 'Cycles to' },
        { from: 'kn5', to: 'kn3', labelHi: 'भस्म करता है', labelEn: 'Burns away' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'श्रीमद्भगवद्गीता', ref: '4.37 — ज्ञानाग्निः सर्वकर्माणि भस्मसात्कुरुते' },
        { name: 'बृहदारण्यक उपनिषद्', ref: '4.4.5 — यथाकारी यथाचारी तथा भवति' },
        { name: 'पतंजलि योगसूत्र', ref: '2.12 — क्लेशमूलः कर्माशयो दृष्टादृष्टजन्मवेदनीयः' },
      ],
      corePillars: [
        { hi: 'संचित (पूर्व जन्मों का संचित बीज)', en: 'Sanchita: Stored Potential' },
        { hi: 'प्रारब्ध (वर्तमान में भोग्य प्रारब्ध)', en: 'Prarabdha: Kinetic Destiny' },
        { hi: 'क्रियमाण (वर्तमान में स्वतंत्र चयन)', en: 'Kriyamana: Current Free Will' },
        { hi: 'आगामी (भविष्य का परिणाम)', en: 'Agami: Future Repercussion' },
      ],
      practices: [
        { hi: 'निष्काम कर्म — फल की चिंता से मुक्ति', en: 'Detachment from outcome anxiety' },
        { hi: 'ईश्वरार्पण बुद्धि — कर्म का समर्पण', en: 'Consecration of deeds to the Divine' },
        { hi: 'साक्षीभाव — अकर्तापन का अनुसंधान', en: 'Witness awareness of the non-doer Self' },
      ],
      ultimateFruit: {
        hi: 'नैष्कर्म्य सिद्धि — कर्म करते हुए भी बंधन से सर्वथा मुक्ति',
        en: 'Naiskarmya: Supreme freedom where action binds no more',
      },
    },
    stages: {
      titleHi: 'कर्म के तीन प्रमुख आयाम',
      titleEn: 'Three Dimensions of Karma',
      items: [
        { step: 1, nameHi: 'संचित कर्म (Sañcita)', nameEn: 'Accumulated Archive', sanskrit: 'कोटि-कोटि जन्मों का संग्रह', descHi: 'वह विशाल कर्म-भण्डार जो अभी तक सुप्त अवस्था में संचित है।', descEn: 'The dormant repository of all past actions awaiting suitable conditions.' },
        { step: 2, nameHi: 'प्रारब्ध कर्म (Prārabdha)', nameEn: 'Currently Unfolding', sanskrit: 'धनुष से छूटा हुआ तीर', descHi: 'वर्तमान शरीर और जीवन-परिस्थितियों के रूप में फल दे रहा कर्म।', descEn: 'Past action like an arrow released from the bow; must be lived out with grace.' },
        { step: 3, nameHi: 'क्रियमाण कर्म (Kriyamāṇa)', nameEn: 'Current Free Will', sanskrit: 'हाथ में पकड़ा हुआ तीर', descHi: 'वर्तमान में अपनी स्वतंत्र इच्छा (पुरुषार्थ) से किया जा रहा नया कर्म।', descEn: 'Action created in this present instant, which determines future trajectories.' },
      ],
    },
  },

  // ── 3. MOKSHA (मोक्ष) ────────────────────────────────────────────────────────
  moksha: {
    id: 'moksha',
    label: 'Moksha',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    coreMantra: 'तरति शोकमात्मवित्',
    coreMantraEn: 'The knower of the Self crosses beyond all sorrow.',
    scriptureSource: 'Chandogya Upanishad 7.1.3',
    archetype: 'transcendent-portal',
    theme: {
      primary: '#ca8a04',
      secondary: '#a16207',
      glow: 'rgba(202, 138, 4, 0.45)',
      bgGradient: 'from-yellow-950/40 via-amber-900/20 to-neutral-950',
    },
    binduSymbol: 'मु',
    geometry: {
      titleHi: 'कैवल्य एवं मुक्ति का ज्योतिर्मण्डल',
      titleEn: 'The Golden Portal of Liberation',
      interpretationHi: 'मोक्ष कोई स्थान नहीं, अपितु अज्ञान के आवरण का हटना और अपनी नित्य मुक्त सत्ता का साक्षात्कार है।',
      interpretationEn: 'Moksha is not a geographical realm, but the dispelling of ignorance and awakening to eternal freedom.',
      layers: [
        { id: 'm1', nameHi: 'सांसारिक बंधन (Bandha)', nameEn: 'Worldly Entanglement', descHi: 'शरीर, मन और अहंकार से तादात्म्य का भ्रम।', descEn: 'False identification with the transient body-mind vehicle.', radiusPercent: 86, glowColor: '#ca8a04' },
        { id: 'm2', nameHi: 'विवेक व वैराग्य (Viveka)', nameEn: 'Discernment & Dispassion', descHi: 'नित्य और अनित्य का स्पष्ट अलगाव।', descEn: 'Sharp discrimination between the Eternal and the Transient.', radiusPercent: 66, glowColor: '#eab308' },
        { id: 'm3', nameHi: 'जीवनमुक्ति (Jīvanmukti)', nameEn: 'Liberation in This Life', descHi: 'शरीर में रहते हुए भी सम्पूर्ण अनासक्ति और परमानंद।', descEn: 'Living freely in the body untouched by praise, blame, joy, or sorrow.', radiusPercent: 46, glowColor: '#facc15' },
        { id: 'm4', nameHi: 'विदेहमुक्ति / कैवल्य (Videha)', nameEn: 'Disembodied Absolute', descHi: 'ब्रह्म में पूर्ण एकत्व, पुनर्जन्म का आत्यंतिक अभाव।', descEn: 'Total unconditioned absorption into Brahman with no rebirth.', radiusPercent: 24, glowColor: '#fef08a' },
      ],
    },
    flowchart: {
      titleHi: 'साधक से मुक्त पुरुष की यात्रा',
      titleEn: 'Ascent from Seeker to the Liberated',
      descriptionHi: 'जिज्ञासा से श्रवण, मनन, निदिध्यासन और मोक्ष का साक्षात्कार।',
      descriptionEn: 'The traditional Vedantic pathway of listening, reflecting, meditating, and realization.',
      nodes: [
        { id: 'mn1', titleHi: 'मुमुक्षुत्व (Mumukṣutva)', titleEn: 'Intense Yearning', subtitleHi: 'मुक्ति की तीव्र अभीप्सा', subtitleEn: 'Burning aspiration for truth' },
        { id: 'mn2', titleHi: 'श्रवण (Śravaṇa)', titleEn: 'Sacred Listening', subtitleHi: 'गुरु व उपनिषदों का श्रवण', subtitleEn: 'Hearing the Great Truths' },
        { id: 'mn3', titleHi: 'मनन (Manana)', titleEn: 'Rational Reflection', subtitleHi: 'तर्क द्वारा संशयों का निवारण', subtitleEn: 'Resolving doubts through reason' },
        { id: 'mn4', titleHi: 'निदिध्यासन (Nididhyāsana)', titleEn: 'Deep Contemplation', subtitleHi: 'अखंड आत्म-अनुसंधान', subtitleEn: 'Unbroken meditative assimilation' },
        { id: 'mn5', titleHi: 'अपरोक्षानुभूति (Sākṣātkāra)', titleEn: 'Direct Realization', subtitleHi: 'अहं ब्रह्मास्मि का साक्षात बोध', subtitleEn: 'Immediate experiential awakening' },
      ],
      edges: [
        { from: 'mn1', to: 'mn2', labelHi: 'मार्गदर्शन लेता है', labelEn: 'Seeks wisdom' },
        { from: 'mn2', to: 'mn3', labelHi: 'विचार करता है', labelEn: 'Clarifies' },
        { from: 'mn3', to: 'mn4', labelHi: 'ध्यानस्थ होता है', labelEn: 'Meditates on' },
        { from: 'mn4', to: 'mn5', labelHi: 'प्रकाशित होता है', labelEn: 'Awakens into' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'मांडूक्य उपनिषद्', ref: '7 — शांतं शिवमद्वैतं चतुर्थं मन्यन्ते' },
        { name: 'श्रीमद्भगवद्गीता', ref: '5.24 — योऽन्तःसुखोऽन्तरारामः' },
        { name: 'विवेकचूड़ामणि', ref: 'श्लोक 2 — दुर्लभं त्रयमेवैतद्देवानुग्रहहेतुकम्' },
      ],
      corePillars: [
        { hi: 'जीवनमुक्ति (जीते जी आत्म-साक्षात्कार)', en: 'Jivanmukti: Living Freedom' },
        { hi: 'विदेहमुक्ति (प्रारब्ध समाप्ति पर विलीनता)', en: 'Videhamukti: Final Transcendence' },
        { hi: 'कैवल्य (प्रकृति से आत्मा की विशुद्ध पृथकता)', en: 'Kaivalya: Aloneness of Consciousness' },
        { hi: 'आनंद (सर्व दुःखों से आत्यंतिक निवृत्ति)', en: 'Ananda: Unconditioned Bliss' },
      ],
      practices: [
        { hi: 'साधन चतुष्टय का निरंतर अभ्यास', en: 'Cultivating the four spiritual qualifications' },
        { hi: 'महावाक्य ध्यान (« अहं ब्रह्मास्मि »)', en: 'Contemplation on the Mahavakyas' },
        { hi: 'वासना क्षय एवं मनोनाश', en: 'Dissolution of latent cravings and ego-mind' },
      ],
      ultimateFruit: {
        hi: 'संसार-चक्र का अंत और नित्य सच्चिदानंद स्वरूप की प्राप्ति',
        en: 'End of rebirth, unveiling of timeless Sat-Chit-Ananda',
      },
    },
    stages: {
      titleHi: 'मुक्ति के चार सोपान',
      titleEn: 'Four Progressive Stages of Liberation',
      items: [
        { step: 1, nameHi: 'सालोक्य (Sālokya)', nameEn: 'Dwelling in the Divine Realm', sanskrit: 'ईश्वर के धाम की प्राप्ति', descHi: 'परमात्मा के पवित्र धाम में वास करने का अनुभव।', descEn: 'Residing consciously in the divine cosmic presence.' },
        { step: 2, nameHi: 'सामीप्य (Sāmīpya)', nameEn: 'Proximity to Divine Consciousness', sanskrit: 'ईश्वर की निरंतर समीपता', descHi: 'परमात्मा के सामीप्य में प्रेम और विस्मय का अनुभव।', descEn: 'Feeling intimate closeness to the living supreme essence.' },
        { step: 3, nameHi: 'सारूप्य (Sārūpya)', nameEn: 'Assimilation of Divine Nature', sanskrit: 'ईश्वरीय स्वरूप का प्रकटीकरण', descHi: 'परमात्मा के गुणों और चेतना का साधक में अवतरण।', descEn: 'Reflecting the luminous sacred qualities of the Divine.' },
        { step: 4, nameHi: 'सायुज्य (Sāyujya)', nameEn: 'Complete Non-Dual Union', sanskrit: 'नदी का समुद्र में पूर्ण विलय', descHi: 'द्वैत का पूर्ण लोप, आत्मा और ब्रह्म का अविभाज्य एकत्व।', descEn: 'Dissolution of all separation, merging as pure non-dual consciousness.' },
      ],
    },
  },

  // ── 4. ATMAN (आत्मन्) ────────────────────────────────────────────────────────
  atman: {
    id: 'atman',
    label: 'Atman',
    sanskrit: 'आत्मन्',
    transliteration: 'ātman',
    coreMantra: 'अयमात्मा ब्रह्म',
    coreMantraEn: 'This Self is Brahman.',
    scriptureSource: 'Mandukya Upanishad 2',
    archetype: 'concentric-sheaths',
    theme: {
      primary: '#6366f1',
      secondary: '#4338ca',
      glow: 'rgba(99, 102, 241, 0.45)',
      bgGradient: 'from-indigo-950/40 via-indigo-900/20 to-neutral-950',
    },
    binduSymbol: 'आ',
    geometry: {
      titleHi: 'पंचकोश एवं अंतरात्मा मण्डल',
      titleEn: 'The Five Sheaths (Pañcakośa) & Pure Witness',
      interpretationHi: 'आत्मा शरीर, प्राण, मन, बुद्धि और आनंद के पाँचों आवरणों से परे नित्य साक्षी चेतना है।',
      interpretationEn: 'The Atman is the immortal, untainted witness shining beyond the physical, vital, mental, intellectual, and causal sheaths.',
      layers: [
        { id: 'a1', nameHi: 'अन्नमय कोश (Annamaya)', nameEn: 'Physical Sheath', descHi: 'स्थूल शरीर, जो अन्न से पोषित और नश्वर है।', descEn: 'The gross physical vessel composed of food and elements.', radiusPercent: 88, glowColor: '#94a3b8' },
        { id: 'a2', nameHi: 'प्राणमय कोश (Prāṇamaya)', nameEn: 'Vital Energy Sheath', descHi: 'श्वास-प्रश्वास और जीवन-शक्ति का आवरण।', descEn: 'The subtle energetic body pulsing through breath and prana.', radiusPercent: 72, glowColor: '#38bdf8' },
        { id: 'a3', nameHi: 'मनोमय कोश (Manomaya)', nameEn: 'Mental Sheath', descHi: 'विचार, भावनाएँ, राग-द्वेष और संकल्प-विकल्प।', descEn: 'The emotional-mind sheath oscillating in thoughts and desires.', radiusPercent: 56, glowColor: '#818cf8' },
        { id: 'a4', nameHi: 'विज्ञानमय कोश (Vijñānamaya)', nameEn: 'Intellectual Sheath', descHi: 'विवेक, निर्णय और अहंकार की सूक्ष्म ग्रंथि।', descEn: 'The discerning intellect and the subtle ego-sense (Ahamkāra).', radiusPercent: 40, glowColor: '#6366f1' },
        { id: 'a5', nameHi: 'आनंदमय कोश (Ānandamaya)', nameEn: 'Causal Bliss Sheath', descHi: 'गाढ़ निद्रा का आनंद, मूल अज्ञान का आवरण।', descEn: 'The innermost veil of causal bliss experienced in dreamless sleep.', radiusPercent: 26, glowColor: '#c084fc' },
      ],
    },
    flowchart: {
      titleHi: 'नेति-नेति द्वारा साक्षी-अनुसंधान',
      titleEn: 'Neti-Neti: The Inward Ascent to the Witness',
      descriptionHi: 'जो दृश्य है, वह मैं नहीं — देह से साक्षी तक का सूक्ष्म विवेक।',
      descriptionEn: 'The classic Upanishadic method of self-inquiry: dissecting the known object from the knowing Subject.',
      nodes: [
        { id: 'an1', titleHi: 'स्थूल देह (Gross Body)', titleEn: 'Physical Form', subtitleHi: 'नेति — यह मैं नहीं, मेरा वस्त्र है', subtitleEn: 'Not this — this is perishable' },
        { id: 'an2', titleHi: 'प्राण व इंद्रियाँ (Prāṇa)', titleEn: 'Life-Force & Senses', subtitleHi: 'नेति — इसे भी मैं जानता हूँ', subtitleEn: 'Not this — perceived by mind' },
        { id: 'an3', titleHi: 'मन व बुद्धि (Mind & Intellect)', titleEn: 'Thoughts & Concepts', subtitleHi: 'नेति — ये विचार उत्पन्न व नष्ट होते हैं', subtitleEn: 'Not this — objects of awareness' },
        { id: 'an4', titleHi: 'अहंकार (Ego)', titleEn: 'I-Sense', subtitleHi: 'नेति — यह भी चेतना का प्रतिबिम्ब है', subtitleEn: 'Not this — reflected consciousness' },
        { id: 'an5', titleHi: 'साक्षी आत्मन् (Sākṣī)', titleEn: 'Pure Witness Self', subtitleHi: 'स्वयं-प्रकाश, अजर, अमर चेतना', subtitleEn: 'Self-luminous, unborn, eternal awareness' },
      ],
      edges: [
        { from: 'an1', to: 'an2', labelHi: 'सूक्ष्मतर', labelEn: 'Subtler' },
        { from: 'an2', to: 'an3', labelHi: 'सूक्ष्मतर', labelEn: 'Subtler' },
        { from: 'an3', to: 'an4', labelHi: 'सूक्ष्मतर', labelEn: 'Subtler' },
        { from: 'an4', to: 'an5', labelHi: 'साक्षात्कार', labelEn: 'Direct Witness' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'तैत्तिरीय उपनिषद्', ref: '2.1-5 — पंचकोश विवेक' },
        { name: 'कठ उपनिषद्', ref: '1.2.18 — न जायते म्रियते वा विपश्चित्' },
        { name: 'श्रीमद्भगवद्गीता', ref: '2.20 — नैनं छिन्दन्ति शस्त्राणि' },
      ],
      corePillars: [
        { hi: 'नित्य (त्रिकाल-अबाधित सत्य)', en: 'Eternal, untouched by time' },
        { hi: 'शुद्ध (पाप-पुण्य से निर्लेप)', en: 'Stainless, untouched by sin or merit' },
        { hi: 'बुद्ध (स्वयं-प्रकाश ज्ञान स्वरूप)', en: 'Self-luminous Consciousness' },
        { hi: 'मुक्त (जन्म-मरण से परे)', en: 'Ever-free beyond birth and death' },
      ],
      practices: [
        { hi: '« कोऽहम् » (मैं कौन हूँ?) का निरंतर अनुसंधान', en: 'Self-inquiry: "Who am I?"' },
        { hi: 'साक्षी ध्यान — विचारों को बिना जुड़े देखना', en: 'Sakshi Dhyana: non-reactive awareness' },
        { hi: 'पंचकोश विवेक द्वारा तादात्म्य-मुक्ति', en: 'Pancha Kosha Viveka meditation' },
      ],
      ultimateFruit: {
        hi: 'भय, मृत्यु और शोक से आत्यंतिक मुक्ति',
        en: 'Immunity to fear, grief, and the illusion of death',
      },
    },
    stages: {
      titleHi: 'चेतना की चार अवस्थाएँ (मांडूक्य उपनिषद्)',
      titleEn: 'Four States of Consciousness (Māṇḍūkya)',
      items: [
        { step: 1, nameHi: 'जाग्रत् (Jāgrat)', nameEn: 'Waking State', sanskrit: 'वैश्वानर (स्थूल भोगी)', descHi: 'इंद्रियों द्वारा बाह्य स्थूल जगत का अनुभव।', descEn: 'Awareness turned outward, perceiving the physical universe.' },
        { step: 2, nameHi: 'स्वप्न (Svapna)', nameEn: 'Dream State', sanskrit: 'तैजस (सूक्ष्म भोगी)', descHi: 'मन के संस्कारों द्वारा आंतरिक सूक्ष्म जगत का अनुभव।', descEn: 'Awareness turned inward, experiencing subconscious projections.' },
        { step: 3, nameHi: 'सुषुप्ति (Suṣupti)', nameEn: 'Deep Dreamless Sleep', sanskrit: 'प्राज्ञ (आनंद भोगी)', descHi: 'इच्छाओं व विचारों का विलय, केवल अव्यक्त शांति।', descEn: 'Consciousness resting undivided in blissful causal stillness.' },
        { step: 4, nameHi: 'तुरीय (Turīya)', nameEn: 'The Fourth / Transcendental', sanskrit: 'शांतं शिवमद्वैतं चतुर्थं मन्यन्ते', descHi: 'तीनों अवस्थाओं का आधार, शुद्ध अद्वैत साक्षी चैतन्य।', descEn: 'The underlying non-dual substratum of all existence.' },
      ],
    },
  },

  // ── 5. BRAHMAN (ब्रह्मन्) ───────────────────────────────────────────────────
  brahman: {
    id: 'brahman',
    label: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    transliteration: 'brahman',
    coreMantra: 'सर्वं खल्विदं ब्रह्म',
    coreMantraEn: 'All this universe is verily Brahman.',
    scriptureSource: 'Chandogya Upanishad 3.14.1',
    archetype: 'infinite-bindu',
    theme: {
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      glow: 'rgba(139, 92, 246, 0.45)',
      bgGradient: 'from-purple-950/40 via-purple-900/20 to-neutral-950',
    },
    binduSymbol: 'ॐ',
    geometry: {
      titleHi: 'अनंत सच्चिदानंद का परा-मण्डल',
      titleEn: 'The Infinite Mandala of Sat-Chit-Ananda',
      interpretationHi: 'ब्रह्मन् परम सत्य है — नाम, रूप, देश और काल से परे वह असीम आधार जिससे सम्पूर्ण सृष्टि उद्भूत होती है।',
      interpretationEn: 'Brahman is the non-dual absolute ground: unborn, infinite, and indivisible Existence-Consciousness-Bliss.',
      layers: [
        { id: 'b1', nameHi: 'सत् (Sat)', nameEn: 'Absolute Existence', descHi: 'जो कभी नष्ट नहीं होता, सर्वदा विद्यमान सत्य।', descEn: 'Unchanging Reality that never ceases to be in past, present, or future.', radiusPercent: 88, glowColor: '#a78bfa' },
        { id: 'b2', nameHi: 'चित् (Cit)', nameEn: 'Pure Consciousness', descHi: 'वह ज्ञान-ज्योति जिससे सब कुछ प्रकाशित होता है।', descEn: 'Self-shining Awareness that illuminates all perceptions and minds.', radiusPercent: 68, glowColor: '#8b5cf6' },
        { id: 'b3', nameHi: 'आनंद (Ānanda)', nameEn: 'Unconditioned Bliss', descHi: 'किसी विषय पर निर्भर न रहने वाला पूर्ण सुख।', descEn: 'Fullness and infinite peace independent of any external object.', radiusPercent: 48, glowColor: '#7c3aed' },
        { id: 'b4', nameHi: 'निर्गुण ब्रह्म (Nirguṇa)', nameEn: 'Attribute-less Ground', descHi: 'गुणों, उपाधियों और सीमाओं से सर्वथा परे।', descEn: 'The transcendent non-dual source beyond all conceptual forms.', radiusPercent: 24, glowColor: '#ddd6fe' },
      ],
    },
    flowchart: {
      titleHi: 'ब्रह्मन् से नाम-रूप जगत का प्रकटीकरण',
      titleEn: 'Cosmic Manifestation from the Non-Dual Ground',
      descriptionHi: 'अद्वैत ब्रह्म से माया द्वारा सृष्टि का विवर्त (आभास)।',
      descriptionEn: 'The apparent projection (Vivarta) of multiplicity through the creative power of Maya.',
      nodes: [
        { id: 'bn1', titleHi: 'निर्गुण ब्रह्म (Nirguṇa Brahman)', titleEn: 'Unconditioned Reality', subtitleHi: 'निराकार, निर्विकार, अनंत', subtitleEn: 'Transcendent pure awareness' },
        { id: 'bn2', titleHi: 'सगुण ब्रह्म / ईश्वर (Sagūṇa)', titleEn: 'Cosmic Creator', subtitleHi: 'माया-विशिष्ट चेतन सत्ता', subtitleEn: 'Consciousness with cosmic power' },
        { id: 'bn3', titleHi: 'सूक्ष्म सृष्टि (Hiranyagarbha)', titleEn: 'Cosmic Mind', subtitleHi: 'प्राण, मन व तन्मात्राएँ', subtitleEn: 'Subtle forces and archetypes' },
        { id: 'bn4', titleHi: 'स्थूल ब्रह्माण्ड (Virāṭ)', titleEn: 'Physical Cosmos', subtitleHi: 'ग्रह, नक्षत्र, जीव व पंचमहाभूत', subtitleEn: 'Visible material universe' },
        { id: 'bn5', titleHi: 'पुनरावृत्ति / प्रलय (Laya)', titleEn: 'Cosmic Reabsorption', subtitleHi: 'सर्वं खल्विदं ब्रह्म में विलय', subtitleEn: 'Resolution back into the One' },
      ],
      edges: [
        { from: 'bn1', to: 'bn2', labelHi: 'माया-उपाधि', labelEn: 'Reflected in Maya' },
        { from: 'bn2', to: 'bn3', labelHi: 'संकल्प करता है', labelEn: 'Wills creation' },
        { from: 'bn3', to: 'bn4', labelHi: 'स्थूल रूप लेता है', labelEn: 'Densifies into' },
        { from: 'bn4', to: 'bn5', labelHi: 'चक्र पूरा होता है', labelEn: 'Resolves into' },
        { from: 'bn5', to: 'bn1', labelHi: 'नित्य आधार', labelEn: 'Eternal ground' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'तैत्तिरीय उपनिषद्', ref: '2.1 — सत्यं ज्ञानमनन्तं ब्रह्म' },
        { name: 'छांदोग्य उपनिषद्', ref: '6.8.7 — तत्त्वमसि श्वेतकेतो' },
        { name: 'ब्रह्म सूत्र', ref: '1.1.2 — जन्माद्यस्य यतः' },
      ],
      corePillars: [
        { hi: 'सत्-चित्-आनंद (अस्तित्व-चेतना-आनंद)', en: 'Sat-Chit-Ananda: Triune Essence' },
        { hi: 'निर्गुण (उपाधियों और गुणों से शून्य)', en: 'Nirguna: Transcending Attributes' },
        { hi: 'सगुण / ईश्वर (सृष्टि का संचालक)', en: 'Saguna: Personal Divine Expression' },
        { hi: 'सर्वव्यापक (अणु से विराट तक व्याप्त)', en: 'Sarvavyapi: Omnipresent Substratum' },
      ],
      practices: [
        { hi: '« सर्वं खल्विदं ब्रह्म » भाव में सृष्टि दर्शन', en: 'Perceiving all beings as divine manifestations' },
        { hi: 'प्रणव (ॐ) का सतत ओंकार जप व ध्यान', en: 'Meditative contemplation on Om' },
        { hi: 'द्वैत भ्रम का लोप — अभेद दर्शन', en: 'Dissolving false borders between Self and Other' },
      ],
      ultimateFruit: {
        hi: 'अद्वैत बोध — सम्पूर्ण अस्तित्व के साथ अखंड एकत्व',
        en: 'Non-dual realization: unbroken oneness with the infinite cosmos',
      },
    },
    stages: {
      titleHi: 'ब्रह्मन् के साक्षात्कार के सोपान',
      titleEn: 'Four Classical Vedantic Mahavakyas',
      items: [
        { step: 1, nameHi: 'प्रज्ञानं ब्रह्म (ऋग्वेद)', nameEn: 'Consciousness is Brahman', sanskrit: 'ऐतरेयोपनिषद् 3.1.4', descHi: 'लक्षण वाक्य — चेतना ही सम्पूर्ण अस्तित्व का मूल तत्त्व है।', descEn: 'The Definitive Statement: Pure consciousness is the foundation of all.' },
        { step: 2, nameHi: 'तत्त्वमसि (सामवेद)', nameEn: 'That Thou Art', sanskrit: 'छांदोग्योपनिषद् 6.8.7', descHi: 'उपदेश वाक्य — गुरु द्वारा शिष्य को अपनी वास्तविक सत्ता का बोध।', descEn: 'The Instructional Statement: Your deepest essence is identical with That.' },
        { step: 3, nameHi: 'अयमात्मा ब्रह्म (अथर्ववेद)', nameEn: 'This Self is Brahman', sanskrit: 'मांडूक्योपनिषद् 2', descHi: 'अनुभव वाक्य — आंतरिक साक्षी और विराट सत्ता का एकत्व।', descEn: 'The Experiential Statement: This innermost witness is none other than the Absolute.' },
        { step: 4, nameHi: 'अहं ब्रह्मास्मि (यजुर्वेद)', nameEn: 'I am Brahman', sanskrit: 'बृहदारण्यकोपनिषद् 1.4.10', descHi: 'साक्षात्कार वाक्य — मुक्त पुरुष का अखंड परमानंद उद्घोष।', descEn: 'The Realization Statement: The fearless declaration of total non-dual freedom.' },
      ],
    },
  },

  // ── 6. MAYA (माया) ──────────────────────────────────────────────────────────
  maya: {
    id: 'maya',
    label: 'Maya',
    sanskrit: 'माया',
    transliteration: 'māyā',
    coreMantra: 'देवी ह्येषा गुणमयी मम माया दुरत्यया',
    coreMantraEn: 'This divine illusion of Mine, composed of the three gunas, is hard to overcome.',
    scriptureSource: 'Bhagavad Gita 7.14',
    archetype: 'dual-veil',
    theme: {
      primary: '#0284c7',
      secondary: '#0369a1',
      glow: 'rgba(2, 132, 199, 0.45)',
      bgGradient: 'from-sky-950/40 via-sky-900/20 to-neutral-950',
    },
    binduSymbol: 'मा',
    geometry: {
      titleHi: 'आवरण एवं विक्षेप का द्विविध चक्र',
      titleEn: 'The Dual Powers of Cosmic Illusion',
      interpretationHi: 'माया सत्य को छिपाती है (आवरण) और जो नहीं है उसे दर्शाती है (विक्षेप)—जैसे रस्सी में सर्प का भ्रम।',
      interpretationEn: 'Maya veils the real (Avarana) and projects the unreal (Vikshepa)—like mistaking a rope for a serpent in dim light.',
      layers: [
        { id: 'my1', nameHi: 'विक्षेप शक्ति (Vikṣepa)', nameEn: 'Projecting Power', descHi: 'अनेकत्व, नाम और रूप की विविधता का सृजन।', descEn: 'The power that superimposes multiplicity, names, and forms.' , radiusPercent: 88, glowColor: '#38bdf8' },
        { id: 'my2', nameHi: 'आवरण शक्ति (Āvaraṇa)', nameEn: 'Veiling Power', descHi: 'ब्रह्म के वास्तविक एकत्व को छिपाने वाला पर्दा।', descEn: 'The power that hides the true, non-dual nature of Brahman.', radiusPercent: 66, glowColor: '#0284c7' },
        { id: 'my3', nameHi: 'त्रिगुणात्मक प्रकृति (Guṇas)', nameEn: 'Tripartite Energy', descHi: 'सत्त्व, रज और तम का खेल जो जगत को चलाता है।', descEn: 'The matrix of Sattva, Rajas, and Tamas balancing physical manifestation.', radiusPercent: 44, glowColor: '#0369a1' },
        { id: 'my4', nameHi: 'अधिष्ठान सत्य (Adhiṣṭhāna)', nameEn: 'The Underlying Rope', descHi: 'वह शुद्ध ब्रह्म जिस पर माया की छाया नाचती है।', descEn: 'The changeless screen upon which the cosmic movie is projected.', radiusPercent: 24, glowColor: '#e0f2fe' },
      ],
    },
    flowchart: {
      titleHi: 'रस्सी और सर्प (रज्जु-सर्प भ्रम व निवारण)',
      titleEn: 'Rope & Serpent: The Mechanism of Superimposition',
      descriptionHi: 'अज्ञान से भय और प्रकाश से यथार्थ का उद्घाटन।',
      descriptionEn: 'How incomplete vision creates fear and how the torch of knowledge dissolves illusion instantly.',
      nodes: [
        { id: 'myn1', titleHi: 'रस्सी (Rope / Brahman)', titleEn: 'The Real Rope', subtitleHi: 'यथार्थ सत्य — अचल, निर्दोष', subtitleEn: 'The unchanging substrate' },
        { id: 'myn2', titleHi: 'मंद प्रकाश / अविद्या (Avidyā)', titleEn: 'Dim Light / Ignorance', subtitleHi: 'सत्य का स्पष्ट न दिखना', subtitleEn: 'Imperfect comprehension' },
        { id: 'myn3', titleHi: 'सर्प का आरोप (Adhyāsa)', titleEn: 'Superimposition of Snake', subtitleHi: 'मन द्वारा सर्प की कल्पना', subtitleEn: 'Projecting danger onto truth' },
        { id: 'myn4', titleHi: 'भय व पलायन (Fear & Suffering)', titleEn: 'Unnecessary Suffering', subtitleHi: 'झूठे सर्प से कांपना', subtitleEn: 'Trembling before a phantom' },
        { id: 'myn5', titleHi: 'ज्ञान का प्रकाश (Torch of Wisdom)', titleEn: 'Light of Knowledge', subtitleHi: 'सर्प लुप्त — केवल रस्सी शेष', subtitleEn: 'Snake vanishes — only rope was ever there' },
      ],
      edges: [
        { from: 'myn1', to: 'myn2', labelHi: 'छिपा हुआ', labelEn: 'Obscured by' },
        { from: 'myn2', to: 'myn3', labelHi: 'जन्म देता है', labelEn: 'Generates' },
        { from: 'myn3', to: 'myn4', labelHi: 'उत्पन्न करता है', labelEn: 'Causes' },
        { from: 'myn5', to: 'myn3', labelHi: 'मिटा देता है', labelEn: 'Dissolves' },
        { from: 'myn5', to: 'myn1', labelHi: 'पुनः प्रकाशित', labelEn: 'Reveals' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'श्वेताश्वतर उपनिषद्', ref: '4.10 — मायां तु प्रकृतिं विद्यान्मायिनं च महेश्वरम्' },
        { name: 'श्रीमद्भगवद्गीता', ref: '7.14 — मामेव ये प्रपद्यन्ते मायामेतां तरन्ति ते' },
        { name: 'विवेकचूड़ामणि', ref: 'श्लोक 108 — अव्यक्तनाम्नी परमेशशक्तिः' },
      ],
      corePillars: [
        { hi: 'आवरण (सत्य को ढंकने वाली शक्ति)', en: 'Avarana: Veiling Power' },
        { hi: 'विक्षेप (झूठे जगत को दिखाने वाली शक्ति)', en: 'Vikshepa: Projecting Power' },
        { hi: 'अविद्या (व्यक्तिगत स्तर पर अज्ञान)', en: 'Avidya: Individual Ignorance' },
        { hi: 'माया (समष्टि ब्रह्माण्ड स्तर पर उपाधि)', en: 'Maya: Cosmic Creative Matrix' },
      ],
      practices: [
        { hi: 'विवेक — नाम-रूप से परे सार तत्त्व को देखना', en: 'Looking past transient forms to essence' },
        { hi: 'ईश्वर-प्रपत्ति — परम सत्य की अनन्य शरण', en: 'Surrender to the Divine to cross the veil' },
        { hi: 'साक्षीभाव — संसार को स्वप्नवत् देखना', en: 'Observing the world-play as a cosmic dream' },
      ],
      ultimateFruit: {
        hi: 'भ्रम का अंत — जगत मिथ्या, ब्रह्म सत्यम् का अपरोक्ष बोध',
        en: 'Dispelling of illusion: realizing the cosmos as Brahman alone',
      },
    },
    stages: {
      titleHi: 'माया की तीन अवस्थाएँ (सत्त्व, रज, तम)',
      titleEn: 'The Three Strands (Guṇas) of Maya',
      items: [
        { step: 1, nameHi: 'तमस् (Tamas)', nameEn: 'Inertia & Obscuration', sanskrit: 'अज्ञान, आलस्य, प्रमाद', descHi: 'भारीपन, अंधकार और सत्य को सर्वथा न देख पाना।', descEn: 'Dullness, lethargy, and dense spiritual blind spots.' },
        { step: 2, nameHi: 'रजस् (Rajas)', nameEn: 'Passion & Restlessness', sanskrit: 'राग, तृष्णा, अशांति', descHi: 'अत्यधिक कामना, चंचलता और निरंतर दौड़-भाग।', descEn: 'Fierce desire, ambitious striving, and mental turbulence.' },
        { step: 3, nameHi: 'सत्त्व (Sattva)', nameEn: 'Purity & Luminosity', sanskrit: 'प्रकाश, शांति, विवेक', descHi: 'निर्मल दर्पण के समान जिसमें सत्य का प्रतिबिम्ब झलकता है।', descEn: 'Clarity, serenity, and harmony acting as a transparent window to Spirit.' },
      ],
    },
  },

  // ── 7. YOGA (योग) ───────────────────────────────────────────────────────────
  yoga: {
    id: 'yoga',
    label: 'Yoga',
    sanskrit: 'योग',
    transliteration: 'yoga',
    coreMantra: 'योगश्चित्तवृत्तिनिरोधः',
    coreMantraEn: 'Yoga is the stilling of the fluctuations of the mind.',
    scriptureSource: 'Patanjali Yoga Sutras 1.2',
    archetype: 'ashtanga-ladder',
    theme: {
      primary: '#059669',
      secondary: '#047857',
      glow: 'rgba(5, 150, 105, 0.45)',
      bgGradient: 'from-emerald-950/40 via-emerald-900/20 to-neutral-950',
    },
    binduSymbol: 'यु',
    geometry: {
      titleHi: 'अष्टांग योग एवं समाधि सोपान',
      titleEn: 'The Eight Limbs of Ashtanga Yoga',
      interpretationHi: 'योग मन की वृत्तियों को शांत कर जीवात्मा का परमात्मा में नित्य मिलन है।',
      interpretationEn: 'Yoga is the systematic integration of body, breath, mind, and intellect into uninterrupted union with the Divine.',
      layers: [
        { id: 'y1', nameHi: 'यम एवं नियम (Ethics & Discipline)', nameEn: 'Foundation of Harmony', descHi: 'अहिंसा, सत्य, शौच, संतोष और ईश्वर-प्रणिधान।', descEn: 'Moral and personal commitments grounding the practitioner.' , radiusPercent: 88, glowColor: '#34d399' },
        { id: 'y2', nameHi: 'आसन व प्राणायाम (Physical & Energy)', nameEn: 'Stability & Vital Force', descHi: 'स्थिर-सुखम् आसन और प्राण-शक्ति का नियमन।', descEn: 'Steady posture and rhythmic refinement of the lifeforce.' , radiusPercent: 68, glowColor: '#059669' },
        { id: 'y3', nameHi: 'प्रत्याहार व धारणा (Focus & Inwardness)', nameEn: 'Sensory Mastery & Focus', descHi: 'इंद्रियों को समेटकर मन को एक ध्येय पर टिकाना।', descEn: 'Drawing senses inward and anchoring attention unwavering.' , radiusPercent: 48, glowColor: '#047857' },
        { id: 'y4', nameHi: 'ध्यान व समाधि (Absorption & Union)', nameEn: 'Meditation & Samadhi', descHi: 'अखंड ध्यान-धारा और ज्ञाता-ज्ञेय का पूर्ण विलय।', descEn: 'Continuous contemplative flow leading to absorption in the Self.' , radiusPercent: 26, glowColor: '#a7f3d0' },
      ],
    },
    flowchart: {
      titleHi: 'योग के चार महामार्ग',
      titleEn: 'The Four Great Paths of Yoga',
      descriptionHi: 'प्रत्येक मानव स्वभाव के लिए एक समर्पित आध्यात्मिक महामार्ग।',
      descriptionEn: 'Four harmonious pathways tailored to action, emotion, intellect, and contemplation.',
      nodes: [
        { id: 'yn1', titleHi: 'कर्म योग (Karma Yoga)', titleEn: 'Path of Action', subtitleHi: 'कर्तव्यनिष्ठ निष्काम सेवा', subtitleEn: 'For the active and energetic' },
        { id: 'yn2', titleHi: 'भक्ति योग (Bhakti Yoga)', titleEn: 'Path of Devotion', subtitleHi: 'ईश्वर में उत्कट प्रेम व समर्पण', subtitleEn: 'For the emotional and heartfelt' },
        { id: 'yn3', titleHi: 'राज योग (Rāja Yoga)', titleEn: 'Path of Meditation', subtitleHi: 'चित्त-वृत्तियों का निरोध', subtitleEn: 'For the contemplative and disciplined' },
        { id: 'yn4', titleHi: 'ज्ञान योग (Jñāna Yoga)', titleEn: 'Path of Wisdom', subtitleHi: 'विवेक व आत्म-अनुसंधान', subtitleEn: 'For the philosophical and discerning' },
        { id: 'yn5', titleHi: 'परम योग (Maha-Yoga)', titleEn: 'Supreme Integration', subtitleHi: 'सर्वत्र समत्व — जीवन ही योग', subtitleEn: 'Living in constant divine communion' },
      ],
      edges: [
        { from: 'yn1', to: 'yn5', labelHi: 'चित्त शुद्धि', labelEn: 'Purification' },
        { from: 'yn2', to: 'yn5', labelHi: 'हृदय की शुद्धि', labelEn: 'Love' },
        { from: 'yn3', to: 'yn5', labelHi: 'मन की स्थिरता', labelEn: 'Mastery' },
        { from: 'yn4', to: 'yn5', labelHi: 'अज्ञान का नाश', labelEn: 'Illumination' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'पतंजलि योगसूत्र', ref: '1.2 — योगश्चित्तवृत्तिनिरोधः' },
        { name: 'श्रीमद्भगवद्गीता', ref: '2.48 — समत्वं योग उच्यते' },
        { name: 'श्रीमद्भगवद्गीता', ref: '2.50 — योगः कर्मसु कौशलम्' },
      ],
      corePillars: [
        { hi: 'समत्व (सुख-दुःख में मन का संतुलन)', en: 'Samatvam: Equanimity in all states' },
        { hi: 'कौशल (कर्म में कुशलता और निष्कामता)', en: 'Kausalam: Excellence in selfless service' },
        { hi: 'अभ्यास (अनवरत साधना का यत्न)', en: 'Abhyasa: Persistent daily endeavor' },
        { hi: 'वैराग्य (नश्वर विषयों से अनासक्ति)', en: 'Vairagya: Freedom from craving' },
      ],
      practices: [
        { hi: 'अष्टांग योग के आठों अंगों का समेकित आचरण', en: 'Living all eight limbs harmoniously' },
        { hi: 'प्राणायाम द्वारा प्राण और मन की एकाग्रता', en: 'Breath regulation for mental mastery' },
        { hi: 'अखंड साक्षी भाव में दैनिक कर्म संपादन', en: 'Performing daily tasks with witness consciousness' },
      ],
      ultimateFruit: {
        hi: 'समाधि — द्रष्टा का अपने वास्तविक स्वरूप में प्रतिष्ठित होना',
        en: 'The Seer abides effortlessly in their true luminous Nature',
      },
    },
    stages: {
      titleHi: 'पतंजलि अष्टांग योग के आठ अंग',
      titleEn: 'Eight Limbs of Classical Yoga',
      items: [
        { step: 1, nameHi: 'यम (Yama)', nameEn: 'Universal Ethics', sanskrit: 'अहिंसा, सत्य, अस्तेय, ब्रह्मचर्य, अपरिग्रह', descHi: 'समाज और जीवों के साथ व्यवहार के पांच नैतिक नियम।', descEn: 'Five ethical restraints for harmonious relationships with all beings.' },
        { step: 2, nameHi: 'नियम (Niyama)', nameEn: 'Personal Observances', sanskrit: 'शौच, संतोष, तप, स्वाध्याय, ईश्वरप्रणिधान', descHi: 'व्यक्तिगत शुद्धि और आत्म-साधना के पांच आधार।', descEn: 'Five personal disciplines: cleanliness, contentment, austerity, study, surrender.' },
        { step: 3, nameHi: 'आसन (Āsana)', nameEn: 'Steady Posture', sanskrit: 'स्थिरसुखमासनम्', descHi: 'शरीर को स्थिर और सुखद स्थिति में रखना।', descEn: 'Physical posture that is both motionless and deeply comfortable.' },
        { step: 4, nameHi: 'प्राणायाम (Prāṇāyāma)', nameEn: 'Breath Regulation', sanskrit: 'श्वासप्रश्वासयोर्गतिविच्छेदः', descHi: 'प्राण-ऊर्जा को नियंत्रित और सूक्ष्म बनाना।', descEn: 'Mastery of life-energy through rhythmic regulation of the breath.' },
        { step: 5, nameHi: 'प्रत्याहार (Pratyāhāra)', nameEn: 'Sensory Withdrawal', sanskrit: 'इंद्रियों का अंतर्मुख होना', descHi: 'बाहरी विषयों से इंद्रियों को कछुए की तरह समेट लेना।', descEn: 'Withdrawing senses from worldly stimuli into the interior silence.' },
        { step: 6, nameHi: 'धारणा (Dhāraṇā)', nameEn: 'Concentration', sanskrit: 'देशबन्धश्चित्तस्य धारणा', descHi: 'मन को किसी एक बिंदु या ध्येय पर स्थिर करना।', descEn: 'Binding consciousness to a single locus of focused meditation.' },
        { step: 7, nameHi: 'ध्यान (Dhyāna)', nameEn: 'Meditation', sanskrit: 'तत्र प्रत्ययैकतानता ध्यानम्', descHi: 'बिना व्यवधान के एक ही चिंतन की अखंड धारा।', descEn: 'Unbroken, uninterrupted flow of awareness toward the Divine.' },
        { step: 8, nameHi: 'समाधि (Samādhi)', nameEn: 'Transcendental Absorption', sanskrit: 'तदेवार्थमात्रनिर्भासं स्वरूपशून्यमिव', descHi: 'ज्ञाता, ज्ञान और ज्ञेय का एकत्व — पूर्ण कैवल्य।', descEn: 'Dissolution of egoic separation; resting as pure boundless Awareness.' },
      ],
    },
  },

  // ── 8. VEDANTA (वेदान्त) ───────────────────────────────────────────────────
  vedanta: {
    id: 'vedanta',
    label: 'Vedanta',
    sanskrit: 'वेदान्त',
    transliteration: 'vedānta',
    coreMantra: 'अहं ब्रह्मास्मि',
    coreMantraEn: 'I am the Absolute Brahman.',
    scriptureSource: 'Brihadaranyaka Upanishad 1.4.10',
    archetype: 'prasthanatrayi-triad',
    theme: {
      primary: '#9333ea',
      secondary: '#7e22ce',
      glow: 'rgba(147, 51, 234, 0.45)',
      bgGradient: 'from-purple-950/40 via-violet-900/20 to-neutral-950',
    },
    binduSymbol: 'वे',
    geometry: {
      titleHi: 'प्रस्थानत्रयी एवं अद्वैत ज्ञान-त्रिभुज',
      titleEn: 'The Triple Foundation (Prasthānatrayī) of Vedanta',
      interpretationHi: 'वेदान्त वेदों का शिरोभाग (उपनिषद्) है, जो प्रस्थानत्रयी के तीन सुदृढ़ स्तंभों पर आधारित है।',
      interpretationEn: 'Vedanta represents the culmination of Vedic wisdom, grounded upon the authoritative triple foundations.',
      layers: [
        { id: 'vd1', nameHi: 'श्रुति प्रस्थान (उपनिषद्)', nameEn: 'Revealed Intuition', descHi: 'प्रत्यक्ष ऋषि-अनुभूति और ब्रह्मविद्या का मूल उद्गम।', descEn: 'The Principal Upanishads containing revealed experiential insights.', radiusPercent: 88, glowColor: '#c084fc' },
        { id: 'vd2', nameHi: 'स्मृति प्रस्थान (भगवद्गीता)', nameEn: 'Practical Applied Wisdom', descHi: 'युद्धक्षेत्र और दैनिक जीवन में वेदान्त का प्रत्यक्ष प्रयोग।', descEn: 'The Bhagavad Gita bringing Upanishadic vision into lived duty.', radiusPercent: 68, glowColor: '#9333ea' },
        { id: 'vd3', nameHi: 'न्याय प्रस्थान (ब्रह्मसूत्र)', nameEn: 'Logical Coherence', descHi: 'तर्क और मीमांसा द्वारा वेदान्त दर्शन का तार्किक समन्वय।', descEn: 'Badarayana’s Brahma Sutras resolving all philosophical doubts logically.', radiusPercent: 48, glowColor: '#7e22ce' },
        { id: 'vd4', nameHi: 'अद्वैत साक्षात्कार (Anubhūti)', nameEn: 'Direct Non-Dual Truth', descHi: '« ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः »', descEn: 'Direct realization that Brahman alone is real, the Self is Brahman.', radiusPercent: 26, glowColor: '#f3e8ff' },
      ],
    },
    flowchart: {
      titleHi: 'वेदान्त के तीन प्रमुख सम्प्रदाय',
      titleEn: 'The Three Classical Schools of Vedanta',
      descriptionHi: 'जीव, जगत और ब्रह्म के संबंध को समझने की तीन महान परंपराएँ।',
      descriptionEn: 'The three classical systems mapping the relation between Soul, World, and God.',
      nodes: [
        { id: 'vdn1', titleHi: 'अद्वैत (Advaita)', titleEn: 'Non-Dualism (Śaṅkara)', subtitleHi: 'जीव और ब्रह्म में कोई भेद नहीं', subtitleEn: 'Soul and Brahman are identical' },
        { id: 'vdn2', titleHi: 'विशिष्टाद्वैत (Viśiṣṭādvaita)', titleEn: 'Qualified Non-Dualism (Rāmānuja)', subtitleHi: 'जीव व जगत ईश्वर के अंग हैं', subtitleEn: 'Souls and cosmos form God’s body' },
        { id: 'vdn3', titleHi: 'द्वैत (Dvaita)', titleEn: 'Dualism (Madhva)', subtitleHi: 'जीव और ईश्वर नित्य पृथक हैं', subtitleEn: 'Eternal distinction between Soul and God' },
        { id: 'vdn4', titleHi: 'अनुभव (Direct Realization)', titleEn: 'Experiential Fulfillment', subtitleHi: 'शास्त्रीय विवाद से परे स्वयं-प्रकाश', subtitleEn: 'Beyond debate into luminous awareness' },
      ],
      edges: [
        { from: 'vdn1', to: 'vdn4', labelHi: 'ज्ञानानुभूति', labelEn: 'Via Jnana' },
        { from: 'vdn2', to: 'vdn4', labelHi: 'शरणागति', labelEn: 'Via Prapatti' },
        { from: 'vdn3', to: 'vdn4', labelHi: 'परम भक्ति', labelEn: 'Via Pure Devotion' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'ब्रह्म सूत्र', ref: '1.1.1 — अथातो ब्रह्मजिज्ञासा' },
        { name: 'मांडूक्य कारिका', ref: '1.16 — अनादिमायया सुप्तो' },
        { name: 'श्रीमद्भगवद्गीता', ref: '15.15 — वेदान्तकृद्वेदविदेव चाहम्' },
      ],
      corePillars: [
        { hi: 'प्रस्थानत्रयी (उपनिषद्, गीता, ब्रह्मसूत्र)', en: 'Prasthanatrayi: The Triple Canon' },
        { hi: 'अध्यारोप-अपवाद (सत्य के निरूपण की विधि)', en: 'Superimposition & Refutation' },
        { hi: 'महावाक्य (चार वेदों के चार परम सत्य)', en: 'Mahavakyas: Four Great Declarations' },
        { hi: 'साधन चतुष्टय (साधक की योग्यता)', en: 'Sadhana Chatushtaya: Fourfold Discipline' },
      ],
      practices: [
        { hi: 'श्रवण, मनन, निदिध्यासन का व्यवस्थित क्रम', en: 'Hearing, reflecting, and deep meditation' },
        { hi: 'विवेक (सत्-असत्) एवं वैराग्य (इह-पर) का साधन', en: 'Discrimination and dispassion' },
        { hi: 'शमादि षट्क (मन और इंद्रियों का संयम)', en: 'Six virtues of inner calm and fortitude' },
      ],
      ultimateFruit: {
        hi: 'समस्त भयों और अज्ञान का समूल विनाश; ब्रह्म-निर्वाण',
        en: 'Total eradication of all fear, grief, and separation',
      },
    },
    stages: {
      titleHi: 'साधन चतुष्टय — वेदान्त अध्ययन के चार आधार',
      titleEn: 'Four Prerequisites for Vedantic Inquiry',
      items: [
        { step: 1, nameHi: 'नित्यानित्य वस्तु विवेक', nameEn: 'Discrimination of the Eternal', sanskrit: 'ब्रह्म सत्यं जगत् अनित्यम्', descHi: 'शाश्वत और क्षणभंगुर के मध्य स्पष्ट अंतर को पहचानना।', descEn: 'Differentiating the imperishable Reality from transient forms.' },
        { step: 2, nameHi: 'इहामुत्रार्थ फलभोग विराग', nameEn: 'Dispassion toward Fruits', sanskrit: 'वैराग्य एवं आसक्ति-त्याग', descHi: 'सांसारिक व स्वर्गीय भोगों की तृष्णा से पूर्ण विरक्ति।', descEn: 'Freedom from craving for earthly or heavenly pleasures.' },
        { step: 3, nameHi: 'शमादि षट्क सम्पत्ति', nameEn: 'Sixfold Inner Virtues', sanskrit: 'शम, दम, उपरति, तितिक्षा, श्रद्धा, समाधान', descHi: 'मन का संयम, इंद्रिय-निग्रह, सहनशीलता और एकाग्रता।', descEn: 'Mental tranquility, sensory restraint, endurance, faith, focus.' },
        { step: 4, nameHi: 'मुमुक्षुत्व', nameEn: 'Burning Yearning for Freedom', sanskrit: 'मोक्ष की उत्कट अभीप्सा', descHi: 'अज्ञान के बंधनों से मुक्त होने की अदम्य तीव्र प्यास।', descEn: 'Uncompromising aspiration to dissolve the illusion of bondage.' },
      ],
    },
  },

  // ── 9. BHAKTI (भक्ति) ───────────────────────────────────────────────────────
  bhakti: {
    id: 'bhakti',
    label: 'Bhakti',
    sanskrit: 'भक्ति',
    transliteration: 'bhakti',
    coreMantra: 'सा तु अस्मिन् परमप्रेमरूपा',
    coreMantraEn: 'Bhakti is of the nature of supreme divine love toward That.',
    scriptureSource: 'Narada Bhakti Sutras 2',
    archetype: 'navadha-lotus',
    theme: {
      primary: '#e11d48',
      secondary: '#be123c',
      glow: 'rgba(225, 29, 72, 0.45)',
      bgGradient: 'from-rose-950/40 via-rose-900/20 to-neutral-950',
    },
    binduSymbol: 'भ',
    geometry: {
      titleHi: 'नवधा भक्ति एवं प्रेम-कमल मण्डल',
      titleEn: 'The Lotus of Ninefold Devotion (Navadhā Bhakti)',
      interpretationHi: 'भक्ति अहंकार को पिघलाकर हृदय को अनंत ईश्वरीय प्रेम का पात्र बनाती है।',
      interpretationEn: 'Bhakti melts the ego and transforms the human heart into an ocean of pure unselfish love.',
      layers: [
        { id: 'bk1', nameHi: 'श्रवण व कीर्तन (Hearing & Singing)', nameEn: 'Auditory & Vocal Devotion', descHi: 'ईश्वरीय लीला व नाम का प्रेमपूर्वक गान व श्रवण।', descEn: 'Listening to sacred wisdom and singing the divine names.', radiusPercent: 88, glowColor: '#fb7185' },
        { id: 'bk2', nameHi: 'स्मरण व पादसेवन (Remembrance & Service)', nameEn: 'Continuous Memory & Service', descHi: 'हृदय में सतत स्मरण और दीन-दुखियों की सेवा।', descEn: 'Constant mindful awareness and selfless service at sacred feet.', radiusPercent: 68, glowColor: '#f43f5e' },
        { id: 'bk3', nameHi: 'अर्चन, वन्दन व दास्य (Worship & Devotion)', nameEn: 'Reverence & Holy Bond', descHi: 'पूजा, नमस्कार और परमात्मा के दास भाव से समर्पण।', descEn: 'Devout worship, bowing, and loyal servant-attitude.', radiusPercent: 48, glowColor: '#e11d48' },
        { id: 'bk4', nameHi: 'सख्य व आत्मनिवेदन (Friendship & Surrender)', nameEn: 'Divine Intimacy & Total Surrender', descHi: 'सखा भाव और सर्वस्व का पूर्ण समर्पण।', descEn: 'Intimate friendship and the total surrender of body, mind, and soul.', radiusPercent: 26, glowColor: '#fda4af' },
      ],
    },
    flowchart: {
      titleHi: 'भक्ति के पाँच दिव्य भाव (रस)',
      titleEn: 'The Five Sacred Moods (Bhāvas) of Divine Love',
      descriptionHi: 'शांत भाव से लेकर आत्म-विस्मरण तक प्रेम का उत्तरोत्तर विकास।',
      descriptionEn: 'The progression of intimacy between the devotee and the Supreme.',
      nodes: [
        { id: 'bkn1', titleHi: 'शांत भाव (Śānta)', titleEn: 'Quiet Reverence', subtitleHi: 'विस्मय और अगाध आदर', subtitleEn: 'Peaceful awe and contemplation' },
        { id: 'bkn2', titleHi: 'दास्य भाव (Dāsya)', titleEn: 'Sacred Service', subtitleHi: 'हनुमान जी के समान सेवा-भाव', subtitleEn: 'Devoted service to the Master' },
        { id: 'bkn3', titleHi: 'सख्य भाव (Sakhya)', titleEn: 'Divine Friendship', subtitleHi: 'अर्जुन व सुदामा के समान सखा', subtitleEn: 'Intimate companionship with God' },
        { id: 'bkn4', titleHi: 'वात्सल्य भाव (Vātsalya)', titleEn: 'Parental Tenderness', subtitleHi: 'यशोदा के समान वात्सल्य प्रेम', subtitleEn: 'Caring for the Divine as one’s child' },
        { id: 'bkn5', titleHi: 'मधुर भाव (Madhura)', titleEn: 'Sweetest Oneness', subtitleHi: 'राधा व गोपियों का अनन्य प्रेम', subtitleEn: 'Non-dual surrender of boundless love' },
      ],
      edges: [
        { from: 'bkn1', to: 'bkn2', labelHi: 'गहरा होता है', labelEn: 'Deepens' },
        { from: 'bkn2', to: 'bkn3', labelHi: 'निकट आता है', labelEn: 'Draws near' },
        { from: 'bkn3', to: 'bkn4', labelHi: 'वात्सल्य बनता है', labelEn: 'Becomes tender' },
        { from: 'bkn4', to: 'bkn5', labelHi: 'सर्वस्व विलय', labelEn: 'Culminates into' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'नारद भक्ति सूत्र', ref: 'सूत्र 2 — सा तु अस्मिन् परमप्रेमरूपा' },
        { name: 'श्रीमद्भागवत पुराण', ref: '7.5.23 — नवधा भक्ति' },
        { name: 'श्रीमद्भगवद्गीता', ref: '12.2 — मय्यावेश्य मनो ये मां' },
      ],
      corePillars: [
        { hi: 'अनन्य प्रेम (बिना किसी स्वार्थ के केवल प्रेम)', en: 'Ahaituki Bhakti: Unmotivated Love' },
        { hi: 'शरणागति (ईश्वर पर पूर्ण निर्भरता)', en: 'Sharanagati: Total Refuge' },
        { hi: 'अहंकार-शून्यता (मैं नहीं, तू ही तू)', en: 'Dissolution of the selfish Ego' },
        { hi: 'समस्त जीवों में ईश्वरीय दर्शन', en: 'Beholding the Beloved in every being' },
      ],
      practices: [
        { hi: 'नाम-जप एवं संकीर्तन का नित्य अभ्यास', en: 'Daily chanting and remembrance of sacred names' },
        { hi: 'सर्व कर्म ईश्वरार्पण बुद्धि से करना', en: 'Offering all thoughts and deeds as flowers' },
        { hi: 'दीन-दुखियों में नारायण की सेवा', en: 'Service to suffering humanity as Narayana' },
      ],
      ultimateFruit: {
        hi: 'परम प्रेम की प्राप्ति और भगवान के साथ नित्य एकत्व',
        en: 'Supreme love and unbroken intimacy with the Divine',
      },
    },
    stages: {
      titleHi: 'श्रीमद्भागवत की नवधा भक्ति (नौ अंग)',
      titleEn: 'The Nine Steps of Navadhā Bhakti',
      items: [
        { step: 1, nameHi: 'श्रवण (Śravaṇa)', nameEn: 'Listening', sanskrit: 'कथा व महिमा सुनना (उदा. परीक्षित)', descHi: 'परमात्मा के दिव्य गुणों का श्रद्धा से श्रवण।', descEn: 'Attentive, loving hearing of sacred stories and teachings.' },
        { step: 2, nameHi: 'कीर्तन (Kīrtana)', nameEn: 'Singing Praise', sanskrit: 'नाम-संकीर्तन (उदा. शुकदेव)', descHi: 'प्रेमपूर्वक भगवान के नाम और लीलाओं का गान।', descEn: 'Expressing divine joy through song and chant.' },
        { step: 3, nameHi: 'स्मरण (Smaraṇa)', nameEn: 'Mindful Remembrance', sanskrit: 'सतत चिंतन (उदा. प्रह्लाद)', descHi: 'प्रत्येक क्षण ईश्वर की उपस्थिति का स्मरण।', descEn: 'Continuous unbroken mindfulness of the Divine presence.' },
        { step: 4, nameHi: 'पादसेवन (Pādasevana)', nameEn: 'Serving the Feet', sanskrit: 'चरण-सेवा (उदा. लक्ष्मी जी)', descHi: 'सृष्टि व संतों की विनम्र सेवा करना।', descEn: 'Humble devotional service to living beings and the sacred.' },
        { step: 5, nameHi: 'अर्चन (Arcana)', nameEn: 'Ritual Worship', sanskrit: 'पूजन-अर्चन (उदा. पृथु)', descHi: 'पत्र, पुष्प, फल, जल से प्रेमपूर्ण अर्पण।', descEn: 'Offering simple flowers, water, and love in ceremonial worship.' },
        { step: 6, nameHi: 'वन्दन (Vandana)', nameEn: 'Prostration & Prayer', sanskrit: 'नमस्कार (उदा. अक्रूर)', descHi: 'अहंकार मिटाकर हृदय से नमन करना।', descEn: 'Bowing deeply in humility to eradicate all pride.' },
        { step: 7, nameHi: 'दास्य (Dāsya)', nameEn: 'Servant Devotion', sanskrit: 'सेवक भाव (उदा. हनुमान)', descHi: 'भगवान के आज्ञाकारी सेवक के रूप में कर्म करना।', descEn: 'Acting joyfully as an instrument in the Divine hands.' },
        { step: 8, nameHi: 'सख्य (Sakhya)', nameEn: 'Divine Friendship', sanskrit: 'सखा भाव (उदा. अर्जुन)', descHi: 'ईश्वर को अपना घनिष्ठ सखा और साथी मानना।', descEn: 'Sharing life with God as one’s closest, truest friend.' },
        { step: 9, nameHi: 'आत्मनिवेदन (Ātmanivedana)', nameEn: 'Total Self-Surrender', sanskrit: 'सर्वस्व अर्पण (उदा. राजा बलि)', descHi: 'अपने अस्तित्व को पूरी तरह परमात्मा को सौंप देना।', descEn: 'Surrendering body, mind, and soul in complete non-separation.' },
      ],
    },
  },

  // ── 10. SAMSARA (संसार) ─────────────────────────────────────────────────────
  samsara: {
    id: 'samsara',
    label: 'Samsara',
    sanskrit: 'संसार',
    transliteration: 'saṁsāra',
    coreMantra: 'पुनरपि जननं पुनरपि मरणं पुनरपि जननीजठरे शयनम्',
    coreMantraEn: 'Born again, dying again, lying again in a mother’s womb—save me, O Murari!',
    scriptureSource: 'Bhaja Govindam 21 (Adi Shankara)',
    archetype: 'bhavachakra-spokes',
    theme: {
      primary: '#d97706',
      secondary: '#92400e',
      glow: 'rgba(217, 119, 6, 0.45)',
      bgGradient: 'from-stone-950/40 via-amber-950/20 to-neutral-950',
    },
    binduSymbol: 'सं',
    geometry: {
      titleHi: 'भव-चक्र एवं जन्म-मृत्यु का आवर्त',
      titleEn: 'The Wheel of Becoming & Transmigration',
      interpretationHi: 'संसार वह निरंतर परिवर्तनशील प्रवाह है जिसमें जीव अविद्या और कामना के वशीभूत होकर जन्म-मरण के चक्र में घूमता है।',
      interpretationEn: 'Samsara is the turbulent ocean of transmigration where souls cycle through embodiment driven by desire and ignorance.',
      layers: [
        { id: 's1', nameHi: 'अविद्या व अज्ञान (Avidyā)', nameEn: 'Root Ignorance', descHi: 'अपने अमर आत्म-स्वरूप को भूल जाना।', descEn: 'Forgetting one’s immortal spiritual identity.', radiusPercent: 88, glowColor: '#f59e0b' },
        { id: 's2', nameHi: 'काम व वासना (Kāma & Vāsanā)', nameEn: 'Desire & Attachment', descHi: 'सांसारिक सुखों की तृष्णा और वस्तुओं में आसक्ति।', descEn: 'Thirst for transient pleasures fueling the engine of rebirth.', radiusPercent: 68, glowColor: '#d97706' },
        { id: 's3', nameHi: 'कर्म एवं देहधारण (Karma & Rebirth)', nameEn: 'Deed & Re-embodiment', descHi: 'कर्मफल भोगने हेतु नए शरीरों में प्रवेश।', descEn: 'Taking birth in diverse forms to experience accumulated fruits.', radiusPercent: 48, glowColor: '#b45309' },
        { id: 's4', nameHi: 'संसार-तरण (Transcendence)', nameEn: 'Crossing the Ocean', descHi: 'ज्ञान की नौका द्वारा भवसागर से मुक्ति।', descEn: 'Crossing the ocean of becoming via the ship of spiritual realization.', radiusPercent: 26, glowColor: '#fde68a' },
      ],
    },
    flowchart: {
      titleHi: 'भवचक्र की बारह कड़ियाँ (द्वादश निदान)',
      titleEn: 'The Cyclical Chain of Samsaric Becoming',
      descriptionHi: 'अविद्या से तृष्णा, तृष्णा से कर्म और कर्म से पुनः जन्म की अटूट श्रृंखला।',
      descriptionEn: 'The self-perpetuating loop of desire, action, death, and renewed embodiment.',
      nodes: [
        { id: 'sn1', titleHi: 'अविद्या (Avidyā)', titleEn: 'Ignorance of Self', subtitleHi: 'देह को ही आत्मा समझना', subtitleEn: 'Conflating Self with body' },
        { id: 'sn2', titleHi: 'अस्मिता व काम (Kāma)', titleEn: 'Ego & Desire', subtitleHi: 'विषयों में सुख की कल्पना', subtitleEn: 'Thirst for worldly grasping' },
        { id: 'sn3', titleHi: 'कर्म (Karma)', titleEn: 'Bound Action', subtitleHi: 'फल की आसक्ति से कर्म', subtitleEn: 'Action born of craving' },
        { id: 'sn4', titleHi: 'पुनर्जन्म (Rebirth)', titleEn: 'Embodiment', subtitleHi: 'नवीन देह में प्रवेश', subtitleEn: 'New birth to reap harvest' },
        { id: 'sn5', titleHi: 'जरा व मृत्यु (Old Age & Death)', titleEn: 'Decay & Passing', subtitleHi: 'नश्वरता का आघात', subtitleEn: 'Inevitable physical end' },
      ],
      edges: [
        { from: 'sn1', to: 'sn2', labelHi: 'पैदा करता है', labelEn: 'Generates' },
        { from: 'sn2', to: 'sn3', labelHi: 'प्रेरित करता है', labelEn: 'Motivates' },
        { from: 'sn3', to: 'sn4', labelHi: 'बाध्य करता है', labelEn: 'Compels' },
        { from: 'sn4', to: 'sn5', labelHi: 'परिणत होता है', labelEn: 'Leads to' },
        { from: 'sn5', to: 'sn1', labelHi: 'पुनः अविद्या चक्र', labelEn: 'Cycles anew' },
      ],
    },
    knowledgeMap: {
      scriptures: [
        { name: 'कठ उपनिषद्', ref: '1.2.6 — पुनः पुनर्वशमापद्यते मे' },
        { name: 'श्रीमद्भगवद्गीता', ref: '8.15 — मामुपेत्य पुनर्जन्म दुःखालयमशाश्वतम्' },
        { name: 'भज गोविंदम्', ref: 'श्लोक 21 — पुनरपि जननं पुनरपि मरणम्' },
      ],
      corePillars: [
        { hi: 'अनित्य (सर्वदा परिवर्तनशील एवं नश्वर)', en: 'Anitya: Transient and Ever-shifting' },
        { hi: 'दुःखालयम् (क्षणिक सुख के पीछे छिपा दुःख)', en: 'Dukhalayam: Inherent Fragility' },
        { hi: 'पुनर्जन्म (कर्मफल भुगतान की अनिवार्यता)', en: 'Punarjanma: Inevitable Transmigration' },
        { hi: 'भवसागर (ज्ञान की नौका से पार करने योग्य)', en: 'Bhavasagara: Ocean to be crossed' },
      ],
      practices: [
        { hi: 'तीव्र वैराग्य — नश्वर सुखों के मिथ्यापन का बोध', en: 'Cultivating detachment from passing mirages' },
        { hi: 'असंग-शस्त्र द्वारा संसार-वृक्ष का छेदन (गीता 15.3)', en: 'Cutting the Ashvattha tree with detachment' },
        { hi: 'भगवत्-शरण — परमात्मा की कृपा से भवसागर पार', en: 'Divine surrender to cross the cosmic ocean' },
      ],
      ultimateFruit: {
        hi: 'आवागमन से मुक्ति — नित्य सच्चिदानंद स्वरूप में अवस्थान',
        en: 'Ending of cyclic transmigration; eternal peace in the Self',
      },
    },
    stages: {
      titleHi: 'संसार से मुक्ति के चार सोपान',
      titleEn: 'Four Stages of Crossing the Ocean of Becoming',
      items: [
        { step: 1, nameHi: 'आर्त (Awakening through Sorrow)', nameEn: 'Awakening through Suffering', sanskrit: 'संसार के दुःखों से व्यथा', descHi: 'सांसारिक अनित्यता और आघातों से चेतना का जागना।', descEn: 'Realizing the fragility of worldly refuge after painful shocks.' },
        { step: 2, nameHi: 'जिज्ञासु (The Quest for Truth)', nameEn: 'Sincere Spiritual Inquiry', sanskrit: 'सत्य की खोज में प्रवृत्ति', descHi: 'शाश्वत शांति के लिए सद्गुरु और शास्त्रों की शरण।', descEn: 'Turning earnestly to scripture and spiritual teachers for truth.' },
        { step: 3, nameHi: 'अर्थार्थी से ज्ञानी (The Shift to Wisdom)', nameEn: 'Deepening Dispassion', sanskrit: 'वैराग्य एवं चित्त की शुद्धि', descHi: 'बाहरी वस्तुओं से ध्यान हटाकर अंतरात्मा की ओर मुड़ना।', descEn: 'Withdrawing reliance on outer phenomena toward inner light.' },
        { step: 4, nameHi: 'मुक्त (Unshakable Liberation)', nameEn: 'Transcendence of the Wheel', sanskrit: 'न स पुनरावर्तते', descHi: 'भव-चक्र का सर्वथा अंत; आत्मा की अमरता का साक्षात्कार।', descEn: 'Complete cessation of cyclic rebirth; freedom as the immortal Spirit.' },
      ],
    },
  },
};

export const VISUAL_CONCEPT_KEYS = Object.keys(VISUAL_CONCEPTS);
