import { requestAuthenticated } from '../../../utils';

export const activateUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/user/activate', options);
};
