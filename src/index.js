import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import store from './store';
import routes from './routes';
// import registerServiceWorker from './registerServiceWorker'
import './index.css';
import { API_URL } from './config/constants';

import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = API_URL;


render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>, document.getElementById('root')
);
// registerServiceWorker();
