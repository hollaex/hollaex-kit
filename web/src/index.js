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
	setAllContracts,
	setBroker,
	setTransactionLimits,
	setQuickTrade,
	setAdminSortData,
	setAdminWalletSortData,
	setAdminDigitalAssetsSortData,
	setSortModeChange,
	setSortModeVolume,
	SORT,
	WALLET_SORT,
	DIGITAL_ASSETS_SORT,
	setExchangeTimeZone,
	setAppAnnouncements,
} from 'actions/appActions';
// import { setPricesAndAsset } from 'actions/assetActions';
import { hasTheme } from 'utils/theme';
import { generateRCStrings } from 'utils/string';
import { LANGUAGE_KEY, DEFAULT_PINNED_COINS } from 'config/constants';
import {
	consolePluginDevModeInfo,
	mergePlugins,
	IS_PLUGIN_DEV_MODE,
} from 'utils/plugin';
import { drawFavIcon } from 'helpers/vanilla';
import { setupManifest } from 'helpers/manifest';
import {
	hideBooting,
	showBooting,
	setLoadingImage,
	setLoadingStyle,
} from 'helpers/boot';
import { filterPinnedAssets, handleUpgrade } from 'utils/utils';
import { isLoggedIn } from 'utils/token';
import { getAnnouncementDetails } from 'containers/Announcement/actions';

consoleKitInfo();
consolePluginDevModeInfo();

const getConfigs = async () => {
	const localVersions = getLocalVersions();

	localStorage.removeItem('initialized');
	const kitData = await getKitData();
	if (isLoggedIn) {
		const announcement = await getAnnouncementDetails();
		store.dispatch(setAppAnnouncements(announcement?.data));
	}

	const {
		meta: {
			versions: remoteVersions = {},
			sections = {},
			default_sort = SORT.CHANGE,
			pinned_markets = [],
			default_wallet_sort = WALLET_SORT.AMOUNT,
			pinned_assets = [],
			default_digital_assets_sort = DIGITAL_ASSETS_SORT.CHANGE,
		} = {},
		valid_languages = '',
		info: { initialized },
		setup_completed,
		native_currency,
		logo_image,
		features: { home_page = false } = {},
		injected_values = [],
		injected_html = {},
		defaults = {},
		timezone = '',
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
	store.dispatch(setAllContracts(constants));
	store.dispatch(setBroker(constants.broker));
	store.dispatch(setQuickTrade(constants.quicktrade));
	store.dispatch(setTransactionLimits(constants.transactionLimits));
	// store.dispatch(setPricesAndAsset({}, constants.coins));
	store.dispatch(setExchangeTimeZone(timezone));

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

	const isBasic = handleUpgrade(kitData.info);
	const pinnedCoins = filterPinnedAssets(
		isBasic ? DEFAULT_PINNED_COINS : pinned_assets,
		constants.coins
	);

	store.dispatch(setHomePageSetting(home_page));
	store.dispatch(setInjectedValues(injected_values));
	store.dispatch(setInjectedHTML(injected_html));
	store.dispatch(setAdminSortData({ pinned_markets, default_sort }));
	store.dispatch(
		setAdminWalletSortData({ pinned_assets: pinnedCoins, default_wallet_sort })
	);
	store.dispatch(
		setAdminDigitalAssetsSortData({
			pinned_assets: pinnedCoins,
			default_digital_assets_sort,
		})
	);

	if (default_sort === SORT.VOL) {
		store.dispatch(setSortModeVolume());
	} else {
		store.dispatch(setSortModeChange());
	}

	const appConfigs = merge({}, defaultConfig, remoteConfigs, {
		coin_icons,
		valid_languages,
		defaults,
	});

	setLoadingStyle(appConfigs);
	setLoadingImage(appConfigs);

	try {
		const {
			data: { data: plugins = [] } = { data: [] },
		} = await requestPlugins();

		const allPlugins = IS_PLUGIN_DEV_MODE
			? await mergePlugins(plugins)
			: plugins;

		store.dispatch(setPlugins(allPlugins));
		store.dispatch(setWebViews(allPlugins));
		store.dispatch(setHelpdeskInfo(allPlugins));
	} catch (err) {
		console.error(err);
		showBooting();
		throw err;
	}

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
		app: {
			remoteRoutes,
			plugins,
			constants: { api_name: name },
		},
	} = store.getState();

	const RCStrings = generateRCStrings(plugins);
	const mergedStrings = merge({}, RCStrings, appConfig.strings);
	setupManifest({ name, short_name: name });

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
		hideBooting();
	} catch (err) {
		console.error('Initialization failed!\n', err);
		setTimeout(initialize, 3000);
	}
};

initialize().then(() => {});

// import registerServiceWorker from './registerServiceWorker'
// registerServiceWorker();
