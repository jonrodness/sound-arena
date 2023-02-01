import { getRequest, putRequest } from './utils'

const TRACK_URL = '/api/auth/competition/tracks'
const TRACK_WINNER_URL = '/api/auth/competition/tracks/winner'
const COMPETITION_STATE_URL = '/api/auth/competition'
const SKIP_TRACK_URL = '/api/auth/competition/cancel-matchup'

export const requestMatchupTrack = (trackId, genre) => {
    const url = TRACK_URL
    const options = {
        authenticate: true,
        query: {
            trackid: trackId,
            genre: genre
        }
    }
    return getRequest(url, options)
}

export const requestCancelMatchup = () => {
    const url = SKIP_TRACK_URL
    const options = {
        authenticate: true
    }
    return getRequest(url, options)   
}

export const requestTrackPlayed = trackKey => {
    const data = {
        trackKey
    }
    const options = {
        authenticate: true
    }
    return putRequest(TRACK_URL, data, options)
}

export const requestSetWinner = trackKey => {
    const data = {
        trackKey
    }
    const options = {
        authenticate: true
    }
    return putRequest(TRACK_WINNER_URL, data, options)
}

export const requestCompetitionState = () => {
    const options = {
        authenticate: true
    }
    return getRequest(COMPETITION_STATE_URL, options)
}
