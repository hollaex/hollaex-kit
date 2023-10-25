import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';
import axios from 'axios';

const handleError = (err) => err.data;

export const requestUserAudits = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/audits?${queryValues}`);
};

export const requestUserAuditsDownload = (values) => {
	const query = querystring.stringify(values);
	return axios({
		method: 'GET',
		url: `/admin/audits?${query}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'audits.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch(handleError);
};
