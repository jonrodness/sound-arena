import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListDialog from '../global/ListDialog'
import { MdDelete } from 'react-icons/lib/md'
import FaExternalLink from 'react-icons/lib/fa/external-link'
import { toNameValArray } from '../../utils/map'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import LoadableElement from '../global/LoadableElement'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions  from '@material-ui/core/DialogActions'
import { NETWORK_STATUS } from '../../services/utils'
import { USER_LINKS } from '../../actions/user'
import Typography from '@material-ui/core/Typography'
import { Divider } from '@material-ui/core'
import { SafeLink } from '../global/links/SafeLink'
import { isUrlSafe } from '../../utils/validations'
import IconButton from '@material-ui/core/IconButton'
import { MdClose } from 'react-icons/lib/md'

class EntityLinks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            linkTypeToAdd: null,
            isEditMode: false,
            isDeleteDialogOpen: false,
            isInputLinkDialogOpen: false,
            linkToDelete: null,
            linkErrorMessage: ''
        }

        this.renderLinks = this.renderLinks.bind(this)
        this.onSubmitLinkBtn = this.onSubmitLinkBtn.bind(this)
        this.onSelectLinkType = this.onSelectLinkType.bind(this)
        this.closeAddLinkBtn = this.closeAddLinkBtn.bind(this)
        this.toggleEditMode = this.toggleEditMode.bind(this)
        this.onClickDeleteLink = this.onClickDeleteLink.bind(this)
        this.onConfirmDeleteLink = this.onConfirmDeleteLink.bind(this)
        this.linkInput = React.createRef();
    }

    renderLinks = () => {
        const { 
            links,
            linkTypes
        } = this.props
        let key = 0
        const that = this

        return links.map(link => {
            const url = `${ link.url }`

            // Validate url
            if (isUrlSafe(url)) {
                const linkName = linkTypes[link.type].name
                key++
    
                return (
                    <React.Fragment>
                        <ListItem 
                            className='m-linkItem'
                            key={ key }
                        >
                            {
                                this.state.isEditMode ? (
                                    <React.Fragment>
                                        <button
                                            className='a-iconButton'                                
                                            onClick={ () => { that.onClickDeleteLink(link) } } >
                                            <MdDelete /> 
                                        </button>
                                        { url }
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <div>
                                            <FaExternalLink />
                                        </div>
                                        &nbsp;
                                        &nbsp;
                                        <span>
                                            <SafeLink
                                                url={url}
                                                target="_blank" 
                                                href={ url } 
                                                rel="noopener" >
                                                { url }
                                            </SafeLink>
                                            <Typography
                                                variant='caption'
                                                component='p'
                                                gutterBottom
                                                className='u-colorBlack'
                                            >
                                                { linkName }
                                            </Typography>
                                        </span>
                                    </React.Fragment>
                                )
                            }
                        </ ListItem>
                        <Divider />
                    </React.Fragment>
                )
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.linksNetworkStatus == NETWORK_STATUS.PENDING
            && this.props.linksNetworkStatus == NETWORK_STATUS.COMPLETE) {
            // Link was successfully added
            this.closeAddLinkBtn()
        }
    }

    onClickDeleteLink = linkToDelete => {
        this.setState({
            isDeleteDialogOpen: true,
            linkToDelete
        })
    }

    onConfirmDeleteLink = () => {
        this.props.deleteLink(
            this.props.entityId,
            this.state.linkToDelete
        )
        this.handleDeleteDialogClose()
    }

    handleDeleteDialogClose = () => {
        this.setState({
            isDeleteDialogOpen: false,
            trackToDelete: null
        })
    }

    testLink = (link, regex, maxLength) => {
       return regex.test(link) && (link.length <= maxLength)
    }

    onSubmitLinkBtn = () => {
        const { 
            submitLink, 
            entityId ,
            linkTypes
        } = this.props
        const { linkTypeToAdd } = this.state
        const linkUrl = this.linkInput.current.value
        const regex = linkTypes[linkTypeToAdd].regex
        const sample = linkTypes[linkTypeToAdd].sample
        const maxLength = linkTypes[linkTypeToAdd].maxLength
        const isLinkValid = this.testLink(linkUrl, regex, maxLength)

        if (isLinkValid) {
            const sanitizedLink = linkUrl.match(regex)[0]
            this.setState({
                linkErrorMessage: ''
            })
            submitLink(
                sanitizedLink, 
                this.state.linkTypeToAdd,
                entityId
            ).then(this.closeAddLinkBtn)
        } else {
            this.setState({
                linkErrorMessage: `Link must follow this format: ${ sample } and must not exceed ${ maxLength } characters`
            })
        }
    }

    closeAddLinkBtn = () => {
        this.setState({
            linkTypeToAdd: null,
            linkErrorMessage: ''
        })
    } 

    onSelectLinkType = linkType => {
        this.setState({
            linkTypeToAdd: linkType
        })
    }

    toggleEditMode = () => {
        this.setState({
            isEditMode: !this.state.isEditMode
        })
    }

    componentDidMount = () => {
        const { 
            isLinksOwner, 
            entityId,
            fetchLinks
        } = this.props

        fetchLinks(isLinksOwner, entityId)
    }

    render() {
        const { 
            hasWriteAccess, 
            disabled, 
            links,
            linkTypes,
            entityType,
            isLinksOwner
        } = this.props
        const { 
            linkTypeToAdd, 
            isEditMode, 
            isDeleteDialogOpen,
            linkErrorMessage
        } = this.state

        const isEnterLinkDialogOpen = !!linkTypeToAdd
        const linkOptions = toNameValArray(linkTypes)
        const placeholder = linkTypeToAdd && linkTypes[linkTypeToAdd].sample

        const addLinkBtn = (
            <Button
                className='a-mdButton md'
                variant="contained"
                color="primary" >
                Add link
            </Button>
        )

        const enterLinkDialog = (
            <Dialog 
                open={ isEnterLinkDialogOpen }
                onClose={ this.closeAddLinkBtn }
            >
                <DialogTitle>Enter { entityType } link</DialogTitle>

                <div className='m-dialog'>
                    <Typography
                        variant='caption'
                        component='p'
                        gutterBottom
                        className='u-colorRed'
                    >
                        { linkErrorMessage }
                    </Typography>
                    <div className='u-marginBottom'>
                        <textarea 
                            rows={5} 
                            ref={ this.linkInput }
                            placeholder={ placeholder }
                            className='u-fullWidth'
                        ></textarea>
                    </div>

                    <div className='u-centered'>
                        <Button
                            className='a-mdButton md'
                            variant="outlined"
                            color="primary"
                            onClick={ this.onSubmitLinkBtn } >
                            Add
                        </Button>

                        <Button
                            className='a-mdButton md'
                            variant="outlined"
                            color="primary"                
                            onClick={ this.closeAddLinkBtn } >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        )

        const deleteLinkDialog = (
            <Dialog
                open={ isDeleteDialogOpen }
                onClose={ this.handleDeleteDialogClose }>
                <div className='m-dialog__closeBtn'>
                    <IconButton aria-label="close" onClick={this.handleDeleteDialogClose}>
                        <MdClose />
                    </IconButton>
                </div>
                <DialogTitle>
                    <div className='m-dialog__header'>
                        Are you sure you want to delete this link?
                    </div>                    
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={ this.onConfirmDeleteLink }>
                        Yes
                    </Button>
                    <Button
                        onClick={ this.handleDeleteDialogClose }>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        )

        const selectLinkTypeDialog = (
            <React.Fragment>
                <ListDialog
                    disabled={ disabled }
                    options={ linkOptions }
                    onChange={ this.onSelectLinkType }
                    title='Select platform link'
                    button = { addLinkBtn } 
                />
                <Button
                    onClick={ this.toggleEditMode }
                    className='a-mdButton md'
                    variant='outlined'
                    color={ isEditMode ? 'secondary' : 'primary' } >
                    Delete Link
                </Button>
            </React.Fragment>
        )

        return (
            <div>
                { deleteLinkDialog }
                { enterLinkDialog }
                { hasWriteAccess && selectLinkTypeDialog }
                
                <div className='u-marginTop'>
                    <LoadableElement
                        loadIds={ [ USER_LINKS ] }
                        centered={ true }
                    >
                        {
                            links.length ? (
                                <List>
                                    { this.renderLinks() }
                                </List>
                            ) : (
                                <React.Fragment>
                                    <Typography
                                        variant='body1'
                                        component='div'
                                        gutterBottom
                                    >
                                        No links yet.
                                    </Typography>

                                    {
                                        hasWriteAccess && (
                                            <Typography
                                                variant='body1'
                                                component='div'
                                                gutterBottom
                                            >
                                                Add links so people can find your music!
                                            </Typography>
                                        )
                                    }
                                </React.Fragment>                               
                            )
                        }
                    </LoadableElement>
                </div>
            </div>
        )
    }
}

EntityLinks.propTypes = {
    links: PropTypes.array,
    entityId: PropTypes.string,
    hasWriteAccess: PropTypes.bool,
    isLinksOwner: PropTypes.bool,
    linkTypes: PropTypes.object,
    entityType: PropTypes.string
}

EntityLinks.defaultProps = {
    hasWriteAccess: false,
    isLinksOwner: false,
    links: []
}

export default EntityLinks