import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TabPanel from '../global/tabs/TabPanel'
import Typography from '@material-ui/core/Typography'
import TrackLinksContainer from '../../containers/TrackLinksContainer'
import AwardsContainer from '../../containers/AwardsContainer'
import { getTrackData } from '../../reducers/entities'
import { 
  fetchTrackDetails
} from '../../actions/track'
import { 
  fetchAward as fetchAwardService
} from '../../services/track'
import { fetchMyDetails } from '../../actions/user'
import { Link } from 'react-router-dom'
import { getArtistLink } from '../../utils/navigation'
import { parseQueryString } from '../../utils/url'
import Award from '../track/Award'
import { CompetitionPane } from './CompetitionPane'
import { ResultsPane } from './ResultsPane'
import Badge from '@material-ui/core/Badge'
import { 
  nonAwardNotificationSelector,
  awardNotificationSelector
 } from '../../selectors/user'
import { getNotificationsForTrack } from '../../reducers/user'

const tabMap = {
  AWARDS: 0,
  COMPETITION_STATS: 1,
  LINKS: 2,
  RESULTS: 3
}

class TrackView extends Component {
  constructor(props) {
    super(props)

    const {
      isTrackOwner,
      tabFromUrl
    } = props

    const landingTab = tabFromUrl || (isTrackOwner ? tabMap.AWARDS : tabMap.LINKS)

    this.state = {
      tabValue: landingTab,
      featuredAward: null
    }

    this.handleTabChange = this.handleTabChange.bind(this)
    this.fetchAward = this.fetchAward.bind(this)
    this.openTracksTab = this.openTracksTab.bind(this)
  }

  handleTabChange(event, tabValue) {
    this.setState({ tabValue })
  }

  componentDidMount() {
    const { 
      fetchTrackDetails,
      fetchMyDetails,
      trackId,
      userId,
      awardParams
    } = this.props

    if (!userId) {
      fetchMyDetails()
    }

    if (!!awardParams) {
      this.fetchAward(awardParams)
    }

    fetchTrackDetails(trackId)
  }

  fetchAward(awardParams) {
    fetchAwardService(awardParams)
      .then(json => {
        this.setState({
          featuredAward: json
        })
      })
      .catch(err => {
      })
  }

  openTracksTab() {
    this.setState({
      tabValue: tabMap.LINKS
    })
  }

  componentDidUpdate(prevProps) {
    const {
      isTrackOwner,
      tabFromUrl
    } = this.props

    // isTrackOwner may be calculated late, so display Awards tab when calculated, 
    // if no tab specified in URL
    if (!tabFromUrl && !prevProps.isTrackOwner && isTrackOwner) {
      this.setState({
        tabValue: tabMap.AWARDS
      })
    }
  }

  render() {
    const { 
      trackTitle,
      trackId,
      isTrackOwner,
      artistId,
      artistName,
      competitionNotificationsCount,
      awardNotificationCount
    } = this.props

    const {
      tabValue,
      featuredAward
    } = this.state

    const artistLink = getArtistLink(artistId, artistName)
    const hideCompetitionNotificationsCount = !competitionNotificationsCount
    const hideAwardNotificationCount = !awardNotificationCount
    const competitionLabel = (
      <Badge
        color="secondary"
        badgeContent={ competitionNotificationsCount } 
        invisible={ hideCompetitionNotificationsCount } 
      >
        Competition
      </Badge>
    )

    const awardsLabel = (
      <Badge
        color="secondary"
        badgeContent={ awardNotificationCount } 
        invisible={ hideAwardNotificationCount } 
      >
        Awards
      </Badge>
    )

    return (
      <div className='o-trackView'>
        <div className='a-pageTitle'>
          <Typography 
            variant='h5' 
            component='h1' 
            gutterBottom
          >
            { trackTitle }
          </Typography>
          {
            <Typography 
              variant='h6'
              component='h2' 
              gutterBottom
            >
              by <Link to={ artistLink }>{ artistName }</Link>
            </Typography>
          }
        </div>

        {
            !!featuredAward && (
              <React.Fragment>
                <Award
                  date={ featuredAward.date }
                  genre={ featuredAward.genre }
                  place={ featuredAward.place }
                  totalParticipants={ featuredAward.totalParticipants }
                  awardGroupId={ featuredAward.awardGroupId }
                />
              </React.Fragment>
            )
        }

        <Tabs 
          className='u-marginVertical m-tabMenu' 
          value={ tabValue } 
          onChange={ this.handleTabChange }
          indicatorColor="primary"
          variant="scrollable"
        >
          {
            isTrackOwner && <Tab label={awardsLabel} value={ tabMap.AWARDS } />    
          }
          { 
            isTrackOwner && <Tab label={competitionLabel} value={ tabMap.COMPETITION_STATS } />
          }
          {
            isTrackOwner && <Tab label='Results' value={ tabMap.RESULTS } />
          }
          <Tab label='Links' value={ tabMap.LINKS }></Tab>
        </Tabs>
  
        <div className='u-marginHorizontal'>
          {
            isTrackOwner && (
              <>
                <TabPanel tabValue={ tabValue } index={ tabMap.AWARDS }>
                    <AwardsContainer trackId={ trackId } openTracksTab={ this.openTracksTab } />
                </TabPanel>
                <TabPanel tabValue={ tabValue } index={ tabMap.COMPETITION_STATS }>
                  <CompetitionPane trackId={ trackId } />
                </TabPanel>
                <TabPanel tabValue={ tabValue } index={ tabMap.RESULTS }>
                  <ResultsPane trackId={ trackId } />
                </TabPanel>                
              </>
            )
          }
          <TabPanel tabValue={ tabValue } index={ tabMap.LINKS }>
            <div className='u-margintop u-marginBottom'>
              <Typography variant='h5' component='h2'>
                Track Links
              </Typography>
            </div>            
            <TrackLinksContainer trackId={ trackId }></TrackLinksContainer>
          </TabPanel>
        </div>
      </div>
    )
  }
}

TrackView.defaultProps = {
  trackTitle: '',
  trackId: null,
  artistId: null,
  artistName: '',
  isTrackOwner: false
}

TrackView.propTypes = {
  trackTitle: PropTypes.string,
  trackId: PropTypes.string,
  isTrackOwner: PropTypes.bool,
  fetchTrackDetails: PropTypes.func.isRequired,
  fetchMyDetails: PropTypes.func.isRequired,
  artistId: PropTypes.number,
  artistName: PropTypes.number
}

const mapDispatchToProps = (dispatch) => {
  return  {
    fetchTrackDetails: trackId => {
      dispatch(fetchTrackDetails(trackId))
    },
    fetchMyDetails: () => {
      dispatch(fetchMyDetails())
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { 
    entities,
    user 
  } = state
  const { 
    trackId,
    tabFromUrl 
  } = ownProps
  const trackData = getTrackData(trackId, entities)
  const {
    artistName,
    artistId
  } = trackData
  const userId =  user.id
  const isTrackOwner = artistId && artistId == userId
  const trackTitle = trackData.title

  const competitionNotificationsCount = getNotificationsForTrack(nonAwardNotificationSelector(state), trackId).length
  const awardNotificationCount = getNotificationsForTrack(awardNotificationSelector(state), trackId).length

	return {
    trackId,
    trackTitle,
    isTrackOwner,
    artistName,
    artistId,
    userId,
    tabFromUrl,
    competitionNotificationsCount,
    awardNotificationCount
	}
}

const TrackViewCoordinator = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackView)

const TrackViewContainer = ({ 
  match, 
  location
}) => {
  const tab = location.hash.startsWith('#links') ? tabMap.LINKS : null
  let awardParams = null

  const versionParams = parseQueryString(
    location.search,
    [ 'i' ]
  )

  switch(versionParams['i']) {
    case '0':
      awardParams = parseQueryString(
        location.search,
        [ 'i','id', 'a', 'v', 't' ],
        { allOrNothing: true }
      )
      break;
    case '1':
      awardParams = parseQueryString(
        location.search,
        [ 'i','d', 'g', 'p', 'gid', 'tp', 'h', 'id' ],
        { allOrNothing: true }
      )
      break;
  }

  return (
    <TrackViewCoordinator 
      trackId={ match.params.trackId }
      tabFromUrl={ tab }
      awardParams={ awardParams }
    />
  )
}

export default TrackViewContainer