/**
 * Dharma Granth Typeahead & Direct Jump Engine.
 *
 * Provides real-time ghost text completion (Tab / ArrowRight), trilingual transliteration
 * alignment (Devanagari, IAST, Hinglish), and 1-tap Direct Jump shortcuts for:
 *   1. Action commands (> tanpura, > om, > bell, > meditation, > theme)
 *   2. Scripture & Chapter & Verse citations (Gita 2.47, Katha 1.3.3, etc.)
 *   3. Famous verses & Mahavakyas (कर्मण्येवाधिकारस्ते, तत्त्वमसि, अहं ब्रह्मास्मि, etc.)
 *   4. Core scriptures across the library (Bhagavad Gita, Ramayana, Upanishads, etc.)
 *   5. Sacred Mantras & Stotras (Gayatri, Mahamrityunjaya, Om Namah Shivaya, etc.)
 *   6. Panchang observances (Ekadashi, Pradosha, Purnima, Amavasya, Calendar)
 *   7. Wisdom Pathways (Gita on Fear, Krishna on Duty, Yoga on Mind, etc.)
 *   8. Foundational philosophical concepts & wisdom themes
 */

import { parseDirectCitation } from '@/lib/search-citation';
import { normalizePhonetic } from '@/lib/searchNormalizer';

export interface TypeaheadMatch {
  /** The full text that will replace or complete the input when Tab is pressed */
  completion: string;
  /** Suffix to render right after the typed prefix as ghost text */
  suffix: string;
  /** Human-readable label shown in direct jump banner */
  label: string;
  /** Devanagari or English subtitle */
  subtitle?: string;
  /** Category badge */
  category: 'कमांड' | 'श्लोक' | 'ग्रंथ' | 'अध्याय' | 'दर्शन' | 'विषय' | 'मंत्र' | 'पंचांग' | 'मार्ग';
  /** Direct URL to jump to immediately when user presses Enter or clicks the hero banner */
  directHref?: string;
  /** Emoji or icon badge */
  badge?: string;
}

export interface TrilingualEquivalent {
  devanagari: string;
  iast: string;
  english: string;
  meaning?: string;
}

interface TypeaheadEntry {
  patterns: string[];
  completion: string;
  label: string;
  subtitle?: string;
  category: TypeaheadMatch['category'];
  directHref?: string;
  badge?: string;
  weight?: number;
}

const STATIC_ENTRIES: TypeaheadEntry[] = [
  // ── Actions ────────────────────────────────────────────────────────
  {
    patterns: ['> tan', '> tanpura', '> soun', '> music'],
    completion: '> tanpura',
    label: 'Play Vedic Tanpura Drone (432Hz)',
    subtitle: 'प्रक्रियात्मक 432Hz तन्पूरा नाद',
    category: 'कमांड',
    badge: '🎶',
    weight: 20,
  },
  {
    patterns: ['> om', '> pranav', '> 108'],
    completion: '> om',
    label: 'Play Om Resonance (108Hz)',
    subtitle: 'प्रणव ॐ नाद ध्यान',
    category: 'कमांड',
    badge: '🕉️',
    weight: 20,
  },
  {
    patterns: ['> bell', '> ghanta', '> bowl'],
    completion: '> bell',
    label: 'Ring Mindfulness Singing Bowl',
    subtitle: 'शांति घंटा नाद · Pause & Breathe',
    category: 'कमांड',
    badge: '🔔',
    weight: 20,
  },
  {
    patterns: ['> med', '> meditation', '> dhyan'],
    completion: '> meditation',
    label: 'Start 10-Minute Meditation Timer',
    subtitle: '10 मिनट शांत ध्यान साधना',
    category: 'कमांड',
    badge: '🧘',
    weight: 20,
  },
  {
    patterns: ['> theme', '> dark', '> night', '> light'],
    completion: '> theme',
    label: 'Cycle Visual Theme',
    subtitle: 'दिव्य, ताड़पत्र, निशा व कस्तूरी रंग रूप',
    category: 'कमांड',
    badge: '🎨',
    weight: 20,
  },

  // ── Famous Verses & Mahavakyas ─────────────────────────────────────
  {
    patterns: ['karmanye', 'karmanyeva', 'karmanyevadhikaraste', 'कर्मण्ये', 'कर्मण्येवा', 'कर्मण्येवाधिकारस्ते'],
    completion: 'कर्मण्येवाधिकारस्ते',
    label: 'Bhagavad Gita 2.47 · कर्मण्येवाधिकारस्ते',
    subtitle: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — निष्काम कर्म का मूल मंत्र',
    category: 'श्लोक',
    directHref: '/scripture/bhagavadgita/chapter/2/verse/47/',
    badge: '⚡',
    weight: 30,
  },
  {
    patterns: ['yada yada', 'yada yada hi', 'यदा यदा', 'यदायदा', 'यदा यदा हि धर्मस्य'],
    completion: 'यदा यदा हि धर्मस्य',
    label: 'Bhagavad Gita 4.7 · यदा यदा हि धर्मस्य',
    subtitle: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत — अवतार का प्रयोजन',
    category: 'श्लोक',
    directHref: '/scripture/bhagavadgita/chapter/4/verse/7/',
    badge: '⚡',
    weight: 25,
  },
  {
    patterns: ['sarva dharman', 'sarvadharman', 'सर्वधर्मान्', 'सर्वधर्मान्परित्यज्य'],
    completion: 'सर्वधर्मान्परित्यज्य',
    label: 'Bhagavad Gita 18.66 · सर्वधर्मान्परित्यज्य',
    subtitle: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज — चरम शरणागति',
    category: 'श्लोक',
    directHref: '/scripture/bhagavadgita/chapter/18/verse/66/',
    badge: '⚡',
    weight: 25,
  },
  {
    patterns: ['tat tvam', 'tat tvam asi', 'tattvamasi', 'तत्त्वमसि', 'तत् त्वम् असि'],
    completion: 'तत्त्वमसि (Tat Tvam Asi)',
    label: 'तत्त्वमसि · Chāndogya Upanishad 6.8.7',
    subtitle: 'सामवेद का महावाक्य — तुम वही परम चैतन्य हो',
    category: 'दर्शन',
    directHref: '/concepts/tat-tvam-asi/',
    badge: '✨',
    weight: 25,
  },
  {
    patterns: ['aham brahma', 'aham brahmasmi', 'ahambrahmasmi', 'अहं ब्रह्मा', 'अहं ब्रह्मास्मि'],
    completion: 'अहं ब्रह्मास्मि (Aham Brahmasmi)',
    label: 'अहं ब्रह्मास्मि · Brihadaranyaka 1.4.10',
    subtitle: 'यजुर्वेद का महावाक्य — मैं ही ब्रह्म हूँ',
    category: 'दर्शन',
    directHref: '/concepts/aham-brahmasmi/',
    badge: '✨',
    weight: 25,
  },
  {
    patterns: ['prajnanam brahma', 'प्रज्ञानं ब्रह्म', 'प्रज्ञानम ब्रह्म'],
    completion: 'प्रज्ञानं ब्रह्म (Prajnanam Brahma)',
    label: 'प्रज्ञानं ब्रह्म · Aitareya Upanishad 3.3',
    subtitle: 'ऋग्वेद का महावाक्य — प्रज्ञान ही ब्रह्म है',
    category: 'दर्शन',
    directHref: '/concepts/brahman/',
    badge: '✨',
    weight: 20,
  },
  {
    patterns: ['ayam atma brahma', 'अयमात्मा ब्रह्म'],
    completion: 'अयमात्मा ब्रह्म (Ayam Atma Brahma)',
    label: 'अयमात्मा ब्रह्म · Mandukya Upanishad 1.2',
    subtitle: 'अथर्ववेद का महावाक्य — यह आत्मा ही ब्रह्म है',
    category: 'दर्शन',
    directHref: '/concepts/atman/',
    badge: '✨',
    weight: 20,
  },
  {
    patterns: ['satyameva jayate', 'सत्यमेव जयते', 'सत्यमेव'],
    completion: 'सत्यमेव जयते',
    label: 'सत्यमेव जयते · Mundaka Upanishad 3.1.6',
    subtitle: 'सत्यमेव जयते नानृतम् — सत्य की ही विजय होती है',
    category: 'श्लोक',
    directHref: '/scripture/mundaka/chapter/3/',
    badge: '✨',
    weight: 20,
  },
  {
    patterns: ['yogas chitta', 'yogashchittavrittinirodha', 'योगश्चित्त', 'योगश्चित्तवृत्तिनिरोधः'],
    completion: 'योगश्चित्तवृत्तिनिरोधः',
    label: 'Yoga Sutras 1.2 · योगश्चित्तवृत्तिनिरोधः',
    subtitle: 'चित्त की वृत्तियों का निरोध ही योग है',
    category: 'श्लोक',
    directHref: '/scripture/yogasutra/chapter/1/verse/2/',
    badge: '🧘',
    weight: 25,
  },
  {
    patterns: ['isha vasyam', 'ishavasyamidam', 'ईशा वास्य', 'ईशावास्यमिदं सर्वम्'],
    completion: 'ईशावास्यमिदं सर्वम्',
    label: 'Isha Upanishad 1 · ईशावास्यमिदं सर्वम्',
    subtitle: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत्',
    category: 'श्लोक',
    directHref: '/scripture/ishavasya/chapter/1/verse/1/',
    badge: '✨',
    weight: 25,
  },

  // ── Sacred Mantras & Stotras ───────────────────────────────────────
  {
    patterns: ['om namah', 'om namah shiv', 'om namah shivaya', 'ॐ नमः', 'ॐ नमः शिवाय'],
    completion: 'ॐ नमः शिवाय',
    label: 'ॐ नमः शिवाय · Shiva Panchakshara Mantra',
    subtitle: 'शिव पंचाक्षर महामंत्र — चेतना और लय का सनातन नाद',
    category: 'मंत्र',
    directHref: '/mantras/om-namah-shivaya/',
    badge: '🔱',
    weight: 30,
  },
  {
    patterns: ['gayatri', 'gayatri mantra', 'गायत्री', 'गायत्री मंत्र', 'गायत्री महामंत्र'],
    completion: 'गायत्री महामंत्र',
    label: 'गायत्री महामंत्र · Rigveda 3.62.10',
    subtitle: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम् — प्रज्ञा व सद्बुद्धि की प्रार्थना',
    category: 'मंत्र',
    directHref: '/mantras/gayatri-mantra/',
    badge: '☀️',
    weight: 30,
  },
  {
    patterns: ['maha mrityun', 'mahamrityun', 'mahamrityunjaya', 'महामृत्युंजय', 'मृत्युंजय', 'मृत्युंजय मंत्र'],
    completion: 'महामृत्युंजय मंत्र',
    label: 'महामृत्युंजय मंत्र · Rigveda 7.59.12',
    subtitle: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् — आरोग्य व अमरत्व',
    category: 'मंत्र',
    directHref: '/mantras/mahamrityunjaya/',
    badge: '🌿',
    weight: 30,
  },
  {
    patterns: ['asato ma', 'asato ma sadgamaya', 'असतो मा', 'असतो मा सद्गमय'],
    completion: 'असतो मा सद्गमय',
    label: 'असतो मा सद्गमय · Brihadaranyaka 1.3.28',
    subtitle: 'असतो मा सद्गमय तमसो मा ज्योतिर्गमय मृत्योर्मा अमृतं गमय',
    category: 'मंत्र',
    directHref: '/mantras/asato-ma-sadgamaya/',
    badge: '🪔',
    weight: 25,
  },
  {
    patterns: ['purna madah', 'purnamadah', 'पूर्णमदः', 'पूर्णमदः पूर्णमिदम्'],
    completion: 'पूर्णमदः पूर्णमिदम्',
    label: 'पूर्णमदः पूर्णमिदम् · Isha Shanti Mantra',
    subtitle: 'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते — अनन्त परिपूर्णता',
    category: 'मंत्र',
    directHref: '/mantras/purnamadah/',
    badge: '✨',
    weight: 25,
  },
  {
    patterns: ['sahana vavatu', 'sahanavavatu', 'सह नाववतु'],
    completion: 'सह नाववतु',
    label: 'सह नाववतु · Taittiriya Shanti Patha',
    subtitle: 'सह नाववतु सह नौ भुनक्तु सह वीर्यं करवावहै — विद्या और मैत्री',
    category: 'मंत्र',
    directHref: '/mantras/sahana-vavatu/',
    badge: '🤝',
    weight: 25,
  },
  {
    patterns: ['sarve bhavantu', 'sarve bhavantu sukhinah', 'सर्वे भवन्तु', 'सर्वे भवन्तु सुखिनः'],
    completion: 'सर्वे भवन्तु सुखिनः',
    label: 'सर्वे भवन्तु सुखिनः · Universal Peace Prayer',
    subtitle: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः — विश्व कल्याण की प्रार्थना',
    category: 'मंत्र',
    directHref: '/mantras/sarve-bhavantu-sukhinah/',
    badge: '🕊️',
    weight: 25,
  },
  {
    patterns: ['nirvana shatakam', 'nirvanashatakam', 'मनोबुद्ध्यहंकार', 'निर्वाण षट्कम'],
    completion: 'निर्वाण षट्कम',
    label: 'निर्वाण षट्कम · Adi Shankaracharya',
    subtitle: 'मनोबुद्ध्यहङ्कार चित्तानि नाहम् — शिवोऽहम् शिवोऽहम्',
    category: 'मंत्र',
    directHref: '/mantras/nirvana-shatakam/',
    badge: '🔱',
    weight: 25,
  },
  {
    patterns: ['shiva tandava', 'shivatandava', 'जटाटवीगलज्जल', 'शिव ताण्डव'],
    completion: 'शिव ताण्डव स्तोत्र',
    label: 'शिव ताण्डव स्तोत्र · Ravana Rachitam',
    subtitle: 'जटाटवीगलज्जलप्रवाहपावितस्थले — परम लय व शक्ति',
    category: 'मंत्र',
    directHref: '/mantras/shiva-tandava/',
    badge: '🔱',
    weight: 25,
  },
  {
    patterns: ['purusha sukta', 'purushasukta', 'पुरुष सूक्त'],
    completion: 'पुरुष सूक्त',
    label: 'पुरुष सूक्त · Rigveda 10.90',
    subtitle: 'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् — विराट पुरुष',
    category: 'मंत्र',
    directHref: '/mantras/purusha-sukta/',
    badge: '☀️',
    weight: 25,
  },
  {
    patterns: ['hanuman chalisa', 'chalisa', 'हनुमान चालीसा', 'चालीसा'],
    completion: 'हनुमान चालीसा',
    label: 'श्री हनुमान चालीसा · Goswami Tulsidas',
    subtitle: 'जय हनुमान ज्ञान गुन सागर — 40 चौपाई संकट मोचन',
    category: 'मंत्र',
    directHref: '/mantras/hanuman-chalisa/',
    badge: '🚩',
    weight: 30,
  },
  {
    patterns: ['aditya hridaya', 'adityahridaya', 'आदित्य हृदय', 'आदित्य हृदय स्तोत्र'],
    completion: 'आदित्य हृदय स्तोत्र',
    label: 'आदित्य हृदय स्तोत्र · Valmiki Ramayana Yuddha Kanda',
    subtitle: 'अगस्त्य मुनि प्रणीत — सूर्य देव की विजय प्रदायिनी स्तुति',
    category: 'मंत्र',
    directHref: '/mantras/aditya-hridaya-stotra/',
    badge: '☀️',
    weight: 25,
  },
  {
    patterns: ['shri suktam', 'shrisuktam', 'श्री सूक्त'],
    completion: 'श्री सूक्त',
    label: 'श्री सूक्त · Rigveda Parishishta',
    subtitle: 'हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् — महालक्ष्मी कृपा',
    category: 'मंत्र',
    directHref: '/mantras/shri-suktam/',
    badge: '🪷',
    weight: 25,
  },
  {
    patterns: ['madhurashtakam', 'मधुराष्टकम'],
    completion: 'मधुराष्टकम',
    label: 'मधुराष्टकम · Vallabhacharya',
    subtitle: 'अधरं मधुरं वदनं मधुरं — मधुराधिपतेरखिलं मधुरम्',
    category: 'मंत्र',
    directHref: '/mantras/madhurashtakam/',
    badge: '🪈',
    weight: 20,
  },

  // ── Panchang Observances & Calendar ────────────────────────────────
  {
    patterns: ['panchang', 'panchanga', 'पंचांग', 'दैनिक पंचांग'],
    completion: 'Panchang (दैनिक पंचांग)',
    label: 'दैनिक वैदिक पंचांग (Daily Panchang)',
    subtitle: 'तिथि, वार, नक्षत्र, योग और करण — काल के पाँच पावन अंग',
    category: 'पंचांग',
    directHref: '/panchang/',
    badge: '🌙',
    weight: 30,
  },
  {
    patterns: ['calendar', 'panchang calendar', 'masik', 'मासिक', 'मासिक कैलेंडर'],
    completion: 'Panchang Calendar (मासिक कैलेंडर)',
    label: 'मासिक पंचांग कैलेंडर 2026-2028',
    subtitle: 'व्रत, पर्व, एकादशी, पूर्णिमा व अमावस्या की मासिक तालिका',
    category: 'पंचांग',
    directHref: '/panchang/calendar/',
    badge: '📅',
    weight: 28,
  },
  {
    patterns: ['ekadashi', 'ekadasi', 'एकादशी', 'एकादशी व्रत'],
    completion: 'Ekadashi (एकादशी व्रत)',
    label: 'एकादशी महात्म्य व तिथियाँ (Ekadashi Vrata)',
    subtitle: 'भगवान विष्णु का प्रिय व्रत — आध्यात्मिक शुद्धि व उपवास',
    category: 'पंचांग',
    directHref: '/panchang/ekadashi/',
    badge: '🌸',
    weight: 28,
  },
  {
    patterns: ['pradosh', 'pradosham', 'प्रदोष', 'प्रदोष व्रत'],
    completion: 'Pradosh (प्रदोष व्रत)',
    label: 'प्रदोष व्रत (Pradosha Vrata)',
    subtitle: 'त्रयोदशी तिथि पर शिव-शक्ति की पावन प्रदोष वेला पूजा',
    category: 'पंचांग',
    directHref: '/panchang/pradosh/',
    badge: '🔱',
    weight: 25,
  },
  {
    patterns: ['purnima', 'poornima', 'पूर्णिमा'],
    completion: 'Purnima (पूर्णिमा)',
    label: 'पूर्णिमा व्रत व उत्सव (Purnima)',
    subtitle: 'पूर्ण चंद्र की पावन तिथि — सत्यनारायण कथा व ध्यान',
    category: 'पंचांग',
    directHref: '/panchang/purnima/',
    badge: '🌕',
    weight: 25,
  },
  {
    patterns: ['amavasya', 'amavas', 'अमावस्या'],
    completion: 'Amavasya (अमावस्या)',
    label: 'अमावस्या व पितृ तर्पण (Amavasya)',
    subtitle: 'दर्श अमावस्या — पितृ शांति, दान व आत्म-चिन्तन',
    category: 'पंचांग',
    directHref: '/panchang/amavasya/',
    badge: '🌑',
    weight: 25,
  },
  {
    patterns: ['nakshatra', 'nakshatras', 'नक्षत्र', '27 नक्षत्र'],
    completion: '27 Nakshatras (27 नक्षत्र)',
    label: '27 वैदिक नक्षत्र निर्देशिका (Nakshatras)',
    subtitle: 'अश्विनी से रेवती पर्यन्त — चंद्र नक्षत्र व शुभाशुभ फल',
    category: 'पंचांग',
    directHref: '/panchang/nakshatras/',
    badge: '⭐',
    weight: 25,
  },
  {
    patterns: ['tithi', 'tithis', 'तिथि', '30 तिथियाँ'],
    completion: '30 Tithis (30 तिथियाँ)',
    label: '30 वैदिक तिथियाँ (Lunar Tithis)',
    subtitle: 'प्रतिपदा से पूर्णिमा/अमावस्या तक शुक्ल व कृष्ण पक्ष',
    category: 'पंचांग',
    directHref: '/panchang/tithis/',
    badge: '🌗',
    weight: 25,
  },

  // ── Core Scriptures ────────────────────────────────────────────────
  {
    patterns: ['gita sankalpa', 'gita parayana', 'sankalpa', 'daily gita', 'gita vow', 'गीता संकल्प', 'पारायण'],
    completion: 'gita sankalpa',
    label: 'Bhagavad Gita Daily Sankalpa & Parayana',
    subtitle: 'श्रीमद्भगवद्गीता नित्य स्वाध्याय एवं पारायण संकल्प (18 Chapters & Offline Vow)',
    category: 'मार्ग',
    directHref: '/practice/gita-sankalpa/',
    badge: '📜',
    weight: 36,
  },
  {
    patterns: ['offline gita', 'offline', 'pwa', 'download gita', 'ऑफ़लाइन', 'ऑफ़लाइन गीता'],
    completion: 'offline gita',
    label: 'Offline Gita & Scriptures PWA',
    subtitle: 'संपूर्ण 18 अध्याय ऑफ़लाइन सहेजें (100% Offline Reader)',
    category: 'मार्ग',
    directHref: '/practice/gita-sankalpa/',
    badge: '💾',
    weight: 34,
  },
  {
    patterns: ['gita', 'geeta', 'bhagavad', 'bhagavad gita', 'भगवद्गीता', 'गीता', 'श्रीमद्भगवद्गीता'],
    completion: 'Bhagavad Gita',
    label: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    subtitle: '18 अध्याय · 701 श्लोक — कुरुक्षेत्र का कालजयी संवाद',
    category: 'ग्रंथ',
    directHref: '/scripture/bhagavadgita/',
    badge: '📖',
    weight: 35,
  },
  {
    patterns: ['isha', 'ishavasya', 'ishavasyopanishad', 'ईशा', 'ईशावास्य', 'ईशावास्योपनिषद्'],
    completion: 'Isha Upanishad',
    label: 'ईशावास्योपनिषद् (Isha Upanishad)',
    subtitle: 'शुक्ल यजुर्वेद · 18 मंत्र — ईशा वास्यमिदं सर्वम्',
    category: 'ग्रंथ',
    directHref: '/scripture/ishavasya/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['kena', 'kenopanishad', 'केनोपनिषद्', 'केन'],
    completion: 'Kena Upanishad',
    label: 'केनोपनिषद् (Kena Upanishad)',
    subtitle: 'सामवेद तलवकार · 35 मंत्र — मन और इन्द्रियों का प्रेरक तत्व',
    category: 'ग्रंथ',
    directHref: '/scripture/kena/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['katha', 'kathopanishad', 'कठ', 'कठोपनिषद्'],
    completion: 'Katha Upanishad',
    label: 'कठोपनिषद् (Katha Upanishad)',
    subtitle: 'नचिकेता-यम संवाद · 119 मंत्र — श्रेय और प्रेय का विवेक',
    category: 'ग्रंथ',
    directHref: '/scripture/katha/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['prashna', 'prashnopanishad', 'प्रश्न', 'प्रश्नोपनिषद्'],
    completion: 'Prashna Upanishad',
    label: 'प्रश्नोपनिषद् (Prashna Upanishad)',
    subtitle: 'अथर्ववेद पिप्पलाद संवाद · 6 प्रश्न — प्राण और सृष्टि',
    category: 'ग्रंथ',
    directHref: '/scripture/prashna/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['mundaka', 'mundakopanishad', 'मुण्डक', 'मुण्डकोपनिषद्'],
    completion: 'Mundaka Upanishad',
    label: 'मुण्डकोपनिषद् (Mundaka Upanishad)',
    subtitle: 'अथर्ववेद · 64 मंत्र — परा और अपरा विद्या, सत्यमेव जयते',
    category: 'ग्रंथ',
    directHref: '/scripture/mundaka/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['mandukya', 'mandukyopanishad', 'माण्डूक्य', 'माण्डूक्योपनिषद्'],
    completion: 'Mandukya Upanishad',
    label: 'माण्डूक्योपनिषद् (Mandukya Upanishad)',
    subtitle: '12 सूक्ष्म मंत्र — ॐ के चार पाद (जाग्रत, स्वप्न, सुषुप्ति, तुरीय)',
    category: 'ग्रंथ',
    directHref: '/scripture/mandukya/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['taittiriya', 'taittiriyopanishad', 'तैत्तिरीय', 'तैत्तिरीयोपनिषद्'],
    completion: 'Taittiriya Upanishad',
    label: 'तैत्तिरीयोपनिषद् (Taittiriya Upanishad)',
    subtitle: 'कृष्ण यजुर्वेद · शीक्षा, ब्रह्मानन्द व भृगु वल्ली — पञ्चकोश विवेक',
    category: 'ग्रंथ',
    directHref: '/scripture/taittiriya/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['aitareya', 'aitareyopanishad', 'ऐतरेय', 'ऐतरेयोपनिषद्'],
    completion: 'Aitareya Upanishad',
    label: 'ऐतरेयोपनिषद् (Aitareya Upanishad)',
    subtitle: 'ऋग्वेद · प्रज्ञानं ब्रह्म — चेतना ही सम्पूर्ण सृष्टि का मूल है',
    category: 'ग्रंथ',
    directHref: '/scripture/aitareya/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['chandogya', 'chandogyopanishad', 'छांदोग्य', 'छान्दोग्योपनिषद्'],
    completion: 'Chandogya Upanishad',
    label: 'छान्दोग्योपनिषद् (Chandogya Upanishad)',
    subtitle: 'सामवेद का विशालतम उपनिषद् · 8 प्रपाठक — तत्त्वमसि व उद्गीथ',
    category: 'ग्रंथ',
    directHref: '/scripture/chandogya/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['brihadaranyaka', 'brihad', 'बृहदारण्यक', 'बृहदारण्यकोपनिषद्'],
    completion: 'Brihadaranyaka Upanishad',
    label: 'बृहदारण्यकोपनिषद् (Brihadaranyaka)',
    subtitle: 'याज्ञवल्क्य-मैत्रेयी संवाद · अहं ब्रह्मास्मि, नेति-नेति',
    category: 'ग्रंथ',
    directHref: '/scripture/brihadaranyaka/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['shvetashvatara', 'shvetashvataropanishad', 'श्वेताश्वतर', 'श्वेताश्वतरोपनिषद्'],
    completion: 'Shvetashvatara Upanishad',
    label: 'श्वेताश्वतरोपनिषद् (Shvetashvatara)',
    subtitle: 'कृष्ण यजुर्वेद · 113 मंत्र — भक्ति, योग व परमेश्वर का समन्वय',
    category: 'ग्रंथ',
    directHref: '/scripture/shvetashvatara/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['muktika', 'muktikopanishad', 'मुक्तिका', 'मुक्तिकोपनिषद्'],
    completion: 'Muktika Upanishad',
    label: 'मुक्तिकोपनिषद् (Muktika Upanishad)',
    subtitle: 'श्रीराम-हनुमान संवाद · 108 उपनिषदों की प्रामाणिक सूची',
    category: 'ग्रंथ',
    directHref: '/scripture/muktika/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['ashtavakra', 'ashtavakra gita', 'अष्टावक्र', 'अष्टावक्र गीता', 'अष्टावक्रगीता'],
    completion: 'Ashtavakra Gita',
    label: 'अष्टावक्र गीता (Ashtavakra Gita)',
    subtitle: '20 प्रकरण · 298 श्लोक — परम अद्वैत बोध व मुक्ति',
    category: 'ग्रंथ',
    directHref: '/ashtavakra/',
    badge: '📖',
    weight: 30,
  },
  {
    patterns: ['patanjali', 'yogasutras', 'yoga sutra', 'yoga sutras', 'पातञ्जल', 'योगसूत्र'],
    completion: 'Yoga Sutras of Patanjali',
    label: 'पातञ्जल योगसूत्र (Patanjali Yoga Sutras)',
    subtitle: '4 पाद · 195 सूत्र — समाधि, साधन, विभूति व कैवल्य',
    category: 'ग्रंथ',
    directHref: '/scripture/yogasutra/',
    badge: '🧘',
    weight: 30,
  },
  {
    patterns: ['brahmasutra', 'brahma sutras', 'ब्रह्मसूत्र'],
    completion: 'Brahma Sutras',
    label: 'ब्रह्मसूत्र (Brahma Sutras)',
    subtitle: 'बादरायण प्रणीत — वेदान्त दर्शन का सूत्र ग्रन्थ',
    category: 'ग्रंथ',
    directHref: '/scripture/brahmasutra/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['vivek', 'vivekachudamani', 'विवेक', 'विवेकचूडामणि'],
    completion: 'Vivekachudamani',
    label: 'विवेकचूडामणि (Vivekachudamani)',
    subtitle: 'आदि शंकराचार्य · 580 श्लोक — अद्वैत वेदांत का रत्न',
    category: 'ग्रंथ',
    directHref: '/scripture/vivekchudamani/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['narada bhakti', 'naradabhakti', 'नारद भक्ति', 'भक्ति सूत्र'],
    completion: 'Narada Bhakti Sutras',
    label: 'नारद भक्ति सूत्र (Narada Bhakti Sutras)',
    subtitle: '84 सूत्र — सा पराऽनुरक्तिरीश्वरे · पराभक्ति का दिव्य दर्शन',
    category: 'ग्रंथ',
    directHref: '/scripture/naradabhaktisutra/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['vidura', 'viduraniti', 'विदुर', 'विदुर नीति'],
    completion: 'Vidura Niti',
    label: 'विदुर नीति (Vidura Niti)',
    subtitle: 'महाभारत उद्योगपर्व · 594 श्लोक — व्यावहारिक शासन व धर्म नीति',
    category: 'ग्रंथ',
    directHref: '/scripture/viduraniti/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['ramayana', 'valmiki', 'वाल्मीकि', 'रामायण', 'वाल्मीकि रामायण'],
    completion: 'Valmiki Ramayana',
    label: 'वाल्मीकि रामायण (Valmiki Ramayana)',
    subtitle: 'आदि काव्य — मर्यादा पुरुषोत्तम श्रीराम का जीवन चरित',
    category: 'ग्रंथ',
    directHref: '/scripture/ramayana/',
    badge: '📖',
    weight: 30,
  },
  {
    patterns: ['ramcharit', 'ramcharitmanas', 'रामचरित', 'रामचरितमानस'],
    completion: 'Ramcharitmanas',
    label: 'श्रीरामचरितमानस (Ramcharitmanas)',
    subtitle: 'गोस्वामी तुलसीदास · 7 काण्ड — अवधी महाकाव्य',
    category: 'ग्रंथ',
    directHref: '/scripture/ramcharitmanas/',
    badge: '📖',
    weight: 30,
  },
  {
    patterns: ['mahabharata', 'maha bharata', 'महाभारत'],
    completion: 'Mahabharata',
    label: 'महाभारत (Mahabharata)',
    subtitle: 'वेदव्यास प्रणीत — धर्म, नीति व इतिहास का विशालतम ग्रंथ',
    category: 'ग्रंथ',
    directHref: '/scripture/mahabharata/',
    badge: '📖',
    weight: 30,
  },
  {
    patterns: ['rigveda', 'rig veda', 'ऋग्वेद', 'ऋग्'],
    completion: 'Rigveda',
    label: 'ऋग्वेद संहिता (Rigveda)',
    subtitle: '10 मण्डल · 1028 सूक्त — मानवता की प्राचीनतम ऋचाएँ',
    category: 'ग्रंथ',
    directHref: '/scripture/rigveda/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['samaveda', 'sama veda', 'सामवेद'],
    completion: 'Samaveda',
    label: 'सामवेद संहिता (Samaveda)',
    subtitle: 'गान प्रधान वेद — वेदानां सामवेदोऽस्मि',
    category: 'ग्रंथ',
    directHref: '/scripture/samaveda/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['yajurveda', 'yajur veda', 'यजुर्वेद'],
    completion: 'Yajurveda',
    label: 'यजुर्वेद संहिता (Yajurveda)',
    subtitle: 'शुक्ल व कृष्ण यजुर्वेद — यज्ञ व कर्मकाण्ड का वेद',
    category: 'ग्रंथ',
    directHref: '/scripture/yajurveda/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['atharvaveda', 'atharva veda', 'अथर्ववेद'],
    completion: 'Atharvaveda',
    label: 'अथर्ववेद संहिता (Atharvaveda)',
    subtitle: '20 काण्ड — ब्रह्मज्ञान, आयुर्वेद व दैनिक जीवन सूत्र',
    category: 'ग्रंथ',
    directHref: '/scripture/atharvaveda/',
    badge: '📖',
    weight: 25,
  },
  {
    patterns: ['bhagavata', 'shrimad bhagavatam', 'भागवत', 'श्रीमद्भागवत'],
    completion: 'Bhagavata Purana',
    label: 'श्रीमद्भागवत महापुराण (Bhagavata Purana)',
    subtitle: '12 स्कन्ध · 18,000 श्लोक — भक्ति रस का अमृत',
    category: 'ग्रंथ',
    directHref: '/scripture/bhagavatapurana/',
    badge: '📖',
    weight: 25,
  },

  // ── Wisdom Pathways (Guided Journeys) ──────────────────────────────
  {
    patterns: ['fear', 'anxiety', 'bhaya', 'भय', 'चिंता', 'gita on fear'],
    completion: 'Gita on Overcoming Fear (भय से मुक्ति)',
    label: 'भय व चिंता से मुक्ति · Gita on Fear',
    subtitle: 'भगवद्गीता से निर्भयता, समत्व व आत्म-बोध का मार्ग',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/gita-on-fear/',
    badge: '🕊️',
    weight: 25,
  },
  {
    patterns: ['duty', 'stress', 'action', 'detachment', 'कर्तव्य', 'तनाव', 'krishna on duty'],
    completion: 'Krishna on Duty (कर्तव्य व निष्काम कर्म)',
    label: 'कर्तव्य, कर्म व तनाव मुक्ति · Krishna on Duty',
    subtitle: 'कुरुक्षेत्र का उपदेश — फल की चिंता त्यागे बिना श्रेष्ठ कर्म',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/krishna-on-duty/',
    badge: '🧭',
    weight: 25,
  },
  {
    patterns: ['self', 'who am i', 'aatman', 'आत्मा', 'upanishads on self'],
    completion: 'Upanishads on the Self (आत्म-बोध)',
    label: 'आत्म-बोध व स्वरूप की खोज · Upanishads on Self',
    subtitle: 'उपनिषदों की दृष्टि में स्वयं को जानने की अमर यात्रा',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/upanishads-on-self/',
    badge: '✨',
    weight: 25,
  },
  {
    patterns: ['mind', 'focus', 'distraction', 'chitta', 'मन', 'ध्यान', 'yoga on mind'],
    completion: 'Yoga on Mastering the Mind (मन का निग्रह)',
    label: 'चित्त-वृत्ति निरोध व ध्यान · Yoga on Mind',
    subtitle: 'पतञ्जलि योगसूत्र से मन की एकाग्रता व स्थिरता',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/yoga-on-mind/',
    badge: '🧘',
    weight: 25,
  },
  {
    patterns: ['grief', 'loss', 'sorrow', 'shoka', 'शोक', 'दुःख', 'sanatan on grief'],
    completion: 'Sanatan on Navigating Grief (शोक निवारण)',
    label: 'शोक, वियोग व आंतरिक शांति · Sanatan on Grief',
    subtitle: 'मृत्यु, परिवर्तन और नित्य आत्मा का सनातन परिप्रेक्ष्य',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/sanatan-on-grief/',
    badge: '🌿',
    weight: 25,
  },
  {
    patterns: ['devotion', 'bhakti path', 'surrender', 'शरणागति', 'saints on devotion'],
    completion: 'Saints on Pure Devotion (अनन्य भक्ति)',
    label: 'अनन्य भक्ति व शरणागति · Saints on Devotion',
    subtitle: 'कबीर, मीरा, तुलसी व सन्तों की प्रेम और समर्पण वाणी',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/saints-on-devotion/',
    badge: '🪷',
    weight: 25,
  },
  {
    patterns: ['leadership', 'dharma crisis', 'ramayana on dharma'],
    completion: 'Ramayana on Dharma (संकट में धर्म)',
    label: 'संकट में धर्म व नेतृत्व · Ramayana on Dharma',
    subtitle: 'श्रीराम का मर्यादा पथ — कठिन निर्णयों में धर्म का प्रकाश',
    category: 'मार्ग',
    directHref: '/wisdom-pathways/ramayana-on-dharma/',
    badge: '🏹',
    weight: 25,
  },

  // ── Key Philosophical Concepts ─────────────────────────────────────
  {
    patterns: ['karma', 'karma yoga', 'कर्म', 'कर्मयोग'],
    completion: 'Karma (कर्म)',
    label: 'कर्म दर्शन (Karma)',
    subtitle: 'कार्य, कारण व फल का सनातन नियम',
    category: 'दर्शन',
    directHref: '/concepts/karma/',
    badge: '☸️',
    weight: 30,
  },
  {
    patterns: ['dharma', 'sanatana dharma', 'धर्म', 'सनातन धर्म'],
    completion: 'Dharma (धर्म)',
    label: 'धर्म तत्व (Dharma)',
    subtitle: 'सत्य, कर्तव्य और सृष्टि को धारण करने वाला आधार',
    category: 'दर्शन',
    directHref: '/concepts/dharma/',
    badge: '☸️',
    weight: 30,
  },
  {
    patterns: ['moksha', 'mukti', 'मोक्ष', 'मुक्ति'],
    completion: 'Moksha (मोक्ष)',
    label: 'मोक्ष व मुक्ति (Moksha)',
    subtitle: 'जन्म-मरण चक्र और अज्ञान से परम स्वतंत्रता',
    category: 'दर्शन',
    directHref: '/concepts/moksha/',
    badge: '☸️',
    weight: 25,
  },
  {
    patterns: ['atman', 'soul', 'आत्मा'],
    completion: 'Atman (आत्मा)',
    label: 'आत्म तत्व (Atman)',
    subtitle: 'अविनाशी, नित्य, शुद्ध चैतन्य स्वरूप',
    category: 'दर्शन',
    directHref: '/concepts/atman/',
    badge: '☸️',
    weight: 25,
  },
  {
    patterns: ['brahman', 'ब्रह्म', 'परब्रह्म'],
    completion: 'Brahman (ब्रह्म)',
    label: 'परम ब्रह्म (Brahman)',
    subtitle: 'सत्यं ज्ञानमनन्तं ब्रह्म — सर्वव्यापी परम सत्ता',
    category: 'दर्शन',
    directHref: '/concepts/brahman/',
    badge: '☸️',
    weight: 25,
  },
  {
    patterns: ['maya', 'माया'],
    completion: 'Maya (माया)',
    label: 'माया का सिद्धांत (Maya)',
    subtitle: 'संसार का प्रतीति रूप और नाम-रूपात्मक आवरण',
    category: 'दर्शन',
    directHref: '/concepts/maya/',
    badge: '☸️',
    weight: 20,
  },
  {
    patterns: ['samsara', 'sansar', 'संसार'],
    completion: 'Samsara (संसार)',
    label: 'संसार व पुनर्जन्म चक्र (Samsara)',
    subtitle: 'परिवर्तनशील जगत और चेतना की विकास यात्रा',
    category: 'दर्शन',
    directHref: '/concepts/samsara/',
    badge: '☸️',
    weight: 20,
  },
  {
    patterns: ['vairagya', 'detachment', 'वैराग्य'],
    completion: 'Vairagya (वैराग्य)',
    label: 'वैराग्य व अनासक्ति (Vairagya)',
    subtitle: 'आसक्ति और कामनाओं से मुक्ति — आंतरिक समत्व',
    category: 'दर्शन',
    directHref: '/concepts/vairagya/',
    badge: '☸️',
    weight: 20,
  },
  {
    patterns: ['samadhi', 'समाधि'],
    completion: 'Samadhi (समाधि)',
    label: 'समाधि व परम चेतना (Samadhi)',
    subtitle: 'ज्ञाता, ज्ञान और ज्ञेय का एकत्व — योग का अन्तिम सोपान',
    category: 'दर्शन',
    directHref: '/concepts/samadhi/',
    badge: '☸️',
    weight: 20,
  },
  {
    patterns: ['kundalini', 'कुण्डलिनी'],
    completion: 'Kundalini (कुण्डलिनी)',
    label: 'कुण्डलिनी व सप्त चक्र (Kundalini)',
    subtitle: 'मूलाधार से सहस्रार पर्यन्त सुप्त प्राण चेतना का जागरण',
    category: 'दर्शन',
    directHref: '/concepts/kundalini/',
    badge: '☸️',
    weight: 20,
  },
];

// ── Trilingual Vocabulary Alignment ──────────────────────────────────
const TRILINGUAL_REGISTRY: TrilingualEquivalent[] = [
  { devanagari: 'कर्म', iast: 'karma', english: 'Action, Duty & Causality', meaning: 'The universal principle of cause and effect' },
  { devanagari: 'धर्म', iast: 'dharma', english: 'Cosmic Order & Righteousness', meaning: 'That which sustains, upholds, and preserves life' },
  { devanagari: 'मोक्ष', iast: 'mokṣa', english: 'Liberation & Ultimate Freedom', meaning: 'Emancipation from ignorance and the cycle of rebirth' },
  { devanagari: 'आत्मा', iast: 'ātman', english: 'The Eternal Inner Self', meaning: 'The immortal, unconditioned consciousness in all beings' },
  { devanagari: 'ब्रह्म', iast: 'brahman', english: 'The Absolute Reality', meaning: 'The all-pervading, boundless ground of existence' },
  { devanagari: 'माया', iast: 'māyā', english: 'Cosmic Illusion / Appearance', meaning: 'The creative veil projecting names and forms' },
  { devanagari: 'शान्ति', iast: 'śānti', english: 'Peace & Inner Calm', meaning: 'Freedom from the threefold afflictions' },
  { devanagari: 'अहिंसा', iast: 'ahiṃsā', english: 'Non-injury & Reverence for Life', meaning: 'Universal compassion in thought, word, and deed' },
  { devanagari: 'सत्य', iast: 'satya', english: 'Truth & Unchanging Reality', meaning: 'Unyielding truthfulness rooted in the eternal' },
  { devanagari: 'वैराग्य', iast: 'vairāgya', english: 'Dispassion & Inner Freedom', meaning: 'Serene non-attachment to temporal pleasures' },
  { devanagari: 'समाधि', iast: 'samādhi', english: 'Absorptive Meditative Union', meaning: 'Total dissolution of duality in supreme consciousness' },
  { devanagari: 'आनन्द', iast: 'ānanda', english: 'Unconditioned Bliss', meaning: 'The natural spiritual joy inherent to pure being' },
  { devanagari: 'ज्ञान', iast: 'jñāna', english: 'Self-Knowledge & Insight', meaning: 'Direct experiential realization of oneness' },
  { devanagari: 'भक्ति', iast: 'bhakti', english: 'Pure Devotion & Love', meaning: 'Selfless, ecstatic love and surrender to the Divine' },
  { devanagari: 'योग', iast: 'yoga', english: 'Union & Mind Mastery', meaning: 'Integration of body, breath, and mind into the Self' },
  { devanagari: 'प्राण', iast: 'prāṇa', english: 'Vital Life-Force', meaning: 'The subtle cosmic breath sustaining all animation' },
  { devanagari: 'संसार', iast: 'saṃsāra', english: 'Cycle of Worldly Existence', meaning: 'The perpetual flow of birth, change, and death' },
  { devanagari: 'तत्त्वमसि', iast: 'tat tvam asi', english: 'That Thou Art', meaning: 'Chāndogya 6.8.7 — Identifies individual soul with Brahman' },
  { devanagari: 'अहं ब्रह्मास्मि', iast: 'ahaṃ brahmāsmi', english: 'I am the Absolute', meaning: 'Brihadaranyaka 1.4.10 — Supreme declaration of divine identity' },
  { devanagari: 'कृष्ण', iast: 'kṛṣṇa', english: 'Krishna (All-Attractive)', meaning: 'The Supreme Lord, Jagadguru and speaker of the Gita' },
  { devanagari: 'अर्जुन', iast: 'arjuna', english: 'Arjuna (The Sincere Seeker)', meaning: 'The heroic warrior representing humanity in contemplation' },
];

/**
 * Normalizes input for comparison by trimming and lowercasing.
 */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

interface PreparedEntry extends TypeaheadEntry {
  normPatterns: string[];
  phoneticPatterns: string[];
}

const PREPARED_ENTRIES: PreparedEntry[] = STATIC_ENTRIES.map((entry) => {
  const normPatterns = entry.patterns.map((p) => norm(p));
  const phoneticPatterns = entry.patterns.map((p) => normalizePhonetic(p)).filter(Boolean);
  return {
    ...entry,
    normPatterns,
    phoneticPatterns,
  };
});

/**
 * Returns trilingual alignment (Devanagari, IAST, English) for spiritual terms.
 */
export function getTrilingualEquivalent(rawQuery: string): TrilingualEquivalent | null {
  const q = rawQuery.trim();
  if (!q || q.length < 2) return null;
  const qNorm = norm(q);
  const qPhonetic = normalizePhonetic(q);

  for (const item of TRILINGUAL_REGISTRY) {
    if (
      norm(item.devanagari) === qNorm ||
      norm(item.iast) === qNorm ||
      norm(item.english).toLowerCase().includes(qNorm) ||
      (qPhonetic && (normalizePhonetic(item.devanagari) === qPhonetic || normalizePhonetic(item.iast) === qPhonetic))
    ) {
      return item;
    }
  }
  return null;
}

/**
 * Returns a scored list of all matching typeahead entries for a query.
 */
function findMatchingEntries(rawQuery: string): Array<{ entry: PreparedEntry; score: number; suffix: string }> {
  const query = rawQuery.trimStart();
  if (!query || query.length < 2) return [];

  const normalized = norm(query);
  const queryPhonetic = normalizePhonetic(query);
  const isActionQuery = query.startsWith('>');
  const actionNormalized = isActionQuery ? query.toLowerCase().trim() : '';

  const results: Array<{ entry: PreparedEntry; score: number; suffix: string }> = [];

  for (const entry of PREPARED_ENTRIES) {
    if (isActionQuery) {
      if (entry.category !== 'कमांड') continue;
      let matched = false;
      for (const pattern of entry.patterns) {
        if (pattern.startsWith(actionNormalized) && pattern !== actionNormalized) {
          const suffix = pattern.slice(query.length);
          results.push({
            entry,
            score: 100 + (entry.weight || 0),
            suffix,
          });
          matched = true;
          break;
        }
      }
      if (matched) continue;
    }

    if (entry.category === 'कमांड') continue;

    let bestScore = 0;
    let bestSuffix = '';

    for (let i = 0; i < entry.patterns.length; i++) {
      const pattern = entry.patterns[i];
      const normPattern = entry.normPatterns[i];
      const phoneticPattern = entry.phoneticPatterns[i];

      // 1. Literal exact or prefix match
      if (normPattern === normalized) {
        const score = 100;
        if (score > bestScore) {
          bestScore = score;
          bestSuffix = entry.completion.toLowerCase().startsWith(normalized)
            ? entry.completion.slice(query.length)
            : '';
        }
      } else if (normPattern.startsWith(normalized)) {
        const score = 85;
        if (score > bestScore) {
          bestScore = score;
          bestSuffix = entry.completion.toLowerCase().startsWith(normalized)
            ? entry.completion.slice(query.length)
            : (pattern.startsWith(normalized) ? pattern.slice(query.length) : '');
        }
      } else if (normalized.startsWith(normPattern) && normPattern.length >= 4) {
        const score = 80;
        if (score > bestScore) {
          bestScore = score;
          bestSuffix = '';
        }
      } else if (queryPhonetic && phoneticPattern) {
        // 2. Phonetic matches via searchNormalizer
        if (phoneticPattern === queryPhonetic) {
          const score = 75;
          if (score > bestScore) {
            bestScore = score;
            bestSuffix = entry.completion.startsWith(query) ? entry.completion.slice(query.length) : '';
          }
        } else if (phoneticPattern.startsWith(queryPhonetic) && queryPhonetic.length >= 3) {
          const score = 65;
          if (score > bestScore) {
            bestScore = score;
            bestSuffix = entry.completion.startsWith(query) ? entry.completion.slice(query.length) : '';
          }
        } else if (normPattern.includes(normalized) && normalized.length >= 4) {
          const score = 50;
          if (score > bestScore) {
            bestScore = score;
            bestSuffix = '';
          }
        }
      }
    }

    if (bestScore > 0) {
      results.push({
        entry,
        score: bestScore + (entry.weight || 0),
        suffix: bestSuffix,
      });
    }
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Predicts the best typeahead completion and direct jump target for a query.
 * Maintains full backward compatibility with single-result callers.
 */
export function getTypeaheadSuggestion(rawQuery: string): TypeaheadMatch | null {
  const query = rawQuery.trimStart();
  if (!query || query.length < 2) return null;

  // 1. Direct Citation Check (e.g. "gita 2.47", "bg 2:47", "katha 1.2", "rv 1.1.1")
  try {
    const direct = parseDirectCitation(query);
    if (direct) {
      return {
        completion: query,
        suffix: '',
        label: `${direct.title} · ${direct.subtitle}`,
        subtitle: direct.matchReason,
        category: direct.title.toLowerCase().includes('chapter') ? 'अध्याय' : 'श्लोक',
        directHref: direct.href,
        badge: '⚡',
      };
    }
  } catch {
    // Ignore citation parsing errors
  }

  // 2. Filter matching static entries
  const matches = findMatchingEntries(query);
  if (matches.length === 0) return null;

  const top = matches[0];
  return {
    completion: top.entry.completion,
    suffix: top.suffix,
    label: top.entry.label,
    subtitle: top.entry.subtitle,
    category: top.entry.category,
    directHref: top.entry.directHref,
    badge: top.entry.badge || '✨',
  };
}

/**
 * Returns multiple ranked typeahead suggestions for quick-pick UI pills.
 */
export function getTypeaheadSuggestions(rawQuery: string, limit: number = 4): TypeaheadMatch[] {
  const query = rawQuery.trimStart();
  if (!query || query.length < 2) return [];

  const out: TypeaheadMatch[] = [];
  const seenHrefs = new Set<string>();

  // 1. Direct Citation
  try {
    const direct = parseDirectCitation(query);
    if (direct) {
      out.push({
        completion: query,
        suffix: '',
        label: `${direct.title} · ${direct.subtitle}`,
        subtitle: direct.matchReason,
        category: direct.title.toLowerCase().includes('chapter') ? 'अध्याय' : 'श्लोक',
        directHref: direct.href,
        badge: '⚡',
      });
      if (direct.href) seenHrefs.add(direct.href);
    }
  } catch {
    // Ignore citation parsing errors
  }

  // 2. Top ranked entries
  const matches = findMatchingEntries(query);
  for (const m of matches) {
    if (out.length >= limit) break;
    const href = m.entry.directHref || m.entry.completion;
    if (seenHrefs.has(href)) continue;
    seenHrefs.add(href);

    out.push({
      completion: m.entry.completion,
      suffix: m.suffix,
      label: m.entry.label,
      subtitle: m.entry.subtitle,
      category: m.entry.category,
      directHref: m.entry.directHref,
      badge: m.entry.badge || '✨',
    });
  }

  return out;
}
