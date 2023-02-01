const mysql = require('mysql');
const competitionQueries = require('../db/competition');
const db = require('../db/mysql');
const { pushTrack } = require('../services/QueueService');
const { matchupExpiryInMinutes } = require('../conf');

const MINIMUM_COMPETITION_ENTRIES = parseInt(process.env.MINIMUM_COMPETITION_ENTRIES);
const MINIMUM_COMPETITION_ENTRIES_CONSUMED = parseInt(process.env.MINIMUM_COMPETITION_ENTRIES_CONSUMED);
const EXTRA_COMPETITION_RULES = process.env.EXTRA_COMPETITION_RULES === 'true';
// Set skipped tracks to yesterday
const SKIPPED_TRACKS_INSERT_DATE = 'curDate() - 1';
const YESTERDATE_MYSQL_DATE = 'curDate() - 1';

class DuplicateCompetitionResultsError extends Error {
  constructor(message) {
    super(message);
  }
}

const getYesterdayMatchupsQuery = (genre) => `
    SELECT losing_track_id AS losingTrackId, winning_track_id AS winningTrackId, entered_track_id AS enteredTrackId
    FROM matchup
    WHERE genre = '${genre}' AND timestamp_added BETWEEN curdate()-1 AND curdate();
`;

const getYesterdayAwardsCount = async () => {
  const query = 'select count(*) AS count from award where date BETWEEN curdate()-1 AND curdate();';
  const results = await db.queryAsync(query);
  return results;
};

const getYesterdayCompetitionResultsCount = async () => {
  const query = 'select count(*) AS count from competition_results where date BETWEEN curdate()-1 AND curdate();';
  const results = await db.queryAsync(query);
  return results;
};

const getYesterdaySkippedCount = async () => {
  const query = 'select count(*) AS count from skipped_tracks where date_skipped BETWEEN curdate()-1 AND curdate();';
  const results = await db.queryAsync(query);
  return results;
};

const saveAwards = async (sortedTracks, genre) => {
  const totalParticipants = sortedTracks.length;
  sortedTracks.forEach(async (track, index) => {
    const place = index + 1;
    const insertAwardQuery = `
            INSERT INTO award (track_id, date, wins, losses, place, total_participants, genre, acknowledged) 
            VALUES (${track.id}, ${YESTERDATE_MYSQL_DATE}, ${track.wins}, ${track.losses}, ${place}, ${totalParticipants}, '${genre}', 0);
        `;
    await db.queryAsync(insertAwardQuery);
  });
};

const saveCompetitionResults = async (sortedTracks, genre) => {
  sortedTracks.forEach(async (track, index) => {
    const place = index + 1;
    const insertCompetitionResultsQuery = `
            INSERT INTO competition_results (track_id, date, wins, losses, place, entries, genre) 
            VALUES (${track.id}, ${YESTERDATE_MYSQL_DATE}, ${track.wins}, ${track.losses}, ${place}, ${track.entries}, '${genre}');
        `;

    await db.queryAsync(insertCompetitionResultsQuery);
  });
};

const getExpiredMatchupTracks = async (curDate, genre) => {
  const expiredMatchupTrackIds = [];
  const query = `
        SELECT competition_track_1_id AS track1Id, competition_track_2_id AS track2Id
        FROM user 
        WHERE 
            competition_tracks_checked_out = 1
            AND competition_genre = '${genre}'
            AND timestampdiff(minute, competition_timestamp_start, '${curDate}') > ${matchupExpiryInMinutes};`;

  const results = await db.queryAsync(query);

  results.forEach((row) => {
    if (row.track1Id) {
      expiredMatchupTrackIds.push(row.track1Id);
    }

    if (row.track2Id) {
      expiredMatchupTrackIds.push(row.track2Id);
    }
  });

  return {
    expiredMatchupTrackIds,
    expiredMatchupsCount: results.length,
  };
};

const getCurDateTime = async () => {
  const query = 'SELECT DATE_FORMAT(NOW(),\'%Y-%m-%d %H:%i:%s\') AS now;';
  const results = await db.queryAsync(query);
  return results[0].now;
};

const setExpiredMatchupTracksReturned = async (curDateTime, genre) => {
  const query = `
        UPDATE user
        SET competition_tracks_checked_out = 0
        WHERE
            competition_tracks_checked_out = 1
            AND competition_genre = '${genre}'
            AND timestampdiff(minute, competition_timestamp_start, '${curDateTime}') > ${matchupExpiryInMinutes};       
    `;
  const res = await db.queryAsync(query);

  return res.affectedRows;
};

const getQueueParams = async (trackIds) => {
  const trackIdsString = trackIds.join(', ');
  const query = `
        SELECT id, user_id AS userId
        FROM track
        WHERE id IN (${trackIdsString})
    `;

  return await db.queryAsync(query);
};

const trackReachedMinEntriesFilter = (minimumEntries) => function filter(track) {
  return track.entries >= minimumEntries;
};

const trackReachedMinPlaysFilter = (minimumConsumptions) => function filter(track) {
  return (track.wins + track.losses) >= minimumConsumptions;
};

const trackNotReachedMinPlaysFilter = (minimumConsumptions) => function filter(track) {
  return (track.wins + track.losses) < minimumConsumptions;
};

const getMaxEntriesReached = (resultTracks) => {
  const maxEntriesReached = resultTracks.reduce((acc, track) => Math.max(acc, track.entries), -1);

  return maxEntriesReached;
};

const getMostPlays = (resultTracks) => {
  const maxEntriesPlayed = resultTracks.reduce((acc, track) => Math.max(acc, (track.wins + track.losses)), -1);

  return maxEntriesPlayed;
};

const saveSkippedTracks = async (skippedTracks, genre) => {
  skippedTracks.forEach(async (track) => {
    const query = `
            INSERT INTO skipped_tracks (track_id, date_skipped, wins, losses, entries, genre, acknowledged) 
            VALUES (${track.id}, ${SKIPPED_TRACKS_INSERT_DATE}, ${track.wins}, ${track.losses}, ${track.entries}, '${genre}', 0);
        `;

    await db.queryAsync(query);
  });
};

const getPreviouslySkippedTracksQuery = (genre) => (
  `
            SELECT track_id AS trackId, wins, losses, entries
            FROM skipped_tracks
            WHERE genre = '${genre}';
        `
);

// Returns count of deleted records
const deletePreviouslySkippedTracks = async (genre) => {
  const query = `
        DELETE FROM skipped_tracks
        WHERE genre = '${genre}' AND date_skipped < ${SKIPPED_TRACKS_INSERT_DATE}
    `;

  const results = await db.queryAsync(query);
  return results.affectedRows;
};

// Returns the number of previously skipped tracks
const addPreviouslySkippedToTracks = async (tracks, genre) => {
  let count = 0;

  function addPreviouslySkippedToCount(row) {
    tracks[row.trackId] = tracks[row.trackId] || {
      wins: 0,
      losses: 0,
      entries: 0,
    };

    tracks[row.trackId].wins += row.wins;
    tracks[row.trackId].losses += row.losses;
    tracks[row.trackId].entries += row.entries;
  }

  return new Promise(async (resolve, reject) => {
    const previouslySkippedTracksQuery = getPreviouslySkippedTracksQuery(genre);
    const previouslySkippedTracksStream = await db.queryForStream(previouslySkippedTracksQuery);
    previouslySkippedTracksStream.on('result', (row) => {
      addPreviouslySkippedToCount(row);
      count++;
    });
    previouslySkippedTracksStream.on('end', async () => {
      resolve(count);
    });
    previouslySkippedTracksStream.on('error', async (err) => {
      reject(err);
    });
  });
};

module.exports = {
  DuplicateCompetitionResultsError,
  // 1. Add skipped tracks to count
  // 2. Iterate through all of yesterday's matchups and for each genre, keep a count of
  //    each track's wins, losses and entries.
  // 3. For each track that meet requirements, set an `award` record and `competition_result` record in db
  // 4. For elgible tracks that did not have enough plays - add them to the `skipped-tracks` table
  // 5. Delete older skipped tracks
  finalizeCompetition: async (req, res) => {
    try {
      const yesterdayAwardsCount = await getYesterdayAwardsCount();
      const yesterdayCompetitionResultsCount = await getYesterdayCompetitionResultsCount();
      const yesterdaySkippedCount = await getYesterdaySkippedCount();

      // If there are already competition results or awards from yesterday, job has already run, so throw error and short circuit
      // TODO: there may be no results from yesterday if no new competitions, so this would never yield DuplicateCompetitionResultsError
      if (yesterdayAwardsCount[0].count > 0 || yesterdayCompetitionResultsCount[0].count > 0 || yesterdaySkippedCount[0].count > 0) {
        throw new DuplicateCompetitionResultsError('Invalid request');
      }
    } catch (err) {
      throw err;
    }

    const genres = competitionQueries.getGenres();
    // Create a table to keep count of results for each genre
    const competitionResults = genres.map((genre) => processYesterdaysMatchups(genre));

    const responseBody = {};

    Promise.all(competitionResults).then((genresResults) => {
      genresResults.forEach((genreResult) => {
        Object.assign(responseBody, genreResult);
      });

      console.log('FINALIZE_COMPETITION', JSON.stringify(responseBody));
      res.status(200).send(responseBody);
    });
  },

  returnAbandonedTracks: async (req, res, next) => {
    const result = {
      expiredMatchupsCount: 0,
      matchupRecordsResetCount: 0,
      skippedTracksCount: 0,
    };
    const genres = await competitionQueries.getGenres();

    const returnTracksForGenre = async (genre) => {
      const curDateTime = await getCurDateTime();
      const {
        expiredMatchupTrackIds,
        expiredMatchupsCount,
      } = await getExpiredMatchupTracks(curDateTime, genre);

      const expiredMatchupTrackIdsLength = expiredMatchupTrackIds.length;
      result.skippedTracksCount += expiredMatchupTrackIdsLength;
      result.expiredMatchupsCount += expiredMatchupsCount;

      if (expiredMatchupTrackIdsLength) {
        const expiredMatchupTrackData = await getQueueParams(expiredMatchupTrackIds);

        expiredMatchupTrackData.forEach(async (track) => {
          await pushTrack(track.id, track.userId, genre);
        });

        const affectedRows = await setExpiredMatchupTracksReturned(curDateTime, genre);

        result.matchupRecordsResetCount += affectedRows;
      }
    };

    for (let i = 0; i < genres.length; i++) {
      await returnTracksForGenre(genres[i]);
    }

    res.status(200).send(result);
  },
};
