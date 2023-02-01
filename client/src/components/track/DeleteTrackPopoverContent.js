import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LoadableElement from '../global/LoadableElement'
import Button from '@material-ui/core/Button';
import {
    deleteTrack,
    DELETE_TRACK
} from '../../actions/user'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton'
import { MdClose } from 'react-icons/lib/md'

class DeleteButton extends Component {
    constructor(props) {
        super(props)
        this.deleteTrack = this.deleteTrack.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.state = {
            isDialogOpen: false
        }
    }

    deleteTrack = () => {
        const {
            trackId,
            deleteTrack
        } = this.props

        deleteTrack(trackId)
        // Because track is removed from list, do not need to call handleClose for popOver as the Element is gone
    }

    openDialog = () => {
        this.setState({
            isDialogOpen: true            
        })
    }

    handleClose = () => {
        this.setState({
            isDialogOpen: false            
        })
    }

    render() {
        const {
            isDialogOpen
        } = this.state

        return (
            <React.Fragment>
                <Button onClick={ this.openDialog }>
                    Delete Track
                </Button>
                <Dialog 
                    onClose={ this.handleClose }
                    open={ isDialogOpen } >
                    <div className='m-dialog__closeBtn'>
                        <IconButton aria-label="close" onClick={this.handleClose}>
                            <MdClose />
                        </IconButton>
                    </div>                        
                    <DialogTitle>
                        Are you sure?
                    </DialogTitle>
                    <DialogContent>
                        <Typography
                            variant='body1'
                            component='p' 
                        >
                            Deleting a track is irreverisble. All of the track data, including awards, will be removed permanently.
                        </Typography>
                            <div className='u-centered u-marginVertical'>
                                <LoadableElement loadIds={ [ DELETE_TRACK ] }>
                                    <Button
                                        onClick={ this.deleteTrack } 
                                        variant="contained"
                                        color="primary" >                    
                                        Delete Track
                                    </Button>
                                </LoadableElement>
                            </div>
                    </DialogContent>
                </Dialog>
            </React.Fragment>
        )
    }
}

DeleteButton.propTypes = {
    trackId: PropTypes.string.isRequired
}

const mapDispatchToProps = dispatch => {
    return  {
        deleteTrack: trackId => {
            dispatch(deleteTrack(trackId))
        }
    }
  } 

const mapStateToProps = (state, ownProps) => {
    return {...ownProps}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeleteButton)