import { requestAuthenticated } from '../../../utils';

export const performLimitUpdate = (id, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ id, ...values }),
	};
	return requestAuthenticated(`/admin/coins`, options);
};

export const requestLimits = () => requestAuthenticated('/admin/coins');
