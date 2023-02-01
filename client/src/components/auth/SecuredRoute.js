import React from 'react'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

function SecuredRoute(props) {
  const { isAuthenticated } = props
  const { component: Component, path } = props

  return (
    <Route path={ path } render={ props => {
        if (isAuthenticated) {
          return <Component {...props} />
        } else {
          return <Redirect to='/sign-in' />
        }
    }} />
  )
}

const mapStateToProps = state => {
  const { isAuthenticated } = state.user
  
  return {
    isAuthenticated
  }
}
export default withRouter(connect(mapStateToProps)(SecuredRoute))