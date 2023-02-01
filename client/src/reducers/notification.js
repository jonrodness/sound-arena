import { 
    CLEAR_NOTIFICATION,
    SET_NOTIFICATION ,
    NOTIFICATION_TYPE
} from '../actions/notifications'

const defaultType = NOTIFICATION_TYPE.INFO

const notification = (state = {
    messageCollection: [],
        type: defaultType
    }, action) => {
        
    switch (action.type) {
        case CLEAR_NOTIFICATION:           
            return Object.assign({}, state, {
                messageGroup: [],
            })
        case SET_NOTIFICATION:
            // Transform strings into arrays to support multiple message lines
            const message = action.message
            let messageGroup = typeof message == 'string' ? [ message ] : message
            return Object.assign({}, state, {
                messageGroup,
                type: action.messageType
            })
		default:
			return state
	}
}

export default notification