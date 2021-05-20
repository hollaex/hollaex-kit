import axios from 'axios';
import querystring from 'query-string';
import { REQUEST_VAULT_SUPPORTED_COINS } from '../../../config/constants';
import { requestAuthenticated } from '../../../utils';
import { PLUGIN_URL, NETWORK_API_URL } from '../../../config/constants';

export const getConstants = (query) =>
	requestAuthenticated(`/plugins?${querystring.stringify(query)}`);

export const requestPlugins = (query) =>
	requestAuthenticated(
		`/plugins?${querystring.stringify(query)}`,
		{},
		null,
		NETWORK_API_URL
	);

export const requestMyPlugins = (query) =>
	requestAuthenticated(
		`/plugins?${querystring.stringify(query)}`,
		{},
		null,
		PLUGIN_URL
	);

export const getInstalledPlugin = (query) =>
	requestAuthenticated(
		`/plugins?${querystring.stringify(query)}`,
		{},
		null,
		PLUGIN_URL
	);

export const getPlugin = (query) =>
	requestAuthenticated(
		`/plugin?${querystring.stringify(query)}`,
		{},
		null,
		NETWORK_API_URL
	);

export const addPlugin = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/plugins', options, null, PLUGIN_URL);
};

export const getPluginMeta = (params) => {
	return requestAuthenticated(
		`/plugins/meta?${querystring.stringify(params)}`,
		{},
		null,
		PLUGIN_URL
	);
};

export const updatePlugins = (params, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/plugins?${querystring.stringify(params)}`,
		options,
		null,
		PLUGIN_URL
	);
};

export const updatePluginMeta = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/plugins/meta', options, null, PLUGIN_URL);
};

export const removePlugin = (values) => {
	const options = {
		method: 'DELETE',
	};

	return requestAuthenticated(
		`/plugins?${querystring.stringify(values)}`,
		options,
		null,
		PLUGIN_URL
	);
};

// export const getConstants = (query) =>
// 	requestAuthenticated(
// 		`/plugins?${querystring.stringify(query)}`,
// 		{},
// 		null,
// 		PLUGIN_URL
// 	);

export const getPlugins = (service) =>
	requestAuthenticated(`/plugins?${service}`, {});

export const connectPlugin = (service) =>
	requestAuthenticated(
		`/plugins/enable?plugin=${service}`,
		{},
		null,
		PLUGIN_URL
	);

export const disconnectPlugin = (service) =>
	requestAuthenticated(
		`/plugins/disable?plugin=${service}`,
		{},
		null,
		PLUGIN_URL
	);

export const updatePluginsService = (service, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/plugins?plugin=${service}`,
		options,
		null,
		PLUGIN_URL
	);
};

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(
		'/plugins/vault/connect',
		options,
		null,
		PLUGIN_URL
	);
};

export const disconnectVault = () =>
	requestAuthenticated('/plugins/vault/disconnect', null, PLUGIN_URL);

export const requestVaultSupportCoins = () =>
	axios.get(REQUEST_VAULT_SUPPORTED_COINS);

export const requestAnnouncements = (query) =>
	requestAuthenticated(
		`/plugins/announcement?${querystring.stringify(query)}`,
		null,
		PLUGIN_URL
	);

export const requestPostAnnouncement = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(
		'/plugins/announcement',
		options,
		null,
		PLUGIN_URL
	);
};
export const requestDeleteAnnouncement = (query) => {
	const options = {
		method: 'DELETE',
	};

	return requestAuthenticated(
		`/plugins/announcement?${querystring.stringify(query)}`,
		options,
		null,
		PLUGIN_URL
	);
};
