'use strict';
// Local, searchable PDF generation. Fonts and images never leave the device.
const RksPdf = (() => {
  async function build(record, photoReport=false) {
    const {PDFDocument,rgb}=PDFLib;
    const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
    const resource=async path=>{
      if(typeof path!=='string'||!path)throw Error('Пустой ресурс PDF');
      if(/^data:/i.test(path)){
        const comma=path.indexOf(',');
        if(comma<0)throw Error('Некорректное изображение');
        const meta=path.slice(0,comma),body=path.slice(comma+1);
        if(/;base64/i.test(meta)){
          const raw=atob(body.replace(/\s/g,''));
          const out=new Uint8Array(raw.length);
          for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
          return out;
        }
        return new TextEncoder().encode(decodeURIComponent(body));
      }
      const r=await fetch(path,{cache:'no-store'});
      if(!r.ok)throw Error('Не удалось загрузить '+path+' ('+r.status+')');
      return new Uint8Array(await r.arrayBuffer());
    };
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
    const hasValue=v=>v!==null&&v!==undefined&&String(v).trim()!=='';
    function lines(text,max,size=10,font=regular){
      const result=[];
      const source=clean(text);
      if(!source.trim())return result;
      for(const para of source.split(/\r?\n/)){
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
      if(!hasValue(label)||!hasValue(value))return false;
      const left=lines(label,148,8.5,bold),right=lines(value,content-168,10);
      if(!left.length||!right.length)return false;
      ensure(30);
      for(let i=0;i<Math.max(left.length,right.length);i++){
        ensure(15);
        if(left[i])page.drawText(left[i],{x:margin,y,size:8.5,font:bold,color:gray});
        if(right[i])page.drawText(right[i],{x:margin+168,y,size:10,font:regular,color:navy});
        y-=15;
      }
      y-=9;
      return true;
    }
    newPage();
    paragraph(photoReport?'ФОТООТЧЁТ':'ЗАМЕЧАНИЕ',{font:bold,size:24,leading:34});
    paragraph(photoReport?'Проверка строительного контроля':'О выявленном недостатке',{color:gray,size:10});
    y-=10;
    if(hasValue(record.date))field(photoReport?'Дата контроля':'Дата замечания',fmtDate(record.date));
    if(hasValue(photoReport?record.result:record.status))field(photoReport?'Результат контроля':'Статус',photoReport?record.result:record.status);

    const objectValue=[record.objectGp?record.objectGp+' по ГП':'',record.objectName].filter(hasValue).join(' — ')||record.object;
    const commonFields=[
      ...(photoReport?[['Вид контроля',record.controlType]]:[]),
      ['Объект',objectValue],
      ['Место',record.location],
      ['Раздел работ',record.workSection],
      ['Вид работ',record.workType],
      ['Подрядчик',record.contractor],
      ...(!photoReport?[['Тип недостатка',record.defectType]]:[])
    ].filter(([,value])=>hasValue(value));
    if(commonFields.length){
      heading(photoReport?'СВЕДЕНИЯ О КОНТРОЛЕ':'СВЕДЕНИЯ О ЗАМЕЧАНИИ');
      for(const [label,value] of commonFields)field(label,value);
    }

    if(hasValue(record.description)){
      heading(photoReport?'ОПИСАНИЕ ВЫПОЛНЕННЫХ РАБОТ':'ОПИСАНИЕ НЕДОСТАТКА');
      paragraph(record.description);y-=8;
    }

    if(photoReport){
      let sectionTitle='';
      let sectionFields=[];
      if(record.controlType==='Операционный контроль'){
        sectionTitle='ОПЕРАЦИОННЫЙ КОНТРОЛЬ';
        sectionFields=[['Этап / технологическая операция',record.operationStage],['Контролируемый параметр / критерий',record.controlCriterion],['Способ контроля / инструмент',record.controlMethod],['Предшествующие работы / основание',record.precedingWorks],['Скрываемая работа',record.hiddenWorks]];
      }else if(record.controlType==='Приемочный контроль'){
        sectionTitle='ПРИЕМОЧНЫЙ КОНТРОЛЬ';
        sectionFields=[['Предъявленный объём / участок',record.acceptedScope],['Исполнительная документация',record.executiveDocs],['Испытания / измерения',record.acceptanceTests],['Готовность к следующему этапу',record.nextStage],['Ранее выданные замечания',record.previousRemarks]];
      }else if(record.controlType==='Индивидуальные испытания'){
        sectionTitle='ИНДИВИДУАЛЬНЫЕ ИСПЫТАНИЯ';
        sectionFields=[['Оборудование / система',record.equipment],['Заводской № / идентификатор',record.serial],['Программа / методика',record.protocol],['Средство измерений',record.instrument],['№ прибора / поверка',record.instrumentSerial],['Проверяемые параметры / норматив',record.testParams],['Фактические результаты',record.testResult]];
      }else if(record.controlType==='Комплексное опробование'){
        sectionTitle='КОМПЛЕКСНОЕ ОПРОБОВАНИЕ';
        sectionFields=[['Комплекс / система',record.complexSystem],['Программа опробования',record.complexProgram],['Продолжительность',record.complexDuration],['Итоговый протокол',record.complexProtocol]];
      }
      const visibleSectionFields=sectionFields.filter(([,value])=>hasValue(value));
      if(visibleSectionFields.length){heading(sectionTitle);for(const [label,value] of visibleSectionFields)field(label,value);}

      if(record.controlType==='Комплексное опробование'&&Array.isArray(record.scenarioSteps)){
        const steps=record.scenarioSteps.filter(step=>step&&[step.event,step.command,step.expected,step.actual,step.status].some(hasValue));
        if(steps.length){
          heading('СЦЕНАРИЙ КОМПЛЕКСНОГО ОПРОБОВАНИЯ');
          for(let i=0;i<steps.length;i++){
            const step=steps[i]||{};
            if(hasValue(step.status)){
              const status=step.status==='ok'?'ВЫПОЛНЕНО':step.status==='issue'?'НЕ ВЫПОЛНЕНО':step.status==='na'?'НЕ ПРИМЕНЯЕТСЯ':step.status;
              field(`Этап ${i+1}`,status);
            }else{
              paragraph(`Этап ${i+1}`,{font:bold,size:9,color:gray,leading:15});y-=4;
            }
            field('Событие / условие',step.event);
            field('Команда / воздействие',step.command);
            field('Ожидаемый результат',step.expected);
            field('Фактический результат',step.actual);
          }
        }
      }
    }

    const validNtd=(!photoReport&&Array.isArray(record.ntd))?record.ntd.filter(ntd=>ntd&&(hasValue(ntd.name)||hasValue(ntd.clause))):[];
    if(validNtd.length||hasValue(record.workingDoc)){
      heading('ДОКУМЕНТАЦИЯ');
      for(const ntd of validNtd){
        const value=hasValue(ntd.clause)?'Пункт(ы): '+ntd.clause:(hasValue(ntd.name)?ntd.name:'');
        if(hasValue(ntd.name)&&hasValue(ntd.clause))field(ntd.name,value);
        else if(hasValue(ntd.name))field('Нормативная документация',ntd.name);
        else if(hasValue(ntd.clause))field('Нормативная документация','Пункт(ы): '+ntd.clause);
      }
      field('Рабочая документация',record.workingDoc);
    }
    if(!photoReport&&hasValue(record.remedy)){
      heading('УКАЗАНИЯ ПО УСТРАНЕНИЮ');paragraph(record.remedy);y-=12;
    }
    if(!photoReport&&hasValue(record.dueDate))field('Плановая дата устранения',fmtDate(record.dueDate));
    const groups=photoReport
      ? [{title:'ФОТОМАТЕРИАЛЫ ПРОВЕРКИ',items:record.photos||[]}]
      : [{title:'ФОТО НЕДОСТАТКА',items:(record.photosBefore||[]).map(src=>({src}))},
         {title:'ФОТО ПОСЛЕ УСТРАНЕНИЯ',items:(record.photosAfter||[]).map(src=>({src}))}];
    for(const group of groups){
      if(!group.items.length)continue;
      newPage();heading(group.title);
      for(let i=0;i<group.items.length;i++){
        const item=group.items[i];
        const data=await resource(item.src);
        const sig=data instanceof Uint8Array?data:new Uint8Array(data);
        let image;
        if(sig[0]===137&&sig[1]===80&&sig[2]===78&&sig[3]===71)image=await doc.embedPng(sig);
        else if(sig[0]===255&&sig[1]===216)image=await doc.embedJpg(sig);
        else throw Error('Формат одной из фотографий не поддерживается в PDF. Используйте JPG или PNG.');
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
    const signer=photoReport?record.inspector:record.issuer;
    const signatureFields=[
      ...(photoReport?[['Представитель подрядчика',record.contractorRep]]:[]),
      [photoReport?'Контроль выполнил':'Документ выдал',signer],
      ['Дата подписания',hasValue(record.signDate)?fmtDate(record.signDate):'']
    ].filter(([,value])=>hasValue(value));
    if(signatureFields.length){
      heading('ПОДПИСИ');
      for(const [label,value] of signatureFields)field(label,value);
      if(hasValue(signer)){
        ensure(50);y-=10;
        page.drawLine({start:{x:margin,y},end:{x:margin+190,y},color:line,thickness:1});
        y-=15;paragraph('Подпись',{size:8,color:gray});
      }
    }
    const pages=doc.getPages();
    pages.forEach((p,i)=>{
      p.drawLine({start:{x:margin,y:42},end:{x:width-margin,y:42},color:line,thickness:.6});
      p.drawText('РосКапСтрой · Строительный контроль',{x:margin,y:26,font:regular,size:8,color:gray});
      p.drawText((i+1)+' / '+pages.length,{x:width-margin-40,y:26,font:regular,size:8,color:gray});
    });
    return doc.save();
  }


  async function buildPhotoReport(record){
    const {PDFDocument,rgb}=PDFLib;
    const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
    const resource=async path=>{
      if(typeof path!=='string'||!path)throw Error('Пустой ресурс PDF');
      if(/^data:/i.test(path)){
        const comma=path.indexOf(',');if(comma<0)throw Error('Некорректное изображение');
        const meta=path.slice(0,comma),body=path.slice(comma+1);
        if(/;base64/i.test(meta)){const raw=atob(body.replace(/\s/g,'')),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
        return new TextEncoder().encode(decodeURIComponent(body));
      }
      const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error('Не удалось загрузить '+path+' ('+r.status+')');return new Uint8Array(await r.arrayBuffer());
    };
    const [regular,bold,logo]=await Promise.all([
      resource('assets/fonts/NotoSans-Regular.ttf').then(b=>doc.embedFont(b,{subset:true})),
      resource('assets/fonts/NotoSans-Bold.ttf').then(b=>doc.embedFont(b,{subset:true})),
      resource('assets/roskapstroy_pdf_logo.png').then(b=>doc.embedPng(b))
    ]);
    doc.setTitle('Фотоотчёт '+(record.number||''));doc.setAuthor('РосКапСтрой');doc.setCreator('РосКапСтрой');
    const W=595.28,H=841.89,M=56.69,content=W-M*2,navy=rgb(.028,.122,.239),blue=rgb(.075,.43,.76),gray=rgb(.36,.42,.49),line=rgb(.83,.87,.91);
    const clean=v=>String(v??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/\t/g,'    ');
    const hasValue=v=>v!==null&&v!==undefined&&String(v).trim()!=='';
    const wrap=(text,max,size=10,font=regular)=>{const out=[];const source=clean(text);if(!source.trim())return out;for(const para of source.split(/\r?\n/)){let cur='';for(const word of para.split(/\s+/)){const candidate=cur?cur+' '+word:word;if(font.widthOfTextAtSize(candidate,size)<=max){cur=candidate;continue;}if(cur){out.push(cur);cur='';}for(const ch of word){if(cur&&font.widthOfTextAtSize(cur+ch,size)>max){out.push(cur);cur='';}cur+=ch;}}out.push(cur||' ');}return out;};
    const now=new Date();
    const actualDate=new Intl.DateTimeFormat('ru-RU').format(now);
    const header=(page)=>{
      const fit=logo.scaleToFit(225,52);page.drawImage(logo,{x:M,y:H-31-fit.height,width:fit.width,height:fit.height});
      const title='ФОТООТЧЁТ';const titleSize=9,dateSize=9;
      const titleW=bold.widthOfTextAtSize(title,titleSize),dateW=regular.widthOfTextAtSize(actualDate,dateSize);
      page.drawText(title,{x:W-M-titleW,y:H-45,size:titleSize,font:bold,color:gray});
      page.drawText(actualDate,{x:W-M-dateW,y:H-63,size:dateSize,font:regular,color:navy});
      page.drawLine({start:{x:M,y:H-96},end:{x:W-M,y:H-96},thickness:1.2,color:blue});
    };
    const footer=(page,index,total)=>{page.drawLine({start:{x:M,y:42},end:{x:W-M,y:42},thickness:.6,color:line});page.drawText('РосКапСтрой · Строительный контроль',{x:M,y:26,font:regular,size:8,color:gray});page.drawText(`${index} / ${total}`,{x:W-M-40,y:26,font:regular,size:8,color:gray});};
    const photos=(record.photos||[]).map(p=>typeof p==='string'?{src:p}:p).filter(p=>p?.src);
    const perPage=[1,2,4,6].includes(Number(record.perPage))?Number(record.perPage):2;
    const grid={1:[1,1],2:[1,2],4:[2,2],6:[2,3]}[perPage];
    const cols=grid[0],rows=grid[1],gapX=14,gapY=20,bottom=68;
    const descriptionLines=wrap(record.description,content,10,regular);
    const descLeading=15,descTitleH=20;
    const maxFirstDescLines=Math.max(1,Math.min(descriptionLines.length,8));
    const firstDescLines=descriptionLines.slice(0,maxFirstDescLines);
    const remainingDescLines=descriptionLines.slice(maxFirstDescLines);

    async function embedPhoto(item){
      const data=await resource(item.src),sig=data instanceof Uint8Array?data:new Uint8Array(data);
      if(sig[0]===137&&sig[1]===80&&sig[2]===78&&sig[3]===71)return doc.embedPng(sig);
      if(sig[0]===255&&sig[1]===216)return doc.embedJpg(sig);
      throw Error('Формат одной из фотографий не поддерживается в PDF. Используйте JPG или PNG.');
    }
    async function drawPhotoGrid(page,slice,offset,top){
      const usableH=top-bottom,cellW=(content-gapX*(cols-1))/cols,cellH=(usableH-gapY*(rows-1))/rows;
      for(let j=0;j<slice.length;j++){
        const image=await embedPhoto(slice[j]);
        const col=j%cols,row=Math.floor(j/cols),x=M+col*(cellW+gapX),cellTop=top-row*(cellH+gapY),labelH=17,maxH=Math.max(24,cellH-labelH);
        const scale=Math.min(cellW/image.width,maxH/image.height),dw=image.width*scale,dh=image.height*scale;
        const dx=x+(cellW-dw)/2,dy=cellTop-maxH+(maxH-dh)/2+labelH;
        page.drawImage(image,{x:dx,y:dy,width:dw,height:dh});
        page.drawText(`Фото ${offset+j+1}`,{x,y:cellTop-cellH+2,size:8.5,font:bold,color:gray});
        await new Promise(resolve=>setTimeout(resolve,0));
      }
    }

    // Первый лист: заполненное описание и фотографии располагаются вместе.
    // Если описание пустое, его заголовок и пустое место полностью отсутствуют.
    const firstPage=doc.addPage([W,H]);header(firstPage);
    let y=H-125;
    if(firstDescLines.length){
      firstPage.drawText('ОПИСАНИЕ',{x:M,y,size:11,font:bold,color:blue});y-=descTitleH;
      for(const lineText of firstDescLines){firstPage.drawText(lineText,{x:M,y,size:10,font:regular,color:navy});y-=descLeading;}
      y-=8;
    }
    const firstSlice=photos.slice(0,perPage);
    if(firstSlice.length)await drawPhotoGrid(firstPage,firstSlice,0,y);

    // Если заполненное описание длинное, его продолжение выводится полностью, не обрезается.
    if(remainingDescLines.length){
      let i=0;
      while(i<remainingDescLines.length){
        const page=doc.addPage([W,H]);header(page);let ty=H-128;
        page.drawText('ОПИСАНИЕ · ПРОДОЛЖЕНИЕ',{x:M,y:ty,size:11,font:bold,color:blue});ty-=24;
        while(i<remainingDescLines.length&&ty>72){page.drawText(remainingDescLines[i++],{x:M,y:ty,size:10,font:regular,color:navy});ty-=descLeading;}
      }
    }

    for(let offset=perPage;offset<photos.length;offset+=perPage){
      const page=doc.addPage([W,H]);header(page);
      await drawPhotoGrid(page,photos.slice(offset,offset+perPage),offset,H-125);
    }
    const pages=doc.getPages();pages.forEach((page,i)=>footer(page,i+1,pages.length));
    return doc.save();
  }
  return {build,buildPhotoReport};
})();
// Explicit global export makes readiness checks reliable in Safari/PWA.
globalThis.RksPdf=RksPdf;
