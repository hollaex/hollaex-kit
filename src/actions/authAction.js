import axios from 'axios';

const baseURL = "http://holla-jan4-dev.ap-northeast-2.elasticbeanstalk.com/v0"

export function signup(email, password, isTermsAndConditionsAccepted) {
	return {
		type: 'SIGNUP_USER',
		payload: axios.post(`${baseURL}/signup`, {
            "password": password,
            "email": email,
            "isTermsAndConditionsAccepted": isTermsAndConditionsAccepted
		})
	}
}
export function login(email, password) {
	return ((dispatch) => {
		dispatch({
		    type: 'LOGIN_USER_PENDING'
		});
		axios.post(`${baseURL}/login/`, {
			"email": email,
            "password": password
		})
		.then( res => {
			let token = res.data.authToken
			// axios.defaults.headers.common['Authorization'] = token
			localStorage.setItem('token', token);
			dispatch({
			    type: 'LOGIN_USER_FULFILLED',
			    payload: token
			});
		})
		.catch( err => {
			dispatch({
			    type: 'LOGIN_USER_REJECTED',
			    payload: err
			});
		})
		
	})
}

export function resetPassword() {
	return {
		type: 'RESET_PASSWORD',
		payload: axios.put(`${baseURL}/login/reset-password`)
	}
}

export function requestResetPassword(email) {
	return {
		type: 'REQUEST_RESET_PASSWORD',
		payload: axios.put(`${baseURL}/login/request-password-reset`, {
			email
		})
	}
}

export function loadToken() {
	let token = localStorage.getItem('token')
	return {
		type: 'LOAD_TOKEN',
		payload: token
	}
}