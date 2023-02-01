import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TrackList from './TrackList'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import LoadableElement from '../global/LoadableElement'
import { LIKED_TRACKS } from '../../actions/user'

class UserProfile extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchLikedTracks()
  }

  render() {
    const { myLikedTracks } = this.props
    return (
      <div class='o-page'>
        <Typography 
          variant='h5'
          component='h1' 
          gutterBottom
        >
          Liked Tracks
        </Typography>
        <LoadableElement
          loadIds={ [ LIKED_TRACKS ] } 
          centered={ true }
        >
          {
            myLikedTracks.length ? (
              <TrackList
                tracks={ myLikedTracks }
                showTrackScore={ false }
                showArtistLink={ true } 
                showLikeButton={ true }
              />                
            ) : (
              <Typography 
                variant='body1'
                component='div' 
                gutterBottom
              >
                Looks like you haven't liked any tracks yet. Enter the competition to find new tracks to like!
              </Typography>
            )
          }

        </LoadableElement>
      </div>
    )
  }
}

UserProfile.propTypes = {
  userId: PropTypes.string,
  username: PropTypes.string,
  track: PropTypes.array
}

export default UserProfile