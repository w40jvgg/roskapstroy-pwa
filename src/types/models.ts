export type ModuleKey = 'defects' | 'inspections' | 'photoReports';
export type DefectStatus = 'Черновик' | 'Выдано' | 'В работе' | 'На проверке' | 'Устранено' | 'Закрыто' | 'Архив';
export type Severity = 'Обычное' | 'Существенное' | 'Критическое';
export type InspectionKind = 'Операционный контроль' | 'Приёмочный контроль' | 'Индивидуальные испытания' | 'Комплексное опробование';
export type InspectionResult = 'Принято' | 'Принято с замечаниями' | 'Не принято' | 'Требуется повторное предъявление';

export interface BaseRecord {
  id: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  revision: number;
  legacy?: Record<string, unknown>;
}

export interface DocumentReference {
  id: string;
  title: string;
  clauses: string;
  note?: string;
}

export interface WorkDrawingReference {
  id: string;
  code: string;
  sheet?: string;
  node?: string;
  note?: string;
}

export interface ObjectRef { id?: string; gp: string; name: string }

export interface Defect extends BaseRecord {
  type: 'defect';
  date: string;
  status: DefectStatus;
  legacyStatus?: string;
  severity: Severity;
  plannedDate: string;
  resolvedDate?: string;
  closedDate?: string;
  signedDate?: string;
  issuer: string;
  object: ObjectRef;
  location: string;
  discipline: string;
  workType: string;
  defectType: string;
  contractor: string;
  description: string;
  resolution: string;
  responsible: string;
  note: string;
  ntd: DocumentReference[];
  drawings: WorkDrawingReference[];
  defectPhotoIds: string[];
  resolvedPhotoIds: string[];
}

export interface ScenarioStep {
  id: string;
  event: string;
  command: string;
  expected: string;
  actual: string;
  result: 'Выполнено' | 'Не выполнено' | 'Не применяется';
}

export interface Inspection extends BaseRecord {
  type: 'inspection';
  dateTime: string;
  kind: InspectionKind;
  object: ObjectRef;
  location: string;
  discipline: string;
  workType: string;
  contractor: string;
  contractorRepresentative: string;
  engineer: string;
  basis: string;
  result: InspectionResult;
  description: string;
  photoIds: string[];
  linkedDefectIds: string[];
  revisitDate?: string;
  details: Record<string, string>;
  scenarioSteps: ScenarioStep[];
}

export interface ReportPhoto { attachmentId: string; caption: string; rotation: 0 | 90 | 180 | 270 }

export interface PhotoReport extends BaseRecord {
  type: 'photoReport';
  date: string;
  title: string;
  description: string;
  photosPerPage: 1 | 2 | 4 | 6;
  photos: ReportPhoto[];
}

export interface Attachment {
  id: string;
  createdAt: string;
  name: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  documentBlob: Blob;
  thumbnailBlob: Blob;
  originalBlob?: Blob;
  checksum?: string;
  caption?: string;
}

export interface DirectoryItem { id: string; type: 'object' | 'contractor' | 'discipline' | 'workType'; value: string; gp?: string; hidden?: boolean; createdAt: string }
export interface AppSetting { key: string; value: unknown }
export interface Counter { key: ModuleKey; value: number }

export const emptyObject = (): ObjectRef => ({ gp: '', name: '' });
export const isoDate = () => new Date().toISOString().slice(0, 10);
export const isoDateTimeLocal = () => new Date().toISOString().slice(0, 16);

export function createDefect(number: string): Defect {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), type: 'defect', number, createdAt: now, updatedAt: now, revision: 1, date: isoDate(), status: 'Черновик', severity: 'Обычное', plannedDate: '', issuer: 'Ведущий инженер ОСК Щипин С.А.', object: emptyObject(), location: '', discipline: '', workType: '', defectType: '', contractor: '', description: '', resolution: '', responsible: '', note: '', ntd: [], drawings: [], defectPhotoIds: [], resolvedPhotoIds: [] };
}

export function createInspection(number: string): Inspection {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), type: 'inspection', number, createdAt: now, updatedAt: now, revision: 1, dateTime: isoDateTimeLocal(), kind: 'Операционный контроль', object: emptyObject(), location: '', discipline: '', workType: '', contractor: '', contractorRepresentative: '', engineer: 'Ведущий инженер ОСК Щипин С.А.', basis: '', result: 'Не принято', description: '', photoIds: [], linkedDefectIds: [], details: {}, scenarioSteps: [] };
}

export function createPhotoReport(number: string): PhotoReport {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), type: 'photoReport', number, createdAt: now, updatedAt: now, revision: 1, date: isoDate(), title: '', description: '', photosPerPage: 2, photos: [] };
}
