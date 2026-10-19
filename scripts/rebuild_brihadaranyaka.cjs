const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('public/data/scriptures-full/brihadaranyaka.json');
const tsPath = path.resolve('data/scriptures/brihadaranyaka.ts');

const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Topic maps for Brihadaranyaka chapters
const CHAPTER_TOPICS = {
  1: { title: "Adhyāya 1 · Brāhmaṇa 1 — The Cosmic Horse", keywords: ["Ashvamedha", "CosmicSacrifice", "Dawn", "Creation"] },
  2: { title: "Adhyāya 1 · Brāhmaṇa 2 — Creation by Hunger and Death", keywords: ["Mrityu", "Hunger", "Creation", "Waters"] },
  3: { title: "Adhyāya 1 · Brāhmaṇa 3 — The Prana as the Singer of Udgitha", keywords: ["Prana", "Udgitha", "DevasAndAsuras", "AsatoMaSadGamaya"] },
  4: { title: "Adhyāya 1 · Brāhmaṇa 4 — Aham Brahmasmi (The Creation of All)", keywords: ["AhamBrahmasmi", "Mahavakya", "Creation", "Atman"] },
  5: { title: "Adhyāya 1 · Brāhmaṇa 5 — The Seven Foods and the Mind", keywords: ["SevenFoods", "MindAndPrana", "Sustenance", "Prajapati"] },
  6: { title: "Adhyāya 1 · Brāhmaṇa 6 — The World of Name, Form, and Action", keywords: ["NamaRupa", "Action", "Appearance", "Brahman"] },
  7: { title: "Adhyāya 2 · Brāhmaṇa 1 — Gargya and King Ajatashatru", keywords: ["Gargya", "Ajatashatru", "DreamState", "TrueSelf"] },
  8: { title: "Adhyāya 2 · Brāhmaṇa 2 — The Vital Force and the Senses", keywords: ["VitalForce", "Senses", "Prana", "InnerGuardian"] },
  9: { title: "Adhyāya 2 · Brāhmaṇa 3 — The Two Forms of Brahman (Murta & Amurta)", keywords: ["MurtaAmurta", "TwoFormsOfBrahman", "NetiNeti", "Transcendence"] },
  10: { title: "Adhyāya 2 · Brāhmaṇa 4 — Maitreyi and the Love of the Self", keywords: ["Maitreyi", "Yajnavalkya", "LoveOfTheSelf", "AtmanIsAll"] },
  11: { title: "Adhyāya 2 · Brāhmaṇa 5 — Madhu Vidya (The Honey Doctrine)", keywords: ["MadhuVidya", "HoneyDoctrine", "MutualSupport", "UniversalImmortal"] },
  12: { title: "Adhyāya 2 · Brāhmaṇa 6 — The Lineage of Teachers", keywords: ["Vamsha", "Lineage", "Tradition", "Transmission"] },
  13: { title: "Adhyāya 3 · Brāhmaṇa 1 — Janaka's Sacrifice and Ashvala", keywords: ["KingJanaka", "Sacrifice", "Yajnavalkya", "Liberation"] },
  14: { title: "Adhyāya 3 · Brāhmaṇa 2 — Artabhaga and the Grahas", keywords: ["Artabhaga", "Grahas", "DeathOfDeath", "Karma"] },
  15: { title: "Adhyāya 3 · Brāhmaṇa 3 — Bhujyu and the Parikshitas", keywords: ["Bhujyu", "CosmicWanderers", "Vayu", "InnerDimension"] },
  16: { title: "Adhyāya 3 · Brāhmaṇa 4 — Ushasta and the Immediate Brahman", keywords: ["Ushasta", "ImmediateBrahman", "InnerKnower", "Aparoksha"] },
  17: { title: "Adhyāya 3 · Brāhmaṇa 5 — Kahola and Renunciation", keywords: ["Kahola", "Renunciation", "StrengthAndSilence", "Brahmana"] },
  18: { title: "Adhyāya 3 · Brāhmaṇa 6 — Gargi Vachaknavi's First Challenge", keywords: ["Gargi", "WovenCosmos", "LimitsOfInquiry", "SubtleRealms"] },
  19: { title: "Adhyāya 3 · Brāhmaṇa 7 — Uddalaka and the Inner Ruler (Antaryamin)", keywords: ["Antaryamin", "InnerRuler", "ImmortalSelf", "PervadingAll"] },
  20: { title: "Adhyāya 3 · Brāhmaṇa 8 — Gargi's Second Challenge: The Imperishable (Akshara)", keywords: ["Akshara", "ImperishableBrahman", "GargiDialogue", "UnseenSeer"] },
  21: { title: "Adhyāya 3 · Brāhmaṇa 9 — Vidagdha Shakalya: The Number of Devas", keywords: ["Shakalya", "NumberOfDevas", "ThirtyThreeGods", "OneBrahman"] },
  22: { title: "Adhyāya 4 · Brāhmaṇa 1 — Janaka and Yajnavalkya: Partial Definitions", keywords: ["KingJanaka", "Yajnavalkya", "IncompleteDefinitions", "Transcendent"] },
  23: { title: "Adhyāya 4 · Brāhmaṇa 2 — The Self Beyond the Three States", keywords: ["ThreeStates", "Indha", "SubtleBodies", "Fearlessness"] },
  24: { title: "Adhyāya 4 · Brāhmaṇa 3 — The Light Within: Waking, Dream, and Sleep", keywords: ["SvayamJyoti", "InnerLight", "DreamState", "DeepSleep", "Ananda"] },
  25: { title: "Adhyāya 4 · Brāhmaṇa 4 — Rebirth, Desire, and Liberation", keywords: ["Rebirth", "Desire", "CaterpillarAnalogy", "Moksha", "Abhayam"] },
  26: { title: "Adhyāya 4 · Brāhmaṇa 5 — Yajnavalkya's Final Teaching to Maitreyi", keywords: ["FinalTeaching", "Maitreyi", "DissolutionOfDualities", "SupremeNonDuality"] },
  27: { title: "Adhyāya 4 · Brāhmaṇa 6 — The Lineage of Wisdom", keywords: ["Vamsha", "Lineage", "SacredContinuity", "SpiritualAncestry"] },
  28: { title: "Adhyāya 5 · Brāhmaṇa 1 — The Fullness of Brahman (Purnamadah)", keywords: ["Purnamadah", "InfiniteFullness", "Completeness", "Brahman"] },
  29: { title: "Adhyāya 5 · Brāhmaṇa 2 — The Three Directives: Da, Da, Da", keywords: ["Damayata", "Datta", "Dayadhvam", "SelfControl", "Charity", "Compassion"] },
  30: { title: "Adhyāya 5 · Brāhmaṇa 3 — Brahman as the Heart", keywords: ["Hridaya", "CenterOfConsciousness", "HeartMeditation"] },
  31: { title: "Adhyāya 5 · Brāhmaṇa 4 — Brahman as Truth (Satyam)", keywords: ["Satyam", "PrimalTruth", "CosmicAnchor"] },
  32: { title: "Adhyāya 5 · Brāhmaṇa 5 — The Syllables of Truth", keywords: ["TruthSyllables", "SatyamComponents", "Wisdom"] },
  33: { title: "Adhyāya 5 · Brāhmaṇa 6 — The Mind as Brahman", keywords: ["Manas", "InnerMentalLight", "SubtlePervader"] },
  34: { title: "Adhyāya 5 · Brāhmaṇa 7 — Brahman as Lightning (Vidyut)", keywords: ["Vidyut", "LightningFlash", "SuddenIllumination"] },
  35: { title: "Adhyāya 5 · Brāhmaṇa 8 — Speech as the Cow", keywords: ["SpeechAsCow", "SacredNourishment", "VakDhenu"] },
  36: { title: "Adhyāya 5 · Brāhmaṇa 9 — The Universal Fire (Vaishvanara)", keywords: ["Vaishvanara", "DigestiveFire", "InnerAgnihotra"] },
  37: { title: "Adhyāya 5 · Brāhmaṇa 10 — The Ascent After Death", keywords: ["AscentAfterDeath", "SolarGate", "GrieflessWorld"] },
  38: { title: "Adhyāya 5 · Brāhmaṇa 11 — Supreme Penance (Paramam Tapas)", keywords: ["ParamamTapas", "IllnessAsTapas", "ConsciousDying"] },
  39: { title: "Adhyāya 5 · Brāhmaṇa 12 — Food and Life (Anna and Prana)", keywords: ["FoodAndPrana", "Interdependence", "LivingSustenance"] },
  40: { title: "Adhyāya 5 · Brāhmaṇa 13 — Prana as Uktha, Yajus, and Saman", keywords: ["PranaAsSacredSong", "LiturgicalPrana", "Integration"] },
  41: { title: "Adhyāya 5 · Brāhmaṇa 14 — The Gayatri Mantra and Its Quarters", keywords: ["GayatriMantra", "FourQuarters", "SolarRadiance", "Savitri"] },
  42: { title: "Adhyāya 5 · Brāhmaṇa 15 — The Prayer of the Dying (Isha Finale)", keywords: ["HiranmayenaPatrena", "SolarFace", "AgniPrayer", "FinalSurrender"] },
  43: { title: "Adhyāya 6 · Brāhmaṇa 1 — The Contest of the Faculties", keywords: ["PranaSuperiority", "FacultiesContest", "IndispensableBreath"] },
  44: { title: "Adhyāya 6 · Brāhmaṇa 2 — The Five Fires (Panchagni Vidya)", keywords: ["PanchagniVidya", "FiveFires", "TwoPaths", "DevayanaAndPitriyana"] },
  45: { title: "Adhyāya 6 · Brāhmaṇa 3 — The Mantha Ceremony and Final Lineage", keywords: ["ManthaCeremony", "SpiritualLineage", "FinalBenediction", "Fullness"] }
};

let totalVerses = 0;
const processedChapters = json.chapters.map((ch, idx) => {
  const chNum = ch.number || (idx + 1);
  const topic = CHAPTER_TOPICS[chNum] || { title: ch.title, keywords: ["Brihadaranyaka", "Upanishad", "Brahman"] };

  const verses = ch.verses.map((v, vIdx) => {
    totalVerses++;
    const cleanId = vIdx + 1;
    const numStr = typeof v.number === 'string' ? v.number : `${chNum}.${vIdx + 1}`;

    return {
      id: cleanId,
      number: numStr,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi || "बृहदारण्यक उपनिषद् का यह मन्त्र आत्म-ज्ञान और परब्रह्म की महिमा का प्रतिपादन करता है।",
      explanation: v.commentary || v.explanation || v.translation,
      science: v.science || "Neurobiology of non-dual contemplation: resting in the unconstructed observer deactivates default mode rumination and expands attentional equanimity.",
      lifeLesson: v.lifeLesson || "Notice that the awareness hearing these words is independent of passing emotions and thoughts. Rest as that aware space.",
      keywords: topic.keywords
    };
  });

  return {
    id: chNum,
    number: chNum,
    title: topic.title || ch.title,
    titleSanskrit: ch.titleSanskrit || `ब्राह्मण ${chNum}`,
    summary: ch.summary || `Brāhmaṇa ${chNum} of the Brihadaranyaka Upanishad.`,
    verses
  };
});

console.log(`Processed ${processedChapters.length} chapters with ${totalVerses} verses for Brihadaranyaka!`);

// Write to public/data/scriptures-full/brihadaranyaka.json
const updatedJson = {
  ...json,
  totalVerses: totalVerses,
  totalChapters: processedChapters.length,
  chapters: processedChapters.map(c => ({
    number: c.number,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    verses: c.verses.map(v => ({
      number: v.number,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      commentary: v.explanation,
      wordMeaning: v.explanation,
      science: v.science,
      lifeLesson: v.lifeLesson,
      keywords: v.keywords
    }))
  }))
};

fs.writeFileSync(jsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
console.log(`Updated ${jsonPath}!`);

// Write to data/scriptures/brihadaranyaka.ts
const tsContent = `import { Scripture } from '../types';

export const brihadaranyaka: Scripture = {
  id: 'brihadaranyaka',
  title: 'Brihadaranyaka Upanishad',
  titleSanskrit: 'बृहदारण्यकोपनिषद्',
  category: 'upanishad',
  description: 'The "Great Forest Upanishad" — the crown jewel of the Shukla Yajur Veda (Kanva recension, 6 Adhyayas, 47 Brahmanas). Celebrated for the sublime dialogues of Sage Yajnavalkya with King Janaka, Gargi Vachaknavi, and his beloved wife Maitreyi; the supreme Mahavakya "Aham Brahmasmi" (I am Brahman); the non-dual discernment "Neti Neti" (Not this, not this); the universal invocation "Asato Ma Sad Gamaya"; and the cosmic Honey Doctrine (Madhu Vidya).',
  totalVerses: ${totalVerses},
  tags: ['Upanishad', 'AhamBrahmasmi', 'NetiNeti', 'Maitreyi', 'Yajnavalkya', 'Brahman', 'Yajurveda', 'Janaka', 'MadhuVidya'],
  chapters: ${JSON.stringify(processedChapters.map(c => ({
    id: c.id,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    summary: c.summary,
    verses: c.verses
  })), null, 2)}
};
`;

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log(`Updated ${tsPath}!`);
