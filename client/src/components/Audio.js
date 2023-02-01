import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { subscribe, unsubscribe } from '../actions/audio'
import { updateStartTime } from '../actions/competition'
import { setNotification, NOTIFICATION_TYPE } from '../actions/notifications'
import { connect } from 'react-redux'
import { isUrlSafe } from '../utils/validations'
import { set } from 'lodash';

const AUDIO_ERROR_NOTIFICATION = 'There was an error with this audio track. Please refresh the page to try again. If this continues to occur, please CANCEL MATCHUP (see HELP button)'

class Audio extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            id: null,
            isStarted: false
        }
        this.audioRef = null
        this.onTimeUpdate = this.onTimeUpdate.bind(this)
        this.notifySubscribers = this.notifySubscribers.bind(this)
        this.setAudioRef = this.setAudioRef.bind(this)
        this.onAudioError = this.onAudioError.bind(this)
    }

    setAudioRef = el => {
        const {
            src
        } = this.props

        this.audioRef = el
        if (this.audioRef) {
            this.audioRef.addEventListener('loadedmetadata', () => {
                this.props.onLoadMetaData(this.audioRef)
            })
            
            // Initialize audio tag
            if (src && isUrlSafe(src)) {
                this.audioRef.src = src
            }
        }
    }

    togglePlayback = shouldPlay => {
        const { startTime } = this.props
        if (this.audioRef) {
            if (shouldPlay) {
                if (!this.state.isStarted) {
                    this.setState({
                        isStarted: true
                    })
                }
                this.notifySubscribers(this.state.id)
                this.audioRef.play()

                if (!this.state.isStarted && startTime) {
                    // Need to set startTime after playback is initiated for Safari mobile browsers
                    // cannot set currentTime until user interacts with audio
                    this.audioRef.currentTime = startTime
                }
            } else {
                this.audioRef.pause()
            }
        }
    }

    notifySubscribers = notifierId => {
        const stringKeys = Object.keys(this.props.subscribers)
        const ids = stringKeys.map(id => {
            return Number.parseInt(id)
        })
        ids.forEach(id => {
            // Check if subscriber still exists
            // Use double equal (!=) because Object.keys parses out props as strings 
            // and notifierId is int
            if (notifierId != id 
                && this.props.subscribers[id]
                && this.props.subscribers[id].props.updatePlaybackState) {
                this.props.subscribers[id].props.updatePlaybackState(false)
            }
        })
    }

    componentWillMount = () => {
        this.setState(
            { id: this.props.currentId }
        )

        // cannot pass this.state.id because state is updated 
        // asynchronously and won't be set for line below
        this.props.subscribe(this.props.currentId, this)
    }

    componentWillUnmount = () => {
        this.props.unsubscribe(this.state.id)
    }

    componentDidUpdate = prevProps => {
        const { src } = this.props
        let srcUrl
        let prevSrcUrl

        if (prevProps.isPlaying != this.props.isPlaying) {
            this.togglePlayback(this.props.isPlaying)
        }

        // Need to explicitly set this.audioRef.src when src prop changes
        try {
            srcUrl = new URL(src)
            prevSrcUrl = new URL(prevProps.src)

            if (srcUrl && (prevSrcUrl.pathname != srcUrl.pathname) && isUrlSafe(src)) {
                this.audioRef.src = src
            }
        } catch {}
    }

    onTimeUpdate = e => {
        const currentTime = this.audioRef.currentTime * 1000
        if (this.props.isPlayed) return
        if (this.state.isStarted) {
            this.props.onTimeUpdate(this.props.trackKey, currentTime)
        }
    }

    onAudioError = e => {
        this.props.notifyAudioError()
    }

    render() {
        const { src } = this.props

        return(
            isUrlSafe(src) ? (
                <audio
                    ref={ this.setAudioRef }
                    onTimeUpdate={ this.onTimeUpdate } 
                    onError={ this.onAudioError }>
                </audio>
            ) : null
        )
    }
}

Audio.defaultProps = {
    isPlaying: false
}

Audio.propTypes = {
    src: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool,
    onTimeUpdate: PropTypes.func,
    isPlayed: PropTypes.bool,
    trackId: PropTypes.string,
    startTime: PropTypes.number
}

const mapDispatchToProps = dispatch => {
    return  {
        subscribe: (id, component) => {
            dispatch(subscribe(id, component))
        },
        unsubscribe: (id) => {
            dispatch(unsubscribe(id))
        },
        updateStartTime: (trackKey, startTime) => {
            dispatch(updateStartTime(trackKey, startTime))
        },
        notifyAudioError: () => {
            dispatch(setNotification(AUDIO_ERROR_NOTIFICATION, NOTIFICATION_TYPE.ERROR))
        }
    }
  }
  
const mapStateToProps = (state, ownProps) => {
    const { subscribers, currentId } = state.audio

    return {
        ...ownProps,
        subscribers,
        currentId
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(Audio)

