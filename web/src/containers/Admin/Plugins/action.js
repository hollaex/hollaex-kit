import axios from 'axios';
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

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	
	return requestAuthenticated('/plugins/vault/connect', options, null, WS_URL);
};

export const requestVaultSupportCoins = () =>
	axios.get(REQUEST_VAULT_SUPPORTED_COINS);
