import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { withStyles } from '@material-ui/core/styles'
import { MdExpandMore } from 'react-icons/lib/md'
import TrackDetails from './TrackDetails'

const styles = {
    root: {
        'padding-left': 0,
        'padding-right': 0
    }
}

class MyTrackList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            expanded: null
        }
        
        this.handleChange = this.handleChange.bind(this)
        this.getTracks = this.getTracks.bind(this)
    }
    
    handleChange = panel => (event, expanded) => {
        this.setState({
          expanded: expanded ? panel : false,
        })
    }

    getTracks = () => {
        const { expanded } = this.state
        const { classes, tracks, getTrackScore, isMyTracks } = this.props

        return tracks.map(track => {
            return (
                <li className='m-list__item' key={ track.id }>
                    <ExpansionPanel 
                        expanded={expanded === track.id}
                        onChange={ this.handleChange(track.id) } >
                        <ExpansionPanelSummary
                            expandIcon={ <MdExpandMore /> } >
                            <h3>{ track.title }</h3>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails
                            classes={{
                                root: classes.root
                            }} >
                            {/* Full-width wrapper required for ExpansionPanelDetails + integration*/}
                            <div className='u-fullWidth'>
                                { 
                                    expanded === track.id ? (
                                        // For performance, only render the graph if the track is expanded
                                        <TrackDetails 
                                            track={ track } 
                                            getTrackScore={ getTrackScore }
                                            isMyTrack={ isMyTracks } />
                                    ) : (
                                        <div></div> 
                                    )
                                }
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </li>
            )
        });
    }

    render() {
        return (
            <div>
                <div>                    
                    <ul className='m-list'>
                        { this.getTracks() }
                    </ul>
                </div>
            </div>
        )
    }
}

MyTrackList.defaultProps = {
    tracks: []
}

MyTrackList.propTypes = {
    tracks: PropTypes.array
}
  
export default withStyles(styles)(MyTrackList)