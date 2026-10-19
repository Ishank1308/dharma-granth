const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'data', 'scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

const results = [];

for (const file of files) {
  const fullPath = path.join(dir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  
  // declared totalVerses
  const totalVersesMatch = content.match(/totalVerses:\s*(\d+)/);
  const declaredTotal = totalVersesMatch ? parseInt(totalVersesMatch[1], 10) : 0;
  
  // count chapters by inspecting chapter objects: { id: ...
  // or count empty verses: [ \s* ]
  const emptyMatches = content.match(/verses:\s*\[\s*\]/g);
  const emptyCount = emptyMatches ? emptyMatches.length : 0;
  
  // count total verse objects by counting 'sanskrit': or 'verseNumber': or 'transliteration':
  const sanskritMatches = content.match(/sanskrit:\s*['"`]/g) || [];
  
  // count chapters by matching 'summary:' inside chapters or 'title:'
  // or let's count occurrences of title: inside chapters
  const titleMatches = content.match(/title:\s*['"`]/g) || [];
  // scripture itself has 1 title, so chapters count ~ titleMatches.length - 1
  const chapterCount = Math.max(0, titleMatches.length - 1);
  
  results.push({
    file,
    emptyChapters: emptyCount,
    chapters: chapterCount,
    actualVerses: sanskritMatches.length,
    declaredTotal
  });
}

console.log('=== 1. SCRIPTURES WITH EMPTY CHAPTERS (verses: []) ===');
const withEmpty = results.filter(r => r.emptyChapters > 0);
withEmpty.sort((a, b) => b.emptyChapters - a.emptyChapters);
withEmpty.forEach(r => console.log(`${r.file.padEnd(25)}: ${r.emptyChapters}/${r.chapters} empty chapters, ${r.actualVerses} verses (declared total: ${r.declaredTotal})`));

console.log('\n=== 2. SCRIPTURES WITH 0 VERSES (TOTALLY EMPTY) ===');
const zeroVerses = results.filter(r => r.actualVerses === 0);
zeroVerses.forEach(r => console.log(`${r.file.padEnd(25)}: 0 verses, ${r.chapters} chapters (declared total: ${r.declaredTotal})`));

console.log('\n=== 3. SCRIPTURES WITH LOW VERSE RATIO (< 30% of declared and < 50 verses) ===');
const lowVerses = results.filter(r => r.actualVerses > 0 && r.actualVerses < 50 && r.declaredTotal >= 100);
lowVerses.sort((a, b) => a.actualVerses - b.actualVerses);
lowVerses.forEach(r => console.log(`${r.file.padEnd(25)}: ${r.actualVerses} actual verses / ${r.chapters} chapters (declared total: ${r.declaredTotal})`));

console.log('\n=== 4. SUMMARY OF ALL SCRIPTURES (TOTAL COUNT & VERSE STATS) ===');
console.log(`Total scriptures: ${results.length}`);
console.log(`Scriptures with empty chapters: ${withEmpty.length}`);
console.log(`Scriptures with 0 verses: ${zeroVerses.length}`);

