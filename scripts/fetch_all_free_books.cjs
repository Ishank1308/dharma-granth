const fs = require('fs');

async function getAllFreeBooks() {
  const res = await fetch('https://gitapress.org/api/web/products/freebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options: { page: 1, limit: 100 } })
  });
  const json = await res.json();
  const books = json.data?.data || [];
  console.log(`Found ${books.length} free books on Gita Press`);
  
  const results = books.map(b => ({
    code: b.code,
    title: b.title,
    language: b.language?.title,
    pageCount: b.pageCount,
    pdf: b.pdf,
    slug: b.slug,
  }));
  
  fs.writeFileSync('scripts/gitapress_free_books.json', JSON.stringify(results, null, 2));
  console.log('Saved to scripts/gitapress_free_books.json');
  for (const r of results) {
    console.log(`[Code ${r.code}] ${r.title.slice(0, 50)}... (${r.language}) | PDF: ${r.pdf ? 'YES' : 'NO'}`);
  }
}
getAllFreeBooks();
