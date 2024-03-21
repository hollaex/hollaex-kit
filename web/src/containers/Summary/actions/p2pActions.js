import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchDeals = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/deal?${queryValues}`);
};

export const postDeal = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/deal', options);
};

export const createTransaction = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/broker/uniswap/test', options);
};
