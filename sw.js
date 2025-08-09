const CACHE='tc-v7-7-4-core';
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    './','./index.html','./style.css?v=7.7.4','./app.js?v=7.7.4','./manifest.json'
  ])))
});
self.addEventListener('activate',e=>{
  e.waitUntil(self.clients.claim());
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch',e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });