import React, { Component } from 'react'
import { Segment, Button, Form, Grid, Header, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { handleResendVerificationCode, handleSubmitVerificationCode, handleSignUp, checkSignUpError } from './auth'
import Verification from './Verification'

const STAGE_INFO = 'STAGE_INFO'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_REDIRECT = 'STAGE_REDIRECT'

const COUNT_DOWN_RESEND = 30
const COUNT_DOWN_REDIRECT = 5

export default class Register extends Component {
  state = {
    name: '',
    password: '',
    passwordMatch: '',
    email: '',
    code: '',
    invalidCodeMessage: '',
    errorMessage: '',

    stage: STAGE_INFO,
    countDown: 0
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

  signUpCallback = function (err, data) {
    if (err) {
      this.setState({
        errorMessage: checkSignUpError(err)
      })
    } else {
      this.setState({
        errorMessage: '',
        stage: STAGE_VERIFICATION,
        countDown: COUNT_DOWN_RESEND
      })
    }
  }.bind(this);

  verificationCallback = function (err, data) {
    if (err) {
      this.setState({
        errorMessage: 'Invalid verification code.'
      })
    } else {
      this.setState({
        errorMessage: '',
        stage: STAGE_REDIRECT,
        countDown: COUNT_DOWN_REDIRECT
      })
    }
  }.bind(this);

  resendCodeCallback = function (err, result) {
    if (err) {
      this.setState({
        errorMessage: 'Resend code fail. Please retry.'
      })
    } else {
      this.setState({
        errorMessage: '',
        countDown: COUNT_DOWN_RESEND
      })
    }
  }.bind(this);

  handleSubmit = () => {
    if (!this.state.name || !this.state.email || !this.state.password || !this.state.passwordMatch) {
      this.setState({
        errorMessage: 'Please fill all fields in the form below.'
      })
    } else if (!this.checkNamePattern() || !this.checkEmailPattern() || !this.checkPasswordMatch()) {
      this.setState({
        errorMessage: 'Invalid input.'
      })
    } else {
      handleSignUp(
        this.state.email,
        this.state.password,
        this.state.name,
        this.signUpCallback
      )
    }
  }

  handleSubmitVerification = () => {
    if (!this.state.code) {
      this.setState({
        errorMessage: 'Code cannot be empty.'
      })
    } else {
      handleSubmitVerificationCode(this.state.email, this.state.code, this.verificationCallback)
    }
  }

  resendVerificationCode = () => {
    handleResendVerificationCode(this.state.email, this.resendCodeCallback)
  }

  checkNamePattern = () => {
    return this.state.name && this.state.name.length > 0
  }

  checkPasswordMatch = () => {
    return this.state.password === this.state.passwordMatch
  }

  checkEmailPattern = () => {
    return /\S+@\S+\.\S+/.test(this.state.email)
  }

  renderErrorMessage (message) {
    return (
      <Message negative style={{textAlign: 'left'}}>
        Error: { message }
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
            { this.state.errorMessage && this.renderErrorMessage(this.state.errorMessage) }
            <Form size='large'>
              <Segment padded='very' style={{backgroundColor: '#fafafa'}}>
                <Header as='h2' color='blue' textAlign='left'>
                  Sign Up
                </Header>
                <Form.Input
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Name'
                  onBlur={(event) => this.setState({name: event.target.value.trim(), errorMessage: ''})}
                />
                { this.state.name && !this.checkNamePattern() && this.renderErrorMessage('Invalid name')}

                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  onBlur={(event) => this.setState({email: event.target.value.trim(), errorMessage: ''})}
                />
                { this.state.email && !this.checkEmailPattern() && this.renderErrorMessage('Invalid email format')}

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onBlur={(event) => this.setState({password: event.target.value.trim(), errorMessage: ''})}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password Confirm'
                  type='password'
                  onBlur={(event) => this.setState({passwordMatch: event.target.value.trim(), errorMessage: ''})}
                />
                { this.state.password && this.state.passwordMatch && !this.checkPasswordMatch() && this.renderErrorMessage('Password does not match')}
                <Button color='blue' fluid size='large' onClick={this.handleSubmit}>Sign Up</Button>
              </Segment>
            </Form>
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
        onValidate={this.handleSubmitVerification}
        onResendCode={this.resendVerificationCode}
      />
    )
  }

  renderRedirect () {
    if (this.state.countDown > 0) {
      return (
        <Grid
          textAlign='center'
          style={{ marginTop: 120 }}
          verticalAlign='middle'
        >
          <Message success style={{textAlign: 'left'}}>
            <p> Your registration has been successful. </p>
            <p> You may now login using the email and password you entered into your registration form. </p>
            <p> Redirecting to login page in {this.state.countDown} seconds. </p>
          </Message>
        </Grid>
      )
    } else {
      clearInterval(this.seconds)
      return <Redirect to='/login' />
    }
  }

  render () {
    return (
      <div>
        { this.state.stage === STAGE_INFO && this.renderInfo() }
        { this.state.stage === STAGE_VERIFICATION && this.renderVerification() }
        { this.state.stage === STAGE_REDIRECT && this.renderRedirect()}
      </div>
    )
  }
}
