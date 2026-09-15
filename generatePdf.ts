import { PDFDocument, PDFPage, PDFFont, degrees, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fontUrl from '@fontsource/noto-sans/files/noto-sans-cyrillic-400-normal.woff?url';
import boldFontUrl from '@fontsource/noto-sans/files/noto-sans-cyrillic-700-normal.woff?url';
import { db } from '../db/database';
import type { Defect, Inspection, PhotoReport, ReportPhoto } from '../types/models';

const A4: [number, number] = [595.28, 841.89];
const mm = (value: number) => value * 72 / 25.4;
const navy = rgb(7 / 255, 31 / 255, 61 / 255);
const blue = rgb(11 / 255, 111 / 255, 194 / 255);
const muted = rgb(94 / 255, 104 / 255, 120 / 255);
const border = rgb(.82, .85, .88);

interface Context { doc: PDFDocument; font: PDFFont; bold: PDFFont; page: PDFPage; y: number; pageNumber: number }

async function context(): Promise<Context> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const [regularBytes, boldBytes] = await Promise.all([fetch(fontUrl).then(r => r.arrayBuffer()), fetch(boldFontUrl).then(r => r.arrayBuffer())]);
  const font = await doc.embedFont(regularBytes, { subset: true });
  const bold = await doc.embedFont(boldBytes, { subset: true });
  const page = doc.addPage(A4);
  return { doc, font, bold, page, y: A4[1] - mm(18), pageNumber: 1 };
}

function safeFileName(value: string): string { return value.replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-').replace(/\s+/g, '_').slice(0, 120); }
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const result: string[] = [];
  for (const paragraph of (text || '—').split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, size) <= width) line = next;
      else { if (line) result.push(line); line = word; }
    }
    result.push(line || ' ');
  }
  return result;
}

function header(ctx: Context, title: string, number: string): void {
  const { page, bold, font } = ctx;
  page.drawRectangle({ x: mm(15), y: A4[1] - mm(24), width: mm(10), height: mm(10), color: navy });
  page.drawText('РКС', { x: mm(16.4), y: A4[1] - mm(20.1), size: 8, font: bold, color: rgb(1, 1, 1) });
  page.drawText('РОСКАПСТРОЙ', { x: mm(29), y: A4[1] - mm(17.5), size: 9, font: bold, color: navy });
  page.drawText('СТРОИТЕЛЬНЫЙ КОНТРОЛЬ', { x: mm(125), y: A4[1] - mm(17.5), size: 7.5, font, color: muted });
  page.drawText(number, { x: mm(160), y: A4[1] - mm(22), size: 9, font: bold, color: navy });
  page.drawLine({ start: { x: mm(15), y: A4[1] - mm(28) }, end: { x: A4[0] - mm(15), y: A4[1] - mm(28) }, thickness: 1, color: blue });
  ctx.y = A4[1] - mm(36);
  if (title) {
    for (const line of wrap(title, bold, 15, A4[0] - mm(30))) { page.drawText(line, { x: mm(15), y: ctx.y, size: 15, font: bold, color: navy }); ctx.y -= 19; }
    ctx.y -= 4;
  }
}

function footer(ctx: Context): void {
  ctx.page.drawLine({ start: { x: mm(15), y: mm(12) }, end: { x: A4[0] - mm(15), y: mm(12) }, thickness: .5, color: border });
  ctx.page.drawText(`Сформировано ${new Date().toLocaleString('ru-RU')}  •  Страница ${ctx.pageNumber}`, { x: mm(15), y: mm(7.5), size: 7.5, font: ctx.font, color: muted });
}

function newPage(ctx: Context, title: string, number: string): void {
  footer(ctx); ctx.page = ctx.doc.addPage(A4); ctx.pageNumber += 1; header(ctx, title, number);
}

function field(ctx: Context, label: string, value: string, docTitle: string, number: string): void {
  const width = A4[0] - mm(30);
  const lines = wrap(value || '—', ctx.font, 10, width - mm(4));
  const height = 15 + lines.length * 13;
  if (ctx.y - height < mm(20)) newPage(ctx, '', number);
  ctx.page.drawText(label.toUpperCase(), { x: mm(15), y: ctx.y, size: 7.5, font: ctx.bold, color: muted });
  ctx.y -= 13;
  for (const line of lines) { ctx.page.drawText(line, { x: mm(15), y: ctx.y, size: 10, font: ctx.font, color: navy }); ctx.y -= 13; }
  ctx.y -= 7;
  void docTitle;
}

async function imageBlock(ctx: Context, attachmentId: string, caption: string, number: string, maxHeight = mm(92)): Promise<void> {
  const attachment = await db.attachments.get(attachmentId);
  if (!attachment) { field(ctx, 'Фотография', 'Файл повреждён или отсутствует', '', number); return; }
  const bytes = await attachment.documentBlob.arrayBuffer();
  const image = await ctx.doc.embedJpg(bytes);
  const maxWidth = A4[0] - mm(30);
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = image.width * scale; const height = image.height * scale;
  const captionLines = wrap(attachment.caption || caption || 'Без подписи', ctx.font, 8.5, maxWidth);
  const required = height + captionLines.length * 11 + 18;
  if (ctx.y - required < mm(20)) newPage(ctx, '', number);
  ctx.page.drawImage(image, { x: (A4[0] - width) / 2, y: ctx.y - height, width, height });
  ctx.y -= height + 11;
  for (const line of captionLines) { ctx.page.drawText(line, { x: mm(15), y: ctx.y, size: 8.5, font: ctx.font, color: muted }); ctx.y -= 11; }
  ctx.y -= 10;
}

export async function generateDefectPdf(record: Defect): Promise<{ blob: Blob; filename: string }> {
  const ctx = await context();
  header(ctx, `ЗАМЕЧАНИЕ\nО ВЫЯВЛЕННОМ НЕДОСТАТКЕ`, record.number);
  field(ctx, 'Сведения', `Дата: ${formatDate(record.date)}    Статус: ${record.status}    Критичность: ${record.severity}`, '', record.number);
  field(ctx, 'Объект', `${record.object.gp ? `${record.object.gp} ГП — ` : ''}${record.object.name}`, '', record.number);
  field(ctx, 'Место / оборудование', record.location, '', record.number);
  field(ctx, 'Раздел и вид работ', `${record.discipline}${record.workType ? ` • ${record.workType}` : ''}`, '', record.number);
  field(ctx, 'Подрядчик', record.contractor, '', record.number);
  field(ctx, 'Описание недостатка', record.description, '', record.number);
  field(ctx, 'Рабочая документация', record.drawings.map(x => `${x.code}${x.sheet ? `, лист ${x.sheet}` : ''}${x.node ? `, ${x.node}` : ''}`).join('\n'), '', record.number);
  field(ctx, 'Нормативная документация', record.ntd.map(x => `${x.title} — п. ${x.clauses}${x.note ? ` (${x.note})` : ''}`).join('\n'), '', record.number);
  field(ctx, 'Указания по устранению', record.resolution, '', record.number);
  field(ctx, 'Сроки', `Плановый: ${formatDate(record.plannedDate)}    Фактический: ${formatDate(record.resolvedDate ?? '')}`, '', record.number);
  field(ctx, 'Кем выдано', record.issuer, '', record.number);
  if (record.status === 'Черновик') ctx.page.drawText('ЧЕРНОВИК', { x: mm(44), y: mm(125), size: 58, rotate: degrees(35), font: ctx.bold, color: rgb(.85, .85, .85), opacity: .35 });
  for (let i = 0; i < record.defectPhotoIds.length; i++) await imageBlock(ctx, record.defectPhotoIds[i], `Фото ${i + 1}. Недостаток`, record.number);
  for (let i = 0; i < record.resolvedPhotoIds.length; i++) await imageBlock(ctx, record.resolvedPhotoIds[i], `Фото ${i + 1}. После устранения`, record.number);
  field(ctx, 'Подпись', '\n_______________________ / _______________________', '', record.number);
  footer(ctx);
  return result(ctx.doc, `${record.number}_${record.object.gp || 'объект'}_${record.date}`);
}

export async function generateInspectionPdf(record: Inspection): Promise<{ blob: Blob; filename: string }> {
  const ctx = await context(); header(ctx, 'ОТЧЁТ О ПРОВЕРКЕ', record.number);
  field(ctx, 'Вид контроля', record.kind, '', record.number);
  field(ctx, 'Дата и объект', `${formatDateTime(record.dateTime)} • ${record.object.gp} ГП — ${record.object.name}`, '', record.number);
  field(ctx, 'Место / оборудование', record.location, '', record.number);
  field(ctx, 'Подрядчик и представитель', `${record.contractor}\n${record.contractorRepresentative}`, '', record.number);
  field(ctx, 'Основание', record.basis, '', record.number);
  for (const [key, value] of Object.entries(record.details)) if (value) field(ctx, detailLabel(key), value, '', record.number);
  if (record.kind === 'Комплексное опробование') record.scenarioSteps.forEach((step, index) => field(ctx, `Шаг ${index + 1} — ${step.result}`, `${step.event}\nКоманда: ${step.command}\nОжидается: ${step.expected}\nФактически: ${step.actual}`, '', record.number));
  field(ctx, 'Результат', record.result, '', record.number);
  field(ctx, 'Описание / замечания', record.description, '', record.number);
  if (record.revisitDate) field(ctx, 'Повторное предъявление', formatDate(record.revisitDate), '', record.number);
  for (let i = 0; i < record.photoIds.length; i++) await imageBlock(ctx, record.photoIds[i], `Фото ${i + 1}`, record.number);
  field(ctx, 'Участники и подписи', `${record.engineer}  ____________________\n${record.contractorRepresentative || 'Представитель подрядчика'}  ____________________`, '', record.number);
  footer(ctx); return result(ctx.doc, `${record.number}_${record.object.gp || 'проверка'}_${record.dateTime.slice(0, 10)}`);
}

export async function generatePhotoReportPdf(record: PhotoReport, onProgress?: (value: number) => void): Promise<{ blob: Blob; filename: string }> {
  const ctx = await context();
  const capacity = record.photosPerPage;
  const chunks: ReportPhoto[][] = [];
  for (let i = 0; i < record.photos.length; i += capacity) chunks.push(record.photos.slice(i, i + capacity));
  if (!chunks.length) chunks.push([]);
  ctx.doc.removePage(0);
  const longCaptions: Array<{ index: number; text: string }> = [];
  for (let p = 0; p < chunks.length; p++) {
    const page = ctx.doc.addPage(A4); ctx.page = page; ctx.pageNumber = p + 1;
    photoHeader(ctx, record);
    const cols = capacity === 1 || capacity === 2 ? 1 : 2;
    const rows = capacity === 1 ? 1 : capacity === 2 ? 2 : capacity === 4 ? 2 : 3;
    const gap = mm(5.5); const x0 = mm(20); const top = A4[1] - mm(36); const bottom = mm(20);
    const cellW = (mm(170) - gap * (cols - 1)) / cols;
    const cellH = (top - bottom - gap * (rows - 1)) / rows;
    for (let i = 0; i < chunks[p].length; i++) {
      const photo = chunks[p][i]; const globalIndex = p * capacity + i;
      const col = i % cols; const row = Math.floor(i / cols);
      const x = x0 + col * (cellW + gap); const cellTop = top - row * (cellH + gap);
      const captionLines = wrap(`Фото ${globalIndex + 1}. ${photo.caption || 'Без подписи'}`, ctx.font, 8, cellW);
      const visible = captionLines.slice(0, 3); if (captionLines.length > 3) longCaptions.push({ index: globalIndex + 1, text: photo.caption });
      const captionH = Math.max(13, visible.length * 10 + 3); const maxImageH = cellH - captionH;
      const attachment = await db.attachments.get(photo.attachmentId);
      if (!attachment) { page.drawRectangle({ x, y: cellTop - maxImageH, width: cellW, height: maxImageH, color: rgb(.95, .95, .95), borderColor: border, borderWidth: .5 }); page.drawText('Файл фотографии отсутствует', { x: x + 8, y: cellTop - maxImageH / 2, size: 8, font: ctx.font, color: muted }); }
      else {
        const image = await ctx.doc.embedJpg(await attachment.documentBlob.arrayBuffer());
        const rotated = photo.rotation === 90 || photo.rotation === 270;
        const naturalW = rotated ? image.height : image.width; const naturalH = rotated ? image.width : image.height;
        const scale = Math.min(cellW / naturalW, maxImageH / naturalH);
        const w = naturalW * scale; const h = naturalH * scale;
        const desiredX = x + (cellW - w) / 2; const desiredY = cellTop - h;
        if (photo.rotation === 90) page.drawImage(image, { x: desiredX + w, y: desiredY, width: h, height: w, rotate: degrees(90) });
        else if (photo.rotation === 180) page.drawImage(image, { x: desiredX + w, y: cellTop, width: w, height: h, rotate: degrees(180) });
        else if (photo.rotation === 270) page.drawImage(image, { x: desiredX, y: cellTop, width: h, height: w, rotate: degrees(270) });
        else page.drawImage(image, { x: desiredX, y: desiredY, width: w, height: h });
      }
      visible.forEach((line, lineIndex) => page.drawText(line, { x, y: cellTop - maxImageH - 10 - lineIndex * 10, size: 8, font: ctx.font, color: navy }));
      onProgress?.(Math.round(((globalIndex + 1) / Math.max(1, record.photos.length)) * 90));
    }
    footer(ctx);
  }
  if (longCaptions.length) {
    ctx.page = ctx.doc.addPage(A4); ctx.pageNumber += 1; header(ctx, 'ПОДПИСИ К ФОТОГРАФИЯМ', record.number);
    for (const item of longCaptions) field(ctx, `Фото ${item.index}`, item.text, '', record.number);
    footer(ctx);
  }
  onProgress?.(100); return result(ctx.doc, `${record.number}_${record.title || 'фотоотчёт'}_${record.date}`);
}

function photoHeader(ctx: Context, record: PhotoReport): void {
  ctx.page.drawText(record.title || 'ФОТООТЧЁТ', { x: mm(20), y: A4[1] - mm(17), size: 14, font: ctx.bold, color: navy });
  ctx.page.drawText(`${record.number} • ${formatDate(record.date)}`, { x: mm(20), y: A4[1] - mm(24), size: 8.5, font: ctx.font, color: muted });
  ctx.page.drawLine({ start: { x: mm(20), y: A4[1] - mm(29) }, end: { x: A4[0] - mm(20), y: A4[1] - mm(29) }, thickness: 1, color: blue });
}

function detailLabel(key: string): string { return ({ operation: 'Операция / этап', parameter: 'Контролируемый параметр', normative: 'Проектное значение', actual: 'Фактическое значение', method: 'Способ контроля', instrument: 'Инструмент / прибор', serial: 'Номер прибора', calibration: 'Поверка до', volume: 'Предъявленный объём', documentation: 'Исполнительная документация', tests: 'Результаты испытаний', equipment: 'Оборудование / система', program: 'Программа / методика', protocol: 'Протокол', duration: 'Продолжительность', participants: 'Участники' } as Record<string, string>)[key] ?? key; }
function formatDate(value: string): string { if (!value) return '—'; const [y, m, d] = value.slice(0, 10).split('-'); return `${d}.${m}.${y}`; }
function formatDateTime(value: string): string { return value ? `${formatDate(value)} ${value.slice(11, 16)}` : '—'; }
async function result(doc: PDFDocument, filename: string) { const bytes = await doc.save({ useObjectStreams: true }); return { blob: new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' }), filename: `${safeFileName(filename)}.pdf` }; }
