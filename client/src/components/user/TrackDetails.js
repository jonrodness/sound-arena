import React, { Component } from 'react'
import GraphWrapper from './GraphWrapper'
import TrackStatusContainer from '../../containers/TrackStatusContainer'
import GenreSelect from '../global/GenreSelect'
import TrackLinksContainer from '../../containers/TrackLinksContainer'

class TrackDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genre: undefined
        }

        this.onSelectGenre = this.onSelectGenre.bind(this)
    }

    onSelectGenre(genre) {
        this.setState({ genre })
    }

    render() {
        const {
            track, 
            getTrackScore, 
            isMyTrack 
        } = this.props
        const { genre } = this.state
        return (
            <React.Fragment>
                <TrackLinksContainer
                    trackId={ track.id }
                    isMyLinks={ isMyTrack } />
                {
                    isMyTrack && (
                        <React.Fragment>
                            <div className='u-boxSeparator'>
                                <div className='a-title'>Competition Status: </div>
                                <GenreSelect
                                    selectedGenre={ genre }
                                    onSelectGenre={ this.onSelectGenre }
                                />
                                <br />
                                <TrackStatusContainer
                                    trackId={ track.id }
                                    genre= { genre } />
                            </div>
                            <br />

                            {/* Disable Competition Results */}
                            <div className='a-title'>Competition Results: </div>
                            <GraphWrapper
                                trackScore={ track.score }
                                trackId={ track.id } 
                                getTrackScore={ getTrackScore } />
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        )
    }
}
  
export default TrackDetails