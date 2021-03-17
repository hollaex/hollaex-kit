import querystring from 'query-string';
import axios from 'axios';

import { requestAuthenticated } from '../../../utils';

export const getFees = (params = {}) => {
	let url = '/admin/fees';
	const values = querystring.stringify(params);
	if (values) {
		url = `/admin/fees?${values}`;
	}
	return requestAuthenticated(url);
};
export const getFeesDownload = (params = {}) => {
	let url = '/admin/fees';
	const values = querystring.stringify(params);
	if (values) {
		url = `/admin/fees?${values}`;
	}
	return axios({
		method: 'GET',
		url: url,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'fees.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};
export const getSettle = () => {
	let url = '/admin/fees/settle';

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
