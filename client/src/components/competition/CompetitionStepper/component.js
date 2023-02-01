import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
// import Stepper from '@material-ui/core/Stepper'
import MobileStepper from '@material-ui/core/MobileStepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepConnector from '@material-ui/core/StepConnector'
import { COMPETITION_STAGE } from '../../../reducers/competition'
import Typography from '@material-ui/core/Typography'
import { 
    MdCheck, 
    MdRadioButtonChecked,
    MdRadioButtonUnchecked 
} from 'react-icons/lib/md'



function StepIcon(props) {
    const { active, completed } = props;

    let icon = <MdRadioButtonUnchecked />
    
    if (active) {
        icon = <MdRadioButtonChecked />
    }

    if (completed) {
        icon = <MdCheck />
    }    
  
    return (
      <div>
        {icon}
      </div>
    );
}

const QontoConnector = withStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    active: {
      '& $line': {
        borderColor: '#784af4',
      },
    },
    completed: {
      '& $line': {
        borderColor: '#784af4',
      },
    },
    line: {
      borderColor: '#eaeaf0',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);


export class CompetititonStepperComponent extends Component {
    constructor(props) {
      super(props)

      this.getSteps = this.getSteps.bind(this)   
    }

    getSteps() {
        return [
            COMPETITION_STAGE.TRACK1_1,
            COMPETITION_STAGE.TRACK2_2,
            COMPETITION_STAGE.DECIDING_3,
            COMPETITION_STAGE.WINNER_4,
            COMPETITION_STAGE.COMPLETE_5
        ];
    }

    render() {


        const {
            currentStage
        } = this.props

        let activeStep = -1
        let stepClass = ''

        switch (currentStage) {
            case COMPETITION_STAGE.READY_0:
                activeStep = -1
                break
            case COMPETITION_STAGE.TRACK1_1:
                activeStep = 0
                break
            case COMPETITION_STAGE.TRACK2_2:
                activeStep = 1
                break
            case COMPETITION_STAGE.DECIDING_3:
                activeStep = 2
                break
            case COMPETITION_STAGE.WINNER_4:
                activeStep = 3
                break
            case COMPETITION_STAGE.COMPLETE_5:
                activeStep = 4
                break
        }
        const className = `m-progressBar s${activeStep}`

        const steps = this.getSteps()
        return (
          <div className={className}>
              <MobileStepper
                className='m-progressBar__bar'
                activeStep={activeStep} 
                alternativeLabel 
                steps={steps.length}
                variant="progress"
                position="static"
                backButton={null}
                nextButton={null}
              >
                  {steps.map((label) => (
                      <Step key={label}>
                          <StepLabel ></StepLabel>
                      </Step>
                  ))}
            </MobileStepper>              
          </div>
        )
    }
}