const trackQueries = require('../db/track');

module.exports = {
  verifyTrackOwner: async (userId, trackId) => {
    const track = await trackQueries.getTrack(trackId);

    if (track.user_id != userId) {
      throw new Error('You are not authorized to take such action with this track');
    }
  },
};
