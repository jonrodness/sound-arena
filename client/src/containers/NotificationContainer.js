import { connect } from 'react-redux'
import { clearNotification } from '../actions/notifications'
import Notification from '../components/global/Notification'

const mapDispatchToProps = dispatch => {
  return {
    clearNotification: () => {
      dispatch(clearNotification())
    }   
  }
}

const mapStateToProps = state => {
  const { messageGroup, type } = state.notification

	return {
    messageGroup,
    type
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification) 
