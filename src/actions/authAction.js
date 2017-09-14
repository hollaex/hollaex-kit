import axios from 'axios';
import { browserHistory } from 'react-router'

export function signup(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'SIGNUP_USER_PENDING'
		});
		axios.post('/signup', data)
		.then(res => {
			dispatch(getEmail(data.email));
			dispatch({
			    type: 'SIGNUP_USER_FULFILLED',
			    payload: res
			});
			browserHistory.push('/verify');
		})
		.catch(err => {
			dispatch({
			    type: 'SIGNUP_USER_REJECTED',
			    payload: err.response
			});
			browserHistory.push('/signup');
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
export function login(data) {
	return ((dispatch) => {
		dispatch({
		    type: 'LOGIN_USER_PENDING'
		});
		axios.post('/login', data)
		.then( res => {
			let currentTime = new Date().getTime();
			let token = res.data.token
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			localStorage.setItem('token', token);
			localStorage.setItem('time', currentTime);
			dispatch({
			    type: 'LOGIN_USER_FULFILLED',
			    payload: token,
			});
			browserHistory.push('/dashboard');
		})
		.catch( err => {
			dispatch({
			    type: 'LOGIN_USER_REJECTED',
			    payload: err.response
			});
		})
		
	})
}

export function setToken(token) {
	return {
    	type: 'LOGIN_USER_FULFILLED',
    	payload: token
    }
}
export const logout = () => dispatch => {
	axios.defaults.headers.common['Authorization'] = null;
    localStorage.removeItem('token');
    localStorage.clear();
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
	return ((dispatch) => {
		dispatch({ type: 'REQUEST_RESET_PASSWORD_PENDING' });
		axios.get(`/reset-password?email=${email}`)
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