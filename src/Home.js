import React, { Component } from 'react'
import {handleSignOut} from './auth/auth'
import { Button } from 'semantic-ui-react'
import { getCurrentUser } from './auth/auth'
import { Redirect } from 'react-router-dom'

export default class Home extends Component {
  state = {
    email: '',
    signedOut: false
  }

  handleSignOutSubmit = () => {
    handleSignOut()
    this.setState({
      signedOut: true
    })
  }

  componentDidMount() {
    const user = getCurrentUser()
    if (user) {
      user.getUserAttributes((err, result) => {
        console.log(result)
        for (let i = 0; i < result.length; i++) {
          if (result[i].Name === 'email') {
            this.setState({
              email: result[i].Value
            })
          }
        } 
      })
    }
  }

  render () {
    return (
      <div>
        { this.state.signedOut && (<Redirect to='/' />)}
        This is private content.
        You can only see this page after you have signed in.
        <p> </p>
        Your email: {this.state.email}

        <Button primary fluid onClick={this.handleSignOutSubmit}>Signout</Button>
      </div>
    )
  }
}
