const CACHE='tc-v7-1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./style.css?v=7.1','./app.js?v=7.1','./manifest.json','./assets/forno.jpg','./assets/airfryer.jpg'])))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim()); e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))})