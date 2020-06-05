import axios from 'axios';
import querystring from 'query-string';
import { WS_URL, REQUEST_VAULT_SUPPORTED_COINS } from '../../../config/constants';
import { requestAuthenticated } from '../../../utils';

export const updatePlugins = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/admin/constant`, options);
};

export const getConstants = () =>
	requestAuthenticated('/admin/constant');

export const getPlugins = (service) =>
	requestAuthenticated(`/plugins/${service}/constant`, {}, null, WS_URL);

export const updatePluginsService = (service, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/plugins/${service}/constant`, options, null, WS_URL);
};

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/plugins/vault/connect', options, null, WS_URL);
};

export const disconnectVault = () => requestAuthenticated('/plugins/vault/disconnect', {}, null, WS_URL);

export const requestVaultSupportCoins = () =>
	axios.get(REQUEST_VAULT_SUPPORTED_COINS);

export const requestAnnouncements = (query) =>
	requestAuthenticated(`/plugins/announcements?${querystring.stringify(query)}`, {}, null, WS_URL);

export const requestPostAnnouncement = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/plugins/announcement', options, null, WS_URL);
};
export const requestDeleteAnnouncement = (query) => {
	const options = {
		method: 'DELETE'
	};

	return requestAuthenticated(`/plugins/announcement?${querystring.stringify(query)}`, options, null, WS_URL);
};