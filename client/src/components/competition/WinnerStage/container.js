import { connect } from 'react-redux'
import { WinnerStageComponent } from './component'

const mapStateToProps = state => {
  const {
    competition,
    entities
  } = state

  const allTracks = entities.tracks
  const enteredTrackId = competition.enteredTrackId
  const enteredTrackTitle = enteredTrackId ? allTracks[enteredTrackId].title : ''

  return {
    enteredGenre: competition.enteredGenre,
    enteredTrackId: competition.enteredTrackId,
    enteredTrackTitle
  }
}

export const WinnerStageContainer = connect(mapStateToProps)(WinnerStageComponent)
