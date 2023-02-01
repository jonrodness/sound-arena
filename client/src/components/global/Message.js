import React from 'react'
import PropTypes from 'prop-types'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import { NOTIFICATION_TYPE } from '../../actions/notifications'
import { MdError, MdClose, MdCheck } from 'react-icons/lib/md'
import Typography from '@material-ui/core/Typography'

export const MESSAGE_TYPE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    INFO: 'INFO'
}

const Message = props => {
    const { 
        messages,
        type
    } = props

    let className = 'm-message'

    switch (type) {
        case MESSAGE_TYPE.ERROR: 
            className += ' m-message--error'
            // icon = <MdError />
            break
        case MESSAGE_TYPE.INFO: 
            className += ' m-message--info'
            break
        case MESSAGE_TYPE.SUCCESS: 
            className += ' m-message--success'
            // icon = <MdCheck />
            break            
    }

    return (
        <div className={ className }>
            {
                messages.map(
                    message => {
                        return (
                            <Typography 
                                variant='p' 
                                component='p' 
                                gutterBottom
                            >
                                { message }
                            </Typography>                    
                        )
                    }
                )
            }
        </div>
    )
}

Message.defaultProps = {
    messages: []
}

Message.propTypes = {
    messages: PropTypes.array
}

export default Message