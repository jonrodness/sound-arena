import React from 'react'
import AudioWinner from '../AudioWinner'
import AudioCoordinationContainer from '../../../containers/AudioCoordinationContainer'
import NextMatchupButton from '../../../components/competition/NextMatchupButton'
import PropTypes from 'prop-types'
import { CompetitionSelection } from '../CompetitionSelection'
import TrackStatusContainer from '../../../containers/TrackStatusContainer'
import Typography from '@material-ui/core/Typography'
import MatchupInitializer from '../MatchupInitializer'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Link } from 'react-router-dom'
import { GENRE_MAP } from '../../../reducers/competition'

export const WinnerStageComponent = props => {
    const {
        isReadyToStart,
        enteredGenre,
        enteredTrackId,
        enteredTrackTitle
    } = props

    const trackLink = `/track/${enteredTrackId}/`
    const genreName = enteredGenre ? GENRE_MAP[enteredGenre].name : ''
    
    const getCard = () => {
        return (
            <Card className='m-competitionStats'>
                <CardContent>
                    <Typography 
                        variant='subtitle2'
                        component='div' 
                    >
                        { genreName } Competition stats for { enteredTrackTitle }:
                    </Typography>
                    <Typography 
                        variant='caption'
                        component='div' 
                    >
                        * Stats reset daily
                    </Typography>                        
                    <div className='u-marginTop--small'>
                        <TrackStatusContainer
                            genre={enteredGenre}
                            trackId={enteredTrackId}
                        />
                    </div>
                    <div className='u-marginTop'>
                        <Typography
                            variant='body2'
                            component='p'
                        >
                            View Awards, Results and Notifications, and add Links for this track in your <span className='a-linkText__indigo'><Link to={trackLink}>profile</Link></span>.
                        </Typography> 
                    </div>                          
                </CardContent>                    
            </Card>              
        )        
    }

    return (
        <React.Fragment>
            {
                isReadyToStart && (
                    <div className='u-marginTop'>                  
                        <MatchupInitializer />
                        <div className='u-marginBottom'>
                            <NextMatchupButton />
                        </div>                        
                        { getCard() } 
                    </div>
                )
            }

            <div className='o-player'>
                <div className='o-player__body'>
                    <AudioCoordinationContainer>
                        <AudioWinner 
                            onTimeUpdate={ props.onTimeUpdate }
                            track={ props.track }
                            fetchLikedTracks={ props.fetchLikedTracks } 
                        />
                    </AudioCoordinationContainer>
                </div>
            </div>
        </React.Fragment>
    )
}

WinnerStageComponent.propTypes = {
    isReadyToStart: PropTypes.bool.isRequired
}