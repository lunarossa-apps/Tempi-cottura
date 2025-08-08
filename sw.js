const CACHE = 'tc-v4-regen';
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([
    './', './index.html', './style.css?v=4', './app.js?v=4', './manifest.json',
    './assets/icon-192.png','./assets/icon-512.png','./assets/banner-oven.png','./assets/banner-airfryer.png','./assets/banner-generic.png'
  ])));
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
