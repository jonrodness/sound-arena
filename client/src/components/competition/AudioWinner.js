import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PlayBackButton from '../PlayBackButton'
import Audio from '../Audio'
import AudioStatus from '../AudioStatus'
import { COMPETITION } from '../../reducers/competition'
import { cancelMatchup } from '../../actions/competition'
import Typography from '@material-ui/core/Typography'
import LikeButton from '../global/buttons/LikeButton'

import '../../css/audio-container.css'

class AudioWinner extends Component {
    constructor(props) {
        super(props)
        this.setTrackStartTime = this.setTrackStartTime.bind(this)
    }

    componentDidMount = () => {
        this.props.fetchLikedTracks()
    }        

    setTrackStartTime = () => {}

    render() {
        const { 
            track,
            cancelMatchup
        } = this.props
        const artistPath = '/user/' + track.artistId + '/' + track.artistName

        return (
            <div className='m-track'>
                <Audio
                    trackId={ track.id }
                    isPlaying={ this.props.isPlaying }
                    onTimeUpdate={ this.props.onTimeUpdate }
                    isPlayed={ track.isPlayed }
                    trackKey={ 'winner' }
                    src={ track.streamUrl }
                    onLoadMetaData={ this.setTrackStartTime }
                    updatePlaybackState= { this.props.updatePlaybackState } 
                />   
                <div className='m-track__row'>
                    <div className='u-iconWidth'>
                        <LikeButton trackId={ track.id } />                        
                    </div>                
                    <div className='m-track__info u-flexGrow'>
                        <Typography
                            variant='subtitle1'
                            component='div' 
                            noWrap={true}
                        >
                            { track.trackTitle }
                        </Typography>
                        <Typography
                            variant='subtitle2'
                            component='div'
                            noWrap={true}
                        >
                            <Link to={ artistPath }>
                                by { track.artistName }
                            </Link>
                        </Typography>
                    </div>
                    <div>
                        <AudioStatus
                            track={ track }
                            totalTime={ COMPETITION.WINNER_COUNTDOWN_INIT } 
                            cancelMatchup={ cancelMatchup }
                        />
                    </div>
                    <PlayBackButton
                        isPlaying={ this.props.isPlaying } 
                        updatePlaybackState={ this.props.updatePlaybackState }
                        classes='m-track__playbackBtn u-colorWhite a-iconButton--noLeftMargin a-iconButton--noLeftPadding '
                        dataTestId='winner-playback-btn' 
                    />                                        
                </div>          
            </div>
        )
    }
}

AudioWinner.propTypes = {
    isPlaying: PropTypes.bool,
    onTimeUpdate: PropTypes.func.isRequired,
    track: PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    const { ui } = state
  
    return {
        ...ownProps,
        ui 
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancelMatchup: () => {
            dispatch(cancelMatchup())
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AudioWinner)