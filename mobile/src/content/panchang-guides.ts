/**
 * The website's reference pages for the five limbs of the Panchang (/panchang/tithis/, /nakshatras/, /yogas/,
 * /karanas/, /varas/ and each entry's own page), as one shape the app can draw with one pair of screens.
 *
 * Every entry comes from the website's own tables in lib/panchang.ts, copied in at build time by
 * scripts/build-explore.mjs, and each page's questions and answers come from that page (generated/explore/faqs.ts).
 * The short introductions and "foundation" cards are the website pages' own text; the website writes them in
 * English, so the Hindi beside them is ours. Entry explanations stay in English, as on the website.
 */
import type { Href } from 'expo-router';

import { S, type Msg } from '@/i18n/strings';
import type { Hues } from '@/theme/themes';
import { PAGE_FAQS, type PageFaq } from './generated/explore/faqs';
import {
  getAllKaranas,
  NAKSHATRA_DATA,
  nakshatraSlug,
  UNIQUE_TITHI_ARCHETYPES,
  VARA_DATA,
  YOGA_DATA,
  type PanchangDayData,
} from './generated/explore/panchang';
import { SACRED_MANTRAS } from './generated/explore/mantras';

export type LimbId = 'tithis' | 'nakshatras' | 'yogas' | 'karanas' | 'varas';
export const LIMB_IDS: LimbId[] = ['tithis', 'varas', 'nakshatras', 'yogas', 'karanas'];

export function isLimbId(id: string | undefined): id is LimbId {
  return !!id && (LIMB_IDS as string[]).includes(id);
}

type Lang = 'en' | 'hi';
type Hue = keyof Hues;

export interface LimbFact {
  label: Msg;
  value: string;
}

export interface LimbListItem {
  text: string;
  href?: Href;
}

export interface LimbEntry {
  slug: string;
  /** Its place in the website's order, 1-based. */
  number: number;
  name: string;
  nameHi: string;
  translit: string;
  /** A short line under the name on the hub (the deity, the lord). */
  line: string;
  /** The class it belongs to (Nanda, Auspicious, Chara, Sattva…), in the reader's language, with its hue. */
  group?: { label: string; hue: Hue };
  facts: LimbFact[];
  explanation: string;
  focus?: string;
  /** A quoted note (Bhadra for Vishti). */
  note?: { title: Msg; text: Msg };
  lists: { title: Msg; items: LimbListItem[] }[];
  /** The Panchang screen's vrat dates for this tithi, when it has them. */
  vrata?: 'ekadashi' | 'purnima' | 'amavasya' | 'pradosh';
}

export interface LimbGuide {
  id: LimbId;
  title: Msg;
  /** The one-word limb name for headings ("Tithi"). */
  singular: Msg;
  eyebrow: Msg;
  count: number;
  hue: Hue;
  icon: 'moon' | 'sparkles' | 'infinite' | 'git-commit' | 'sunny';
  intro: Msg;
  foundations: { title: Msg; text: Msg }[];
  /** The groups the website lays out above the grid (the five tithi classes), when it has them. */
  groups?: { name: Msg; members: string; text: Msg; hue: Hue }[];
  faqs: PageFaq[];
}

const m = (en: string, hi: string): Msg => ({ en, hi });

export const LIMB_GUIDES: Record<LimbId, LimbGuide> = {
  tithis: {
    id: 'tithis',
    title: m('16 Vedic tithis', '16 वैदिक तिथियाँ'),
    singular: S.limbTithi,
    eyebrow: m('Lunar days', 'चान्द्र दिवस'),
    count: UNIQUE_TITHI_ARCHETYPES.length,
    hue: 'indigo',
    icon: 'moon',
    intro: m(
      'In Vedic astronomy a tithi is exactly 12 degrees of angular movement between the Sun and the Moon. Discover the governing deities, the five cyclic classes and the spiritual purpose of each day.',
      'वैदिक ज्योतिष में तिथि सूर्य और चन्द्रमा के बीच ठीक 12 अंश की दूरी है। हर तिथि के अधिष्ठाता देवता, पाँच चक्रीय वर्ग और उस दिन की साधना जानें।',
    ),
    foundations: [],
    groups: [
      { name: m('Nanda (नन्दा)', 'नन्दा'), members: '1, 6, 11', text: m('Joy and beginnings', 'आनन्द और आरम्भ'), hue: 'tulsi' },
      { name: m('Bhadra (भद्रा)', 'भद्रा'), members: '2, 7, 12', text: m('Auspicious welfare', 'मंगल और कल्याण'), hue: 'indigo' },
      { name: m('Jaya (जया)', 'जया'), members: '3, 8, 13', text: m('Victory and fortitude', 'विजय और धैर्य'), hue: 'lotus' },
      { name: m('Rikta (रिक्ता)', 'रिक्ता'), members: '4, 9, 14', text: m('Emptying and purifying', 'रिक्त करना, शुद्धि'), hue: 'gold' },
      { name: m('Poorna (पूर्णा)', 'पूर्णा'), members: '5, 10, 15/30', text: m('Fullness and mastery', 'पूर्णता और सिद्धि'), hue: 'saffron' },
    ],
    faqs: PAGE_FAQS.tithis ?? [],
  },
  nakshatras: {
    id: 'nakshatras',
    title: m('27 nakshatras', '27 नक्षत्र'),
    singular: S.limbNakshatra,
    eyebrow: m('Lunar mansions', 'चन्द्र के भवन'),
    count: NAKSHATRA_DATA.length,
    hue: 'peacock',
    icon: 'sparkles',
    intro: m(
      'The 27 celestial asterisms of the Taittiriya Brahmana Nakshatra Sukta. Each lunar mansion has its own presiding Vedic deity, planetary lord and theme for contemplation.',
      'तैत्तिरीय ब्राह्मण के नक्षत्र सूक्त के 27 नक्षत्र। हर नक्षत्र के अपने अधिष्ठाता देवता, ग्रह स्वामी और चिन्तन का विषय हैं।',
    ),
    foundations: [
      {
        title: m('13°20′ each', 'हर नक्षत्र 13°20′'),
        text: m(
          'Each nakshatra spans exactly 13 degrees and 20 minutes of arc. 27 nakshatras complete the full 360-degree circle of the heavens.',
          'हर नक्षत्र ठीक 13 अंश 20 कला का होता है। 27 नक्षत्र मिलकर आकाश का पूरा 360 अंश का वृत्त बनाते हैं।',
        ),
      },
      {
        title: m('4 padas per star', 'हर नक्षत्र के 4 चरण'),
        text: m(
          'Each nakshatra is divided into 4 quarters (padas) of 3°20′, which together match the 108 beads of the japa mala.',
          'हर नक्षत्र 3°20′ के 4 चरणों में बँटा है। सब मिलाकर 108 चरण, जपमाला के 108 मनकों जैसे।',
        ),
      },
      {
        title: m('Taittiriya Sukta', 'तैत्तिरीय सूक्त'),
        text: m(
          'In Taittiriya Brahmana 3.1.4 each star is paired with its Vedic devata (Agni, Prajapati, Soma, Rudra) for invocation.',
          'तैत्तिरीय ब्राह्मण 3.1.4 में हर नक्षत्र अपने वैदिक देवता (अग्नि, प्रजापति, सोम, रुद्र) के साथ जुड़ा है।',
        ),
      },
    ],
    faqs: PAGE_FAQS.nakshatras ?? [],
  },
  yogas: {
    id: 'yogas',
    title: m('27 nitya yogas', '27 नित्य योग'),
    singular: S.limbYoga,
    eyebrow: m('Sun and Moon together', 'सूर्य और चन्द्र का योग'),
    count: YOGA_DATA.length,
    hue: 'gold',
    icon: 'infinite',
    intro: m(
      'The additive harmony of the Sun (soul) and the Moon (mind). The 27 solar-lunar arcs of the Vedic sky, their presiding deities and guidance for svadhyaya.',
      'सूर्य (आत्मा) और चन्द्र (मन) का जोड़। वैदिक आकाश के 27 योग, उनके देवता और स्वाध्याय का मार्गदर्शन।',
    ),
    foundations: [
      {
        title: m('Moon + Sun', 'चन्द्र + सूर्य'),
        text: m(
          'Yoga means union or addition. A tithi measures the separation of the Moon from the Sun (Moon − Sun); a nitya yoga measures their sum (Moon + Sun). Yoga index = ⌊(Moon longitude + Sun longitude) ÷ 13°20′⌋.',
          'योग का अर्थ है जोड़। तिथि चन्द्र और सूर्य का अन्तर मापती है (चन्द्र − सूर्य), नित्य योग उनका जोड़ (चन्द्र + सूर्य)। योग क्रमांक = ⌊(चन्द्र भोगांश + सूर्य भोगांश) ÷ 13°20′⌋।',
        ),
      },
      {
        title: m('Self and mind', 'आत्मा और मन'),
        text: m(
          'The Sun stands for the Self (Atman) and vital fire, the Moon for the reflective mind (Manas). Their sum is the combined inner climate of the day, and each yoga has a presiding deity to guide the day’s focus.',
          'सूर्य आत्मा और प्राण-अग्नि का प्रतीक है, चन्द्र मनन करते मन का। दोनों का योग दिन का भीतरी वातावरण है, और हर योग के देवता उस दिन के ध्यान की दिशा देते हैं।',
        ),
      },
    ],
    faqs: PAGE_FAQS.yogas ?? [],
  },
  karanas: {
    id: 'karanas',
    title: m('11 karanas', '11 करण'),
    singular: S.limbKarana,
    eyebrow: m('Half-tithis', 'आधी तिथि'),
    count: getAllKaranas().length,
    hue: 'lotus',
    icon: 'git-commit',
    intro: m(
      'The micro-rhythm of the lunar month. Each karana spans half of a tithi (6° of elongation): 7 movable (Chara) karanas that repeat and 4 fixed (Sthira) ones.',
      'चान्द्र मास की सूक्ष्म लय। हर करण आधी तिथि (6 अंश) का होता है: 7 चर करण जो दोहराते हैं, और 4 स्थिर करण।',
    ),
    foundations: [
      {
        title: m('The recurring cycle', 'दोहराता चक्र'),
        text: m(
          'The 7 Chara karanas repeat in succession 8 times across the 30 lunar days (7 × 8 = 56 half-tithis).',
          '7 चर करण 30 तिथियों में क्रम से 8 बार आते हैं (7 × 8 = 56 आधी तिथियाँ)।',
        ),
      },
      {
        title: m('The dark-phase anchors', 'अमावस्या के आसपास'),
        text: m(
          'The 4 Sthira karanas come exactly once a month, bridging Krishna Chaturdashi, Amavasya and Shukla Pratipada.',
          '4 स्थिर करण महीने में ठीक एक बार आते हैं, कृष्ण चतुर्दशी, अमावस्या और शुक्ल प्रतिपदा के बीच।',
        ),
      },
      {
        title: m('Vishti (Bhadra)', 'विष्टि (भद्रा)'),
        text: m(
          'The 7th movable karana, Vishti, is known as Bhadra and recurs 8 times a month. Muhurta texts keep it for remedies, cleaning, fasting and meditation on Shiva or Hanuman, and defer celebratory beginnings.',
          '7वाँ चर करण विष्टि, भद्रा कहलाता है और महीने में 8 बार आता है। मुहूर्त ग्रन्थ इसे उपचार, सफ़ाई, उपवास और शिव या हनुमान के ध्यान के लिए रखते हैं, और शुभ आरम्भ टालते हैं।',
        ),
      },
    ],
    faqs: PAGE_FAQS.karanas ?? [],
  },
  varas: {
    id: 'varas',
    title: m('The seven varas', 'सप्त वार'),
    singular: S.limbVara,
    eyebrow: m('Planetary weekdays', 'ग्रहों के वार'),
    count: VARA_DATA.length,
    hue: 'saffron',
    icon: 'sunny',
    intro: m(
      'The seven planetary weekdays of Vedic astronomy and the classical hora system: their celestial lords, elements, traditional fasts and study guidance.',
      'वैदिक ज्योतिष के सात वार और होरा पद्धति: उनके ग्रह स्वामी, तत्त्व, पारम्परिक व्रत और स्वाध्याय का मार्गदर्शन।',
    ),
    foundations: [
      {
        title: m('The 24 horas', 'होरा चक्र'),
        text: m(
          'A solar day has 24 horas. Planets rule successive hours in order of speed: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The planet of the sunrise hour rules the day.',
          'एक दिन में 24 होरा होती हैं। ग्रह गति के क्रम से होरा के स्वामी होते हैं: शनि, गुरु, मंगल, सूर्य, शुक्र, बुध, चन्द्र। सूर्योदय की होरा का ग्रह पूरे दिन का स्वामी होता है।',
        ),
      },
      {
        title: m('Sunrise to sunrise', 'सूर्योदय से सूर्योदय'),
        text: m(
          'Unlike a civil date that turns at midnight, a Vedic vara lasts from one local sunrise to the next.',
          'मध्यरात्रि से बदलने वाली तारीख़ से अलग, वैदिक वार एक स्थानीय सूर्योदय से अगले सूर्योदय तक रहता है।',
        ),
      },
      {
        title: m('वारादायुरुवाप्नोति', 'वारादायुरुवाप्नोति'),
        text: m(
          'Classical Jyotisha texts say that living in step with the day’s planetary lord keeps vitality and grants long life (ayush).',
          'शास्त्रीय ज्योतिष ग्रन्थ कहते हैं कि वार के स्वामी के अनुरूप दिनचर्या ऊर्जा बनाए रखती है और आयु देती है।',
        ),
      },
    ],
    faqs: PAGE_FAQS.varas ?? [],
  },
};

export const CALENDAR_FAQS: PageFaq[] = PAGE_FAQS.calendar ?? [];

const TITHI_HUE: Record<string, Hue> = { Nanda: 'tulsi', Bhadra: 'indigo', Jaya: 'lotus', Rikta: 'gold', Poorna: 'saffron' };
const YOGA_HUE: Record<string, Hue> = { Auspicious: 'tulsi', Neutral: 'indigo', 'Challenging / Reflective': 'gold' };
const GUNA_HUE: Record<string, Hue> = { Sattva: 'tulsi', Rajas: 'saffron', Tamas: 'indigo' };

/** The website's arc text for nakshatra n: 13°20′ each, from 0°. */
export function nakshatraArc(index: number): string {
  const at = (i: number) => `${i * 13 + Math.floor((i * 20) / 60)}°${String((i * 20) % 60).padStart(2, '0')}'`;
  return `${at(index)} – ${at(index + 1)}`;
}

const VRATA_BY_TITHI: Record<string, LimbEntry['vrata']> = {
  ekadashi: 'ekadashi',
  trayodashi: 'pradosh',
  purnima: 'purnima',
  amavasya: 'amavasya',
};

/** A website link inside the data (/mantras/<slug>/) as the app's own screen, when the app has it. */
function appHref(href: string | undefined): Href | undefined {
  const mantra = href && /^\/mantras\/([^/]+)\/?$/.exec(href)?.[1];
  if (mantra && SACRED_MANTRAS.some((x) => x.slug === mantra)) return { pathname: '/explore/mantras/[id]', params: { id: mantra } };
  return undefined;
}

function tithis(lang: Lang): LimbEntry[] {
  return UNIQUE_TITHI_ARCHETYPES.map((t) => ({
    slug: t.slug,
    number: t.number,
    name: t.name,
    nameHi: t.nameHi,
    translit: t.transliteration,
    line: lang === 'hi' ? t.deityHi : t.deity,
    group: { label: lang === 'hi' ? t.categoryTypeHi : t.categoryType, hue: TITHI_HUE[t.categoryType] ?? 'saffron' },
    facts: [
      { label: S.gDeity, value: lang === 'hi' ? `${t.deityHi} (${t.deity})` : t.deity },
      { label: S.gTithiClass, value: `${t.categoryType} · ${t.categoryTypeHi}` },
      { label: S.gNature, value: t.categoryMeaning },
      { label: S.gArc, value: t.lunarDegrees },
      {
        label: S.gFortnights,
        value: [t.shuklaName, t.krishnaName].filter(Boolean).join(' · '),
      },
    ],
    explanation: t.explanation,
    focus: t.spiritualFocus,
    lists: t.famousObservances.length ? [{ title: S.gObservances, items: t.famousObservances.map((text) => ({ text })) }] : [],
    vrata: VRATA_BY_TITHI[t.slug],
  }));
}

function nakshatras(lang: Lang): LimbEntry[] {
  return NAKSHATRA_DATA.map((n) => ({
    slug: nakshatraSlug(n.name),
    number: n.index + 1,
    name: n.name,
    nameHi: n.nameHi,
    translit: n.transliteration,
    line: n.deity,
    group: { label: n.rulingPlanet, hue: 'peacock' as Hue },
    facts: [
      { label: S.gDeity, value: n.deity },
      { label: S.gRulingPlanet, value: n.rulingPlanet },
      { label: S.gSymbol, value: n.symbol },
      { label: S.gZodiacArc, value: nakshatraArc(n.index) },
      ...(n.rashiSpan ? [{ label: S.gRashi, value: (lang === 'hi' && n.rashiSpanHi) || n.rashiSpan }] : []),
    ],
    explanation: n.explanation,
    focus: n.studyTheme,
    note: n.vedicCitation ? { title: S.gCitation, text: m(n.vedicCitation, n.vedicCitation) } : undefined,
    lists: [],
  }));
}

function yogas(lang: Lang): LimbEntry[] {
  return YOGA_DATA.map((y) => ({
    slug: y.slug,
    number: y.index + 1,
    name: y.name,
    nameHi: y.nameHi,
    translit: y.transliteration,
    line: lang === 'hi' ? y.deityHi : y.deity,
    group: { label: lang === 'hi' ? y.natureHi : y.nature, hue: YOGA_HUE[y.nature] ?? 'gold' },
    facts: [
      { label: S.gDeity, value: lang === 'hi' ? `${y.deityHi} (${y.deity})` : y.deity },
      { label: S.gNature, value: `${y.nature} · ${y.natureHi}` },
      { label: S.gArc, value: y.arc },
    ],
    explanation: y.explanation,
    focus: y.spiritualFocus,
    lists: [],
  }));
}

const BHADRA_NOTE = m(
  'In the Muhurta Chintamani and Brihat Samhita, Vishti Karana (Bhadra) is governed by the fiery energy of Yama and Chhaya. Commercial undertakings, travel, weddings and housewarmings (griha pravesha) are paused. Spiritual japa, health remedies, fasting and contemplation of Lord Shiva or Hanuman are highly praised.',
  'मुहूर्त चिन्तामणि और बृहत्संहिता में विष्टि करण (भद्रा) यम और छाया की उग्र ऊर्जा से जुड़ा है। व्यापार, यात्रा, विवाह और गृह प्रवेश इस समय रोके जाते हैं। जप, उपचार, उपवास और भगवान शिव या हनुमान का ध्यान बहुत प्रशंसित है।',
);

function karanas(lang: Lang): LimbEntry[] {
  return getAllKaranas().map((k, i) => ({
    slug: k.slug,
    number: i + 1,
    name: k.name,
    nameHi: k.nameHi,
    translit: k.transliteration,
    line: lang === 'hi' ? k.deityHi : k.deity,
    group: { label: lang === 'hi' ? k.natureHi : k.nature, hue: k.nature.startsWith('Chara') ? 'peacock' : 'lotus' },
    facts: [
      { label: S.gDeity, value: lang === 'hi' ? `${k.deityHi} (${k.deity})` : k.deity },
      { label: S.gNature, value: `${k.nature} · ${k.natureHi}` },
      { label: S.gOccurrence, value: k.occurrence },
    ],
    explanation: k.explanation,
    focus: k.spiritualFocus,
    note: k.slug === 'vishti' ? { title: S.gBhadra, text: BHADRA_NOTE } : undefined,
    lists: [],
  }));
}

function varas(lang: Lang): LimbEntry[] {
  const hi = lang === 'hi';
  return VARA_DATA.map((v) => ({
    slug: v.slug,
    number: v.index + 1,
    name: v.name,
    nameHi: v.nameHi,
    translit: v.transliteration,
    line: hi ? v.grahaLordHi : v.grahaLord,
    group: { label: hi ? v.gunaHi : v.guna, hue: GUNA_HUE[v.guna] ?? 'saffron' },
    facts: [
      { label: S.gLord, value: hi ? v.grahaLordHi : v.grahaLord },
      { label: S.gDeity, value: hi ? v.deityHi : v.deity },
      { label: S.gElement, value: hi ? v.elementHi : v.element },
      { label: S.gGuna, value: `${v.guna} · ${v.gunaHi}` },
      { label: S.gNature, value: hi ? v.natureHi : v.nature },
      { label: S.gGemMetal, value: hi ? `${v.gemstoneHi} · ${v.metalHi}` : `${v.gemstone} · ${v.metal}` },
      { label: S.gColour, value: hi ? v.colorHi : v.color },
      { label: S.gSynonyms, value: v.synonyms.join(' · ') },
    ],
    explanation: v.explanation,
    focus: v.spiritualFocus,
    lists: [
      { title: S.gFasts, items: v.sacredFasts.map((text) => ({ text })) },
      { title: S.gStotras, items: v.recommendedStotras.map((s) => ({ text: s.title, href: appHref(s.href) })) },
    ].filter((l) => l.items.length > 0),
  }));
}

const BUILDERS: Record<LimbId, (lang: Lang) => LimbEntry[]> = { tithis, nakshatras, yogas, karanas, varas };
const cache = new Map<string, LimbEntry[]>();

/** Every entry of one limb, in the website's order, with labels in the reader's language. */
export function limbEntries(limb: LimbId, lang: Lang): LimbEntry[] {
  const key = `${limb}:${lang}`;
  let list = cache.get(key);
  if (!list) {
    list = BUILDERS[limb](lang);
    cache.set(key, list);
  }
  return list;
}

export function limbEntry(limb: LimbId, slug: string, lang: Lang): { entry: LimbEntry; prev: LimbEntry; next: LimbEntry } | null {
  const list = limbEntries(limb, lang);
  const i = list.findIndex((e) => e.slug === slug);
  if (i < 0) return null;
  return { entry: list[i], prev: list[(i - 1 + list.length) % list.length], next: list[(i + 1) % list.length] };
}

/** Which entry of each limb a day falls on, as the slugs of the reference pages (the website's calendar links). */
export function daySlugs(p: PanchangDayData): Record<LimbId, string> {
  const n = p.tithi.number;
  const tithi =
    n === 15
      ? 'purnima'
      : n === 30
        ? 'amavasya'
        : (UNIQUE_TITHI_ARCHETYPES.find((t) => t.shuklaNumber === n || t.krishnaNumber === n)?.slug ?? 'pratipada');
  return {
    tithis: tithi,
    nakshatras: nakshatraSlug(p.nakshatra.name),
    yogas: YOGA_DATA[p.yoga.index]?.slug ?? 'vishkambha',
    karanas: getAllKaranas().find((k) => k.name === p.karana.name)?.slug ?? 'bava',
    varas: p.vara.slug,
  };
}

/** Whether a piece of website text is mostly Devanagari (the FAQs are in Hindi on some pages, English on others). */
export function isMostlyHindi(text: string): boolean {
  const deva = (text.match(/[ऀ-ॿ]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return deva > latin;
}

export type { PageFaq };

/** The calendar page's three principles (app/panchang/calendar/page.tsx "The Architecture of the Lunisolar Calendar"). */
export const CALENDAR_PRINCIPLES: { title: Msg; text: Msg; hue: Hue; icon: 'sunny' | 'moon' | 'compass' }[] = [
  {
    title: m('Solar month (Sankranti)', 'सौर मास (संक्रान्ति)'),
    text: m(
      'Counted from the Sun’s entry into one of the 12 sidereal signs (rashi). It governs the seasons (ritus), the farming year and the turn of the ayana.',
      'सूर्य के 12 राशियों में से किसी एक में प्रवेश से गिना जाता है। ऋतुएँ, खेती का वर्ष और अयन इसी से चलते हैं।',
    ),
    hue: 'gold',
    icon: 'sunny',
  },
  {
    title: m('Lunar month (Paksha)', 'चान्द्र मास (पक्ष)'),
    text: m(
      'Begins either from Amavasya (the Amanta tradition of western and southern India) or from Purnima (Purnimanta, in the north). It governs fasts, vrats and festivals.',
      'अमावस्या से (पश्चिम और दक्षिण भारत की अमान्त परम्परा) या पूर्णिमा से (उत्तर भारत की पूर्णिमान्त परम्परा) आरम्भ होता है। व्रत, उपवास और पर्व इसी से तय होते हैं।',
    ),
    hue: 'indigo',
    icon: 'moon',
  },
  {
    title: m('The Udaya Tithi rule', 'उदय तिथि नियम'),
    text: m(
      'The lunar day current at local sunrise governs that whole civil day for fasts, temple worship and ritual, even if the tithi changes minutes after dawn.',
      'स्थानीय सूर्योदय के समय जो तिथि हो, वही उस पूरे दिन के व्रत, पूजा और अनुष्ठान के लिए मानी जाती है, चाहे तिथि सूर्योदय के कुछ ही मिनट बाद बदल जाए।',
    ),
    hue: 'tulsi',
    icon: 'compass',
  },
];

/** The lunar months each civil month spans, as the website calendar's header (CalendarClient.tsx MONTH_NAMES). */
export const MASA_SPANS = [
  'पौष – माघ',
  'माघ – फाल्गुन',
  'फाल्गुन – चैत्र',
  'चैत्र – वैशाख',
  'वैशाख – ज्येष्ठ',
  'ज्येष्ठ – आषाढ़',
  'आषाढ़ – श्रावण',
  'श्रावण – भाद्रपद',
  'भाद्रपद – आश्विन',
  'आश्विन – कार्तिक',
  'कार्तिक – मार्गशीर्ष',
  'मार्गशीर्ष – पौष',
];

/** The years the website's calendar covers (its festival and vrat tables run 2026 to 2028). */
export const CALENDAR_FIRST_YEAR = 2026;
export const CALENDAR_LAST_YEAR = 2028;

export type DayMarker = 'festival' | 'ekadashi' | 'pradosh' | 'purnima' | 'amavasya';

/** The website calendar's markers for a tithi (CalendarClient.tsx dayMarkers): Pradosh is not shown on an Ekadashi. */
export function tithiMarkers(tithi: number, hasFestival: boolean): DayMarker[] {
  const out: DayMarker[] = [];
  if (hasFestival) out.push('festival');
  const ekadashi = tithi === 11 || tithi === 26;
  if (ekadashi) out.push('ekadashi');
  if ((tithi === 13 || tithi === 28) && !ekadashi) out.push('pradosh');
  if (tithi === 15) out.push('purnima');
  if (tithi === 30) out.push('amavasya');
  return out;
}
