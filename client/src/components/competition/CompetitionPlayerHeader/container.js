import { connect } from 'react-redux'
import { CompetitionPlayerHeaderComponent } from './component'

const mapDispatchToProps = dispatch => {
  return {}
}

const mapStateToProps = state => {
  return {}
}

export const CompetitionPlayerHeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompetitionPlayerHeaderComponent)
