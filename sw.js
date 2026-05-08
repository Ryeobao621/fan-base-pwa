const CACHE = 'oceanstage-v3';
const ASSETS = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() =>
      caches.match(e.request).then(r => r || caches.match('./index.html'))
    )
  );
});

self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'OceanStage', body: '有新的應援資訊！' };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    vibrate: [200, 100, 200]
  }));
});
