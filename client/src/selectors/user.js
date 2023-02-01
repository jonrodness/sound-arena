import { createSelector } from 'reselect'
import { get } from 'lodash'

const concatNotifications = (skippedTracksNotifications, underThresholdNotifications) => {
    return skippedTracksNotifications.concat(underThresholdNotifications)
}

const getResultsCount = results => {
    return results.length
}

const getUnacknowledgedResults = results => {
    const unacknowledgedResults = results.filter(result => {
        return result.acknowledged === false
    })

    return unacknowledgedResults
}

const groupNotificationsByTrack = notifications => {
    const notificationsByTrack = {}

    notifications.forEach(notification => {
        notificationsByTrack[notification.trackId] = notificationsByTrack[notification.trackId] || []
        notificationsByTrack[notification.trackId].push(notification)
    })

	return notificationsByTrack
}

const concatCompetitionResults = (awards, skippedTrackNotifications, belowThresholdNotifications) => {
    const results = [...awards, ...skippedTrackNotifications, ...belowThresholdNotifications]
    return results
}

export const skippedTracksNotificationsSelector = state => {
    const skippedTracksNotifications = get(state, 'user.notifications.skippedTracks', [])
    return skippedTracksNotifications
}

export const belowThresholdNotificationsSelector = state => {
    const belowThresholdNotifications = get(state, 'user.notifications.belowThreshold', [])
    return belowThresholdNotifications
}

export const awardsSelector = state => {
    const awards = get(state, 'user.awards', [])
    return awards
}

export const awardNotificationSelector = createSelector(
    awardsSelector,
    getUnacknowledgedResults
)

export const nonAwardResultsSelector = createSelector(
    skippedTracksNotificationsSelector,
    belowThresholdNotificationsSelector,
    concatNotifications
)

export const nonAwardNotificationSelector = createSelector(
    nonAwardResultsSelector,
    getUnacknowledgedResults
)

export const nonAwardNotificationCountSelector = createSelector(
    nonAwardNotificationSelector,
    getResultsCount
)

export const allResultsSelector = createSelector(
    awardsSelector,
    skippedTracksNotificationsSelector,
    belowThresholdNotificationsSelector,
    concatCompetitionResults
)

export const notificationsSelector = createSelector(
    allResultsSelector,
    getUnacknowledgedResults
)

export const notificationsCountSelector = createSelector(
    notificationsSelector,
    getResultsCount
)

export const notificationsByTrackSelector = createSelector(
    notificationsSelector,
    groupNotificationsByTrack
)