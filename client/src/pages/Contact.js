import React from 'react'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

const ContactPage = () => {
    return (
        <div className='o-page'>
            <Container fixed>
                <Typography 
                    variant='h5'
                    component='h2'
                >
                    Contact
                </Typography>

                <div className='u-marginTop--small'>
                    <Typography 
                        variant='subtitle1'
                        component='p'
                    >
                        Follow SoundArena on social media to hear the latest featured competition results. Feel free to send an email for any comments and suggestions!                        
                    </Typography>                    
                </div>

                <ul>
                    <li className='u-marginTop--small'>
                        <Typography 
                            variant='subtitle2'
                            component='span'
                        >
                            Email:&nbsp;                       
                        </Typography>
                        <Typography 
                            variant='subtitle1'
                            component='span'
                        >
                        </Typography>                        
                    </li>                    
                    <li className='u-marginTop--small'>
                        <Typography 
                            variant='subtitle2'
                            component='span'
                        >
                            Twitter:&nbsp;
                        </Typography>
                        <a 
                            href=''
                            url=''
                            target="_blank" 
                            rel="noopener"
                            className='u-colorPurple'
                        >
                        </a>
                    </li>
                    <li className='u-marginTop--small'>
                        <Typography 
                            variant='subtitle2'
                            component='span'
                        >
                            Instagram:&nbsp;
                        </Typography>
                        <a 
                            href=''
                            url=''
                            target="_blank" 
                            rel="noopener"
                            className='u-colorPurple'
                        >
                        </a> 
                    </li>                                     
                </ul>                                  
            </Container>        
        </div>
    )
}

export default ContactPage