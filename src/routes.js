import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import {
  App as Container,
  Dashboard,
  Account,
  Wallet,
  Login,
  Home,
  Deposit,
  Withdraw,
  TransactionsHistory,
  Trade,
} from './containers';

import QuickBuy from './views/Exchange/QuickBuy'
import SignUp from './views/Auth/Signup'
import Verification from './views/Auth/Verification'
import ResetPassword from './views/Auth/ResetPassword'
import ResetPasswordRequest from './views/Auth/ResetPasswordRequest'
import Exchange from './views/Exchange'
import Bitcoin from './views/Exchange/Bitcoin'
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
      <Route path="trade-old" name="Exchange" component={Exchange}>
        <IndexRoute component={Bitcoin}/>
        <Route path="btc" name="Bitcoin" component={Bitcoin} />
        <Route path="quickbuy" name="QuickBuy" component={QuickBuy}/>
      </Route>
    </Route>
    <Route path="login" name="Login" component={Login} {...noAuthRoutesCommonProps} />
    <Route path="signup" name="signup" component={SignUp} {...noAuthRoutesCommonProps} />
    <Route path="reset-password" name="Reset Password Request" component={ResetPasswordRequest} {...noLoggedUserCommonProps} />
    <Route path="reset-password/:code" name="Reset Password" component={ResetPassword} {...noLoggedUserCommonProps} />
    <Route path="verify" name="Verify" component={Verification} {...noLoggedUserCommonProps} />
    <Route path="verify/:code" name="verifyCode" component={Verification} {...noLoggedUserCommonProps} />
    <Route path="*" component={NotFound} />
  </Router>
)
