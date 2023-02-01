var db = require('./mysql');
const mysql = require('mysql');
var { 
    getDbAwards,
    getDbAwardLosses
} = require('../utils/awards')


const updateUsername = async (userId, username) => {
    const query = `
        UPDATE user
        SET name = ${ mysql.escape(username) }
        WHERE id = ${ mysql.escape(userId) }
    `;

    await db.queryAsync(query);
}

const updateTwitterHandle = async (userId, twitterHandle) => {
    const query = `
        UPDATE user
        SET twitter_handle = ${ mysql.escape(twitterHandle) }
        WHERE id = ${ mysql.escape(userId) }
    `;

    await db.queryAsync(query);
}

const updateInstagramHandle = async (userId, instagramHandle) => {
    const query = `
        UPDATE user
        SET instagram_handle = ${ mysql.escape(instagramHandle) }
        WHERE id = ${ mysql.escape(userId) }
    `;

    await db.queryAsync(query);
}

module.exports = {
    getLinkTypes: () => {
        return [
            'spotify',
        ]    
    },

    /**
     * Retreives a record from the User table
     * @param {string} authId - The 'sub' from the authentication server
     * @returns {object} the full user record
     */
    getUser: async authId => {
        const query = `
            SELECT * 
            FROM user 
            WHERE auth_id = ${ mysql.escape(authId) };
        `;

        const results = await db.queryAsync(query);

        return results.length ? results[0] : null
    },

    /**
     * Retreives non-sensitive properties from the User table
     * @param {string} userId - The user's id
     * @returns {object} the user record
     */
    getUserDetails: async userId => {
        const query = `
            SELECT  
                name,
                id, 
                instagram_handle AS instagramHandle, 
                twitter_handle AS twitterHandle
            FROM user 
            WHERE id = ${ mysql.escape(userId) };
        `;

        const results = await db.queryAsync(query);

        return results.length ? results[0] : null
    },    

    /**
     * Retreives all tracks owned by a specified user
     * @param {string} userId - The user's database id
     * @returns {object} An object with trackId keys and nested track details
     */  
    getArtistTracks: async userId => {
        // TODO: change track "name" to "title" in db
        const query = `
            SELECT id, stream_url, name, user_id 
            FROM track 
            WHERE
                deleted != 1 AND user_id = ${ mysql.escape(userId) }
        `;

        const results = await db.queryAsync(query);

        let tracks = {};
          
        results.forEach( result => {
            tracks[result.id] = {
                id: result.id,
                streamUrl: result.stream_url,
                title: result.name,
                artistId: result.user_id
            }
        });

        return tracks;
    },

    /**
     * Adds a new record into the User table
     * @param {string} authId - The 'sub' from the authentication server
     * @returns {number} The primary key 'id' for new record in User table
     */
    insertUser: async authId => {
        const query = `
            INSERT INTO user (auth_id) 
            VALUES (${ mysql.escape(authId) });
        `;

        const result = await db.queryAsync(query);
        const userId =  result.insertId;
        
        // Add default username
        const userName = `user${userId}`;
        await updateUsername(userId, userName);

        return result.insertId;
    },

    getLikedTracks: async userId => {
        let entities = {
            tracks: {},
            artists: {}
        };

        const query = `
            SELECT 
                t.id AS trackId, 
                t.name AS trackTitle, 
                t.deleted,
                u.name AS artistName,
                u.id AS artistId
            FROM user_likes_track ult
            LEFT JOIN track t
                ON ult.track_id = t.id
            LEFT JOIN user u
                ON t.user_id = u.id                
            WHERE 
                ult.user_id = ${ mysql.escape(userId) }
        `;
        
        const queryResults = await db.queryAsync(query);

        // Return response in standard format
        queryResults.forEach(function(result) {
            entities.tracks[result.trackId] = {
                isLiked: true,
                id: result.trackId,
                title: result.trackTitle,
                artistId: result.artistId 
            };
            entities.artists[result.artistId] = {
                id: result.artistId,
                name: result.artistName
            };            
        });

        return entities;
    },
    
    /**
     * Adds a new record for a user liking a track
     * @param {string} userId - The user's database id
     * @param {string} trackId - The id of the liked track
     */
    likeTrack: async (userId, trackId) => {
        const query = `
            INSERT INTO user_likes_track (user_id, track_id) 
            VALUES (${ mysql.escape(userId) }, ${ mysql.escape(trackId) });
        `;

        await db.queryAsync(query);
    },
    
    unlikeTrack: async (userId, trackId) => {
        const query = `
            DELETE FROM user_likes_track
            WHERE user_id = ${ mysql.escape(userId) } AND track_id = ${ mysql.escape(trackId) }
        `;

        await db.queryAsync(query);
    },

    addLink: async (userId, url, type) => {
        // TODO: more maintainable way would be to use SQL polymorphism
        // table constraint preventing duplicatea: (type, path, user_id)
        const query = `
            INSERT INTO link (user_id, url, type) 
            VALUES (${ mysql.escape(userId) }, ${ mysql.escape(url) }, ${ mysql.escape(type) });
        `;

        await db.queryAsync(query);
    },

    getLinks: async userId => {
        const query = `
            SELECT url, type, id
            FROM link
            WHERE user_id = ${ mysql.escape(userId) }
            ORDER BY time_added DESC;
        `;
        const links =  await db.queryAsync(query);
        return links;
    },

    deleteLink: async (userId, linkId) => {
        const query = `
            DELETE FROM link 
            WHERE (user_id, id) 
                IN ((${ mysql.escape(userId) }, ${ mysql.escape(linkId) }));
        `;

        await db.queryAsync(query);        
    },

    getNewAwards: async userId => {
        const query = `
            SELECT a.track_id AS trackId, DATE_FORMAT(a.date, "%M %d %Y") AS date, a.acknowledged, a.wins, a.losses, a.genre
            FROM award a, track t
            WHERE
                a.acknowledged = 0 
                AND a.track_id = t.id 
                AND t.user_id = ${ mysql.escape(userId) };
        `;

        const awards = await db.queryAsync(query);
        return getDbAwards(awards);
    },
    
    /*
    * Gets competition losses that are unacknowledged, or acknowledged and evaluated within the past 7 days
    */
    getCompetitionLosses: async userId => {
        const query = `
            SELECT a.track_id AS trackId, DATE_FORMAT(a.date, "%M %d %Y") AS date, a.acknowledged, a.wins, a.losses, a.genre
            FROM award a, track t
            WHERE
                (
                    a.date >= (curDate() - 7)
                    OR a.acknowledged = 0
                ) 
                AND a.track_id = t.id 
                AND t.user_id = ${ mysql.escape(userId) };
        `;
        
        const awards = await db.queryAsync(query);
        return getDbAwardLosses(awards);
    },

    getSkippedTracks: async userId => {
        const query = `
            SELECT s.track_id AS trackId, DATE_FORMAT(s.date_skipped, "%M %d %Y") AS date, s.genre, s.acknowledged
            FROM skipped_tracks s, track t
            WHERE
                s.track_id = t.id 
                AND t.user_id = ${ mysql.escape(userId) };
        `;

        const skippedTracks = await db.queryAsync(query);
        skippedTracks.forEach(track => {
            track.acknowledged = !!track.acknowledged;
        });
        
        return skippedTracks;
    },

    setBelowThresholdNotificationsAcknowledged: async trackId => {
        // Need to prevent division by zero error
        const query = `
            UPDATE award
            SET acknowledged=1 
            WHERE 
                track_id = ${ mysql.escape(trackId) }
                AND (wins + losses) > 0
                AND wins / (wins + losses) < 0.5;
        `;

        await db.queryAsync(query);
    },
    
    setSkippedTracksAcknowledged: async trackId => {
        // Need to prevent division by zero error
        const query = `
            UPDATE skipped_tracks
            SET acknowledged=1 
            WHERE 
                track_id = ${ mysql.escape(trackId) }
        `;

        await db.queryAsync(query);
    },
    
    updateUsername,
    updateTwitterHandle,
    updateInstagramHandle
}