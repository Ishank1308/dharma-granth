const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const fullReport = [];

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
  
  // check public/data/scriptures-full/<id>.json
  const fullJsonPath = path.resolve('public/data/scriptures-full', `${id}.json`);
  let fullJsonVerses = 0;
  let fullJsonEmptyChapters = 0;
  let fullJsonChapters = 0;
  if (fs.existsSync(fullJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(fullJsonPath, 'utf8'));
      fullJsonChapters = (data.chapters || []).length;
      for (const ch of data.chapters || []) {
        const vLen = (ch.verses || []).length;
        fullJsonVerses += vLen;
        if (vLen === 0) fullJsonEmptyChapters++;
      }
    } catch (e) {}
  }
  
  fullReport.push({
    file: f,
    id,
    declaredTotal,
    tsVerses: actualVerses,
    tsEmptyChapters: emptyChapters,
    fullJsonVerses,
    fullJsonChapters,
    fullJsonEmptyChapters
  });
}

console.log('=== SCRIPTURES WITH EMPTY CHAPTERS IN .TS (verses: []) ===');
const emptyTs = fullReport.filter(r => r.tsEmptyChapters > 0);
console.table(emptyTs);

console.log('=== SCRIPTURES WITH 0 VERSES IN .TS ===');
const zeroTs = fullReport.filter(r => r.tsVerses === 0);
console.table(zeroTs);

console.log('=== SCRIPTURES WITH DISCREPANCY BETWEEN .TS AND FULL JSON (where .ts < 20 and fullJson > 20) ===');
const disc = fullReport.filter(r => r.tsVerses < 20 && r.fullJsonVerses >= 20);
console.table(disc);

console.log('=== SCRIPTURES WHERE BOTH .TS AND FULL JSON HAVE < 20 VERSES (STUBS) ===');
const stubs = fullReport.filter(r => r.tsVerses < 20 && r.fullJsonVerses < 20 && r.declaredTotal > 50);
console.table(stubs);
