import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { TRACK_AWARDS } from '../../actions/track'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { Divider } from '@material-ui/core'
import { Button } from '@material-ui/core'
import LoadableElement from '../global/LoadableElement'
import Award from './Award'
import { getTrackAwardCount } from '../../reducers/entities'
import { Link } from 'react-router-dom'

class Awards extends Component {
  constructor(props) {
    super(props)

    this.onClickCopyBtn = this.onClickCopyBtn.bind(this)
    this.onClickTracksLink = this.onClickTracksLink.bind(this)
  }

  onClickCopyBtn(event) {
    const {
      setSuccessNotification,
      setErrorNotification
    } = this.props

    try {
      const textAreaId = event.currentTarget.dataset.linkid
      const textAreaWithLink = document.getElementById(textAreaId)
      textAreaWithLink.select()
      textAreaWithLink.setSelectionRange(0, 99999)
      document.execCommand('copy')
      const link = window.getSelection().toString()
      setSuccessNotification([
        'Successfully copied your link: ',
        link,
        'You are ready to share your accomplishment!'
      ])
    } catch (err) {
      setErrorNotification('There was a problem while trying to copy your link. You can manually copy the link if this continues to fail.')
    }
  }

  componentDidMount = () => {
    const {
        trackId,
        fetchAwards
    } = this.props

    fetchAwards(trackId)
  }

  // Set awards acknowledged upon navigating away from Awards tab
  // because Awards is default tab when tapping on track, so don't 
  // want to hide notification badge before user has a chance to see it
  componentWillUnmount = () => {
    const {
      setTrackAwardsAcknowledged,
      trackId
  } = this.props

    setTrackAwardsAcknowledged(trackId)
  }

  renderAwardGroup = awardGroup => {
    let key = 0

    return awardGroup.awards.map(award => {
        key++

        // Ensure that each linkTextAreaId is unique across award groups such that Copy btn maps to correct link
        const linkTextAreaId = `link-${ awardGroup.id }-${ key }`

        return (
            <React.Fragment key={ key } >
                <ListItem  disableGutters={ true } >
                  <Award
                    date={ award.date }
                    linkTextAreaId={ linkTextAreaId }
                    showCopyBtn={ true }
                    link={ award.link }
                    awardGroupId={ awardGroup.id }
                    onClickCopyBtn={ this.onClickCopyBtn }
                    place={ award.place }
                    totalParticipants={ award.totalParticipants }
                    genre={ award.genre }
                    showNewAwardBadge={ !award.acknowledged }
                  />
                </ ListItem>
                <Divider />
            </React.Fragment>
        )
    })
  }

  onClickTracksLink() {
    const { openTracksTab } = this.props
    openTracksTab()
  }

  render() {
    const { 
      awardGroups
    } = this.props

    const linksUrl = `${window.location.pathname}#links`

    const trackAwardsCount = getTrackAwardCount(awardGroups)

    return (
      <React.Fragment>
          <div className='u-marginTop'>
              <div className='m-awardDescription'>
                <Typography
                    variant='body1'
                    component='div'
                    gutterBottom
                >
                  Share your awards!
                </Typography>
                <Typography
                    variant='body1'
                    component='div'
                    gutterBottom
                >
                  An award will link back to its track's <span className='a-clickableText' onClick={this.onClickTracksLink}>LINKS</span> so people can listen to it on your preferred platforms.
                </Typography>
                <img src='/og-sample.png' className='u-marginTop'/>
                <Typography
                    variant='caption'
                    component='div'
                    gutterBottom
                >
                  (Example of what an award may look like when posted to a social platform)
                </Typography>
              </div>

              <div className='u-marginTop u-marginTop--medium'>
                <Typography
                      variant='h4'
                      component='h4'
                      gutterBottom
                  >
                    Awards
                </Typography>
              </div>               
              <LoadableElement
                  loadIds={ [ TRACK_AWARDS ] }
                  centered={ true }
              >
                  {
                      !!trackAwardsCount ? (
                        awardGroups.map(awardGroup => {
                          return (
                            !!awardGroup.awards.length && (
                              <React.Fragment>
                                <Typography
                                    variant='h5'
                                    component='h3'
                                    gutterBottom
                                >
                                    { awardGroup.title }
                                </Typography>
                                <List>
                                  { this.renderAwardGroup(awardGroup) }
                                </List>
                              </React.Fragment>
                            )
                          )
                        })
                      ) : (
                        <React.Fragment>
                          <Typography
                              variant='body1'
                              component='div'
                              gutterBottom
                          >
                              No awards yet. Enter the competition to win and share awards!
                          </Typography>
                        </React.Fragment>
                      )
                  }
              </LoadableElement>
          </div>        
      </React.Fragment>
    )
  }
}

Awards.defaultProps = {
  awardGroups: []
}

Awards.propTypes = {
  awardGroups: PropTypes.arrayOf(PropTypes.object),
  fetchAwards: PropTypes.func,
  setTrackAwardsAcknowledged: PropTypes.func,
  openTracksTab: PropTypes.func.isRequired
}

export default Awards