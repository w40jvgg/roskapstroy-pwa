const CACHE='rks-pwa-v1.8-pdf-fileshare';
const PDF_CACHE='rks-generated-pdf-v1';
const CORE=[
 './','./index.html','./styles.css?v=1.8','./refinement.css?v=1.8','./engineering-card.css?v=1.8','./app.js?v=1.8','./ui.js?v=1.8','./pdf.js?v=1.8','./manifest.webmanifest',
 './vendor/pdf-lib.min.js?v=1.8','./vendor/fontkit.umd.min.js?v=1.8',
 './assets/fonts/NotoSans-Regular.ttf','./assets/fonts/NotoSans-Bold.ttf',
 './assets/roskapstroy_logo_horizontal.png','./assets/roskapstroy_splash_logo.png','./assets/roskapstroy_pdf_logo.png',
 './assets/roskapstroy_app_icon_master.png','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('message',e=>{if(e.data?.type==='ACTIVATE')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==PDF_CACHE&&(k.startsWith('rks-pwa-')||k.startsWith('rks-brandbook-'))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));

async function generatedPdfResponse(request){
  const cache=await caches.open(PDF_CACHE);
  const stored=await cache.match(request.url,{ignoreSearch:true});
  if(!stored)return new Response('PDF not found',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  const type=stored.headers.get('Content-Type')||'application/pdf';
  const disposition=stored.headers.get('Content-Disposition')||'inline';
  if(request.method==='HEAD'){
    return new Response(null,{status:200,headers:{'Content-Type':type,'Content-Disposition':disposition,'Accept-Ranges':'bytes'}});
  }
  const range=request.headers.get('Range');
  if(!range)return stored;
  const data=await stored.arrayBuffer();
  const match=/bytes=(\d*)-(\d*)/.exec(range);
  if(!match)return stored;
  let start=match[1]?Number(match[1]):0;
  let end=match[2]?Number(match[2]):data.byteLength-1;
  if(!match[1]&&match[2]){const suffix=Number(match[2]);start=Math.max(0,data.byteLength-suffix);end=data.byteLength-1;}
  start=Math.max(0,Math.min(start,data.byteLength-1));
  end=Math.max(start,Math.min(end,data.byteLength-1));
  const body=data.slice(start,end+1);
  return new Response(body,{status:206,headers:{
    'Content-Type':type,'Content-Disposition':disposition,'Accept-Ranges':'bytes',
    'Content-Range':`bytes ${start}-${end}/${data.byteLength}`,'Content-Length':String(body.byteLength)
  }});
}

self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.includes('/__rks_pdf__/')&&(e.request.method==='GET'||e.request.method==='HEAD')){
   e.respondWith(generatedPdfResponse(e.request));return;
 }
 if(e.request.method!=='GET')return;
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
