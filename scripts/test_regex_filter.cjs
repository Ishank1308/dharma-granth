const fs = require('fs');

function testFilterVerses() {
  const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');
  
  // Test replacing bad verse blocks in ch 1-7
  // Notice in Ch 1-7, bad verses are:
  // id: 10102, 10105, 10109, 10202, 10203, 10205, 10209, 10210, etc.
  // Match individual verse objects:
  // {\s*id:\s*\d+,[\s\S]*?keywords:\s*\[\s*\]\s*,?\s*},?
  
  const ch8Index = content.indexOf("title: 'Adhyāya 8'");
  const beforeCh8 = content.substring(0, ch8Index);
  const afterCh8 = content.substring(ch8Index);
  
  // Count how many verses with keywords: [] exist before Ch 8
  const badVerseRegex = /\{\s*id:\s*10\d{3},[\s\S]*?keywords:\s*\[\s*\]\s*,?\s*\},?/g;
  const matches = [...beforeCh8.matchAll(badVerseRegex)];
  console.log(`Found ${matches.length} bad verses before Ch 8 in Chandogya`);
  
  const cleanedBeforeCh8 = beforeCh8.replace(badVerseRegex, '');
  console.log('Original length before Ch8:', beforeCh8.length, 'Cleaned length:', cleanedBeforeCh8.length);
  
  // Check if any bad verse IDs remain in cleanedBeforeCh8
  const remaining10xxx = [...cleanedBeforeCh8.matchAll(/id:\s*10[1-7]\d{2}/g)];
  console.log(`Remaining 101xx-107xx IDs before Ch 8: ${remaining10xxx.length}`);
}

testFilterVerses();
