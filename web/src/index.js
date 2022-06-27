import 'core-js/stable';
import 'regenerator-runtime/runtime';
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
import { addElements, injectHTML } from 'utils/script';

import 'flag-icon-css/css/flag-icon.min.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'react-alice-carousel/lib/alice-carousel.css';

import store from './store';
import { generateRoutes } from './routes';
import './index.css';
import '../node_modules/rc-tooltip/assets/bootstrap_white.css'; // eslint-disable-line
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
	setLocalVersions,
	getLocalVersions,
	initializeStrings,
	setValidLanguages,
	setExchangeInitialized,
	setSetupCompleted,
	setBaseCurrency,
	setDefaultLogo,
	consoleKitInfo,
	getContracts,
	modifySections,
} from 'utils/initialize';

import { getKitData } from 'actions/operatorActions';
import { setPairsData } from 'actions/orderbookAction';
import {
	requestConstant,
	setHomePageSetting,
	setInjectedValues,
	setInjectedHTML,
	requestPlugins,
	setWebViews,
	setPlugins,
	setInfo,
	setConfig,
	changeTheme,
	setLanguage,
	changePair,
	setPairs,
	setCurrencies,
	setUserPayments,
	setOnramp,
	setOfframp,
	setOrderLimits,
	setHelpdeskInfo,
	setContracts,
	setBroker,
} from 'actions/appActions';
import { hasTheme } from 'utils/theme';
import { generateRCStrings } from 'utils/string';
import { LANGUAGE_KEY } from './config/constants';
import {
	consolePluginDevModeInfo,
	mergePlugins,
	IS_PLUGIN_DEV_MODE,
} from 'utils/plugin';
import { drawFavIcon } from 'helpers/vanilla';

consoleKitInfo();
consolePluginDevModeInfo();

const getConfigs = async () => {
	const localVersions = getLocalVersions();

	localStorage.removeItem('initialized');
	const kitData = await getKitData();
	const {
		meta: { versions: remoteVersions = {}, sections = {} } = {},
		valid_languages = '',
		info: { initialized },
		setup_completed,
		native_currency,
		logo_image,
		features: { home_page = false } = {},
		injected_values = [],
		injected_html = {},
		captcha = {},
		defaults = {},
	} = kitData;

	store.dispatch(setConfig(kitData));
	if (defaults) {
		const themeColor = localStorage.getItem('theme');
		const isThemeValid = hasTheme(themeColor, kitData.color);
		const language = localStorage.getItem(LANGUAGE_KEY);

		if (defaults.theme && (!themeColor || !isThemeValid)) {
			store.dispatch(changeTheme(defaults.theme));
			localStorage.setItem('theme', defaults.theme);
		}

		if (!language && defaults.language) {
			store.dispatch(setLanguage(defaults.language));
		}
	}
	if (kitData.info) {
		store.dispatch(setInfo({ ...kitData.info }));
	}

	kitData['sections'] = modifySections(sections);

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

	const { data: constants = {} } = await requestConstant();
	const { coins: coin_icons = {} } = constants;
	const {
		app: { pair },
	} = store.getState();

	if (!pair) {
		const initialPair = Object.keys(constants.pairs)[0];
		store.dispatch(changePair(initialPair));
	}

	store.dispatch(setCurrencies(constants.coins));
	store.dispatch(setUserPayments(kitData.user_payments));
	store.dispatch(setOnramp(kitData.onramp));
	store.dispatch(setOfframp(kitData.offramp));
	store.dispatch(setPairs(constants.pairs));
	store.dispatch(setPairsData(constants.pairs));
	store.dispatch(setContracts(getContracts(constants.coins)));
	store.dispatch(setBroker(constants.broker));

	const orderLimits = {};
	Object.keys(constants.pairs).forEach((pair) => {
		orderLimits[pair] = {
			PRICE: {
				MIN: constants.pairs[pair].min_price,
				MAX: constants.pairs[pair].max_price,
				STEP: constants.pairs[pair].increment_price,
			},
			SIZE: {
				MIN: constants.pairs[pair].min_size,
				MAX: constants.pairs[pair].max_size,
				STEP: constants.pairs[pair].increment_price,
			},
		};
	});
	store.dispatch(setOrderLimits(orderLimits));

	setDefaultLogo(logo_image);
	setBaseCurrency(native_currency);
	setLocalVersions(remoteVersions);
	setValidLanguages(valid_languages);
	setExchangeInitialized(initialized);
	setSetupCompleted(setup_completed);
	store.dispatch(setHomePageSetting(home_page));
	store.dispatch(setInjectedValues(injected_values));
	store.dispatch(setInjectedHTML(injected_html));

	const {
		data: { data: plugins = [] } = { data: [] },
	} = await requestPlugins();

	const allPlugins = IS_PLUGIN_DEV_MODE ? await mergePlugins(plugins) : plugins;

	store.dispatch(setPlugins(allPlugins));
	store.dispatch(setWebViews(allPlugins));
	store.dispatch(setHelpdeskInfo(allPlugins));

	const appConfigs = merge({}, defaultConfig, remoteConfigs, {
		coin_icons,
		captcha,
		valid_languages,
		defaults,
	});

	const {
		app: { plugins_injected_html },
	} = store.getState();

	return [appConfigs, injected_values, injected_html, plugins_injected_html];
};

const bootstrapApp = (
	appConfig,
	injected_values,
	injected_html,
	plugins_injected_html
) => {
	const {
		icons: {
			dark: { EXCHANGE_FAV_ICON = '/favicon.ico' },
		},
	} = appConfig;
	addElements(injected_values, 'head');
	injectHTML(injected_html, 'head');
	injectHTML(plugins_injected_html, 'head');
	drawFavIcon(EXCHANGE_FAV_ICON);
	// window.appConfig = { ...appConfig }
	const {
		app: { remoteRoutes, plugins },
	} = store.getState();

	const RCStrings = generateRCStrings(plugins);
	const mergedStrings = merge({}, RCStrings, appConfig.strings);

	initializeStrings(mergedStrings);

	render(
		<Provider store={store}>
			<EditProvider>
				<ConfigProvider initialConfig={appConfig}>
					<Router
						routes={generateRoutes(remoteRoutes)}
						history={browserHistory}
					/>
				</ConfigProvider>
			</EditProvider>
		</Provider>,
		document.getElementById('root')
	);
};

const initialize = async () => {
	try {
		const [
			configs,
			injected_values,
			injected_html,
			plugins_injected_html,
		] = await getConfigs();
		bootstrapApp(
			configs,
			injected_values,
			injected_html,
			plugins_injected_html
		);
	} catch (err) {
		console.error('Initialization failed!\n', err);
		setTimeout(initialize, 3000);
	}
};

initialize().then(() => {});

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
