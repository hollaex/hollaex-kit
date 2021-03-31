import { requestAuthenticated } from '../../../utils';

export const deactivateOtp = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/deactivate-otp', options);
};
