import { 
    getRequest, 
    postRequest, 
    deleteRequest, 
    putRequest 
} from './utils'

const TRACK_URL_AUTH = '/api/auth/track'
const TRACK_URL = '/api/track'
const TRACK_AWARD_URL = '/api/award'

export const fetchTrackScore = (trackId) => {
    const url = `${TRACK_URL_AUTH}/${trackId}/score`
    return getRequest(url, {
        authenticate: true
    })
}

export const fetchTrackStatus = trackId => {
    const url = `${TRACK_URL_AUTH}/${trackId}/status`
    return getRequest(url, {
        authenticate: true
    })
}

export const fetchTrackDetails = trackId => {
    const url = `${TRACK_URL}/${trackId}`
    return getRequest(url, {
        authenticate: false
    })
}

export const fetchTrackAwards = trackId => {
    const url = `/api/auth/track/${ trackId }/awards`
    return getRequest(url, {
        authenticate: true
    })
}

export const getTrackLinks = trackId => {
    const url = `/api/track/${ trackId }/links`
    return getRequest(url)
}

export const submitTrackLink = (linkUrl, linkType, trackId) => {
    const url = `${ TRACK_URL_AUTH }/${ trackId }/link`
    const data = { 
        url: linkUrl, 
        type: linkType 
    }
    return postRequest(url, data, {
        authenticate: true
    })
}

export const deleteTrackLinks = (trackId, linkId) => {
    const url = `${ TRACK_URL_AUTH }/link/${ linkId }`
    const data = {
        trackId
    }
    return deleteRequest(url, data, {
        authenticate: true
    })
}

export const fetchAward = awardParams => {
    const options = {
        query: awardParams
    }
    return getRequest(TRACK_AWARD_URL, options)
}

export const setTrackAwardsAcknowledged = trackId => {
    const url = `/api/auth/track/${trackId}/awards/ack`
    return putRequest(url, {}, {
        authenticate: true
    })
}