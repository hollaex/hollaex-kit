import { requestAuthenticated } from '../../../utils';

export const requestTotalBalance = () => requestAuthenticated('/admin/stats');

export const requestEthSweep = (value) =>
	requestAuthenticated(`/admin/eth/sweep?wallets=${value}`);

export const requestConstants = () => requestAuthenticated('/admin/kit');

export const connectVault = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/plugins/vault/connect', options);
};
