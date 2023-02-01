import { connect } from 'react-redux'
import { 
  fetchMyTracks, 
  updateMyTracks,
  fetchMyDetails,
  updateUsername,
  updateInstagramHandle,
  updateTwitterHandle,
  UPLOAD_TRACK
} from '../actions/user'
import { fetchTrackScore } from '../actions/track'
import UserProfile from '../components/user/UserProfile.js'
import React from 'react'
import { 
  postTrack
} from '../services/user'
import { 
  updateUIForRequest,
  REQUEST_PENDING,
  REQUEST_SUCCESS,
  REQUEST_FAILURE
} from '../actions/ui'
import { 
  onNetworkError,
  setNotification,
  NOTIFICATION_TYPE
} from '../actions/notifications'
import SUCCESS_MESSAGES from '../messaging/success'
import { 
  notificationsByTrackSelector,
  notificationsCountSelector
} from '../selectors/user'

const MyProfileContainer = ( { match } ) => {
  return(
    <MyProfileCoordinator username={ match.params.username } />
  )
}

const mapDispatchToProps = dispatch => {
  return  {
    getTracks: () => {
      dispatch(fetchMyTracks())
    },
    fetchUserDetails: () => {
      dispatch(fetchMyDetails())
    },
    onSubmitFile: acceptedFiles => {
      dispatch(updateUIForRequest(REQUEST_PENDING, UPLOAD_TRACK))
      postTrack(acceptedFiles)
        .then(json => {
          dispatch(updateUIForRequest(REQUEST_SUCCESS, UPLOAD_TRACK))
          dispatch(setNotification(SUCCESS_MESSAGES.UPLOAD_TRACKS, NOTIFICATION_TYPE.SUCCESS))
          dispatch(updateMyTracks(json))
        })
        .catch(err => {
          dispatch(updateUIForRequest(REQUEST_FAILURE, UPLOAD_TRACK))
          dispatch(onNetworkError(err))
        })
    },
    getTrackScore: trackId => {
      dispatch(fetchTrackScore(trackId))
    },
    onSaveUsername: username => {
      dispatch(updateUsername(username))
    },
    onSaveInstagramHandle: instagramHandle => {
      dispatch(updateInstagramHandle(instagramHandle))
    },
    onSaveTwitterHandle: twitterHandle => {
      dispatch(updateTwitterHandle(twitterHandle))
    }
  }
}

const mapStateToProps = state => {
  const {
    entities,
    user,
    ui
  } = state

  const allTracks = entities.tracks
  const myTrackIds = user.myTrackIds
  const userEntity = entities.artists[user.id]
  const username = userEntity && userEntity.name
  const twitterHandle = userEntity && userEntity.twitterHandle
  const instagramHandle = userEntity && userEntity.instagramHandle
  const uploadTrackStatus = ui.UPLOAD_TRACK
  const notificationsByTrack = notificationsByTrackSelector(state)
  const notificationsCount = notificationsCountSelector(state)

	return {
    username,
    twitterHandle,
    instagramHandle,
    userTracks: myTrackIds.map(trackId => {
        return allTracks[trackId]
    }) || [],
    isMyProfile: true,
    uploadTrackStatus,
    notificationsByTrack,
    notificationsCount
	}
}

const MyProfileCoordinator = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile)

export default MyProfileContainer
