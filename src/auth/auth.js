/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import AWS from 'aws-sdk'
import { CognitoUserPool, CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import config from './config'

const userPool = new CognitoUserPool({
  UserPoolId: config.aws_cognito_user_pools_id,
  ClientId: config.aws_cognito_user_pools_web_client_id
})
let cognitoUser = null

// ======================================================
//   Signin methods
// ======================================================
export function handleSignIn (username, password, callbacks) {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password
  })
  cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })

  cognitoUser.authenticateUser(authenticationDetails, callbacks)
}

export function loginCallbackFactory (callbacks, ctx) {
  return {
    onSuccess: (result) => {
      const loginCred = 'cognito-idp.' + config.aws_cognito_region + '.amazonaws.com/' + config.aws_cognito_user_pools_id

      let credJson = {}
      let Login = {}

      Login[loginCred] = result.getIdToken().getJwtToken()
      credJson['IdentityPoolId'] = config.aws_cognito_identity_pool_id
      credJson['Logins'] = Login

      AWS.config.region = config.aws_cognito_region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(credJson)

      AWS.config.credentials.get((error) => {
        if (error) {
          return
        }

        const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials
        const awsCredentials = {
          accessKeyId,
          secretAccessKey,
          sessionToken
        }
        sessionStorage.setItem('awsCredentials', JSON.stringify(awsCredentials))

        callbacks.onSuccess.call(ctx)
      })
    },

    onFailure: (error) => {
      const displayError = checkLoginError(error)
      callbacks.onFailure.call(ctx, displayError)
    },

    mfaRequired: (codeDeliveryDetails) => {
      AWS.config.region = config.aws_cognito_region
      callbacks.mfaRequired.call(ctx)
    }
  }
}

export function sendMFAVerificationCode (code, callbacks) {
  cognitoUser.sendMFACode(code, callbacks)
}

export function checkLoginError (error) {
  const err = error.toString()
  console.log(err)
  if (/InvalidParameterException: Missing required parameter USERNAME$/.test(err) ||
    (/UserNotFoundException?/.test(err)) ||
    (/NotAuthorizedException?/.test(err))) {
    return 'Invalid username or password.'
  } else if (/InvalidParameterException: Missing required parameter SMS_MFA_CODE$/.test(err)) {
    return 'Verficiation code cannot be empty.'
  } else if (/CodeMismatchException/.test(err)) {
    return 'Invalid verification code.'
  } else if (/UserNotConfirmedException/.test(err)) {
    return 'User is not confirmed.'
  } else {
    return 'Internal Server Error. Please retry.'
  }
}

// ======================================================
// Signup methods
// ======================================================
export function handleSignUp (email, password, username, signUpCallback) {
  const attributeList = []
  const dataEmail = {
    Name: 'email',
    Value: email
  }
  const attributeEmail = new CognitoUserAttribute(dataEmail)

  attributeList.push(attributeEmail)

  userPool.signUp(email, password, attributeList, null, signUpCallback)
}

export function checkSignUpError (error) {
  const err = error.toString()
  if (/UsernameExistsException?/.test(err)) {
    return 'User already exists'
  } else if (/InvalidPasswordException?/.test(err) ||
      /Value at 'password' failed to satisfy constraint?/.test(err)) {
    return 'Password must contain atleast 8 characters, one lowercase, uppercase, numeric character'
  } else {
    return 'Internal Server Error. Please retry.'
  }
}

export function handleSubmitVerificationCode (username, verificationCode, verificationCallback) {
  cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  cognitoUser.confirmRegistration(verificationCode, true, verificationCallback)
}

export function handleResendVerificationCode (username, resendCodeCallback) {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  cognitoUser.resendConfirmationCode(resendCodeCallback)
}

// ======================================================
// Forgot Password methods
// ======================================================
export function forgotPasswordFactoryCallback (forgotPasswordCallBack, ctx) {
  return {
    onSuccess: () => {
      forgotPasswordCallBack.onSuccess.call(ctx, {
        resetSuccess: true
      })
    },
    onFailure: (err) => {
      let invalidCodeOrPasswordMessage = checkResetPasswordError(err.toString())
      forgotPasswordCallBack.onFailure.call(ctx, invalidCodeOrPasswordMessage)
    },
    inputVerificationCode: (data) => {
      forgotPasswordCallBack.inputVerificationCode.call(ctx)
    }
  }
}

export function checkResetPasswordError (error) {
  if ((/UserNotFoundException?/.test(error)) ||
    (/InvalidParameterException: Cannot reset password for the user as there is no registered?/.test(error))) {
    return {invalidCodeOrPasswordMessage: 'Invalid username'}
  } else if (/LimitExceededException: Attempt limit exceeded, please try after some time?/.test(error)) {
    return {invalidCodeOrPasswordMessage: 'Attempt limit exceeded, please try again later'}
  } else if (/CodeMismatchException?/.test(error)) {
    return {invalidCodeOrPasswordMessage: 'Invalid Verfication Code'}
  } else if (/InvalidParameterException: Cannot reset password for the user as there is no registered verified email or phone_number?$/.test(error)) {
    return {invalidCodeOrPasswordMessage: 'Cannot reset password for the user as there is no registered verified email or phone_number'}
  } else if ((/InvalidParameterException?/.test(error)) || (/InvalidPasswordException?$/.test(error))) {
    return {invalidCodeOrPasswordMessage: 'Password must contain 8 or more characters with atleast one lowercase,uppercase, numerical and special character'}
  } else {
    return 'Internal Server Error. Please retry.'
  }
}

export function handleForgotPassword (username, forgotPasswordCallBack) {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  cognitoUser.forgotPassword(forgotPasswordCallBack)
}

export function handleForgotPasswordReset (username, verificationCode, newPassword, forgotPasswordCallBack) {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool
  })
  cognitoUser.confirmPassword(verificationCode, newPassword, forgotPasswordCallBack)
}

// ======================================================
// SignOut methods
// ======================================================
export function handleSignOut () {
  cognitoUser = userPool.getCurrentUser()

  if (cognitoUser) {
    cognitoUser.signOut()
  }
}

// ======================================================
// Check user session still valid
// ======================================================
export function getUserSession () {
  cognitoUser = userPool.getCurrentUser()

  if (cognitoUser != null) {
    return cognitoUser.getSession(function (_err, session) {
      if (session && session.isValid) {
        return session
      }
    })
  }
}

// current cognitor user, need to check undifined when used
export function getCurrentUser () {
  const session = getUserSession()
  if (session) {
    return cognitoUser
  }
}
