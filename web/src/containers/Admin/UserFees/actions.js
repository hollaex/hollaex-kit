import { requestAuthenticated } from '../../../utils';

export const requestFees = () => requestAuthenticated('/admin/pairs');

export const feeUpdate = (id, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};

	return requestAuthenticated(`/admin/pairs/fees/${id}`, options);
};
