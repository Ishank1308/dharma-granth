const fs = require('fs');

async function extractApiRoutes() {
  const res = await fetch('https://gitapress.org/ebook');
  const text = await res.text();
  const chunkMatches = text.match(/\"\/_next\/static\/chunks\/[^\"]+\"/g) || [];

  for (const c of chunkMatches) {
    const chunkUrl = 'https://gitapress.org' + JSON.parse(c);
    try {
      const cr = await fetch(chunkUrl);
      const ct = await cr.text();
      const idx = ct.indexOf('getNewArrivals');
      if (idx !== -1) {
        const start = Math.max(0, idx - 100);
        const end = Math.min(ct.length, idx + 2500);
        console.log(`Found in ${chunkUrl}:`);
        console.log(ct.slice(start, end));
        break;
      }
    } catch {}
  }
}

extractApiRoutes();
