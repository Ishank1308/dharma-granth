async function run() {
  const res = await fetch('https://gitapress.org/api/web/products/freebook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options: { page: 1, limit: 50 } })
  });
  const json = await res.json();
  const list = json.data?.data || [];
  console.log(`Retrieved ${list.length} free books.`);
  for (const b of list) {
    if (b.pdf) {
      console.log(`[Code ${b.code}] ${b.title.slice(0, 60)}...`);
      console.log(`   PDF: ${b.pdf}`);
    }
  }
}
run();
