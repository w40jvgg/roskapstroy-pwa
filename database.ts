import Dexie, { type EntityTable } from 'dexie';
import type { AppSetting, Attachment, Counter, Defect, DirectoryItem, Inspection, PhotoReport } from '../types/models';

class RoskapstroyDatabase extends Dexie {
  defects!: EntityTable<Defect, 'id'>;
  inspections!: EntityTable<Inspection, 'id'>;
  photoReports!: EntityTable<PhotoReport, 'id'>;
  attachments!: EntityTable<Attachment, 'id'>;
  dictionaries!: EntityTable<DirectoryItem, 'id'>;
  settings!: EntityTable<AppSetting, 'key'>;
  counters!: EntityTable<Counter, 'key'>;
  drafts!: EntityTable<{ id: string; module: string; data: unknown; updatedAt: string }, 'id'>;
  metadata!: EntityTable<{ key: string; value: unknown }, 'key'>;
  photoRecords!: EntityTable<Record<string, unknown>, 'id'>;

  constructor() {
    super('roskapstroy');
    this.version(1).stores({ defects: 'id,number,updatedAt,status', photoRecords: 'id,number,updatedAt' });
    this.version(2).stores({
      defects: 'id,number,updatedAt,status,plannedDate,object.gp,contractor,discipline',
      inspections: 'id,number,updatedAt,kind,result,object.gp,contractor',
      photoReports: 'id,number,updatedAt,date',
      attachments: 'id,createdAt,mimeType',
      dictionaries: 'id,type,value,hidden',
      settings: 'key', counters: 'key', drafts: 'id,module,updatedAt', metadata: 'key',
      photoRecords: 'id,number,updatedAt'
    }).upgrade(async tx => {
      const legacy = await tx.table('defects').toArray() as Array<Record<string, unknown>>;
      for (const row of legacy) {
        const status = row.status === 'Открыто' ? 'В работе' : row.status;
        await tx.table('defects').put({ ...row, status, legacyStatus: row.status === 'Открыто' ? 'Открыто' : row.legacyStatus });
      }
      const oldPhotoRecords = await tx.table('photoRecords').toArray() as Array<Record<string, unknown>>;
      for (const old of oldPhotoRecords) {
        const id = typeof old.id === 'string' ? old.id : crypto.randomUUID();
        const already = await tx.table('photoReports').get(id);
        if (already) continue;
        const now = new Date().toISOString();
        await tx.table('photoReports').put({ id, type: 'photoReport', number: typeof old.number === 'string' ? old.number : `ФО-LEGACY-${id.slice(0, 6)}`, createdAt: typeof old.createdAt === 'string' ? old.createdAt : now, updatedAt: typeof old.updatedAt === 'string' ? old.updatedAt : now, revision: 1, date: typeof old.date === 'string' ? old.date.slice(0, 10) : now.slice(0, 10), title: typeof old.title === 'string' ? old.title : 'Импортированная фотофиксация', description: typeof old.description === 'string' ? old.description : '', photosPerPage: 2, photos: [], legacy: old });
      }
      await tx.table('metadata').put({ key: 'schemaVersion', value: 2 });
    });
  }
}

export const db = new RoskapstroyDatabase();

export async function nextNumber(module: 'defects' | 'inspections' | 'photoReports'): Promise<string> {
  const prefixes = { defects: 'РКС', inspections: 'ПРВ', photoReports: 'ФО' } as const;
  return db.transaction('rw', db.counters, async () => {
    const row = await db.counters.get(module);
    const value = (row?.value ?? 0) + 1;
    await db.counters.put({ key: module, value });
    return `${prefixes[module]}-${String(value).padStart(6, '0')}`;
  });
}

export async function initializeDatabase(): Promise<void> {
  await db.open();
  await db.metadata.put({ key: 'lastOpenedAt', value: new Date().toISOString() });
  try { await navigator.storage?.persist?.(); } catch { /* Browser may decline persistent storage. */ }
}
