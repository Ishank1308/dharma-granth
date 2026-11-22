/**
 * Curated devotional, scriptural, and atmospheric visuals used across Dharma Granth.
 * All files live under public/images/curated/ as optimized WebP assets with exact dimensions.
 */

export interface NavadurgaCard {
  day: number;
  id: string;
  nameHi: string;
  nameEn: string;
  mantra: string;
  themeHi: string;
  themeEn: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface WisdomPoster {
  id: string;
  titleHi: string;
  titleEn: string;
  referenceHi: string;
  referenceEn: string;
  captionHi: string;
  captionEn: string;
  href: string;
  scriptureId?: string;
  chapterId?: number;
  verseId?: string;
  conceptIds: string[];
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface EditorialScene {
  id: string;
  titleHi: string;
  titleEn: string;
  captionHi: string;
  captionEn: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const NAVADURGA_CARDS: readonly NavadurgaCard[] = [
  {
    day: 1,
    id: 'shailputri',
    nameHi: 'माँ शैलपुत्री',
    nameEn: 'Maa Shailputri',
    mantra: 'ॐ देवी शैलपुत्र्यै नमः',
    themeHi: 'शक्ति की पहली पहचान स्थिरता है',
    themeEn: 'Steadiness & grounded resolve',
    src: '/images/curated/navratri/day-1-shailputri.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 1 — Maa Shailputri seated on Nandi holding trident and lotus with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 2,
    id: 'brahmacharini',
    nameHi: 'माँ ब्रह्मचारिणी',
    nameEn: 'Maa Brahmacharini',
    mantra: 'ॐ देवी ब्रह्मचारिण्यै नमः',
    themeHi: 'संकल्प आरम्भ कराता है, अनुशासन पूर्णता तक पहुँचाता है',
    themeEn: 'Devotion, austerity & steady discipline',
    src: '/images/curated/navratri/day-2-brahmacharini.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 2 — Maa Brahmacharini walking barefoot with japa mala and kamandalu with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 3,
    id: 'chandraghanta',
    nameHi: 'माँ चन्द्रघण्टा',
    nameEn: 'Maa Chandraghanta',
    mantra: 'ॐ देवी चन्द्रघण्टायै नमः',
    themeHi: 'सच्ची शक्ति शोर नहीं करती, वह भय के सामने स्थिर खड़ी रहती है',
    themeEn: 'Serene courage & inner vigilance',
    src: '/images/curated/navratri/day-3-chandraghanta.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 3 — Maa Chandraghanta mounted on a lion with divine weapons, Devi Kavacham, and Dhyana Shloka',
  },
  {
    day: 4,
    id: 'kushmanda',
    nameHi: 'माँ कूष्माण्डा',
    nameEn: 'Maa Kushmanda',
    mantra: 'ॐ देवी कूष्माण्डायै नमः',
    themeHi: 'अन्धकार कितना भी विशाल हो, प्रकाश का एक छोटा बीज पर्याप्त है',
    themeEn: 'Cosmic radiance & creative energy',
    src: '/images/curated/navratri/day-4-kushmanda.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 4 — Maa Kushmanda radiating cosmic light on her lion with sacred kalasha, Devi Kavacham, and Dhyana Shloka',
  },
  {
    day: 5,
    id: 'skandamata',
    nameHi: 'माँ स्कन्दमाता',
    nameEn: 'Maa Skandamata',
    mantra: 'ॐ देवी स्कन्दमातायै नमः',
    themeHi: 'ममता केवल रक्षा नहीं करती, वह भविष्य को साहस देती है',
    themeEn: 'Nurturing compassion & fearless grace',
    src: '/images/curated/navratri/day-5-skandamata.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 5 — Maa Skandamata seated on a white lotus holding child Skanda with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 6,
    id: 'katyayani',
    nameHi: 'माँ कात्यायनी',
    nameEn: 'Maa Katyayani',
    mantra: 'ॐ देवी कात्यायन्यै नमः',
    themeHi: 'जहाँ करुणा के साथ साहस हो, वहीं शक्ति धर्म बनती है',
    themeEn: 'Righteous strength & clarity of action',
    src: '/images/curated/navratri/day-6-katyayani.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 6 — Maa Katyayani riding a lion wielding Chandrahasa sword and lotus with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 7,
    id: 'kalaratri',
    nameHi: 'माँ कालरात्रि',
    nameEn: 'Maa Kalaratri',
    mantra: 'ॐ देवी कालरात्र्यै नमः',
    themeHi: 'अन्धकार से भागना नहीं, उसमें सत्य को पहचानना ही साहस है',
    themeEn: 'Fearlessness & dispelling of darkness',
    src: '/images/curated/navratri/day-7-kalaratri.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 7 — Maa Kalaratri bestowing fearlessness under a starry night sky with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 8,
    id: 'mahagauri',
    nameHi: 'माँ महागौरी',
    nameEn: 'Maa Mahagauri',
    mantra: 'ॐ देवी महागौर्यै नमः',
    themeHi: 'जहाँ मन निर्मल होता है, वहीं ईश्वर का प्रकाश स्पष्ट दिखाई देता है',
    themeEn: 'Purity, forgiveness & tranquil clarity',
    src: '/images/curated/navratri/day-8-mahagauri.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 8 — Maa Mahagauri clad in white seated on a white bull with Devi Kavacham and Dhyana Shloka',
  },
  {
    day: 9,
    id: 'siddhidatri',
    nameHi: 'माँ सिद्धिदात्री',
    nameEn: 'Maa Siddhidatri',
    mantra: 'ॐ देवी सिद्धिदात्र्यै नमः',
    themeHi: 'पूर्णता कुछ प्राप्त करने में नहीं, स्वयं को पहचानने में है',
    themeEn: 'Spiritual fulfillment & self-realization',
    src: '/images/curated/navratri/day-9-siddhidatri.webp',
    width: 682,
    height: 1024,
    alt: 'Navratri Day 9 — Maa Siddhidatri seated on a luminous lotus bestowing spiritual fulfillment with Devi Kavacham and Dhyana Shloka',
  },
];

export const WISDOM_POSTERS: readonly WisdomPoster[] = [
  {
    id: 'dharyate-iti-dharmah',
    titleHi: 'धार्यते इति धर्मः',
    titleEn: 'What Sustains Life Is Dharma',
    referenceHi: 'शास्त्रीय धर्म-परिभाषा',
    referenceEn: 'Classical Definition of Dharma',
    captionHi: 'जो धारण किया जाए — सत्य, करुणा, सेवा और कर्तव्य-निष्ठा से जीवन व समाज को उचित दिशा में बनाए रखने वाला तत्व ही धर्म है।',
    captionEn: 'Dharma is not outer display, but the continuous practice of truth, compassion, service, and duty that upholds life.',
    href: '/concepts/dharma/',
    conceptIds: ['dharma'],
    src: '/images/curated/wisdom/dharyate-iti-dharmah.webp',
    width: 682,
    height: 1024,
    alt: 'Illustrated Hindi explanation of Dharyate Iti Dharmah with a sage studying scripture beside river ghats',
  },
  {
    id: 'gita-2-48',
    titleHi: 'योगस्थः कुरु कर्माणि',
    titleEn: 'Perform Action Established in Yoga',
    referenceHi: 'श्रीमद्भगवद्गीता 2.48',
    referenceEn: 'Bhagavad Gita 2.48',
    captionHi: 'मन की स्थिरता, फल की चिंता से मुक्ति और सफलता-असफलता में समभाव रखकर किया गया कर्म ही योग बन जाता है।',
    captionEn: 'Established in inner steadiness and equanimity in success and failure, everyday action transforms into Yoga.',
    href: '/scripture/bhagavadgita/chapter/2/verse/48/',
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseId: '48',
    conceptIds: ['yoga', 'karma'],
    src: '/images/curated/wisdom/gita-2-48.webp',
    width: 682,
    height: 1024,
    alt: 'Illustrated Hindi contemplation of Bhagavad Gita 2.48 Yogasthah Kuru Karmani showing four pillars of equanimous action',
  },
  {
    id: 'gita-3-9',
    titleHi: 'यज्ञार्थात्कर्मणोऽन्यत्र',
    titleEn: 'Work Offered as Yajna Liberates',
    referenceHi: 'श्रीमद्भगवद्गीता 3.9',
    referenceEn: 'Bhagavad Gita 3.9',
    captionHi: 'स्वार्थ के लिए किया गया कर्म बन्धन बनता है, परन्तु समर्पण और कर्तव्य-भाव से किया गया कर्म मुक्ति का मार्ग बनता है।',
    captionEn: 'Action done solely for selfish reward binds, whereas duty offered in a spirit of selfless service becomes liberating.',
    href: '/scripture/bhagavadgita/chapter/3/verse/9/',
    scriptureId: 'bhagavadgita',
    chapterId: 3,
    verseId: '9',
    conceptIds: ['karma', 'yajna'],
    src: '/images/curated/wisdom/gita-3-9.webp',
    width: 682,
    height: 1024,
    alt: 'Illustrated contemplation of Bhagavad Gita 3.9 depicting a seeker walking toward sunrise beyond wealth, fame, and rewards',
  },
  {
    id: 'gita-15-15',
    titleHi: 'सर्वस्य चाहं हृदि सन्निविष्टो',
    titleEn: 'Seated in the Heart of Every Being',
    referenceHi: 'श्रीमद्भगवद्गीता 15.15',
    referenceEn: 'Bhagavad Gita 15.15',
    captionHi: 'परमात्मा प्रत्येक प्राणी के हृदय में साक्षी, मार्गदर्शक तथा स्मृति और ज्ञान के स्रोत रूप में सदैव विराजमान हैं।',
    captionEn: 'The Supreme Lord abides within the heart of all beings as the inner witness, guide, and source of wisdom.',
    href: '/scripture/bhagavadgita/chapter/15/verse/15/',
    scriptureId: 'bhagavadgita',
    chapterId: 15,
    verseId: '15',
    conceptIds: ['atman', 'bhakti'],
    src: '/images/curated/wisdom/gita-15-15.webp',
    width: 571,
    height: 1024,
    alt: 'Illustrated contemplation of Bhagavad Gita 15.15 Sarvasya Caham Hridi Sannivishto showing Lord Krishna and a meditating seeker',
  },
  {
    id: 'isha-upanishad-6',
    titleHi: 'यस्तु सर्वाणि भूतान्यात्मन्येवानुपश्यति',
    titleEn: 'Seeing All Beings in the Self',
    referenceHi: 'ईशावास्य उपनिषद् 6',
    referenceEn: 'Isha Upanishad 6',
    captionHi: 'जो सभी प्राणियों को अपनी आत्मा में और अपनी आत्मा को सभी प्राणियों में देखता है, वह किसी से घृणा नहीं करता।',
    captionEn: 'One who beholds all beings in the Self and the Self in all beings rises above aversion and sees one light in all.',
    href: '/scripture/ishavasya/chapter/1/verse/6/',
    scriptureId: 'ishavasya',
    chapterId: 1,
    verseId: '6',
    conceptIds: ['atman', 'ahimsa'],
    src: '/images/curated/wisdom/isha-upanishad-6.webp',
    width: 682,
    height: 1024,
    alt: 'Illustrated contemplation of Isha Upanishad mantra 6 showing reflections of all living beings united by golden light on calm water',
  },
  {
    id: 'shvetashvatara-grace',
    titleHi: 'दिव्य कृपा और शान्त समर्पण',
    titleEn: 'Divine Grace & Quiet Surrender',
    referenceHi: 'श्वेताश्वतर उपनिषद् प्रेरणा',
    referenceEn: 'Inspired by Shvetashvatara Upanishad',
    captionHi: 'जब मन सत्य के प्रति विरोध छोड़कर शान्त समर्पण करता है, तब भीतर से आध्यात्मिक प्रकाश स्वतः प्रस्फुटित होता है।',
    captionEn: 'When inner resistance yields to quiet surrender, a serene spiritual radiance begins to shine from within.',
    href: '/scripture/shvetashvatara/',
    scriptureId: 'shvetashvatara',
    conceptIds: ['brahman', 'moksha'],
    src: '/images/curated/wisdom/shvetashvatara-grace.webp',
    width: 574,
    height: 1024,
    alt: 'Devotional visual contemplation inspired by Shvetashvatara Upanishad at twilight ghats lit by earthen diyas',
  },
  {
    id: 'japa-mala-bhakti',
    titleHi: 'सांसों की माला — निरन्तर नाम-स्मरण',
    titleEn: 'The Garland of Breath & Japa',
    referenceHi: 'जप-साधना व भक्ति चिन्तन',
    referenceEn: 'Japa Sadhana & Bhakti Reflection',
    captionHi: 'माला केवल दानों की नहीं, भावों की होती है — जब जप जीवन और श्वासों का अंग बन जाए, तभी सच्ची भक्ति जागती है।',
    captionEn: 'True japa is not merely counting beads in the hand, but turning every breath into loving remembrance.',
    href: '/practice/',
    conceptIds: ['bhakti'],
    src: '/images/curated/wisdom/japa-mala-bhakti.webp',
    width: 682,
    height: 1024,
    alt: 'Illustrated Hindi reflection on japa mala and Meera Bai devotional remembrance',
  },
  {
    id: 'gita-2-47-nishkama',
    titleHi: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    titleEn: 'Your Right Is to Action Alone',
    referenceHi: 'श्रीमद्भगवद्गीता 2.47',
    referenceEn: 'Bhagavad Gita 2.47',
    captionHi: 'कमल-पत्र के समान जल में रहकर भी असंग — निष्ठापूर्वक कर्तव्य कीजिए और फल के भय से चित्त को मुक्त रखिए।',
    captionEn: 'Like a lotus untouched by water, give your full care to duty while releasing anxiety over outcomes.',
    href: '/scripture/bhagavadgita/chapter/2/verse/47/',
    scriptureId: 'bhagavadgita',
    chapterId: 2,
    verseId: '47',
    conceptIds: ['karma', 'vairagya'],
    src: '/images/curated/wisdom/gita-2-47-nishkama.webp',
    width: 682,
    height: 1024,
    alt: 'Fine-art painting of a sunlit sacred lake, untainted pink lotus, resting bow, and lit earthen lamp symbolizing Nishkama Karma in Bhagavad Gita 2.47',
  },
  {
    id: 'katha-chariot-self',
    titleHi: 'आत्मानं रथिनं विद्धि',
    titleEn: 'Know the Self as the Charioteer',
    referenceHi: 'कठोपनिषद् 1.3.3',
    referenceEn: 'Katha Upanishad 1.3.3',
    captionHi: 'शरीर रथ है, इन्द्रियाँ अश्व हैं और स्थिर बुद्धि सारथी — संयम और विवेक की लगाम से जीवन-यात्रा परम लक्ष्य तक पहुँचती है।',
    captionEn: 'The body is the chariot, the senses the horses, and steady discernment the charioteer guiding the seeker home.',
    href: '/scripture/katha/',
    scriptureId: 'katha',
    conceptIds: ['vedanta', 'jnana'],
    src: '/images/curated/wisdom/katha-chariot-self.webp',
    width: 682,
    height: 1024,
    alt: 'Classical fine-art painting of a golden Upanishadic chariot drawn by five calm white horses ascending toward a mountain sunrise',
  },
  {
    id: 'yogasutra-still-lake',
    titleHi: 'योगश्चित्तवृत्तिनिरोधः',
    titleEn: 'Yoga Is the Settling of the Mind',
    referenceHi: 'पातञ्जल योगसूत्र 1.2',
    referenceEn: 'Patanjali Yoga Sutra 1.2',
    captionHi: 'जब सरोवर की तरंगें शान्त हो जाती हैं, तब आकाश और चन्द्रमा का निर्मल प्रतिबिम्ब स्वतः स्पष्ट दिखने लगता है।',
    captionEn: 'When the ripples of the mind grow still, awareness reflects truth as clearly as a tranquil mountain lake.',
    href: '/scripture/yogasutra/',
    scriptureId: 'yogasutra',
    conceptIds: ['yoga', 'vairagya'],
    src: '/images/curated/wisdom/yogasutra-still-lake.webp',
    width: 682,
    height: 1024,
    alt: 'Fine-art twilight painting of a mirror-still Himalayan lake where ripples fade to reflect the starry sky and crescent moon',
  },
  {
    id: 'maya-veil-light',
    titleHi: 'माया का आवरण और विवेक का प्रकाश',
    titleEn: 'Light Parting the Veil of Maya',
    referenceHi: 'वेदान्त एवं माया-विवेक',
    referenceEn: 'Vedantic Contemplation of Maya',
    captionHi: 'कुहरे का आवरण क्षणिक है — जैसे ही ज्ञान-सूर्य की किरणें पड़ती हैं, सत्य का सनातन द्वार स्वतः प्रकाशित हो उठता है।',
    captionEn: 'Mist only veils what is already present; as discernment dawns, the timeless clarity behind appearance shines forth.',
    href: '/concepts/maya/',
    conceptIds: ['maya', 'samsara', 'vedanta'],
    src: '/images/curated/wisdom/maya-veil-light.webp',
    width: 682,
    height: 1024,
    alt: 'Fine-art painting of golden dawn sunbeams parting silver mist over a lotus pond to reveal an illuminated ancient temple archway',
  },
  {
    id: 'devi-adi-shakti-lotus',
    titleHi: 'सर्वचैतन्यरूपा परा शक्ति',
    titleEn: 'Primordial Radiance of Adi Shakti',
    referenceHi: 'श्रीमद्देवीभागवत पुराण 1.1',
    referenceEn: 'Devi Bhagavata Purana',
    captionHi: 'समस्त सृष्टि में चैतन्य, करुणा और सृजन-ऊर्जा के रूप में विराजमान भगवती आदि शक्ति का पावन सहस्रदल कमल-दर्शन।',
    captionEn: 'A contemplation of Adi Shakti — the luminous creative consciousness sustaining every form in the cosmos.',
    href: '/scripture/devibhagavat/',
    scriptureId: 'devibhagavat',
    conceptIds: ['bhakti', 'brahman'],
    src: '/images/curated/wisdom/devi-adi-shakti-lotus.webp',
    width: 682,
    height: 1024,
    alt: 'Luminous fine-art painting of a radiant crimson and gold thousand-petaled lotus blossoming over tranquil cosmic waters',
  },
];

export const EDITORIAL_SCENES: Readonly<Record<
  | 'diwaliGhat'
  | 'templeDarshan'
  | 'templeKirtan'
  | 'devotionalVeena'
  | 'sacredGrove'
  | 'ghatMorning'
  | 'mahashivaratriKailasha'
  | 'janmashtamiVrindavan'
  | 'ramnavamiAyodhya'
  | 'ganeshChaturthiShrine'
  | 'holiSpringFestival'
  | 'gitaJayantiKurukshetra'
  | 'guruPurnimaAshram',
  EditorialScene
>> = {
  diwaliGhat: {
    id: 'diwali-ghat-celebration',
    titleHi: 'दीपोत्सव — तीर्थ घाटों पर प्रकाश पर्व',
    titleEn: 'Deepotsava on the Sacred Ghats',
    captionHi: 'अन्धकार से प्रकाश की ओर — दीपमालाओं से आलोकित पावन नदी तट और उत्सव-चेतना।',
    captionEn: 'From darkness to light — river ghats aglow with earthen lamps during Deepavali.',
    src: '/images/curated/scenes/diwali-ghat-celebration.webp',
    width: 1024,
    height: 571,
    alt: 'River ghats illuminated with thousands of diyas, lanterns, and festive light for Shubh Deepavali',
  },
  templeDarshan: {
    id: 'temple-darshan-puja',
    titleHi: 'मन्दिर दर्शन व देव-पूजन',
    titleEn: 'Temple Sanctum & Evening Darshan',
    captionHi: 'दीपों, धूप और पुष्पों के मध्य शांत गर्भगृह दर्शन — श्रद्धा, एकाग्रता और भक्ति का संगम।',
    captionEn: 'Quiet devotion before a lamp-lit stone sanctum adorned with marigold garlands and incense.',
    src: '/images/curated/scenes/temple-darshan-puja.webp',
    width: 1024,
    height: 571,
    alt: 'Devotee standing in prayer before an illuminated Goddess sanctum inside an ancient carved stone temple',
  },
  templeKirtan: {
    id: 'temple-kirtan-satsang',
    titleHi: 'भजन, संकीर्तन एवं सत्संग',
    titleEn: 'Temple Courtyard Kirtan & Satsang',
    captionHi: 'हारमोनियम, ढोलक और करताल के साथ सामूहिक भगवन्नाम-संकीर्तन की जीवन्त परम्परा।',
    captionEn: 'Devotees singing bhajans together with harmonium and dholak in a sunlit carved temple courtyard.',
    src: '/images/curated/scenes/temple-kirtan-satsang.webp',
    width: 1024,
    height: 571,
    alt: 'Devotees performing morning bhajan and kirtan with harmonium and dholak inside a carved sandstone temple courtyard',
  },
  devotionalVeena: {
    id: 'devotional-veena',
    titleHi: 'नाद-योग व शास्त्रीय स्वर साधना',
    titleEn: 'Nada Yoga & Sacred Devotional Music',
    captionHi: 'दीप-ज्योति और वीणा के मधुर नाद में लीन होकर मन्त्रों और स्तोत्रों का अनुभव करें।',
    captionEn: 'Sacred sound as contemplation — henna-adorned hands plucking a classical stringed instrument beside glowing diyas.',
    src: '/images/curated/scenes/devotional-veena.webp',
    width: 1024,
    height: 571,
    alt: 'Close-up of traditional hands with bangles playing a carved veena surrounded by marigold garlands and glowing diyas',
  },
  sacredGrove: {
    id: 'sacred-grove-tapovan',
    titleHi: 'तपोवन — शान्त आरण्यक पथ',
    titleEn: 'Sacred Grove & Tapovan Path',
    captionHi: 'वृक्षों की छाया और प्रातःकालीन सूर्य-किरणों के बीच ऋषियों के स्वाध्याय व चिन्तन का पावन वातावरण।',
    captionEn: 'Sunbeams filtering through ancient banyan trees along a quiet forest shrine path strewn with marigold petals and peacock feathers.',
    src: '/images/curated/scenes/sacred-grove-tapovan.webp',
    width: 1024,
    height: 571,
    alt: 'Sunbeams piercing through a lush sacred banyan grove with a small forest shrine, diyas, and peacock feathers',
  },
  ghatMorning: {
    id: 'ghat-morning-offering',
    titleHi: 'प्रातःकालीन तीर्थ-अर्पण व सन्ध्या',
    titleEn: 'Sunrise Offering at the Sacred River',
    captionHi: 'सूर्योदय के समय पवित्र नदी के तट पर पुष्प अर्पण, कृतज्ञता और दैनिक सन्ध्या वन्दन।',
    captionEn: 'Offering fresh flowers into golden sunrise waters along ancient temple ghats.',
    src: '/images/curated/scenes/ghat-morning-offering.webp',
    width: 1024,
    height: 571,
    alt: 'Woman in a yellow silk saree offering flowers into a glowing sunrise river at ancient temple ghats',
  },
  mahashivaratriKailasha: {
    id: 'mahashivaratri-kailasha',
    titleHi: 'महाशिवरात्रि — कैलास छाया में रुद्राभिषेक',
    titleEn: 'Mahashivaratri & Kailasha Vigil',
    captionHi: 'बिल्वपत्र, दीप-ज्योति और शान्त रात्रि-जागरण के बीच देवाधिदेव महादेव का पावन ध्यान।',
    captionEn: 'Quiet midnight vigil before a carved Shiva Lingam adorned with bilva leaves beneath moonlit Himalayan peaks.',
    src: '/images/curated/scenes/mahashivaratri-kailasha.webp',
    width: 1024,
    height: 571,
    alt: 'Nocturnal Himalayan stone shrine with a black stone Shiva Lingam adorned with bilva leaves, white flowers, and brass diyas framing moonlit Mount Kailash',
  },
  janmashtamiVrindavan: {
    id: 'janmashtami-vrindavan',
    titleHi: 'जन्माष्टमी — वृन्दावन व यमुना तट की पावन रात्रि',
    titleEn: 'Midnight Janmashtami by the Yamuna',
    captionHi: 'अर्धरात्रि के शान्त प्रकाश में मुरली, मोरपंख और दीपों से आलोकित वृन्दावन भक्ति-भाव।',
    captionEn: 'A serene Vrindavan pavilion above the lamp-lit Yamuna with bamboo flute and peacock feather beneath a crescent moon.',
    src: '/images/curated/scenes/janmashtami-vrindavan.webp',
    width: 1024,
    height: 571,
    alt: 'Midnight carved sandstone pavilion overlooking the lamp-lit Yamuna river in Vrindavan with a bamboo flute and peacock feather on a flower-strewn sill',
  },
  ramnavamiAyodhya: {
    id: 'ramnavami-ayodhya',
    titleHi: 'रामनवमी — अयोध्या के पावन प्रभात तोरण',
    titleEn: 'Dawn of Ram Navami in Ayodhya',
    captionHi: 'सरयू तट और आम्रपल्लव-गेंदा तोरणों के मध्य मर्यादा पुरुषोत्तम श्रीराम के प्राकट्य का स्वर्णिम प्रभात।',
    captionEn: 'Golden dawn streaming through marigold-draped sandstone temple arches overlooking the tranquil Sarayu river.',
    src: '/images/curated/scenes/ramnavami-ayodhya.webp',
    width: 1024,
    height: 571,
    alt: 'Golden sunrise through carved sandstone temple arches in Ayodhya draped with marigold and mango-leaf torans overlooking the Sarayu river',
  },
  ganeshChaturthiShrine: {
    id: 'ganesh-chaturthi-shrine',
    titleHi: 'गणेश चतुर्थी — मंगलमूर्ति श्रीगणेश पूजन',
    titleEn: 'Ganesh Chaturthi Terracotta Shrine',
    captionHi: 'दूर्वा, जपापुष्प और मोदक के साथ विघ्नहर्ता श्रीगणेश की सात्त्विक और पर्यावरण-अनुकूल आराधना।',
    captionEn: 'Handcrafted clay idol of Shri Ganesha adorned with red hibiscus, durva grass, glowing lamps, and modak offerings.',
    src: '/images/curated/scenes/ganesh-chaturthi-shrine.webp',
    width: 1024,
    height: 571,
    alt: 'Handcrafted terracotta Shri Ganesha idol on a carved wooden altar with red hibiscus, durva grass, marigold garlands, brass lamps, and modaks',
  },
  holiSpringFestival: {
    id: 'holi-spring-festival',
    titleHi: 'वसन्तोत्सव होली — पलाश व प्राकृतिक रंगों का उल्लास',
    titleEn: 'Spring Holi & Natural Flower Colours',
    captionHi: 'पलाश, केसर और पुष्प-गुलाल के सौम्य रंगों में प्रेम, क्षमा और नव-वसन्त का पावन उत्सव।',
    captionEn: 'Hammered brass bowls of natural saffron, rose, and turmeric gulal beside blooming palash in a sunlit Braj courtyard.',
    src: '/images/curated/scenes/holi-spring-festival.webp',
    width: 1024,
    height: 571,
    alt: 'Antique hammered brass bowls of natural saffron, rose-pink, and turmeric flower gulal beside marigolds and blooming palash in a sunlit sandstone courtyard',
  },
  gitaJayantiKurukshetra: {
    id: 'gita-jayanti-kurukshetra',
    titleHi: 'गीता जयन्ती — कुरुक्षेत्र ब्रह्मसरोवर का स्वर्णिम प्रभात',
    titleEn: 'Dawn at Kurukshetra & Gita Jayanti',
    captionHi: 'शान्त ब्रह्मसरोवर के तट पर ताड़पत्र ग्रन्थ, रुद्राक्ष और दीप-ज्योति — धर्म, विवेक और योग का पावन स्मरण।',
    captionEn: 'Golden dawn over misty Brahma Sarovar in Kurukshetra with a traditional palm-leaf scripture, rudraksha mala, and lit diya.',
    src: '/images/curated/scenes/gita-jayanti-kurukshetra.webp',
    width: 1024,
    height: 571,
    alt: 'Golden sunrise over misty Brahma Sarovar in Kurukshetra with a saffron-wrapped palm-leaf manuscript, rudraksha mala, and lit brass diya on stone steps',
  },
  guruPurnimaAshram: {
    id: 'guru-purnima-ashram',
    titleHi: 'गुरु पूर्णिमा — हिमालयी आश्रम व स्वाध्याय परम्परा',
    titleEn: 'Guru Purnima & Gurukul Study',
    captionHi: 'वटवृक्ष की छाया, पूर्णिमा की शीतल चाँदनी और प्राचीन ग्रन्थों के मध्य गुरु-शिष्य संवाद की सनातन परम्परा।',
    captionEn: 'Full moon rising above a tranquil Himalayan stone gurukul beneath a banyan tree with palm-leaf manuscripts, lamps, and white lotuses.',
    src: '/images/curated/scenes/guru-purnima-ashram.webp',
    width: 1024,
    height: 571,
    alt: 'Serene Himalayan stone ashram beneath a grand banyan tree and luminous full moon with palm-leaf manuscripts, glowing oil lamps, and white lotus blossoms',
  },
};

export function getVersePoster(scriptureId: string, chapterId: number, verseId: string): WisdomPoster | undefined {
  const normalized = String(verseId).trim();
  return WISDOM_POSTERS.find(
    (p) => p.scriptureId === scriptureId && p.chapterId === chapterId && p.verseId === normalized,
  );
}

export function getScripturePosters(scriptureId: string): WisdomPoster[] {
  return WISDOM_POSTERS.filter((p) => p.scriptureId === scriptureId);
}

export function getConceptPosters(conceptId: string): WisdomPoster[] {
  return WISDOM_POSTERS.filter((p) => p.conceptIds.includes(conceptId));
}

export interface TaggedEditorialScene {
  scene: EditorialScene;
  eyebrowHi: string;
  eyebrowEn: string;
}

const FESTIVAL_SCENE_MAP: Readonly<Record<string, { key: keyof typeof EDITORIAL_SCENES; eyebrowHi: string; eyebrowEn: string }>> = {
  diwali: { key: 'diwaliGhat', eyebrowHi: 'शुभ दीपावली', eyebrowEn: 'Festival of Lights' },
  navaratri: { key: 'templeDarshan', eyebrowHi: 'शुभ नवरात्रि', eyebrowEn: 'Nine Nights of Shakti' },
  shivaratri: { key: 'mahashivaratriKailasha', eyebrowHi: 'महाशिवरात्रि', eyebrowEn: 'Sacred Night of Shiva' },
  janmashtami: { key: 'janmashtamiVrindavan', eyebrowHi: 'श्रीकृष्ण जन्माष्टमी', eyebrowEn: 'Midnight of Vrindavan' },
  ramnavami: { key: 'ramnavamiAyodhya', eyebrowHi: 'श्रीरामनवमी', eyebrowEn: 'Dawn in Ayodhya' },
  'ganesh-chaturthi': { key: 'ganeshChaturthiShrine', eyebrowHi: 'गणेश चतुर्थी', eyebrowEn: 'Lord of Beginnings' },
  holi: { key: 'holiSpringFestival', eyebrowHi: 'वसन्तोत्सव होली', eyebrowEn: 'Festival of Spring' },
  'gita-jayanti': { key: 'gitaJayantiKurukshetra', eyebrowHi: 'गीता जयन्ती', eyebrowEn: 'Song of Kurukshetra' },
  'guru-purnima': { key: 'guruPurnimaAshram', eyebrowHi: 'गुरु पूर्णिमा', eyebrowEn: 'Lineage of Teachers' },
};

export function getFestivalScene(festivalId: string): TaggedEditorialScene | undefined {
  const entry = FESTIVAL_SCENE_MAP[festivalId];
  return entry ? { scene: EDITORIAL_SCENES[entry.key], eyebrowHi: entry.eyebrowHi, eyebrowEn: entry.eyebrowEn } : undefined;
}

const SCRIPTURE_SCENE_MAP: Readonly<Record<string, { key: keyof typeof EDITORIAL_SCENES; eyebrowHi: string; eyebrowEn: string }>> = {
  bhagavadgita: { key: 'gitaJayantiKurukshetra', eyebrowHi: 'कुरुक्षेत्र संवाद', eyebrowEn: 'Kurukshetra Dawn' },
  mahabharata: { key: 'gitaJayantiKurukshetra', eyebrowHi: 'महाभारत इतिहास', eyebrowEn: 'Sacred Field of Dharma' },
  ramayana: { key: 'ramnavamiAyodhya', eyebrowHi: 'अयोध्या व सरयू', eyebrowEn: 'Sacred Ayodhya' },
  shivpurana: { key: 'mahashivaratriKailasha', eyebrowHi: 'कैलास भक्ति', eyebrowEn: 'Himalayan Shiva Shrine' },
  bhagavatapurana: { key: 'janmashtamiVrindavan', eyebrowHi: 'वृन्दावन रस', eyebrowEn: 'Devotion by the Yamuna' },
  devibhagavat: { key: 'templeDarshan', eyebrowHi: 'शक्ति साधना', eyebrowEn: 'Sanctum of Devi' },
};

export function getScriptureScene(scriptureId: string): TaggedEditorialScene | undefined {
  const entry = SCRIPTURE_SCENE_MAP[scriptureId];
  return entry ? { scene: EDITORIAL_SCENES[entry.key], eyebrowHi: entry.eyebrowHi, eyebrowEn: entry.eyebrowEn } : undefined;
}

const MANTRA_SCENE_MAP: Readonly<Record<string, { key: keyof typeof EDITORIAL_SCENES; eyebrowHi: string; eyebrowEn: string }>> = {
  mahamrityunjaya: { key: 'mahashivaratriKailasha', eyebrowHi: 'रुद्र ध्यान', eyebrowEn: 'Shiva Contemplation' },
  'shiva-tandava': { key: 'mahashivaratriKailasha', eyebrowHi: 'कैलास स्तुति', eyebrowEn: 'Hymn to Shiva' },
  lingashtakam: { key: 'mahashivaratriKailasha', eyebrowHi: 'शिवलिङ्ग अर्चन', eyebrowEn: 'Sacred Lingam' },
  'shiva-panchakshara-stotram': { key: 'mahashivaratriKailasha', eyebrowHi: 'पञ्चाक्षर साधना', eyebrowEn: 'Five-Syllable Chant' },
  'shiv-chalisa': { key: 'mahashivaratriKailasha', eyebrowHi: 'शिव भक्ति', eyebrowEn: 'Devotion to Shiva' },
  'shiva-mahimna-stotram': { key: 'mahashivaratriKailasha', eyebrowHi: 'शिव महिम्नः', eyebrowEn: 'Glory of Shiva' },
  'ganapati-atharvashirsha': { key: 'ganeshChaturthiShrine', eyebrowHi: 'गणपति अथर्वशीर्ष', eyebrowEn: 'Vedic Ganapati Hymn' },
  madhurashtakam: { key: 'janmashtamiVrindavan', eyebrowHi: 'वृन्दावन माधुर्य', eyebrowEn: 'Sweetness of Vrindavan' },
  achyutashtakam: { key: 'janmashtamiVrindavan', eyebrowHi: 'श्रीकृष्ण स्मरण', eyebrowEn: 'Devotion to Achyuta' },
  'hanuman-chalisa': { key: 'ramnavamiAyodhya', eyebrowHi: 'श्रीराम-हनुमद् भक्ति', eyebrowEn: 'Devotion of Ayodhya' },
  'sankat-mochan-hanuman-ashtak': { key: 'ramnavamiAyodhya', eyebrowHi: 'संकटमोचन प्रार्थना', eyebrowEn: 'Prayer of Courage' },
  'gayatri-mantra': { key: 'ghatMorning', eyebrowHi: 'प्रातः सन्ध्या', eyebrowEn: 'Dawn Contemplation' },
  'aditya-hridaya-stotra': { key: 'ghatMorning', eyebrowHi: 'सूर्य उपासना', eyebrowEn: 'Hymn to the Rising Sun' },
  'dakshinamurthy-stotram': { key: 'guruPurnimaAshram', eyebrowHi: 'वटमूल गुरु-ध्यान', eyebrowEn: 'Silent Teacher Beneath the Banyan' },
};

export function getMantraScene(slug: string): TaggedEditorialScene | undefined {
  const entry = MANTRA_SCENE_MAP[slug];
  return entry ? { scene: EDITORIAL_SCENES[entry.key], eyebrowHi: entry.eyebrowHi, eyebrowEn: entry.eyebrowEn } : undefined;
}

const LOCATION_SCENE_MAP: Readonly<Record<string, keyof typeof EDITORIAL_SCENES>> = {
  vrindavan: 'janmashtamiVrindavan',
  yamuna: 'janmashtamiVrindavan',
  naimisha: 'sacredGrove',
  dandakaranya: 'sacredGrove',
  kashi: 'ghatMorning',
  ganga: 'ghatMorning',
  prayaga: 'ghatMorning',
  sarayu: 'ramnavamiAyodhya',
  ayodhya: 'ramnavamiAyodhya',
  rameshvaram: 'templeDarshan',
  dwaraka: 'templeDarshan',
  vaikuntha: 'templeDarshan',
  mathura: 'templeKirtan',
  kailasha: 'mahashivaratriKailasha',
  badarinatha: 'mahashivaratriKailasha',
  meru: 'mahashivaratriKailasha',
  kurukshetra: 'gitaJayantiKurukshetra',
  saraswati: 'guruPurnimaAshram',
};

export function getLocationScene(locationId: string): EditorialScene | undefined {
  const key = LOCATION_SCENE_MAP[locationId];
  return key ? EDITORIAL_SCENES[key] : undefined;
}

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev').replace(/\/+$/, '');

export function buildPosterWhatsAppHref(poster: WisdomPoster): string {
  const pageUrl = `${SITE_ORIGIN}${poster.href}`;
  const text = `🪔 *${poster.titleHi}* (${poster.referenceHi})\n${poster.captionHi}\n\n📖 पूरा श्लोक व व्याख्या पढ़ें:\n${pageUrl}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
