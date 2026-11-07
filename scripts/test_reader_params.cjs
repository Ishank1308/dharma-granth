const fs = require('fs');

async function testReaderParams() {
  const token = fs.readFileSync('scripts/gitapress_session_token.txt', 'utf8').trim();
  
  // Get bearer token from /api/auth/session
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;
  console.log('Got bearer token! Expiry:', sData.expires);

  const book1Id = "673f25be07174db38a58753e"; // Product ID
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${bearer}`,
    'Cookie': `__Secure-next-auth.session-token=${token}`,
  };

  const tests = [
    { name: 'ebook: book1Id', body: { ebook: book1Id } },
    { name: 'ebookId: book1Id', body: { ebookId: book1Id } },
    { name: 'product: book1Id', body: { product: book1Id } },
    { name: 'productId: book1Id', body: { productId: book1Id } },
    { name: 'book: 1', body: { ebook: "1" } },
  ];

  for (const t of tests) {
    const res = await fetch('https://gitapress.org/api/web/reader/ebook', {
      method: 'POST',
      headers,
      body: JSON.stringify(t.body)
    });
    const json = await res.json();
    console.log(`[Test: ${t.name}] Status: ${res.status}`);
    console.log('  Response:', JSON.stringify(json).slice(0, 300));
  }
}

testReaderParams();
