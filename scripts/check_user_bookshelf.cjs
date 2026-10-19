const fs = require('fs');

async function checkBookshelf() {
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

  const endpoints = [
    'https://gitapress.org/api/web/bookshelf/purchased',
    'https://gitapress.org/api/web/bookshelf/readedFreeBooks',
    'https://gitapress.org/api/web/user/subscription/info',
    'https://gitapress.org/api/web/ebook/subscription'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { method: 'POST', headers, body: JSON.stringify({}) });
      const json = await res.json();
      console.log(`\nEndpoint: ${ep}`);
      console.log('Status:', res.status);
      console.log('Response:', JSON.stringify(json, null, 2).slice(0, 500));
    } catch (e) {
      console.log(`Failed ${ep}:`, e.message);
    }
  }
}

checkBookshelf();
