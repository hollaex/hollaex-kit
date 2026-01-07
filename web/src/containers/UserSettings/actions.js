import { requestAuthenticated } from 'utils';

export const createSubAccount = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/subaccount`, options);
};

export const getSubAccounts = () => {
	const options = {
		method: 'GET',
	};
	return requestAuthenticated('/subaccounts', options);
};

export const transferSubAccountFunds = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated('/subaccount/transfer', options);
};

export const switchSubAccount = (subaccountId) => {
	const options = {
		method: 'POST',
		body: JSON.stringify({ subaccount_id: subaccountId }),
	};
	return requestAuthenticated('/subaccount/auth', options);
};

export const deactivateSubAccount = (subaccountId) => {
	const options = {
		method: 'DELETE',
		body: JSON.stringify({ subaccount_id: subaccountId }),
	};
	return requestAuthenticated('/subaccount', options);
};

export const getSharedAccounts = () => {
	return requestAuthenticated(`/sharedaccounts/shared`);
};

export const getSharedWithAccounts = () => {
	return requestAuthenticated(`/sharedaccounts/access`);
};

export const addShareAccount = (values = {}) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	const req = requestAuthenticated(`/sharedaccount`, options);
	return req;
};

export const requestShareAccount = (values = {}) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	const req = requestAuthenticated(`/sharedaccount/auth`, options);
	return req;
};

export const updateSharedAccount = ({ shareId, type = '' }) => {
	if (type === '') return false;
	let endpoint = '/sharedaccount/' + type;
	const options = {
		method: 'POST',
		body: JSON.stringify({ sharedaccount_id: shareId }),
	};
	return requestAuthenticated(endpoint, options);
};
