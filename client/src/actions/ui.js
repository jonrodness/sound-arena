export const REQUEST_PENDING = 'REQUEST_PENDING'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'

export const updateUIForRequest = (type, name) => {
	return { type, name }
}