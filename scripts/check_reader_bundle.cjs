const fs = require('fs');

async function checkReader() {
  const cookieData = JSON.parse(fs.readFileSync('scripts/decrypted_session_cookies.json', 'utf8'));
  const rawToken = cookieData['__Secure-next-auth.session-token'];
  const token = rawToken.slice(rawToken.indexOf('eyJ'));

  const res = await fetch('https://gitapress.org/reader/68482fa8ba7ef5ad8da09033', {
    headers: { 'Cookie': '__Secure-next-auth.session-token=' + token }
  });
  console.log('Reader page status:', res.status);
  const text = await res.text();
  console.log('Reader HTML length:', text.length);

  const chunks = text.match(/\/static\/chunks\/[^"']+\.js/g) || [];
  console.log('Chunks on reader page:', chunks.length);

  for (const c of chunks) {
    const chunkUrl = 'https://gitapress.org/_next' + c;
    try {
      const cr = await fetch(chunkUrl);
      const ct = await cr.text();
      if (ct.includes('epub') || ct.includes('ePub') || ct.includes('decrypt') || ct.includes('reader/ebook')) {
        console.log('\nFound relevant chunk:', chunkUrl);
        // Find reader/ebook
        const idx = ct.indexOf('reader/ebook');
        if (idx !== -1) {
          console.log('Snippet around reader/ebook:\n', ct.slice(Math.max(0, idx - 150), idx + 350));
        }
        const idx2 = ct.indexOf('crypto');
        if (idx2 !== -1) {
          console.log('Snippet around crypto:\n', ct.slice(Math.max(0, idx2 - 100), idx2 + 200));
        }
        const idx3 = ct.indexOf('ePub(');
        if (idx3 !== -1) {
          console.log('Snippet around ePub(:\n', ct.slice(Math.max(0, idx3 - 100), idx3 + 200));
        }
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

checkReader().catch(console.error);
