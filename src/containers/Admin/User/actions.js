import { all } from 'bluebird';
import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';
import { isSupport } from '../../../utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

const handleError = (err) => err.data;

export const requestUserData = (values) =>
	requestAuthenticated(`/admin/user?${toQueryString(values)}`)
		.catch(handleError)
		.then((data) => data);

export const requestUserBalance = (values) =>
	requestAuthenticated(`/admin/user/${values}/balance`)
		.catch(handleError)
		.then((data) => {
			return data;
		});

export const requestUserImages = (values) =>
	requestAuthenticated(`/admin/verification?${toQueryString(values)}`)
		.catch(handleError)
		.then((data) => data);

export const updateUserData = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/admin/user/${values.id}`, options);
};

export const approveBank = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	return requestAuthenticated('/admin/user/bank/verify', options);
};

export const rejectBank = (values) => {
	console.log('values', values);
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	return requestAuthenticated('/admin/user/bank/revoke', options);
};

export const requestUser = (values) => {
	const promises = [requestUserData(values), requestUserImages(values)];
	return all(promises);
};
