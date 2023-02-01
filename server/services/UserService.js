const { getAvailableTrack } = require('../db/track');
const persistLikedTrack = require('../db/user').likeTrack;

const likeTrack = async (userId, trackId) => {
  try {
    const track = await getAvailableTrack(trackId);
    if (track) {
      await persistLikedTrack(userId, trackId);
    } else {
      throw new Error();
    }
  } catch (e) {
    throw e;
  }
};

module.exports = {
  likeTrack,
};
