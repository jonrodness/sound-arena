import React from 'react'
import PropTypes from 'prop-types'
import '../css/countdown.css'
import formatting from '../utils/formatting'
import COMPETITION from '../reducers/competition'

const Countdown = ( props ) => {
    const formattedTime = formatting.getClockTime(props.countdown / 1000)

    return (
        <div className='timer'>
           { formattedTime.minutes }:{ formattedTime.seconds }
        </div> 
    )
}

Countdown.defaultProps = {
    countdown: COMPETITION.PLAYBACK_DURATION
}

Countdown.propTypes = {
    countdown: PropTypes.number.isRequired,
}

export default Countdown;