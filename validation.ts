import type { Defect } from '../types/models';

export interface ValidationIssue { field: string; label: string }

export function validateDefectForIssue(record: Defect): ValidationIssue[] {
  const fields: Array<[keyof Defect | 'object', string, boolean]> = [
    ['number', 'Номер', Boolean(record.number.trim())], ['date', 'Дата выявления', Boolean(record.date)], ['object', 'Объект', Boolean(record.object.gp || record.object.name)], ['location', 'Место или оборудование', Boolean(record.location.trim())], ['discipline', 'Раздел работ', Boolean(record.discipline)], ['contractor', 'Подрядчик', Boolean(record.contractor.trim())], ['description', 'Описание недостатка', Boolean(record.description.trim())], ['plannedDate', 'Плановая дата устранения', Boolean(record.plannedDate)], ['issuer', 'Кем выдано', Boolean(record.issuer.trim())]
  ];
  return fields.filter(([, , ok]) => !ok).map(([field, label]) => ({ field: String(field), label }));
}

export function isOverdue(record: Defect, now = new Date()): boolean {
  return Boolean(record.plannedDate && new Date(`${record.plannedDate}T23:59:59`) < now && !['Закрыто', 'Архив'].includes(record.status));
}
