import React, { Component } from 'react'
import AppRoute from '../App'
import { Segment, Button, Divider, Input, Form, Label } from 'semantic-ui-react'
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

  render () {
    const { logInError, enableResend, stage } = this.state
    return (
      <div>
        { stage === STAGE_START && (
          <div>
            <div>
              <div>
                <Form.Field>
                  <Input type='text' icon='user' iconPosition='left' placeholder='Username' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({username: event.target.value, logInError: ''})} />
                </Form.Field>
                <Form.Field>
                  <Input type='password' icon='hashtag' iconPosition='left' placeholder='Password' style={{marginRight: 4 + 'em'}}
                    onChange={(event) => this.setState({password: event.target.value, logInError: ''})} />
                </Form.Field>
                { logInError && (<Label basic color='red' pointing='left'>{ logInError }</Label>) }
                <Link to='/forget'>Forgot Password?</Link>
              </div>
            </div>
            <div>
              <Segment padded>
                <Button primary fluid onClick={this.signIn}>Login</Button>
                <Divider horizontal>Or</Divider>
                <Link to='/register'><Button secondary fluid>Sign Up Now</Button></Link>
              </Segment>
            </div>
          </div>
        )}
        { stage === STAGE_VERIFICATION && (
          <div>
            <div>
              <Form.Field>
                <Input type='text' icon='hashtag' iconPosition='left' placeholder='Verification code' style={{marginRight: 4 + 'em'}}
                  onChange={(event) => this.setState({code: event.target.value, logInError: ''})} />
                { logInError && <Label basic color='red' pointing='left'>{ logInError }</Label> }
              </Form.Field>
            </div>
            <div>
              <Button primary fluid onClick={this.requestVerificationCode}>Validate</Button>
              { enableResend && (<Button fluid color='purple' onClick={this.signIn}>Resend it!</Button>)}
              { !enableResend && (<Button fluid loading disabled>Waiting to resend</Button>) }
            </div>
          </div>
        )}
        { stage === STAGE_SUCCESS && (<AppRoute />)}
      </div>
    )
  }
}
