import React from 'react'
import NextMatchupButton from '../../../components/competition/NextMatchupButton'
import '../../../css/ready-stage.css'
import MatchupInitializer from '../MatchupInitializer'
import TrackStatusContainer from '../../../containers/TrackStatusContainer'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Link } from 'react-router-dom'
import { GENRE_MAP } from '../../../reducers/competition'

export const ReadyStageComponent = props => {
    const {
        enteredTrackId,
        enteredGenre,
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
        <div id='ready-stage'>
            <div>
                <div>
                    <div className='u-marginBottom--small'>
                        <Typography   
                            variant='subtitle2'
                            component='p'
                            className='u-marginBottom'
                        >
                            How to enter the competition:
                        </Typography>
                    </div>
                    <Typography   
                        variant='caption'
                        component='p'
                    >
                        1. Select the track you'd like to enter into the competition and the genre that best suits it. 
                    </Typography>
                    <Typography
                        variant='caption'
                        component='p'
                    >
                        2. Submit an entry by completing a matchup of two other tracks.
                    </Typography>                        
                </div>
                <div className='u-marginTop'>
                    <MatchupInitializer />
                </div>
                <div className='u-marginBottom'>
                    <NextMatchupButton />
                </div>
                { enteredTrackId && enteredGenre ? getCard() : null }                                    
            </div>
        </div>
    )
}