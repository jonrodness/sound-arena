const track = require('./track');

test('increments specified timepoints', () => {
  const initialTrackScore = ['5/7', '5/7', '6/7', '3/4'];
  const finalTrackScore = ['6/8', '6/8', '7/8', '3/4'];
  expect(track.updatedScore(
    initialTrackScore,
    start = 0,
    end = 3,
    isWinner = true,
  )).toEqual(finalTrackScore);
});

test('increments specified timepoints', () => {
  const initialTrackScore = ['5/7', '5/7', '6/7', '3/4'];
  const finalTrackScore = ['5/8', '5/8', '6/8', '3/4'];
  expect(track.updatedScore(
    initialTrackScore,
    start = 0,
    end = 3,
    isWinner = false,
  )).toEqual(finalTrackScore);
});
