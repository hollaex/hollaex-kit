const VERIFICATION = {
	data: {},
	fetching: false,
	fetched: false,
	hasValidData: false,
	error: ''
}

const INITIAL_STATE = {
	token: null,
	verifyingToken: false,
	fetching: false,
	fetched: false,
	error: '',
	requestResetPasswordPending: false,
	requestResetPasswordComplete: false,
	resetPasswordPending: false,
	resetPasswordComplete: false,
	verification: VERIFICATION,
}

export default function reducer(state = INITIAL_STATE, action) {

	switch(action.type) {
		//SIGNUP
		case 'SIGNUP_USER_PENDING': {
			return {...state, fetching: true}
			break;
		}
		case 'SIGNUP_USER_REJECTED': {
			return {...state, fetching: false, error: action.payload.message }
			break;
		}
		case 'SIGNUP_USER_FULFILLED': {
			return {...state, fetching: false, fetched: true}
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

		case 'CHECK_VERIFICATION_CODE_PENDING':
			return {
				...state,
				verification: {
					...VERIFICATION,
					fetching: true,
				},
			};
		case 'CHECK_VERIFICATION_CODE_FULFILLED':
			return {
				...state,
				verification: {
					...VERIFICATION,
					fetching: true,
					fetched: true,
					data: action.payload,
					hasValidData: true,
				},
			};
		case 'CHECK_VERIFICATION_CODE_REJECTED':
			return {
				...state,
				verification: {
					...VERIFICATION,
					fetching: false,
					fetched: true,
					error: action.payload.message,
				},
			};
		case 'VERIFY_VERIFICATION_CODE_PENDING':
			return {
				...state,
				verification: {
					...VERIFICATION,
					fetching: true,
				},
			};
		case 'VERIFY_VERIFICATION_CODE_FULFILLED':
			return {
				...state,
				 verification: {
					 ...VERIFICATION,
					 fetched: true,
				 },
			 };
		case 'VERIFY_VERIFICATION_CODE_REJECTED':
			return {
				...state,
				verification: {
					...VERIFICATION,
					fetched: true,
					error: action.payload.message,
				},
			};

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
		// Verify token
		case 'VERIFY_TOKEN_PENDING':
			return { ...state, fetching: true, verifyingToken: true };
		case 'VERIFY_TOKEN_REJECTED':
			return { ...state, fetching: false, verifyingToken: false };
		case 'VERIFY_TOKEN_FULFILLED':
			return { ...state, fetching: false, verifyingToken: false, fetched: true, token: action.payload };

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

		case 'LOGOUT':
			return INITIAL_STATE;
	}
	return state;
}
