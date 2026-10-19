const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  // Check if file contains both rich keywords and empty keywords: []
  const hasRichKeywords = /keywords:\s*\[\s*['"][^'"]+['"]/.test(content);
  const emptyKeywordsMatches = [...content.matchAll(/keywords:\s*\[\s*\]/g)];
  
  if (hasRichKeywords && emptyKeywordsMatches.length > 0) {
    results.push({
      file,
      emptyKeywordsCount: emptyKeywordsMatches.length
    });
  }
}

console.log('Files with both rich keywords and empty keywords: []');
console.table(results);
