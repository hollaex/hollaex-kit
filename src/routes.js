import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Home from './views/Home/Home'
import Trade from './views/Trade/Trade'


export default (
	<Router history={browserHistory}>
		<Route path="/" name="Home" component={Home}>
			<IndexRoute component={Home}/>
			<Route path="home" name="Home" component={Home}/>
		</Route>
		<Route path="/trade" name="Trade" component={Trade}/>
	</Router>
)
