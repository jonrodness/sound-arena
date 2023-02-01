import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const TrackTitle = props => {
    const { track, showArtistLink } = props
    const userPath = '/user/' + track.artistId + '/' + track.artistName
    const trackPath = '/track/' + track.id 

    return(
        <React.Fragment>
            <Typography
                variant='subtitle2' 
                component='p' 
                gutterBottom
            >            
                <Link to={ trackPath }>{ track.title }</Link>
            </Typography>
            {
                showArtistLink &&
                <Typography
                    variant='caption' 
                    component='p' 
                    gutterBottom
                >
                    <Link to={ userPath }>{ track.artistName }</Link>
                </Typography>
            }
        </React.Fragment>
    )
}

TrackTitle.defaultProps = {
    showArtistLink: true
}

TrackTitle.propTypes = {
    track: PropTypes.object.isRequired,
    showArtistLink: PropTypes.bool
}
  
export default TrackTitle