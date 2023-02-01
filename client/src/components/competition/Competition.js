import React, { Component } from 'react'

import { COMPETITION_STAGE } from '../../reducers/competition'
import { COMPETITION_STATE } from '../../actions/competition'
import LoadableElement from '../global/LoadableElement'
import MatchupStage from './MatchupStage'
import { ReadyStage } from './ReadyStage'
import { WinnerStage } from './WinnerStage'
import Backdrop from '@material-ui/core/Backdrop'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import { withRouter } from "react-router-dom"
import Typography from '@material-ui/core/Typography'
import { CompetitionStepper } from './CompetitionStepper'
import { CompetitionHelpBtn } from './CompetitionHelpBtn'
import { CompetitionHeaderMsg } from './CompetitionHeaderMsg'
import Divider from '@material-ui/core/Divider'
import '../../css/stage.css'
import { GENRE_MAP } from '../../reducers/competition'
import { CompetitionSelection } from './CompetitionSelection'

class Competition extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.handleClickGotoProfile = this.handleClickGotoProfile.bind(this)
  }

  componentDidMount() {
    this.props.fetchCompetitionState()
    this.props.fetchMyTracks()
  }

  handleClickGotoProfile() {
    this.props.history.push('/my-profile/')
  }

  render() {
    const {
      userTracks,
      isReadyToStart,
      stage,
      enteredTrackId,
      enteredGenreId
    } = this.props

    const genreName = enteredGenreId ? GENRE_MAP[enteredGenreId].name : ''
    const allowCompetition = !!userTracks.length
    
    let stageView
    let headerText
    let competitionSelection
    
    switch(stage) {
      case COMPETITION_STAGE.READY_0:
        stageView = <ReadyStage />
        headerText='Competition Setup'
        break
      case COMPETITION_STAGE.TRACK1_1:
      case COMPETITION_STAGE.TRACK2_2:
      case COMPETITION_STAGE.DECIDING_3: 
        competitionSelection = <CompetitionSelection />            
        stageView = (
          <MatchupStage
            onTimeUpdate={ this.props.onTimeUpdate }
            tracks={ this.props.competitionTracks } 
            isAbleToSelectWinner={ 
              this.props.competitionTracks[0].isPlayed 
                && this.props.competitionTracks[1].isPlayed 
            }
            onSelectWinner={ this.props.onSelectWinner }
            loadNextTrack={ this.props.loadNextTrack } />
        )
        headerText= `${genreName} Competition`
        break
      case COMPETITION_STAGE.WINNER_4:
        headerText= `${genreName} Competition`        
        competitionSelection = <CompetitionSelection />
        stageView = (
          <WinnerStage
            track={ this.props.winnerTrack }
            onTimeUpdate={ this.props.onTimeUpdate }
            fetchLikedTracks={ this.props.fetchLikedTracks }
            isReadyToStart={ isReadyToStart }
          />
        )        
        break     
      case COMPETITION_STAGE.COMPLETE_5:
        stageView = (
            <WinnerStage
              track={ this.props.winnerTrack }
              onTimeUpdate={ this.props.onTimeUpdate }
              fetchLikedTracks={ this.props.fetchLikedTracks }
              isReadyToStart={ isReadyToStart }
            />
        )
        competitionSelection = (
          <div className='u-marginTop'>
            <Typography
              variant='body2'
              component='p'
              className='a-entrySubmitted'
            >          
              Entry submitted!
            </Typography>
          </div>
        )            
        headerText= `${genreName} Competition`
        break
      default:
        stageView = <div>Stage Error</div>
    }

    const renderBackdrop = () => {
      return (
        <div className='m-backdrop'>
          <Backdrop 
            open={ !allowCompetition } 
            onClick={ this.handleCloseBackdrop }
            classes={{root: 'u-backgroundColorDarkTransparent'}}
          >
            <Card className='m-backdrop__card'>
              <CardContent>
                Upload a track in <b>Profile</b> first to enter the competition.
              </CardContent>
              <div className='u-centered'>
                <Button 
                  onClick={ this.handleClickGotoProfile }
                  color='primary'
                  variant='outlined'
                >
                  Goto Profile
                </Button>
              </div>
            </Card>
          </Backdrop>
        </div>
      )
    }

    return (
      <div className='o-page'>
        <LoadableElement
          loadIds={ [ COMPETITION_STATE ] }
          centered={ true }
        >
          { renderBackdrop() }
          <div className='o-page__content'>
            <div className='u-flexRow u-justifyContentSpaceBetween' id='a-competitionPageTitle'>
              <Typography
                  variant='h5'
                  component='h2'
              >
                  { headerText }
              </Typography>
              <CompetitionHelpBtn cancelDisabled={stage == COMPETITION_STAGE.READY_0}/>
            </div>
            { competitionSelection }
            <div className='u-marginTop u-marginBottom'>
              <Divider />
            </div>            
            {
              stage != COMPETITION_STAGE.READY_0 && (
                <>
                  <div>
                    <CompetitionHeaderMsg />
                    <CompetitionStepper />
                  </div>
                </>       
              )
            }
            { stageView }
            {
              stage === COMPETITION_STAGE.WINNER_4 || stage === COMPETITION_STAGE.COMPLETE_5 && (
                <div className='u-flexColumn o-winner-player-container'>
                  <div id='bottom-comp-winner-spacer'></div>              
                </div>
              )
            }
            {
              (
                stage === COMPETITION_STAGE.TRACK1_1 
                  || stage === COMPETITION_STAGE.TRACK2_2 
                  || stage === COMPETITION_STAGE.DECIDING_3
              ) && (
                <div id='bottom-comp-matchup-spacer'></div>              
              )
            }                   
          </div>
        </LoadableElement>
      </div>
    )
  }
}

export default withRouter(Competition)