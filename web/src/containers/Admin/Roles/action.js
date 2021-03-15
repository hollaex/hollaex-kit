import querystring from 'query-string';
import { requestAuthenticated } from '../../../utils';

export const updateRole = (values, params) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/user/role?${querystring.stringify(params)}`,
		options
	);
};

export const requestRole = () => requestAuthenticated('/admin/operators');

export const inviteOperator = (values) =>
	requestAuthenticated(
		`/admin/operator/invite?${querystring.stringify(values)}`
	);
