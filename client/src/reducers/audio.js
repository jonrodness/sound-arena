import { UNSUBSCRIBE_AUDIO_COMPONENT, SUBSCRIBE_AUDIO_COMPONENT } from '../actions/audio'

// currentId uniquely IDs each audio component for observer pattern
const audio = (state = {
        subscribers: {},
        currentId: 0
    }, action) => {
    
    let newSubscribers        
    
    switch (action.type) {
        case SUBSCRIBE_AUDIO_COMPONENT:
            newSubscribers = state.subscribers
            newSubscribers[action.id] = action.component
            
            return Object.assign({}, state, {
                subscribers: newSubscribers,
                currentId: ++state.currentId
            })
        case UNSUBSCRIBE_AUDIO_COMPONENT:
            newSubscribers = state.subscribers
            delete newSubscribers[action.id]            
            
            return Object.assign({}, state, {
                subscribers: newSubscribers			
            })
		default:
			return state
	}
}

export default audio