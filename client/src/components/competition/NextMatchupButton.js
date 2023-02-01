import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchMatchupTracks } from '../../actions/competition'
import Button from '@material-ui/core/Button'
import { isReadyToStartMatchup } from '../../reducers/competition'

class Competition extends Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    render() {
        const {
            disabled,
            onClickStartBtn
        } = this.props

        return (
            <div data-test-id={ disabled ? '' : 'start-competition-btn' }>
                <Button
                    color='primary'
                    onClick={ onClickStartBtn }
                    disabled={ disabled }
                    variant='contained'
                >
                    Create entry!
                </Button>
            </div> 
        )   
    }
}

const mapDispatchToProps = dispatch => {
    return  {
        onClickStartBtn: () => {
            dispatch(fetchMatchupTracks())
        }        
    }
} 

const mapStateToProps = state => {
    const { competition } = state

    const disabled = !isReadyToStartMatchup(competition) ||
        !competition.enteredGenre || !competition.enteredTrackId

    return {
        disabled
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Competition)