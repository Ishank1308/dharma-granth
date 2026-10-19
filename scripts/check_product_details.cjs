const fs = require('fs');

async function testProductDetails() {
  const token = fs.readFileSync('scripts/gitapress_session_token.txt', 'utf8').trim();
  const cat = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));

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

  // Check 3 products: Code 6 (Sadhak Sanjivani), Code 133 (Vivek Chudamani), Code 70 (Prashna Upanishad)
  const sampleBooks = cat.freeBooks.filter(b => ['6', '133', '70'].includes(b.code));
  for (const b of sampleBooks) {
    console.log(`\nQuerying /api/web/product for Code ${b.code} (${b.title.slice(0, 40)})...`);
    const res = await fetch('https://gitapress.org/api/web/product', {
      method: 'POST',
      headers,
      body: JSON.stringify({ slug: b.slug, id: b.id })
    });
    const json = await res.json();
    console.log('Status:', res.status);
    const prod = json.data || json;
    console.log('Product keys:', Object.keys(prod));
    console.log('pdf:', prod.pdf);
    console.log('ebook:', prod.ebook);
    console.log('ebookId:', prod.ebookId);
  }
}

testProductDetails();
