import React, { Component } from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { MdClose } from 'react-icons/lib/md'
import { Link } from 'react-router-dom'
import { getMyProfilePath } from '../../../utils/navigation'

export class CompetitionHelpBtnComponent extends Component {
    constructor(props) {
      super(props)
      this.onClickHelpBtn = this.onClickHelpBtn.bind(this)
      this.onCloseHelpDialog = this.onCloseHelpDialog.bind(this)
      this.onClickCancelMatchupBtn = this.onClickCancelMatchupBtn.bind(this)

      this.state = {
        isHelpDialogOpen: false
      }      
    }

    onClickHelpBtn() {
        this.setState({
            isHelpDialogOpen: true
        })
    }

    onClickCancelMatchupBtn() {
        this.props.cancelMatchup()
        this.onCloseHelpDialog()
    }

    onCloseHelpDialog() {
        this.setState({
            isHelpDialogOpen: false
        })    
    }

    render() {
        const { isHelpDialogOpen } = this.state
        const { cancelDisabled } = this.props

        return (
            <div className='u-flexRow'>
                <Dialog 
                    onClose={ this.onCloseHelpDialog }
                    open={ isHelpDialogOpen } >
                    <div className='m-dialog__closeBtn'>
                        <IconButton aria-label="close" onClick={this.onCloseHelpDialog}>
                            <MdClose />
                        </IconButton>
                    </div>                         
                    <DialogTitle>
                        Help
                    </DialogTitle>
                    <DialogContent>
                        If you are experiencing an issue playing the current track you can cancel this matchup.
                        <div className='u-centered u-marginVertical'>
                            <Button 
                                onClick={ this.onClickCancelMatchupBtn }
                                className='a-mdButton md'
                                variant="outlined"
                                color="primary"
                                disabled={cancelDisabled}
                            >
                                Cancel matchup
                            </Button>
                        </div>
                        <Typography
                            variant='h6'
                            component='h3'
                            noWrap={true}
                        >
                            How it works:
                        </Typography>                                        
                        <ul className='m-list'>
                            <li className='m-list__item m-list__item--bold'>
                                All you need to do is submit the minimum number of entries to a competition for a specific track in a single day.
                            </li>
                            <li className='m-list__item'>
                                To submit an entry, complete a matchup by listening to two tracks and selecting which track is better.
                            </li>
                            <li className='m-list__item'>
                                Submit the minimum number of entries for your track to be eligible for tomorrow's competition results.
                            </li>                            
                            <li className='m-list__item'>
                                Your entries will be used to compete against other tracks in the selected competition.
                            </li>                                                     
                            <li className='m-list__item'>
                                The competition resets daily. It begins at 12AM US Eastern Time every day, so be sure to submit the minimum number of matchups before the day ends or your entries will be deleted. 
                            </li>
                            <li className='m-list__item'>
                                Check back the following day to view the results of the competition. You'll receive competition notifications and awards in the app.  
                            </li>
                            <li className='m-list__item'>
                                Be sure to add links to your tracks so everyone can find them on your favorite streaming platform(s).
                            </li>                            
                            <li className='m-list__item'>
                                If you have completed the minimum number of matchups, but your track has not been judged the minimum number of times, 
                                your entries will be pushed to the following day, so be sure to check back!
                            </li>
                            <li className='m-list__item'>
                                You can find competition awards, notifications and analytics for your tracks in the &nbsp;
                                <Link to={ getMyProfilePath() } className='a-clickableText'>
                                    PROFILE
                                </Link>
                                &nbsp; section.
                            </li>                                              
                        </ul>
                        
                        <br/>

                    </DialogContent>
                </Dialog>

                <Button
                    color='primary'
                    onClick={ this.onClickHelpBtn }
                    variant='outlined'
                    size='small'
                >
                   Help
                </Button>
            </div>
        )
    }
}