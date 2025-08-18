const CACHE_NAME = 'tramicuba-cache-v1';
const urlsToCache = [
  '/tramicuba/',
  '/tramicuba/index.html',
  '/tramicuba/css/styles.css',
  '/tramicuba/js/main.js',
  '/tramicuba/assets/icon.png',
  '/tramicuba/manifest.json'
];

// Instalaci�n: precache de recursos
self.addEventListener('install', event => {
  self.skipWaiting(); // activa el SW inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activaci�n: limpieza de versiones antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // toma control de las p�ginas abiertas
});

// Intercepci�n de peticiones
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache din�mico opcional (solo archivos est�ticos)
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Fallback offline para documentos HTML
      if (event.request.destination === 'document') {
        return caches.match('/tramicuba/index.html');
      }
    })
  );
});
