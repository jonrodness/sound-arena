import { ENTITY_TYPES } from '../reducers/entities'

export const UPDATE_ENTITY = 'UPDATE_ENTITY'

export const updateArtists = artistsById => {
	return {
        type: UPDATE_ENTITY,
        entityType: ENTITY_TYPES.ARTIST,
		entityById: artistsById,
		receivedAt: Date.now()
	}
}

export const updateTracks = tracksById => {
	return {
        type: UPDATE_ENTITY,
        entityType: ENTITY_TYPES.TRACK,
		entityById: tracksById,
		receivedAt: Date.now()
	}
}