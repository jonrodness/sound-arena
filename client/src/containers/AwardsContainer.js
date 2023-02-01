import { connect } from 'react-redux'
import {
    fetchTrackAwards,
    setTrackAwardsAcknowledged
} from '../actions/track'
import Awards from '../components/track/Awards.js'
import { 
  setNotification,
  NOTIFICATION_TYPE
} from '../actions/notifications'

const mapDispatchToProps = dispatch => {
  return  {
    fetchAwards: trackId => {
        dispatch(fetchTrackAwards(trackId))
    },
    setTrackAwardsAcknowledged: trackId => {
				dispatch(setTrackAwardsAcknowledged(trackId)) 
    },
    setSuccessNotification: message => {
      dispatch(setNotification(message, NOTIFICATION_TYPE.SUCCESS))
    },
    setErrorNotification: message => {
      dispatch(setNotification(message, NOTIFICATION_TYPE.ERROR))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    const { 
        trackId,
        openTracksTab
    } = ownProps

    const {
        entities
    } = state

    const awardGroups = entities.tracks[trackId] && entities.tracks[trackId].awardGroups

    return {
      awardGroups,
      openTracksTab
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Awards)
