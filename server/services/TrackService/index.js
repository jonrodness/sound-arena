
const { getTrack } = require('../../db/track')
const { TrackScoreDoesNotExistError } = require('./errors')

const generateInitialTrackScore = seconds => {
    const score = Array.from({length: seconds}, _ => {
        return {
            wins: 0,
            total: 0
        }
    })

    return score
}

/**
 * Gets an updated track score after a change is applied to a segment
 * @param {array} trackScore - An array whose items represent the score of
 *  each and all sequential seconds of a track. Each second is represented as
 *  a string as such: '[number of wins]/[total play]' (ie: '4/7')
 * @param {number} start - The first second of the segment to be unpdated
 * @param {number} end - The second AFTER the segment to be updated
 * @param {boolean} isWinner - Whether the score update is for winner or not
 *  up until an exluding 'end'
 * @returns {string} The updated full track score as a concatenated string
 */
const updateScore = (trackScore, start, end, isIncrement) => {
    for (let i = start; i < end; i++) {
        const secondScore = trackScore[i]
        secondScore.total++
        if (isIncrement) {
            secondScore.wins++
        }
    }

    return trackScore;
}

class TrackService {
    constructor(noSQLService, storageService, sqlService) {
        this._noSQLService = noSQLService;
        this._storageService = storageService;
        this._sqlService = sqlService;
    }

    async _initTrackScore(trackId) {
        const track = await getTrack(trackId)
        const duration = track.duration
        const trackScore = await this.initTrackScore(trackId, duration)  
        return trackScore      
    }

    async getTrackScore(trackId) {
        let trackScore
        let initTrackScore = false
        
        try {
            trackScore = await this._noSQLService.getTrackScore(trackId)
            if (!trackScore) {
                initTrackScore = true
            }
        } catch(err) {
            // If no trackscore, then init track score
            if (err instanceof TrackScoreDoesNotExistError) {
                initTrackScore = true
            } else {
                throw err
            }
        }

        if (initTrackScore) {
            try {
                trackScore = await this._initTrackScore(trackId)
            } catch(err) {
                throw err
            }
        }
        
        return trackScore
    }

    async initTrackScore(trackId, duration) {
        const initialTrackScore = generateInitialTrackScore(duration)
        let trackScore
        try {
            trackScore = await this._noSQLService.initTrackScore(trackId, initialTrackScore)
            return initialTrackScore
        } catch(err) {
            console.error("Unable to initialize track score")
        }
    }

    async updateTrackScore(trackId, segmentStart, segmentDuration, isIncrement) {
        let trackScore
        let initTrackScore = false
        
        try {
            trackScore = await this._noSQLService.getTrackScore(trackId)
            if (!trackScore){
                initTrackScore = true
            }
        } catch(err) {
            // If no trackscore, then init track score
            if (err instanceof TrackScoreDoesNotExistError) {
                initTrackScore = true
            }
        }

        if (initTrackScore) {
            try {
                trackScore = await this._initTrackScore(trackId)
            } catch(err) {
                throw err
            }
        }

        if (!trackScore || !trackScore.length || trackScore.length < 1) return

        const segmentEnd = segmentStart + segmentDuration;
        const updatedScore = updateScore(trackScore, segmentStart, segmentEnd, isIncrement)

        try {
            await this._noSQLService.updateTrackScore(trackId, updatedScore)
        } catch(err) {
            console.error("Unable to update track score")
        }
    }

    async getSignedReadUrl(storageKey) {
        const signedReadUrl = await this._storageService.getSignedReadUrl(storageKey);
        return signedReadUrl;
    }
}

module.exports = {
    TrackService
}