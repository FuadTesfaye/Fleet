const CACHE_NAME = 'ifms-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/login',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass caching for Next.js internal API/RSC routes and proxy
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_next/data') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Stale-While-Revalidate for static assets
  if (url.pathname.startsWith('/_next/static/') || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        }).catch(() => {
          // Fallback logic if needed
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Network First for other navigations
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
