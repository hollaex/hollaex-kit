import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

export const requestDeposits = (query) => {
	const queryValues = querystring.stringify(query);
	const path = `/admin/deposits${queryValues ? `?${queryValues}` : ''}`;
	return requestAuthenticated(path);
};

export const completeDeposits = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values)
	};
	return requestAuthenticated('/admin/deposit/verify', options);
};

export const dismissDeposit = (deposit_id, dismissed) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ dismissed })
	};
	return requestAuthenticated(
		`/admin/deposits/${deposit_id}/dismiss`,
		options
	);
};
