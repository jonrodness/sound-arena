import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { GENRES } from '../../reducers/competition'
import { GENRE_MAP } from '../../reducers/competition'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

class GenreTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: GENRES[0]
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(index, genre) {
        this.setState({
            activeTab: genre
        })
        this.props.changeGenre(genre)
    }

    render() {
        const { activeTab } = this.state

        return (
            <Tabs
                value={ activeTab }
                onChange={ this.handleChange }
                variant="scrollable"
                scrollButtons="on"
                aria-label="chart genres"
                indicatorColor="primary"    
            >
                {
                    GENRES.map((genre, index) => {
                        const tabLabel = GENRE_MAP[genre].name
                        return (
                            <Tab label={ tabLabel } icon={ null } value={ genre } />
                        )
                    })
                }
            </Tabs>
        )
    }
}

GenreTabs.propTypes = {
    changeGenre: PropTypes.func.isRequired,
}

export default GenreTabs