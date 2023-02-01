import React from 'react'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import { 
    MdNavigateBefore, 
    MdNavigateNext 
} from 'react-icons/lib/md'
import Typography from '@material-ui/core/Typography'

const ChartControls = props => {
    const {
        startIndex,
        endIndex,
        totalResultsCount,
        disablePrev,
        diableNext,
        onClickPrevBtn,
        onClickNextBtn,
    } = props

    const iconBtnClass = { root: 'a-iconBtnOverride' }

    return (
        <div className='m-chartControls'>
            <Typography 
                variant='caption' 
                component='p'
            >
                 { startIndex } to { endIndex } of { totalResultsCount }
            </Typography>
            <ButtonGroup className='m-chartControls__btnGroup'>
                <IconButton 
                    aria-label='previous-tracks'
                    onClick={ onClickPrevBtn }
                    disabled={ disablePrev }
                    classes={ iconBtnClass }
                >
                    <MdNavigateBefore />
                </IconButton>
                <IconButton 
                    aria-label='next-tracks'
                    onClick={ onClickNextBtn }
                    disabled= { diableNext }
                    classes={ iconBtnClass }
                >
                    <MdNavigateNext />
                </IconButton>
            </ButtonGroup>
        </div> 
    )
}

export default ChartControls