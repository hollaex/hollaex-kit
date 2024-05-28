import axios from 'axios';
import querystring from 'query-string';

import { requestAuthenticated } from '../../../utils';
const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const requestDisputes = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/dispute?${queryValues}`);
};
export const editDispute = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/dispute', options);
};

export const requestTrades = (id) => {
	const query = querystring.stringify({
		user_id: id,
	});
	return requestAuthenticated(`/admin/trades?${query}`);
};

export const updateAssetPairs = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/pair', options);
};

export const storePair = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/pair', options);
};

export const getBroker = () => requestAuthenticated('/broker');

export const getWithoutAuthBroker = () => {
	let headers = {
		'Content-Type': 'application/json',
	};
	return axios.get('/broker', headers);
};

export const createBroker = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker', options);
};
export const createTestBroker = (values) => {
	return axios.post('/broker/test', { ...values });
};

export const createTestUniswap = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker/uniswap/test', options);
};

export const getBrokerUniswapTokens = () =>
	requestAuthenticated(`/broker/uniswap`);

export const getTrackedExchangeMarkets = (exchange_name) =>
	requestAuthenticated(`/broker/markets?exchange_name=${exchange_name}`);

export const updateBroker = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker', options);
};

export const updateQuickTradeConfig = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/quicktrade/config', options);
};

export const deleteBroker = (id) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(id),
	};
	return requestAuthenticated('/broker', options);
};

export const updateConstants = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/kit`, options);
};

export const getBrokerQuote = (symbol, side) =>
	requestAuthenticated(`/broker/quote?symbol=${symbol}&side=${side}`);

export const requestUsers = (values) => {
	let url = '/admin/users';
	if (values) {
		url = `/admin/users?${toQueryString(values)}`;
	}
	return requestAuthenticated(url);
};

export const getBrokerConnect = (
	exchange_id,
	api_key,
	api_secret,
	password
) => {
	let urlString = `/broker/connect?exchange_id=${exchange_id}&api_key=${api_key}&api_secret=${api_secret}`;

	if (exchange_id === 'okx') {
		urlString += `&password=${password}`;
	}

	return requestAuthenticated(urlString);
};

export const requestDeals = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/deal?${queryValues}`);
};
