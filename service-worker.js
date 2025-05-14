self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('dual-music-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/white_noise.mp3',
        '/manifest.json'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});