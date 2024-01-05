import axios from 'axios';
import querystring from 'query-string';
import { requestAuthenticated } from 'utils';

export const fetchBalanceHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/history?${queryValues}`);
};

export const fetchPlHistory = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/user/balance-pl?${queryValues}`);
};

// export const get = (values) => {
// 	return axios({
// 		method: 'PUT',
// 		url: '/admin/transaction/limit',
// 		data: values,
// 	});
// };
