const fs = require('fs');

const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');
const ch8Index = content.indexOf("title: 'Adhyāya 8'");
const beforeCh8 = content.substring(0, ch8Index);
const badVerseRegex = /\s*\{\s*id:\s*10\d{3},[\s\S]*?keywords:\s*\[\s*\]\s*,?\s*\},?/g;

const cleanedBeforeCh8 = beforeCh8.replace(badVerseRegex, '');

// Also let's renumber Ch 6 verse 5 to 1, Ch 7 verses 3, 9, 10 to 1, 2, 3
// Let's check chapters 1 to 7 in cleanedBeforeCh8
for (let i = 1; i <= 7; i++) {
  const m = cleanedBeforeCh8.match(new RegExp(`title:[^\\n]+\\n[\\s\\S]*?verses:\\s*\\[([\\s\\S]*?)\\]\\s*,\\s*\\n\\s*\\}`, 'g'));
}
console.log('Cleaned length:', cleanedBeforeCh8.length);

// Let's check verse matches in cleanedBeforeCh8
const vMatches = [...cleanedBeforeCh8.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['']/g)];
console.log(`Verses found in cleaned Ch 1-7: ${vMatches.length}`);
vMatches.forEach((m, idx) => {
  console.log(`  ${idx+1}. id: ${m[1]} -> "${m[2].slice(0, 30)}..."`);
});
