const fs = require('fs');

async function fetchFullCatalog() {
  console.log('Fetching all paid & free ebooks from Gita Press API...');
  
  // 1. Fetch free books
  const freeRes = await fetch('https://gitapress.org/api/web/products/freebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options: { page: 1, limit: 200 } })
  });
  const freeJson = await freeRes.json();
  const freeList = freeJson.data?.data || [];
  console.log(`Fetched ${freeList.length} free books.`);

  // 2. Fetch full ebook catalog (page 1 to end)
  let allEbooks = [];
  let page = 1;
  const limit = 100;
  while (true) {
    const res = await fetch('https://gitapress.org/api/web/products/ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options: { page, limit } })
    });
    const json = await res.json();
    const items = json.data?.data || [];
    if (!items.length) break;
    allEbooks = allEbooks.concat(items);
    console.log(`  Page ${page}: got ${items.length} items (total so far: ${allEbooks.length})`);
    if (items.length < limit || allEbooks.length >= (json.data?.total || 400)) break;
    page++;
  }

  // Combine and deduplicate by code or id
  const catalog = {
    fetchedAt: new Date().toISOString(),
    totalFreeBooks: freeList.length,
    totalEbooks: allEbooks.length,
    freeBooks: freeList.map(b => ({
      id: b.id || b._id,
      code: b.code,
      title: b.title,
      language: b.language?.title || b.language?.slug,
      author: b.author?.name,
      category: b.category?.title,
      pageCount: b.pageCount,
      pdf: b.pdf || null,
      slug: b.slug,
      bookSize: b.bookSize,
    })),
    ebooks: allEbooks.map(b => ({
      id: b.id || b._id,
      code: b.code,
      title: b.title,
      language: b.language?.title || b.language?.slug,
      author: b.author?.name,
      category: b.category?.title,
      price: b.price,
      ebookPrice: b.ebookPrice,
      pageCount: b.pageCount,
      ebookId: b.ebookId || (typeof b.ebook === 'object' ? b.ebook?._id : b.ebook),
      slug: b.slug,
    }))
  };

  fs.writeFileSync('data/sources-local/gitapress_ebooks_catalog.json', JSON.stringify(catalog, null, 2));
  console.log('Saved full catalog to data/sources-local/gitapress_ebooks_catalog.json');
}

fetchFullCatalog();
