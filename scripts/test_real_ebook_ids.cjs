const fs = require('fs');

async function testEbookReader() {
  const token = fs.readFileSync('scripts/gitapress_session_token.txt', 'utf8').trim();
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${bearer}`,
    'Cookie': `__Secure-next-auth.session-token=${token}`,
  };

  const tests = [
    { name: 'Code 133 (Vivek Chudamani)', ebookId: "679727dcef979816fd761d42" },
    { name: 'Code 70 (Prashna Upanishad)', ebookId: "67f35fcce9fe89f2d191be4a" },
    { name: 'Code 6 (Sadhak Sanjivani)', ebookId: "68c3a2a325e772a4dd933451" }
  ];

  for (const t of tests) {
    console.log(`\nTesting reader for ${t.name} with ebookId=${t.ebookId}...`);
    const endpoints = [
      'https://gitapress.org/api/web/reader/ebook',
      'https://gitapress.org/api/web/viewer/ebook',
      'https://gitapress.org/api/web/reader/ebook/config',
      'https://gitapress.org/api/web/reader/productinfo'
    ];
    for (const ep of endpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ebookId: t.ebookId, ebook: t.ebookId })
        });
        const text = await res.text();
        console.log(`  [${ep.split('/').slice(-2).join('/')}] Status: ${res.status} | Length: ${text.length}`);
        console.log(`    Sample: ${text.slice(0, 200)}`);
      } catch (e) {
        console.log(`  Error on ${ep}:`, e.message);
      }
    }
  }
}

testEbookReader();
