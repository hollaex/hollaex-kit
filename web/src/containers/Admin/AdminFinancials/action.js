import axios from 'axios';
import { HOLLAEX_NETWORK_API_URL } from 'config';
import querystring from 'query-string';
import { requestAuthenticated, requestDashAuthenticated } from 'utils';
import moment from 'moment';

export const storeMint = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/mint', options);
};

export const updateMint = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/mint', options);
};

export const storeBurn = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/burn', options);
};

export const updateBurn = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/burn', options);
};

export const getAllCoins = () => {
	return axios.get('/admin/coins/network');
};

export const getAllPairs = () => {
	return axios.get('/admin/pairs/network');
};

export const getDashToken = () => {
	return requestAuthenticated(`/admin/dash-token`, { method: 'GET' });
};

export const getDashExchange = () => {
	return requestDashAuthenticated(`/exchange`, { method: 'GET' });
};

export const putDashExchange = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestDashAuthenticated(`/exchange`, options);
};

export const getExchange = () => {
	return axios.get(`/admin/exchange`);
};

export const getConstants = () => {
	return axios.get(`/network/constants`);
};

export const updateAssetCoins = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/coin', options);
};

export const storeAsset = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/coin', options);
};

export const getCoinInfo = (dataParams) =>
	requestAuthenticated(
		`/coin/info?${querystring.stringify(dataParams)}`,
		{},
		null,
		HOLLAEX_NETWORK_API_URL
	);

export const updateExchange = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/exchange', options);
};

export const uploadCoinLogo = (values) => {
	return axios({
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: values,
		url: '/admin/upload',
		method: 'POST',
	});
};

export const getExchangeWallet = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/user/wallet?${queryValues}`);
};

export const getExchangeWalletCsv = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return axios({
		method: 'GET',
		url: `/admin/user/wallet/csv?${queryValues}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`wallets_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const getExchangeBalances = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return axios({
		method: 'GET',
		url: `/admin/balances/csv?${queryValues}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`balances_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const getTransactionLimits = () => {
	return requestAuthenticated('/admin/transaction/limit');
};

export const updateTransactionLimits = (values) => {
	return axios({
		method: 'PUT',
		url: '/admin/transaction/limit',
		data: values,
	});
};

export const deleteTransactionLimit = (values) => {
	return axios({
		method: 'DELETE',
		url: '/admin/transaction/limit',
		data: values,
	});
};

export const setAutoPaymentDetail = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestDashAuthenticated('/dash/user/auto-payment', options);
};

export const removeAutoPayment = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestDashAuthenticated('/dash/user/auto-payment', options);
};
