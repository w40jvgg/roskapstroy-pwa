'use strict';

const BRAND = {
  navy950: '#071F3D', navy800: '#0C365F', blue600: '#137EDB', blue400: '#3AA8FF', red600: '#E63224'
};

const DEFAULT_ISSUER = 'Ведущий инженер ОСК Щипин С.А.';
const DB_NAME = 'roskapstroy-control';
const DB_VERSION = 1;
const STORE = 'defects';
const SETTINGS_KEY = 'rks.settings.v1';
const CUSTOM_KEY = 'rks.custom.v1';
const OBJECTS_KEY = 'rks.objects.v1';

const NTD = [
  'ПУЭ, 7-е издание',
  'СП 76.13330.2016',
  'СП 256.1325800.2016',
  'СП 6.13130.2021',
  'СП 484.1311500.2020',
  'ГОСТ 31565-2012',
  'ГОСТ Р 50571.16-2019',
  'ГОСТ 21.210-2014',
  'ГОСТ 21.608-2021',
  'ГОСТ 21.613-2014',
  'СО 153-34.21.122-2003',
  'РД 34.21.122-87',
  'СП 520.1325800.2023',
  'ГОСТ Р 50571.5.52-2011',
  'Приказ Минстроя России от 16.05.2023 № 344/пр',
  'СП 48.13330.2019',
  'СП 134.13330.2022'
];

const WORK_SECTIONS = [
  { code: 'ЭМ', name: 'Силовое электрооборудование и электроосвещение' },
  { code: 'ЭС', name: 'Электроснабжение' },
  { code: 'ЭО', name: 'Электроосвещение' },
  { code: 'ЭГ', name: 'Заземление и молниезащита' },
  { code: 'СС', name: 'Слаботочные системы' },
  { code: 'АПС', name: 'Автоматическая пожарная сигнализация' },
  { code: 'СОУЭ', name: 'Система оповещения и управления эвакуацией' },
  { code: 'СКУД', name: 'Система контроля и управления доступом' },
  { code: 'СВН', name: 'Система видеонаблюдения' },
  { code: 'АТХ', name: 'Автоматизация технологических процессов' },
  { code: 'АК', name: 'Автоматизация и контроль' },
  { code: 'ПНР', name: 'Пусконаладочные работы' },
  { code: 'ИД', name: 'Исполнительная документация' }
];

const DEFECT_TYPES = [
  'Несоответствие рабочей документации',
  'Нарушение требований НТД',
  'Некачественный монтаж',
  'Отсутствие / нарушение маркировки',
  'Заземление и защитные меры',
  'Кабельные линии и трассы',
  'Пожарная безопасность',
  'Взрывозащита',
  'Комплектность / оформление ИД',
  'Повреждение оборудования или материала',
  'Отступление без согласования',
  'Другое'
];

const DEFAULT_OBJECTS = [
  {
    "gp": "001",
    "name": "Трансформаторная подстанция №1"
  },
  {
    "gp": "002",
    "name": "Трансформаторная подстанция №2"
  },
  {
    "gp": "003",
    "name": "Трансформаторная подстанция №3"
  },
  {
    "gp": "004",
    "name": "Трансформаторная подстанция №4"
  },
  {
    "gp": "005",
    "name": "Электро- щитовая №1"
  },
  {
    "gp": "006",
    "name": "Электро- щитовая №2"
  },
  {
    "gp": "007",
    "name": "Электро- щитовая №3"
  },
  {
    "gp": "011",
    "name": "Котельная №1"
  },
  {
    "gp": "012",
    "name": "Котельная №2"
  },
  {
    "gp": "014",
    "name": "Котельная №3"
  },
  {
    "gp": "021",
    "name": "КОС"
  },
  {
    "gp": "022",
    "name": "ЛОС"
  },
  {
    "gp": "023",
    "name": "Очистные сооружения №2 Насосная станция пожаротушения с трансформаторной подстанцией"
  },
  {
    "gp": "024",
    "name": "Канализационная насосная станция"
  },
  {
    "gp": "025",
    "name": "Канализационная насосная станция с резервуарами 5000 м3"
  },
  {
    "gp": "026.4",
    "name": "Водопропускной коллектор"
  },
  {
    "gp": "026",
    "name": "Трансформаторная подстанция"
  },
  {
    "gp": "028-НВК",
    "name": "Наружные сети системы канализации"
  },
  {
    "gp": "027",
    "name": "Автодорога КПП"
  },
  {
    "gp": "027-2",
    "name": "Автодорога КПП"
  },
  {
    "gp": "027",
    "name": "КПП-2"
  },
  {
    "gp": "029",
    "name": "КПП-4"
  },
  {
    "gp": "033",
    "name": "Железнодорожный грузовой фронт"
  },
  {
    "gp": "035",
    "name": "Подпорная стена № 1"
  },
  {
    "gp": "036",
    "name": "Подпорная стена № 2"
  },
  {
    "gp": "040",
    "name": "Буровзрывные работы под фундаменты сооружений и инженерные сети"
  },
  {
    "gp": "040.1",
    "name": "Благоустройство территории КПУ .ГП 4.6.2"
  },
  {
    "gp": "040",
    "name": "Вертикальная планировка"
  },
  {
    "gp": "030",
    "name": "КПП-3"
  },
  {
    "gp": "044",
    "name": "Ограждение территории КПУ"
  },
  {
    "gp": "045",
    "name": "Наружное освещение 1 очереди."
  },
  {
    "gp": "045",
    "name": "Наружные сети электроснабжения"
  },
  {
    "gp": "046",
    "name": "Наружные сети водоотведения"
  },
  {
    "gp": "047",
    "name": "Наружные сети водоснабжения"
  },
  {
    "gp": "048",
    "name": "Сети теплоснабжения"
  },
  {
    "gp": "049",
    "name": "Сети газоснабжения"
  },
  {
    "gp": "050",
    "name": "Сети связи"
  },
  {
    "gp": "101",
    "name": "Административно-бытовой корпус №1"
  },
  {
    "gp": "102",
    "name": "Административно-бытовой корпус №2"
  },
  {
    "gp": "034",
    "name": "Автоматическая очистка стрелок. Компрессорная"
  },
  {
    "gp": "201",
    "name": "Причал №1"
  },
  {
    "gp": "202",
    "name": "Причал № 2"
  },
  {
    "gp": "203",
    "name": "Подходная дамба."
  },
  {
    "gp": "204",
    "name": "Приводная станция"
  },
  {
    "gp": "205",
    "name": "Причальная погрузочная галерея"
  },
  {
    "gp": "206",
    "name": "Пересыпная станция № 8"
  },
  {
    "gp": "207",
    "name": "Конвейерная эстакада № 11"
  },
  {
    "gp": "208",
    "name": "Спец. проходная"
  },
  {
    "gp": "211",
    "name": "Светящийся навигационный знак Терминал Лавна южный"
  },
  {
    "gp": "212",
    "name": "Светящийся навигационный знак Терминал Лавна северный"
  },
  {
    "gp": "213",
    "name": "Модуль пограничного наряда"
  },
  {
    "gp": "214",
    "name": "Модуль пограничного наряда"
  },
  {
    "gp": "301",
    "name": "Пересыпная станция № 1"
  },
  {
    "gp": "302",
    "name": "Пересыпная станция № 2"
  },
  {
    "gp": "303",
    "name": "Пересыпная станция № 3"
  },
  {
    "gp": "304",
    "name": "Пересыпная станция № 4"
  },
  {
    "gp": "305",
    "name": "Пересыпная станция № 5"
  },
  {
    "gp": "306",
    "name": "Пересыпная станция № 6"
  },
  {
    "gp": "307",
    "name": "Пересыпная станция № 7"
  },
  {
    "gp": "309",
    "name": "Пересыпная станция № 9"
  },
  {
    "gp": "310",
    "name": "Пересыпная станция № 10"
  },
  {
    "gp": "311",
    "name": "Конвейерная эстакада №1"
  },
  {
    "gp": "312",
    "name": "Конвейерная эстакада №2"
  },
  {
    "gp": "313",
    "name": "Конвейерная эстакада №3"
  },
  {
    "gp": "314",
    "name": "Конвейерная эстакада №4"
  },
  {
    "gp": "315",
    "name": "Конвейерная эстакада №5"
  },
  {
    "gp": "316",
    "name": "Конвейерная эстакада №6"
  },
  {
    "gp": "317",
    "name": "Конвейерная эстакада №7"
  },
  {
    "gp": "318",
    "name": "Конвейерная эстакада №8"
  },
  {
    "gp": "319",
    "name": "Конвейерная эстакада №9"
  },
  {
    "gp": "320",
    "name": "Конвейерная эстакада №10"
  },
  {
    "gp": "321",
    "name": "Конвейерная эстакада №12"
  },
  {
    "gp": "322",
    "name": "Конвейерная эстакада №13"
  },
  {
    "gp": "323",
    "name": "Конвейерная эстакада №14"
  },
  {
    "gp": "331",
    "name": "Аспирационная установка №1"
  },
  {
    "gp": "332",
    "name": "Аспирационная установка №2"
  },
  {
    "gp": "333",
    "name": "Открытая складская площадка №1,2 с резервной площадкой для охлаждения угля Пути стакера П2, П3"
  },
  {
    "gp": "335",
    "name": "Открытая складская площадка №3 с резервной площадкой для охлаждения угля."
  },
  {
    "gp": "335",
    "name": "Открытая складская площадка №3 с резервной площадкой для охлаждения угля. Пути стакера- реклаймера П1"
  },
  {
    "gp": "336",
    "name": "Открытая складская площадка №2,4 с резервной площадкой для охлаждения угля Пути стакера П4, П5"
  },
  {
    "gp": "401",
    "name": "Станция разгрузки вагонов"
  },
  {
    "gp": "402",
    "name": "Железнодорожный грузовой фронт - Станция размораживания грузов №1"
  },
  {
    "gp": "403",
    "name": "Железнодорожный грузовой фронт - Станция размораживания грузов №2"
  },
  {
    "gp": "405",
    "name": "КПП-1"
  },
  {
    "gp": "406",
    "name": "Здание поста электрической централизации"
  },
  {
    "gp": "408",
    "name": "Железнодорожный грузовой фронт. Резательный комплекс"
  },
  {
    "gp": "409",
    "name": "Въездные ворота"
  },
  {
    "gp": "501",
    "name": "Ремонтно-механическая мастерская"
  },
  {
    "gp": "502",
    "name": "Материальный склад"
  },
  {
    "gp": "503",
    "name": "Гараж"
  },
  {
    "gp": "504",
    "name": "Топливозаправочный пункт"
  },
  {
    "gp": "505",
    "name": "Лаборатория"
  },
  {
    "gp": "506",
    "name": "Склад инвентаря"
  },
  {
    "gp": "601",
    "name": "Здание пожарного депо на 2 автомобиля"
  },
  {
    "gp": "602",
    "name": "Закрытая гараж-стоянка резервных автомобилей"
  },
  {
    "gp": "603",
    "name": "Пост мойки колес"
  },
  {
    "gp": "604",
    "name": "Склад пенообразователя"
  },
  {
    "gp": "605",
    "name": "Подземный резервуар 50 м3"
  },
  {
    "gp": "607",
    "name": "Площадка с учебной башней"
  },
  {
    "gp": "609",
    "name": "Волейбольная площадка"
  },
  {
    "gp": "610",
    "name": "Площадка накопления отходов"
  },
  {
    "gp": "702",
    "name": "Склад СУГ"
  },
  {
    "gp": "006",
    "name": "Электрощитовая №2"
  },
  {
    "gp": "024",
    "name": "КНС"
  },
  {
    "gp": "334",
    "name": "Открытая складская площадка №2 с резервной площадкой для освежения угля"
  },
  {
    "gp": "333.334",
    "name": "Открытая складская площадка №1,2 с резервной площадкой для освежения угля"
  },
  {
    "gp": "405",
    "name": "Контрольно-пропускной пункт №1"
  },
  {
    "gp": "045",
    "name": "Электроснабжение"
  },
  {
    "gp": "309",
    "name": "Пересыпная станция №9"
  },
  {
    "gp": "051",
    "name": "Инженерные сети и системы Морского пункта пропуска. Сети связи"
  },
  {
    "gp": "401.1",
    "name": "Станция разгрузки вагонов"
  },
  {
    "gp": "201.203",
    "name": "Причал № 1, Причал № 2"
  },
  {
    "gp": "201.202",
    "name": "Причал № 1, Причал № 2"
  },
  {
    "gp": "050",
    "name": "Инженерные сети и системы. Сети связи"
  },
  {
    "gp": "302",
    "name": "Пересыпная станция №2"
  },
  {
    "gp": "301",
    "name": "Пересыпная станция №1"
  },
  {
    "gp": "303",
    "name": "Пересыпная станция №3"
  },
  {
    "gp": "001",
    "name": "Трансформаторная подстанция №1 с электрощитовой"
  },
  {
    "gp": "005",
    "name": "Электрощитовая № 1"
  },
  {
    "gp": "206",
    "name": "Пересыпная станция №8"
  },
  {
    "gp": "004",
    "name": "ТП № 4"
  }
];

const STATUS_ORDER = ['Черновик','Выдано','В работе','На проверке','Устранено','Закрыто'];

const $ = (id) => document.getElementById(id);
const refs = {};
let db;
let defects = [];
let currentFilter = 'all';
let editingId = null;
let formState = freshFormState();
let currentPicker = null;
let pickerItems = [];

function freshFormState(){
  return { object:'', objectGp:'', objectName:'', workSection:'', defectType:'', photosBefore:[], photosAfter:[], ntd:[] };
}
function today(){ return new Date().toISOString().slice(0,10); }
function uid(){ return (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function esc(v=''){ return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function nl(v=''){ return esc(v).replace(/\n/g,'<br>'); }
function fmtDate(v){
  if(!v) return '—';
  const d = new Date(`${v}T00:00:00`);
  if(Number.isNaN(d.getTime())) return v;
  return new Intl.DateTimeFormat('ru-RU').format(d);
}
function filenameSafe(v=''){ return String(v).replace(/[\\/:*?"<>|]+/g,'_'); }
function isResolved(d){ return ['Устранено','Закрыто'].includes(d.status); }
function isOverdue(d){ return Boolean(d.dueDate && !isResolved(d) && d.dueDate < today()); }
function normalizeNumber(v){ return String(v || '').trim().replace(/\s+/g,' '); }
function numberValue(v){ const m = String(v||'').match(/(\d+)(?!.*\d)/); return m ? Number(m[1]) : 0; }
function formatNumber(n){ return `РКС-${String(n).padStart(4,'0')}`; }
function nextNumber(){ return formatNumber(Math.max(0,...defects.map(d=>numberValue(d.number))) + 1); }

function cacheRefs(){
  [...document.querySelectorAll('[id]')].forEach(el => refs[el.id] = el);
}

function openDb(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE,{keyPath:'id'});
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function dbAll(){
  return new Promise((resolve,reject)=>{
    const req = db.transaction(STORE,'readonly').objectStore(STORE).getAll();
    req.onsuccess = ()=>resolve(req.result||[]); req.onerror=()=>reject(req.error);
  });
}
function dbPut(record){
  return new Promise((resolve,reject)=>{
    const req = db.transaction(STORE,'readwrite').objectStore(STORE).put(record);
    req.onsuccess=()=>resolve(record); req.onerror=()=>reject(req.error);
  });
}
function dbDelete(id){
  return new Promise((resolve,reject)=>{
    const req=db.transaction(STORE,'readwrite').objectStore(STORE).delete(id);
    req.onsuccess=()=>resolve(); req.onerror=()=>reject(req.error);
  });
}
function dbClear(){
  return new Promise((resolve,reject)=>{
    const req=db.transaction(STORE,'readwrite').objectStore(STORE).clear();
    req.onsuccess=()=>resolve(); req.onerror=()=>reject(req.error);
  });
}

function loadSettings(){
  const defaults={fontSize:100,bold:false,contrast:false,largeButtons:false,theme:'system'};
  try { return {...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}; } catch { return defaults; }
}
function saveSettings(settings){ localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings)); applySettings(settings); }
function applySettings(s){
  const root=document.documentElement;
  root.style.setProperty('--font-scale',String((Number(s.fontSize)||100)/100));
  root.classList.toggle('bold-text',Boolean(s.bold));
  root.classList.toggle('high-contrast',Boolean(s.contrast));
  root.classList.toggle('large-buttons',Boolean(s.largeButtons));
  if(s.theme==='system') root.removeAttribute('data-theme'); else root.dataset.theme=s.theme;
  if(refs.fontSizeRange){
    refs.fontSizeRange.value=s.fontSize; refs.fontSizeLabel.textContent=`${s.fontSize}%`;
    refs.boldTextToggle.checked=s.bold; refs.contrastToggle.checked=s.contrast; refs.largeButtonsToggle.checked=s.largeButtons;
    document.querySelectorAll('.theme-option').forEach(b=>b.classList.toggle('active',b.dataset.theme===s.theme));
  }
}
function getCustom(){ try{return JSON.parse(localStorage.getItem(CUSTOM_KEY)||'{"object":[],"workSection":[],"defectType":[]}')}catch{return {object:[],workSection:[],defectType:[]}} }
function saveCustom(c){ localStorage.setItem(CUSTOM_KEY,JSON.stringify(c)); }
function normalizeObjectEntry(value){
  if(!value) return null;
  if(typeof value==='object'){
    const gp=String(value.gp ?? value.gpNumber ?? value.number ?? value.code ?? '').trim();
    const name=String(value.name ?? value.title ?? value.objectName ?? '').replace(/\s*\n\s*/g,' ').trim();
    return name ? {gp,name} : null;
  }
  const text=String(value).replace(/\s*\n\s*/g,' ').trim();
  if(!text) return null;
  let m=text.match(/^(.+?)\s+[—–]\s+(.+)$/);
  if(m) return {gp:m[1].trim(),name:m[2].trim()};
  m=text.match(/^(.*?)\s*\(([^()]+?)\s*ГП\)\s*$/i);
  if(m) return {gp:m[2].trim(),name:m[1].trim()};
  return {gp:'',name:text};
}
function objectKey(o){return `${String(o?.gp||'').trim().toLowerCase()}|${String(o?.name||'').trim().toLowerCase()}`;}
function objectDisplay(o){
  const gp=String(o?.gp||'').trim(), name=String(o?.name||'').trim();
  return gp && name ? `${gp} — ${name}` : (name||gp||'');
}
function getObjects(){
  try{
    const stored=JSON.parse(localStorage.getItem(OBJECTS_KEY)||'null');
    const source=Array.isArray(stored)&&stored.length?stored:DEFAULT_OBJECTS;
    const out=[],seen=new Set();
    for(const raw of source){const o=normalizeObjectEntry(raw);if(!o)continue;const k=objectKey(o);if(seen.has(k))continue;seen.add(k);out.push(o);}
    return out;
  }catch{return DEFAULT_OBJECTS.map(x=>({...x}));}
}
function saveObjects(arr){
  const out=[],seen=new Set();
  for(const raw of arr||[]){const o=normalizeObjectEntry(raw);if(!o)continue;const k=objectKey(o);if(seen.has(k))continue;seen.add(k);out.push(o);}
  localStorage.setItem(OBJECTS_KEY,JSON.stringify(out));
  if(refs.objectReferenceCount) refs.objectReferenceCount.textContent=`Справочник объектов • ${out.length}`;
}

async function refresh(){
  defects = (await dbAll()).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  renderDashboard();
}

function renderDashboard(){
  const q=(refs.searchInput?.value||'').trim().toLowerCase();
  let items=defects.filter(d=>{
    if(currentFilter==='open' && isResolved(d)) return false;
    if(currentFilter==='overdue' && !isOverdue(d)) return false;
    if(currentFilter==='closed' && d.status!=='Закрыто') return false;
    if(!q) return true;
    return [d.number,d.object,d.objectGp,d.objectName,d.contractor,d.description,d.location,d.defectType,d.workSection,d.status].some(v=>String(v||'').toLowerCase().includes(q));
  });

  const overdue=defects.filter(isOverdue).length;
  const open=defects.filter(d=>!isResolved(d)).length;
  const checking=defects.filter(d=>d.status==='На проверке').length;
  refs.stats.innerHTML=[
    ['Всего',defects.length],['Открыто',open],['На проверке',checking],['Просрочено',overdue]
  ].map(([label,n])=>`<div class="stat-card"><strong>${n}</strong><span>${label}</span></div>`).join('');

  refs.emptyState.classList.toggle('hidden',items.length>0);
  refs.defectList.innerHTML=items.map(d=>{
    const overdueClass=isOverdue(d)?' overdue':'';
    const statusClass=d.status==='Закрыто'?' closed':(isOverdue(d)?' overdue':'');
    const meta=[d.workSection,d.dueDate?`Срок ${fmtDate(d.dueDate)}`:''].filter(Boolean).join(' • ');
    const parsed=normalizeObjectEntry({gp:d.objectGp,name:d.objectName}) || normalizeObjectEntry(d.object) || {gp:'',name:'Объект не указан'};
    const photo=(d.photosBefore||[])[0]||'';
    return `<article class="defect-card${overdueClass}${photo?' has-photo':''}" data-id="${esc(d.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(d.number)}">
      ${photo?`<img class="card-photo" src="${photo}" alt="Фото недостатка">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(d.number)}</span><span class="status-pill${statusClass}">${esc(isOverdue(d)?'Просрочено':d.status)}</span></div>
        <div class="card-object">${parsed.gp?`<span class="card-gp">${esc(parsed.gp)} ГП</span>`:''}<span class="card-object-name">${esc(parsed.name||'Объект не указан')}</span></div>
        <p class="card-description">${esc(d.description||'Описание не заполнено')}</p>
        <div class="card-bottom"><span class="card-meta">${esc(meta||fmtDate(d.date))}</span><span class="card-meta">›</span></div>
      </div>
    </article>`;
  }).join('');
  refs.defectList.querySelectorAll('.defect-card').forEach(card=>{
    const open=()=>openForm(card.dataset.id);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}
function showView(view){
  ['mainView','formView','settingsView'].forEach(id=>refs[id].classList.toggle('active-view',id===view));
  refs.app?.classList.toggle('detail-mode',view!=='mainView');
  window.scrollTo({top:0,behavior:'instant'});
}

function resetFormDom(){
  refs.defectForm.reset();
  refs.issuerInput.value=DEFAULT_ISSUER;
  refs.statusInput.value='Черновик';
  refs.dateInput.value=today();
  refs.signDateInput.value=today();
  refs.numberInput.value=nextNumber();
  formState=freshFormState();
  editingId=null;
  refs.formTitle.textContent='Новое замечание';
  refs.deleteDefectButton.classList.add('hidden');
  refs.objectSearchInput.value='';
  refs.objectSearchResults.classList.add('hidden');
  refs.objectSearchResults.innerHTML='';
  updatePickerLabels(); renderPhotos(); renderNtd();
}

function objectFromRecord(d){
  const direct=normalizeObjectEntry({gp:d?.objectGp,name:d?.objectName});
  if(direct?.name) return direct;
  return normalizeObjectEntry(d?.object)||{gp:'',name:''};
}

function openForm(id=null){
  resetFormDom();
  if(id){
    const d=defects.find(x=>x.id===id); if(!d) return;
    editingId=id;
    refs.formTitle.textContent=d.number||'Замечание';
    refs.numberInput.value=d.number||''; refs.dateInput.value=d.date||today(); refs.statusInput.value=d.status||'Черновик';
    refs.locationInput.value=d.location||''; refs.descriptionInput.value=d.description||''; refs.remedyInput.value=d.remedy||'';
    refs.dueDateInput.value=d.dueDate||''; refs.signDateInput.value=d.signDate||''; refs.contractorInput.value=d.contractor||''; refs.issuerInput.value=d.issuer||DEFAULT_ISSUER;
    const o=objectFromRecord(d);
    formState={
      object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',workSection:d.workSection||'',defectType:d.defectType||'',
      photosBefore:[...(d.photosBefore||[])],photosAfter:[...(d.photosAfter||[])],ntd:(d.ntd||[]).map(x=>({...x}))
    };
    refs.objectSearchInput.value=objectDisplay(o);
    refs.deleteDefectButton.classList.remove('hidden');
    updatePickerLabels(); renderPhotos(); renderNtd();
  }
  showView('formView');
}

function updateObjectSummary(){
  refs.objectGpValue.textContent=formState.objectGp||'—';
  refs.objectNameValue.textContent=formState.objectName||'Объект не выбран';
}
function updatePickerLabels(){
  updateObjectSummary();
  refs.workSectionValue.textContent=formState.workSection||'Выбрать раздел';
  refs.defectTypeValue.textContent=formState.defectType||'Выбрать тип';
}

function recordFromForm(){
  const object=objectDisplay({gp:formState.objectGp,name:formState.objectName}) || formState.object;
  return {
    id: editingId || uid(),
    number:normalizeNumber(refs.numberInput.value), date:refs.dateInput.value, status:refs.statusInput.value,
    object, objectGp:formState.objectGp||'', objectName:formState.objectName||'', location:refs.locationInput.value.trim(), workSection:formState.workSection, defectType:formState.defectType,
    photosBefore:[...formState.photosBefore], photosAfter:[...formState.photosAfter],
    description:refs.descriptionInput.value.trim(), remedy:refs.remedyInput.value.trim(), ntd:formState.ntd.map(x=>({name:x.name,clause:String(x.clause||'').trim()})),
    dueDate:refs.dueDateInput.value, signDate:refs.signDateInput.value, contractor:refs.contractorInput.value.trim(), issuer:refs.issuerInput.value.trim()||DEFAULT_ISSUER,
    createdAt: editingId ? (defects.find(x=>x.id===editingId)?.createdAt||new Date().toISOString()) : new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
}
function validateRecord(r,{forPdf=false}={}){
  if(!r.number){ toast('Укажите номер замечания'); refs.numberInput.focus(); return false; }
  if(defects.some(d=>d.id!==editingId && normalizeNumber(d.number).toLowerCase()===r.number.toLowerCase())){toast('Такой номер замечания уже используется');refs.numberInput.focus();return false;}
  if(!r.date){ toast('Укажите дату замечания'); return false; }
  if(!r.objectName && !r.object){ toast('Выберите объект через поиск'); refs.objectSearchInput.focus(); return false; }
  if(!r.defectType){ toast('Выберите тип недостатка'); return false; }
  if(!r.description){ toast('Заполните описание недостатка'); refs.descriptionInput.focus(); return false; }
  const missingClause=r.ntd.find(x=>!x.clause);
  if(missingClause){ toast(`Укажите пункт: ${missingClause.name}`); return false; }
  if(forPdf && !r.signDate){ toast('Укажите дату подписания документа'); return false; }
  return true;
}

async function saveForm(e){
  e.preventDefault();
  const r=recordFromForm(); if(!validateRecord(r)) return;
  editingId=r.id; await dbPut(r); await refresh(); toast('Замечание сохранено'); refs.formTitle.textContent=r.number; refs.deleteDefectButton.classList.remove('hidden');
}

async function deleteCurrent(){
  if(!editingId) return;
  if(!confirm('Удалить это замечание? Действие нельзя отменить.')) return;
  await dbDelete(editingId); await refresh(); showView('mainView'); toast('Замечание удалено');
}

function setObjectSelection(raw){
  const o=normalizeObjectEntry(raw); if(!o) return;
  formState.objectGp=o.gp||''; formState.objectName=o.name||''; formState.object=objectDisplay(o);
  refs.objectSearchInput.value=formState.object;
  refs.objectSearchResults.classList.add('hidden'); refs.objectSearchResults.innerHTML='';
  updateObjectSummary();
}
function clearObjectSelection(){
  formState.object='';formState.objectGp='';formState.objectName='';updateObjectSummary();
}
function renderObjectSearch(){
  const q=refs.objectSearchInput.value.trim().toLowerCase();
  const selected=objectDisplay({gp:formState.objectGp,name:formState.objectName}).toLowerCase();
  if(q!==selected) clearObjectSelection();
  const source=getObjects();
  const ranked=source.map(o=>{
    const gp=String(o.gp||'').toLowerCase(), name=String(o.name||'').toLowerCase();
    let score=0;
    if(!q) score=1;
    else if(gp===q) score=100;
    else if(gp.startsWith(q)) score=80;
    else if(name.startsWith(q)) score=60;
    else if(gp.includes(q)||name.includes(q)) score=40;
    return {o,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||String(a.o.gp).localeCompare(String(b.o.gp),'ru')).slice(0,12);
  refs.objectSearchResults.innerHTML=ranked.length?ranked.map(({o})=>`<button type="button" class="object-result" data-gp="${encodeURIComponent(o.gp||'')}" data-name="${encodeURIComponent(o.name||'')}"><span class="object-result-gp">${esc(o.gp||'—')} ГП</span><span class="object-result-name">${esc(o.name)}</span></button>`).join(''):'<div class="object-result-empty">Ничего не найдено. Проверьте № ГП или название.</div>';
  refs.objectSearchResults.classList.remove('hidden');
  refs.objectSearchResults.querySelectorAll('.object-result').forEach(btn=>btn.onclick=()=>setObjectSelection({gp:decodeURIComponent(btn.dataset.gp),name:decodeURIComponent(btn.dataset.name)}));
}
function startNewFromToolbar(){
  const hasData=editingId || refs.descriptionInput.value.trim() || formState.photosBefore.length || formState.objectName;
  if(hasData && !confirm('Открыть новое замечание? Несохранённые изменения текущей карточки будут потеряны.')) return;
  openForm();
}

function openPicker(type){
  currentPicker=type;
  const custom=getCustom();
  if(type==='workSection'){
    refs.pickerTitle.textContent='Раздел работ';
    pickerItems=WORK_SECTIONS.map(x=>({value:`${x.code} — ${x.name}`,label:x.code,sub:x.name})).concat((custom.workSection||[]).map(v=>({value:v,label:v})));
  } else {
    refs.pickerTitle.textContent='Тип недостатка';
    pickerItems=[...new Set([...DEFECT_TYPES,...(custom.defectType||[])])].map(v=>({value:v,label:v}));
  }
  refs.pickerSearch.value=''; refs.customValueInput.value=''; refs.customValueRow.classList.remove('hidden');
  renderPickerList(); refs.pickerDialog.showModal(); setTimeout(()=>refs.pickerSearch.focus(),80);
}
function renderPickerList(){
  const q=refs.pickerSearch.value.trim().toLowerCase();
  const arr=pickerItems.filter(x=>`${x.label} ${x.sub||''}`.toLowerCase().includes(q));
  refs.pickerList.innerHTML=arr.map((x,i)=>`<button type="button" class="picker-option" data-index="${i}" data-value="${encodeURIComponent(x.value)}"><strong>${esc(x.label)}</strong>${x.sub?`<small>${esc(x.sub)}</small>`:''}</button>`).join('') || '<p class="field-hint">Ничего не найдено. Можно добавить свой вариант ниже.</p>';
  refs.pickerList.querySelectorAll('.picker-option').forEach(b=>b.onclick=()=>selectPicker(decodeURIComponent(b.dataset.value)));
}
function selectPicker(value){
  formState[currentPicker]=value; updatePickerLabels(); refs.pickerDialog.close();
}
function addCustomPicker(){
  const v=refs.customValueInput.value.trim(); if(!v) return;
  const custom=getCustom(); custom[currentPicker]=[...new Set([...(custom[currentPicker]||[]),v])]; saveCustom(custom);
  selectPicker(v);
}

function openNtd(){
  refs.ntdSearch.value=''; renderNtdPicker(); refs.ntdDialog.showModal(); setTimeout(()=>refs.ntdSearch.focus(),80);
}
function renderNtdPicker(){
  const q=refs.ntdSearch.value.trim().toLowerCase();
  refs.ntdPickerList.innerHTML=NTD.filter(v=>v.toLowerCase().includes(q)).map(v=>`<button type="button" class="picker-option ntd-pick" data-value="${encodeURIComponent(v)}"><strong>${esc(v)}</strong></button>`).join('');
  refs.ntdPickerList.querySelectorAll('.ntd-pick').forEach(b=>b.onclick=()=>{
    const name=decodeURIComponent(b.dataset.value);
    if(!formState.ntd.some(x=>x.name===name)) formState.ntd.push({name,clause:''});
    renderNtd(); refs.ntdDialog.close();
  });
}
function renderNtd(){
  refs.ntdList.innerHTML=formState.ntd.map((x,i)=>`<div class="ntd-item">
    <div class="ntd-name">${esc(x.name)}</div>
    <div class="ntd-controls"><input data-ntd-clause="${i}" value="${esc(x.clause||'')}" placeholder="Пункт(ы), например: 2.3.15" aria-label="Пункт ${esc(x.name)}" required><button type="button" data-ntd-remove="${i}" aria-label="Удалить">×</button></div>
  </div>`).join('');
  refs.ntdList.querySelectorAll('[data-ntd-clause]').forEach(inp=>inp.oninput=()=>formState.ntd[Number(inp.dataset.ntdClause)].clause=inp.value);
  refs.ntdList.querySelectorAll('[data-ntd-remove]').forEach(btn=>btn.onclick=()=>{formState.ntd.splice(Number(btn.dataset.ntdRemove),1);renderNtd();});
}

async function compressFile(file){
  if(!(file.type||'').startsWith('image/') && !/\.(jpe?g|png|webp|heic|heif)$/i.test(file.name||'')) throw new Error('Файл не является изображением');
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
    const max=1600; const scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
    const w=Math.max(1,Math.round(img.naturalWidth*scale)), h=Math.max(1,Math.round(img.naturalHeight*scale));
    const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
    const ctx=canvas.getContext('2d',{alpha:false}); ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);
    return canvas.toDataURL('image/jpeg',0.72);
  } finally { URL.revokeObjectURL(url); }
}
async function addPhotos(files,target){
  const list=[...files]; if(!list.length) return;
  toast('Сжимаю фотографии…');
  for(const file of list){
    try{ formState[target].push(await compressFile(file)); }catch(e){ console.error(e); toast(`Не удалось обработать ${file.name}`); }
  }
  renderPhotos(); toast('Фото добавлены');
}
function renderPhotos(){
  renderPhotoGroup(refs.photoBeforeGrid,'photosBefore'); renderPhotoGroup(refs.photoAfterGrid,'photosAfter');
}
function renderPhotoGroup(container,key){
  container.innerHTML=formState[key].map((src,i)=>`<div class="photo-thumb"><img src="${src}" alt="Фото ${i+1}"><button type="button" data-photo-remove="${i}" aria-label="Удалить фото">×</button></div>`).join('');
  container.querySelectorAll('[data-photo-remove]').forEach(b=>b.onclick=()=>{formState[key].splice(Number(b.dataset.photoRemove),1);renderPhotos();});
}

function pdfHtml(r){
  const logo=new URL('assets/roskapstroy_pdf_logo.png',location.href).href;
  const ntd=r.ntd.length?r.ntd.map(x=>`<li><b>${esc(x.name)}</b> — п. ${esc(x.clause)}</li>`).join(''):'<li>Не указана</li>';
  const photoBlock=(title,arr)=>arr.length?`<section class="photos"><h3>${title}</h3><div class="photoGrid">${arr.map((src,i)=>`<figure><img src="${src}" alt="${title} ${i+1}"><figcaption>${title} №${i+1}</figcaption></figure>`).join('')}</div></section>`:'';
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(r.number)} — замечание</title><style>
    @page{size:A4;margin:12mm 12mm 14mm}*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#101820;margin:0;font-size:10.2pt;line-height:1.38}header{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid ${BRAND.navy950};padding-bottom:7mm;margin-bottom:5mm}.logo{width:74mm;max-height:22mm;object-fit:contain;object-position:left center}.docTitle{text-align:right}.docTitle h1{margin:0;color:${BRAND.navy950};font-size:16pt}.docTitle div{color:#667788;margin-top:2mm}.meta{width:100%;border-collapse:collapse;margin-bottom:4mm}.meta td{border:1px solid #cbd4dd;padding:2.4mm;vertical-align:top}.meta .label{width:31%;color:#5b6a78;font-size:8.6pt}.section{border:1px solid #d7dfe7;border-radius:3mm;margin:3mm 0;padding:3.3mm;break-inside:avoid}.section h2,.photos h3{font-size:10.5pt;margin:0 0 2mm;color:${BRAND.navy800}}.section p{margin:0;white-space:pre-wrap}.ntd{margin:0;padding-left:5mm}.ntd li{margin:1.2mm 0}.photoGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:3mm}.photoGrid figure{margin:0;border:1px solid #d7dfe7;border-radius:2mm;overflow:hidden;break-inside:avoid}.photoGrid img{display:block;width:100%;height:64mm;object-fit:cover;background:#eef3f7}.photoGrid figcaption{padding:1.5mm 2mm;font-size:8pt;color:#667788}.signature{margin-top:7mm;display:grid;grid-template-columns:1fr 50mm;gap:8mm;align-items:end}.line{border-bottom:1px solid #495563;height:8mm}.small{font-size:8pt;color:#667788}.badge{display:inline-block;border-radius:999px;background:#e8f3ff;color:${BRAND.blue600};padding:1mm 2.2mm;font-weight:700}.foot{margin-top:5mm;border-top:1px solid #dde4ea;padding-top:2mm;color:#7a8794;font-size:7.5pt}button{position:fixed;right:14px;bottom:14px;border:0;border-radius:12px;padding:12px 16px;background:${BRAND.blue600};color:white;font-weight:700;box-shadow:0 8px 22px #0002}@media print{button{display:none}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  </style></head><body>
    <header><img class="logo" src="${logo}" alt="РосКапСтрой"><div class="docTitle"><h1>ЛИСТ ЗАМЕЧАНИЯ</h1><div>${esc(r.number)}</div></div></header>
    <table class="meta"><tr><td><div class="label">Дата выявления</div><b>${fmtDate(r.date)}</b></td><td><div class="label">Дата подписания</div><b>${fmtDate(r.signDate)}</b></td></tr><tr><td><div class="label">№ по ГП</div><b>${esc(r.objectGp||'—')}</b></td><td><div class="label">Наименование объекта</div><b>${esc(r.objectName||r.object||'—')}</b></td></tr><tr><td><div class="label">Место</div>${esc(r.location||'—')}</td><td><div class="label">Статус</div><span class="badge">${esc(r.status)}</span></td></tr><tr><td><div class="label">Раздел работ</div>${esc(r.workSection||'—')}</td><td><div class="label">Тип недостатка</div>${esc(r.defectType||'—')}</td></tr><tr><td><div class="label">Ответственная организация</div>${esc(r.contractor||'—')}</td><td><div class="label">Плановая дата устранения</div>${fmtDate(r.dueDate)}</td></tr></table>
    <section class="section"><h2>Описание недостатка</h2><p>${nl(r.description||'—')}</p></section>
    <section class="section"><h2>Нормативная документация</h2><ol class="ntd">${ntd}</ol></section>
    <section class="section"><h2>Указания по устранению</h2><p>${nl(r.remedy||'—')}</p></section>
    ${photoBlock('Фото недостатка',r.photosBefore)}${photoBlock('Фото после устранения',r.photosAfter)}
    <div class="signature"><div><div class="small">Документ выдан</div><b>${esc(r.issuer||DEFAULT_ISSUER)}</b></div><div><div class="line"></div><div class="small">Подпись</div></div></div>
    <div class="foot">Сформировано в приложении «РосКапСтрой». Фотографии автоматически оптимизированы для уменьшения размера документа.</div>
    <button onclick="window.print()">Сохранить / печать PDF</button>
    <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),450));</script>
  </body></html>`;
}
function imageFromSrc(src){
  return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});
}
function canvasJpegBytes(canvas,quality=.78){
  const b64=canvas.toDataURL('image/jpeg',quality).split(',')[1];
  const bin=atob(b64), out=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i); return out;
}
function concatBytes(parts){
  const len=parts.reduce((n,p)=>n+p.length,0), out=new Uint8Array(len); let o=0; for(const p of parts){out.set(p,o);o+=p.length;} return out;
}
function pdfFromJpegs(images,widthPx,heightPx){
  const enc=new TextEncoder(), txt=s=>enc.encode(s); const pageW=595.28,pageH=841.89;
  const last=2+images.length*3; const objects=new Array(last+1);
  objects[1]=txt('<< /Type /Catalog /Pages 2 0 R >>');
  const kids=images.map((_,i)=>`${3+i*3} 0 R`).join(' ');
  objects[2]=txt(`<< /Type /Pages /Kids [${kids}] /Count ${images.length} >>`);
  images.forEach((jpg,i)=>{
    const pageObj=3+i*3, imageObj=4+i*3, contentObj=5+i*3;
    objects[pageObj]=txt(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
    const imHead=txt(`<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
    objects[imageObj]=concatBytes([imHead,jpg,txt('\nendstream')]);
    const cmd=txt(`q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`);
    objects[contentObj]=concatBytes([txt(`<< /Length ${cmd.length} >>\nstream\n`),cmd,txt('endstream')]);
  });
  const chunks=[txt('%PDF-1.3\n')], offsets=new Array(last+1).fill(0); let pos=chunks[0].length;
  for(let n=1;n<=last;n++){
    offsets[n]=pos; const obj=concatBytes([txt(`${n} 0 obj\n`),objects[n],txt('\nendobj\n')]); chunks.push(obj); pos+=obj.length;
  }
  const xrefAt=pos; let x=`xref\n0 ${last+1}\n0000000000 65535 f \n`;
  for(let n=1;n<=last;n++) x+=`${String(offsets[n]).padStart(10,'0')} 00000 n \n`;
  x+=`trailer\n<< /Size ${last+1} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF\n`;
  chunks.push(txt(x)); return new Blob([concatBytes(chunks)],{type:'application/pdf'});
}
async function renderPdfPages(r){
  const W=1240,H=1754,M=72,CONTENT=W-M*2; const pages=[]; let canvas,ctx,y;
  const navy=BRAND.navy950,blue=BRAND.blue600,muted='#667788',border='#D4DEE7',light='#F6F8FA';
  const logo=await imageFromSrc(new URL('assets/roskapstroy_pdf_logo.png',location.href).href);
  const newPage=(continuation=false)=>{
    canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);pages.push(canvas);
    if(continuation){ctx.drawImage(logo,M,34,360,139);ctx.fillStyle=navy;ctx.font='700 29px -apple-system, BlinkMacSystemFont, Segoe UI, Arial';ctx.textAlign='right';ctx.fillText(r.number,W-M,92);ctx.textAlign='left';ctx.strokeStyle=navy;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(M,190);ctx.lineTo(W-M,190);ctx.stroke();y=225;}else y=50;
  };
  const font=(weight,size)=>`${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  const wrap=(text,maxWidth,f)=>{ctx.font=f;const paras=String(text||'—').split(/\n/);const lines=[];for(const para of paras){const words=para.split(/\s+/);let line='';for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;}else line=test;}lines.push(line||' ');}return lines;};
  const ensure=(height)=>{if(y+height>H-90){newPage(true);return true;}return false;};
  const textBlock=(text,x,maxWidth,size=28,weight=400,color='#101820',lh=1.35)=>{const f=font(weight,size),lines=wrap(text,maxWidth,f);ctx.font=f;ctx.fillStyle=color;for(const line of lines){ctx.fillText(line,x,y);y+=size*lh;}return lines.length;};
  const section=(title,text)=>{const f=font(400,28),lines=wrap(text||'—',CONTENT-44,f);const h=56+lines.length*38+26;ensure(h);ctx.fillStyle='#fff';ctx.strokeStyle=border;ctx.lineWidth=2;ctx.strokeRect(M,y,CONTENT,h);ctx.fillStyle=navy;ctx.font=font(700,25);ctx.fillText(title,M+22,y+36);let yy=y+72;ctx.fillStyle='#101820';ctx.font=f;for(const line of lines){ctx.fillText(line,M+22,yy);yy+=38;}y+=h+20;};
  const kvRow=(pairs)=>{const rowH=92;ensure(rowH);const colW=CONTENT/pairs.length;pairs.forEach(([label,value],i)=>{const x=M+i*colW;ctx.fillStyle='#fff';ctx.strokeStyle=border;ctx.lineWidth=2;ctx.strokeRect(x,y,colW,rowH);ctx.fillStyle=muted;ctx.font=font(600,18);ctx.fillText(label,x+18,y+27);ctx.fillStyle='#101820';ctx.font=font(650,24);const ls=wrap(value||'—',colW-36,ctx.font).slice(0,2);ls.forEach((ln,j)=>ctx.fillText(ln,x+18,y+59+j*27));});y+=rowH;};
  const photoSection=async(title,arr)=>{if(!arr.length)return;ensure(60);ctx.fillStyle=navy;ctx.font=font(700,26);ctx.fillText(title,M,y+28);y+=48;const gap=18,boxW=(CONTENT-gap)/2,imgH=325,capH=42;for(let i=0;i<arr.length;i+=2){ensure(imgH+capH+24);for(let j=0;j<2;j++){const idx=i+j;if(idx>=arr.length)break;const x=M+j*(boxW+gap);ctx.strokeStyle=border;ctx.lineWidth=2;ctx.strokeRect(x,y,boxW,imgH+capH);try{const im=await imageFromSrc(arr[idx]);const sc=Math.max(boxW/im.width,imgH/im.height);const dw=im.width*sc,dh=im.height*sc;ctx.save();ctx.beginPath();ctx.rect(x,y,boxW,imgH);ctx.clip();ctx.drawImage(im,x+(boxW-dw)/2,y+(imgH-dh)/2,dw,dh);ctx.restore();}catch{ctx.fillStyle=light;ctx.fillRect(x,y,boxW,imgH);}ctx.fillStyle=muted;ctx.font=font(600,18);ctx.fillText(`${title} №${idx+1}`,x+14,y+imgH+27);}y+=imgH+capH+18;}};

  newPage(false);
  ctx.drawImage(logo,M,22,560,216);ctx.fillStyle=navy;ctx.textAlign='right';ctx.font=font(800,34);ctx.fillText('ЛИСТ ЗАМЕЧАНИЯ',W-M,105);ctx.font=font(700,27);ctx.fillStyle=blue;ctx.fillText(r.number,W-M,148);ctx.textAlign='left';ctx.strokeStyle=navy;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(M,250);ctx.lineTo(W-M,250);ctx.stroke();y=282;
  kvRow([['Дата выявления',fmtDate(r.date)],['Дата подписания',fmtDate(r.signDate)]]);
  kvRow([['№ по ГП',r.objectGp||'—'],['Наименование объекта',r.objectName||r.object||'—']]);
  kvRow([['Место',r.location||'—'],['Статус',r.status]]);
  kvRow([['Раздел работ',r.workSection||'—'],['Тип недостатка',r.defectType||'—']]);
  kvRow([['Ответственная организация',r.contractor||'—'],['Плановый срок',fmtDate(r.dueDate)]]);y+=20;
  section('Описание недостатка',r.description);
  const ntdText=r.ntd.length?r.ntd.map((x,i)=>`${i+1}. ${x.name} — п. ${x.clause}`).join('\n'):'Не указана';section('Нормативная документация',ntdText);
  section('Указания по устранению',r.remedy||'—');
  await photoSection('Фото недостатка',r.photosBefore);await photoSection('Фото после устранения',r.photosAfter);
  ensure(150);ctx.strokeStyle=border;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(M,y);ctx.lineTo(W-M,y);ctx.stroke();y+=35;ctx.fillStyle=muted;ctx.font=font(600,18);ctx.fillText('Документ выдан',M,y);y+=36;ctx.fillStyle='#101820';ctx.font=font(700,25);textBlock(r.issuer||DEFAULT_ISSUER,M,650,25,700);ctx.strokeStyle='#485767';ctx.beginPath();ctx.moveTo(W-380,y-32);ctx.lineTo(W-M,y-32);ctx.stroke();ctx.fillStyle=muted;ctx.font=font(500,17);ctx.fillText('Подпись',W-380,y-5);
  for(let i=0;i<pages.length;i++){const c=pages[i],cc=c.getContext('2d');cc.fillStyle='#8794A1';cc.font=font(500,15);cc.textAlign='right';cc.fillText(`РосКапСтрой • ${r.number} • стр. ${i+1}/${pages.length}`,W-M,H-35);cc.textAlign='left';}
  return pages;
}
async function makePdf(){
  const r=recordFromForm(); if(!validateRecord(r,{forPdf:true})) return;
  try{
    toast('Формирую PDF…'); const pages=await renderPdfPages(r); const jpgs=pages.map(c=>canvasJpegBytes(c,.78)); const blob=pdfFromJpegs(jpgs,pages[0].width,pages[0].height); const fileName=`Замечание_${filenameSafe(r.number)}.pdf`;
    const file=new File([blob],fileName,{type:'application/pdf'});
    if(navigator.canShare && navigator.canShare({files:[file]}) && navigator.share){
      await navigator.share({files:[file],title:`Замечание ${r.number}`});
    } else downloadBlob(fileName,blob);
    toast(`PDF сформирован • ${Math.max(1,Math.round(blob.size/1024))} КБ`);
  }catch(e){
    if(e && e.name==='AbortError') return; console.error(e); toast('Не удалось создать PDF. Открываю печатную версию.');
    const w=window.open('','_blank');if(w){w.document.open();w.document.write(pdfHtml(r));w.document.close();}
  }
}

async function duplicateCurrent(){
  refs.moreDialog.close();
  const src=recordFromForm(); if(!validateRecord(src)) return;
  const copy={...src,id:uid(),number:nextNumber(),status:'Черновик',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photosBefore:[...src.photosBefore],photosAfter:[...src.photosAfter],ntd:src.ntd.map(x=>({...x}))};
  await dbPut(copy); await refresh(); openForm(copy.id); toast('Создана копия замечания');
}
function downloadBlob(name,blob){ const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000); }
function downloadJson(name,obj){ downloadBlob(name,new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})); }
function shareCurrentJson(){ refs.moreDialog.close(); const r=recordFromForm(); downloadJson(`${filenameSafe(r.number||'remark')}.json`,r); }

async function exportBackup(){
  const payload={schema:1,exportedAt:new Date().toISOString(),defects:await dbAll(),settings:loadSettings(),custom:getCustom(),objects:getObjects()};
  downloadJson(`RosKapStroy_backup_${today()}.json`,payload); toast('Резервная копия создана');
}
async function importBackup(file){
  try{
    const data=JSON.parse(await file.text()); if(!Array.isArray(data.defects)) throw new Error('Некорректный файл');
    if(!confirm(`Импортировать ${data.defects.length} замечаний? Текущие данные будут заменены.`)) return;
    await dbClear(); for(const d of data.defects) await dbPut(d);
    if(data.settings) localStorage.setItem(SETTINGS_KEY,JSON.stringify(data.settings));
    if(data.custom) localStorage.setItem(CUSTOM_KEY,JSON.stringify(data.custom));
    if(Array.isArray(data.objects)) saveObjects(data.objects);
    applySettings(loadSettings()); await refresh(); toast('Резервная копия импортирована');
  }catch(e){console.error(e);toast('Не удалось импортировать резервную копию');}
}
async function importObjects(file){
  try{
    const text=await file.text(); let list=[];
    if(file.name.toLowerCase().endsWith('.json')){
      const v=JSON.parse(text); list=Array.isArray(v)?v:(Array.isArray(v.objects)?v.objects:[]);
      list=list.map(normalizeObjectEntry).filter(Boolean);
    }else{
      for(const rawLine of text.split(/\r?\n/)){
        const line=rawLine.trim(); if(!line) continue;
        if(/№\s*по\s*ГП|наименование\s*объекта|объект\s*\(выбор\)/i.test(line)) continue;
        let entry=null;
        if(line.includes(';')||line.includes('\t')){
          const parts=line.split(line.includes(';')?';':'\t').map(x=>x.trim()).filter(Boolean);
          if(parts.length>=3 && /[—–-]/.test(parts[0])) entry=normalizeObjectEntry({gp:parts[1],name:parts[2]});
          else if(parts.length>=2) entry=normalizeObjectEntry({gp:parts[0],name:parts[1]});
        }
        entry=entry||normalizeObjectEntry(line);
        if(entry) list.push(entry);
      }
    }
    if(!list.length) throw new Error('Пустой список');
    const merged=[...getObjects(),...list]; saveObjects(merged);
    toast(`Справочник обновлён • добавлено: ${list.length}`);
  }catch(e){console.error(e);toast('Не удалось прочитать справочник объектов');}
}

function toast(msg){
  refs.toast.textContent=msg; refs.toast.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>refs.toast.classList.remove('show'),2600);
}

function bind(){
  refs.brandButton.onclick=()=>showView('mainView');
  refs.newDefectButton.onclick=()=>openForm(); refs.formBack.onclick=()=>showView('mainView'); refs.newFromFormButton.onclick=startNewFromToolbar;
  refs.settingsButton.onclick=()=>{applySettings(loadSettings());refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;showView('settingsView');}; refs.settingsBack.onclick=()=>showView('mainView');
  refs.searchToggle.onclick=()=>{refs.searchRow.classList.toggle('hidden');if(!refs.searchRow.classList.contains('hidden'))setTimeout(()=>refs.searchInput.focus(),50);};
  refs.searchClose.onclick=()=>{refs.searchRow.classList.add('hidden');refs.searchInput.value='';renderDashboard();}; refs.searchInput.oninput=renderDashboard;
  document.querySelectorAll('.filter-chip').forEach(b=>b.onclick=()=>{currentFilter=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));renderDashboard();});
  refs.defectForm.onsubmit=saveForm; refs.deleteDefectButton.onclick=deleteCurrent; refs.pdfButton.onclick=makePdf;
  refs.objectSearchInput.oninput=renderObjectSearch; refs.objectSearchInput.onfocus=renderObjectSearch;
  refs.objectSearchInput.onkeydown=e=>{if(e.key==='Escape')refs.objectSearchResults.classList.add('hidden');};
  refs.workSectionPicker.onclick=()=>openPicker('workSection'); refs.defectTypePicker.onclick=()=>openPicker('defectType');
  refs.pickerSearch.oninput=renderPickerList; refs.customValueSave.onclick=addCustomPicker;
  refs.addNtdButton.onclick=openNtd; refs.ntdSearch.oninput=renderNtdPicker;
  const bindPhoto=(id,target)=>{refs[id].onchange=e=>{addPhotos(e.target.files,target);e.target.value='';};};
  bindPhoto('photoBeforeCameraInput','photosBefore');bindPhoto('photoBeforeGalleryInput','photosBefore');bindPhoto('photoAfterCameraInput','photosAfter');bindPhoto('photoAfterGalleryInput','photosAfter');
  refs.moreButton.onclick=()=>refs.moreDialog.showModal(); refs.duplicateButton.onclick=duplicateCurrent; refs.shareJsonButton.onclick=shareCurrentJson;
  refs.exportBackupButton.onclick=exportBackup; refs.importBackupInput.onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value='';};
  refs.importObjectsInput.onchange=e=>{if(e.target.files[0])importObjects(e.target.files[0]);e.target.value='';}; refs.installHelpButton.onclick=()=>refs.installDialog.showModal();

  refs.fontSizeRange.oninput=()=>{const s=loadSettings();s.fontSize=Number(refs.fontSizeRange.value);refs.fontSizeLabel.textContent=`${s.fontSize}%`;saveSettings(s);};
  refs.boldTextToggle.onchange=()=>{const s=loadSettings();s.bold=refs.boldTextToggle.checked;saveSettings(s);};
  refs.contrastToggle.onchange=()=>{const s=loadSettings();s.contrast=refs.contrastToggle.checked;saveSettings(s);};
  refs.largeButtonsToggle.onchange=()=>{const s=loadSettings();s.largeButtons=refs.largeButtonsToggle.checked;saveSettings(s);};
  document.querySelectorAll('.theme-option').forEach(b=>b.onclick=()=>{const s=loadSettings();s.theme=b.dataset.theme;saveSettings(s);});

  document.addEventListener('pointerdown',e=>{
    if(!refs.objectSearchResults.classList.contains('hidden') && !e.target.closest('.object-search-field') && !e.target.closest('#objectSearchResults')) refs.objectSearchResults.classList.add('hidden');
  });
}
async function init(){
  cacheRefs(); applySettings(loadSettings()); bind(); refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;
  try{db=await openDb();await refresh();}catch(e){console.error(e);toast('Ошибка локальной базы данных');}
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error);
  setTimeout(()=>{refs.splash.classList.add('hide');refs.app.classList.remove('hidden');setTimeout(()=>refs.splash.remove(),650);},1900);
}

document.addEventListener('DOMContentLoaded',init);
