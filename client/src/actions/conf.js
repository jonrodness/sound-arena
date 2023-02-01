import { onNetworkError } from './notifications'
import * as confServices from '../services/conf'

export const RECEIVE_LINK_TYPES = 'RECEIVE_LINK_TYPES'

const updateLinkTypes = conf => {
	return {
		type: RECEIVE_LINK_TYPES,
		conf
	}
}

export const fetchLinkTypes = () => {
	return dispatch => {
		confServices.fetchLinkTypes()
			.then(json => {
				dispatch(updateLinkTypes(json))
			})
			.catch(err => {
				dispatch(onNetworkError(err))
			})
	}
}
