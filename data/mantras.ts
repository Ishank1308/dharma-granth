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
];

export function getMantraBySlug(slug: string): SacredMantra | undefined {
  return SACRED_MANTRAS.find((m) => m.slug === slug || m.id === slug);
}

