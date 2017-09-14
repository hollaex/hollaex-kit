

const initialState = {
	token: null,
	fetching: false,
	fetched: false,
	error: null,
	requestResetPasswordPending: false,
	requestResetPasswordComplete: false,
	resetPasswordPending: false,
	resetPasswordComplete: false,
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
			return {...state, fetching: false, error: action.payload.data.error, errMsg: action.payload.data }
			break;
		}
		case 'SIGNUP_USER_FULFILLED': {
			return {...state, fetching: false, fetched: true, user: action.payload.data}
			break;
		}
		//EMAIL
		case 'USER_EMAIL': {
				return {...state, fetching: false, fetched: true, userEmail: action.payload}
				break;
			}
		//VERIFICATION
		case 'VERIFICATION_REJECTED': {
			return {...state, fetching: false, message: action.payload.response.data.message}
			break;
		}
		case 'VERIFICATION_FULFILLED': {
			return {...state, fetching: false, fetched: true, message: action.payload.data.message}
			break;
		}

		//LOGIN
		case 'LOGIN_USER_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'LOGIN_USER_REJECTED': {
			return {...state, fetching: false, error: action.payload.data.message}
			break;
		}
		case 'LOGIN_USER_FULFILLED': {
			return {...state, fetching: false, fetched: true, token: action.payload}
			break;
		}
		
		// RESET PASSWORD
		case 'RESET_PASSWORD_PENDING': {
			return {...state, resetPasswordPending: true, resetPasswordComplete: false}
			break;
		}
		case 'RESET_PASSWORD_REJECTED': {
			return {...state, resetPasswordPending: false, error: action.payload.message}
			break;
		}
		case 'RESET_PASSWORD_FULFILLED': {
			return {...state, resetPasswordPending: false, resetPasswordComplete: true}
			break;
		}

		// requestResetPassword
		case 'REQUEST_RESET_PASSWORD_PENDING': {
			return {...state, requestResetPasswordPending: true, requestResetPasswordComplete: false}
			break;
		}
		case 'REQUEST_RESET_PASSWORD_REJECTED': {
			return {...state, requestResetPasswordPending: false, error: action.payload.message}
			break;
		}
		case 'REQUEST_RESET_PASSWORD_FULFILLED': {
			return {...state, requestResetPasswordPending: false, requestResetPasswordComplete: true}
			break;
		}

		case 'LOAD_TOKEN': {
			return {...state, token: action.payload}
			break;
		}
	}
	return state;
}