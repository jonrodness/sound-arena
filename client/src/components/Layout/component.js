import React from 'react'
import { Route, Switch } from "react-router-dom"
import HomeContainer from "../../containers/HomeContainer.js"
import CompetitionContainer from "../../containers/CompetitionContainer"
import UserProfileContainer from "../../containers/UserProfileContainer"
import MyProfileContainer from "../../containers/MyProfileContainer"
import MyFavoritesContainer from "../../containers/MyFavoritesContainer"
import NotificationContainer from '../../containers/NotificationContainer'
import TrackView from '../../components/track/TrackView'
import AboutPage from '../../pages/About'
import TermsOfServicePage from '../../pages/terms-of-service'
import NavBar from '../../components/navigation/NavBar.js'
import BottomNavBar from '../../components/navigation/BottomNavBar.js'
import { Footer } from '../../components/navigation/Footer'
import SecuredRoute from '../../components/auth/SecuredRoute'
import SignupPage from '../../pages/signup-page'
import RegisterPage from '../../pages/register-page'
import PropTypes from 'prop-types'
import HowItWorksPage from '../../pages/HowItWorks.js'
import ContactPage from '../../pages/Contact.js'

const registerPagePath = '/register'

const LayoutComponent = props => {
    const {
        isAuthenticated
    } = props

    // Allow register page to register user prior to rendering BottomNavBar and making
    // user requests
    const showBottomNav = (window.location.pathname != registerPagePath) && isAuthenticated

    return (
        <div className='app-wrapper'>
            <NavBar />
            <div className='app-body'>
                <Switch>
                    <Route exact path='/sign-in' component={ SignupPage } />
                    <Route
                        path='/user/:userId/:username?'
                        component={ UserProfileContainer } />             
                    <Route
                        path='/track/:trackId/:trackTitle?'
                        component={ TrackView } />
                    <Route
                        path='/award/:trackId/:trackTitle?'
                        component={ TrackView } />                        
                    <Route
                        path='/about'
                        component={ AboutPage } />
                    <Route
                        path='/how-it-works'
                        component={ HowItWorksPage } />                      
                    <Route
                        path='/contact'
                        component={ ContactPage } />
                    <Route
                        path='/terms'
                        component={ TermsOfServicePage } />
                    <SecuredRoute
                        path='/competition'
                        component={ CompetitionContainer } />              
                    <SecuredRoute
                        path='/my-profile/:username?'
                        component={ MyProfileContainer } />
                    <SecuredRoute
                        path='/liked-tracks'
                        component={ MyFavoritesContainer } />                                       
                    <Route path='/signup' component={ SignupPage } />
                    <Route path={registerPagePath} component={ RegisterPage } />
                    <Route path='/' component={ HomeContainer } />
                </Switch>
                <NotificationContainer />
                {
                    showBottomNav ? <div id='bottom-nav-spacer'></div> : null
                }
            </div>
            {
                showBottomNav ? <BottomNavBar /> : <Footer />
            }
        </div>
    )
}

LayoutComponent.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
}

export default LayoutComponent