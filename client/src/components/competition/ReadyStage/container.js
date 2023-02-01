import { connect } from 'react-redux'
import { ReadyStageComponent } from './component'

const mapDispatchToProps = dispatch => {
  return {}
}

const mapStateToProps = (state, ownProps) => {
  const {
    competition,
    entities
  } = state

  const allTracks = entities.tracks
  const enteredTrackId = competition.enteredTrackId
  const enteredTrackTitle = enteredTrackId ? allTracks[enteredTrackId].title : ''

  return {
    enteredGenre: competition.enteredGenre,
    enteredTrackId,
    enteredTrackTitle
  }
}

export const ReadyStageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadyStageComponent)
