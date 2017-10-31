import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
// import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import './config/initialize';

import 'flag-icon-css/css/flag-icon.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import store from './store';
import routes from './routes';
import './index.css';

// import registerServiceWorker from './registerServiceWorker'
import { version, name } from '../package.json';
console.log({
	name,
	version,
});

render(
	<Provider store={store}>
		<Router routes={routes} history={browserHistory} />
	</Provider>, document.getElementById('root')
);

// registerServiceWorker();
