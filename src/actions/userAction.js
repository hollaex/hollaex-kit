import axios from 'axios';
import _ from 'lodash'

export function getMe() {
	return {
		type: 'GET_ME',
		payload: axios.get('/user'),
	}
}

export function setMe(user) {
	return {
		type: 'SET_ME',
		payload: user
	}
}

export function setBalance(balance) {
	return {
		type: 'SET_BALANCE',
		payload: balance
	}
}

export function processWithdraw(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'PROCESS_WITHDRAW_PENDING'
		});
		axios.post('/withdraw',data)
		.then(res => {
			dispatch({
			    type: 'PROCESS_WITHDRAW_FULFILLED',
			    payload:res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'PROCESS_WITHDRAW_REJECTED',
			    payload:err.response
			});
		})	
	})
}
export function userIdentity(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'USER_IDENTITY_PENDING'
		});
		axios.put('/user',data)
		.then(res => {
			dispatch({
			    type: 'USER_IDENTITY_FULFILLED',
			    payload:res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'USER_IDENTITY_REJECTED',
			    payload:err.response
			});
		})	
	})
}
export function uploadFile(data) {	
	const formData = new FormData();
	Object.keys(data).forEach((key) => {
		formData.append(key, data[key]);
	});

	return ((dispatch) => {
		dispatch({
		    type: 'UPLOAD_FILE_PENDING'
		});
		axios({
			headers: {'Content-Type': 'multipart/form-data'},
			data: formData,
			url: '/user/verification',
			method: 'POST'
		})
		.then(res => {
			dispatch({
			    type: 'UPLOAD_FILE_FULFILLED',
			    payload:res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'UPLOAD_FILE_REJECTED',
			    payload:err.response
			});
		})	
	})
}

export function userTrades() {
	return {
		type: 'USER_TRADES',
		payload: axios.get('/user/trades'),
	}
}
export function userDeposits() {
	return {
		type: 'USER_DEPOSITS',
		payload: axios.get('/user/deposits'),
	}
}
export function userWithdrawals() {
	return {
		type: 'USER_WITHDRAWALS',
		payload: axios.get('/user/withdrawals'),
	}
}

export function requestOTP() {
	return {
		type: 'REQUEST_OTP',
		payload: axios.get('/requestOTP'),
	}
}
export function activateOTP(otp) {
	return {
		type: 'ACTIVATE_OTP',
		payload: axios.post('/activateOTP',otp),
	}
}
export function deactivateOTP() {
	return {
		type: 'DEACTIVATE_OTP',
		payload: axios.get('/deactivateOTP'),
	}
}

