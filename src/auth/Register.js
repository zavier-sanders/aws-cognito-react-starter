import React, { Component } from 'react'
import { Button, Input, Form, Label } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { handleResendVerificationCode, handleSubmitVerificationCode, handleSignUp, checkSignUpError } from './auth'

const STAGE_START = 'STAGE_START'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_SUCCESS = 'STAGE_SUCCESS'

export default class Register extends Component {
  state = {
    name: '',
    password: '',
    passwordMatch: '',
    email: '',
    code: '',
    invalidCodeMessage: '',
    invalidFormDataMessage: '',

    stage: STAGE_START,
    enableResend: false
  };

  signUpCallback = function (err, data) {
    if (err) {
      const displayError = checkSignUpError(err)
      this.setState({
        invalidFormDataMessage: displayError
      })
      return
    }
    this.setState({
      stage: STAGE_VERIFICATION,
      enableResend: false
    })
    this.countDownResendVerificationCode()
  }.bind(this);

  verificationCallback = function (err, data) {
    if (err) {
      this.setState({
        invalidCodeMessage: 'Invalid Verification Code'
      })
      return
    }
    this.setState({
      stage: STAGE_SUCCESS
    })
  }.bind(this);

  resendCodeCallback = function (err, result) {
    if (err) {
      return
    }
    this.setState({
      enableResend: false
    })
  }.bind(this);

  handleSubmit = () => {
    const validEmailPattern = this.checkEmailPattern()
    const validPasswordMatch = this.checkPasswordMatch()
    const validUsernameMatch = this.checkUsernameMatch()

    const checkRegistrationForm = validEmailPattern && validPasswordMatch && validUsernameMatch

    checkRegistrationForm && handleSignUp(
      this.state.email,
      this.state.password,
      this.state.name,
      this.signUpCallback
    )
  }

  handleSubmitVerification = () => {
    handleSubmitVerificationCode(this.state.email, this.state.code, this.verificationCallback)
  }

  resendVerificationCode = () => {
    handleResendVerificationCode(this.state.email, this.resendCodeCallback)
  }

  checkUsernameMatch = () => {
    return this.state.name && this.state.name.length > 2
  }

  checkPasswordMatch = () => {
    return this.state.password === this.state.passwordMatch
  }

  checkEmailPattern = () => {
    return /\S+@\S+\.\S+/.test(this.state.email)
  }

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

  render () {
    const { name,
            email,
            password,
            passwordMatch,
            stage,
            enableResend,
            invalidCodeMessage,
            invalidFormDataMessage } = this.state

    return (
      <div>
        { stage === STAGE_START && (
          <div>
            <div>
              <form>
                <Form.Field>
                  <Input type='text' icon='user plus' iconPosition='left' placeholder='name' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({name: event.target.value.trim(), invalidFormDataMessage: ''})} />
                  { name && !this.checkUsernameMatch() && <Label basic color='red' pointing='left'>Invalid name, must conatin atleast 1 character</Label> }
                </Form.Field>
                <Form.Field>
                  <Input type='password' icon='hashtag' iconPosition='left' placeholder='Password' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({password: event.target.value.trim(), invalidFormDataMessage: ''})} />
                </Form.Field>
                <Form.Field>
                  <Input type='password' icon='hashtag' iconPosition='left' placeholder='Re-enter Password' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({passwordMatch: event.target.value.trim(), invalidFormDataMessage: ''})} />
                  { password && passwordMatch && !this.checkPasswordMatch() && <Label basic color='red' pointing='left'>Password does not match</Label> }
                </Form.Field>
                <Form.Field>
                  <Input type='email' icon='envelope' iconPosition='left' placeholder='Email' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({email: event.target.value, invalidFormDataMessage: ''})} />
                  { email && !this.checkEmailPattern() && <Label basic color='red' pointing='left'>Invalid email format</Label> }
                </Form.Field>
              </form>
            </div>
            <div><Button primary fluid onClick={this.handleSubmit}>Register</Button>
              { invalidFormDataMessage && <Label basic color='red' pointing='left'>{ invalidFormDataMessage }</Label> }
            </div>
          </div>
        )}
        { stage === STAGE_VERIFICATION && (
          <div>
            <div>
              <Input type='text' icon='unlock alternate' iconPosition='left' placeholder='Verification Code' style={{marginRight: 4 + 'em'}}
                onChange={(event) => this.setState({code: event.target.value, invalidCodeMessage: ''})} />
              { invalidCodeMessage && <Label basic color='red' pointing='left'>Invalid verfication code</Label> }
            </div>
            <div>
              <Button primary fluid onClick={this.handleSubmitVerification}>Confirm</Button>
              { !enableResend && <Button fluid loading onClick={this.countDownResendVerificationCode()}>Waiting to resend</Button> }
              { enableResend && <Button fluid color='purple' onClick={this.resendVerificationCode}>Resend it!</Button> }
            </div>
          </div>
        )}
        { stage === STAGE_SUCCESS && (<Redirect to='/login' />)}
      </div>
    )
  }
}
