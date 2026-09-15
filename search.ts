import type { Defect, Inspection, PhotoReport } from '../types/models';

export function normalizeSearch(value: string): string {
  return value.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[–—‑-]/g, '-').replace(/\s+/g, ' ').replace(/(\d+)\s*[- ]?гп/g, '$1 гп').trim();
}

export function recordSearchText(record: Defect | Inspection | PhotoReport): string {
  if (record.type === 'defect') return normalizeSearch([record.number, record.object.gp, `${record.object.gp} ГП`, record.object.name, record.location, record.contractor, record.description, record.discipline, record.ntd.map(x => `${x.title} ${x.clauses}`).join(' '), record.drawings.map(x => x.code).join(' ')].join(' '));
  if (record.type === 'inspection') return normalizeSearch([record.number, record.object.gp, `${record.object.gp} ГП`, record.object.name, record.location, record.contractor, record.description, record.discipline, record.kind].join(' '));
  return normalizeSearch([record.number, record.title, record.description, record.photos.map(x => x.caption).join(' ')].join(' '));
}

export function matchesSearch(record: Defect | Inspection | PhotoReport, query: string): boolean {
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const text = recordSearchText(record);
  return terms.every(term => text.includes(term));
}
