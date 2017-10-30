/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Home from './Home'
import Login from './auth/Login'
import Register from './auth/Register'
import Forget from './auth/Forget'
import { getUserSession } from './auth/auth'
import 'semantic-ui-css/semantic.css'

const PublicRoute = ({ component: Component, userSession, ...rest }) => (
  <Route {...rest} render={props => !userSession
        ? (<Component {...props} />) : (<Redirect to='/main' />)
    } />
)

const PrivateRoute = ({ component: Component, userSession, ...rest }) => (
  <Route {...rest} render={props => !userSession
        ? (<Redirect to='/login' />) : (<Component {...props} />)
    } />
)

export default class AppRoute extends Component {
  render () {
    const userSession = getUserSession()
    console.log('userSession:')
    console.log(userSession)
    return (
      <BrowserRouter>
        <Switch>
          <PublicRoute userSession={userSession} path='/' exact component={Login} />
          <PublicRoute userSession={userSession} path='/login' exact component={Login} />
          <PublicRoute userSession={userSession} path='/register' exact component={Register} />
          <PublicRoute userSession={userSession} path='/forget' exact component={Forget} />
          <PrivateRoute userSession={userSession} path='/main' component={Home} />
          <Route render={() => (<Redirect to='/login' />)} />
        </Switch>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<AppRoute />, document.getElementById('root'))
