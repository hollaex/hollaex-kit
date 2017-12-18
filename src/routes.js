import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import {
  App as Container,
  Account,
  Wallet,
  Login,
  Signup,
  VerificationEmailRequest,
  VerificationEmailCode,
  Home,
  Deposit,
  DepositVerification,
  Withdraw,
  TransactionsHistory,
  Trade,
  Legal,
  AuthContainer,
  RequestResetPassword,
  ResetPassword,
  QuickTrade,
} from './containers';

import store from './store'
import { verifyToken } from './actions/authAction';
import { setLanguage } from './actions/appActions';

import { getToken, removeToken, getTokenTimestamp } from './utils/token';
import { getLanguage, getInterfaceLanguage } from './utils/string';
import { checkUserSessionExpired } from './utils/utils';

let lang = getLanguage();
if (!lang) {
  lang = getInterfaceLanguage();
}
store.dispatch(setLanguage(lang));


let token = getToken();

if (token) {
  // check if the token has expired, in that case, remove token
  if (checkUserSessionExpired(getTokenTimestamp())) {
    removeToken();
  } else {
    store.dispatch(verifyToken(token));
  }
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
      <Route path="account" name="Account" component={Account}/>
      <Route path="wallet" name="Wallet" component={Wallet}/>
      <Route path="withdraw" name="Withdraw" component={Withdraw}/>
      <Route path="deposit" name="Deposit" component={Deposit}/>
      <Route path="deposit/verification" name="Deposit Verification" component={DepositVerification} />
      <Route path="transactions" name="Transactions" component={TransactionsHistory}/>
      <Route path="trade" name="Trade" component={Trade}/>
      <Route path="quick-trade" name="Quick Trade" component={QuickTrade}/>
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
