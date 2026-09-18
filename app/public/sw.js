// The Boardroom Dilemma — offline-friendly cache (registered in production only, see src/main.tsx).
// Hashed app files are cache-first. Photos, props, voice and fonts are served from cache and refreshed in
// the background. Films stream with range requests, so they always go to the network.

const VERSION = 'bd-v2'; // Bump when voice, photos or captions are replaced under the same file names.
const CACHE = `${VERSION}-media`;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range')) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /\.(mp4|mov)$/i.test(url.pathname)) return;

  if (/\/assets\//.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else if (/\.(avif|webp|jpe?g|png|webm|mp3|vtt|woff2?)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event, request));
  } else if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.status === 200) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => hit);
  if (hit) {
    event.waitUntil(refresh);
    return hit;
  }
  return refresh;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) ?? Response.error();
  }
}
