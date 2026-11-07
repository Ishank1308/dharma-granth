async function run() {
  const url = 'https://gitapress.org/ebook/free/shrimad-bhagavad-gita-tattva-vivechani-hindi-commentary-or-gita-press-gorakhpur-publication';
  const res = await fetch(url);
  const text = await res.text();
  console.log('Product page status:', res.status, 'size:', text.length);
  const links = text.match(/href="([^"]+)"/g) || [];
  console.log('Links on page:', links.slice(0, 15));
  const drives = text.match(/https:\/\/drive\.google\.com[^\s"']+/g) || [];
  console.log('Drive links:', drives);
}
run();
