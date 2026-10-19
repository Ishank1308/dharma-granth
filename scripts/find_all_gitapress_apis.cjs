const fs = require('fs');

async function findAllApiEndpoints() {
  const res = await fetch('https://gitapress.org/ebook');
  const text = await res.text();
  const chunkMatches = text.match(/\"\/_next\/static\/chunks\/[^\"]+\"/g) || [];
  
  const allEndpoints = new Set();
  const readerMatches = [];

  for (const c of chunkMatches) {
    const chunkUrl = 'https://gitapress.org' + JSON.parse(c);
    try {
      const cr = await fetch(chunkUrl);
      const ct = await cr.text();
      const apis = ct.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
      apis.forEach(a => allEndpoints.add(a));
      
      // Look for reader or ebook or download patterns
      const lines = ct.split(';');
      for (const line of lines) {
        if (line.includes('ebook') || line.includes('reader') || line.includes('download')) {
          if (line.includes('/api/')) {
            readerMatches.push(line.slice(0, 300));
          }
        }
      }
    } catch {}
  }

  console.log('--- ALL API ENDPOINTS DISCOVERED IN NEXT.JS BUNDLES ---');
  console.log(Array.from(allEndpoints).sort());
  console.log('\n--- READER / EBOOK MATCHES ---');
  console.log(readerMatches.slice(0, 10));
}

findAllApiEndpoints();
