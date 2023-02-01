import React from 'react'
import Typography from '@material-ui/core/Typography'
import TermsAndConditions from './terms-of-service/terms-and-conditions'
import PrivacyPolicy from './terms-of-service/privacy-policy'

const TermsPage = () => {
    return (
        <div className='o-page'>
            <Typography 
                variant='h5'
                component='h2'
            >
                Terms of Service
            </Typography>         
            <div className='u-marginTop'>
                <Typography
                    variant='body2'
                    component='h2'
                >
                    <TermsAndConditions />
                </Typography>
            </div>

            <Typography 
                variant='h5'
                component='h2'
            >
                Privacy Policy
            </Typography>         
            <div className='u-marginTop'>
                <Typography 
                    variant='body2'
                    component='h2'
                >
                    <PrivacyPolicy />
                </Typography>
            </div>     
        </div>
    )
}

export default TermsPage