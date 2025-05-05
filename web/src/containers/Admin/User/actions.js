import { all } from 'rsvp';
import querystring from 'query-string';
import axios from 'axios';
import store from 'store';
import moment from 'moment';

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

export const deleteNotes = (id) => {
	const values = { id, note: '' };
	return updateNotes(values);
};

export const requestUserImages = (values, kyc_name) => {
	const url = `/plugins/${kyc_name}/admin/files?${toQueryString(values)}`;
	return requestAuthenticated(url, {}, null, PLUGIN_URL)
		.catch(handleError)
		.then((data) => data);
};

export const updateUserData = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/user?user_id=${values.id}`, options);
};

export const addBankData = (values) => {
	//FIXME: DRY
	const {
		app: {
			pluginNames: { bank },
			features: { ultimate_fiat },
		},
	} = store.getState();

	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	// This will be deprecated and ultimate fiat will supersede bank plugin
	return !bank && ultimate_fiat
		? requestAuthenticated(`/admin/user/bank?id=${values.id}`, options)
		: requestAuthenticated(
				`/plugins/${bank}/admin?id=${values.id}`,
				options,
				null,
				PLUGIN_URL
		  );
};

export const approveBank = (values) => {
	const {
		app: {
			pluginNames: { bank },
			features: { ultimate_fiat },
		},
	} = store.getState();

	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	// This will be deprecated and ultimate fiat will supersede bank plugin
	return !bank && ultimate_fiat
		? requestAuthenticated('/admin/bank/verify', options)
		: requestAuthenticated(
				`/plugins/${bank}/verify`,
				options,
				null,
				PLUGIN_URL
		  );
};

export const rejectBank = (values) => {
	const {
		app: {
			pluginNames: { bank },
			features: { ultimate_fiat },
		},
	} = store.getState();

	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	// This will be deprecated and ultimate fiat will supersede bank plugin
	return !bank && ultimate_fiat
		? requestAuthenticated('/admin/bank/revoke', options)
		: requestAuthenticated(
				`/plugins/${bank}/revoke`,
				options,
				null,
				PLUGIN_URL
		  );
};

export const requestUser = (values, kyc_name) => {
	const params = {
		user_id: values.id,
	};

	const promises = [
		requestUserData(values),
		requestUserImages(params, kyc_name),
	];
	return all(promises);
};

export const requestUsersDownload = (values) => {
	let path = '/admin/users/csv';
	if (values) {
		path = `/admin/users/csv?${toQueryString(values)}`;
	}
	return axios({
		method: 'GET',
		url: path,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`users_${moment().format('YYYY-MM-DD')}.csv`
			);
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

export const disableWithdrawal = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/disable-withdrawal', options);
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

export const recoverUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/restore', options);
};

export const deleteUser = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user', options);
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
	return requestAuthenticated(
		`/admin/user/discount?user_id=${user.id}`,
		options
	);
};

export const updateUserMeta = (values, id) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/user/meta?user_id=${id}`, options);
};

export const addMeta = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/admin/kit/user-meta', options);
};

export const updateMeta = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/admin/kit/user-meta', options);
};

export const deleteMeta = (user, name) => {
	const options = {
		method: 'DELETE',
	};
	return requestAuthenticated(`/admin/kit/user-meta?name=${name}`, options);
};

export const updateIdData = (body, id) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(body),
	};
	return requestAuthenticated(`/admin/user?user_id=${id}`, options);
};

export const getUserAffiliation = (user_id, page = 1, limit = 50) => {
	const params = { user_id, page, limit };
	const query = querystring.stringify(params);

	const options = {
		method: 'GET',
	};
	return requestAuthenticated(`/admin/user/affiliation?${query}`, options);
};

export const fetchReferralCodesByAdmin = (user_id, page = 1, limit = 50) => {
	const params = { user_id, page, limit };
	const query = querystring.stringify(params);

	const options = {
		method: 'GET',
	};
	return requestAuthenticated(`/admin/user/referral/code?${query}`, options);
};

export const postReferralCodeByAdmin = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/user/referral/code`, options);
};

export const getUserReferer = (user_id) => {
	const options = {
		method: 'GET',
	};
	return requestAuthenticated(
		`/admin/user/referer?user_id=${user_id}`,
		options
	);
};

export const requestAddUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/admin/user', options);
};

export const requestUserBalancesDownload = (values) => {
	let path = '/admin/balances/csv';
	if (values) {
		path = `/admin/balances/csv?${toQueryString(values)}`;
	}
	return axios({
		method: 'GET',
		url: path,
	})
		.then((res) => {
			const url = window.URL.createObjectURL(new Blob([res.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
				'download',
				`balances_${moment().format('YYYY-MM-DD')}.csv`
			);
			document.body.appendChild(link);
			link.click();
		})
		.catch((err) => {});
};

export const changeUserEmail = (values) => {
	try {
		const options = {
			method: 'PUT',
			body: JSON.stringify(values),
		};
		return requestAuthenticated('/admin/user/email', options);
	} catch (error) {
		return error;
	}
};

export const fetchP2PPaymentMethods = (values) => {
	const queryValues =
		values && Object.keys(values).length ? querystring.stringify(values) : '';
	return requestAuthenticated(`/admin/user/payment-details?${queryValues}`);
};

export const createP2PPaymentMethod = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/payment-details', options);
};

export const deleteP2PPaymentMethod = (values) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/payment-details', options);
};

export const updateP2PPaymentMethod = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/payment-details', options);
};
