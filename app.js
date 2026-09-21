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
const BACKUP_META_KEY = 'rks.backup.meta.v1';
const BACKUP_SCHEMA = 8;
const APP_VERSION = String(window.RKS_APP_VERSION || '1.9.19');
const RKS_IMPORT_FORMAT = 'roskapstroy-defect-import';
const RKS_IMPORT_VERSION = 1;
const RKS_IMPORT_LIMITS = { fileBytes: 100*1024*1024, records: 100, photos: 300, photoBytes: 30*1024*1024, expandedBytes: 300*1024*1024 };
const RD_CATALOG = (Array.isArray(window.RKS_RD_CATALOG) ? window.RKS_RD_CATALOG : [])
  .map(item => ({section:String(item?.section||'').trim(), code:String(item?.code||'').trim()}))
  .filter(item => item.code);
const CHANGELOG = Array.isArray(window.RKS_CHANGELOG) ? window.RKS_CHANGELOG : [];

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
const OPTIONAL_ORGANIZATIONS = ['ЭнергоСК','ИСЭ','ТЭК Мосэнерго'];
const DEFECT_OPTIONAL_KEYS = ['number','status','workSection','workType','defectType','contractor','dueDate','signDate','issuer'];
const PHOTO_OPTIONAL_KEYS = ['number','contractor','workSection','workType','contractorRep','inspector'];
const REPORT_OPTIONAL_KEYS = ['number'];

let db;
let defects = [];
let photoRecords = [];
let photoReports = [];
let currentModule = 'defects';
let defectJournalMode = false;
let photoJournalMode = false;
let photoReportJournalMode = false;
let defectEntryPending = false;
let photoEntryPending = false;
let photoReportEntryPending = false;
let reservedDefectNumber = 0;
let currentDefectDraftCreatedAt = null;
let editingId = null;
let formDraftId = null;
let editingPhotoId = null;
let photoDraftId = null;
let currentPhotoDraftCreatedAt = null;
let editingPhotoReportId = null;
let photoReportDraftId = null;
let formState = freshFormState();
let photoFormState = freshPhotoFormState();
let photoReportFormState = freshPhotoReportFormState();
let currentPicker = null;
let pickerItems = [];
function blankOptional(keys){return Object.fromEntries(keys.map(key=>[key,false]));}
function freshFormState(){
  return { object:'', objectGp:'', objectName:'', workSection:'', defectType:'', photosBefore:[], photosAfter:[], ntd:[], optional:blankOptional(DEFECT_OPTIONAL_KEYS), numberPrefix:'РКС' };
}
function freshPhotoFormState(){
  return { object:'', objectGp:'', objectName:'', photos:[], scenarioSteps:[], optional:blankOptional(PHOTO_OPTIONAL_KEYS), numberPrefix:'РКС' };
}
function freshPhotoReportFormState(){ return {photos:[],optional:blankOptional(REPORT_OPTIONAL_KEYS),numberPrefix:'РКС'}; }

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
function isOverdue(d){ return Boolean(d.dueDate && optionalEnabled(d,'dueDate',d.dueDate) && !isResolved(d) && d.dueDate < today()); }
function normalizeNumber(v){
 const value=String(v||'').trim().replace(/\s+/g,' ');
 if(!value)return '';
 const match=value.match(/^(РКС|ФК|ФО)[-–—\s]*(.+)$/i);
 if(match)return `${match[1].toUpperCase()}-${match[2].trim()}`;
 if(/^\d/.test(value))return `РКС-${value}`;
 return value;
}
function splitCardNumber(v){
 const value=String(v||'').trim();
 const m=value.match(/^(РКС|ФК|ФО)[-–—\s]*(.*)$/i);
 if(m)return {prefix:m[1].toUpperCase(),suffix:m[2]||''};
 return {prefix:'РКС',suffix:value};
}
function composeCardNumber(value,prefix='РКС'){
 const raw=String(value||'').trim();
 if(!raw)return '';
 if(/^(РКС|ФК|ФО)[-–—\s]*/i.test(raw))return normalizeNumber(raw);
 return `${prefix||'РКС'}-${raw}`;
}
function numberValue(v){ const m = String(v||'').match(/(\d+)(?!.*\d)/); return m ? Number(m[1]) : 0; }
function formatNumber(n){ return `РКС-${String(n).padStart(2,'0')}`; }
function normalizePhotoReportNumber(v){ return normalizeNumber(v); }
function valuePresent(v){return v!==null&&v!==undefined&&String(v).trim()!=='';}
function optionalEnabled(record,key,value){
 const map=record?.optionalFields;
 if(map&&Object.prototype.hasOwnProperty.call(map,key))return map[key]===true;
 return valuePresent(value);
}
function inferOptional(record,keys,fieldMap){
 const result=blankOptional(keys);
 for(const key of keys)result[key]=optionalEnabled(record,key,fieldMap[key]);
 return result;
}
function effectiveNumber(record){return optionalEnabled(record,'number',record?.number)?String(record?.number||''):'';}
function setSelectValuePreserving(select,value){
 if(!select)return;
 const raw=String(value||'');
 if(raw && ![...select.options].some(o=>o.value===raw)){
   const option=document.createElement('option');option.value=raw;option.textContent=`${raw} (сохранено)`;select.append(option);
 }
 select.value=raw;
}

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
function dbPut(record,{clearDraft=true}={}){return writeTransaction([STORE,DRAFT_STORE],tx=>{tx.objectStore(STORE).put(record);if(clearDraft)tx.objectStore(DRAFT_STORE).delete('defect');});}
function dbDelete(id){return writeTransaction([STORE],tx=>{tx.objectStore(STORE).delete(id);});}
function dbDraftGet(id){
 return new Promise((resolve,reject)=>{
  const req=db.transaction(DRAFT_STORE).objectStore(DRAFT_STORE).get(id);
  req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);
 });
}
function dbDraftPut(id,record){return writeTransaction([DRAFT_STORE],tx=>tx.objectStore(DRAFT_STORE).put({id,record,updatedAt:new Date().toISOString()}));}
function dbDraftDelete(id){return writeTransaction([DRAFT_STORE],tx=>tx.objectStore(DRAFT_STORE).delete(id));}
async function deleteDraftIfMatches(type,recordId){
 const entry=await dbDraftGet(type);
 if(entry?.record?.id===recordId)await dbDraftDelete(type);
}
function dbPhotoAll(){
 return new Promise((resolve,reject)=>{
  const req=db.transaction(PHOTO_STORE).objectStore(PHOTO_STORE).getAll();
  req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);
 });
}
function dbPhotoPut(record,{clearDraft=true}={}){return writeTransaction([PHOTO_STORE,DRAFT_STORE],tx=>{tx.objectStore(PHOTO_STORE).put(record);if(clearDraft)tx.objectStore(DRAFT_STORE).delete('photo');});}
function dbPhotoDelete(id){return writeTransaction([PHOTO_STORE],tx=>tx.objectStore(PHOTO_STORE).delete(id));}
function dbReportAll(){ return new Promise((resolve,reject)=>{const req=db.transaction(REPORT_STORE).objectStore(REPORT_STORE).getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);}); }
function dbReportPut(record,{clearDraft=true}={}){return writeTransaction([REPORT_STORE,DRAFT_STORE],tx=>{tx.objectStore(REPORT_STORE).put(record);if(clearDraft)tx.objectStore(DRAFT_STORE).delete('photoReport');});}
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
function updateDefectDateSummary(){
 if(!refs.dateInput)return;
 const value=refs.dateInput.value||'';
 if(refs.dateHumanValue)refs.dateHumanValue.textContent=value===today()?'Сегодня':(value?formatReleaseDate(value):'Выбрать дату');
 if(refs.dateDisplayValue)refs.dateDisplayValue.textContent=value?formatReleaseDate(value):'—';
}
function syncDefectHeader(){
 const number=formState.optional?.number?composeCardNumber(refs.numberInput?.value||'',formState.numberPrefix):'';
 if(refs.toolbarNumber)refs.toolbarNumber.textContent=number||'Без номера';
 if(refs.toolbarTitleText)refs.toolbarTitleText.textContent=editingId?'Замечание':'Новое замечание';
 updateDefectDateSummary();
}
function defectDirty(r){
 return Boolean(r.objectName||r.location||r.workingDoc||r.description||r.remedy||r.ntd?.length||r.photosBefore?.length||r.photosAfter?.length||Object.values(r.optionalFields||{}).some(Boolean)||String(r.perPage||'2')!=='2');
}
function scheduleDefectAutosave(delay=650){
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
 if(!r.date){setDefectSaveState('Не сохранено','error');return false;}
 const activeNumber=effectiveNumber(r);
 const duplicate=Boolean(activeNumber)&&defects.some(d=>d.id!==r.id&&effectiveNumber(d).toLowerCase()===activeNumber.toLowerCase());
 if(duplicate){setDefectSaveState('Номер уже используется','error');return false;}
 defectAutosaveQueue=defectAutosaveQueue.catch(()=>{}).then(async()=>{
  if(editingId){
   await dbPut(r,{clearDraft:false});
  }else{
   await dbDraftPut('defect',r);
  }
 });
 await defectAutosaveQueue;
 if(editingId){
  const i=defects.findIndex(x=>x.id===r.id);if(i>=0)defects[i]=r;else defects.push(r);
  defects.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  setDefectSaveState('Сохранено ✓','saved');
 }else{
  reservedDefectNumber=Math.max(reservedDefectNumber,numberValue(r.number));
  currentDefectDraftCreatedAt=r.createdAt||currentDefectDraftCreatedAt;
  setDefectSaveState('Черновик сохранён ✓','saved');
 }
 const savedNumber=splitCardNumber(r.number);formState.numberPrefix=savedNumber.prefix;refs.numberInput.value=savedNumber.suffix;syncDefectHeader();
 return true;
}
function queueDraft(){
 if(activeForm==='defect'){scheduleDefectAutosave();return;}
 clearTimeout(draftTimer);
 draftTimer=setTimeout(()=>flushDraft().catch(storageError),500);
}
function flushDraft(){
 clearTimeout(draftTimer);
 if(!db||!activeForm)return draftQueue;
 if(activeForm==='defect')return autoPersistDefect({force:true});
 const type=activeForm,record=type==='photo'?photoRecordFromForm():photoReportFromForm();
 const list=type==='photo'?photoRecords:photoReports;
 const saved=list.find(r=>r.id===record.id);
 const comparable=r=>JSON.stringify({...r,createdAt:undefined,updatedAt:undefined});
 if(saved&&comparable(saved)===comparable(record))return draftQueue;
 draftQueue=draftQueue.catch(()=>{}).then(async()=>{
  if(type==='photo'&&editingPhotoId){
   await dbPhotoPut(record,{clearDraft:false});
   const i=photoRecords.findIndex(x=>x.id===record.id);if(i>=0)photoRecords[i]=record;
   return;
  }
  if(type==='photoReport'&&editingPhotoReportId){
   await dbReportPut(record,{clearDraft:false});
   const i=photoReports.findIndex(x=>x.id===record.id);if(i>=0)photoReports[i]=record;
   return;
  }
  await dbDraftPut(type,record);
 });
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
  if(entry.id==='defect')continue;
  const button=document.createElement('button');button.type='button';
  button.textContent=entry.id==='photo'?'Продолжить черновик проверки':'Продолжить черновик фотоотчёта';
  button.onclick=()=>{
   const list=entry.id==='photo'?photoRecords:photoReports;
   const r=entry.record;
   const existing=list.find(x=>x.id===r.id);
   if(existing&&existing.updatedAt>entry.updatedAt){toast('В журнале есть более новая сохранённая версия');return;}
   if(entry.id==='photo')openPhotoForm(null,r);else openPhotoReportForm(null,r);
   button.remove();if(!host.children.length)host.remove();
  };
  host.append(button);
 }
 if(!host.children.length)return;
 refs.updateBanner.after(host);
}
function validImageSource(src){
 return typeof src==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-z\d+/=\s]+$/i.test(src);
}
function assertBackup(data){
 if(!data||![1,2,3,4,5,6,7,8].includes(data.schema||1)||!Array.isArray(data.defects)||!Array.isArray(data.photoRecords||[])||!Array.isArray(data.photoReports||[]))throw Error('Неподдерживаемый формат копии');
 const validOptionalFields=value=>value==null||(typeof value==='object'&&!Array.isArray(value)&&Object.values(value).every(v=>typeof v==='boolean'));
 for(const [records,photo] of [[data.defects,false],[data.photoRecords||[],true]]){
  const ids=new Set(),numbers=new Set();
  for(const r of records){
   if(!r||typeof r.id!=='string'||!r.id||typeof r.number!=='string')throw Error('Некорректная запись');
   const n=normalizeNumber(r.number).toLowerCase();
   if(ids.has(r.id)||(n&&numbers.has(n)))throw Error('В копии есть повторяющиеся номера или записи');
   ids.add(r.id);if(n)numbers.add(n);
   if(!validOptionalFields(r.optionalFields))throw Error('Некорректные дополнительные параметры');
   for(const [key,value] of Object.entries(r))if(key!=='optionalFields'&&value!==null&&typeof value==='object'&&!Array.isArray(value))throw Error('Некорректное поле');
   for(const key of photo?['photos']:['photosBefore','photosAfter','ntd'])if(r[key]!=null&&!Array.isArray(r[key]))throw Error('Некорректный список');
   for(const [key,value] of Object.entries(r)){
    if(['photos','photosBefore','photosAfter','ntd','checklist','scenarioSteps','optionalFields'].includes(key))continue;
    if(value!=null&&typeof value!=='string')throw Error('Некорректное поле '+key);
   }
   const photos=photo?(r.photos||[]):[...(r.photosBefore||[]),...(r.photosAfter||[])];
   if(!Array.isArray(photos)||photos.some(p=>!validImageSource(photo?p?.src:p)))throw Error('Некорректная фотография в копии');
   if(!photo&&(!Array.isArray(r.ntd||[])||(r.ntd||[]).some(x=>!x||typeof x.name!=='string'||typeof x.clause!=='string')))throw Error('Некорректный список НТД');
   if(photo&&(!Array.isArray(r.scenarioSteps||[])||(r.scenarioSteps||[]).some(x=>!x||typeof x.id!=='string'||typeof x.event!=='string'||typeof x.command!=='string'||typeof x.expected!=='string'||typeof x.actual!=='string'||typeof x.status!=='string')))throw Error('Некорректный сценарий комплексного опробования');
  }
 }
 const reportIds=new Set(),reportNumbers=new Set();
 for(const r of data.photoReports||[]){
  if(!r||typeof r.id!=='string'||!r.id||typeof r.number!=='string')throw Error('Некорректный фотоотчёт');
  const reportNumber=normalizePhotoReportNumber(r.number).toLowerCase();
  if(reportIds.has(r.id)||(reportNumber&&reportNumbers.has(reportNumber)))throw Error('В копии есть повторяющиеся фотоотчёты');
  reportIds.add(r.id);if(reportNumber)reportNumbers.add(reportNumber);
  if(!validOptionalFields(r.optionalFields))throw Error('Некорректные дополнительные параметры фотоотчёта');
  if(r.date!=null&&typeof r.date!=='string')throw Error('Некорректная дата фотоотчёта');
  if(r.description!=null&&typeof r.description!=='string')throw Error('Некорректное описание фотоотчёта');
  if(!['1','2','4','6'].includes(String(r.perPage||'2')))throw Error('Некорректная сетка фотоотчёта');
  if(!Array.isArray(r.photos||[])||(r.photos||[]).some(p=>!validImageSource(typeof p==='string'?p:p?.src)))throw Error('Некорректная фотография в фотоотчёте');
 }
 for(const key of ['settings','custom'])if(data[key]&&(typeof data[key]!=='object'||Array.isArray(data[key])))throw Error('Некорректные настройки');
 if(data.custom&&Object.values(data.custom).some(v=>!Array.isArray(v)||v.some(x=>typeof x!=='string')))throw Error('Некорректный справочник');
 if(data.objects&&!Array.isArray(data.objects))throw Error('Некорректный справочник объектов');
 if(Array.isArray(data.objects)&&data.objects.some(x=>!normalizeObjectEntry(x)))throw Error('Некорректная запись в справочнике объектов');
 return data;
}

function loadSettings(){
  const defaults={fontSize:100,bold:false,contrast:false,largeButtons:false,theme:'system'};
  try { return {...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}; } catch { return defaults; }
}
function saveSettings(settings){ localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings)); applySettings(settings); }
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
  defects = defectData.map(record=>({...record,number:normalizeNumber(record.number)})).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  photoRecords = photoData.map(({checklist,...record})=>({...record,number:normalizeNumber(record.number)})).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  photoReports = reportData.map(record=>({...record,number:normalizePhotoReportNumber(record.number)})).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
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
}

function renderDefectDashboard(){
  refs.journalEyebrow.textContent='Строительный контроль';
  refs.journalTitle.textContent='Замечания';
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Фиксация недостатков, контроль устранения и выпуск листов замечаний.';
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
  refs.emptyText.textContent='Сохранённые замечания появятся здесь после команды «Сохранить».';
  refs.defectList.innerHTML=items.map(d=>{
    const overdueClass=isOverdue(d)?' overdue':'';
    const statusClass=d.status==='Закрыто'?' closed':(isOverdue(d)?' overdue':'');
    const meta=[optionalEnabled(d,'workSection',d.workSection)?d.workSection:'',optionalEnabled(d,'dueDate',d.dueDate)&&d.dueDate?`Срок ${fmtDate(d.dueDate)}`:''].filter(Boolean).join(' • ');
    const parsed=normalizeObjectEntry({gp:d.objectGp,name:d.objectName}) || normalizeObjectEntry(d.object) || {gp:'',name:'Объект не указан'};
    const photo=(d.photosBefore||[])[0]||'';
    return `<article class="defect-card${overdueClass}${photo?' has-photo':''}" data-id="${esc(d.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(effectiveNumber(d)||'замечание без номера')}">
      ${photo?`<img class="card-photo" src="${photo}" alt="Фото недостатка">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(effectiveNumber(d)||'Без номера')}</span>${optionalEnabled(d,'status',d.status)?`<span class="status-pill${statusClass}">${esc(isOverdue(d)?'Просрочено':d.status)}</span>`:''}</div>
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
  refs.journalTitle.textContent='Проверка';
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Фото выполненных работ, приемочного и операционного контроля, испытаний и опробования.';
  if(refs.listHeading) refs.listHeading.textContent='Последние проверки';
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
  refs.emptyTitle.textContent='Проверок пока нет';
  refs.emptyText.textContent='Сохранённые проверки появятся здесь после команды «Сохранить проверку».';
  refs.photoRecordList.innerHTML=items.map(r=>{
    const parsed=normalizeObjectEntry({gp:r.objectGp,name:r.objectName}) || normalizeObjectEntry(r.object) || {gp:'',name:'Объект не указан'};
    const first=((r.photos||[])[0]||{}).src||'';
    const meta=[r.controlType,optionalEnabled(r,'workSection',r.workSection)?r.workSection:'',`${(r.photos||[]).length} фото`].filter(Boolean).join(' • ');
    const visibleWorkType=optionalEnabled(r,'workType',r.workType)?r.workType:'';
    const summary=r.controlType==='Операционный контроль'?(r.operationStage||r.controlCriterion):r.controlType==='Приемочный контроль'?(r.acceptedScope||visibleWorkType):r.controlType==='Индивидуальные испытания'?(r.equipment||visibleWorkType):r.controlType==='Комплексное опробование'?(r.complexSystem||visibleWorkType):(visibleWorkType||r.description);
    return `<article class="defect-card photo-record-card${first?' has-photo':''}" data-id="${esc(r.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(effectiveNumber(r)||'карточку без номера')}">
      ${first?`<img class="card-photo" src="${first}" alt="Фото выполненных работ">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(effectiveNumber(r)||'Без номера')}</span><span class="status-pill${resultClass(r.result)}">${esc(r.result||'Без результата')}</span></div>
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
  if(refs.journalSubtitle) refs.journalSubtitle.textContent='Быстрый фотоотчёт с описанием, фотоматериалами и готовым PDF A4.';
  if(refs.listHeading) refs.listHeading.textContent='Последние фотоотчёты';
  if(refs.listHint) refs.listHint.textContent=photoReports.length ? 'Новые сверху' : 'Журнал пуст';
  refs.defectList.classList.add('hidden');
  refs.photoRecordList.classList.add('hidden');
  refs.photoReportList.classList.remove('hidden');
  const q=(refs.searchInput?.value||'').trim().toLowerCase();
  const items=photoReports.filter(r=>!q||[r.number,r.date,r.description,String(r.perPage||2)].some(v=>String(v||'').toLowerCase().includes(q)));
  refs.emptyState.classList.toggle('hidden',items.length>0);
  refs.emptyTitle.textContent='Фотоотчётов пока нет';
  refs.emptyText.textContent='Сохранённые фотоотчёты появятся здесь после команды «Сохранить фотоотчёт».';
  refs.photoReportList.innerHTML=items.map(r=>{
    const first=typeof (r.photos||[])[0]==='string'?(r.photos||[])[0]:((r.photos||[])[0]||{}).src||'';
    const count=(r.photos||[]).length;
    return `<article class="defect-card photo-report-card${first?' has-photo':''}" data-id="${esc(r.id)}" tabindex="0" role="button" aria-label="Открыть ${esc(effectiveNumber(r)||'карточку без номера')}">
      ${first?`<img class="card-photo" src="${first}" alt="Фото из фотоотчёта">`:''}
      <div class="card-content">
        <div class="card-top"><span class="card-number">${esc(effectiveNumber(r)||'Без номера')}</span><span class="status-pill closed">${count} фото</span></div>
        <div class="card-object"><span class="card-gp">PDF</span><span class="card-object-name">Фотоотчёт</span></div>
        <p class="card-description">${esc(r.description||'Описание не заполнено')}</p>
        <div class="card-bottom"><span class="card-meta">${esc(fmtDate(r.date))} • ${esc(String(r.perPage||2))} на лист</span><span class="card-meta">›</span></div>
      </div>
    </article>`;
  }).join('');
  refs.photoReportList.querySelectorAll('.photo-report-card').forEach(card=>{
    const open=()=>openPhotoReportForm(card.dataset.id);
    card.addEventListener('click',open);
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
}

function setModule(module,{journal=true}={}){
  currentModule=module==='photos'?'photos':module==='reports'?'reports':'defects';
  defectJournalMode=currentModule==='defects'&&journal;
  photoJournalMode=currentModule==='photos'&&journal;
  photoReportJournalMode=currentModule==='reports'&&journal;
  refs.defectsModuleButton.classList.toggle('active',currentModule==='defects');
  refs.photosModuleButton.classList.toggle('active',currentModule==='photos');
  refs.photoReportsModuleButton.classList.toggle('active',currentModule==='reports');
  [
    [refs.defectsModuleButton,currentModule==='defects'],
    [refs.photosModuleButton,currentModule==='photos'],
    [refs.photoReportsModuleButton,currentModule==='reports']
  ].forEach(([button,selected])=>{
    if(!button)return;
    button.setAttribute('aria-selected',String(selected));
    button.tabIndex=selected?0:-1;
  });
  renderDashboard();
}

function isModuleJournalOpen(module){
  if(module==='photos') return currentModule==='photos'&&photoJournalMode;
  if(module==='reports') return currentModule==='reports'&&photoReportJournalMode;
  return currentModule==='defects'&&defectJournalMode;
}
function openModuleJournal(module){
  setModule(module,{journal:true});
  showView('mainView');
  renderDashboard();
}
function handleModuleButton(module){
  if(isModuleJournalOpen(module)){
    if(module==='photos') return enterPhotoModule();
    if(module==='reports') return enterPhotoReportModule();
    return enterDefectsModule();
  }
  openModuleJournal(module);
}

function showView(view){
  if(activeForm)flushDraft().catch(storageError);
  activeForm=view==='formView'?'defect':view==='photoFormView'?'photo':view==='photoReportFormView'?'photoReport':null;
  ['mainView','formView','photoFormView','photoReportFormView','settingsView'].forEach(id=>refs[id].classList.toggle('active-view',id===view));
  refs.app?.classList.toggle('detail-mode',view!=='mainView');
  window.scrollTo({top:0,behavior:'instant'});
}

function resetFormDom(){
  refs.defectForm.reset();
  if(refs.defectAdditionalDetails)refs.defectAdditionalDetails.open=false;
  refs.issuerInput.value='';
  refs.statusInput.value='Черновик';
  refs.dateInput.value=today();
  refs.signDateInput.value='';
  refs.numberInput.value='';
  refs.contractorInput.value='';
  refs.dueDateInput.value='';
  if(refs.defectPerPageInput) refs.defectPerPageInput.value='2';
  formState=freshFormState();
  editingId=null; formDraftId=uid(); currentDefectDraftCreatedAt=new Date().toISOString();
  refs.formTitle.textContent='Новое замечание';
  refs.deleteDefectButton.classList.add('hidden');
  setDefectSaveState('Черновик',''); syncDefectHeader();
  refs.objectSearchInput.value='';
  refs.objectSearchResults.classList.add('hidden');
  refs.objectSearchResults.innerHTML='';
  if(refs.workingDocSuggestions)hideRdSuggestions(refs.workingDocInput,refs.workingDocSuggestions);
  updatePickerLabels(); renderDefectOptionalUi(); renderPhotos(); renderNtd();
}

function objectFromRecord(d){
  const direct=normalizeObjectEntry({gp:d?.objectGp,name:d?.objectName});
  if(direct?.name) return direct;
  return normalizeObjectEntry(d?.object)||{gp:'',name:''};
}

function populateDefectForm(d,{saved=false}={}){
  if(!d)return;
  if(refs.defectAdditionalDetails)refs.defectAdditionalDetails.open=false;
  editingId=saved?d.id:null; formDraftId=d.id||uid(); currentDefectDraftCreatedAt=d.createdAt||new Date().toISOString();
  reservedDefectNumber=Math.max(reservedDefectNumber,numberValue(d.number));
  refs.formTitle.textContent=effectiveNumber(d)||'Замечание';
  const parsedNumber=splitCardNumber(d.number);
  refs.numberInput.value=parsedNumber.suffix; refs.dateInput.value=d.date||today(); refs.statusInput.value=d.status||'Черновик';
  refs.locationInput.value=d.location||''; refs.workTypeInput.value=d.workType||''; refs.workingDocInput.value=d.workingDoc||''; refs.descriptionInput.value=d.description||''; refs.remedyInput.value=d.remedy||'';
  refs.dueDateInput.value=d.dueDate||''; refs.signDateInput.value=d.signDate||''; refs.contractorInput.value=d.contractor||''; refs.issuerInput.value=d.issuer||'';
  if(refs.defectPerPageInput) refs.defectPerPageInput.value=['1','2','4','6'].includes(String(d.perPage))?String(d.perPage):'2';
  const o=objectFromRecord(d);
  formState={
    object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',workSection:d.workSection||'',defectType:d.defectType||'',
    photosBefore:[...(d.photosBefore||[])],photosAfter:[...(d.photosAfter||[])],ntd:(d.ntd||[]).map(x=>({...x})),numberPrefix:parsedNumber.prefix,
    optional:inferOptional(d,DEFECT_OPTIONAL_KEYS,{number:d.number,status:d.status,workSection:d.workSection,workType:d.workType,defectType:d.defectType,contractor:d.contractor,dueDate:d.dueDate,signDate:d.signDate,issuer:d.issuer})
  };
  refs.objectSearchInput.value=objectDisplay(o);
  if(refs.workingDocSuggestions)hideRdSuggestions(refs.workingDocInput,refs.workingDocSuggestions);
  refs.deleteDefectButton.classList.toggle('hidden',!saved);
  updatePickerLabels(); renderDefectOptionalUi(); renderPhotos(); renderNtd();
  setDefectSaveState(saved?'Сохранено ✓':'Черновик сохранён ✓','saved'); syncDefectHeader();
}

function openForm(id=null,draftRecord=null){
  flushDraft().catch(storageError);activeForm=null;
  resetFormDom();
  if(id){
    const d=defects.find(x=>x.id===id); if(!d) return;
    populateDefectForm(d,{saved:true});
  }else if(draftRecord){
    populateDefectForm(draftRecord,{saved:false});
  }
  currentModule='defects';defectJournalMode=false;
  refs.defectsModuleButton.classList.add('active');refs.photosModuleButton.classList.remove('active');refs.photoReportsModuleButton.classList.remove('active');
  showView('formView');
}

async function getOrCreateDefectDraft(){
  const entry=await dbDraftGet('defect');
  const record=entry?.record||null;
  if(record)return {...record,number:normalizeNumber(record.number||'')};
  resetFormDom();
  const next=recordFromForm();
  await dbDraftPut('defect',next);
  return next;
}

async function enterDefectsModule(){
  if(defectEntryPending)return;
  defectEntryPending=true;
  try{
    defectJournalMode=false;photoJournalMode=false;photoReportJournalMode=false;
    currentModule='defects';
    refs.defectsModuleButton.classList.add('active');refs.photosModuleButton.classList.remove('active');refs.photoReportsModuleButton.classList.remove('active');
    const draft=await getOrCreateDefectDraft();
    openForm(null,draft);
  }catch(error){storageError(error);}finally{defectEntryPending=false;}
}

async function leaveDefectCard({journal=false}={}){
  try{await flushDraft();await refresh();}catch(error){storageError(error);}
  defectJournalMode=Boolean(journal);photoJournalMode=false;photoReportJournalMode=false;
  currentModule='defects';
  showView('mainView');
  renderDefectDashboard();
}

function updateObjectSummary(){
  refs.objectGpValue.textContent=formState.objectGp||'—';
  refs.objectNameValue.textContent=formState.objectName||'Объект не выбран';
}
function updatePickerLabels(){
  updateObjectSummary();
  refs.workSectionValue.textContent=formState.optional?.workSection?(formState.workSection||'Выбрать раздел'):'Откл';
  refs.defectTypeValue.textContent=formState.optional?.defectType?(formState.defectType||'Выбрать тип'):'Откл';
  if(refs.workTypeValue) refs.workTypeValue.textContent=formState.optional?.workType?(refs.workTypeInput.value||'Выбрать вид работ'):'Откл';
}
function setOptionalRowState(scope,key,enabled){
 const root=document.querySelector(`[data-optional-scope="${scope}"]`);if(!root)return;
 const row=root.querySelector(`[data-optional-row="${key}"]`);if(row)row.dataset.enabled=enabled?'true':'false';
}
function renderDefectOptionalUi(){
 if(!formState.optional)formState.optional=blankOptional(DEFECT_OPTIONAL_KEYS);
 const opt=formState.optional;
 for(const key of DEFECT_OPTIONAL_KEYS)setOptionalRowState('defect',key,Boolean(opt[key]));
 const num=opt.number?composeCardNumber(refs.numberInput.value,formState.numberPrefix):'';
 if(refs.numberPrefix)refs.numberPrefix.textContent=`${formState.numberPrefix||'РКС'}-`;
 if(refs.numberOptionalValue)refs.numberOptionalValue.textContent=num||'Откл';
 if(refs.statusOptionalValue)refs.statusOptionalValue.textContent=opt.status?(refs.statusInput.value||'Выбрать'):'Откл';
 if(refs.contractorOptionalValue)refs.contractorOptionalValue.textContent=opt.contractor?(refs.contractorInput.value||'Выбрать'):'Откл';
 if(refs.dueDateOptionalValue)refs.dueDateOptionalValue.textContent=opt.dueDate&&refs.dueDateInput.value?fmtDate(refs.dueDateInput.value):(opt.dueDate?'Выбрать':'Откл');
 if(refs.signDateOptionalValue)refs.signDateOptionalValue.textContent=opt.signDate&&refs.signDateInput.value?fmtDate(refs.signDateInput.value):(opt.signDate?'Выбрать':'Откл');
 if(refs.issuerOptionalValue)refs.issuerOptionalValue.textContent=opt.issuer?(refs.issuerInput.value||'Ввести'):'Откл';
 document.querySelectorAll('[data-optional-editor]').forEach(editor=>editor.classList.toggle('hidden',!opt[editor.dataset.optionalEditor]));
 updatePickerLabels();syncDefectHeader();
}

function recordFromForm(){
  const object=objectDisplay({gp:formState.objectGp,name:formState.objectName}) || formState.object;
  const existing=editingId?defects.find(x=>x.id===editingId):null;
  const opt={...blankOptional(DEFECT_OPTIONAL_KEYS),...(formState.optional||{})};
  const typedNumber=composeCardNumber(refs.numberInput.value,formState.numberPrefix);
  const storedNumber=opt.number?typedNumber:(existing?.number||'');
  return {
    id: editingId || formDraftId || (formDraftId=uid()),
    number:normalizeNumber(storedNumber), date:refs.dateInput.value, status:opt.status?refs.statusInput.value:(existing?.status||''),
    object, objectGp:formState.objectGp||'', objectName:formState.objectName||'', location:refs.locationInput.value.trim(),
    workSection:opt.workSection?formState.workSection:(existing?.workSection||''),workType:opt.workType?refs.workTypeInput.value.trim():(existing?.workType||''),defectType:opt.defectType?formState.defectType:(existing?.defectType||''),workingDoc:refs.workingDocInput.value.trim(),
    photosBefore:[...formState.photosBefore], photosAfter:[...formState.photosAfter],
    perPage:refs.defectPerPageInput&&['1','2','4','6'].includes(String(refs.defectPerPageInput.value))?String(refs.defectPerPageInput.value):'2',
    description:refs.descriptionInput.value.trim(), remedy:refs.remedyInput.value.trim(), ntd:formState.ntd.map(x=>({name:x.name,clause:String(x.clause||'').trim()})),
    dueDate:opt.dueDate?refs.dueDateInput.value:(existing?.dueDate||''),signDate:opt.signDate?refs.signDateInput.value:(existing?.signDate||''),contractor:opt.contractor?refs.contractorInput.value.trim():(existing?.contractor||''),issuer:opt.issuer?refs.issuerInput.value.trim():(existing?.issuer||''),
    optionalFields:opt,
    createdAt: editingId ? (existing?.createdAt||new Date().toISOString()) : (currentDefectDraftCreatedAt||new Date().toISOString()),
    updatedAt:new Date().toISOString()
  };
}
function validateRecord(r,{forPdf=false}={}){
  if(forPdf)return true;
  const activeNumber=effectiveNumber(r);
  if(activeNumber.length>40){toast('Номер карточки должен быть короче 40 символов');refs.numberInput.focus();return false;}
  if(activeNumber&&defects.some(d=>d.id!==editingId&&effectiveNumber(d).toLowerCase()===activeNumber.toLowerCase())){toast('Такой номер замечания уже используется');refs.numberInput.focus();return false;}
  if(!r.date){toast('Укажите дату замечания');return false;}
  if(!r.objectName&&!r.object){toast('Выберите объект через поиск');refs.objectSearchInput.focus();return false;}
  if(!r.description){toast('Заполните описание недостатка');refs.descriptionInput.focus();return false;}
  const missingClause=r.ntd.find(x=>!x.clause);if(missingClause){toast(`Укажите пункт: ${missingClause.name}`);return false;}
  return true;
}

async function commitCurrentDefect(){
  if(processingPhotos){toast('Дождитесь завершения обработки фото');return false;}
  const r=recordFromForm();
  if(!validateRecord(r))return false;
  const wasCurrentDraft=!editingId;
  await dbPut(r,{clearDraft:wasCurrentDraft});
  const i=defects.findIndex(x=>x.id===r.id);if(i>=0)defects[i]=r;else defects.push(r);
  defects.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  editingId=r.id;formDraftId=r.id;currentDefectDraftCreatedAt=r.createdAt;
  refs.formTitle.textContent=effectiveNumber(r)||'Замечание';refs.deleteDefectButton.classList.remove('hidden');syncDefectHeader();setDefectSaveState('Сохранено ✓','saved');
  return true;
}
async function saveForm(e){
  e?.preventDefault?.();
  try{if(await commitCurrentDefect())toast('Замечание сохранено');}
  catch(error){storageError(error);}
}
async function saveAndCreateNextDefect(){
  try{
    if(!(await commitCurrentDefect()))return;
    const existing=await dbDraftGet('defect');
    if(existing?.record){openForm(null,existing.record);toast('Сохранено. Открыт текущий незавершённый черновик');return;}
    resetFormDom();
    const next=recordFromForm();
    await dbDraftPut('defect',next);
    openForm(null,next);
    toast('Сохранено. Создано следующее замечание');
  }catch(error){storageError(error);}
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

const RD_LATIN_LOOKALIKES = Object.freeze({A:'А',B:'В',C:'С',E:'Е',H:'Н',K:'К',M:'М',O:'О',P:'Р',T:'Т',X:'Х'});
function canonicalRdText(value=''){
  return String(value||'').normalize('NFKC').toUpperCase().replace(/Ё/g,'Е').replace(/[ABCEHKMOPTX]/g,ch=>RD_LATIN_LOOKALIKES[ch]||ch).replace(/[^0-9A-ZА-Я.]/g,'');
}
function rdSectionCode(value=''){
  const raw=String(value||'').trim();
  return (raw.includes('—')?raw.split('—')[0]:raw).trim();
}
function rankRdMatches(raw,sectionValue='',limit=12){
  const q=canonicalRdText(raw); if(!q) return [];
  const preferred=canonicalRdText(rdSectionCode(sectionValue));
  const ranked=[];
  for(const item of RD_CATALOG){
    const code=canonicalRdText(item.code), section=canonicalRdText(item.section);
    let score=0;
    if(code===q) score=140;
    else if(code.startsWith(q)) score=120;
    else if(section===q) score=105;
    else if(code.includes(q)) score=90;
    else if(section.startsWith(q)) score=75;
    else if(section.includes(q)) score=55;
    if(!score) continue;
    if(preferred && section===preferred) score+=25;
    ranked.push({item,score});
  }
  return ranked.sort((a,b)=>b.score-a.score||a.item.code.localeCompare(b.item.code,'ru',{numeric:true})).slice(0,limit);
}
function hideRdSuggestions(input,results){
  results.classList.add('hidden');results.innerHTML='';input.setAttribute('aria-expanded','false');
}
function pickRdSuggestion(input,results,item){
  input.value=item.code;input.dataset.rdSection=item.section||'';hideRdSuggestions(input,results);
  input.dispatchEvent(new Event('change',{bubbles:true}));input.focus();
}
function renderRdSuggestions(input,results,sectionValue=''){
  const raw=input.value.trim();
  if(!raw){hideRdSuggestions(input,results);return;}
  const ranked=rankRdMatches(raw,sectionValue,12);
  if(!ranked.length){
    results.innerHTML='<div class="rd-suggestions-empty">В справочнике РД совпадений нет. Можно оставить введённое значение вручную.</div>';
    results.classList.remove('hidden');input.setAttribute('aria-expanded','true');return;
  }
  results.innerHTML=`<div class="rd-suggestions-title">Справочник РД · ${RD_CATALOG.length} шифров · показано ${ranked.length}</div>`+ranked.map(({item},index)=>`<button type="button" class="rd-suggestion" role="option" data-rd-index="${index}" data-rd-code="${encodeURIComponent(item.code)}" data-rd-section="${encodeURIComponent(item.section||'')}"><span class="rd-suggestion-code">${esc(item.code)}</span><span class="rd-suggestion-section">${esc(item.section||'РД')}</span></button>`).join('');
  results.classList.remove('hidden');input.setAttribute('aria-expanded','true');
  results.querySelectorAll('.rd-suggestion').forEach(btn=>{
    btn.addEventListener('pointerdown',e=>e.preventDefault());
    btn.addEventListener('click',()=>pickRdSuggestion(input,results,{code:decodeURIComponent(btn.dataset.rdCode),section:decodeURIComponent(btn.dataset.rdSection)}));
  });
}
function bindRdAutocomplete(input,results,getSection){
  if(!input||!results)return;
  const render=()=>renderRdSuggestions(input,results,getSection?.()||'');
  input.addEventListener('input',render);
  input.addEventListener('focus',()=>{if(input.value.trim())render();});
  input.addEventListener('keydown',e=>{
    const buttons=[...results.querySelectorAll('.rd-suggestion')];
    if(e.key==='Escape'){hideRdSuggestions(input,results);return;}
    if(e.key==='ArrowDown'&&buttons.length){e.preventDefault();buttons[0].focus();return;}
    if(e.key==='Enter'&&!results.classList.contains('hidden')&&buttons.length){e.preventDefault();buttons[0].click();}
  });
  results.addEventListener('keydown',e=>{
    const buttons=[...results.querySelectorAll('.rd-suggestion')];const current=buttons.indexOf(document.activeElement);if(current<0)return;
    if(e.key==='ArrowDown'){e.preventDefault();buttons[Math.min(buttons.length-1,current+1)].focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();if(current===0)input.focus();else buttons[current-1].focus();}
    else if(e.key==='Escape'){e.preventDefault();hideRdSuggestions(input,results);input.focus();}
  });
  input.addEventListener('blur',()=>setTimeout(()=>{if(!results.contains(document.activeElement))hideRdSuggestions(input,results);},140));
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
function resetPhotoFormDom(){
  refs.photoRecordForm.reset();
  editingPhotoId=null;photoDraftId=uid();currentPhotoDraftCreatedAt=new Date().toISOString();photoFormState=freshPhotoFormState();
  refs.photoFormTitle.textContent='Новая проверка';refs.photoNumberInput.value='';refs.photoDateInput.value=today();refs.photoControlTypeInput.value='Операционный контроль';refs.photoResultInput.value='Принято';
  if(refs.photoPerPageInput)refs.photoPerPageInput.value='2';
  refs.photoObjectSearchInput.value='';refs.photoObjectSearchResults.classList.add('hidden');refs.photoObjectSearchResults.innerHTML='';
  if(refs.photoWorkingDocSuggestions)hideRdSuggestions(refs.photoWorkingDocInput,refs.photoWorkingDocSuggestions);
  refs.photoInspectorInput.value='';refs.photoContractorInput.value='';refs.photoWorkSectionInput.value='';refs.photoWorkTypeInput.value='';refs.photoContractorRepInput.value='';
  refs.deletePhotoRecordButton.classList.add('hidden');updatePhotoObjectSummary();updatePhotoSpecificFields();renderScenarioSteps();processingPhotos=0;renderWorkPhotos();renderPhotoOptionalUi();queueDraft();
}
function updatePhotoObjectSummary(){
  refs.photoObjectGpValue.textContent=photoFormState.objectGp||'—';
  refs.photoObjectNameValue.textContent=photoFormState.objectName||'Объект не выбран';
}
function populatePhotoForm(r,{saved=false}={}){
  if(!r)return;
  editingPhotoId=saved?r.id:null;photoDraftId=r.id||uid();currentPhotoDraftCreatedAt=r.createdAt||new Date().toISOString();
  refs.photoFormTitle.textContent=effectiveNumber(r)||'Проверка';
  const parsedNumber=splitCardNumber(r.number);refs.photoNumberInput.value=parsedNumber.suffix;
  refs.photoDateInput.value=r.date||today();refs.photoControlTypeInput.value=r.controlType||'Операционный контроль';refs.photoResultInput.value=r.result||'Принято';
  refs.photoLocationInput.value=r.location||'';setSelectValuePreserving(refs.photoContractorInput,r.contractor||'');setSelectValuePreserving(refs.photoWorkSectionInput,r.workSection||'');refs.photoWorkTypeInput.value=r.workType||'';refs.photoWorkingDocInput.value=r.workingDoc||'';
  if(refs.photoWorkingDocSuggestions)hideRdSuggestions(refs.photoWorkingDocInput,refs.photoWorkingDocSuggestions);
  refs.photoDescriptionInput.value=r.description||'';refs.photoOperationStageInput.value=r.operationStage||'';refs.photoControlCriterionInput.value=r.controlCriterion||'';refs.photoControlMethodInput.value=r.controlMethod||'';refs.photoPrecedingWorksInput.value=r.precedingWorks||'';refs.photoHiddenWorksInput.value=r.hiddenWorks||'Не применяется';
  refs.photoAcceptedScopeInput.value=r.acceptedScope||'';refs.photoExecutiveDocsInput.value=r.executiveDocs||'';refs.photoAcceptanceTestsInput.value=r.acceptanceTests||'';refs.photoNextStageInput.value=r.nextStage||'Готово';refs.photoPreviousRemarksInput.value=r.previousRemarks||'';
  refs.photoEquipmentInput.value=r.equipment||'';refs.photoSerialInput.value=r.serial||'';refs.photoProtocolInput.value=r.protocol||'';refs.photoInstrumentInput.value=r.instrument||'';refs.photoInstrumentSerialInput.value=r.instrumentSerial||'';refs.photoTestParamsInput.value=r.testParams||'';refs.photoTestResultInput.value=r.testResult||'';
  refs.photoComplexSystemInput.value=r.complexSystem||'';refs.photoComplexProgramInput.value=r.complexProgram||'';refs.photoComplexDurationInput.value=r.complexDuration||'';refs.photoComplexProtocolInput.value=r.complexProtocol||'';refs.photoContractorRepInput.value=r.contractorRep||'';refs.photoInspectorInput.value=r.inspector||'';
  if(refs.photoPerPageInput)refs.photoPerPageInput.value=['1','2','4','6'].includes(String(r.perPage))?String(r.perPage):'2';
  const o=objectFromRecord(r);
  photoFormState={object:objectDisplay(o),objectGp:o.gp||'',objectName:o.name||'',photos:(r.photos||[]).map((p,i)=>typeof p==='string'?{id:uid(),src:p,kind:PHOTO_KINDS[Math.min(i,2)],caption:'',originalName:'',originalSize:0,capturedAt:''}:{id:p.id||uid(),src:p.src||'',kind:p.kind||PHOTO_KINDS[Math.min(i,2)],caption:p.caption||'',originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''}),scenarioSteps:(r.scenarioSteps||[]).map(step=>({id:step.id||uid(),event:String(step.event||''),command:String(step.command||''),expected:String(step.expected||''),actual:String(step.actual||''),status:String(step.status||'')})),numberPrefix:parsedNumber.prefix,optional:inferOptional(r,PHOTO_OPTIONAL_KEYS,{number:r.number,contractor:r.contractor,workSection:r.workSection,workType:r.workType,contractorRep:r.contractorRep,inspector:r.inspector})};
  refs.photoObjectSearchInput.value=objectDisplay(o);refs.deletePhotoRecordButton.classList.toggle('hidden',!saved);updatePhotoObjectSummary();updatePhotoSpecificFields();renderScenarioSteps();renderWorkPhotos();renderPhotoOptionalUi();
}
function openPhotoForm(id=null,draftRecord=null){
  flushDraft().catch(storageError);activeForm=null;
  resetPhotoFormDom();
  if(id){
    const r=photoRecords.find(x=>x.id===id); if(!r) return;
    populatePhotoForm(r,{saved:true});
  }else if(draftRecord){
    const saved=photoRecords.some(x=>x.id===draftRecord.id);
    populatePhotoForm(draftRecord,{saved});
  }
  currentModule='photos';photoJournalMode=false;
  refs.defectsModuleButton.classList.remove('active');refs.photosModuleButton.classList.add('active');refs.photoReportsModuleButton.classList.remove('active');
  showView('photoFormView');
}
async function getOrCreatePhotoDraft(){
  const entry=await dbDraftGet('photo');const record=entry?.record||null;
  if(record)return {...record,number:normalizeNumber(record.number||'')};
  resetPhotoFormDom();const next=photoRecordFromForm();await dbDraftPut('photo',next);return next;
}
async function enterPhotoModule(){
  if(photoEntryPending)return;
  photoEntryPending=true;
  try{
    currentModule='photos';photoJournalMode=false;
    refs.defectsModuleButton.classList.remove('active');refs.photosModuleButton.classList.add('active');refs.photoReportsModuleButton.classList.remove('active');
    const draft=await getOrCreatePhotoDraft();
    openPhotoForm(null,draft);
  }catch(error){storageError(error);}finally{photoEntryPending=false;}
}
async function leavePhotoCard(){
  try{await flushDraft();await refresh();}catch(error){storageError(error);}
  setModule('photos',{journal:true});showView('mainView');renderPhotoDashboard();
}

function photoRecordFromForm(){
  const object=objectDisplay({gp:photoFormState.objectGp,name:photoFormState.objectName}) || photoFormState.object;
  const existing=editingPhotoId?photoRecords.find(x=>x.id===editingPhotoId):null;
  const opt={...blankOptional(PHOTO_OPTIONAL_KEYS),...(photoFormState.optional||{})};
  const typedNumber=composeCardNumber(refs.photoNumberInput.value,photoFormState.numberPrefix);
  return {
    id:editingPhotoId||photoDraftId||(photoDraftId=uid()),number:normalizeNumber(opt.number?typedNumber:(existing?.number||'')),date:refs.photoDateInput.value,
    controlType:refs.photoControlTypeInput.value,result:refs.photoResultInput.value,
    object,objectGp:photoFormState.objectGp||'',objectName:photoFormState.objectName||'',location:refs.photoLocationInput.value.trim(),
    contractor:opt.contractor?refs.photoContractorInput.value.trim():(existing?.contractor||''),workSection:opt.workSection?refs.photoWorkSectionInput.value:(existing?.workSection||''),workType:opt.workType?refs.photoWorkTypeInput.value.trim():(existing?.workType||''),workingDoc:refs.photoWorkingDocInput.value.trim(),description:refs.photoDescriptionInput.value.trim(),
    operationStage:refs.photoOperationStageInput.value.trim(),controlCriterion:refs.photoControlCriterionInput.value.trim(),controlMethod:refs.photoControlMethodInput.value.trim(),precedingWorks:refs.photoPrecedingWorksInput.value.trim(),hiddenWorks:refs.photoHiddenWorksInput.value,
    acceptedScope:refs.photoAcceptedScopeInput.value.trim(),executiveDocs:refs.photoExecutiveDocsInput.value.trim(),acceptanceTests:refs.photoAcceptanceTestsInput.value.trim(),nextStage:refs.photoNextStageInput.value,previousRemarks:refs.photoPreviousRemarksInput.value.trim(),
    equipment:refs.photoEquipmentInput.value.trim(),serial:refs.photoSerialInput.value.trim(),protocol:refs.photoProtocolInput.value.trim(),instrument:refs.photoInstrumentInput.value.trim(),instrumentSerial:refs.photoInstrumentSerialInput.value.trim(),testParams:refs.photoTestParamsInput.value.trim(),testResult:refs.photoTestResultInput.value.trim(),
    complexSystem:refs.photoComplexSystemInput.value.trim(),complexProgram:refs.photoComplexProgramInput.value.trim(),complexDuration:refs.photoComplexDurationInput.value.trim(),complexProtocol:refs.photoComplexProtocolInput.value.trim(),
    scenarioSteps:(photoFormState.scenarioSteps||[]).map(step=>({id:step.id||uid(),event:String(step.event||'').trim(),command:String(step.command||'').trim(),expected:String(step.expected||'').trim(),actual:String(step.actual||'').trim(),status:String(step.status||'')})),
    photos:photoFormState.photos.map(p=>({id:p.id||uid(),src:p.src,kind:p.kind||'Другое',caption:String(p.caption||'').trim(),originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''})),
    perPage:refs.photoPerPageInput&&['1','2','4','6'].includes(String(refs.photoPerPageInput.value))?String(refs.photoPerPageInput.value):'2',
    contractorRep:opt.contractorRep?refs.photoContractorRepInput.value.trim():(existing?.contractorRep||''),inspector:opt.inspector?refs.photoInspectorInput.value.trim():(existing?.inspector||''),optionalFields:opt,
    createdAt:existing?.createdAt||currentPhotoDraftCreatedAt||new Date().toISOString(),updatedAt:new Date().toISOString()
  };
}
function validatePhotoRecord(r,{forPdf=false}={}){
  if(forPdf)return true;
  const activeNumber=effectiveNumber(r);
  if(activeNumber&&photoRecords.some(x=>x.id!==editingPhotoId&&effectiveNumber(x).toLowerCase()===activeNumber.toLowerCase())){toast('Такой номер проверки уже используется');refs.photoNumberInput.focus();return false;}
  if(!r.date){toast('Укажите дату контроля');return false;}
  if(!r.objectName&&!r.object){toast('Выберите объект через поиск');refs.photoObjectSearchInput.focus();return false;}
  const workTypeActive=optionalEnabled(r,'workType',r.workType);
  if(!(workTypeActive&&r.workType)&&!r.description){toast('Укажите описание выполненных работ либо включите «Вид работ»');refs.photoDescriptionInput.focus();return false;}
  return true;
}
async function savePhotoRecord(e){
  e?.preventDefault?.(); const r=photoRecordFromForm(); if(!validatePhotoRecord(r)) return;
  if(processingPhotos){toast('Дождитесь обработки фотографий');return;}
  try{await flushDraft();await dbPhotoPut(r,{clearDraft:false});await deleteDraftIfMatches('photo',r.id);editingPhotoId=r.id;photoDraftId=r.id;currentPhotoDraftCreatedAt=r.createdAt;await refresh();refs.photoFormTitle.textContent=effectiveNumber(r)||'Проверка';const savedNumber=splitCardNumber(r.number);photoFormState.numberPrefix=savedNumber.prefix;refs.photoNumberInput.value=savedNumber.suffix;renderPhotoOptionalUi();refs.deletePhotoRecordButton.classList.remove('hidden');toast('Проверка сохранена');}
  catch(error){storageError(error);}
}
async function deletePhotoRecord(){
  if(!editingPhotoId) return;
  if(!confirm('Удалить эту проверку? Действие нельзя отменить.')) return;
  await flushDraft();const removedId=editingPhotoId;await dbPhotoDelete(removedId);await deleteDraftIfMatches('photo',removedId);activeForm=null; await refresh(); currentModule='photos';photoJournalMode=true; showView('mainView'); renderDashboard(); toast('Проверка удалена');
}
function renderPhotoOptionalUi(){
 if(!photoFormState.optional)photoFormState.optional=blankOptional(PHOTO_OPTIONAL_KEYS);
 const opt=photoFormState.optional;for(const key of PHOTO_OPTIONAL_KEYS)setOptionalRowState('photo',key,Boolean(opt[key]));
 if(refs.photoNumberPrefix)refs.photoNumberPrefix.textContent=`${photoFormState.numberPrefix||'РКС'}-`;
 if(refs.photoNumberOptionalValue)refs.photoNumberOptionalValue.textContent=opt.number?(composeCardNumber(refs.photoNumberInput.value,photoFormState.numberPrefix)||'Ввести'):'Откл';
 if(refs.photoContractorOptionalValue)refs.photoContractorOptionalValue.textContent=opt.contractor?(refs.photoContractorInput.value||'Выбрать'):'Откл';
 if(refs.photoWorkSectionOptionalValue)refs.photoWorkSectionOptionalValue.textContent=opt.workSection?(refs.photoWorkSectionInput.value||'Выбрать'):'Откл';
 if(refs.photoWorkTypeOptionalValue)refs.photoWorkTypeOptionalValue.textContent=opt.workType?(refs.photoWorkTypeInput.value||'Ввести'):'Откл';
 if(refs.photoContractorRepOptionalValue)refs.photoContractorRepOptionalValue.textContent=opt.contractorRep?(refs.photoContractorRepInput.value||'Ввести'):'Откл';
 if(refs.photoInspectorOptionalValue)refs.photoInspectorOptionalValue.textContent=opt.inspector?(refs.photoInspectorInput.value||'Ввести'):'Откл';
 document.querySelectorAll('[data-photo-optional-editor]').forEach(editor=>editor.classList.toggle('hidden',!opt[editor.dataset.photoOptionalEditor]));
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
    const i=Number(b.dataset.workPhotoSave),p=photoFormState.photos[i];if(p?.src)saveImageToPhotos(p.src,`${refs.photoNumberInput.value||'Проверка'}_${i+1}`);
  });
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-kind]').forEach(el=>el.onchange=()=>photoFormState.photos[Number(el.dataset.workPhotoKind)].kind=el.value);
  refs.workPhotoGrid.querySelectorAll('[data-work-photo-caption]').forEach(el=>el.oninput=()=>photoFormState.photos[Number(el.dataset.workPhotoCaption)].caption=el.value);
}
async function duplicatePhotoCurrent(){
  refs.photoMoreDialog.close(); const src=photoRecordFromForm(); if(!validatePhotoRecord(src)) return;
  const copy={...src,id:uid(),number:'',optionalFields:{...(src.optionalFields||{}),number:false},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photos:src.photos.map(p=>({...p,id:uid()})),scenarioSteps:(src.scenarioSteps||[]).map(x=>({...x,id:uid()}))};
  await dbPhotoPut(copy,{clearDraft:false});await refresh();openPhotoForm(copy.id);toast('Создана копия проверки');
}
function sharePhotoCurrentJson(){refs.photoMoreDialog.close();const r=photoRecordFromForm();downloadJson(`${filenameSafe(r.number||'photo-record')}.json`,r);}


function resetPhotoReportFormDom(){
  refs.photoReportForm.reset();editingPhotoReportId=null;photoReportDraftId=uid();photoReportFormState=freshPhotoReportFormState();const date=today();
  refs.photoReportFormTitle.textContent='Новый фотоотчёт';refs.photoReportNumberInput.value='';refs.photoReportDateInput.value=date;refs.photoReportDateValue.textContent=fmtDate(date);refs.photoReportPerPageInput.value='2';
  if(refs.photoReportAdditionalDetails)refs.photoReportAdditionalDetails.open=false;
  refs.deletePhotoReportButton.classList.add('hidden');processingPhotos=0;renderPhotoReportOptionalUi();renderPhotoReportPhotos();
}
function populatePhotoReportForm(r,{saved=false}={}){
  if(!r)return;editingPhotoReportId=saved?r.id:null;photoReportDraftId=r.id||uid();refs.photoReportFormTitle.textContent=effectiveNumber(r)||'Фотоотчёт';
  const parsedNumber=splitCardNumber(r.number);refs.photoReportNumberInput.value=parsedNumber.suffix;refs.photoReportDateInput.value=r.date||today();refs.photoReportDateValue.textContent=fmtDate(refs.photoReportDateInput.value);refs.photoReportDescriptionInput.value=r.description||'';refs.photoReportPerPageInput.value=['1','2','4','6'].includes(String(r.perPage))?String(r.perPage):'2';
  photoReportFormState={photos:(r.photos||[]).map(p=>typeof p==='string'?{id:uid(),src:p,originalName:'',originalSize:0,capturedAt:''}:{id:p.id||uid(),src:p.src||'',originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''}),numberPrefix:parsedNumber.prefix,optional:inferOptional(r,REPORT_OPTIONAL_KEYS,{number:r.number})};
  if(refs.photoReportAdditionalDetails)refs.photoReportAdditionalDetails.open=false;refs.deletePhotoReportButton.classList.toggle('hidden',!saved);renderPhotoReportOptionalUi();renderPhotoReportPhotos();
}
function openPhotoReportForm(id=null,draftRecord=null){
  flushDraft().catch(storageError);activeForm=null;
  resetPhotoReportFormDom();
  if(id){
    const r=photoReports.find(x=>x.id===id);if(!r)return;
    populatePhotoReportForm(r,{saved:true});
  }else if(draftRecord){
    const saved=photoReports.some(x=>x.id===draftRecord.id);
    populatePhotoReportForm(draftRecord,{saved});
  }
  currentModule='reports';photoReportJournalMode=false;
  refs.defectsModuleButton.classList.remove('active');refs.photosModuleButton.classList.remove('active');refs.photoReportsModuleButton.classList.add('active');
  showView('photoReportFormView');
}
async function getOrCreatePhotoReportDraft(){
  const entry=await dbDraftGet('photoReport');const record=entry?.record||null;if(record)return {...record,number:normalizePhotoReportNumber(record.number||'')};
  resetPhotoReportFormDom();const next=photoReportFromForm();await dbDraftPut('photoReport',next);return next;
}
async function enterPhotoReportModule(){
  if(photoReportEntryPending)return;
  photoReportEntryPending=true;
  try{
    currentModule='reports';photoReportJournalMode=false;
    refs.defectsModuleButton.classList.remove('active');refs.photosModuleButton.classList.remove('active');refs.photoReportsModuleButton.classList.add('active');
    const draft=await getOrCreatePhotoReportDraft();openPhotoReportForm(null,draft);
  }catch(error){storageError(error);}finally{photoReportEntryPending=false;}
}
async function leavePhotoReportCard(){
  try{await flushDraft();await refresh();}catch(error){storageError(error);}
  setModule('reports',{journal:true});showView('mainView');renderPhotoReportDashboard();
}

function photoReportFromForm(){
  const existing=editingPhotoReportId?photoReports.find(x=>x.id===editingPhotoReportId):null;const opt={...blankOptional(REPORT_OPTIONAL_KEYS),...(photoReportFormState.optional||{})};const typedNumber=composeCardNumber(refs.photoReportNumberInput.value,photoReportFormState.numberPrefix);
  return {id:editingPhotoReportId||photoReportDraftId||(photoReportDraftId=uid()),number:normalizePhotoReportNumber(opt.number?typedNumber:(existing?.number||'')),date:refs.photoReportDateInput.value||today(),description:refs.photoReportDescriptionInput.value.trim(),perPage:String(refs.photoReportPerPageInput.value||'2'),photos:photoReportFormState.photos.map(p=>({id:p.id||uid(),src:p.src,originalName:p.originalName||'',originalSize:Number(p.originalSize)||0,capturedAt:p.capturedAt||''})),optionalFields:opt,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
}
function validatePhotoReport(r,{forPdf=false}={}){
  if(forPdf)return true;const activeNumber=effectiveNumber(r);if(activeNumber&&photoReports.some(x=>x.id!==r.id&&effectiveNumber(x).toLowerCase()===activeNumber.toLowerCase())){toast('Такой номер фотоотчёта уже используется');return false;}if(!['1','2','4','6'].includes(String(r.perPage))){toast('Выберите количество фотографий на лист');return false;}return true;
}
async function savePhotoReport(e){
  e?.preventDefault?.();const r=photoReportFromForm();if(!validatePhotoReport(r))return;
  if(processingPhotos){toast('Дождитесь обработки фотографий');return;}
  try{await flushDraft();await dbReportPut(r,{clearDraft:false});await deleteDraftIfMatches('photoReport',r.id);editingPhotoReportId=r.id;photoReportDraftId=r.id;await refresh();refs.photoReportFormTitle.textContent=effectiveNumber(r)||'Фотоотчёт';const savedNumber=splitCardNumber(r.number);photoReportFormState.numberPrefix=savedNumber.prefix;refs.photoReportNumberInput.value=savedNumber.suffix;renderPhotoReportOptionalUi();refs.deletePhotoReportButton.classList.remove('hidden');toast('Фотоотчёт сохранён');}
  catch(error){storageError(error);}
}
async function deletePhotoReport(){
  if(!editingPhotoReportId)return;
  if(!confirm('Удалить этот фотоотчёт? Действие нельзя отменить.'))return;
  await flushDraft();const removedId=editingPhotoReportId;await dbReportDelete(removedId);await deleteDraftIfMatches('photoReport',removedId);activeForm=null;await refresh();currentModule='reports';photoReportJournalMode=true;showView('mainView');renderDashboard();toast('Фотоотчёт удалён');
}
function renderPhotoReportOptionalUi(){
 if(!photoReportFormState.optional)photoReportFormState.optional=blankOptional(REPORT_OPTIONAL_KEYS);const opt=photoReportFormState.optional;setOptionalRowState('photoReport','number',Boolean(opt.number));
 if(refs.photoReportNumberPrefix)refs.photoReportNumberPrefix.textContent=`${photoReportFormState.numberPrefix||'РКС'}-`;
 if(refs.photoReportNumberValue)refs.photoReportNumberValue.textContent=opt.number?(composeCardNumber(refs.photoReportNumberInput.value,photoReportFormState.numberPrefix)||'Ввести'):'Откл';
 document.querySelectorAll('[data-report-optional-editor]').forEach(editor=>editor.classList.toggle('hidden',!opt[editor.dataset.reportOptionalEditor]));
}

async function addPhotoReportPhotos(files){
  const arr=[...files];if(!arr.length)return;processingPhotos++;toast(`Обработка фото: ${arr.length}`);
  try{
    for(const file of arr){
      if(!(file.type||'').startsWith('image/')&&!/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name||''))continue;
      try{const src=await compressFile(file);photoReportFormState.photos.push({id:uid(),src,originalName:file.name||'',originalSize:Number(file.size)||0,capturedAt:new Date(file.lastModified||Date.now()).toISOString()});}
      catch(error){console.error(error);toast(`Не удалось обработать ${file.name}`);}
    }
  }finally{processingPhotos=Math.max(0,processingPhotos-1);renderPhotoReportPhotos();queueDraft();toast('Обработка фото завершена');}
}
function renderPhotoReportPhotos(){
  const photos=photoReportFormState.photos||[];
  if(refs.photoReportPhotoCount)refs.photoReportPhotoCount.textContent=photos.length?`${photos.length} фото · порядок слева направо`:'Фотографий пока нет';
  refs.photoReportPhotoGrid.innerHTML=photos.map((p,i)=>`<div class="photo-thumb"><img src="${esc(p.src)}" alt="Фото ${i+1}"><span class="report-photo-index">${i+1}</span><button type="button" class="photo-save-button" data-report-photo-save="${i}" aria-label="Сохранить фото ${i+1} в Фото">↓ Фото</button><button type="button" class="photo-remove-button" data-report-photo-remove="${i}" aria-label="Удалить фото ${i+1}">×</button></div>`).join('');
  refs.photoReportPhotoGrid.querySelectorAll('[data-report-photo-remove]').forEach(btn=>btn.onclick=()=>{photoReportFormState.photos.splice(Number(btn.dataset.reportPhotoRemove),1);renderPhotoReportPhotos();queueDraft();});
  refs.photoReportPhotoGrid.querySelectorAll('[data-report-photo-save]').forEach(btn=>btn.onclick=()=>{const i=Number(btn.dataset.reportPhotoSave),p=photoReportFormState.photos[i];if(p?.src)saveImageToPhotos(p.src,`${refs.photoReportNumberInput.value||'Фотоотчёт'}_${i+1}`);});
}
async function duplicatePhotoReportCurrent(){
  refs.photoReportMoreDialog.close();const src=photoReportFromForm();if(!validatePhotoReport(src))return;
  const copy={...src,id:uid(),number:'',optionalFields:{...(src.optionalFields||{}),number:false},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photos:src.photos.map(p=>({...p,id:uid()}))};
  await dbReportPut(copy,{clearDraft:false});await refresh();openPhotoReportForm(copy.id);toast('Создана копия фотоотчёта');
}
function sharePhotoReportCurrentJson(){refs.photoReportMoreDialog.close();const r=photoReportFromForm();downloadJson(`${filenameSafe(r.number||'photo-report')}.json`,r);}

function openPicker(type){
  currentPicker=type;const custom=getCustom();
  if(type==='workSection'){refs.pickerTitle.textContent='Раздел работ';pickerItems=[{value:'__OFF__',label:'Откл'}].concat(WORK_SECTIONS.map(x=>({value:`${x.code} — ${x.name}`,label:x.code,sub:x.name})),(custom.workSection||[]).map(v=>({value:v,label:v})));
  }else if(type==='workType'){refs.pickerTitle.textContent='Вид работ';pickerItems=[{value:'__OFF__',label:'Откл'}].concat([...new Set([...WORK_TYPES,...(custom.workType||[])])].map(v=>({value:v,label:v})));
  }else if(type==='contractor'){refs.pickerTitle.textContent='Ответственная организация';pickerItems=[{value:'__OFF__',label:'Откл'},...OPTIONAL_ORGANIZATIONS.map(v=>({value:v,label:v}))];
  }else{refs.pickerTitle.textContent='Тип недостатка';pickerItems=[{value:'__OFF__',label:'Откл'}].concat([...new Set([...DEFECT_TYPES,...(custom.defectType||[])])].map(v=>({value:v,label:v})))}
  refs.pickerSearch.value='';refs.customValueInput.value='';refs.customValueRow.classList.toggle('hidden',type==='contractor');renderPickerList();refs.pickerDialog.showModal();setTimeout(()=>refs.pickerSearch.focus(),80);
}
function renderPickerList(){
  const q=refs.pickerSearch.value.trim().toLowerCase();
  const arr=pickerItems.filter(x=>`${x.label} ${x.sub||''}`.toLowerCase().includes(q));
  refs.pickerList.innerHTML=arr.map((x,i)=>`<button type="button" class="picker-option" data-index="${i}" data-value="${encodeURIComponent(x.value)}"><strong>${esc(x.label)}</strong>${x.sub?`<small>${esc(x.sub)}</small>`:''}</button>`).join('') || '<p class="field-hint">Ничего не найдено. Можно добавить свой вариант ниже.</p>';
  refs.pickerList.querySelectorAll('.picker-option').forEach(b=>b.onclick=()=>selectPicker(decodeURIComponent(b.dataset.value)));
}
function selectPicker(value){
  if(value==='__OFF__'){
    if(formState.optional&&Object.prototype.hasOwnProperty.call(formState.optional,currentPicker))formState.optional[currentPicker]=false;
    renderDefectOptionalUi();queueDraft();refs.pickerDialog.close();return;
  }
  if(currentPicker==='workType')refs.workTypeInput.value=value;
  else if(currentPicker==='contractor')refs.contractorInput.value=value;
  else formState[currentPicker]=value;
  if(formState.optional&&Object.prototype.hasOwnProperty.call(formState.optional,currentPicker))formState.optional[currentPicker]=true;
  queueDraft();renderDefectOptionalUi();refs.pickerDialog.close();
}
function addCustomPicker(){
  const v=refs.customValueInput.value.trim(); if(!v) return;
  if(currentPicker==='contractor')return;
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
  const countLabel=n=>`${n} ${n%10===1&&n%100!==11?'фото':'фото'}`;
  if(refs.photoBeforeCount)refs.photoBeforeCount.textContent=countLabel(formState.photosBefore.length);
  if(refs.photoAfterCount)refs.photoAfterCount.textContent=countLabel(formState.photosAfter.length);
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
    `РосКапСтрой V${APP_VERSION} · PDF diagnostics`,
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

async function exportPdfRecord(photo=false){
 if(pdfBusy||processingPhotos){toast('Дождитесь завершения текущей обработки');return;}
 const r=photo?photoRecordFromForm():recordFromForm();
 if(!(photo?validatePhotoRecord(r,{forPdf:true}):validateRecord(r,{forPdf:true})))return;
 pdfBusy=true;const button=photo?refs.photoPdfButton:refs.pdfButton;button.disabled=true;
 try{
  try{await flushDraft();}catch(error){console.warn('Draft flush before PDF failed',error);}
  toast('Формирую PDF…');
  if(!globalThis.PDFLib||!globalThis.fontkit||!globalThis.RksPdf)throw new Error('Модуль PDF не загружен. Закройте и снова откройте приложение.');
  const bytes=await RksPdf.build(r,photo);
  const name=`${photo?'Проверка':'Замечание'}_${filenameSafe(effectiveNumber(r)||'без_номера')}.pdf`;
  const artifact=preparePdfArtifact(bytes,name);
  if(!artifact.file)throw new Error('Не удалось подготовить PDF как системный файл.');
  const dialog=refs.pdfReadyDialog;
  refs.pdfReadyInfo.textContent=`${effectiveNumber(r)||'Без номера'} · ${Math.max(1,Math.round(artifact.blob.size/1024))} КБ`;
  refs.pdfShare.hidden=false;
  refs.pdfShare.textContent='Сохранить PDF';
  refs.pdfDownload.hidden=false;
  refs.pdfDownload.textContent='Скачать как файл';
  refs.pdfOpen.hidden=false;
  refs.pdfOpen.textContent='Открыть документ';
  refs.pdfShare.onclick=()=>savePdfPrimary(artifact);
  refs.pdfDownload.onclick=()=>downloadPdfFallback(artifact);
  refs.pdfOpen.onclick=()=>previewPdfFile(artifact);
  if(refs.pdfDiagnosticsCopy)refs.pdfDiagnosticsCopy.onclick=copyPdfDiagnostics;
  if(dialog.open)dialog.close();
  dialog.showModal();
 }catch(e){
  console.error('PDF export failed',e);
  updatePdfDiagnostics({generated:false,lastAction:'Ошибка формирования PDF',lastError:`${e?.name||'Error'}${e?.message?' — '+e.message:''}`});
  const message=e?.message||String(e||'Неизвестная ошибка');
  toast(`Не удалось создать PDF: ${message}`);
 }
 finally{pdfBusy=false;button.disabled=false;}
}
function makePdf(){return exportPdfRecord(false);}
function makePhotoPdf(){return exportPdfRecord(true);}
async function makePhotoReportPdf(){
 if(pdfBusy||processingPhotos){toast('Дождитесь завершения текущей обработки');return;}
 const r=photoReportFromForm();if(!validatePhotoReport(r,{forPdf:true}))return;
 pdfBusy=true;const button=refs.photoReportPdfButton;button.disabled=true;
 try{
  try{await flushDraft();}catch(error){console.warn('Draft flush before PDF failed',error);}
  toast('Формирую PDF…');
  if(!globalThis.PDFLib||!globalThis.fontkit||!globalThis.RksPdf?.buildPhotoReport)throw new Error('Модуль PDF фотоотчёта не загружен. Закройте и снова откройте приложение.');
  const bytes=await RksPdf.buildPhotoReport(r);
  const name=`Фотоотчёт_${filenameSafe(effectiveNumber(r)||'без_номера')}.pdf`;
  const artifact=preparePdfArtifact(bytes,name);
  if(!artifact.file)throw new Error('Не удалось подготовить PDF как системный файл.');
  refs.pdfReadyInfo.textContent=`${effectiveNumber(r)||'Без номера'} · ${Math.max(1,Math.round(artifact.blob.size/1024))} КБ`;
  refs.pdfShare.hidden=false;refs.pdfShare.textContent='Сохранить PDF';
  refs.pdfDownload.hidden=false;refs.pdfDownload.textContent='Скачать как файл';
  refs.pdfOpen.hidden=false;refs.pdfOpen.textContent='Открыть документ';
  refs.pdfShare.onclick=()=>savePdfPrimary(artifact);refs.pdfDownload.onclick=()=>downloadPdfFallback(artifact);refs.pdfOpen.onclick=()=>previewPdfFile(artifact);
  if(refs.pdfDiagnosticsCopy)refs.pdfDiagnosticsCopy.onclick=copyPdfDiagnostics;
  if(refs.pdfReadyDialog.open)refs.pdfReadyDialog.close();refs.pdfReadyDialog.showModal();
 }catch(e){console.error('Photo report PDF export failed',e);updatePdfDiagnostics({generated:false,lastAction:'Ошибка формирования PDF фотоотчёта',lastError:`${e?.name||'Error'}${e?.message?' — '+e.message:''}`});toast(`Не удалось создать PDF: ${e?.message||String(e||'Неизвестная ошибка')}`);}
 finally{pdfBusy=false;button.disabled=false;}
}

function openNormalPdfUrl(url){
  const w=window.open(url,'_blank','noopener');
  if(!w){
    const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),250);
  }
}
function safePdfDownloadName(artifact){
  const raw=String(artifact?.name||'RKS.pdf');
  const m=raw.match(/((?:РКС|ФК|ФО|RKS|FK|FO)[-_ ]?\d+)/i);
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
  const copy={...src,id:uid(),number:'',optionalFields:{...(src.optionalFields||{}),number:false},createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),photosBefore:[...src.photosBefore],photosAfter:[...src.photosAfter],ntd:src.ntd.map(x=>({...x}))};
  await dbPut(copy,{clearDraft:false}); await refresh(); openForm(copy.id); toast('Создана копия замечания');
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
function downloadBlob(name,blob){ const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},60000); }
function downloadJson(name,obj){ downloadBlob(name,new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})); }
function shareCurrentJson(){ refs.moreDialog.close(); const r=recordFromForm(); downloadJson(`${filenameSafe(r.number||'remark')}.json`,r); }

function formatBytes(bytes){
 const n=Number(bytes)||0;if(n<1024)return `${n} Б`;if(n<1024*1024)return `${(n/1024).toFixed(n<10240?1:0)} КБ`;if(n<1024*1024*1024)return `${(n/1024/1024).toFixed(n<10*1024*1024?1:0)} МБ`;return `${(n/1024/1024/1024).toFixed(1)} ГБ`;
}

// --- Import of bot-generated .rkszip remark packages ---
let pendingRksImport=null;
function rksString(value){return typeof value==='string'?value.trim():'';}
function rksArray(value){return Array.isArray(value)?value:[];}
function rksSafePath(path){
 const value=String(path||'').trim();
 if(!value||value.startsWith('/')||value.startsWith('\\')||/^[a-z]:[\\/]/i.test(value)||value.includes('..')||value.includes('\\'))return false;
 return value.split('/').every(part=>part&&part!=='.'&&part!=='..');
}
function rksIsoDate(value){
 const raw=rksString(value);const m=raw.match(/^(\d{4}-\d{2}-\d{2})/);if(!m)return today();
 const d=new Date(`${m[1]}T00:00:00`);return Number.isNaN(d.getTime())?today():m[1];
}
function rksDateTime(value){
 if(!value)return 'дата не указана';
 try{const d=new Date(value);if(Number.isNaN(d.getTime()))return String(value);return new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium',timeStyle:'short'}).format(d);}catch{return String(value);}
}
function rksImportSource(manifest,record){
 return rksString(manifest?.source?.name)||rksString(record?.sourceMetadata?.origin)||rksString(manifest?.source?.type)||'rkszip';
}
function rksPhotoPaths(record){return [...rksArray(record?.photosBefore),...rksArray(record?.photosAfter)].map(String);}
function rksEntrySize(entry){return Number(entry?._data?.uncompressedSize||entry?._data?.compressedSize||0)||0;}
function rksNormalizeZipName(name){
 return String(name||'').replace(/\\/g,'/').replace(/^\.\//,'').replace(/^\/+/, '').replace(/\/{2,}/g,'/');
}
function rksFindZipEntry(zip,wanted,{allowNested=false,rootPrefix=''}={}){
 const target=rksNormalizeZipName(wanted);
 const withRoot=rksNormalizeZipName(`${rootPrefix||''}${target}`);
 const entries=Object.entries(zip?.files||{}).filter(([,entry])=>entry&&!entry.dir);
 const exact=entries.find(([name])=>rksNormalizeZipName(name).toLowerCase()===withRoot.toLowerCase());
 if(exact)return {name:exact[0],entry:exact[1]};
 const plain=entries.find(([name])=>rksNormalizeZipName(name).toLowerCase()===target.toLowerCase());
 if(plain)return {name:plain[0],entry:plain[1]};
 if(!allowNested)return null;
 const basename=target.split('/').pop().toLowerCase();
 const matches=entries.filter(([name])=>{
  const normalized=rksNormalizeZipName(name);
  if(normalized.startsWith('__MACOSX/'))return false;
  return normalized.split('/').pop().toLowerCase()===basename;
 }).sort((a,b)=>rksNormalizeZipName(a[0]).split('/').length-rksNormalizeZipName(b[0]).split('/').length);
 return matches.length?{name:matches[0][0],entry:matches[0][1]}:null;
}
function rksZipRootPrefix(manifestName){
 const normalized=rksNormalizeZipName(manifestName);
 const slash=normalized.lastIndexOf('/');
 return slash>=0?normalized.slice(0,slash+1):'';
}
function validateRksRecord(record,index){
 const label=`Запись ${index+1}`;
 if(!record||typeof record!=='object'||Array.isArray(record))throw new Error(`${label}: некорректная структура`);
 const externalId=rksString(record.externalId);if(!externalId)throw new Error(`${label}: отсутствует externalId`);
 if(record.object!=null&&(typeof record.object!=='object'||Array.isArray(record.object)))throw new Error(`${label}: поле object имеет неверный формат`);
 for(const key of ['location','workSection','workType','defectType','contractor','description','remediation','capturedAt'])if(record[key]!=null&&typeof record[key]!=='string')throw new Error(`${label}: поле ${key} должно быть строкой`);
 if(record.object){for(const key of ['gp','name'])if(record.object[key]!=null&&typeof record.object[key]!=='string')throw new Error(`${label}: object.${key} должно быть строкой`);}
 for(const key of ['ntd','workingDocumentation','photosBefore','photosAfter'])if(record[key]!=null&&!Array.isArray(record[key]))throw new Error(`${label}: поле ${key} должно быть массивом`);
 for(const [i,item] of rksArray(record.ntd).entries()){
  if(!item||typeof item!=='object'||Array.isArray(item)||typeof (item.document??'')!=='string'||typeof (item.clauses??'')!=='string')throw new Error(`${label}: некорректная запись НТД ${i+1}`);
 }
 for(const [i,item] of rksArray(record.workingDocumentation).entries()){
  if(!item||typeof item!=='object'||Array.isArray(item)||typeof (item.document??'')!=='string'||typeof (item.sheets??'')!=='string')throw new Error(`${label}: некорректная запись РД ${i+1}`);
 }
 for(const path of rksPhotoPaths(record))if(!rksSafePath(path))throw new Error(`${label}: небезопасный путь фотографии`);
 return externalId;
}
function validateRksManifest(manifest,zip,rootPrefix=''){
 if(!manifest||typeof manifest!=='object'||Array.isArray(manifest))throw new Error('manifest.json имеет неверную структуру');
 if(manifest.format!==RKS_IMPORT_FORMAT)throw new Error('Формат файла не поддерживается');
 if(Number(manifest.version)!==RKS_IMPORT_VERSION)throw new Error(`Версия файла ${manifest.version??'не указана'} не поддерживается этой версией РосКапСтрой`);
 if(!Array.isArray(manifest.records)||!manifest.records.length)throw new Error('В архиве нет замечаний');
 if(manifest.records.length>RKS_IMPORT_LIMITS.records)throw new Error(`В пакете больше ${RKS_IMPORT_LIMITS.records} замечаний`);
 const seen=new Set();let photoCount=0,expanded=0;
 for(const [path,entry] of Object.entries(zip.files||{})){
  const checkedPath=entry.dir?String(path||'').replace(/\/+$/,''):path;
  if(!rksSafePath(checkedPath))throw new Error(`Небезопасный путь внутри архива: ${path}`);
  if(entry.dir)continue;expanded+=rksEntrySize(entry);if(expanded>RKS_IMPORT_LIMITS.expandedBytes)throw new Error('Распакованный пакет слишком большой для безопасной обработки');
 }
 manifest.records.forEach((record,index)=>{
  const externalId=validateRksRecord(record,index);if(seen.has(externalId))throw new Error(`Повторяющийся externalId в пакете: ${externalId}`);seen.add(externalId);
  for(const path of rksPhotoPaths(record)){
   photoCount++;if(photoCount>RKS_IMPORT_LIMITS.photos)throw new Error(`В пакете больше ${RKS_IMPORT_LIMITS.photos} фотографий`);
   const found=rksFindZipEntry(zip,path,{rootPrefix});const entry=found?.entry;if(!entry||entry.dir)throw new Error(`Не найдена фотография ${path}`);
   const size=rksEntrySize(entry);if(size>RKS_IMPORT_LIMITS.photoBytes)throw new Error(`Фотография ${path} слишком большая`);
   if(!/\.(jpe?g|png|webp)$/i.test(path))throw new Error(`Неподдерживаемый тип фотографии: ${path}`);
  }
 });
 return {manifest,photoCount};
}
function sniffRksImageMime(bytes,path=''){
 if(bytes?.length>=3&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return 'image/jpeg';
 if(bytes?.length>=8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47&&bytes[4]===0x0d&&bytes[5]===0x0a&&bytes[6]===0x1a&&bytes[7]===0x0a)return 'image/png';
 if(bytes?.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return 'image/webp';
 throw new Error(`Файл ${path||'изображения'} не является поддерживаемой фотографией`);
}
function findImportedDefect(externalId,list=defects){return list.find(d=>rksString(d.importExternalId)===externalId)||null;}
function countRksRecordPhotos(record){return rksArray(record.photosBefore).length+rksArray(record.photosAfter).length;}
function rksPreviewFields(record){
 const object=[rksString(record?.object?.gp),rksString(record?.object?.name)].filter(Boolean).join(' — ');
 return [
  ['Объект',object],['Место',rksString(record.location)],['Раздел',rksString(record.workSection)],['Вид работ',rksString(record.workType)],['Тип',rksString(record.defectType)],['Подрядчик',rksString(record.contractor)],['НТД',rksArray(record.ntd).length?`${rksArray(record.ntd).length} поз.`:''],['Фото',String(countRksRecordPhotos(record))]
 ].filter(([,v])=>v);
}
function renderRksImportPreview(pkg){
 refs.rksImportFileMeta.textContent=`${pkg.file.name} • ${formatBytes(pkg.file.size)} • ${rksImportSource(pkg.manifest,pkg.manifest.records[0])} • ${rksDateTime(pkg.manifest.createdAt)}`;
 refs.rksImportRecordCount.textContent=pkg.records.length;refs.rksImportPhotoCount.textContent=pkg.photoCount;refs.rksImportDuplicateCount.textContent=pkg.records.filter(x=>x.duplicate).length;
 refs.rksImportPreviewList.innerHTML=pkg.records.map((item,i)=>{
  const r=item.record,fields=rksPreviewFields(r),dup=item.duplicate;
  return `<article class="rks-import-preview-card${dup?' duplicate':''}">
   <div class="rks-import-preview-top"><div class="rks-import-preview-title"><strong>Замечание ${i+1}</strong><small>${esc(r.externalId)}</small></div><span class="rks-import-preview-badge">${dup?`Уже импортировано · ${esc(dup.number||'')}`:'Готово к импорту'}</span></div>
   <div class="rks-import-preview-fields">${fields.map(([k,v])=>`<div class="rks-import-preview-line"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join('')}</div>
   ${rksString(r.description)?`<p class="rks-import-preview-description">${esc(r.description)}</p>`:''}
   ${dup?`<button type="button" class="rks-import-open-existing" data-rks-open-existing="${esc(dup.id)}">Открыть ${esc(dup.number||'карточку')}</button>`:''}
  </article>`;
 }).join('');
 refs.rksImportPreviewList.querySelectorAll('[data-rks-open-existing]').forEach(button=>button.onclick=()=>{const id=button.dataset.rksOpenExisting;refs.rksImportDialog.close();pendingRksImport=null;openForm(id);});
 const importable=pkg.records.filter(x=>!x.duplicate).length;
 refs.confirmRksImportButton.disabled=!importable;refs.confirmRksImportButton.textContent=importable?`Импортировать ${importable===1?'замечание':`${importable} замечания`}`:'Все записи уже импортированы';
 refs.cancelRksImportButton.textContent='Отмена';refs.rksImportProgress.classList.add('hidden');refs.rksImportWarning.classList.add('hidden');refs.rksImportWarning.textContent='';
}
async function readRksZip(file){
 if(!file)throw new Error('Файл не выбран');
 if(file.size>RKS_IMPORT_LIMITS.fileBytes)throw new Error(`Файл больше ${formatBytes(RKS_IMPORT_LIMITS.fileBytes)} и не может быть безопасно обработан на мобильном устройстве`);
 if(typeof JSZip==='undefined')throw new Error('Модуль распаковки .rkszip не загружен');
 let zip;try{zip=await JSZip.loadAsync(file);}catch{throw new Error('Файл не является корректным ZIP/RKSZIP архивом');}
 const manifestFound=rksFindZipEntry(zip,'manifest.json',{allowNested:true});
 if(!manifestFound){
  const names=Object.keys(zip.files||{}).map(rksNormalizeZipName).filter(Boolean).filter(n=>!n.startsWith('__MACOSX/')).slice(0,8);
  const details=names.length?` Найдено в архиве: ${names.join(', ')}`:'';
  throw new Error(`Не найден manifest.json в архиве.${details}`);
 }
 const manifestEntry=manifestFound.entry;
 const rootPrefix=rksZipRootPrefix(manifestFound.name);
 let manifest;try{
  const manifestBytes=await manifestEntry.async('uint8array');
  let manifestText;if(typeof TextDecoder!=='undefined')manifestText=new TextDecoder('utf-8',{fatal:true}).decode(manifestBytes);else manifestText=await manifestEntry.async('string');
  manifestText=manifestText.replace(/^\uFEFF/,'');
  manifest=JSON.parse(manifestText);
 }catch{throw new Error('manifest.json повреждён, имеет неверную кодировку или не является корректным JSON');}
 const checked=validateRksManifest(manifest,zip,rootPrefix);
 const current=await dbAll();
 const records=manifest.records.map(record=>({record,duplicate:findImportedDefect(rksString(record.externalId),current)}));
 return {file,zip,manifest,records,photoCount:checked.photoCount,rootPrefix};
}
async function importRksZip(file){
 try{
  refs.importRksZipInput.disabled=true;toast('Проверяю пакет замечаний…');
  const pkg=await readRksZip(file);pendingRksImport=pkg;renderRksImportPreview(pkg);refs.rksImportDialog.showModal();
 }catch(error){pendingRksImport=null;console.error('RKSZIP validation failed',error);toast(error?.message||'Не удалось проверить пакет замечаний');}
 finally{refs.importRksZipInput.disabled=false;}
}
function mapImportedWorkSection(value){
 const raw=rksString(value);if(!raw)return '';
 const code=raw.split(/\s+[—–-]\s+/)[0].trim().toUpperCase();const found=WORK_SECTIONS.find(x=>x.code.toUpperCase()===code);return found?`${found.code} — ${found.name}`:raw;
}
function mapImportedDefectType(value){
 const raw=rksString(value);if(!raw)return '';
 const aliases={
  'Несоответствие РД':'Несоответствие рабочей документации','Нарушение НТД':'Нарушение требований НТД','Отсутствие маркировки':'Отсутствие / нарушение маркировки','Нарушение заземления':'Заземление и защитные меры','Кабельные линии':'Кабельные линии и трассы','Нарушение пожарной безопасности':'Пожарная безопасность','Нарушение требований взрывозащиты':'Взрывозащита','Неполнота документации':'Комплектность / оформление ИД','Повреждение':'Повреждение оборудования или материала','Несогласованное отклонение':'Отступление без согласования'
 };return aliases[raw]||raw;
}
function importedWorkingDoc(items){return rksArray(items).map(x=>{const doc=rksString(x?.document),sheets=rksString(x?.sheets);return [doc,sheets].filter(Boolean).join(' — ');}).filter(Boolean).join('; ');}
function mapImportedNtd(items){return rksArray(items).map(x=>({name:rksString(x?.document),clause:rksString(x?.clauses)})).filter(x=>x.name||x.clause);}
async function prepareImportedPhoto(zip,path,rootPrefix=''){
 const found=rksFindZipEntry(zip,path,{rootPrefix});const entry=found?.entry;if(!entry||entry.dir)throw new Error(`Не найдена фотография ${path}`);
 const bytes=await entry.async('uint8array');if(!bytes.length)throw new Error(`Фотография ${path} имеет нулевой размер`);if(bytes.length>RKS_IMPORT_LIMITS.photoBytes)throw new Error(`Фотография ${path} слишком большая`);
 const mime=sniffRksImageMime(bytes,path);const file=new File([bytes],path.split('/').pop()||'photo.jpg',{type:mime,lastModified:Date.now()});
 try{return await compressFile(file);}catch(error){throw new Error(`Не удалось декодировать фотографию ${path}`);}
}
async function prepareImportedPhotos(zip,record,onProgress=()=>{},rootPrefix=''){
 const before=[],after=[];const paths=[...rksArray(record.photosBefore).map(path=>({path:String(path),target:before})),...rksArray(record.photosAfter).map(path=>({path:String(path),target:after}))];
 let done=0;for(const item of paths){item.target.push(await prepareImportedPhoto(zip,item.path,rootPrefix));done++;onProgress(done,paths.length,item.path);}return {before,after};
}
function mapImportedDefect(record,number,photos,manifest){
 const now=new Date().toISOString(),gp=rksString(record?.object?.gp),name=rksString(record?.object?.name),source=rksImportSource(manifest,record),captured=rksString(record.capturedAt);
 return {
  id:uid(),number:'',date:rksIsoDate(captured),status:'',object:objectDisplay({gp,name}),objectGp:gp,objectName:name,location:rksString(record.location),workSection:mapImportedWorkSection(record.workSection),workType:rksString(record.workType),defectType:mapImportedDefectType(record.defectType),workingDoc:importedWorkingDoc(record.workingDocumentation),photosBefore:photos.before,photosAfter:photos.after,perPage:'2',description:rksString(record.description),remedy:rksString(record.remediation),ntd:mapImportedNtd(record.ntd),dueDate:'',signDate:'',contractor:rksString(record.contractor),issuer:'',optionalFields:{number:false,status:false,workSection:Boolean(rksString(record.workSection)),workType:Boolean(rksString(record.workType)),defectType:Boolean(rksString(record.defectType)),contractor:Boolean(rksString(record.contractor)),dueDate:false,signDate:false,issuer:false},createdAt:captured&&!Number.isNaN(Date.parse(captured))?captured:now,updatedAt:now,importExternalId:rksString(record.externalId),importedAt:now,importSource:source,importManifestCreatedAt:rksString(manifest.createdAt),importSourceMetadata:record.sourceMetadata&&typeof record.sourceMetadata==='object'?{...record.sourceMetadata}:{}
 };
}
function setRksImportProgress(current,total,text){
 refs.rksImportProgress.classList.remove('hidden');refs.rksImportProgressBar.max=Math.max(1,total);refs.rksImportProgressBar.value=Math.min(current,total);refs.rksImportProgressText.textContent=text||`${current} из ${total}`;
}
async function performRksImport(){
 if(!pendingRksImport)return;const pkg=pendingRksImport;
 refs.confirmRksImportButton.disabled=true;refs.cancelRksImportButton.disabled=true;refs.rksImportWarning.classList.add('hidden');refs.rksImportWarning.textContent='';
 const created=[],errors=[];let duplicates=0;
 try{
  await flushDraft();
  const fresh=await dbAll();defects=fresh.map(record=>({...record,number:normalizeNumber(record.number)})).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));
  const draft=await dbDraftGet('defect');if(draft?.record?.number)reservedDefectNumber=Math.max(reservedDefectNumber,numberValue(draft.record.number));
  const total=pkg.records.length;let index=0;
  for(const item of pkg.records){
   index++;const externalId=rksString(item.record.externalId);const duplicate=findImportedDefect(externalId,defects);
   if(duplicate){duplicates++;setRksImportProgress(index,total,`Пропущен дубликат ${index} из ${total}`);continue;}
   try{
    setRksImportProgress(index-1,total,`Подготовка ${index} из ${total}`);
    const photos=await prepareImportedPhotos(pkg.zip,item.record,(done,count)=>{refs.rksImportProgressText.textContent=count?`Фото ${done} из ${count} · запись ${index} из ${total}`:`Запись ${index} из ${total}`;},pkg.rootPrefix||'');
    const entity=mapImportedDefect(item.record,'',photos,pkg.manifest);
    await dbPut(entity,{clearDraft:false});defects.push(entity);defects.sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||''));created.push(entity.id);setRksImportProgress(index,total,`Импортировано ${index} из ${total}`);
   }catch(error){console.error('RKSZIP record import failed',externalId,error);errors.push({index,externalId,error:error?.message||String(error)});setRksImportProgress(index,total,`Ошибка в записи ${index}`);}
  }
  await refresh();await refreshDataSummary();
  if(errors.length){
   refs.rksImportWarning.innerHTML=`<strong>Импорт завершён частично.</strong><br>Создано: ${created.length}<br>Пропущено дубликатов: ${duplicates}<br>Ошибок: ${errors.length}<br>${errors.slice(0,5).map(x=>`${x.index} — ${esc(x.error)}`).join('<br>')}`;refs.rksImportWarning.classList.remove('hidden');refs.confirmRksImportButton.textContent='Импорт завершён';refs.cancelRksImportButton.textContent='Закрыть';refs.cancelRksImportButton.disabled=false;pendingRksImport=null;return;
  }
  refs.rksImportDialog.close();pendingRksImport=null;refs.cancelRksImportButton.disabled=false;
  if(created.length===1){openForm(created[0]);toast('Замечание импортировано ✓');}
  else if(created.length>1){openModuleJournal('defects');toast(`Импортировано замечаний: ${created.length}`);}
  else{toast(duplicates?'Все замечания уже были импортированы':'Новых замечаний не найдено');}
 }catch(error){console.error('RKSZIP import failed',error);refs.rksImportWarning.textContent=`Импорт остановлен: ${error?.message||'ошибка хранилища'}`;refs.rksImportWarning.classList.remove('hidden');refs.cancelRksImportButton.disabled=false;}
 finally{if(pendingRksImport)refs.confirmRksImportButton.disabled=false;}
}
function countBackupPhotos(data){
 return (data.defects||[]).reduce((n,r)=>n+(r.photosBefore||[]).length+(r.photosAfter||[]).length,0)+(data.photoRecords||[]).reduce((n,r)=>n+(r.photos||[]).length,0)+(data.photoReports||[]).reduce((n,r)=>n+(r.photos||[]).length,0);
}
function backupRecordCount(data){return (data.defects||[]).length+(data.photoRecords||[]).length+(data.photoReports||[]).length;}
async function collectBackupData(){
 await flushDraft();
 const defectsData=await dbAll();
 const checksData=(await dbPhotoAll()).map(({checklist,...record})=>record);
 const reportsData=await dbReportAll();
 return {kind:'RosKapStroyBackup',schema:BACKUP_SCHEMA,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),defects:defectsData,photoRecords:checksData,photoReports:reportsData,settings:loadSettings(),custom:getCustom(),objects:getObjects(),stats:{records:defectsData.length+checksData.length+reportsData.length,photos:defectsData.reduce((n,r)=>n+(r.photosBefore||[]).length+(r.photosAfter||[]).length,0)+checksData.reduce((n,r)=>n+(r.photos||[]).length,0)+reportsData.reduce((n,r)=>n+(r.photos||[]).length,0)}};
}
function backupFilename(prefix='RosKapStroy_backup'){
 const d=new Date();const stamp=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}-${String(d.getMinutes()).padStart(2,'0')}`;
 return `${prefix}_${stamp}.json`;
}
async function createBackupArtifact(){
 const payload=await collectBackupData();
 const text=JSON.stringify(payload,null,2);
 return {payload,text,blob:new Blob([text],{type:'application/json'}),name:backupFilename()};
}
async function exportBackup({silent=false,prefix='RosKapStroy_backup'}={}){
 try{
  const artifact=await createBackupArtifact();artifact.name=backupFilename(prefix);downloadBlob(artifact.name,artifact.blob);
  const meta={exportedAt:artifact.payload.exportedAt,size:artifact.blob.size,records:backupRecordCount(artifact.payload),photos:countBackupPhotos(artifact.payload)};localStorage.setItem(BACKUP_META_KEY,JSON.stringify(meta));
  await refreshDataSummary();if(!silent)toast(`Резервная копия создана • ${formatBytes(artifact.blob.size)}`);return artifact;
 }catch(e){console.error(e);toast(`Не удалось выгрузить данные: ${e.message||'ошибка памяти'}`);throw e;}
}
function csvCell(value){const s=String(value??'').replace(/\r?\n/g,' ').trim();return /[;"\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;}
function csvRow(values){return values.map(csvCell).join(';');}
async function exportRegistryCsv(){
 try{
  await flushDraft();const d=await dbAll(),c=await dbPhotoAll(),r=await dbReportAll();
  const rows=[['Тип','Номер','Дата','Статус / результат','№ ГП','Объект','Место','Раздел','Вид работ / контроля','Подрядчик','Описание','Рабочая документация','НТД','Срок','Фото']];
  d.forEach(x=>rows.push(['Замечание',normalizeNumber(x.number),x.date,x.status,x.objectGp,x.objectName||x.object,x.location,x.workSection,x.workType,x.contractor,x.description,x.workingDoc,(x.ntd||[]).map(n=>[n.name,n.clause].filter(Boolean).join(' ')).join(' | '),x.dueDate,(x.photosBefore||[]).length+(x.photosAfter||[]).length]));
  c.forEach(x=>rows.push(['Проверка',normalizeNumber(x.number),x.date,x.result,x.objectGp,x.objectName||x.object,x.location,x.workSection,x.controlType||x.workType,x.contractor,x.description,x.workingDoc,'','',(x.photos||[]).length]));
  r.forEach(x=>rows.push(['Фотоотчёт',normalizePhotoReportNumber(x.number),x.date,'','','','','',`Фото на лист: ${x.perPage||2}`,'',x.description,'','','',(x.photos||[]).length]));
  const text='\ufeff'+rows.map(csvRow).join('\r\n');downloadBlob(`RosKapStroy_registry_${today()}.csv`,new Blob([text],{type:'text/csv;charset=utf-8'}));toast(`Реестр выгружен • ${rows.length-1} записей`);
 }catch(e){console.error(e);toast('Не удалось выгрузить реестр');}
}
function exportObjects(){
 const rows=[['№ по ГП','Наименование объекта'],...getObjects().map(x=>[x.gp,x.name])];
 const text='\ufeff'+rows.map(csvRow).join('\r\n');downloadBlob(`RosKapStroy_objects_${today()}.csv`,new Blob([text],{type:'text/csv;charset=utf-8'}));toast(`Справочник выгружен • ${rows.length-1} объектов`);
}
function parseBackupDate(value){try{return new Intl.DateTimeFormat('ru-RU',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}catch{return value||'дата не указана';}}
let pendingBackupImport=null;
async function importBackup(file){
 try{
  if(!file) return;if(file.size>350*1024*1024)throw new Error('Файл слишком большой для безопасной загрузки на мобильном устройстве');
  const raw=await file.text();let parsed;try{parsed=JSON.parse(raw);}catch{throw new Error('Файл не является корректным JSON');}
  const data=assertBackup(parsed);
  pendingBackupImport={file,data};
  refs.importBackupFileMeta.textContent=`${file.name} • ${formatBytes(file.size)} • копия от ${parseBackupDate(data.exportedAt)}`;
  refs.importDefectCount.textContent=data.defects.length;refs.importCheckCount.textContent=(data.photoRecords||[]).length;refs.importReportCount.textContent=(data.photoReports||[]).length;refs.importPhotoCount.textContent=countBackupPhotos(data);
  refs.importBackupWarning.classList.add('hidden');refs.importBackupWarning.textContent='';
  const mergeRadio=document.querySelector('input[name="backupImportMode"][value="merge"]');if(mergeRadio)mergeRadio.checked=true;updateImportModeUi();
  refs.importBackupDialog.showModal();
 }catch(e){pendingBackupImport=null;console.error(e);toast(`Файл не загружен: ${e.message||'неподдерживаемый формат'}`);}
}
function recordTimestamp(r){const t=Date.parse(r?.updatedAt||r?.createdAt||r?.date||'');return Number.isFinite(t)?t:0;}
function normalizeImportedCollection(items,type){
 return (items||[]).map(r=>{const base={...r};if(type==='defect')base.number=normalizeNumber(r.number);else if(type==='photo')base.number=normalizeNumber(r.number);else{base.number=normalizePhotoReportNumber(r.number);base.perPage=String(r.perPage||'2');}if(type==='photo')delete base.checklist;return base;});
}
function mergeRecordCollections(current,incoming,type){
 const prefix='РКС';const format=formatNumber;
 const result=current.map(x=>({...x}));const byId=new Map(result.map((x,i)=>[x.id,i]));const used=new Map(result.map((x,i)=>[effectiveNumber(x).toLowerCase(),i]).filter(([key])=>key));let max=Math.max(0,...result.map(x=>numberValue(effectiveNumber(x))));let added=0,updated=0,renumbered=0,skipped=0;
 for(const raw of normalizeImportedCollection(incoming,type)){
  const rec={...raw};const idIndex=byId.get(rec.id);let key=effectiveNumber(rec).toLowerCase();
  if(idIndex!=null){
    if(recordTimestamp(rec)>recordTimestamp(result[idIndex])){
      const oldKey=effectiveNumber(result[idIndex]).toLowerCase();if(oldKey)used.delete(oldKey);
      const other=key?used.get(key):null;if(other!=null&&other!==idIndex){max++;rec.number=format(max);rec.optionalFields={...(rec.optionalFields||{}),number:true};key=rec.number.toLowerCase();renumbered++;}
      result[idIndex]=rec;if(key)used.set(key,idIndex);updated++;
    }else skipped++;continue;
  }
  if(key&&used.has(key)){max++;rec.number=format(max);rec.optionalFields={...(rec.optionalFields||{}),number:true};key=rec.number.toLowerCase();renumbered++;}
  else if(key)max=Math.max(max,numberValue(rec.number));
  const idx=result.length;result.push(rec);byId.set(rec.id,idx);if(key)used.set(key,idx);added++;
 }
 return {records:result,stats:{added,updated,renumbered,skipped,prefix}};
}
function mergeStringLists(a=[],b=[]){return [...new Set([...(Array.isArray(a)?a:[]),...(Array.isArray(b)?b:[])].map(x=>String(x||'').trim()).filter(Boolean))];}
function mergeCustomData(current={},incoming={}){const keys=new Set([...Object.keys(current||{}),...Object.keys(incoming||{})]);const out={};for(const key of keys)out[key]=mergeStringLists(current?.[key],incoming?.[key]);return out;}
function mergeObjectLists(a=[],b=[]){const map=new Map();for(const x of [...a,...b]){const n=normalizeObjectEntry(x);if(n)map.set(`${String(n.gp).toLowerCase()}|${String(n.name).toLowerCase()}`,n);}return [...map.values()];}
async function performBackupImport(){
 if(!pendingBackupImport)return;const data=pendingBackupImport.data;const mode=document.querySelector('input[name="backupImportMode"]:checked')?.value||'merge';
 refs.confirmBackupImportButton.disabled=true;refs.confirmBackupImportButton.textContent='Загрузка…';
 try{
  await flushDraft();
  if(mode==='replace'&&refs.preImportBackupToggle.checked)await exportBackup({silent:true,prefix:'RosKapStroy_before_import'});
  let nextDefects,nextChecks,nextReports,nextSettings,nextCustom,nextObjects,summary='';
  if(mode==='replace'){
   nextDefects=normalizeImportedCollection(data.defects,'defect');nextChecks=normalizeImportedCollection(data.photoRecords||[],'photo');nextReports=normalizeImportedCollection(data.photoReports||[],'report');nextSettings=data.settings||loadSettings();nextCustom=data.custom||getCustom();nextObjects=(data.objects||getObjects()).map(normalizeObjectEntry).filter(Boolean);summary=`Восстановлено ${nextDefects.length+nextChecks.length+nextReports.length} записей`;
  }else{
   const md=mergeRecordCollections(await dbAll(),data.defects,'defect'),mc=mergeRecordCollections(await dbPhotoAll(),data.photoRecords||[],'photo'),mr=mergeRecordCollections(await dbReportAll(),data.photoReports||[],'report');
   nextDefects=md.records;nextChecks=mc.records;nextReports=mr.records;nextSettings=loadSettings();nextCustom=mergeCustomData(getCustom(),data.custom||{});nextObjects=mergeObjectLists(getObjects(),data.objects||[]);const s=[md.stats,mc.stats,mr.stats];summary=`Добавлено ${s.reduce((n,x)=>n+x.added,0)}, обновлено ${s.reduce((n,x)=>n+x.updated,0)}`;const ren=s.reduce((n,x)=>n+x.renumbered,0);if(ren)summary+=`, перенумеровано ${ren}`;
  }
  await writeTransaction([STORE,PHOTO_STORE,REPORT_STORE,DRAFT_STORE,META_STORE],tx=>{const ds=tx.objectStore(STORE),ps=tx.objectStore(PHOTO_STORE),rs=tx.objectStore(REPORT_STORE);ds.clear();ps.clear();rs.clear();if(mode==='replace')tx.objectStore(DRAFT_STORE).clear();for(const x of nextDefects)ds.put(x);for(const x of nextChecks)ps.put(x);for(const x of nextReports)rs.put(x);tx.objectStore(META_STORE).put({id:'preferences',settings:nextSettings,custom:nextCustom,objects:nextObjects});});
  activeForm=null;await restorePreferences();applySettings(loadSettings());await refresh();await refreshDataSummary();refs.importBackupDialog.close();pendingBackupImport=null;showView('mainView');toast(summary);
 }catch(e){console.error(e);refs.importBackupWarning.textContent=`Импорт остановлен. Текущие данные не должны быть изменены частично: ${e.message||'ошибка хранилища'}`;refs.importBackupWarning.classList.remove('hidden');}
 finally{refs.confirmBackupImportButton.disabled=false;refs.confirmBackupImportButton.textContent='Загрузить данные';}
}
function updateImportModeUi(){const mode=document.querySelector('input[name="backupImportMode"]:checked')?.value||'merge';refs.preImportBackupRow.classList.toggle('hidden',mode!=='replace');document.querySelectorAll('.import-mode-option').forEach(x=>x.classList.toggle('selected',Boolean(x.querySelector('input:checked'))));}
async function refreshDataSummary(){
 if(!db||!refs.dataRecordCount)return;
 try{const [d,c,r]=await Promise.all([dbAll(),dbPhotoAll(),dbReportAll()]);refs.dataRecordCount.textContent=d.length+c.length+r.length;refs.dataPhotoCount.textContent=d.reduce((n,x)=>n+(x.photosBefore||[]).length+(x.photosAfter||[]).length,0)+c.reduce((n,x)=>n+(x.photos||[]).length,0)+r.reduce((n,x)=>n+(x.photos||[]).length,0);if(navigator.storage?.estimate){const est=await navigator.storage.estimate();refs.dataStorageUsage.textContent=formatBytes(est.usage||0);}else refs.dataStorageUsage.textContent='Локально';}catch{refs.dataRecordCount.textContent='—';refs.dataPhotoCount.textContent='—';refs.dataStorageUsage.textContent='—';}
 try{const meta=JSON.parse(localStorage.getItem(BACKUP_META_KEY)||'null');refs.lastBackupText.textContent=meta?.exportedAt?`${parseBackupDate(meta.exportedAt)} • ${formatBytes(meta.size||0)}`:'Ещё не создавалась';}catch{refs.lastBackupText.textContent='Ещё не создавалась';}
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
    toast(`Справочник обновлён • добавлено: ${list.length}`);refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;
  }catch(e){console.error(e);toast('Не удалось прочитать справочник объектов');}
}

function formatReleaseDate(value){
  const d=new Date(`${value}T00:00:00`);
  if(Number.isNaN(d.getTime()))return String(value||'');
  return new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d);
}
function renderVersionHistory(){
  if(refs.workspaceVersionLabel)refs.workspaceVersionLabel.textContent=`РосКапСтрой / V${APP_VERSION}`;
  if(refs.versionHistoryButton)refs.versionHistoryButton.textContent=`Версия V${APP_VERSION}`;
  if(refs.changelogCurrentVersion)refs.changelogCurrentVersion.textContent=`V${APP_VERSION}`;
  if(!refs.changelogList)return;
  if(!CHANGELOG.length){
    refs.changelogList.innerHTML='<div class="version-history-empty">История обновлений пока не заполнена.</div>';
    return;
  }
  refs.changelogList.innerHTML=CHANGELOG.map((item,index)=>`<article class="version-history-item${index===0?' current':''}">
    <div class="version-history-item-top">
      <span class="version-history-date">${esc(formatReleaseDate(item.date))}</span>
      <span class="version-history-number">V${esc(item.version||'')}</span>
    </div>
    <strong>${esc(item.title||'Обновление')}</strong>
    <p>${esc(item.description||'')}</p>
  </article>`).join('');
}
function openVersionHistory(){
  renderVersionHistory();
  if(refs.versionHistoryDialog?.showModal)refs.versionHistoryDialog.showModal();
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
 for(const form of [refs.defectForm,refs.photoRecordForm,refs.photoReportForm]){
  form.addEventListener('input',queueDraft);
  form.addEventListener('change',queueDraft);
  form.addEventListener('click',()=>setTimeout(queueDraft,0));
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)flushDraft().catch(storageError);});
 window.addEventListener('online',updateConnection);
 window.addEventListener('offline',updateConnection);
 updateConnection();
 refs.resumeSettingsBack=refs.settingsBack;

  refs.brandButton.onclick=async()=>{if(activeForm)await flushDraft().catch(storageError);defectJournalMode=false;photoJournalMode=false;photoReportJournalMode=false;showView('mainView');renderDashboard();};
  refs.defectsModuleButton.onclick=()=>handleModuleButton('defects');
  refs.photosModuleButton.onclick=()=>handleModuleButton('photos');
  refs.photoReportsModuleButton.onclick=()=>handleModuleButton('reports');

  refs.formBack.onclick=()=>leaveDefectCard({journal:false});
  refs.formJournalButton.onclick=()=>leaveDefectCard({journal:true});
  if(refs.moreJournalButton)refs.moreJournalButton.onclick=()=>{refs.moreDialog?.close();leaveDefectCard({journal:true});};
  if(refs.morePdfButton)refs.morePdfButton.onclick=()=>{refs.moreDialog?.close();makePdf();};
  if(refs.photoBeforeAddButton)refs.photoBeforeAddButton.onclick=()=>refs.photoBeforeSourceDialog?.showModal();
  refs.saveDefectButton.onclick=saveForm;
  refs.saveAndNextDefectButton.onclick=saveAndCreateNextDefect;
  refs.photoFormBack.onclick=leavePhotoCard;
  refs.photoReportFormBack.onclick=leavePhotoReportCard;

  refs.settingsButton.onclick=()=>{applySettings(loadSettings());refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;showView('settingsView');refreshDataSummary();};
  refs.settingsBack.onclick=()=>{showView('mainView');renderDashboard();};
  if(refs.versionHistoryButton)refs.versionHistoryButton.onclick=openVersionHistory;
  refs.searchToggle.onclick=()=>{refs.searchRow.classList.toggle('hidden');if(!refs.searchRow.classList.contains('hidden'))setTimeout(()=>refs.searchInput.focus(),50);};
  refs.searchClose.onclick=()=>{refs.searchRow.classList.add('hidden');refs.searchInput.value='';renderDashboard();}; refs.searchInput.oninput=renderDashboard;

  refs.defectForm.onsubmit=saveForm; refs.deleteDefectButton.onclick=deleteCurrent; refs.pdfButton.onclick=makePdf;
  if(refs.photoToolbarPdfButton)refs.photoToolbarPdfButton.onclick=makePhotoPdf;
  if(refs.photoReportToolbarPdfButton)refs.photoReportToolbarPdfButton.onclick=makePhotoReportPdf;
  refs.numberInput.addEventListener('input',()=>{if(formState.optional?.number){renderDefectOptionalUi();queueDraft();}});
  refs.dateInput.addEventListener('change',updateDefectDateSummary);
  refs.defectForm.addEventListener('focusin',event=>{
    const target=event.target;
    if(!target||!['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||!matchMedia('(max-width: 700px)').matches)return;
    setTimeout(()=>{try{target.scrollIntoView({block:'center',behavior:'smooth'});}catch{}},180);
  });
  for(const mobileForm of [refs.photoRecordForm,refs.photoReportForm]){
    mobileForm.addEventListener('focusin',event=>{
      const target=event.target;
      if(!target||!['INPUT','TEXTAREA','SELECT'].includes(target.tagName)||!matchMedia('(max-width: 700px)').matches)return;
      setTimeout(()=>{try{target.scrollIntoView({block:'center',behavior:'smooth'});}catch{}},180);
    });
  }
  refs.objectSearchInput.oninput=()=>{
    const typed=canonicalObjectText(refs.objectSearchInput.value);
    const selected=canonicalObjectText(objectDisplay({gp:formState.objectGp,name:formState.objectName}));
    if(typed===selected){refs.objectSearchResults.classList.add('hidden');refs.objectSearchResults.innerHTML='';return;}
    clearObjectSelection();
    renderObjectSuggestions(refs.objectSearchInput,refs.objectSearchResults,setObjectSelection);
  };
  refs.objectSearchButton.onclick=renderObjectSearch;
  refs.objectSearchInput.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();renderObjectSearch();}if(e.key==='Escape'){refs.objectSearchResults.classList.add('hidden');refs.objectSearchResults.innerHTML='';}};
  bindRdAutocomplete(refs.workingDocInput,refs.workingDocSuggestions,()=>formState.workSection);
  refs.workSectionPicker.onclick=()=>openPicker('workSection'); refs.defectTypePicker.onclick=()=>openPicker('defectType'); refs.workTypePicker.onclick=()=>openPicker('workType'); if(refs.contractorPicker)refs.contractorPicker.onclick=()=>openPicker('contractor');
  refs.pickerSearch.oninput=renderPickerList; refs.customValueSave.onclick=addCustomPicker;
  refs.addNtdButton.onclick=openNtd; refs.ntdSearch.oninput=renderNtdPicker;
  const bindDefectPhoto=(id,target)=>{refs[id].onchange=e=>{addPhotos(e.target.files,target);e.target.value='';if(target==='photosBefore')refs.photoBeforeSourceDialog?.close();};};
  bindDefectPhoto('photoBeforeCameraInput','photosBefore');bindDefectPhoto('photoBeforeGalleryInput','photosBefore');bindDefectPhoto('photoAfterCameraInput','photosAfter');bindDefectPhoto('photoAfterGalleryInput','photosAfter');
  document.querySelectorAll('[data-optional-toggle]').forEach(button=>button.onclick=()=>{
    const key=button.dataset.optionalToggle;if(!formState.optional)formState.optional=blankOptional(DEFECT_OPTIONAL_KEYS);const enabling=!formState.optional[key];formState.optional[key]=enabling;
    if(enabling&&key==='issuer'&&!refs.issuerInput.value)refs.issuerInput.value=DEFAULT_ISSUER;
    if(enabling&&key==='status'&&!refs.statusInput.value)refs.statusInput.value='Черновик';
    renderDefectOptionalUi();queueDraft();if(!enabling)return;const editor=document.querySelector(`[data-optional-editor="${key}"]`);setTimeout(()=>editor?.querySelector('input,select')?.focus(),30);
  });
  document.querySelectorAll('[data-optional-off]').forEach(button=>button.onclick=()=>{const key=button.dataset.optionalOff;if(formState.optional)formState.optional[key]=false;renderDefectOptionalUi();queueDraft();});
  [refs.statusInput,refs.dueDateInput,refs.signDateInput].forEach(el=>el&&el.addEventListener('change',()=>{renderDefectOptionalUi();queueDraft();}));
  refs.issuerInput?.addEventListener('input',()=>{renderDefectOptionalUi();queueDraft();});

  document.querySelectorAll('[data-photo-optional-toggle]').forEach(button=>button.onclick=()=>{const key=button.dataset.photoOptionalToggle;if(!photoFormState.optional)photoFormState.optional=blankOptional(PHOTO_OPTIONAL_KEYS);const enabling=!photoFormState.optional[key];photoFormState.optional[key]=enabling;if(enabling&&key==='inspector'&&!refs.photoInspectorInput.value)refs.photoInspectorInput.value=DEFAULT_ISSUER;renderPhotoOptionalUi();queueDraft();if(!enabling)return;const editor=document.querySelector(`[data-photo-optional-editor="${key}"]`);setTimeout(()=>editor?.querySelector('input,select')?.focus(),30);});
  document.querySelectorAll('[data-photo-optional-off]').forEach(button=>button.onclick=()=>{const key=button.dataset.photoOptionalOff;if(photoFormState.optional)photoFormState.optional[key]=false;renderPhotoOptionalUi();queueDraft();});
  [refs.photoContractorInput,refs.photoWorkSectionInput].forEach(el=>el&&el.addEventListener('change',()=>{const key=el===refs.photoContractorInput?'contractor':'workSection';photoFormState.optional[key]=Boolean(el.value);renderPhotoOptionalUi();queueDraft();}));
  [refs.photoNumberInput,refs.photoWorkTypeInput,refs.photoContractorRepInput,refs.photoInspectorInput].forEach(el=>el&&el.addEventListener('input',()=>{renderPhotoOptionalUi();queueDraft();}));

  document.querySelectorAll('[data-report-optional-toggle]').forEach(button=>button.onclick=()=>{const key=button.dataset.reportOptionalToggle;if(!photoReportFormState.optional)photoReportFormState.optional=blankOptional(REPORT_OPTIONAL_KEYS);const enabling=!photoReportFormState.optional[key];photoReportFormState.optional[key]=enabling;renderPhotoReportOptionalUi();queueDraft();if(enabling)setTimeout(()=>refs.photoReportNumberInput?.focus(),30);});
  document.querySelectorAll('[data-report-optional-off]').forEach(button=>button.onclick=()=>{const key=button.dataset.reportOptionalOff;if(photoReportFormState.optional)photoReportFormState.optional[key]=false;renderPhotoReportOptionalUi();queueDraft();});
  refs.photoReportNumberInput?.addEventListener('input',()=>{renderPhotoReportOptionalUi();queueDraft();});

  refs.moreButton.onclick=()=>refs.moreDialog.showModal(); refs.duplicateButton.onclick=duplicateCurrent; refs.shareJsonButton.onclick=shareCurrentJson;

  refs.photoRecordForm.onsubmit=savePhotoRecord; refs.deletePhotoRecordButton.onclick=()=>{refs.photoMoreDialog?.close();deletePhotoRecord();}; refs.photoPdfButton.onclick=()=>{refs.photoMoreDialog?.close();makePhotoPdf();};
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
  bindRdAutocomplete(refs.photoWorkingDocInput,refs.photoWorkingDocSuggestions,()=>refs.photoWorkSectionInput.value);
  if(refs.workPhotoAddButton)refs.workPhotoAddButton.onclick=()=>refs.workPhotoSourceDialog?.showModal();
  const bindWorkPhoto=id=>{refs[id].onchange=e=>{addWorkPhotos(e.target.files);e.target.value='';refs.workPhotoSourceDialog?.close();};};
  bindWorkPhoto('workPhotoCameraInput');bindWorkPhoto('workPhotoGalleryInput');
  refs.photoMoreButton.onclick=()=>refs.photoMoreDialog.showModal(); refs.duplicatePhotoButton.onclick=duplicatePhotoCurrent; refs.sharePhotoJsonButton.onclick=sharePhotoCurrentJson;

  refs.photoReportForm.onsubmit=savePhotoReport;refs.deletePhotoReportButton.onclick=()=>{refs.photoReportMoreDialog?.close();deletePhotoReport();};refs.photoReportPdfButton.onclick=()=>{refs.photoReportMoreDialog?.close();makePhotoReportPdf();};
  refs.photoReportDescriptionInput.oninput=queueDraft;refs.photoReportPerPageInput.onchange=queueDraft;
  if(refs.photoReportAddButton)refs.photoReportAddButton.onclick=()=>refs.photoReportSourceDialog?.showModal();
  const bindReportPhoto=id=>{refs[id].onchange=e=>{addPhotoReportPhotos(e.target.files);e.target.value='';refs.photoReportSourceDialog?.close();};};
  bindReportPhoto('photoReportCameraInput');bindReportPhoto('photoReportGalleryInput');
  refs.photoReportMoreButton.onclick=()=>refs.photoReportMoreDialog.showModal();refs.duplicatePhotoReportButton.onclick=duplicatePhotoReportCurrent;refs.sharePhotoReportJsonButton.onclick=sharePhotoReportCurrentJson;

  refs.exportBackupButton.onclick=()=>exportBackup();refs.exportRegistryCsvButton.onclick=exportRegistryCsv;refs.exportObjectsButton.onclick=exportObjects;refs.importBackupInput.onchange=e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value='';};
  refs.importRksZipInput.onchange=e=>{const file=e.target.files[0];if(file)importRksZip(file);e.target.value='';};refs.confirmRksImportButton.onclick=performRksImport;refs.cancelRksImportButton.onclick=()=>{pendingRksImport=null;refs.rksImportProgress.classList.add('hidden');refs.rksImportWarning.classList.add('hidden');};
  refs.importObjectsInput.onchange=e=>{if(e.target.files[0])importObjects(e.target.files[0]);e.target.value='';};refs.confirmBackupImportButton.onclick=performBackupImport;refs.cancelBackupImportButton.onclick=()=>{pendingBackupImport=null;};document.querySelectorAll('input[name="backupImportMode"]').forEach(x=>x.onchange=updateImportModeUi);refs.installHelpButton.onclick=()=>refs.installDialog.showModal();

  refs.fontSizeRange.oninput=()=>{const s=loadSettings();s.fontSize=Number(refs.fontSizeRange.value);refs.fontSizeLabel.textContent=`${s.fontSize}%`;saveSettings(s);};
  refs.boldTextToggle.onchange=()=>{const s=loadSettings();s.bold=refs.boldTextToggle.checked;saveSettings(s);};
  refs.contrastToggle.onchange=()=>{const s=loadSettings();s.contrast=refs.contrastToggle.checked;saveSettings(s);};
  refs.largeButtonsToggle.onchange=()=>{const s=loadSettings();s.largeButtons=refs.largeButtonsToggle.checked;saveSettings(s);};
  document.querySelectorAll('.theme-option').forEach(b=>b.onclick=()=>{const s=loadSettings();s.theme=b.dataset.theme;saveSettings(s);});
}
async function init(){
  cacheRefs();
  renderVersionHistory();
  refs.photoWorkSectionInput.innerHTML='<option value="">Выберите раздел</option>'+WORK_SECTIONS.map(x=>`<option value="${esc(`${x.code} — ${x.name}`)}">${esc(x.code)} — ${esc(x.name)}</option>`).join('');
  applySettings(loadSettings()); bind(); refs.objectReferenceCount.textContent=`Справочник объектов • ${getObjects().length}`;
  try{db=await openDb();await restorePreferences();await refresh();await refreshDataSummary();
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
