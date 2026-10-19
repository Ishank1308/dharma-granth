async function run() {
  const res = await fetch('https://gitapress.org/api/web/products/ebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options: { page: 1, limit: 10 } })
  });
  const json = await res.json();
  const list = json.data?.data || [];
  console.log(`Retrieved ${list.length} ebooks from /ebook.`);
  for (const b of list.slice(0, 5)) {
    console.log(`[Code ${b.code}] ${b.title}`);
    console.log(`  ebookId: ${b.ebookId || b.ebook?._id || b.ebook}`);
    console.log(`  pdf: ${b.pdf || 'none'}`);
    console.log(`  slug: ${b.slug}`);
  }
}
run();
