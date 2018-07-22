import React, { Component } from 'react'
import { Segment, Button, Form, Grid, Header, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { MSG_PASSWORD_PATTERN, checkEmailPattern, checkPasswordPattern, checkNamePattern, loginCallbackFactory, handleSignIn,
         handleResendVerificationCode, handleSubmitVerificationCode, handleSignUp, checkSignUpError } from './auth'
import { saveRobinhoodUser } from '../db/Robinhood'
import Verification from './Verification'
import Robinhood from './Robinhood'

const STAGE_INFO = 'STAGE_INFO'
const STAGE_VERIFICATION = 'STAGE_VERIFICATION'
const STAGE_ROBINHOOD = 'STAGE_ROBINHOOD'
const STAGE_REDIRECT = 'STAGE_REDIRECT'

const COUNT_DOWN_RESEND = 30
const COUNT_DOWN_REDIRECT = 5

const VERIFICATION_BY_CODE = false

export default class Register extends Component {
  constructor() {
    super();
    
    this.username;
    this.password;

    this.robinhoodCallback = this.robinhoodCallback.bind(this);
    this.handleSubmitRobinhood = this.handleSubmitRobinhood.bind(this);
    this.saveRobinhoodUser = saveRobinhoodUser.bind(this);
  }
  
  state = {
    name: '',
    password: '',
    passwordMatch: '',
    email: '',
    code: '',
    invalidCodeMessage: '',
    errorMessage: '',

    stage: STAGE_INFO,
    countDown: 0,
    robinhoodEmail: '',
    robinhoodPassword: ''
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

  /// //////////////////// callback for auth lib /////////////////////
  // Callback structure here is not consistent with Login and Forget component,
  // due to the inconsistent design of aws-cognitio api: "onSuccess" vs "error"
  signUpCallback = (error, data) => {
    if (error) {
      this.setState({
        errorMessage: checkSignUpError(error)
      })
    } else {
      if (VERIFICATION_BY_CODE) {
        this.setState({
          errorMessage: '',
          stage: STAGE_VERIFICATION,
          countDown: COUNT_DOWN_RESEND
        })
      } else { // verification by link
        this.setState({
          errorMessage: '',
          stage: STAGE_ROBINHOOD,
          countDown: COUNT_DOWN_REDIRECT
        })
      }
    }
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

  verificationCallback = (error, data) => {
    if (error) {
      this.setState({
        errorMessage: 'Invalid verification code.'
      })
    } else {
      this.setState({
        errorMessage: '',
        stage: STAGE_ROBINHOOD,
        countDown: COUNT_DOWN_REDIRECT
      })
    }
  }
  
  robinhoodCallback = (error, data) => {
    if (error) {
      this.setState({
        errorMessage: 'Invalid email and password combination.'
      })
    } else {
      // console.log(this.username, this.password, this.state.email, this.state.password);
      handleSignIn(this.username, this.password, this.callbacks)
      // this.setState({
      //   errorMessage: '',
      //   stage: STAGE_REDIRECT,
      //   countDown: COUNT_DOWN_REDIRECT
      // })
    }
  }

  resendCodeCallback = (error, result) => {
    if (error) {
      this.setState({
        errorMessage: 'Resend code fail. Please retry.'
      })
    } else {
      this.setState({
        errorMessage: '',
        countDown: COUNT_DOWN_RESEND
      })
    }
  }

  /// //////////////////////// button ////////////////////////
  handleSubmit = () => {
    const { name, email, password, passwordMatch } = this.state
    if (!name || !email || !password || !passwordMatch) {
      this.setState({
        errorMessage: 'Please fill all fields in the form below.'
      })
    } else if (!checkNamePattern(name) || !checkEmailPattern(email) || !checkPasswordPattern(password) || !this.checkPasswordMatch()) {
      this.setState({
        errorMessage: 'Invalid input.'
      })
    } else {
      this.username = this.state.email;
      this.password = this.state.password;

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

  handleSubmitRobinhood = () => {
    if (!this.state.robinhoodEmail || !this.state.robinhoodPassword) {
      this.setState({
        errorMessage: 'Please enter a email and password.'
      })
    } else {
      // Log into Robinhood
      fetch(`https://api.robinhood.com/api-token-auth/`, {
          method: 'POST',
          mode: "no-cors", // no-cors, cors, *same-origin
          headers: new Headers ({
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8; application/json",
            "X-Robinhood-API-Version": "1.152 .0",
            "Connection": "keep-alive",
            "User-Agent": "Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)"
          }),
          body: `password=${this.state.robinhoodPassword}&username=${this.state.robinhoodEmail}`
        }).then(function(response) {
          console.log(response);
          return;
        }).catch(error => { 
          this.setState({
            errorMessage: 'Invalid email and password combination.'
          })
          console.error('Error:', error)
        });

      saveRobinhoodUser(this.state.email, this.state.robinhoodEmail, this.state.robinhoodPassword, this.robinhoodCallback)
    }
  }

  handleResendVerification = () => {
    this.setState({
      countDown: COUNT_DOWN_RESEND
    })
    handleResendVerificationCode(this.state.email, this.resendCodeCallback)
  }

  /// ///////////////////// render /////////////////////////

  checkPasswordMatch = () => {
    return this.state.password === this.state.passwordMatch
  }

  renderErrorMessage = (message) => {
    return (
      <Message negative style={{textAlign: 'left'}}>
        Error: { message }
      </Message>
    )
  }

  renderInfo = () => {
    const { errorMessage, name, email, password, passwordMatch } = this.state
    return (
      <div>
        <Grid
          textAlign='center'
          style={{ marginTop: 120 }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ width: 450 }} verticalAlign='middle'>
            { errorMessage && this.renderErrorMessage(errorMessage) }
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
                  onChange={(event) => this.setState({name: event.target.value.trim(), errorMessage: ''})}
                />
                { name && !checkNamePattern(name) && this.renderErrorMessage('Invalid name')}

                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  onChange={(event) => this.setState({email: event.target.value.trim(), errorMessage: ''})}
                />
                { email && !checkEmailPattern(email) && this.renderErrorMessage('Invalid email format')}

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  onChange={(event) => this.setState({password: event.target.value.trim(), errorMessage: ''})}
                />
                { password && !checkPasswordPattern(password) && this.renderErrorMessage(MSG_PASSWORD_PATTERN)}

                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password Confirm'
                  type='password'
                  onChange={(event) => this.setState({passwordMatch: event.target.value.trim(), errorMessage: ''})}
                />
                { password && passwordMatch && !this.checkPasswordMatch() && this.renderErrorMessage('Password does not match')}
                <Button color='blue' fluid size='large' onClick={this.handleSubmit}>Sign Up</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }

  renderVerification = () => {
    return (
      <Verification
        errorMessage={this.state.errorMessage}
        countDown={this.state.countDown}
        onChange={(event) => this.setState({code: event.target.value.trim(), errorMessage: ''})}
        onValidate={this.handleSubmitVerification}
        onResendCode={this.handleResendVerification}
      />
    )
  }
  
  renderRobinhood = () => {
    return (
      <Robinhood
        errorMessage={this.state.errorMessage}
        countDown={this.state.countDown}
        setEmail={(event) => { 
          this.setState({
            robinhoodEmail: event.target.value.trim(), 
          })
        }}
        setPassword={(event) => { 
          this.setState({
            robinhoodPassword: event.target.value.trim(), 
            errorMessage: ''
          })
        }}
        onValidate={this.handleSubmitRobinhood}
        onResendCode={this.handleResendVerification}
      />
    )
  }

  renderRedirect = () => {
    if (this.state.countDown > 0) {
      return (
        <Grid
          textAlign='center'
          style={{ marginTop: 120 }}
          verticalAlign='middle'
        >
          <Message success style={{textAlign: 'left'}}>
            { VERIFICATION_BY_CODE && <p> Your registration has been successful. </p> }
            { !VERIFICATION_BY_CODE && <p> Please check your email and click the link to verify your email. </p> }
            <p> Redirecting to login page in {this.state.countDown} seconds. </p>
          </Message>
        </Grid>
      )
    } else {
      clearInterval(this.seconds)
      return <Redirect to='/' />
    }
  }

  render = () => {
    return (
      <div>
        { this.state.stage === STAGE_INFO && this.renderInfo() }
        { this.state.stage === STAGE_VERIFICATION && this.renderVerification() }
        { this.state.stage === STAGE_ROBINHOOD && this.renderRobinhood() }
        { this.state.stage === STAGE_REDIRECT && this.renderRedirect()}
      </div>
    )
  }
}
