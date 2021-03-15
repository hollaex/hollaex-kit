import 'babel-polyfill';
import React from 'react';
import { hash } from 'rsvp';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import merge from 'lodash.merge';
// import { render } from 'react-snapshot';
import { Router, browserHistory } from 'react-router';
import ConfigProvider from 'components/ConfigProvider';
import EditProvider from 'components/EditProvider';
import defaultConfig from 'config/project.config';
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
	initializeStrings,
	setValidLanguages,
	setExchangeInitialized,
	setSetupCompleted,
	setBaseCurrency,
	setDefaultLogo,
} from 'utils/initialize';

import { getKitData } from 'actions/operatorActions';
import { requestConstant } from 'actions/appActions';

import { version, name } from '../package.json';
import { API_URL } from './config/constants';
console.info(name, version);
console.info(API_URL);

const drawFavIcon = (url) => {
	const head = document.getElementsByTagName('head')[0];
	const linkEl = document.createElement('link');

	linkEl.type = 'image/x-icon';
	linkEl.rel = 'icon';
	linkEl.href = url;

	// remove existing favicons
	const links = head.getElementsByTagName('link');

	for (let i = links.length; --i >= 0; ) {
		if (/\bicon\b/i.test(links[i].getAttribute('rel'))) {
			head.removeChild(links[i]);
		}
	}

	head.appendChild(linkEl);
};

const getConfigs = async () => {
	const localVersions = getLocalVersions();

	const kitData = await getKitData();
	const {
		meta: { versions: remoteVersions = {}, sections = {} } = {},
		valid_languages = '',
		info: { initialized },
		setup_completed,
		native_currency,
		logo_image,
	} = kitData;

	kitData['sections'] = sections;

	const promises = {};
	Object.keys(remoteVersions).forEach((key) => {
		const localVersion = localVersions[key];
		const remoteVersion = remoteVersions[key];

		if (localVersion !== remoteVersion) {
			promises[key] = kitData[key];
		} else {
			promises[key] = JSON.parse(localStorage.getItem(key) || '{}');
		}
	});

	const remoteConfigs = await hash(promises);
	Object.keys(remoteConfigs).forEach((key) => {
		if (key === 'color') {
			Object.entries(remoteConfigs[key]).forEach(([themeKey, themeObj]) => {
				if (typeof themeObj !== 'object') {
					delete remoteConfigs[key][themeKey];
				}
			});
		}
		localStorage.setItem(key, JSON.stringify(remoteConfigs[key]));
	});

	const { data: { coins: coin_icons = {} } = {} } = await requestConstant();

	setDefaultLogo(logo_image);
	setBaseCurrency(native_currency);
	setLocalVersions(remoteVersions);
	setValidLanguages(valid_languages);
	setExchangeInitialized(initialized);
	setSetupCompleted(setup_completed);

	return merge({}, defaultConfig, remoteConfigs, { coin_icons });
};

const bootstrapApp = (appConfig) => {
	const {
		icons: {
			dark: { EXCHANGE_FAV_ICON = '/favicon.ico' },
		},
	} = appConfig;
	drawFavIcon(EXCHANGE_FAV_ICON);
	initializeStrings();
	// window.appConfig = { ...appConfig }

	render(
		<Provider store={store}>
			<EditProvider>
				<ConfigProvider initialConfig={appConfig}>
					<Router routes={routes} history={browserHistory} />
				</ConfigProvider>
			</EditProvider>
		</Provider>,
		document.getElementById('root')
	);
};

getConfigs()
	.then(bootstrapApp)
	.catch((err) => console.error('Initialization failed!\n', err));

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
