const fs = require('fs');

const cat = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));

console.log('Total free books in catalog:', cat.freeBooks.length);
console.log('Total ebooks in catalog:', cat.ebooks.length);

const withPdf = cat.freeBooks.filter(b => b.pdf);
console.log('Free books with direct PDF link:', withPdf.length);
for (const b of withPdf) {
  console.log(`[Code ${b.code}] ${b.title.slice(0, 45)} -> ${b.pdf}`);
}

// Check ebooks fields
let withEbookId = 0;
let withPdfField = 0;
for (const b of cat.ebooks) {
  if (b.ebookId) withEbookId++;
  if (b.pdf) withPdfField++;
}
console.log(`Ebooks with ebookId: ${withEbookId}, with pdf: ${withPdfField}`);
