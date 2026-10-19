const fs = require('fs');

async function testAuth() {
  const token = fs.readFileSync('scripts/gitapress_session_token.txt', 'utf8').trim();
  const cookieHeader = `__Secure-next-auth.session-token=${token}; next-auth.session-token=${token}`;

  console.log('1. Testing /api/auth/session...');
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': cookieHeader }
  });
  console.log('Session status:', sRes.status);
  const sData = await sRes.json();
  console.log('Session user:', JSON.stringify(sData, null, 2));

  // If session has access token
  const bearer = sData?.accessToken || sData?.user?.accessToken || sData?.token;
  console.log('Bearer token available:', bearer ? 'YES' : 'NO');

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': cookieHeader,
  };
  if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

  console.log('\n2. Testing /api/web/reader/ebook (Book 1)...');
  const book1Id = "673f25be07174db38a58753e";
  const rRes = await fetch('https://gitapress.org/api/web/reader/ebook', {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: book1Id })
  });
  console.log('Reader status:', rRes.status);
  const rText = await rRes.text();
  console.log('Reader response:', rText.slice(0, 500));

  console.log('\n3. Testing /api/web/viewer/ebook (Book 1)...');
  const vRes = await fetch('https://gitapress.org/api/web/viewer/ebook', {
    method: 'POST',
    headers,
    body: JSON.stringify({ id: book1Id })
  });
  console.log('Viewer status:', vRes.status);
  const vText = await vRes.text();
  console.log('Viewer response:', vText.slice(0, 500));
}

testAuth();
