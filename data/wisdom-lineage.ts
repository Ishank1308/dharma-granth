/**
 * Wisdom Lineage Layer (Phase 3).
 * How teachings were transmitted: rishis, acharyas, traditional
 * commentators, bhakti saints, and Vedantic teachers.
 * Editorial summaries only. Scripture remains the authority.
 */

export type LineageKind =
  | 'rishi'
  | 'acharya'
  | 'commentator'
  | 'saint'
  | 'bhakti'
  | 'vedantic';

export interface LineageMaster {
  id: string;
  nameEn: string;
  nameHi: string;
  sanskrit: string;
  kind: LineageKind;
  kindLabelEn: string;
  kindLabelHi: string;
  eraEn: string;
  traditionEn: string;
  teachingEn: string;
  teachingHi: string;
}

export const LINEAGE_KINDS: Record<LineageKind, { en: string; hi: string }> = {
  rishi: { en: 'Rishi', hi: 'ऋषि' },
  acharya: { en: 'Acharya', hi: 'आचार्य' },
  commentator: { en: 'Commentator', hi: 'भाष्यकार' },
  saint: { en: 'Saint', hi: 'संत' },
  bhakti: { en: 'Bhakti master', hi: 'भक्त' },
  vedantic: { en: 'Vedantic teacher', hi: 'वेदान्ती' },
};

export const lineageMasters: LineageMaster[] = [
  {
    id: 'yajnavalkya',
    nameEn: 'Yajnavalkya',
    nameHi: 'याज्ञवल्क्य',
    sanskrit: 'याज्ञवल्क्य',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Upanishadic age',
    traditionEn: 'Brihadaranyaka Upanishad',
    teachingEn: 'Taught “fear arises where a second is perceived”: duality, not circumstance, is the root of fear.',
    teachingHi: 'सिखाया कि “द्वितीयाद्वै भयं भवति” — भय का मूल द्वैत की प्रतीति है, परिस्थिति नहीं।',
  },
  {
    id: 'uddalaka',
    nameEn: 'Uddalaka Aruni',
    nameHi: 'उद्दालक आरुणि',
    sanskrit: 'उद्दालक',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Upanishadic age',
    traditionEn: 'Chandogya Upanishad',
    teachingEn: 'Taught “Tat Tvam Asi”: the Self in the seeker is not separate from the whole.',
    teachingHi: '“तत् त्वम् असि” का उपदेश — साधक का आत्मा समग्र से भिन्न नहीं।',
  },
  {
    id: 'pippalada',
    nameEn: 'Pippalada',
    nameHi: 'पिप्पलाद',
    sanskrit: 'पिप्पलाद',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Upanishadic age',
    traditionEn: 'Prashna Upanishad',
    teachingEn: 'Answered six seekers’ questions on prana, mind, and the Self with patient dialogue.',
    teachingHi: 'प्राण, मन और आत्मा पर छह जिज्ञासुओं के प्रश्नों का धैर्यपूर्वक उत्तर दिया।',
  },
  {
    id: 'vyasa',
    nameEn: 'Krishna Dvaipayana Vyasa',
    nameHi: 'कृष्णद्वैपायन व्यास',
    sanskrit: 'व्यास',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Traditional antiquity',
    traditionEn: 'Mahabharata, Bhagavad Gita',
    teachingEn: 'Compiled the dialogue of Krishna and Arjuna so duty, fear, and grief could be studied together.',
    teachingHi: 'कृष्ण-अर्जुन संवाद का संकलन ताकि कर्तव्य, भय और शोक एक साथ पढ़े जा सकें।',
  },
  {
    id: 'patanjali',
    nameEn: 'Patanjali',
    nameHi: 'पतंजलि',
    sanskrit: 'पतञ्जलि',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Classical age',
    traditionEn: 'Yoga Sutras',
    teachingEn: 'Defined yoga as stilling the turnings of the mind; practice and dispassion steady it.',
    teachingHi: 'योग को चित्तवृत्तियों के निरोध के रूप में कहा; अभ्यास और वैराग्य से मन स्थिर होता है।',
  },
  {
    id: 'valmiki',
    nameEn: 'Valmiki',
    nameHi: 'वाल्मीकि',
    sanskrit: 'वाल्मीकि',
    kind: 'rishi',
    kindLabelEn: 'Rishi',
    kindLabelHi: 'ऋषि',
    eraEn: 'Traditional antiquity',
    traditionEn: 'Ramayana',
    teachingEn: 'Showed dharma through Rama’s conduct under exile, loss, and duty in conflict.',
    teachingHi: 'वनवास, हानि और कर्तव्य-संकट में राम के आचरण से धर्म दिखाया।',
  },
  {
    id: 'shankara',
    nameEn: 'Adi Shankaracharya',
    nameHi: 'आदि शंकराचार्य',
    sanskrit: 'शङ्कराचार्य',
    kind: 'acharya',
    kindLabelEn: 'Acharya',
    kindLabelHi: 'आचार्य',
    eraEn: '8th century CE (traditional)',
    traditionEn: 'Advaita Vedanta, Gita and Upanishad commentaries',
    teachingEn: 'Commented on Gita and Upanishads: the Self is already free; fear ends with Self-knowledge.',
    teachingHi: 'गीता और उपनिषदों पर भाष्य — आत्मा नित्यमुक्त है; आत्मज्ञान से भय समाप्त होता है।',
  },
  {
    id: 'ramanuja',
    nameEn: 'Ramanuja',
    nameHi: 'रामानुज',
    sanskrit: 'रामानुज',
    kind: 'acharya',
    kindLabelEn: 'Acharya',
    kindLabelHi: 'आचार्य',
    eraEn: '11th–12th century CE',
    traditionEn: 'Vishishtadvaita, Gita commentary',
    teachingEn: 'Read the Gita as surrender and devotion: duty offered to the Lord becomes worship.',
    teachingHi: 'गीता को शरणागति और भक्ति से पढ़ा — भगवान को अर्पित कर्तव्य ही उपासना है।',
  },
  {
    id: 'madhva',
    nameEn: 'Madhvacharya',
    nameHi: 'मध्वाचार्य',
    sanskrit: 'मध्व',
    kind: 'acharya',
    kindLabelEn: 'Acharya',
    kindLabelHi: 'आचार्य',
    eraEn: '13th century CE',
    traditionEn: 'Dvaita, Gita commentary',
    teachingEn: 'Emphasized dependence on the Lord with disciplined effort in one’s duty.',
    teachingHi: 'भगवान पर निर्भरता के साथ अपने कर्तव्य में अनुशासित प्रयत्न पर बल।',
  },
  {
    id: 'tulsidas',
    nameEn: 'Tulsidas',
    nameHi: 'तुलसीदास',
    sanskrit: 'तुलसीदास',
    kind: 'saint',
    kindLabelEn: 'Saint',
    kindLabelHi: 'संत',
    eraEn: '16th century CE',
    traditionEn: 'Ramcharitmanas, Bhakti',
    teachingEn: 'Retold Rama’s life for ordinary households: dharma is lived through patience and compassion.',
    teachingHi: 'रामकथा को घर-घर पहुँचाया — धैर्य और करुणा में ही धर्म जीया जाता है।',
  },
  {
    id: 'mirabai',
    nameEn: 'Mirabai',
    nameHi: 'मीराबाई',
    sanskrit: 'मीरा',
    kind: 'bhakti',
    kindLabelEn: 'Bhakti master',
    kindLabelHi: 'भक्त',
    eraEn: '16th century CE',
    traditionEn: 'Krishna Bhakti',
    teachingEn: 'Sang devotion as refuge in grief and social pressure: hold to the Lord alone.',
    teachingHi: 'दुख और सामाजिक दबाव में भक्ति को आश्रय बनाया — एक प्रभु का ही आश्रय।',
  },
  {
    id: 'kabir',
    nameEn: 'Kabir',
    nameHi: 'कबीर',
    sanskrit: 'कबीर',
    kind: 'saint',
    kindLabelEn: 'Saint',
    kindLabelHi: 'संत',
    eraEn: '15th century CE',
    traditionEn: 'Nirguna Bhakti',
    teachingEn: 'Pointed to the inner Lord beyond ritual: attachment to show dissolves devotion.',
    teachingHi: 'बाह्य आडंबर से परे अंतर्यामी की ओर संकेत — दिखावे की आसक्ति भक्ति को क्षीण करती है।',
  },
  {
    id: 'chaitanya',
    nameEn: 'Chaitanya Mahaprabhu',
    nameHi: 'चैतन्य महाप्रभु',
    sanskrit: 'चैतन्य',
    kind: 'bhakti',
    kindLabelEn: 'Bhakti master',
    kindLabelHi: 'भक्त',
    eraEn: '15th–16th century CE',
    traditionEn: 'Gaudiya Bhakti',
    teachingEn: 'Taught devotion as humble chanting and service that softens grief into love.',
    teachingHi: 'विनम्र नाम-स्मरण और सेवा को भक्ति कहा जो शोक को प्रेम में ढाल दे।',
  },
  {
    id: 'ramakrishna',
    nameEn: 'Ramakrishna',
    nameHi: 'रामकृष्ण',
    sanskrit: 'रामकृष्ण',
    kind: 'saint',
    kindLabelEn: 'Saint',
    kindLabelHi: 'संत',
    eraEn: '19th century CE',
    traditionEn: 'Vedanta and Bhakti harmony',
    teachingEn: 'Lived many paths as one truth: sincerity in practice matters more than argument.',
    teachingHi: 'अनेक मार्गों को एक सत्य में जिया — तर्क से अधिक साधना की निष्ठा का महत्व।',
  },
  {
    id: 'ramana',
    nameEn: 'Ramana Maharshi',
    nameHi: 'रमण महर्षि',
    sanskrit: 'रमण',
    kind: 'vedantic',
    kindLabelEn: 'Vedantic teacher',
    kindLabelHi: 'वेदान्ती',
    eraEn: '19th–20th century CE',
    traditionEn: 'Advaita, Self-inquiry',
    teachingEn: 'Taught “Who am I?”: trace fear and grief to the “I” and rest in the Self.',
    teachingHi: '“मैं कौन हूँ?” की साधना — भय और शोक को “मैं” तक ले जाकर आत्मा में विश्राम।',
  },
];

const byId = new Map(lineageMasters.map((m) => [m.id, m]));

export function getLineageMaster(id: string): LineageMaster | undefined {
  return byId.get(id);
}
