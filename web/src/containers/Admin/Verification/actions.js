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

export const verifyData = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(
		'/plugins/kyc/id/verify',
		options,
		null,
		PLUGIN_URL
	);
};

export const revokeData = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated(
		'/plugins/kyc/id/revoke',
		options,
		null,
		PLUGIN_URL
	);
};
