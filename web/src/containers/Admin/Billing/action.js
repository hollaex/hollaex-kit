import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const getExchangeBilling = (params) => {
	return requestAuthenticated(`/invoice?${toQueryString(params)}`, {
		isDashRequest: true,
	});
};

export const setExchangePlan = (body) => {
	return requestAuthenticated(`/exchange/plan`, {
		isDashRequest: true,
		method: 'post',
		...body,
	});
};

export const getNewExchangeBilling = (exchangeId = '') => {
	return requestAuthenticated(`/exchange/pay?exchange_id=${exchangeId}`, {
		isDashRequest: true,
		method: 'get',
	});
};

export const getPrice = () => {
	return requestAuthenticated(`/exchange/pricing`, { isDashRequest: true });
};
