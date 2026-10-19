const fs = require('fs');
const content = fs.readFileSync('data/scriptures/brihadaranyaka.ts', 'utf8');

for (let chId = 1; chId <= 6; chId++) {
  const startIdx = content.indexOf(`id: ${chId},\n      title:`);
  let nextChIdx = content.indexOf(`id: ${chId + 1},\n      title:`, startIdx);
  if (nextChIdx === -1) nextChIdx = content.indexOf(`id: 8,\n      title:`, startIdx);
  const chBlock = content.substring(startIdx, nextChIdx);
  
  const titleM = chBlock.match(/title:\s*['"]([^'"]+)['"]/);
  console.log(`\n=== Ch ${chId}: ${titleM ? titleM[1] : ''} ===`);
  
  const vRegex = /id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)[''][\s\S]*?keywords:\s*\[([^\]]*)\]/g;
  let vm;
  while ((vm = vRegex.exec(chBlock)) !== null) {
    const id = vm[1];
    const s = vm[2].slice(0, 35);
    const kw = vm[3].trim();
    console.log(`  Verse ID: ${id} | Keywords: [${kw}] | Sanskrit: "${s}..."`);
  }
}
