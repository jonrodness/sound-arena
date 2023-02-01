var db = require('./mysql');
var dateFormat = require('dateformat');
var competitionQueries = require('./competition');
var { getDbAwards: processDbAwards } = require('../utils/awards');
const { TrackDoesNotExistError } = require('./track/errors');
const mysql = require('mysql');

const throwError = msg => {
    throw new Error(msg)
}

const queries = {
    TRACK_COLUMNS: {
        DURATION: 'duration',
        STREAM_URL: 'stream_url',
        USER_ID: 'user_id',
        S3_KEY: 's3_key'
    },

    getTrackLinkTypes: () => {
        return [
            'spotify',
            'soundCloud',
            'appleMusic',
            'facebook',
            'youtube'
        ]
    },

    getTrack: async trackId => {
        let track = {};

        const query = `
            SELECT * 
            FROM track 
            WHERE id = ${ mysql.escape(trackId) };
        `;

        const results = await db.queryAsync(query);
        
        if (results.length && results[0]) {
            track = results[0];
        } else {
            throwError('Cannot query track');
        }

        return track; 
    },

    getAvailableTrack: async trackId => {
        let track = {};

        const query = `
            SELECT * 
            FROM track 
            WHERE 
                id = ${ mysql.escape(trackId) }
                AND deleted != 1;
        `;

        const results = await db.queryAsync(query);
        
        if (results.length && results[0]) {
            track = results[0];
        } else {
            throw new TrackDoesNotExistError('Track does not exist')
        }

        return track; 
    },    

    getTracks: async trackIds => {
        if (trackIds.length === 0) {
            throwError('No trackIds provided.');
        }

        const queryCondition = trackIds.map((trackId, index) => {
            return `
                ${ index > 0 ? 'OR ' : '' } id = ${ mysql.escape(trackId) }
            `
        });

        const query = `
            SELECT * 
            FROM track 
            WHERE ${ queryCondition };
        `;

        const results = await db.queryAsync(query);

        return results; 
    },

    setTrackAwardsAcknowledged: async trackId => {
        // Need to prevent division by zero error
        const query = `
            UPDATE award
            SET acknowledged=1 
            WHERE 
                track_id = ${ mysql.escape(trackId) }
                AND (wins + losses) > 0
                AND wins / (wins + losses) >= 0.5;
        `;

        await db.queryAsync(query);
    },

    getBasicTrackDetails: async trackId => {
        let track = {};

        const query = `
            SELECT t.name, user_id, id, u.name 
            FROM track t, user u
            WHERE t.id = ${ mysql.escape(trackId) } AND t.user_id = a.id;
        `;

        const results = await db.queryAsync(query);
        
        if (results.length && results[0]) {
            track = results[0];
        } else {
            throwError('Cannot query track');
        }

        return track; 
    },

    getTodayEntryStatus: async trackId => {
        let status = {};

        const matchupQuery = `
            SELECT genre, count(*) AS count
            FROM matchup
            WHERE timestamp_added > curdate()
                AND entered_track_id = ${ mysql.escape(trackId) }
            GROUP BY genre;
        `;

        const skippedTracksQuery = `
            SELECT genre, entries
            FROM skipped_tracks
            WHERE track_id = ${ mysql.escape(trackId) };
        `;

        const [
            matchupResults, 
            skippedTracksResults
        ] = await Promise.all([
            db.queryAsync(matchupQuery),
            db.queryAsync(skippedTracksQuery)
        ]);        

        matchupResults.forEach(result => {
            status[result.genre] = result.count;
        });

        skippedTracksResults.forEach(result => {
            status[result.genre] = status[result.genre] || 0;
            status[result.genre] += result.entries;
        });        

        return status;
    },

    getTodayPlayedStatus: async trackId => {
        let status = {};

        const matchupQuery = `
            SELECT genre, count(*) AS count
            FROM matchup
            WHERE 
                timestamp_added > CURDATE()
                AND ( 
                    winning_track_id = ${ mysql.escape(trackId) }
                    OR losing_track_id = ${ mysql.escape(trackId) }
                )
            GROUP BY genre;
        `;

        const skippedTracksQuery = `
            SELECT wins, losses, genre
            FROM skipped_tracks
            WHERE track_id = ${ mysql.escape(trackId) };
        `;

        const [
            matchupResults, 
            skippedTracksResults
        ] = await Promise.all([
            db.queryAsync(matchupQuery),
            db.queryAsync(skippedTracksQuery)
        ]);  
        
        matchupResults.forEach(result => {
            status[result.genre] = result.count;
        });

        skippedTracksResults.forEach(result => {
            const plays = result.wins + result.losses;
            status[result.genre] = status[result.genre] || 0;
            status[result.genre] += plays;
        });        

        return status;
    },

    // TODO: is this a duplicate of the above function?
    getTodayPlayedCount: async (trackId, genre) => {
        const matchupQuery = `
            SELECT count(*) AS count
            FROM matchup
            WHERE 
                timestamp_added > CURDATE()
                AND genre = ${ mysql.escape(genre) }
                AND ( 
                    winning_track_id = ${ mysql.escape(trackId) }
                    OR losing_track_id = ${ mysql.escape(trackId) }
                );
        `;

        const skippedTracksQuery = `
            SELECT wins, losses
            FROM skipped_tracks
            WHERE 
                genre = ${ mysql.escape(genre) }
                AND track_id = ${ mysql.escape(trackId) };
        `;

        const [
            matchupResults, 
            skippedTracksResults
        ] = await Promise.all([
            db.queryAsync(matchupQuery),
            db.queryAsync(skippedTracksQuery)
        ]);

        const skippedTracksCount = skippedTracksResults.length ? 
            (
                skippedTracksResults[0].wins + skippedTracksResults[0].losses
            ) 
            : 0; 

        const playedCount = matchupResults[0].count + skippedTracksCount;
            
        
        return playedCount;
    },

    getTrackAndArtist: async trackId => {
        let trackData = {};

        const query = `
            SELECT t.name AS trackTitle, t.user_id AS artistId, 
                t.stream_url AS trackStreamUrl, u.name AS artistName 
            FROM track t, user u
            WHERE t.id = ${ mysql.escape(trackId) } 
                AND t.user_id = u.id;
        `;

        const results = await db.queryAsync(query);
        
        if (results.length && results[0]) {
            trackData = results[0];
        } else {
            throwError('Cannot query track and/or artist');
        }

        return trackData; 
    },    

    updateTrackScore: async (trackId, start, duration, isWinner) => {
        const end = start + duration;
        const track = await queries.getTrack(trackId);

        // Convert stored track score from a string (ie: "9/14|7/16|10/20|")
        // to an array (ie: ['9/14', '7/16', '10/20', ''])
        const trackScore = track.score.split('|');
        const newScore = queries.updatedScore(trackScore, start, end, isWinner);
        // Convert back to string for storage
        const scoreString = newScore.join('|');

        const updateScoreQuery = `
            UPDATE track 
            SET score = '${scoreString}' 
            WHERE id = ${mysql.escape(trackId)}
        `;

        db.queryAsync(updateScoreQuery);
    },
    
    getTrackScore: async (trackId, userId) => {
        const track = await queries.getTrack(trackId);
        
        if (userId != track.user_id) {
            throw new Error('User not authorized to view this track score');
        }

        return track.score;
    },

    addLink: async (trackId, url, type) => {
        const query = `
            INSERT INTO link (track_id, url, type) 
            VALUES (${ mysql.escape(trackId) }, ${ mysql.escape(url) },  ${ mysql.escape(type) });
        `;

        await db.queryAsync(query);        
    },

    getLinks: async trackId => {
        const query = `
            SELECT url, type, id
            FROM link
            WHERE track_id = ${ mysql.escape(trackId) }
            ORDER BY time_added DESC;
        `;
        const links =  await db.queryAsync(query);
        return links;
    },

    deleteLink: async (trackId, linkId) => {
        const query = `
            DELETE FROM link 
            WHERE (track_id, id) 
                IN ((${ mysql.escape(trackId) }, ${ mysql.escape(linkId) }));
        `;

        const res = await db.queryAsync(query);
        if (!res.affectedRows) {
            throw new Error('Unable to delete link')
        }
    },

    getTrackAwards: async trackId => {
        const query = `
            SELECT DATE_FORMAT(a.date, "%M %d %Y") AS date, wins, losses, place, total_participants AS totalParticipants, genre, id, acknowledged
            FROM award a
            WHERE a.track_id = ${ mysql.escape(trackId) };
        `;

        const awards = await db.queryAsync(query);
        return processDbAwards(awards);
    },

    setTrackDeleted: async trackId => {
        const query = `
            UPDATE track
            SET 
                deleted=1, stream_url=null, name=null, duration=null
            WHERE id = ${ mysql.escape(trackId) };
        `;
        
        const results = await db.queryAsync(query);
        return !!results.changedRows;
    },
    
    setTrackTombstone: async trackId => {
        // Mark track as deleted so it can no longer be added to a competition 
        const query = `
            UPDATE track 
            SET deleted = 1
            WHERE id = ${ mysql.escape(trackId) };
        `;

        await db.queryAsync(query);
        return;
    }
};

module.exports = queries;