import { requestAuthenticated } from '../../../utils';

export const performVerificationLevelUpdate = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	return requestAuthenticated('/admin/upgrade-user', options);
};

export const verifyData = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/admin/user/id/verify', options);
};

export const revokeData = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};

	return requestAuthenticated('/admin/user/id/revoke', options);
};
