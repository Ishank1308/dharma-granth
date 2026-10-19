const fs = require('fs');

const files = ['kena.ts', 'prashna.ts', 'brihadaranyaka.ts', 'chandogya.ts'];

for (const file of files) {
  const content = fs.readFileSync(`data/scriptures/${file}`, 'utf8');
  console.log(`\n=== ${file} ===`);
  
  // Look for 5-digit IDs or duplicate IDs
  const fiveDigitIds = [...content.matchAll(/id:\s*(\d{5})/g)].map(m => m[1]);
  console.log(`5-digit IDs count: ${fiveDigitIds.length}`);
  if (fiveDigitIds.length > 0) {
    console.log(`Sample 5-digit IDs:`, fiveDigitIds.slice(0, 10));
  }

  // Count empty keywords: keywords: []
  const emptyKeywords = [...content.matchAll(/keywords:\s*\[\s*\]/g)];
  console.log(`Empty keywords [] count: ${emptyKeywords.length}`);
}
