import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AudioCoordinationContainer from '../../containers/AudioCoordinationContainer'
import LoadableElement from '../global/LoadableElement'
import AudioCompetitor from './AudioCompetitor'
import { TRACK_2, NEXT_TRACK } from '../../actions/competition'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { CompetitionSelection } from './CompetitionSelection'

import '../../css/matchup-stage.css'

const TRACK_2_STATES = {
    RENDER_TRACK: 'RENDER_TRACK',
    RENDER_FINISH_TRACK_1: 'RENDER_FINISH_TRACK_1',
    RENDER_LOAD_TRACK_2: 'RENDER_LOAD_TRACK_2'
}

class MatchupStage extends Component {
    constructor(props) {
      super(props)
    }

    render() {
        const {
            tracks,
            onTimeUpdate,
            onSelectWinner,
            isAbleToSelectWinner,
            loadNextTrack,
            ui
        } = this.props

        const renderTrack2 = () => {
            const track2State = !tracks[0].isPlayed ?  (
                TRACK_2_STATES.RENDER_FINISH_TRACK_1
            ) : !tracks[1].id ? (
                TRACK_2_STATES.RENDER_LOAD_TRACK_2
            ) : TRACK_2_STATES.RENDER_TRACK

            let track2 = null

            switch(track2State) {
                case TRACK_2_STATES.RENDER_TRACK:
                    track2 = (
                        <AudioCoordinationContainer>
                            <AudioCompetitor
                                onTimeUpdate={ onTimeUpdate } 
                                track={ tracks[1] }
                                index={ 1 }
                                onSelectWinner={ onSelectWinner }
                                trackKey={ 'track2' }
                                isAbleToSelectWinner={ isAbleToSelectWinner } 
                                isTrackLoadable={ tracks[0].isPlayed }
                                loadNextTrack={ loadNextTrack } />
                        </AudioCoordinationContainer>
                    )
                    break
                case TRACK_2_STATES.RENDER_FINISH_TRACK_1:
                    track2 = (
                        <div className='m-track'>
                            <div className='m-track__row'>
                                <div className='m-track__finishMsg'>
                                    Finish track 1
                                </div>
                            </div>
                        </div>
                    )
                    break
                case TRACK_2_STATES.RENDER_LOAD_TRACK_2:
                    track2 = (
                        <div className='m-track'>
                            <div className='m-track__loadBtnContainer '>
                                <LoadableElement loadIds={ [ TRACK_2, NEXT_TRACK ] }>
                                    <Button
                                        variant="contained"
                                        onClick={ loadNextTrack }
                                        color="primary"
                                    >
                                        Load Track 2
                                    </Button>
                                </LoadableElement>
                            </div>
                        </div>
                    )
            }
    
            return track2
        }
        
        return (
            <React.Fragment>
                <div className='o-player'>
                    <div className='o-player__body o-player__body--multiTrack'>
                        <div className='competitor'>
                            <AudioCoordinationContainer>
                                <AudioCompetitor
                                    onTimeUpdate={ onTimeUpdate } 
                                    track={ tracks[0] }
                                    index={ 0 }
                                    onSelectWinner={ onSelectWinner }
                                    trackKey={ 'track1' }
                                    isAbleToSelectWinner={ isAbleToSelectWinner }
                                    loadNextTrack={ loadNextTrack } 
                                />
                            </AudioCoordinationContainer>
                        </div>

                        <div className='a-boundary'>
                            <hr className='a-boundary__line' />
                                <Typography
                                    variant='overline'
                                    component='span'
                                    className='a-boundary__center'
                                >
                                    VS
                                </Typography>
                            <hr className='a-boundary__line' />
                        </div>
                        
                        <div className='competitor'>
                            { renderTrack2() }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )        
    }
}

MatchupStage.propTypes = {
    tracks: PropTypes.array.isRequired
}

const mapStateToProps = (state, ownProps) => {
    const { ui } = state
        return {
        ...ownProps,
        ui 
    }
}

export default connect(
    mapStateToProps
)(MatchupStage)