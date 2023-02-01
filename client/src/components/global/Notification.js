import React from 'react'
import PropTypes from 'prop-types'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { NOTIFICATION_TYPE } from '../../actions/notifications'
import { MdError, MdClose, MdCheck } from 'react-icons/lib/md'
import Typography from '@material-ui/core/Typography'

const Notification = props => {
    const { 
        messageGroup, 
        clearNotification, 
        type
    } = props
    const isOpen = !!messageGroup.length
    let className = 'm-notification'
    let icon = null
    
    switch (type) {
        case NOTIFICATION_TYPE.ERROR: 
            className += ' m-notification--error'
            icon = <MdError />
            break
        case NOTIFICATION_TYPE.INFO: 
            className += ' m-notification--info'
            break
        case NOTIFICATION_TYPE.SUCCESS: 
            className += ' m-notification--success'
            icon = <MdCheck />
            break            
    }

    function renderMessage(message) {
        return (
            messageGroup.map((message, index) => {
                return (
                    <React.Fragment key={ index }>
                        <Typography
                            variant='body1' 
                            component='p'
                        >
                            { message }
                        </Typography>
                        {
                            index != 0 && (
                                <br />
                            )
                        }
                    </React.Fragment>
                )
            })
        )      
    }

    function onClose() {
        clearNotification()
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={ isOpen }
            onClose={ onClose }
        >
            <SnackbarContent
                className={ className }
                message={
                    <span className='m-notification__msg'>
                        { 
                            icon && (
                                <p className='u-marginRight'>
                                    { icon } 
                                </p>   
                            )
                        }
                        <div className='m-notification__textGroup'>
                            { renderMessage(messageGroup) }  
                        </div> 
                    </span>
                }
                action={[
                    <IconButton 
                        key='close-btn'
                        aria-label='close' 
                        color='inherit'
                        onClick={ onClose } >
                        { <MdClose /> }
                    </ IconButton>
                ]} 
            />
      </Snackbar>
    )
}

Notification.defaultProps = {
    messageGroup: []
}

Notification.propTypes = {
    messageGroup: PropTypes.array,
    type: PropTypes.string,
    clearNotification: PropTypes.func.isRequired
}

export default Notification