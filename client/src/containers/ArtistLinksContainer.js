import { connect } from 'react-redux'
import {
  fetchArtistLinks,
  deleteArtistLink,
  receiveArtistLinks  
} from '../actions/user'
import { onNetworkError } from '../actions/notifications'
import { submitArtistLink } from '../services/user'
import EntityLinks from '../components/user/EntityLinks'
import { LINK_TYPES } from '../constants/links'
import { isIdEqual } from '../utils/entities'

const mapDispatchToProps = dispatch => {
  return  {
    submitLink: (url, type) => {
      return new Promise(resolve => {
        submitArtistLink(url, type)
          .then(json => {
            resolve(dispatch(receiveArtistLinks(json.links)))
          })
          .catch(err => {
            dispatch(onNetworkError(err))
          })
      })
    },
    fetchLinks: (isMyLinks, userId) => {
        dispatch(fetchArtistLinks(isMyLinks, userId))
    },
    // entityId only required because shared with TrackLinksContainer
    deleteLink: (entityId, link) => {
      dispatch(deleteArtistLink(link.id))
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const { 
    userId,
    isLinksOwner
  } = ownProps

  const {
    user,
    entities
  } = state

  const hasWriteAccess = isLinksOwner || isIdEqual(user.id, userId)
  const links = hasWriteAccess ? user.links : entities.artists[userId] && entities.artists[userId].links

	return {
    entityId: userId,
    links,
    hasWriteAccess,
    isLinksOwner,
    linkTypes: LINK_TYPES.ARTIST,
    entityType: "artist"
	}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntityLinks)
