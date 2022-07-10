import { overwriteLocale } from './string';
import { API_URL } from 'config/constants';
import { version, name } from '../../package.json';

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
		`%c${name.toUpperCase()} ${version}`,
		'color: #00509d; font-family:sans-serif; font-size: 20px; font-weight: 800'
	);
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
		Object.keys(section).forEach((key) => {
			if (!CUSTOMIZABLE_ATTRIBUTES.includes(key)) {
				delete modifiedSections[sectionKey][key];
			}
		});
	});

	return modifiedSections;
};
