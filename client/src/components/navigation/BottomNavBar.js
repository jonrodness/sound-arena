import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { 
    fetchMyNewAwards,
    fetchMyCompetitionNotifications
} from '../../actions/user'
import PropTypes from 'prop-types'
import Badge from '@material-ui/core/Badge'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { MdFavorite, MdPerson, MdHome } from 'react-icons/lib/md'
import FaTrophy from 'react-icons/lib/fa/trophy'
import { withStyles } from '@material-ui/core'
import { notificationsCountSelector } from '../../selectors/user'

const styles = {
    root: {
        'justify-content': 'space-around'
    }
}

const PAGE_VALUES = {
    HOME: 'home',
    COMPETITION: 'competition',
    LIKED_TRACKS: 'likedTracks',
    MY_PROFILE: 'myProfile'
}

const PAGE_PATHS = {
    HOME: '/',
    COMPETITION: '/competition',
    LIKED_TRACKS: '/liked-tracks',
    MY_PROFILE: '/my-profile'
}

class BottomNavBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { value: '' }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount = () => {
        const { 
            fetchMyNewAwards,
            fetchMyCompetitionNotifications,
            isRegistering
        } = this.props
        
        if (!isRegistering) {
            fetchMyCompetitionNotifications()
            fetchMyNewAwards()
        }
    }        

    handleChange = (event, value) => {
        const { userName } = this.props
        const navMapping = {}
        navMapping[PAGE_VALUES.HOME] = PAGE_PATHS.HOME
        navMapping[PAGE_VALUES.MY_PROFILE] = `${ PAGE_PATHS.MY_PROFILE }/${ userName }`
        navMapping[PAGE_VALUES.COMPETITION] = PAGE_PATHS.COMPETITION
        navMapping[PAGE_VALUES.LIKED_TRACKS] = PAGE_PATHS.LIKED_TRACKS

        const newPath = navMapping[value]
        this.setState({ value })
        this.props.history.push(newPath)
    }

    /**
    * Gets the current PageType based on the current URL.
    * @returns {string} The current PageType or empty string.
    */ 
    getCurrentPageType = () => {
        const pathname = this.props.location.pathname
        let pageType = ''
        if (pathname === (PAGE_PATHS.HOME)) {
            pageType = PAGE_VALUES.HOME
        } else if (pathname.includes(PAGE_PATHS.MY_PROFILE)) {
            pageType = PAGE_VALUES.MY_PROFILE
        } else if (pathname.includes(PAGE_PATHS.COMPETITION)) {
            pageType = PAGE_VALUES.COMPETITION
        } else if (pathname.includes(PAGE_PATHS.LIKED_TRACKS)) {
            pageType = PAGE_VALUES.LIKED_TRACKS
        }

        return pageType
    }

    render() {
        const { 
            classes, 
            notificationsCount
        } = this.props
        const bottomNavclassList = `
            m-bottomNav
        `

        const hideProfileNotification = !notificationsCount

        let pageType = this.getCurrentPageType()

        return (
            <div id='bottom-nav-container'>
                <BottomNavigation
                    value={ pageType }
                    onChange= { this.handleChange }
                    showLabels                
                    className={ bottomNavclassList }
                    classes={{
                        root: classes.root
                    }} >
                    <BottomNavigationAction 
                        value={ PAGE_VALUES.HOME }
                        label='Home' 
                        icon={<MdHome />} />
                    <BottomNavigationAction
                        data-test-id='competition-nav-btn'
                        value={ PAGE_VALUES.COMPETITION }
                        label='Competition'
                        icon={<FaTrophy />} />                       
                    <BottomNavigationAction
                        value={ PAGE_VALUES.MY_PROFILE }
                        label='Profile' 
                        icon={
                            <Badge 
                                color="secondary" 
                                badgeContent={ notificationsCount } 
                                invisible={ hideProfileNotification } 
                            >
                                <MdPerson />
                            </Badge>
                        } />
                    <BottomNavigationAction
                        value={ PAGE_VALUES.LIKED_TRACKS }
                        label='Likes'
                        icon={<MdFavorite />} />
                </BottomNavigation>
            </div>
        )
    }
}

BottomNavBar.propTypes = {
    newAwardsByTrack: PropTypes.bool
}

const mapDispatchToProps = dispatch => {
    return  {
        fetchMyNewAwards: () => {
            dispatch(fetchMyNewAwards())
        },
        fetchMyCompetitionNotifications: () => {
            dispatch(fetchMyCompetitionNotifications())
        }
    }
}

const mapStateToProps = state => {
    const { user } = state
    const { userName, awards, isRegistering } = user
    const notificationsCount = notificationsCountSelector(state)

    return {
        userName,
        notificationsCount,
        isRegistering
    }
}

export default withRouter(
    connect(
        mapStateToProps, 
        mapDispatchToProps
    )(
        withStyles(styles)(BottomNavBar)
    )
)