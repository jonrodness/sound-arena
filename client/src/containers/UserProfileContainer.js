import { connect } from 'react-redux'
import { 
  fetchUserTracks,
  fetchUserProfile 
} from '../actions/user'
import UserProfile from '../components/user/UserProfile.js'
import React from 'react'

const UserProfileContainer = ( { match } ) => {
  return(
    <UserProfileCoordinator
        userId={ match.params.userId }
        username={ match.params.username } />
  )
}

export default UserProfileContainer

const mapDispatchToProps = dispatch => {
  return  {
    getTracks: userId => {
      dispatch(fetchUserTracks(userId))
    },
    fetchUserDetails: userId => {
      dispatch(fetchUserProfile(userId))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { userId, username } = ownProps
  const {
    entities
  } = state
  const allTracksById = entities.tracks
  const userEntity = entities.artists[userId]
  const twitterHandle = userEntity && userEntity.twitterHandle
  const instagramHandle = userEntity && userEntity.instagramHandle

  // if username is not passed in URL, get from entity
  const derivedUserName = username || (userEntity && userEntity.name)
  const allTracksIds = Object.keys(allTracksById)

  const userTracks = allTracksIds.map(trackId => {
    return allTracksById[trackId]
  }).filter(track => {
    return track.artistId === parseInt(userId)
  })

	return {
    userId,
    username: derivedUserName,
		userTracks,
    isMyProfile: false,
    twitterHandle,
    instagramHandle
	}
}

const UserProfileCoordinator = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile)
