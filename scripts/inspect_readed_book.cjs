const fs = require('fs');

async function inspectReadedBooks() {
  const token = fs.readFileSync('scripts/gitapress_session_token.txt', 'utf8').trim();
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;

  const res = await fetch('https://gitapress.org/api/web/bookshelf/readedFreeBooks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
      'Cookie': `__Secure-next-auth.session-token=${token}`,
    },
    body: JSON.stringify({})
  });
  const json = await res.json();
  console.log(JSON.stringify(json.data?.data?.[0], null, 2));
}

inspectReadedBooks();
