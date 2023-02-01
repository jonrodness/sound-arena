import { connect } from 'react-redux'
import LayoutComponent from './component'
import { withRouter } from "react-router-dom"

const mapStateToProps = state => {
    const { user } = state
    const { isAuthenticated } = user

    return {
        isAuthenticated
    }
}

export const LayoutContainer = withRouter(connect(
    mapStateToProps
)(LayoutComponent))