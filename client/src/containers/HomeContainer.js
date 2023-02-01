import React, { Component } from 'react'
import ChartContainer from './ChartContainer.js'
import GenreTabs from '../components/global/GenreTabs'
import { GENRES } from '../reducers/competition'
import Typography from '@material-ui/core/Typography'
import { Link, withRouter } from 'react-router-dom'
import '../css/home.css'
import Button from '@material-ui/core/Button'

class Home extends Component {
  constructor(props) {
    super(props)
    this.competitionResultsRef = React.createRef()
    
    this.state = {
      genre: GENRES[0]
    }

    this.updateChartGenre = this.updateChartGenre.bind(this)
    this.scrollToCompetitionResults = this.scrollToCompetitionResults.bind(this)
  }

  scrollToCompetitionResults() {
    if (this.competitionResultsRef.current) {
      this.competitionResultsRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  updateChartGenre(genre) {
    this.setState({
      genre: genre
    })
  }

  render() {
    const showLast10Days = process.env.REACT_APP_FEATURES_LAST_10_DAYS == 'true'
    const last10DaysChart = (
      <ChartContainer 
        days={ 10 }
        genre={ this.state.genre } />
    )

    return (
      <div className="home">
        <div className='a-fullPageText' id='home-banner'>
            <Typography 
                variant='h4'
                component='h1'
                className='u-marginBottom'
                id='app-title'
            >
                SoundArena
            </Typography>
            <Typography 
                variant='h6'
                component='h2'
                id='app-slogan'
            >
                Believe in your music
            </Typography>
            <Typography 
                variant='body2'
                component='h2'
                id='app-description'         
            >
                Simple, free and fair. Does your music have what it takes to win?
            </Typography>
            <div className='u-marginTop a-linkText__yellow'>
              <Link to='/about' >
                Learn more
              </ Link>
            </div>
            <div className='u-marginTop a-linkText__yellow'>
              <Button
                onClick={this.scrollToCompetitionResults}
                variant="outlined"
                color="secondary"
              >
                Latest Results
              </Button>
            </div>
        </div>

        <div className='u-marginLeft u-marginTop--medium u-marginBottom'>
          <Typography
            ref={this.competitionResultsRef}
            variant='h5' 
            component='h2'
            classes={{root:'u-textCenter'}}
            id={'latest-competition-results'}
          >
              { 'Latest Competition Results' }
          </Typography>
        </div>
        <GenreTabs
          changeGenre={ this.updateChartGenre } />
        <ChartContainer
          days={ 1 }
          title={ null } 
          genre={ this.state.genre } />
        { showLast10Days ? last10DaysChart : null }
      </div>
    );
  }
}

export default withRouter(Home)
