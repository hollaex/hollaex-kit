import axios from 'axios';
import store from 'store';

import strings from 'config/localizedStrings';
import { overwriteLocale } from './string';
import { API_URL, LAST_BUILD } from 'config/constants';
import { version } from '../../package.json';
import { setError, setErrorCount } from 'actions/appActions';

export const getLocalVersions = () => {
	const versions = localStorage.getItem('versions') || '{}';
	return JSON.parse(versions);
};

export const setLocalVersions = (versions) => {
	localStorage.setItem('versions', JSON.stringify(versions));
};

export const initializeStrings = (
	strings = JSON.parse(localStorage.getItem('strings') || '{}')
) => {
	Object.entries(strings).forEach(([key, overwrites]) => {
		overwriteLocale(key, overwrites);
	});
};

export const getValidLanguages = () => {
	const validLanguages = localStorage.getItem('valid_languages') || '';
	return validLanguages.split(',');
};

export const setValidLanguages = (validLanguages = '') => {
	return localStorage.setItem('valid_languages', validLanguages);
};

export const setExchangeInitialized = (initialized) => {
	return localStorage.setItem('initialized', initialized);
};

export const getExchangeInitialized = () => {
	const initialized = localStorage.getItem('initialized');
	return initialized;
};

export const setSetupCompleted = (setup_completed) => {
	return localStorage.setItem('setup_completed', setup_completed);
};

export const getSetupCompleted = () => {
	const setup_completed = localStorage.getItem('setup_completed') || false;
	return setup_completed;
};

export const setBaseCurrency = (native_currnecy) => {
	localStorage.setItem('base_currnecy', native_currnecy);
};

export const setDefaultLogo = (logo_black_path) => {
	localStorage.setItem('default_logo', logo_black_path);
};

export const consoleKitInfo = () => {
	console.info(
		`%c${version}`,
		'color: #00509d; font-family:sans-serif; font-size: 20px; font-weight: 800'
	);
	if (LAST_BUILD) {
		console.info(
			`%c${LAST_BUILD}`,
			'font-family:sans-serif; font-size: 16px; font-weight: 200'
		);
	}
	console.info(
		`%c${API_URL}`,
		'font-family:sans-serif; font-size: 16px; font-weight: 600'
	);
};

export const getContracts = (coins = {}) => {
	const contracts = {};

	Object.entries(coins).forEach(
		([
			coin,
			{ meta: { contract: token, staking: main, network, whitepaper } = {} },
		]) => {
			if (token && main) {
				contracts[coin] = {
					token,
					main,
					network,
					whitepaper,
				};
			}
		}
	);

	return contracts;
};

export const modifySections = (sections = {}) => {
	const CUSTOMIZABLE_ATTRIBUTES = ['order', 'is_active'];

	const modifiedSections = { ...sections };
	Object.entries(modifiedSections).forEach(([sectionKey, section = {}]) => {
		if (sectionKey === 'market_list') {
			delete modifiedSections[sectionKey];
			return;
		}
		Object.keys(section).forEach((key) => {
			if (!CUSTOMIZABLE_ATTRIBUTES.includes(key)) {
				delete modifiedSections[sectionKey][key];
			}
		});
	});

	return modifiedSections;
};

export const onHandleError = (error) => {
	if (!navigator.onLine) {
		store.dispatch(
			setError({ message: strings['ERROR_TAB.NETWORK_ERROR_MESSAGE'] })
		);
		return;
	}

	const displayError = {
		429: strings['ERROR_TAB.TOO_MANY_REQUEST_ERROR'],
		503: strings['ERROR_TAB.SERVER_MAINTENANCE_ERROR'],
		504: strings['ERROR_TAB.SERVER_ERROR'],
	};

	const state = store.getState();
	const getErrorCount = state?.app.errorCount || 0;
	const errorMessage = displayError[error?.response?.status];
	if (errorMessage) {
		if (errorMessage === strings['ERROR_TAB.SERVER_MAINTENANCE_ERROR']) {
			store.dispatch(setErrorCount(getErrorCount + 1));
		}
		if (
			getErrorCount >= 3 ||
			errorMessage !== strings['ERROR_TAB.SERVER_MAINTENANCE_ERROR']
		) {
			store.dispatch(setError({ message: errorMessage }));
		}
	}
};

export const setupAxiosInterceptors = () => {
	axios.interceptors.request.use(
		(config) => config,
		(error) => {
			console.error(error);
			onHandleError(error);
			return Promise.reject(error);
		}
	);

	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			console.error(error);
			onHandleError(error);
			return Promise.reject(error);
		}
	);
};
