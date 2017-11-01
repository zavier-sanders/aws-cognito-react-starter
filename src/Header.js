import React, { Component } from 'react'
import {handleSignOut, getUserSession} from './auth/auth'
import { Button } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

class Header extends Component {
  handleSignOutClick = () => {
    handleSignOut()
    this.props.history.replace('/login')
  }

  handleSignInClick = () => {
    this.props.history.push('/login')
  }

  render () {
    if (getUserSession()) {
      return (
        <div>
          You have logged in.
          <Button primary onClick={this.handleSignOutClick}>Signout</Button>
        </div>
      )
    } else {
      return (
        <div>
          Not signed in.
          <Button primary onClick={this.handleSignInClick}>SignIn</Button>
        </div>
      )
    }
  }
}

export default withRouter(Header)
