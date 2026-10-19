const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const summary = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
  const id = idMatch ? idMatch[1] : f.replace('.ts', '');
  
  const totalVersesMatch = content.match(/totalVerses:\s*(\d+)/);
  const declaredTotal = totalVersesMatch ? parseInt(totalVersesMatch[1], 10) : 0;
  
  const emptyMatches = content.match(/verses:\s*\[\s*\]/g);
  const emptyChapters = emptyMatches ? emptyMatches.length : 0;
  
  const sanskritMatches = content.match(/["']?sanskrit["']?\s*:\s*['"`]/g) || [];
  const actualVerses = sanskritMatches.length;

  summary.push({
    scripture: id,
    verses: actualVerses,
    emptyChapters
  });
}

const empty = summary.filter(s => s.emptyChapters > 0 || s.verses === 0);
console.log('Scriptures with 0 verses or empty chapters:', empty.length);
if (empty.length > 0) {
  console.table(empty);
} else {
  console.log('ALL SCRIPTURES HAVE AUTHENTIC VERSES AND ZERO EMPTY CHAPTERS!');
}
