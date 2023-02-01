import { connect } from 'react-redux'
import { fetchLikedTracks } from '../actions/user'
import MyFavorites from '../components/user/MyFavorites.js'

const mapDispatchToProps = dispatch => {
  return  {
    fetchLikedTracks: () => {
      dispatch(fetchLikedTracks())
    }
  }
}

const mapStateToProps = state => {
    const allTracks = state.entities.tracks || {}
    const allArtists = state.entities.artists || {}
    let myLikedTracks = []

    for (const trackId in allTracks) {
        const track = allTracks[trackId]

        // Add artist details to track
        track.artistName = allArtists[track.artistId] && allArtists[track.artistId].name

        if (track.isLiked) {
            myLikedTracks.push(track)
        }
    }

    return {
        myLikedTracks
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyFavorites)
