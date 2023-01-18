import querystring from 'query-string';
import { _FetchDash } from 'utils/utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const getExchangeBilling = (params) => {
	return _FetchDash(`/invoice?${toQueryString(params)}`, 'get');
};

export const setExchangePlan = (body) => {
	return new Promise(async (resolve, reject) => {
		try {
			const res = await _FetchDash('/exchange/plan', 'post', body);
			resolve(res);
		} catch (error) {
			console.log('setExchangePlan : error', error);
			reject(error);
		}
	});
};

export const getNewExchangeBilling = (exchangeId = '') => {
	return _FetchDash(`/exchange/pay?exchange_id=${exchangeId}`, 'get');
};

export const getPrice = () => {
	return _FetchDash(`/exchange/pricing`, 'get');
};

export const requestStoreInvoice = (id, data) => {
	console.log('id', id, 'data', data);
	// return new Promise(async (resolve, reject) => {
	//  try {
	//      // const url = `/invoice?invoice_id=${id}`;
	//      // const res = await _FetchDash(url, 'put', data);
	//      // resolve(res);
	//  } catch (error) {
	//      reject(error);
	//  }
	// });
};
