import React, { Component } from 'react'
import { COMPETITION_STAGE } from '../../../reducers/competition'
import PropTypes from 'prop-types'
import { StyledText } from './styles'
import { Link } from 'react-router-dom'

export class CompetitionHeaderMsgComponent extends Component {
    constructor(props) {
      super(props)

      this.getHeaderMsg = this.getHeaderMsg.bind(this)
    }

    getHeaderMsg() {
        const {
            currentStage,
            completedMinEntries,
            entriesRemaining,
            enteredTrackTitle,
            enteredTrackId
        } = this.props

        const trackLink = `/track/${enteredTrackId}/`
        let msg = ''
        const finishedMsg = `Congrats! You\'ve submitted the minimum daily number of entries for ${ enteredTrackTitle }. Make sure to add links to your track in your Profile so everyone can find your music. Check back tomorrow for results!`
        const continueMsg = `Keep entering to make your track eligible for tomorrow\'s results. Only ${ entriesRemaining } more entries to go!`
        const complete5Matchup = completedMinEntries ? finishedMsg : continueMsg 

        switch (currentStage) {
            case COMPETITION_STAGE.READY_0:
                msg = 'Select your track and a genre to enter the competition'
                break
            case COMPETITION_STAGE.TRACK1_1:
                msg = 'Step 1: Play Track 1 until the timer counts down to 00:00'
                break
            case COMPETITION_STAGE.TRACK2_2:
                msg = 'Step 2: Play Track 2 until the timer counts down to 00:00'
                break
            case COMPETITION_STAGE.DECIDING_3:
                msg = 'Step 3: Choose the track you like the best by selecting one of the trophies below'
                break
            case COMPETITION_STAGE.WINNER_4:
                msg = 'Step 4: Play the winning track until the timer counts down to 00:00'
                break
            case COMPETITION_STAGE.COMPLETE_5:
                msg = complete5Matchup
                break
        }

        return msg
    }

    render() {
        return (
            <div className='a-competitionHeaderMsg u-flexRow u-alignItemsCenter'>
                <div>
                    <StyledText
                        variant='body2'
                        component='p'
                    >
                        { this.getHeaderMsg() }
                    </StyledText> 
                </div>
            </div>
        )
    }
}


CompetitionHeaderMsgComponent.propTypes = {
    currentStage: PropTypes.string.isRequired,
    completedMinEntries: PropTypes.bool
}