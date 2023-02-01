import React from 'react'
import Typography from '@material-ui/core/Typography'
import TermsAndConditions from './terms-and-conditions'
import Privacy from './privacy-policy'


const AboutPage = () => {
    return (
        <div className='o-page'>
            <Typography
                variant='h5'
                component='h2'
            >
                Terms and Conditions
            </Typography>         
            <div className='u-marginTop u-wordBreak'>
                <TermsAndConditions />
            </div>        
            <div className='u-marginTop u-wordBreak'>
                <Privacy />
            </div>     
        </div>
    )
}

export default AboutPage