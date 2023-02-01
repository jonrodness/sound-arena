import { getErrorMessage } from '../messaging/errors'

export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION'
export const SET_NOTIFICATION = 'SET_NOTIFICATION'
export const NOTIFICATION_TYPE = {
	ERROR: 'error',
	INFO: 'info',
	SUCCESS: 'success'
}

const clearNotificationAction = () => {
	return {
		type: CLEAR_NOTIFICATION
	}
}

// Message can be array or string
export const setNotification = (message, messageType) => {
	return {
		type: SET_NOTIFICATION,
		message,
		messageType
	}
}

export const onNetworkError = (responseBody, options) => {
	// default to code 1 if no code in response body
	const notificationType = (options && options.notificationType) || NOTIFICATION_TYPE.ERROR
	const code = getErrorCode(responseBody)
	const expressions = getExpressions(responseBody)
	const message = getErrorMessage(code, expressions)
	return dispatch => {
		dispatch(setNotification(message, notificationType))
	}
}

export const clearNotification = () => {
	return dispatch => {
		dispatch(clearNotificationAction())
	}
}

export const getErrorCode = responseBody => {
	const code = responseBody.error && responseBody.error.code || 1
	return code
}

export const getExpressions = responseBody => {
	const expressions = responseBody.error && responseBody.error.expressions || {}
	return expressions
}