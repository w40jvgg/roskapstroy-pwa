const CACHE='rks-pwa-v8.1';
const CORE=[
 './','./index.html','./styles.css','./refinement.css','./app.js','./ui.js','./pdf.js','./manifest.webmanifest',
 './vendor/pdf-lib.min.js','./vendor/fontkit.umd.min.js',
 './assets/fonts/NotoSans-Regular.ttf','./assets/fonts/NotoSans-Bold.ttf',
 './assets/roskapstroy_logo_horizontal.png','./assets/roskapstroy_splash_logo.png','./assets/roskapstroy_pdf_logo.png',
 './assets/roskapstroy_app_icon_master.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&(k.startsWith('rks-pwa-')||k.startsWith('rks-brandbook-'))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
 const known=CORE.some(path=>new URL(path,self.registration.scope).href===e.request.url);
 if(!known&&e.request.mode!=='navigate')return;
 e.respondWith(caches.open(CACHE).then(async cache=>{
  const hit=await cache.match(e.request);
  if(hit)return hit;
  if(e.request.mode==='navigate')return await cache.match('./index.html')||fetch(e.request);
  return fetch(e.request);
 }));
});
