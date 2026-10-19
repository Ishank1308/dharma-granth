const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

const rawSutras = JSON.parse(fs.readFileSync('scripts/narada_sutras.json', 'utf8'));
console.log(`Loaded ${rawSutras.length} sutras from scripts/narada_sutras.json.`);

// English translations mapping for canonical Narada Bhakti Sutras
const EN_TRANSLATIONS = {
  1: "Now, therefore, we shall explain bhakti.",
  2: "That bhakti is of the nature of supreme love for Him.",
  3: "And it is of the nature of immortality.",
  4: "Attaining which a human becomes perfected, immortal, and fully satisfied.",
  5: "Attaining which one desires nothing, grieves for nothing, hates nothing, rejoices in nothing, and is not moved by selfish zeal.",
  6: "Knowing which one becomes intoxicated with bliss, silent in stillness, and rejoicing in the Self.",
  7: "It cannot be of the nature of worldly desire, because it is of the nature of renunciation (nirodha).",
  8: "Renunciation (nirodha), indeed, means the surrender of all worldly and Vedic obligations.",
  9: "In that supreme love, renunciation is single-minded devotion to Him and indifference to all that is contrary to Him.",
  10: "Single-mindedness (ananyatā) is the abandonment of all other shelters.",
  11: "Indifference to what is contrary means performing worldly and scriptural acts in alignment with the Lord.",
  12: "Let the ordinances of scripture be preserved even after devotional surrender is firmly established.",
  13: "Otherwise there is danger of a fall.",
  14: "Social customs and duties regarding food and health may continue, as far as necessary, until the attainment of the highest goal.",
  15: "Now the characteristics of bhakti are described according to different opinions.",
  16: "Love for worship and adoration is bhakti, according to the son of Parashara (Vyasa).",
  17: "Love for holy discourse and divine narratives is bhakti, according to sage Garga.",
  18: "Love that is not inconsistent with the delight in the Self (atmarati) is bhakti, according to sage Shandilya.",
  19: "Narada, however, is of the opinion that bhakti consists in dedicating all activities to the Lord and experiencing intense agony in forgetting Him.",
  20: "There are historic examples of this supreme devotion.",
  21: "As, for instance, in the case of the gopis of Vraja.",
  22: "Even in their case, the reproach of blind passion cannot be made, for they were never unaware of His divine glory.",
  23: "Had they lacked that knowledge of His divinity, their love would have been like the unlawful lust of common paramours.",
  24: "In unlawful lust, happiness consists only in one's own enjoyment.",
  25: "Supreme bhakti is greater than action (karma), greater than knowledge (jnana), and greater than meditation (yoga).",
  26: "Because it is of the nature of the fruit itself of all these disciplines.",
  27: "And also because God dislikes conceit and delights in humility.",
  28: "Some teachers hold that knowledge alone is the means to attain devotion.",
  29: "Others hold that knowledge and devotion are mutually dependent.",
  30: "Narada, however, says that devotion is its own fruit.",
  31: "As is seen in the case of a palace, a meal, and similar things.",
  32: "Neither satisfaction nor joy comes to a king merely by hearing of them without actual realization.",
  33: "Therefore, seekers of liberation should cultivate this supreme love alone.",
  34: "Teachers describe the following as the primary means to attain this devotion.",
  35: "The first means is the renunciation of sensory objects and the abandonment of worldly attachment.",
  36: "Through uninterrupted adoration and remembrance of the Lord.",
  37: "Through listening to and singing the divine glories of the Lord even while engaged in worldly duties.",
  38: "Primarily, however, bhakti is obtained through the grace of great souls (satsanga), or by a fraction of divine grace.",
  39: "The company of great souls is rare, difficult to obtain, infallible, and invaluable.",
  40: "Nevertheless, it is attained solely through the grace of God.",
  41: "Because between God and His devotees there is no difference in nature.",
  42: "Strive, therefore, strive only for the company of the noble and saintly.",
  43: "Evil company should be avoided at all costs.",
  44: "Because it leads to lust, anger, delusion, forgetfulness of duty, destruction of intellect, and total ruin.",
  45: "These negative tendencies, though initially like small ripples, turn into an ocean through evil company.",
  46: "Who crosses beyond Maya? One who renounces worldly association, attends upon the wise, and becomes free from possessiveness.",
  47: "One who resorts to solitude, uproots worldly attachments, rises beyond the three gunas, and renounces anxiety over acquisition and preservation.",
  48: "One who renounces the fruits of actions, surrenders all actions, and transcends the pairs of opposites.",
  49: "One who renounces even the Vedic ceremonies and attains uninterrupted, loving attachment to God.",
  50: "Such a one crosses Maya; indeed, they cross over and help the entire world cross over.",
  51: "The intrinsic nature of supreme love is ineffable and beyond the power of speech to describe.",
  52: "It is like the taste experienced by a mute person, which cannot be expressed in words.",
  53: "Yet it manifests itself in a worthy aspirant at rare, blessed moments.",
  54: "It is devoid of qualities (gunas), free from commercial motive, constantly expanding, uninterrupted, subtle, and of the nature of direct inner experience.",
  55: "Having attained this love, one sees Him alone, hears Him alone, speaks of Him alone, and contemplates Him alone.",
  56: "Secondary (gauni) devotion is of three kinds according to the predominant guna (sattva, rajas, tamas), or according to the afflicted, the seeker, and the self-interested.",
  57: "Each preceding type is superior to the succeeding one.",
  58: "This secondary devotion is easier to cultivate than primary (para) devotion.",
  59: "Because it does not depend on any external proof and is self-evident.",
  60: "Because it is of the nature of peace and supreme happiness.",
  61: "There should be no anxiety about worldly maintenance, for the devotee has surrendered all worldly and spiritual concerns to the Lord.",
  62: "Even when devotion is attained, social duties should not be neglected, but their fruits should be consecrated to God.",
  63: "One must not listen to talks about women, wealth, atheists, or enemies of dharma.",
  64: "Pride, vanity, and other vices must be abandoned.",
  65: "Having consecrated all actions to Him, one may direct desire, anger, and pride exclusively toward Him, if they arise.",
  66: "Transcending the three types of secondary devotion, one should cultivate unbroken loving attachment characterized by the relationship of a servant or a beloved.",
  67: "Primary devotees are those whose one-pointed devotion is directed toward Him alone.",
  68: "Conversing with one another with choked voice, tears of joy, and thrilled limbs, they purify their lineages and the earth.",
  69: "They turn holy places into sacred shrines, make actions auspicious, and give authority to the scriptures.",
  70: "For they are filled with the divine presence.",
  71: "Their ancestors rejoice, the gods dance in bliss, and this earth finds in them a true protector.",
  72: "Among them there are no distinctions based on caste, learning, appearance, birth, wealth, or profession.",
  73: "Because they all belong to Him alone.",
  74: "Debate and polemics should not be entered into.",
  75: "Because there is room for endless arguments, and no certainty can be reached thereby.",
  76: "Devotional scriptures should be contemplated, and practices inspiring devotion should be performed.",
  77: "Awaiting the moment when desire, anger, and delusion are completely dissolved, one should not waste even a fraction of a second.",
  78: "Non-violence, truth, purity, compassion, faith in the divine, and other virtues must always be preserved.",
  79: "The Lord alone should be worshipped at all times with a heart free from all anxiety.",
  80: "Being praised, He reveals Himself quickly to the devotees and blesses them with the direct experience of His divine nature.",
  81: "Bhakti alone is the greatest across all three periods of time (past, present, future), for it is the direct pathway to liberation.",
  82: "Bhakti manifests in eleven forms: attachment to the glory of His divine qualities, attachment to His divine form, attachment to worship, attachment to constant remembrance, attachment to service, attachment to friendship, attachment to parental affection, attachment to the beloved, attachment to self-offering, attachment to absorption in Him, and attachment to the anguish of separation.",
  83: "Thus unanimously declare the great teachers of devotion: the Kumaras, Vyasa, Shuka, Shandilya, Garga, Vishnu, Kaundinya, Shesha, Uddhava, Aruni, Bali, Hanuman, Vibhishana, and others.",
  84: "Whoever believes in and reveres this auspicious teaching proclaimed by Narada attains the most Beloved Lord; indeed, they attain the most Beloved Lord."
};

function cleanSanskrit(skt) {
  return skt.replace(/॥\s*\d+\s*॥/g, '').trim();
}

function toIast(skt) {
  const clean = cleanSanskrit(skt).replace(/[॥।]/g, '').trim();
  try {
    return Sanscript.t(clean, 'devanagari', 'iast').replace(/\s+/g, ' ').trim() + ' ||';
  } catch {
    return '';
  }
}

const ch1Verses = [];
const ch2Verses = [];
const ch3Verses = [];

for (const s of rawSutras) {
  const id = s.id;
  const skt = s.sanskrit.endsWith('॥') ? s.sanskrit : s.sanskrit + ' ॥';
  const iast = toIast(skt);
  const hindi = s.hindi;
  const en = EN_TRANSLATIONS[id] || hindi;
  
  const verseObj = {
    id: id,
    sanskrit: skt,
    transliteration: iast,
    translation: en,
    hindi: hindi,
    explanation: `Sutra ${id}: ${en} Gita Press commentary: "${hindi}".`,
    keywords: ['Narada', 'Bhakti', 'Sutra' + id, 'Devotion']
  };

  if (id <= 24) ch1Verses.push(verseObj);
  else if (id <= 50) ch2Verses.push(verseObj);
  else ch3Verses.push(verseObj);
}

// Preserve existing deep notes for verses 1, 2, 3
ch1Verses[0].explanation = 'The Narada Bhakti Sutras open with the most austere possible beginning — two words and a verb. "Atha" (now) marks the beginning of an inquiry that follows some prior preparation. "Ataḥ" (therefore) indicates that what follows is necessitated by something already established. The same formula opens the Brahma Sutras and the Yoga Sutras — Narada deliberately invokes this tradition to announce: bhakti is not a lesser path for simpler minds. It is a rigorous philosophical subject deserving systematic treatment.';
ch1Verses[0].science = 'Research on the philosophy of definition (analytical philosophy, Wittgenstein): defining complex phenomena is one of the hardest tasks in human thought. The approach of first surveying competing definitions and then refining them mirrors the best practice of philosophical analysis.';
ch1Verses[0].lifeLesson = 'Before anything important, Narada says "atha" — now. Mark the moment as a real beginning. That single word — now — is the first act of attention.';
ch1Verses[0].keywords = ['Atha', 'Beginning', 'Bhakti', 'Definition', 'Inquiry'];

ch1Verses[1].explanation = 'Narada\'s own definition in five Sanskrit words — among the most compressed and complete definitions in the entire philosophical tradition: "sā" (that), "asmin" (in Him), "paramapremarūpā" (of the nature of supreme love). Parama-prema is love that seeks nothing in return, that is complete in itself, that transforms the lover into divine consciousness.';
ch1Verses[1].science = 'Research on love as a distinct psychological state (Fredrickson\'s positivity resonance): pure love is characterized by mutual care and synchrony, directed at the divine reality.';
ch1Verses[1].lifeLesson = 'Ask yourself honestly: is what I call my spiritual practice an expression of genuine love? Narada defines bhakti as parama-prema — supreme love.';
ch1Verses[1].keywords = ['ParamaPrema', 'SupremeLove', 'BhaktiDefinition', 'Devotion'];

ch1Verses[2].explanation = 'The third sutra adds a second attribute: bhakti is amṛtasvarūpā — of the nature of immortality (amrita). When the bhakta is established in para-bhakti, they participate in the divine deathless nature.';
ch1Verses[2].science = 'Terror Management Theory: experiences of self-transcendent love dramatically reduce existential mortality anxiety.';
ch1Verses[2].lifeLesson = 'Have you ever had a moment of love so complete that the thought of death seemed irrelevant? That moment is what Narada calls amṛtasvarūpā.';
ch1Verses[2].keywords = ['Amrita', 'Immortality', 'DeathlessLove', 'Transcendence'];

const scriptureFileContent = `import { Scripture } from '../types';

export const naradabhaktisutra: Scripture = {
  id: 'naradabhaktisutra',
  title: 'Narada Bhakti Sutras',
  titleSanskrit: 'नारद भक्ति सूत्र',
  category: 'other',
  description: '84 sutras (aphorisms) attributed to the divine sage Narada — the most systematic philosophical treatise on bhakti (devotion) in the Sanskrit tradition. Defines bhakti, refutes rival definitions, enumerates eleven forms of the highest love (para-bhakti), and culminates in the declaration that bhakti is its own fruit and its own proof. Complete recension with authentic Gita Press text and Hindi translation.',
  totalVerses: 84,
  tags: ['Sutra', 'Bhakti', 'Narada', 'ParaBhakti', 'Love', 'Devotion', 'Philosophy', 'GitaPress'],
  chapters: [
    {
      id: 1,
      title: 'The Nature of Bhakti — Definition and Proof',
      titleSanskrit: 'भक्ति स्वरूप — लक्षण (सूत्र १-२४)',
      summary: 'Narada defines bhakti as supreme love (parama-prema) and immortality (amrita-svarupa). He analyzes competing definitions by Vyasa, Garga, and Shandilya, concluding with the supreme dedication demonstrated by the gopis of Vraja.',
      verses: ${JSON.stringify(ch1Verses, null, 2)}
    },
    {
      id: 2,
      title: 'The Path of Devotion — Renunciation and Sacred Means',
      titleSanskrit: 'भक्ति के साधन एवं त्याग (सूत्र २५-५०)',
      summary: 'Bhakti transcends karma, jnana, and yoga as its own self-sufficient fruit. Narada describes renunciation of worldly clinging, avoidance of toxic company, and the invaluable blessing of satsanga with great souls.',
      verses: ${JSON.stringify(ch2Verses, null, 2)}
    },
    {
      id: 3,
      title: 'Para-Bhakti — Eleven Forms, Glory of Devotees, and Liberation',
      titleSanskrit: 'परा-भक्ति के एकादश रूप एवं भक्त माहात्म्य (सूत्र ५१-८४)',
      summary: 'The ineffable nature of divine love, the difference between secondary (gauni) and primary (para) devotion, the eleven forms of devotional attachment, and the proclamation that pure devotees sanctify entire lineages and the earth itself.',
      verses: ${JSON.stringify(ch3Verses, null, 2)}
    }
  ]
};
`;

const targetFile = path.resolve('data/scriptures/naradabhaktisutra.ts');
fs.writeFileSync(targetFile, scriptureFileContent, 'utf8');
console.log(`Successfully hydrated ${targetFile} with all 84 verses!`);
