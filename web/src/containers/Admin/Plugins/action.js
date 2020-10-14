import axios from 'axios';
import querystring from 'query-string';
import { REQUEST_VAULT_SUPPORTED_COINS } from '../../../config/constants';
import { requestAuthenticated } from '../../../utils';

export const updatePlugins = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/plugins`, options);
};

export const getConstants = () =>
	requestAuthenticated('/plugins');

export const getPlugins = (service) =>
	requestAuthenticated(`/plugins?${service}`, {});

export const connectPlugin = (service) =>
	requestAuthenticated(`/plugins/enable?plugin=${service}`);

export const disconnectPlugin = (service) =>
	requestAuthenticated(`/plugins/disable?plugin=${service}`);

export const updatePluginsService = (service, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/plugins?plugin=${service}`, options);
};

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/plugins/vault/connect', options);
};

export const disconnectVault = () => requestAuthenticated('/plugins/vault/disconnect');

export const requestVaultSupportCoins = () =>
	axios.get(REQUEST_VAULT_SUPPORTED_COINS);

export const requestAnnouncements = (query) =>
	requestAuthenticated(`/plugins/announcements?${querystring.stringify(query)}`);

export const requestPostAnnouncement = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/plugins/announcement', options);
};
export const requestDeleteAnnouncement = (query) => {
	const options = {
		method: 'DELETE'
	};

	return requestAuthenticated(`/plugins/announcement?${querystring.stringify(query)}`, options);
};