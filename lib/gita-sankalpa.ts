/**
 * Bhagavad Gita Daily Sankalpa & Svadhyaya Engine
 * (श्रीमद्भगवद्गीता नित्य स्वाध्याय एवं पारायण संकल्प)
 *
 * 100% private, offline-first client storage for daily Gita recitation vows.
 * Supports:
 * 1. 18-Day Sequential Parayana (1 Chapter/Day)
 * 2. Daily Fixed Chapter Pledge (e.g. Chapter 12 Bhakti Yoga or Chapter 15 Purushottama Yoga)
 * 3. Weekly Parayana (3 Chapters/Day across 6 days)
 * 4. Contemplative Svadhyaya with traditional Vedic Sankalpa invocation and streak tracking.
 */

export interface GitaChapterMeta {
  number: number;
  name: string;
  nameHi: string;
  sanskritName: string;
  verses: number;
  shatka: 'Karma' | 'Bhakti' | 'Jnana';
  shatkaHi: string;
  theme: string;
  themeHi: string;
}

export const GITA_CHAPTERS: GitaChapterMeta[] = [
  {
    number: 1,
    name: 'Arjuna Vishada Yoga',
    nameHi: 'अर्जुनविषादयोग',
    sanskritName: 'अर्जुनविषादयोगः',
    verses: 47,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'Arjuna\'s dilemma, moral anguish, and total surrender to Bhagavan Krishna.',
    themeHi: 'अर्जुन का मोह, विषाद और भगवान् श्रीकृष्ण के चरणों में प्रपत्ति (शरण)।',
  },
  {
    number: 2,
    name: 'Sankhya Yoga',
    nameHi: 'सांख्ययोग',
    sanskritName: 'सांख्ययोगः',
    verses: 72,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'The eternal indwelling Self (Atman), Nishkama Karma, and the state of Sthitaprajna.',
    themeHi: 'अविनाशी आत्म-तत्त्व, निष्काम कर्मयोग का रहस्य और स्थितप्रज्ञ के लक्षण।',
  },
  {
    number: 3,
    name: 'Karma Yoga',
    nameHi: 'कर्मयोग',
    sanskritName: 'कर्मयोगः',
    verses: 43,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'Selfless action without attachment, cosmic yajna cycle, and overcoming desire.',
    themeHi: 'कर्तव्य कर्म का अनासक्त पालन, यज्ञ-चक्र और काम-क्रोध पर विजय।',
  },
  {
    number: 4,
    name: 'Jnana Karma Sannyasa Yoga',
    nameHi: 'ज्ञानकर्मसंन्यासयोग',
    sanskritName: 'ज्ञानकर्मसंन्यासयोगः',
    verses: 42,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'Divine descent (Avatara), knowledge burning karma into ashes, and the fire of wisdom.',
    themeHi: 'अवतार रहस्य, ज्ञान रूपी अग्नि से कर्म-बन्धन का भस्म होना।',
  },
  {
    number: 5,
    name: 'Karma Sannyasa Yoga',
    nameHi: 'कर्मसंन्यासयोग',
    sanskritName: 'कर्मसंन्यासयोगः',
    verses: 29,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'Inner renunciation through action, equanimity, and peace of Brahma-nirvana.',
    themeHi: 'संन्यास और कर्मयोग की एकता, ब्रह्म-निर्वाण और समभाव की प्राप्ति।',
  },
  {
    number: 6,
    name: 'Dhyana Yoga (Atmasamyama Yoga)',
    nameHi: 'आत्मसंयमयोग / ध्यानयोग',
    sanskritName: 'आत्मसंयमयोगः',
    verses: 47,
    shatka: 'Karma',
    shatkaHi: 'कर्म षट्क',
    theme: 'Meditation practice, mastery of the restless mind, and seeing the Self in all beings.',
    themeHi: 'मन का संयम, ध्यान की विधि और सबमें समदर्शी आत्म-दर्शन।',
  },
  {
    number: 7,
    name: 'Jnana Vijnana Yoga',
    nameHi: 'ज्ञानविज्ञानयोग',
    sanskritName: 'ज्ञानविज्ञानयोगः',
    verses: 30,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'Para and Apara Prakriti, the divine thread binding the universe, and 4 kinds of devotees.',
    themeHi: 'परा-अपरा प्रकृति, सूत्रों में मणियों की भाँति व्याप्त ईश्वर और चार प्रकार के भक्त।',
  },
  {
    number: 8,
    name: 'Akshara Brahma Yoga',
    nameHi: 'अक्षरब्रह्मयोग',
    sanskritName: 'अक्षरब्रह्मयोगः',
    verses: 28,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'Remembrance of the Divine at the hour of transition and the path of no return.',
    themeHi: 'अन्तकाल में ईश्वर-स्मरण, ॐकार साधना और पुनरावृत्ति-रहित परम गति।',
  },
  {
    number: 9,
    name: 'Raja Vidya Raja Guhya Yoga',
    nameHi: 'राजविद्याराजगुह्ययोग',
    sanskritName: 'राजविद्याराजगुह्ययोगः',
    verses: 34,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'The sovereign sovereign secret, offering leaves and water with love, and divine assurance.',
    themeHi: 'परम गोपनीय राजविद्या, पत्रं पुष्पं फलं तोयं का भाव-समर्पण और अभय वचन।',
  },
  {
    number: 10,
    name: 'Vibhuti Yoga',
    nameHi: 'विभूतियोग',
    sanskritName: 'विभूतियोगः',
    verses: 42,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'Glory of the Supreme Divine manifest across all created splendor.',
    themeHi: 'सम्पूर्ण सृष्टि के तेज, बल और सौन्दर्य में भगवान् की दिव्य विभूतियों का दर्शन।',
  },
  {
    number: 11,
    name: 'Vishwarupa Darshana Yoga',
    nameHi: 'विश्वरूपदर्शनयोग',
    sanskritName: 'विश्वरूपदर्शनयोगः',
    verses: 55,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'Cosmic Vision of the Supreme Deity, time as the devourer, and devotion supreme.',
    themeHi: 'भगवान् का विराट् विश्वरूप दर्शन, कालरूप की महिमा और अनन्य भक्ति।',
  },
  {
    number: 12,
    name: 'Bhakti Yoga',
    nameHi: 'भक्तियोग',
    sanskritName: 'भक्तियोगः',
    verses: 20,
    shatka: 'Bhakti',
    shatkaHi: 'भक्ति षट्क',
    theme: 'The path of loving devotion, personal and impersonal worship, and traits of a true devotee.',
    themeHi: 'भक्ति का अमृत-मार्ग, सगुण-निर्गुण उपासना और भगवान् के प्रिय भक्त के लक्षण।',
  },
  {
    number: 13,
    name: 'Kshetra Kshetrajna Vibhaga Yoga',
    nameHi: 'क्षेत्रक्षेत्रज्ञविभागयोग',
    sanskritName: 'क्षेत्रक्षेत्रज्ञविभागयोगः',
    verses: 35,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'The field of the body and the knower of the field; discernment of the Spirit from matter.',
    themeHi: 'शरीर (क्षेत्र) और आत्मा (क्षेत्रज्ञ) का विवेक, ज्ञान के बीस लक्षण।',
  },
  {
    number: 14,
    name: 'Gunatraya Vibhaga Yoga',
    nameHi: 'गुणत्रयविभागयोग',
    sanskritName: 'गुणत्रयविभागयोगः',
    verses: 27,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'Sattva, Rajas, and Tamas — the three cosmic cords binding the soul and transcending them.',
    themeHi: 'सत्त्व, रज, तम—तीनों गुणों का स्वरूप, बन्धन और गुणातीत होने का मार्ग।',
  },
  {
    number: 15,
    name: 'Purushottama Yoga',
    nameHi: 'पुरुषोत्तमयोग',
    sanskritName: 'पुरुषोत्तमयोगः',
    verses: 20,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'The inverted cosmic tree (Ashvattha), Kshara, Akshara, and the Supreme Divine Person.',
    themeHi: 'अश्वत्थ वृक्ष का रूपक, क्षर और अक्षर से परे पुरुषोत्तम तत्त्व का प्रकाश।',
  },
  {
    number: 16,
    name: 'Daivasura Sampad Vibhaga Yoga',
    nameHi: 'दैवासुरसम्पद्विभागयोग',
    sanskritName: 'दैवासुरसम्पद्विभागयोगः',
    verses: 24,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'Divine virtues that liberate versus demonic traits that bind; three gates to darkness.',
    themeHi: 'दैवी और आसुरी सम्पदा का भेद, काम-क्रोध-लोभ रूपी नरक के तीन द्वार।',
  },
  {
    number: 17,
    name: 'Shraddhatraya Vibhaga Yoga',
    nameHi: 'श्रद्धात्रयविभागयोग',
    sanskritName: 'श्रद्धात्रयविभागयोगः',
    verses: 28,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'Threefold faith, food, austerity, sacrifice, and the supreme purifying mantra ॐ तत्सत्.',
    themeHi: 'आहार, तप, दान और यज्ञ में त्रिगुण भेद; ॐ तत्सत् मन्त्र का माहात्म्य।',
  },
  {
    number: 18,
    name: 'Moksha Sannyasa Yoga',
    nameHi: 'मोक्षसंन्यासयोग',
    sanskritName: 'मोक्षसंन्यासयोगः',
    verses: 78,
    shatka: 'Jnana',
    shatkaHi: 'ज्ञान षट्क',
    theme: 'The culmination of all spiritual paths, highest renunciation, surrender, and ultimate freedom.',
    themeHi: 'सम्पूर्ण गीता का सार, सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज का अन्तिम महा-आश्वासन।',
  },
];

export type SankalpaMode = '18-days' | 'daily-chapter' | 'weekly-parayana';

export interface GitaSankalpaState {
  isActive: boolean;
  mode: SankalpaMode;
  targetChapter: number; // for daily-chapter pledge (e.g. 12 or 15 or 2)
  startDate: string; // ISO YYYY-MM-DD
  currentCycle: number;
  completedDates: string[]; // YYYY-MM-DD strings
  cycleChapters: number[]; // Completed chapters in current cycle (1..18)
  currentStreak: number;
  bestStreak: number;
  totalChaptersRead: number;
  cyclesCompleted: number;
  sadhanaTimePreference: 'pratah' | 'sayam' | 'anytime';
}

export const GITA_SANKALPA_STORAGE_KEY = 'dharma.gita.sankalpa.v1';

export function getTodayISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDefaultSankalpaState(): GitaSankalpaState {
  return {
    isActive: false,
    mode: '18-days',
    targetChapter: 12, // Default favorite is Bhakti Yoga
    startDate: getTodayISODate(),
    currentCycle: 1,
    completedDates: [],
    cycleChapters: [],
    currentStreak: 0,
    bestStreak: 0,
    totalChaptersRead: 0,
    cyclesCompleted: 0,
    sadhanaTimePreference: 'pratah',
  };
}

export function loadSankalpaState(): GitaSankalpaState {
  if (typeof window === 'undefined') return getDefaultSankalpaState();
  try {
    const raw = localStorage.getItem(GITA_SANKALPA_STORAGE_KEY);
    if (!raw) return getDefaultSankalpaState();
    const parsed = JSON.parse(raw) as Partial<GitaSankalpaState>;
    return {
      ...getDefaultSankalpaState(),
      ...parsed,
    };
  } catch {
    return getDefaultSankalpaState();
  }
}

export function saveSankalpaState(state: GitaSankalpaState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GITA_SANKALPA_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('dharma-gita-sankalpa-changed', { detail: state }));
  } catch {
    // LocalStorage quota or private mode protection
  }
}

/**
 * Calculates current and best streaks given sorted array of ISO date strings (YYYY-MM-DD).
 */
export function calculateStreak(completedDates: string[], todayStr: string = getTodayISODate()): { currentStreak: number; bestStreak: number } {
  if (!completedDates || completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const uniqueDates = Array.from(new Set(completedDates)).sort();
  let maxStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dateStr of uniqueDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const cur = new Date(Date.UTC(y, m - 1, d));

    if (!prevDate) {
      running = 1;
    } else {
      const diffMs = cur.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running += 1;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    if (running > maxStreak) maxStreak = running;
    prevDate = cur;
  }

  // Calculate current streak relative to today
  let currentStreak = 0;
  const lastCompletedStr = uniqueDates[uniqueDates.length - 1];
  const [ty, tm, td] = todayStr.split('-').map(Number);
  const todayDate = new Date(Date.UTC(ty, tm - 1, td));
  const [ly, lm, ld] = lastCompletedStr.split('-').map(Number);
  const lastDate = new Date(Date.UTC(ly, lm - 1, ld));

  const diffToToday = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffToToday === 0 || diffToToday === 1) {
    // Either completed today or completed yesterday (active today)
    let count = 0;
    let expected = diffToToday === 0 ? todayDate : lastDate;
    for (let i = uniqueDates.length - 1; i >= 0; i--) {
      const [cy, cm, cd] = uniqueDates[i].split('-').map(Number);
      const cDate = new Date(Date.UTC(cy, cm - 1, cd));
      const gap = Math.round((expected.getTime() - cDate.getTime()) / (1000 * 60 * 60 * 24));
      if (gap === 0) {
        count += 1;
        expected = new Date(expected.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
    currentStreak = count;
  }

  return {
    currentStreak,
    bestStreak: Math.max(maxStreak, currentStreak),
  };
}

/**
 * Returns today's scheduled chapter(s) based on the reader's pledge mode.
 */
export function getTodayAssignment(
  state: GitaSankalpaState,
  todayStr: string = getTodayISODate(),
): {
  chapters: GitaChapterMeta[];
  isFulfilledToday: boolean;
  dayIndexInCycle: number;
} {
  const isFulfilledToday = state.completedDates.includes(todayStr);

  if (state.mode === 'daily-chapter') {
    const ch = GITA_CHAPTERS.find((c) => c.number === state.targetChapter) ?? GITA_CHAPTERS[11]; // default ch 12
    return {
      chapters: [ch],
      isFulfilledToday,
      dayIndexInCycle: 1,
    };
  }

  if (state.mode === 'weekly-parayana') {
    // 3 chapters per day:
    // Mon: 1-3, Tue: 4-6, Wed: 7-9, Thu: 10-12, Fri: 13-15, Sat: 16-18, Sun: contemplation/review
    const dateObj = new Date(todayStr);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday ...
    let startCh = 1;
    if (dayOfWeek === 1) startCh = 1;
    else if (dayOfWeek === 2) startCh = 4;
    else if (dayOfWeek === 3) startCh = 7;
    else if (dayOfWeek === 4) startCh = 10;
    else if (dayOfWeek === 5) startCh = 13;
    else if (dayOfWeek === 6) startCh = 16;
    else startCh = 1; // Sunday reflection

    const chapters = GITA_CHAPTERS.filter((c) => c.number >= startCh && c.number < startCh + 3);
    return {
      chapters: chapters.length > 0 ? chapters : [GITA_CHAPTERS[11]],
      isFulfilledToday,
      dayIndexInCycle: dayOfWeek === 0 ? 7 : dayOfWeek,
    };
  }

  // Default: '18-days' Sequential Parayana
  // Find the first uncompleted chapter in the current cycle
  const completedSet = new Set(state.cycleChapters);
  const nextUnread = GITA_CHAPTERS.find((c) => !completedSet.has(c.number));
  const activeChapter = nextUnread ?? GITA_CHAPTERS[0];
  const dayIndexInCycle = Math.min(18, state.cycleChapters.length + (isFulfilledToday ? 0 : 1));

  return {
    chapters: [activeChapter],
    isFulfilledToday,
    dayIndexInCycle,
  };
}

/**
 * Marks today's assignment as completed and recalculates streaks and cycles.
 */
export function fulfillTodayAssignment(
  state: GitaSankalpaState,
  todayStr: string = getTodayISODate(),
): GitaSankalpaState {
  if (state.completedDates.includes(todayStr)) {
    return state; // Already done today
  }

  const updatedDates = [...state.completedDates, todayStr];
  const streaks = calculateStreak(updatedDates, todayStr);

  const { chapters } = getTodayAssignment(state, todayStr);
  const newlyRead = chapters.map((c) => c.number);

  let newCycleChapters = Array.from(new Set([...state.cycleChapters, ...newlyRead]));
  let newCurrentCycle = state.currentCycle;
  let newCyclesCompleted = state.cyclesCompleted;

  // Check if 18-day cycle completed
  if (state.mode === '18-days' && newCycleChapters.length >= 18) {
    newCyclesCompleted += 1;
    newCurrentCycle += 1;
    newCycleChapters = []; // Reset for next cycle!
  } else if (state.mode === 'weekly-parayana' && newCycleChapters.length >= 18) {
    newCyclesCompleted += 1;
    newCurrentCycle += 1;
    newCycleChapters = [];
  }

  const nextState: GitaSankalpaState = {
    ...state,
    completedDates: updatedDates,
    cycleChapters: newCycleChapters,
    currentCycle: newCurrentCycle,
    cyclesCompleted: newCyclesCompleted,
    currentStreak: streaks.currentStreak,
    bestStreak: Math.max(state.bestStreak, streaks.bestStreak),
    totalChaptersRead: state.totalChaptersRead + newlyRead.length,
  };

  saveSankalpaState(nextState);
  return nextState;
}

/**
 * Toggles an individual chapter's completion in the current cycle (for flexible manual checking).
 */
export function toggleChapterInCycle(
  state: GitaSankalpaState,
  chapterNumber: number,
  todayStr: string = getTodayISODate(),
): GitaSankalpaState {
  const has = state.cycleChapters.includes(chapterNumber);
  let updatedCycleChapters: number[];
  let newCyclesCompleted = state.cyclesCompleted;
  let newCurrentCycle = state.currentCycle;
  let updatedDates = state.completedDates;

  if (has) {
    updatedCycleChapters = state.cycleChapters.filter((n) => n !== chapterNumber);
  } else {
    updatedCycleChapters = [...state.cycleChapters, chapterNumber];
    if (!updatedDates.includes(todayStr)) {
      updatedDates = [...updatedDates, todayStr];
    }
  }

  if (updatedCycleChapters.length >= 18) {
    newCyclesCompleted += 1;
    newCurrentCycle += 1;
    updatedCycleChapters = [];
  }

  const streaks = calculateStreak(updatedDates, todayStr);

  const nextState: GitaSankalpaState = {
    ...state,
    completedDates: updatedDates,
    cycleChapters: updatedCycleChapters,
    currentCycle: newCurrentCycle,
    cyclesCompleted: newCyclesCompleted,
    currentStreak: streaks.currentStreak,
    bestStreak: Math.max(state.bestStreak, streaks.bestStreak),
    totalChaptersRead: has ? Math.max(0, state.totalChaptersRead - 1) : state.totalChaptersRead + 1,
  };

  saveSankalpaState(nextState);
  return nextState;
}

/**
 * Generates traditional Vedic & Puranic Sankalpa invocation text.
 */
export function getTraditionalSankalpaInvocation(
  varaLabelHi: string = 'अद्य',
  tithiLabelHi: string = 'पावन तिथौ',
  chapterNameHi: string = 'श्रीमद्भगवद्गीता',
): {
  sanskrit: string;
  hindi: string;
  english: string;
} {
  return {
    sanskrit: `ॐ तत्सत्। श्रीपरमात्मने नमः।
अद्य ${varaLabelHi} वासरे, ${tithiLabelHi},
मम कायिक-वाचिक-मानसिक पाप-निवारणार्थं,
अन्तःकरण-शुद्धि-पूर्वकं, ज्ञान-वैराग्य-भक्ति-सिद्धये,
भगवान् श्रीकृष्ण-प्रीत्यर्थं,
${chapterNameHi} नित्य-स्वाध्याय-पारायण-संकल्पम् अहम् करिष्ये॥`,
    hindi: `ॐ तत्सत्। परमपिता परमात्मा को प्रणाम।
आज ${varaLabelHi} के पावन दिवस पर, ${tithiLabelHi} में,
मेरे मन, वाणी और शरीर से हुए दोषों की निवृत्ति,
हृदय की शुद्धि, तथा ज्ञान, वैराग्य और भक्ति की प्राप्ति के लिए,
भगवान् श्रीकृष्ण के प्रीत्यर्थ,
मैं ${chapterNameHi} के नित्य स्वाध्याय एवं पारायण का पावन संकल्प करता/करती हूँ।`,
    english: `Om Tat Sat. Salutations to the Supreme Self.
On this sacred day (${varaLabelHi}), amidst ${tithiLabelHi},
for the purification of speech, mind, and action,
for the attainment of discernment, detachment, and supreme devotion,
and for the pleasure of Bhagavan Sri Krishna,
I hereby take this sacred pledge for the daily recitation and study of ${chapterNameHi}.`,
  };
}
