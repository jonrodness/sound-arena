import React from 'react'
import PropTypes from 'prop-types'
import FaTrophy from 'react-icons/lib/fa/trophy'
import Button from '@material-ui/core/Button'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'

const TRACK_AWARD_GROUPS = {
    TOP_10_PERCENT: 'top10Percent',
    TOP_25_PERCENT: 'top25Percent',
    TOP_50_PERCENT: 'top50Percent'
};

const Award = props => {
    const {
        date,
        place,
        totalParticipants,
        genre,
        linkTextAreaId,
        showCopyBtn,
        link,
        awardGroupId,
        onClickCopyBtn,
        showNewAwardBadge
    } = props

    const genreText = `Genre: ${ genre }`
    const rankingText = `Rank: ${ place } of ${ totalParticipants }`
    const formattedDate = new Date(date).toDateString()
    const dateText = `Date: ${ formattedDate }`

    let imageSrc = ''

    switch (awardGroupId) {
      case TRACK_AWARD_GROUPS.TOP_10_PERCENT:
        imageSrc = '/badge-gold.jpg'
        break
      case TRACK_AWARD_GROUPS.TOP_25_PERCENT:
        imageSrc = '/badge-silver.jpg'
        break
      case TRACK_AWARD_GROUPS.TOP_50_PERCENT:
        imageSrc = '/badge-bronze.jpg'
        break
    }    

    return (
        <div className='m-award u-flexColumn u-flexGrow'>
            <div className='m-award__info'>

                <ListItemAvatar className='m-award__badge'>
                    <Badge 
                        color="secondary" 
                        badgeContent={ 'New!' } 
                        invisible={ !showNewAwardBadge } 
                    >
                        <div className='u-marginBottom'>
                            <img src={imageSrc} />
                        </div>
                    </Badge>
                </ListItemAvatar>

                <div className='u-flexColumn'>
                    <Typography
                        variant='body2'
                        component='p'
                        gutterBottom
                    >
                        { genreText }
                    </Typography>
                    <Typography
                        variant='body2'
                        component='p'
                        gutterBottom
                    >
                        { rankingText }
                    </Typography>
                    <Typography
                        variant='body2'
                        component='p'
                    >
                        { dateText }
                    </Typography>
                </div>

            </div>
            
            <div className='u-flexColumn u-flexGrow'>
                <div className='u-flexRow'>

                </div>
                {
                    showCopyBtn && (
                        <React.Fragment>
                            <br />
                            <div className='u-marginBottom u-flexRow u-flexGrow'>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={ onClickCopyBtn }
                                    data-linkid={ linkTextAreaId }
                                >
                                    Copy Award Link
                                </Button>
                            </div>          
                            <div>
                                <ListItemText
                                    secondary='Sharable Link: '
                                />
                            </div>    
                            <textarea
                                rows={7}
                                readOnly
                                className='a-awardLink'
                                id={ linkTextAreaId }
                                value={ link }
                            />
                        </React.Fragment>
                    )
                }                                                        
            </div>
        </div>
    )
}

Award.defaultProps = {
    showCopyBtn: false,
    showNewAwardBadge: false
}

Award.propTypes = {
    date: PropTypes.string.isRequired,
    place: PropTypes.number.isRequired,
    totalParticipants: PropTypes.number.isRequired,
    genre: PropTypes.string.isRequired,
    showNewAwardBadge: PropTypes.bool,

    linkTextAreaId: PropTypes.string,
    showCopyBtn: PropTypes.bool,
    link: PropTypes.string,
    awardGroupId: PropTypes.string,
    onClickCopyBtn: PropTypes.func
}

export default Award;