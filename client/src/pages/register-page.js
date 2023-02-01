import React, { useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { registerUser } from '../services/account'

const redirectUrl = '/my-profile'

const RegisterPage = () => {
    useEffect(() => {
        async function onNewUser() {
            try {
                // Need to register user first before BottomNavBar renders and makes user requests
                await registerUser()
            } finally {
                window.location.assign(redirectUrl)
            }
        }
        onNewUser()
    }, []);

    return (
        <div className='o-page'>
            <div id='loader' className='u-marginVertical u-centered'>
                <CircularProgress/>
            </div>
        </div>
    )
}

export default RegisterPage