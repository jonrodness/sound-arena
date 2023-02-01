import React from 'react'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { Link } from 'react-router-dom'

const AboutPage = () => {
    return (
        <div className='o-page'>
            <Container fixed>
                <Typography 
                    variant='h5'
                    component='h2'
                >
                    About SoundArena
                </Typography>
                <ul>          
                    <li className='u-marginTop--small'>
                        <Link
                            className='u-colorPurple' 
                            to={ '/sign-in' }
                        >
                            SIGN UP
                        </Link>
                        <Typography 
                            variant='subtitle1'
                            component='span'
                        >
                            &nbsp;to enter the competition!
                        </Typography>
                    </li>
                    <li className='u-marginTop--small'>
                        <Typography 
                            variant='subtitle1'
                            component='span'
                        >
                            Read&nbsp;
                        </Typography>                    
                        <Link
                            className='u-colorPurple' 
                            to={ '/how-it-works' }
                        >
                            HOW IT WORKS
                        </Link>
                    </li>
                    <li className='u-marginTop--small'>
                        <Typography 
                            variant='subtitle1'
                            component='span'
                        >
                        SoundArena is currently in Beta. All feedback is welcome. Please send comments and suggestions to info@soundarena.app
                        </Typography>
                    </li>                                   
                </ul>                  
                <Typography 
                    variant='h6'
                    component='h2'
                    className='u-marginTop--medium'
                >
                    The Objective:
                </Typography>                    
                <div className='u-marginTop--small'>
                    <Typography 
                        variant='subtitle2'
                        component='h2'
                    >
                        SoundArena discovers the best music
                    </Typography>
                    <Typography 
                        variant='body2'
                        component='h2'
                    >
                        In a sea of music, it's never been more difficult for talented artists to stand out. 
                        Without big marketing dollars behind you, your talents may be overlooked. 
                        That's where SoundArena comes in.
                    </Typography>
                </div>
                <div className='u-marginTop--medium'>
                    <Typography 
                        variant='subtitle2'
                        component='h2'
                    >
                        SoundArena is a free and fair online music competition
                    </Typography>                    
                    <Typography 
                        variant='body2'
                        component='h2'
                    >
                        Anyone can easily upload their music and enter the competition.
                        The playing field is completely level and any song can rise to the top of the rankings - no marketing, promotion or money required!
                    </Typography> 
                </div>
                <div className='u-marginTop--medium'>
                    <Typography 
                        variant='subtitle2'
                        component='h2'
                    >
                        Your winning tracks will be highlighted throughout the SoundArena platform
                    </Typography>
                    <Typography 
                        variant='body2'
                        component='h2'
                    >
                        Rankings for daily competitions are posted on SoundArena.
                        Your accomplishments are available to share so you can show the world how amazing your music really is.
                    </Typography>                                   
                </div>
                <div className='u-marginTop--medium'>
                    <Typography 
                        variant='subtitle2'
                        component='h2'
                    >
                        Receive honest feedback
                    </Typography>
                    <Typography 
                        variant='body2'
                        component='h2'
                    >
                        The more you enter the competition, the more your songs will be judged by others. 
                        You can visualize your track's unique success profile and understand which parts of your songs can be improved.
                    </Typography>                                   
                </div>                
                <div className='u-marginTop--medium u-marginBottom--medium'>                          
                    <Typography 
                        variant='subtitle2'
                        component='h2'                  
                    >
                        The playing field is level and waiting to discover the next big hit!
                    </Typography> 
                </div>                
            </Container>        
        </div>
    )
}

export default AboutPage