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

export const requestRole = (values) =>
	requestAuthenticated(`/admin/operators?${querystring.stringify(values)}`);

export const inviteOperator = (values) =>
	requestAuthenticated(
		`/admin/operator/invite?${querystring.stringify(values)}`
	);

export const fetchRoles = (params) => {
	const options = {
		method: 'GET',
	};
	return requestAuthenticated(
		`/admin/role?${querystring.stringify(params)}`,
		options
	);
};

export const fetchEndpoints = () => {
	const options = {
		method: 'GET',
	};
	return requestAuthenticated(`/admin/endpoints`, options);
};

export const createRoles = (values, params) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/role?${querystring.stringify(params)}`,
		options
	);
};

export const updateRoles = (values, params) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/role?${querystring.stringify(params)}`,
		options
	);
};

export const deleteRoles = (values, params) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/role?${querystring.stringify(params)}`,
		options
	);
};

export const assignRole = (values, params) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(
		`/admin/role/assign?${querystring.stringify(params)}`,
		options
	);
};
