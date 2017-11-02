import React, { Component } from 'react'
import AppRoute from '../App'
import { Segment, Button, Divider, Input, Form, Label, Grid, Header, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { loginCallbackFactory, handleSignIn, sendMFAVerificationCode } from './auth'

const STAGE_START = 'STAGE_START'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_SUCCESS = 'STAGE_SUCCESS'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    code: '',

    stage: STAGE_START,
    enableResend: false
  };

  callbacks = loginCallbackFactory({
    onSuccess () {
      this.setState({
        stage: STAGE_SUCCESS
      })
    },
    onFailure (error) {
      this.setState({
        logInError: error
      })
    },
    mfaRequired () {
      this.setState({
        stage: STAGE_VERIFICATION,
        enableResend: false
      })
      this.countDownResendVerificationCode()
    }
  }, this);

  countDownResendVerificationCode = () => {
    let counter = 20
    var seconds = setInterval(() => {
      if (counter === 0) {
        clearInterval(seconds)
        this.setState({
          enableResend: true
        })
      }
      counter--
    }, 1000)
  }

  signIn = () => {
    handleSignIn(this.state.username, this.state.password, this.callbacks)
  }

  requestVerificationCode = () => {
    this.setState({
      enableResend: false
    })
    sendMFAVerificationCode(this.state.code, this.callbacks)
  }

  renderLoginError () {
    return (
      <Message negative style={{textAlign: 'left'}}>
        Error: { this.state.logInError }
      </Message>
    )
  }

  renderInfo () {
    return (
      <div>
        <Grid
          textAlign='center'
          style={{ marginTop: 120 }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ width: 450 }} verticalAlign='middle'>
            { this.state.logInError && this.renderLoginError() }
            <Form size='large'>
              <Segment padded='very' style={{backgroundColor: '#fafafa'}}>
                <Header as='h2' color='blue' textAlign='left'>
                  Sign In
                </Header>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='E-mail address'
                  onChange={(event) => this.setState({username: event.target.value, logInError: ''})}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => this.setState({password: event.target.value, logInError: ''})}
                />
                <Button color='blue' fluid size='large' onClick={this.signIn}>Sign In</Button>
              </Segment>
            </Form>
            <Divider hidden />
            <Link to='/forget'>Forgot Password</Link>
            {' '} New to us? <Link to='/register'>Sign Up</Link>
          </Grid.Column>
        </Grid>
      </div>
    )
  }

  renderVerification () {
    return (
      <div>
        <div>
          <Form.Field>
            <Input type='text' icon='hashtag' iconPosition='left' placeholder='Verification code' style={{marginRight: 4 + 'em'}}
              onChange={(event) => this.setState({code: event.target.value, logInError: ''})} />
            { this.state.logInError && <Label basic color='red' pointing='left'>{ this.state.logInError }</Label> }
          </Form.Field>
        </div>
        <div>
          <Button primary fluid onClick={this.requestVerificationCode}>Validate</Button>
          { this.state.enableResend && (<Button fluid color='purple' onClick={this.signIn}>Resend it!</Button>)}
          { !this.state.enableResend && (<Button fluid loading disabled>Waiting to resend</Button>) }
        </div>
      </div>
    )
  }

  render () {
    return (
      <div>
        { this.state.stage === STAGE_START && this.renderInfo() }
        { this.state.stage === STAGE_VERIFICATION && this.renderVerification() }
        { this.state.stage === STAGE_SUCCESS && (<AppRoute />)}
      </div>
    )
  }
}
