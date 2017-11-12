import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import {
  App as Container,
  Dashboard,
  Account,
  Wallet,
  Login,
  Signup,
  VerificationEmailRequest,
  VerificationEmailCode,
  Home,
  Deposit,
  Withdraw,
  TransactionsHistory,
  Trade,
  Legal,
  AuthContainer,
  RequestResetPassword,
  ResetPassword,
} from './containers';

import store from './store'
import { verifyToken } from './actions/authAction'

import { getToken, removeToken } from './utils/token';

let token = getToken();
if (token) {
  store.dispatch(verifyToken(token));
}

function isLoggedIn() {
  let token = getToken();
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
      pathname: '/account'
    })
  }
}

const logOutUser = () => {
  if (getToken()) {
    removeToken();
  }
}

const NotFound = ({ router }) => {
  router.replace('/');
  return <div></div>;
}

const noAuthRoutesCommonProps = {
  onEnter: loggedIn,
};

const noLoggedUserCommonProps = {
  onEnter: logOutUser,
}

export default (
  <Router history={browserHistory}>
    <Route path="/" name="Home" component={Home} />
    <Route component={Container} onEnter={requireAuth}>
      <IndexRoute component={Dashboard} />
      <Route path="account" name="Account" component={Account}/>
      <Route path="wallet" name="Wallet" component={Wallet}/>
      <Route path="withdraw" name="Withdraw" component={Withdraw}/>
      <Route path="deposit" name="Deposit" component={Deposit}/>
      <Route path="transactions" name="Transactions" component={TransactionsHistory}/>
      <Route path="trade" name="Trade" component={Trade}/>
    </Route>
    <Route component={AuthContainer}>
      <Route path="login" name="Login" component={Login} {...noAuthRoutesCommonProps} />
      <Route path="signup" name="signup" component={Signup} {...noAuthRoutesCommonProps} />
      <Route path="reset-password" name="Reset Password Request" component={RequestResetPassword} {...noLoggedUserCommonProps} />
      <Route path="reset-password/:code" name="Reset Password" component={ResetPassword} {...noLoggedUserCommonProps} />
      <Route path="verify" name="Verify" component={VerificationEmailRequest} {...noLoggedUserCommonProps} />
      <Route path="verify/:code" name="verifyCode" component={VerificationEmailCode} {...noLoggedUserCommonProps} />
    </Route>
    <Route path="privacy-policy" component={Legal} content="legal" />
    <Route path="general-terms" component={Legal} content="terms" />
    <Route path="*" component={NotFound} />
  </Router>
)
