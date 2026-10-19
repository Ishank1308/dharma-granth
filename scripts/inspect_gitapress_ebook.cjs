const fs = require('fs');

async function test() {
  const res = await fetch('https://gitapress.org/ebook');
  const text = await res.text();
  console.log('HTML size:', text.length);
  // find script tags
  const rx = /<script[^>]*src="([^"]+)"/g;
  let m;
  const scriptUrls = [];
  while ((m = rx.exec(text)) !== null) {
    scriptUrls.push(m[1]);
  }
  console.log('Script URLs found:', scriptUrls.length);
  
  // Search for ebook reader API endpoints in JS bundles
  for (const url of scriptUrls) {
    const fullUrl = url.startsWith('http') ? url : `https://gitapress.org${url}`;
    try {
      const sRes = await fetch(fullUrl);
      const sText = await sRes.text();
      if (sText.includes('reader') || sText.includes('ebook') || sText.includes('pdf')) {
        console.log(`Analyzing bundle: ${url}`);
        const apiMatches = sText.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
        const uniqueApis = [...new Set(apiMatches)];
        console.log('  APIs in bundle:', uniqueApis);
      }
    } catch (e) {
      console.log('Failed to fetch:', url);
    }
  }
}
test();
