import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Input, Form, Label } from 'semantic-ui-react'
import {forgotPasswordFactoryCallback, handleForgotPassword, handleForgotPasswordReset} from './auth'

const STAGE_USER_INFO = 'STAGE_USER_INFO'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_NEW_PASSWORD = 'STAGE_NEW_PASSWORD'
const STAGE_SUCCESS = 'STAGE_SUCCESS'

export default class Forget extends Component {
  state = {
    stage: STAGE_USER_INFO,
    username: '',
    password: '',
    passwordMatch: '',
    code: '',
    enableResend: false,
    formDataErrorMessage: ''  // could be from server or client
  }

  forgotPasswordCallBack = forgotPasswordFactoryCallback({
    onSuccess: () => {
      this.setState({
        stage: STAGE_SUCCESS
      })
    },
    onFailure: (err) => {
      this.setState({
        formDataErrorMessage: err.invalidCodeOrPasswordMessage
      })
    },
    inputVerificationCode: (data) => {
      this.setState({
        stage: STAGE_VERIFICATION,
        enableResend: false
      })
      this.countDownResendVerificationCode()
    }
  }, this);

  checkPasswordMatch = () => {
    return this.state.password === this.state.passwordMatch
  }

  requestVerificationCode = (e) => {
    const username = this.state.username
    if (!username) {
      this.setState(() => {
        return {
          formDataErrorMessage: 'Please input valid username'
        }
      })
    }
    handleForgotPassword(username, this.forgotPasswordCallBack)
  }

  requestInputPassword = (e) => {
    const code = this.state.code
    if (!code) {
      this.setState({
        formDataErrorMessage: 'Verification code can not be empty'
      })
      return
    }
    this.setState({
      stage: STAGE_NEW_PASSWORD,
      formDataErrorMessage: ''
    })
  }

  handlePasswordReset = (e) => {
    this.checkPasswordMatch() && handleForgotPasswordReset(
      this.state.username,
      this.state.code,
      this.state.password,
      this.forgotPasswordCallBack
    )
  }

  countDownResendVerificationCode = () => {
    let counter = 20
    let seconds = setInterval(() => {
      if (counter === 0) {
        clearInterval(seconds)
        this.setState(() => {
          return {
            enableResend: true
          }
        })
      }
      counter--
    }, 1000)
  }

  render () {
    const {
      password,
      passwordMatch,
      stage,
      formDataErrorMessage,
      enableResend
    } = this.state

    return (
      <div>
        <div>
          { stage === STAGE_USER_INFO && (
            <Form.Field>
              <Input type='text' icon='users' iconPosition='left' placeholder='Username' style={{marginRight: 4 + 'em'}}
                onChange={(event) => this.setState({username: event.target.value, formDataErrorMessage: ''})} />
            </Form.Field>
          )}
          { stage === STAGE_VERIFICATION && (
            <Form.Field>
              <Input type='text' icon='code' iconPosition='left' placeholder='Verification Code' style={{marginRight: 4 + 'em'}}
                onChange={(event) => this.setState({code: event.target.value, formDataErrorMessage: ''})} />
            </Form.Field>
          )}
          { stage === STAGE_NEW_PASSWORD && (
            <Form.Field>
              <Input type='password' icon='code' iconPosition='left' placeholder='Password' style={{marginRight: 4 + 'em'}}
                onChange={(event) => this.setState({password: event.target.value, formDataErrorMessage: ''})} />
              <Input type='password' icon='code' iconPosition='left' placeholder='Password' style={{marginRight: 4 + 'em'}}
                onChange={(event) => this.setState({passwordMatch: event.target.value, formDataErrorMessage: ''})} />
              { password && passwordMatch && !this.checkPasswordMatch() && <Label basic color='red' pointing='left'>Password does not match</Label> }
            </Form.Field>
          )}
        </div>

        <div>

          { stage === STAGE_USER_INFO && <Button primary fluid onClick={this.requestVerificationCode}>Send Verficiation Code</Button> }
          { stage === STAGE_VERIFICATION && <Button primary fluid onClick={this.requestInputPassword}>Reset password</Button> }
          { stage === STAGE_VERIFICATION && !enableResend && <Button fluid loading disabled>Waiting to resend</Button> }
          { stage === STAGE_VERIFICATION && enableResend && <Button fluid color='purple' onClick={this.requestVerificationCode}>Resend it!</Button> }

          { stage === STAGE_NEW_PASSWORD && <Button primary fluid onClick={this.handlePasswordReset}>Submit</Button> }

          { formDataErrorMessage && <Label basic color='red' pointing='left'>{ formDataErrorMessage }</Label> }
        </div>

        { stage === STAGE_SUCCESS && <Redirect to='/login' /> }
      </div>
    )
  }
}
