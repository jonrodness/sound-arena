import React, { Component } from 'react'
import { signUp } from "../services/user"
import getFirebaseApp from '../firebase'
import CircularProgress from '@material-ui/core/CircularProgress'
import { get } from 'lodash'

let firebaseui = require('firebaseui')
let firebase = getFirebaseApp()

const redirectUrl = '/my-profile'
const registerUrl = '/register'

class SignupPage extends Component {
  constructor(props) {
    super(props)
  }

  makeSignUpRequest(formData) {
    signUp(formData)
      .then(message => {
        // store user state and redirect
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount() {
    const that = this
    // Should only be 1 instance of firebaseui.auth.AuthUI
    var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(authResult, _) {
          const isNewUser = get(authResult, 'additionalUserInfo.isNewUser', false)
          if (isNewUser) {
            // Redirect to /register and insert user prior to making
            // user requests from BottomNavBar
            window.location.assign(registerUrl)
          } else {
            window.location.assign(redirectUrl)
          }
          return false
        },
        uiShown: function() {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none'
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInOptions: [{
        // Leave the lines as is for the providers you want to offer your users.
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      }],
      // Terms of service url.
      tosUrl: '/terms',
      // Privacy policy url.
      privacyPolicyUrl: '/terms'
    };

    ui.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    const inputs = [
      {
        name: 'name',
        type: 'text',
        label: 'Name'
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email'
      },
      {
        name: 'password',
        type: 'password',
        label: 'Password'
      },
      {
        name: 'passwordConfirm',
        type: 'password',
        label: 'Confirm Password'
      }         
    ]

    return (
      <div>
        <div className='u-centered u-marginTop--large'>
          <div id='firebaseui-auth-container'></div>
          <div id='loader' className='u-marginVertical'>
            <CircularProgress/>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage