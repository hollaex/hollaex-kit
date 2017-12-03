import axios from 'axios';
import { browserHistory } from 'react-router'
import querystring from 'query-string';
import { normalizeEmail } from 'validator';
import store from '../store'
import { setToken, removeToken, getToken } from '../utils/token';

export function signup(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'SIGNUP_USER_PENDING'
		});
		axios.post('/signup', data)
		.then(res => {
			dispatch(getEmail(data.email));
			dispatch({
			    type: 'SIGNUP_USER_FULFILLED'
			});
		})
		.catch(err => {
			dispatch({
			    type: 'SIGNUP_USER_REJECTED',
			    payload: err.response.data
			});
		})
	})
}
export function getEmail(data) {
	localStorage.setItem('email', data);
	return ((dispatch) => {
		dispatch({ type: 'USER_EMAIL', payload: data });
	})
}
export function verify(data) {
	return {
		type: 'VERIFICATION',
		payload: axios.post('/verify', data)
	}
}

export function checkVerificationCode(data) {
		return ((dispatch) => {
			dispatch({ type: 'CHECK_VERIFICATION_CODE_PENDING' });
			axios.get(`/verify?${querystring.stringify(data)}`)
				.then((response) => {
					dispatch({
						type: 'CHECK_VERIFICATION_CODE_FULFILLED',
						payload: response.data,
					});
				})
				.catch((error) => {
					dispatch({
						type: 'CHECK_VERIFICATION_CODE_REJECTED',
						payload: error.response.data,
					});
				});
		});
}

export function verifyVerificationCode(data) {
		return ((dispatch) => {
			dispatch({ type: 'VERIFY_VERIFICATION_CODE_PENDING' });
			axios.post('/verify', data)
				.then((response) => {
					dispatch({
						type: 'VERIFY_VERIFICATION_CODE_FULFILLED',
						payload: response.data,
					});
				})
				.catch((error) => {
					dispatch({
						type: 'VERIFY_VERIFICATION_CODE_REJECTED',
						payload: error.response.data,
					});
				});
		});
}

export const performLogin = (values) => axios.post('/login', values)
	.then((res) => {
		setTokenInApp(res.data.token, true);
		store.dispatch({
			type: 'VERIFY_TOKEN_FULFILLED',
			payload: res.data.token
		});
		return res;
	});

export const performSignup = (values) => axios.post('/signup', values);

export function login(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'LOGIN_USER_PENDING'
		});
		axios.post('/login', data)
		.then((res) => {
			setTokenInApp(res.data.token, true)
			dispatch({
			    type: 'LOGIN_USER_FULFILLED',
			    payload: res.data.token,
			});
			browserHistory.push('/');
		})
		.catch((err) => {
			dispatch({
			    type: 'LOGIN_USER_REJECTED',
			    payload: err.response
			});
		})

	})
}

const setTokenInApp = (token, setInStore = false) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	if (setInStore) {
		setToken(token);
	}
}

const cleatTokenInApp = (router) => {
	axios.defaults.headers.common['Authorization'] = {};
	removeToken();
	router.push('/');
}

export function verifyToken(token) {
	return ((dispatch) => {
		dispatch({ type: 'VERIFY_TOKEN_PENDING' });
		axios({
	    method: 'GET',
	    url: '/verify_token',
	    headers: {
	      'Authorization': `Bearer ${token}`,
	    }
	  })
			.then((response) => {
				setTokenInApp(token);
				dispatch({
					type: 'VERIFY_TOKEN_FULFILLED',
					payload: token
				});
			})
			.catch((error) => {
				dispatch({
					type: 'VERIFY_TOKEN_REJECTED',
				});
				cleatTokenInApp(browserHistory);
			});
	});
}

export const logout = () => (dispatch) => {
	dispatch({
		type: 'LOGOUT',
	});
	cleatTokenInApp(browserHistory);
}

export function loadToken() {
	let token = getToken();
	return {
		type: 'LOAD_TOKEN',
		payload: token
	}
}

export const requestVerificationEmail = (data) => axios.get(`/verify?${querystring.stringify({ ...data, resend: true })}`)
export const requestResetPassword = (values) => {
	const qs = querystring.stringify(values);
	return axios.get(`/reset-password?${qs}`);
}

export const resetPassword = (data) => axios.post('/reset-password', data);
