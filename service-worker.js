const CACHE = 'meine-schicht-v3';

const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(function(response) {
      var copy = response.clone();

      caches.open(CACHE).then(function(cache) {
        cache.put(event.request, copy);
      });

      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
