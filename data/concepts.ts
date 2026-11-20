export type ConceptCategory = 'core' | 'metaphysics' | 'practice' | 'psychology' | 'cosmology';

export interface Concept {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  category: ConceptCategory;
  shortDesc: string;
  description: string;
  connections: string[];
  scriptureRefs?: string[];
}

export const conceptCategories: {
  key: ConceptCategory;
  label: string;
  sanskrit: string;
  gradient: string;
  border: string;
  text: string;
  icon: string;
}[] = [
  { key: 'core', label: 'मूल (Core)', sanskrit: 'मूल', gradient: 'from-saffron-500 to-amber-600', border: 'border-saffron-400', text: 'text-saffron-700', icon: '🕉️' },
  { key: 'metaphysics', label: 'तत्त्वमीमांसा (Metaphysics)', sanskrit: 'तत्त्वज्ञान', gradient: 'from-indigo-500 to-blue-600', border: 'border-indigo-400', text: 'text-indigo-700', icon: '🌌' },
  { key: 'practice', label: 'साधना (Practice)', sanskrit: 'अभ्यास', gradient: 'from-emerald-500 to-green-600', border: 'border-emerald-400', text: 'text-emerald-700', icon: '🧘' },
  { key: 'psychology', label: 'मनोविज्ञान (Psychology)', sanskrit: 'मनोविज्ञान', gradient: 'from-rose-500 to-pink-600', border: 'border-rose-400', text: 'text-rose-700', icon: '🧠' },
  { key: 'cosmology', label: 'ब्रह्माण्ड (Cosmology)', sanskrit: 'ब्रह्माण्ड', gradient: 'from-purple-500 to-violet-600', border: 'border-purple-400', text: 'text-purple-700', icon: '✨' },
];

export const concepts: Concept[] = [
  // ── Core ──────────────────────────────────────────────────────
  {
    id: 'brahman',
    label: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    transliteration: 'brahman',
    category: 'core',
    shortDesc: 'परम सत्य — सर्वव्यापी, अनंत और नित्य वास्तविकता।',
    description: 'ब्रह्मन् परम सत्य है — निराकार, अनंत, नित्य वास्तविकता जो सभी घटनाओं के आधार पर है। इसे सत्-चित्-आनंद (Existence-Consciousness-Bliss) के रूप में वर्णित किया गया है। "सर्वं खल्विदं ब्रह्म" — "यह सब ब्रह्म ही है" (छांदोग्य उपनिषद)। नाम और रूप से परे, फिर भी सभी नामों और रूपों का स्रोत।',
    connections: ['atman', 'maya', 'om', 'ishvara', 'moksha'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'atman',
    label: 'Atman',
    sanskrit: 'आत्मन्',
    transliteration: 'ātman',
    category: 'core',
    shortDesc: 'आंतरिक स्व — सभी प्राणियों में विद्यमान अमर साक्षी चेतना।',
    description: 'आत्मन् सच्चा स्व है, जो शरीर, मन और अहंकार से अलग है। यह नित्य, अजन्मा और अमर है। उपनिषद घोषित करते हैं "तत् त्वम् असि" — "तू वही है" — आत्मन् को ब्रह्मन् के साथ एक मानते हुए। इस एकता का अनुभव वेदांत का लक्ष्य है।',
    connections: ['brahman', 'samsara', 'moksha', 'purusha', 'viveka'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'karma',
    label: 'Karma',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    category: 'core',
    shortDesc: 'कर्म का सार्वत्रिक नियम — कार्य और उसके परिणाम जन्मों-जन्मों तक।',
    description: 'कर्म कार्य और परिणाम का नैतिक नियम है। प्रत्येक क्रिया — शारीरिक, वाचिक, या मानसिक — संस्कार बनाती है जो भविष्य के अनुभवों को आकार देते हैं। कर्म आत्मा को संसार से बांधता है, परंतु निष्काम भाव से किए जाने पर मुक्ति का मार्ग भी बन सकता है।',
    connections: ['samsara', 'dharma', 'karma-yoga', 'vasana'],
    scriptureRefs: ['bhagavadgita', 'upanishads'],
  },
  {
    id: 'dharma',
    label: 'Dharma',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    category: 'core',
    shortDesc: 'सृष्टि का नियम, धर्म और जीवन का पवित्र कर्तव्य।',
    description: 'धर्म वह शाश्वत नियम है जो सृष्टि को धारण करता है — नैतिक और आचार संबंधी ढांचा जो सामाजिक और वैश्विक व्यवस्था को बनाए रखता है। इसमें कर्तव्य, न्याय और उचित जीवन शैली सम्मिलित हैं। "स्वधर्मे निधनं श्रेयः परधर्मो भयावहः" — "अपने धर्म में हारना दूसरे के धर्म में जीतने से श्रेष्ठ है" (भगवद्गीता 3.35)।',
    connections: ['karma', 'yoga', 'bhakti', 'avatar', 'yuga'],
    scriptureRefs: ['bhagavadgita', 'manusmriti', 'mahabharata'],
  },

  // ── Metaphysics ───────────────────────────────────────────────
  {
    id: 'maya',
    label: 'Maya',
    sanskrit: 'माया',
    transliteration: 'māyā',
    category: 'metaphysics',
    shortDesc: 'वह वैश्विक शक्ति जो वास्तविकता के स्वरूप को ढांकती है, भेद की भ्रांति पैदा करती है।',
    description: 'माया ब्रह्मन् की दैवीय शक्ति है जो भौतिक संसार की उपस्थिति को प्रक्षेपित करती है। यह न वास्तविक है न अवास्तविक — यह "न इदं न तद्" है। माया एक को अनेक प्रतीत होता है, अनंत को सीमित। ज्ञान द्वारा माया को जीतने पर मुक्ति मिलती है।',
    connections: ['avidya', 'prakriti', 'brahman'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'moksha',
    label: 'Moksha',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    category: 'metaphysics',
    shortDesc: 'संसार चक्र से मुक्ति — मानव जीवन का परम लक्ष्य।',
    description: 'मोक्ष परम मुक्ति है — जन्म, मृत्यु और पुनर्जन्म के चक्र से स्वतंत्रता। यह ब्रह्मन् के साथ अपनी एकता का प्रत्यक्ष अनुभव है। मोक्ष कोई स्थान या स्थिति नहीं है जिसे प्राप्त किया जाए, बल्कि यह उस सत्य की पहचान है जो सदैव रहा है: स्व सदैव मुक्त है।',
    connections: ['atman', 'brahman', 'samsara', 'jnana', 'viveka', 'yoga'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'samsara',
    label: 'Samsara',
    sanskrit: 'संसार',
    transliteration: 'saṃsāra',
    category: 'metaphysics',
    shortDesc: 'जन्म, मृत्यु और पुनर्जन्म का अंतहीन चक्र, कर्म द्वारा चालित।',
    description: 'संसार अस्तित्व का चक्र है — जन्म, मृत्यु और पुनर्जन्म का सतत प्रवाह जिससे सभी प्राणी गुजरते हैं। इसे कर्म और इच्छा द्वारा ईंधन मिलता है। मुक्ति (moksha) इस चक्र से निकास है, जो आत्मज्ञान और आसक्ति के विघटन से प्राप्त होती है।',
    connections: ['karma', 'moksha', 'atman', 'vasana', 'yuga'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'vedanta',
    label: 'Vedanta',
    sanskrit: 'वेदान्त',
    transliteration: 'vedānta',
    category: 'metaphysics',
    shortDesc: 'वेदों का शिरोभाग — उपनिषदों, गीता और ब्रह्मसूत्रों का अद्वैत दर्शन।',
    description: 'वेदान्त का शाब्दिक अर्थ है "वेदों का अंत या शिखर"। यह प्रस्थानत्रयी (उपनिषद्, भगवद्गीता, ब्रह्मसूत्र) पर आधारित परम ज्ञान-परंपरा है, जो जीव और ब्रह्म की एकता, जगत के स्वरूप और मोक्ष का साक्षात्कार कराती है।',
    connections: ['brahman', 'atman', 'maya', 'moksha', 'viveka'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'prakriti',
    label: 'Prakriti',
    sanskrit: 'प्रकृति',
    transliteration: 'prakṛti',
    category: 'metaphysics',
    shortDesc: 'मूल प्रकृति — ब्रह्मांड की भौतिक कारण, तीन गुणों से बनी।',
    description: 'प्रकृति मूल भौतिक स्वभाव है — आदिम पदार्थ जिससे संपूर्ण भौतिक ब्रह्मांड विकसित होता है। यह तीन गुणों (sattva, rajas, tamas) के विभिन्न संयोजनों से बनी है। सांख्य दर्शन में, प्रकृति पुरुष (चेतना) की समानांतर है।',
    connections: ['guna', 'maya', 'purusha'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'purusha',
    label: 'Purusha',
    sanskrit: 'पुरुष',
    transliteration: 'puruṣa',
    category: 'metaphysics',
    shortDesc: 'शुद्ध चेतना — मौन साक्षी जो देखता है परंतु कर्म नहीं करता।',
    description: 'पुरुष पारलौकिक विषय है — शुद्ध चेतना जो सभी अनुभवों की साक्षी है। प्रकृति (जो कार्य करती है और विकसित होती है) के विपरीत, पुरुष निष्क्रिय, नित्य और अपरिवर्तनीय है। वेदांत में, पुरुष को आत्मन्, आंतरिक स्व के साथ पहचाना जाता है।',
    connections: ['atman', 'prakriti', 'moksha'],
    scriptureRefs: ['upanishads', 'samkhya'],
  },

  // ── Practice ──────────────────────────────────────────────────
  {
    id: 'yoga',
    label: 'Yoga',
    sanskrit: 'योग',
    transliteration: 'yoga',
    category: 'practice',
    shortDesc: 'दैवीय से एकता — आध्यात्मिक अनुशासन और एकीकरण का विज्ञान।',
    description: 'योग का अर्थ "एकता" है — व्यक्तिगत स्व का सार्वभौमिक स्व के साथ मिलन। इसमें अनेक मार्ग सम्मिलित हैं: कर्म योग (क्रिया), भक्ति योग (भक्ति), ज्ञान योग (ज्ञान), और ध्यान योग (ध्यान)। "योगः कर्मसु कौशलम्" — "कर्म में कुशलता ही योग है" (भगवद्गीता 2.50)।',
    connections: ['moksha', 'dhyana', 'dharma', 'karma-yoga'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },
  {
    id: 'bhakti',
    label: 'Bhakti',
    sanskrit: 'भक्ति',
    transliteration: 'bhakti',
    category: 'practice',
    shortDesc: 'दैवीय के प्रति भक्ति और प्रेम — हृदय का मार्ग।',
    description: 'भक्ति दैवीय के प्रति तीव्र, निःस्वार्थ प्रेम और भक्ति है। इसे कलियुग में सरलतम मार्ग माना जाता है। गायन, प्रार्थना, पूजा और समर्पण द्वारा भक्त अहंकार को विलीन कर प्रिय के साथ एक हो जाता है। "जो कोई मुझे पत्र, पुष्प, फल या जल भक्ति से अर्पण करता है — मैं स्वीकार करता हूं" (भगवद्गीता 9.26)।',
    connections: ['moksha', 'ishvara', 'dharma'],
    scriptureRefs: ['bhagavadgita', 'ramcharitmanas'],
  },
  {
    id: 'jnana',
    label: 'Jnana',
    sanskrit: 'ज्ञान',
    transliteration: 'jñāna',
    category: 'practice',
    shortDesc: 'आध्यात्मिक ज्ञान — स्व के सत्य का प्रत्यक्ष अनुभव।',
    description: 'ज्ञान ज्ञान का मार्ग है — वास्तविकता के स्वरूप में दार्शनिक अन्वेषण। इसमें श्रवण (सुनना), मनन (चिंतन), और निदिध्यासन (ध्यान) महान सत्यों पर सम्मिलित हैं। ज्ञानी सत्य और असत्य के बीच विवेक के माध्यम से "अहं ब्रह्मास्मि" का प्रत्यक्ष अनुभव करना चाहता है।',
    connections: ['moksha', 'avidya', 'viveka'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'karma-yoga',
    label: 'Karma Yoga',
    sanskrit: 'कर्म योग',
    transliteration: 'karma yoga',
    category: 'practice',
    shortDesc: 'निष्काम कर्म का मार्ग — परिणामों से अनासक्त होकर कर्तव्य पालन।',
    description: 'कर्म योग फल की इच्छा के बिना कार्य करने का अनुशासन है। "कर्म करने का अधिकार तुम्हें है, किंतु फल का कभी नहीं" (भगवद्गीता 2.47)। सभी क्रियाओं को दैवीय को समर्पित कर और आसक्ति का त्याग कर, कर्म योगी मन को शुद्ध कर मुक्ति प्राप्त करता है।',
    connections: ['karma', 'moksha', 'yoga', 'dharma'],
    scriptureRefs: ['bhagavadgita'],
  },
  {
    id: 'dhyana',
    label: 'Dhyana',
    sanskrit: 'ध्यान',
    transliteration: 'dhyāna',
    category: 'practice',
    shortDesc: 'ध्यान — मन को शांत कर स्व को प्रकट करने का अभ्यास।',
    description: 'ध्यान निरंतर, अखंड ध्यान है — पतंजलि के अष्टांग योग का सातवां अंग। यह निरंतर जागरूकता की स्थिति है जिसमें ध्यान करने वाला प्रक्रिया के प्रति जागरूक नहीं रहता। ध्यान से समाधि उत्पन्न होता है — ध्यान के विषय में पूर्ण लीनता की स्थिति।',
    connections: ['yoga', 'om', 'manas'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },
  {
    id: 'ahimsa',
    label: 'Ahimsa',
    sanskrit: 'अहिंसा',
    transliteration: 'ahiṁsā',
    category: 'practice',
    shortDesc: 'अहिंसा परम धर्म — मन, वाणी और कर्म से समस्त प्राणियों के प्रति अद्रोह व करुणा।',
    description: 'अहिंसा सनातन आचार का मूल आधार और अष्टांग योग का प्रथम महाव्रत (यम) है। इसका अर्थ केवल शारीरिक चोट से बचना ही नहीं, अपितु विचार, वाणी और आचरण में दुर्भाव, कटुता और ईर्ष्या का सर्वथा त्याग करना है। "अहिंसा परमो धर्मः" महाभारत का शाश्वत संदेश है।',
    connections: ['dharma', 'yoga', 'yajna', 'karma'],
    scriptureRefs: ['mahabharata', 'bhagavadgita', 'yogasutras'],
  },
  {
    id: 'yajna',
    label: 'Yajna',
    sanskrit: 'यज्ञ',
    transliteration: 'yajña',
    category: 'practice',
    shortDesc: 'त्याग व पारस्परिक सहयोग — सृष्टि चक्र और समाज के संतुलन का पावन सिद्धांत।',
    description: 'यज्ञ का व्यापक अर्थ निःस्वार्थ भाव से समाज, प्रकृति और ईश्वर के प्रति सर्वस्व अर्पण करना है। गीता (3.9-16) के अनुसार सम्पूर्ण ब्रह्मांड पारस्परिक पोषण के यज्ञ-चक्र पर प्रतिष्ठित है। जब मनुष्य उपभोग की बजाय परोपकार और सेवा को जीवन का लक्ष्य बनाता है, तो उसका प्रत्येक कर्म यज्ञ बन जाता है।',
    connections: ['karma', 'dharma', 'ahimsa', 'karma-yoga'],
    scriptureRefs: ['bhagavadgita', 'rigveda'],
  },

  // ── Psychology ────────────────────────────────────────────────
  {
    id: 'guna',
    label: 'Gunas',
    sanskrit: 'गुण',
    transliteration: 'guṇa',
    category: 'psychology',
    shortDesc: 'प्रकृति के तीन गुण: सत्त्व (सामंजस्य), रजस् (सक्रियता), तमस् (जड़ता)।',
    description: 'तीन गुण प्रकृति के मूल गुण हैं जो सभी भौतिक और मानसिक घटनाओं को नियंत्रित करते हैं। सत्त्व शुद्धता, स्पष्टता और सामंजस्य है। रजस् उत्साह, सक्रियता और बेचैनी है। तमस् अज्ञान, जड़ता और अंधकार है। "गुणाः गुणेषु वर्तन्ते" — "गुण गुणों में ही कार्य करते हैं" (भगवद्गीता 3.28)।',
    connections: ['prakriti', 'manas', 'vasana'],
    scriptureRefs: ['bhagavadgita', 'samkhya'],
  },
  {
    id: 'avidya',
    label: 'Avidya',
    sanskrit: 'अविद्या',
    transliteration: 'avidyā',
    category: 'psychology',
    shortDesc: 'आध्यात्मिक अज्ञान — दुःख और बंधन का मूल कारण।',
    description: 'अविद्या अपने स्वरूप का मूल अज्ञान है — शरीर-मन समूह को स्व मान लेना। यह सभी दुःखों का मूल कारण और मुक्ति का प्रमुख बाधा है। अविद्या सूचना का अभाव नहीं, बल्कि वास्तविकता का गहन भ्रांतिपूर्ण बोध है। इसका विनाश ज्ञान (आध्यात्मिक ज्ञान) द्वारा होता है।',
    connections: ['maya', 'jnana', 'samsara', 'manas'],
    scriptureRefs: ['upanishads', 'yogasutras'],
  },
  {
    id: 'viveka',
    label: 'Viveka',
    sanskrit: 'विवेक',
    transliteration: 'viveka',
    category: 'psychology',
    shortDesc: 'विवेक — सत्य और असत्य के बीच भेद करने की क्षमता।',
    description: 'विवेक आध्यात्मिक भेद करने की शक्ति है — स्थायी और अस्थायी, स्व और अस्व, सत्य और आभासी के बीच भेद करने की योग्यता। यह ज्ञान मार्ग के लिए आवश्यक चार योग्यताओं (sadhana chatushtaya) में प्रथम है। विवेक के बिना मुक्ति असंभव है।',
    connections: ['jnana', 'moksha', 'atman'],
    scriptureRefs: ['upanishads', 'vivekachudamani'],
  },
  {
    id: 'manas',
    label: 'Manas',
    sanskrit: 'मनस्',
    transliteration: 'manas',
    category: 'psychology',
    shortDesc: 'मन — चिंतन, विचार और भावना की शक्ति।',
    description: 'मनस् चिंतन शक्ति है — आंतरिक यंत्र (antahkarana) का वह भाग जो विचार, संशय और भावना के लिए उत्तरदायी है। यह इंद्रियों से संकेत प्राप्त कर उन्हें संसाधित करता है। "मन चंचल, उद्विग्न, जिद्दी और बलशाली है, हे कृष्ण — इसे वश में करना वायु को नियंत्रित करने से भी कठिन है" (भगवद्गीता 6.34)।',
    connections: ['guna', 'dhyana', 'avidya'],
    scriptureRefs: ['bhagavadgita', 'upanishads'],
  },
  {
    id: 'vasana',
    label: 'Vasana',
    sanskrit: 'वासना',
    transliteration: 'vāsanā',
    category: 'psychology',
    shortDesc: 'सूक्ष्म इच्छाएं और प्रवृत्तियां — गहरे संस्कार जो जन्मों-जन्मों तक व्यवहार को चलाते हैं।',
    description: 'वासनाएं सूक्ष्म, अचेतन इच्छाएं और प्रवृत्तियां हैं — पूर्व क्रियाओं और अनुभवों द्वारा छोड़े गए गहरे संस्कार। ये व्यक्तित्व को आकार देती हैं, व्यवहार को चलाती हैं, और पुनर्जन्म के चक्र को गति देती हैं। आत्मज्ञान और वैराग्य द्वारा वासनाओं का नाश मुक्ति के लिए आवश्यक है।',
    connections: ['karma', 'guna', 'samsara'],
    scriptureRefs: ['upanishads', 'yogasutras'],
  },

  // ── Cosmology ─────────────────────────────────────────────────
  {
    id: 'om',
    label: 'Om',
    sanskrit: 'ॐ',
    transliteration: 'oṃ',
    category: 'cosmology',
    shortDesc: 'आदिम ध्वनि — ब्रह्मन् का ध्वन्यात्मक प्रतिनिधित्व।',
    description: 'ॐ (प्रणव) हिंदू धर्म का सर्वाधिक पवित्र ध्वनि है — आदिम कंपन जिससे ब्रह्मांड उत्पन्न होता है। यह तीन अक्षरों (A-U-M) से बना है जो चेतना की तीन स्थितियों और त्रिमूर्ति का प्रतिनिधित्व करते हैं। "ॐ इति एतत् ब्रह्म" — "ॐ ही ब्रह्म है, यह परम आधार है" (कठ उपनिषद)।',
    connections: ['brahman', 'dhyana', 'ishvara'],
    scriptureRefs: ['upanishads', 'bhagavadgita', 'yogasutras'],
  },
  {
    id: 'ishvara',
    label: 'Ishvara',
    sanskrit: 'ईश्वर',
    transliteration: 'īśvara',
    category: 'cosmology',
    shortDesc: 'ईश्वर — दैवीय का व्यक्तिगत स्वरूप जो ब्रह्मांड को शासित करता है।',
    description: 'ईश्वर व्यक्तिगत ईश्वर है — सर्वोच्च शासक और वैश्विक संचालक। जबकि ब्रह्मन् निर्गुण परम सत्य है, ईश्वर सगुण ब्रह्मन् है — सृष्टि, संरक्षण और विनाश कर्ता। पतंजलि के योग सूत्र में, ईश्वर एक विशेष पुरुष है, अज्ञान और कर्म से अछूता।',
    connections: ['brahman', 'bhakti', 'avatar', 'om'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },
  {
    id: 'avatar',
    label: 'Avatar',
    sanskrit: 'अवतार',
    transliteration: 'avatāra',
    category: 'cosmology',
    shortDesc: 'दैवीय अवतारण — दैवीय का मानव रूप में अवतरण।',
    description: 'अवतार दैवीय अवतरण है — सर्वोच्च का भौतिक संसार में आगमन। धर्म के ह्रास पर अवतार प्रकट होते हैं। "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत — तदात्मानं सृजाम्यहम्" — "जब-जब धर्म का ह्रास होता है, तब-तब मैं स्वयं प्रकट होता हूं" (भगवद्गीता 4.7)। विष्णु के दस अवतार (दशावतार) सर्वाधिक प्रसिद्ध हैं।',
    connections: ['ishvara', 'dharma', 'yuga'],
    scriptureRefs: ['bhagavadgita', 'puranas'],
  },
  {
    id: 'yuga',
    label: 'Yugas',
    sanskrit: 'युग',
    transliteration: 'yuga',
    category: 'cosmology',
    shortDesc: 'चार वैश्विक युग — समय के चक्र जो अनंत तक दोहराए जाते हैं।',
    description: 'युग एक वैश्विक चक्र (महायुग) के चार काल हैं: सत्य (सत्य का स्वर्ण युग), त्रेता (रजत युग), द्वापर (कांस्य युग), और कलि (ह्रास का लौह युग)। प्रत्येक युग में धर्म, आयु और आध्यात्मिक जागरूकता का ह्रास होता जाता है। हम वर्तमान में कलियुग में हैं, जो 432,000 वर्षों तक चलता है।',
    connections: ['dharma', 'avatar', 'samsara'],
    scriptureRefs: ['manusmriti', 'puranas', 'mahabharata'],
  },
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getConnectedConcepts(id: string): Concept[] {
  const concept = getConcept(id);
  if (!concept) return [];
  return concept.connections
    .map((connId) => getConcept(connId))
    .filter((c): c is Concept => c !== undefined);
}

