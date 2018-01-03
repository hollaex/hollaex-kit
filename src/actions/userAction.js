import axios from 'axios';
import _ from 'lodash';
import querystring from 'query-string';
import { all } from 'bluebird';

export function getMe() {
	return {
		type: 'GET_ME',
		payload: axios.get('/user')
	};
}

export function setMe(user) {
	return {
		type: 'SET_ME',
		payload: user
	};
}

export const setUserData = (data) => ({
	type: 'SET_USER_DATA',
	payload: data
});

export function setBalance(balance) {
	return {
		type: 'SET_BALANCE',
		payload: balance
	};
}

export function processWithdraw(data) {
	return (dispatch) => {
		dispatch({
			type: 'PROCESS_WITHDRAW_PENDING'
		});
		axios
			.post('/withdraw', data)
			.then((res) => {
				dispatch({
					type: 'PROCESS_WITHDRAW_FULFILLED',
					payload: res
				});
			})
			.catch((err) => {
				dispatch({
					type: 'PROCESS_WITHDRAW_REJECTED',
					payload: err.response
				});
			});
	};
}

export const updateUser = (values) => {
	const userValues = {};
	if (values.full_name) {
		userValues.full_name = values.full_name;
	}
	userValues.gender = values.gender;
	if (values.dob) {
		userValues.dob = new Date(values.dob);
	}
	userValues.nationality = values.nationality;
	userValues.address = {
		address: values.address,
		city: values.city,
		country: values.country,
		postal_code: values.postal_code
	};

	userValues.id_data = {
		// type: values.nationality === 'IR' ? 'id' : 'passport',
		number: values.id_number,
		issued_date: values.id_issued_date,
		expiration_date: values.id_expiration_date
	};

	return axios.put('/user', userValues);
};

export const updateDocuments = (values) => {
	const formData = new FormData();

	Object.entries(values).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return axios({
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		data: formData,
		url: '/user/verification',
		method: 'POST'
	});
};

export const otpActivate = (values) => axios.post('/user/activateOTP', values);
export const otpRevoke = (values) => axios.post('/user/deactivateOTP', values);
export const resetPassword = (values) =>
	axios.post('/user/change-password', values);
export const otpSetActivated = (active = true) =>
	active
		? {
				type: 'ACTIVATE_OTP'
			}
		: {
				type: 'REVOKE_OTP'
			};

export function userIdentity(data) {
	return (dispatch) => {
		dispatch({
			type: 'USER_IDENTITY_PENDING'
		});
		axios
			.put('/user', data)
			.then((res) => {
				dispatch({
					type: 'USER_IDENTITY_FULFILLED',
					payload: res
				});
			})
			.catch((err) => {
				dispatch({
					type: 'USER_IDENTITY_REJECTED',
					payload: err.response
				});
			});
	};
}
export function uploadFile(data) {
	const formData = new FormData();
	Object.keys(data).forEach((key) => {
		formData.append(key, data[key]);
	});

	return (dispatch) => {
		dispatch({
			type: 'UPLOAD_FILE_PENDING'
		});
		axios({
			headers: { 'Content-Type': 'multipart/form-data' },
			data: formData,
			url: '/user/verification',
			method: 'POST'
		})
			.then((res) => {
				dispatch({
					type: 'UPLOAD_FILE_FULFILLED',
					payload: res
				});
			})
			.catch((err) => {
				dispatch({
					type: 'UPLOAD_FILE_REJECTED',
					payload: err.response
				});
			});
	};
}

export function userDeposits() {
	return {
		type: 'USER_DEPOSITS',
		payload: axios.get('/user/deposits')
	};
}
export function userWithdrawals() {
	return {
		type: 'USER_WITHDRAWALS',
		payload: axios.get('/user/withdrawals')
	};
}

export function otpRequest() {
	return (dispatch) => {
		dispatch({ type: 'REQUEST_OTP_PENDING' });
		axios
			.get('/user/requestOTP')
			.then((body) => {
				dispatch({
					type: 'REQUEST_OTP_FULFILLED',
					payload: body.data
				});
			})
			.catch((err) => {
				dispatch({
					type: 'REQUEST_OTP_REJECTED',
					payload: err.response.data
				});
			});
	};
}
export function deactivateOTP() {
	return {
		type: 'DEACTIVATE_OTP',
		payload: axios.get('/deactivateOTP')
	};
}
