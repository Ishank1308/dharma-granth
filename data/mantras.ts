/**
 * Canonical Mantras & Shanti Suktas of Dharma Granth
 * Authentic Sanskrit, IAST, padaccheda, word-by-word meaning, Hindi and English translations,
 * and scriptural coordinates adhering to classical Vedic and Upanishadic standards.
 */

export interface MantraWordMeaning {
  sanskrit: string;
  iast: string;
  hindi: string;
  english: string;
}

export interface MantraFAQ {
  question: string;
  answer: string;
}

export interface SacredMantra {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  sanskrit: string;
  transliteration: string;
  category: 'vedic' | 'shanti' | 'stotra';
  categoryLabel: string;
  categoryLabelHi: string;
  rishi?: string;
  devata?: string;
  chhandas?: string;
  source: string;
  sourceCoordinates: string;
  sourceHref?: string;
  wordMeanings: MantraWordMeaning[];
  hindiMeaning: string;
  englishMeaning: string;
  significance: string;
  significanceHi: string;
  faqs: MantraFAQ[];
}

export const SACRED_MANTRAS: SacredMantra[] = [
  {
    id: 'gayatri-mantra',
    slug: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    titleHi: 'गायत्री मन्त्र',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    transliteration: 'oṃ bhūr bhuvaḥ svaḥ tatsaviturvareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt',
    category: 'vedic',
    categoryLabel: 'Vedic Mahamantra',
    categoryLabelHi: 'वैदिक महामन्त्र',
    rishi: 'महर्षि विश्वामित्र (Rishi Vishvamitra)',
    devata: 'सविता / परब्रह्म (Savita / Divine Light of Creation)',
    chhandas: 'गायत्री (Gāyatrī — 24 syllables)',
    source: 'Rigveda',
    sourceCoordinates: 'Rigveda 3.62.10; Shukla Yajurveda 36.3',
    sourceHref: '/scripture/nityakarmakriya/chapter/1/',
    wordMeanings: [
      { sanskrit: 'ॐ', iast: 'oṃ', hindi: 'परब्रह्म का वाचक प्रणव नाद', english: 'The primordial sound of the Supreme Brahman' },
      { sanskrit: 'भूः', iast: 'bhūḥ', hindi: 'प्राणस्वरूप, भूलोक (भौतिक जगत)', english: 'The physical realm of earthly existence / embodiment of vital life' },
      { sanskrit: 'भुवः', iast: 'bhuvaḥ', hindi: 'दुःखनाशक, अन्तरिक्षलोक', english: 'The mental / atmospheric plane / dispeller of sorrow' },
      { sanskrit: 'स्वः', iast: 'svaḥ', hindi: 'आनन्दस्वरूप, द्युलोक (स्वर्गलोक)', english: 'The celestial spiritual plane / embodiment of supreme bliss' },
      { sanskrit: 'तत्', iast: 'tat', hindi: 'उस परमात्मा का', english: 'That Divine Reality' },
      { sanskrit: 'सवितुः', iast: 'savituḥ', hindi: 'सम्पूर्ण सृष्टि के उत्पादक सविता का', english: 'Of the Divine Creator and Sun' },
      { sanskrit: 'वरेण्यम्', iast: 'vareṇyam', hindi: 'वरण करने योग्य, सर्वश्रेष्ठ', english: 'Most adorable, worthy of highest reverence' },
      { sanskrit: 'भर्गः', iast: 'bhargaḥ', hindi: 'पापनाशक, अज्ञानहारी दिव्य तेज', english: 'The spiritual radiance that destroys sins and ignorance' },
      { sanskrit: 'देवस्य', iast: 'devasya', hindi: 'प्रकाशमान परमात्मा का', english: 'Of the radiant Divine Lord' },
      { sanskrit: 'धीमहि', iast: 'dhīmahi', hindi: 'हम ध्यान करते हैं', english: 'We meditate upon' },
      { sanskrit: 'धियः', iast: 'dhiyaḥ', hindi: 'बुद्धियों व विचारों को', english: 'Our intellect, understanding and actions' },
      { sanskrit: 'यः', iast: 'yaḥ', hindi: 'जो परमात्मा', english: 'Who' },
      { sanskrit: 'नः', iast: 'naḥ', hindi: 'हमारी', english: 'Our' },
      { sanskrit: 'प्रचोदयात्', iast: 'pracodayāt', hindi: 'सन्मार्ग में प्रेरित व प्रकाशित करे', english: 'May inspire and awaken toward truth' },
    ],
    hindiMeaning: 'हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का ध्यान करते हैं। वह परमात्मा हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।',
    englishMeaning: 'We meditate upon the supreme, adorable divine radiance of Savita (the cosmic creator and source of light); may that Divine Being stimulate and illuminate our intellect toward the path of truth.',
    significance: 'The Gayatri Mantra is the crown jewel of the Vedas, revered as the Mother of Vedic wisdom. It seeks not personal wealth or egoistic victory, but the universal awakening of the higher intellect (Dhi) so that our thoughts and actions align with cosmic truth.',
    significanceHi: 'गायत्री मन्त्र वेदों का मुकुटमणि है, जिसे वेदों की जननी कहा गया है। यह व्यक्तिगत भोग या अहंकार की प्रार्थना नहीं, बल्कि बुद्धि को सन्मार्ग और सत्य की ओर जागृत करने की सार्वभौमिक प्रार्थना है।',
    faqs: [
      {
        question: 'What is the exact meaning of the Gayatri Mantra in Hindi and English?',
        answer: 'The Gayatri Mantra is a prayer addressed to Savita, the Divine Solar consciousness: "We meditate upon the supreme, adorable divine radiance of the Creator; may that Divine Being illuminate our intellect." In Hindi: "हम उस प्राणस्वरूप, दुःखनाशक, श्रेष्ठ, पापनाशक परमात्मा के तेज का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग में प्रेरित करे।"',
      },
      {
        question: 'What is the scriptural source of the Gayatri Mantra?',
        answer: 'The Gayatri Mantra is revealed in the Rigveda (Mandala 3, Sukta 62, Mantra 10) by Maharshi Vishvamitra. It is also found in the Shukla Yajurveda (36.3) and recited across all Vedic daily prayers (Sandhyavandana).',
      },
      {
        question: 'What do the Vyahrtis (Bhur Bhuvah Svah) signify in the Gayatri Mantra?',
        answer: 'The three sacred Vyahrtis represent the threefold universe: Bhur (the earthly physical plane), Bhuvas (the mental and subtle plane), and Svar (the celestial, spiritual realm of pure bliss). Reciting them harmonizes the body, mind, and spirit.',
      },
    ],
  },
  {
    id: 'mahamrityunjaya',
    slug: 'mahamrityunjaya',
    title: 'Maha Mrityunjaya Mantra',
    titleHi: 'महामृत्युंजय मन्त्र',
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
    transliteration: 'oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam | urvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||',
    category: 'vedic',
    categoryLabel: 'Vedic Mahamantra',
    categoryLabelHi: 'वैदिक महामन्त्र',
    rishi: 'महर्षि वशिष्ठ / मार्कण्डेय (Rishi Vasishtha / Markandeya)',
    devata: 'त्र्यम्बक शिव (Lord Shiva, the Three-Eyed Reality)',
    chhandas: 'अनुष्टुप् (Anuṣṭubh)',
    source: 'Rigveda',
    sourceCoordinates: 'Rigveda 7.59.12; Shukla Yajurveda 3.60',
    sourceHref: '/scripture/mahanarayana/chapter/1/',
    wordMeanings: [
      { sanskrit: 'ॐ', iast: 'oṃ', hindi: 'परम सत्ता का वाचक प्रणव', english: 'The primordial divine syllable' },
      { sanskrit: 'त्र्यम्बकम्', iast: 'tryambakam', hindi: 'तीन नेत्रों वाले (भूत, वर्तमान, भविष्य के साक्षी) भगवान् शिव', english: 'The Three-Eyed Lord who sees the threefold reality' },
      { sanskrit: 'यजामहे', iast: 'yajāmahe', hindi: 'हम पूजा, ध्यान व आराधना करते हैं', english: 'We worship, honor and revere' },
      { sanskrit: 'सुगन्धिम्', iast: 'sugandhim', hindi: 'दिव्य सुगन्ध से युक्त, परम पवित्र', english: 'Fragrant with divine grace and pure consciousness' },
      { sanskrit: 'पुष्टिवर्धनम्', iast: 'puṣṭivardhanam', hindi: 'जीवन-शक्ति और आध्यात्मिक सामर्थ्य को पुष्ट करने वाले', english: 'The nourisher and sustainer of all spiritual vitality' },
      { sanskrit: 'उर्वारुकम्', iast: 'urvārukam', hindi: 'पका हुआ खरबूजा / ककड़ी', english: 'A ripe melon / cucumber' },
      { sanskrit: 'इव', iast: 'iva', hindi: 'के समान', english: 'Like / just as' },
      { sanskrit: 'बन्धनात्', iast: 'bandhanāt', hindi: 'बेल के बन्धन से (डंठल से)', english: 'From its stem or stalk' },
      { sanskrit: 'मृत्योः', iast: 'mṛtyoḥ', hindi: 'मृत्यु व संसार के बन्धन से', english: 'From mortality and cyclic fear' },
      { sanskrit: 'मुक्षीय', iast: 'mukṣīya', hindi: 'हमें मुक्त करें', english: 'May I be liberated and released' },
      { sanskrit: 'मा', iast: 'mā', hindi: 'नहीं (कदापि नहीं)', english: 'Never / not' },
      { sanskrit: 'अमृतात्', iast: 'amṛtāt', hindi: 'अमरता (मोक्ष) से', english: 'From immortality and supreme liberation' },
    ],
    hindiMeaning: 'हम तीनों लोकों के स्वामी, दिव्य सुगन्ध और जीवन-शक्ति को पुष्ट करने वाले भगवान् शिव की आराधना करते हैं। जिस प्रकार पका हुआ खरबूजा अपनी बेल के बन्धन से अनायास ही मुक्त हो जाता है, उसी प्रकार हम मृत्यु के बन्धन से मुक्त हों, किन्तु अमरता (मोक्ष) से कभी वंचित न हों।',
    englishMeaning: 'We worship the Three-Eyed Lord Shiva, who is fragrant and who nourishes and sustains all beings. Just as a ripe melon naturally detaches from its vine without rupture, may we be liberated from the bondage of mortality, but never from the eternal nectar of immortality.',
    significance: 'The final metaphor of the Mahamrityunjaya Mantra is one of the most sublime in world literature: "urvārukam iva" — like a ripe cucumber releasing from its vine. Liberation (Moksha) is not a violent tearing; it is the gentle, natural release of mature wisdom when attachment falls away naturally.',
    significanceHi: 'इस मन्त्र का अंतिम रूपक "उर्वारुकमिव" भारतीय दर्शन का अनुपम दृष्टान्त है। मोक्ष जीवन का हिंसक अन्त नहीं, बल्कि ज्ञान की परिपक्वता से सांसारिक आसक्ति का स्वाभाविक, बिना किसी खिंचाव का विमुक्तीकरण है।',
    faqs: [
      {
        question: 'What is the meaning of the metaphor "urvarukam iva" in the Mahamrityunjaya Mantra?',
        answer: 'Urvarukam means a cucumber or melon. When it ripens completely on the vine, it detaches gracefully on its own without tearing the vine. The mantra asks Lord Shiva that when our life is fully ripe with wisdom and dharma, we may release peacefully from the mortal body into immortality.',
      },
      {
        question: 'What are the benefits of chanting the Mahamrityunjaya Mantra?',
        answer: 'According to classical scriptures (Rigveda and Shiva Purana), the Mahamrityunjaya Mantra dispels fear of death, shields against untoward accidents, confers peace during times of physical and mental distress, and grants spiritual liberation (Moksha).',
      },
      {
        question: 'Where does the Mahamrityunjaya Mantra originate?',
        answer: 'It is found in the Rigveda (Mandala 7, Sukta 59, Mantra 12) revealed to Maharshi Vasishtha. It is also preserved in Shukla Yajurveda (Vajasaneyi Samhita 3.60) and Taittiriya Aranyaka (Mahanarayana Upanishad).',
      },
    ],
  },
  {
    id: 'asato-ma-sadgamaya',
    slug: 'asato-ma-sadgamaya',
    title: 'Pavamana Shanti Mantra',
    titleHi: 'पवमान शान्ति मन्त्र (असतो मा सद्गमय)',
    sanskrit: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
    transliteration: 'oṃ asato mā sadgamaya | tamaso mā jyotirgamaya | mṛtyormā amṛtaṃ gamaya || oṃ śāntiḥ śāntiḥ śāntiḥ ||',
    category: 'shanti',
    categoryLabel: 'Upanishadic Shanti Mantra',
    categoryLabelHi: 'उपनिषद् शान्ति मन्त्र',
    rishi: 'महर्षि याज्ञवल्क्य (Rishi Yajnavalkya)',
    devata: 'परब्रह्म परमात्मा (Pure Supreme Consciousness)',
    chhandas: 'वैदिक गद्य-पद्य (Vedic Invocation)',
    source: 'Brihadaranyaka Upanishad',
    sourceCoordinates: 'Brihadaranyaka Upanishad 1.3.28',
    sourceHref: '/scripture/brihadaranyaka/chapter/1/',
    wordMeanings: [
      { sanskrit: 'ॐ', iast: 'oṃ', hindi: 'परम सत्ता का वाचक', english: 'The primordial Brahman' },
      { sanskrit: 'असतः', iast: 'asataḥ', hindi: 'असत्य व नश्वर जगत से', english: 'From the unreal, ephemeral existence' },
      { sanskrit: 'मा', iast: 'mā', hindi: 'मुझको', english: 'Me' },
      { sanskrit: 'सत्', iast: 'sat', hindi: 'सत्य, शाश्वत तत्त्व की ओर', english: 'To the Real, Eternal Reality' },
      { sanskrit: 'गमय', iast: 'gamaya', hindi: 'ले चलें', english: 'Lead / guide' },
      { sanskrit: 'तमसः', iast: 'tamasaḥ', hindi: 'अज्ञान रूपी अंधकार से', english: 'From darkness of ignorance' },
      { sanskrit: 'ज्योतिः', iast: 'jyotiḥ', hindi: 'ज्ञान रूपी प्रकाश की ओर', english: 'To the divine light of self-knowledge' },
      { sanskrit: 'मृत्योः', iast: 'mṛtyoḥ', hindi: 'मृत्यु के भय से', english: 'From mortality' },
      { sanskrit: 'अमृतम्', iast: 'amṛtam', hindi: 'अमरत्व (मोक्ष) की ओर', english: 'To immortality' },
    ],
    hindiMeaning: 'हे प्रभु! मुझे असत्य (नश्वर प्रपञ्च) से सत्य (शाश्वत तत्त्व) की ओर ले चलें। मुझे अज्ञान रूपी अंधकार से ज्ञान रूपी दिव्य प्रकाश की ओर ले चलें। मुझे नश्वर मृत्यु के बन्धन से अमरत्व (मोक्ष) की ओर ले चलें।',
    englishMeaning: 'Lead me from the unreal to the real; lead me from the darkness of ignorance to the light of spiritual knowledge; lead me from the fear of death to the nectar of immortality. Om Peace, Peace, Peace.',
    significance: 'The Pavamana Mantra is the quintessential prayer of Sanatana Dharma. As Sage Shankara explains in his commentary, "Asat" is our mistaken identification with the perishable body-mind; "Sat" is the eternal witness (Atman). The prayer seeks progression from limitation to infinite freedom.',
    significanceHi: 'पवमान मन्त्र सनातन धर्म की सर्वोच्च प्रार्थना है। आदि शंकराचार्य के भाष्य अनुसार "असत्" नाशवान देह-भाव है और "सत्" शाश्वत आत्मा। यह मन्त्र नश्वरता से शाश्वत मोक्ष की ओर यात्रा का संकल्प है।',
    faqs: [
      {
        question: 'What is the scriptural origin of "Asato Ma Sadgamaya"?',
        answer: 'It originates from the Brihadaranyaka Upanishad (1.3.28) belonging to the Shukla Yajurveda, where it is known as the Pavamana Abhyaroha recitation.',
      },
      {
        question: 'What do the three phrases in the Pavamana Mantra represent?',
        answer: 'The three progressive petitions represent: 1) discernment between the changing world and unchanging reality (Sat-Asat Viveka), 2) removal of spiritual ignorance (Avidya) by the dawn of knowledge (Jyoti), and 3) liberation from the fear of mortality into eternal Atmic bliss (Amrita).',
      },
    ],
  },
  {
    id: 'purnamadah',
    slug: 'purnamadah',
    title: 'Purnamadah Shanti Mantra',
    titleHi: 'पूर्णमदः पूर्णमिदम् शान्ति मन्त्र',
    sanskrit: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
    transliteration: "oṃ pūrṇamadaḥ pūrṇamidaṃ pūrṇātpūrṇamudacyate | pūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate || oṃ śāntiḥ śāntiḥ śāntiḥ ||",
    category: 'shanti',
    categoryLabel: 'Upanishadic Shanti Mantra',
    categoryLabelHi: 'उपनिषद् शान्ति मन्त्र',
    source: 'Isha & Brihadaranyaka Upanishad',
    sourceCoordinates: 'Isha Upanishad Shanti Patha; Brihadaranyaka Upanishad 5.1.1',
    sourceHref: '/scripture/ishavasya/',
    wordMeanings: [
      { sanskrit: 'पूर्णम्', iast: 'pūrṇam', hindi: 'अखण्ड, परिपूर्ण, अनन्त', english: 'Whole, complete, infinite' },
      { sanskrit: 'अदः', iast: 'adaḥ', hindi: 'वह (अदृश्य परब्रह्म)', english: 'That (unmanifest transcendent Brahman)' },
      { sanskrit: 'इदम्', iast: 'idam', hindi: 'यह (दृश्यमान जगत)', english: 'This (manifest universe)' },
      { sanskrit: 'पूर्णात्', iast: 'pūrṇāt', hindi: 'उस पूर्ण परब्रह्म से', english: 'From that infinite Whole' },
      { sanskrit: 'उदच्यते', iast: 'udacyate', hindi: 'उत्पन्न होता है, प्रकट होता है', english: 'Becomes manifest / emanates' },
      { sanskrit: 'आदाय', iast: 'ādāya', hindi: 'निकाल लेने पर भी', english: 'Taking away / realizing' },
      { sanskrit: 'अवशिष्यते', iast: 'avaśiṣyate', hindi: 'शेष बचता है', english: 'Remains as it is' },
    ],
    hindiMeaning: 'वह (अदृश्य परब्रह्म) भी पूर्ण है और यह (दृश्यमान जगत्) भी पूर्ण है। पूर्ण से ही पूर्ण की उत्पत्ति होती है। पूर्ण में से पूर्ण को निकाल लेने पर भी पूर्ण ही शेष बचता है।',
    englishMeaning: 'That (unmanifest Brahman) is infinite and whole; this (manifest universe) is also infinite and whole. From the infinite Whole, the infinite Whole emerges. Taking the infinite Whole from the infinite Whole, the infinite Whole alone remains.',
    significance: 'This mantra encapsulates the mathematics of infinity and the non-dual truth of Vedanta. The creation of the universe does not diminish Brahman, just as infinity minus infinity remains infinite. The Divine is whole before creation, during creation, and upon dissolution.',
    significanceHi: 'यह मन्त्र अद्वैत वेदान्त का गणितीय रहस्य है। अनन्त में से अनन्त की सृष्टि होने पर भी मूल अनन्त में तनिक भी कमी नहीं आती। परब्रह्म सृष्टि से पूर्व, सृष्टि के समय और प्रलय के पश्चात् भी अखण्ड पूर्ण ही रहता है।',
    faqs: [
      {
        question: 'What is the philosophical meaning of Purnamadah Purnamidam?',
        answer: 'It teaches that the Supreme Reality (Brahman) is an indivisible, infinite Whole. When this visible universe emerges from Brahman, Brahman does not lose anything; both cause and effect are inherently the same infinite consciousness.',
      },
    ],
  },
  {
    id: 'sahana-vavatu',
    slug: 'sahana-vavatu',
    title: 'Sahana Vavatu Shanti Mantra',
    titleHi: 'सह नाववतु (गुरु-शिष्य शान्ति मन्त्र)',
    sanskrit: 'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
    transliteration: 'oṃ saha nāvavatu | saha nau bhunaktu | saha vīryaṃ karavāvahai | tejasvi nāvadhītamastu mā vidviṣāvahai || oṃ śāntiḥ śāntiḥ śāntiḥ ||',
    category: 'shanti',
    categoryLabel: 'Upanishadic Shanti Mantra',
    categoryLabelHi: 'उपनिषद् शान्ति मन्त्र',
    source: 'Taittiriya & Katha Upanishad',
    sourceCoordinates: 'Taittiriya Upanishad 2.1; Katha Upanishad 1.1',
    sourceHref: '/scripture/taittiriya/',
    wordMeanings: [
      { sanskrit: 'सह', iast: 'saha', hindi: 'साथ-साथ', english: 'Together' },
      { sanskrit: 'नौ', iast: 'nau', hindi: 'हम दोनों की (गुरु और शिष्य की)', english: 'Both of us (teacher and student)' },
      { sanskrit: 'अवतु', iast: 'avatu', hindi: 'रक्षा करें', english: 'May He protect' },
      { sanskrit: 'भुनक्तु', iast: 'bhunaktu', hindi: 'पालन-पोषण करें', english: 'May He nourish' },
      { sanskrit: 'वीर्यम्', iast: 'vīryam', hindi: 'अध्ययन का सामर्थ्य व ओज', english: 'Spiritual vigor and capacity' },
      { sanskrit: 'करवावहै', iast: 'karavāvahai', hindi: 'हम दोनों सम्पादित करें', english: 'May we generate / exert together' },
      { sanskrit: 'तेजस्वि', iast: 'tejasvi', hindi: 'तेजस्वी, फलदायी', english: 'Brilliant and illuminating' },
      { sanskrit: 'अधीतम्', iast: 'adhītam', hindi: 'पढ़ा हुआ ज्ञान', english: 'Studied knowledge' },
      { sanskrit: 'अस्तु', iast: 'astu', hindi: 'हो', english: 'May it be' },
      { sanskrit: 'मा विद्विषावहै', iast: 'mā vidviṣāvahai', hindi: 'हम परस्पर कभी द्वेष न करें', english: 'May we never dispute or harbor ill-will' },
    ],
    hindiMeaning: 'परमेश्वर हम दोनों (गुरु और शिष्य) की साथ-साथ रक्षा करें। हम दोनों का साथ-साथ पोषण करें। हम दोनों मिलकर महान् आध्यात्मिक सामर्थ्य अर्जित करें। हमारा अध्ययन किया हुआ ज्ञान तेजस्वी हो। हम कभी परस्पर द्वेष या कलह न करें।',
    englishMeaning: 'May the Supreme Being protect us both (teacher and student) together. May He nourish us both together. May we work together with great energy. May our study be brilliant and enlightened. May we never harbor ill-will or dispute among ourselves.',
    significance: 'The timeless invocation for learning and collaborative pursuit of sacred knowledge. It emphasizes that true education requires harmony, mutual respect, and absence of rivalry between master and disciple.',
    significanceHi: 'विद्याध्ययन का यह सनातन मन्त्र गुरु और शिष्य के मध्य परस्पर विश्वास, स्नेह और सहयोग की नींव रखता है। सच्चा ज्ञान तभी फलित होता है जब अहंकार और ईर्ष्या का सर्वथा त्याग हो।',
    faqs: [
      {
        question: 'Why is "Ma Vidvishavahai" so critical in the Sahana Vavatu mantra?',
        answer: 'Subtle differences in understanding between teacher and student can create friction or resentment. The prayer explicitly invokes grace to prevent misunderstanding, preserving the pure sanctity of spiritual transmission.',
      },
    ],
  },
  {
    id: 'sarve-bhavantu-sukhinah',
    slug: 'sarve-bhavantu-sukhinah',
    title: 'Sarve Bhavantu Sukhinah',
    titleHi: 'सर्वे भवन्तु सुखिनः (विश्व-कल्याण प्रार्थना)',
    sanskrit: 'ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
    transliteration: 'oṃ sarve bhavantu sukhinaḥ sarve santu nirāmayāḥ | sarve bhadrāṇi paśyantu mā kaścidduḥkhabhāgbhavet || oṃ śāntiḥ śāntiḥ śāntiḥ ||',
    category: 'shanti',
    categoryLabel: 'Universal Welfare Prayer',
    categoryLabelHi: 'विश्व-कल्याण मन्त्र',
    source: 'Brihadaranyaka Upanishad tradition & Garuda Purana',
    sourceCoordinates: 'Classical Vedic Benediction',
    wordMeanings: [
      { sanskrit: 'सर्वे', iast: 'sarve', hindi: 'सभी प्राणी', english: 'All beings' },
      { sanskrit: 'भवन्तु', iast: 'bhavantu', hindi: 'हों', english: 'May become / be' },
      { sanskrit: 'सुखिनः', iast: 'sukhinaḥ', hindi: 'सुखी व सन्तुष्ट', english: 'Happy and joyful' },
      { sanskrit: 'सन्तु', iast: 'santu', hindi: 'रहें', english: 'May be' },
      { sanskrit: 'निरामयाः', iast: 'nirāmayāḥ', hindi: 'रोग-मुक्त, स्वस्थ', english: 'Free from illness / healthy' },
      { sanskrit: 'भद्राणि', iast: 'bhadrāṇi', hindi: 'कल्याणकारी व शुभ', english: 'Auspiciousness, goodness and nobility' },
      { sanskrit: 'पश्यन्तु', iast: 'paśyantu', hindi: 'देखें, अनुभव करें', english: 'May perceive and experience' },
      { sanskrit: 'मा', iast: 'mā', hindi: 'नहीं', english: 'Not' },
      { sanskrit: 'कश्चित्', iast: 'kaścit', hindi: 'कोई भी', english: 'Anyone / any being' },
      { sanskrit: 'दुःखभाक्', iast: 'duḥkhabhāk', hindi: 'दुःख का भागी', english: 'Partaker of sorrow' },
      { sanskrit: 'भवेत्', iast: 'bhavet', hindi: 'बने', english: 'Should be' },
    ],
    hindiMeaning: 'संसार के सभी प्राणी सुखी हों, सभी निरोगी (रोग-मुक्त) हों, सभी का कल्याण हो और किसी भी प्राणी को लेशमात्र भी दुःख का भागी न बनना पड़े।',
    englishMeaning: 'May all sentient beings be happy; may all beings be free from illness and distress; may all perceive what is auspicious and good; may no one experience sorrow or suffering. Om Peace, Peace, Peace.',
    significance: 'The highest expression of Sarve Bhavantu Sukhinah is Vasudhaiva Kutumbakam — treating all creation as one family without sectarian, national, or species distinction.',
    significanceHi: 'यह प्रार्थना "वसुधैव कुटुम्बकम्" के सार्वभौमिक सत्य की पराकाष्ठा है, जिसमें बिना किसी भेद के समस्त चराचर जगत के स्वास्थ्य और कल्याण की कामना की गई है।',
    faqs: [
      {
        question: 'What is the message of Sarve Bhavantu Sukhinah?',
        answer: 'It is the quintessential Sanatana Dharma benediction wishing peace, health, and happiness for all living beings across the universe, praying that no creature should suffer.',
      },
    ],
  },
  {
    id: 'nirvana-shatakam',
    slug: 'nirvana-shatakam',
    title: 'Nirvana Shatakam',
    titleHi: 'निर्वाणषट्कम् (शिवोऽहम्)',
    sanskrit: 'मनोबुद्ध्यहङ्कारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे । न च व्योम भूमिर्न तेजो न वायुश्चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥',
    transliteration: "manobuddhyahaṅkāracittāni nāhaṃ na ca śrotrajihve na ca ghrāṇanetre | na ca vyoma bhūmirna tejo na vāyuścidānandarūpaḥ śivo'ham śivo'ham ||",
    category: 'stotra',
    categoryLabel: 'Advaita Vedanta Stotram',
    categoryLabelHi: 'अद्वैत वेदान्त स्तोत्र',
    rishi: 'आदि शंकराचार्य (Adi Shankaracharya)',
    devata: 'शुद्ध आत्मचैतन्य (Shiva / Pure Consciousness)',
    chhandas: 'भुजङ्गप्रयात (Bhujangaprayata)',
    source: 'Adi Shankara Stotra Sangraha',
    sourceCoordinates: 'Verse 1 of 6',
    wordMeanings: [
      { sanskrit: 'मनः-बुद्धि-अहङ्कार-चित्तानि', iast: 'mano-buddhy-ahaṅkāra-cittāni', hindi: 'मन, बुद्धि, अहंकार और चित्त (अन्तःकरण)', english: 'Mind, intellect, ego, and memory' },
      { sanskrit: 'न अहम्', iast: 'na aham', hindi: 'मैं नहीं हूँ', english: 'I am not' },
      { sanskrit: 'न च श्रोत्र-जिह्वे', iast: 'na ca śrotra-jihve', hindi: 'न मैं कान हूँ, न जीभ', english: 'Neither the sense of hearing nor taste' },
      { sanskrit: 'न च घ्राण-नेत्रे', iast: 'na ca ghrāṇa-netre', hindi: 'न मैं नासिका हूँ, न आँखें', english: 'Neither the sense of smell nor sight' },
      { sanskrit: 'न च व्योम भूमिः', iast: 'na ca vyoma bhūmiḥ', hindi: 'न मैं आकाश हूँ, न पृथ्वी', english: 'Neither space nor earth' },
      { sanskrit: 'न तेजः न वायुः', iast: 'na tejaḥ na vāyuḥ', hindi: 'न मैं अग्नि हूँ, न वायु', english: 'Neither fire nor air' },
      { sanskrit: 'चिदानन्दरूपः', iast: 'cidānandarūpaḥ', hindi: 'विशुद्ध चैतन्य और आनन्द-स्वरूप', english: 'The nature of pure consciousness and absolute bliss' },
      { sanskrit: 'शिवोऽहम्', iast: 'śivo\'ham', hindi: 'मैं ही शिव (कल्याणकारी आत्मा) हूँ', english: 'I am Shiva (the auspicious Witness)' },
    ],
    hindiMeaning: 'मैं न मन हूँ, न बुद्धि हूँ, न अहंकार हूँ और न ही चित्त हूँ। न मैं कान, जिह्वा, नासिका या नेत्र हूँ। न मैं आकाश, पृथ्वी, अग्नि या वायु हूँ। मैं तो विशुद्ध चैतन्य और आनन्द-स्वरूप शिव हूँ, मैं ही शिव हूँ।',
    englishMeaning: 'I am neither the mind, nor the intellect, nor the ego, nor the subconscious memory. I am neither the ears, nor the tongue, nor the nose, nor the eyes. Nor am I ether, earth, fire, or air. I am pure consciousness and bliss supreme: I am Shiva, I am Shiva.',
    significance: 'Composed when a young Shankaracharya encountered Sage Govinda Bhagavatpada and was asked "Who are you?". Rather than giving a bodily or caste identity, he sang these verses affirming pure, non-dual consciousness.',
    significanceHi: 'जब गुरु गोविन्द भगवत्पाद ने आदि शंकराचार्य से पूछा "तुम कौन हो?", तब उन्होंने देह या कुल का परिचय न देकर यह स्तोत्र गाया, जो आत्मा के शुद्ध साक्षी भाव (शिवोऽहम्) की घोषणा करता है।',
    faqs: [
      {
        question: 'What is the core teaching of Nirvana Shatakam?',
        answer: 'Nirvana Shatakam teaches Neti-Neti (not this, not this): disidentifying from the physical body, the senses, the intellect, and the ego, and realizing that our true nature is immortal, non-dual consciousness and bliss (Shivoham).',
      },
    ],
  },
  {
    id: 'shiva-tandava',
    slug: 'shiva-tandava',
    title: 'Shiva Tandava Stotram',
    titleHi: 'शिवताण्डवस्तोत्रम्',
    sanskrit: 'जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् । डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥',
    transliteration: "jaṭāṭavīgalajjalapravāhapāvitasthale gale'valambya lambitāṃ bhujaṅgatuṅgamālikām | ḍamaḍḍamaḍḍamaḍḍamanninādavaḍḍamarvayaṃ cakāra caṇḍatāṇḍavaṃ tanotu naḥ śivaḥ śivam ||",
    category: 'stotra',
    categoryLabel: 'Classical Stotram',
    categoryLabelHi: 'शास्त्रीय स्तोत्र',
    rishi: 'रावण (Composed by Ravana)',
    devata: 'नटराज शिव (Lord Shiva, Master of the Cosmic Dance)',
    chhandas: 'पञ्चचामर (Pancacamara metre)',
    source: 'Ravana Samhita & Shiva Purana tradition',
    sourceCoordinates: 'Verse 1',
    sourceHref: '/scripture/ravanasamhita/',
    wordMeanings: [
      { sanskrit: 'जटा-अटवी', iast: 'jaṭā-aṭavī', hindi: 'सघन वन-समान जटाओं से', english: 'Dense forest of matted hair' },
      { sanskrit: 'गलत्-जल-प्रवाह-पावित-स्थले', iast: 'galat-jala-pravāha-pāvita-sthale', hindi: 'बहते हुए गंगाजल से पवित्र कण्ठ प्रदेश में', english: 'Whose throat is purified by the flowing streams of celestial water' },
      { sanskrit: 'भुजङ्ग-तुङ्ग-मालिकाम्', iast: 'bhujaṅga-tuṅga-mālikām', hindi: 'विशाल सर्पों की लटकती हुई माला को', english: 'The garland of great serpents draped around the neck' },
      { sanskrit: 'डमड्-डमड्-निनादवत्', iast: 'ḍamaḍ-ḍamaḍ-ninādavat', hindi: 'डम-डम की दिव्य ध्वनि करते हुए', english: 'Resounding with the powerful rhythm of Damaru' },
      { sanskrit: 'चकार चण्डताण्डवम्', iast: 'cakāra caṇḍatāṇḍavam', hindi: 'जिन्होंने प्रचण्ड ताण्डव नृत्य किया', english: 'Who performed the fierce cosmic dance' },
      { sanskrit: 'तनोतु नः शिवः शिवम्', iast: 'tanotu naḥ śivaḥ śivam', hindi: 'वे भगवान् शिव हमारा परम कल्याण करें', english: 'May that Shiva extend supreme auspiciousness unto us' },
    ],
    hindiMeaning: 'सघन वन-समान जटाओं से बहती गंगाजी की पवित्र धाराओं से पावन कण्ठ में बड़े-बड़े सर्पों की विशाल माला को धारण किये, \'डमड्-डमड्\' करते हुए डमरू की ध्वनि पर प्रचण्ड ताण्डव करने वाले भगवान् शिव हम सभी का कल्याण करें।',
    englishMeaning: 'May Lord Shiva, whose neck is consecrated by the sacred flow of the Ganga streaming from His dense forest-like matted locks, who wears the great coiled serpent as a garland, and who performs the fierce Tandava dance to the resonant rhythm of His Damaru drum, bestow auspiciousness upon us.',
    significance: 'A masterpiece of Sanskrit meter and alliteration composed by Ravana under Mount Kailash. Its pulsating Panchacamara rhythm mirrors the cosmic dance of creation and dissolution.',
    significanceHi: 'संस्कृत छन्द और अनुप्रास का यह शिखर ग्रन्थ रावण द्वारा रचित है। इसका पञ्चचामर छन्द सृष्टि और प्रलय के महानाद को प्रतिध्वनित करता है।',
    faqs: [
      {
        question: 'Who composed the Shiva Tandava Stotram?',
        answer: 'According to tradition and the Shiva Purana, it was composed by Ravana while praising Lord Shiva with profound poetic mastery under Mount Kailash.',
      },
    ],
  },
  {
    id: 'purusha-sukta',
    slug: 'purusha-sukta',
    title: 'Purusha Sukta',
    titleHi: 'पुरुषसूक्तम्',
    sanskrit: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् । स भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥',
    transliteration: 'sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt | sa bhūmiṃ viśvato vṛtvātyatiṣṭhaddaśāṅgulam ||',
    category: 'vedic',
    categoryLabel: 'Vedic Sukta',
    categoryLabelHi: 'वैदिक सूक्त',
    rishi: 'ऋषि नारायण (Rishi Narayana)',
    devata: 'विराट् पुरुष (The Cosmic Person / Supreme Reality)',
    chhandas: 'अनुष्टुप् (Anuṣṭubh)',
    source: 'Rigveda',
    sourceCoordinates: 'Rigveda 10.90.1; Shukla Yajurveda 31.1',
    sourceHref: '/scripture/mahanarayana/chapter/1/',
    wordMeanings: [
      { sanskrit: 'सहस्रशीर्षा', iast: 'sahasraśīrṣā', hindi: 'हजारों (असंख्य) सिरों वाला', english: 'Having thousands of heads' },
      { sanskrit: 'पुरुषः', iast: 'puruṣaḥ', hindi: 'सर्वव्यापक विराट् पुरुष (परब्रह्म)', english: 'The Supreme Cosmic Person' },
      { sanskrit: 'सहस्राक्षः', iast: 'sahasrākṣaḥ', hindi: 'हजारों आँखों वाला', english: 'Having thousands of eyes' },
      { sanskrit: 'सहस्रपात्', iast: 'sahasrapāt', hindi: 'हजारों पैरों वाला', english: 'Having thousands of feet' },
      { sanskrit: 'सः', iast: 'saḥ', hindi: 'उसने', english: 'He' },
      { sanskrit: 'भूमिम्', iast: 'bhūmim', hindi: 'संपूर्ण ब्रह्मांड व पृथ्वी को', english: 'The entire universe and earth' },
      { sanskrit: 'विश्वतः', iast: 'viśvataḥ', hindi: 'सब ओर से', english: 'From all directions / completely' },
      { sanskrit: 'वृत्वा', iast: 'vṛtvā', hindi: 'व्याप्त करके, आच्छादित कर', english: 'Encompassing and pervading' },
      { sanskrit: 'अत्यतिष्ठत्', iast: 'atyatiṣṭhat', hindi: 'परे स्थित है', english: 'Transcends / extends beyond' },
      { sanskrit: 'दशाङ्गुलम्', iast: 'daśāṅgulam', hindi: 'दस अंगुल परिमाण से (अनन्त में)', english: 'By ten fingers (into the transcendent realm)' },
    ],
    hindiMeaning: 'वह परम पुरुष सहस्रों (असंख्य) सिरों, सहस्रों आँखों और सहस्रों चरणों वाला है। उसने संपूर्ण ब्रह्मांड और पृथ्वी को सब ओर से व्याप्त करके दस अंगुल परिमाण से परे (अनन्त में) स्थित है।',
    englishMeaning: 'The Supreme Cosmic Person has thousands of heads, thousands of eyes, and thousands of feet. Pervading the entire cosmos on every side, He extends beyond it into the transcendent infinity.',
    significance: 'The foundational Vedic hymn of cosmic unity. It reveals that all beings are limbs of the one universal Divinity — teaching that reverence for nature and humanity is direct worship of God.',
    significanceHi: 'पुरुष सूक्त वेदों का ब्रह्माण्डीय एकता का उद्घोष है। यह दर्शाता है कि समस्त सृष्टि एक ही विराट् परमेश्वर का स्वरूप है, अतः प्रत्येक प्राणी के प्रति आदर ईश्वर की प्रत्यक्ष आराधना है।',
    faqs: [
      {
        question: 'What is the central theme of the Purusha Sukta?',
        answer: 'The Purusha Sukta celebrates the organic spiritual unity of the universe, describing how the single Cosmic Person pervades all manifest creation and simultaneously transcends it infinitely.',
      },
    ],
  },
];

export function getMantraBySlug(slug: string): SacredMantra | undefined {
  return SACRED_MANTRAS.find((m) => m.slug === slug || m.id === slug);
}

