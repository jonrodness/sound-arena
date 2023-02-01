import { get } from 'lodash'

import { 
	UPDATE_TRACK_COUNTDOWN, 
	REQUEST_TRACK_IS_PLAYED,
	UPDATE_ENTERED_TRACK,
	UPDATE_ENTERED_GENRE,
	UPDATE_COMPETITION_STATE,
	UPDATE_START_TIME
} from '../actions/competition'

import { RECEIVE_MY_TRACKS } from '../actions/user'

export const COMPETITION_STAGE = {
    READY_0: 'READY_0',
	TRACK1_1: 'TRACK1_1',
	TRACK2_2: 'TRACK2_2',
    DECIDING_3: 'DECIDING_3',
	WINNER_4: 'WINNER_4',
	COMPLETE_5: 'COMPLETE_5'
}

export const TRACK_KEYS = {
	TRACK1: 'track1',
	TRACK2: 'track2',
	WINNER: 'winner'
}

export const GENRES = [
    'pop',
	'rap/hip-hop',
	'rock',
    'country',
    'electronic',
	'house',
	'latin',
    'ambient',
    'classical',
    'r&b/soul',
    'jazz',
    'reggae',
    'soundtrack',
	'world',
	'other'
]

export const GENRE_MAP = {
	'pop' : {
		name: 'Pop',
		key: 'pop'
	},
	'rap/hip-hop': {
		name: 'Rap and Hip Hop',
		key: 'rap/hip-hop'
	},
	'rock': {
		name: 'Rock',
		key: 'rock'		
	},
    'country': {
		name: 'Country',
		key: 'country'		
	},
    'electronic': {
		name: 'Electronic',
		key: 'electronic'			
	},
	'house': {
		name: 'House',
		key: 'house'
	},
	'latin': {
		name: 'Latin',
		key: 'latin'		
	},
    'ambient': {
		name: 'Ambient',
		key: 'ambient'		
	},
    'classical': {
		name: 'Classical',
		key: 'classical'		
	},
    'r&b/soul': {
		name: 'R&B and Soul',
		key: 'r&b/soul'
	},
    'jazz': {
		name: 'Jazz',
		key: 'jazz'
	},
    'reggae': {
		name: 'Reggae',
		key: 'reggae'
	},
    'soundtrack': {
		name: 'Soundtrack',
		key: 'soundtrack'
	},
	'world': {
		name: 'World',
		key: 'world'
	},
	'other': {
		name: 'Other',
		key: 'other'
	}
}

export const COMPETITION = {
	MINIMUM_ENTRIES_TODAY: 5,
	MINIMUM_PLAYS_TODAY: 5,
	MINIMUM_MATCHUPS_LAST_10_DAYS: 5
}

export const getTrackFromIndex = (index, competitionState) => {
	const trackIdToUpdate = competitionState.tracks.byIndex[index]
	return competitionState.tracks.byId[trackIdToUpdate]
}

export const resolveStage = (track1, track2, winner) => {
	let stage
	if (winner.key) {
		if (winner.isPlayed) {
			stage = COMPETITION_STAGE.COMPLETE_5
		} else {
			stage = COMPETITION_STAGE.WINNER_4
		}
	} else if (track2.id || track1.isPlayed) {
		if (track2.isPlayed) {
			stage = COMPETITION_STAGE.DECIDING_3
		} else {
			stage = COMPETITION_STAGE.TRACK2_2
		}
	} else if (track1.id) {
		stage = COMPETITION_STAGE.TRACK1_1
	} else {
		stage = COMPETITION_STAGE.READY_0
	}

	return stage
}

export const getTracksById = (trackIds, tracksById) => {
	const tracks = trackIds.map(trackId => {
		return tracksById[trackId]
	}) || []

	return tracks
}

export const isReadyToStartMatchup = competition => {
	return (competition.winner.isPlayed || !competition.track1.id)
}

const initialState = {
	winner: {
		key: null,
		isPlayed: false,
		countdown: null,
		currentTime: 0,
		isPlayedRequestSent: false
	},
	track1: {
		id: null,
		isPlayed: false,
		countdown: null,
		currentTime: 0,
		isPlayedRequestSent: false,
		streamUrl: '',
		startTime: null
	},
	track2: {
		id: null,
		isPlayed: false,
		countdown: null,
		currentTime: 0,
		isPlayedRequestSent: false,
		streamUrl: '',
		startTime: null
	},
	enteredTrackId: null,
	enteredGenre: null,
	stage: COMPETITION_STAGE.READY_0,
	lastUpdated: null
}

export default (state = initialState, action) => {
	let track
	const updateTrackState = (trackKey, newState) => {
		const newTrackState = Object.assign({}, state[trackKey], newState)
		let updatedState = {}
		updatedState[action.trackKey] = newTrackState
		
		return Object.assign({}, state, updatedState)
	}

	switch (action.type) {
		case UPDATE_COMPETITION_STATE: 
			const newWinner = Object.assign({}, state.winner, action.competitionState.winner)
			const newTrack1 = Object.assign({}, state.track1, action.competitionState.track1)
			const newTrack2 = Object.assign({}, state.track2, action.competitionState.track2)
			
			const newStage = resolveStage(newTrack1, newTrack2, newWinner)

			if (newStage === COMPETITION_STAGE.TRACK1_1) {
				
				//Refresh competition state
				newWinner.currentTime = 0
				newWinner.isPlayedRequestSent = false

				const track1CurrentTime = get(action, 'competitionState.track1.startTime', 0) * 1000
				newTrack1.currentTime = track1CurrentTime
				newTrack1.isPlayedRequestSent = false

				newTrack2.currentTime = 0
				newTrack2.isPlayedRequestSent = false
			} else if (newStage === COMPETITION_STAGE.TRACK2_2) {
				newTrack2.currentTime = get(action, 'competitionState.track2.startTime', 0) * 1000
			}

			return Object.assign({}, state, {
				winner: newWinner,
				track1: newTrack1,
				track2: newTrack2,
				stage: newStage,
				lastUpdated: action.lastUpdated,
				enteredGenre: action.competitionState.genre,
				enteredTrackId: action.competitionState.enteredTrackId
			})
		case UPDATE_ENTERED_TRACK:
			return Object.assign({}, state, {
				enteredTrackId: action.trackId
			})
		case UPDATE_ENTERED_GENRE:
			return Object.assign({}, state, {
				enteredGenre: action.genre
			})			
		case UPDATE_START_TIME:
			return updateTrackState(action.trackKey, {
				currentTime: action.newTime
			})		
		case UPDATE_TRACK_COUNTDOWN:
			track = state[action.trackKey]
			let newCountdown = track.countdown - (action.newTime - track.currentTime)
			newCountdown = newCountdown > 0 ? newCountdown : 0

			return updateTrackState(action.trackKey, {
				currentTime: action.newTime,
				countdown: newCountdown
			})
		case REQUEST_TRACK_IS_PLAYED:	
			return updateTrackState(action.trackKey, {
				isPlayedRequestSent: true
			})		
		default:
			return state
	}
}