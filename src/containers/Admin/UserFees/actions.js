import { requestAuthenticated } from '../../../utils';

export const requestFees = () => requestAuthenticated('/admin/pairs/fees');

export const feeUpdate = (id, values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	console.log(options);

	return requestAuthenticated(`/admin/pairs/fees/${id}`, options);
};
