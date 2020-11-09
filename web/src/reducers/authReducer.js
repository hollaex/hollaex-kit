import { decodeToken } from '../utils/token';
import { USER_TYPES } from '../actions/appActions';

const VERIFICATION = {
	data: {},
	fetching: false,
	fetched: false,
	hasValidData: false,
	error: '',
};

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
	logoutMessage: '',
	userType: USER_TYPES.USER_TYPE_NORMAL,
};

export default function reducer(state = INITIAL_STATE, { type, payload }) {
	switch (type) {
		//EMAIL
		case 'USER_EMAIL':
			return {
				...state,
				fetching: false,
				fetched: true,
				userEmail: payload,
			};
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
					data: payload,
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
					error: payload.message,
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
					error: payload.message,
				},
			};

		// Verify token
		case 'VERIFY_TOKEN_PENDING':
			return {
				...state,
				fetching: true,
				verifyingToken: true,
			};
		case 'VERIFY_TOKEN_REJECTED':
			return {
				...state,
				fetching: false,
				verifyingToken: false,
			};
		case 'VERIFY_TOKEN_FULFILLED':
			const decodedToken = decodeToken(payload);
			const userType =
				decodedToken &&
				decodedToken.scopes &&
				decodedToken.scopes.includes(USER_TYPES.USER_TYPE_ADMIN)
					? USER_TYPES.USER_TYPE_ADMIN
					: USER_TYPES.USER_TYPE_NORMAL;
			return {
				...state,
				fetching: false,
				verifyingToken: false,
				fetched: true,
				token: payload,
				userType,
			};
		case 'LOAD_TOKEN':
			return {
				...state,
				token: payload,
			};

		case 'SET_LOGOUT_MESSAGE':
			return {
				...state,
				logoutMessage: payload.message,
			};
		case 'LOGOUT':
			return {
				...INITIAL_STATE,
				logoutMessage: payload.message,
			};
		default:
			return state;
	}
}
