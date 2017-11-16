import React, { Component } from 'react'
import {handleSignOut, checkUserAuthenticated} from './auth/auth'
import { Button, Menu, Segment, Container } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'

class Header extends Component {
  handleSignOutClick = () => {
    handleSignOut()
    this.props.history.push('/')
  }

  handleSignInClick = () => {
    this.props.history.push('/login')
  }

  renderPublicHeader = () => {
    return (
      <Segment
        inverted
        textAlign='center'
        vertical
        color='blue'
      >
        <Container>
          <Menu inverted secondary size='small'>
            <Menu.Item>
              <Link to='/'>LOGO</Link>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item as='a'>Careers</Menu.Item>
              <Menu.Item as='a'>Price</Menu.Item>
              <Menu.Item position='right'>
                <Button primary inverted onClick={this.handleSignInClick}>Sign In</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
      </Segment>
    )
  }

  renderPrivateHeader = () => {
    return (
      <Segment
        inverted
        textAlign='center'
        vertical
        color='blue'
      >
        <Container>
          <Menu inverted secondary size='small'>
            <Menu.Item>
              <Link to='/'>LOGO</Link>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item as='a'>Price</Menu.Item>
              <Menu.Item as='a'>Account</Menu.Item>
              <Menu.Item position='right'>
                <Button primary inverted onClick={this.handleSignOutClick}>Sign Out</Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </Container>
      </Segment>
    )
  }

  render () {
    const userIsLoggedIn = checkUserAuthenticated()
    return (
      <div>
        {!userIsLoggedIn && this.renderPublicHeader()}
        {userIsLoggedIn && this.renderPrivateHeader()}
      </div>
    )
  }
}

export default withRouter(Header)
