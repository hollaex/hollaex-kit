import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';
import axios from 'axios';
const handleError = (err) => err.data;

export const requestTrades = (id, page = 0, limit = 50) => {
	const query = querystring.stringify({
		user_id: id,
		page,
		limit,
	});
	return requestAuthenticated(`/admin/trades?${query}`)
		.catch(handleError)
		.then((data) => {
			return {
				...data,
				page,
				isRemaining: data.count > page * limit,
			};
		});
};

export const requestTradesDownload = (values) => {
	const query = querystring.stringify(values);
	return axios({
		method: 'GET',
		url: `/admin/trades?${query}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'trades.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch(handleError);
};
