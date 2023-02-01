import React, { Component } from 'react'
import { FaCircleThin, FaCircle, FaCheckCircle, FaQuestionCircleO } from 'react-icons/lib/fa'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import { COMPETITION } from '../../reducers/competition'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

class TrackStatus extends Component {
    constructor(props) {
        super(props)

        this.getLast10DaysIcons = this.getLast10DaysIcons.bind(this)
        this.getLast10DaysCount = this.getLast10DaysCount.bind(this)
        this.getTodayIcons = this.getTodayIcons.bind(this)
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.trackId && (this.props.trackId != prevProps.trackId)) {
            this.props.fetchTrackStatus(this.props.trackId)
        }
    }

    componentDidMount() {
        const { 
            trackId, 
            fetchTrackStatus 
        } = this.props

        if (trackId) {
            fetchTrackStatus(trackId)
        }
    }

    getLast10DaysIcons = () => {
        const { last10Days } = this.props

        return last10Days.map((day) => {
            return (
                <Tooltip key={ day.date } title={ day.date }>
                    { day.isMinReached ? <FaCheckCircle /> : <FaCircleThin /> }
                </Tooltip>
            )
        })
    }

    getTodayIcons = (numCompleted, numRequired) => {
        let numOutstanding = numRequired - numCompleted
        let icons = []
        let i = 0

        while (numCompleted) {
            icons.push(
                <Tooltip title={ "Completed" }>
                    <FaCircle />
                </Tooltip>
            )
            numCompleted--
        }

        while (numOutstanding) {
            icons.push(
                <Tooltip title={ "Completed" }>
                    <FaCircleThin />
                </Tooltip>
            )
            numOutstanding--
        }        

        return icons
    }    

    getLast10DaysCount = () => {
        return this.props.last10Days.reduce((acc, day) => {
            const dayCount = day.isMinReached ? 1 : 0
            return acc + dayCount
        }, 0)        
    }    

    render() {
        const { 
            todayNumEntries, 
            todayNumPlays
        } = this.props
        
        const last10DaysCount = this.getLast10DaysCount()
        const last10DaysStatus = (
            <div className='m-trackStatus__timeGroup'>
                <div className='a-title'>Last 10 days: </div>
                <div>
                    { this.getLast10DaysIcons() }
                </div>                    
                <div>
                    { last10DaysCount ? last10DaysCount : 0 } / { COMPETITION.MINIMUM_MATCHUPS_LAST_10_DAYS } days completed
                </div>
            </div>            
        )
        const showLast10Days = process.env.REACT_APP_FEATURES_LAST_10_DAYS == 'true'
        const completedMinEntries = todayNumEntries >= COMPETITION.MINIMUM_ENTRIES_TODAY

        return (
            <div className='m-trackStatus'>
                <div className='m-trackStatus__timeGroup'>
                    { 
                        completedMinEntries && (
                            <div className='u-marginBottom'>
                                <Typography
                                    variant='body2'
                                    component='p'
                                >
                                    You've submitted the minimum number of entries to be eligible for tomorrow's results! 
                                    Don't forget to add links to your track in the Profile section so people can access your music.
                                </Typography>
                            </div>
                        )
                    }
                    <div className='u-marginLeft'>
                        <li>
                            <Typography
                                variant='body2'
                                component='span'
                                className={completedMinEntries ? 'u-colorSuccessGreen' : 'u-colorRed' }
                            >
                                { todayNumEntries ? todayNumEntries : 0 } entries submitted
                            </Typography>
                            <span> </span>
                            <Typography
                                variant='body2'
                                component='span'
                            >
                                ({ COMPETITION.MINIMUM_ENTRIES_TODAY } required)
                            </Typography>
                        </li>
                        
                        <li>
                            <Typography
                                variant='body2'
                                component='span'
                                className={todayNumPlays >= COMPETITION.MINIMUM_PLAYS_TODAY ? 'u-colorSuccessGreen' : 'u-colorRed' }                        
                            >
                                { todayNumPlays ? todayNumPlays : 0 } of your entries have participated in matchups
                            </Typography>
                            <Typography
                                variant='caption'
                                component='p'
                            >
                                * Your entries will automatically participate in other matchups
                            </Typography>
                        </li>
                    </div>
                </div>
                { showLast10Days ? last10DaysStatus : null }
            </div>
        )
    }
}

TrackStatus.propTypes = {
    todayNumEntries: PropTypes.number.isRequired, 
    todayNumPlays: PropTypes.number.isRequired,
    trackId: PropTypes.number.isRequired,
    fetchTrackStatus: PropTypes.func.isRequired,
}

export default TrackStatus