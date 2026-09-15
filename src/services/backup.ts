import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate';
import { db } from '../db/database';
import type { Attachment, Counter, Defect, DirectoryItem, Inspection, PhotoReport } from '../types/models';

interface BackupData {
  defects: Defect[];
  inspections: Inspection[];
  photoReports: PhotoReport[];
  dictionaries: DirectoryItem[];
  settings: Array<{ key: string; value: unknown }>;
  counters: Counter[];
  metadata: Array<{ key: string; value: unknown }>;
  attachments: Array<Omit<Attachment, 'documentBlob' | 'thumbnailBlob' | 'originalBlob'> & { hasOriginal: boolean }>;
}

export interface BackupManifest {
  application: 'РосКапСтрой';
  appVersion: '2.0.0';
  schemaVersion: 2;
  createdAt: string;
  counts: Record<string, number>;
  files: Record<string, string>;
}

async function digest(bytes: Uint8Array): Promise<string> {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(hash)].map(v => v.toString(16).padStart(2, '0')).join('');
}

export async function createBackup(): Promise<Blob> {
  const [defects, inspections, photoReports, attachments, dictionaries, settings, counters, metadata] = await Promise.all([
    db.defects.toArray(), db.inspections.toArray(), db.photoReports.toArray(), db.attachments.toArray(), db.dictionaries.toArray(), db.settings.toArray(), db.counters.toArray(), db.metadata.toArray()
  ]);
  const data: BackupData = { defects, inspections, photoReports, dictionaries, settings, counters, metadata, attachments: attachments.map(({ documentBlob: _d, thumbnailBlob: _t, originalBlob, ...item }) => ({ ...item, hasOriginal: Boolean(originalBlob) })) };
  const files: Record<string, Uint8Array> = { 'data.json': strToU8(JSON.stringify(data)) };
  for (const item of attachments) {
    files[`attachments/${item.id}.jpg`] = new Uint8Array(await item.documentBlob.arrayBuffer());
    files[`attachments/${item.id}.thumb.jpg`] = new Uint8Array(await item.thumbnailBlob.arrayBuffer());
    if (item.originalBlob) files[`attachments/${item.id}.original`] = new Uint8Array(await item.originalBlob.arrayBuffer());
  }
  const checksums: Record<string, string> = {};
  for (const [name, bytes] of Object.entries(files)) checksums[name] = await digest(bytes);
  const manifest: BackupManifest = { application: 'РосКапСтрой', appVersion: '2.0.0', schemaVersion: 2, createdAt: new Date().toISOString(), counts: { defects: defects.length, inspections: inspections.length, photoReports: photoReports.length, attachments: attachments.length }, files: checksums };
  files['manifest.json'] = strToU8(JSON.stringify(manifest, null, 2));
  return new Blob([zipSync(files, { level: 6 }) as Uint8Array<ArrayBuffer>], { type: 'application/zip' });
}

export async function inspectBackup(file: File): Promise<{ manifest: BackupManifest; data: BackupData; files: Record<string, Uint8Array> }> {
  const files = unzipSync(new Uint8Array(await file.arrayBuffer()));
  if (!files['manifest.json'] || !files['data.json']) throw new Error('Архив не содержит manifest.json или data.json');
  const manifest = JSON.parse(strFromU8(files['manifest.json'])) as BackupManifest;
  if (manifest.application !== 'РосКапСтрой' || manifest.schemaVersion > 2) throw new Error('Версия резервной копии не поддерживается');
  const data = JSON.parse(strFromU8(files['data.json'])) as BackupData;
  for (const [name, expected] of Object.entries(manifest.files ?? {})) {
    if (!files[name] || await digest(files[name]) !== expected) throw new Error(`Нарушена целостность файла: ${name}`);
  }
  return { manifest, data, files };
}

export async function restoreBackup(parsed: Awaited<ReturnType<typeof inspectBackup>>, mode: 'merge' | 'replace'): Promise<void> {
  const { data, files } = parsed;
  const attachments: Attachment[] = data.attachments.map(meta => {
    const doc = files[`attachments/${meta.id}.jpg`];
    const thumb = files[`attachments/${meta.id}.thumb.jpg`];
    if (!doc || !thumb) throw new Error(`Не найдено вложение ${meta.id}`);
    const { hasOriginal, ...base } = meta;
    const original = files[`attachments/${meta.id}.original`];
    return { ...base, documentBlob: new Blob([doc as Uint8Array<ArrayBuffer>], { type: meta.mimeType }), thumbnailBlob: new Blob([thumb as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' }), originalBlob: hasOriginal && original ? new Blob([original as Uint8Array<ArrayBuffer>]) : undefined };
  });
  const tables = [db.defects, db.inspections, db.photoReports, db.attachments, db.dictionaries, db.settings, db.counters, db.metadata];
  await db.transaction('rw', tables, async () => {
    if (mode === 'replace') await Promise.all(tables.map(table => table.clear()));
    await db.defects.bulkPut(data.defects ?? []);
    await db.inspections.bulkPut(data.inspections ?? []);
    await db.photoReports.bulkPut(data.photoReports ?? []);
    await db.attachments.bulkPut(attachments);
    await db.dictionaries.bulkPut(data.dictionaries ?? []);
    await db.settings.bulkPut(data.settings ?? []);
    await db.counters.bulkPut(data.counters ?? []);
    await db.metadata.bulkPut(data.metadata ?? []);
  });
  const counts = await Promise.all([db.defects.count(), db.inspections.count(), db.photoReports.count(), db.attachments.count()]);
  if (mode === 'replace' && counts.some((value, index) => value !== [data.defects.length, data.inspections.length, data.photoReports.length, attachments.length][index])) throw new Error('Контрольная проверка количества записей не пройдена');
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
