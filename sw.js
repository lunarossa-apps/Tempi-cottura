const CACHE = 'tc-v3.1';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    './', './index.html', './style.css?v=3.1', './app.js?v=3.1', './manifest.json'
  ])));
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
