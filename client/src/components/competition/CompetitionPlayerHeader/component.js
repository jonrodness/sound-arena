import React from 'react'
import { CompetitionHelpBtn } from '../CompetitionHelpBtn'
import { CompetitionHeaderMsg } from '../CompetitionHeaderMsg'
import Typography from '@material-ui/core/Typography'

export const CompetitionPlayerHeaderComponent = () => {
    return (
        <React.Fragment>
            <Typography
                variant='h6'
                component='div'
            >
                Current Matchup: 
            </Typography>            
            <div className='o-player__header'>
                <div className='u-flexRow'>
                    <CompetitionHeaderMsg />
                    <CompetitionHelpBtn />
                </div>
            </div>            
        </React.Fragment>
    )
}