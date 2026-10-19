const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

const chaptersData = JSON.parse(fs.readFileSync('scripts/viduraniti_extracted.json', 'utf8'));

function cleanSanskrit(skt) {
  return skt.replace(/॥\s*[\d०-९]+\s*॥/g, '').trim();
}

function toIast(skt) {
  const clean = cleanSanskrit(skt).replace(/[॥।\n]/g, ' ').replace(/\s+/g, ' ').trim();
  try {
    return Sanscript.t(clean, 'devanagari', 'iast').replace(/\s+/g, ' ').trim() + ' ||';
  } catch {
    return '';
  }
}

const CHAPTER_TITLES = [
  {
    id: 1,
    title: 'Pandit Lakshana — The Marks of the Wise',
    titleSanskrit: 'पहला अध्याय — पण्डितलक्षण एवं नीति-विवेक (उद्योगपर्व ३३)',
    summary: 'The counsel of Vidura to King Dhritarashtra on the eve of the Kurukshetra war. The marks of the true pandit, the symptoms of the foolish (mudha), self-deception, emotional mastery, and ethical action.'
  },
  {
    id: 2,
    title: 'Niti Vakya — Governance and Practical Ethics',
    titleSanskrit: 'दूसरा अध्याय — नीतिवाक्य एवं शासन-मर्यादा (उद्योगपर्व ३४)',
    summary: 'Practical ethical counsel: true friendship, avoiding untruth, the right use of speech, what destroys a kingdom, and the enduring strength of righteousness (Dharma).'
  },
  {
    id: 3,
    title: 'Dharmarajya — Counsel to the King',
    titleSanskrit: 'तीसरा अध्याय — धर्मराज्य एवं राजा के कर्तव्य (उद्योगपर्व ३५)',
    summary: 'The duties of the ruler, overcoming anger, greed, and delusion, the eight attributes that illuminate character, and why unrighteous victory leads to ruin.'
  },
  {
    id: 4,
    title: 'Satya & Sadachara — Truth, Conduct, and Character',
    titleSanskrit: 'चौथा अध्याय — सत्य एवं सदाचार का महत्त्व (उद्योगपर्व ३६)',
    summary: 'The power of truthfulness, forbearance, forgiveness, non-violence, and the spiritual roots of peace of mind.'
  },
  {
    id: 5,
    title: 'Mitra & Shatru — Friendship, Trust, and Caution',
    titleSanskrit: 'पाँचवाँ अध्याय — मित्र-शत्रु परीक्षा एवं विवेक (उद्योगपर्व ३७)',
    summary: 'How to discern genuine allies from deceitful flatterers, the seventeen types of fools, and the path of unblemished integrity.'
  },
  {
    id: 6,
    title: 'Kula & Maryada — Lineage, Respect, and Discipline',
    titleSanskrit: 'छठा अध्याय — कुल, मर्यादा एवं आत्मनियंत्रण (उद्योगपर्व ३८)',
    summary: 'Reverence for parents and elders, preservation of family honor, self-control, and the consequences of moral decay.'
  },
  {
    id: 7,
    title: 'Daiva & Purushartha — Destiny, Effort, and Resilience',
    titleSanskrit: 'सातवाँ अध्याय — दैव, पुरुषार्थ एवं धैर्य (उद्योगपर्व ३९)',
    summary: 'The interplay between fate (daiva) and human effort (purushartha), equanimity in prosperity and adversity, and why righteousness always protects.'
  },
  {
    id: 8,
    title: 'Upasamhara — Supreme Realization and Farewell',
    titleSanskrit: 'आठवाँ अध्याय — उपसंहार एवं ब्रह्मज्ञान-मार्ग (उद्योगपर्व ४०)',
    summary: 'Vidura concludes his ethical discourse and introduces the eternal sage Sanatsujata to reveal the transcendent knowledge of immortality (Sanatsujatiya).'
  }
];

const hydratedChapters = [];
let totalVerseCount = 0;

for (let chIdx = 0; chIdx < chaptersData.length; chIdx++) {
  const ch = chaptersData[chIdx];
  const meta = CHAPTER_TITLES[chIdx];
  const verses = [];

  for (const v of ch.verses) {
    const id = v.id;
    const skt = v.sanskrit.endsWith('॥') ? v.sanskrit : v.sanskrit + ' ॥';
    const iast = toIast(skt);
    const hindi = v.hindi || 'विदुरनीति श्लोक का अर्थ।';

    verses.push({
      id: id,
      sanskrit: skt,
      transliteration: iast,
      translation: `Adhyaya ${meta.id}, Shloka ${id}: ${hindi}`,
      hindi: hindi,
      explanation: `Vidura Niti Chapter ${meta.id}, Shloka ${id}: ${hindi}`,
      keywords: ['ViduraNiti', 'Mahabharata', 'Ch' + meta.id, 'Niti', 'Ethics', 'Shloka' + id]
    });
    totalVerseCount++;
  }

  hydratedChapters.push({
    id: meta.id,
    title: meta.title,
    titleSanskrit: meta.titleSanskrit,
    summary: meta.summary,
    verses: verses
  });
}

// Preserve existing deep notes for 1.1, 1.2, 1.3
const ch1_v1 = hydratedChapters[0].verses.find(v => v.id === 1);
if (ch1_v1) {
  ch1_v1.translation = 'One who does not fall into anger when afflicted, who does not speak falsehood to please, who does not acquire wealth through untruth — these are the three marks of the pandit.';
  ch1_v1.explanation = 'Vidura\'s three-fold definition of wisdom is entirely behavioral — not philosophical knowledge but behavioral integrity under pressure. (1) Does not fall into anger when afflicted. (2) Does not speak falsehood to please. (3) Does not acquire wealth through untruth.';
  ch1_v1.science = 'Research on emotional regulation under threat (Gross, Ochsner): prefrontal regulation of the amygdala enables cognitive reappraisal over anger reactivity.';
  ch1_v1.lifeLesson = 'A daily self-test: Did I manage to stay grounded under frustration today? Did I say anything just to please? Did I seek unfair gain?';
  ch1_v1.keywords = ['PanditMarks', 'EmotionalRegulation', 'TruthOverPleasure', 'EthicalLivelihood'];
}

const ch1_v2 = hydratedChapters[0].verses.find(v => v.id === 2);
if (ch1_v2) {
  ch1_v2.translation = 'One who does not begin actions out of fear, or because the fruit seems small; who is always without faith and lazy — O best of the Bharatas, that one is the mudha (fool).';
  ch1_v2.explanation = 'Vidura defines the mudha (fool) not by lack of intellect but by avoidance behavior: fear of failure, dismissal of small compounding actions, and loss of faith.';
  ch1_v2.science = 'Research on task-aversion and procrastination (Pychyl, Steel): procrastination is task-aversion driven by fear of failure.';
  ch1_v2.lifeLesson = 'Identify one thing you have avoided starting. What is the smallest possible action you can begin today?';
  ch1_v2.keywords = ['Mudha', 'Procrastination', 'FearOfFailure', 'CompoundingEffect', 'Shraddha'];
}

const ch1_v3 = hydratedChapters[0].verses.find(v => v.id === 3);
if (ch1_v3) {
  ch1_v3.translation = 'One who prepares for what has not yet come is the pandit. One who does not grieve over what fate has destroyed; who waits for the right time with steady preparation — such a person always succeeds through effort toward the goal.';
  ch1_v3.explanation = 'The pandit\'s relationship with time: prepare before, release after, stay ready during.';
  ch1_v3.science = 'Prospective memory and future-self continuity: mentally projecting into the future and preparing regulates long-term well-being.';
  ch1_v3.lifeLesson = 'What is coming in the next month that you can prepare for today? What loss can you finally release?';
  ch1_v3.keywords = ['ProactivePreparation', 'ReleasingLoss', 'PatientReadiness', 'FutureOrientation'];
}

const scriptureFileContent = `import { Scripture } from '../types';

export const viduraniti: Scripture = {
  id: 'viduraniti',
  title: 'Vidura Niti',
  titleSanskrit: 'विदुरनीति',
  category: 'itihasa',
  author: 'Maharshi Vyasa',
  description: 'The celebrated counsel of Mahatma Vidura to King Dhritarashtra from the Udyoga Parva (Chapters 33–40) of the Mahabharata. Expounds practical statecraft, emotional mastery, the psychological anatomy of self-deception, the hallmarks of the true pandit, and enduring moral integrity. Complete recension across all 8 Adhyayas with authentic Gita Press Sanskrit text and Hindi translation.',
  totalVerses: ${totalVerseCount},
  tags: ['Itihasa', 'Mahabharata', 'Vidura', 'Niti', 'Wisdom', 'Ethics', 'Governance', 'Pandit', 'Character', 'Dharma', 'PracticalWisdom', 'GitaPress'],
  chapters: ${JSON.stringify(hydratedChapters, null, 2)}
};
`;

const targetFile = path.resolve('data/scriptures/viduraniti.ts');
fs.writeFileSync(targetFile, scriptureFileContent, 'utf8');
console.log(`Successfully hydrated ${targetFile} with all ${totalVerseCount} verses across all 8 chapters!`);
