import axios from 'axios';
import { browserHistory } from 'react-router'
import querystring from 'query-string';
import { normalizeEmail } from 'validator';
import store from '../store'

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
		localStorage.setItem('token', token);
		localStorage.setItem('time', new Date().getTime());
	}
}

const cleatTokenInApp = () => {
	axios.defaults.headers.common['Authorization'] = null;
	localStorage.removeItem('token');
	localStorage.clear();
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
				cleatTokenInApp();
				browserHistory.push('/login');
			});
	});
}

export const logout = () => (dispatch) => {
	cleatTokenInApp();
	dispatch({
		type: 'LOGOUT',
	});
	browserHistory.push('/login');
}

export function resetPassword(data) {
	return ((dispatch) => {
		dispatch({ type: 'RESET_PASSWORD_PENDING' });
		axios.post('/reset-password', data)
			.then((response) => {
				dispatch({
					type: 'RESET_PASSWORD_FULFILLED',
				});
			})
			.catch((error) => {
				dispatch({
					type: 'RESET_PASSWORD_REJECTED',
					payload: error.response.data
				});
			});
	});
}

export function requestResetPassword(email) {
	const qs = querystring.stringify({ email });
	return ((dispatch) => {
		dispatch({ type: 'REQUEST_RESET_PASSWORD_PENDING' });
		axios.get(`/reset-password?${qs}`)
			.then((response) => {
				dispatch({
					type: 'REQUEST_RESET_PASSWORD_FULFILLED',
				});
			})
			.catch((error) => {
				dispatch({
					type: 'REQUEST_RESET_PASSWORD_REJECTED',
					payload: error.response.data
				});
			});
	});
}

export function loadToken() {
	let token = localStorage.getItem('token')
	return {
		type: 'LOAD_TOKEN',
		payload: token
	}
}
