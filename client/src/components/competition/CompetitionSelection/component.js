import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { GENRE_MAP } from '../../../reducers/competition'

export class CompetitionSelectionComponent extends Component {
    constructor(props) {
      super(props)
    }

    render() {
        const { 
            trackTitle,
            genreId
        } = this.props

        return (
            <div className='u-marginTop'>
              <Typography
                variant='body2'
                component='p'
                className='a-competitionSelectionText'
              >
                Pending entry: { trackTitle }
              </Typography>
            </div>
          )
    }
}

CompetitionSelectionComponent.propTypes = {
    trackTitle: PropTypes.string.isRequired,
    genreId: PropTypes.string.isRequired,
}