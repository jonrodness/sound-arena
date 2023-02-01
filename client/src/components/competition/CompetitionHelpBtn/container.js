import { connect } from 'react-redux'
import { CompetitionHelpBtnComponent } from './component'
import { cancelMatchup } from '../../../actions/competition'

const mapDispatchToProps = dispatch => {
  return {
    cancelMatchup: () => {
      dispatch(cancelMatchup())
    }
  }
}

const mapStateToProps = (state, ownProps) => {
    return {}
}

export const CompetitionHelpBtnContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompetitionHelpBtnComponent)
