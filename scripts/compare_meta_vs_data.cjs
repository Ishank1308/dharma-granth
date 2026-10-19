const fs = require('fs');
const path = require('path');

const metaContent = fs.readFileSync('data/scripture-meta.ts', 'utf8');

const scripturesDir = path.resolve('data/scriptures');
const fullDir = path.resolve('public/data/scriptures-full');

const files = fs.readdirSync(scripturesDir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const issues = [];

for (const f of files) {
  const id = f.replace('.ts', '');
  const tsContent = fs.readFileSync(path.join(scripturesDir, f), 'utf8');
  
  // declared in ts
  const tsTotalMatch = tsContent.match(/totalVerses:\s*(\d+)/);
  const tsTotal = tsTotalMatch ? parseInt(tsTotalMatch[1], 10) : 0;
  
  // actual verses in ts
  const tsVersesMatches = tsContent.match(/["']?sanskrit["']?\s*:\s*['"`]/g) || [];
  const tsActual = tsVersesMatches.length;
  
  // empty chapters in ts
  const emptyMatches = tsContent.match(/verses:\s*\[\s*\]/g) || [];
  const tsEmptyChaps = emptyMatches.length;

  // in public/data/scriptures-full
  const jsonPath = path.join(fullDir, `${id}.json`);
  let jsonVerses = 0;
  let jsonEmptyChaps = 0;
  if (fs.existsSync(jsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      for (const ch of data.chapters || []) {
        const vLen = (ch.verses || []).length;
        jsonVerses += vLen;
        if (vLen === 0) jsonEmptyChaps++;
      }
    } catch (e) {}
  }

  // in scriptureCatalog
  const idRegex = new RegExp(`id:\\s*["']${id}["'][\\s\\S]*?totalChapters:\\s*(\\d+)[\\s\\S]*?totalVerses:\\s*(\\d+)`);
  const metaMatch = metaContent.match(idRegex);
  const metaVerses = metaMatch ? parseInt(metaMatch[2], 10) : -1;
  const metaChapters = metaMatch ? parseInt(metaMatch[1], 10) : -1;

  if (tsEmptyChaps > 0 || jsonEmptyChaps > 0 || tsActual === 0) {
    issues.push({ id, status: 'CRITICAL EMPTY', tsEmptyChaps, jsonEmptyChaps, tsActual, jsonVerses });
  } else if (metaVerses !== tsActual && metaVerses !== -1 && tsActual < 50) {
    // discrepancy or curated stub
    issues.push({ id, status: 'CURATED / STUB', metaVerses, tsTotal, tsActual, jsonVerses });
  }
}

console.log('Scripture Audit Summary:');
console.table(issues);
