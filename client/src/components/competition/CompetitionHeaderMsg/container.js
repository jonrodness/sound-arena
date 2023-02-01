import { connect } from 'react-redux'
import { CompetitionHeaderMsgComponent } from './component'
import { cancelMatchup } from '../../../actions/competition'
import  { currentStageSelector } from '../../../selectors/competition'
import { COMPETITION } from '../../../reducers/competition'

const mapDispatchToProps = dispatch => {
  return {
    cancelMatchup: () => {
      dispatch(cancelMatchup())
    }
  }
}

const mapStateToProps = state => {
  const currentStage = currentStageSelector(state)

  const genre = state.competition.enteredGenre
  const trackId = state.competition.enteredTrackId
  const allTracksById = state.entities.tracks
  const enteredTrackTitle = trackId ? allTracksById[trackId].title : ''
  const track = allTracksById[trackId]
  const competitionStatus = track ? track.competitionStatus : null  
  const today = competitionStatus && competitionStatus.today || null
  const todayNumEntries = today ? today.entries[genre] : null
  const completedMinEntries = todayNumEntries >= COMPETITION.MINIMUM_ENTRIES_TODAY
  const entriesRemaining = COMPETITION.MINIMUM_ENTRIES_TODAY - (todayNumEntries || 0)

  return {
    currentStage,
    completedMinEntries,
    entriesRemaining,
    enteredTrackTitle
  }
}

export const CompetitionHeaderMsgContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompetitionHeaderMsgComponent)
