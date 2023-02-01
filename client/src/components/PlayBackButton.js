import PropTypes from 'prop-types'
import React from 'react'
import { MdPause, MdPlayArrow } from 'react-icons/lib/md'
import '../css/playback-btn.css'
import ToggleButton from './global/buttons/ToggleButton'


const PlayBackButton = props => {
    const {
        isPlaying,
        updatePlaybackState,
        classes,
        dataTestId,
        disabled
    } = props
    return (
        <ToggleButton
            isActive={ isPlaying }
            activeIcon={ <MdPause /> }
            inactiveIcon={ <MdPlayArrow /> } 
            onToggleOn={ updatePlaybackState }
            onToggleOff={ updatePlaybackState }
            classes={ classes }
            dataTestId={ dataTestId }
            disabled={ disabled } />
    )
}

PlayBackButton.defaultProps = {
    isPlaying: false,
    disabled: false
}

PlayBackButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    disabled: PropTypes.bool
}

export default PlayBackButton