import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchTrackStatus } from '../actions/track'

import TrackStatus from '../components/competition/TrackStatus.js'

const mapDispatchToProps = (dispatch) => {
  return  {
    fetchTrackStatus: trackId => {
      dispatch(fetchTrackStatus(trackId))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    const genre = ownProps.genre
    const trackId = ownProps.trackId
    const allTracksById = state.entities.tracks
    const track = allTracksById[trackId]
    const competitionStatus = track ? track.competitionStatus : null
    const today = competitionStatus && competitionStatus.today || null
    const todayNumEntries = today ? today.entries[genre] : null
    const todayNumPlays = today ? today.plays[genre] : null
    const last10Days = competitionStatus && competitionStatus.last10Days[ genre ] || []

    return {
        trackId,
        todayNumEntries,
        todayNumPlays,
        last10Days
    }
}

const TrackStatusContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackStatus)

TrackStatusContainer.propTypes = {
  trackId: PropTypes.number.required, 
  genre: PropTypes.string.required
}

export default TrackStatusContainer