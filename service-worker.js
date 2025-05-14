self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open('dual-music-cache').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/script.js',
        '/playlist.js',
        '/badges.js',
        '/auth.js',
        '/white_noise.mp3',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
