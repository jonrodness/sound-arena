export const SUBSCRIBE_AUDIO_COMPONENT = 'SUBSCRIBE_AUDIO_COMPONENT'
export const UNSUBSCRIBE_AUDIO_COMPONENT = 'UNSUBSCRIBE_AUDIO_COMPONENT'

const subscribeAudioComponent = (id, component) => {
	return {
		type: SUBSCRIBE_AUDIO_COMPONENT,
		id,
		component
	}
}

const unsubscribeAudioComponent = (id) => {
	return {
		type: UNSUBSCRIBE_AUDIO_COMPONENT,
		id
	}
}

export const subscribe = (id, component) => {
	return dispatch => {
		dispatch(subscribeAudioComponent(id, component))
	}
}

export const unsubscribe = (id) => {
	return dispatch => {
		dispatch(unsubscribeAudioComponent(id))
	}
}