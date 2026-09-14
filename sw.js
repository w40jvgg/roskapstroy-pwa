const CACHE='rks-brandbook-v7-photo-control';
const CORE=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest',
  './assets/roskapstroy_logo_horizontal.png','./assets/roskapstroy_splash_logo.png','./assets/roskapstroy_pdf_logo.png','./assets/roskapstroy_app_icon_master.png',
  './icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{
    if(resp && resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
    return resp;
  }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
