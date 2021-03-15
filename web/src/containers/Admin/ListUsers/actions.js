import querystring from 'query-string';

import { requestAuthenticated } from '../../../utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

export const requestUsers = (values) => {
	let url = '/admin/users';
	if (values) {
		url = `/admin/users?${toQueryString(values)}`;
	}
	return requestAuthenticated(url);
};

export const flagUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/flag-user/`, options);
};
