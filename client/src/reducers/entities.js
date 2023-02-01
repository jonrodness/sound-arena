import { UPDATE_LIKED_TRACKS } from '../actions/user'
import { RECEIVE_TRACK_DATA } from '../actions/track'
import { UPDATE_ENTITY } from '../actions/entities'
import { isIdEqual } from '../utils/entities'

export const ENTITY_TYPES = {
	ARTIST: 'artists',
	TRACK: 'tracks'
}

export const getTrackData = (id, entities) => {
	const trackData = entities.tracks[id]
	let fullTrackData = {}
	if (trackData) {
		const artist = entities.artists[trackData.artistId]
		const artistName = artist && artist.name
		fullTrackData = {
			...trackData,
			artistName
		}
	}

	return fullTrackData
}

export const checkIfTrackOwner = (trackId, user, entities) => {
	const track = entities.tracks[trackId]
	const isTrackOwner = track && isIdEqual(track.artistId, user.id)
	return isTrackOwner
}

export const getTrackAwardCount = awardGroups => {
	const count = awardGroups.reduce((acc, awardGroup) => {
		return acc += awardGroup.awards.length
	}, 0)

	return count
}

const entities = (state = {
        tracks: {
			// 		12345: {
			// 			id: 12345,
			// 			title: 'Title',
			// 			streamUrl: 'https://www.streamingurl.com',
			//			isLiked: true,
			//			artistId: 12345,
			//			isLoading: false,
			//			awards: []
			// 		}
			// 	}
		},
		artists: {
			// 	12345: {
			// 		id: 12345,
			// 		name: 'Name'
			// 	}
		}
	}, action) => {
		
	/**
	* Adds or overwrites properties of given entities.
	* @param {object} entitiesById - An object containing entities by id with 
	*	new property values.
	* @param {string} entityType - The key of the state object for 
	*	the entity being updated (ie: track, artist).
	* @returns {object} The updated entity state.
	*/		
	function updateEntity(entitiesById, entityType) {
		const updatedEntityById = {}

		for (const entityId in entitiesById) {
			const oldEntityById = state[entityType][entityId] || {}
			const newEntity = Object.assign({}, oldEntityById, entitiesById[entityId])
			updatedEntityById[entityId] = newEntity
		}

		return Object.assign({}, state[entityType], updatedEntityById)
	}

	switch (action.type) {
		case RECEIVE_TRACK_DATA:
			const id = action.track.id
			const newTrack = Object.assign({}, state.tracks[id], action.track)
			const newTracksObject = {}
			newTracksObject[id] = newTrack

			return Object.assign({}, state, {
				tracks: Object.assign({}, state.tracks, newTracksObject)
			})
		case UPDATE_LIKED_TRACKS:
			const updatedTracksById = updateEntity(action.tracksById, ENTITY_TYPES.TRACK)

			return Object.assign({}, state, {
				tracks: Object.assign({}, state.tracks, updatedTracksById)
			})
		case UPDATE_ENTITY:
			const updatedEntityById = updateEntity(action.entityById, action.entityType)
			const updatedEntity = Object.assign({}, state[action.entityType], updatedEntityById)
			let newState = {}

			newState[action.entityType] = updatedEntity

			return Object.assign({}, state, newState)
		default:
			return state
	}
}

export default entities