import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Trade from './views/Trade/Trade'

function isLoggedIn() {
  let token = localStorage.getItem('token')
  console.log('token', token)
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
      pathname: '/trade'
    })
  }
}



export default (
	<Router history={browserHistory}>
		<Route path="/" name="Home" component={Trade} onEnter={requireAuth}/>
		<Route path="/trade" name="Trade" component={Trade} onEnter={requireAuth}/>
	</Router>
)
