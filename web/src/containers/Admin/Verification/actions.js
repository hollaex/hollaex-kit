import { PLUGIN_URL } from 'config/constants';
import { requestAuthenticated } from '../../../utils';

export const performVerificationLevelUpdate = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/admin/upgrade-user', options);
};

export const performUserRoleUpdate = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values.role),
	};
	return requestAuthenticated(
		`/admin/user/role?user_id=${values.user_id}`,
		options
	);
};

export const verifyData = (values, kyc_name) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	let url = '/plugins/kyc/id/verify';
	if (kyc_name !== 'kyc') {
		url = `/plugins/${kyc_name}/verify`;
	}

	return requestAuthenticated(
		url,
		options,
		null,
		PLUGIN_URL
	);
};

export const revokeData = (values, kyc_name) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	let url = '/plugins/kyc/id/revoke';
	if (kyc_name !== 'kyc') {
		url = `/plugins/${kyc_name}/revoke`;
	}

	return requestAuthenticated(
		url,
		options,
		null,
		PLUGIN_URL
	);
};
