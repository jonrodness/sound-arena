import { connect } from 'react-redux'
import { 
  updateTime, 
  selectWinner,
  fetchCompetitionState,
  loadNextTrack
} from '../actions/competition'
import { 
  fetchMyTracks,
  fetchLikedTracks
} from '../actions/user'
import Competition from '../components/competition/Competition.js'
import {
  getTracksById,
  isReadyToStartMatchup
} from '../reducers/competition'

const mapDispatchToProps = dispatch => {
  return  {
    fetchMyTracks: () => {
      dispatch(fetchMyTracks())
    },

    fetchCompetitionState: () => {
      dispatch(fetchCompetitionState())
    },

    onTimeUpdate: (trackKey, newTime) => {
      dispatch(updateTime(trackKey, newTime))
    },

    onSelectWinner: trackKey => {
      dispatch(selectWinner(trackKey))
    },

    loadNextTrack: () => {
      dispatch(loadNextTrack())
    },

    fetchLikedTracks: () => {
      dispatch(fetchLikedTracks())
    }    
  }
} 

const mapStateToProps = state => {
  const allTracks = state.entities.tracks
  const { stage } = state.competition
  const myTrackIds = state.user.myTrackIds
  const track1 = state.competition.track1
  const track2 = state.competition.track2
  const enteredTrackId = state.competition.enteredTrackId
  const enteredTrackTitle = enteredTrackId ? allTracks[enteredTrackId].title : ''
  const enteredGenreId = state.competition.enteredGenre

  // Merge played track with winnerTrack and track from entities
  const winnerTrackKey = state.competition.winner.key
  const winnerTrack = winnerTrackKey ? state.competition[winnerTrackKey] : {}
  const entityWinner = winnerTrack.id ? allTracks[winnerTrack.id] : {}
  const mergedWinnerTrack = Object.assign({}, winnerTrack, state.competition.winner, entityWinner)
  const isReadyToStart = isReadyToStartMatchup(state.competition)

	return {
    enteredTrackTitle,
		userTracks: getTracksById(myTrackIds, allTracks),
    winnerTrack: mergedWinnerTrack,
    competitionTracks: [track1, track2],
    stage: stage,
    isReadyToStart,
    enteredGenreId
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Competition) 
