import { connect } from 'react-redux'
import { CompetititonStepperComponent } from './component'
import  { currentStageSelector } from '../../../selectors/competition'

const mapStateToProps = state => {
  const currentStage = currentStageSelector(state)
  return {
    currentStage
  }
}

export const CompetitionStepperContainer = connect(
  mapStateToProps
)(CompetititonStepperComponent)
