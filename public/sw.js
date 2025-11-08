self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('clyra-static-v1').then((cache) => cache.addAll(['/','/favicon.ico','/manifest.webmanifest']))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith('clyra-static-v1')).map((k) => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open('clyra-static-v1').then((cache) => cache.put(request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});
