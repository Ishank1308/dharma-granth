const fs = require('fs');
const path = require('path');

function inspectScripture(name) {
  const filePath = path.join(__dirname, '..', 'data', 'scriptures', `${name}.ts`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n================== ${name.toUpperCase()} ==================`);
  
  const verseMatches = [...content.matchAll(/id:\s*(\d+),\s*\n\s*sanskrit:\s*['"]([^'"]+)['"]/g)];
  console.log(`Total verses found with id + sanskrit: ${verseMatches.length}`);
  
  const sanskritMap = new Map();
  const duplicates = [];

  for (const m of verseMatches) {
    const id = parseInt(m[1]);
    const sanskrit = m[2].trim();
    const cleanSanskrit = sanskrit.replace(/[\s\u200B-\u200D।॥]/g, '');
    
    if (sanskritMap.has(cleanSanskrit)) {
      duplicates.push({
        firstId: sanskritMap.get(cleanSanskrit).id,
        firstSnippet: sanskritMap.get(cleanSanskrit).sanskrit.slice(0, 40),
        dupId: id,
        dupSnippet: sanskrit.slice(0, 40)
      });
    } else {
      sanskritMap.set(cleanSanskrit, { id, sanskrit });
    }
  }

  console.log(`Unique Sanskrit verses: ${sanskritMap.size}`);
  console.log(`Duplicate Sanskrit entries: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('Duplicates:');
    duplicates.forEach((d, idx) => {
      console.log(`  ${idx+1}. First ID ${d.firstId} vs Dup ID ${d.dupId}: "${d.dupSnippet}..."`);
    });
  }

  const fiveDigitIds = verseMatches.filter(m => parseInt(m[1]) >= 10000);
  console.log(`Verses with 5-digit IDs (>= 10000): ${fiveDigitIds.length}`);
  if (fiveDigitIds.length > 0) {
    console.log('5-digit IDs:', fiveDigitIds.map(m => m[1]).join(', '));
  }
}

['chandogya', 'kena'].forEach(inspectScripture);
