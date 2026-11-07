const fs = require('fs');
const path = require('path');

// 1. Sync Vidura Niti
const vnTsPath = path.resolve('data/scriptures/viduraniti.ts');
const vnJsonPath = path.resolve('public/data/scriptures-full/viduraniti.json');

// Read TypeScript file and extract object
const vnContent = fs.readFileSync(vnTsPath, 'utf8');
const vnMatch = vnContent.match(/export const viduraniti: Scripture = ([\s\S]*?);\s*$/);
if (vnMatch) {
  const vnObj = eval('(' + vnMatch[1] + ')');
  const vnFullJson = {
    id: "viduraniti",
    title: vnObj.title,
    titleSanskrit: vnObj.titleSanskrit,
    category: vnObj.category,
    source: {
      repo: "Gita Press Gorakhpur",
      license: "Public Domain Sanskrit text and commentary",
      fetchedAt: new Date().toISOString()
    },
    totalVerses: vnObj.totalVerses,
    totalChapters: vnObj.chapters.length,
    chapters: vnObj.chapters.map(c => ({
      number: c.id,
      title: c.title,
      titleSanskrit: c.titleSanskrit,
      verses: c.verses.map(v => ({
        number: v.number || v.id,
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
  fs.writeFileSync(vnJsonPath, JSON.stringify(vnFullJson, null, 2), 'utf8');
  console.log(`Successfully updated ${vnJsonPath} with all ${vnFullJson.totalVerses} verses across all ${vnFullJson.totalChapters} chapters!`);
}

// 2. Sync Ramcharitmanas
const rcmTsPath = path.resolve('data/scriptures/ramcharitmanas.ts');
const rcmJsonPath = path.resolve('public/data/scriptures-full/ramcharitmanas.json');

const rcmData = JSON.parse(fs.readFileSync('scripts/ramcharit_extracted.json', 'utf8'));
const kandaMeta = [
  { id: 1, title: 'Bal Kanda — Beginnings', titleSanskrit: 'बालकाण्ड' },
  { id: 2, title: 'Ayodhya Kanda — The Forest Exile', titleSanskrit: 'अयोध्याकाण्ड' },
  { id: 3, title: 'Aranya Kanda — The Forest Life', titleSanskrit: 'अरण्यकाण्ड' },
  { id: 4, title: 'Kishkindha Kanda — The Alliance', titleSanskrit: 'किष्किन्धाकाण्ड' },
  { id: 5, title: 'Sundar Kanda — Hanuman\'s Flight', titleSanskrit: 'सुन्दरकाण्ड' },
  { id: 6, title: 'Lanka Kanda — The Great War', titleSanskrit: 'लंकाकाण्ड' },
  { id: 7, title: 'Uttar Kanda — The Golden Age', titleSanskrit: 'उत्तरकाण्ड' }
];

let totalRcmVerses = 0;
const rcmChapters = kandaMeta.map(km => {
  const verses = rcmData[km.id] || [];
  totalRcmVerses += verses.length;
  return {
    number: km.id,
    title: km.title,
    titleSanskrit: km.titleSanskrit,
    verses: verses.map(v => ({
      number: v.number || v.id,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.hindi,
      hindi: v.hindi,
      commentary: v.explanation,
      wordMeaning: v.explanation,
      keywords: v.keywords
    }))
  };
});

const rcmFullJson = {
  id: "ramcharitmanas",
  title: "Shri Ramcharitmanas",
  titleSanskrit: "श्रीरामचरितमानस",
  category: "itihasa",
  source: {
    repo: "Gita Press Gorakhpur (Code 0080)",
    license: "Public Domain Awadhi text and Hindi translation",
    fetchedAt: new Date().toISOString()
  },
  totalVerses: totalRcmVerses,
  totalChapters: rcmChapters.length,
  chapters: rcmChapters
};

fs.writeFileSync(rcmJsonPath, JSON.stringify(rcmFullJson, null, 2), 'utf8');
console.log(`Successfully updated ${rcmJsonPath} with all ${totalRcmVerses} verses across all 7 Kandas!`);
