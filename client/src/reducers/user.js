import { 
	RECEIVE_MY_TRACKS, 
	RECEIVE_ARTIST_LINKS,
	UPDATE_AUTH_STATE,
	RECEIVE_MY_PROFILE,
	RECEIVE_MY_NEW_AWARDS,
	RECEIVE_MY_NOTIFICATIONS,
	UPDATE_IS_REGISTERING
} from '../actions/user'

export const NOTIFICATION = {
	SKIPPED: 'skipped',
	BELOW_THRESHOLD: 'belowThreshold'
};

export const getNotificationsByType = trackNotifications => {
	const notificationsByType = {
		belowThreshold: [],
		skipped: []
	}
	trackNotifications.forEach(notification => {
		switch (notification.type) {
			case NOTIFICATION.SKIPPED:
				notificationsByType.skipped.push(notification)
				break
			case NOTIFICATION.BELOW_THRESHOLD:
				notificationsByType.belowThreshold.push(notification)
				break
		}
	})

	return notificationsByType
}

export const getNotificationsForTrack = (allNotifications, trackId) => {
	const notificationsForTrack = allNotifications.filter(notification => {
		return notification.trackId == trackId
	})

	return notificationsForTrack
}

export const getNewAwardsByTrack = awards => {
	const newAwardsByTrack = {}
	const newAwards = awards.filter(award => {
		return award.acknowledged === false
	})
	
	newAwards.forEach(award => {
		newAwardsByTrack[award.trackId] = newAwardsByTrack[award.trackId] || []
		newAwardsByTrack[award.trackId].push(award)
	})

	return newAwardsByTrack
}

export const getNewTrackAwardsTotalCount = newTrackAwardsById => {
	let count = 0

	for (const trackAwards in newTrackAwardsById) {
		count += newTrackAwardsById[trackAwards].length
	}

	return count
}

const user = (state = {
		id: null,
		userName: ' ', // For now not empty string so Profile components load
		isAuthenticated: true, // default to true as to not redirect users on pageload 
		isRegistering: false,
		myTrackIds: [],
		links: [],
		awards: [],
		notifications: []		
    }, action) => {
	switch (action.type) {
		case RECEIVE_MY_TRACKS:
			const myTrackIds = Object.keys(action.tracks).map(function(id) {
				return parseInt(id)
			})
			
			return Object.assign({}, state, {
				myTrackIds: myTrackIds
			})
		case RECEIVE_ARTIST_LINKS:		
			return Object.assign({}, state, {
				links: action.links
			})
		case UPDATE_AUTH_STATE:
			return Object.assign({}, state, {
				isAuthenticated: action.isAuthenticated
			})
		case RECEIVE_MY_PROFILE:
			const id = Object.keys(action.userById)[0]
			return {
				...state,
				id
			}
		case RECEIVE_MY_NEW_AWARDS:
			return Object.assign({}, state, {
				awards: action.awards
			})
		case RECEIVE_MY_NOTIFICATIONS:
			return Object.assign({}, state, {
				notifications: action.notifications
			})
		default:
			return state
	}
}

export default user