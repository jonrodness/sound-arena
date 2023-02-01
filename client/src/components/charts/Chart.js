import React, { Component } from 'react'
import TrackTitle from '../global/TrackTitle'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import ChartControls from './ChartControls'
import { GENRE_MAP } from '../../reducers/competition'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import CircularProgress from '@material-ui/core/CircularProgress'
import Message, { MESSAGE_TYPE } from '../../components/global/Message'
import Typography from '@material-ui/core/Typography'

class Chart extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { 
            title,
            isLoading,
            isError,
            genre,
            tracks,
            totalResultsCount,
            offset,
            displayPrevTracks,
            displayNextTracks,
            date
        } = this.props

        const genreTitle = GENRE_MAP[genre].name
        const errorMessage = 'Sorry, something went wrong and we were unable to load the chart.'
        const emptyMessage = `Check back soon for the top ${ genreTitle } tracks!`
        const startIndex = offset + 1
        const endIndex = offset + tracks.length
        const disablePrev = offset <= 0
        const disableNext = offset + tracks.length >= totalResultsCount
        const formattedDate = new Date(date).toDateString()
        const hasResults = !!totalResultsCount

        const renderTracks = () => {
            return !!tracks.length ? (
                <React.Fragment>
                    {
                        tracks.map(track => {
                            const playsText = track.count == 1 ? 'play' : 'plays'
                            const trackScore = track.score && track.score.toFixed && track.score.toFixed(2) || 0
                            return (
                                <TableRow key={ track.id }>
                                    <TableCell padding='checkbox' size='small'>
                                        <Typography
                                            variant='subtitle2' 
                                            component='p' 
                                            gutterBottom
                                        >
                                            { track.place }
                                        </Typography>
                                    </TableCell>       
                                    <TableCell>
                                        <TrackTitle track={ track } />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Typography
                                            variant='subtitle2' 
                                            component='p' 
                                            gutterBottom
                                        >            
                                            { trackScore }%
                                        </Typography>
                                        <Typography
                                            variant='caption' 
                                            component='p' 
                                            gutterBottom
                                        >            
                                            { `${track.count} ${playsText}` }
                                        </Typography>                                        
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </React.Fragment>
            )
            : (
                <Message
                    messages={ [ emptyMessage ] }
                    type= { MESSAGE_TYPE.INFO }
                />                
            )
        }

        return (
            <div className='u-centered u-marginTop'>
                <div className='o-chart'>
                    {
                        hasResults && (
                            <div className='o-chart__header'>
                                <Typography 
                                    variant='subtitle1' 
                                    component='h3' 
                                >
                                    { formattedDate }
                                </Typography>
                                <ChartControls
                                    startIndex={ startIndex }
                                    endIndex={ endIndex }
                                    totalResultsCount={ totalResultsCount }
                                    disablePrev={ disablePrev }
                                    diableNext={ disableNext }
                                    onClickPrevBtn={ displayPrevTracks }
                                    onClickNextBtn={ displayNextTracks }
                                />                                    
                            </div>
                        )
                    }
                    {
                        isLoading ? (
                            <div className='u-fullWidth u-centered'>
                                <CircularProgress />
                            </div>
                        )
                        : isError ? (
                            <Message
                                messages={ [ errorMessage ] }
                                type= { MESSAGE_TYPE.ERROR }
                            />
                        )
                        : (
                            <Table padding='checkbox' className=''>
                                {
                                    !!tracks.length && (
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Rank</TableCell>
                                                <TableCell>Track</TableCell>
                                                <TableCell align='right'>Score</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    )
                                }
                                <TableBody>
                                    { renderTracks() }
                                </TableBody>
                            </Table>
                        )
                    }              
                </div>
            </div>
        )
    }
}

Chart.defaultProps = {
    tracks: [],
    title: ''
}

Chart.propTypes = {
    tracks: PropTypes.array,
    days: PropTypes.number,
    title: PropTypes.string,
    displayPrevTracks: PropTypes.func,
    displayNextTracks: PropTypes.func
}
  
export default Chart