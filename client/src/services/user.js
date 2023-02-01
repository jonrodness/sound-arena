import { 
    postRequest,
    putRequest, 
    getRequest,
    deleteRequest, 
    MULTIPART 
} from './utils'

const TRACK_URL = '/api/auth/track'
const SIGN_UP_URL = '/api/sign-up'
const MY_TRACKS_URL = '/api/auth/my-tracks'
const USER_DETAILS_URL = '/api/user'
const MY_PROFILE_URL = '/api/auth/my-profile'
const LIKED_TRACKS_URL = '/api/auth/liked-tracks'
const LINK_URL = '/api/auth/user-link'
const MY_LINKS_URL = '/api/auth/my-links'
const NEW_AWARDS_AUTH = '/api/auth/new-awards'
const NEW_NOTIFICATIONS_AUTH = '/api/auth/competition-notifications'

export const postTrack = files => {
    let data = new FormData()

    files.forEach((file) => {
        data.append('tracks', file, file.name)
    })

    const options = {
        authenticate: true,
        contentType: MULTIPART
    }

    return postRequest(TRACK_URL, data, options)
}

export const signUp = formData => {
    const data = JSON.stringify(formData)
    return postRequest(SIGN_UP_URL, data)
}

// Not tested/used yet
export const fetchUserProfile = id => {
    const url = `${USER_DETAILS_URL}/${id}`
    return getRequest(url)
}

export const fetchMyDetails = () => {
    return getRequest(MY_PROFILE_URL, {
        authenticate: true
    })
}

export const getMyTracks = () => {
    return getRequest(MY_TRACKS_URL, {
        authenticate: true
    })
}

export const getLikedTracks = () => {
    return getRequest(LIKED_TRACKS_URL, {
        authenticate: true
    })
}

export const likeTrack = trackId => {
    const data = {
        trackId: trackId
    }

    return postRequest(LIKED_TRACKS_URL, data, {
        authenticate: true
    })
}

export const unlikeTrack = trackId => {
    const url = `${LIKED_TRACKS_URL}/${trackId}`
    
    return deleteRequest(url, null, {
        authenticate: true
    })
}

export const deleteTrack = trackId => {
    const url = `${TRACK_URL}/${trackId}`
    
    return deleteRequest(url, null, {
        authenticate: true
    })
}

export const getUserTracks = userId => {
    const url = `/api/user/${userId}/tracks`
    
    return getRequest(url)
}

export const submitArtistLink = (linkUrl, linkType) => {
    const data = { 
        url: linkUrl, 
        type: linkType 
    }
    
    return postRequest(LINK_URL, data, {
        authenticate: true
    })
}

export const getArtistLinks = (isMyLinks, userId) => {
    const url = isMyLinks ? MY_LINKS_URL : `/api/user/${ userId }/links`
    const options = isMyLinks ? { authenticate: true } : {}
    return getRequest(url, options)
}

export const deleteArtistLinks = linkId => {
    const data = {
        id: linkId
    }
    return deleteRequest(LINK_URL, data, {
        authenticate: true
    })
}

export const fetchMyNewAwards = () => {
    return getRequest(NEW_AWARDS_AUTH, {
        authenticate: true
    })
}

export const fetchMyCompetitionNotifications = () => {
    return getRequest(NEW_NOTIFICATIONS_AUTH, {
        authenticate: true
    })
}

export const setTrackNotificationsAcknowledged = trackId => {
    const url = `/api/auth/track/${trackId}/notifications/ack`
    return putRequest(url, {}, {
        authenticate: true
    })
}

export const updateUsername = username => {
    return putRequest(MY_PROFILE_URL, {username}, {
        authenticate: true
    })
}

export const updateInstagramHandle = instagramHandle => {
    return putRequest(MY_PROFILE_URL, {instagramHandle}, {
        authenticate: true
    })
}

export const updateTwitterHandle = twitterHandle => {
    return putRequest(MY_PROFILE_URL, {twitterHandle}, {
        authenticate: true
    })
}
