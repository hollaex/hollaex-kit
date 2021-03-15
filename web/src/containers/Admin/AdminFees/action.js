import querystring from 'query-string';

import { requestAuthenticated } from '../../../utils';

export const getFees = (page = 1, limit = 50) => {
	let url = '/admin/fees';
	const values = querystring.stringify({
		page,
		limit,
	});
	if (values) {
		url = `/admin/fees?${values}`;
	}
	return requestAuthenticated(url);
};

export const settleFees = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/fees/settle', options);
};

export const calculateFees = (values) => {
	const qryParams = querystring.stringify(values);
	let url = `/admin/fees/calculate?${qryParams}`;

	return requestAuthenticated(url);
};
