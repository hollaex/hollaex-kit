import axios from 'axios';
// import { NETWORK_API_URL, PLUGIN_URL } from 'config/constants';
import { requestAuthenticated } from 'utils';

export const requestExchange = (values) => {
	return axios.get(`/network/${values.id}/exchange`);
};

// export const updateExchange = (values) => {
//     const options = {
//         method: 'PUT',
//         body: JSON.stringify(values),
//     };

//     return axios(`/network/${values.id}/exchange`, options);
// };

export const storeMint = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return axios(`/network/${values.id}/mint`, options);
};

export const updateMint = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return axios(`/network/${values.id}/mint`, options);
};

export const storeBurn = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return axios(`/network/${values.id}/burn`, options);
};

export const updateBurn = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return axios(`/network/${values.id}/burn`, options);
};

export const getAllCoins = () => {
	return axios.get('/network/coins/all');
};

export const getAllPairs = () => {
	return axios.get(`/network/pairs/all`);
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
