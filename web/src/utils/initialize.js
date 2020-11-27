import { overwriteLocale } from './string';

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
	const initialized = localStorage.getItem('initialized') || false;
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
