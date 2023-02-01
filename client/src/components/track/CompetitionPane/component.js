import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TrackStatusContainer from '../../../containers/TrackStatusContainer'
import GenreSelect from '../../global/GenreSelect'
import { NOTIFICATION } from '../../../reducers/user'
import Message, { MESSAGE_TYPE } from '../../../components/global/Message'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

export class CompetitionPaneComponent extends Component {
    constructor(props) {
      super(props)

      this.onSelectGenre = this.onSelectGenre.bind(this)
      this.renderNotifications = this.renderNotifications.bind(this)

      this.state = {
        genre: undefined
      }      
    }

    onSelectGenre(genre) {
        this.setState({ genre })
    }

    componentDidMount = () => {
        const {
            trackId,
            setTrackNotificationsAcknowledged,
            notifications
        } = this.props

        const hasUnacknowledgedNotifications = notifications.reduce((acc, notification) => {
            return acc || !notification.acknowledged
        }, false)

        // Set notifications acknowledged if there are any
        if (hasUnacknowledgedNotifications) {
            setTrackNotificationsAcknowledged(trackId)
        }
    }

    renderNotifications() {
        const { notifications } = this.props
        const message = ''
        let id = 0

        return notifications.map(notification => {
            let message = ''
            const { 
                genre
             } = notification

            switch (notification.type) {
                case NOTIFICATION.SKIPPED:
                    const dateSkipped = notification.dateSkipped
                    const formattedDateSkipped = new Date(dateSkipped).toDateString()
                    message = `This track's entries will be pushed to tomorrow's ${genre} competition, as the entries have not participated in the minimum number of matchups on ${formattedDateSkipped}`
                    break
                case NOTIFICATION.BELOW_THRESHOLD:
                    const date = notification.date
                    const formattedDate = new Date(date).toDateString()
                    message = `This track did not win at least 50% of its matchups for the ${genre} competition on ${formattedDate} so it will not be featured on the charts. Check out this track's Results to see where it can be improved. Please try again with this and other songs!`
                    break
            }

            return (
                <div className='u-marginVertical'>
                    <Message
                        id={ id++ }
                        messages={ [message] }
                        type= { MESSAGE_TYPE.INFO }
                    />
                </div>
            )
        })
    }

    render() {
        const {
            trackId,
            notifications
        } = this.props

        const {
            genre
        } = this.state

        const displayNotifications = notifications.length

        return (
            <React.Fragment>              
                <Typography
                    variant='h6' 
                    component='h2'
                >
                    Competition stats for { new Date().toDateString() }
                </Typography>
                <div className='u-marginVertical'>                 
                    <GenreSelect
                        selectedGenre={ genre }
                        onSelectGenre={ this.onSelectGenre }
                    />
                </div>
                {
                    genre && (
                        <TrackStatusContainer
                            genre={ genre }
                            trackId= { trackId }
                        />
                    )
                }

                <div className='u-marginTop u-marginBottom'>
                    <Divider />
                </div>

                <div>
                    <Typography
                        variant='h6' 
                        component='h2'
                    >
                        Notifications
                    </Typography>
                    <Typography
                        variant='caption' 
                        component='p'
                    >
                        (Notifications for the last 7 days will be displayed)
                    </Typography>
                    {
                        displayNotifications ?
                        this.renderNotifications()
                        : (
                            <Typography
                                variant='subtitle2' 
                                component='p'
                            >
                                You have no notifications for this track
                            </Typography>
                        )
                    }                    
                </div>
            </React.Fragment>   
        )
    }
}

CompetitionPaneComponent.defaultProps = {
    notifications: []
}

CompetitionPaneComponent.propTypes = {
    trackId: PropTypes.string.isRequired,
    notifications: PropTypes.object,
    setTrackNotificationsAcknowledged: PropTypes.func
}