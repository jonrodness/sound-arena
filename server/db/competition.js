const mysql = require('mysql');
const db = require('./mysql');
const { escapeQueryVal } = require('./utils');
const { DynamoDbService, S3Service } = require('../services/AWS');
const { TrackService } = require('../services/TrackService');

const trackService = new TrackService(new DynamoDbService(), new S3Service());
const { refillQueueMinScore, minCompetitionEntries } = require('../conf');
const { shuffleArray } = require('../utils/array');

const MATCHUP_DURATION = parseInt(process.env.MATCHUP_DURATION_IN_SECONDS);
const WINNER_DURATION = parseInt(process.env.WINNER_DURATION_IN_SECONDS);

const COMPETITION_COLUMNS = {
  TRACK_1_ID: 'competition_track_1_id',
  TRACK_2_ID: 'competition_track_2_id',
  TRACK_1_IS_PLAYED: 'competition_track_1_is_played',
  TRACK_2_IS_PLAYED: 'competition_track_2_is_played',
  TRACK_1_START: 'competition_track_1_start',
  TRACK_2_START: 'competition_track_2_start',
  WINNER_KEY: 'competition_winner_key',
  WINNER_ARTIST_NAME: 'competition_winner_artist_name',
  WINNER_ARTIST_ID: 'competition_winner_artist_id',
  WINNER_TRACK_TITLE: 'competition_winner_track_title',
  WINNER_IS_PLAYED: 'competition_winner_is_played',
  MATCHUP_DURATION: 'competition_matchup_duration',
  WINNER_DURATION: 'competition_winner_duration',
  ENTERED_TRACK_ID: 'competition_entered_track_id',
  GENRE: 'competition_genre',
  START_TIMESTAMP: 'competition_timestamp_start',
  TRACKS_CHECKED_OUT: 'competition_tracks_checked_out',
  FORCE_RESET: 'competition_force_reset',
};

const GENRES = {
  POP: 'pop',
  RAP_HIP_HOP: 'rap/hip-hop',
  ROCK: 'rock',
  ELECTRONIC: 'electronic',
  COUNTRY: 'country',
  HOUSE: 'house',
  AMBIENT: 'ambient',
  LATIN: 'latin',
  RANDB_SOUL: 'r&b/soul',
  CLASSICAL: 'classical',
  JAZZ: 'jazz',
  REGGAE: 'reggae',
  SOUNDTRACK: 'soundtrack',
  WORLD: 'world',
  OTHER: 'other',
};

const TRACK_KEYS = {
  TRACK_1: 'track1',
  TRACK_2: 'track2',
  WINNER: 'winner',
};

const COMPETITION_STAGES = {
  READY: 'READY',
  TRACK_1: 'TRACK_1',
  TRACK_2: 'TRACK_2',
  WINNER: 'WINNER',
};

/*
* If no track 2 retrieved yet, but track 1 is consumed, stage is considered TRACK_1
*/
const resolveCurrentStage = (competitionState) => (competitionState.winner.key && !competitionState.winner.isPlayed ? COMPETITION_STAGES.WINNER
  : (competitionState.track2.id && competitionState.track1.isPlayed) ? COMPETITION_STAGES.TRACK_2
    : (competitionState.track1.id && !competitionState.track2.id) ? COMPETITION_STAGES.TRACK_1
      : COMPETITION_STAGES.READY);

const getMatchupPlayingTrack = (competitionState) => {
  const currentStage = resolveCurrentStage(competitionState);
  switch (currentStage) {
    case COMPETITION_STAGES.WINNER:
      return competitionState[competitionState.winner.key];
    case COMPETITION_STAGES.TRACK_2:
      return competitionState.track2;
    case COMPETITION_STAGES.TRACK_1:
      return competitionState.track1;
  }
  return null;
};

const getInitialCompetitionState = () => {
  // Set all columns to default values
  const newState = {};

  newState[COMPETITION_COLUMNS.TRACK_1_ID] = null;
  newState[COMPETITION_COLUMNS.TRACK_2_ID] = null;
  newState[COMPETITION_COLUMNS.WINNER_KEY] = null;
  newState[COMPETITION_COLUMNS.TRACK_1_IS_PLAYED] = false;
  newState[COMPETITION_COLUMNS.TRACK_2_IS_PLAYED] = false;
  newState[COMPETITION_COLUMNS.TRACK_1_START] = null;
  newState[COMPETITION_COLUMNS.TRACK_2_START] = null;
  newState[COMPETITION_COLUMNS.MATCHUP_DURATION] = queries.MATCHUP_DURATION;
  newState[COMPETITION_COLUMNS.WINNER_DURATION] = queries.WINNER_DURATION;
  newState[COMPETITION_COLUMNS.ENTERED_TRACK_ID] = null;
  newState[COMPETITION_COLUMNS.GENRE] = null;
  newState[COMPETITION_COLUMNS.TRACKS_CHECKED_OUT] = 0;
  newState[COMPETITION_COLUMNS.START_TIMESTAMP] = null;
  newState[COMPETITION_COLUMNS.WINNER_ARTIST_NAME] = null;
  newState[COMPETITION_COLUMNS.WINNER_TRACK_TITLE] = null;
  newState[COMPETITION_COLUMNS.WINNER_ARTIST_ID] = null;
  newState[COMPETITION_COLUMNS.WINNER_IS_PLAYED] = false;
  newState[COMPETITION_COLUMNS.FORCE_RESET] = 0;

  return newState;
};

const convertCompetitionMapToString = (newState) => {
  let stateString = '';
  const columnsToUpdate = Object.keys(newState);

  columnsToUpdate.forEach((column, i) => {
    const value = newState[column];
    const escapedVal = escapeQueryVal(value);
    stateString = stateString.concat(` ${column} = ${escapedVal}`);
    if (i < columnsToUpdate.length - 1) {
      stateString = stateString.concat(',');
    }
  });

  return stateString;
};

const getNewEntriesFromPrevMatchups = (records) => {
  // Cannot use Array.flatmap in Node 10 (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
  const newEntries = records.reduce((acc, matchup) => {
    // Cap the multiplier so a bad track cannot get many more extra entries if high number of matchups
    const multiplier = Math.min(matchup.numMatchups, minCompetitionEntries);
    // Additional entries for a track equals today score times today number of entries
    const numEntries = Math.ceil(matchup.score * multiplier);
    const entry = {
      trackId: matchup.trackId,
      userId: matchup.userId,
    };
    return acc.concat(Array(numEntries).fill(entry));
  }, []);

  return newEntries;
};

/**
 * Gets today's matchups from competition with current score
 * @param {Object} options:
 *  - limit (max number of records returned)
 * @returns {Array} Each row contains trackId, userId, numMatchups, score
 */
// Example of results:
// +---------+-------------+--------+
// | trackId | numMatchups | score  |
// +---------+-------------+--------+
// |     367 |           1 | 1.0000 |
// |     388 |           5 | 1.0000 |
// |     369 |           1 | 1.0000 |
// |     371 |           1 | 1.0000 |
// |     398 |           3 | 1.0000 |
// |     336 |           1 | 1.0000 |
// |     392 |           6 | 0.8333 |
// |     377 |           6 | 0.8333 |
// |     386 |           5 | 0.8000 |
// +---------+-------------+--------+
const getTodayTrackScoresQuery = (genre, isWinners, options) => {
  const scoreOperator = isWinners ? '>=' : '<';
  const limit = options && options.limit;
  const limitStatement = limit ? `LIMIT 0, ${mysql.escape(limit)}` : '';

  const query = `
        SELECT 
            matchupScores.trackId, 
            matchupScores.score, 
            matchupScores.numMatchups, 
            t.user_id AS userId
        FROM (
            SELECT winners.winning_track_id AS trackId,
            CASE WHEN
                losers.count IS NULL THEN winners.count
                ELSE (winners.count + losers.count) END AS numMatchups,
            CASE WHEN 
                losers.count IS NULL THEN winners.count/winners.count
                ELSE winners.count/(winners.count + losers.count) END AS score 
            FROM (
                SELECT COUNT(winning_track_id) AS count, winning_track_id 
                FROM matchup
                WHERE genre = ${mysql.escape(genre)}
                    AND timestamp_added >= CURDATE()
                GROUP BY winning_track_id 
                ORDER BY COUNT(winning_track_id) desc
            ) AS winners 
            LEFT JOIN (
                SELECT COUNT(losing_track_id) AS count, losing_track_id 
                FROM matchup
                WHERE genre = ${mysql.escape(genre)}
                    AND timestamp_added >= CURDATE()
                GROUP BY losing_track_id 
                ORDER BY count(losing_track_id) desc
            ) AS losers 
            ON winners.winning_track_id = losers.losing_track_id
        ) AS matchupScores, track t
        WHERE score ${scoreOperator} ${refillQueueMinScore}
            AND matchupScores.trackId = t.id
        ORDER BY score DESC
        ${limitStatement};        
    `;

  return query;
};

const getAllPreviousMatchups = async (genre, limit) => {
  const query = `
        SELECT DISTINCT m.entered_track_id AS trackId, t.user_id AS userId
        FROM matchup m, track t
        WHERE 
            m.genre = ${mysql.escape(genre)}
            AND m.entered_track_id IS NOT NULL    
            AND m.entered_track_id = t.id  
        LIMIT
            0, ${mysql.escape(limit)};                
    `;

  const entries = await db.queryAsync(query);

  return entries;
};

const queries = {
  NOW: 'NOW()',
  // Length of time in seconds for how long a track needs to be
  // previewed in Matchup stage
  MATCHUP_DURATION,
  // Length of time in seconds for how long a track needs to be
  // previewed in Winner stage
  WINNER_DURATION,
  COMPETITION_COLUMNS,
  COMPETITION: {
    MIN_DAY_MATCHUPS: 1,
  },
  TRACK_KEYS,
  COMPETITION_STAGES,
  resolveCurrentStage,
  getMatchupPlayingTrack,

  getMatchupTrackKeys: () => [TRACK_KEYS.TRACK_1, TRACK_KEYS.TRACK_2],

  getAllTrackKeys: () => queries.getMatchupTrackKeys().concat([TRACK_KEYS.WINNER]),

  getGenres: () => Object.keys(GENRES).map((key) => GENRES[key]),

  getMatchupNonPlayingTrack: (competitionState) => {
    const currentStage = resolveCurrentStage(competitionState);
    switch (currentStage) {
      case COMPETITION_STAGES.WINNER:
        return competitionState.winner.key === TRACK_KEYS.TRACK_1
          ? competitionState.track2 : competitionState.track1;
      case COMPETITION_STAGES.TRACK_2:
        return competitionState.track1;
      case COMPETITION_STAGES.TRACK_1:
        // Track 2 may not yet be set
        return competitionState.track2.id ? competitionState.track2 : null;
    }
    return null;
  },

  insertMatchupResults: async (winningTrackId, losingTrackId, winningTrackKey, genre, enteredTrackId) => {
    const insertMatchupQuery = `INSERT INTO matchup (winning_track_id, losing_track_id, winning_track_key, genre, entered_track_id) 
            VALUES (
                ${mysql.escape(winningTrackId)}, 
                ${mysql.escape(losingTrackId)}, 
                ${mysql.escape(winningTrackKey)}, 
                ${mysql.escape(genre)}, 
                ${mysql.escape(enteredTrackId)});`;

    await db.queryAsync(insertMatchupQuery);
  },

  /**
     * Resets a user's competition state to default values in the db.
     *
     * @param {Object} userId The UserId for whose state will update
     * @param {Object} [stateToUpdate] Any additional key/values to update
     */
  refreshCompetitionState: async (userId, stateToUpdate = {}) => {
    const newState = getInitialCompetitionState();

    // Set all updated columns to overwrite defaults
    const columnsToUpdate = Object.keys(stateToUpdate);
    columnsToUpdate.forEach((column) => {
      newState[column] = stateToUpdate[column];
    });

    await queries.updateUserCompetitionState(newState, userId);
  },

  updateUserCompetitionState: async (newState, userId) => {
    const stateString = convertCompetitionMapToString(newState);

    // stateString params escaped in convertCompetitionMapToString
    const updateUserQuery = `
            UPDATE user
            SET ${stateString}
            WHERE id = ${mysql.escape(userId)};
        `;

    await db.queryAsync(updateUserQuery);
  },

  /**
     * Gets recent entries into a competition from matchups
     * 1. Start by getting the tracks that have the best record today
     * 2. Get tracks with worst record today to fill remaining limit
     * 3. Get all previous tracks from previous days' matchups to fill remaining limit
     *
     * Fallback to all previous tracks from previous days' matchups
     *
     * @returns {Array} Each row contains trackId, userId
     */
  getRecentlyEnteredTracks: async (genre, limit) => {
    const todayTrackWinnersQuery = getTodayTrackScoresQuery(genre, true, { limit });
    let numNewEntries = 0;
    let newEntries = [];

    try {
      const winnerMatchups = await db.queryAsync(todayTrackWinnersQuery);
      const newWinnerEntries = getNewEntriesFromPrevMatchups(winnerMatchups);
      newEntries = newEntries.concat(newWinnerEntries);
      numNewEntries = newEntries.length;
      if (numNewEntries < limit) {
        const remainingLimit = limit - numNewEntries;
        const allPreviousEntries = await getAllPreviousMatchups(genre, remainingLimit);
        newEntries = newEntries.concat(allPreviousEntries);
      }
    } catch (err) {
      console.error('GET_RECENT_TRACKS_ERROR', err);
      newEntries = getAllPreviousMatchups(genre, limit);
    }

    return shuffleArray(newEntries);
  },

  deleteTrackFromCompetitions: async (trackId) => {
    // Reset competition where deleted track is
    const newCompetitionState = getInitialCompetitionState();

    // Mark competition as reset, so user can be notified
    newCompetitionState[COMPETITION_COLUMNS.FORCE_RESET] = 1;

    const stateString = convertCompetitionMapToString(newCompetitionState);

    const query = `
            UPDATE user 
            SET ${stateString}
            WHERE 
                (
                    competition_track_1_id = ${mysql.escape(trackId)}
                    OR competition_track_2_id = ${mysql.escape(trackId)}
                )
                AND competition_winner_is_played != 1
        `;

    await db.queryAsync(query);
  },

  setForceResetFalse: async (userId) => {
    // Need to prevent division by zero error
    const query = `
            UPDATE user
            SET competition_force_reset=0 
            WHERE 
                id = ${mysql.escape(userId)}
        `;

    await db.queryAsync(query);
  },
};

module.exports = queries;
