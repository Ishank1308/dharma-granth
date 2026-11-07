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
  | 'vijaya'
  | 'ayodhya'
  | 'exile'
  | 'aranya'
  | 'kishkindha'
  | 'sundara'
  | 'yuddha'
  | 'uttara'
  | 'yama-door'
  | 'shreya-preya'
  | 'ratha'
  | 'inner-flame'
  | 'jyoti'
  | 'cosmic-ocean'
  | 'devi-battle'
  | 'devi-victory'
  | 'devi-stuti'
  | 'devi-himalaya'
  | 'kali'
  | 'sky-battle';

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
  ayodhya: { en: 'Ayodhya on the banks of the Sarayu', hi: 'सरयू के तट पर अयोध्या' },
  exile: { en: 'Rama, Sita and Lakshmana on the road to the forest', hi: 'वन की राह पर राम, सीता और लक्ष्मण' },
  aranya: { en: 'The leaf hut at Panchavati and the golden deer', hi: 'पंचवटी की पर्णशाला और स्वर्णमृग' },
  kishkindha: { en: 'The hills of Kishkindha above Lake Pampa', hi: 'पंपा सरोवर के ऊपर किष्किन्धा के पर्वत' },
  sundara: { en: 'Hanuman leaping the ocean towards Lanka', hi: 'समुद्र लाँघकर लंका की ओर हनुमान' },
  yuddha: { en: 'The bridge of stones across the sea to Lanka', hi: 'समुद्र पर लंका तक पत्थरों का सेतु' },
  uttara: { en: 'Ayodhya rejoicing at the return, petals falling', hi: 'लौटने के उत्सव में अयोध्या, झरते पुष्प' },
  'yama-door': { en: 'Nachiketa waiting three nights at Yama’s door', hi: 'यम के द्वार पर तीन रात प्रतीक्षा करते नचिकेता' },
  'shreya-preya': { en: 'Two paths: the good and the pleasant', hi: 'दो मार्ग: श्रेय और प्रेय' },
  ratha: { en: 'The chariot of the body, the senses its horses', hi: 'शरीर रूपी रथ, इन्द्रियाँ उसके घोड़े' },
  'inner-flame': { en: 'The inner self, a smokeless flame', hi: 'अंतरात्मा, धूमरहित ज्योति' },
  jyoti: { en: 'All this shines by His light alone', hi: 'उसी के प्रकाश से यह सब प्रकाशित है' },
  'cosmic-ocean': { en: 'Vishnu asleep on Shesha in the cosmic ocean', hi: 'एकार्णव में शेषशायी विष्णु' },
  'devi-battle': { en: 'The Devi’s trident over the field of battle', hi: 'रणभूमि पर देवी का त्रिशूल' },
  'devi-victory': { en: 'The trident blazing on the mountain', hi: 'पर्वत पर दीप्त त्रिशूल' },
  'devi-stuti': { en: 'The gods’ hymn, petals falling in radiance', hi: 'देवताओं की स्तुति, प्रकाश में झरते पुष्प' },
  'devi-himalaya': { en: 'The gods praying to the Devi on the Himalaya', hi: 'हिमालय पर देवताओं की देवी-स्तुति' },
  kali: { en: 'Kali springing from storm-dark clouds', hi: 'घने काले मेघों से प्रकट काली' },
  'sky-battle': { en: 'The last battle fought in the sky', hi: 'आकाश में अंतिम युद्ध' },
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
  // Vālmīki Rāmāyaṇa: chapter = kāṇḍa.
  ramayana: {
    1: 'ayodhya', // Bāla: Ayodhyā described (1.5), Rāma's birth and youth
    2: 'exile', // Ayodhyā: the departure into exile
    3: 'aranya', // Araṇya: Pañcavaṭī, Mārīca as the golden deer
    4: 'kishkindha', // Kiṣkindhā: Pampā, Ṛṣyamūka, the alliance with Sugrīva
    5: 'sundara', // Sundara: Hanumān's leap to Laṅkā (5.1)
    6: 'yuddha', // Yuddha: the setu (6.22) and the war
    7: 'uttara', // Uttara: Rāma's reign in Ayodhyā
  },
  // Kaṭha Upaniṣad: chapter = vallī (1–3 in adhyāya 1, 4–6 in adhyāya 2).
  katha: {
    1: 'yama-door', // 1.1.9: three nights at Yama's house
    2: 'shreya-preya', // 1.2.1–2: śreyas and preyas
    3: 'ratha', // 1.3.3–4: ātmānaṁ rathinaṁ viddhi
    4: 'inner-flame', // 2.1.12–13: aṅguṣṭha-mātraḥ puruṣaḥ, jyotir ivādhūmakaḥ
    5: 'jyoti', // 2.2.15: tasya bhāsā sarvam idaṁ vibhāti
    6: 'ashvattha', // 2.3.1: ūrdhva-mūlo 'vāk-śākha eṣo 'śvatthaḥ
  },
  // Durgā Saptaśatī: chapter = adhyāya.
  durgasaptashati: {
    1: 'cosmic-ocean', // 1.49–1.67: Madhu and Kaiṭabha, Viṣṇu in yoga-nidrā
    2: 'devi-battle', // 2: Mahiṣāsura's army destroyed
    3: 'devi-victory', // 3: Mahiṣāsura slain
    4: 'devi-stuti', // 4: Śakrādi stuti
    5: 'devi-himalaya', // 5.7–5.8: the gods go to Himālaya; yā devī sarvabhūteṣu
    6: 'devi-battle', // 6: Dhūmralocana
    7: 'kali', // 7.5–7.6: Kālī springs from the Devī's brow
    8: 'devi-battle', // 8: Raktabīja
    9: 'devi-battle', // 9: Niśumbha
    10: 'sky-battle', // 10.24–10.26: the fight in the sky with Śumbha
    11: 'devi-stuti', // 11: Nārāyaṇī stuti
    12: 'offering', // 12: the fruits of reading and worship
    13: 'diyas', // 13: Suratha and Samādhi worship on the riverbank
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
