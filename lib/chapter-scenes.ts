/**
 * The scene behind a chapter's verse cards: what the chapter is set in, or the
 * image its best-known verse gives (Gita 5.10's lotus leaf, 15.1's inverted
 * aśvattha). The chapter page and the verse page put `data-scene` on their
 * wrapper; app/styles/scenes.css draws the scene behind every Sanskrit panel
 * inside it from the layers in app/styles/scenes/ (scripts/build-chapter-scenes.mjs).
 *
 * A scene is decoration only: it is drawn in CSS, carries no text, adds nothing
 * to each verse's HTML, and stands still under reduced motion and the quiet modes.
 */

export type SceneId =
  | 'kurukshetra'
  | 'chariot'
  | 'yajna'
  | 'sunrise'
  | 'lotus'
  | 'dhyana'
  | 'pearls'
  | 'two-paths'
  | 'offering'
  | 'himalaya'
  | 'vishvarupa'
  | 'diyas'
  | 'field'
  | 'gunas'
  | 'ashvattha'
  | 'dawn-storm'
  | 'vijaya';

export interface SceneInfo {
  /** What the reader sees, in English and Hindi. */
  en: string;
  hi: string;
}

export const SCENES: Record<SceneId, SceneInfo> = {
  kurukshetra: { en: 'Two armies drawn up on the field of Kurukshetra', hi: 'कुरुक्षेत्र में आमने-सामने खड़ी दो सेनाएँ' },
  chariot: { en: 'Krishna’s chariot between the two armies', hi: 'दोनों सेनाओं के बीच श्रीकृष्ण का रथ' },
  yajna: { en: 'The sacrificial fire, sparks rising', hi: 'यज्ञ की अग्नि और उठती चिनगारियाँ' },
  sunrise: { en: 'The sun rising, to whom this yoga was first taught', hi: 'उगता सूर्य, जिसे यह योग पहले कहा गया' },
  lotus: { en: 'Lotus leaves on water, wet yet untouched', hi: 'जल में कमल-पत्र, जल से अछूता' },
  dhyana: { en: 'A yogi seated in the mountains beside a still lamp', hi: 'पर्वतों में ध्यानस्थ योगी और निर्वात दीप' },
  pearls: { en: 'Pearls strung on a single thread', hi: 'एक सूत्र में पिरोए मणि' },
  'two-paths': { en: 'The bright and the dark paths, under sun and moon', hi: 'सूर्य और चंद्र के शुक्ल और कृष्ण मार्ग' },
  offering: { en: 'A leaf, a flower, a fruit and water, offered with love', hi: 'पत्र, पुष्प, फल और जल का प्रेम से अर्पण' },
  himalaya: { en: 'The Himalaya and the Ganga', hi: 'हिमालय और गंगा' },
  vishvarupa: { en: 'A radiance like a thousand suns at once', hi: 'सहस्र सूर्यों जैसा एक साथ उठता प्रकाश' },
  diyas: { en: 'Lamps floating on the river, petals falling', hi: 'नदी पर तैरते दीप और झरती पंखुड़ियाँ' },
  field: { en: 'The field and the knower of the field', hi: 'क्षेत्र और क्षेत्रज्ञ' },
  gunas: { en: 'Three strands braided together', hi: 'आपस में गुँथे तीन गुण' },
  ashvattha: { en: 'The aśvattha tree, roots above and branches below', hi: 'ऊपर जड़ और नीचे शाखाओं वाला अश्वत्थ' },
  'dawn-storm': { en: 'Dawn breaking through storm clouds', hi: 'घने बादलों को चीरता प्रभात' },
  vijaya: { en: 'The chariot at sunrise, where Krishna and Arjuna stand', hi: 'जहाँ श्रीकृष्ण और अर्जुन हैं, वहाँ उगता सूर्य' },
};

/** Scripture id → chapter number → scene. Chapters not listed get no scene. */
const CHAPTER_SCENES: Record<string, Record<number, SceneId>> = {
  bhagavadgita: {
    1: 'kurukshetra', // 1.1–1.20: the armies arrayed, conches blown
    2: 'chariot', // 1.24, 2.10: the chariot halted between the armies
    3: 'yajna', // 3.9–3.16: action as yajña, the wheel of offering
    4: 'sunrise', // 4.1: this yoga taught first to Vivasvān
    5: 'lotus', // 5.10: padma-patram ivāmbhasā
    6: 'dhyana', // 6.11–6.19: the seat, the lamp in a windless place
    7: 'pearls', // 7.7: sūtre maṇi-gaṇā iva
    8: 'two-paths', // 8.24–8.26: śukla and kṛṣṇa gati
    9: 'offering', // 9.26: patraṁ puṣpaṁ phalaṁ toyam
    10: 'himalaya', // 10.25, 10.31: sthāvarāṇāṁ himālayaḥ, srotasām asmi jāhnavī
    11: 'vishvarupa', // 11.12: divi sūrya-sahasrasya
    12: 'diyas', // 12.13–12.20: the devotee dear to Krishna
    13: 'field', // 13.1–13.2: kṣetra and kṣetrajña
    14: 'gunas', // 14.5: sattva, rajas, tamas bind the embodied
    15: 'ashvattha', // 15.1: ūrdhva-mūlam adhaḥ-śākham
    16: 'dawn-storm', // 16.1–16.6: the divine and the demonic natures
    17: 'yajna', // 17.11–17.13: the three kinds of yajña
    18: 'vijaya', // 18.78: yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanur-dharaḥ
  },
};

export function chapterScene(scriptureId: string, chapterId: number): SceneId | undefined {
  return CHAPTER_SCENES[scriptureId]?.[chapterId];
}

/** Spread onto the page wrapper: `<main {...sceneAttrs(id, chapter)}>`. */
export function sceneAttrs(scriptureId: string, chapterId: number): { 'data-scene'?: SceneId } {
  const scene = chapterScene(scriptureId, chapterId);
  return scene ? { 'data-scene': scene } : {};
}

/** Every scripture that has scenes, and its mapped chapters (for tests and docs). */
export function scenesFor(scriptureId: string): Readonly<Record<number, SceneId>> {
  return CHAPTER_SCENES[scriptureId] ?? {};
}
