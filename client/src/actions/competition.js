import { 
	onNetworkError,
} from './notifications'
import { TRACK_KEYS } from '../reducers/competition'
import { 
	requestCompetitionState,
	requestMatchupTrack, 
	requestTrackPlayed,
	requestSetWinner,
	requestCancelMatchup
} from '../services/competition'
import { updateArtists, updateTracks } from './entities'
import { updateUIForRequest } from './ui'
import {
	REQUEST_PENDING,
	REQUEST_SUCCESS,
	REQUEST_FAILURE
} from '../actions/ui'
import { fetchTrackStatus } from './track'
import { NOTIFICATION_TYPE } from './notifications'

export const REQUEST_MATCHUP_TRACKS = 'REQUEST_MATCHUP_TRACKS'
export const RECEIVE_MATCHUP_TRACKS = 'RECEIVE_MATCHUP_TRACKS'
export const UPDATE_TRACK_COUNTDOWN = 'UPDATE_TRACK_COUNTDOWN'
export const REQUEST_TRACK_IS_PLAYED = 'REQUEST_TRACK_IS_PLAYED'
export const RECEIVE_TRACK_IS_PLAYED = 'RECEIVE_TRACK_IS_PLAYED'
export const REQUEST_SELECT_WINNER = 'REQUEST_SELECT_WINNER'
export const SET_WINNER = 'SET_WINNER'
export const UPDATE_ENTERED_TRACK = 'UPDATE_ENTERED_TRACK'
export const UPDATE_ENTERED_GENRE = 'UPDATE_ENTERED_GENRE'
export const UPDATE_COMPETITION_STATE = 'UPDATE_COMPETITION_STATE'
export const UPDATE_START_TIME = 'UPDATE_START_TIME'
export const NEXT_TRACK = 'NEXT_TRACK'
export const SKIP_TRACK = 'SKIP_TRACK'
export const TRACK_2 = 'TRACK_2'
export const COMPETITION_STATE = 'COMPETITION_STATE'
export const SELECT_WINNER = 'SELECT_WINNER'

const handleLikedTracks = likedTracks => {
	updateArtists(likedTracks.tracks)
	updateTracks(likedTracks.artists)
}

const handleCompetitionResponse = (responseBody, dispatch) => {
	const error = responseBody.error

	if (error) {
		const errorCode = error.code
		const errOptions = {}
		if (errorCode == 3) {
			errOptions.notificationType = NOTIFICATION_TYPE.INFO
		}		
		dispatch(onNetworkError(responseBody, errOptions))
	}

	// TODO: this request should be made once upon loading a user's state, not here
	if (responseBody.likedTracks) {
		handleLikedTracks(responseBody.likedTracks)
	}

	if (responseBody.competition) {
		dispatch(updateCompetitionState(responseBody.competition))
	}
}

const updateCompetitionState = competitionState => {
	return {
		type: UPDATE_COMPETITION_STATE,
		competitionState: competitionState,
		lastUpdated: new Date()
	}
}

const requestTrackIsPlayed = trackKey => {
	return {
		type: REQUEST_TRACK_IS_PLAYED,
		trackKey
	}
}

const updateCountdown = (trackKey, newTime) => {
	return {
		type: UPDATE_TRACK_COUNTDOWN,
		newTime,
		trackKey
	}
}

const updateStartTimeAction = (trackKey, newTime) => {
	return {
		type: UPDATE_START_TIME,
		newTime,
		trackKey
	}
}

const updateEnteredTrack = (trackId) => {
	return {
		type: UPDATE_ENTERED_TRACK,
		trackId
	}
}

const updateGenre = (genre) => {
	return {
		type: UPDATE_ENTERED_GENRE,
		genre
	}
}

export const updateStartTime = (trackKey, newTime) => {
	return dispatch => {
		dispatch(updateStartTimeAction(trackKey, newTime))
	}
}

export const selectEnteredTrack = (trackId) => {
	return dispatch => {
		dispatch(updateEnteredTrack(trackId))
	}
}

export const changeGenre = (genre) => {
	return dispatch => {
		dispatch(updateGenre(genre))
	}
}

export const updateTime = (trackKey, newTime) => {
	return (dispatch, getState) => {
		dispatch(updateCountdown(trackKey, newTime))

		const { competition } = getState()
		const updatedTrack = competition[trackKey]

		if (updatedTrack.countdown == 0 && !updatedTrack.isPlayedRequestSent) {
			dispatch(requestTrackIsPlayed(trackKey))

			requestTrackPlayed(trackKey)
				.then(json => {
					handleCompetitionResponse(json, dispatch)
					// TODO: reevaulate how to handle loading state
					switch(trackKey) {
						case TRACK_KEYS.TRACK1:
							dispatch(updateUIForRequest(REQUEST_PENDING, TRACK_2))
							requestMatchupTrack(
								competition.enteredTrackId, 
								competition.enteredGenre
							)
							.then(json => {
								handleCompetitionResponse(json, dispatch)
								dispatch(updateUIForRequest(REQUEST_SUCCESS, TRACK_2))
							})
							.catch(responseBody => {
								handleCompetitionResponse(responseBody, dispatch)
								dispatch(updateUIForRequest(REQUEST_FAILURE, TRACK_2))
							})
							break
						case TRACK_KEYS.WINNER:
							// Update track status in FE
							dispatch(fetchTrackStatus(competition.enteredTrackId))				
							break
					}
				})
				.catch(responseBody => {
					handleCompetitionResponse(responseBody, dispatch)
				})
		}
	}
}

export const fetchMatchupTracks = () => {
	return (dispatch, getState) => {
		const { competition } = getState()

		requestMatchupTrack(competition.enteredTrackId, competition.enteredGenre)
			.then(json => {
				handleCompetitionResponse(json, dispatch)
			})
			.catch(responseBody => {
				handleCompetitionResponse(responseBody, dispatch)
			})
	}
}

export const selectWinner = winnerTrackKey => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, SELECT_WINNER))
		requestSetWinner(winnerTrackKey)
			.then(json => {
				handleCompetitionResponse(json, dispatch)
				dispatch(updateUIForRequest(REQUEST_SUCCESS, SELECT_WINNER))
			})
			.catch(responseBody => {
				handleCompetitionResponse(responseBody, dispatch)
				dispatch(updateUIForRequest(REQUEST_FAILURE, SELECT_WINNER))
			})
	}
}

export const fetchCompetitionState = () => {
	return (dispatch, getState) => {
		const { competition } = getState()

		// Do not request competition state if already in store (with enteredGenre)
		if (competition.lastUpdated) return

		dispatch(updateUIForRequest(REQUEST_PENDING, COMPETITION_STATE))

		requestCompetitionState()
			.then(json => {
				handleCompetitionResponse(json, dispatch)
				dispatch(updateUIForRequest(REQUEST_SUCCESS, COMPETITION_STATE))
			})
			.catch(err => {
				handleCompetitionResponse(err, dispatch)
				dispatch(updateUIForRequest(REQUEST_FAILURE, COMPETITION_STATE))
			})
	}
}

export const loadNextTrack = () => {
	return (dispatch, getState) => {
		const { competition } = getState()
		dispatch(updateUIForRequest(REQUEST_PENDING, NEXT_TRACK))

		requestMatchupTrack(competition.enteredTrackId, competition.enteredGenre)
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, NEXT_TRACK))
				handleCompetitionResponse(json, dispatch)
			})
			.catch(responseBody => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, NEXT_TRACK))
				handleCompetitionResponse(responseBody, dispatch)
			})
	}
}

export const cancelMatchup = () => {
	return dispatch => {
		dispatch(updateUIForRequest(REQUEST_PENDING, SKIP_TRACK))

		requestCancelMatchup()
			.then(json => {
				dispatch(updateUIForRequest(REQUEST_SUCCESS, SKIP_TRACK))
				handleCompetitionResponse(json, dispatch)
			})
			.catch(responseBody => {
				dispatch(updateUIForRequest(REQUEST_FAILURE, SKIP_TRACK))
				handleCompetitionResponse(responseBody, dispatch)
			})
	}
}
