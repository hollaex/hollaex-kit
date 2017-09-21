import React from 'react';
import { Router, Route, browserHistory, IndexRoute, Redirect } from 'react-router';
import axios from 'axios';

import {
  App as Container,
  Dashboard,
  Account,
  Wallet,
} from './containers';

import Home from './views/Home'
// import Dashboard from './views/Dashboard'
import QuickBuy from './views/Exchange/QuickBuy'
// import Trade from './views/Dashboard/Trade'
// import Account from './views/Dashboard/Account'
// import Account from './views/Account'
import Deposit from './views/Deposit/Deposit'
import Withdraw from './views/Withdraw/Withdraw'
import Login from './views/Auth/Login'
import SignUp from './views/Auth/Signup'
import Verification from './views/Auth/Verification'
import ResetPassword from './views/Auth/ResetPassword'
import ResetPasswordRequest from './views/Auth/ResetPasswordRequest'
import Exchange from './views/Exchange'
import Bitcoin from './views/Exchange/Bitcoin'
import UserVerification from './views/UserVerification'
import CustomerSupport from './views/UserVerification/CustomerSupport'
import store from './store'
import { setToken, verifyToken } from './actions/authAction'
import { API_URL } from './config/constants'

// Initialize token
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = API_URL;


let token = localStorage.getItem('token')
if (token) {
  store.dispatch(verifyToken(token));
}

function isLoggedIn() {
  let token = localStorage.getItem('token')
  return !!token;
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
    <Route path="/" component={Container} onEnter={requireAuth}>
      <IndexRoute component={Dashboard} />
      <Route path="account" name="Account" component={Account}/>
      <Route path="wallet" name="Wallet" component={Wallet}/>
      <Route path="trade" name="Exchange" component={Exchange}>
        <IndexRoute component={Bitcoin}/>
        <Route path="btc" name="Bitcoin" component={Bitcoin} />
        <Route path="quickbuy" name="QuickBuy" component={QuickBuy}/>
      </Route>
    </Route>
    <Route path="login" name="Login" component={Login} onEnter={loggedIn}/>
    <Route path="signup" name="signup" component={SignUp} onEnter={loggedIn} />
    <Route path="reset-password" name="Reset Password Request" component={ResetPasswordRequest} onEnter={loggedIn}/>
    <Route path="reset-password/:code" name="Reset Password" component={ResetPassword} onEnter={loggedIn}/>
    <Route path="verify" name="Verify" component={Verification} onEnter={loggedIn} />
    <Route path="verify/:code" name="verifyCode" component={Verification}></Route>
  </Router>
)
