import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import { Link } from 'react-router-dom'
import {
    getArtistLink,
    getTrackLink
} from '../../utils/navigation'
import Typography from '@material-ui/core/Typography'
import MorePopover from '../global/MorePopover'
import Divider from '@material-ui/core/Divider'
import UnlikeTrackPopoverContent from '../track/UnlikeTrackPopoverContent'
import DeleteTrackPopoverContent from '../track/DeleteTrackPopoverContent'
import LoadableElement from '../global/LoadableElement'
import { USER_TRACKS } from '../../actions/user'
import Badge from '@material-ui/core/Badge'

const TrackList = props => {
    const { 
        tracks,
        showArtistLink,
        showLikeButton,
        showDeleteButton,
        notificationsByTrack
    } = props

    const renderTracks = () => {
        return tracks.map(track => {
            const artistLink = getArtistLink(track.artistId, track.artistName)
            const trackLink = getTrackLink(track.id, track.title)
            const artist = `${track.artistName}`
            const numNewTrackAwards = notificationsByTrack[track.id] && notificationsByTrack[track.id].length
            const hideNewNotificationsBadge = !numNewTrackAwards

            return (
                <React.Fragment>
                    <ListItem>
                        <div>
                            <Badge 
                                color="secondary" 
                                badgeContent={ numNewTrackAwards } 
                                invisible={ hideNewNotificationsBadge } 
                            >
                                <Typography
                                    variant='subtitle1'
                                    component='div' 
                                >
                                    <Link to={ trackLink }>
                                        { track.title }
                                    </Link>
                                </Typography>
                            </Badge>
                            {
                                showArtistLink && (                        
                                    <Typography
                                        variant='subtitle2'
                                        component='div' 
                                    >
                                        <Link to={ artistLink }>
                                            by { artist }
                                        </Link>
                                    </Typography>
                                )
                            }
                        </div>
                        {
                            showLikeButton && (
                                <ListItemSecondaryAction>
                                    <MorePopover>
                                        <UnlikeTrackPopoverContent trackId={ track.id } />
                                    </ MorePopover>
                                </ListItemSecondaryAction>
                            )
                        }
                        {
                            showDeleteButton && (
                                <ListItemSecondaryAction>
                                    <MorePopover>
                                        <DeleteTrackPopoverContent trackId={ track.id } />
                                    </ MorePopover>
                                </ListItemSecondaryAction>
                            )
                        }                        
                    </ListItem>
                    <Divider />
                </React.Fragment>
            )
        });
    }

    return (
        <LoadableElement
            loadIds={ [ USER_TRACKS ] }
            centered={ true }
        >
            <List>
                { renderTracks() }
            </List>
        </LoadableElement>
    )
}

TrackList.defaultProps = {
    tracks: [],
    showArtistLink: true,
    showLikeButton: false,
    showDeleteButton: false,
    notificationsByTrack: {}
}

TrackList.propTypes = {
    tracks: PropTypes.array,
    showArtistLink: PropTypes.bool,
    showLikeButton: PropTypes.bool,
    notificationsByTrack: PropTypes.object,
    showDeleteButton: PropTypes.bool
}
  
export default TrackList