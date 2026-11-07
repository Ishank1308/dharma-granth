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
  {
    id: 'hanuman-chalisa',
    slug: 'hanuman-chalisa',
    title: 'Hanuman Chalisa',
    titleHi: 'श्री हनुमान चालीसा',
    sanskrit: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।
बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार ।
बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥
जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥
राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥`,
    transliteration: `śrīguru carana saroja raja nija manu mukuru sudhāri |
baranau raghubara bimala jasu jo dāyaku phala cāri ||
buddhihīna tanu jānike sumirau pavana-kumāra |
bala budhi bidyā dehu mohi harahu kalesa bikāra ||
jaya hanumāna jñāna guna sāgara | jaya kapīsa tihu loka ujāgara ||
rāma dūta atulita bala dhāmā | añjani-putra pavanasuta nāmā ||`,
    category: 'stotra',
    categoryLabel: 'Devotional Stotra / Awadhi Hymn',
    categoryLabelHi: 'भक्ति स्तोत्र व चालीसा',
    rishi: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    devata: 'श्री हनुमान जी (Bhagavan Hanuman)',
    chhandas: 'दोहा एवं चौपाई (Doha & Chaupai)',
    source: 'Awadhi Devotional Literature',
    sourceCoordinates: 'Goswami Tulsidas Composition, c. 16th Century CE',
    sourceHref: '/scripture/ramcharitmanas/chapter/5/',
    wordMeanings: [
      { sanskrit: 'श्रीगुरु चरन सरोज रज', iast: 'śrīguru carana saroja raja', hindi: 'श्री गुरु के चरण-कमलों की पावन धूलि से', english: "With the dust of the holy Guru's lotus feet" },
      { sanskrit: 'निज मनु मुकुरु', iast: 'nija manu mukuru', hindi: 'अपने मन रूपी दर्पण को', english: "The mirror of one's own mind" },
      { sanskrit: 'सुधारि', iast: 'sudhāri', hindi: 'निर्मल व शुद्ध करके', english: 'Having cleansed and polished' },
      { sanskrit: 'बरनउँ', iast: 'baranau', hindi: 'वर्णन करता हूँ', english: 'I narrate / celebrate' },
      { sanskrit: 'रघुबर बिमल जसु', iast: 'raghubara bimala jasu', hindi: 'श्री रघुनाथ जी का निर्मल यश', english: 'The spotless glory of Sri Ramachandra' },
      { sanskrit: 'जो दायकु फल चारि', iast: 'jo dāyaku phala cāri', hindi: 'जो धर्म, अर्थ, काम और मोक्ष रूपी चार फल देने वाला है', english: 'Which bestows the four supreme fruits (Purusharthas)' },
      { sanskrit: 'बुद्धिहीन तनु जानिके', iast: 'buddhihīna tanu jānike', hindi: 'स्वयं को ज्ञान व बुद्धि से हीन जानकर', english: 'Knowing myself to be deficient in wisdom' },
      { sanskrit: 'सुमिरौं पवन-कुमार', iast: 'sumirau pavana-kumāra', hindi: 'पवनपुत्र श्री हनुमान का स्मरण करता हूँ', english: 'I meditate upon Hanuman, son of the Wind God' },
      { sanskrit: 'बल बुधि बिद्या देहु मोहिं', iast: 'bala budhi bidyā dehu mohi', hindi: 'मुझे बल, सद्बुद्धि और आत्मविद्या प्रदान कीजिए', english: 'Grant me strength, wisdom, and spiritual insight' },
      { sanskrit: 'हरहु कलेस बिकार', iast: 'harahu kalesa bikāra', hindi: 'मेरे समस्त क्लेशों और मानसिक विकारों को हर लीजिए', english: 'And dispel all my afflictions and inner impurities' },
    ],
    hindiMeaning: 'श्री गुरु के चरण-कमलों की धूलि से अपने मन रूपी दर्पण को पवित्र करके, मैं श्री रघुनाथ जी के निर्मल यश का गान करता हूँ, जो धर्म, अर्थ, काम और मोक्ष—इन चारों फलों को देने वाला है। स्वयं को बुद्धिहीन जानकर मैं पवनपुत्र श्री हनुमान का स्मरण करता हूँ; वे मुझे बल, सद्बुद्धि और विद्या प्रदान करें तथा मेरे समस्त क्लेशों और मानसिक विकारों का नाश करें। हे हनुमान जी! आपकी जय हो, आप ज्ञान और सद्गुणों के महासागर हैं!',
    englishMeaning: 'Cleansing the mirror of my mind with the dust of my holy Guru’s lotus feet, I chant the pure glory of Sri Raghuvara, which bestows the four supreme fruits of life (Dharma, Artha, Kama, and Moksha). Knowing myself to be deficient in wisdom, I meditate upon Pavana-kumara (Hanuman). May He grant me strength, wisdom, and spiritual discernment, and dispel all my afflictions and inner impurities. Victory to Lord Hanuman, the ocean of divine wisdom and virtuous qualities!',
    significance: 'The supreme hymn of devotion, unshakeable courage, and dedicated service. Goswami Tulsidas demonstrates that surrender to divine dharma removes inner fear, despair, and obstacles.',
    significanceHi: 'हनुमान चालीसा भक्ति, निष्ठा और आत्म-संयम का परम स्तोत्र है। तुलसीदास जी ने इसमें दर्शाया है कि अहंकार-रहित सेवा और राम-स्मरण से असंभव कार्य भी सुगम हो जाते हैं।',
    faqs: [
      {
        question: 'What are the four fruits (फल चारि) mentioned in the opening doha of Hanuman Chalisa?',
        answer: 'The four fruits are the classical Purusharthas: Dharma (righteous duty), Artha (honest prosperity), Kama (wholesome desires), and Moksha (spiritual liberation).',
      },
      {
        question: 'Who composed the Hanuman Chalisa and in what language?',
        answer: 'Goswami Tulsidas composed it in the 16th century CE in the Awadhi language (a literary dialect of Hindi).',
      },
    ],
  },
  {
    id: 'aditya-hridaya-stotra',
    slug: 'aditya-hridaya-stotra',
    title: 'Aditya Hridaya Stotra',
    titleHi: 'आदित्यहृदयस्तोत्रम्',
    sanskrit: `ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।
रावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥
दैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।
उपागम्याब्रवीद्राममगस्त्यो भगवान् ऋषिः ॥
राम राम महाबाहो शृणु गुह्यं सनातनम् ।
येन सर्वानरीन् वत्स समरे विजयिष्यसि ॥
आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।
जयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥`,
    transliteration: `tato yuddhaparāśrāntaṃ samare cintayā sthitam |
rāvaṇaṃ cāgrato dṛṣṭvā yuddhāya samupasthitam ||
daivataiśca samāgamya draṣṭumabhyāgato raṇam |
upāgamyābravīdrāmamagastyo bhagavān ṛṣiḥ ||
rāma rāma mahābāho śṛṇu guhyaṃ sanātanam |
yena sarvān'arīn vatsa samare vijayiṣyasi ||
ādityahṛdayaṃ puṇyaṃ sarvaśatruvināśanam |
jayāvahaṃ japennityamakṣayyaṃ paramaṃ śivam ||`,
    category: 'stotra',
    categoryLabel: 'Ramayana Solar Hymn',
    categoryLabelHi: 'रामायण सौर स्तोत्र',
    rishi: 'अगस्त्य ऋषि (Sage Agastya)',
    devata: 'भगवान् सूर्य (Bhagavan Surya / The Supreme Sun)',
    chhandas: 'अनुष्टुप् (Anuṣṭubh)',
    source: 'Valmiki Ramayana',
    sourceCoordinates: 'Valmiki Ramayana, Yuddha Kanda, Sarga 105.1-4',
    sourceHref: '/scripture/ramayana/',
    wordMeanings: [
      { sanskrit: 'युद्धपरिश्रान्तम्', iast: 'yuddhaparāśrāntam', hindi: 'युद्ध से थके हुए', english: 'Exhausted by relentless combat' },
      { sanskrit: 'समरे चिन्तया स्थितम्', iast: 'samare cintayā sthitam', hindi: 'रणभूमि में चिन्ता में स्थित', english: 'Standing in contemplative thought on the battlefield' },
      { sanskrit: 'रावणं चाग्रतो दृष्ट्वा', iast: 'rāvaṇaṃ cāgrato dṛṣṭvā', hindi: 'रावण को सामने उपस्थित देखकर', english: 'Seeing Ravana advanced in front for battle' },
      { sanskrit: 'अगस्त्यो भगवान् ऋषिः', iast: 'agastyo bhagavān ṛṣiḥ', hindi: 'भगवान् महर्षि अगस्त्य', english: 'The venerable sage Agastya' },
      { sanskrit: 'शृणु गुह्यं सनातनम्', iast: 'śṛṇu guhyaṃ sanātanam', hindi: 'उस सनातन गोपनीय रहस्य को सुनो', english: 'Hear this eternal and sacred secret' },
      { sanskrit: 'येन समरे विजयिष्यसि', iast: 'yena samare vijayiṣyasi', hindi: 'जिससे तुम युद्ध में समस्त शत्रुओं पर विजय पाओगे', english: 'By which you shall conquer all adversaries in battle' },
      { sanskrit: 'आदित्यहृदयं पुण्यं', iast: 'ādityahṛdayaṃ puṇyam', hindi: 'परम पवित्र आदित्यहृदय स्तोत्र', english: 'The auspicious Aditya Hridaya hymn' },
      { sanskrit: 'सर्वशत्रुविनाशनम्', iast: 'sarvaśatruvināśanam', hindi: 'समस्त शत्रुओं का नाश करने वाला', english: 'Destroyer of all external and internal foes' },
      { sanskrit: 'जयावहं जपेन्नित्यम्', iast: 'jayāvahaṃ japennityam', hindi: 'सदा विजय दिलाने वाला, नित्य जप करने योग्य', english: 'Conferring victory, to be chanted daily' },
      { sanskrit: 'अक्षय्यं परमं शिवम्', iast: 'akṣayyaṃ paramaṃ śivam', hindi: 'अक्षय और परम कल्याणकारी', english: 'Imperishable and supremely auspicious' },
    ],
    hindiMeaning: 'युद्ध से थके हुए और रणभूमि में चिन्तामग्न भगवान् राम को सामने रावण के उपस्थित होने पर देखकर, देवताओं के साथ युद्ध देखने आए पूज्य महर्षि अगस्त्य ने राम के पास आकर कहा: "हे महाबाहो राम! उस सनातन परम गोपनीय रहस्य को सुनो, जिससे तुम युद्ध में समस्त शत्रुओं पर विजय प्राप्त करोगे। यह परम पवित्र ‘आदित्यहृदय स्तोत्र’ समस्त शत्रुओं का नाश करने वाला, नित्य विजय दिलाने वाला, अक्षय और परम कल्याणकारी है। इसका नित्य जप करो।"',
    englishMeaning: 'Beholding Lord Rama exhausted by relentless combat and standing in deep contemplation on the battlefield as Ravana advanced, the venerable sage Agastya approached Him and said: "O mighty-armed Rama, listen to this eternal, esoteric truth by which you shall conquer all adversaries in battle. This sacred Aditya Hridaya hymn destroys all foes, brings perpetual victory, is imperishable, and supremely auspicious. Meditate upon it daily."',
    significance: 'The Aditya Hridaya hymn from Valmiki Ramayana embodies the triumph of luminous cosmic energy over darkness and despair. Sage Agastya teaches that when righteous duty faces formidable odds, invoking the supreme light within dispels fatigue and guarantees righteous victory.',
    significanceHi: 'आदित्यहृदय स्तोत्र अन्धकार, निराशा और थकान पर दिव्य प्रकाश, आत्मबल और विजय का प्रतीक है। महर्षि अगस्त्य ने श्रीराम को स्मरण कराया कि सूर्य केवल खगोलीय पिण्ड नहीं, बल्कि समस्त जीवन, तेज और चेतना का शाश्वत केन्द्र है।',
    faqs: [
      {
        question: 'In which context was the Aditya Hridaya Stotra taught to Lord Rama?',
        answer: 'Sage Agastya imparted the Aditya Hridaya Stotra to Lord Sri Rama in the Yuddha Kanda of Valmiki Ramayana (Sarga 105) just before His decisive confrontation with Ravana.',
      },
      {
        question: 'What are the spiritual benefits of reciting the Aditya Hridaya Stotra?',
        answer: 'Traditionally, regular recitation bestows boundless vitality, mental clarity, freedom from anxiety and inner enemies (anger, fear, hesitation), and victory in righteous endeavors.',
      },
    ],
  },
  {
    id: 'shri-suktam',
    slug: 'shri-suktam',
    title: 'Shri Suktam',
    titleHi: 'श्रीसूक्तम्',
    sanskrit: `ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥
तां म आवह जातवेदो लक्ष्मीमनपगामिनीम् ।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥
अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम् ।
श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम् ॥`,
    transliteration: `oṃ hiraṇyavarṇāṃ hariṇīṃ suvarṇarajatasrajām |
candrāṃ hiraṇmayīṃ lakṣmīṃ jātavedo ma āvaha ||
tāṃ ma āvaha jātavedo lakṣmīmanapagāminīm |
yasyāṃ hiraṇyaṃ vindeyaṃ gāmaśvaṃ puruṣānaham ||
aśvapūrvāṃ rathamadhyāṃ hastinādaprabodhinīm |
śriyaṃ devīmupahvaye śrīrmā devī juṣatām ||`,
    category: 'vedic',
    categoryLabel: 'Rigvedic Khila Hymn',
    categoryLabelHi: 'ऋग्वैदिक खिल सूक्त',
    rishi: 'आनन्द, कर्दम, चिक्लीत (Ananda, Kardama, Chiklita)',
    devata: 'श्री महालक्ष्मी एवं जातवेदा अग्नि (Devi Mahalakshmi & Agni)',
    chhandas: 'अनुष्टुप् (Anuṣṭubh)',
    source: 'Rigveda Khilani',
    sourceCoordinates: 'Rigveda Parishishta / Khila Sukta',
    sourceHref: '/scripture/rigveda/',
    wordMeanings: [
      { sanskrit: 'हिरण्यवर्णां', iast: 'hiraṇyavarṇāṃ', hindi: 'सुवर्ण जैसे दैदीप्यमान कान्ति वाली', english: 'Of golden, luminous complexion' },
      { sanskrit: 'हरिणीं', iast: 'hariṇīṃ', hindi: 'मृग के समान मनोहर व कृपाशीला', english: 'Gentle, graceful, and illuminating' },
      { sanskrit: 'सुवर्णरजतस्रजाम्', iast: 'suvarṇarajatasrajām', hindi: 'स्वर्ण और रजत की मालाओं से अलंकृत', english: 'Adorned with garlands of gold and silver' },
      { sanskrit: 'चन्द्रां हिरण्मयीं', iast: 'candrāṃ hiraṇmayīm', hindi: 'चन्द्रमा के समान शीतल व ज्योतिर्मयी', english: 'Delightful like the moon and radiant like gold' },
      { sanskrit: 'जातवेदो म आवह', iast: 'jātavedo ma āvaha', hindi: 'हे सर्वज्ञ अग्निदेव! मेरे लिए आह्वान कर लाओ', english: 'O all-knowing Agni, invoke Her for me' },
      { sanskrit: 'अनपगामिनीम्', iast: 'anapagāminīm', hindi: 'सदा स्थिर रहने वाली, कभी न छूटने वाली', english: 'Never-departing, steadfastly abiding' },
      { sanskrit: 'हस्तिनादप्रबोधिनीम्', iast: 'hastinādaprabodhinīm', hindi: 'हाथियों की गर्जना से प्रबोधिता', english: 'Awakened by the trumpeting of royal elephants' },
      { sanskrit: 'श्रियं देवीमुपह्वये', iast: 'śriyaṃ devīmupahvaye', hindi: 'उन परम ऐश्वर्यमयी श्री देवी का मैं आह्वान करता हूँ', english: 'I humbly invoke that Supreme Goddess Sri' },
    ],
    hindiMeaning: 'हे सर्वज्ञ अग्निदेव! मेरे लिए उन स्वर्ण-वर्ण वाली, मृग के समान मनोहर, स्वर्ण और रजत की मालाओं से विभूषित, चन्द्रमा के समान आनन्दप्रदायिनी और ज्योतिर्मयी महालक्ष्मी का आह्वान कीजिए। हे अग्निदेव! मेरे लिए उस लक्ष्मी का आह्वान कीजिए जो कभी मुझे छोड़कर न जाएं, जिनकी कृपा से मैं सुवर्ण, गौ, अश्व और सत्संगति प्राप्त कर सकूँ। जिनके आगे-आगे अश्व चलते हैं, मध्य में रथ है और हाथियों की गर्जना से जो प्रफुल्लित होती हैं, उन भगवती श्री महालक्ष्मी का मैं आदरपूर्वक आह्वान करता हूँ।',
    englishMeaning: 'O all-knowing Agni! Invoke for me Goddess Lakshmi of golden hue, gentle like a doe, adorned with garlands of gold and silver, luminous and delightful like the radiant moon. O Agni, summon for me that Lakshmi who never departs, through whose grace I may attain prosperity, cattle, horses, and noble company. Preceded by horses, surrounded by chariots, and awakened by the trumpeting of royal elephants — I humbly invoke that supreme Goddess Sri; may She graciously dwell within my life.',
    significance: 'The Sri Suktam is the oldest Vedic hymn dedicated to the Divine Mother as Sri (auspiciousness, dignity, spiritual light, and abundance). In classical tradition, Sri represents not mere hoardable wealth, but the divine harmony and cosmic grace that sustain all noble existence.',
    significanceHi: 'श्रीसूक्तम् केवल भौतिक धन का आह्वान नहीं है, बल्कि यह ‘श्री’ अर्थात् तेज, शुचिता, सत्य, आत्म-संतोष और ईश्वरीय अनुग्रह की वैदिक प्रार्थना है। यह दरिद्रता (अलक्ष्मी) के निवारण और मन की निर्मलता का प्रतीक है।',
    faqs: [
      {
        question: 'What is the distinction between Lakshmi and Alakshmi in the Sri Suktam?',
        answer: 'The Sri Suktam explicitly prays for the banishment of Alakshmi (spiritual poverty, envy, filth, stagnation, and lethargy) and the permanent dwelling of Lakshmi (cleanliness, noble conduct, generosity, and peace).',
      },
      {
        question: 'Why is Agni addressed in the Sri Suktam?',
        answer: 'In Vedic metaphysics, Agni (Jatavedas) is the universal mediator and carrier of human prayer to the divine realms, invoking the grace of Devi Sri.',
      },
    ],
  },
  {
    id: 'kanakadhara-stotram',
    slug: 'kanakadhara-stotram',
    title: 'Kanakadhara Stotram',
    titleHi: 'कनकधारास्तोत्रम्',
    sanskrit: `अङ्गं हरेः पुलकभूषणमाश्रयन्ती भृङ्गाङ्गनेव मुकुलाभरणं तमालम् ।
अङ्गीकृताखिलविभूतिरपाङ्गलीला माङ्गल्यदास्तु मम मङ्गलदेवतायाः ॥
मुग्धा मुहुर्विदधती वदने मुरारेः प्रेमत्रपाप्रणिहितानि गतागतानि ।
माला दृशोरमधुकरीव महोत्पले या सा मे श्रियं दिशतु सागरसंभवायाः ॥`,
    transliteration: `aṅgaṃ hareḥ pulakabhūṣaṇamāśrayantī bhṛṅgāṅganeva mukulābharaṇaṃ tamālam |
aṅgīkṛtākhilavibhūtirapāṅgalīlā māṅgalyadāstu mama maṅgaladevatāyāḥ ||
mugdhā muhurvidadhatī vadane murāreḥ prematrapāpraṇihitāni gatāgatāni |
mālā dṛśoramadhukarīva mahotpale yā sā me śriyaṃ diśatu sāgarasaṃbhavāyāḥ ||`,
    category: 'stotra',
    categoryLabel: 'Vedantic Lakshmi Stotra',
    categoryLabelHi: 'वेदान्तिक महालक्ष्मी स्तोत्र',
    rishi: 'आदिशंकराचार्य (Adi Shankaracharya)',
    devata: 'देवी महालक्ष्मी (Devi Mahalakshmi)',
    chhandas: 'वसन्ततिलका (Vasantatilakā)',
    source: 'Stotra Sahitya of Adi Shankara',
    sourceCoordinates: 'Adi Shankara Stotra Collection, Verses 1-2',
    sourceHref: '/scripture/vivekchudamani/',
    wordMeanings: [
      { sanskrit: 'अङ्गं हरेः', iast: 'aṅgaṃ hareḥ', hindi: 'श्रीहरि के श्रीअंग पर', english: 'Upon the sacred limbs of Sri Hari' },
      { sanskrit: 'भृङ्गाङ्गनेव', iast: 'bhṛṅgāṅganeva', hindi: 'जैसे भ्रमरी (भंवरी)', english: 'Like a female honeybee' },
      { sanskrit: 'मुकुलाभरणं तमालम्', iast: 'mukulābharaṇaṃ tamālam', hindi: 'कलियों से लदे तमाल वृक्ष पर', english: 'Upon a dark blossom-laden Tamala tree' },
      { sanskrit: 'अपाङ्गलीला', iast: 'apāṅgalīlā', hindi: 'कटाक्ष-लीला (कृपा-दृष्टि)', english: 'The playful side-glance of grace' },
      { sanskrit: 'माङ्गल्यदास्तु', iast: 'māṅgalyadāstu', hindi: 'परम मंगल प्रदान करे', english: 'May it bestow auspiciousness' },
      { sanskrit: 'मङ्गलदेवतायाः', iast: 'maṅgaladevatāyāḥ', hindi: 'समस्त मंगलों की अधिष्ठात्री देवी की', english: 'Of the Goddess of supreme auspiciousness' },
      { sanskrit: 'प्रेमत्रपा', iast: 'prematrapā', hindi: 'प्रेम और संकोच से परिपूर्ण', english: 'Filled with love and tender modesty' },
      { sanskrit: 'सागरसंभवायाः', iast: 'sāgarasaṃbhavāyāḥ', hindi: 'क्षीरसागर से प्रकट भगवती महालक्ष्मी की', english: 'Of Devi Lakshmi born from the ocean of milk' },
    ],
    hindiMeaning: 'जैसे भ्रमरी कलियों से लदे श्याम तमाल-वृक्ष का आश्रय लेती है, वैसे ही जो श्रीहरि के रोमांचित श्रीअंग का आश्रय लेती हैं और जिनमें संपूर्ण ब्रह्मांडीय ऐश्वर्य समाहित है, उन परम मंगलमयी भगवती महालक्ष्मी की वह कृपा-कटाक्ष दृष्टि मुझे परम कल्याण और मंगल प्रदान करे। जो प्रेम और संकोच से भगवान् मुरारी के मुखारविन्द पर बारम्बार नीले कमल पर मंडराती भ्रमरी के समान जाती और लौटती है, सागरतनया भगवती लक्ष्मी की वह दिव्य दृष्टि मुझे समस्त समृद्धि व ऐश्वर्य प्रदान करे।',
    englishMeaning: 'Just as a dark female honeybee hovers joyfully around a blossoming black Tamala tree, so does the glance of Goddess Mahalakshmi rest affectionately upon the divine form of Sri Hari. May that sidelong glance of divine compassion, carrying the fullness of all cosmic glory, bestow supreme auspiciousness upon me. That tender glance which, moved by love and divine grace, flits back and forth upon the countenance of Sri Krishna like a bee dancing over a blue lotus — may that glance of the Ocean-born Mother shower spiritual and material abundance upon me.',
    significance: 'Composed by Adi Shankaracharya in his youth when a destitute woman selflessly gifted him her last dried amla fruit in charity. Moved by her noble spirit, Shankara invoked Mother Lakshmi, resulting in a rain of golden amlas — demonstrating that heartfelt selfless giving invokes divine grace.',
    significanceHi: 'कनकधारा स्तोत्र की रचना जगद्गुरु आदि शंकराचार्य ने एक निर्धन वृद्धा के त्याग से द्रवित होकर की थी, जिसने भिक्षा में अपना एकमात्र सूखा आंवला दान कर दिया था। यह स्तोत्र निःस्वार्थ त्याग और ईश्वरीय करुणा की अनन्त वर्षा का शाश्वत प्रमाण है।',
    faqs: [
      {
        question: 'What is the origin story of Adi Shankara composing the Kanakadhara Stotram?',
        answer: 'Tradition records that young Shankara went to a poor woman’s hut for alms. Finding nothing to offer, she wept and gave her solitary dried gooseberry. Overwhelmed by her unreserved charity, Shankara spontaneously sang 21 verses of Kanakadhara Stotram to invoke Mahalakshmi on her behalf.',
      },
      {
        question: 'Why is it named Kanakadhara?',
        answer: '‘Kanaka’ means gold and ‘dhara’ means a continuous stream or shower. The stotra was named after the stream of golden blessings showered by Devi Mahalakshmi.',
      },
    ],
  },
  {
    id: 'madhurashtakam',
    slug: 'madhurashtakam',
    title: 'Madhurashtakam',
    titleHi: 'मधुराष्टकम्',
    sanskrit: `अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम् ।
हृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम् ॥
वचनं मधुरं चरितं मधुरं वसनं मधुरं वलितं मधुरम् ।
चलितं मधुरं भ्रमितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥`,
    transliteration: `adharaṃ madhuraṃ vadanaṃ madhuraṃ nayanaṃ madhuraṃ hasitaṃ madhuram |
hṛdayaṃ madhuraṃ gamanaṃ madhuraṃ madhurādhipaterakhilaṃ madhuram ||
vacanaṃ madhuraṃ caritaṃ madhuraṃ vasanaṃ madhuraṃ valitaṃ madhuram |
calitaṃ madhuraṃ bhramitaṃ madhuraṃ madhurādhipaterakhilaṃ madhuram ||`,
    category: 'stotra',
    categoryLabel: 'Bhakti Ashtakam',
    categoryLabelHi: 'भक्ति अष्टकम्',
    rishi: 'श्री वल्लभाचार्य (Mahaprabhu Vallabhacharya)',
    devata: 'श्री कृष्ण (Madhuradhipati Sri Krishna)',
    chhandas: 'तोटक (Toṭaka)',
    source: 'Pushtimarg Sahitya',
    sourceCoordinates: 'Vallabhacharya Shodasha Grantha',
    sourceHref: '/scripture/bhagavatapurana/',
    wordMeanings: [
      { sanskrit: 'अधरं मधुरं', iast: 'adharaṃ madhuram', hindi: 'ओंठ मधुर हैं', english: 'His lips are sweet' },
      { sanskrit: 'वदनं मधुरं', iast: 'vadanaṃ madhuram', hindi: 'मुख मधुर है', english: 'His face is sweet' },
      { sanskrit: 'नयनं मधुरं', iast: 'nayanaṃ madhuram', hindi: 'नेत्र मधुर हैं', english: 'His eyes are sweet' },
      { sanskrit: 'हसितं मधुरम्', iast: 'hasitaṃ madhuram', hindi: 'मन्द हास्य मधुर है', english: 'His gentle smile is sweet' },
      { sanskrit: 'हृदयं मधुरं', iast: 'hṛdayaṃ madhuram', hindi: 'हृदय मधुर है', english: 'His heart is sweet' },
      { sanskrit: 'गमनं मधुरं', iast: 'gamanaṃ madhuram', hindi: 'चाल व गति मधुर है', english: 'His walking is sweet' },
      { sanskrit: 'मधुराधिपतेः', iast: 'madhurādhipateḥ', hindi: 'माधुर्य के अधिपति श्री कृष्ण का', english: 'Of the Lord of all sweetness' },
      { sanskrit: 'अखिलं मधुरम्', iast: 'akhilaṃ madhuram', hindi: 'सब कुछ ही मधुर और आनन्दमय है', english: 'Everything is utterly sweet' },
      { sanskrit: 'वचनं मधुरं', iast: 'vacanaṃ madhuram', hindi: 'वाणी मधुर है', english: 'His speech is sweet' },
      { sanskrit: 'चरितं मधुरं', iast: 'caritaṃ madhuram', hindi: 'चरित्र व लीलाएँ मधुर हैं', english: 'His divine character is sweet' },
    ],
    hindiMeaning: 'माधुर्य के अधिपति भगवान् श्री कृष्ण के ओंठ मधुर हैं, मुख मधुर है, नेत्र मधुर हैं, मुस्कान मधुर है, हृदय मधुर है और उनकी चाल भी मधुर है—माधुर्य के स्वामी का सब कुछ ही मधुर और आनन्दमय है! उनकी वाणी मधुर है, उनका चरित्र मधुर है, उनके वस्त्र मधुर हैं, उनकी भाव-भंगिमा मधुर है, उनका चलना मधुर है और उनका घूमना मधुर है—माधुर्य के स्वामी का सब कुछ ही मधुर है।',
    englishMeaning: 'Sweet are His lips, sweet is His face, sweet are His eyes, and sweet is His gentle smile. Sweet is His heart and sweet is His graceful gait — everything about the Lord of Sweetness is utterly sweet! Sweet are His words, sweet is His character, sweet are His garments, and sweet is His posture. Sweet is His wandering, sweet is His dancing — everything about the Lord of Sweetness is utterly sweet!',
    significance: 'Composed by Mahaprabhu Vallabhacharya, the Madhurashtakam is the quintessential hymn of Pure Non-Dual Devotion (Shuddhadvaita). It views God not as a distant, fearsome judge, but as Supreme Beauty, Delight, and Unconditional Sweetness accessible through love.',
    significanceHi: 'मधुराष्टकम् प्रेम-लक्षणा भक्ति का शिखर है। वल्लभाचार्य जी ने इसमें दिखाया है कि परमात्मा को भय या दूरस्थ शक्ति के रूप में नहीं, बल्कि परम प्रेम, माधुर्य और आनन्द के रूप में अनुभव करना ही भक्ति की पराकाष्ठा है।',
    faqs: [
      {
        question: 'What is the philosophy behind repeating the word "Madhuram" in Madhurashtakam?',
        answer: 'Vallabhacharya emphasizes that from the divine perspective of pure love, every single manifestation, action, and attribute of the Supreme Divine is filled with unadulterated spiritual bliss (Ananda).',
      },
      {
        question: 'Who is the author of Madhurashtakam?',
        answer: 'It was composed by Sri Vallabhacharya (1479–1531 CE), the philosopher-saint who founded the Pushtimarg tradition of Vaishnavism.',
      },
    ],
  },
  {
    id: 'lingashtakam',
    slug: 'lingashtakam',
    title: 'Lingashtakam',
    titleHi: 'लिङ्गाष्टकम्',
    sanskrit: `ब्रह्ममुरारिसुरार्चितलिङ्गं निर्मलभासितशोभितलिङ्गम् ।
जन्मजदुःखविनाशकलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥
देवमुनिप्रवरार्चितलिङ्गं कामदहं करुणाकरलिङ्गम् ।
रावणदर्पविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥`,
    transliteration: `brahmamurārisurārcitaliṅgaṃ nirmalabhāsitaśobhitaliṅgam |
janmajaduḥkhavināśakaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||
devamunipravarārcitaliṅgaṃ kāmadahaṃ karuṇākaraliṅgam |
rāvaṇadarpavināśanaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||`,
    category: 'stotra',
    categoryLabel: 'Shaiva Stotra',
    categoryLabelHi: 'शैव स्तोत्र',
    rishi: 'परंपरा / महर्षि व्यास (Classical Shaiva Tradition)',
    devata: 'सदाशिव / शिवलिङ्ग (Sadashiva / Paramashiva)',
    chhandas: 'तोटक (Toṭaka)',
    source: 'Shaiva Agamas & Puranas',
    sourceCoordinates: 'Linga Purana / Traditional Shaiva Liturgy',
    sourceHref: '/scripture/lingapuran/',
    wordMeanings: [
      { sanskrit: 'ब्रह्ममुरारिसुरार्चित', iast: 'brahmamurārisurārcita', hindi: 'ब्रह्मा, विष्णु तथा देवताओं द्वारा पूजित', english: 'Worshipped by Brahma, Vishnu, and all celestials' },
      { sanskrit: 'निर्मलभासितशोभित', iast: 'nirmalabhāsitaśobhita', hindi: 'निर्मल और दिव्य कान्ति से सुशोभित', english: 'Adorned with pure, immaculate radiance' },
      { sanskrit: 'जन्मजदुःखविनाशक', iast: 'janmajaduḥkhavināśaka', hindi: 'जन्म-मरण के सांसारिक दुःखों का नाशक', english: 'Destroyer of the sorrows born of worldly rebirth' },
      { sanskrit: 'तत् प्रणमामि सदाशिवलिङ्गम्', iast: 'tat praṇamāmi sadāśivaliṅgam', hindi: 'उस पावन सदाशिव लिङ्ग को मैं प्रणाम करता हूँ', english: 'I bow to that sacred Linga of Sadashiva' },
      { sanskrit: 'कामदहं', iast: 'kāmadahaṃ', hindi: 'कामदेव (वासना) को भस्म करने वाला', english: 'The burner of lust and desire' },
      { sanskrit: 'करुणाकर', iast: 'karuṇākara', hindi: 'करुणा की अगाध खान', english: 'The ocean of compassion' },
      { sanskrit: 'रावणदर्पविनाशन', iast: 'rāvaṇadarpavināśana', hindi: 'रावण के अहंकार का मर्दन करने वाला', english: 'The subduer of Ravana’s arrogant pride' },
    ],
    hindiMeaning: 'ब्रह्मा, विष्णु तथा समस्त देवताओं द्वारा पूजित, निर्मल और दिव्य आभा से सुशोभित, तथा जन्म-मरण के समस्त दुःखों का नाश करने वाले उस परम पावन सदाशिव लिङ्ग को मैं नमन करता हूँ। श्रेष्ठ देवताओं और मुनियों द्वारा वन्दित, काम (वासना) को भस्म करने वाले, करुणा के सागर और रावण के मिथ्या अहंकार का नाश करने वाले उस परम कल्याणकारी सदाशिव लिङ्ग को मैं प्रणाम करता हूँ।',
    englishMeaning: 'I bow before that eternal Linga of Sadashiva, which is worshipped by Brahma, Vishnu, and all the gods, adorned with spotless, radiant splendour, and which destroys the sorrows born of worldly rebirth. I bow before that auspicious Linga of Sadashiva, worshipped by the foremost sages and deities, the burner of lust, the boundless ocean of compassion, and the destroyer of Ravana’s arrogant pride.',
    significance: 'The Shiva Linga symbolizes the formless, infinite, and unmanifest ground of pure consciousness. The Lingashtakam reminds spiritual seekers that devotion to Shiva dissolves the illusion of ego, cleanses desire, and leads to liberation from samsara.',
    significanceHi: 'शिवलिङ्ग परमात्मा के निराकार, असीम और शाश्वत स्वरूप का प्रतीक है। लिङ्गाष्टकम् हमें सिखाता है कि शिव पूजा केवल बाह्य अनुष्ठान नहीं, बल्कि वासना, अहंकार और अज्ञान को भस्म करके अंतरात्मा की शुद्धि प्राप्त करने की साधना है।',
    faqs: [
      {
        question: 'What does the Shiva Linga represent in classical Vedanta and Shaivism?',
        answer: 'The word ‘Linga’ means mark, sign, or symbol. It represents the formless, beginningless, and endless source into which the entire cosmos dissolves and from which it emerges (Skanda Purana).',
      },
      {
        question: 'What is the benefit of reciting the Lingashtakam?',
        answer: 'Regular chanting cultivates inner tranquility, frees the mind from compulsive desires and pride, and instills deep devotion to Lord Shiva.',
      },
    ],
  },
  {
    id: 'shiva-panchakshara-stotram',
    slug: 'shiva-panchakshara-stotram',
    title: 'Shiva Panchakshara Stotram',
    titleHi: 'शिवपञ्चाक्षरस्तोत्रम्',
    sanskrit: `नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।
नित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥
मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय ।
मन्दारमुख्यबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय ॥`,
    transliteration: `nāgendrahārāya trilocanāya bhasmāṅgarāgāya maheśvarāya |
nityāya śuddhāya digambarāya tasmai nakārāya namaḥ śivāya ||
mandākinīsalilacandanacarcitāya nandīśvarapramathanāthamaheśvarāya |
mandāramukhyabahupuṣpasupūjitāya tasmai makārāya namaḥ śivāya ||`,
    category: 'stotra',
    categoryLabel: 'Panchakshara Stotra',
    categoryLabelHi: 'पञ्चाक्षर स्तोत्र',
    rishi: 'आदिशंकराचार्य (Adi Shankaracharya)',
    devata: 'भगवान् शिव (Bhagavan Shiva / The Supreme Consciousness)',
    chhandas: 'उपजाति (Upajāti)',
    source: 'Stotra Sahitya of Adi Shankara',
    sourceCoordinates: 'Adi Shankara Stotra Collection, Verses 1-2',
    sourceHref: '/scripture/shivpurana/',
    wordMeanings: [
      { sanskrit: 'नागेन्द्रहाराय', iast: 'nāgendrahārāya', hindi: 'सर्पों के राजा का हार धारण करने वाले', english: 'Who wears the king of serpents as a garland' },
      { sanskrit: 'त्रिलोचनाय', iast: 'trilocanāya', hindi: 'तीन नेत्रों वाले (ज्ञाननेत्रधारी)', english: 'The three-eyed one (possessor of wisdom)' },
      { sanskrit: 'भस्माङ्गरागाय', iast: 'bhasmāṅgarāgāya', hindi: 'पवित्र भस्म का अंगराग लगाने वाले', english: 'Whose body is anointed with holy ashes' },
      { sanskrit: 'महेश्वराय', iast: 'maheśvarāya', hindi: 'देवाधिदेव महेश्वर', english: 'The Supreme Lord of all' },
      { sanskrit: 'नित्याय शुद्धाय दिगम्बराय', iast: 'nityāya śuddhāya digambarāya', hindi: 'शाश्वत, परम पवित्र और दिगम्बर (अनन्त)', english: 'Eternal, immaculate, and infinite like space' },
      { sanskrit: 'तस्मै नकाराय नमः शिवाय', iast: 'tasmai nakārāya namaḥ śivāya', hindi: 'उस ‘न’ अक्षर स्वरूप शिव को नमस्कार है', english: 'To that Shiva embodied as syllable "Na", salutations!' },
      { sanskrit: 'मन्दाकिनीसलिल', iast: 'mandākinīsalila', hindi: 'आकाशगंगा के पवित्र जल से', english: 'With the celestial Ganga waters' },
      { sanskrit: 'तस्मै मकाराय नमः शिवाय', iast: 'tasmai makārāya namaḥ śivāya', hindi: 'उस ‘म’ अक्षर स्वरूप शिव को नमस्कार है', english: 'To that Shiva embodied as syllable "Ma", salutations!' },
    ],
    hindiMeaning: 'जिनके गले में नागराज का हार है, जो तीन नेत्रों वाले हैं, जिनका शरीर पवित्र भस्म से सुशोभित है, जो देवाधिदेव महेश्वर हैं, जो नित्य, शुद्ध और दिगम्बर (अनन्त) हैं—उस ‘न’ अक्षर स्वरूप भगवान् शिव को मेरा नमस्कार है। जो मन्दाकिनी (आकाशगंगा) के पवित्र जल और चन्दन से चर्चित हैं, जो नन्दीश्वर तथा प्रमथगणों के स्वामी हैं, और मन्दार आदि दिव्य पुष्पों से पूजित हैं—उस ‘म’ अक्षर स्वरूप भगवान् शिव को मेरा नमस्कार है।',
    englishMeaning: 'Salutations to the Supreme Lord Shiva, who wears the king of serpents as His garland, who possesses three eyes of transcendental wisdom, whose limbs are adorned with holy ashes, who is eternal, immaculate, and clothed in the infinite directions — to that Lord embodied in the first syllable ‘Na’, salutations to Shiva! Salutations to the great Lord anointed with the waters of the celestial Mandakini river and fragrant sandalwood paste, who is the master of Nandi and the guardian of all beings, worshipped with Mandara flowers — to that Lord embodied in the second syllable ‘Ma’, salutations to Shiva!',
    significance: 'Composed by Adi Shankaracharya, this stotra meditates on the esoteric significance of each syllable in the great five-syllable mantra "Na-Ma-Shi-Va-Ya". It represents the mastery of the five elements and complete surrender of individual ego to the transcendent Divine.',
    significanceHi: 'आदिशंकराचार्य विरचित शिवपञ्चाक्षर स्तोत्र ‘ॐ नमः शिवाय’ मन्त्र के पाँचों अक्षरों (न, म, शि, वा, य) में निहित तत्त्व-दर्शन का ध्यान कराता है। यह पाँचों तत्त्वों (पृथ्वी, जल, अग्नि, वायु, आकाश) के स्वामी परमात्मा के प्रति पूर्ण समर्पण का मार्ग है।',
    faqs: [
      {
        question: 'What is the significance of the 5 syllables in the Shiva Panchakshara Stotram?',
        answer: 'The five syllables (Na, Ma, Shi, Va, Ya) represent the Pancha Bhutas (five primordial elements: Earth, Water, Fire, Air, Space) as well as the five cosmic functions of the Supreme Divine: creation, preservation, dissolution, concealment, and grace.',
      },
      {
        question: 'Who composed the Shiva Panchakshara Stotram?',
        answer: 'It was composed by the great Advaita Vedanta philosopher, Jagadguru Adi Shankaracharya (8th century CE).',
      },
    ],
  },
  {
    id: 'achyutashtakam',
    slug: 'achyutashtakam',
    title: 'Achyutashtakam',
    titleHi: 'अच्युताष्टकम्',
    sanskrit: `अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम् ।
श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचंद्रं भजे ॥
अच्युतं केशवं सत्यभामाधवं माधवं श्रीधरं राधिकाराधितम् ।
इन्दिरामन्दिरं चेतसा सुन्दरं देवकीनन्दनं नन्दजं संदधे ॥`,
    transliteration: `acyutaṃ keśavaṃ rāmanārāyaṇaṃ kṛṣṇadāmodaraṃ vāsudevaṃ harim |
śrīdharaṃ mādhavaṃ gopikāvallabhaṃ jānakīnāyakaṃ rāmacandraṃ bhaje ||
acyutaṃ keśavaṃ satyabhāmādhavaṃ mādhavaṃ śrīdharaṃ rādhikārādhitam |
indirāmandiraṃ cetasā sundaraṃ devakīnandanaṃ nandajaṃ saṃdadhe ||`,
    category: 'stotra',
    categoryLabel: 'Bhakti Ashtakam',
    categoryLabelHi: 'भक्ति अष्टकम्',
    rishi: 'आदिशंकराचार्य (Adi Shankaracharya)',
    devata: 'श्री हरि विष्णु / राम व कृष्ण (Sri Hari Vishnu, Rama & Krishna)',
    chhandas: 'भुजङ्गप्रयात (Bhujaṅgaprayāta)',
    source: 'Stotra Sahitya of Adi Shankara',
    sourceCoordinates: 'Adi Shankara Stotra Collection, Verses 1-2',
    sourceHref: '/scripture/bhagavatapurana/',
    wordMeanings: [
      { sanskrit: 'अच्युतं', iast: 'acyutam', hindi: 'जो अपने स्वरूप से कभी विचलित नहीं होते', english: 'The Infallible One who never falls from His divine state' },
      { sanskrit: 'केशवं', iast: 'keśavam', hindi: 'सृष्टि के स्वामी अथवा सुन्दर केशों वाले', english: 'Lord of creation or He of glorious hair' },
      { sanskrit: 'रामनारायणं', iast: 'rāmanārāyaṇam', hindi: 'श्रीराम तथा सर्वव्यापी नारायण', english: 'Sri Rama and omnipresent Narayana' },
      { sanskrit: 'कृष्णदामोदरं', iast: 'kṛṣṇadāmodaram', hindi: 'श्रीकृष्ण तथा वात्सल्य-बन्धन में बंधे दामोदर', english: 'Sri Krishna and Damodara bound by love' },
      { sanskrit: 'वासुदेवं हरिम्', iast: 'vāsudevaṃ harim', hindi: 'सर्वव्यापक वासुदेव तथा दुःखहारी हरि', english: 'All-pervading Vasudeva and sorrow-dispelling Hari' },
      { sanskrit: 'जानकीनायकं रामचंद्रं भजे', iast: 'jānakīnāyakaṃ rāmacandraṃ bhaje', hindi: 'माता सीता के प्रियतम श्री रामचन्द्र का मैं भजन करता हूँ', english: 'I revere Sri Ramachandra, beloved Lord of Janaki' },
      { sanskrit: 'राधिका-आराधितम्', iast: 'rādhikā-ārādhitam', hindi: 'श्री राधा जी द्वारा सुपूजित', english: 'Lovingly worshipped by Sri Radhika' },
      { sanskrit: 'इन्दिरामन्दिरं', iast: 'indirāmandiram', hindi: 'भगवती लक्ष्मी का नित्य निवास-स्थल', english: 'The eternal abode of Goddess Lakshmi' },
    ],
    hindiMeaning: 'जो अच्युत (स्वरूप से कभी विचलित न होने वाले), केशव, राम, नारायण, कृष्ण, दामोदर, वासुदेव, हरि, श्रीधर (लक्ष्मीपति), माधव, गोपिकाओं के प्रियतम और जानकी के स्वामी हैं—उन परम कृपालु भगवान् श्री रामचन्द्र का मैं नित्य भजन करता हूँ। जो अच्युत, केशव, सत्यभामा के प्रियतम, माधव, श्रीधर, श्री राधा जी द्वारा पूजित, भगवती लक्ष्मी के निवास-स्थान, मन से परम सुन्दर तथा देवकी और नन्द के नन्दन हैं—उन प्रभु का मैं हृदय में ध्यान करता हूँ।',
    englishMeaning: 'I revere the compassionate Lord Ramachandra, who is Achyuta (the Infallible), Keshava, Rama, Narayana, Krishna, Damodara, Vasudeva, Hari, Shridhara, Madhava, the beloved of the Gopis, and the Lord of Janaki (Sita). In my heart I contemplate that Lord who is the beloved of Satyabhama, worshipped by Sri Radhika, the eternal dwelling-place of Lakshmi, supremely beautiful in spirit, and the joy of Devaki and Nanda.',
    significance: 'Composed by Adi Shankaracharya, the Achyutashtakam weaves together the sacred names of Vishnu, Rama, and Krishna. It highlights the Vedantic insight that the various divine incarnations are manifestations of the one infallible, changeless Reality (Achyuta).',
    significanceHi: 'अच्युताष्टकम् भगवन्नाम-संकीर्तन का अनुपम स्तोत्र है। आदिशंकराचार्य ने इसमें दर्शाया है कि राम, कृष्ण और नारायण एक ही अविभाज्य परब्रह्म के विविध रूप हैं। निष्काम भाव से इन पवित्र नामों का स्मरण अंतःकरण को शांत और भयमुक्त बनाता है।',
    faqs: [
      {
        question: 'What does the divine name "Achyuta" mean?',
        answer: '‘Achyuta’ (अच्युत) means that which never falls, slips, or changes. It refers to the Supreme Being whose eternal perfection, truth, and compassion never diminish regardless of cosmic cycles.',
      },
      {
        question: 'Who composed the Achyutashtakam?',
        answer: 'The Achyutashtakam was composed by Jagadguru Adi Shankaracharya in the 8th century CE.',
      },
    ],
  },
  {
    id: 'ganapati-atharvashirsha',
    slug: 'ganapati-atharvashirsha',
    title: 'Ganapati Atharvashirsha',
    titleHi: 'श्री गणपति अथर्वशीर्ष',
    sanskrit: `ॐ नमस्ते गणपतये । त्वमेव प्रत्यक्षं तत्त्वमसि ।
त्वमेव केवलं कर्ताऽसि । त्वमेव केवलं धर्ताऽसि ।
त्वमेव केवलं हर्ताऽसि । त्वमेव सर्वं खल्विदं ब्रह्मासि ।
त्वं साक्षादात्माऽसि नित्यम् ॥ १ ॥
ऋतं वच्मि । सत्यं वच्मि ।
अव त्वं माम् । अव वक्तारम् । अव श्रोतारम् ।
अव दातारम् । अव धातारम् । अवाऽनूचानमव शिष्यम् ।
अव पश्चात्तात् । अव पुरस्तात् । अवोत्तरात्तात् ।
अव दक्षिणात्तात् । अव चोध्र्वात्तात् । अवाधरात्तात् ।
सर्वतो मां पाहि पाहि समन्तात् ॥ २ ॥`,
    transliteration: `oṃ namaste gaṇapataye | tvameva pratyakṣaṃ tattvamasi |
tvameva kevalaṃ kartā'si | tvameva kevalaṃ dhartā'si |
tvameva kevalaṃ hartā'si | tvameva sarvaṃ khalvidaṃ brahmāsi |
tvaṃ sākṣādātmā'si nityam || 1 ||
ṛtaṃ vacmi | satyaṃ vacmi |
ava tvaṃ mām | ava vaktāram | ava śrotāram |
ava dātāram | ava dhātāram | avā'nūcānamava śiṣyam |
ava paścāttāt | ava purastāt | avottarāttāt |
ava dakṣiṇāttāt | ava codhrvāttāt | avādharāttāt |
sarvato māṃ pāhi pāhi samantāt || 2 ||`,
    category: 'vedic',
    categoryLabel: 'Upanishadic Sukta',
    categoryLabelHi: 'उपनिषद् सूक्त',
    rishi: 'अथर्वा ऋषि (Rishi Atharva)',
    devata: 'श्री गणेश / ओंकारस्वरूप परब्रह्म (Sri Ganesha / Pranava Parabrahma)',
    chhandas: 'वैदिक अनुष्टुप् व गायत्री',
    source: 'Atharvaveda',
    sourceCoordinates: 'Atharvaveda, Ganapati Upanishad 1-14',
    sourceHref: '/scripture/atharvaveda/',
    wordMeanings: [
      { sanskrit: 'नमस्ते गणपतये', iast: 'namaste gaṇapataye', hindi: 'हे गणपति! आपको सादर नमस्कार है', english: 'Salutations unto You, O Ganapati' },
      { sanskrit: 'प्रत्यक्षं तत्त्वमसि', iast: 'pratyakṣaṃ tattvamasi', hindi: 'आप ही प्रत्यक्ष परम तत्त्व हैं', english: 'You alone are the manifest supreme Truth' },
      { sanskrit: 'केवलं कर्ताऽसि', iast: 'kevalaṃ kartā\'si', hindi: 'आप ही एकमात्र कर्ता (सृष्टि-कर्ता) हैं', english: 'You alone are the sole creator of all existence' },
      { sanskrit: 'केवलं धर्ताऽसि', iast: 'kevalaṃ dhartā\'si', hindi: 'आप ही एकमात्र धारक व पोषक हैं', english: 'You alone are the sole sustainer of the universe' },
      { sanskrit: 'केवलं हर्ताऽसि', iast: 'kevalaṃ hartā\'si', hindi: 'आप ही एकमात्र संहारक व दुःखहर्ता हैं', english: 'You alone are the dissolver and dispeller of sorrows' },
      { sanskrit: 'सर्वं खल्विदं ब्रह्मासि', iast: 'sarvaṃ khalvidaṃ brahmāsi', hindi: 'यह समस्त दृश्य-जगत निश्चय ही आप स्वरूप ब्रह्म है', english: 'Truly, this entire cosmos is Brahman, which is You' },
      { sanskrit: 'साक्षादात्माऽसि नित्यम्', iast: 'sākṣādātmā\'si nityam', hindi: 'आप ही नित्य प्रत्यक्ष आत्म-तत्त्व हैं', english: 'You are indeed the eternal manifest Self' },
      { sanskrit: 'ऋतं वच्मि सत्यं वच्मि', iast: 'ṛtaṃ vacmi satyaṃ vacmi', hindi: 'मैं ऋत (शाश्वत नियम) कहता हूँ, मैं सत्य कहता हूँ', english: 'I speak cosmic order (Rta), I speak absolute Truth (Satya)' },
      { sanskrit: 'सर्वतो मां पाहि पाहि समन्तात्', iast: 'sarvato māṃ pāhi pāhi samantāt', hindi: 'सब ओर से मेरी रक्षा करें, रक्षा करें', english: 'From all directions protect me, protect me completely' },
    ],
    hindiMeaning: 'हे श्रीगणपति! आपको सादर प्रणाम है। आप ही साक्षात् प्रत्यक्ष परब्रह्म तत्त्व हैं। आप ही सृष्टि के एकमात्र कर्ता, पोषक और संहारक हैं। यह सम्पूर्ण विश्व निश्चय ही आप स्वरूप ब्रह्म है। आप ही नित्य अंतरात्मा हैं। मैं ब्रह्माण्डीय नियम (ऋत) कहता हूँ, मैं परम सत्य कहता हूँ। आप मेरी रक्षा करें, वक्ता की रक्षा करें, श्रोता की रक्षा करें, दाता, धाता और शिष्य की रक्षा करें। सब दिशाओं से मेरी रक्षा करें।',
    englishMeaning: 'Om, salutations unto You, Lord Ganapati. You alone are the manifest Reality and the ultimate Truth. You alone are the sole creator, sustainer, and dissolver of this entire cosmos. Truly, all this universe is Brahman, and You are the eternal Self within all beings. I speak cosmic order; I speak absolute truth. Protect me, protect the speaker, protect the listener, protect the giver, protect the sustainer, and protect both master and disciple. Guard me from every quarter.',
    significance: 'The Ganapati Atharvashirsha is an Upanishadic hymn from the Atharvaveda revered as the crest-jewel of Ganesha literature. It establishes Lord Ganesha not merely as the remover of obstacles, but as the supreme transcendent Brahman (Para Brahman), the embodiment of the sacred syllable Om (Pranava), and the foundation of all physical and metaphysical realities.',
    significanceHi: 'गणपति अथर्वशीर्ष अथर्ववेद का अत्यंत पवित्र उपनिषद् है। इसमें भगवान् श्रीगणेश को मात्र विघ्नहर्ता ही नहीं, अपितु सम्पूर्ण ब्रह्माण्ड के मूल कारण, ओंकारस्वरूप परब्रह्म और सबके अंतर्यामी आत्मा के रूप में प्रतिष्ठापित किया गया है। इसका नित्य पाठ बुद्धि, विवेक, एकाग्रता और समस्त विघ्नों के निवारण हेतु अमोघ माना गया है।',
    faqs: [
      {
        question: 'Which Veda does the Ganapati Atharvashirsha belong to?',
        answer: 'It belongs to the Atharvaveda and is also celebrated as the Ganapati Upanishad in the classical canon of 108 Upanishads.',
      },
      {
        question: 'What spiritual benefits are associated with reciting Ganapati Atharvashirsha?',
        answer: 'Classical commentaries state that meditating upon this Upanishadic hymn removes inner and outer obstacles, aligns the intellect with divine discernment (buddhi), and brings realization of the inner Self.',
      },
    ],
  },
  {
    id: 'sankat-mochan-hanuman-ashtak',
    slug: 'sankat-mochan-hanuman-ashtak',
    title: 'Sankat Mochan Hanuman Ashtak',
    titleHi: 'संकटमोचन हनुमानाष्टक',
    sanskrit: `बाल समय रबि भक्षि लियो तब, तीनहुं लोक भयो अँधियारो ।
ताहि सो त्रास भयो जग को, यह संकट काहु सों जात न टारो ॥
देवन आनि करी बिनती तब, छाँड़ि दियो रबि कष्ट निवारो ।
को नहिं जानत है जग में कपि, संकटमोचन नाम तिहारो ॥ १ ॥
बालि की त्रास कपीस बसै गिरि, जात महाप्रभु पंथ निहारो ।
चौंकि चले नभ देखि कपि, तब रूप धरे मुनि विप्र पधारो ॥
कपि संग लाए मिलाए कृपाकर, बालि बधो रघुवीर पुकारो ।
को नहिं जानत है जग में कपि, संकटमोचन नाम तिहारो ॥ २ ॥
लाय सजीवन लखन जियाये, श्री रघुबीर हरषि उर लाये ।
रघुवर दीन्ही बहुत बड़ाई, तुम मम प्रिय भरतहि सम भाई ॥
संकट तैं हनुमान छुड़ावै, मन क्रम बचन ध्यान जो लावै ।
को नहिं जानत है जग में कपि, संकटमोचन नाम तिहारो ॥ ३ ॥`,
    transliteration: `bāla samaya rabi bhakṣi liyo taba, tīnahuṃ loka bhayo a~dhiyāro |
tāhi so trāsa bhayo jaga ko, yaha saṃkaṭa kāhu soṃ jāta na ṭāro ||
devana āni karī binatī taba, chā~ṛi diyo rabi kaṣṭa nivāro |
ko nahiṃ jānata hai jaga meṃ kapi, saṃkaṭamocana nāma tihāro || 1 ||
bāli kī trāsa kapīsa basai giri, jāta mahāprabhu paṃtha nihāro |
cauṃki cale nabha dekhi kapi, taba rūpa dhare muni vipra padhāro ||
kapi saṃga lāe milāe kṛpākara, bāli badho raghavīra pukāro |
ko nahiṃ jānata hai jaga meṃ kapi, saṃkaṭamocana nāma tihāro || 2 ||
lāya sajīvana lakhana jiyāye, śrī raghabīra haraṣi ura lāye |
raghuvara dīnhī bahuta baṛāī, tuma mama priya bharatahi sama bhāī |
saṃkaṭa taiṃ hanumāna chuṛāvai, mana krama bacana dhyāna jo lāvai |
ko nahiṃ jānata hai jaga meṃ kapi, saṃkaṭamocana nāma tihāro || 3 ||`,
    category: 'stotra',
    categoryLabel: 'Bhakti Ashtakam',
    categoryLabelHi: 'संकटनाशक अष्टक',
    rishi: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    devata: 'श्री हनुमान (Lord Hanuman / Sankat Mochan)',
    chhandas: 'मत्तगयन्द सवैया (Mattagayanda Savaiya)',
    source: 'Stotra Sahitya of Goswami Tulsidas',
    sourceCoordinates: 'Hanuman Ashtak, Verses 1-8',
    sourceHref: '/scripture/ramcharitmanas/',
    wordMeanings: [
      { sanskrit: 'बाल समय', iast: 'bāla samaya', hindi: 'बाल्यावस्था में', english: 'In early childhood' },
      { sanskrit: 'रबि भक्षि लियो तब', iast: 'rabi bhakṣi liyo taba', hindi: 'सूर्यदेव को फल समझकर मुख में रख लिया', english: 'Swallowed the sun mistaking it for a fruit' },
      { sanskrit: 'तीनहुं लोक भयो अँधियारो', iast: 'tīnahuṃ loka bhayo a~dhiyāro', hindi: 'तीनों लोकों में अंधकार छा गया', english: 'Darkness engulfed all three realms' },
      { sanskrit: 'देवन आनि करी बिनती', iast: 'devana āni karī binatī', hindi: 'देवताओं ने आकर विनय-प्रार्थना की', english: 'The gods assembled and offered supplications' },
      { sanskrit: 'छाँड़ि दियो रबि कष्ट निवारो', iast: 'chā~ṛi diyo rabi kaṣṭa nivāro', hindi: 'सूर्य को छोड़ दिया और सबका संकट दूर किया', english: 'Released the sun and dispelled their grave affliction' },
      { sanskrit: 'को नहिं जानत है जग में कपि', iast: 'ko nahiṃ jānata hai jaga meṃ kapi', hindi: 'हे कपीश्वर! संसार में कौन नहीं जानता', english: 'Who in this world does not know, O Lord of primates' },
      { sanskrit: 'संकटमोचन नाम तिहारो', iast: 'saṃkaṭamocana nāma tihāro', hindi: 'आपका प्रसिद्ध नाम संकटमोचन है', english: 'That Your holy name is the Deliverer from Distress' },
    ],
    hindiMeaning: 'हे कपीश्वर हनुमान जी! बाल्यावस्था में आपने सूर्यदेव को निगल लिया था, जिससे तीनों लोकों में अंधकार व्याप्त हो गया था। उस संकट को कोई टाल नहीं पा रहा था। तब समस्त देवताओं ने आकर आपसे प्रार्थना की, तब आपने सूर्य को मुक्त कर जगत का महासंकट दूर किया। इस संसार में ऐसा कौन है जो आपके मंगलकारी नाम \'संकटमोचन\' को नहीं जानता!',
    englishMeaning: 'O beloved Hanuman, King of primates! In Your childhood, You leapt up and swallowed the sun, causing darkness to fall across all three realms. No being in creation could avert that crisis. When all the gods assembled and made humble supplications, You compassionately released the sun and dispelled their immense dread. Who in this vast world is unaware that Your glorious name is Sankat Mochan—the Dispeller of all distress!',
    significance: 'Composed in the rhythmic Mattagayanda Savaiya meter by Goswami Tulsidas, Sankat Mochan Hanuman Ashtak recounts eight pivotal moments where Lord Hanuman rescued gods, sages, Sugriva, Lakshmana, and Sri Rama from seemingly insurmountable perils. Millions recite it whenever confronting overwhelming life trials, sickness, and anxiety.',
    significanceHi: 'गोस्वामी तुलसीदास कृत संकटमोचन हनुमानाष्टक आठ सवैयों में भगवान् हनुमान जी द्वारा देवताओं, सुग्रीव, लक्ष्मण और विभीषण के प्राणों व संकटों की रक्षा की अमर गाथा है। जब जीवन में घोर विपत्ति या मन में भय और असमंजस उत्पन्न होता है, तब इसके पाठ से तुरंत आत्मबल, धैर्य और निर्भयता की अनुभूति होती है।',
    faqs: [
      {
        question: 'Who composed the Sankat Mochan Hanuman Ashtak?',
        answer: 'It was composed by Goswami Tulsidas, the venerated saint-poet of the Ramcharitmanas and Hanuman Chalisa.',
      },
      {
        question: 'What does the title "Sankat Mochan" mean?',
        answer: '‘Sankat’ means crisis, peril, or sorrow, and ‘Mochan’ means one who liberates or dispels. Thus Sankat Mochan means ‘The Deliverer from all Distress’.',
      },
    ],
  },
  {
    id: 'bajrang-baan',
    slug: 'bajrang-baan',
    title: 'Bajrang Baan',
    titleHi: 'बजरंग बाण',
    sanskrit: `दोहा:
निश्चय प्रेम प्रतीति ते, बिनय करैं सनमान ।
तेहि के कारज सकल शुभ, सिद्ध करैं हनुमान ॥
चौपाई:
जय हनुमंत संत हितकारी । सुन लीजै प्रभु अरज हमारी ॥
जन के काज बिलंब न कीजै । आतुर दौरि महा सुख दीजै ॥
जैसे कूदि सिंधु महिपारा । सुरसा बदन पैठि बिस्तारा ॥
आगे जाय लंकिनी रोका । मारेहु लात गई सुर लोका ॥
जाय विभीषन को सुख दीन्हा । सीता निरखि परमपद लीन्हा ॥
बाग उजारि सिंधु महँ बोरा । अति आतुर जमकातर तोरा ॥
अक्षय कुमार मारि संहारा । लूम लपेटि लंक को जारा ॥
लाह समान लंक जरि गई । जय जय धुनि सुरपुर महँ भई ॥
उठु उठु चलु तोहिं राम दोहाई । पायँ परौं कर जोरि मनाई ॥
ॐ चं चं चं चं चपल चलंता । ॐ हं हं हं हनुमंत हसंता ॥
ॐ हं हं हँक देत कपि चंचल । ॐ सं सं सहमि पराने खल-दल ॥
अपने जन को तुरत उबारौ । सुमिरत होय आनंद हमारौ ॥
एहि बजरंग बाण जेहि मारै । ताहि कहौ फिर कौन उबारै ॥`,
    transliteration: `doha:
niścaya prema pratīti te, binaya karaiṃ sanamāna |
tehi ke kāraja sakala śubha, siddha karaiṃ hanumāna ||
caupāī:
jaya hanumaṃta saṃta hitakārī | suna lījai prabhu araja hamārī ||
jana ke kāja bilaṃba na kījai | ātura dauri mahā sukha dījai ||
jaise kūdi siṃdhu mahipārā | surasā badana paiṭhi bistārā ||
āge jāya laṃkinī rokā | mārehu lāta gaī sura lokā ||
jāya vibhīṣana ko sukha dīnhā | sītā nirakhi paramapada līnhā ||
bāga ujāri siṃdhu maha~ borā | ati ātura jamakātara torā ||
akṣaya kumāra māri saṃhārā | lūma lapeṭi laṃka ko jārā ||
lāha samāna laṃka jari gaī | jaya jaya dhuni surapura maha~ bhaī ||
uṭhu uṭhu calu tohiṃ rāma dohāī | pāya~ parauṃ kara jori manāī ||
oṃ caṃ caṃ caṃ caṃ capala calaṃtā | oṃ haṃ haṃ haṃ hanumaṃta hasaṃtā ||
oṃ haṃ haṃ ha~ka deta kapi caṃcala | oṃ saṃ saṃ sahami parāne khala-dala ||
apane jana ko turata ubārau | sumirata hoya ānaṃda hamārau ||
ehi bajaraṃga bāṇa jehi mārai | tāhi kahau phira kauna ubārai ||`,
    category: 'stotra',
    categoryLabel: 'Kavacha & Raksha Stotra',
    categoryLabelHi: 'कवच व रक्षा स्तोत्र',
    rishi: 'गोस्वामी तुलसीदास (Goswami Tulsidas)',
    devata: 'श्री हनुमान (Lord Hanuman / Bajrang Bali)',
    chhandas: 'चौपाई एवं दोहा (Chaupai & Doha)',
    source: 'Bhakti Sahitya of Goswami Tulsidas',
    sourceCoordinates: 'Bajrang Baan, Opening Doha & Verses 1-14',
    sourceHref: '/scripture/ramcharitmanas/',
    wordMeanings: [
      { sanskrit: 'निश्चय प्रेम प्रतीति ते', iast: 'niścaya prema pratīti te', hindi: 'दृढ़ निष्ठा, अनन्य प्रेम और विश्वास के साथ', english: 'With unwavering love, firm faith, and devotion' },
      { sanskrit: 'बिनय करैं सनमान', iast: 'binaya karaiṃ sanamāna', hindi: 'जो आदरपूर्वक प्रार्थना करता है', english: 'Whoever offers humble and reverent prayers' },
      { sanskrit: 'तेहि के कारज सकल शुभ', iast: 'tehi ke kāraja sakala śubha', hindi: 'उसके सभी शुभ कार्य', english: 'All virtuous endeavors of that devotee' },
      { sanskrit: 'सिद्ध करैं हनुमान', iast: 'siddha karaiṃ hanumāna', hindi: 'श्री हनुमान जी सिद्ध कर देते हैं', english: 'Are brought to fruition by Lord Hanuman' },
      { sanskrit: 'संत हितकारी', iast: 'saṃta hitakārī', hindi: 'संतों और सज्जनों का कल्याण करने वाले', english: 'Benefactor of saints and spiritual seekers' },
      { sanskrit: 'अरज हमारी', iast: 'araja hamārī', hindi: 'हमारी विनम्र प्रार्थना', english: 'Our heartfelt petition' },
      { sanskrit: 'महा सुख दीजै', iast: 'mahā sukha dījai', hindi: 'परम शांति व सुख प्रदान करें', english: 'Bestow supreme peace and bliss' },
      { sanskrit: 'एहि बजरंग बाण', iast: 'ehi bajaraṃga bāṇa', hindi: 'यह अमोघ बजरंग बाण', english: 'This unerring arrow of Bajrang Bali' },
    ],
    hindiMeaning: 'जो भी साधक निष्कपट प्रेम, अटूट श्रद्धा और पूर्ण विश्वास के साथ श्री हनुमान जी की सविनय प्रार्थना करता है, हनुमान जी उसके समस्त शुभ और धर्मसम्मत कार्यों को अवश्य सिद्ध करते हैं। हे संतों का हित करने वाले दयालु हनुमान जी! आपकी जय हो। आप हमारे निवेदन को सुनकर शीघ्र पधारें और हमारे दुःखों का निवारण कर परम सुख प्रदान करें।',
    englishMeaning: 'Whoever petitions Lord Hanuman with sincere love, unshakeable faith, and deepest reverence will find all their noble and righteous endeavors brought to successful fulfillment by Lord Hanuman. Victory to Lord Hanuman, the compassionate benefactor of devotees and saints! Graciously listen to our earnest prayer, rush swiftly to our aid without delay, and bestow supreme peace, courage, and relief from distress.',
    significance: 'The Bajrang Baan is an intensely protective prayer invoking Lord Hanuman under the sacred pledge of Sri Rama. The word \'Baan\' signifies an arrow—an unerring spiritual force that penetrates darkness, removes negative psychological blockages, dispels existential fear, and shields the sincere aspirant.',
    significanceHi: 'बजरंग बाण का शाब्दिक अर्थ है \'हनुमान जी का अमोघ बाण\'। यह स्तोत्र भय, नकारात्मक विचार, मानसिक अशांति और आकस्मिक संकटों से रक्षा करने वाला आध्यात्मिक कवच माना जाता है। इसमें श्रीराम की पावन शपथ दिलाकर संकटमोचन हनुमान जी का तीव्र आह्वान किया जाता है, जिससे साधक के मन में अदम्य साहस और निर्भयता का संचार होता है।',
    faqs: [
      {
        question: 'What does the name "Bajrang Baan" signify?',
        answer: '‘Bajrang’ refers to Vajranga (having limbs as strong as an indomitable thunderbolt), and ‘Baan’ means an arrow. It symbolizes an unerring, focused shield of divine protection against negative influences.',
      },
      {
        question: 'How does Bajrang Baan differ from Hanuman Chalisa?',
        answer: 'While the Hanuman Chalisa is a contemplative, comprehensive hymn celebrating Hanuman\'s divine attributes and virtues, the Bajrang Baan is a targeted, resolute protective invocation for dispelling urgent distress and fear.',
      },
    ],
  },
  {
    id: 'mahishasura-mardini-stotram',
    slug: 'mahishasura-mardini-stotram',
    title: 'Mahishasura Mardini Stotram',
    titleHi: 'महिषासुरमर्दिनी स्तोत्रम्',
    sanskrit: `अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दसुते
गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ।
भगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥ १ ॥
सुरवरवर्षिणि दुर्धरधर्षिणि दुर्मुखमर्षिणि हर्षरते
त्रिभुवनपोषिणी शङ्करतोषिणि किल्बिषमोषिणि घोषरते ।
दनुजकदर्शिणि दितिसुतदर्शिणि दुर्मदशोषिणि सिन्धुसुते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥ २ ॥
अयि शतखण्डविखण्डितरुण्डवितुण्डितशुण्डगजाधिपते
रिपुगजगण्डविदारणचण्डपराक्रमशुण्डमृगाधिपते ।
निजभुजदण्डनिपातितखण्डविपातितमुण्डभटाधिपते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥ ३ ॥`,
    transliteration: `ayi girinandini nanditamedini viśvavinodini nandasute
girivaravindhyaśiro'dhinivāsini viṣṇuvilāsini jiṣṇunute |
bhagavati he śitikaṇṭhakuṭumbini bhūrikuṭumbini bhūrikṛte
jaya jaya he mahiṣāsuramardini ramyakapardini śailasute || 1 ||
suravaravarṣiṇi durdharadharṣiṇi durmukhamarṣiṇi harṣarate
tribhuvanapoṣiṇī śaṅkaratoṣiṇi kilbiṣamoṣiṇi ghoṣarate |
danujakadarśiṇi ditisutadarśiṇi durmadaśoṣiṇi sindhusute
jaya jaya he mahiṣāsuramardini ramyakapardini śailasute || 2 ||
ayi śatakhaṇḍavikhaṇḍitaruṇḍavituṇḍitaśuṇḍagajādhipate
ripugajagaṇḍavidāraṇacaṇḍaparākramaśuṇḍamṛgādhipate |
nijabhujadaṇḍanipātitakhaṇḍavipātitamuṇḍabhaṭādhipate
jaya jaya he mahiṣāsuramardini ramyakapardini śailasute || 3 ||`,
    category: 'stotra',
    categoryLabel: 'Devi Stotra',
    categoryLabelHi: 'भगवती स्तोत्र',
    rishi: 'आदिशंकराचार्य (Adi Shankaracharya)',
    devata: 'भगवती दुर्गा / महिषासुरमर्दिनी (Goddess Durga / Mahishasura Mardini)',
    chhandas: 'अतिधृति छन्द / पदमञ्जरी लय (Padamanjari Laya)',
    source: 'Devi Mahatmya / Markandeya Purana Tradition',
    sourceCoordinates: 'Adi Shankara Stotra Sangraha; Devi Mahatmya Framework',
    sourceHref: '/scripture/durgasaptashati/',
    wordMeanings: [
      { sanskrit: 'अयि गिरिनन्दिनि', iast: 'ayi girinandini', hindi: 'हे पर्वतराज हिमालय की कन्या (पार्वती)', english: 'O daughter of the sacred mountain Himalaya' },
      { sanskrit: 'नन्दितमेदिनि', iast: 'nanditamedini', hindi: 'सम्पूर्ण पृथ्वी को आनंदित करने वाली', english: 'Who gladdens the entire earth' },
      { sanskrit: 'विश्वविनोदिनि', iast: 'viśvavinodini', hindi: 'अखिल विश्व में क्रीड़ा करने वाली', english: 'Who delights in cosmic play' },
      { sanskrit: 'विष्णुविलासिनि', iast: 'viṣṇuvilāsini', hindi: 'भगवान् विष्णु की भगिनी / योगमाया', english: 'The cosmic sister of Vishnu / Yogamaya' },
      { sanskrit: 'शितिकण्ठकुटुम्बिनि', iast: 'śitikaṇṭhakuṭumbini', hindi: 'नीलकण्ठ महादेव शिव की सहधर्मिणी', english: 'Consort of the blue-throated Lord Shiva' },
      { sanskrit: 'महिषासुरमर्दिनि', iast: 'mahiṣāsuramardini', hindi: 'अहंकाररूपी महिषासुर का मर्दन करने वाली', english: 'Slayer of the demon Mahishasura (ego)' },
      { sanskrit: 'रम्यकपर्दिनि', iast: 'ramyakapardini', hindi: 'सुन्दर जटाजूट धारण करने वाली', english: 'Whose braided hair is exceedingly beautiful' },
      { sanskrit: 'शैलसुते', iast: 'śailasute', hindi: 'हे गिरिराज पुत्री!', english: 'O divine daughter of the mountain' },
    ],
    hindiMeaning: 'हे पर्वतराज हिमालय की पुत्री! सम्पूर्ण पृथ्वी को आनंद प्रदान करने वाली, विश्व को अपनी लीला से उल्लासित करने वाली, विन्ध्याचल के शिखर पर वास करने वाली, भगवान् विष्णु की भगिनी तथा देवराज इन्द्र द्वारा वंदित भगवती! हे नीलकण्ठ भगवान् शिव की अर्द्धांगिनी, अनन्त कोटि ब्रह्माण्डों की माता! हे महिषासुर का मर्दन करने वाली, मनोहारी जटाओं से शोभित गिरिराज किशोरी! आपकी सदा जय हो, जय हो!',
    englishMeaning: 'Salutations to You, O divine daughter of the king of mountains! You who bring joy to the entire cosmos, who reside on the lofty peaks of the sacred Vindhya mountains, delighting Vishnu and revered by Indra. O Goddess, consort of the blue-throated Lord Shiva, mother of all worlds whose bounty is boundless! Victory, supreme victory unto You, O conqueror of the demon Mahishasura, with exquisitely beautiful locks of hair, daughter of the mountain!',
    significance: 'The Mahishasura Mardini Stotram, attributed to Adi Shankaracharya, is one of the most energetically sublime hymns in Sanskrit literature. Composed in twenty stanzas with dazzling alliteration and rhythmic cadences, it portrays the triumph of Divine Consciousness (Durga) over primal demonic ego, delusion, and inertia (Mahishasura).',
    significanceHi: 'महिषासुरमर्दिनी स्तोत्रम् संस्कृत साहित्य का अत्यंत ओजस्वी, काव्यात्मक एवं शक्तिशाली स्तोत्र है। आदिशंकराचार्य ने इसके बीस पदों में भगवती दुर्गा द्वारा तमोगुण और अहंकाररूपी महिषासुर के विनाश का भव्य वर्णन किया है। इसका सस्वर गान साधक के भीतर सुप्त चेतना, ओज, तेज और निर्भयता को जाग्रत करता है।',
    faqs: [
      {
        question: 'Who composed the Mahishasura Mardini Stotram?',
        answer: 'It is traditionally attributed to Jagadguru Adi Shankaracharya, drawing inspiration from the Devi Mahatmya (Durga Saptashati) of the Markandeya Purana.',
      },
      {
        question: 'What does Mahishasura symbolize spiritually?',
        answer: 'In Indian philosophy, Mahishasura (the buffalo demon) symbolizes heavy inertia (tamas), untamed animalistic impulses, pride, and ego. Goddess Durga destroying Mahishasura represents the victory of pure spiritual wisdom over ego.',
      },
    ],
  },
  {
    id: 'shiv-chalisa',
    slug: 'shiv-chalisa',
    title: 'Shiv Chalisa',
    titleHi: 'श्री शिव चालीसा',
    sanskrit: `दोहा:
जय गणेश गिरिजा सुवन, मंगल मूल सुजान ।
कहत अयोध्यादास तुम, देहु अभय वरदान ॥
चौपाई:
जय गिरिजा पति दीन दयाला । सदा करत संतन प्रतिपाला ॥
भाल चंद्रमा सोहत नीके । कानन कुंडल नागफनी के ॥
अंग गौर शिर गंग बहाये । मुंडमाल तन क्षार लगाये ॥
वस्त्र खाल बाघंबर सोहे । छवि को देखि नाग मुनि मोहे ॥
मैना मातु की ह्वै दुलारी । बाम अंग सोहत छवि न्यारी ॥
कर त्रिशूल सोहत शुभगारी । करत सदा शत्रुन क्षयकारी ॥
नंदि गणेश सोहैं तहँ कैसे । सागर मध्य कमल हैं जैसे ॥
कार्तिक श्याम और गणराऊ । या छवि को कहि जात न काऊ ॥
देवन जबहीं जाय पुकारा । तबहीं दुख प्रभु आप निवारा ॥
किया उपद्रव तारक भारी । देवन सब मिलि तुमहिं जुहारी ॥
तुरत षडानन आप पठायौ । लवनिमेष महँ मारि गिरायौ ॥
आप जलंधर असुर संहारा । सुयश तुम्हार विदित संसारा ॥`,
    transliteration: `doha:
jaya gaṇeśa girijā suvana, maṃgala mūla sujāna |
kahata ayodhyādāsa tuma, dehu abhaya varadāna ||
caupāī:
jaya girijā pati dīna dayālā | sadā karata saṃtana pratipālā ||
bhāla caṃdramā sohata nīke | kānana kuṃḍala nāgaphanī ke ||
aṃga gaura śira gaṃga bahāye | muṃḍamāla tana kṣāra lagāye ||
vastra khāla bāghaṃbara sohe | chavi ko dekhi nāga muni mohe ||
mainā mātu kī hvai dulārī | bāma aṃga sohata chavi nyārī ||
kara triśūla sohata śubhagārī | karata sadā śatruna kṣayakārī ||
naṃdi gaṇeśa sohaiṃ taha~ kaise | sāgara madhya kamala haiṃ jaise ||
kārtika śyāma aura gaṇarāū | yā chavi ko kahi jāta na kāū ||
devana jabahīṃ jāya pukārā | tabahīṃ dukha prabhu āpa nivārā ||
kiyā upadrava tāraka bhārī | devana saba mili tumahiṃ juhārī ||
turata ṣaḍānana āpa paṭhāyau | lavanimeṣa maha~ māri girāyau ||
āpa jalaṃdhara asura saṃhārā | suyaśa tumhāra vidita saṃsārā ||`,
    category: 'stotra',
    categoryLabel: 'Stuti & Chalisa',
    categoryLabelHi: 'स्तुति व चालीसा',
    rishi: 'सनातन परम्परा (Traditional Stotra Literature)',
    devata: 'भगवान् सदाशिव (Lord Sadashiva)',
    chhandas: 'दोहा एवं चौपाई (Doha & Chaupai — 40 verses)',
    source: 'Shiva Purana Bhakti Tradition',
    sourceCoordinates: 'Shiv Chalisa, Opening Doha & Verses 1-12',
    sourceHref: '/scripture/shivpurana/',
    wordMeanings: [
      { sanskrit: 'गिरिजा पति', iast: 'girijā pati', hindi: 'माता पार्वती (गिरिजा) के स्वामी भगवान् शिव', english: 'Lord of Parvati, Lord Shiva' },
      { sanskrit: 'दीन दयाला', iast: 'dīna dayālā', hindi: 'दीन-दुखियों पर दया करने वाले', english: 'Compassionate to the humble and distressed' },
      { sanskrit: 'भाल चंद्रमा सोहत नीके', iast: 'bhāla caṃdramā sohata nīke', hindi: 'मस्तक पर बाल-चन्द्रमा परम सुशोभित है', english: 'On whose forehead the crescent moon shines gracefully' },
      { sanskrit: 'कानन कुंडल नागफनी के', iast: 'kānana kuṃḍala nāgaphanī ke', hindi: 'कानों में सर्प-रूप कुण्डल धारण किए हुए', english: 'Wearing coiled serpents as ear ornaments' },
      { sanskrit: 'शिर गंग बहाये', iast: 'śira gaṃga bahāye', hindi: 'जटाओं से पापनाशिनी गंगा प्रवाहित होती है', english: 'From whose matted locks the holy Ganga flows' },
      { sanskrit: 'तन क्षार लगाये', iast: 'tana kṣāra lagāye', hindi: 'सम्पूर्ण शरीर पर पावन भस्म रमाए हुए', english: 'Whose body is smeared with sacred ashes (bhasma)' },
      { sanskrit: 'देहु अभय वरदान', iast: 'dehu abhaya varadāna', hindi: 'मुझे निर्भयता का वरदान प्रदान करें', english: 'Grant me the boon of fearlessness' },
    ],
    hindiMeaning: 'हे माता पार्वती के प्राणप्रिय, दीनबंधु भगवान् शिव! आपकी सदा जय हो। आप सदा साधु-संतों और शरणागतों का पालन-पोषण करते हैं। आपके ललाट पर सुकोमल चन्द्रमा सुशोभित है और कानों में सर्प के कुण्डल हैं। आपकी जटाओं से पतितपावनी गंगा प्रवाहित होती है और दिव्य देह पर भस्म रमी हुई है। आप बाघाम्बर धारण किए हुए हैं और वाम अंग में जगन्माता उमा विराजित हैं। हे भोलेनाथ! आप मुझे निर्भयता और भक्ति का वरदान प्रदान करें।',
    englishMeaning: 'Victory unto You, Lord of Parvati, Ocean of Compassion for the humble and distressed! You are the eternal protector of saints and devotees. The graceful crescent moon adorns Your forehead, and celestial serpents form Your ear-ornaments. From Your matted locks flows the purifying river Ganga, and Your resplendent body is anointed with sacred ashes. Clad in tiger-skin with Mother Parvati gracefully adorning Your left side, You enchant sages and gods alike. O merciful Bholenath, bless us with eternal fearlessness and devotion.',
    significance: 'The Shiv Chalisa is a 40-verse hymn of profound devotion recited daily by millions of devotees across the globe, especially on Mondays, Pradosha Vrata, and Maha Shivaratri. It describes Lord Shiva\'s ascetic glory, the churning of the cosmic ocean (Samudra Manthan) where He consumed the Halahala poison to save all beings, and His limitless boons to the pure-hearted.',
    significanceHi: 'श्री शिव चालीसा भगवान् आशुतोष महादेव की स्तुति का सरल, मधुर और अत्यंत लोकप्रिय पाठ है। इसमें भगवान् शिव के स्वरूप, गंगावतरण, हलाहल विष-पान और भक्तों पर उनकी सहज करुणा का पावन वर्णन है। सोमवार, प्रदोष व्रत और महाशिवरात्रि पर इसका पाठ समस्त पापों का शमन कर जीवन में शांति, आरोग्य और मोक्ष का मार्ग प्रशस्त करता है।',
    faqs: [
      {
        question: 'When is the Shiv Chalisa traditionally recited?',
        answer: 'Devotees recite it daily in morning or evening prayers, particularly on Mondays, during the sacred month of Shravana, on Pradosha Vrata, and on Maha Shivaratri.',
      },
      {
        question: 'What does the crescent moon on Shiva\'s forehead signify?',
        answer: 'The crescent moon (Chandrashekhara) represents Lord Shiva\'s complete mastery over the mind and time (Kala), shining as calm, illuminating wisdom amid cosmic stillness.',
      },
    ],
  },
  {
    id: 'argala-stotram',
    slug: 'argala-stotram',
    title: 'Argala Stotram',
    titleHi: 'अर्गलास्तोत्रम्',
    sanskrit: `ॐ जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥ १ ॥
जय त्वं देवि चामुण्डे जय भूतार्तिहारिणि ।
जय सर्वगते देवि कालरात्रि नमोऽस्तु ते ॥ २ ॥
मधुकैटभविध्वंसि विधातृवरदे नमः ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥ ३ ॥
महिषासुरनिर्णशि भक्तानां सुखदे नमः ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥ ४ ॥
रक्तबीजवधे देवि चण्डमुण्डविनाशिनि ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥ ५ ॥`,
    transliteration: `oṃ jayantī maṅgalā kālī bhadrakālī kapālinī |
durgā kṣamā śivā dhātrī svāhā svadhā namo'stu te || 1 ||
jaya tvaṃ devi cāmuṇḍe jaya bhūtārtihāriṇi |
jaya sarvagate devi kālarātri namo'stu te || 2 ||
madhukaiṭabhavidhvaṃsi vidhātṛvarade namaḥ |
rūpaṃ dehi jayaṃ dehi yaśo dehi dviṣo jahi || 3 ||
mahiṣāsuranirṇaśi bhaktānāṃ sukhade namaḥ |
rūpaṃ dehi jayaṃ dehi yaśo dehi dviṣo jahi || 4 ||
raktabījavadhe devi caṇḍamuṇḍavināśini |
rūpaṃ dehi jayaṃ dehi yaśo dehi dviṣo jahi || 5 ||`,
    category: 'stotra',
    categoryLabel: 'Devi Mahatmya Anga',
    categoryLabelHi: 'सप्तशती अङ्ग स्तोत्र',
    rishi: 'मार्कण्डेय ऋषि (Rishi Markandeya)',
    devata: 'भगवती महालक्ष्मी / चण्डिका (Mahalakshmi / Chandika)',
    chhandas: 'अनुष्टुप् (Anushtup)',
    source: 'Markandeya Purana / Durga Saptashati',
    sourceCoordinates: 'Durga Saptashati Anga, Argala Stotram 1-5',
    sourceHref: '/scripture/durgasaptashati/',
    wordMeanings: [
      { sanskrit: 'जयन्ती', iast: 'jayantī', hindi: 'सर्वोत्कृष्ट विजयशालिनी', english: 'The Supremely Victorious' },
      { sanskrit: 'मङ्गला', iast: 'maṅgalā', hindi: 'मोक्ष और परम कल्याण प्रदान करने वाली', english: 'Giver of Auspicious Liberation' },
      { sanskrit: 'काली', iast: 'kālī', hindi: 'सम्पूर्ण प्रपंच को विलीन करने वाली', english: 'Who dissolves all cosmic illusion' },
      { sanskrit: 'भद्रकाली', iast: 'bhadrakālī', hindi: 'भक्तों को भद्र (कल्याण) देने वाली', english: 'Gracious protector of devotees' },
      { sanskrit: 'कपालिनी', iast: 'kapālinī', hindi: 'हाथ में मुण्डमाला व खप्पर धारण करने वाली', english: 'Bearer of the sacred skull' },
      { sanskrit: 'दुर्गा क्षमा शिवा धात्री', iast: 'durgā kṣamā śivā dhātrī', hindi: 'दुर्गम संकटों को हरने वाली, क्षमाशीला, परम मंगलमयी और विश्व का पोषण करने वाली', english: 'Dispeller of distress, Forgiving, Auspicious, and Sustainer' },
      { sanskrit: 'स्वाहा स्वधा', iast: 'svāhā svadhā', hindi: 'देवयज्ञ (स्वाहा) व पितृयज्ञ (स्वधा) स्वरूपा', english: 'Embodiment of divine (Svaha) and ancestral (Svadha) oblations' },
      { sanskrit: 'रूपं देहि जयं देहि', iast: 'rūpaṃ dehi jayaṃ dehi', hindi: 'मुझे आत्मस्वरूप का ज्ञान दीजिए, काम-क्रोधादि पर विजय दीजिए', english: 'Grant me spiritual radiance, grant me victory over inner enemies' },
      { sanskrit: 'यशो देहि द्विषो जहि', iast: 'yaśo dehi dviṣo jahi', hindi: 'मुझे दिव्य सुयश दीजिए और काम-क्रोध रूपी आंतरिक शत्रुओं का नाश कीजिए', english: 'Grant me righteous glory, and conquer my negative afflictions' },
    ],
    hindiMeaning: 'हे जयन्ती, मङ्गला, काली, भद्रकाली, कपालिनी, दुर्गा, क्षमा, शिवा, धात्री, स्वाहा और स्वधा—इन ग्यारह नामों से प्रसिद्ध जगदम्बिके! आपको सादर नमस्कार है। हे देवि चामुण्डे! आपकी जय हो। हे समस्त प्राणियों की पीड़ा हरने वाली! आपकी जय हो। हे सर्वव्यापी देवि! हे कालरात्रि! आपको मेरा प्रणाम है। हे मधु और कैटभ का संहार करने वाली तथा ब्रह्मा जी को वरदान देने वाली भगवती! आप मुझे आत्म-ज्ञानरूपी रूप दीजिए, विजय दीजिए, सुयश दीजिए और मेरे आंतरिक शत्रुओं (काम, क्रोध, लोभ, मोह) का संहार कीजिए।',
    englishMeaning: 'Salutations unto You, O Goddess, celebrated by eleven sacred names: Jayanti (The Victorious), Mangala (Auspicious Liberator), Kali (Cosmic Dissolver), Bhadrakali (Benevolent Mother), Kapalini, Durga (Reliever of Perils), Kshama (Forgiveness Incarnate), Shiva (Auspiciousness), Dhatri (Cosmic Sustainer), Svaha (Oblation to Gods), and Svadha (Oblation to Ancestors). Victory unto You, O Chamunda! Victory unto You who dispels the affliction of all beings! O all-pervading Goddess Kalaratri, salutations to You. Slayer of Madhu and Kaitabha, Bestower of boons to Brahma: bestow upon us spiritual radiance, bestow inner victory, bestow divine honor, and eradicate our inner adversaries (ego, anger, and delusion).',
    significance: 'The Argala Stotram is an indispensable preliminary hymn to the Durga Saptashati. \'Argala\' literally means a \'bolt\' or \'latch\' that bars a doorway. Chanting the Argala unlocks the protective spiritual bolts of the heart and mind, dissolving subconscious resistance so that the sublime teachings of the Devi Mahatmya can take root. The refrain \'Rupam dehi, Jayam dehi\' is a prayer not for mere outward vanity, but for the true spiritual form (Svarupa) and triumph over the senses.',
    significanceHi: 'अर्गला का शाब्दिक अर्थ है \'कुंडी\' या \'अवरोधक छड़\'। जिस प्रकार द्वार पर लगी अर्गला को हटाए बिना भवन में प्रवेश संभव नहीं होता, उसी प्रकार अर्गला स्तोत्र के पाठ से साधक के अंतःकरण के संशय, भय और अज्ञान के ताले खुलते हैं। \'रूपं देहि जयं देहि\' प्रार्थना में रूप का अर्थ भौतिक सौंदर्य नहीं, अपितु आत्मस्वरूप का साक्षात्कार तथा जय का अर्थ अंतःशत्रुओं पर विजय है।',
    faqs: [
      {
        question: 'What does "Argala" mean in the context of the Durga Saptashati?',
        answer: '‘Argala’ means a wooden or iron bolt that locks a gate. The Argala Stotram removes the spiritual bolts and inner blockages hindering the fruit of scripture recitation.',
      },
      {
        question: 'What does the refrain "Rupam Dehi, Jayam Dehi, Yasho Dehi, Dvisho Jahi" mean?',
        answer: 'It is a prayer to Mother Durga for four spiritual boons: divine spiritual beauty and self-knowledge (Rupa), victory over ego and passions (Jaya), unblemished spiritual glory (Yasha), and the destruction of negative mental vices (Dvisha).',
      },
    ],
  },
  {
    id: 'devi-kavacham',
    slug: 'devi-kavacham',
    title: 'Devi Kavacham (Chandi Kavach)',
    titleHi: 'देवीकवचम् (चण्डी कवच)',
    sanskrit: `यद्गुह्यं परमं लोके सर्वरक्षाकरं नृणाम् ।
यन्न कस्यचिदाख्यातं तन्मे ब्रूहि पितामह ॥ १ ॥
ब्रह्मोवाच ।
अस्ति गुह्यतमं विप्र सर्वभूतोपकारकम् ।
देव्यास्तु कवचं पुण्यं तच्छृणुष्व महामुने ॥ २ ॥
प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी ।
तृतीयं चन्द्रघण्टेति कूष्माण्डेति चतुर्थकम् ॥ ३ ॥
पञ्चमं स्कन्दमातेति षष्ठं कात्यायनीति च ।
सप्तमं कालरात्रीति महागौरीति चाष्टमम् ॥ ४ ॥
नवमं सिद्धिदात्री च नवदुर्गाः प्रकीर्तिताः ।
उक्तान्येतानि नामानि ब्रह्मणैव महात्मना ॥ ५ ॥`,
    transliteration: `yadguhyaṃ paramaṃ loke sarvarakṣākaraṃ nṛṇām |
yanna kasyacidākhyātaṃ tanme brūhi pitāmaha || 1 ||
brahmovāca |
asti guhyatamaṃ vipra sarvabhūtopakārakam |
devyāstu kavacaṃ puṇyaṃ tacchṛṇuṣva mahāmune || 2 ||
prathamaṃ śailaputrī ca dvitīyaṃ brahmacāriṇī |
tṛtīyaṃ candraghaṇṭeti kūṣmāṇḍeti caturthakam || 3 ||
pañcamaṃ skandamāteti ṣaṣṭhaṃ kātyāyanīti ca |
saptamaṃ kālarātrīti mahāgaurīti cāṣṭamam || 4 ||
navamaṃ siddhidātrī ca navadurgāḥ prakīrtitāḥ |
uktānyetāni nāmāni brahmaṇaiva mahātmanā || 5 ||`,
    category: 'stotra',
    categoryLabel: 'Devi Mahatmya Anga',
    categoryLabelHi: 'सप्तशती अङ्ग स्तोत्र',
    rishi: 'ब्रह्मा जी (Lord Brahma to Sage Markandeya)',
    devata: 'नवदुर्गा / चण्डिका (The Nine Durgas / Chandika)',
    chhandas: 'अनुष्टुप् (Anushtup)',
    source: 'Varaha Purana / Durga Saptashati Tradition',
    sourceCoordinates: 'Durga Saptashati Anga, Devi Kavacham 1-5',
    sourceHref: '/scripture/durgasaptashati/',
    wordMeanings: [
      { sanskrit: 'यद्गुह्यं परमं लोके', iast: 'yadguhyaṃ paramaṃ loke', hindi: 'जो संसार में परम गोपनीय है', english: 'That which is supremely hidden in the world' },
      { sanskrit: 'सर्वरक्षाकरं नृणाम्', iast: 'sarvarakṣākaraṃ nṛṇām', hindi: 'और मनुष्यों की सब प्रकार से रक्षा करने वाला है', english: 'And protects human beings from every affliction' },
      { sanskrit: 'तच्छृणुष्व महामुने', iast: 'tacchṛṇuṣva mahāmune', hindi: 'हे महामुने! उस पावन कवच को आप श्रवण करें', english: 'O great sage, listen attentively to that holy armor' },
      { sanskrit: 'प्रथमं शैलपुत्री', iast: 'prathamaṃ śailaputrī', hindi: 'प्रथम रूप शैलपुत्री है', english: 'The first manifestation is Shailaputri' },
      { sanskrit: 'द्वितीयं ब्रह्मचारिणी', iast: 'dvitīyaṃ brahmacāriṇī', hindi: 'द्वितीय रूप ब्रह्मचारिणी है', english: 'The second is Brahmacharini' },
      { sanskrit: 'तृतीयं चन्द्रघण्टा', iast: 'tṛtīyaṃ candraghaṇṭā', hindi: 'तृतीय रूप चन्द्रघण्टा है', english: 'The third is Chandraghanta' },
      { sanskrit: 'कूष्माण्डेति चतुर्थकम्', iast: 'kūṣmāṇḍeti caturthakam', hindi: 'चतुर्थ रूप कूष्माण्डा है', english: 'The fourth is Kushmanda' },
      { sanskrit: 'पञ्चमं स्कन्दमाता', iast: 'pañcamaṃ skandamātā', hindi: 'पाँचवाँ रूप स्कन्दमाता है', english: 'The fifth is Skandamata' },
      { sanskrit: 'षष्ठं कात्यायनी', iast: 'ṣaṣṭhaṃ kātyāyanī', hindi: 'छठा रूप कात्यायनी है', english: 'The sixth is Katyayani' },
      { sanskrit: 'सप्तमं कालरात्रि', iast: 'saptamaṃ kālarātri', hindi: 'सातवाँ रूप कालरात्रि है', english: 'The seventh is Kalaratri' },
      { sanskrit: 'अष्टमं महागौरी', iast: 'aṣṭamaṃ mahāgaurī', hindi: 'आठवाँ रूप महागौरी है', english: 'The eighth is Mahagauri' },
      { sanskrit: 'नवमं सिद्धिदात्री', iast: 'navamaṃ siddhidātrī', hindi: 'नवां रूप सिद्धिदात्री है', english: 'The ninth is Siddhidatri' },
      { sanskrit: 'नवदुर्गाः प्रकीर्तिताः', iast: 'navadurgāḥ prakīrtitāḥ', hindi: 'ये नवदुर्गा के नाम से विख्यात हैं', english: 'These are celebrated as the Nine Forms of Durga' },
    ],
    hindiMeaning: 'मार्कण्डेय जी ने पूछा: हे पितामह! जो साधन इस संसार में परम गोपनीय हो और मनुष्यों की सब संकटों से रक्षा करने वाला हो, वह मुझे बताइए। ब्रह्मा जी ने कहा: हे विप्र! समस्त प्राणियों का उपकार करने वाला देवी का परम पवित्र कवच अत्यंत गोपनीय है, उसे आप ध्यानपूर्वक सुनें। महामना ब्रह्मा जी ने भगवती दुर्गा के नौ पावन रूपों का वर्णन किया है—प्रथम शैलपुत्री, द्वितीय ब्रह्मचारिणी, तृतीय चन्द्रघण्टा, चतुर्थ कूष्माण्डा, पंचम स्कन्दमाता, षष्ठ कात्यायनी, सप्तम कालरात्रि, अष्टम महागौरी तथा नवम सिद्धिदात्री। ये नवदुर्गा नाम से जगत् में विख्यात हैं।',
    englishMeaning: 'Sage Markandeya asked: O Grandfather Brahma! Graciously reveal to me that which is supremely secret in this universe, yet bestows complete protection against all perils upon human beings. Lord Brahma said: O venerable sage, there exists a supremely sacred Armor (Kavacham) of the Divine Mother that confers boundless protection on all beings. Hear it with devotion. The great Lord Brahma has proclaimed the nine resplendent forms of Goddess Durga: First Shailaputri, second Brahmacharini, third Chandraghanta, fourth Kushmanda, fifth Skandamata, sixth Katyayani, seventh Kalaratri, eighth Mahagauri, and ninth Siddhidatri. These are celebrated as the sacred Nava Durga.',
    significance: 'The Devi Kavacham (also known as the Chandi Kavach) is an esoteric armor forming the premier preparatory limb of the Durga Saptashati. It systematically invokes different aspects of the Divine Mother to guard every organ, limb, cognitive faculty, and subtle energy channel against physical harm, psychic vulnerability, and fear. The recitation of the nine names of Nava Durga establishes harmonious mental stillness.',
    significanceHi: 'देवीकवचम् दुर्गासप्तशती का प्रथम एवं सर्वाधिक प्रभावशाली रक्षा-कवच है। इसमें साधक के सिर, नेत्र, जिह्वा, हृदय, नाभि से लेकर समस्त प्राणों और इंद्रियों की रक्षा हेतु जगदम्बा के विविध स्वरूपों का आह्वान किया जाता है। नवदुर्गा के नौ नामों का स्मरण जीवन में स्थिरता, तेज, और निर्भयता का संचार करता है।',
    faqs: [
      {
        question: 'What are the Nine Forms of Durga (Navadurga) enumerated in the Devi Kavacham?',
        answer: 'They are: 1. Shailaputri, 2. Brahmacharini, 3. Chandraghanta, 4. Kushmanda, 5. Skandamata, 6. Katyayani, 7. Kalaratri, 8. Mahagauri, and 9. Siddhidatri.',
      },
      {
        question: 'Why is the Kavacham recited before reading the Durga Saptashati?',
        answer: 'Just as a warrior puts on armor before entering battle, a spiritual seeker recites the Kavacham to establish an impenetrable mental shield of divine consciousness before undertaking powerful scriptural recitation.',
      },
    ],
  },
  {
    id: 'keelaka-stotram',
    slug: 'keelaka-stotram',
    title: 'Keelaka Stotram',
    titleHi: 'कीलकस्तोत्रम्',
    sanskrit: `ॐ विशुद्धज्ञानदेहाय त्रिवेदीदिव्यचक्षुषे ।
श्रेयःप्राप्तिनिमित्ताय नमः सोमार्धधारिणे ॥ १ ॥
सर्वमेतद्विजानीयान्मन्त्राणामभिकीलकम् ।
सोऽपि क्षेममवाप्नोति स्तुत्यं जप्यमनन्यधीः ॥ २ ॥
सिद्ध्यन्त्युच्चाटनादीनि वस्तूनि सकलान्यपि ।
एतेन स्तुवतां देवीं स्तोत्रमात्रेण सिद्ध्यति ॥ ३ ॥
न मन्त्रो नौषधं तत्र न किञ्चिदपि विद्यते ।
विना जप्येन सिद्ध्येत सर्वमुच्चाटनादिकम् ॥ ४ ॥
जनेन च समायुक्तं सर्वतो भगवद्वचः ।
गोपनीयं प्रयत्नेन प्रकाशं जननान्वितम् ॥ ५ ॥`,
    transliteration: `oṃ viśuddhajnānadehāya trivedīdivyacakṣuṣe |
śreyaḥprāptinimittāya namaḥ somārdhadhāriṇe || 1 ||
sarvametadvijānīyānmantrāṇāmabhikīlakam |
so'pi kṣemamavāpnoti stutyaṃ japyam ananyadhīḥ || 2 ||
siddhyantyuccāṭanādīni vastūni sakalānyapi |
etena stuvatāṃ devīṃ stotramātreṇa siddhyati || 3 ||
na mantro nauṣadhaṃ tatra na kiñcidapi vidyate |
vinā japyena siddhyeta sarvamuccāṭanādikam || 4 ||
janena ca samāyuktaṃ sarvato bhagavadvacaḥ |
gopanīyaṃ prayatnena prakāśaṃ jananānvitam || 5 ||`,
    category: 'stotra',
    categoryLabel: 'Devi Mahatmya Anga',
    categoryLabelHi: 'सप्तशती अङ्ग स्तोत्र',
    rishi: 'ऋषि मार्कण्डेय (Rishi Markandeya)',
    devata: 'महासरस्वती / चण्डिका (Mahasaraswati / Chandika)',
    chhandas: 'अनुष्टुप् (Anushtup)',
    source: 'Markandeya Purana / Durga Saptashati Tradition',
    sourceCoordinates: 'Durga Saptashati Anga, Keelaka Stotram 1-5',
    sourceHref: '/scripture/durgasaptashati/',
    wordMeanings: [
      { sanskrit: 'विशुद्धज्ञानदेहाय', iast: 'viśuddhajnānadehāya', hindi: 'विशुद्ध ज्ञान ही जिनका दिव्य शरीर है', english: 'Whose divine form is pure knowledge' },
      { sanskrit: 'त्रिवेदीदिव्यचक्षुषे', iast: 'trivedīdivyacakṣuṣe', hindi: 'तीनों वेद ही जिनके दिव्य नेत्र हैं', english: 'Whose divine eyes are the three Vedas' },
      { sanskrit: 'श्रेयःप्राप्तिनिमित्ताय', iast: 'śreyaḥprāptinimittāya', hindi: 'जो परम कल्याण (मोक्ष) की प्राप्ति के मूल हेतु हैं', english: 'The cause of attaining supreme spiritual beatitude' },
      { sanskrit: 'सोमार्धधारिणे नमः', iast: 'somārdhadhāriṇe namaḥ', hindi: 'मस्तक पर अर्धचन्द्र धारण करने वाले भगवान् शिव को नमस्कार है', english: 'Salutations to Lord Shiva who bears the crescent moon' },
      { sanskrit: 'मन्त्राणामभिकीलकम्', iast: 'mantrāṇāmabhikīlakam', hindi: 'सम्पूर्ण मन्त्रों के कीलक (गोपनीय बीज) को', english: 'The profound spiritual pin (Keelaka) of all mantras' },
      { sanskrit: 'स्तोत्रमात्रेण सिद्ध्यति', iast: 'stotramātreṇa siddhyati', hindi: 'केवल इस स्तोत्र के पाठ से ही सब सिद्ध हो जाता है', english: 'Everything is attained through the pure recitation of this hymn' },
    ],
    hindiMeaning: 'विशुद्ध ज्ञान ही जिनका दिव्य शरीर है, तीनों वेद (ऋग्, यजुः, साम) ही जिनके दिव्य नेत्र हैं, जो मोक्ष और परम कल्याण की प्राप्ति के एकमात्र कारण हैं तथा जो मस्तक पर अर्धचन्द्र धारण करते हैं—उन भगवान् शिव को सादर नमस्कार है। इस स्तोत्र को मन्त्रों का कीलक (कील / गुप्त कुञ्जी) जानना चाहिए। जो साधक अनन्य चित्त होकर इस सप्तशती का पाठ करता है, वह परम कल्याण को प्राप्त होता है। उसे किसी अन्य साधन, तंत्र या औषधि की आवश्यकता नहीं रहती; केवल भगवती के इस पावन स्तोत्र के निष्काम पाठ से ही आत्म-सिद्धि और समस्त विघ्नों की शांति हो जाती है।',
    englishMeaning: 'Salutations to Lord Shiva, whose embodiment is pure transcendental knowledge, whose divine eyes are the three sacred Vedas, who is the sole cause of attaining supreme spiritual beatitude (Shreyas), and who wears the graceful crescent moon upon His crown. One should understand this hymn as the Keelaka (the esoteric pin or master-key) of all sacred mantras. Whoever recites the praise of the Goddess with single-minded devotion attains supreme well-being. For that seeker, no complex rites or external devices are needed; through this pure recitation alone, spiritual mastery and the cessation of obstacles are attained.',
    significance: 'The Keelaka Stotram is the third foundational Anga of the Durga Saptashati. \'Keelaka\' signifies a wedge, pin, or lock. In scriptural lore, Lord Shiva sealed the tremendous energy of the Chandi mantras so that they would not be misused for selfish harm. The Keelaka Stotram is the sacred code that \'unpins\' (nishkilana) this seal for the righteous, sincere practitioner, unlocking the boundless compassionate grace of the Divine Mother.',
    significanceHi: 'कीलक का अर्थ है \'कील\' या \'खूंटा\'। भगवान् शिव ने चण्डी मन्त्रों के अपार तेज को कीलित (गोपित) कर दिया था ताकि कोई स्वार्थी वृत्ति से इसका दुरुपयोग न कर सके। कीलक स्तोत्र का पाठ निष्काम साधक के लिए उस कील को हटाकर मन्त्र की आध्यात्मिक चेतना को जाग्रत करता है, जिससे पाठ का पूर्ण फल प्राप्त होता है।',
    faqs: [
      {
        question: 'What does "Keelaka" mean in the Durga Saptashati?',
        answer: '‘Keelaka’ means the spiritual pin or lock. It unlocks the sealed divine power of the Chandi recitation for righteous, devotional seekers.',
      },
      {
        question: 'To whom is the opening verse of the Keelaka Stotram addressed?',
        answer: 'It is addressed to Lord Shiva (Chandrashekhara), who embodies pure transcendent knowledge and whose eyes are the three Vedas.',
      },
    ],
  },
  {
    id: 'tantroktam-ratri-suktam',
    slug: 'tantroktam-ratri-suktam',
    title: 'Tantroktam Ratri Suktam',
    titleHi: 'तन्त्रोक्तं रात्रिसूक्तम्',
    sanskrit: `ॐ विश्वेश्वरीं जगद्धात्रीं स्थितिसंहारकारिणीम् ।
निद्रां भगवतीं विष्णोरतुलां तेजसः प्रभुः ॥ १ ॥
ब्रह्मोवाच ।
त्वं स्वाहा त्वं स्वधा त्वं हि वषट्कारः स्वरात्मिका ।
सुधा त्वमक्षरे नित्ये त्रिधा मात्रात्मिका स्थिता ॥ २ ॥
अर्धमात्रा स्थिता नित्या यानुच्चार्या विशेषतः ।
त्वमेव सन्ध्या सावित्री त्वं देवि जननी परा ॥ ३ ॥
त्वयैतद्धार्यते विश्वं त्वयैतत्सृज्यते जगत् ।
त्वयैतत्पाल्यते देवि त्वमत्स्यन्ते च सर्वदा ॥ ४ ॥
विमर्शिनी महाविद्या महामाया महामेधा महास्मृतिः ।
महामोहरूपा च भवती महादेवी महेश्वरी ॥ ५ ॥`,
    transliteration: `oṃ viśveśvarīṃ jagaddhātrīṃ sthitisaṃhārakāriṇīm |
nidrāṃ bhagavatīṃ viṣṇoratulāṃ tejasaḥ prabhuḥ || 1 ||
brahmovāca |
tvaṃ svāhā tvaṃ svadhā tvaṃ hi vaṣaṭkāraḥ svarātmikā |
sudhā tvamakṣare nitye tridhā mātrātmikā sthitā || 2 ||
ardhamātrā sthitā nityā yānuccāryā viśeṣataḥ |
tvameva sandhyā sāvitrī tvaṃ devi jananī parā || 3 ||
tvayaitaddhāryate viśvaṃ tvayaitatsṛjyate jagat |
tvayaitatpālyate devi tvamatsyante ca sarvadā || 4 ||
vimarśinī mahāvidyā mahāmāyā mahāmedhā mahāsmṛtiḥ |
mahāmoharūpā ca bhavatī mahādevī maheśvarī || 5 ||`,
    category: 'vedic',
    categoryLabel: 'Devi Mahatmya Sukta',
    categoryLabelHi: 'रात्रिसूक्त पाठ',
    rishi: 'ब्रह्मा जी (Lord Brahma in Brahmanda)',
    devata: 'महामाया / योगनिद्रा (Yoganidra / Mahamaya)',
    chhandas: 'अनुष्टुप् (Anushtup)',
    source: 'Markandeya Purana / Devi Mahatmya Chapter 1',
    sourceCoordinates: 'Durga Saptashati, Chapter 1, Brahma Stuti 72-76',
    sourceHref: '/scripture/durgasaptashati/chapter/1/',
    wordMeanings: [
      { sanskrit: 'विश्वेश्वरीं जगद्धात्रीं', iast: 'viśveśvarīṃ jagaddhātrīm', hindi: 'सम्पूर्ण विश्व की अधीश्वरी तथा जगत् को धारण करने वाली', english: 'Sovereign Queen and Sustainer of the Cosmos' },
      { sanskrit: 'स्थितिसंहारकारिणीम्', iast: 'sthitisaṃhārakāriṇīm', hindi: 'सृष्टि की स्थिति और प्रलय करने वाली', english: 'Cause of preservation and dissolution' },
      { sanskrit: 'निद्रां भगवतीं विष्णोः', iast: 'nidrāṃ bhagavatīṃ viṣṇoḥ', hindi: 'भगवान् विष्णु की योगनिद्रा स्वरूपा भगवती', english: 'Goddess Yoganidra of Lord Vishnu' },
      { sanskrit: 'त्वं स्वाहा त्वं स्वधा', iast: 'tvaṃ svāhā tvaṃ svadhā', hindi: 'आप ही स्वाहा हैं, आप ही स्वधा हैं', english: 'You alone are Svaha and Svadha' },
      { sanskrit: 'वषट्कारः स्वरात्मिका', iast: 'vaṣaṭkāraḥ svarātmikā', hindi: 'आप ही वषट्कार और स्वरों की आत्मा हैं', english: 'You are Vashatkara and the soul of all sound' },
      { sanskrit: 'त्रिधा मात्रात्मिका स्थिता', iast: 'tridhā mātrātmikā sthitā', hindi: 'आप ही प्रणव (ॐ) की तीन मात्राओं (अ, उ, म्) रूप में स्थित हैं', english: 'You abide as the three measures of Pranava (A, U, M)' },
      { sanskrit: 'अर्धमात्रा स्थिता नित्या', iast: 'ardhamātrā sthitā nityā', hindi: 'आप ही अनिर्वचनीय नित्य अर्धमात्रा (नाद-बिन्दु) हैं', english: 'You are the eternal transcendent half-measure (Ardhamatra)' },
      { sanskrit: 'महाविद्या महामाया', iast: 'mahāvidyā mahāmāyā', hindi: 'आप ही परम विद्या, महामाया और महान् स्मृति हैं', english: 'You are Supreme Wisdom, Mahamaya, and Cosmic Memory' },
    ],
    hindiMeaning: 'ब्रह्मा जी ने योगनिद्रा की स्तुति करते हुए कहा: हे विश्वेश्वरी! आप ही जगत् को धारण करने वाली, स्थिति और संहार करने वाली पराशक्ति हैं। आप ही स्वाहा, स्वधा और वषट्कार हैं। आप ही ओंकार (ॐ) की तीन मात्राएँ (अकार, उकार, मकार) और परम नित्य, अनिर्वचनीय अर्धमात्रा हैं। आप ही सन्ध्या, सावित्री और परम जननी हैं। आप ही इस सम्पूर्ण चराचर जगत् को धारण करती हैं, रचती हैं, इसका पालन करती हैं और अंत में सबको अपने भीतर समेट लेती हैं। हे महादेवी! आप ही महाविद्या, महामाया, महामेधा और महेश्वरी हैं।',
    englishMeaning: 'Lord Brahma prayed to Goddess Yoganidra: You are the sovereign Ruler of the universe, the Mother who sustains all creation, and the primordial cause of cosmic subsistence and dissolution. You are Svaha, You are Svadha, and You are the sacred utterance Vashatkara. In the imperishable Pranava (Om), You abide as the three syllables (A, U, M) and as the transcendent, unutterable half-measure (Ardhamatra). You are the sacred twilight contemplation (Sandhya), You are Savitri, and You are the supreme Mother. By You alone is this cosmos upheld, by You is it created, by You is it nurtured, and by You is it drawn back at the close of time. You are Mahavidya, Mahamaya, supreme memory, and the sovereign Goddess Maheshvari.',
    significance: 'The Tantroktam Ratri Suktam is the mystical invocation uttered by Lord Brahma when the universe was inundated in the causal ocean (Pralaya) and the demons Madhu and Kaitabha arose to slay Him. Brahma praised Mahamaya (Yoganidra) to release Her gentle slumber over Lord Vishnu so that the Preserver could awake and establish cosmic dharma. It illuminates how even the cosmic architects depend entirely upon Divine Consciousness.',
    significanceHi: 'तन्त्रोक्तं रात्रिसूक्तम् प्रलयकाल में ब्रह्मा जी द्वारा भगवान् विष्णु के नेत्रों में स्थित योगनिद्रा की स्तुति है। जब मधु और कैटभ नामक असुरों ने ब्रह्मा जी पर आक्रमण किया, तब ब्रह्मा जी ने इस स्तुति द्वारा महामाया को प्रसन्न कर भगवान् विष्णु को जाग्रत करने की प्रार्थना की थी। यह स्तोत्र चित्त के अज्ञान और तमस को दूर कर अंतरात्मा को जाग्रत करने वाला सिद्ध स्तोत्र है।',
    faqs: [
      {
        question: 'What is the scriptural origin of the Tantroktam Ratri Suktam?',
        answer: 'It originates from the First Chapter of the Devi Mahatmya (Durga Saptashati) in the Markandeya Purana, where Lord Brahma praises Goddess Yoganidra.',
      },
      {
        question: 'How does Tantroktam Ratri Suktam differ from the Rigvedic Ratri Suktam?',
        answer: 'The Rigvedic Ratri Suktam (Rigveda 10.127) is the ancient Vedic hymn to the cosmic Night (Ratri). The Tantroktam Ratri Suktam is Brahma\'s profound hymn to Yoganidra/Mahamaya from the Puranic tradition. Both are traditionally recited in the Chandi Path.',
      },
    ],
  },
  {
    id: 'navagraha-stotram',
    slug: 'navagraha-stotram',
    title: 'Navagraha Stotram',
    titleHi: 'नवग्रह स्तोत्रम्',
    sanskrit: `ॐ सूर्यादि-नवग्रह-स्तोत्रम्

॥ अथ सूर्य ध्यानम् ॥
जपाकुसुमसंकाशं काश्यपेयं महाद्युतिम् ।
तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥ 1 ॥

॥ अथ चन्द्र ध्यानम् ॥
दधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम् ।
नमामि शशिनं सोमं शम्भोर्मुकुटभूषणम् ॥ 2 ॥

॥ अथ मङ्गल ध्यानम् ॥
धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम् ।
कुमारं शक्तिहस्तं च मङ्गलं प्रणमाम्यहम् ॥ 3 ॥

॥ अथ बुध ध्यानम् ॥
प्रियङ्गुकलिकाश्यामं रूपेणाप्रतिमं बुधम् ।
सौम्यं सौम्यगुणोपेतं तं बुधं प्रणमाम्यहम् ॥ 4 ॥

॥ अथ गुरु ध्यानम् ॥
देवानां च ऋषीणां च गुरुं काञ्चनसंनिभम् ।
बुद्धिभूतं त्रिलोकेशं तं नमामि बृहस्पतिम् ॥ 5 ॥

॥ अथ शुक्र ध्यानम् ॥
हिमकुन्दमृणालाभं दैत्यानां परमं गुरुम् ।
सर्वशास्त्रप्रवक्तारं भार्गवं प्रणमाम्यहम् ॥ 6 ॥

॥ अथ शनि ध्यानम् ॥
नीलाञ्जनसमाभासं रविपुत्रं यमाग्रजम् ।
छायामार्तण्डसम्भूतं तं नमामि शनैश्चरम् ॥ 7 ॥

॥ अथ राहु ध्यानम् ॥
अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम् ।
सिंहिकागर्भसम्भूतं तं राहुं प्रणमाम्यहम् ॥ 8 ॥

॥ अथ केतु ध्यानम् ॥
पलाशपुष्पसंकाशं तारकाग्रहमस्तकम् ।
रौद्रं रौद्रात्मकं घोरं तं केतुं प्रणमाम्यहम् ॥ 9 ॥

॥ अथ फलश्रुति ॥
इति व्यासमुखोद्गीतं यः पठेत् सुसमाहितः ।
दिवा वा यदि वा रात्रौ विघ्नशान्तिर्भविष्यति ॥ 10 ॥
नरनारीनृपाणां च भवेद् दुःस्वप्ननाशनम् ।
ऐश्वर्यमतुलं तेषामारोग्यं पुष्टिवर्धनम् ॥ 11 ॥`,
    transliteration: `oṃ sūryādi-navagraha-stotram

|| atha sūrya dhyānam ||
japākusumasaṃkāśaṃ kāśyapeyaṃ mahādyutim |
tamo'riṃ sarvapāpaghnaṃ praṇato'smi divākaram || 1 ||

|| atha candra dhyānam ||
dadhiśaṅkhatuṣārābhaṃ kṣīrodārṇavasambhavam |
namāmi śaśinaṃ somaṃ śambhormukuṭabhūṣaṇam || 2 ||

|| atha maṅgala dhyānam ||
dharaṇīgarbhasambhūtaṃ vidyutkāntisamaprabham |
kumāraṃ śaktihastaṃ ca maṅgalaṃ praṇamāmyaham || 3 ||

|| atha budha dhyānam ||
priyaṅgukalikāśyāmaṃ rūpeṇāpratimaṃ budham |
saumyaṃ saumyaguṇopetaṃ taṃ budhaṃ praṇamāmyaham || 4 ||

|| atha guru dhyānam ||
devānāṃ ca ṛṣīṇāṃ ca guruṃ kāñcanasaṃnibham |
buddhibhūtaṃ trilokeśaṃ taṃ namāmi bṛhaspatim || 5 ||

|| atha śukra dhyānam ||
himakundamṛṇālābhaṃ daityānāṃ paramaṃ gurum |
sarvaśāstrapravaktāraṃ bhārgavaṃ praṇamāmyaham || 6 ||

|| atha śani dhyānam ||
nīlāñjanasamābhāsaṃ raviputraṃ yamāgrajam |
chāyāmārtaṇḍasambhūtaṃ taṃ namāmi śanaiścaram || 7 ||

|| atha rāhu dhyānam ||
ardhakāyaṃ mahāvīryaṃ candrādityavimardanam |
siṃhikāgarbhasambhūtaṃ taṃ rāhuṃ praṇamāmyaham || 8 ||

|| atha ketu dhyānam ||
palāśapuṣpasaṃkāśaṃ tārakāgrahamastakam |
raudraṃ raudrātmakaṃ ghoraṃ taṃ ketuṃ praṇamāmyaham || 9 ||

|| atha phalaśruti ||
iti vyāsamukhodgītaṃ yaḥ paṭhet susamāhitaḥ |
divā vā yadi vā rātrau vighnaśāntirbhaviṣyati || 10 ||
naranārīnṛpāṇāṃ ca bhaved duḥsvapnanāśanam |
aiśvaryamatulaṃ teṣāmārogyaṃ puṣṭivardhanam || 11 ||`,
    category: 'stotra',
    categoryLabel: 'Navagraha Stotra',
    categoryLabelHi: 'नवग्रह स्तोत्र पाठ',
    rishi: 'महर्षि वेदव्यास (Maharshi Veda Vyasa)',
    devata: 'नवग्रह मण्डल (Nine Celestial Regents)',
    chhandas: 'अनुष्टुप् (Anushtup)',
    source: 'Brahmanda Purana / Navagraha Smriti',
    sourceCoordinates: 'Maharshi Veda Vyasa Virachitam Navagraha Stotram, Shlokas 1–11',
    sourceHref: '/panchang/varas/',
    wordMeanings: [
      {
        sanskrit: 'जपाकुसुमसंकाशं काश्यपेयम्',
        iast: 'japākusumasaṃkāśaṃ kāśyapeyam',
        hindi: 'जपा (गुड़हल) के पुष्प के समान लाल कान्ति वाले, महर्षि कश्यप के पुत्र सूर्यदेव',
        english: 'Resplendent like the red hibiscus flower, born of Sage Kashyapa',
      },
      {
        sanskrit: 'तमोऽरिं सर्वपापघ्नं दिवाकरम्',
        iast: 'tamo\'riṃ sarvapāpaghnaṃ divākaram',
        hindi: 'अन्धकार के शत्रु, समस्त पापों का नाश करने वाले तथा दिन को रचने वाले सूर्यदेव',
        english: 'The vanquisher of darkness, destroyer of all sins, the creator of daylight',
      },
      {
        sanskrit: 'दधिशङ्खतुषाराभं क्षीरोदार्णवसम्भवम्',
        iast: 'dadhiśaṅkhatuṣārābhaṃ kṣīrodārṇavasambhavam',
        hindi: 'दही, शंख और हिम के समान शीतल श्वेत आभा वाले तथा क्षीरसागर मंथन से प्रकट चन्द्रमा',
        english: 'Possessing the serene white hue of curd, conch, and snow, born from the Ocean of Milk',
      },
      {
        sanskrit: 'शशिनं सोमं शम्भोर्मुकुटभूषणम्',
        iast: 'śaśinaṃ somaṃ śambhormukuṭabhūṣaṇam',
        hindi: 'चन्द्रमा सोमदेव, जो भगवान् सदाशिव के मस्तक का पावन मुकुट-आभूषण हैं',
        english: 'Soma (the Moon), who shines as the crest jewel upon Lord Shiva\'s crown',
      },
      {
        sanskrit: 'धरणीगर्भसम्भूतं विद्युत्कान्तिसमप्रभम्',
        iast: 'dharaṇīgarbhasambhūtaṃ vidyutkāntisamaprabham',
        hindi: 'पृथ्वी माता के गर्भ से प्रकट, तड़ित् (बिजली) के समान चमकीले तेज वाले मङ्गल देव',
        english: 'Born from the womb of Mother Earth, radiating brilliance like lightning flashes',
      },
      {
        sanskrit: 'कुमारं शक्तिहस्तं च मङ्गलम्',
        iast: 'kumāraṃ śaktihastaṃ ca maṅgalam',
        hindi: 'सदा तेजस्वी युवा स्वरूप और हाथ में ‘शक्ति’ आयुध धारण करने वाले मङ्गल ग्रह',
        english: 'Youthful and valiant, bearing the divine lance (Shakti) in his hand',
      },
      {
        sanskrit: 'प्रियङ्गुकलिकाश्यामं सौम्यगुणोपेतम्',
        iast: 'priyaṅgukalikāśyāmaṃ saumyaguṇopetam',
        hindi: 'प्रियंगु की कली के समान श्यामल-हरित कान्ति वाले तथा शान्त व कल्याणकारी गुणों से युक्त बुधदेव',
        english: 'Having the dark emerald glow of priyangu buds, endowed with gentle and benign qualities',
      },
      {
        sanskrit: 'देवानां च ऋषीणां च गुरुं बुद्धिभूतम्',
        iast: 'devānāṃ ca ṛṣīṇāṃ ca guruṃ buddhibhūtam',
        hindi: 'समस्त देवताओं एवं महर्षियों के परम गुरु, साक्षात् बुद्धि एवं विवेक के स्वरूप बृहस्पति',
        english: 'The preceptor of deities and sages, the personification of supreme wisdom and intellect',
      },
      {
        sanskrit: 'हिमकुन्दमृणालाभं सर्वशास्त्रप्रवक्तारम्',
        iast: 'himakundamṛṇālābhaṃ sarvaśāstrapravaktāram',
        hindi: 'बर्फ, कुन्द पुष्प और कमल-नाल जैसे धवल कान्ति वाले, समस्त शास्त्रों के अद्वितीय वक्ता शुक्राचार्य',
        english: 'Radiant like snow, white kunda blossoms, and lotus fibres, the master expositor of all sacred lores',
      },
      {
        sanskrit: 'नीलाञ्जनसमाभासं छायामार्तण्डसम्भूतम्',
        iast: 'nīlāñjanasamābhāsaṃ chāyāmārtaṇḍasambhūtam',
        hindi: 'नीले काजल के समान कान्ति वाले, सूर्यदेव और माता छाया के पुत्र शनैश्चर',
        english: 'Luminous like dark blue collyrium, born of Surya and Mother Chhaya, Lord Saturn',
      },
      {
        sanskrit: 'अर्धकायं चन्द्रादित्यविमर्दनम्',
        iast: 'ardhakāyaṃ candrādityavimardanam',
        hindi: 'आधे शरीर वाले, अपनी छाया शक्ति से सूर्य और चन्द्रमा का ग्रहण करने वाले राहु',
        english: 'Possessing half a body of vast strength, the shadow force capable of subduing Sun and Moon',
      },
      {
        sanskrit: 'पलाशपुष्पसंकाशं तारकाग्रहमस्तकम्',
        iast: 'palāśapuṣpasaṃkāśaṃ tārakāgrahamastakam',
        hindi: 'पलाश के लाल पुष्प जैसी आभा वाले, नक्षत्रों और ग्रहों के ध्वज-शिरोमणि केतु',
        english: 'Resplendent like red palasha blossoms, the fiery crest-point of celestial bodies',
      },
      {
        sanskrit: 'व्यासमुखोद्गीतं विघ्नशान्तिर्भविष्यति',
        iast: 'vyāsamukhodgītaṃ vighnaśāntirbhaviṣyati',
        hindi: 'महर्षि वेदव्यास के मुख से उद्भूत इस स्तोत्र का पाठ करने से समस्त विघ्नों की शान्ति होती है',
        english: 'Sung by Maharshi Vyasa; reciting it pacifies all obstacles and brings boundless health and vitality',
      },
    ],
    hindiMeaning: 'महर्षि वेदव्यास द्वारा विरचित नवग्रह स्तोत्र में नौ आकाशीय ग्रहों की पावन स्तुति की गई है: 1. गुड़हल के पुष्प जैसे लाल, महर्षि कश्यप के पुत्र, अन्धकार के शत्रु और समस्त पापों का नाश करने वाले सूर्यदेव को मैं प्रणाम करता हूँ। 2. दही, शंख और हिम के समान धवल, क्षीरसागर मंथन से प्रकट और भगवान् शिव के मस्तक के आभूषण चन्द्रमा को मेरा नमन। 3. पृथ्वी माता के गर्भ से उत्पन्न, बिजली जैसी प्रभा वाले और शक्ति-अस्त्र धारी मङ्गल को मैं प्रणाम करता हूँ। 4. प्रियंगु की कली जैसे श्यामल-हरित, अनुपम सौन्दर्य वाले और सौम्य गुणों से युक्त बुधदेव को मेरा नमन। 5. देवताओं और ऋषियों के गुरु, स्वर्ण-कान्ति वाले और बुद्धि-स्वरूप बृहस्पति को मैं प्रणाम करता हूँ। 6. बर्फ और कुन्द पुष्प के समान श्वेत, समस्त शास्त्रों के ज्ञाता भृगु-पुत्र शुक्राचार्य को मेरा प्रणाम। 7. नीले काजल जैसी कान्ति वाले, सूर्य-पुत्र और यमराज के ज्येष्ठ भ्राता शनिदेव को मेरा नमन। 8. आधे शरीर वाले, महापराक्रमी और सिंहिका-पुत्र राहु को मेरा प्रणाम। 9. पलाश-पुष्प जैसे और नक्षत्रों में शिरोमणि केतु को मैं प्रणाम करता हूँ। जो मनुष्य एकाग्रचित्त होकर व्यास जी के इस स्तोत्र का पाठ करता है, उसके दिन-रात के सभी विघ्न शान्त हो जाते हैं, दुःस्वप्न दूर होते हैं और अतुल ऐश्वर्य, आरोग्य व पुष्टि प्राप्त होती है।',
    englishMeaning: 'Composed by Maharshi Veda Vyasa, the Navagraha Stotram is the sacred cosmic salutation to the nine planetary regents: 1. To Surya: Resplendent as the red hibiscus flower, born of Sage Kashyapa, vanquisher of darkness, and remover of all sins, I bow to the creator of daylight. 2. To Chandra: Luminous like curd, conch, and snow, born from the churning of the Ocean of Milk, and adorning Lord Shiva\'s crest, I bow to the Moon. 3. To Mangala: Born from the womb of Mother Earth, shining with the brilliance of lightning, youthful and holding the divine lance, I bow to Mars. 4. To Budha: Dark-hued like the priyangu blossom, of peerless form, gentle and endowed with serene virtues, I bow to Mercury. 5. To Brihaspati: Preceptor of gods and sages, golden in radiance, the embodiment of wisdom, ruler of the three worlds, I bow to Jupiter. 6. To Shukra: Pure white like snow, kunda blossoms, and lotus stalks, spiritual guide of the Daityas, master of all sacred sciences, I bow to Bhrigu\'s son. 7. To Shani: Radiant like dark blue collyrium, son of Surya and Chhaya, elder brother of Yama, I bow to the slow-moving Saturn. 8. To Rahu: Of half-body yet immense valor, capable of subduing the Sun and Moon, born of Simhika, I bow to Rahu. 9. To Ketu: Reddish like palasha flowers, crest of the starry host, fierce and potent, I bow to Ketu. Whoever recites this hymn composed by Vyasa with a focused mind, by day or by night, will find all obstacles pacified, nightmares dispelled, and will attain matchless abundance, health, and vitality.',
    significance: 'The Navagraha Stotram is the quintessential Vedic hymn for cosmic harmony and planetary peace (Graha Shanti). According to Vedic wisdom, the nine celestial bodies are not arbitrary physical masses but cosmic functionaries (Karmaphala-datri devatas) reflecting a seeker\'s own accumulated karma. By reciting these nine verses composed by Maharshi Vyasa, a practitioner transforms discordant planetary vibrations into spiritual grace—awakening Surya\'s vitality, Chandra\'s emotional equanimity, Mangala\'s righteous courage, Budha\'s discernment, Brihaspati\'s higher wisdom, Shukra\'s refinement, Shani\'s profound endurance, Rahu\'s unconventional insight, and Ketu\'s transcendent detachment.',
    significanceHi: 'नवग्रह स्तोत्र सनातन परम्परा का सर्वाधिक प्रमाणिक और प्रभावशाली ग्रह-शान्ति पाठ है। महर्षि वेदव्यास ने महाभारत और पुराणों की रचना के पश्चात् जीवात्मा के प्रारब्ध कर्मों और आकाशीय शक्तियों के सन्तुलन हेतु यह स्तोत्र प्रकट किया। वैदिक ज्योतिष में नौ ग्रह वास्तव में मनुष्य के संचित और क्रियमाण कर्मों के फलप्रदाता आकाशीय दूत हैं। जब कोई साधक इस स्तोत्र का पाठ करता है, तो ग्रहों के प्रतिकूल प्रभाव शान्त होते हैं तथा उनके सात्त्विक गुणों (जैसे सूर्य का आत्मबल, चन्द्र की मानसिक शान्ति, मङ्गल का धैर्य, बुध का विवेक, गुरु का ज्ञान, शुक्र का सौन्दर्य, शनि का अनुशासन, राहु की अन्वेषण शक्ति और केतु का वैराग्य) का जीवन में उदय होता है।',
    faqs: [
      {
        question: 'Who composed the Navagraha Stotram and what is its scriptural context?',
        answer: 'The Navagraha Stotram was composed by Maharshi Veda Vyasa, the compiler of the Vedas and author of the Mahabharata and Puranas, as a universal prayer for cosmic peace and planetary harmony.',
      },
      {
        question: 'What are the best times and methods for reciting the Navagraha Stotram?',
        answer: 'It is ideally chanted during Brahma Muhurta, at sunrise (Surya Udaya), or during evening twilight (Sandhya). It can be recited daily for general well-being, or on specific weekdays corresponding to individual planets for targeted Graha Shanti.',
      },
      {
        question: 'How does the Navagraha Stotram relate to the Panchanga and 7 Varas?',
        answer: 'The seven primary planetary regents govern the seven days of the Vedic week (Ravivara to Shanivara), while Rahu and Ketu govern the north and south lunar nodes that mark eclipses. Reciting this hymn harmonizes the five limbs of Panchanga with the seeker\'s daily spiritual journey.',
      },
      {
        question: 'Can this stotra be recited without an astrological horoscope (kundali)?',
        answer: 'Yes. Maharshi Vyasa composed this stotra with universal goodwill (Sarva-hita). Reciting it with reverence benefits every individual, providing peace of mind, dispelling nightmares, and shielding against negative atmospheric and psychological influences.',
      },
    ],
  },
  {
    id: 'dakshinamurthy-stotram',
    slug: 'dakshinamurthy-stotram',
    title: 'Dakshinamurthy Stotram',
    titleHi: 'दक्षिणामूर्ति स्तोत्रम्',
    sanskrit: `॥ ध्यानम् ॥
ॐ मौनव्याख्याप्रकटितपरब्रह्मतत्त्वं युवानं
वर्षिष्ठांतेवसद्दृषिगणैरावृतं ब्रह्मनिष्ठैः ।
आचार्येन्द्रं करकलितचिन्मुद्रमानन्दमूर्तिं
स्वात्मारामं मुदितवदनं दक्षिणामूर्तिमीडे ॥

॥ मूल स्तोत्रम् ॥
विश्वं दर्पणदृश्यमाननगरीतुल्यं निजान्तर्गतं
पश्यन्नात्मनि मायया बहिरिवोद्भूतं यथा निद्रया ।
यः साक्षात्कुरुते प्रबोधसमये स्वात्मानमेवाद्वयं
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 1 ॥

बीजस्यान्तरिवाङ्कुरो जगदिदं प्राङ्निर्विकल्पं पुनः
मायाकल्पितदेशकालकलनावैचित्र्यचित्रीकृतम् ।
मायावीव विजृम्भयत्यपि महायोगीव यः स्वेच्छया
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 2 ॥

यस्यैव स्फुरणं सदात्मकमसत्कल्पार्थकं भासते
साक्षात्तत्त्वमसीति वेदवचसा यो बोधयत्याश्रितान् ।
यत्साक्षात्करणाद्भवेन्न पुनरावृत्तिर्भवाम्भोनिधौ
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 3 ॥

नानाछिद्रघटोदरस्थितमहादीपप्रभाभास्वरं
ज्ञानं यस्य तु चक्षुरादिकरणद्वारा बहिः स्पन्दते ।
जानामीति यमेव भान्तमनुभात्येतत्समस्तं जगत्
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 4 ॥

देहं प्राणमपीन्द्रियाण्यपि चलां बुद्धिं च शून्यं विदुः
स्त्रीबालान्धजडोपमास्त्वहमिति भ्रान्ता भृशं वादिनः ।
मायाशक्तिविलासकल्पितमहाव्यामोहसंहारिणे
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 5 ॥

राहुग्रस्तदिवाकरेन्दुसदृशो मायासमाच्छादनात्
सन्मात्रः करणोपसंहरणतो योऽभूत्सुषुप्तः पुमान् ।
प्रागस्वाप्समिति प्रबोधसमये यः प्रत्यभिज्ञायते
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 6 ॥

बाल्यादिष्वपि जाग्रदादिषु तथा सर्वास्ववस्थास्वपि
व्यावृत्तास्वनुवर्तमानमहमित्यन्तः स्फुरन्तं सदा ।
स्वात्मानं प्रकटीकरोति भजतां यो मुद्रया भद्रया
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 7 ॥

विश्वं पश्यति कार्यकारणतया स्वस्वामिसम्बन्धतः
शिष्याचार्यतया तथैव पितृपुत्राद्यात्मना भेदतः ।
स्वप्ने जाग्रति वा य एष पुरुषो मायापरिभ्रामितः
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 8 ॥

भूरम्भांस्यनलोऽनिलोऽम्बरमहर्नाथो हिमांशुः पुमान्
इत्याभाति चराचरात्मकमिदं यस्यैव मूर्त्यष्टकम् ।
नान्यत्किञ्चन विद्यते विमृशतां यस्मात्परस्माद्विभोः
तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये ॥ 9 ॥

सर्वात्मत्वमिति स्फुटीकृतमिदं यस्मादमूष्मिन् स्तवे
तेनास्य श्रवणात्तदर्थमननाद्ध्यानाच्च सङ्कीर्तनात् ।
सर्वात्मत्वमहाविभूतिसहितं स्यादीश्वरत्वं स्वतः
सिद्ध्येत्तत्पुनरष्टधा परिणतं चैश्वर्यमव्याहतम् ॥ 10 ॥`,
    transliteration: `|| dhyānam ||
oṃ maunavyākhyāprakaṭitaparabrahmatattvaṃ yuvānaṃ
varṣiṣṭhāṃtevasaddṛṣigaṇairāvṛtaṃ brahmaniṣṭhaiḥ |
ācāryendraṃ karakalitacinmudramānandamūrtiṃ
svātmārāmaṃ muditavadanaṃ dakṣiṇāmūrtimīḍe ||

|| mūla stotram ||
viśvaṃ darpaṇadṛśyamānanagarītulyaṃ nijāntargataṃ
paśyannātmani māyayā bahirivodbhūtaṃ yathā nidrayā |
yaḥ sākṣātkurute prabodhasamaye svātmānamevādvayaṃ
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 1 ||

bījasyāntarivāṅkuro jagadidaṃ prāṅnirvikalpaṃ punaḥ
māyākalpitadeśakālakalanāvaicitryacitrīkṛtam |
māyāvīva vijṛmbhayatyapi mahāyogīva yaḥ svecchayā
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 2 ||

yasyaiva sphuraṇaṃ sadātmakamasatkalpārthakaṃ bhāsate
sākṣāttattvamasīti vedavacasā yo bodhayatyāśritān |
yatsākṣātkaraṇādbhavenna punarāvṛttirbhavāmbhonidhau
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 3 ||

nānāchidraghaṭodarasthitamahādīpaprabhābhāsvaraṃ
jñānaṃ yasya tu cakṣurādikaraṇadvārā bahiḥ spandate |
jānāmīti yameva bhāntamanubhātyetatsamastaṃ jagat
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 4 ||

dehaṃ prāṇamapīndriyāṇyapi calāṃ buddhiṃ ca śūnyaṃ viduḥ
strībālāndhajaḍopamāstvahamiti bhrāntā bhṛśaṃ vādinaḥ |
māyāśaktivilāsakalpitamahāvyāmohasaṃhāriṇe
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 5 ||

rāhugrastadivākarendusadṛśo māyāsamācchādanāt
sanmātraḥ karaṇopasaṃharaṇato yo'bhūtsuṣuptaḥ pumān |
prāgasvāpsamiti prabodhasamaye yaḥ pratyabhijñāyate
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 6 ||

bālyādiṣvapi jāgradādiṣu tathā sarvāsvavasthāsvapi
vyāvṛttāsvanuvartamānamahamityantaḥ sphurantaṃ sadā |
svātmānaṃ prakaṭīkaroti bhajatāṃ yo mudrayā bhadrayā
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 7 ||

viśvaṃ paśyati kāryakāraṇatayā svasvāmisambandhataḥ
śiṣyācāryatayā tathaiva pitṛputrādyātmanā bhedataḥ |
svapne jāgrati vā ya eṣa puruṣo māyāparibhrāmitaḥ
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 8 ||

bhūrambhāṃsyanalo'nilo'mbaramaharnātho himāṃśuḥ pumān
ityābhāti carācarātmakamidaṃ yasyaiva mūrtyaṣṭakam |
nānyatkiñcana vidyate vimṛśatāṃ yasmātparasmādvibhoḥ
tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye || 9 ||

sarvātmatvamiti sphuṭīkṛtamidaṃ yasmādamūṣmin stave
tenāsya śravaṇāttadarthamananāddhyānācca saṅkīrtanāt |
sarvātmatvamahāvibhūtisahitaṃ syādīśvaratvaṃ svataḥ
siddhyettatpunaraṣṭadhā pariṇataṃ caiśvaryamavyāhatam || 10 ||`,
    category: 'stotra',
    categoryLabel: 'Advaita Vedanta Hymn',
    categoryLabelHi: 'अद्वैत वेदान्त स्तोत्र',
    rishi: 'जगद्गुरु आदि शङ्कराचार्य (Adi Shankaracharya)',
    devata: 'भगवान् दक्षिणामूर्ति (Lord Dakshinamurti / Shiva)',
    chhandas: 'शार्दूलविक्रीडित (Shardulavikridita)',
    source: 'Adi Shankara Stotravali / Advaita Vedanta Tradition',
    sourceCoordinates: 'Dakshinamurti Stotram, Shlokas 1–10 with Dhyana Shloka',
    sourceHref: '/panchang/varas/guruvara/',
    wordMeanings: [
      {
        sanskrit: 'विश्वं दर्पणदृश्यमाननगरीतुल्यं निजान्तर्गतम्',
        iast: 'viśvaṃ darpaṇadṛśyamānanagarītulyaṃ nijāntargatam',
        hindi: 'यह सम्पूर्ण जगत् दर्पण में दिखने वाले प्रतिबिम्बित नगर के समान अपने ही भीतर स्थित है',
        english: 'This entire universe is within oneself, like a city seen reflected within a mirror',
      },
      {
        sanskrit: 'पश्यन्नात्मनि मायया बहिरिवोद्भूतं यथा निद्रया',
        iast: 'paśyannātmani māyayā bahirivodbhūtaṃ yathā nidrayā',
        hindi: 'जो स्वप्न के समान माया के प्रभाव से अपने ही भीतर स्थित जगत् को बाहर प्रकट देखता है',
        english: 'Perceiving through Maya as if existing externally, just as dream objects appear outside',
      },
      {
        sanskrit: 'यः साक्षात्कुरुते प्रबोधसमये स्वात्मानमेवाद्वयम्',
        iast: 'yaḥ sākṣātkurute prabodhasamaye svātmānamevādvayam',
        hindi: 'जो आत्म-जागृति के क्षण में स्वयं को ही अद्वितीय, एकरस आत्मा के रूप में साक्षात् करता है',
        english: 'Who upon awakening directly realizes the Self alone as the non-dual reality',
      },
      {
        sanskrit: 'तस्मै श्रीगुरुमूर्तये नम इदं श्रीदक्षिणामूर्तये',
        iast: 'tasmai śrīgurumūrtaye nama idaṃ śrīdakṣiṇāmūrtaye',
        hindi: 'उन गुरु-स्वरूप भगवान् दक्षिणामूर्ति को मेरा यह पावन नमन है',
        english: 'Salutations unto Him, Lord Dakshinamurti, who embodies the supreme Guru',
      },
      {
        sanskrit: 'बीजस्यान्तरिवाङ्कुरो जगदिदं प्राङ्निर्विकल्पं पुनः',
        iast: 'bījasyāntarivāṅkuro jagadidaṃ prāṅnirvikalpaṃ punaḥ',
        hindi: 'सृष्टि से पूर्व बीज में छिपे अंकुर की तरह यह जगत् अव्यक्त था, जो पुनः विविध रूप में प्रकट हुआ',
        english: 'Like a sprout hidden within a seed, this world was unmanifest before creation',
      },
      {
        sanskrit: 'साक्षात्तत्त्वमसीति वेदवचसा यो बोधयत्याश्रितान्',
        iast: 'sākṣāttattvamasīti vedavacasā yo bodhayatyāśritān',
        hindi: 'जो शरणागत शिष्यों को ‘तत्त्वमसि’ (तुम वही ब्रह्म हो) इस महावाक्य द्वारा जाग्रत करते हैं',
        english: 'Who awakens sincere disciples through the Vedic Mahavakya: "Tat Tvam Asi" (That Thou Art)',
      },
      {
        sanskrit: 'नानाछिद्रघटोदरस्थितमहादीपप्रभाभास्वरम्',
        iast: 'nānāchidraghaṭodarasthitamahādīpaprabhābhāsvaram',
        hindi: 'छिद्रों वाले घड़े में रखे विशाल दीपक के प्रकाश की तरह जिसकी चेतना इन्द्रियों से बाहर निकलती है',
        english: 'Like the radiance of a blazing lamp inside a pot with many holes, shining outward through senses',
      },
      {
        sanskrit: 'जानामीति यमेव भान्तमनुभात्येतत्समस्तं जगत्',
        iast: 'jānāmīti yameva bhāntamanubhātyetatsamastaṃ jagat',
        hindi: 'जिस स्वयंप्रकाश चैतन्य के प्रकाशित होने पर ही यह सम्पूर्ण जगत् प्रकाशित होता है',
        english: 'By whose luminous presence alone this entire universe is illuminated with knowledge',
      },
      {
        sanskrit: 'स्वात्मानं प्रकटीकरोति भजतां यो मुद्रया भद्रया',
        iast: 'svātmānaṃ prakaṭīkaroti bhajatāṃ yo mudrayā bhadrayā',
        hindi: 'जो चिन्मुद्रा (ज्ञानमुद्रा) द्वारा शरणागत भक्तों को आत्म-साक्षात्कार कराते हैं',
        english: 'Who reveals the inner Self to sincere seekers through the auspicious gesture of Cinmudra',
      },
    ],
    hindiMeaning: 'जगद्गुरु आदि शङ्कराचार्य विरचित दक्षिणामूर्ति स्तोत्र अद्वैत वेदान्त का सर्वोच्च स्तोत्र है: 1. जैसे दर्पण में दिखाई देने वाला नगर दर्पण के भीतर ही होता है, वैसे ही यह सम्पूर्ण जगत् आत्मा के भीतर ही स्थित है; किन्तु अज्ञानरूपी माया के कारण यह बाहर प्रतीत होता है। आत्म-ज्ञान होने पर जो अपने अद्वितीय आत्म-स्वरूप का ही साक्षात्कार करते हैं, उन गुरु-स्वरूप भगवान् दक्षिणामूर्ति को मेरा प्रणाम। 2. जैसे बीज के भीतर अंकुर छिपा रहता है, वैसे ही सृष्टि से पूर्व यह जगत् निर्विकल्प रूप में था; जिसे मायावी या महायोगी की भाँति जो अपनी इच्छा से देश-काल के वैचित्र्य में प्रकट करते हैं, उन दक्षिणामूर्ति को नमन। 3. जिनका सत्य स्वरूप ही असत्य जगत् को प्रकाशित करता है और जो ‘तत्त्वमसि’ महावाक्य द्वारा शिष्यों को आत्म-बोध कराते हैं, उन गुरु दक्षिणामूर्ति को प्रणाम। 4. छिद्रों वाले घट में स्थित दीपक के समान जिनका ज्ञान नेत्र आदि इन्द्रियों द्वारा बाहर फैलता है और जिनके प्रकाश से ही सारा संसार प्रकाशित होता है, उन्हें नमन। 5. जो देह, प्राण, इन्द्रिय और बुद्धि को ही आत्मा मानने वाले भ्रान्त वादियों के भ्रम का नाश करते हैं, उन्हें नमन। 6. सुषुप्ति में सब इन्द्रियों के लीन होने पर भी जो शुद्ध सत्ता रूप से विद्यमान रहते हैं और जागने पर ‘मैं सुख से सोया’ इस रूप में पहचाने जाते हैं, उन्हें नमन। 7. बाल्यावस्था, युवावस्था, जाग्रत्, स्वप्न और सुषुप्ति में जो निरन्तर ‘मैं’ रूप से साक्षी बनकर चमकते हैं और चिन्मुद्रा द्वारा आत्मज्ञान कराते हैं, उन्हें नमन। 8. जो संसार को कार्य-कारण, गुरु-शिष्य, पिता-पुत्र के भेद में देखते हैं, वे माया से मोहित हैं; उस अद्वैत स्वरूप दक्षिणामूर्ति को नमन। 9. पृथ्वी, जल, अग्नि, वायु, आकाश, सूर्य, चन्द्रमा और जीवात्मा—ये आठों मूर्तियाँ जिनका ही स्वरूप हैं, उन सर्वव्यापी दक्षिणामूर्ति को प्रणाम। 10. इस स्तोत्र के श्रवण, मनन और ध्यान से साधक को सर्वात्म-भाव और साक्षात् ईश्वरत्व की प्राप्ति होती है।',
    englishMeaning: 'Composed by Jagadguru Adi Shankaracharya, the Dakshinamurti Stotram is the pinnacle hymn of Advaita Vedanta philosophy: 1. Just as a city seen inside a mirror seems to be outside, so this entire universe exists within the Atman, yet appears external through the power of Maya, like a dream. Unto Him who upon awakening directly realizes the non-dual Self alone, to that sacred Teacher Lord Dakshinamurti, I offer my salutations. 2. Like a sprout latent within a seed before sprouting, this universe was unmanifest prior to creation, and then projected into diverse space, time, and causation by the Lord like a master magician or yogi; unto Him, salutations. 3. Unto Him whose radiant existence alone lends reality to the unreal world, and who instructs seekers through the Vedic Mahavakya "Tat Tvam Asi" (That Thou Art), freeing them from the ocean of rebirth. 4. Unto Him whose awareness shines through the senses like a bright lamp within a perforated pot, and by whose light alone the entire universe shines. 5. Unto Him who dispels the delusion of those who mistakenly identify the Self with the physical body, prana, senses, or fleeting intellect. 6. Unto Him who remains as pure presence even in deep dreamless sleep when all senses are withdrawn, and is recognized upon waking as "I slept peacefully." 7. Unto Him who shines unceasingly as the witness "I" through childhood, youth, waking, dreaming, and deep sleep, revealing the Self through the auspicious gesture of Cinmudra. 8. Unto Him who dissolves the illusion of duality (cause and effect, master and servant, teacher and pupil). 9. Unto Him whose eightfold cosmic embodiment encompasses earth, water, fire, air, space, sun, moon, and the conscious individual. 10. By hearing, contemplating, and meditating on this hymn that unveils universal oneness (Sarvatmatva), the seeker attains the supreme divine nature and unhindered spiritual sovereignty.',
    significance: 'The Dakshinamurti Stotram is revered as the ultimate philosophical compendium of Advaita Vedanta in just ten verses. Lord Shiva as Dakshinamurti faces the South (the direction of death and mortality), bestowing immortality through profound silence (Mauna-vyakhya) and the sacred Cinmudra (the index finger touching the thumb, symbolizing the individual soul recognizing its non-dual identity with Brahman). It addresses the four classic Vedantic analogies: the mirror reflection (Darpana), the latent seed (Bija), the light through a perforated pot (Ghata-dipa), and the eclipse (Rahu-grasta).',
    significanceHi: 'दक्षिणामूर्ति स्तोत्र सम्पूर्ण अद्वैत वेदान्त का दस श्लोकों में संकलित महा-ग्रन्थ माना जाता है। भगवान् शिव जब दक्षिणामूर्ति रूप में विराजमान होते हैं, तो वे दक्षिण दिशा (मृत्यु व यम की दिशा) की ओर मुख करके बैठते हैं और मृत्युंजय आत्मज्ञान प्रदान करते हैं। वे मौन व्याख्यान द्वारा शिष्यों के सभी संशयों को समूल नष्ट कर देते हैं। उनके हाथ की चिन्मुद्रा तर्जनी (जीवात्मा) और अङ्गुष्ठ (परमात्मा) के मिलन का प्रतीक है, जो यह प्रकट करती है कि जीव और ब्रह्म में तात्विक रूप से कोई भेद नहीं है।',
    faqs: [
      {
        question: 'What is the theological significance of the name "Dakshinamurti"?',
        answer: 'Dakshinamurti literally means "the Form facing South". In Vedic tradition, South is the direction of Yama (death). By facing south, Lord Shiva reveals the immortal knowledge that transcends physical mortality. It also means the deity of supreme gracious benevolence (Dakshina = capable, gracious, and south-facing).',
      },
      {
        question: 'What is the meaning of the Chinmudra (चिन्मुद्रा) shown by Lord Dakshinamurti?',
        answer: 'Cinmudra is formed by joining the tip of the index finger (symbolizing the individual ego/Jivatman) to the tip of the thumb (symbolizing Supreme Consciousness/Paramatman), while the remaining three fingers stay extended (symbolizing the three gunas or bodies: physical, subtle, and causal). It signifies the transcendent union of the soul with Brahman.',
      },
      {
        question: 'How does Dakshinamurti Stotram relate to Guruvara (Thursday) and Brihaspati?',
        answer: 'Lord Dakshinamurti is revered as the Primordial Jagadguru (Adi Guru) of all sages, including Sanaka, Sanandana, Sanatana, and Sanatsujata. Reciting this stotra on Guruvara (Thursday) invokes preceptor grace and clears mental fog.',
      },
    ],
  },
  {
    id: 'shiva-mahimna-stotram',
    slug: 'shiva-mahimna-stotram',
    title: 'Shiva Mahimna Stotram',
    titleHi: 'शिवमहिम्नः स्तोत्रम्',
    sanskrit: `महिम्नः पारं ते परमविदुषो यद्यसदृशी
स्तुतिर्ब्रह्मादीनामपि तदवसन्नास्त्वयि गिरः ।
अथाऽवाच्यः सर्वः स्वमतिपरिणामावधि गृणन्
ममाप्येष स्तोत्रे हर निरपवादः परिकरः ॥ 1 ॥

अतीतं पन्थानं तव च महिमा वाङ्मनसयोः
अतद्व्यावृत्त्या यं चकितमभिधत्ते श्रुतिरपि ।
स कस्य स्तोतव्यः कतिविधगुणः कस्य विषयः
पदे त्वर्वाचीने पतति न मनः कस्य न वचः ॥ 2 ॥

त्रयी साङ्ख्यं योगः पशुपतिमतं वैष्णवमिति
प्रभिन्ने प्रस्थाने परमिदमदः पथ्यमिति च ।
रुचीनां वैचित्र्यादृजुकुटिलनानापथजुषां
नृणामेको गम्यस्त्वमसि पयसामर्णव इव ॥ 3 ॥

महोक्षः खट्वाङ्गं परशुरजिनं भस्म फणिनः
कपालं चेतीयत्तव वरद तन्त्रोपकरणम् ।
सुरास्तां तामृद्धिं दधति तु भवद्भ्रूप्रणिहितां
न हि स्वात्मारामं विषयमृगतृष्णा भ्रमयति ॥ 4 ॥

असितगिरिसमं स्यात् कज्जलं सिन्धुपात्रे
सुरतरुवरशाखा लेखनी पत्रमुर्वी ।
लिखति यदि गृहीत्वा शारदा सर्वकालं
तदपि तव गुणानामीश पारं न याति ॥ 5 ॥

असुरसुरमुनीन्द्रैरर्चितस्येन्दुमौलेर्-
ग्रथितगुणमहिम्नो निर्गुणस्येश्वरस्य ।
सकलगणवरिष्ठः पुष्पदन्ताभिधानो
रुचिरमलघुवृत्तैः स्तोत्रमेतच्चकार ॥ 6 ॥`,
    transliteration: `mahimnaḥ pāraṃ te paramaviduṣo yadyasadṛśī
stutirbrahmādīnāmapi tadavasannāstvayi giraḥ |
athā'vācyaḥ sarvaḥ svamatipariṇāmāvadhi gṛṇan
mamāpyeṣa stotre hara nirapavādaḥ parikaraḥ || 1 ||

atītaṃ panthānaṃ tava ca mahimā vāṅmanasayoḥ
atadvyāvṛttyā yaṃ cakitamabhidhatte śrutirapi |
sa kasya stotavyaḥ katividhaguṇaḥ kasya viṣayaḥ
pade tvarvīcīne patati na manaḥ kasya na vacaḥ || 2 ||

trayī sāṅkhyaṃ yogaḥ paśupatimataṃ vaiṣṇavamiti
prabhinne prasthāne paramidamadaḥ pathyamiti ca |
rucīnāṃ vaicitryādṛjukuṭilanānāpathajuṣāṃ
nṛṇāmeko gamyastvamasi payasāmarnava iva || 3 ||

mahokṣaḥ khaṭvāṅgaṃ paraśurajinaṃ bhasma phaṇinaḥ
kapālaṃ cetīyattava varada tantropakaraṇam |
surāstāṃ tāmṛddhiṃ dadhati tu bhavadbhrūpraṇihitāṃ
na hi svātmārāmaṃ viṣayamṛgatṛṣṇā bhramayati || 4 ||

asitagirisamaṃ syāt kajjalaṃ sindhupātre
surataruvaraśākhā lekhanī patramurvī |
likhati yadi gṛhītvā śāradā sarvakālaṃ
tadapi tava guṇānāmīśa pāraṃ na yāti || 5 ||

asurasuramunīndrairarcitasyendumEuler-
grathitaguṇamahimno nirguṇasyeśvarasya |
sakalagaṇavariṣṭhaḥ puṣpadantābhidhāno
ruciramalaghuvṛttaiḥ stotrametaccakāra || 6 ||`,
    category: 'stotra',
    categoryLabel: 'Shaiva Devotional Hymn',
    categoryLabelHi: 'शिवमहिम्नः स्तोत्र पाठ',
    rishi: 'गन्धर्वराज पुष्पदन्त (Gandharvaraja Pushpadanta)',
    devata: 'भगवान् सदाशिव (Lord Shiva)',
    chhandas: 'शिखरिणी (Shikharini)',
    source: 'Shaiva Smriti Tradition',
    sourceCoordinates: 'Shiva Mahimna Stotram, Verses 1–6 (Pushpadanta Virachitam)',
    sourceHref: '/panchang/varas/somavara/',
    wordMeanings: [
      {
        sanskrit: 'महिम्नः पारं ते परमविदुषः',
        iast: 'mahimnaḥ pāraṃ te paramaviduṣaḥ',
        hindi: 'आपकी महिमा के पार को न जानने वाले अज्ञानी के लिए',
        english: 'For one who does not know the outer shore or limit of Your infinite glory',
      },
      {
        sanskrit: 'स्तुतिर्ब्रह्मादीनामपि तदवसन्नास्त्वयि गिरः',
        iast: 'stutirbrahmādīnāmapi tadavasannāstvayi giraḥ',
        hindi: 'ब्रह्मा आदि देवताओं की वाणी भी आपकी स्तुति करने में असमर्थ होकर थक जाती है',
        english: 'Even the sublime utterances of Brahma and the gods fall exhausted in praising You',
      },
      {
        sanskrit: 'नृणामेको गम्यस्त्वमसि पयसामर्णव इव',
        iast: 'nṛṇāmeko gamyastvamasi payasāmarnava iva',
        hindi: 'जैसे सभी नदियाँ अंततः समुद्र में ही मिलती हैं, वैसे ही सभी मार्गों के मनुष्यों के एकमात्र प्राप्य आप ही हैं',
        english: 'As all rivers ultimately merge into the one vast ocean, You alone are the final destination of all humans',
      },
      {
        sanskrit: 'त्रयी साङ्ख्यं योगः पशुपतिमतं वैष्णवमिति',
        iast: 'trayī sāṅkhyaṃ yogaḥ paśupatimataṃ vaiṣṇavamiti',
        hindi: 'वेद, सांख्य, योग, पाशुपत और वैष्णव—ये भिन्न-भिन्न प्रस्थान और मत हैं',
        english: 'The three Vedas, Sankhya, Yoga, Pashupata, and Vaishnava doctrines represent diverse pathways',
      },
      {
        sanskrit: 'न हि स्वात्मारामं विषयमृगतृष्णा भ्रमयति',
        iast: 'na hi svātmārāmaṃ viṣayamṛgatṛṣṇā bhramayati',
        hindi: 'जो अपने आत्म-स्वरूप में ही सन्तुष्ट (स्वात्माराम) हैं, उन्हें सांसारिक विषयों की मृगतृष्णा कभी विचलित नहीं कर सकती',
        english: 'For one who delights solely in the inner Self, the mirage of worldly pleasures can never tempt or delude',
      },
      {
        sanskrit: 'असितगिरिसमं स्यात् कज्जलं सिन्धुपात्रे',
        iast: 'asitagirisamaṃ syāt kajjalaṃ sindhupātre',
        hindi: 'यदि काले पर्वत के समान काजल को समुद्र रूपी दवात में घोल लिया जाए',
        english: 'If ink as vast as a black mountain were dissolved in the ocean-sized inkpot',
      },
      {
        sanskrit: 'लिखति यदि गृहीत्वा शारदा सर्वकालम्',
        iast: 'likhati yadi gṛhītvā śāradā sarvakālam',
        hindi: 'और कल्पवृक्ष की शाखा की लेखनी बनाकर स्वयं सरस्वती देवी अनन्तकाल तक लिखें',
        english: 'And Mother Saraswati Herself were to write continuously using the celestial branch as pen',
      },
      {
        sanskrit: 'तदपि तव गुणानामीश पारं न याति',
        iast: 'tadapi tava guṇānāmīśa pāraṃ na yāti',
        hindi: 'तथापि हे ईश्वर! आपके दिव्य गुणों का पार कभी नहीं पाया जा सकता',
        english: 'Even then, O Supreme Lord, the infinite shore of Your divine attributes could never be exhausted',
      },
    ],
    hindiMeaning: 'गन्धर्वराज पुष्पदन्त द्वारा विरचित शिवमहिम्नः स्तोत्र भगवान् शिव की स्तुति का मुकुटमणि है: 1. हे हर! यदि आपकी असीम महिमा को पूर्णतः न जानकर स्तुति करना अनुचित है, तो ब्रह्मा आदि देवताओं की वाणी भी आपके वर्णन में असमर्थ है। जब सभी अपनी-अपनी बुद्धि की सीमा के अनुसार ही आपकी स्तुति करते हैं, तो मेरा यह स्तोत्र-प्रयास भी सर्वथा निर्दोष है। 2. आपकी महिमा मन और वाणी की पहुँच से परे है; वेद भी जिसका वर्णन करने में चकित होकर केवल ‘नेति-नेति’ कहते हैं, उसकी स्तुति कौन कर सकता है? किन्तु आपके सगुण रूप पर किसका मन और वाणी आकर्षित नहीं होते! 3. वेदत्रयी, सांख्य, योग, पाशुपत और वैष्णव—रुचियों के भेद से लोग सीधे या टेढ़े अलग-अलग मार्गों पर चलते हैं; किन्तु जैसे सीधी और टेढ़ी बहने वाली सभी नदियाँ अंत में समुद्र में ही मिलती हैं, वैसे ही सभी मनुष्यों के एकमात्र प्राप्य आप ही हैं। 4. बैल, खट्वांग, कुल्हाड़ी, मृगचर्म, भस्म, सर्प और नर-कपाल—हे वरदाता! आपके पास बाह्य रूप में केवल इतनी ही सामग्री है; फिर भी आपके भ्रूभंग मात्र से देवता समस्त ऐश्वर्य पाते हैं। वास्तव में जो अपने आत्म-स्वरूप में रमण करते हैं, उन्हें सांसारिक विषयों की मृगतृष्णा कभी मोहित नहीं कर सकती। 5. यदि काले पर्वत के बराबर काजल को समुद्र रूपी दवात में घोल लिया जाए, कल्पवृक्ष की शाखा की कलम हो, सम्पूर्ण पृथ्वी कागज हो और स्वयं सरस्वती देवी अनन्तकाल तक लिखें, तब भी हे ईश्वर! आपके गुणों का पार नहीं पाया जा सकता। 6. असुर, देवता और मुनिजनों द्वारा पूजित चन्द्रमौलि भगवान् शिव की इस स्तुति की रचना गन्धर्वराज पुष्पदन्त ने की है।',
    englishMeaning: 'Composed by Gandharvaraja Pushpadanta, the Shiva Mahimna Stotram is among the greatest devotional hymns of the Shaiva tradition: 1. O Hara! If praising You without fully knowing Your infinite greatness is improper, then even the words of Brahma and all celestial sages are inadequate. But if everyone praises You according to the limit of their own understanding, then my humble undertaking in this hymn is blameless. 2. Your glory transcends mind and speech; even the sacred Vedas fall awestruck, speaking only through negation (Neti Neti). Who can comprehend all Your virtues? Yet when You manifest, whose heart and voice are not drawn toward You? 3. The three Vedas, Sankhya, Yoga, the Shaiva system, and Vaishnavism—owing to diverse inclinations, people choose varied pathways, straight or winding; yet You alone are the final goal of all humanity, just as the ocean is the destination of all rivers. 4. An old bull, a staff, an axe, a tiger-skin, holy ash, serpents, and a skull—this is Your humble external paraphernalia, O Bestower of boons! Yet by the mere knitting of Your brows, the gods attain immense prosperity. Indeed, the mirage of sensory pleasure can never tempt one who delights solely in the inner Self. 5. If a mass of black ink as vast as the Himalayas were poured into the cosmic ocean as an inkpot, with the branch of the Parijata tree as pen and the vast earth as paper, and if Mother Saraswati Herself were to write continuously throughout eternity, even then, O Lord, She could never reach the end of Your boundless attributes. 6. Thus did Pushpadanta, chief of the Gandharvas, compose this hymn in melodious metres to Lord Shiva, who is worshipped by gods and sages alike.',
    significance: 'The Shiva Mahimna Stotram is renowned for resolving inter-faith and sectarian conflict through Verse 3 ("Ruceenam vaicitryad... payasam arnava iva"), demonstrating that all genuine spiritual doctrines (Vedic, Sankhya, Yoga, Shaiva, Vaishnava) converge upon the same non-dual Truth, just as all rivers inevitably reach the sea. This verse was famously cited by Swami Vivekananda at the 1893 Parliament of Religions in Chicago to express the universal tolerance of Sanatana Dharma.',
    significanceHi: 'शिवमहिम्नः स्तोत्र का श्लोक 3 (रुचीनां वैचित्र्यादृजुकुटिलनानापथजुषां...) सनातन धर्म की विश्व-बन्धुत्व और सर्वपंथ-समादर की भावना का अमर प्रतीक है। स्वामी विवेकानन्द ने 1893 में शिकागो की विश्व धर्म संसद में अपने ऐतिहासिक भाषण में इसी श्लोक को उद्धृत कर संसार को समझाया था कि जैसे सभी नदियाँ अंत में एक ही महासागर में मिलती हैं, वैसे ही सभी उपासना पद्धतियाँ उसी एक परब्रह्म तक पहुँचती हैं।',
    faqs: [
      {
        question: 'Who composed the Shiva Mahimna Stotram and what is the story behind it?',
        answer: 'It was composed by Gandharvaraja Pushpadanta. Legend recounts that after accidentally stepping on sacred Bilva leaves while invisible in King Chitraratha’s garden, he lost his power of flight. In deep remorse, he praised Lord Shiva with this sublime hymn, whereupon his divine powers and Shiva\'s grace were fully restored.',
      },
      {
        question: 'Which famous verse from Shiva Mahimna Stotram did Swami Vivekananda quote in Chicago?',
        answer: 'Swami Vivekananda quoted Verse 3: "Ruceenam vaicitryad rju-kutila-nana-patha-jusam, nrnam eko gamyas tvam asi payasam arnava iva" ("As the different streams having their sources in different places all mingle their water in the sea, so, O Lord, the different paths which men take through different tendencies, various though they appear, crooked or straight, all lead to Thee").',
      },
      {
        question: 'On what days is reciting the Shiva Mahimna Stotram especially recommended?',
        answer: 'It is traditionally recited on Somavara (Mondays), Pradosha Vratam, Maha Shivaratri, and throughout the holy month of Shravana.',
      },
    ],
  },
  {
    id: 'lalita-sahasranama',
    slug: 'lalita-sahasranama',
    title: 'Lalita Sahasranama Stotram',
    titleHi: 'ललिता सहस्रनाम स्तोत्रम् (ध्यान एवं मूल नाम)',
    sanskrit: `सिन्दूरारुणविग्रहां त्रिनयनां माणिक्यमौलिस्फुरत्-
तारानायकशेखरां स्मितमुखीमापीनवक्षोरुहाम् ।
पाणिभ्यामलिपूर्णरत्नचषकं रक्तोत्पलं बिभ्रतीं
सौम्यां रत्नघटस्थरक्तचरणां ध्यायेत्परामम्बिकाम् ॥ १ ॥

अरुणां करुणातरङ्गिताक्षीं धृतपाशाङ्कुशपुष्पबाणचापाम् ।
अणिमादिभिरावृतां मयूखैरहमित्येव विभावये भवानीम् ॥ २ ॥

सकुङ्कुमविलेपनामलकचुम्बिकस्तूरिकां
समन्दहसितेक्षणां सशरचापपाशाङ्कुशाम् ।
अशेषजनमोहिनीमरुणमाल्यभूषाम्बरां
जपाकुसुमभासुरां जपविधौ स्मरेदम्बिकाम् ॥ ३ ॥

ॐ श्रीमाता श्रीमहाराज्ञी श्रीमत्सिंहासनेश्वरी ।
चिदग्निकुण्डसम्भूता देवकार्यसमुद्यता ॥ १ ॥

उद्यद्भानुसहस्राभा चतुर्बाहुसमन्विता ।
रागस्वरूपपाशाढ्या क्रोधाकाराङ्कुशोज्ज्वला ॥ २ ॥

मनोरूपेक्षुकोदण्डा पञ्चतन्मात्रसायका ।
निजारुणप्रभापूरमज्जद्ब्रह्माण्डमण्डला ॥ ३ ॥

चम्पकाशोकपुन्नागसौगन्धिकलसत्कचा ।
कुरुविन्दमणिश्रेणीकनत्कोटीरमण्डिता ॥ ४ ॥

अष्टमीचन्द्रविभ्राजदलिकस्थलशोभिता ।
मुखचन्द्रकलङ्काभमृगनाभिविशेषका ॥ ५ ॥

वदनस्मरमाङ्गल्यगृहतोरणचिल्लिका ।
वक्त्रलक्ष्मीपरीवाहचलन्मीनाभलोचना ॥ ६ ॥

मन्त्रराजप्रिया मन्त्रराजपूज्या मनोनिशा ।
श्रीमद्वाग्भवकूटैकस्वरूपमुखपङ्कजा ॥
कण्ठाधःकटिपर्यन्तमध्यकूटस्वरूपिणी ।
शक्तिकूटैकतापन्नकट्यधोभागधारिणी ॥

न पुण्यं तस्य सङ्ख्यातुं शक्यते येन तत्कृतम् ।
श्रीललिताललिताख्यानां सहस्रं प्रपठेन्नरः ॥`,
    transliteration: `sindūrāruṇavigrahāṃ trinayanāṃ māṇikyamaulisphurat-
tārānāyakaśekharāṃ smitamukhīmāpīnavakṣoruhām |
pāṇibhyāmalipūrṇaratnacaṣakaṃ raktotpalaṃ bibhratīṃ
saumyāṃ ratnaghaṭastharaktacaraṇāṃ dhyāyetparāmambikām || 1 ||

aruṇāṃ karuṇātaraṅgitākṣīṃ dhṛtapāśāṅkuśapuṣpabāṇacāpām |
aṇimādibhirāvṛtāṃ mayūkhairahamityeva vibhāvaye bhavānīm || 2 ||

sakuṅkumavilepanāmalakacumbikastūrikāṃ
samandahasitekṣaṇāṃ saśaracāpapāśāṅkuśām |
aśeṣajanamohinīmaruṇamālyabhūṣāmbarāṃ
japākusumabhāsurāṃ japavidhau smaredambikām || 3 ||

oṃ śrīmātā śrīmahārājñī śrīmatsiṃhāsaneśvarī |
cidagnikuṇḍasambhūtā devakāryasamudyatā || 1 ||

udyadbhānusahasrābhā caturbāhusamanvitā |
rāgasvarūpapāśāḍhyā krodhākārāṅkuśojjvalā || 2 ||

manorūpekṣukodaṇḍā pañcatanmātrasāyakā |
nijāruṇaprabhāpūramajjadbrahmāṇḍamaṇḍalā || 3 ||

campakāśokapunnāgasaugandhikalasatkacā |
kuruvindamaṇiśreṇīkanatkoṭīramaṇḍitā || 4 ||

aṣṭamīcandravibhrājadalikasthalaśobhitā |
mukhacandrakalaṅkābhamṛganābhiviśeṣakā || 5 ||

vadanasmaramāṅgalyagṛhatoraṇacillikā |
vaktralakṣmīparīvāhacalanmīnābhalocanā || 6 ||

mantrarājapriyā mantrarājapūjyā manoniśā |
śrīmadvāgbhavakūṭaikasvarūpamukhapaṅkajā ||
kaṇṭhādhaḥkaṭiparyantamadhyakūṭasvarūpiṇī |
śaktikūṭaikatāpannakaṭyadhabhāgadhāriṇī ||

na puṇyaṃ tasya saṅkhyātuṃ śakyate yena tatkṛtam |
śrīlalitālalitākhyānāṃ sahasraṃ prapaṭhennaraḥ ||`,
    category: 'stotra',
    categoryLabel: 'Classical Devi Stotra',
    categoryLabelHi: 'भगवती ललिता महात्रिपुरसुन्दरी स्तुति',
    rishi: 'Vashinyadi Vagdevatas (अष्ट वाग्देवता)',
    devata: 'Shri Lalita Maha Tripurasundari (श्रीललिता महात्रिपुरसुन्दरी)',
    chhandas: 'Anushtup (अनुष्टुप्)',
    source: 'Brahmanda Purana (Uttara Khanda)',
    sourceCoordinates: 'Lalita Mahatmya, Dialogue of Bhagavan Hayagriva and Sage Agastya',
    sourceHref: '/panchang/varas/shukravara/',
    wordMeanings: [
      {
        sanskrit: 'सिन्दूरारुणविग्रहाम्',
        iast: 'sindūrāruṇa-vigrahām',
        hindi: 'सिन्दूर के समान प्रातःकालीन लाल (अरुण) वर्ण वाले दिव्य विग्रह वाली',
        english: 'Whose divine form glows with the auspicious crimson hue of dawn and vermilion',
      },
      {
        sanskrit: 'त्रिनयनाम्',
        iast: 'trinayanām',
        hindi: 'तीन नेत्रों (सूर्य, चन्द्र और अग्नि रूपी ज्ञान चक्षुओं) से युक्त',
        english: 'Possessing three eyes representing the Sun, Moon, and Fire (omniscience)',
      },
      {
        sanskrit: 'करुणातरङ्गिताक्षीम्',
        iast: 'karuṇā-taraṅgitākṣīm',
        hindi: 'जिनके नेत्रों में अहैतुकी करुणा और दया की तरङ्गें उमड़ रही हैं',
        english: 'Whose eyes ripple continuously with waves of maternal compassion and grace',
      },
      {
        sanskrit: 'धृतपाशाङ्कुशपुष्पबाणचापाम्',
        iast: 'dhṛta-pāśāṅkuśa-puṣpa-bāṇa-cāpām',
        hindi: 'जिन्होंने अपने चार हाथों में पाश, अङ्कुश, पुष्प-बाण और इक्षु-धनुष धारण किए हैं',
        english: 'Holding in Her four hands the noose, the goad, five flower arrows, and the sugarcane bow',
      },
      {
        sanskrit: 'अहमित्येव विभावये भवानीम्',
        iast: 'ahamityeva vibhāvaye bhavānīm',
        hindi: 'मैं उस पराशक्ति भवानी का अपने आत्मस्वरूप (‘अहं ब्रह्म’) के रूप में ध्यान करता हूँ',
        english: 'I contemplate Mother Bhavani as non-different from my own inner consciousness (Aham)',
      },
      {
        sanskrit: 'श्रीमाता श्रीमहाराज्ञी श्रीमत्सिंहासनेश्वरी',
        iast: 'śrīmātā śrīmahārājñī śrīmatsiṃhāsaneśvarī',
        hindi: 'समस्त ब्रह्माण्ड की परम जननी, साम्राज्येश्वरियों की अधिष्ठात्री और चिन्तामणि सिंहासन पर विराजमान ईश्वरी',
        english: 'The Auspicious Mother of the Cosmos, the Supreme Empress of all realms, and Sovereign of the Divine Throne',
      },
      {
        sanskrit: 'चिदग्निकुण्डसम्भूता देवकार्यसमुद्यता',
        iast: 'cidagni-kuṇḍa-sambhūtā deva-kārya-samudyatā',
        hindi: 'चेतनारूपी पवित्र अग्निकुण्ड से प्रकट होने वाली और देवताओं के कार्य (सद्गुणों की रक्षा) के लिए उद्यत रहने वाली',
        english: 'Arising from the sacrificial fire-pit of pure consciousness (Chidagni) to fulfill the cosmic divine mission',
      },
      {
        sanskrit: 'रागस्वरूपपाशाढ्या क्रोधाकाराङ्कुशोज्ज्वला',
        iast: 'rāga-svarūpa-pāśāḍhyā krodhākārāṅkuśojjvalā',
        hindi: 'जिनका पाश भक्तों के प्रेम (राग) का स्वरूप है और अङ्कुश विवेकपूर्ण नियंत्रण (सत्-क्रोध) का प्रतीक है',
        english: 'Whose noose represents divine love and attachment to truth, and whose goad signifies righteous discernment over impulses',
      },
      {
        sanskrit: 'मनोरूपेक्षुकोदण्डा पञ्चतन्मात्रसायका',
        iast: 'mano-rūpekṣu-kodaṇḍā pañca-tanmātra-sāyakā',
        hindi: 'जिनका ईख (गन्ने) का धनुष मन का प्रतीक है और पाँच पुष्प-बाण शब्द, स्पर्श, रूप, रस, गन्ध रूपी पाँच तन्मात्राओं के प्रतीक हैं',
        english: 'Whose sugarcane bow symbolizes the mind, and whose five flower arrows represent the five subtle senses (tanmatras)',
      },
      {
        sanskrit: 'निजारुणप्रभापूरमज्जद्ब्रह्माण्डमण्डला',
        iast: 'nijāruṇa-prabhāpūra-majjad-brahmāṇḍa-maṇḍalā',
        hindi: 'जिनके अपने दिव्य लाल तेज की बाढ़ में सम्पूर्ण ब्रह्माण्डमण्डल निमग्न हो रहा है',
        english: 'In the inundation of whose radiant red effulgence the entire cosmos is blissfully bathed',
      },
    ],
    hindiMeaning: 'ललिता सहस्रनाम स्तोत्रम् ब्रह्माण्ड पुराण के उत्तरखण्ड में भगवान् हयग्रीव और महर्षि अगस्त्य के पावन संवाद के रूप में प्रतिष्ठित है। इसका गान भगवती ललिता के प्रत्यक्ष आदेश से आठ वाग्देवताओं (वशिनी, कामेश्वरी, मोदिनी, विमला, अरुणा, जयिनी, सर्वेश्वरी, कौलिनी) ने किया था। 1. ध्यान: सिन्दूर के समान लाल कान्ति वाली, तीन नेत्रों से युक्त, मणियों से जड़े मुकुट पर चन्द्रमा धारण करने वाली, मन्द-मन्द मुस्कुराती, हाथों में रत्नों का पात्र और लाल कमल धारण करने वाली परम अम्बिका का हम ध्यान करते हैं। 2. अरुण वर्ण वाली, करुणा की तरङ्गों से भरे नेत्रों वाली, पाश, अङ्कुश, पुष्प-बाण और धनुष धारण करने वाली तथा अणिमा आदि सिद्धियों से घिरी भगवती भवानी का मैं ‘अहम्’ (अपने आत्मस्वरूप) के रूप में ध्यान करता हूँ। 3. श्रीमाता, श्रीमहाराज्ञी, श्रीमत्सिंहासनेश्वरी: वे सम्पूर्ण सृष्टि की स्नेहमयी माता हैं, कोटि-कोटि ब्रह्माण्डों की चक्रवर्ती सम्राज्ञी हैं और श्रीचक्र के मध्य में चिन्तामणि सिंहासन पर विराजमान हैं। वे विशुद्ध चैतन्य रूपी अग्निकुण्ड (चिदग्नि) से प्रकट हुईं और समस्त देवों के संकट हरने तथा भण्डासुर के वध के लिए सन्नद्ध हुईं। 4. उनके चार हाथों के आयुध गहन अध्यात्म के प्रतीक हैं: गन्ने का धनुष ‘मन’ का, पाँच पुष्प-बाण ‘पाँच ज्ञानेन्द्रियों/तन्मात्राओं’ के, पाश ‘प्रेम/राग’ का और अङ्कुश ‘विवेक और वासना-निरोध’ का प्रतीक है। 5. श्रीविद्या और पञ्चदशी मन्त्र के तीन कूट (वाग्भव कूट, कामराज/मध्य कूट और शक्ति कूट) भगवती के मुख, वक्ष और कटि से नीचे के स्वरूप में साक्षात् प्रतिष्ठित हैं। जो श्रद्धालु निष्काम भाव से इस सहस्रनाम का पाठ करता है, उसके संचित पापों का क्षय और पराभक्ति की प्राप्ति होती है।',
    englishMeaning: 'The Lalita Sahasranama Stotram is the crown jewel of Shakta literature, revealed in the Uttara Khanda of the Brahmanda Purana through the sacred dialogue between Lord Hayagriva (the horse-headed incarnation of Vishnu) and Sage Agastya. It was directly composed by the eight Vagdevatas (deities of sacred speech—Vashini, Kameshwari, Modini, Vimala, Aruna, Jayini, Sarveshwari, and Kaulini) at the command of Mother Lalita Herself. 1. Dhyana: We meditate upon the Supreme Mother, glowing crimson like fresh vermilion, three-eyed, Her crown adorned with shining rubies and the crescent moon, Her face graced with a gentle smile, holding in Her hands a jeweled cup and a red lotus, Her lotus feet resting upon a vessel of gems. 2. Contemplation of Non-Duality: I contemplate Mother Bhavani, whose eyes overflow with waves of unconditional compassion, who holds the noose, goad, flower arrows, and sugarcane bow, surrounded by the rays of Anima and other divine perfections, realizing Her as one with my very Self (Aham). 3. The Opening Names: As "Shri Mata" She is the affectionate mother of all creation; as "Shri Maharajni" She is the sovereign empress of infinite universes; and as "Shri Matsimhasaneshvari" She reigns from the wish-fulfilling Chintamani throne at the heart of Sri Yantra. She manifests from the sacrificial fire-pit of pure consciousness (Chidagni) to vanquish ignorance (Bhandasura) and awaken the soul. 4. Symbolic Implements: Her sugarcane bow represents the disciplined mind; Her five flower arrows denote the refined subtle senses (sound, touch, sight, taste, smell); Her noose signifies divine love (raga); and Her goad represents the power of discernment and restraint (krodha channelled into focus). 5. Integral Unity: The three sections (kutas) of the sacred Panchadakshari mantra—Vagbhava, Kamaraja, and Shakti—are physically and spiritually mapped across Her divine face, torso, and lotus feet. Regular, devout recitation dissolves mental afflictions, awakens inner light, and leads to supreme Self-realization.',
    significance: 'In Shakta theology and Srividya tradition, the Lalita Sahasranama is regarded as the ultimate hymn of the Divine Mother. Unlike other stotras composed by human sages, it was authored by the divine Vagdevatas under the direct gaze of Sri Lalita Tripurasundari at the Sri Yantra. Reciting its 1,000 names awakens the Kundalini Shakti through the six chakras, cleanses subconscious karmic impressions, dissolves planetary grief, and nurtures pure devotion and unshakeable inner peace.',
    significanceHi: 'शाक्त दर्शन और श्रीविद्या साधना में ललिता सहस्रनाम का स्थान सर्वोपरि है। यह एकमात्र ऐसा सहस्रनाम है जिसकी रचना स्वयं श्रीललिता महात्रिपुरसुन्दरी के आदेश से अष्ट वाग्देवताओं द्वारा की गई थी। इसके पाठ से षट्चक्रों में कुण्डलिनी शक्ति का जागरण, नकारात्मक मानसिक संस्कारों का शमन और आन्तरिक आनन्द की अनुभूति होती है। शुक्रवार, पूर्णिमा और नवरात्र में इसका पाठ विशेष फलदायी माना गया है।',
    faqs: [
      {
        question: 'What is the origin and scriptural source of the Lalita Sahasranama?',
        answer: 'The Lalita Sahasranama is found in the Uttara Khanda of the Brahmanda Purana. It forms part of the dialogue between Lord Hayagriva and Sage Agastya. It was composed by the eight Vagdevatas (Vashini, Kameshwari, Modini, Vimala, Aruna, Jayini, Sarveshwari, and Kaulini) at the direct command of Goddess Lalita.',
      },
      {
        question: 'What do the four implements held by Goddess Lalita symbolize in Srividya?',
        answer: 'The four implements are deeply symbolic: the sugarcane bow (Ikshu-kodanda) represents the human mind (Manas); the five flower arrows (Pushpa-banas) represent the five subtle senses or perceptions (Tanmatras: sound, touch, sight, taste, smell); the noose (Pasha) represents divine attachment or love (Raga); and the goad (Ankusha) represents wrath against evil and intellectual discernment (Krodha / Viveka).',
      },
      {
        question: 'On what occasions and days is reciting the Lalita Sahasranama especially recommended?',
        answer: 'It is traditionally chanted on Shukravara (Fridays), Purnima (Full Moon nights), all nine days of Sharad and Chaitra Navaratri, Sankranti days, and Janma Nakshatra (birth stars). In South Indian and temple traditions, Friday evening Sahasranama archana with kumkuma is an enduring sacred practice.',
      },
    ],
  },
];

export function getMantraBySlug(slug: string): SacredMantra | undefined {
  return SACRED_MANTRAS.find((m) => m.slug === slug || m.id === slug);
}

