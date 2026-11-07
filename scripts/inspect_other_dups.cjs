const fs = require('fs');

function inspectDups(file) {
  const content = fs.readFileSync(`data/scriptures/${file}`, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  const verseMatches = [...content.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['"]/g)];
  console.log(`Total verses: ${verseMatches.length}`);
  const seen = new Map();
  const dups = [];
  for (const v of verseMatches) {
    const id = v[1];
    const s = v[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
    if (seen.has(s)) {
      dups.push({ firstId: seen.get(s), dupId: id, s: v[2].slice(0, 30) });
    } else {
      seen.set(s, id);
    }
  }
  console.log(`Duplicates: ${dups.length}`);
  dups.slice(0, 10).forEach(d => console.log(`  firstId: ${d.firstId} vs dupId: ${d.dupId}: ${d.s}...`));
}

['ramayana.ts', 'rigveda.ts', 'samaveda.ts'].forEach(inspectDups);
