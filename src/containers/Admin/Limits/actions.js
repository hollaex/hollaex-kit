import { requestAuthenticated } from '../../../utils';

export const performLimitUpdate = (id, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};

	return requestAuthenticated(`/admin/limits/${id}`, options);
};

export const requestLimits = () => requestAuthenticated('/admin/limits');
