import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import axios from 'axios';

import Container from './container.js'
import Home from './views/Home'
import Dashboard from './views/Dashboard'
import QuickBuy from './views/Dashboard/QuickBuy'
// import Trade from './views/Dashboard/Trade'
// import Account from './views/Dashboard/Account'
import Account from './views/Account'
import Deposit from './views/Deposit/Deposit'
import Withdraw from './views/Withdraw/Withdraw'
import Login from './views/Auth/Login'
import SignUp from './views/Auth/Signup'
import Verification from './views/Auth/Verification'
import Trade from './views/NewTrade/Trade'
import UserVerification from './views/UserVerification'
import CustomerSupport from './views/UserVerification/CustomerSupport'
import store from './store'
import { setToken } from './actions/authAction'

// Initialize token
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'http://35.158.6.83/api/v0';

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
    <Route path="/" component={Container}>
      <IndexRoute component={Home} />
      <Route path="dashboard" name="Dashboard" component={Dashboard} onEnter={requireAuth}>
        <IndexRoute component={QuickBuy}/>
        <Route path="quickbuy" name="QuickBuy" component={QuickBuy}/>
        <Route path="account" name="Account" component={Account}/>
        <Route path="deposit" name="Deposit" component={Deposit}/>
        <Route path="withdraw" name="Withdraw" component={Withdraw}/>
        <Route path="newtrade" name="Trade" component={Trade} />
        <Route path="verification" name="UserVerification" component={UserVerification} />
        <Route path="support" name="support" component={CustomerSupport} />
      </Route>
      <Route path="login" name="Login" component={Login} onEnter={loggedIn}/>
      <Route path="signup" name="signup" component={SignUp} onEnter={loggedIn} />
      <Route path="verify" name="Verify" component={Verification} />
      <Route path="verify/:code" name="verifyCode" component={Verification}></Route>
      
    </Route>
  </Router>
)