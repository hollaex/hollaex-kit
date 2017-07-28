import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import axios from 'axios';

import Trade from './views/Trade/Trade'
import Login from './views/Login/Login'
import SignUp from './views/SignUp/SignUp'
import Verification from './views/SignUp/Verification'
import Dashboard from './views/Dashboard/Dashboard'
import store from './store'
import { setToken } from './actions/authAction'

// Initialize token
axios.defaults.headers.post['Content-Type'] = 'application/json';
let token = localStorage.getItem('token')
if(token) {
  store.dispatch(setToken(token))
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function isLoggedIn() {
  let token = localStorage.getItem('token')
  if(token) {
    return true
  }
  else {
    return false
  }
}

function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    replace({
      pathname: '/login'
    })
  }
}

function loggedIn(nextState, replace) {
  if (isLoggedIn()) {
    replace({
      pathname: '/dashboard'
    })
  }
}

export default (
	<Router history={browserHistory}>
		<Route path="/" name="Home" component={SignUp} />
    <Route path="/signup" name="signup" component={SignUp} />
    <Route path="/verify" name="Verify" component={Verification} />
    <Route path="/verify/:code" name="verifyCode" component={Verification}></Route>
    <Route path="/login" name="Login" component={Login} onEnter={loggedIn}/>
    <Route path="/trade" name="Trade" component={Trade} onEnter={requireAuth}/>
    <Route path="/dashboard" name="Dashboard" component={Dashboard} onEnter={requireAuth}/>
	</Router>
)