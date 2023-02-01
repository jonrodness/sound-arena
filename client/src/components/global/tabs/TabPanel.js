import React from 'react'
import PropTypes from 'prop-types'

const TabPanel = props => {
    const { 
        tabValue,
        index,
        children
    } = props

    const show = tabValue === index

    return(
        <React.Fragment>
            { show && children }
        </React.Fragment>
    )
}

TabPanel.defaultProps = {
    index: 0,
    tabValue: false,
    children: null
}

TabPanel.propTypes = {
    index: PropTypes.number.isRequired,
    tabValue: PropTypes.number.isRequired,
    children: PropTypes.node
}
  
export default TabPanel