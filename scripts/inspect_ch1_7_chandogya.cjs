const fs = require('fs');
const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');

// Let's examine chapters 1 to 7
for (let chId = 1; chId <= 7; chId++) {
  // Find chapter block
  const startIdx = content.indexOf(`id: ${chId},`);
  const nextChIdx = content.indexOf(`id: ${chId + 1},`, startIdx);
  const chBlock = content.substring(startIdx, nextChIdx);
  
  const titleM = chBlock.match(/title:\s*['"]([^'"]+)['"]/);
  console.log(`\n=== Chapter ${chId}: ${titleM ? titleM[1] : ''} ===`);
  
  // Find all verses
  const vRegex = /id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)[''][\s\S]*?keywords:\s*\[([^\]]*)\]/g;
  let vm;
  while ((vm = vRegex.exec(chBlock)) !== null) {
    const id = vm[1];
    const s = vm[2].slice(0, 35);
    const kw = vm[3].trim();
    console.log(`  Verse ID: ${id} | Keywords: [${kw}] | Sanskrit: "${s}..."`);
  }
}
