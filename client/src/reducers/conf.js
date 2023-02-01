import { RECEIVE_LINK_TYPES } from '../actions/conf'

const conf = (state = {
        LINK_TYPES: {}
    }, action) => {
        
    switch (action.type) {
        case RECEIVE_LINK_TYPES:           
            return Object.assign({}, state, {
                LINK_TYPES: action.conf.LINK_TYPES
            })
		default:
			return state
	}
}

export default conf