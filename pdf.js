const A4 = {w:1240,h:1754};
const encoder = new TextEncoder();

function bytesFromDataURL(url){
  const b64=url.split(',')[1]; const bin=atob(b64); const out=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) out[i]=bin.charCodeAt(i); return out;
}
function concat(parts){let n=parts.reduce((s,p)=>s+p.length,0),o=new Uint8Array(n),k=0;for(const p of parts){o.set(p,k);k+=p.length}return o}
function ascii(s){return encoder.encode(s)}

function buildPdf(jpegs){
  const objects=[];
  objects[1]=ascii('<< /Type /Catalog /Pages 2 0 R >>');
  const kids=[]; let obj=3;
  for(let i=0;i<jpegs.length;i++){
    const pageObj=obj++, imgObj=obj++, contentObj=obj++; kids.push(`${pageObj} 0 R`);
    const jpg=jpegs[i];
    objects[imgObj]=concat([ascii(`<< /Type /XObject /Subtype /Image /Width ${A4.w} /Height ${A4.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,ascii('\nendstream')]);
    const stream=ascii(`q\n595 0 0 842 0 0 cm\n/Im${i} Do\nQ\n`);
    objects[contentObj]=concat([ascii(`<< /Length ${stream.length} >>\nstream\n`),stream,ascii('endstream')]);
    objects[pageObj]=ascii(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im${i} ${imgObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
  }
  objects[2]=ascii(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${jpegs.length} >>`);
  const header=ascii('%PDF-1.4\n%âãÏÓ\n'); const parts=[header], offsets=[0]; let pos=header.length;
  for(let i=1;i<objects.length;i++){ offsets[i]=pos; const chunk=concat([ascii(`${i} 0 obj\n`),objects[i],ascii('\nendobj\n')]);parts.push(chunk);pos+=chunk.length; }
  const xrefPos=pos; let xref=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let i=1;i<objects.length;i++) xref += String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  const trailer=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  parts.push(ascii(xref+trailer)); return new Blob(parts,{type:'application/pdf'});
}

function page(){
  const c=document.createElement('canvas');c.width=A4.w;c.height=A4.h;const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.textBaseline='top'; return {c,ctx};
}
function font(ctx,size=28,weight=400){ctx.font=`${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;ctx.fillStyle='#172033'}
function wrap(ctx,text,x,y,maxW,lineH,maxLines=999){
  text=String(text||'—'); const blocks=text.split(/\n/); let yy=y, lines=0;
  for(const block of blocks){let line='';for(const word of block.split(/\s+/)){const t=line?line+' '+word:word;if(ctx.measureText(t).width>maxW && line){ctx.fillText(line,x,yy);yy+=lineH;lines++;line=word;if(lines>=maxLines)return yy}else line=t}if(lines<maxLines){ctx.fillText(line||' ',x,yy);yy+=lineH;lines++}if(lines>=maxLines)break}return yy;
}
function header(ctx,number,label='СТРОИТЕЛЬНЫЙ КОНТРОЛЬ'){
  ctx.fillStyle='#071F3D';ctx.fillRect(0,0,A4.w,120);font(ctx,34,760);ctx.fillStyle='#fff';ctx.fillText('РОСКАПСТРОЙ',72,38);font(ctx,22,650);ctx.fillStyle='#DCEBFA';ctx.textAlign='right';ctx.fillText(label,A4.w-72,30);ctx.fillText(number||'',A4.w-72,64);ctx.textAlign='left';
}
function title(ctx,t){font(ctx,38,760);ctx.fillStyle='#071F3D';return wrap(ctx,t,72,160,A4.w-144,48,3)+20}
function labelValue(ctx,label,value,y){font(ctx,18,650);ctx.fillStyle='#667084';ctx.fillText(label.toUpperCase(),72,y);font(ctx,27,500);ctx.fillStyle='#172033';return wrap(ctx,value,72,y+30,A4.w-144,36,6)+18}
async function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src})}
function drawContained(ctx,img,x,y,w,h){const r=Math.min(w/img.width,h/img.height);const dw=img.width*r,dh=img.height*r;ctx.fillStyle='#EFF2F5';ctx.fillRect(x,y,w,h);ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
async function addPhotoPages(pages,photos,caption='ФОТОМАТЕРИАЛЫ',perPage=2){
  if(!photos?.length)return; const chunks=[];for(let i=0;i<photos.length;i+=perPage)chunks.push(photos.slice(i,i+perPage));
  for(let pi=0;pi<chunks.length;pi++){const {c,ctx}=page();header(ctx,'',caption);let top=150;const usableH=A4.h-top-80,gap=26;
    const rows=perPage===1?1:perPage===2?2:perPage===4?2:3;const cols=perPage===4||perPage===6?2:1;const cellW=(A4.w-144-gap*(cols-1))/cols;const cellH=(usableH-gap*(rows-1))/rows;
    for(let j=0;j<chunks[pi].length;j++){const col=j%cols,row=Math.floor(j/cols),x=72+col*(cellW+gap),y=top+row*(cellH+gap);try{const img=await loadImage(chunks[pi][j].dataUrl||chunks[pi][j]);drawContained(ctx,img,x,y,cellW,cellH)}catch{font(ctx,24,500);ctx.fillStyle='#E63224';ctx.fillText('Не удалось загрузить фото',x,y+20)}}
    pages.push(c.toDataURL('image/jpeg',.9));
  }
}
function footer(ctx){font(ctx,17,400);ctx.fillStyle='#667084';ctx.fillText('Сформировано локально в приложении «РосКапСтрой»',72,A4.h-48)}

export async function defectPdf(record){
  const pages=[]; let {c,ctx}=page();header(ctx,record.number);let y=title(ctx,'ЗАМЕЧАНИЕ\nО ВЫЯВЛЕННОМ НЕДОСТАТКЕ');
  const ntd=(record.ntd||[]).map(x=>`${x.name||''}${x.clause?' — '+x.clause:''}`).join('\n');
  const fields=[['Статус / дата',`${record.status||'Черновик'} • ${record.date||'—'}`],['Объект',`${record.gp||''}${record.objectName?' — '+record.objectName:''}`],['Место / оборудование',record.location],['Раздел / вид работ',`${(record.section==='Другое'?record.sectionCustom:record.section)||'—'} / ${record.workType||'—'}`],['Тип недостатка',record.defectType],['Подрядчик',record.contractor],['Описание недостатка',record.description],['Нормативная документация',ntd],['Рабочая документация',record.rd],['Указания по устранению',record.instructions],['Сроки',`Плановая дата: ${record.dueDate||'—'}; дата подписания: ${record.signDate||'—'}`],['Кем выдан',record.issuer]];
  for(const [l,v] of fields){const est=80+Math.ceil(String(v||'').length/65)*34;if(y+est>A4.h-90){footer(ctx);pages.push(c.toDataURL('image/jpeg',.9));({c,ctx}=page());header(ctx,record.number);y=150}y=labelValue(ctx,l,v,y)}footer(ctx);pages.push(c.toDataURL('image/jpeg',.9));
  await addPhotoPages(pages,record.beforePhotos,'ФОТО НЕДОСТАТКА',2);await addPhotoPages(pages,record.afterPhotos,'ФОТО ПОСЛЕ УСТРАНЕНИЯ',2);
  return buildPdf(pages.map(bytesFromDataURL));
}

export async function checkPdf(record){
  const pages=[];let {c,ctx}=page();header(ctx,record.number,'ОТЧЁТ ПРОВЕРКИ');let y=title(ctx,record.checkType||'ПРОВЕРКА');
  const fields=[['Дата / результат',`${record.date||'—'} • ${record.result||'—'}`],['Объект',`${record.gp||''}${record.objectName?' — '+record.objectName:''}`],['Описание',record.description]];
  for(const [k,v] of Object.entries(record.details||{})) if(v) fields.push([k,v]);
  if(record.scenario?.length) fields.push(['Сценарий',record.scenario.map((s,i)=>`${i+1}. ${s.event||'—'} → ${s.command||'—'} → ${s.expected||'—'} / ${s.actual||'—'} [${s.state||'—'}]`).join('\n')]);
  for(const [l,v] of fields){const est=80+Math.ceil(String(v||'').length/65)*34;if(y+est>A4.h-90){footer(ctx);pages.push(c.toDataURL('image/jpeg',.9));({c,ctx}=page());header(ctx,record.number,'ОТЧЁТ ПРОВЕРКИ');y=150}y=labelValue(ctx,l,v,y)}footer(ctx);pages.push(c.toDataURL('image/jpeg',.9));await addPhotoPages(pages,record.photos,'ФОТОМАТЕРИАЛЫ ПРОВЕРКИ',2);return buildPdf(pages.map(bytesFromDataURL));
}

export async function photoReportPdf(record){
  const pages=[];let {c,ctx}=page();header(ctx,record.number,'ФОТООТЧЁТ');let y=title(ctx,'ФОТООТЧЁТ');y=labelValue(ctx,'Дата',record.date,y);y=labelValue(ctx,'Описание',record.description,y);footer(ctx);pages.push(c.toDataURL('image/jpeg',.9));await addPhotoPages(pages,record.photos,'ФОТОМАТЕРИАЛЫ',Number(record.perPage)||2);return buildPdf(pages.map(bytesFromDataURL));
}

export function saveBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500)}
export function blobSize(blob){return blob.size<1024*1024?`${Math.max(1,Math.round(blob.size/1024))} КБ`:`${(blob.size/1024/1024).toFixed(1)} МБ`}
