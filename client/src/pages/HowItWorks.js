import React from 'react'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

const HowItWorksPage = () => {
    return (
        <div className='o-page'>
            <Container fixed>
                <div className='u-marginBottom'>
                    <Typography 
                        variant='h5'
                        component='h2'
                    >
                        How it works
                    </Typography>
                </div>
                <Typography 
                    variant='subtitle1'
                    component='h2'
                >
                    Participating in the Competition is very easy. Here's how to enter your music:
                </Typography>
                <ol>
                    <Typography 
                        variant='subtitle1'
                        component='li'
                    >
                        Sign up with an account
                    </Typography>
                    <Typography 
                        variant='subtitle1'
                        component='li'
                    >
                        Upload a track in the Profile section
                    </Typography>                      
                    <Typography 
                        variant='subtitle1'
                        component='li'
                    >
                        Enter your track into the Competition by following the competition process
                    </Typography>
                    <Typography 
                        variant='subtitle1'
                        component='li'
                    >
                        Check back the next day to see how your track did!
                    </Typography> 
                </ol>
                <Typography 
                    variant='subtitle1'
                    component='p'
                >
                    We'll promote your music on our social channels, provide you with badges to share, and show you competition feedback for your track. 
                </Typography>                                       
            </Container>        
        </div>
    )
}

export default HowItWorksPage