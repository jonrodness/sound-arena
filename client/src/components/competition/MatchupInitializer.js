import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GenreSelect from '../global/GenreSelect'
import ListDialog from '../global/ListDialog'
import Button from '@material-ui/core/Button'
import { findEntityById } from '../../utils/entities'
import { 
    selectEnteredTrack,
    changeGenre
} from '../../actions/competition'
import { getTracksById, isReadyToStartMatchup } from '../../reducers/competition'
import { FaCaretDown } from 'react-icons/lib/fa'
import Typography from '@material-ui/core/Typography'

import '../../css/competition-settings.css'

class MatchupInitializer extends Component {
    constructor(props) {
      super(props)

      this.onClickStartBtn = this.onClickStartBtn.bind(this)
    }

    onClickStartBtn = () => {
        this.props.onClickStartBtn()
    }

    continueBtn = (
        <button className='btn' onClick={ this.onClickStartBtn }>
            Load New Tracks
        </button>
    )

    render() {
        const { 
            userTracks, 
            enteredTrackId,
            isReadyToStart,
            handleEnteredTrackChange,
            enteredGenre,
            onSelectGenre
        } = this.props

        let trackOptions = userTracks.map(
            track => {
                return {
                    name: track.title,
                    val: track.id
                }
            }
        )

        const trackToEnter = findEntityById(userTracks, enteredTrackId)
        const trackTitleToEnter = trackToEnter ? trackToEnter.title : 'Select your track'

        const openTrackSelectDialogBtn = (
            <Button
                className='a-button a-button--label a-button--lowercase'
                color={ trackToEnter ? 'primary' : 'secondary' }
                colorInherit={true}
                size='small'
                variant='outlined'
            >
                { trackTitleToEnter }
                { isReadyToStart &&  <FaCaretDown /> }
            </Button>
        )
  
        return (
            <div className='m-menu'>
                <div className='m-menu__row'>
                    <div className='m-menu__item'>
                        <ListDialog
                            disabled={ !isReadyToStart }
                            options={ trackOptions }
                            onChange={ handleEnteredTrackChange }
                            selectedItemKey={ enteredTrackId }
                            title='Set track to enter'
                            button={ openTrackSelectDialogBtn }
                            shouldSelectOnMount={ true } 
                        />
                    </div>
                    <div className='m-menu__item'>
                        <GenreSelect
                            disabled={ !isReadyToStart }
                            selectedGenre={ enteredGenre }
                            onSelectGenre={ onSelectGenre } 
                        />
                    </div>                                       
                </div>
            </div>
        )
    }
}

MatchupInitializer.defaultProps = {
    userTracks: []
}

MatchupInitializer.propTypes = {
    userTracks: PropTypes.array.isRequired,
    isReadyToStart: PropTypes.bool.isRequired,
    enteredGenre: PropTypes.string.isRequired,
    enteredTrackId: PropTypes.string.isRequired    
}

const mapDispatchToProps = dispatch => {
    return  {
        handleEnteredTrackChange: trackId => {
            dispatch(selectEnteredTrack(parseInt(trackId)))
        },
        onSelectGenre: genre => {
            dispatch(changeGenre(genre))
        }      
    }
} 
  
const mapStateToProps = state => {
    const {
        competition,
        user,
        entities
    } = state

    const {
        enteredTrackId,
        enteredGenre
    } = competition

    const { myTrackIds } = user
    const { tracks } = entities
    const userTracks = getTracksById(myTrackIds, tracks)
    const isReadyToStart = isReadyToStartMatchup(competition)

    return {
        enteredGenre,
        enteredTrackId,
        userTracks,
        isReadyToStart
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MatchupInitializer)