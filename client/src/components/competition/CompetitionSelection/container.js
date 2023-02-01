import { connect } from 'react-redux'
import { CompetitionSelectionComponent } from './component'

const mapStateToProps = state => {
  const allTracks = state.entities.tracks
  const enteredTrackId = state.competition.enteredTrackId
  const trackTitle = enteredTrackId ? allTracks[enteredTrackId].title : ''
  const genreId = state.competition.enteredGenre

  return {
    trackTitle,
    genreId
  }
}

export const CompetitionSelectionContainer = connect(
  mapStateToProps
)(CompetitionSelectionComponent)
