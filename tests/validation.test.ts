import { describe, expect, it } from 'vitest';
import { createDefect } from '../src/types/models';
import { isOverdue, validateDefectForIssue } from '../src/services/validation';

describe('валидация замечания', () => {
  it('разрешает пустой черновик, но показывает поля для выдачи', () => expect(validateDefectForIssue(createDefect('РКС-000001')).length).toBeGreaterThan(5));
  it('не считает закрытую карточку просроченной', () => { const item = createDefect('РКС-000001'); item.plannedDate = '2020-01-01'; item.status = 'Закрыто'; expect(isOverdue(item, new Date('2026-01-01'))).toBe(false); });
});
