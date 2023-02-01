import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoadableElement from '../../global/LoadableElement'
import { 
    MdFavoriteBorder, 
    MdFavorite 
} from 'react-icons/lib/md'
import ToggleButton from '../../global/buttons/ToggleButton'
import {
    likeTrack,
    unlikeTrack,
    LIKE_TRACK
} from '../../../actions/user'

import '../../../css/audio-container.css'

class LikeButton extends Component {
    constructor(props) {
        super(props)
        this.likeTrack = this.likeTrack.bind(this)
        this.unlikeTrack = this.unlikeTrack.bind(this)
    }
    
    likeTrack = () => {
        const {
            trackId,
            likeTrack
        } = this.props
        likeTrack(trackId)
    }

    unlikeTrack = () => {
        const {
            trackId,
            unlikeTrack
        } = this.props
        unlikeTrack(trackId)    
    }        

    render() {
        const {
            isLiked
        } = this.props

        return (
            <LoadableElement loadIds={ [ LIKE_TRACK ] }>
                <ToggleButton
                    isActive={ isLiked }
                    activeIcon={ <MdFavorite color='red' /> }
                    inactiveIcon={ <MdFavoriteBorder color='white' /> }
                    onToggleOn={ this.likeTrack }
                    onToggleOff={ this.unlikeTrack }
                    className={ 'u-marginRight u-marginRight--medium' } />
            </LoadableElement>
        )
    }
}

LikeButton.propTypes = {
    trackId: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => {
    return  {
      likeTrack: trackId => {
        dispatch(likeTrack(trackId))
      },
  
      unlikeTrack: trackId => {
        dispatch(unlikeTrack(trackId))
      }    
    }
  } 

const mapStateToProps = (state, ownProps) => {
    const { entities } = state

    const track = entities.tracks[ownProps.trackId]
    const isLiked = track && track.isLiked
  
    return {
        ...ownProps,
        isLiked
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LikeButton)