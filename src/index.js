import React from 'react'
import {Provider} from 'react-redux'
import { render } from 'react-snapshot'
import { Router, browserHistory } from 'react-router'
import store from './store'
import routes from './routes'
// import registerServiceWorker from './registerServiceWorker'

import './index.css';

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>, document.getElementById('root')
);
// registerServiceWorker();
