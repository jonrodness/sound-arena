import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TrackList from './TrackList'
import FileUploader from './FileUploader'
import ArtistLinksContainer from '../../containers/ArtistLinksContainer'
import Message, { MESSAGE_TYPE } from '../../components/global/Message'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Button from '@material-ui/core/Button'
import TabPanel from '../global/tabs/TabPanel'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { isValidInput } from '../../utils/validations'
import {TextInput} from '../forms/TextInput'
import { 
  UPDATE_USERNAME,
  UPDATE_INSTAGRAM_HANDLE,
  UPDATE_TWITTER_HANDLE
} from '../../actions/user'
import IconButton from '@material-ui/core/IconButton'
import { MdClose } from 'react-icons/lib/md'
import { 
  REQUEST_PENDING,
  REQUEST_SUCCESS,
} from '../../actions/ui'

class UserProfile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tabValue: 0,
      isFileUploadDialogOpen: false
    }

    this.onChangeTab = this.onChangeTab.bind(this)
    this.onClickUploadBtn = this.onClickUploadBtn.bind(this)
    this.onCloseFileUploadDialog = this.onCloseFileUploadDialog.bind(this)
  }

  componentDidMount() {
    const {
      userId,
      getTracks,
      fetchUserDetails
    } = this.props
    getTracks(userId)
    fetchUserDetails(userId)
  }

  onChangeTab(event, tabValue) {
    this.setState({ tabValue })
  }

  onClickUploadBtn() {
    this.setState({
      isFileUploadDialogOpen: true
    })
  }

  onCloseFileUploadDialog() {
    this.setState({
      isFileUploadDialogOpen: false
    })    
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.uploadTrackStatus === REQUEST_PENDING &&
      this.props.uploadTrackStatus === REQUEST_SUCCESS
    ) {
      this.onCloseFileUploadDialog()
    }
  }

  render() {
    const { 
      isMyProfile, 
      userId,
      username,
      onSubmitFile,
      userTracks,
      getTrackScore,
      notificationsByTrack,
      notificationsCount,
      onSaveUsername,
      onSaveTwitterHandle,
      onSaveInstagramHandle,
      twitterHandle,
      instagramHandle
    } = this.props

    const hasNotifications = !!notificationsCount

    const { 
      tabValue,
      isFileUploadDialogOpen
    } = this.state

    const notificationsMessage = [
      `You have ${ notificationsCount } competition ${ notificationsCount > 1 ? 'notifications' : 'notification' }`,
      'Click on your tracks to view your notifications.'
    ]

    const twitterHandleLabel = twitterHandle ? 'Twitter handle:' : 'Add Twitter handle to promote your music'
    const instagramHandleLabel = instagramHandle ? 'Instagram handle:' : 'Add Instagram handle to promote your music'

    return (
      <React.Fragment>
        <div className='a-pageTitle'>
          {
            isMyProfile ? (
              <>
                <TextInput
                  errorMsg='Username must be between 1 and 30 characters.'
                  originalText={username}
                  isInputValid={isValidInput}
                  inputProps={{minLength: 1, maxLength: 30}}
                  loadIds={[ UPDATE_USERNAME ]}
                  onSaveInput={onSaveUsername}
                  editLabel='Edit username:'
                />
                
                <div className='u-marginTop--small'>
                  <TextInput
                    errorMsg='Twitter handle must be no longer than 20 characters.'
                    originalText={twitterHandle}
                    isInputValid={isValidInput}
                    inputProps={{minLength: 0, maxLength: 20}}
                    loadIds={[ UPDATE_INSTAGRAM_HANDLE ]}
                    onSaveInput={onSaveTwitterHandle}
                    label={twitterHandleLabel}
                    editLabel='Edit Twitter handle'
                    textSize='small'
                  />
                </div>
                <div className='u-marginTop--small'>
                  <TextInput
                    errorMsg='Instagram handle must be no longer than 40 characters.'
                    originalText={instagramHandle}
                    isInputValid={isValidInput}
                    inputProps={{minLength: 0, maxLength: 40}}
                    loadIds={[ UPDATE_TWITTER_HANDLE ]}
                    onSaveInput={onSaveInstagramHandle}
                    label={instagramHandleLabel}
                    editLabel='Edit Instagram handle'
                    textSize='small'
                  />
                </div>
              </>
            ) : (
              <>
                <Typography
                  variant='h5' 
                  component='h3'
                >
                  { username }
                </Typography>
                {
                  twitterHandle && (
                    <div className='u-flexRow u-alignItemsCenter'>
                      <Typography 
                        variant='caption'
                        component='p'
                      >
                        Twitter handle: &nbsp;
                      </Typography> 
                      <Typography
                        variant='caption'
                        component='p'
                      >
                        { twitterHandle }
                      </Typography>
                    </div>     
                  )
                }
                {
                  instagramHandle && (
                    <div className='u-flexRow u-alignItemsCenter'>
                      <Typography 
                        variant='caption'
                        component='p'
                      >
                        Instagram handle: &nbsp;
                      </Typography> 
                      <Typography
                        variant='caption'
                        component='p'
                      >
                        { instagramHandle }
                      </Typography>
                    </div> 
                  )
                } 
              </>
            )
          }
        </div>

        {
            hasNotifications && (
              <div className='u-margin'>
                <Message 
                  messages={ notificationsMessage }
                  type= { MESSAGE_TYPE.SUCCESS }
                />
              </div>
            )
        }

        <Tabs 
          className='u-marginVertical m-tabMenu'
          value={ tabValue } 
          onChange={ this.onChangeTab }
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"       
        >
          <Tab label='Tracks'></Tab>          
          <Tab label='Links'></Tab>
        </Tabs>

        <div className='u-marginHorizontal'>
          <TabPanel tabValue={ tabValue } index={ 0 }>
            {
              isMyProfile && (
                <React.Fragment>
                  <div className='u-marginVertical'>
                    <Button 
                      onClick={ this.onClickUploadBtn }
                      variant="contained"
                      color="primary" >
                      Upload a new track
                    </Button>
                  </div>
                  <Dialog 
                      onClose={ this.onCloseFileUploadDialog }
                      open={ isFileUploadDialogOpen } >
                    <div className='m-dialog__closeBtn'>
                        <IconButton aria-label="close" onClick={this.onCloseFileUploadDialog}>
                            <MdClose />
                        </IconButton>
                    </div>   
                      <DialogTitle>Upload a track</DialogTitle>
                      <DialogContent>
                        <FileUploader onSubmitFile={ onSubmitFile } />
                        <div className='u-marginTop'>
                          <Typography variant='caption' component='p'>
                            The following filetypes are supported: WAV, MP3, MP4, AAC, OGG, FLAC
                          </Typography> 
                        </div>                       
                      </DialogContent>
                  </Dialog>
                </React.Fragment>              
              )
            }
            {
              userTracks.length ? (
                <TrackList
                  tracks={ userTracks }
                  notificationsByTrack={ notificationsByTrack }
                  getTrackScore={ getTrackScore }
                  isMyTracks={ isMyProfile }
                  showArtistLink={ false }
                  showDeleteButton={ isMyProfile }
                />
              ) : isMyProfile ? (
                <Typography variant='body1' component='p'>
                  Add some tracks to enter the competition!
                </Typography>
              ) : (
                <Typography variant='body1' component='p'>
                  No tracks yet.
                </Typography>
              )
            }

          </TabPanel>
          <TabPanel tabValue={ tabValue } index={ 1 }>
            <div className='u-margintop u-marginBottom'>
              <Typography variant='h5' component='h2'>
                Artist Links
              </Typography>
            </div>
            <ArtistLinksContainer userId={ userId } isLinksOwner={ isMyProfile } />
          </TabPanel>
        </div>
      </React.Fragment>
    )
  }
}

UserProfile.propTypes = {
  userId: PropTypes.string,
  username: PropTypes.string,
  twitterHandle: PropTypes.string,
  instagramHandle: PropTypes.string,
  track: PropTypes.array,
  getTrackScore: PropTypes.func,
  isMyProfile: PropTypes.bool, 
  onSubmitFile: PropTypes.func,
  userTracks: PropTypes.array,
  uploadTrackStatus: PropTypes.string,
  notificationsByTrack: PropTypes.array,
  notificationsCount: PropTypes.number,
  onSaveUsername: PropTypes.func,
  onSaveInstagramHandle: PropTypes.func,
  onSaveTwitterHandle: PropTypes.func
}

UserProfile.defaultProps = {
  isMyProfile: false
}

export default UserProfile