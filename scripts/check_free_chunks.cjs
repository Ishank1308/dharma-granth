async function run() {
  const res = await fetch('https://gitapress.org/ebook/free');
  const text = await res.text();
  console.log('free page size:', text.length);
  const chunkMatches = text.match(/\"\/_next\/static\/chunks\/[^\"]+\"/g) || [];
  console.log('Chunks:', chunkMatches.slice(0, 10));
  for (const c of chunkMatches) {
    const chunkUrl = 'https://gitapress.org' + JSON.parse(c);
    const cr = await fetch(chunkUrl);
    const ct = await cr.text();
    if (ct.includes('ebook') || ct.includes('drive.google') || ct.includes('pdf')) {
      console.log('Interesting chunk:', chunkUrl);
      const apis = ct.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
      console.log('  apis:', [...new Set(apis)]);
      const drives = ct.match(/drive\.google[^\s"']+/g) || [];
      if (drives.length) console.log('  drive:', drives);
    }
  }
}
run();
