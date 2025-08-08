self.addEventListener('install', e => {
  e.waitUntil(caches.open('tc-v2').then(c => c.addAll([
    './', './index.html', './style.css', './app.js', './manifest.json'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
