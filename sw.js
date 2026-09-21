const CACHE = 'rks-v1.8-20260921';
const CORE = ['./','./index.html','./styles.css','./app.js','./db.js','./pdf.js','./manifest.webmanifest','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(res => {
    const clone = res.clone(); caches.open(CACHE).then(c => c.put(event.request, clone)); return res;
  }).catch(() => caches.match('./index.html'))));
});
