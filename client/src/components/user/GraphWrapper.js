import React, { Component } from 'react'
import { connect } from 'react-redux'
import formatting from '../../utils/formatting'
import { Line } from 'react-chartjs-2'

class GraphWrapperComponent extends Component {
    constructor(props) {
        super(props)

        this.updateWidth = this.updateWidth.bind(this)
        this.wrapperEl = null
        this.state = {
            width: 500
        }
    }

    updateWidth() {
        const newWidth = this.wrapperEl.getBoundingClientRect().width

        if (newWidth !== this.state.width) {
            this.setState({
                width: newWidth
            })
        }
    }

    componentDidMount() {
        this.wrapperEl = document.getElementById('wrapper-' + this.props.trackId)
        window.addEventListener('resize', this.updateWidth)
        this.updateWidth()        
    }

    render() {
        const id = 'wrapper-' + this.props.trackId
        const scores = this.props.trackScore

        let yValues = []
        let x = []

        for (let i = 0; i < scores.length; i++) {
            const score = scores[i]

            // Normalize
            const scale = 100 / score.total 
            const scaledWins = scale * score.wins

            // Shift
            const shiftedWins = scaledWins - 50
            
            x.push(i)
            yValues.push(shiftedWins)
        }

        const graphData = {
            labels: x,
            datasets: [
              {
                fill: true,
                backgroundColor: '#79ff9b',
                borderColor: '#79ff9b',
                pointRadius: 0,
                data: yValues
              }
            ]
          };

          const options = {
            legend: {
                display: false
            },              
            tooltips: {
                mode: 'nearest',
                intersect: false,
                callbacks: {
                    title: function(tooltipItem, data) {
                        let title = ''
                        if (tooltipItem[0] && tooltipItem[0].xLabel) {
                            const clockTime = formatting.getClockTime(tooltipItem[0].xLabel)
                            title = clockTime.minutes + ':' + clockTime.seconds
                        }
                        return title
                    },
                    label: function(tooltipItem, data) {
                        const score = parseInt(tooltipItem.value) + 50
                        const totalPlays = scores[tooltipItem.index].total
                        const label = `Win percentage: ${score}% of ${totalPlays} plays`
                        return  label
                    }
                }                
            },  
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function(label, index, labels) {
                                // filter ticks outside valid range and shift ticks up by 50
                                const newLabel = label > 50 || label < -50 ? '' : label + 50
                                return newLabel
                            }
                        }
                    }
                ],
                xAxes: [
                    {
                        ticks: {
                            callback: function(label, index, labels) {
                                const clockTime = formatting.getClockTime(label)
                                const timeLabel = clockTime.minutes + ':' + clockTime.seconds
                                return timeLabel
                            }
                        }
                    }
                ]         
            }
          }

        return (
            <div 
                id={ id } 
                className='a-graphWrapper' >
                <Line
                    data={ graphData }
                    options={ options } >
                </Line>
            </div>
        )
    }
}

GraphWrapperComponent.defaultProps = {
    trackScore: []
}

const mapStateToProps = (state, ownProps) => {
    const {
        trackId
    } = ownProps

    const track = state.entities.tracks[trackId]
    
    return {
        trackId,
        trackScore: track.score
    }
}

export const GraphWrapper = connect(
  mapStateToProps
)(GraphWrapperComponent)