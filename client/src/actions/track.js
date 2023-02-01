import { onNetworkError } from './notifications'
import * as trackServices from '../services/track'
import {
	updateArtists,
	updateTracks
} from './entities'
import {
	REQUEST_PENDING,
	REQUEST_SUCCESS,
	REQUEST_FAILURE, 
	updateUIForRequest 
} from './ui'
import { fetchMyNewAwards } from './user'

export const RECEIVE_TRACK_DATA = 'RECEIVE_TRACK_DATA'
export const RECEIVE_TRACK_LINKS = 'RECEIVE_TRACK_LINKS'
export const TRACK_AWARDS = 'TRACK_AWARDS'
export const TRACK_SCORE = 'TRACK_SCORE'

const receiveTrackData = json => {
	return {
		type: RECEIVE_TRACK_DATA,
		track: json,
		receivedAt: Date.now()
	}
}

export const receiveTrackLinks = links => {
	return {
		type: RECEIVE_TRACK_LINKS,
		links,
		receivedAt: Date.now()
	}
}

export const fetchTrackStatus = trackId => {
	return dispatch => {
		trackServices.fetchTrackStatus(trackId)
			.then(json => dispatch(updateTracks(json.tracks)))
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchTrackScore = trackId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, TRACK_SCORE))
		trackServices.fetchTrackScore(trackId)
			.then(json => {
				dispatch(receiveTrackData(json))
				dispatch(updateUIForRequest(REQUEST_SUCCESS, TRACK_SCORE))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, TRACK_SCORE))
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchTrackDetails = trackId => {
	return dispatch => {
		trackServices.fetchTrackDetails(trackId)
			.then(json => {
				dispatch(updateArtists(json.artists))
				dispatch(updateTracks(json.tracks))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchTrackAwards = trackId => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, TRACK_AWARDS))
		trackServices.fetchTrackAwards(trackId)
			.then(json => {
				dispatch(updateTracks(json.tracks))
				dispatch(updateUIForRequest(REQUEST_SUCCESS, TRACK_AWARDS))
			})
			.catch(err => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, TRACK_AWARDS))
				dispatch(onNetworkError(err))
			})
	}
}

export const submitTrackLink = (linkPath, linkType, trackId) => {
	return trackServices.submitTrackLink(linkPath, linkType, trackId)
}

export const fetchTrackLinks = trackId => {
	return dispatch => {
		trackServices.getTrackLinks(trackId)
			.then(json => {
				dispatch(updateTracks(json.tracks))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const deleteTrackLink = (trackId, linkId) => {
	return dispatch => {
		trackServices.deleteTrackLinks(trackId, linkId)
			.then(json => {
				dispatch(updateTracks(json.tracks))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const fetchAward = awardParams => {
	return dispatch => {
		trackServices.fetchAward(awardParams)
			.then(json => {
				dispatch(updateTracks(json.tracks))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}

export const setTrackAwardsAcknowledged = trackId => {
	return dispatch => {
		trackServices.setTrackAwardsAcknowledged(trackId)
			.then(() => {
				dispatch(fetchMyNewAwards())
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}