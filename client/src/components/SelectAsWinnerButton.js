import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FaTrophy from 'react-icons/lib/fa/trophy'

class SelectAsWinnerButton extends Component {
    constructor(props) {
      super(props)
    }

    onClick = () => {
        const {
            onSelectWinner,
            trackKey
        } = this.props

        onSelectWinner(trackKey)
    }

    render() {
        const {
            dataTestId,
            className,
            disabled
        } = this.props

        const iconClassName = disabled ? '' : 'u-animatePulse'
    
        return(
            <button
                data-test-id={ dataTestId }
                className={`
                    ${ className } a-iconButton 
                    a-iconButton--orange
                `}
                onClick={ this.onClick }
                disabled= {disabled }
            >
                <FaTrophy className={ iconClassName } />
            </button>
        )
    }
}

SelectAsWinnerButton.propTypes = {
    onSelectWinner: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool.isRequired
}

export default SelectAsWinnerButton