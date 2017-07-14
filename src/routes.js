import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Trade from './views/Trade/Trade'


export default (
	<Router history={browserHistory}>
		<Route path="/" name="Home" component={Trade}/>
		<Route path="/trade" name="Trade" component={Trade}/>
	</Router>
)
