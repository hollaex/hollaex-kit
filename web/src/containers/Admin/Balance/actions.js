import { requestAuthenticated } from '../../../utils';

export const performBalanceUpdate = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};

	return requestAuthenticated('/admin/deposit', options);
};
