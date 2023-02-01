import React, { Component } from 'react'

class AudioCoordinationContainer extends Component {
  constructor(props) {
    super(props)
    this.state = { isPlaying: false }

    this.updatePlaybackState = this.updatePlaybackState.bind(this)
  }

  updatePlaybackState(shouldPlay) {
    if (typeof shouldPlay === 'undefined') {
      this.setState(state => ({
        isPlaying: !state.isPlaying
      }))
    } else {
      this.setState({
        isPlaying: shouldPlay
      })
    }
  }

  render() {
    const extraProps = {
      isPlaying: this.state.isPlaying,
      updatePlaybackState: this.updatePlaybackState
    }

    return(
      React.cloneElement(React.Children.only(this.props.children), extraProps)
    )
  }
}

export default AudioCoordinationContainer;
