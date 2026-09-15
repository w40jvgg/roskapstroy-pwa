import { describe, expect, it } from 'vitest';
import { applyJournalFilters, emptyFilters } from '../src/services/filters';
import { createDefect } from '../src/types/models';

describe('фильтры журнала', () => {
  it('отбирает критические замечания с фотографиями', () => {
    const ordinary = createDefect('РКС-000001');
    const critical = createDefect('РКС-000002'); critical.severity = 'Критическое'; critical.defectPhotoIds = ['photo'];
    const filters = { ...emptyFilters(), severity: 'Критическое', photos: 'with' as const };
    expect(applyJournalFilters([ordinary, critical], filters).map(item => item.number)).toEqual(['РКС-000002']);
  });
});
