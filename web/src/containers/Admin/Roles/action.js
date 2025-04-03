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

export const fetchRoles = (params) => {
	const options = {
		method: 'GET',
	};
	return requestAuthenticated(
		`/admin/roles?${querystring.stringify(params)}`,
		options
	);
};

export const createRoles = (values, params) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/roles?${querystring.stringify(params)}`,
		options
	);
};

export const updateRoles = (values, params) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/roles?${querystring.stringify(params)}`,
		options
	);
};

export const deleteRoles = (values, params) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/roles?${querystring.stringify(params)}`,
		options
	);
};

export const assignRole = (values, params) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/roles/assign?${querystring.stringify(params)}`,
		options
	);
};
