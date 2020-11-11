import axios from 'axios';
import { requestAuthenticated } from '../../../utils';

export const updateTier = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/tier`, options);
};

export const addNewTier = (values) => {
	const options = {
		method: 'POST',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/tier`, options);
};

export const requestTiers = () => requestAuthenticated('/tiers');

export const upload = (formData) => {
	const options = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		data: formData,
		method: 'POST',
	};

	return axios('/admin/upload', options);
};

export const updateFees = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/pair/fees`, options);
};

export const updateLimits = (values) => {
	const options = {
		method: 'PUT',
		body: JSON.stringify(values),
	};
	return requestAuthenticated(`/admin/tiers/limits`, options);
};
