import { requestAuthenticated } from 'utils';

export const setAutoTrader = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/user/autotrade`, options);
};

export const getAutoTradeDetails = () => {
	return requestAuthenticated(`/user/autotrade`);
};

export const editAutoTradeDeatils = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(`/user/autotrade`, options);
};

export const removeAutoTrade = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(`/user/autotrade`, options);
};
