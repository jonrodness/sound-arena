import Chart from '../components/charts/Chart.js'
import PropTypes from 'prop-types'
import { requestChart } from '../services/chart'
import React, { Component } from 'react'

const CHART_TRACK_LIMIT = 10

class ChartContainer extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      tracks: [],
      isLoading: false,
      isError: false,
      offset: 0
    }

    this.displayPrevTracks = this.displayPrevTracks.bind(this)
    this.displayNextTracks = this.displayNextTracks.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.genre != this.props.genre) {
      // Reset chart to beginning when changing genre
      this.getChartTracks(0)
    }
  }

  displayPrevTracks() {
    const { offset } = this.state
    // Don't allow negative offset
    const newOffset = Math.max((offset - CHART_TRACK_LIMIT), 0)

    this.getChartTracks(newOffset)
  }

  displayNextTracks() {
    const { offset } = this.state
    const newOffset = offset + CHART_TRACK_LIMIT

    this.getChartTracks(newOffset)
  }  

  getChartTracks(offset) {
    const { genre } = this.props

    const query = {
      offset,
      limit: CHART_TRACK_LIMIT,
      genre
    }

    this.setState({
      offset,
      isLoading: true,
      isError: false
    })

    requestChart(query)
      .then(json => {
        this.setState({
          tracks: json.competitionResults,
          date: json.date,
          totalResultsCount: json.totalResultsCount,
          isLoading: false
        })
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          isError: true
        })        
      }) 
  }

  componentDidMount() {
    this.getChartTracks(this.state.offset)
  }

  render() {
    const {
      tracks,
      isLoading,
      isError,
      offset,
      totalResultsCount,
      date
    } = this.state
    const { 
      title,
      days,
      genre
    } = this.props
    return(
      <Chart
        date={ date }
        tracks={ tracks }
        totalResultsCount= { totalResultsCount }
        days={ days }
        title={ title }
        isLoading={ isLoading }
        isError={ isError}
        genre={ genre }
        offset={ offset }
        displayPrevTracks={ this.displayPrevTracks }
        displayNextTracks={ this.displayNextTracks }
      />
    )
  }
}

ChartContainer.defaultProps = {
  title: ''
}

ChartContainer.propTypes = {
  genre: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default ChartContainer
