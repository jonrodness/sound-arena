import { connect } from 'react-redux'
import { 
  fetchTrackLinks, 
  deleteTrackLink
} from '../actions/track'
import { updateTracks } from '../actions/entities'
import { onNetworkError } from '../actions/notifications'
import { submitTrackLink } from '../services/track'
import EntityLinks from '../components/user/EntityLinks'
import { checkIfTrackOwner } from '../reducers/entities'
import { LINK_TYPES } from '../constants/links'

const mapDispatchToProps = dispatch => {
  return  {
    submitLink: (url, type, trackId) => {
      return new Promise(resolve => {
        submitTrackLink(url, type, trackId)
          .then(json => {
            resolve(dispatch(updateTracks(json.tracks)))
          })
          .catch(err => {
            dispatch(onNetworkError(err))
          })
      })
    },
    fetchLinks: (isTrackOwner, trackId) => {
        // Need isTrackOwner as a hack for ArtistLinksContainer for now
        dispatch(fetchTrackLinks(trackId))
    },
    deleteLink: (trackId, link) => {
      dispatch(deleteTrackLink(trackId, link.id))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    entities,
    user
  } = state
  const { trackId } = ownProps
  const track = entities.tracks[trackId] || {}
  const { links } = track

  const hasWriteAccess = checkIfTrackOwner(trackId, user, entities)

	return {
    entityId: trackId,
    links,
    hasWriteAccess,
    linkTypes: LINK_TYPES.TRACK,
    entityType: "track"
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityLinks)
