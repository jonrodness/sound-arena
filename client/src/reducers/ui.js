import { 
	REQUEST_PENDING,
	REQUEST_SUCCESS,
	REQUEST_FAILURE
} from '../actions/ui'

export const requestStateSelector = (state, type, names) => {
	const res = names.reduce((acc, currentName) => {
		return (state[currentName] === type) || acc
	}, false)
	return res
}

const ui = (state = {}, action) => {
	const { 
		type,
		name
	} = action

	switch (type) {
		case REQUEST_PENDING: 
			return {
				...state,
				[name]: type 
			}
		case REQUEST_SUCCESS: 
			return {
				...state,
				[name]: type				
			}
		case REQUEST_FAILURE: 
			return {
				...state,
				[name]: type				
			}		
		default:
			return state
	}
}

export default ui