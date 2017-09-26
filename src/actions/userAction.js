import axios from 'axios';
import _ from 'lodash'
import querystring from 'query-string';
import { all } from 'bluebird';

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

const FILE_KEYS = ['front', 'back', 'proof_of_residence'];
export const updateUser = (values) => {
	const userData = {};
	const userFiles = new FormData();

	Object.entries(values).forEach(([key, value]) => {
		if (FILE_KEYS.indexOf(key) > -1) {
			console.log(key, value)
			userFiles.append(key, value);
		} else {
			userData[key] = value;
		}
	});

	console.log(userData)
	console.log(userFiles.toString())
	return all([
		axios.put('/user', userData),
		axios({
			data: userFiles,
			url: '/user/verification',
			method: 'POST'
		})
	]);
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
			    payload: res
			});
		})
		.catch(err => {
			dispatch({
			    type: 'UPLOAD_FILE_REJECTED',
			    payload: err.response
			});
		})
	})
}

export function addTrades(trades) {
	return {
		type: 'ADD_TRADES',
		payload: trades,
	}
};

export function userTrades(limit = 100, page = 1) {
	const query = querystring.stringify({
		symbol: 'btc',
		page,
		limit,
	});

	return ((dispatch) => {
		dispatch({ type: 'USER_TRADES_PENDING' });
		axios.get(`/user/trades?${query}`)
			.then((body) => {
				dispatch({
				    type: 'USER_TRADES_FULFILLED',
				    payload: body.data,
				});
				if (body.data.count > page * limit) {
					dispatch(userTrades(limit, page + 1));
				}
			})
			.catch((err) => {
				dispatch({
				    type: 'USER_TRADES_REJECTED',
				    payload: err.response
				});
			})
	});
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
