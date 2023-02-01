import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import getFirebaseApp from '../../firebase'
import NavMenu from './NavMenu'
import Badge from '@material-ui/core/Badge'

let firebase = getFirebaseApp()

function NavBar(props) {
  const { isAuthenticated, userName } = props

  const signOut = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    }).finally(function() {
      props.history.replace('/')
    })
  }

  const navigateToSignIn = () => {
    props.history.push('/sign-in')
  }

  const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    }
  };
  

  return (
    <AppBar
      position='static'
      className='m-nav u-boxShadow'
    >
      <Toolbar className='u-justifyContentSpaceBetween'>
        <div className='u-flexRow'>
          <Badge
            badgeContent={'BETA'}
            color="secondary"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}>  
            <Link to='/'>
              <img src='/header-logo.svg' height='45px'></img>
            </Link>
          </Badge>
          <div className='primaryNavText u-flexGrow u-minBreakpoint2'>
            <Link to='/' className='a-link--noUnderline'>
                <div className='m-nav__item a-logo'>
                  <span className='a-logo__1st'>Sound</span>
                  <span className='a-logo__2nd'>Arena</span>    
                </div>              
            </Link>
          </div>
        </div>
        <div className='u-flexRow u-alignItemsCenter'>
          {
            !isAuthenticated && (
              <Button 
                onClick={ () => navigateToSignIn() }
                data-test-id='sign-in-btn'
                className='a-button--lowercase'
                classes={{root:'m-nav__item'}}
              >
                Sign in/Sign up
              </Button>
            )
          }
          {
            isAuthenticated &&
            <div>
              <label className='primaryNavText m-nav__desktopOnly m-nav__interiorElement'>
                { userName }
              </label>
              <Button 
                onClick={ () => signOut() }
                data-test-id='sign-out-btn'
                className='a-button--lowercase'
                classes={{root:'m-nav__item'}}
              >
                Sign Out
              </Button>
            </div>
          }
          <NavMenu />
        </div>
      </Toolbar>
    </AppBar>
  )
}

const mapStateToProps = state => {
  const { isAuthenticated, userName } = state.user
  
  return {
    isAuthenticated,
    userName
  }
}

export default connect(
  mapStateToProps
)(withRouter(NavBar))