import React from 'react'
import PropTypes from 'prop-types'

const IconSpacer = props => {
    const {
        size
    } = props
    
    let extraClasses = ''
    
    switch(size) {
        case SIZES.MEDIUM:
            extraClasses = 'a-iconButton--medium'
    }

    return <div className={`a-iconButton ${extraClasses}`}></div>
}

IconSpacer.propTypes = {
    size: PropTypes.string.isRequired,
}

export default IconSpacer

export const SIZES = {
    MEDIUM: 'medium'
}