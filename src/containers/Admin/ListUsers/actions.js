import { requestAuthenticated } from '../../../utils';

export const requestUsers = () => requestAuthenticated('/admin/users');

export const requestFullUsers = () => requestAuthenticated('/admin/users/all');

export const flagUser = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values)
	};
	return requestAuthenticated(`/admin/flag-user/`, options);
};
