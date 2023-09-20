import axios from 'axios';
import querystring from 'query-string';
import { requestAuthenticated } from 'utils';
import moment from 'moment';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const getExchangeSessions = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/user/sessions?${queryValues}`);
};

export const getExchangeSessionsCsv = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return axios({
		method: 'GET',
		url: `/admin/user/sessions?${queryValues}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`sessions_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const revokeSession = (sessionId) => {
	return axios({
		method: 'POST',
		url: `/admin/user/revoke-stake`,
		data: {
			session_id: sessionId,
		},
	});
};

export const getExchangeLogins = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/user/sessions?${queryValues}`);
};

export const getExchangeLoginsCsv = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return axios({
		method: 'GET',
		url: `/admin/user/sessions?${queryValues}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`logins_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const requestStakePools = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/stakes?${queryValues}`);
};

export const requestUserStakePools = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/stakes?${queryValues}`);
};

export const requestStakers = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/stake?${queryValues}`);
};

export const requestStakersByAdmin = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/stakers?${queryValues}`);
};

export const requestStakePoolsDownload = (values) => {
	const query = querystring.stringify(values);
	return axios({
		method: 'GET',
		url: `/admin/stakes?${query}`,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'stakepools.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const requestUsers = (values) => {
	let url = '/admin/users';
	if (values) {
		url = `/admin/users?${toQueryString(values)}`;
	}
	return requestAuthenticated(url);
};

export const requestUserData = (values) =>
	requestAuthenticated(`/admin/users?${toQueryString(values)}`);

export const createStakePool = (data) => {
	return axios({
		method: 'POST',
		url: `/admin/stake`,
		data,
	});
};

export const updateStakePool = (data) => {
	return axios({
		method: 'PUT',
		url: `/admin/stake`,
		data,
	});
};

export const createStaker = (data) => {
	return axios({
		method: 'POST',
		url: `/stake`,
		data,
	});
};

export const deleteStaker = (data) => {
	return axios({
		method: 'DELETE',
		url: `/stake`,
		data,
	});
};
