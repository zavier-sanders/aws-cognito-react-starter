import React, { Component } from 'react'
import { Segment, Button, Divider, Form, Grid, Header, Message } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { loginCallbackFactory, handleSignIn, sendMFAVerificationCode } from './auth'
import Verification from './Verification'

const STAGE_INFO = 'STAGE_INFO'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_REDIRECT = 'STAGE_REDIRECT'

const COUNT_DOWN_RESEND = 30

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    code: '',

    stage: STAGE_INFO,
    countDown: 0,

    logging: false
  };

  seconds = setInterval(() => {
    if (this.state.countDown > 0) {
      this.setState({
        countDown: this.state.countDown - 1
      })
    }
  }, 1000)

  componentWillUnmount () {
    clearInterval(this.seconds)
  }

  callbacks = loginCallbackFactory({
    onSuccess () {
      this.setState({
        stage: STAGE_REDIRECT,
        errorMessage: '',
        logging: false
      })
    },
    onFailure (error) {
      this.setState({
        errorMessage: error,
        logging: false
      })
    },
    mfaRequired () {
      this.setState({
        stage: STAGE_VERIFICATION,
        countDown: COUNT_DOWN_RESEND,
        errorMessage: '',
        logging: false
      })
    }
  }, this);

  signIn = () => {
    this.setState({
      logging: true
    })
    handleSignIn(this.state.username, this.state.password, this.callbacks)
  }

  resendVerificationCode = () => {
    sendMFAVerificationCode(this.state.code, this.callbacks)
    this.setState({
      countDown: COUNT_DOWN_RESEND
    })
  }

  renderErrorMessage () {
    return (
      <Message negative style={{textAlign: 'left'}}>
        Error: { this.state.errorMessage }
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
            { this.state.errorMessage && this.renderErrorMessage() }
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
                  onChange={(event) => this.setState({username: event.target.value, errorMessage: ''})}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => this.setState({password: event.target.value, errorMessage: ''})}
                />
                <Button color='blue' fluid size='large'
                  onClick={this.signIn}
                  disabled={this.state.logging}
                >
                  {this.state.logging ? 'Logging in...' : 'Sign In'}
                </Button>
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
      <Verification
        errorMessage={this.state.errorMessage}
        countDown={this.state.countDown}
        onBlur={(event) => this.setState({code: event.target.value.trim(), errorMessage: ''})}
        onValidate={this.signIn}
        onResendCode={this.resendVerificationCode}
      />
    )
  }

  renderRedirect () {
    clearInterval(this.seconds)
    return <Redirect to='/' />
  }

  render () {
    return (
      <div>
        { this.state.stage === STAGE_INFO && this.renderInfo() }
        { this.state.stage === STAGE_VERIFICATION && this.renderVerification() }
        { this.state.stage === STAGE_REDIRECT && this.renderRedirect() }
      </div>
    )
  }
}
