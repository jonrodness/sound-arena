import { 
	onNetworkError,
	setNotification,
	NOTIFICATION_TYPE
} from './notifications'
import * as userServices from '../services/user'
import { updateArtists, updateTracks } from './entities'
import {
	REQUEST_PENDING,
	REQUEST_SUCCESS,
	REQUEST_FAILURE, 
	updateUIForRequest 
} from './ui'
export const REQUEST_USER_TRACKS = 'REQUEST_USER_TRACKS'
export const RECEIVE_MY_TRACKS = 'RECEIVE_MY_TRACKS'
export const RECEIVE_MY_PROFILE = 'RECEIVE_MY_PROFILE'
export const UPDATE_LIKED_TRACKS = 'UPDATE_LIKED_TRACKS'
export const RECEIVE_ARTIST_LINKS = 'RECEIVE_ARTIST_LINKS'
export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE'
export const LIKE_TRACK = 'LIKE_TRACK'
export const DELETE_TRACK = 'DELETE_TRACK'
export const LIKED_TRACKS = 'LIKED_TRACKS'
export const USER_LINKS = 'USER_LINKS'
export const UPLOAD_TRACK = 'UPLOAD_TRACK'
export const USER_TRACKS = 'USER_TRACKS'
export const RECEIVE_MY_NEW_AWARDS = 'RECEIVE_MY_NEW_AWARDS'
export const RECEIVE_MY_NOTIFICATIONS = 'RECEIVE_MY_NOTIFICATIONS'
export const UPDATE_USERNAME = 'UPDATE_USERNAME'
export const UPDATE_INSTAGRAM_HANDLE = 'UPDATE_INSTAGRAM_HANDLE'
export const UPDATE_TWITTER_HANDLE = 'UPDATE_TWITTER_HANDLE'

const requestUserTracks = () => {
	return {
		type: REQUEST_USER_TRACKS
	}
}

const receiveMyTracks = tracks => {
	return {
		type: RECEIVE_MY_TRACKS,
		tracks,
		receivedAt: Date.now()
	}
}

const receiveMyProfile = userById => {
	return {
		type: RECEIVE_MY_PROFILE,
		userById,
		receivedAt: Date.now()
	}
}

const receiveMyNewAwards = awards => {
	return {
		type: RECEIVE_MY_NEW_AWARDS,
		awards,
		receivedAt: Date.now()
	}
}

const receiveMyCompetitionNotifications = notifications => {
	return {
		type: RECEIVE_MY_NOTIFICATIONS,
		notifications,
		receivedAt: Date.now()
	}
}

export const updateAuthState = isAuthenticated => {
	return {
		type: UPDATE_AUTH_STATE,
		isAuthenticated
	}	
}

export const receiveArtistLinks = links => {
	return {
		type: RECEIVE_ARTIST_LINKS,
		links,
		receivedAt: Date.now()
	}	
}

export const setLikedTracks = tracksById => {
	return {
		type: UPDATE_LIKED_TRACKS,
		tracksById
	}
}

export const fetchUserProfile = id => {
	return dispatch => {
		userServices.fetchUserProfile(id)
			.then(json => dispatch(updateArtists(json.artists)))
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchMyDetails = () => {
	return dispatch => {
		userServices.fetchMyDetails()
			.then(json => {
				dispatch(receiveMyProfile(json.artists))
				dispatch(updateArtists(json.artists))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchUserTracks = userId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, USER_TRACKS))
		dispatch(requestUserTracks())
		userServices.getUserTracks(userId)
			.then(json => {
				dispatch(updateTracks(json.tracks))
				dispatch(updateUIForRequest(REQUEST_SUCCESS, USER_TRACKS))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, USER_TRACKS))
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchMyTracks = () => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, USER_TRACKS))
		userServices.getMyTracks()
			.then(json => {
				dispatch(updateTracks(json.tracks))
				dispatch(receiveMyTracks(json.tracks))
				dispatch(updateUIForRequest(REQUEST_SUCCESS, USER_TRACKS))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, USER_TRACKS))
				dispatch(onNetworkError(err))
			})
	}
}

export const likeTrack = trackId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, LIKE_TRACK))
		userServices.likeTrack(trackId)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, LIKE_TRACK))
				dispatch(setLikedTracks(json.tracks))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
				dispatch(updateUIForRequest(REQUEST_FAILURE, LIKE_TRACK))
			})
	}
}

export const unlikeTrack = trackId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, LIKE_TRACK))
		userServices.unlikeTrack(trackId)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, LIKE_TRACK))
				dispatch(setLikedTracks(json.tracks))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, LIKE_TRACK))
				dispatch(onNetworkError(err))
			})
	}
}

export const deleteTrack = trackId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, DELETE_TRACK))
		userServices.deleteTrack(trackId)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, DELETE_TRACK))
				dispatch(setNotification('Track deleted.', NOTIFICATION_TYPE.SUCCESS))
				dispatch(receiveMyTracks(json.tracks))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, DELETE_TRACK))
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchLikedTracks = () => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, LIKED_TRACKS))
		userServices.getLikedTracks()
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, LIKED_TRACKS))
				dispatch(updateArtists(json.artists))
				dispatch(updateTracks(json.tracks))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, LIKED_TRACKS))
				dispatch(onNetworkError(err))
			})
	}
}

export const updateMyTracks = response => {
	return dispatch => {
		dispatch(updateTracks(response.tracks))
		dispatch(receiveMyTracks(response.tracks))
	}
}

export const submitArtistLink = (linkPath, linkType) => {
	return userServices.submitArtistLink(linkPath, linkType)
}

export const fetchArtistLinks = (isMyLinks, userId) => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, USER_LINKS))
		userServices.getArtistLinks(isMyLinks, userId)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, USER_LINKS))
				// TODO: only update entities when no special case for 
				// isMyLinks - this is a temporary hack
				if (isMyLinks) {
					const userId = Object.keys(json.artists)[0]
					const links = json.artists[userId].links
					dispatch(receiveArtistLinks(links))
				} else {
					dispatch(updateArtists(json.artists))
				}
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, USER_LINKS))
				dispatch(onNetworkError(err))
			})
	}
}

export const deleteArtistLink = linkId => {
	return dispatch => {
		userServices.deleteArtistLinks(linkId)
			.then(json => {
				dispatch(receiveArtistLinks(json.links))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchMyNewAwards = () => {
	return dispatch => {
		userServices.fetchMyNewAwards()
			.then(json => {
				dispatch(receiveMyNewAwards(json.awards))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchMyCompetitionNotifications = () => {
	return dispatch => {
		userServices.fetchMyCompetitionNotifications()
			.then(json => {
				dispatch(receiveMyCompetitionNotifications(json.notifications))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const setTrackNotificationsAcknowledged = trackId => {
	return dispatch => {
		userServices.setTrackNotificationsAcknowledged(trackId)
			.then(json => {
				dispatch(receiveMyCompetitionNotifications(json.notifications))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const updateUsername = username => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, UPDATE_USERNAME))
		userServices.updateUsername(username)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, UPDATE_USERNAME))
				dispatch(receiveMyProfile(json.artists))
				dispatch(updateArtists(json.artists))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, UPDATE_USERNAME))
				dispatch(onNetworkError(err))
			})
	}
}

export const updateInstagramHandle = instagramHandle => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, UPDATE_INSTAGRAM_HANDLE))
		userServices.updateInstagramHandle(instagramHandle)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, UPDATE_INSTAGRAM_HANDLE))
				dispatch(receiveMyProfile(json.artists))
				dispatch(updateArtists(json.artists))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, UPDATE_INSTAGRAM_HANDLE))
				dispatch(onNetworkError(err))
			})
	}
}

export const updateTwitterHandle = twitterHandle => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, UPDATE_TWITTER_HANDLE))
		userServices.updateTwitterHandle(twitterHandle)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, UPDATE_TWITTER_HANDLE))
				dispatch(receiveMyProfile(json.artists))
				dispatch(updateArtists(json.artists))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, UPDATE_TWITTER_HANDLE))
				dispatch(onNetworkError(err))
			})
	}
}