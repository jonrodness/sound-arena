import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Countdown from './Countdown'
import { MdDone } from 'react-icons/lib/md'
import CircularProgress from '@material-ui/core/CircularProgress'

class AudioStatus extends Component {
    constructor(props) {
      super(props)    
    }

    render() {
        const { track } = this.props

        const countdown = (
            <Countdown
                countdown={ track.countdown } 
                isPlayedRequestConfirmed={ track.isPlayedRequestConfirmed }
                isPlayed={ track.isPlayed }
            />
        )

        return (
            track.isPlayed ? (
                <div className='a-icon u-colorBrightGreen'>
                    <MdDone />
                </div>
            ) : track.isPlayedRequestSent ? (
                <div className='a-icon'>
                    <CircularProgress /> 
                </div>
            ) : countdown
        )
    }
}

AudioStatus.defaultProps = {
    tracks: []
}

AudioStatus.propTypes = {
    tracks: PropTypes.array.isRequired,
}

export default AudioStatus