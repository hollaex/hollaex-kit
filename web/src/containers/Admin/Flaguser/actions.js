import { requestAuthenticated } from '../../../utils';

export const flagUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/flag-user/`, options);
};
