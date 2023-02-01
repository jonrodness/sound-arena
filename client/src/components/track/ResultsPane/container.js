import { connect } from 'react-redux'
import { ResultsPaneComponent } from './component'
import { fetchTrackScore } from '../../../actions/track'

const mapDispatchToProps = dispatch => {
  return {
    getTrackScore: trackId => {
      dispatch(fetchTrackScore(trackId))
    }
  }
}

const mapStateToProps = (_, ownProps) => {
    const {
        trackId
    } = ownProps
    
    return {
        trackId
    }
}

export const ResultsPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultsPaneComponent)
