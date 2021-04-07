import axios from 'axios';
import { browserHistory } from 'react-router';
import querystring from 'query-string';
import store from '../store';
import { setToken, removeToken, getToken } from '../utils/token';

export function getEmail(data) {
	localStorage.setItem('email', data);
	return (dispatch) => {
		dispatch({ type: 'USER_EMAIL', payload: data });
	};
}

export function checkVerificationCode(data) {
	return (dispatch) => {
		dispatch({ type: 'CHECK_VERIFICATION_CODE_PENDING' });
		axios
			.get(`/verify?${querystring.stringify(data)}`)
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
	};
}

export function verifyVerificationCode(data) {
	return (dispatch) => {
		dispatch({ type: 'VERIFY_VERIFICATION_CODE_PENDING' });
		axios
			.post('/verify', data)
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
	};
}

export const performLogin = (values) =>
	axios.post('/login', values).then((res) => {
		storeLoginResult(res.data.token);
		return res;
	});

export const storeLoginResult = (token) => {
	if (token) {
		setTokenInApp(token, true);
		store.dispatch({
			type: 'VERIFY_TOKEN_FULFILLED',
			payload: token,
		});
	}
};

export const performSignup = (values) => axios.post('/signup', values);

const setTokenInApp = (token, setInStore = false) => {
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	if (setInStore) {
		setToken(token);
	}
};

const cleatTokenInApp = (router, path = '/') => {
	axios.defaults.headers.common['Authorization'] = {};
	removeToken();
	localStorage.removeItem('deposit_initial_display');
	router.push(path);
};

export function verifyToken(token) {
	return (dispatch) => {
		dispatch({ type: 'VERIFY_TOKEN_PENDING' });
		axios({
			method: 'GET',
			url: '/verify-token',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => {
				setTokenInApp(token);
				dispatch({
					type: 'VERIFY_TOKEN_FULFILLED',
					payload: token,
				});
			})
			.catch((error) => {
				const message = error.response
					? error.response.data.message
					: 'Invalid token';
				logout(message)(dispatch);
				dispatch({
					type: 'VERIFY_TOKEN_REJECTED',
				});
				cleatTokenInApp(browserHistory, '/login');
			});
	};
}

export const logout = (message = '') => (dispatch) => {
	dispatch({
		type: 'LOGOUT',
		payload: {
			message,
		},
	});
	cleatTokenInApp(browserHistory, '/login');
};

export const setLogoutMessage = (message = '') => ({
	type: 'SET_LOGOUT_MESSAGE',
	payload: {
		message,
	},
});

export function loadToken() {
	let token = getToken();
	return {
		type: 'LOAD_TOKEN',
		payload: token,
	};
}

export const requestVerificationEmail = (data) =>
	axios.get(`/verify?${querystring.stringify({ ...data, resend: true })}`);

export const requestResetPassword = (values) => {
	const qs = querystring.stringify(values);
	return axios.get(`/reset-password?${qs}`);
};

export const resetPassword = (data) => axios.post('/reset-password', data);

export const storeAdminKey = (data) =>
	axios.put('/admin/network-credentials', data);

export const adminSignup = (data) => axios.post('/admin/signup', data);

export const adminLogIn = (data) => axios.post('/login ', data);
