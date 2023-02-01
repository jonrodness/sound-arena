import React from 'react'
import Typography from '@material-ui/core/Typography'
import FaInstagram from 'react-icons/lib/fa/instagram'
import FaTwitter from 'react-icons/lib/fa/twitter'
import Link from '@material-ui/core/Link'
import { SafeLink } from '../../../components/global/links/SafeLink'

export const FooterComponent = props => {
    return (
        <div className='m-footer'>
            <div className='u-flexRow u-alignItemsCenter'>
                <Typography
                    variant='overline'
                    component='span'
                    className='m-footer__right'
                >
                    &#169; 2021 SoundArena
                </Typography>
                <div className='u-marginHorizontal--small u-flexColumn'>
                    <a 
                        href='https://twitter.com/SoundArenaApp'
                        url='https://twitter.com/SoundArenaApp'
                        target="_blank" 
                        rel="noopener"
                        className='u-flex'
                    >
                        <FaTwitter />
                    </a>
                </div>
                <div className='u-marginHorizontal--small u-flexColumn'>
                    <a 
                        href='https://www.instagram.com/soundarenaapp'
                        url='https://www.instagram.com/soundarenaapp'
                        target="_blank" 
                        rel="noopener"
                        className='u-flex'
                    >
                        <FaInstagram />
                    </a>
                </div>             
            </div>
        </div>
    )
}

