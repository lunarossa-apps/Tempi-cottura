const CACHE='tc-v6u';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./style.css?v=6u','./app.js?v=6u','./manifest.json','./assets/forno.jpg','./assets/airfryer.jpg','./assets/pwa_icon.png'])))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim()); e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))})