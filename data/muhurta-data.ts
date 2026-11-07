/**
 * Classical Vedic Muhurta & Panchanga-Shuddhi Decision Matrix Data
 * 
 * Based on canonical authorities:
 * - Muhūrta Cintāmaṇi by Daivajña Rāma
 * - Bṛhat Saṃhitā by Varāhamihira
 * - Kālāmṛta & Kālavidhāna
 * 
 * Strictly follows:
 * - ASCII digits 0-9 only (Zero Devanagari numerals)
 * - Accessible, dignified Hindi addressing reader as 'आप'
 * - Educational clarity emphasizing cosmic harmony rather than fatalism
 */

export interface TithiGroup {
  id: 'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna';
  name: string;
  nameHi: string;
  transliteration: string;
  ruler: string;
  rulerHi: string;
  tithiNumbers: number[]; // Shukla 1-15, Krishna 16-30
  meaning: string;
  meaningHi: string;
  suitableFor: string;
  suitableForHi: string;
  avoidFor: string;
  avoidForHi: string;
}

export const TITHI_GROUPS: TithiGroup[] = [
  {
    id: 'nanda',
    name: 'Nanda (Joyous / Ananda)',
    nameHi: 'नन्दा (आनन्ददायिनी)',
    transliteration: 'Nandā',
    ruler: 'Agni (Fire)',
    rulerHi: 'अग्निदेव',
    tithiNumbers: [1, 6, 11, 16, 21, 26], // Pratipada, Shashthi, Ekadashi
    meaning: 'Brings happiness, celebration, and spiritual upliftment.',
    meaningHi: 'हर्ष, उत्सव, कला, नवीन वस्त्र और आध्यात्मिक प्रगति के लिए उत्तम।',
    suitableFor: 'Celebrations, fine arts, music, wearing new garments, spiritual festivities.',
    suitableForHi: 'उत्सव, कला, संगीत, नवीन वस्त्र धारण एवं उत्सव अनुष्ठान।',
    avoidFor: 'Destructive activities, warfare, excavation.',
    avoidForHi: 'ध्वंसात्मक कार्य, विवाद या उग्र कर्म।',
  },
  {
    id: 'bhadra',
    name: 'Bhadra (Auspicious / Welfare)',
    nameHi: 'भद्रा (कल्याणमयी)',
    transliteration: 'Bhadrā',
    ruler: 'Prithvi (Earth)',
    rulerHi: 'पृथ्वी देवी',
    tithiNumbers: [2, 7, 12, 17, 22, 27], // Dwitiya, Saptami, Dwadashi
    meaning: 'Steady, grounded growth, governance, transport, and vows.',
    meaningHi: 'स्थिरता, विद्यारम्भ, वाहन क्रय, यात्रा और धर्मकार्यों के लिए फलदायी।',
    suitableFor: 'Commencing education, travel, entering vows, vehicle acquisition, trade.',
    suitableForHi: 'विद्यारम्भ, यात्रा, शपथ, वाहन क्रय और स्थायी कार्य।',
    avoidFor: 'Quick speculative actions, disputes.',
    avoidForHi: 'त्वरित सट्टा, अनैतिक वाद-विवाद।',
  },
  {
    id: 'jaya',
    name: 'Jaya (Victorious / Triumphant)',
    nameHi: 'जया (विजयप्रदा)',
    transliteration: 'Jayā',
    ruler: 'Kartikeya (Commander of the Gods)',
    rulerHi: 'भगवान् कार्तिकेय',
    tithiNumbers: [3, 8, 13, 18, 23, 28], // Tritiya, Ashtami, Trayodashi
    meaning: 'Bestows triumph over hurdles, courage, strategic resolution, and medicine.',
    meaningHi: 'बाधाओं पर विजय, रणनीति, चिकित्सा, साहस और शक्ति साधना के लिए प्रशस्त।',
    suitableFor: 'Overcoming obstacles, starting therapies, strategic ventures, legal defense.',
    suitableForHi: 'प्रतिस्पर्धा, शल्य चिकित्सा, औषधि सेवन, साहसिक उपक्रम।',
    avoidFor: 'Peacemaking requiring gentle compromise without firmness.',
    avoidForHi: 'अति कोमल संधियाँ जहाँ कठोरता से हानि हो।',
  },
  {
    id: 'rikta',
    name: 'Rikta (Empty / Hollow - Caution)',
    nameHi: 'रिक्ता (रिक्तताकारक · सावधानी)',
    transliteration: 'Riktā',
    ruler: 'Yama (Deity of Restraint & Duty)',
    rulerHi: 'यमराज / काली',
    tithiNumbers: [4, 9, 14, 19, 24, 29], // Chaturthi, Navami, Chaturdashi
    meaning: 'Inauspicious for major life beginnings or financial commitments; excellent for inner detox, pruning, and ascetic sadhana.',
    meaningHi: 'माङ्गलिक आरम्भ, विवाह, गृहप्रवेश और यात्रा के लिए वर्ज्य; शुद्धि, त्याग और शत्रुदमन के लिए उपयुक्त।',
    suitableFor: 'Pruning old habits, surgical procedures, detoxification, spiritual penance.',
    suitableForHi: 'पुरानी आदतों का त्याग, विषहरण, आत्म-संयम, उपवास और साधना।',
    avoidFor: 'Griha Pravesha, starting business, weddings, auspicious journeys, investments.',
    avoidForHi: 'गृहप्रवेश, नया व्यापार, विवाह, शुभ यात्रा और स्थायी निवेश।',
  },
  {
    id: 'purna',
    name: 'Purna (Complete / Fulfilled)',
    nameHi: 'पूर्णा (परिपूर्णतादायिनी)',
    transliteration: 'Pūrṇā',
    ruler: 'Brahmadeva / Chandra',
    rulerHi: 'ब्रह्मा जी एवं चन्द्रदेव',
    tithiNumbers: [5, 10, 15, 20, 25, 30], // Panchami, Dashami, Purnima, Amavasya
    meaning: 'Wholeness, maturity, coronation, sacred rituals, and general prosperity (Amavasya is specifically reserved for Pitru Tarpana).',
    meaningHi: 'सम्पूर्णता, गृहप्रवेश, मङ्गल कार्य और यज्ञ-अनुष्ठान। (अमावस्या विशेषतः पितृ-तर्पण के लिए आरक्षित है)।',
    suitableFor: 'Sacred ceremonies, foundation laying, royal/civic initiations, celebrations.',
    suitableForHi: 'यज्ञ, अनुष्ठान, गृहप्रवेश, नया पदभार ग्रहण।',
    avoidFor: 'Speculative rashness or unconsidered ventures.',
    avoidForHi: 'बिना विचार किए जल्दबाजी में किया गया निर्णय।',
  },
];

export interface NakshatraSwabhava {
  type: 'Dhruva (Fixed)' | 'Chara (Movable)' | 'Kshipra (Swift)' | 'Mridu (Soft)' | 'Ugra (Fierce)' | 'Tikshna (Sharp)' | 'Mishra (Mixed)';
  typeHi: string;
  nakshatras: string[];
  nakshatraIndices: number[]; // 1-27
  suitableFor: string;
  suitableForHi: string;
}

export const NAKSHATRA_SWABHAVAS: NakshatraSwabhava[] = [
  {
    type: 'Dhruva (Fixed)',
    typeHi: 'ध्रुव (स्थिर)',
    nakshatras: ['Rohini', 'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada'],
    nakshatraIndices: [4, 12, 21, 26],
    suitableFor: 'Griha Pravesha, laying foundation stones, permanent installations, planting trees, long-term vows.',
    suitableForHi: 'गृहप्रवेश, नींव रखना, दीर्घकालिक निवेश, वृक्षारोपण और स्थायी धार्मिक संकल्प।',
  },
  {
    type: 'Chara (Movable)',
    typeHi: 'चर (गतिशील)',
    nakshatras: ['Punarvasu', 'Swati', 'Shravana', 'Dhanishtha', 'Shatabhisha'],
    nakshatraIndices: [7, 15, 22, 23, 24],
    suitableFor: 'Journeys, vehicle purchase, change of residence, pilgrimages, initiating mobile technology.',
    suitableForHi: 'यात्रा, वाहन क्रय, तीर्थाटन, स्थान परिवर्तन और गतिशील कार्य।',
  },
  {
    type: 'Kshipra (Swift)',
    typeHi: 'क्षिप्र (लघु · त्वरित)',
    nakshatras: ['Ashwini', 'Pushya', 'Hasta'],
    nakshatraIndices: [1, 8, 13],
    suitableFor: 'Starting education, medical treatment, trade agreements, arts, loan repayment, jewelry crafting.',
    suitableForHi: 'विद्यारम्भ, औषधि सेवन, व्यापारिक समझौते, कला-कौशल, आभूषण निर्माण।',
  },
  {
    type: 'Mridu (Soft)',
    typeHi: 'मृदु (मैत्र · कोमल)',
    nakshatras: ['Mrigashira', 'Chitra', 'Anuradha', 'Revati'],
    nakshatraIndices: [5, 14, 17, 27],
    suitableFor: 'Friendships, learning sacred music, fine arts, wearing new clothes, sacred sacraments.',
    suitableForHi: 'मित्रता, संगीत, ललित कला, नवीन वस्त्र धारण और मांगलिक संस्कार।',
  },
  {
    type: 'Ugra (Fierce)',
    typeHi: 'उग्र (क्रूर)',
    nakshatras: ['Bharani', 'Magha', 'Purva Phalguni', 'Purva Ashadha', 'Purva Bhadrapada'],
    nakshatraIndices: [2, 10, 11, 20, 25],
    suitableFor: 'Demolition, defensive battles, spiritual purification, cutting ties, research into deep mysteries.',
    suitableForHi: 'जीर्ण-शीर्ण वस्तुओं का त्याग, सुरक्षात्मक कार्य, शोध और तपस्या।',
  },
  {
    type: 'Tikshna (Sharp)',
    typeHi: 'तीक्ष्ण (दारुण)',
    nakshatras: ['Ardra', 'Ashlesha', 'Jyeshtha', 'Mula'],
    nakshatraIndices: [6, 9, 18, 19],
    suitableFor: 'Tantric restraint, breaking addictions, severing negative habits, protective amulets.',
    suitableForHi: 'व्यसन मुक्ति, नकारात्मक संस्कारों का छेदन, सुरक्षात्मक साधना।',
  },
  {
    type: 'Mishra (Mixed)',
    typeHi: 'मिश्र (साधारण)',
    nakshatras: ['Krittika', 'Vishakha'],
    nakshatraIndices: [3, 16],
    suitableFor: 'Fire rituals (Homa/Yajna), furnace/foundry work, purchasing tools or metallurgical equipment.',
    suitableForHi: 'यज्ञ, अग्निहोत्र, भट्टी और धातु संबंधी कार्य।',
  },
];

export interface MuhurtaEndeavor {
  id: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  icon: string;
  favorableTithis: string[];
  favorableTithiIds: Array<'nanda' | 'bhadra' | 'jaya' | 'rikta' | 'purna'>;
  favorableVaras: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  favorableNakshatras: string[];
  favorableSwabhavas: string[];
  prohibitedKaranas: string[];
  prohibitedYogas: string[];
  scripturalPrinciple: string;
  scripturalPrincipleHi: string;
  tips: string[];
  tipsHi: string[];
}

export const MUHURTA_ENDEAVORS: MuhurtaEndeavor[] = [
  {
    id: 'vidya-arambha',
    name: 'Vidya-Arambha (Education & Learning Initiation)',
    nameHi: 'विद्यारम्भ संस्कार एवं नवीन अध्ययन',
    tagline: 'Commencing formal schooling, Vedic study, arts, or higher research.',
    taglineHi: 'अक्षरारम्भ, वेद अध्ययन, शास्त्र चिन्तन और उच्च शिक्षा का शुभारम्भ।',
    icon: '📚',
    favorableTithis: ['Dwitiya (2)', 'Tritiya (3)', 'Panchami (5)', 'Saptami (7)', 'Dashami (10)', 'Ekadashi (11)', 'Trayodashi (13)'],
    favorableTithiIds: ['nanda', 'bhadra', 'purna'],
    favorableVaras: [1, 3, 4, 5], // Monday, Wednesday, Thursday, Friday
    favorableNakshatras: ['Ashwini', 'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Chitra', 'Swati', 'Anuradha', 'Revati'],
    favorableSwabhavas: ['Kshipra (Swift)', 'Mridu (Soft)', 'Chara (Movable)'],
    prohibitedKaranas: ['Vishti (Bhadra)'],
    prohibitedYogas: ['Vaidhriti', 'Vyatipata', 'Shula', 'Ganda', 'Atiganda'],
    scripturalPrinciple: 'In Muhurta Chintamani, Mercury (intellect), Jupiter (wisdom), and Venus (refined arts) make their days sovereign for learning. Rikta tithis (4, 9, 14) and Amavasya (30) are traditionally non-study days (Anadhyaya).',
    scripturalPrincipleHi: 'मुहूर्त चिन्तामणि के अनुसार बुध (बुद्धि), गुरु (ज्ञान) और शुक्र (कला) के वार विद्यारम्भ के लिए सर्वोत्तम हैं। रिक्ता तिथियाँ (4, 9, 14) और अमावस्या को पारम्परिक रूप से अनध्याय (नया पाठ आरम्भ न करने का दिन) माना गया है।',
    tips: [
      'Thursday (Devaguru) is supreme for sacred theology, philosophy, and languages.',
      'Wednesday (Budha) is ideal for mathematics, logic, coding, and commerce.',
      'Friday (Shukra) excels for music, visual arts, and design.',
      'Pushya and Hasta nakshatras bestow swift absorption and retention (Dharana-shakti).',
    ],
    tipsHi: [
      'गुरुवार दर्शन, वेद और भाषा के अध्ययन के लिए सर्वश्रेष्ठ है।',
      'बुधवार गणित, तर्क, कोडिंग और वाणिज्य के लिए उत्तम है।',
      'शुक्रवार संगीत, चित्रकला और दृश्य कला के लिए फलदायी है।',
      'पुष्य और हस्त नक्षत्र में आरम्भ की गई विद्या शीघ्र आत्मसात् होती है।',
    ],
  },
  {
    id: 'griha-pravesha',
    name: 'Griha-Pravesha (Entering a New Residence)',
    nameHi: 'गृहप्रवेश (नूतन एवं जीर्ण गृह प्रवेश)',
    tagline: 'Entering a newly built home, renovated residence, or long-term dwelling.',
    taglineHi: 'वास्तु शान्ति, कलश स्थापना और नए घर में प्रथम प्रवेश।',
    icon: '🏡',
    favorableTithis: ['Dwitiya (2)', 'Tritiya (3)', 'Panchami (5)', 'Saptami (7)', 'Dashami (10)', 'Ekadashi (11)', 'Trayodashi (13)'],
    favorableTithiIds: ['bhadra', 'purna', 'nanda'],
    favorableVaras: [1, 3, 4, 5], // Monday, Wednesday, Thursday, Friday
    favorableNakshatras: ['Rohini', 'Mrigashira', 'Uttara Phalguni', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    favorableSwabhavas: ['Dhruva (Fixed)', 'Mridu (Soft)'],
    prohibitedKaranas: ['Vishti (Bhadra)', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'],
    prohibitedYogas: ['Vyatipata', 'Vaidhriti', 'Shula', 'Vajra', 'Parigha'],
    scripturalPrinciple: 'Brihat Samhita emphasizes Fixed (Dhruva) nakshatras for longevity and prosperity in home entry. Tuesday (Mangala) and Sunday (Ravivara) are traditionally avoided for Apoorva (new) Griha Pravesha.',
    scripturalPrincipleHi: 'वृहत्संहिता के अनुसार स्थिर (ध्रुव) नक्षत्र गृहप्रवेश के लिए अनिवार्य हैं ताकि परिवार में स्थिरता, आरोग्य और समृद्धि बनी रहे। मंगलवार और रविवार को नूतन गृहप्रवेश से बचना चाहिए।',
    tips: [
      'Shukla Paksha (waxing moon) is deeply preferred for Apoorva (first-ever) Griha Pravesha.',
      'Rohini and the three Uttaras (Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada) are the golden anchors of stability.',
      'Never perform Griha Pravesha when the Sun is transiting in Pausha (Dhanu/Makar junction) or during Malamasa (Adhik Maas).',
      'The presence of Vishti (Bhadra) karana must be strictly avoided during entry.',
    ],
    tipsHi: [
      'शुक्ल पक्ष में किया गया गृहप्रवेश समृद्धि और शान्ति बढ़ाता है।',
      'रोहिणी और तीनों उत्तरा नक्षत्र स्थिरता के सर्वोच्च स्तम्भ हैं।',
      'मलमास (अधिक मास) और भद्रा काल में गृहप्रवेश सर्वथा वर्जित है।',
      'प्रवेश के समय ईशान कोण (उत्तर-पूर्व) में मङ्गल कलश स्थापित करें।',
    ],
  },
  {
    id: 'yatra',
    name: 'Yatra (Travel, Pilgrimage & Departure)',
    nameHi: 'यात्रा एवं तीर्थाटन प्रस्थान',
    tagline: 'Starting a distant journey, pilgrimage, relocation, or business expedition.',
    taglineHi: 'तीर्थ यात्रा, विदेश यात्रा और महत्वपूर्ण व्यावसायिक यात्रा का समय निर्धारण।',
    icon: '✈️',
    favorableTithis: ['Dwitiya (2)', 'Tritiya (3)', 'Panchami (5)', 'Saptami (7)', 'Dashami (10)', 'Ekadashi (11)', 'Trayodashi (13)'],
    favorableTithiIds: ['bhadra', 'nanda', 'jaya'],
    favorableVaras: [1, 3, 4, 5], // Monday, Wednesday, Thursday, Friday
    favorableNakshatras: ['Ashwini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta', 'Anuradha', 'Shravana', 'Dhanishtha', 'Revati'],
    favorableSwabhavas: ['Chara (Movable)', 'Kshipra (Swift)', 'Mridu (Soft)'],
    prohibitedKaranas: ['Vishti (Bhadra)'],
    prohibitedYogas: ['Vyatipata', 'Vaidhriti', 'Atiganda'],
    scripturalPrinciple: 'Disha Shula (directional needle) and Chara (movable) nakshatras determine swift and obstacle-free journeys. Movable nakshatras ensure safety on water, land, and air.',
    scripturalPrincipleHi: 'मुहूर्त शास्त्र में चर (गतिशील) और लघु नक्षत्र यात्रा के लिए प्रशस्त हैं। दिशा-शूल का ध्यान रखकर प्रस्थान करने से यात्रा निर्विघ्न और सफल होती है।',
    tips: [
      'Sunday & Friday: Disha Shula is in the West (avoid West departure if possible).',
      'Monday & Saturday: Disha Shula is in the East.',
      'Tuesday & Wednesday: Disha Shula is in the North.',
      'Thursday: Disha Shula is in the South.',
      'Abhijit Muhurta at midday neutralizes minor travel doshas across all days except Wednesday.',
    ],
    tipsHi: [
      'दिशा-शूल का ध्यान रखें: सोमवार/शनिवार को पूर्व, रविवार/शुक्रवार को पश्चिम, मंगल/बुध को उत्तर और गुरुवार को दक्षिण दिशा में शूल होता है।',
      'अभिजीत मुहूर्त में प्रस्थान करने से अधिकांश यात्रा दोष नष्ट हो जाते हैं।',
      'भद्रा (विष्टि करण) में यात्रा आरम्भ न करें।',
    ],
  },
  {
    id: 'vrata-sankalpa',
    name: 'Vrata Sankalpa (Spiritual Vows & Sadhana)',
    nameHi: 'व्रत सङ्कल्प एवं आध्यात्मिक साधना',
    tagline: 'Taking an ascetic vow, beginning 40-day japa, fasting, or deeksha.',
    taglineHi: 'एकादशी, प्रदोष, नवरात्र व्रत का सङ्कल्प एवं अनुष्ठान आरम्भ।',
    icon: '🕉️',
    favorableTithis: ['Pratipada (1)', 'Panchami (5)', 'Shashthi (6)', 'Ekadashi (11)', 'Trayodashi (13)', 'Purnima (15)'],
    favorableTithiIds: ['nanda', 'purna'],
    favorableVaras: [0, 1, 4], // Sunday (Sun), Monday (Shiva), Thursday (Guru)
    favorableNakshatras: ['Rohini', 'Pushya', 'Uttara Phalguni', 'Shravana', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Revati'],
    favorableSwabhavas: ['Dhruva (Fixed)', 'Chara (Movable)', 'Kshipra (Swift)'],
    prohibitedKaranas: ['Vishti (Bhadra)'],
    prohibitedYogas: ['Vyatipata', 'Vaidhriti'],
    scripturalPrinciple: 'Sankalpa requires purity of mind and cosmic alignment. Pushya is crowned the king of nakshatras for all spiritual austerities and mantra deeksha.',
    scripturalPrincipleHi: 'सङ्कल्प के लिए अन्तःकरण की शुद्धि और देव-कृपा आवश्यक है। पुष्य नक्षत्र को सभी साधनाओं और मन्त्र-दीक्षा के लिए नक्षत्रों का राजा कहा गया है।',
    tips: [
      'Brahma Muhurta (96 to 48 minutes before sunrise) is the unmatched cosmic window for spiritual sankalpa.',
      'Guruvara (Thursday) and Somavara (Monday) provide preceptor grace and mental equanimity.',
      'Ekadashi and Purnima carry natural energetic alignment for fasting and pranayama.',
    ],
    tipsHi: [
      'ब्रह्ममुहूर्त (सूर्योदय से 96 से 48 मिनट पूर्व) सङ्कल्प के लिए सर्वोत्तम है।',
      'गुरुवार और सोमवार आत्म-चिन्तन और मन्त्र-जप के लिए शान्तिप्रद हैं।',
      'एकादशी और पूर्णिमा प्राकृतिक रूप से उपवास और ध्यान के अनुकूल हैं।',
    ],
  },
  {
    id: 'nutan-karya',
    name: 'Nutan Karya (Starting an Enterprise, Venture or Signing Deeds)',
    nameHi: 'नूतन कार्य, व्यापार शुभारम्भ एवं अनुबन्ध',
    tagline: 'Launching a business, signing agreements, commercial transactions, or public launch.',
    taglineHi: 'नया प्रतिष्ठान खोलना, कम्पनी निबन्धन, वित्तीय निवेश और मुख्य अनुबन्ध।',
    icon: '✨',
    favorableTithis: ['Dwitiya (2)', 'Tritiya (3)', 'Panchami (5)', 'Saptami (7)', 'Dashami (10)', 'Ekadashi (11)', 'Trayodashi (13)'],
    favorableTithiIds: ['bhadra', 'jaya', 'purna'],
    favorableVaras: [1, 3, 4, 5], // Monday, Wednesday, Thursday, Friday
    favorableNakshatras: ['Ashwini', 'Rohini', 'Pushya', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Anuradha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Revati'],
    favorableSwabhavas: ['Dhruva (Fixed)', 'Kshipra (Swift)', 'Chara (Movable)'],
    prohibitedKaranas: ['Vishti (Bhadra)', 'Shakuni', 'Chatushpada'],
    prohibitedYogas: ['Vyatipata', 'Vaidhriti', 'Shula', 'Ganda'],
    scripturalPrinciple: 'Commercial ventures prosper under the combined grace of Mercury (Budha) for transaction speed and Jupiter (Guru) for ethical endurance and wealth.',
    scripturalPrincipleHi: 'वाणिज्यिक उपक्रमों में बुध का वाक्-कौशल और गुरु का धर्मनिष्ठ स्थायित्व समृद्धि प्रदान करता है। रिक्ता तिथियों में नया व्यापार आरम्भ करने से हानि की सम्भावना रहती है।',
    tips: [
      'Avoid Rahu Kalam strictly for the signing of agreements or ribbon cutting.',
      'Shukla Paksha is strongly recommended for ventures requiring organic expansion.',
      'Pushya falling on a Thursday (Guru-Pushya Yoga) or Sunday (Ravi-Pushya) creates a mahayoga for purchases and business.',
    ],
    tipsHi: [
      'अनुबन्ध पर हस्ताक्षर या दुकान के उद्घाटन के समय राहुकाल का त्याग करें।',
      'गुरु-पुष्य और रवि-पुष्य योग नए व्यापार के लिए महाफलदायी होते हैं।',
      'रिक्ता तिथियों (4, 9, 14) में पूँजी निवेश करने से बचें।',
    ],
  },
  {
    id: 'aushadha-sevana',
    name: 'Aushadha Sevana (Commencing Medical Healing & Therapy)',
    nameHi: 'औषध सेवन एवं स्वास्थ्य चिकित्सा आरम्भ',
    tagline: 'Starting a new Ayurvedic regimen, long-term medication, wellness cure, or surgery.',
    taglineHi: 'रोग निवारण हेतु नई औषधि आरम्भ करना, कायाकल्प चिकित्सा और स्वास्थ्य लाभ।',
    icon: '🌿',
    favorableTithis: ['Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Panchami (5)', 'Saptami (7)', 'Dashami (10)', 'Ekadashi (11)'],
    favorableTithiIds: ['nanda', 'bhadra'],
    favorableVaras: [0, 1, 3, 4], // Sunday (Surya - Arogya), Monday (Soma - herbs), Wednesday, Thursday
    favorableNakshatras: ['Ashwini', 'Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Chitra', 'Anuradha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Revati'],
    favorableSwabhavas: ['Kshipra (Swift)', 'Chara (Movable)'],
    prohibitedKaranas: ['Vishti (Bhadra)'],
    prohibitedYogas: ['Vyatipata', 'Vaidhriti'],
    scripturalPrinciple: 'Ashwini (governed by the Ashwini Kumaras, divine celestial physicians) and Sunday (Surya, lord of vital health) are pre-eminent for healing.',
    scripturalPrincipleHi: 'अश्विनी नक्षत्र (देव-चिकित्सक अश्विनीकुमारों का नक्षत्र) और रविवार (आरोग्यदाता सूर्यदेव का दिन) औषधि सेवन और स्वास्थ्य लाभ के लिए सर्वोत्तम हैं।',
    tips: [
      'Invoke Dhanvantari Bhagavan or chant the Maha Mrityunjaya Mantra before taking the first dose.',
      'Shatabhisha Nakshatra (symbolized by a hundred physicians) is renowned for curing chronic imbalances.',
      'Avoid starting gentle medicines during fierce (Ugra) nakshatras unless it is emergency surgery.',
    ],
    tipsHi: [
      'प्रथम खुराक लेने से पहले भगवान् धन्वन्तरि का स्मरण करें।',
      'शतभिषा नक्षत्र (सौ वैद्यों का प्रतीक) जीर्ण रोगों की चिकित्सा के लिए श्रेष्ठ है।',
      'आपातकालीन स्थिति में किसी मुहूर्त की प्रतीक्षा न करें—तत्काल चिकित्सा ही धर्म है।',
    ],
  },
];

export interface MuhurtaEvaluationFactor {
  limb: 'tithi' | 'vara' | 'nakshatra' | 'karana' | 'yoga';
  name: string;
  nameHi: string;
  status: 'positive' | 'warning' | 'negative';
  description: string;
  descriptionHi: string;
}

export interface MuhurtaEvaluation {
  endeavor: MuhurtaEndeavor;
  compatibility: 'highly-favorable' | 'favorable' | 'neutral' | 'caution' | 'inauspicious';
  score: number; // 0 to 100
  label: string;
  labelHi: string;
  summary: string;
  summaryHi: string;
  factors: MuhurtaEvaluationFactor[];
  remedy?: string;
  remedyHi?: string;
}

/**
 * Calculates Rahu Kalam window for a given weekday based on 6:00 AM – 6:00 PM standard day.
 * Actual times shift with local sunrise and sunset (eighth part).
 */
export function getStandardRahuKalam(dayOfWeekIndex: number): { window: string; windowHi: string; part: number } {
  // Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const schedule: Record<number, { window: string; windowHi: string; part: number }> = {
    0: { window: '04:30 PM – 06:00 PM', windowHi: 'अपराह्न 04:30 से 06:00 बजे तक', part: 8 },
    1: { window: '07:30 AM – 09:00 AM', windowHi: 'प्रातः 07:30 से 09:00 बजे तक', part: 2 },
    2: { window: '03:00 PM – 04:30 PM', windowHi: 'अपराह्न 03:00 से 04:30 बजे तक', part: 7 },
    3: { window: '12:00 PM – 01:30 PM', windowHi: 'मध्याह्न 12:00 से 01:30 बजे तक', part: 5 },
    4: { window: '01:30 PM – 03:00 PM', windowHi: 'अपराह्न 01:30 से 03:00 बजे तक', part: 6 },
    5: { window: '10:30 AM – 12:00 PM', windowHi: 'पूर्वाह्न 10:30 से 12:00 बजे तक', part: 4 },
    6: { window: '09:00 AM – 10:30 AM', windowHi: 'प्रातः 09:00 से 10:30 बजे तक', part: 3 },
  };
  return schedule[dayOfWeekIndex] || schedule[0];
}

/**
 * Evaluates an endeavor against a specific Panchanga configuration
 */
export function evaluateEndeavorMuhurta(
  endeavor: MuhurtaEndeavor,
  tithiNumber: number, // 1 to 30
  varaIndex: number,   // 0 to 6
  nakshatraIndex: number, // 1 to 27
  karanaName: string,
  yogaName: string,
): MuhurtaEvaluation {
  let score = 50;
  const factors: MuhurtaEvaluationFactor[] = [];

  // 1. TITHI EVALUATION
  const tithiGroup = TITHI_GROUPS.find((g) => g.tithiNumbers.includes(tithiNumber));
  const isRikta = tithiGroup?.id === 'rikta';
  const isAmavasya = tithiNumber === 30;

  if (isRikta && endeavor.id !== 'aushadha-sevana') {
    score -= 25;
    factors.push({
      limb: 'tithi',
      name: `Rikta Tithi (${tithiGroup?.nameHi || 'रिक्ता'})`,
      nameHi: `रिक्ता तिथि (${tithiGroup?.nameHi || 'रिक्ता'})`,
      status: 'negative',
      description: 'Rikta tithis (4, 9, 14) are classified as hollow/empty in classical texts; traditionally avoided for auspicious beginnings.',
      descriptionHi: 'रिक्ता तिथियों (चतुर्थी, नवमी, चतुर्दशी) में मांगलिक व नवीन कार्य आरम्भ करने से बचने का निर्देश है।',
    });
  } else if (isAmavasya && endeavor.id !== 'vrata-sankalpa') {
    score -= 20;
    factors.push({
      limb: 'tithi',
      name: 'Amavasya (अमावस्या)',
      nameHi: 'अमावस्या तिथि',
      status: 'warning',
      description: 'Amavasya is dedicated to Pitru Tarpana and inner stillness rather than starting outward material projects.',
      descriptionHi: 'अमावस्या पितृ-तर्पण और आत्म-शुद्धि का दिन है; नए भौतिक कार्यों के लिए कम अनुकूल मानी जाती है।',
    });
  } else if (tithiGroup && endeavor.favorableTithiIds.includes(tithiGroup.id)) {
    score += 15;
    factors.push({
      limb: 'tithi',
      name: `${tithiGroup.nameHi} तिथि`,
      nameHi: `${tithiGroup.nameHi} तिथि`,
      status: 'positive',
      description: `${tithiGroup.name} harmonizes with this activity's goals (${tithiGroup.suitableFor}).`,
      descriptionHi: `यह तिथि इस कार्य की प्रकृति के अनुकूल और पोषक है (${tithiGroup.suitableForHi})।`,
    });
  } else {
    factors.push({
      limb: 'tithi',
      name: 'तटस्थ तिथि (Neutral Tithi)',
      nameHi: 'तटस्थ तिथि',
      status: 'positive',
      description: 'Neither strongly favored nor strictly prohibited for this activity.',
      descriptionHi: 'इस कार्य के लिए यह तिथि सामान्य और दोष-रहित है।',
    });
  }

  // 2. VARA EVALUATION
  if (endeavor.favorableVaras.includes(varaIndex)) {
    score += 15;
    factors.push({
      limb: 'vara',
      name: 'अनुकूल वार (Auspicious Weekday)',
      nameHi: 'अनुकूल वार',
      status: 'positive',
      description: 'The ruling graha of this weekday empowers this endeavor.',
      descriptionHi: 'इस दिन का अधिष्ठाता ग्रह इस कार्य की सिद्धि में सहायक है।',
    });
  } else if (varaIndex === 2 && endeavor.id === 'griha-pravesha') {
    // Mangalavara for Griha Pravesha
    score -= 20;
    factors.push({
      limb: 'vara',
      name: 'मंगलवार (Tuesday Caution)',
      nameHi: 'मंगलवार (गृहप्रवेश में वर्ज्य)',
      status: 'negative',
      description: 'Tuesday (Mangala) is considered too fiery/agitated for entering a peaceful family dwelling.',
      descriptionHi: 'मंगलवार को गृहप्रवेश के लिए उग्र माना गया है; शांत वारों को प्राथमिकता दें।',
    });
  } else {
    factors.push({
      limb: 'vara',
      name: 'सामान्य वार (Neutral Weekday)',
      nameHi: 'सामान्य वार',
      status: 'positive',
      description: 'Moderate weekday influence with no severe dosha.',
      descriptionHi: 'यह वार इस कार्य के लिए सामान्य प्रभाव रखता है।',
    });
  }

  // 3. NAKSHATRA EVALUATION
  const swabhava = NAKSHATRA_SWABHAVAS.find((s) => s.nakshatraIndices.includes(nakshatraIndex));
  if (swabhava && endeavor.favorableSwabhavas.some((fav) => swabhava.type.startsWith(fav.split(' ')[0]))) {
    score += 15;
    factors.push({
      limb: 'nakshatra',
      name: `${swabhava.typeHi} नक्षत्र`,
      nameHi: `${swabhava.typeHi} नक्षत्र`,
      status: 'positive',
      description: `Nakshatra category (${swabhava.type}) specifically aligns with ${endeavor.name}.`,
      descriptionHi: `नक्षत्र का स्वभाव (${swabhava.typeHi}) इस कार्य की प्रकृति के सर्वथा अनुरूप है।`,
    });
  } else if (swabhava && (swabhava.type.startsWith('Ugra') || swabhava.type.startsWith('Tikshna')) && endeavor.id !== 'aushadha-sevana') {
    score -= 15;
    factors.push({
      limb: 'nakshatra',
      name: `${swabhava.typeHi} नक्षत्र (Caution)`,
      nameHi: `${swabhava.typeHi} नक्षत्र (सावधानी)`,
      status: 'warning',
      description: 'Fierce or sharp nakshatras are best reserved for defensive actions, detox, and breaking obstacles.',
      descriptionHi: 'उग्र या तीक्ष्ण नक्षत्र शांत और रचनात्मक कार्यों के लिए मध्यम माने जाते हैं।',
    });
  } else {
    factors.push({
      limb: 'nakshatra',
      name: 'सामान्य नक्षत्र (Neutral Nakshatra)',
      nameHi: 'सामान्य नक्षत्र',
      status: 'positive',
      description: 'Acceptable lunar mansion for standard duties.',
      descriptionHi: 'नक्षत्र का प्रभाव संतुलित है।',
    });
  }

  // 4. KARANA EVALUATION (VISHTI / BHADRA CHECK)
  const isVishti = karanaName.toLowerCase().includes('vishti');
  if (isVishti && endeavor.prohibitedKaranas.some((k) => k.toLowerCase().includes('vishti'))) {
    score -= 30;
    factors.push({
      limb: 'karana',
      name: 'विष्टि करण (भद्रा · Vishti / Bhadra)',
      nameHi: 'विष्टि करण (भद्रा)',
      status: 'negative',
      description: 'Vishti (Bhadra) is strongly prohibited in classical Muhurta texts for auspicious ceremonies, travel, and beginnings.',
      descriptionHi: 'भद्रा (विष्टि करण) में कोई भी मांगलिक आरम्भ, यात्रा या गृहप्रवेश शास्त्रतः वर्जित है।',
    });
  } else {
    factors.push({
      limb: 'karana',
      name: `${karanaName} करण (Auspicious Karana)`,
      nameHi: `${karanaName} करण (दोष-मुक्त)`,
      status: 'positive',
      description: 'The active half-tithi karana is free from the Vishti dosha.',
      descriptionHi: 'यह करण भद्रा दोष से मुक्त और कार्य के लिए शुभ है।',
    });
  }

  // 5. YOGA EVALUATION
  const isVarjyaYoga = endeavor.prohibitedYogas.some((y) => yogaName.toLowerCase().includes(y.toLowerCase()));
  if (isVarjyaYoga) {
    score -= 15;
    factors.push({
      limb: 'yoga',
      name: `${yogaName} योग (Inauspicious Yoga)`,
      nameHi: `${yogaName} योग (सावधानी)`,
      status: 'warning',
      description: `${yogaName} is counted among the sensitive or adverse solar-lunar yogas requiring remedial awareness.`,
      descriptionHi: `${yogaName} योग संवेदनशील माना जाता है; इस समय विशेष सतर्कता अपेक्षित है।`,
    });
  } else {
    factors.push({
      limb: 'yoga',
      name: `${yogaName} योग (Favorable Yoga)`,
      nameHi: `${yogaName} योग (शुभ योग)`,
      status: 'positive',
      description: 'Favorable solar-lunar angular combination supporting steady outcome.',
      descriptionHi: 'सूर्य-चन्द्र का यह योग कार्य की सफलता में सहायक है।',
    });
  }

  // Clamp score between 10 and 95
  const finalScore = Math.max(10, Math.min(95, score));

  let compatibility: MuhurtaEvaluation['compatibility'] = 'neutral';
  let label = 'Moderate (मध्यम)';
  let labelHi = 'मध्यम (साधारण फलप्रद)';
  let summary = 'A balanced time window with standard planetary support.';
  let summaryHi = 'यह समय सामान्य कार्यों के लिए उपयुक्त है।';

  if (finalScore >= 75) {
    compatibility = 'highly-favorable';
    label = 'Highly Auspicious (अति शुभ)';
    labelHi = 'अति शुभ (उत्कृष्ट मुहूर्त)';
    summary = 'Multiple primary limbs (Pancha-Angas) harmonize powerfully with this endeavor.';
    summaryHi = 'पञ्चाङ्ग के प्रमुख अङ्ग इस कार्य के लिए अत्यधिक अनुकूल और बलशाली हैं।';
  } else if (finalScore >= 60) {
    compatibility = 'favorable';
    label = 'Auspicious (शुभ)';
    labelHi = 'शुभ (अनुकूल)';
    summary = 'Favorable planetary and tithi configuration; good for proceeding.';
    summaryHi = 'यह समय इस कार्य के लिए शुभ और फलदायी है।';
  } else if (finalScore <= 35) {
    compatibility = 'inauspicious';
    label = 'Avoid / Inauspicious (वर्ज्य)';
    labelHi = 'वर्ज्य (त्याज्य समय)';
    summary = 'Significant classical constraints (e.g. Vishti/Bhadra, Rikta tithi, or severe weekday conflict) suggest waiting for a more auspicious window.';
    summaryHi = 'भद्रा, रिक्ता तिथि अथवा ग्रह-दोष के कारण इस समय नया आरम्भ करने से बचना श्रेयस्कर है।';
  } else if (finalScore <= 45) {
    compatibility = 'caution';
    label = 'Exercise Caution (सावधानी)';
    labelHi = 'सावधानी अपेक्षित (मध्यम-न्यून)';
    summary = 'Minor planetary friction observed; if urgent, utilize the Abhijit Muhurta window or seek spiritual sankalpa remedies.';
    summaryHi = 'कुछ ग्रहीय बाधाएँ हैं; यदि कार्य अति आवश्यक हो तो अभिजीत मुहूर्त का लाभ लें।';
  }

  return {
    endeavor,
    compatibility,
    score: finalScore,
    label,
    labelHi,
    summary,
    summaryHi,
    factors,
    remedy: finalScore < 60 ? 'Perform Ganesha Smarana or chant the Gayatri / Maha Mrityunjaya mantra prior to commencing; or utilize local Abhijit Muhurta.' : undefined,
    remedyHi: finalScore < 60 ? 'कार्य आरम्भ से पूर्व भगवान् गणेश का ध्यान करें अथवा अभिजीत मुहूर्त की प्रतीक्षा करें।' : undefined,
  };
}

export const MUHURTA_FAQS = [
  {
    question: 'What is Panchanga-Shuddhi and why is it essential in Muhurta Shastra?',
    questionHi: 'पञ्चाङ्ग शुद्धि क्या है और मुहूर्त शास्त्र में इसका क्या महत्व है?',
    answer: 'Panchanga-Shuddhi means the purification of all five astronomical limbs of time: Tithi (lunar day for prosperity), Vara (weekday for longevity), Nakshatra (lunar mansion for destroying sin), Yoga (solar-lunar angle for curing diseases), and Karana (half-tithi for accomplishment of action). When all five limbs are harmonious, the subtle cosmic energy naturally supports the intention of the endeavor.',
    answerHi: 'पञ्चाङ्ग के पाँचों अङ्गों (तिथि, वार, नक्षत्र, योग, करण) की शुद्धि को पञ्चाङ्ग शुद्धि कहते हैं। तिथि से समृद्धि, वार से आयु, नक्षत्र से पाप-नाश, योग से रोग-मुक्ति और करण से कार्य-सिद्धि होती है। जब पाँचों अङ्ग शुद्ध होते हैं तो किया गया कार्य निर्विघ्न सम्पन्न होता है।',
  },
  {
    question: 'What is Vishti (Bhadra) Karana and why must it be avoided for new beginnings?',
    questionHi: 'विष्टि (भद्रा) करण क्या है और नए कार्यों में इसका त्याग क्यों आवश्यक है?',
    answer: 'Vishti is the seventh movable Karana, personified in Vedic lore as Bhadra, the sister of Shani. It embodies fiery, destructive, and restless energy. While ideal for defensive warfare, medical detoxification, surgery, and overcoming enemies, it burns away gentle beginnings such as weddings, entering a new house (Griha Pravesha), travel, and commercial investments.',
    answerHi: 'विष्टि करण को ही ज्योतिष में ‘भद्रा’ कहा जाता है। यह शनिदेव की बहन मानी गई हैं। इनका स्वभाव उग्र और तीक्ष्ण है। इसलिए भद्रा काल में विवाह, गृहप्रवेश, नया व्यापार और शुभ यात्रा सर्वथा वर्जित मानी गई है। यह समय केवल शत्रु-दमन, विषहरण और आत्म-संयम के लिए उपयुक्त है।',
  },
  {
    question: 'What is Abhijit Muhurta and can it overcome minor astrological doshas?',
    questionHi: 'अभिजीत मुहूर्त क्या है और क्या यह सामान्य दोषों को नष्ट कर सकता है?',
    answer: 'Abhijit Muhurta is the eighth muhurta of the civil day, spanning approximately 24 minutes before and 24 minutes after true local solar noon (roughly 11:45 AM to 12:35 PM). Governed by Lord Brahma and Lord Hari, it is considered a universal golden blessing that dispels millions of minor astrological afflictions (doshas), just as the blazing midday sun dispels mist (with the sole exception of Wednesdays, when it is counter-indicated).',
    answerHi: 'अभिजीत मुहूर्त दिन का आठवाँ मुहूर्त है, जो स्थानीय मध्याह्न (सोलर नून) से लगभग 24 मिनट पूर्व और 24 मिनट बाद तक रहता है। इसके अधिष्ठाता भगवान् विष्णु हैं। यह मुहूर्त सहस्रों दोषों को वैसे ही भस्म कर देता है जैसे मध्याह्न का सूर्य अन्धकार को। केवल बुधवार के दिन अभिजीत मुहूर्त को वर्ज्य माना गया है।',
  },
  {
    question: 'How should one approach Muhurta without falling into superstition or anxiety?',
    questionHi: 'मुहूर्त को अंधविश्वास या भय के बिना विवेकपूर्ण दृष्टि से कैसे समझें?',
    answer: 'Classical Vedic masters describe Muhurta not as fatalism, but as natural navigation. Just as a sailor sails with the rising tide and wind rather than against a gale, choosing a favorable muhurta aligns human intention with subtle cosmic tides. In true emergencies or noble duties of selflessness, duty itself is the highest muhurta, protected by God.',
    answerHi: 'सनातन परम्परा में मुहूर्त भाग्यवादी डर नहीं, बल्कि प्रकृति और काल के साथ तालमेल बिठाने का विज्ञान है। जैसे नाविक अनुकूल हवा में नाव चलाता है, वैसे ही शुभ मुहूर्त में किया गया कार्य कम बाधाओं के साथ पूर्ण होता है। आपातकाल और परोपकार के कार्यों में किसी मुहूर्त की प्रतीक्षा नहीं की जाती—सद्कर्म ही सबसे बड़ा मुहूर्त है।',
  },
];
