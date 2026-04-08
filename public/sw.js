const PAGE_CACHE = 'pages-v1';
const ASSET_CACHE = 'assets-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== PAGE_CACHE && key !== ASSET_CACHE)
                        .map((key) => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== location.origin) return;

    // Assets estáticos de Next.js y archivos públicos: CacheFirst
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname === '/giphy.gif'
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        caches
                            .open(ASSET_CACHE)
                            .then((cache) => cache.put(request, response.clone()));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Página /preguntas: NetworkFirst (intenta red, si falla sirve caché)
    if (url.pathname === '/preguntas') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        caches
                            .open(PAGE_CACHE)
                            .then((cache) => cache.put(request, response.clone()));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
    }
});
