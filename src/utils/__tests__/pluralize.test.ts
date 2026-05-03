import { getRussianPlural } from '@/src/utils/pluralize';

describe('getRussianPlural', () => {
  it('returns correct form for 1, 2-4, 5+', () => {
    expect(getRussianPlural(1, 'комментарий', 'комментария', 'комментариев')).toBe('комментарий');
    expect(getRussianPlural(2, 'комментарий', 'комментария', 'комментариев')).toBe('комментария');
    expect(getRussianPlural(4, 'комментарий', 'комментария', 'комментариев')).toBe('комментария');
    expect(getRussianPlural(5, 'комментарий', 'комментария', 'комментариев')).toBe('комментариев');
  });

  it('handles 11-14 as many', () => {
    expect(getRussianPlural(11, 'лайк', 'лайка', 'лайков')).toBe('лайков');
    expect(getRussianPlural(14, 'лайк', 'лайка', 'лайков')).toBe('лайков');
  });

  it('handles negative values', () => {
    expect(getRussianPlural(-1, 'лайк', 'лайка', 'лайков')).toBe('лайк');
    expect(getRussianPlural(-22, 'лайк', 'лайка', 'лайков')).toBe('лайка');
  });
});
