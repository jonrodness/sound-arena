import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import { connect } from 'react-redux'
import { requestStateSelector } from '../../reducers/ui'
import { REQUEST_PENDING } from '../../actions/ui'

const LoadableElement = props => {
    const {
        children,
        isLoading,
        centered,
        loadIds,
        ui
    } = props

    // determine load state in LoadableElement if loadId is passed in
    const displayLoader = loadIds ? requestStateSelector(ui, REQUEST_PENDING, loadIds) : isLoading
    const loader = centered ? (
        <div className='u-fullWidth u-centered a-spinner'>
            <CircularProgress />
        </div>
    ) : <CircularProgress />

    return (
        <React.Fragment>
            { displayLoader ? loader : children }
        </React.Fragment>
    )
}

LoadableElement.propTypes = {
    children: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    centered: PropTypes.bool,
    loadIds: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = (state, ownProps) => {
    const { ui } = state
  
    return {
        ...ownProps,
        ui 
    }
}

export default connect(
    mapStateToProps
)(LoadableElement)