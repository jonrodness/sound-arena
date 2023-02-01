import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PlayBackButton from '../PlayBackButton'
import SelectAsWinnerButton from '../SelectAsWinnerButton'
import Audio from '../Audio'
import AudioStatus from '../AudioStatus'
import { COMPETITION } from '../../reducers/competition'
import { cancelMatchup, SELECT_WINNER } from '../../actions/competition'
import Typography from '@material-ui/core/Typography'
import LoadableElement from '../global/LoadableElement'

import '../../css/audio-container.css'

class AudioCompetitor extends Component {
    constructor(props) {
      super(props)
      this.setTrackStartTime = this.setTrackStartTime.bind(this)
      this.state = {
        isReady: false
      }
    }

    // Upon countdown finishing, pause track
    componentDidUpdate = prevProps => {
      if (prevProps.track.countdown != this.props.track.countdown 
          && this.props.track.countdown <= 0) {
          this.props.updatePlaybackState(false)
      }
    }

    setTrackStartTime = audioEl => {
      this.setState({
        isReady: true
      })
    }

    render() {
      const { 
        track,
        isPlaying,
        onTimeUpdate,
        trackKey,
        updatePlaybackState,
        isAbleToSelectWinner,
        onSelectWinner,
        index,
        cancelMatchup
      } = this.props

      const {
        isReady
      } = this.state

      const trackLabel = this.props.trackKey === 'track1' ? 'Track 1': 'Track 2'
      let className = 'm-track '
      className += this.props.trackKey === 'track1' ? 'm-track--1': 'm-track--2'

      return (
        <div className={ className }>
            <Audio
              trackId={ track.id }
              src={ track.streamUrl }
              isPlaying={ isPlaying }
              onTimeUpdate={ onTimeUpdate }
              isPlayed={ track.isPlayed }
              trackKey={ trackKey }
              onLoadMetaData={ this.setTrackStartTime }
              updatePlaybackState={ updatePlaybackState }
              startTime={ track.startTime } />
            <div className='m-track__row'>
              {
                <React.Fragment>
                  {
                    <div className='m-track__selectWinnerBtn'>
                      <LoadableElement loadIds={ [ SELECT_WINNER ] }>
                        <SelectAsWinnerButton
                          dataTestId={ isAbleToSelectWinner ? 'select-winner-btn' : '' }
                          onSelectWinner={ onSelectWinner }
                          trackId={ track.id }
                          index={ index }
                          trackKey={ trackKey }
                          disabled={ !isAbleToSelectWinner }
                        /> 
                      </ LoadableElement>
                    </div>                      
                  }
                  <div className='m-track__info u-flexGrow'>
                    <Typography
                      variant='subtitle1'
                      component='div'
                      noWrap={true}
                    >
                      { trackLabel }
                    </Typography>
                  </div>

                  <div className='m-track__audioStatus'>
                    <AudioStatus
                      track={ track }
                      totalTime={ COMPETITION.MATCHUP_COUNTDOWN_INIT }
                      isAbleToSelectWinner={ isAbleToSelectWinner }
                      cancelMatchup={ cancelMatchup } />
                  </div>
                  <div className='m-track__playbackBtn'>
                    <PlayBackButton
                      isPlaying={ isPlaying } 
                      updatePlaybackState={ updatePlaybackState }
                      classes='u-colorWhite'
                      disabled={!isReady}
                    />
                  </div>                  
                </React.Fragment>
              }          
            </div>
        </div>
      )
  }
}

AudioCompetitor.propTypes = {
  isPlaying: PropTypes.bool,
  onSelectWinner: PropTypes.func.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  track: PropTypes.object.isRequired,
  togglePlayback: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    cancelMatchup: () => {
      dispatch(cancelMatchup())
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { ui } = state

	return {
    ...ownProps,
    ui 
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AudioCompetitor)