import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchDeals = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/deal?${queryValues}`);
};

export const fetchTransactions = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/order?${queryValues}`);
};

export const postDeal = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/deal', options);
};

export const editDeal = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/deal', options);
};

export const removeDeal = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/deal', options);
};

export const createTransaction = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/order', options);
};

export const updateTransaction = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/order', options);
};

export const createChatMessage = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/order/chat', options);
};

export const createFeedback = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/p2p/feedback', options);
};

export const getQuickTrade = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/quick-trade?${queryValues}`);
};

export const fetchFeedback = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/feedback?${queryValues}`);
};

export const fetchP2PProfile = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/p2p/profile?${queryValues}`);
};

export const fetchP2PPaymentMethods = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/payment-details?${queryValues}`);
};

export const createP2PPaymentMethod = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/user/payment-details', options);
};

export const deleteP2PPaymentMethod = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/user/payment-details', options);
};

export const updateP2PPaymentMethod = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/user/payment-details', options);
};
