import type { Defect, Inspection, PhotoReport } from '../types/models';
import { isOverdue } from './validation';

export type SortMode = 'new' | 'old' | 'number' | 'due' | 'object';
export interface JournalFilters {
  overdue: boolean;
  severity: string;
  object: string;
  contractor: string;
  discipline: string;
  kind: string;
  from: string;
  to: string;
  photos: 'any' | 'with' | 'without';
  sort: SortMode;
}

export const emptyFilters = (): JournalFilters => ({ overdue: false, severity: '', object: '', contractor: '', discipline: '', kind: '', from: '', to: '', photos: 'any', sort: 'new' });

export function applyJournalFilters(records: Array<Defect | Inspection | PhotoReport>, filters: JournalFilters): Array<Defect | Inspection | PhotoReport> {
  const normalized = (value: string) => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  const hasPhotos = (record: Defect | Inspection | PhotoReport) => record.type === 'defect' ? record.defectPhotoIds.length + record.resolvedPhotoIds.length > 0 : record.type === 'inspection' ? record.photoIds.length > 0 : record.photos.length > 0;
  const date = (record: Defect | Inspection | PhotoReport) => record.type === 'inspection' ? record.dateTime.slice(0, 10) : record.date;
  const filtered = records.filter(record => {
    if (filters.overdue && (record.type !== 'defect' || !isOverdue(record))) return false;
    if (filters.severity && (record.type !== 'defect' || record.severity !== filters.severity)) return false;
    if (filters.kind && (record.type !== 'inspection' || record.kind !== filters.kind)) return false;
    if (filters.object && (record.type === 'photoReport' || !normalized(`${record.object.gp} ${record.object.name}`).includes(normalized(filters.object)))) return false;
    if (filters.contractor && (record.type === 'photoReport' || !normalized(record.contractor).includes(normalized(filters.contractor)))) return false;
    if (filters.discipline && (record.type === 'photoReport' || !normalized(record.discipline).includes(normalized(filters.discipline)))) return false;
    if (filters.from && date(record) < filters.from) return false;
    if (filters.to && date(record) > filters.to) return false;
    if (filters.photos === 'with' && !hasPhotos(record)) return false;
    if (filters.photos === 'without' && hasPhotos(record)) return false;
    return true;
  });
  return filtered.sort((a, b) => {
    if (filters.sort === 'old') return a.updatedAt.localeCompare(b.updatedAt);
    if (filters.sort === 'number') return a.number.localeCompare(b.number, 'ru', { numeric: true });
    if (filters.sort === 'due') return (a.type === 'defect' ? a.plannedDate : '').localeCompare(b.type === 'defect' ? b.plannedDate : '');
    if (filters.sort === 'object') return (a.type === 'photoReport' ? a.title : `${a.object.gp} ${a.object.name}`).localeCompare(b.type === 'photoReport' ? b.title : `${b.object.gp} ${b.object.name}`, 'ru', { numeric: true });
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}
