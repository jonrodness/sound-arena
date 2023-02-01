import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoadableElement from '../global/LoadableElement'
import Button from '@material-ui/core/Button';
import {
    unlikeTrack,
    LIKE_TRACK
} from '../../actions/user'

class LikeButton extends Component {
    constructor(props) {
        super(props)
        this.unlikeTrack = this.unlikeTrack.bind(this)
    }

    unlikeTrack = () => {
        const {
            trackId,
            unlikeTrack
        } = this.props

        unlikeTrack(trackId)
        // Because track is removed from list, do not need to call handleClose for popOver as the Element is gone
    }        

    render() {
        return (
            <LoadableElement loadIds={ [ LIKE_TRACK ] }>
                <Button onClick={ this.unlikeTrack }>
                    Unlike Track
                </Button>
            </LoadableElement>
        )
    }
}

LikeButton.propTypes = {
    trackId: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => {
    return  {
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