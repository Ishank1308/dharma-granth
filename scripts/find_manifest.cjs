async function run() {
  try {
    const res = await fetch('https://gitapress.org/_next/static/development/_buildManifest.js').catch(() => null)
      || await fetch('https://gitapress.org');
    const text = await (await fetch('https://gitapress.org/ebook')).text();
    const manifestMatch = text.match(/\"\/_next\/static\/[a-zA-Z0-9_\-]+\/_buildManifest\.js\"/);
    console.log('Build manifest match:', manifestMatch);
    if (manifestMatch) {
      const url = 'https://gitapress.org' + JSON.parse(manifestMatch[0]);
      const mfRes = await fetch(url);
      const mfText = await mfRes.text();
      console.log('Build manifest:', mfText.slice(0, 500));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
