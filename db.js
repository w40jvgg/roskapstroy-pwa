const DB_NAME = 'RosKapStroyV18';
const DB_VERSION = 1;
export const STORES = ['defects','photoRecords','photoReports','drafts','metadata'];

function openDB(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name,{keyPath:'id'});
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(store, mode, action){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const tr = db.transaction(store, mode);
    const os = tr.objectStore(store);
    let result;
    try { result = action(os); } catch (e){ reject(e); return; }
    tr.oncomplete = () => resolve(result);
    tr.onerror = () => reject(tr.error);
    tr.onabort = () => reject(tr.error);
  });
}

export async function put(store, value){ await tx(store,'readwrite', os => os.put(value)); return value; }
export async function remove(store, id){ await tx(store,'readwrite', os => os.delete(id)); }
export async function clear(store){ await tx(store,'readwrite', os => os.clear()); }
export async function get(store, id){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const req = db.transaction(store,'readonly').objectStore(store).get(id);
    req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
  });
}
export async function getAll(store){
  const db = await openDB();
  return new Promise((resolve,reject)=>{
    const req = db.transaction(store,'readonly').objectStore(store).getAll();
    req.onsuccess=()=>resolve(req.result || []); req.onerror=()=>reject(req.error);
  });
}
export async function exportAll(){
  const payload = {schema:1,app:'РосКапСтрой',version:'1.8',exportedAt:new Date().toISOString(),stores:{}};
  for (const s of STORES) payload.stores[s] = await getAll(s);
  payload.uiSettings = JSON.parse(localStorage.getItem('rks-settings') || '{}');
  return payload;
}
export async function importAll(payload){
  if (!payload || typeof payload !== 'object') throw new Error('Некорректная резервная копия');
  const stores = payload.stores || payload;
  for (const s of STORES){
    const rows = Array.isArray(stores[s]) ? stores[s] : [];
    for (const row of rows) if (row && row.id != null) await put(s,row);
  }
  if (payload.uiSettings) localStorage.setItem('rks-settings', JSON.stringify(payload.uiSettings));
}
