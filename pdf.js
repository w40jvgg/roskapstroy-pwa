'use strict';
// Local, searchable PDF generation. Fonts and images never leave the device.
const RksPdf = (() => {
  async function build(record, photoReport=false) {
    const {PDFDocument,rgb}=PDFLib;
    const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
    const resource=async path=>{const r=await fetch(path);if(!r.ok)throw Error('Не удалось загрузить '+path);return r.arrayBuffer();};
    const [regular,bold,logo]=await Promise.all([
      resource('assets/fonts/NotoSans-Regular.ttf').then(b=>doc.embedFont(b,{subset:true})),
      resource('assets/fonts/NotoSans-Bold.ttf').then(b=>doc.embedFont(b,{subset:true})),
      resource('assets/roskapstroy_pdf_logo.png').then(b=>doc.embedPng(b))
    ]);
    doc.setTitle((photoReport?'Фотоотчёт ':'Замечание ')+record.number);
    doc.setAuthor(photoReport?record.inspector:record.issuer);
    doc.setCreator('РосКапСтрой');
    const width=595.28,height=841.89,margin=42,bottom=64,content=width-margin*2;
    const navy=rgb(.028,.122,.239),blue=rgb(.075,.43,.76),gray=rgb(.36,.42,.49),line=rgb(.83,.87,.91);
    let page,y;
    const clean=v=>String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\t/g,'    ');
    function lines(text,max,size=10,font=regular){
      const result=[];
      for(const para of clean(text||'—').split(/\r?\n/)){
        let current='';
        for(const word of para.split(/\s+/)){
          const candidate=current?current+' '+word:word;
          if(font.widthOfTextAtSize(candidate,size)<=max){current=candidate;continue;}
          if(current){result.push(current);current='';}
          for(const char of word){
            if(current&&font.widthOfTextAtSize(current+char,size)>max){result.push(current);current='';}
            current+=char;
          }
        }
        result.push(current||' ');
      }
      return result;
    }
    function newPage(){
      page=doc.addPage([width,height]);
      const fit=logo.scaleToFit(230,55);
      page.drawImage(logo,{x:margin,y:height-32-fit.height,width:fit.width,height:fit.height});
      page.drawText('СТРОИТЕЛЬНЫЙ КОНТРОЛЬ',{x:width-margin-153,y:height-43,size:8,font:bold,color:gray});
      const numberSize=Math.min(11,153/Math.max(1,bold.widthOfTextAtSize(record.number,1)));
      page.drawText(record.number,{x:width-margin-153,y:height-63,size:numberSize,font:bold,color:navy});
      page.drawLine({start:{x:margin,y:height-99},end:{x:width-margin,y:height-99},thickness:1.3,color:blue});
      y=height-138;
    }
    function ensure(h){if(y-h<bottom)newPage();}
    function paragraph(value,{size=10,font=regular,color=navy,indent=0,leading=15}={}){
      for(const text of lines(value,content-indent,size,font)){
        ensure(leading);page.drawText(text,{x:margin+indent,y,size,font,color});y-=leading;
      }
    }
    function heading(title){ensure(56);y-=10;paragraph(title,{font:bold,size:11,color:blue,leading:18});y-=3;}
    function field(label,value){
      const left=lines(label,148,8.5,bold),right=lines(value||'Не указано',content-168,10);
      ensure(30);
      for(let i=0;i<Math.max(left.length,right.length);i++){
        ensure(15);
        if(left[i])page.drawText(left[i],{x:margin,y,size:8.5,font:bold,color:gray});
        if(right[i])page.drawText(right[i],{x:margin+168,y,size:10,font:regular,color:navy});
        y-=15;
      }
      y-=9;
    }
    newPage();
    paragraph(photoReport?'ФОТООТЧЁТ':'ЗАМЕЧАНИЕ',{font:bold,size:24,leading:34});
    paragraph(photoReport?'Фотофиксация выполненных работ':'О выявленном недостатке',{color:gray,size:10});
    y-=10;
    field(photoReport?'Дата контроля':'Дата замечания',fmtDate(record.date));
    field(photoReport?'Результат контроля':'Статус',photoReport?record.result:record.status);
    heading(photoReport?'СВЕДЕНИЯ О КОНТРОЛЕ':'СВЕДЕНИЯ О ЗАМЕЧАНИИ');
    if(photoReport)field('Вид контроля',record.controlType);
    field('Объект',[record.objectGp?record.objectGp+' по ГП':'',record.objectName].filter(Boolean).join(' — ')||record.object);
    for(const [label,key] of [['Место','location'],['Раздел работ','workSection'],['Вид работ','workType'],['Подрядчик','contractor']])field(label,record[key]);
    if(!photoReport)field('Тип недостатка',record.defectType);
    heading(photoReport?'ОПИСАНИЕ ВЫПОЛНЕННЫХ РАБОТ':'ОПИСАНИЕ НЕДОСТАТКА');
    paragraph(record.description||record.workType);y-=8;
    heading('ДОКУМЕНТАЦИЯ');
    if(!photoReport){
      for(const ntd of record.ntd||[])field(ntd.name,'Пункт(ы): '+ntd.clause);
      if(!record.ntd?.length)field('Нормативная документация','Не указана');
    }
    field('Рабочая документация',record.workingDoc);
    if(photoReport&&['Индивидуальные испытания','Комплексное опробование'].includes(record.controlType)){
      heading('ИСПЫТАНИЯ И ОПРОБОВАНИЕ');
      for(const [label,key] of [['Оборудование / система','equipment'],['Заводской номер','serial'],['Протокол / программа','protocol'],['Результаты / параметры','testResult']])field(label,record[key]);
    }
    if(!photoReport){
      heading('УКАЗАНИЯ ПО УСТРАНЕНИЮ');paragraph(record.remedy||'Не указаны');y-=12;
      field('Плановая дата устранения',fmtDate(record.dueDate));
    }
    const groups=photoReport
      ? [{title:'ФОТОФИКСАЦИЯ РАБОТ',items:record.photos||[]}]
      : [{title:'ФОТО НЕДОСТАТКА',items:(record.photosBefore||[]).map(src=>({src}))},
         {title:'ФОТО ПОСЛЕ УСТРАНЕНИЯ',items:(record.photosAfter||[]).map(src=>({src}))}];
    for(const group of groups){
      if(!group.items.length)continue;
      newPage();heading(group.title);
      for(let i=0;i<group.items.length;i++){
        const item=group.items[i];
        const data=await resource(item.src);
        const image=new Uint8Array(data)[0]===137?await doc.embedPng(data):await doc.embedJpg(data);
        const fit=image.scaleToFit(content,320);
        ensure(fit.height+42);
        page.drawImage(image,{x:margin+(content-fit.width)/2,y:y-fit.height,width:fit.width,height:fit.height});
        y-=fit.height+17;
        paragraph('Фото '+(i+1)+(item.kind?' · '+item.kind:''),{font:bold,size:9,leading:14});
        if(item.caption)paragraph(item.caption,{size:9,leading:14});
        y-=22;
        // Release each UI turn while embedding large series.
        await new Promise(resolve=>setTimeout(resolve,0));
      }
    }
    heading('ПОДПИСИ');
    if(photoReport)field('Представитель подрядчика',record.contractorRep);
    field(photoReport?'Контроль выполнил':'Документ выдал',photoReport?record.inspector:record.issuer);
    ensure(65);y-=15;
    page.drawLine({start:{x:margin,y},end:{x:margin+190,y},color:line,thickness:1});
    y-=15;paragraph('Подпись',{size:8,color:gray});
    field('Дата подписания',record.signDate?fmtDate(record.signDate):'________________');
    const pages=doc.getPages();
    pages.forEach((p,i)=>{
      p.drawLine({start:{x:margin,y:42},end:{x:width-margin,y:42},color:line,thickness:.6});
      p.drawText('РосКапСтрой · Строительный контроль',{x:margin,y:26,font:regular,size:8,color:gray});
      p.drawText((i+1)+' / '+pages.length,{x:width-margin-40,y:26,font:regular,size:8,color:gray});
    });
    return doc.save();
  }
  return {build};
})();
