import 'babel-polyfill';
import React from 'react';
import { hash } from 'rsvp';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
// import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import './config/initialize';

import 'flag-icon-css/css/flag-icon.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-alice-carousel/lib/alice-carousel.css';

import store from './store';
import routes from './routes';
import './index.css';
import '../node_modules/rc-tooltip/assets/bootstrap_white.css'; // eslint-disable-line

import {
  setLocalVersions,
  getLocalVersions,
  getRemoteVersion,
  initializeStrings,
  setValidLanguages,
} from 'utils/initialize';

import { getConfig, getValidLanguages } from 'actions/operatorActions';

import { version, name } from '../package.json';
import { API_URL } from './config/constants';
console.log(name, version);
console.log(API_URL);

const generateRequest = async (key) => {
	return await getConfig(key);
}

const getConfigs = async () => {
  const localVersions = getLocalVersions();
  const remoteVersions = await getRemoteVersion();
  const validLanguages = await getValidLanguages();

  const promises = {};
  Object.entries(remoteVersions).forEach(([key]) => {
    const localVersion = localVersions[key];
    const remoteVersion = remoteVersions[key];

    if (localVersion !== remoteVersion) {
      promises[key] = generateRequest(key)
    }
  })

  const remoteConfigs = await hash(promises);
  Object.entries(remoteConfigs).forEach(([key]) => {
    localStorage.setItem(key, JSON.stringify(remoteConfigs[key]));
  })

  setLocalVersions(remoteVersions);
  setValidLanguages(validLanguages);
  return remoteConfigs;
}

const bootstrapApp = () => {
  initializeStrings()

  render(
		<Provider store={store}>
			<Router routes={routes} history={browserHistory} />
		</Provider>,
    document.getElementById('root')
  );
}

getConfigs()
	.then(bootstrapApp)
	.catch((err) => console.error(err))

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
