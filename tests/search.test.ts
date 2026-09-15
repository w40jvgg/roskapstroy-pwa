import { describe, expect, it } from 'vitest';
import { matchesSearch, normalizeSearch } from '../src/services/search';
import { createDefect } from '../src/types/models';

describe('поиск', () => {
  it('нормализует ё, дефисы и номер ГП', () => expect(normalizeSearch(' 303-ГП Ёлка ')).toBe('303 гп елка'));
  it('ищет по объекту и описанию', () => { const item = createDefect('РКС-000128'); item.object = { gp: '303', name: 'Пересыпная станция №3' }; item.description = 'Отсутствует маркировка кабеля'; expect(matchesSearch(item, '303 гп маркировка')).toBe(true); });
});
