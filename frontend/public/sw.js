/* ProAICV PWA service worker — conservative network-first so users always get
   the latest app, with an offline fallback to the cached shell. */
const CACHE = 'proaicv-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navigations: network-first (fresh HTML), fall back to cached shell offline.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('/', fresh.clone()).catch(() => {});
        return fresh;
      } catch (e) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match('/');
        return cached || Response.error();
      }
    })());
  }
  // Other GETs (hashed assets, images) pass through to the network / HTTP cache.
});
