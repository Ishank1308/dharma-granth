// Offline support: pages you have opened keep working without a network.
//   • HTML pages       network-first, cached copy when offline (capped). Never cache-first,
//                      so a new deploy's HTML is not stuck pointing at old JS chunks.
//   • /_next/static/*  cache-first (fingerprinted). A 404 is not cached.
//   • icons, fonts     stale-while-revalidate
//   • scripture JSON   network-first for files you have opened (capped)
// Everything else (analytics) goes straight to the network.
const VERSION = 'dg-v6';
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const SCRIPTURE = `${VERSION}-scripture`;
// Scriptures the reader chose to save (lib/offline-scriptures.ts). Kept across versions; only the reader removes them.
const OFFLINE = 'dharma-offline-scriptures-v1';
// Neural & Sanskrit verse recitation audio cache (lib/verse-audio.ts). Preserved across updates.
const AUDIO_CACHE = 'dharma-audio-cache-v1';
const MAX_PAGES = 120;
const MAX_SCRIPTURE = 40;
// A chapter page with comprehensive word-by-word padas and multiple commentaries
// can be up to 1MB. Capping at 1MB ensures all canonical texts are cached reliably.
const MAX_PAGE_BYTES = 1024 * 1024;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(VERSION) && k !== OFFLINE && k !== AUDIO_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })(),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

// Home link for the offline page: the worker's scope, so it also works under a base path.
const HOME = new URL('./', self.registration.scope).pathname;

const OFFLINE_HTML = `<!doctype html>
<html lang="hi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ऑफ़लाइन · Dharma Granth</title>
  <style>
    :root { --bg: #fdfbf7; --text: #2d2a26; --card: #ffffff; --border: #e8e3db; --primary: #c2410c; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #090908; --text: #f2eee7; --card: #151412; --border: #312b25; --primary: #f97316; }
    }
    body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2.5rem 1.5rem; max-width: 480px; width: 100%; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
    .symbol { font-size: 2.5rem; color: var(--primary); margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    p { font-size: 0.95rem; opacity: 0.85; margin: 0.5rem 0 1.5rem; line-height: 1.6; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    button, a { font: inherit; font-size: 0.875rem; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; cursor: pointer; transition: opacity 0.2s; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; }
    button { background: var(--primary); color: #fff; border: none; }
    a { background: transparent; color: var(--text); border: 1px solid var(--border); }
    button:hover, a:hover { opacity: 0.88; }
  </style>
</head>
<body>
  <main class="card" role="main">
    <div class="symbol" aria-hidden="true">ॐ</div>
    <h1 lang="hi">आप ऑफ़लाइन हैं</h1>
    <p lang="hi">इंटरनेट कनेक्शन उपलब्ध नहीं है। जो पृष्ठ आपने पहले खोले हैं, वे अब भी पढ़े जा सकते हैं।</p>
    <div class="actions">
      <button type="button" onclick="location.reload()">पुनः प्रयास करें (Retry)</button>
      <a href="${HOME}">मुख्य पृष्ठ (Home)</a>
    </div>
  </main>
</body>
</html>`;

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const copy = res.clone();
            const declared = Number(copy.headers.get('content-length'));
            const size = declared > 0 ? declared : (await copy.clone().blob()).size;
            if (size > 0 && size <= MAX_PAGE_BYTES) {
              const cache = await caches.open(PAGES);
              await cache.put(req, copy);
              trim(PAGES, MAX_PAGES);
            }
          }
          return res;
        } catch {
          const cached = (await caches.match(req, { cacheName: PAGES })) || (await caches.match(req, { cacheName: OFFLINE }));
          return (
            cached ||
            new Response(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
          );
        }
      })(),
    );
    return;
  }

  if (url.pathname.includes('/_next/static/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req, { cacheName: ASSETS });
        if (cached) return cached;
        const res = await fetch(req);
        if (res.ok) (await caches.open(ASSETS)).put(req, res.clone());
        return res;
      })(),
    );
    return;
  }

  // Visited scripture payloads. Network-first so a new text replaces the saved copy.
  if (/\/data\/scriptures-full\/|\/data\/hi-commentary\/|\/search\/(?:core-index\.json|shards\/)/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const copy = res.clone();
            const declared = Number(copy.headers.get('content-length'));
            const size = declared > 0 ? declared : (await copy.clone().blob()).size;
            if (size > 0 && size <= 2 * 1024 * 1024) {
              const cache = await caches.open(SCRIPTURE);
              await cache.put(req, copy);
              trim(SCRIPTURE, MAX_SCRIPTURE);
            }
          }
          return res;
        } catch {
          const cached = (await caches.match(req, { cacheName: SCRIPTURE })) || (await caches.match(req, { cacheName: OFFLINE }));
          if (cached) return cached;
          return new Response('', { status: 503 });
        }
      })(),
    );
    return;
  }

  // Sacred verse audio & timing tracks (offline parayana & high-fidelity recitation)
  if (/\/audio\/verses\//.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const audioCache = await caches.open(AUDIO_CACHE);
        const cached = await audioCache.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res.ok) {
            audioCache.put(req, res.clone());
          }
          return res;
        } catch {
          return new Response('', { status: 503 });
        }
      })(),
    );
    return;
  }

  if (/\/icons\/|\.(woff2?|ttf)$|\/chapter-index\.json$|\/search-index\/verses\.json$/.test(url.pathname)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const cached = await cache.match(req);
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })(),
    );
  }
});
