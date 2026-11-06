/**
 * Dharma Granth Typeahead & Direct Jump Engine.
 *
 * Provides real-time ghost text completion (Tab / ArrowRight) and 1-tap
 * Direct Jump shortcuts for:
 *   1. Action commands (> tanpura, > om, > bell, > meditation, > theme)
 *   2. Scripture & Chapter & Verse citations (Gita 2.47, Katha 1.2, etc.)
 *   3. Famous verses & Mahavakyas (कर्मण्येवाधिकारस्ते, तत्त्वमसि, etc.)
 *   4. Core scriptures (Bhagavad Gita, Ramayana, Upanishads, etc.)
 *   5. Foundational philosophical concepts & wisdom themes
 */

import { parseDirectCitation, type DirectCitation } from '@/lib/search-citation';

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
  category: 'कमांड' | 'श्लोक' | 'ग्रंथ' | 'अध्याय' | 'दर्शन' | 'विषय' | 'मंत्र';
  /** Direct URL to jump to immediately when user presses Enter or clicks the hero banner */
  directHref?: string;
  /** Emoji or icon badge */
  badge?: string;
}

interface TypeaheadEntry {
  patterns: string[];
  completion: string;
  label: string;
  subtitle?: string;
  category: TypeaheadMatch['category'];
  directHref?: string;
  badge?: string;
}

const STATIC_ENTRIES: TypeaheadEntry[] = [
  // Actions
  {
    patterns: ['> tan', '> tanpura', '> soun', '> music'],
    completion: '> tanpura',
    label: 'Play Vedic Tanpura Drone (432Hz)',
    subtitle: 'प्रक्रियात्मक 432Hz तन्पूरा नाद',
    category: 'कमांड',
    badge: '🎶',
  },
  {
    patterns: ['> om', '> pranav', '> 108'],
    completion: '> om',
    label: 'Play Om Resonance (108Hz)',
    subtitle: 'प्रणव ॐ नाद ध्यान',
    category: 'कमांड',
    badge: '🕉️',
  },
  {
    patterns: ['> bell', '> ghanta', '> bowl'],
    completion: '> bell',
    label: 'Ring Mindfulness Singing Bowl',
    subtitle: 'शांति घंटा नाद · Pause & Breathe',
    category: 'कमांड',
    badge: '🔔',
  },
  {
    patterns: ['> med', '> meditation', '> dhyan'],
    completion: '> meditation',
    label: 'Start 10-Minute Meditation Timer',
    subtitle: '10 मिनट शांत ध्यान साधना',
    category: 'कमांड',
    badge: '🧘',
  },
  {
    patterns: ['> theme', '> dark', '> night', '> light'],
    completion: '> theme',
    label: 'Cycle Visual Theme',
    subtitle: 'दिव्य, ताड़पत्र, निशा व कस्तूरी रंग रूप',
    category: 'कमांड',
    badge: '🎨',
  },

  // Famous Verses & Mantras
  {
    patterns: ['karmanye', 'karmanyeva', 'कर्मण्ये', 'कर्मण्येवा'],
    completion: 'कर्मण्येवाधिकारस्ते',
    label: 'Bhagavad Gita 2.47 · कर्मण्येवाधिकारस्ते',
    subtitle: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — निष्काम कर्म का मूल मंत्र',
    category: 'श्लोक',
    directHref: '/scripture/bhagavadgita/chapter/2/verse/47/',
    badge: '⚡',
  },
  {
    patterns: ['yada yada', 'yada yada hi', 'यदा यदा', 'यदायदा'],
    completion: 'यदा यदा हि धर्मस्य',
    label: 'Bhagavad Gita 4.7 · यदा यदा हि धर्मस्य',
    subtitle: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत — अवतार का प्रयोजन',
    category: 'श्लोक',
    directHref: '/scripture/bhagavadgita/chapter/4/verse/7/',
    badge: '⚡',
  },
  {
    patterns: ['om namah', 'om namah shiv', 'ॐ नमः', 'ॐ नमः शिवाय'],
    completion: 'ॐ नमः शिवाय',
    label: 'ॐ नमः शिवाय · Shiva Panchakshara Mantra',
    subtitle: 'शिव पंचाक्षर महामंत्र — चेतना और लय का सनातन नाद',
    category: 'मंत्र',
    directHref: '/mantras/om-namah-shivaya/',
    badge: '🔱',
  },
  {
    patterns: ['gayatri', 'gayatri mantra', 'गायत्री', 'गायत्री मंत्र'],
    completion: 'गायत्री महामंत्र',
    label: 'गायत्री महामंत्र · Rigveda 3.62.10',
    subtitle: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम् — प्रज्ञा व सद्बुद्धि की प्रार्थना',
    category: 'मंत्र',
    directHref: '/mantras/gayatri-mantra/',
    badge: '☀️',
  },
  {
    patterns: ['maha mrityun', 'mahamrityun', 'महामृत्युंजय', 'मृत्युंजय'],
    completion: 'महामृत्युंजय मंत्र',
    label: 'महामृत्युंजय मंत्र · Rigveda 7.59.12',
    subtitle: 'त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् — आरोग्य व अमरत्व',
    category: 'मंत्र',
    directHref: '/mantras/mahamrityunjaya/',
    badge: '🌿',
  },
  {
    patterns: ['tat tvam', 'tat tvam asi', 'तत्त्वमसि', 'तत् त्वम् असि'],
    completion: 'तत्त्वमसि (Tat Tvam Asi)',
    label: 'तत्त्वमसि · Chāndogya Upanishad 6.8.7',
    subtitle: 'सामवेद का महावाक्य — तुम वही परम चैतन्य हो',
    category: 'दर्शन',
    directHref: '/concepts/tat-tvam-asi/',
    badge: '✨',
  },
  {
    patterns: ['aham brahma', 'aham brahmasmi', 'अहं ब्रह्मा', 'अहं ब्रह्मास्मि'],
    completion: 'अहं ब्रह्मास्मि (Aham Brahmasmi)',
    label: 'अहं ब्रह्मास्मि · Brihadaranyaka 1.4.10',
    subtitle: 'यजुर्वेद का महावाक्य — मैं ही ब्रह्म हूँ',
    category: 'दर्शन',
    directHref: '/concepts/aham-brahmasmi/',
    badge: '✨',
  },

  // Core Scriptures
  {
    patterns: ['gita', 'geeta', 'bhagavad', 'bhagavad gita', 'गीता', 'भगवद्गीता'],
    completion: 'Bhagavad Gita',
    label: 'श्रीमद्भगवद्गीता (Bhagavad Gita)',
    subtitle: '18 अध्याय · 701 श्लोक — कुरुक्षेत्र का कालजयी संवाद',
    category: 'ग्रंथ',
    directHref: '/scripture/bhagavadgita/',
    badge: '📖',
  },
  {
    patterns: ['isha', 'ishavasya', 'ईशा', 'ईशावास्य'],
    completion: 'Isha Upanishad',
    label: 'ईशावास्योपनिषद् (Isha Upanishad)',
    subtitle: 'शुक्ल यजुर्वेद · 18 मंत्र — ईशा वास्यमिदं सर्वम्',
    category: 'ग्रंथ',
    directHref: '/scripture/ishavasya/',
    badge: '📖',
  },
  {
    patterns: ['katha', 'kathopanishad', 'कठ', 'कठोपनिषद्'],
    completion: 'Katha Upanishad',
    label: 'कठोपनिषद् (Katha Upanishad)',
    subtitle: 'नचिकेता-यम संवाद · 119 मंत्र — श्रेय और प्रेय का विवेक',
    category: 'ग्रंथ',
    directHref: '/scripture/katha/',
    badge: '📖',
  },
  {
    patterns: ['ashtavakra', 'ashtavakra gita', 'अष्टावक्र', 'अष्टावक्र गीता'],
    completion: 'Ashtavakra Gita',
    label: 'अष्टावक्र गीता (Ashtavakra Gita)',
    subtitle: '20 प्रकरण · 298 श्लोक — परम अद्वैत बोध',
    category: 'ग्रंथ',
    directHref: '/ashtavakra/',
    badge: '📖',
  },
  {
    patterns: ['ramcharit', 'ramcharitmanas', 'रामचरित', 'रामचरितमानस'],
    completion: 'Ramcharitmanas',
    label: 'श्रीरामचरितमानस (Ramcharitmanas)',
    subtitle: 'गोस्वामी तुलसीदास · 7 काण्ड — अवधी महाकाव्य',
    category: 'ग्रंथ',
    directHref: '/scripture/ramcharitmanas/',
    badge: '📖',
  },
  {
    patterns: ['ramayana', 'valmiki', 'रामायण', 'वाल्मीकि'],
    completion: 'Valmiki Ramayana',
    label: 'वाल्मीकि रामायण (Valmiki Ramayana)',
    subtitle: 'आदि काव्य — मर्यादा पुरुषोत्तम श्रीराम का जीवन चरित',
    category: 'ग्रंथ',
    directHref: '/scripture/ramayana/',
    badge: '📖',
  },
  {
    patterns: ['mahabharata', 'maha bharata', 'महाभारत'],
    completion: 'Mahabharata',
    label: 'महाभारत (Mahabharata)',
    subtitle: 'वेदव्यास प्रणीत — धर्म, नीति व इतिहास का विशालतम ग्रंथ',
    category: 'ग्रंथ',
    directHref: '/scripture/mahabharata/',
    badge: '📖',
  },
  {
    patterns: ['vidura', 'viduraniti', 'विदुर', 'विदुर नीति'],
    completion: 'Vidura Niti',
    label: 'विदुर नीति (Vidura Niti)',
    subtitle: 'महाभारत उद्योगपर्व · 594 श्लोक — व्यावहारिक शासन व धर्म नीति',
    category: 'ग्रंथ',
    directHref: '/scripture/viduraniti/',
    badge: '📖',
  },
  {
    patterns: ['vivek', 'vivekachudamani', 'विवेक', 'विवेकचूडामणि'],
    completion: 'Vivekachudamani',
    label: 'विवेकचूडामणि (Vivekachudamani)',
    subtitle: 'आदि शंकराचार्य · 580 श्लोक — अद्वैत वेदांत का रत्न',
    category: 'ग्रंथ',
    directHref: '/scripture/vivekchudamani/',
    badge: '📖',
  },
  {
    patterns: ['narada bhakti', 'naradabhakti', 'नारद भक्ति', 'भक्ति सूत्र'],
    completion: 'Narada Bhakti Sutras',
    label: 'नारद भक्ति सूत्र (Narada Bhakti Sutras)',
    subtitle: '84 सूत्र — सा पराऽनुरक्तिरीश्वरे · पराभक्ति का दिव्य दर्शन',
    category: 'ग्रंथ',
    directHref: '/scripture/naradabhaktisutra/',
    badge: '📖',
  },
  {
    patterns: ['rigveda', 'rig veda', 'ऋग्वेद', 'ऋग्'],
    completion: 'Rigveda',
    label: 'ऋग्वेद संहिता (Rigveda)',
    subtitle: '10 मण्डल · 1028 सूक्त — मानवता की प्राचीनतम ऋचाएँ',
    category: 'ग्रंथ',
    directHref: '/scripture/rigveda/',
    badge: '📖',
  },

  // Key Philosophical Concepts & Topics
  {
    patterns: ['karma', 'karma yoga', 'कर्म', 'कर्मयोग'],
    completion: 'Karma (कर्म)',
    label: 'कर्म दर्शन (Karma)',
    subtitle: 'कार्य, कारण व फल का सनातन नियम',
    category: 'दर्शन',
    directHref: '/concepts/karma/',
    badge: '☸️',
  },
  {
    patterns: ['dharma', 'sanatana dharma', 'धर्म', 'सनातन धर्म'],
    completion: 'Dharma (धर्म)',
    label: 'धर्म तत्व (Dharma)',
    subtitle: 'सत्य, कर्तव्य और सृष्टि को धारण करने वाला आधार',
    category: 'दर्शन',
    directHref: '/concepts/dharma/',
    badge: '☸️',
  },
  {
    patterns: ['moksha', 'mukti', 'मोक्ष', 'मुक्ति'],
    completion: 'Moksha (मोक्ष)',
    label: 'मोक्ष व मुक्ति (Moksha)',
    subtitle: 'जन्म-मरण चक्र और अज्ञान से परम स्वतंत्रता',
    category: 'दर्शन',
    directHref: '/concepts/moksha/',
    badge: '☸️',
  },
  {
    patterns: ['atman', 'soul', 'आत्मा'],
    completion: 'Atman (आत्मा)',
    label: 'आत्म तत्व (Atman)',
    subtitle: 'अविनाशी, नित्य, शुद्ध चैतन्य स्वरूप',
    category: 'दर्शन',
    directHref: '/concepts/atman/',
    badge: '☸️',
  },
  {
    patterns: ['brahman', 'ब्रह्म'],
    completion: 'Brahman (ब्रह्म)',
    label: 'परम ब्रह्म (Brahman)',
    subtitle: 'सत्यं ज्ञानमनन्तं ब्रह्म — सर्वव्यापी परम सत्ता',
    category: 'दर्शन',
    directHref: '/concepts/brahman/',
    badge: '☸️',
  },
  {
    patterns: ['maya', 'माया'],
    completion: 'Maya (माया)',
    label: 'माया का सिद्धांत (Maya)',
    subtitle: 'संसार का प्रतीति रूप और नाम-रूपात्मक आवरण',
    category: 'दर्शन',
    directHref: '/concepts/maya/',
    badge: '☸️',
  },
  {
    patterns: ['fear', 'anxiety', 'भय', 'चिंता'],
    completion: 'भय व चिंता से मुक्ति (Fear & Anxiety)',
    label: 'भय, तनाव व चिंता का समाधान',
    subtitle: 'भगवद्गीता व उपनिषद् से व्यावहारिक मार्गदर्शन',
    category: 'विषय',
    directHref: '/topics/fear-anxiety/',
    badge: '🕊️',
  },
  {
    patterns: ['anger', 'krodha', 'क्रोध', 'गुस्सा'],
    completion: 'क्रोध पर विजय (Mastering Anger)',
    label: 'क्रोध व मनोवेगों का नियंत्रण',
    subtitle: 'क्रोधाद्भवति संमोहः — मानसिक शांति का मार्ग',
    category: 'विषय',
    directHref: '/topics/anger/',
    badge: '🕊️',
  },
];

/**
 * Normalizes input for comparison by trimming and lowercasing.
 */
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Predicts the best typeahead completion and direct jump target for a query.
 */
export function getTypeaheadSuggestion(rawQuery: string): TypeaheadMatch | null {
  const query = rawQuery.trimStart();
  if (!query || query.length < 2) return null;

  const normalized = norm(query);

  // 1. Direct Citation Check (e.g. "gita 2.47", "bg 2:47", "katha 1.2")
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

  // 2. Action command typeahead (starts with '>')
  if (query.startsWith('>')) {
    const actionQuery = query.toLowerCase().trim();
    for (const entry of STATIC_ENTRIES) {
      if (entry.category !== 'कमांड') continue;
      for (const pattern of entry.patterns) {
        if (pattern.startsWith(actionQuery) && pattern !== actionQuery) {
          return {
            completion: pattern,
            suffix: pattern.slice(query.length),
            label: entry.label,
            subtitle: entry.subtitle,
            category: 'कमांड',
            badge: entry.badge || '⚡',
          };
        }
      }
    }
  }

  // 3. Static Entries Prefix & Exact Matching
  for (const entry of STATIC_ENTRIES) {
    for (const pattern of entry.patterns) {
      const normPattern = norm(pattern);
      if (normPattern.startsWith(normalized)) {
        // If user typed the full pattern or a prefix of pattern,
        // we offer the full entry.completion as the target
        const suffix = entry.completion.toLowerCase().startsWith(normalized)
          ? entry.completion.slice(query.length)
          : (normPattern === normalized && entry.completion.startsWith(pattern)
              ? entry.completion.slice(pattern.length)
              : '');

        return {
          completion: entry.completion,
          suffix,
          label: entry.label,
          subtitle: entry.subtitle,
          category: entry.category,
          directHref: entry.directHref,
          badge: entry.badge || '✨',
        };
      }
    }
  }

  return null;
}
