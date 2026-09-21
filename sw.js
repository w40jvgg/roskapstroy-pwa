const CACHE='rks-pwa-v1.9.19-journal-cards-v1';
const LEGACY_PDF_CACHE='rks-generated-pdf-v1';
const CORE=[
 './','./index.html','./styles.css?v=1.9.16','./refinement.css?v=1.9.12','./engineering-card.css?v=1.9.12','./premium.css?v=1.9.13','./desktop.css?v=1.9.14','./remark-simple.css?v=1.9.18','./module-simple.css?v=1.9.18','./journal-cards.css?v=1.9.19','./app.js?v=1.9.19','./ui.js?v=1.9.12','./pdf.js?v=1.9.18','./manifest.webmanifest',
 './vendor/pdf-lib.min.js?v=1.9.12','./vendor/fontkit.umd.min.js?v=1.9.12','./vendor/jszip.min.js?v=1.9.12','./changelog.js?v=1.9.19','./rd-catalog.js?v=1.9.12',
 './assets/fonts/NotoSans-Regular.ttf','./assets/fonts/NotoSans-Bold.ttf',
 './assets/roskapstroy_logo_horizontal.png','./assets/roskapstroy_splash_logo.png','./assets/roskapstroy_pdf_logo.png',
 './assets/roskapstroy_app_icon_master.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&(k===LEGACY_PDF_CACHE||k.startsWith('rks-pwa-')||k.startsWith('rks-brandbook-'))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 const known=CORE.some(path=>new URL(path,self.registration.scope).href===e.request.url);
 if(!known&&e.request.mode!=='navigate')return;
 if(e.request.mode==='navigate'){
   e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return r;}).catch(()=>caches.match('./index.html')));
   return;
 }
 e.respondWith(caches.open(CACHE).then(async cache=>{
   const hit=await cache.match(e.request);
   if(hit)return hit;
   const response=await fetch(e.request);if(response.ok)cache.put(e.request,response.clone());return response;
 }));
});
