import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import { MdClose } from 'react-icons/lib/md'

class ListDialog extends Component {
    constructor(props) {
      super(props)
    }

    onSelectItem = key => {
        this.props.onSelectItem(key)
    }
    
    handleClose = () => {
        this.props.onClose(this.props.selectedKey)
    }    

    render() {
        const { options } = this.props

        let listItems = options.map (
            option => {
                return (
                    <ListItem 
                        button onClick={ () => this.onSelectItem(option.val) }
                        key={ option.val } >
                        { option.name }
                    </ListItem>
                )
            }
        )        

        return (
            <Dialog 
                onClose={ this.handleClose }
                open={ this.props.open } >
                <div className='m-dialog__closeBtn'>
                    <IconButton aria-label="close" onClick={this.handleClose}>
                        <MdClose />
                    </IconButton>
                </div>                        
                <DialogTitle>
                    { this.props.title }
                </DialogTitle>
                <List>
                    { listItems }
                </List>
            </Dialog>
        )
    }
}

class ListDialogWrapped extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
        }
    }

    handleClickOpen = () => {
      this.setState({
        open: true
      })
    }
  
    handleClose = key => {
        this.setState({
            selectedValue: key, 
            open: false 
        })
    }

    onSelectItem = key => {
        this.setState({
            selectedValue: key, 
            open: false 
        })

        this.props.onChange(key)
    }

    // Update parent with intial value
    componentDidMount() {
        const { selectedItemKey, shouldSelectOnMount } = this.props
        if (shouldSelectOnMount) {
            this.onSelectItem(selectedItemKey)
        }
    }
  
    render() {
        const { button, disabled, options, title } = this.props
        const { open, selectedKey } = this.state

        const configuredButton = React.cloneElement(
            button, 
            {
                onClick: this.handleClickOpen,
                disabled: disabled
            },
            button.props.children
        )
    
        return (
            <React.Fragment>
                { configuredButton }
                <ListDialog
                    selectedKey={ selectedKey }
                    open={ open }
                    onClose={ this.handleClose }
                    options={ options }
                    onSelectItem={ this.onSelectItem }
                    title={ title } />
            </React.Fragment>
        )
    }
}
  
export default ListDialogWrapped

ListDialogWrapped.defaultProps = {
    shouldSelectOnMount: false
}

ListDialogWrapped.propTypes = {
    shouldSelectOnMount: PropTypes.bool
}

