import { all } from 'bluebird';
import querystring from 'query-string';
import axios from 'axios';

import { PLUGIN_URL } from '../../../config/constants';
import { requestAuthenticated } from '../../../utils';

const toQueryString = (values) => {
	return querystring.stringify(values);
};

const handleError = (err) => err.data;

export const requestUserData = (values) =>
	requestAuthenticated(`/admin/users?${toQueryString(values)}`)
		.catch(handleError)
		.then((data) => data);

export const requestUserBalance = (values) =>
	requestAuthenticated(`/admin/user/balance?user_id=${values}`)
		.catch(handleError)
		.then((data) => {
			return data;
		});

export const updateNotes = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/user/note?user_id=${values.id}`, options);
};
export const requestUserImages = (values) =>
	requestAuthenticated(
		`/plugins/kyc/id?${toQueryString(values)}`,
		{},
		null,
		PLUGIN_URL
	)
		.catch(handleError)
		.then((data) => data);

export const updateUserData = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/plugins/kyc/admin?user_id=${values.id}`,
		options,
		null,
		PLUGIN_URL
	);
};

export const addBankData = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/plugins/bank/admin?id=${values.id}`,
		options,
		null,
		PLUGIN_URL
	);
};

export const approveBank = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		'/plugins/bank/verify',
		options,
		null,
		PLUGIN_URL
	);
};

export const rejectBank = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		'/plugins/bank/revoke',
		options,
		null,
		PLUGIN_URL
	);
};

export const requestUser = (values) => {
	const promises = [requestUserData(values), requestUserImages(values)];
	return all(promises);
};

export const requestUsersDownload = (values) => {
	let path = '/admin/users';
	if (values) {
		path = `/admin/users?${toQueryString(values)}`;
	}
	return axios({
		method: 'GET',
		url: path,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'users.csv');
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const deactivateOtp = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/deactivate-otp', options);
};

export const flagUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/flag-user/`, options);
};

export const activateUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/activate', options);
};

export const verifyUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/verify-email', options);
};

export const performVerificationLevelUpdate = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/admin/upgrade-user', options);
};

export const requestTiers = () => requestAuthenticated('/tiers');

export const updateDiscount = (user, discount) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(discount),
	};
	return requestAuthenticated(`/admin/user/discount?user_id=${user.id}`, options);
};
