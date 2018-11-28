/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import PrivateHome from './Private'
import PublicHome from './Public'
import Header from './Header'
import Login from './auth/Login'
import Register from './auth/Register'
import Forget from './auth/Forget'
import { checkUserAuthenticated } from './auth/auth'
import LeadsPage from './pages/leadsPage';
import AccountPage from './pages/accountPage';
import 'semantic-ui-css/semantic.css'

const PublicRoute = ({ component: Component, isAuthed, ...rest }) => (
  <Route
    {...rest}
    render={props => isAuthed ? (<Redirect to='/private' />) : (<Component {...props} />)}
  />
)

const PrivateRoute = ({ component: Component, isAuthed, ...rest }) => (
  <Route
    {...rest}
    render={props => isAuthed ? (<Component {...props} />) : (<Redirect to='/login' />)}
  />
)

export default class AppRoute extends Component {
  render () {
    const isAuthed = checkUserAuthenticated()
    console.log(`User authenticated: ${isAuthed}`)

    return (
      <div>
        <Header />
        <Switch>
          <PublicRoute isAuthed={isAuthed} path='/' exact component={PublicHome} />
          <PublicRoute isAuthed={isAuthed} path='/login' exact component={Login} />
          <PublicRoute isAuthed={isAuthed} path='/register' exact component={Register} />
          <PublicRoute isAuthed={isAuthed} path='/forget' exact component={Forget} />
          <PublicRoute isAuthed={isAuthed} path='/public' exact component={PublicHome} />

          <PrivateRoute isAuthed={isAuthed} path='/private' exact component={PrivateHome} />
          <PrivateRoute isAuthed={isAuthed} path='/leads' exact component={LeadsPage} />
          <PrivateRoute isAuthed={isAuthed} path='/account' exact component={AccountPage} />

          <Redirect to='/public' />)
        </Switch>
      </div>
    )
  }
}
