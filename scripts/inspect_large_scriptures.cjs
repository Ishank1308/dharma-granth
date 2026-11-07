const fs = require('fs');

function inspectScriptureIDs(file) {
  const content = fs.readFileSync(`data/scriptures/${file}`, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  // Check verses with id >= 10000
  const matches = [...content.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)[''][\s\S]*?keywords:\s*\[([^\]]*)\]/g)];
  const highIdVerses = matches.filter(m => parseInt(m[1]) >= 10000);
  console.log(`Total verses: ${matches.length}, High IDs (>= 10000): ${highIdVerses.length}`);
  
  // Check how many have empty keywords vs rich keywords
  const emptyKw = highIdVerses.filter(m => m[3].trim() === '');
  const richKw = highIdVerses.filter(m => m[3].trim() !== '');
  console.log(`High IDs with empty keywords: ${emptyKw.length}, with rich keywords: ${richKw.length}`);
  
  // Check if they are duplicates of other verses in the file
  const allVerses = matches.map(m => ({ id: m[1], s: m[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '') }));
  const seen = new Map();
  let dups = 0;
  for (const v of allVerses) {
    if (seen.has(v.s)) dups++;
    else seen.set(v.s, v.id);
  }
  console.log(`Total duplicate Sanskrit verses: ${dups}`);
  if (emptyKw.length > 0) {
    console.log('Sample high ID empty kw:', emptyKw.slice(0, 5).map(m => m[1]).join(', '));
  }
}

['atharvaveda.ts', 'mahabharata.ts', 'manusmriti.ts'].forEach(inspectScriptureIDs);
