import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { FaEllipsisH } from 'react-icons/lib/fa'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button';

class MorePopover extends Component {
    constructor(props) {
        super(props)

        this.state = {
            anchorEl: null,
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
            open: true
        })        
    }

    handleClose = () => {
        this.setState({
            anchorEl: null,
            open: false 
        })  
    }

    render() {
        const { 
            anchorEl
        } = this.state
        const { children } = this.props
        const open = !!anchorEl
        const id = open ? 'simple-popover' : undefined

        return (
            <React.Fragment>
                <Button onClick={ this.handleClick }>
                    <FaEllipsisH/>
                </Button>
                <Popover
                    id={ id }
                    open={ open }
                    anchorEl={ anchorEl }
                    onClose={ this.handleClose }
                    anchorOrigin={
                        {
                            vertical: 'center',
                            horizontal: 'left',
                        }
                    }
                    transformOrigin={
                        {
                            vertical: 'top',
                            horizontal: 'center',
                        }
                    }
                >
                    { children }
                </Popover>          
            </ React.Fragment>
        )
    }
}

MorePopover.propTypes = {
    content: PropTypes.node.isRequired
}

export default MorePopover