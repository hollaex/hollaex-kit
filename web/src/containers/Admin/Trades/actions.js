import querystring from 'query-string';

import { requestAuthenticated } from '../../../utils';

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

export const createBroker = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker', options);
};

export const updateBroker = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker', options);
};

export const deleteBroker = (id) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(id),
	};
	return requestAuthenticated('/broker', options);
};
