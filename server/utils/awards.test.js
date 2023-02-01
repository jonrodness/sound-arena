const { calculatePercentileRank } = require('./awards');

describe('calculatePercentileRank', () => {
  test('returns correct percentile', () => {
    expect(calculatePercentileRank(1, 2)).toEqual(100);
    expect(calculatePercentileRank(2, 25)).toEqual(96);
    expect(calculatePercentileRank(25, 25)).toEqual(4);
  });
  test('returns 0 if invalid params', () => {
    // Invalid rank
    expect(calculatePercentileRank(-1, 25)).toEqual(0);
    expect(calculatePercentileRank('invalid', 25)).toEqual(0);
    expect(calculatePercentileRank(1.3, 25)).toEqual(0);
    expect(calculatePercentileRank(0, 25)).toEqual(0);

    // Invalid totalParticipants
    expect(calculatePercentileRank(1, 0)).toEqual(0);
    expect(calculatePercentileRank(1, 25.6)).toEqual(0);
    expect(calculatePercentileRank(1, 'invalid')).toEqual(0);
    expect(calculatePercentileRank(1, -1)).toEqual(0);
  });
});
