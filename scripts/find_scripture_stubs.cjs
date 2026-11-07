const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts');

const emptyChaptersList = [];
const lowVersesList = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const tvMatch = content.match(/totalVerses:\s*(\d+)/);
  const totalVersesDeclared = tvMatch ? parseInt(tvMatch[1]) : 0;
  
  // count empty chapters
  const emptyMatches = content.match(/verses:\s*\[\s*\]/g);
  const emptyCount = emptyMatches ? emptyMatches.length : 0;
  
  // match either sanskrit: or "sanskrit":
  const matches = content.match(/["']?sanskrit["']?\s*:\s*['"`]/g) || [];
  const sanskritCount = matches.length;
  
  const id = f.replace('.ts', '');
  const jsonPath = path.resolve('public/data/scriptures-full', `${id}.json`);
  const hasJson = fs.existsSync(jsonPath);
  let jsonVerses = 0;
  if (hasJson) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (data.chapters) {
        for (const ch of data.chapters) {
          jsonVerses += (ch.verses ? ch.verses.length : 0);
        }
      }
    } catch (e) {}
  }
  
  if (emptyCount > 0) {
    emptyChaptersList.push({ file: f, emptyChapters: emptyCount, tsVerses: sanskritCount, declared: totalVersesDeclared, jsonVerses });
  } else if (sanskritCount < 20) {
    lowVersesList.push({ file: f, tsVerses: sanskritCount, declared: totalVersesDeclared, jsonVerses });
  }
}

console.log('=== SCRIPTURES WITH EMPTY CHAPTERS (verses: []) ===');
console.table(emptyChaptersList);

console.log('=== SCRIPTURES WITH FEW VERSES (< 20) in .ts file ===');
console.table(lowVersesList);

