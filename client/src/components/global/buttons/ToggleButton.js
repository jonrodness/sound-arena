import React from 'react'
import PropTypes from 'prop-types'

const ToggleButton = props => {
    const onClick = () => {
        if (props.isActive) {
            props.onToggleOff()
        } else {
            props.onToggleOn()
        }
    }

    const { 
        dataTestId,
        className,
        disabled
     } = props
    const icon = props.isActive ? props.activeIcon : props.inactiveIcon
    let classes  = `${ className } a-iconButton`
    classes = props.classes ? `${classes} ${props.classes} ` : classes

    switch(props.size) {
        case 'medium' :
            classes += ' a-iconButton--medium'
            break;
        default:
    }

    return (
        <button
            className={ classes } 
            onClick={ onClick } 
            data-test-id={ dataTestId }
            disabled={ disabled }>
            { icon }
        </button>
    )
}


ToggleButton.defaultProps = {
    disabled: false
}

ToggleButton.propTypes = {
    onToggleOn: PropTypes.func.isRequired,
    onToggleOff: PropTypes.func.isRequired,   
    isActive: PropTypes.bool.isRequired,
    activeIcon: PropTypes.object.isRequired,
    inactiveIcon: PropTypes.object.isRequired,
    activeClass: PropTypes.string,
    isReady: PropTypes.bool
}

export default ToggleButton