/**
 * Canonical Solar Vratas & Sauramana Observances Data
 * Detailed liturgical, astronomical, and scriptural documentation for:
 * 1. Chhath Puja (4-Day Mahavrata)
 * 2. Ratha Saptami (Surya Jayanti)
 * 3. Makar Sankranti (Uttarayana Transition)
 * 4. Bhanu Saptami & Ravivara Vrata
 */

export interface SolarVrataDay {
  dayNumber: number;
  name: string;
  nameHi: string;
  tithi: string;
  tithiHi: string;
  description: string;
  descriptionHi: string;
  rituals: string[];
  ritualsHi: string[];
  prasad: string;
  prasadHi: string;
}

export interface SolarVrata {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  timing: string;
  timingHi: string;
  astronomy: string;
  astronomyHi: string;
  significance: string;
  significanceHi: string;
  deity: string;
  deityHi: string;
  days?: SolarVrataDay[];
  mantras: Array<{
    title: string;
    titleHi: string;
    sanskrit: string;
    iast: string;
    hindi: string;
    english: string;
  }>;
  guidelines: string[];
  guidelinesHi: string[];
  crossLinks: Array<{
    label: string;
    labelHi: string;
    href: string;
  }>;
}

export const SOLAR_VRATAS: SolarVrata[] = [
  {
    id: 'chhath-puja',
    slug: 'chhath-puja',
    name: 'Chhath Puja (Surya Shashthi Mahavrata)',
    nameHi: 'छठ पूजा (सूर्य षष्ठी महाव्रत)',
    timing: 'Kartik Shukla Chaturthi to Saptami (October / November)',
    timingHi: 'कार्तिक शुक्ल चतुर्थी से सप्तमी (4 दिवसीय महापर्व)',
    astronomy: 'Observed during the post-monsoon autumnal solar phase. As atmospheric clarity reaches its annual zenith, the Sun’s ultraviolet and infrared radiation cycles at dawn and dusk stimulate the pineal gland, reticular system, and immune vitality.',
    astronomyHi: 'शरद ऋतु में जब वायुमण्डल सर्वाधिक स्वच्छ होता है, तब प्रातःकाल और सायंकाल में सूर्य की सौम्य किरणें शरीर की रोग-प्रतिरोधक क्षमता और प्राण-शक्ति को जाग्रत करती हैं।',
    significance: 'The most austere, eco-friendly, and casteless Mahavrata of Sanatana Dharma. Uniquely worships both the setting Sun (Asta-chala Surya) and the rising Sun (Udaya Surya), symbolizing that honor belongs equally to those declining and rising in life.',
    significanceHi: 'सनातन परम्परा का सर्वाधिक कठोर, पवित्र और समरसता-युक्त महापर्व। इसमें अस्ताचलगामी (डूबते) और उदयाचलगामी (उगते) दोनों सूर्यों को अर्घ्य दिया जाता है, जो जीवन के सुख-दुःख में समत्व का सन्देश देता है।',
    deity: 'Surya Narayana & Chhathi Maiya (Usha & Pratyusha)',
    deityHi: 'सूर्यनारायण एवं षष्ठी देवी (उषा व प्रत्युषा)',
    days: [
      {
        dayNumber: 1,
        name: 'Nahay-Khay (Ritual Purification)',
        nameHi: 'नहाय-खाय (आत्म-शुद्धि)',
        tithi: 'Kartik Shukla Chaturthi',
        tithiHi: 'कार्तिक शुक्ल चतुर्थी',
        description: 'Vratis take a sacred bath in flowing rivers, clean the home thoroughly, and consume a single sattvik meal prepared in bronze or clay pots.',
        descriptionHi: 'व्रती पवित्र नदी या सरोवर में स्नान कर सात्त्विक अरवा चावल, चने की दाल और कद्दू (लौकी) का प्रसाद ग्रहण करते हैं। इसके बाद से घर में पूर्ण पवित्रता रखी जाती है।',
        rituals: [
          'Holy dip in the river or pure water bath',
          'Preparation of Kaddu-Bhat (bottle gourd with rice and rock salt)',
          'Strict segregation of puja utensils',
        ],
        ritualsHi: [
          'पवित्र नदी या तीर्थ-जल से स्नान',
          'सेंधा नमक, घी व अरवा चावल से कद्दू-भात का निर्माण',
          'पूजा के सभी बर्तनों का शुद्धिकरण',
        ],
        prasad: 'Kaddu-Bhat (Sattvik gourd, rice, and chana dal)',
        prasadHi: 'कद्दू-भात (लौकी, अरवा चावल व चना दाल)',
      },
      {
        dayNumber: 2,
        name: 'Kharna / Lohanda (The Sacred Fire Fast)',
        nameHi: 'खरना / लोहंडा (अग्नि-साधना)',
        tithi: 'Kartik Shukla Panchami',
        tithiHi: 'कार्तिक शुक्ल पंचमी',
        description: 'Vratis observe a strict Nirjala (waterless) fast throughout the day. At sunset, an earthen oven is lit using mango wood to prepare kheer and chapati.',
        descriptionHi: 'दिनभर निर्जला उपवास रखा जाता है। सूर्यास्त के बाद मिट्टी के चूल्हे पर आम की लकड़ी से गुड़ की खीर (रसियाव) और रोटी बनाकर सूर्यदेव को भोग लगाया जाता है।',
        rituals: [
          'Day-long waterless fast',
          'Evening preparation of Rasiya-Kheer using pure milk and sugarcane jaggery',
          'Surya dhyana and breaking fast once in absolute silence, commencing the 36-hour continuous fast',
        ],
        ritualsHi: [
          'दिनभर निर्जला व्रत का पालन',
          'मिट्टी के नए चूल्हे पर गुड़, गाय के दूध व चावल की खीर बनाना',
          'सूर्यदेव को भोग लगाकर एकांत में प्रसाद ग्रहण; इसके बाद 36 घंटे का अखण्ड निर्जला व्रत आरम्भ',
        ],
        prasad: 'Rasiya (Jaggery-milk kheer) and whole-wheat roti with bananas',
        prasadHi: 'गुड़ की खीर (रसियाव), घी लगी रोटी व केला',
      },
      {
        dayNumber: 3,
        name: 'Sandhya Arghya (Evening River Offering)',
        nameHi: 'सन्ध्या अर्घ्य (पहला अर्घ्य · अस्ताचल सूर्य)',
        tithi: 'Kartik Shukla Shashthi',
        tithiHi: 'कार्तिक शुक्ल षष्ठी',
        description: 'The centerpiece riverbank ceremony. Vratis and families walk barefoot to the river or pond carrying woven bamboo baskets (Daura) filled with Thekua, sugarcane, and seasonal fruits.',
        descriptionHi: 'सायंकाल में व्रती सपरिवार बाँस के सूप और दौरा में ठेकुआ, गन्ना, नारियल व फल सजाकर नदी घाट पर पहुँचते हैं और कमर तक जल में खड़े होकर डूबते सूर्य को अर्घ्य देते हैं।',
        rituals: [
          'Preparation of sacred Thekua using whole wheat, ghee, and jaggery',
          'Standing waist-deep in flowing water facing west toward the setting Sun',
          'Offering milk and Ganga-jal arghya as the twilight descends',
        ],
        ritualsHi: [
          'गेहूँ, शुद्ध घी और गुड़ से पवित्र ठेकुआ प्रसाद बनाना',
          'पश्चिम दिशा की ओर मुख कर कमर तक जल में खड़े होना',
          'अस्ताचलगामी सूर्य को गाय के दूध और जल से तीन बार अर्घ्य देना',
        ],
        prasad: 'Thekua, fresh sugarcane, coconut, grapefruit, and sprouted grains',
        prasadHi: 'ठेकुआ, ईख (गन्ना), नारियल, डाभ नीम्बू व मौसमी फल',
      },
      {
        dayNumber: 4,
        name: 'Usha Arghya & Paran (Dawn Offering & Fast-Breaking)',
        nameHi: 'उषा अर्घ्य व पारण (दूसरा अर्घ्य · उदीयमान सूर्य)',
        tithi: 'Kartik Shukla Saptami',
        tithiHi: 'कार्तिक शुक्ल सप्तमी',
        description: 'Vratis gather at the riverbank before dawn. As the crimson crest of the rising Sun pierces the horizon, the final Arghya is poured with heartfelt gratitude, followed by breaking the fast.',
        descriptionHi: 'प्रातःकाल सूर्योदय से पूर्व नदी तट पर एकत्र होकर पूर्व दिशा में लालिमा प्रकट होते ही उदीयमान सूर्य को अर्घ्य दिया जाता है। इसके पश्चात् 36 घंटे का महाव्रत सम्पन्न होता है।',
        rituals: [
          'Pre-dawn gathering at the water’s edge facing east',
          'Offering milk-water Arghya to the rising Sun (Udaya Surya)',
          'Touching elders\' feet, distributing prasad to all seekers, and consuming raw ginger and water for Paran',
        ],
        ritualsHi: [
          'अरुणोदय काल में पूर्व दिशा की ओर मुख कर जल में प्रवेश',
          'उगते सूर्य को दूध और जल की धार से अंतिम अर्घ्य अर्पण',
          'ज्येष्ठों का आशीर्वाद, सर्वजन को प्रसाद वितरण, और अदरक-गुड़ से पारण',
        ],
        prasad: 'Raw ginger, soaked chana, Thekua, and sugarcane juice',
        prasadHi: 'अदरक, भीगा चना, ठेकुआ व गन्ने का रस',
      },
    ],
    mantras: [
      {
        title: 'Universal Surya Arghya Mantra',
        titleHi: 'सूर्य अर्घ्य महामन्त्र',
        sanskrit: 'ॐ एहि सूर्य सहस्रांशो तेजोराशे जगत्पते ।\nअनुकम्पय मां भक्त्या गृहाणार्घ्यं दिवाकर ॥',
        iast: 'oṃ ehi sūrya sahasrāṃśo tejorāśe jagatpate |\nanukampaya māṃ bhaktyā gṛhāṇārghyaṃ divākara ||',
        hindi: 'हे सहस्र किरणों वाले, तेज के भण्डार, सम्पूर्ण जगत् के स्वामी सूर्यदेव! मुझ भक्त पर कृपा कीजिए और मेरे इस अर्घ्य को स्वीकार कीजिए।',
        english: 'O radiant Lord Surya of thousands of rays, reservoir of splendour and master of the universe! Have compassion upon me through my devotion, and graciously accept this offering of Arghya, O creator of day.',
      },
      {
        title: 'Chhathi Maiya (Devi Shashthi) Dhyana Mantra',
        titleHi: 'षष्ठी देवी ध्यान मन्त्र',
        sanskrit: 'ॐ षष्ठी देव्यै नमस्तुभ्यं कार्तिकेयप्रियायै च ।\nपुत्रपौत्रप्रदे देवि जगन्मातर्नमोऽस्तु ते ॥',
        iast: 'oṃ ṣaṣṭhī devyai namastubhyaṃ kārtikeyapriyāyai ca |\nputrapautraprade devi jaganmātarnamo\'stu te ||',
        hindi: 'भगवान् कार्तिकेय की शक्ति स्वरूपा, पुत्र-पौत्र और आरोग्य प्रदान करने वाली जगज्जननी षष्ठी देवी (छठी मैया) को मेरा बारम्बार प्रणाम।',
        english: 'Salutations unto Goddess Shashthi (Chhathi Maiya), beloved of Lord Kartikeya, bestower of noble progeny, long life, and health, O Mother of the universe.',
      },
    ],
    guidelines: [
      'Absolute physical and mental cleanliness (Shaucha) is maintained across all four days.',
      'Puja offerings must never be touched with unwashed hands or tasted before the Arghya.',
      'The fast is completely non-violent; only pure wood, clay, and bamboo natural items are used.',
    ],
    guidelinesHi: [
      'चारों दिन अन्तःकरण और शरीर की परम शुद्धि रखी जाती है।',
      'पूजा का कोई भी फल या ठेकुआ झूठा न हो; अर्घ्य से पूर्व किसी के द्वारा भी चखा नहीं जाता।',
      'केवल बाँस के सूप, मिट्टी के दीये और पीतल के कलश का उपयोग किया जाता है।',
    ],
    crossLinks: [
      { label: 'Ravivara (Sunday) Planetary Day', labelHi: 'रविवार (वार दर्शिका)', href: '/panchang/varas/ravivara/' },
      { label: 'Aditya Hridaya Stotra', labelHi: 'आदित्य हृदय स्तोत्रम्', href: '/mantras/aditya-hridaya-stotra/' },
      { label: 'Navagraha Stotram', labelHi: 'नवग्रह स्तोत्रम्', href: '/mantras/navagraha-stotram/' },
    ],
  },
  {
    id: 'ratha-saptami',
    slug: 'ratha-saptami',
    name: 'Ratha Saptami (Surya Jayanti)',
    nameHi: 'रथ सप्तमी (सूर्य जयन्ती · माघ शुक्ल सप्तमी)',
    timing: 'Magha Shukla Saptami (January / February)',
    timingHi: 'माघ शुक्ल सप्तमी (आरोग्य सप्तमी)',
    astronomy: 'Marks the celestial moment when the Sun\'s golden chariot, drawn by seven horses (symbolizing the seven rays of light and seven Vedic metres: Gayatri, Ushnik, Anushtup, Brihati, Pankti, Trishtubh, Jagati), turns toward the northeast quadrant, heralding spring.',
    astronomyHi: 'खगोलीय दृष्टि से इस दिन सूर्य का रथ उत्तर-पूर्व दिशा की ओर मुड़ता है। सात घोड़े प्रकाश के सात रंगों (स्पेक्ट्रम) और वेदों के सात छन्दों के प्रतीक हैं।',
    significance: 'Celebrated as the cosmic birthday of Surya Bhagavan. Bathing at dawn with seven Arka (Calotropis) leaves on the body removes sins of seven lifetimes and protects against skin and eye ailments.',
    significanceHi: 'भगवान् सूर्य का प्राकट्य दिवस। इस दिन प्रातःकाल सिर पर सात आक (मदार) के पत्ते रखकर स्नान करने से सात जन्मों के संचित पाप नष्ट होते हैं और आरोग्य लाभ होता है।',
    deity: 'Lord Surya Narayana (Arogyakaraka)',
    deityHi: 'भगवान् सूर्यनारायण (आरोग्यदाता)',
    mantras: [
      {
        title: 'Ratha Saptami Snana Mantra',
        titleHi: 'रथ सप्तमी स्नान मन्त्र',
        sanskrit: 'नमस्ते रुद्ररूपाय रसानां पतये नमः ।\nवरुणाय नमस्तेऽस्तु हरिकेश नमोऽस्तु ते ॥\nसप्तसप्तिवह प्रीत सप्तलोकप्रदीपन ।\nसप्तमीसहितो देव गृहाणार्घ्यं दिवाकर ॥',
        iast: 'namaste rudrarūpāya rasānāṃ pataye namaḥ |\nvaruṇāya namaste\'stu harikeśa namo\'stu te ||\nsaptasaptivaha prīta saptalokapradīpana |\nsaptamīsahito deva gṛhāṇārghyaṃ divākara ||',
        hindi: 'हे रुद्रस्वरूप! हे रसों के स्वामी! आपको नमस्कार। हे सात घोड़ों के रथ पर विराजमान और सातों लोकों को प्रकाशित करने वाले सूर्यदेव! इस सप्तमी तिथि पर मेरा अर्घ्य स्वीकार कीजिए।',
        english: 'Salutations unto You who embody Rudra, lord of life-juices and radiant light! O driver of the seven steeds who illumines the seven worlds, on this sacred Saptami, graciously accept my Arghya, O Divine Sun.',
      },
    ],
    guidelines: [
      'Take a holy dip in a river, pond, or at home mixing Ganga-jal at Brahma Muhurta.',
      'Place 7 Arka (Erukku/Aak) leaves on the head, shoulders, and chest while bathing.',
      'Cook milk and rice kheer in an earthen pot directly exposed to the early morning sunrays.',
    ],
    guidelinesHi: [
      'ब्रह्ममुहूर्त में तीर्थ-जल या गंगाजल मिश्रित जल से स्नान करें।',
      'स्नान के समय मदार (आक) के 7 पत्ते सिर पर रखें।',
      'सूर्य की प्रातःकालीन धूप में मिट्टी के पात्र में गाय के दूध की खीर बनाएं।',
    ],
    crossLinks: [
      { label: 'Saptami Tithi Archetype', labelHi: 'सप्तमी तिथि (पञ्चाङ्ग)', href: '/panchang/tithis/saptami/' },
      { label: 'Ravivara Weekday', labelHi: 'रविवार विवरण', href: '/panchang/varas/ravivara/' },
      { label: 'Aditya Hridaya Stotra', labelHi: 'आदित्य हृदय स्तोत्रम्', href: '/mantras/aditya-hridaya-stotra/' },
    ],
  },
  {
    id: 'makar-sankranti',
    slug: 'makar-sankranti',
    name: 'Makar Sankranti (Uttarayana Transition)',
    nameHi: 'मकर संक्रान्ति (उत्तरायण पुण्यकाल)',
    timing: 'Solar transit into Makara Rashi (January 14/15)',
    timingHi: 'सूर्य का मकर राशि में प्रवेश (14/15 जनवरी)',
    astronomy: 'The tropical/sidereal solar ingress marking the commencement of Uttarayana—the Sun’s six-month northward celestial journey. In Vedic cosmology, Uttarayana represents the daytime of the devas (Daivika Ahoratra).',
    astronomyHi: 'सूर्य धनु राशि से मकर राशि में प्रवेश करते हैं। यहाँ से सूर्य की उत्तरायण यात्रा आरम्भ होती है, जिसे शास्त्रों में देवताओं का दिन कहा गया है।',
    significance: 'Celebrated across Bharat as Pongal, Uttarayan, Magh Bihu, and Khichdi. Sacred for Ganga snana, sesame (Til) and jaggery (Gud) charity, and honouring ancestors. Revered in the Mahabharata as the sacred hour Bhishma Pitamaha chose for his final departure.',
    significanceHi: 'सम्पूर्ण भारत में पोंगल, लोहड़ी, माघ बिहू और खिचड़ी के रूप में मान्य। तिल-गुड़ का दान, पवित्र नदियों में स्नान और सूर्योपासना से अन्तःकरण शुद्ध होता है। भीष्म पितामह ने देहत्याग के लिए इसी उत्तरायण काल की प्रतीक्षा की थी।',
    deity: 'Surya Narayana in Makara Ingress',
    deityHi: 'मकरस्थ सूर्यनारायण',
    mantras: [
      {
        title: 'Sankranti Surya Dhyana Shloka',
        titleHi: 'संक्रान्ति सूर्य ध्यान मन्त्र',
        sanskrit: 'ॐ आदित्याय विद्महे सहस्रकिरणाय धीमहि ।\nतन्नो सूर्यः प्रचोदयात् ॥\nभास्कराय विद्महे महाद्युतिकराय धीमहि ।\nतन्नो आदित्यः प्रचोदयात् ॥',
        iast: 'oṃ ādityāya vidmahe sahasrakiraṇāya dhīmahi |\ntanno sūryaḥ pracodayāt ||\nbhāskarāya vidmahe mahādyutikarāya dhīmahi |\ntanno ādityaḥ pracodayāt ||',
        hindi: 'हम सहस्र किरणों वाले भगवान् सूर्य का ध्यान करते हैं; वे परम ज्योतिर्मय आदित्य हमारी बुद्धि और चेतना को सन्मार्ग में प्रेरित करें।',
        english: 'We contemplate upon the Sun God of thousands of rays; may that supreme radiant Aditya inspire our intellect and illuminate our consciousness.',
      },
    ],
    guidelines: [
      'Take a holy dip in the morning during the Sankranti Punya Kala window.',
      'Donate sesame seeds (Til), jaggery (Gud), warm clothes, and food to the needy.',
      'Consume food prepared with new harvest grains and sesame for metabolic harmony.',
    ],
    guidelinesHi: [
      'संक्रान्ति के पुण्यकाल में नदी स्नान या तीर्थ-जल से स्नान करें।',
      'काले तिल, गुड़, कम्बल और खिचड़ी का दान करें।',
      'तिल-गुड़ का सेवन शीत ऋतु में स्वास्थ्य और ऊर्जा के लिए सर्वोत्तम माना गया है।',
    ],
    crossLinks: [
      { label: 'Festival Calendar 2026–2028', labelHi: 'त्योहार पञ्चाङ्ग (2026-2028)', href: '/panchang/calendar/' },
      { label: 'Ravivara Weekday', labelHi: 'रविवार दर्शिका', href: '/panchang/varas/ravivara/' },
    ],
  },
  {
    id: 'bhanu-saptami',
    slug: 'bhanu-saptami',
    name: 'Bhanu Saptami & Ravivara Vrata',
    nameHi: 'भानु सप्तमी एवं रविवार व्रत विधि',
    timing: 'When Shukla Saptami falls on a Ravivara (Sunday)',
    timingHi: 'जब शुक्ल सप्तमी और रविवार का दुर्लभ संयोग हो',
    astronomy: 'A celestial convergence where the 7th lunar arc (Saptami Tithi, governed by Surya) aligns precisely with the solar weekday (Ravivara), creating a 100-fold multiplier of solar vitalizing energy.',
    astronomyHi: 'सूर्य की तिथि (सप्तमी) और सूर्य के दिन (रविवार) का पावन संगम। इस दिन की गई सूर्योपासना सहस्र गुना अधिक फलदायी मानी गई है।',
    significance: 'Prescribed in the Bhavishya Purana for curing chronic skin, eye, and heart conditions, dissolving karmic debt (Rina Vimochana), and infusing unyielding soul vitality (Atma-bala).',
    significanceHi: 'भविष्य पुराण के अनुसार भानु सप्तमी के दिन नमक-रहित व्रत और आदित्य हृदय स्तोत्र के पाठ से असाध्य रोगों की निवृत्ति और नेत्र-तेज की वृद्धि होती है।',
    deity: 'Surya Narayana (Bhaskara / Bhanu)',
    deityHi: 'भानुदेव (सूर्यनारायण)',
    mantras: [
      {
        title: 'Dwadasa Surya Nama Stotra (12 Solar Names)',
        titleHi: 'द्वादश सूर्य नामावली',
        sanskrit: 'ॐ मित्राय नमः । ॐ रवये नमः । ॐ सूर्याय नमः । ॐ भानवे नमः ।\nॐ खगाय नमः । ॐ पूष्णे नमः । ॐ हिरण्यगर्भाय नमः । ॐ मरीचये नमः ।\nॐ आदित्याय नमः । ॐ सवित्रे नमः । ॐ अर्काय नमः । ॐ भास्कराय नमः ॥',
        iast: 'oṃ mitrāya namaḥ | oṃ ravaye namaḥ | oṃ sūryāya namaḥ | oṃ bhānave namaḥ |\noṃ khagāya namaḥ | oṃ pūṣṇe namaḥ | oṃ hiraṇyagarbhāya namaḥ | oṃ marīcaye namaḥ |\noṃ ādityāya namaḥ | oṃ savitre namaḥ | oṃ arkāya namaḥ | oṃ bhāskarāya namaḥ ||',
        hindi: 'मित्र, रवि, सूर्य, भानु, खग, पूषा, हिरण्यगर्भ, मरीचि, आदित्य, सविता, अर्क और भास्कर—इन बारह नामों से सूर्यदेव को प्रणाम।',
        english: 'Salutations to the 12 sacred names of Surya: Mitra (Friend), Ravi (Praiser), Surya (Stimulator), Bhanu (Luminous), Khaga (Sky-farer), Pushan (Nourisher), Hiranyagarbha (Golden Womb), Marichi (Ray of Light), Aditya (Son of Aditi), Savitr (Creator), Arka (Radiant), and Bhaskara (Illuminator).',
      },
    ],
    guidelines: [
      'Fast without salt (Alavana Vrata) throughout the day.',
      'Offer Arghya with red flowers, kumkum, and water in a copper vessel at sunrise.',
      'Recite the Aditya Hridaya Stotra three times facing east.',
    ],
    guidelinesHi: [
      'दिनभर बिना नमक का सात्त्विक भोजन एक बार दिन में ग्रहण करें।',
      'तांबे के लोटे में जल, लाल चन्दन और लाल पुष्प डालकर सूर्योदय के समय अर्घ्य दें।',
      'पूर्व दिशा की ओर मुख करके आदित्य हृदय स्तोत्र का तीन बार पाठ करें।',
    ],
    crossLinks: [
      { label: 'Ravivara 7th Limb Guide', labelHi: 'रविवार वासर दर्शिका', href: '/panchang/varas/ravivara/' },
      { label: 'Aditya Hridaya Stotra', labelHi: 'आदित्य हृदय स्तोत्रम्', href: '/mantras/aditya-hridaya-stotra/' },
      { label: 'Gayatri Mantra', labelHi: 'गायत्री मन्त्र', href: '/mantras/gayatri-mantra/' },
    ],
  },
];
