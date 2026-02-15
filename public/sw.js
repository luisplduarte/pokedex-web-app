/**
 * Minimal service worker for offline navigation.
 * Caches same-origin GET responses by pathname so Next.js client-side navigation
 * (RSC payload fetch) can be served from cache when offline.
 */
const CACHE_NAME = "pokedex-offline-v1";

function pathnameKey(url) {
  return url.origin + url.pathname;
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Same-origin GET only. Cache app routes and Next.js static assets (chunks, CSS).
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  if (path.startsWith("/api")) return;
  // Allow app routes (/, /pokemon/1, etc.) and static assets so chunks load offline
  const isAppRoute = !path.startsWith("/_next");
  const isStaticAsset = path.startsWith("/_next/static/");
  if (!isAppRoute && !isStaticAsset) return;

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const key = new Request(pathnameKey(url));
          const clone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          // Buffer the clone so the cache gets a full body (streams can be tricky)
          const body = await clone.arrayBuffer();
          cache.put(key, new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          }));
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        const key = new Request(pathnameKey(url));
        const cached = await cache.match(key);
        if (cached) return cached;
        // No cache: return 503 so the app can show error UI instead of rendering body
        return new Response(null, {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
