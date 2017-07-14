import axios from 'axios'

const initialState = {
	token: null,
	fetching: false,
	fetched: false,
	error: null,
}

export default function reducer(state=initialState, action) {
	switch(action.type) {
		//SIGNUP
		case 'SIGNUP_USER_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'SIGNUP_USER_REJECTED': {
			alert('Choose a stronger password')
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'SIGNUP_USER_FULFILLED': {
			return {...state, fetching: false, fetched: true, user: action.payload.data}
			break;
		}

		//LOGIN
		case 'LOGIN_USER_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'LOGIN_USER_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.message}
			break;
		}
		case 'LOGIN_USER_FULFILLED': {
			return {...state, fetching: false, fetched: true, token: action.payload}
			break;
		}
		
		// RESET PASSWORD
		case 'RESET_PASSWORD_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'RESET_PASSWORD_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'RESET_PASSWORD_FULFILLED': {
			return {...state, fetching: false, fetched: true}
			break;
		}

		// requestResetPassword
		case 'REQUEST_RESET_PASSWORD_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'REQUEST_RESET_PASSWORD_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'REQUEST_RESET_PASSWORD_FULFILLED': {
			return {...state, fetching: false, fetched: true}
			break;
		}

		case 'LOAD_TOKEN': {
			return {...state, token: action.payload}
			break;
		}
	}
	return state;
}