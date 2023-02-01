const bluebird = require('bluebird');
const redis = require('redis');
const fs = require('fs');
const path = require('path');

const nextTrackScriptPath = path.resolve(__dirname, '../lua/next-track.lua');
const enqueueTrackScriptPath = path.resolve(__dirname, '../lua/enqueue-track.lua');
const pushTrackScriptPath = path.resolve(__dirname, '../lua/push-track.lua');
const checkEntryExistsScriptPath = path.resolve(__dirname, '../lua/check-entry-exists.lua');

const {
  getGenres,
  getRecentlyEnteredTracks,
} = require('../db/competition');
const { getTodayPlayedCount } = require('../db/track');

const MINIMUM_COMPETITION_ENTRIES_CONSUMED = parseInt(process.env.MINIMUM_COMPETITION_ENTRIES_CONSUMED);

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;

class OutOfTracksError extends Error {
  constructor(message) {
    super(message);
  }
}

bluebird.promisifyAll(redis.RedisClient.prototype);

const redisConfig = {
  port,
  host,
};

const redisClient = redis.createClient(redisConfig);

const REDIS_KEYS = {};

const generateRedisKeys = () => {
  const genres = getGenres();
  genres.forEach((genre) => {
    REDIS_KEYS[genre] = {
      priorityQueue: `${genre}-priority`,
      backupQueue: `${genre}-backup`,
      hash: `${genre}-hash`,
    };
  });
};

redisClient.on('error', (err) => {
  console.error(err);
});

const constructTrackEntry = (trackId, userId) => `${trackId}|${userId}`;

const parseTrackEntry = (trackEntry) => {
  const entryComponents = trackEntry.split('|');

  return {
    trackId: parseInt(entryComponents[0]),
    artistId: parseInt(entryComponents[1]),
  };
};

/**
 * Checks the competition state for a track and returns the appropriate queue key.
 * If track has received minimum number of plays for a given competition, the backup
 * queue is the appropriate redis key, otherwise the priority queue
 *
 * @param {String} genre The genre of the queue to pop from
 * @param {String} trackId The id of the track to check the competition state
 * @param {String} genre The genre to check the competition state for
 * @return {String} The priority or backup redis key for a competition
 */
const resolveRedisKey = async (trackId, genre) => {
  const playedCount = await getTodayPlayedCount(trackId, genre);
  const redisKey = playedCount >= MINIMUM_COMPETITION_ENTRIES_CONSUMED
    ? REDIS_KEYS[genre].backupQueue
    : REDIS_KEYS[genre].priorityQueue;

  return redisKey;
};

const refillBackupQueue = async (genre) => {
  console.info('REFILL_QUEUE_EVENT', `genre: ${genre}`);
  const recentlyEnteredTracks = await getRecentlyEnteredTracks(genre, 20);
  const redisKey = REDIS_KEYS[genre].backupQueue;

  recentlyEnteredTracks.forEach(async (track) => {
    const entry = constructTrackEntry(track.trackId, track.userId);
    await redisClient.evalAsync(
      fs.readFileSync(enqueueTrackScriptPath),
      1,
      redisKey,
      entry,
    );
  });
};

function init() {
  generateRedisKeys();
}

init();

module.exports = {
  OutOfTracksError,
  /**
     * Returns the next trackId from a queue. The priority-queue for a genre is checked first
	 * If no tracks available in priority-queue, backup-queue is checked. If no tracks available
	 * in backup-queue, refill backup-queue, then re-check backup-queue
     *
     * @param {String} genre The genre of the queue to pop from
	 * @param {String} userId The id of the user requesting the next track
     * @return {String or null} trackId The id of the next track in the queue or null if no tracks available
     */
  getNextTrackId: async (genre, userId, options) => {
    const excludedTrackId = options.competitorTrackId || '-1';
    async function getNextTrackByKey(redisKey) {
      const nextEntry = await redisClient.evalAsync(
        fs.readFileSync(nextTrackScriptPath),
        1,
        redisKey,
        userId,
        excludedTrackId,
      );

      return nextEntry;
    }
    // Accept trackId blacklist (to prevent same track competing against itself)
    let nextTrackEntry = null;
    let nextTrackId = null;
    const redisPriorityKey = REDIS_KEYS[genre].priorityQueue;
    const redisBackupKey = REDIS_KEYS[genre].backupQueue;

    nextTrackEntry = await getNextTrackByKey(redisPriorityKey);

    if (!nextTrackEntry) {
      // Get from backup queue
      nextTrackEntry = await getNextTrackByKey(redisBackupKey);
    }

    if (!nextTrackEntry) {
      // Refill backup queue and try to get from backup again
      await refillBackupQueue(genre);
      nextTrackEntry = await getNextTrackByKey(redisBackupKey);
    }

    if (!nextTrackEntry) {
      // Out of tracks
      throw new OutOfTracksError();
    }

    nextTrackId = parseTrackEntry(nextTrackEntry).trackId;
    return nextTrackId;
  },

  /**
     * Enqueues track at the end of the queue determined appropriate based on `resolveRedisKey`
     */
  enqueueTrack: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }
    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = await resolveRedisKey(trackId, genre);

    const res = await redisClient.evalAsync(
      fs.readFileSync(enqueueTrackScriptPath),
      1,
      redisKey,
      trackEntry,
    );

    return res;
  },

  /**
     * Pushes the track to the front of the queue determined appopriate based on `resolveRedisKey`
     */
  pushTrack: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }
    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = await resolveRedisKey(trackId, genre);

    const res = await redisClient.evalAsync(
      fs.readFileSync(pushTrackScriptPath),
      1,
      redisKey,
      trackEntry,
    );

    return res;
  },

  enqueueTrackInPriorityQueue: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }

    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = REDIS_KEYS[genre].priorityQueue;

    const res = await redisClient.evalAsync(
      fs.readFileSync(pushTrackScriptPath),
      1,
      redisKey,
      trackEntry,
    );

    return res;
  },

  isTrackEntryInQueue: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }

    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = REDIS_KEYS[genre].priorityQueue;

    // Script returns index of first entry found in list, else NULL if not found
    const index = await redisClient.evalAsync(
      fs.readFileSync(checkEntryExistsScriptPath),
      1,
      redisKey,
      trackEntry,
    );

    return Number.isInteger(index);
  },

  setTrackInHash: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }

    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = REDIS_KEYS[genre].hash;
    const res = await redisClient.hsetAsync(redisKey, trackEntry, 1);

    return res;
  },

  isTrackInHash: async (trackId, userId, genre) => {
    if (!trackId || !userId || !genre) {
      throw new Error('Invalid entry params');
    }

    const trackEntry = constructTrackEntry(trackId, userId);
    const redisKey = REDIS_KEYS[genre].hash;
    const res = await redisClient.hexistsAsync(redisKey, trackEntry);

    return !!res;
  },
};
