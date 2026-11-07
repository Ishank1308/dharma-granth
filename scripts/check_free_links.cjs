async function run() {
  const res = await fetch('https://gitapress.org/ebook/free');
  const text = await res.text();
  const hrefs = text.match(/href="([^"]+)"/g) || [];
  const unique = [...new Set(hrefs.map(h => h.replace('href="', '').replace('"', '')))];
  console.log('Unique hrefs on /ebook/free:');
  console.log(unique.filter(h => !h.startsWith('/_next')));
}
run();
