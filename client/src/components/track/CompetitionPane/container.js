import { connect } from 'react-redux'
import { CompetitionPaneComponent } from './component'
import  { nonAwardResultsSelector } from '../../../selectors/user'
import  { getNotificationsForTrack } from '../../../reducers/user'
import  { setTrackNotificationsAcknowledged } from '../../../actions/user'

const mapDispatchToProps = dispatch => {
  return {
    setTrackNotificationsAcknowledged: trackId => {
      dispatch(setTrackNotificationsAcknowledged(trackId))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    const {
        trackId
    } = ownProps

    const notifications = getNotificationsForTrack(nonAwardResultsSelector(state), trackId)
    
    return {
        notifications,
        trackId
    }
}

export const CompetitionPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompetitionPaneComponent)
