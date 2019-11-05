import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

export const requestDeposits = (query) => {
	const queryValues = querystring.stringify(query);
	const path = `/admin/deposits${queryValues ? `?${queryValues}` : ''}`;
	return requestAuthenticated(path);
};
export const requestdate = () => {
	const path = `/admin/deposits?start_date=[2018-06-01T01:42:43.233Z]&end_date=[2018-07-01T01:42:43.233Z]`;
	return requestAuthenticated(path);
};

export const completeDeposits = (id, status) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ status })
	};
	return requestAuthenticated(`/admin/deposit/${id}/verify`, options);
};

export const dismissDeposit = (deposit_id, dismissed) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify({ dismissed })
	};
	return requestAuthenticated(`/admin/deposits/${deposit_id}/dismiss`, options);
};
