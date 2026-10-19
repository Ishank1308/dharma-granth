async function testReaderEndpoints() {
  const book1Id = "673f25be07174db38a58753e"; // ID of Shrimad Bhagavad Gita Tattva Vivechani
  
  const endpoints = [
    { method: 'POST', url: 'https://gitapress.org/api/web/reader/ebook', body: { id: book1Id } },
    { method: 'POST', url: 'https://gitapress.org/api/web/reader/ebook/config', body: { id: book1Id } },
    { method: 'GET', url: `https://gitapress.org/api/web/reader/ebook?id=${book1Id}` },
    { method: 'POST', url: 'https://gitapress.org/api/web/viewer/ebook', body: { id: book1Id } },
    { method: 'GET', url: `https://gitapress.org/api/web/viewer/ebook?id=${book1Id}` },
    { method: 'POST', url: 'https://gitapress.org/api/web/reader/productinfo', body: { id: book1Id } },
  ];

  for (const ep of endpoints) {
    try {
      const opts = {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (ep.body) opts.body = JSON.stringify(ep.body);
      const res = await fetch(ep.url, opts);
      const text = await res.text();
      console.log(`[${ep.method}] ${ep.url}`);
      console.log(`  Status: ${res.status} | Response length: ${text.length}`);
      console.log(`  Sample: ${text.slice(0, 180)}`);
    } catch (e) {
      console.log(`Error calling ${ep.url}:`, e.message);
    }
  }
}

testReaderEndpoints();
