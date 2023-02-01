import React, {useEffect} from 'react'
import {GraphWrapper} from '../../user/GraphWrapper'
import Typography from '@material-ui/core/Typography'
import LoadableElement from '../../global/LoadableElement'
import { TRACK_SCORE } from '../../../actions/track'

export const ResultsPaneComponent = props => {
    const {
        trackId,
        getTrackScore
    } = props

    useEffect(() => {
        getTrackScore(trackId)
    });

    return (
        <React.Fragment>
            <Typography 
                variant='h5' 
                component='h1' 
                gutterBottom
            >
                Competition Results
            </Typography>
            <Typography
                variant='subtitle2'
                component='p'
                gutterBottom
            >
                See how your track performed in the competition! Keep entering the competition to reveal more of your track's success profile.
            </Typography>
            <div className='u-marginTop'>
                <div className='u-centered'>
                    <Typography
                        variant='caption'
                        component='p'
                        gutterBottom
                    >
                        Win percentage / second
                    </Typography> 
                </div>
                <div className='u-centered'>
                    <LoadableElement loadIds={ [ TRACK_SCORE ] }>            
                        <GraphWrapper
                            trackId={ trackId } 
                        />              
                    </LoadableElement>
                </div>
            </div>                 
        </React.Fragment>
    )
}