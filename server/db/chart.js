const mysql = require('mysql');
const db = require('./mysql');

const MATCHUP_VIEWS = {
  DAYS_1: {
    DB_FIELD: 'matchup_1_day',
    num: 1,
  },
  DAYS_10: {
    DB_FIELD: 'matchup_10_day',
    num: 10,
  },
};

const queries = {
  /**
     * Gets the competition results
     * Only get results with >=50% or if there are results with 0 wins/0 losses in the cases of partial competitions
     */
  async getLatestCompetitionResults(offset, limit, genre) {
    const query = `
            SELECT 
                u.name AS artistName, 
                u.id AS artistId,
                results.id,
                results.title,
                results.score,
                results.count,
                results.date,
                results.place
            FROM 
                user u, 
                (
                    SELECT 
                        t.user_id,
                        t.name AS title,
                        c1.track_id AS id,
                        ( c1.wins / (c1.wins + c1.losses) ) * 100 AS score,
                        (c1.wins + c1.losses) AS count,
                        c1.date,
                        c1.place,
                        c1.wins AS wins,
                        c1.losses AS losses
                    FROM 
                        competition_results c1
                    INNER JOIN
                        track t
                    ON
                        c1.track_id = t.id
                    WHERE
                        c1.date = (
                            SELECT MAX(date) from competition_results
                        )
                        AND c1.genre = ${mysql.escape(genre)}
                        AND t.deleted != 1                   
                ) results
            WHERE 
                results.user_id = u.id
                AND (
                    results.score >= 50
                    OR (results.wins = 0 and results.losses = 0)
                )
            ORDER BY
                place asc
            LIMIT
                ${mysql.escape(offset)}, ${mysql.escape(limit)};
        `;

    const results = await db.queryAsync(query);
    return results;
  },

  // Only get results with >=50%
  // or if there are results with 0 wins/0 losses in the cases of partial competitions
  async getLatestCompetitionMetaData(genre) {
    const query = `
            SELECT COUNT(*) as count, DATE_FORMAT(date, "%M %d %Y") as date
            FROM competition_results c
            INNER JOIN
                track t
            ON
                c.track_id = t.id
            WHERE 
                c.date = (
                    SELECT MAX(date) from competition_results
                )
                AND (
                    ( c.wins / (c.wins + c.losses) ) >= 0.5
                    OR (c.wins = 0 AND c.losses = 0)
                )
                AND c.genre = ${mysql.escape(genre)}
                AND t.deleted != 1
            GROUP BY date
        `;

    const results = await db.queryAsync(query, [genre]);
    return results;
  },

  getChartDayOptions() {
    return Object.keys(MATCHUP_VIEWS).map((key) => MATCHUP_VIEWS[key].num);
  },
};

module.exports = queries;
