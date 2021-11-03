import axios from 'axios';
import { HOLLAEX_NETWORK_API_URL } from 'config';
import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

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