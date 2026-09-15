'use strict';

const BRAND = {
  navy950: '#071F3D', navy800: '#0C365F', blue600: '#137EDB', blue400: '#3AA8FF', red600: '#E63224'
};

const DEFAULT_ISSUER = 'Ведущий инженер ОСК Щипин С.А.';
const DB_NAME = 'roskapstroy-control';
const DB_VERSION = 4;
const DRAFT_STORE = 'drafts';
const META_STORE = 'metadata';
const STORE = 'defects';
const PHOTO_STORE = 'photoRecords';
const REPORT_STORE = 'photoReports';
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

const WORK_TYPES = [
  'Монтаж электрооборудования',
  'Монтаж кабельных конструкций',
  'Прокладка кабельных линий',
  'Разделка и оконцевание кабелей',
  'Подключение кабелей и оборудования',
  'Маркировка кабельных линий и оборудования',
  'Монтаж заземления и уравнивания потенциалов',
  'Монтаж молниезащиты',
  'Монтаж электроосвещения',
  'Монтаж щитов и распределительных устройств',
  'Монтаж систем автоматизации и КИПиА',
  'Монтаж слаботочных систем',
  'Монтаж АПС',
  'Монтаж СОУЭ',
  'Монтаж СКУД',
  'Монтаж системы видеонаблюдения',
  'Огнезаделка кабельных проходок',
  'Пусконаладочные работы',
  'Индивидуальные испытания',
  'Комплексное опробование',
  'Оформление исполнительной документации',
  'Устранение замечаний',
  'Другое'
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

const PHOTO_KINDS = ['Общий вид','Узел / место','Крупный план','Маркировка','Результат измерения / испытания','После завершения','Другое'];


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
let photoRecords = [];
let photoReports = [];
let currentModule = 'defects';
let editingId = null;
let formDraftId = null;
let editingPhotoId = null;
let editingReportId = null;
let formState = freshFormState();
let photoFormState = freshPhotoFormState();
let reportFormState = freshReportFormState();
let currentPicker = null;
let pickerItems = [];

function freshFormState(){
  return { object:'', objectGp:'', objectName:'', workSection:'', defectType:'', photosBefore:[], photosAfter:[], ntd:[] };
}
function freshPhotoFormState(){
  return { object:'', objectGp:'', objectName:'', photos:[], scenarioSteps:[] };
}
function freshReportFormState(){
  return { object:'', objectGp:'', objectName:'', photos:[] };
}

function today(){ const d=new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); }
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
function normalizeNumber(v){
 const value=String(v||'').trim().replace(/\s+/g,' ');
 const match=value.match(/^(?:(РКС|ФК)[-–— ]*)?(\d+)$/i);
 if(!match)return value;
 return `${(match[1]||'РКС').toUpperCase()}-${match[2].replace(/^0+(?=\d)/,'').padStart(6,'0')}`;
}
function numberValue(v){ const m = String(v||'').match(/(\d+)(?!.*\d)/); return m ? Number(m[1]) : 0; }
function formatNumber(n){ return `РКС-${String(n).padStart(6,'0')}`; }
function nextNumber(){ return formatNumber(Math.max(0,...defects.map(d=>numberValue(d.number))) + 1); }
function formatPhotoNumber(n){ return `ФК-${String(n).padStart(6,'0')}`; }
function nextPhotoNumber(){ return formatPhotoNumber(Math.max(0,...photoRecords.map(d=>numberValue(d.number))) + 1); }
function formatReportNumber(n){ return `ФО-${String(n).padStart(6,'0')}`; }
function normalizeReportNumber(v){
  const value=String(v||'').trim().replace(/\s+/g,' ');
  const m=value.match(/^(?:ФО[-–— ]*)?(\d+)$/i);
  return m?formatReportNumber(Number(m[1])):value;
}
function nextReportNumber(){ return formatReportNumber(Math.max(0,...photoReports.map(d=>numberValue(d.number))) + 1); }

function cacheRefs(){
  [...document.querySelectorAll('[id]')].forEach(el => refs[el.id] = el);
}

function openDb(){
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE,{keyPath:'id'});
      if(!d.objectStoreNames.contains(PHOTO_STORE)) d.createObjectStore(PHOTO_STORE,{keyPath:'id'});
      if(!d.objectStoreNames.contains(REPORT_STORE)) d.createObjectStore(REPORT_STORE,{keyPath:'id'});
      if(!d.objectStoreNames.contains(DRAFT_STORE)) d.createObjectStore(DRAFT_STORE,{keyPath:'id'});
      if(!d.objectStoreNames.contains(META_STORE)) d.createObjectStore(META_STORE,{keyPath:'id'});
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
// Writes resolve only after the whole transaction has committed.
function writeTransaction(stores, action){
 return new Promise((resolve,reject)=>{
   const tx=db.transaction(stores,'readwrite');
   tx.oncomplete=()=>resolve();
   tx.onabort=()=>reject(tx.error||new Error('Операция отменена'));
   tx.onerror=()=>{};
   try{action(tx);}catch(error){tx.abort();reject(error);}
 });
}
function dbPut(record){return writeTransaction([STORE,DRAFT_STORE],tx=>{tx.objectStore(STORE).put(record);tx.objectStore(DRAFT_STORE).delete('defect');});}
function dbDelete(id){return writeTransaction([STORE,DRAFT_STORE],tx=>{tx.objectStore(STORE).delete(id);tx.objectStore(DRAFT_STORE).delete('defect');});}
function dbPhotoAll(){
 return new Promise((resolve,reject)=>{
  const req=db.transaction(PHOTO_STORE).objectStore(PHOTO_STORE).getAll();
  req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
 });
}
function dbPhotoPut(record){return writeTransaction([PHOTO_STORE,DRAFT_STORE],tx=>{tx.objectStore(PHOTO_STORE).put(record);tx.objectStore(DRAFT_STORE).delete('photo');});}
function dbPhotoDelete(id){return writeTransaction([PHOTO_STORE,DRAFT_STORE],tx=>{tx.objectStore(PHOTO_STORE).delete(id);tx.objectStore(DRAFT_STORE).delete('photo');});}
function dbReportAll(){
 return new Promise((resolve,reject)=>{
  const req=db.transaction(REPORT_STORE).objectStore(REPORT_STORE).getAll();
  req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
 });
}
function dbReportPut(record){return writeTransaction([REPORT_STORE],tx=>tx.objectStore(REPORT_STORE).put(record));}
function dbReportDelete(id){return writeTransaction([REPORT_STORE],tx=>tx.objectStore(REPORT_STORE).delete(id));}
function storageError(error){
 console.error(error);
 toast(error?.name==='QuotaExceededError'?'Память заполнена. Сделайте резервную копию и освободите место.':'Не удалось сохранить. Введённые данные остаются в карточке.');
}
let draftTimer, draftQueue=Promise.resolve(), activeForm=null, processingPhotos=0;
let defectAutosaveTimer=null, defectAutosaveQueue=Promise.resolve();
function setDefectSaveState(text,state=''){
 if(!refs.autosaveIndicator)return;
 refs.autosaveIndicator.textContent=text;
 refs.autosaveIndicator.dataset.state=state;
}
function syncDefectHeader(){
 if(refs.toolbarNumber)refs.toolbarNumber.textContent=normalizeNumber(refs.numberInput?.value||'')||'Новое замечание';
}
function defectDirty(r){
 return Boolean(r.objectName||r.location||r.workSection||r.workType||r.defectType||r.workingDoc||r.description||r.remedy||r.ntd?.length||r.photosBefore?.length||r.photosAfter?.length||r.dueDate||r.signDate||r.contractor||r.status!=='Черновик');
}
function scheduleDefectAutosave(delay=850){
 if(activeForm!=='defect')return;
 syncDefectHeader();
 setDefectSaveState('Изменения…','saving');
 clearTimeout(defectAutosaveTimer);
 defectAutosaveTimer=setTimeout(()=>autoPersistDefect().catch(storageError),delay);
}
async function autoPersistDefect({force=false}={}){
 clearTimeout(defectAutosaveTimer);
 if(!db||activeForm!=='defect')return false;
 if(processingPhotos){setDefectSaveState('Обработка фото…','saving');scheduleDefectAutosave(1000);return false;}
 const r=recordFromForm();
 if(!force&&!defectDirty(r)){setDefectSaveState('Черновик','');return false;}
 if(!r.number||!r.date){setDefectSaveState('Не сохранено','error');return false;}
 const duplicate=defects.some(d=>d.id!==r.id&&normalizeNumber(d.number).toLowerCase()===r.number.toLowerCase());
 if(duplicate){setDefectSaveState('Номер уже используется','error');return false;}
 defectAutosaveQueue=defectAutosaveQueue.catch(()=>{}).then(()=>writeTransaction([STORE,DRAFT_STORE],tx=>{tx.objectStore(STORE).put(r);tx.objectStore(DRAFT_STORE).delete('defect');}));
 await defectAutosaveQueue;
 editingId=r.id;formDraftId=r.id;
 const i=defects.findIndex(x=>x.id===r.id);if(i>=0)defects[i]=r;else defects.push(r);
 defects.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
 refs.numberInput.value=r.number;refs.formTitle.textContent=r.number;refs.deleteDefectButton.classList.remove('hidden');syncDefectHeader();
 setDefectSaveState('Сохранено ✓','saved');
 return true;
}
function queueDraft(){
 clearTimeout(draftTimer);
 draftTimer=setTimeout(()=>flushDraft().catch(storageError),500);
 if(activeForm==='defect')scheduleDefectAutosave();
}
function flushDraft(){
 clearTimeout(draftTimer);
 if(!db||!activeForm)return draftQueue;
 const type=activeForm, record=type==='defect'?recordFromForm():photoRecordFromForm();
 const list=type==='defect'?defects:photoRecords;
 const saved=list.find(r=>r.id===record.id);
 const comparable=r=>JSON.stringify({...r,createdAt:undefined,updatedAt:undefined});
 if(saved&&comparable(saved)===comparable(record))return draftQueue;
 const dirty=record.description||record.objectName||record.workType||record.location||record.remedy||record.ntd?.length||record.photosAfter?.length||(record.photosBefore?.length)||(record.photos?.length)||(record.scenarioSteps?.some?.(x=>x.event||x.command||x.expected||x.actual||x.status))||record.operationStage||record.acceptedScope||record.equipment||record.complexSystem;
 if(!dirty)return draftQueue;
 draftQueue=draftQueue.catch(()=>{}).then(()=>writeTransaction([DRAFT_STORE],tx=>tx.objectStore(DRAFT_STORE).put({id:type,record,updatedAt:new Date().toISOString()})));
 return draftQueue;
}
async function restoreDrafts(){
 const entries=await new Promise((resolve,reject)=>{
  const req=db.transaction(DRAFT_STORE).objectStore(DRAFT_STORE).getAll();
  req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
 });
 if(!entries.length)return;
 const host=document.createElement('div');host.className='draft-banner';
 for(const entry of entries){
  const button=document.createElement('button');button.type='button';
  button.textContent=entry.id==='defect'?'Продолжить черновик замечания':'Продолжить черновик фотофиксации';
  button.onclick=()=>{
   const list=entry.id==='defect'?defects:photoRecords;
   const r=entry.record;
   const existing=list.find(x=>x.id===r.id);
   if(existing&&existing.updatedAt>entry.updatedAt){toast('В журнале есть более новая сохранённая версия');return;}
   const index=existing?list.indexOf(existing):list.length;
   if(existing)list[index]=r;else list.push(r);
   if(entry.id==='defect')openForm(r.id);else openPhotoForm(r.id);
   if(existing)list[index]=existing;else list.splice(index,1);
   button.remove();if(!host.children.length)host.remove();
  };
  host.append(button);
 }
 refs.updateBanner.after(host);
}
function validImageSource(src){
 return typeof src==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-z\d+/=\s]+$/i.test(src);
}
function assertBackup(data){
 if(!data||![1,2,3,4,5,6,7].includes(data.schema||1)||!Array.isArray(data.defects)||!Array.isArray(data.photoRecords||[])||!Array.isArray(data.photoReports||[]))throw Error('Неподдерживаемый формат копии');
 for(const [records,photo] of [[data.defects,false],[data.photoRecords||[],true]]){
  const ids=new Set(),numbers=new Set();
  for(const r of records){
   if(!r||typeof r.id!=='string'||!r.id||typeof r.number!=='string'||!r.number.trim())throw Error('Некорректная запись');
   const n=normalizeNumber(r.number).toLowerCase();
   if(ids.has(r.id)||numbers.has(n))throw Error('В копии есть повторяющиеся номера или записи');
   ids.add(r.id);numbers.add(n);
   for(const value of Object.values(r))if(value!==null&&typeof value==='object'&&!Array.isArray(value))throw Error('Некорректное поле');
   for(const key of photo?['photos']:['photosBefore','photosAfter','ntd'])if(r[key]!=null&&!Array.isArray(r[key]))throw Error('Некорректный список');
   for(const [key,value] of Object.entries(r)){
    if(['photos','photosBefore','photosAfter','ntd','checklist','scenarioSteps'].includes(key))continue;
    if(value!=null&&typeof value!=='string')throw Error('Некорректное поле '+key);
   }
   const photos=photo?(r.photos||[]):[...(r.photosBefore||[]),...(r.photosAfter||[])];
   if(!Array.isArray(photos)||photos.some(p=>!validImageSource(photo?p?.src:p)))throw Error('Некорректная фотография в копии');
   if(!photo&&(!Array.isArray(r.ntd||[])||(r.ntd||[]).some(x=>!x||typeof x.name!=='string'||typeof x.clause!=='string')))throw Error('Некорректный список НТД');
   if(photo&&(!Array.isArray(r.scenarioSteps||[])||(r.scenarioSteps||[]).some(x=>!x||typeof x.id!=='string'||typeof x.event!=='string'||typeof x.command!=='string'||typeof x.expected!=='string'||typeof x.actual!=='string'||typeof x.status!=='string')))throw Error('Некорректный сценарий комплексного опробования');
  }
 }
 for(const r of data.photoReports||[]){
  if(!r||typeof r.id!=='string'||!r.id||typeof r.number!=='string'||!r.number.trim())throw Error('Некорректный фотоотчёт');
  if(!Array.isArray(r.photos)||r.photos.some(p=>!p||!validImageSource(p.src)||typeof (p.caption||'')!=='string'))throw Error('Некорректная фотография в фотоотчёте');
  if(![1,2,4].includes(Number(r.layout||1)))throw Error('Некорректный макет фотоотчёта');
 }
 for(const key of ['settings','custom'])if(data[key]&&(typeof data[key]!=='object'||Array.isArray(data[key])))throw Error('Некорректные настройки');
 if(data.custom&&Object.values(data.custom).some(v=>!Array.isArray(v)||v.some(x=>typeof x!=='string')))throw Error('Некорректный справочник');
 if(data.objects&&!Array.isArray(data.objects))throw Error('Некорректный справочник объектов');
 return data;
}

function loadSettings(){
  const defaults={fontSize:100,bold:false,contrast:false,largeButtons:false,theme:'dark'};
  try { return {...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}; } catch { return defaults; }
}
function saveSettings(settings){ localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings)); applySettings(settings); }
function migratePremiumTheme(){
  const key='rks.premium.v2';
  if(localStorage.getItem(key))return;
  const s=loadSettings();
  if(s.theme==='system')s.theme='dark';
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  localStorage.setItem(key,'1');
}
function applySettings(s){
  const root=document.documentElement;
  s.fontSize=Math.max(80,Math.min(140,Number(s.fontSize)||100));
  if(!['system','light','dark'].includes(s.theme))s.theme='system';
  root.style.setProperty('--font-scale',String(s.fontSize/100));
  root.classList.toggle('large-type',s.fontSize>115);
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
function getCustom(){ try{return JSON.parse(localStorage.getItem(CUSTOM_KEY)||'{"object":[],"workSection":[],"workType":[],"defectType":[]}')}catch{return {object:[],workSection:[],workType:[],defectType:[]}} }
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
function canonicalObjectText(value=''){
  return String(value||'').normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/[\u00A0\u202F]/g,' ').replace(/[–—−]/g,'-').replace(/\s*-\s*/g,'-').replace(/[«»“”"'.,;:()]/g,'').replace(/\s+/g,' ').trim();
}
function compactObjectText(value=''){return canonicalObjectText(value).replace(/[\s\-№]/g,'');}
function objectKey(o){return `${compactObjectText(o?.gp)}|${compactObjectText(o?.name)}`;}
function objectDisplay(o){
  const gp=String(o?.gp||'').replace(/[\u00A0\u202F]/g,' ').trim(), name=String(o?.name||'').replace(/[\u00A0\u202F]/g,' ').replace(/\s+/g,' ').trim();
  return gp && name ? `${gp} — ${name}` : (name||gp||'');
}
function dedupeObjects(source){
  const out=[],seen=new Set();
  for(const raw of source||[]){
    const o=normalizeObjectEntry(raw); if(!o) continue;
    o.gp=String(o.gp||'').replace(/[\u00A0\u202F]/g,' ').trim();
    o.name=String(o.name||'').replace(/[\u00A0\u202F]/g,' ').replace(/\s+/g,' ').trim();
    const k=objectKey(o); if(!k||seen.has(k)) continue; seen.add(k); out.push(o);
  }
  return out;
}
function getObjects(){
  try{
    const stored=JSON.parse(localStorage.getItem(OBJECTS_KEY)||'null');
    const source=Array.isArray(stored)&&stored.length?stored:DEFAULT_OBJECTS;
    const out=dedupeObjects(source);
    if(Array.isArray(stored)&&stored.length && out.length!==stored.length) localStorage.setItem(OBJECTS_KEY,JSON.stringify(out));
    return out;
  }catch{return dedupeObjects(DEFAULT_OBJECTS);}
}
function saveObjects(arr){
  const out=dedupeObjects(arr);
  localStorage.setItem(OBJECTS_KEY,JSON.stringify(out));
  if(refs.objectReferenceCount) refs.objectReferenceCount.textContent=`Справочник объектов • ${out.length}`;
}

async function refresh(){
  const [defectData,photoData,reportData] = await Promise.all([dbAll(),dbPhotoAll(),dbReportAll()]);
  defects = defectData.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  photoRecords = photoData.map(({checklist,...record})=>record).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  photoReports = reportData.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  renderDashboard();
}

function resultClass(result=''){
  if(result==='Принято') return ' closed';
  if(result==='Принято с замечаниями') return ' warning';
  if(result==='Не принято') return ' overdue';
  return '';
}

function renderDashboard(){
  if(currentModule==='photos') renderPhotoDashboard();
  else if(currentModule==='reports') renderPhotoReportDashboard();
  else renderDefectDashboard();
  updateModuleIndicator();
}

function renderDefectDashboard(){
  refs.journalEyebrow.textContent='Строительный контроль';
  refs.journalTitle.textContent='Замечания';
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Фиксация недостатков, контроль устранения и выпуск листов замечаний.';
  if(refs.moduleCreateHint) refs.moduleCreateHint.textContent='Нажмите, чтобы создать замечание';
  if(refs.listHeading) refs.listHeading.textContent='Последние замечания';
  if(refs.listHint) refs.listHint.textContent=defects.length ? 'Новые сверху' : 'Журнал пуст';
  refs.defectList.classList.remove('hidden');
  refs.photoRecordList.classList.add('hidden');
  refs.photoReportList.classList.add('hidden');
  const q=(refs.searchInput?.value||'').trim().toLowerCase();
  let items=defects.filter(d=>{
    if(!q) return true;
    return [d.number,d.object,d.objectGp,d.objectName,d.contractor,d.description,d.location,d.defectType,d.workSection,d.workType,d.workingDoc,d.status].some(v=>String(v||'').toLowerCase().includes(q));
  });

  refs.emptyState.classList.toggle('hidden',items.length>0);
  refs.emptyTitle.textContent='Замечаний пока нет';
  refs.emptyText.textContent='Нажмите на описание модуля выше, чтобы зафиксировать первый недостаток.';
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

function renderPhotoDashboard(){
  refs.journalEyebrow.textContent='Строительный контроль';
  refs.journalTitle.textContent='Фотофиксация';
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Фото выполненных работ, приемочного и операционного контроля, испытаний и опробования.';
  if(refs.moduleCreateHint) refs.moduleCreateHint.textContent='Нажмите, чтобы создать фотофиксацию';
  if(refs.listHeading) refs.listHeading.textContent='Последние фотофиксации';
  if(refs.listHint) refs.listHint.textContent=photoRecords.length ? 'Новые сверху' : 'Журнал пуст';
  refs.defectList.classList.add('hidden');
  refs.photoRecordList.classList.remove('hidden');
  refs.photoReportList.classList.add('hidden');
  const q=(refs.searchInput?.value||'').trim().toLowerCase();
  let items=photoRecords.filter(r=>{
    if(!q) return true;
    const scenarioText=(r.scenarioSteps||[]).flatMap(step=>[step.event,step.command,step.expected,step.actual]).join(' ');
    return [r.number,r.controlType,r.result,r.object,r.objectGp,r.objectName,r.location,r.contractor,r.workSection,r.workType,r.workingDoc,r.description,r.operationStage,r.controlCriterion,r.acceptedScope,r.executiveDocs,r.equipment,r.serial,r.protocol,r.instrument,r.testResult,r.complexSystem,r.complexProgram,r.complexProtocol,scenarioText].some(v=>String(v||'').toLowerCase().includes(q));
  });
  refs.emptyState.classList.toggle('hidden',items.length>0);
  refs.emptyTitle.textContent='Фотофиксаций пока нет';
  refs.emptyText.textContent='Нажмите на описание модуля выше, чтобы создать первую фотосерию.';
  refs.photoRecordList.innerHTML=items.map(r=>{
    const parsed=normalizeObjectEntry({gp:r.objectGp,name:r.objectName}) || normalizeObjectEntry(r.object) || {gp:'',name:'Объект не указан'};
    const first=((r.photos||[])[0]||{}).src||'';
    const meta=[r.controlType,r.workSection,`${(r.photos||[]).length} фото`].filter(Boolean).join(' • ');
    const summary=r.controlType==='Операционный контроль'?(r.operationStage||r.controlCriterion):r.controlType==='Приемочный контроль'?(r.acceptedScope||r.workType):r.controlType==='Индивидуальные испытания'?(r.equipment||r.workType):r.controlType==='Комплексное опробование'?(r.complexSystem||r.workType):(r.workType||r.description);
    return `<article class="defect-card photo-record-card${first?' has-photo':''}" data-id="${esc(r.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(r.number)}">
      ${first?`<img class="card-photo" src="${first}" alt="Фото выполненных работ">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(r.number)}</span><span class="status-pill${resultClass(r.result)}">${esc(r.result||'Без результата')}</span></div>
        <div class="card-object">${parsed.gp?`<span class="card-gp">${esc(parsed.gp)} ГП</span>`:''}<span class="card-object-name">${esc(parsed.name||'Объект не указан')}</span></div>
        <p class="card-description">${esc(summary||r.workType||r.description||'Вид работ не указан')}</p>
        <div class="card-bottom"><span class="card-meta">${esc(meta||fmtDate(r.date))}</span><span class="card-meta">›</span></div>
      </div>
    </article>`;
  }).join('');
  refs.photoRecordList.querySelectorAll('.photo-record-card').forEach(card=>{
    const open=()=>openPhotoForm(card.dataset.id);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}

function renderPhotoReportDashboard(){
  refs.journalEyebrow.textContent='Строительный контроль';
  refs.journalTitle.textContent='Фотоотчёт';
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Фотоматериалы с индивидуальными описаниями и готовым PDF в макете 1, 2 или 4 фото на лист.';
  if(refs.moduleCreateHint) refs.moduleCreateHint.textContent='Нажмите, чтобы создать фотоотчёт';
  if(refs.listHeading) refs.listHeading.textContent='Последние фотоотчёты';
  if(refs.listHint) refs.listHint.textContent=photoReports.length ? 'Новые сверху' : 'Журнал пуст';
  refs.defectList.classList.add('hidden');
  refs.photoRecordList.classList.add('hidden');
  refs.photoReportList.classList.remove('hidden');
  const q=(refs.searchInput?.value||'').trim().toLowerCase();
  const items=photoReports.filter(r=>{
    if(!q)return true;
    const photoText=(r.photos||[]).map(p=>p.caption||'').join(' ');
    return [r.number,r.title,r.object,r.objectGp,r.objectName,r.location,r.description,r.author,photoText].some(v=>String(v||'').toLowerCase().includes(q));
  });
  refs.emptyState.classList.toggle('hidden',items.length>0);
  refs.emptyTitle.textContent='Фотоотчётов пока нет';
  refs.emptyText.textContent='Нажмите на описание модуля выше, чтобы создать первый фотоотчёт.';
  refs.photoReportList.innerHTML=items.map(r=>{
    const parsed=normalizeObjectEntry({gp:r.objectGp,name:r.objectName}) || normalizeObjectEntry(r.object) || {gp:'',name:'Объект не указан'};
    const first=((r.photos||[])[0]||{}).src||'';
    const meta=[`${(r.photos||[]).length} фото`,`${r.layout||1} на лист`,fmtDate(r.date)].filter(Boolean).join(' • ');
    return `<article class="defect-card photo-report-card${first?' has-photo':''}" data-id="${esc(r.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(r.number)}">
      ${first?`<img class="card-photo" src="${first}" alt="Фотоотчёт">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(r.number)}</span><span class="status-pill closed">PDF</span></div>
        <div class="card-object">${parsed.gp?`<span class="card-gp">${esc(parsed.gp)} ГП</span>`:''}<span class="card-object-name">${esc(parsed.name||'Объект не указан')}</span></div>
        <p class="card-description">${esc(r.title||r.description||'Фотоотчёт')}</p>
        <div class="card-bottom"><span class="card-meta">${esc(meta)}</span><span class="card-meta">›</span></div>
      </div>
    </article>`;
  }).join('');
  refs.photoReportList.querySelectorAll('.photo-report-card').forEach(card=>{
    const open=()=>openReportForm(card.dataset.id);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}

function updateModuleIndicator(){
  const order=['defects','photos','reports'];
  const index=Math.max(0,order.indexOf(currentModule));
  refs.modulePageIndicator?.querySelectorAll('span').forEach((dot,i)=>dot.classList.toggle('active',i===index));
  refs.moduleCreateButton?.setAttribute('aria-label',`Создать: ${refs.journalTitle?.textContent||'запись'}`);
}

function setModule(module){
  currentModule=['defects','photos','reports'].includes(module)?module:'defects';
  renderDashboard();
}

function cycleModule(direction){
  const order=['defects','photos','reports'];
  const current=Math.max(0,order.indexOf(currentModule));
  const next=Math.max(0,Math.min(order.length-1,current+direction));
  if(next===current)return;
  const dashboard=refs.mainView?.querySelector('.home-dashboard');
  dashboard?.classList.add(direction>0?'swipe-next':'swipe-prev');
  setModule(order[next]);
  setTimeout(()=>dashboard?.classList.remove('swipe-next','swipe-prev'),260);
}

function createCurrentModuleRecord(){
  if(currentModule==='photos')openPhotoForm();
  else if(currentModule==='reports')openReportForm();
  else openForm();
}

function showView(view){
  if(activeForm)flushDraft().catch(storageError);
  activeForm=view==='formView'?'defect':view==='photoFormView'?'photo':null;
  ['mainView','formView','photoFormView','reportFormView','settingsView'].forEach(id=>refs[id]?.classList.toggle('active-view',id===view));
  refs.app?.classList.toggle('detail-mode',view!=='mainView');
  window.scrollTo({top:0,behavior:'instant'});
}

function resetFormDom(){
  refs.defectForm.reset();
  refs.issuerInput.value=DEFAULT_ISSUER;
  refs.statusInput.value='Черновик';
  refs.dateInput.value=today();
  refs.signDateInput.value='';
  refs.numberInput.value=nextNumber();
  formState=freshFormState();
  editingId=null; formDraftId=uid();
  refs.formTitle.textContent='Новое замечание';
  refs.deleteDefectButton.classList.add('hidden');
  setDefectSaveState('Черновик',''); syncDefectHeader();
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
  flushDraft().catch(storageError);activeForm=null;
  resetFormDom();
  if(id){
    const d=defects.find(x=>x.id===id); if(!d) return;
    editingId=id; formDraftId=id;
    refs.formTitle.textContent=d.number||'Замечание';
    refs.numberInput.value=d.number||''; refs.dateInput.value=d.date||today(); refs.statusInput.value=d.status||'Черновик';
    refs.locationInput.value=d.location||''; refs.workTypeInput.value=d.workType||''; refs.workingDocInput.value=d.workingDoc||''; refs.descriptionInput.value=d.description||''; refs.remedyInput.value=d.remedy||'';
    refs.dueDateInput.value=d.dueDate||''; refs.signDateInput.value=d.signDate||''; refs.contractorInput.value=d.contractor||''; refs.issuerInput.value=d.issuer||DEFAULT_ISSUER;
    const o=objectFromRecord(d);
    formState={
      object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',workSection:d.workSection||'',defectType:d.defectType||'',
      photosBefore:[...(d.photosBefore||[])],photosAfter:[...(d.photosAfter||[])],ntd:(d.ntd||[]).map(x=>({...x}))
    };
    refs.objectSearchInput.value=objectDisplay(o);
    refs.deleteDefectButton.classList.remove('hidden');
    updatePickerLabels(); renderPhotos(); renderNtd();
    setDefectSaveState('Сохранено ✓','saved'); syncDefectHeader();
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
  if(refs.workTypeValue) refs.workTypeValue.textContent=refs.workTypeInput.value||'Выбрать вид работ';
}

function recordFromForm(){
  const object=objectDisplay({gp:formState.objectGp,name:formState.objectName}) || formState.object;
  return {
    id: editingId || formDraftId || (formDraftId=uid()),
    number:normalizeNumber(refs.numberInput.value), date:refs.dateInput.value, status:refs.statusInput.value,
    object, objectGp:formState.objectGp||'', objectName:formState.objectName||'', location:refs.locationInput.value.trim(), workSection:formState.workSection, workType:refs.workTypeInput.value.trim(), defectType:formState.defectType, workingDoc:refs.workingDocInput.value.trim(),
    photosBefore:[...formState.photosBefore], photosAfter:[...formState.photosAfter],
    description:refs.descriptionInput.value.trim(), remedy:refs.remedyInput.value.trim(), ntd:formState.ntd.map(x=>({name:x.name,clause:String(x.clause||'').trim()})),
    dueDate:refs.dueDateInput.value, signDate:refs.signDateInput.value, contractor:refs.contractorInput.value.trim(), issuer:refs.issuerInput.value.trim()||DEFAULT_ISSUER,
    createdAt: editingId ? (defects.find(x=>x.id===editingId)?.createdAt||new Date().toISOString()) : new Date().toISOString(),
    updatedAt:new Date().toISOString()
  };
}
function validateRecord(r,{forPdf=false}={}){
  // PDF is also used for draft/field copies. Do not block export because an
  // engineering field is still empty; the PDF renderer prints "Не указано".
  if(forPdf){
    if(!r.number) r.number=nextNumber();
    return true;
  }
  if(!r.number || r.number.length>40){ toast('Укажите номер замечания (до 40 символов)'); refs.numberInput.focus(); return false; }
  if(defects.some(d=>d.id!==editingId && normalizeNumber(d.number).toLowerCase()===r.number.toLowerCase())){toast('Такой номер замечания уже используется');refs.numberInput.focus();return false;}
  if(!r.date){ toast('Укажите дату замечания'); return false; }
  if(!r.objectName && !r.object){ toast('Выберите объект через поиск'); refs.objectSearchInput.focus(); return false; }
  if(!r.defectType){ toast('Выберите тип недостатка'); return false; }
  if(!r.description){ toast('Заполните описание недостатка'); refs.descriptionInput.focus(); return false; }
  const missingClause=r.ntd.find(x=>!x.clause);
  if(missingClause){ toast(`Укажите пункт: ${missingClause.name}`); return false; }
  return true;
}

async function saveForm(e){
  e.preventDefault();
  try{const saved=await autoPersistDefect({force:true});if(saved)toast('Замечание сохранено');}
  catch(error){storageError(error);}
}

async function deleteCurrent(){
  refs.moreDialog?.close();
  if(!editingId) return;
  if(!confirm('Удалить это замечание? Действие нельзя отменить.')) return;
  await flushDraft();await dbDelete(editingId);activeForm=null; await refresh(); showView('mainView'); toast('Замечание удалено');
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
function rankObjectMatches(raw,limit=10){
  const q=canonicalObjectText(raw);
  if(!q) return [];
  const ranked=[];
  const seenDisplay=new Set();
  for(const o of dedupeObjects(getObjects())){
    const gp=canonicalObjectText(o.gp), name=canonicalObjectText(o.name), display=canonicalObjectText(objectDisplay(o));
    let score=0;
    if(gp===q || name===q || display===q) score=100;
    else if(gp.startsWith(q)) score=80;
    else if(name.startsWith(q)) score=60;
    else if(gp.includes(q)||name.includes(q)||display.includes(q)) score=40;
    if(!score) continue;
    const visibleKey=compactObjectText(objectDisplay(o));
    if(seenDisplay.has(visibleKey)) continue;
    seenDisplay.add(visibleKey);
    ranked.push({o,score});
  }
  return ranked.sort((a,b)=>b.score-a.score||String(a.o.gp).localeCompare(String(b.o.gp),'ru')).slice(0,limit);
}
function renderObjectSuggestions(input,results,onPick){
  const raw=input.value.trim();
  const q=canonicalObjectText(raw);
  if(!q){results.classList.add('hidden');results.innerHTML='';return;}
  const ranked=rankObjectMatches(raw,6);
  if(!ranked.length){results.classList.add('hidden');results.innerHTML='';return;}
  results.innerHTML=`<div class="object-results-title">Подсказки</div>`+ranked.map(({o})=>`<button type="button" class="object-result object-suggestion" data-gp="${encodeURIComponent(o.gp||'')}" data-name="${encodeURIComponent(o.name||'')}"><span class="object-result-gp">${esc(o.gp||'—')} ГП</span><span class="object-result-name">${esc(o.name)}</span></button>`).join('');
  results.classList.remove('hidden');
  results.querySelectorAll('.object-result').forEach(btn=>btn.onclick=()=>onPick({gp:decodeURIComponent(btn.dataset.gp),name:decodeURIComponent(btn.dataset.name)}));
}

function renderObjectSearch(){
  const raw=refs.objectSearchInput.value.trim();
  const q=canonicalObjectText(raw);
  const selected=canonicalObjectText(objectDisplay({gp:formState.objectGp,name:formState.objectName}));
  if(q!==selected) clearObjectSelection();
  if(!q){
    refs.objectSearchResults.classList.add('hidden');
    refs.objectSearchResults.innerHTML='';
    refs.objectSearchInput.focus();
    toast('Введите № ГП или часть названия объекта');
    return;
  }
  const ranked=rankObjectMatches(raw);
  const exact=ranked.filter(x=>x.score===100);
  if(exact.length===1){ setObjectSelection(exact[0].o); return; }
  refs.objectSearchResults.innerHTML=ranked.length
    ? `<div class="object-results-title">Найдено: ${ranked.length}. Выберите объект:</div>`+ranked.map(({o})=>`<button type="button" class="object-result" data-gp="${encodeURIComponent(o.gp||'')}" data-name="${encodeURIComponent(o.name||'')}"><span class="object-result-gp">${esc(o.gp||'—')} ГП</span><span class="object-result-name">${esc(o.name)}</span></button>`).join('')
    : '<div class="object-result-empty">Объект не найден. Измените поисковый запрос.</div>';
  refs.objectSearchResults.classList.remove('hidden');
  refs.objectSearchResults.querySelectorAll('.object-result').forEach(btn=>btn.onclick=()=>setObjectSelection({gp:decodeURIComponent(btn.dataset.gp),name:decodeURIComponent(btn.dataset.name)}));
}
async function startNewFromToolbar(){
  refs.moreDialog?.close();
  try{await autoPersistDefect({force:false});}catch(error){storageError(error);}
  openForm();
}


function resetPhotoFormDom(){
  refs.photoRecordForm.reset();
  editingPhotoId=null;
  photoFormState=freshPhotoFormState();
  refs.photoFormTitle.textContent='Новая фотофиксация';
  refs.photoNumberInput.value=nextPhotoNumber();
  refs.photoDateInput.value=today();
  refs.photoControlTypeInput.value='Операционный контроль';
  refs.photoResultInput.value='Принято';
  refs.photoObjectSearchInput.value='';
  refs.photoObjectSearchResults.classList.add('hidden');
  refs.photoObjectSearchResults.innerHTML='';
  refs.photoInspectorInput.value=DEFAULT_ISSUER;
  refs.deletePhotoRecordButton.classList.add('hidden');
  updatePhotoObjectSummary();
  updatePhotoSpecificFields();
  renderScenarioSteps();
  processingPhotos=0;renderWorkPhotos();queueDraft();
}
function updatePhotoObjectSummary(){
  refs.photoObjectGpValue.textContent=photoFormState.objectGp||'—';
  refs.photoObjectNameValue.textContent=photoFormState.objectName||'Объект не выбран';
}
function openPhotoForm(id=null){
  flushDraft().catch(storageError);activeForm=null;
  resetPhotoFormDom();
  if(id){
    const r=photoRecords.find(x=>x.id===id); if(!r) return;
    editingPhotoId=id;
    refs.photoFormTitle.textContent=r.number||'Фотофиксация';
    refs.photoNumberInput.value=r.number||'';
    refs.photoDateInput.value=r.date||today();
    refs.photoControlTypeInput.value=r.controlType||'Операционный контроль';
    refs.photoResultInput.value=r.result||'Принято';
    refs.photoLocationInput.value=r.location||'';
    refs.photoContractorInput.value=r.contractor||'';
    refs.photoWorkSectionInput.value=r.workSection||'';
    refs.photoWorkTypeInput.value=r.workType||'';
    refs.photoWorkingDocInput.value=r.workingDoc||'';
    refs.photoDescriptionInput.value=r.description||'';
    refs.photoOperationStageInput.value=r.operationStage||'';
    refs.photoControlCriterionInput.value=r.controlCriterion||'';
    refs.photoControlMethodInput.value=r.controlMethod||'';
    refs.photoPrecedingWorksInput.value=r.precedingWorks||'';
    refs.photoHiddenWorksInput.value=r.hiddenWorks||'Не применяется';
    refs.photoAcceptedScopeInput.value=r.acceptedScope||'';
    refs.photoExecutiveDocsInput.value=r.executiveDocs||'';
    refs.photoAcceptanceTestsInput.value=r.acceptanceTests||'';
    refs.photoNextStageInput.value=r.nextStage||'Готово';
    refs.photoPreviousRemarksInput.value=r.previousRemarks||'';
    refs.photoEquipmentInput.value=r.equipment||'';
    refs.photoSerialInput.value=r.serial||'';
    refs.photoProtocolInput.value=r.protocol||'';
    refs.photoInstrumentInput.value=r.instrument||'';
    refs.photoInstrumentSerialInput.value=r.instrumentSerial||'';
    refs.photoTestParamsInput.value=r.testParams||'';
    refs.photoTestResultInput.value=r.testResult||'';
    refs.photoComplexSystemInput.value=r.complexSystem||'';
    refs.photoComplexProgramInput.value=r.complexProgram||'';
    refs.photoComplexDurationInput.value=r.complexDuration||'';
    refs.photoComplexProtocolInput.value=r.complexProtocol||'';
    refs.photoContractorRepInput.value=r.contractorRep||'';
    refs.photoInspectorInput.value=r.inspector||DEFAULT_ISSUER;
    const o=objectFromRecord(r);
    photoFormState={object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',photos:(r.photos||[]).map((p,i)=>typeof p==='string'?{id:uid(),src:p,kind:PHOTO_KINDS[Math.min(i,2)],caption:'',originalName:'',originalSize:0,capturedAt:''}:{id:p.id||uid(),src:p.src||'',kind:p.kind||PHOTO_KINDS[Math.min(i,2)],caption:p.caption||'',originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''}),scenarioSteps:(r.scenarioSteps||[]).map(step=>({id:step.id||uid(),event:String(step.event||''),command:String(step.command||''),expected:String(step.expected||''),actual:String(step.actual||''),status:String(step.status||'')}))};
    refs.photoObjectSearchInput.value=objectDisplay(o);
    refs.deletePhotoRecordButton.classList.remove('hidden');
    updatePhotoObjectSummary();
    updatePhotoSpecificFields();
      renderScenarioSteps();
    renderWorkPhotos();
  }
  currentModule='photos';
  showView('photoFormView');
}
function photoRecordFromForm(){
  const object=objectDisplay({gp:photoFormState.objectGp,name:photoFormState.objectName}) || photoFormState.object;
  return {
    id:editingPhotoId||uid(),number:normalizeNumber(refs.photoNumberInput.value.replace(/^(\d+)$/, 'ФК-$1')),date:refs.photoDateInput.value,
    controlType:refs.photoControlTypeInput.value,result:refs.photoResultInput.value,
    object,objectGp:photoFormState.objectGp||'',objectName:photoFormState.objectName||'',location:refs.photoLocationInput.value.trim(),
    contractor:refs.photoContractorInput.value.trim(),workSection:refs.photoWorkSectionInput.value,workType:refs.photoWorkTypeInput.value.trim(),workingDoc:refs.photoWorkingDocInput.value.trim(),description:refs.photoDescriptionInput.value.trim(),
    operationStage:refs.photoOperationStageInput.value.trim(),controlCriterion:refs.photoControlCriterionInput.value.trim(),controlMethod:refs.photoControlMethodInput.value.trim(),precedingWorks:refs.photoPrecedingWorksInput.value.trim(),hiddenWorks:refs.photoHiddenWorksInput.value,
    acceptedScope:refs.photoAcceptedScopeInput.value.trim(),executiveDocs:refs.photoExecutiveDocsInput.value.trim(),acceptanceTests:refs.photoAcceptanceTestsInput.value.trim(),nextStage:refs.photoNextStageInput.value,previousRemarks:refs.photoPreviousRemarksInput.value.trim(),
    equipment:refs.photoEquipmentInput.value.trim(),serial:refs.photoSerialInput.value.trim(),protocol:refs.photoProtocolInput.value.trim(),instrument:refs.photoInstrumentInput.value.trim(),instrumentSerial:refs.photoInstrumentSerialInput.value.trim(),testParams:refs.photoTestParamsInput.value.trim(),testResult:refs.photoTestResultInput.value.trim(),
    complexSystem:refs.photoComplexSystemInput.value.trim(),complexProgram:refs.photoComplexProgramInput.value.trim(),complexDuration:refs.photoComplexDurationInput.value.trim(),complexProtocol:refs.photoComplexProtocolInput.value.trim(),
    scenarioSteps:(photoFormState.scenarioSteps||[]).map(step=>({id:step.id||uid(),event:String(step.event||'').trim(),command:String(step.command||'').trim(),expected:String(step.expected||'').trim(),actual:String(step.actual||'').trim(),status:String(step.status||'')})),
    photos:photoFormState.photos.map(p=>({id:p.id||uid(),src:p.src,kind:p.kind||'Другое',caption:String(p.caption||'').trim(),originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''})),
    contractorRep:refs.photoContractorRepInput.value.trim(),inspector:refs.photoInspectorInput.value.trim()||DEFAULT_ISSUER,
    createdAt:editingPhotoId?(photoRecords.find(x=>x.id===editingPhotoId)?.createdAt||new Date().toISOString()):new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}
function validatePhotoRecord(r,{forPdf=false}={}){
  if(!r.number){toast('Укажите номер фотофиксации');refs.photoNumberInput.focus();return false;}
  if(photoRecords.some(x=>x.id!==editingPhotoId && normalizeNumber(x.number).toLowerCase()===r.number.toLowerCase())){toast('Такой номер фотофиксации уже используется');refs.photoNumberInput.focus();return false;}
  if(!r.date){toast('Укажите дату контроля');return false;}
  if(!r.objectName && !r.object){toast('Выберите объект через поиск');refs.photoObjectSearchInput.focus();return false;}
  if(!r.workType && !r.description){toast('Укажите вид или описание выполненных работ');refs.photoWorkTypeInput.focus();return false;}
  if(forPdf && !r.photos.length){toast('Для фотоотчёта добавьте хотя бы одну фотографию');return false;}
  if(forPdf&&r.controlType==='Индивидуальные испытания'&&!r.equipment){toast('Укажите испытываемое оборудование или систему');refs.photoEquipmentInput.focus();return false;}
  if(forPdf&&r.controlType==='Комплексное опробование'&&!r.complexSystem){toast('Укажите комплекс или систему для опробования');refs.photoComplexSystemInput.focus();return false;}
  if(forPdf&&r.controlType==='Комплексное опробование'&&!(r.scenarioSteps||[]).some(step=>step.event||step.command||step.expected||step.actual)){toast('Добавьте хотя бы один этап сценария комплексного опробования');return false;}
  return true;
}
async function savePhotoRecord(e){
  e.preventDefault(); const r=photoRecordFromForm(); if(!validatePhotoRecord(r)) return;
  if(processingPhotos){toast('Дождитесь обработки фотографий');return;}
  try{await flushDraft();await dbPhotoPut(r);editingPhotoId=r.id;await refresh();refs.photoFormTitle.textContent=r.number;refs.photoNumberInput.value=r.number;refs.deletePhotoRecordButton.classList.remove('hidden');toast('Фотофиксация сохранена');}
  catch(error){storageError(error);}
}
async function deletePhotoRecord(){
  if(!editingPhotoId) return;
  if(!confirm('Удалить эту фотофиксацию? Действие нельзя отменить.')) return;
  await flushDraft();await dbPhotoDelete(editingPhotoId);activeForm=null; await refresh(); currentModule='photos'; showView('mainView'); renderDashboard(); toast('Фотофиксация удалена');
}
function setPhotoObjectSelection(raw){
  const o=normalizeObjectEntry(raw); if(!o) return;
  photoFormState.objectGp=o.gp||'';photoFormState.objectName=o.name||'';photoFormState.object=objectDisplay(o);
  refs.photoObjectSearchInput.value=photoFormState.object;
  refs.photoObjectSearchResults.classList.add('hidden');refs.photoObjectSearchResults.innerHTML='';updatePhotoObjectSummary();
}
function clearPhotoObjectSelection(){photoFormState.object='';photoFormState.objectGp='';photoFormState.objectName='';updatePhotoObjectSummary();}
function renderPhotoObjectSearch(){
  const raw=refs.photoObjectSearchInput.value.trim(),q=canonicalObjectText(raw),selected=canonicalObjectText(objectDisplay({gp:photoFormState.objectGp,name:photoFormState.objectName}));
  if(q!==selected) clearPhotoObjectSelection();
  if(!q){refs.photoObjectSearchResults.classList.add('hidden');refs.photoObjectSearchResults.innerHTML='';toast('Введите № ГП или часть названия объекта');refs.photoObjectSearchInput.focus();return;}
  const ranked=rankObjectMatches(raw);
  const exact=ranked.filter(x=>x.score===100); if(exact.length===1){setPhotoObjectSelection(exact[0].o);return;}
  refs.photoObjectSearchResults.innerHTML=ranked.length?`<div class="object-results-title">Найдено: ${ranked.length}. Выберите объект:</div>`+ranked.map(({o})=>`<button type="button" class="object-result" data-gp="${encodeURIComponent(o.gp||'')}" data-name="${encodeURIComponent(o.name||'')}"><span class="object-result-gp">${esc(o.gp||'—')} ГП</span><span class="object-result-name">${esc(o.name)}</span></button>`).join(''):'<div class="object-result-empty">Объект не найден. Измените поисковый запрос.</div>';
  refs.photoObjectSearchResults.classList.remove('hidden');
  refs.photoObjectSearchResults.querySelectorAll('.object-result').forEach(btn=>btn.onclick=()=>setPhotoObjectSelection({gp:decodeURIComponent(btn.dataset.gp),name:decodeURIComponent(btn.dataset.name)}));
}
function onPhotoControlTypeChange(){
  const type=refs.photoControlTypeInput.value;
  if(type==='Комплексное опробование'&&!(photoFormState.scenarioSteps||[]).length)photoFormState.scenarioSteps=[freshScenarioStep()];
  updatePhotoSpecificFields();renderScenarioSteps();queueDraft();
}

function updatePhotoSpecificFields(){
  const type=refs.photoControlTypeInput.value||'Операционный контроль';
  const map={
    'Операционный контроль':'photoOperationalFields',
    'Приемочный контроль':'photoAcceptanceFields',
    'Индивидуальные испытания':'photoIndividualFields',
    'Комплексное опробование':'photoComplexFields'
  };
  for(const id of ['photoOperationalFields','photoAcceptanceFields','photoIndividualFields','photoComplexFields'])refs[id]?.classList.toggle('hidden',id!==map[type]);
}

function freshScenarioStep(){return {id:uid(),event:'',command:'',expected:'',actual:'',status:''};}
function scenarioStatusLabel(status){return status==='ok'?'Выполнено':status==='issue'?'Не выполнено':status==='na'?'Не применяется':'Не проверено';}
function renderScenarioSteps(){
  if(!refs.scenarioSteps)return;
  const type=refs.photoControlTypeInput.value;
  if(type!=='Комплексное опробование'){refs.scenarioSteps.innerHTML='';return;}
  const steps=photoFormState.scenarioSteps||(photoFormState.scenarioSteps=[]);
  refs.scenarioSteps.innerHTML=steps.map((step,i)=>`<article class="scenario-step${step.status==='issue'?' issue':''}">
    <div class="scenario-step-head"><strong>Этап ${i+1}</strong><button type="button" class="scenario-remove" data-scenario-remove="${i}" aria-label="Удалить этап ${i+1}">×</button></div>
    <label class="field"><span>Событие / инициирующее условие</span><input data-scenario-field="event" data-scenario-index="${i}" value="${esc(step.event||'')}" placeholder="Например: Пожар, ручной пуск, команда оператора"></label>
    <label class="field"><span>Команда / воздействие</span><input data-scenario-field="command" data-scenario-index="${i}" value="${esc(step.command||'')}" placeholder="Какая команда должна быть выдана"></label>
    <label class="field"><span>Ожидаемый результат</span><textarea rows="2" data-scenario-field="expected" data-scenario-index="${i}" placeholder="Что должно произойти">${esc(step.expected||'')}</textarea></label>
    <label class="field"><span>Фактический результат</span><textarea rows="2" data-scenario-field="actual" data-scenario-index="${i}" placeholder="Что произошло фактически">${esc(step.actual||'')}</textarea></label>
    <label class="field scenario-status-field"><span>Результат этапа</span><select data-scenario-status="${i}"><option value=""${!step.status?' selected':''}>Не проверено</option><option value="ok"${step.status==='ok'?' selected':''}>Выполнено</option><option value="issue"${step.status==='issue'?' selected':''}>Не выполнено</option><option value="na"${step.status==='na'?' selected':''}>Не применяется</option></select></label>
  </article>`).join('')||'<p class="scenario-empty">Добавьте первый этап сценария.</p>';
  refs.scenarioSteps.querySelectorAll('[data-scenario-remove]').forEach(btn=>btn.onclick=()=>{photoFormState.scenarioSteps.splice(Number(btn.dataset.scenarioRemove),1);renderScenarioSteps();queueDraft();});
  refs.scenarioSteps.querySelectorAll('[data-scenario-field]').forEach(el=>el.oninput=()=>{const step=photoFormState.scenarioSteps[Number(el.dataset.scenarioIndex)];if(step)step[el.dataset.scenarioField]=el.value;queueDraft();});
  refs.scenarioSteps.querySelectorAll('[data-scenario-status]').forEach(el=>el.onchange=()=>{const step=photoFormState.scenarioSteps[Number(el.dataset.scenarioStatus)];if(step)step.status=el.value;renderScenarioSteps();queueDraft();});
}
function addScenarioStep(){photoFormState.scenarioSteps||(photoFormState.scenarioSteps=[]);photoFormState.scenarioSteps.push(freshScenarioStep());renderScenarioSteps();queueDraft();}
async function addWorkPhotos(files){
  const arr=[...files]; if(!arr.length) return; processingPhotos++; toast(`Обработка фото: ${arr.length}`);
  try{
    for(const file of arr){
      if(!file.type.startsWith('image/')&&!/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name))continue;
      try{const src=await compressFile(file); const i=photoFormState.photos.length; photoFormState.photos.push({id:uid(),src,kind:PHOTO_KINDS[Math.min(i,PHOTO_KINDS.length-1)]||'Другое',caption:'',originalName:file.name||'',originalSize:Number(file.size)||0,capturedAt:new Date(file.lastModified||Date.now()).toISOString()});}
      catch(e){console.error(e);toast(`Не удалось обработать ${file.name}`);}
    }
  } finally {
    processingPhotos=Math.max(0,processingPhotos-1);renderWorkPhotos();queueDraft();toast('Обработка фото завершена');
  }
}
function renderWorkPhotos(){
  refs.workPhotoGrid.innerHTML=photoFormState.photos.map((p,i)=>`<div class="work-photo-item">
    <div class="work-photo-preview"><img src="${esc(p.src)}" alt="Фото ${i+1}"><span class="work-photo-index">${i+1}</span><button type="button" data-work-photo-remove="${i}" aria-label="Удалить фото">×</button></div>
    <select data-work-photo-kind="${i}" aria-label="Тип фото ${i+1}">${PHOTO_KINDS.map(k=>`<option${k===p.kind?' selected':''}>${esc(k)}</option>`).join('')}</select>
    <input data-work-photo-caption="${i}" value="${esc(p.caption||'')}" placeholder="Подпись к фото (необязательно)" />
    <button type="button" class="work-photo-save" data-work-photo-save="${i}">Сохранить в Фото</button>
  </div>`).join('');
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-remove]').forEach(b=>b.onclick=()=>{photoFormState.photos.splice(Number(b.dataset.workPhotoRemove),1);renderWorkPhotos();});
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-save]').forEach(b=>b.onclick=()=>{
    const i=Number(b.dataset.workPhotoSave),p=photoFormState.photos[i];if(p?.src)saveImageToPhotos(p.src,`${refs.photoNumberInput.value||'Фотофиксация'}_${i+1}`);
  });
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-kind]').forEach(el=>el.onchange=()=>photoFormState.photos[Number(el.dataset.workPhotoKind)].kind=el.value);
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-caption]').forEach(el=>el.oninput=()=>photoFormState.photos[Number(el.dataset.workPhotoCaption)].caption=el.value);
}
function startNewPhotoFromToolbar(){
  const hasData=editingPhotoId||refs.photoDescriptionInput.value.trim()||photoFormState.photos.length||photoFormState.objectName;
  if(hasData&&!confirm('Открыть новую фотофиксацию? Несохранённые изменения будут потеряны.')) return;
  openPhotoForm();
}
async function duplicatePhotoCurrent(){
  refs.photoMoreDialog.close(); const src=photoRecordFromForm(); if(!validatePhotoRecord(src)) return;
  const copy={...src,id:uid(),number:nextPhotoNumber(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photos:src.photos.map(p=>({...p,id:uid()})),scenarioSteps:(src.scenarioSteps||[]).map(x=>({...x,id:uid()}))};
  await dbPhotoPut(copy);await refresh();openPhotoForm(copy.id);toast('Создана копия фотофиксации');
}
function sharePhotoCurrentJson(){refs.photoMoreDialog.close();const r=photoRecordFromForm();downloadJson(`${filenameSafe(r.number||'photo-record')}.json`,r);}


function resetReportFormDom(){
  refs.photoReportForm.reset();
  editingReportId=null;
  reportFormState=freshReportFormState();
  refs.reportFormTitle.textContent='Новый фотоотчёт';
  refs.reportNumberInput.value=nextReportNumber();
  refs.reportToolbarNumber.textContent=refs.reportNumberInput.value;
  refs.reportDateInput.value=today();
  refs.reportObjectSearchInput.value='';
  refs.reportObjectSearchResults.classList.add('hidden');
  refs.reportObjectSearchResults.innerHTML='';
  refs.reportAuthorInput.value=DEFAULT_ISSUER;
  refs.deletePhotoReportButton.classList.add('hidden');
  const first=refs.photoReportForm.querySelector('input[name="reportLayout"][value="1"]');if(first)first.checked=true;
  updateReportObjectSummary();
  renderReportPhotos();
}
function updateReportObjectSummary(){
  refs.reportObjectGpValue.textContent=reportFormState.objectGp||'—';
  refs.reportObjectNameValue.textContent=reportFormState.objectName||'Объект не выбран';
}
function setReportObjectSelection(raw){
  const o=normalizeObjectEntry(raw);if(!o)return;
  reportFormState.objectGp=o.gp||'';reportFormState.objectName=o.name||'';reportFormState.object=objectDisplay(o);
  refs.reportObjectSearchInput.value=reportFormState.object;
  refs.reportObjectSearchResults.classList.add('hidden');refs.reportObjectSearchResults.innerHTML='';updateReportObjectSummary();
}
function clearReportObjectSelection(){reportFormState.object='';reportFormState.objectGp='';reportFormState.objectName='';updateReportObjectSummary();}
function renderReportObjectSearch(){
  const raw=refs.reportObjectSearchInput.value.trim(),q=canonicalObjectText(raw),selected=canonicalObjectText(objectDisplay({gp:reportFormState.objectGp,name:reportFormState.objectName}));
  if(q!==selected)clearReportObjectSelection();
  if(!q){refs.reportObjectSearchResults.classList.add('hidden');refs.reportObjectSearchResults.innerHTML='';toast('Введите № ГП или часть названия объекта');refs.reportObjectSearchInput.focus();return;}
  const ranked=rankObjectMatches(raw);const exact=ranked.filter(x=>x.score===100);if(exact.length===1){setReportObjectSelection(exact[0].o);return;}
  refs.reportObjectSearchResults.innerHTML=ranked.length?`<div class="object-results-title">Найдено: ${ranked.length}. Выберите объект:</div>`+ranked.map(({o})=>`<button type="button" class="object-result" data-gp="${encodeURIComponent(o.gp||'')}" data-name="${encodeURIComponent(o.name||'')}"><span class="object-result-gp">${esc(o.gp||'—')} ГП</span><span class="object-result-name">${esc(o.name)}</span></button>`).join(''):'<div class="object-result-empty">Объект не найден. Измените поисковый запрос.</div>';
  refs.reportObjectSearchResults.classList.remove('hidden');
  refs.reportObjectSearchResults.querySelectorAll('.object-result').forEach(btn=>btn.onclick=()=>setReportObjectSelection({gp:decodeURIComponent(btn.dataset.gp),name:decodeURIComponent(btn.dataset.name)}));
}
function openReportForm(id=null){
  resetReportFormDom();
  if(id){
    const r=photoReports.find(x=>x.id===id);if(!r)return;
    editingReportId=id;
    refs.reportFormTitle.textContent=r.number||'Фотоотчёт';
    refs.reportNumberInput.value=r.number||'';refs.reportToolbarNumber.textContent=r.number||'';
    refs.reportDateInput.value=r.date||today();refs.reportTitleInput.value=r.title||'';refs.reportLocationInput.value=r.location||'';refs.reportDescriptionInput.value=r.description||'';refs.reportAuthorInput.value=r.author||DEFAULT_ISSUER;
    const o=objectFromRecord(r);reportFormState={object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',photos:(r.photos||[]).map(p=>({id:p.id||uid(),src:p.src||'',caption:p.caption||'',originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''}))};
    refs.reportObjectSearchInput.value=objectDisplay(o);
    const radio=refs.photoReportForm.querySelector(`input[name="reportLayout"][value="${[1,2,4].includes(Number(r.layout))?Number(r.layout):1}"]`);if(radio)radio.checked=true;
    refs.deletePhotoReportButton.classList.remove('hidden');updateReportObjectSummary();renderReportPhotos();
  }
  currentModule='reports';showView('reportFormView');
}
function photoReportFromForm(){
  const object=objectDisplay({gp:reportFormState.objectGp,name:reportFormState.objectName})||reportFormState.object;
  const layout=Number(refs.photoReportForm.querySelector('input[name="reportLayout"]:checked')?.value||1);
  return {
    id:editingReportId||uid(),number:normalizeReportNumber(refs.reportNumberInput.value),date:refs.reportDateInput.value,title:refs.reportTitleInput.value.trim(),
    object,objectGp:reportFormState.objectGp||'',objectName:reportFormState.objectName||'',location:refs.reportLocationInput.value.trim(),description:refs.reportDescriptionInput.value.trim(),layout:[1,2,4].includes(layout)?layout:1,
    photos:reportFormState.photos.map(p=>({id:p.id||uid(),src:p.src,caption:String(p.caption||'').trim(),originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''})),
    author:refs.reportAuthorInput.value.trim()||DEFAULT_ISSUER,
    createdAt:editingReportId?(photoReports.find(x=>x.id===editingReportId)?.createdAt||new Date().toISOString()):new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}
function validatePhotoReport(r,{forPdf=false}={}){
  if(!r.number){toast('Укажите номер фотоотчёта');refs.reportNumberInput.focus();return false;}
  if(photoReports.some(x=>x.id!==editingReportId&&normalizeReportNumber(x.number).toLowerCase()===r.number.toLowerCase())){toast('Такой номер фотоотчёта уже используется');refs.reportNumberInput.focus();return false;}
  if(!r.date){toast('Укажите дату фотоотчёта');return false;}
  if(!r.objectName&&!r.object){toast('Выберите объект через поиск');refs.reportObjectSearchInput.focus();return false;}
  if(forPdf&&!r.photos.length){toast('Добавьте хотя бы одну фотографию');return false;}
  return true;
}
async function savePhotoReport(e){
  e.preventDefault();const r=photoReportFromForm();if(!validatePhotoReport(r))return;
  if(processingPhotos){toast('Дождитесь обработки фотографий');return;}
  try{await dbReportPut(r);editingReportId=r.id;await refresh();refs.reportFormTitle.textContent=r.number;refs.reportToolbarNumber.textContent=r.number;refs.reportNumberInput.value=r.number;refs.deletePhotoReportButton.classList.remove('hidden');toast('Фотоотчёт сохранён');}
  catch(error){storageError(error);}
}
async function deletePhotoReport(){
  if(!editingReportId)return;
  if(!confirm('Удалить этот фотоотчёт? Действие нельзя отменить.'))return;
  await dbReportDelete(editingReportId);editingReportId=null;await refresh();setModule('reports');showView('mainView');toast('Фотоотчёт удалён');
}
async function addReportPhotos(files){
  const arr=[...files];if(!arr.length)return;processingPhotos++;toast(`Обработка фото: ${arr.length}`);
  try{
    for(const file of arr){
      if(!file.type.startsWith('image/')&&!/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name||''))continue;
      try{const src=await compressFile(file);reportFormState.photos.push({id:uid(),src,caption:'',originalName:file.name||'',originalSize:Number(file.size)||0,capturedAt:new Date(file.lastModified||Date.now()).toISOString()});}
      catch(error){console.error(error);toast(`Не удалось обработать ${file.name}`);}
    }
  }finally{processingPhotos=Math.max(0,processingPhotos-1);renderReportPhotos();toast('Обработка фото завершена');}
}
function renderReportPhotos(){
  if(!refs.reportPhotoGrid)return;
  refs.reportPhotoGrid.innerHTML=reportFormState.photos.map((p,i)=>`<article class="report-photo-item">
    <div class="report-photo-preview"><img src="${esc(p.src)}" alt="Фото ${i+1}"><span>${i+1}</span><button type="button" data-report-photo-remove="${i}" aria-label="Удалить фото">×</button></div>
    <label><span>Описание фотографии</span><textarea rows="3" data-report-photo-caption="${i}" placeholder="Что изображено на фотографии, место, выполненная работа, выявленный факт…">${esc(p.caption||'')}</textarea></label>
    <button type="button" class="work-photo-save" data-report-photo-save="${i}">Сохранить в Фото</button>
  </article>`).join('')||'<p class="report-photo-empty">Добавьте фотографии с камеры или из галереи.</p>';
  refs.reportPhotoGrid.querySelectorAll('[data-report-photo-remove]').forEach(btn=>btn.onclick=()=>{reportFormState.photos.splice(Number(btn.dataset.reportPhotoRemove),1);renderReportPhotos();});
  refs.reportPhotoGrid.querySelectorAll('[data-report-photo-caption]').forEach(el=>el.oninput=()=>{const p=reportFormState.photos[Number(el.dataset.reportPhotoCaption)];if(p)p.caption=el.value;});
  refs.reportPhotoGrid.querySelectorAll('[data-report-photo-save]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.reportPhotoSave),p=reportFormState.photos[i];if(p?.src)saveImageToPhotos(p.src,`${refs.reportNumberInput.value||'Фотоотчёт'}_${i+1}`);});
}

function openPicker(type){
  currentPicker=type;
  const custom=getCustom();
  if(type==='workSection'){
    refs.pickerTitle.textContent='Раздел работ';
    pickerItems=WORK_SECTIONS.map(x=>({value:`${x.code} — ${x.name}`,label:x.code,sub:x.name})).concat((custom.workSection||[]).map(v=>({value:v,label:v})));
  } else if(type==='workType'){
    refs.pickerTitle.textContent='Вид работ';
    pickerItems=[...new Set([...WORK_TYPES,...(custom.workType||[])])].map(v=>({value:v,label:v}));
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
  if(currentPicker==='workType') refs.workTypeInput.value=value;
  else formState[currentPicker]=value;
  queueDraft(); updatePickerLabels(); refs.pickerDialog.close();
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
    renderNtd();queueDraft(); refs.ntdDialog.close();
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
  const list=[...files]; if(!list.length) return;processingPhotos++;
  toast('Сжимаю фотографии…');
  for(const file of list){
    try{ formState[target].push(await compressFile(file)); }catch(e){ console.error(e); toast(`Не удалось обработать ${file.name}`); }
  }
  processingPhotos--;renderPhotos();queueDraft(); toast('Обработка фото завершена');
}
function renderPhotos(){
  renderPhotoGroup(refs.photoBeforeGrid,'photosBefore'); renderPhotoGroup(refs.photoAfterGrid,'photosAfter');
}
function renderPhotoGroup(container,key){
  container.innerHTML=formState[key].map((src,i)=>`<div class="photo-thumb"><img src="${esc(src)}" alt="Фото ${i+1}"><button type="button" class="photo-save-button" data-photo-save="${i}" aria-label="Сохранить фото ${i+1} в Фото">↓ Фото</button><button type="button" class="photo-remove-button" data-photo-remove="${i}" aria-label="Удалить фото">×</button></div>`).join('');
  container.querySelectorAll('[data-photo-save]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.photoSave),src=formState[key][i];if(src)saveImageToPhotos(src,`${refs.numberInput.value||'Замечание'}_${key==='photosAfter'?'после':'до'}_${i+1}`);});
  container.querySelectorAll('[data-photo-remove]').forEach(b=>b.onclick=()=>{formState[key].splice(Number(b.dataset.photoRemove),1);renderPhotos();});
}

let pdfBusy=false;
let activePdfUrl='';
let activePdfFile=null;
let activePdfArtifact=null;
let pdfDiagnostics={};

function makePortablePdfFile(blob,name){
  try{return new File([blob],name,{type:'application/pdf',lastModified:Date.now()});}
  catch(error){pdfDiagnostics.fileError=`${error?.name||'Error'}${error?.message?' — '+error.message:''}`;return null;}
}
function canSharePdfFile(file){
  if(!file||typeof navigator.share!=='function'||typeof navigator.canShare!=='function')return false;
  try{return navigator.canShare({files:[file]});}
  catch{return false;}
}
function isStandalonePwa(){
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone===true);
}
function isIOSLike(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
}
function releasePdfUrl(){
  if(activePdfUrl){try{URL.revokeObjectURL(activePdfUrl);}catch{} activePdfUrl='';}
}
function preparePdfArtifact(bytes,name){
  releasePdfUrl();
  const blob=new Blob([bytes],{type:'application/pdf'});
  activePdfUrl=URL.createObjectURL(blob);
  activePdfFile=makePortablePdfFile(blob,name);
  activePdfArtifact={blob,file:activePdfFile,url:activePdfUrl,name};
  pdfDiagnostics={
    generated:true,
    size:blob.size,
    fileCreated:Boolean(activePdfFile),
    shareApi:typeof navigator.share==='function',
    canShareApi:typeof navigator.canShare==='function',
    canShareFile:canSharePdfFile(activePdfFile),
    standalone:isStandalonePwa(),
    ios:isIOSLike(),
    serviceWorker:Boolean(navigator.serviceWorker?.controller),
    userActivationAtBuild:Boolean(navigator.userActivation?.isActive),
    lastAction:'PDF сформирован',
    lastError:''
  };
  renderPdfDiagnostics();
  return activePdfArtifact;
}
function diagnosticsText(){
  const d=pdfDiagnostics||{};
  const yes=v=>v?'YES':'NO';
  const kb=d.size?`${Math.max(1,Math.round(d.size/1024))} KB`:'—';
  return [
    'РосКапСтрой V1.8 · PDF diagnostics',
    `PDF generated: ${yes(d.generated)}`,
    `Size: ${kb}`,
    `File created: ${yes(d.fileCreated)}`,
    `navigator.share: ${yes(d.shareApi)}`,
    `navigator.canShare: ${yes(d.canShareApi)}`,
    `canShare({files}): ${yes(d.canShareFile)}`,
    `User activation: ${yes(d.userActivation)}`,
    `Standalone PWA: ${yes(d.standalone)}`,
    `iOS/iPadOS: ${yes(d.ios)}`,
    `Service Worker active: ${yes(d.serviceWorker)}`,
    `Last action: ${d.lastAction||'—'}`,
    `Last error: ${d.lastError||'—'}`
  ].join('\n');
}
function renderPdfDiagnostics(){
  if(refs.pdfDiagnosticsText)refs.pdfDiagnosticsText.textContent=diagnosticsText();
}
function updatePdfDiagnostics(patch={}){
  Object.assign(pdfDiagnostics,patch);
  renderPdfDiagnostics();
}
async function copyPdfDiagnostics(){
  const value=diagnosticsText();
  try{
    await navigator.clipboard.writeText(value);
    toast('Диагностика скопирована');
  }catch{
    const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast('Диагностика скопирована');}catch{toast('Не удалось скопировать диагностику');}
    ta.remove();
  }
}

async function exportPdfRecord(kind='defect'){
 if(pdfBusy||processingPhotos){toast('Дождитесь завершения текущей обработки');return;}
 const isPhoto=kind==='photo',isReport=kind==='report';
 const r=isReport?photoReportFromForm():(isPhoto?photoRecordFromForm():recordFromForm());
 const valid=isReport?validatePhotoReport(r,{forPdf:true}):(isPhoto?validatePhotoRecord(r,{forPdf:true}):validateRecord(r,{forPdf:true}));
 if(!valid)return;
 pdfBusy=true;const button=isReport?refs.reportPdfButton:(isPhoto?refs.photoPdfButton:refs.pdfButton);button.disabled=true;
 try{
  if(!isReport){try{await flushDraft();}catch(error){console.warn('Draft flush before PDF failed',error);}}
  toast('Формирую PDF…');
  if(!globalThis.PDFLib||!globalThis.fontkit||!globalThis.RksPdf)throw new Error('Модуль PDF не загружен. Закройте и снова откройте приложение.');
  const bytes=isReport?await RksPdf.buildPhotoReport(r):await RksPdf.build(r,isPhoto);
  const prefix=isReport?'Фотоотчёт':(isPhoto?'Фотофиксация':'Замечание');
  const name=`${prefix}_${filenameSafe(r.number||'РКС')}.pdf`;
  const artifact=preparePdfArtifact(bytes,name);
  if(!artifact.file)throw new Error('Не удалось подготовить PDF как системный файл.');
  const dialog=refs.pdfReadyDialog;
  refs.pdfReadyInfo.textContent=`${r.number||'PDF'} · ${Math.max(1,Math.round(artifact.blob.size/1024))} КБ`;
  refs.pdfShare.hidden=false;refs.pdfShare.textContent='Сохранить PDF';
  refs.pdfDownload.hidden=false;refs.pdfDownload.textContent='Скачать как файл';
  refs.pdfOpen.hidden=false;refs.pdfOpen.textContent='Открыть документ';
  refs.pdfShare.onclick=()=>savePdfPrimary(artifact);
  refs.pdfDownload.onclick=()=>downloadPdfFallback(artifact);
  refs.pdfOpen.onclick=()=>previewPdfFile(artifact);
  if(refs.pdfDiagnosticsCopy)refs.pdfDiagnosticsCopy.onclick=copyPdfDiagnostics;
  if(dialog.open)dialog.close();dialog.showModal();
 }catch(e){
  console.error('PDF export failed',e);
  updatePdfDiagnostics({generated:false,lastAction:'Ошибка формирования PDF',lastError:`${e?.name||'Error'}${e?.message?' — '+e.message:''}`});
  const message=e?.message||String(e||'Неизвестная ошибка');toast(`Не удалось создать PDF: ${message}`);
 }finally{pdfBusy=false;button.disabled=false;}
}
function makePdf(){return exportPdfRecord('defect');}
function makePhotoPdf(){return exportPdfRecord('photo');}
function makeReportPdf(){return exportPdfRecord('report');}

function openNormalPdfUrl(url){
  const w=window.open(url,'_blank','noopener');
  if(!w){
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),250);
  }
}
function safePdfDownloadName(artifact){
  const raw=String(artifact?.name||'RKS.pdf');
  const m=raw.match(/(РКС[-_ ]?\d+|RKS[-_ ]?\d+|ФК[-_ ]?\d+|FK[-_ ]?\d+|ФО[-_ ]?\d+|FO[-_ ]?\d+)/i);
  if(m){
    const num=m[1].replace(/РКС/ig,'RKS').replace(/ФК/ig,'FK').replace(/ФО/ig,'FO').replace(/\s+/g,'-').replace(/_/g,'-');
    return `${num}.pdf`;
  }
  return 'RKS-document.pdf';
}
function savePdfPrimary(artifact){
  const file=artifact?.file;
  const activation=Boolean(navigator.userActivation?.isActive);
  updatePdfDiagnostics({
    userActivation:activation,
    canShareFile:canSharePdfFile(file),
    lastAction:'Нажата «Сохранить PDF»',
    lastError:''
  });
  if(!file){
    updatePdfDiagnostics({lastError:'PDF File отсутствует'});
    toast('PDF-файл не подготовлен. Сформируйте его заново.');return;
  }
  if(!canSharePdfFile(file)){
    updatePdfDiagnostics({lastError:'Web Share Files API недоступен для этого PDF'});
    toast('Системное сохранение файлов недоступно. Используйте «Скачать как файл».');return;
  }
  try{
    // IMPORTANT: this call is made directly from the user click. No await or
    // Service Worker is placed before navigator.share(), preserving transient
    // user activation required by iOS/WebKit.
    const p=navigator.share({files:[file]});
    updatePdfDiagnostics({lastAction:'Системное меню iOS открыто'});
    if(p&&typeof p.then==='function')p.then(()=>{
      updatePdfDiagnostics({lastAction:'Системное меню закрыто',lastError:''});
      toast('Системное меню закрыто. Если выбрали «Сохранить в Файлы», PDF сохранён.');
    }).catch(error=>{
      if(error?.name==='AbortError'){
        updatePdfDiagnostics({lastAction:'Сохранение отменено пользователем',lastError:'AbortError'});
        toast('Сохранение отменено');return;
      }
      const msg=`${error?.name||'Error'}${error?.message?' — '+error.message:''}`;
      console.error('PDF Web Share failed',error);
      updatePdfDiagnostics({lastAction:'Ошибка системного сохранения',lastError:msg});
      toast(`Не удалось открыть сохранение: ${msg}`);
    });
  }catch(error){
    const msg=`${error?.name||'Error'}${error?.message?' — '+error.message:''}`;
    console.error('PDF Web Share failed',error);
    updatePdfDiagnostics({lastAction:'Ошибка системного сохранения',lastError:msg});
    toast(`Не удалось открыть сохранение: ${msg}`);
  }
}
function downloadPdfFallback(artifact){
  const blob=artifact?.blob;
  if(!blob){toast('PDF-файл не подготовлен. Сформируйте его заново.');return;}
  try{
    const downloadBlob=new Blob([blob],{type:'application/octet-stream'});
    const url=URL.createObjectURL(downloadBlob);
    const a=document.createElement('a');
    a.href=url;a.download=safePdfDownloadName(artifact);a.target='_self';a.rel='noopener';a.style.display='none';
    document.body.appendChild(a);a.click();
    setTimeout(()=>{try{URL.revokeObjectURL(url);}catch{}a.remove();},60000);
    updatePdfDiagnostics({lastAction:'Браузеру отправлен запрос на скачивание',lastError:''});
    toast('Запрос на скачивание отправлен браузеру. Проверьте «Загрузки».');
  }catch(error){
    const msg=`${error?.name||'Error'}${error?.message?' — '+error.message:''}`;
    console.error('PDF fallback download failed',error);
    updatePdfDiagnostics({lastAction:'Ошибка резервного скачивания',lastError:msg});
    toast(`Не удалось скачать PDF: ${msg}`);
  }
}
function previewPdfFile(artifact){
  const target=artifact?.url;
  if(!target){toast('PDF нужно сформировать заново');return;}
  updatePdfDiagnostics({lastAction:'Открыт предварительный просмотр',lastError:''});
  openNormalPdfUrl(target);
}
// Compatibility aliases for older callers.
function savePdfFile(artifact){return savePdfPrimary(artifact);}
function sharePdfFile(artifact){return savePdfPrimary(artifact);}
function openPdfFile(artifact){return previewPdfFile(artifact);}

async function duplicateCurrent(){
  refs.moreDialog.close();
  const src=recordFromForm(); if(!validateRecord(src)) return;
  const copy={...src,id:uid(),number:nextNumber(),status:'Черновик',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photosBefore:[...src.photosBefore],photosAfter:[...src.photosAfter],ntd:src.ntd.map(x=>({...x}))};
  await dbPut(copy); await refresh(); openForm(copy.id); toast('Создана копия замечания');
}
async function saveImageToPhotos(src,baseName='RosKapStroy_photo'){
  try{
    const response=await fetch(src);if(!response.ok)throw new Error('Не удалось прочитать фото');
    const blob=await response.blob();
    const ext=blob.type.includes('png')?'png':blob.type.includes('webp')?'webp':'jpg';
    const file=new File([blob],`${filenameSafe(baseName)}.${ext}`,{type:blob.type||'image/jpeg'});
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      toast('В меню iPhone выберите «Сохранить изображение»');
      try{await navigator.share({files:[file],title:'Фото РосКапСтрой'});}catch(error){if(error?.name!=='AbortError')throw error;}
      return;
    }
    downloadBlob(file.name,file);
    toast('Фото сохранено как файл. На iPhone откройте его и выберите «Сохранить изображение».');
  }catch(error){console.error(error);toast('Не удалось подготовить фото для сохранения');}
}
function downloadBlob(name,blob){ const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000); }
function downloadJson(name,obj){ downloadBlob(name,new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})); }
function shareCurrentJson(){ refs.moreDialog.close(); const r=recordFromForm(); downloadJson(`${filenameSafe(r.number||'remark')}.json`,r); }

async function exportBackup(){
  await flushDraft();
  const payload={schema:7,exportedAt:new Date().toISOString(),defects:await dbAll(),photoRecords:(await dbPhotoAll()).map(({checklist,...record})=>record),photoReports:await dbReportAll(),settings:loadSettings(),custom:getCustom(),objects:getObjects()};
  downloadJson(`RosKapStroy_backup_${today()}.json`,payload); toast('Резервная копия создана');
}
async function importBackup(file){
 try{
  const data=assertBackup(JSON.parse(await file.text()));
  if(!confirm(`Восстановить ${data.defects.length} замечаний, ${(data.photoRecords||[]).length} фотофиксаций и ${(data.photoReports||[]).length} фотоотчётов? Текущая база будет заменена после проверки файла.`))return;
  await flushDraft();
  await writeTransaction([STORE,PHOTO_STORE,REPORT_STORE,DRAFT_STORE,META_STORE],tx=>{
   tx.objectStore(STORE).clear();tx.objectStore(PHOTO_STORE).clear();tx.objectStore(REPORT_STORE).clear();tx.objectStore(DRAFT_STORE).clear();
   for(const r of data.defects)tx.objectStore(STORE).put({...r,number:normalizeNumber(r.number)});
   for(const r of data.photoRecords||[]){const {checklist,...record}=r;tx.objectStore(PHOTO_STORE).put({...record,number:normalizeNumber(record.number)});}
   for(const r of data.photoReports||[])tx.objectStore(REPORT_STORE).put({...r,number:normalizeReportNumber(r.number),layout:[1,2,4].includes(Number(r.layout))?Number(r.layout):1});
   tx.objectStore(META_STORE).put({id:'preferences',settings:data.settings||loadSettings(),custom:data.custom||getCustom(),objects:data.objects||getObjects()});
  });
  activeForm=null;await restorePreferences();applySettings(loadSettings());await refresh();showView('mainView');
  toast('Резервная копия восстановлена');
 }catch(e){console.error(e);toast(`Импорт не выполнен: ${e.message||'ошибка файла или памяти'}`);}
}
async function restorePreferences(){
 const record=await new Promise((resolve,reject)=>{const req=db.transaction(META_STORE).objectStore(META_STORE).get('preferences');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
 if(!record)return;
 localStorage.setItem(SETTINGS_KEY,JSON.stringify(record.settings));
 localStorage.setItem(CUSTOM_KEY,JSON.stringify(record.custom));
 saveObjects(record.objects);
 await writeTransaction([META_STORE],tx=>tx.objectStore(META_STORE).delete('preferences'));
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

function updateConnection(){
 const el=refs.connectionState;if(!el)return;
 el.textContent=navigator.onLine?'Локальный журнал':'Офлайн · данные на устройстве';
 el.classList.toggle('offline',!navigator.onLine);
}
function toast(msg){
  refs.toast.textContent=msg; refs.toast.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>refs.toast.classList.remove('show'),2600);
}

function bind(){
 for(const form of [refs.defectForm,refs.photoRecordForm]){
  form.addEventListener('input',queueDraft);
  form.addEventListener('change',queueDraft);
  form.addEventListener('click',()=>setTimeout(queueDraft,0));
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flushDraft().catch(storageError);});
 window.addEventListener('online',updateConnection);
 window.addEventListener('offline',updateConnection);
 updateConnection();
 refs.resumeSettingsBack=refs.settingsBack;

  refs.brandButton.onclick=()=>{showView('mainView');renderDashboard();};
  refs.moduleCreateButton.onclick=createCurrentModuleRecord;
  refs.moduleCreateButton.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();createCurrentModuleRecord();}};
  let swipeStartX=0,swipeStartY=0;
  refs.mainView.addEventListener('touchstart',e=>{const t=e.changedTouches[0];swipeStartX=t.clientX;swipeStartY=t.clientY;},{passive:true});
  refs.mainView.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-swipeStartX,dy=t.clientY-swipeStartY;if(Math.abs(dx)>=70&&Math.abs(dx)>Math.abs(dy)*1.25)cycleModule(dx<0?1:-1);},{passive:true});

  refs.formBack.onclick=async()=>{try{await autoPersistDefect({force:false});await refresh();}catch(error){storageError(error);}setModule('defects');showView('mainView');};
  refs.newFromFormButton.onclick=startNewFromToolbar;
  refs.photoFormBack.onclick=()=>{setModule('photos');showView('mainView');};
  refs.newPhotoFromFormButton.onclick=startNewPhotoFromToolbar;
  refs.reportFormBack.onclick=()=>{setModule('reports');showView('mainView');};

  refs.settingsButton.onclick=()=>{applySettings(loadSettings());refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;showView('settingsView');};
  refs.settingsBack.onclick=()=>{showView('mainView');renderDashboard();};
  refs.searchToggle.onclick=()=>{refs.searchRow.classList.toggle('hidden');if(!refs.searchRow.classList.contains('hidden'))setTimeout(()=>refs.searchInput.focus(),50);};
  refs.searchClose.onclick=()=>{refs.searchRow.classList.add('hidden');refs.searchInput.value='';renderDashboard();}; refs.searchInput.oninput=renderDashboard;

  refs.defectForm.onsubmit=saveForm; refs.deleteDefectButton.onclick=deleteCurrent; refs.pdfButton.onclick=makePdf;
  refs.numberInput.addEventListener('input',syncDefectHeader);
  refs.objectSearchInput.oninput=()=>{
    const typed=canonicalObjectText(refs.objectSearchInput.value);
    const selected=canonicalObjectText(objectDisplay({gp:formState.objectGp,name:formState.objectName}));
    if(typed===selected){refs.objectSearchResults.classList.add('hidden');refs.objectSearchResults.innerHTML='';return;}
    clearObjectSelection();
    renderObjectSuggestions(refs.objectSearchInput,refs.objectSearchResults,setObjectSelection);
  };
  refs.objectSearchButton.onclick=renderObjectSearch;
  refs.objectSearchInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();renderObjectSearch();}if(e.key==='Escape'){refs.objectSearchResults.classList.add('hidden');refs.objectSearchResults.innerHTML='';}};
  refs.workSectionPicker.onclick=()=>openPicker('workSection'); refs.defectTypePicker.onclick=()=>openPicker('defectType'); refs.workTypePicker.onclick=()=>openPicker('workType');
  refs.pickerSearch.oninput=renderPickerList; refs.customValueSave.onclick=addCustomPicker;
  refs.addNtdButton.onclick=openNtd; refs.ntdSearch.oninput=renderNtdPicker;
  const bindDefectPhoto=(id,target)=>{refs[id].onchange=e=>{addPhotos(e.target.files,target);e.target.value='';};};
  bindDefectPhoto('photoBeforeCameraInput','photosBefore');bindDefectPhoto('photoBeforeGalleryInput','photosBefore');bindDefectPhoto('photoAfterCameraInput','photosAfter');bindDefectPhoto('photoAfterGalleryInput','photosAfter');
  refs.moreButton.onclick=()=>refs.moreDialog.showModal(); refs.duplicateButton.onclick=duplicateCurrent; refs.shareJsonButton.onclick=shareCurrentJson;

  refs.photoRecordForm.onsubmit=savePhotoRecord; refs.deletePhotoRecordButton.onclick=deletePhotoRecord; refs.photoPdfButton.onclick=makePhotoPdf;
  refs.photoControlTypeInput.onchange=onPhotoControlTypeChange;
  refs.addScenarioStepButton.onclick=addScenarioStep;
  refs.photoObjectSearchInput.oninput=()=>{
    const typed=canonicalObjectText(refs.photoObjectSearchInput.value);
    const selected=canonicalObjectText(objectDisplay({gp:photoFormState.objectGp,name:photoFormState.objectName}));
    if(typed===selected){refs.photoObjectSearchResults.classList.add('hidden');refs.photoObjectSearchResults.innerHTML='';return;}
    clearPhotoObjectSelection();
    renderObjectSuggestions(refs.photoObjectSearchInput,refs.photoObjectSearchResults,setPhotoObjectSelection);
  };
  refs.photoObjectSearchButton.onclick=renderPhotoObjectSearch;
  refs.photoObjectSearchInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();renderPhotoObjectSearch();}if(e.key==='Escape'){refs.photoObjectSearchResults.classList.add('hidden');refs.photoObjectSearchResults.innerHTML='';}};
  const bindWorkPhoto=id=>{refs[id].onchange=e=>{addWorkPhotos(e.target.files);e.target.value='';};};
  bindWorkPhoto('workPhotoCameraInput');bindWorkPhoto('workPhotoGalleryInput');
  refs.photoMoreButton.onclick=()=>refs.photoMoreDialog.showModal(); refs.duplicatePhotoButton.onclick=duplicatePhotoCurrent; refs.sharePhotoJsonButton.onclick=sharePhotoCurrentJson;

  refs.photoReportForm.onsubmit=savePhotoReport;refs.deletePhotoReportButton.onclick=deletePhotoReport;refs.reportPdfButton.onclick=makeReportPdf;
  refs.reportNumberInput.oninput=()=>{refs.reportToolbarNumber.textContent=normalizeReportNumber(refs.reportNumberInput.value)||'Фотоотчёт';};
  refs.reportObjectSearchInput.oninput=()=>{
    const typed=canonicalObjectText(refs.reportObjectSearchInput.value),selected=canonicalObjectText(objectDisplay({gp:reportFormState.objectGp,name:reportFormState.objectName}));
    if(typed===selected){refs.reportObjectSearchResults.classList.add('hidden');refs.reportObjectSearchResults.innerHTML='';return;}
    clearReportObjectSelection();renderObjectSuggestions(refs.reportObjectSearchInput,refs.reportObjectSearchResults,setReportObjectSelection);
  };
  refs.reportObjectSearchButton.onclick=renderReportObjectSearch;
  refs.reportObjectSearchInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();renderReportObjectSearch();}if(e.key==='Escape'){refs.reportObjectSearchResults.classList.add('hidden');refs.reportObjectSearchResults.innerHTML='';}};
  const bindReportPhoto=id=>{refs[id].onchange=e=>{addReportPhotos(e.target.files);e.target.value='';};};
  bindReportPhoto('reportPhotoCameraInput');bindReportPhoto('reportPhotoGalleryInput');

  refs.exportBackupButton.onclick=exportBackup; refs.importBackupInput.onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value='';};
  refs.importObjectsInput.onchange=e=>{if(e.target.files[0])importObjects(e.target.files[0]);e.target.value='';}; refs.installHelpButton.onclick=()=>refs.installDialog.showModal();

  refs.fontSizeRange.oninput=()=>{const s=loadSettings();s.fontSize=Number(refs.fontSizeRange.value);refs.fontSizeLabel.textContent=`${s.fontSize}%`;saveSettings(s);};
  refs.boldTextToggle.onchange=()=>{const s=loadSettings();s.bold=refs.boldTextToggle.checked;saveSettings(s);};
  refs.contrastToggle.onchange=()=>{const s=loadSettings();s.contrast=refs.contrastToggle.checked;saveSettings(s);};
  refs.largeButtonsToggle.onchange=()=>{const s=loadSettings();s.largeButtons=refs.largeButtonsToggle.checked;saveSettings(s);};
  document.querySelectorAll('.theme-option').forEach(b=>b.onclick=()=>{const s=loadSettings();s.theme=b.dataset.theme;saveSettings(s);});
}
async function init(){
  cacheRefs();
  migratePremiumTheme();
  refs.photoWorkSectionInput.innerHTML='<option value="">Выберите раздел</option>'+WORK_SECTIONS.map(x=>`<option value="${esc(`${x.code} — ${x.name}`)}">${esc(x.code)} — ${esc(x.name)}</option>`).join('');
  applySettings(loadSettings()); bind(); refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;
  try{db=await openDb();await restorePreferences();await refresh();await restoreDrafts();
    navigator.storage?.persist?.().catch(()=>{});
  }catch(e){console.error(e);toast('Ошибка локальной базы данных');}
  if('serviceWorker' in navigator){
 navigator.serviceWorker.register('./sw.js').then(reg=>{
  const offer=()=>{if(reg.waiting&&navigator.serviceWorker.controller){refs.updateBanner.hidden=false;refs.installUpdate.onclick=async()=>{await flushDraft();reg.waiting.postMessage({type:'ACTIVATE'});};}};
  offer();reg.addEventListener('updatefound',()=>reg.installing?.addEventListener('statechange',offer));
 }).catch(console.error);
 let reloading=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});
 }
  setTimeout(()=>{refs.splash.classList.add('hide');refs.app.classList.remove('hidden');setTimeout(()=>refs.splash.remove(),650);},1900);
}

document.addEventListener('DOMContentLoaded',init);
