const USER_DATA_KEYS = [
	'first_name',
	'last_name',
	'gender',
	'dob',
	'nationality',
	'address',
	'phone_number',
	'bank_name',
	'bank_account_number',
];

const INITIAL_API_OBJECT = {
	data: [],
	count: 0,
};

const INITIAL_OTP_OBJECT = {
	requesting: false,
	requested: false,
	error: '',
	secret: '',
	activated: false,
};

const extractuserData = (data) => {
	const userData = {}
	USER_DATA_KEYS.forEach((key) => {
		userData[key] = data[key];
	})
	return userData;
};

const sortByDate = (a, b) => {
	return new Date(a) <= new Date(b);
}

const INITIAL_STATE = {
	id: null,
	email: null,
	balance: {},
	crypto_wallet: {},
	userData: {},
	fetching: false,
	fee: 0,
	verification_level: 0,
	otp_enabled: false,
	trades: INITIAL_API_OBJECT,
	otp: INITIAL_OTP_OBJECT
};

export default function reducer(state = INITIAL_STATE, action) {
	switch(action.type) {

		case 'SET_ME': {
			const {id, email, balance, crypto_wallet, bank_account_number, bank_name, verification_level, otp_enabled} = action.payload;
			const userData = extractuserData(action.payload);
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet, bank_account_number, bank_name, verification_level, userData, otp_enabled}
		}

		case 'SET_BALANCE': {
			let balance =  action.payload
			return {...state, balance}
		}

		// WITHDRAW
		case 'PROCESS_WITHDRAW_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'PROCESS_WITHDRAW_REJECTED': {
			return {...state, fetching: false, error: action.payload}
		}
		case 'PROCESS_WITHDRAW_FULFILLED': {
			return {...state, fetching: false, fetched: true, data:action.payload.data}
		}
		// USER_IDENTITY
		case 'USER_IDENTITY_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'USER_IDENTITY_REJECTED': {
			return {...state, fetching: false, error: action.payload}
		}
		case 'USER_IDENTITY_FULFILLED': {
			return {...state, fetching: false, fetched: true, userData:action.payload.data}
		}
		// UPLOAD_FILE
		case 'UPLOAD_FILE_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'UPLOAD_FILE_REJECTED': {
			return {...state, fetching: false, error: action.payload}
		}
		case 'UPLOAD_FILE_FULFILLED': {
			return {...state, fetching: false, fetched: true, userData:action.payload.data}
		}

		// USER_TRADES
		case 'USER_TRADES_PENDING': {
			return {...state, fetching: true, fetched: false, error: null, trades: INITIAL_API_OBJECT}
		}
		case 'USER_TRADES_REJECTED': {
			return {...state, fetching: false, error: action.payload}
		}
		case 'USER_TRADES_FULFILLED': {
			return {...state, fetching: false, trades: { count: action.payload.count, data: state.trades.data.concat(action.payload.data).sort(sortByDate)}}
		}

		case 'ADD_TRADES': {
			// check if we have trades from DB
			if (state.trades.count > 0) {
				return {
					...state,
					trades: {
						count: state.trades.count + action.payload.length,
						data: state.trades.data.concat(action.payload).sort(sortByDate)
					}
				}
			}

			break;
		}
		// USER_DEPOSITS
		case 'USER_DEPOSITS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'USER_DEPOSITS_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
		}
		case 'USER_DEPOSITS_FULFILLED': {
			return {...state, fetching: false,deposits: action.payload.data}
		}
		// USER_WITHDRAWALS
		case 'USER_WITHDRAWALS_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'USER_WITHDRAWALS_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
		}
		case 'USER_WITHDRAWALS_FULFILLED': {
			return {...state, fetching: false,  withdrawals: action.payload.data}
		}
		// REQUEST_OTP
		case 'REQUEST_OTP_PENDING':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					requesting: true,
				}
			}
		case 'REQUEST_OTP_REJECTED':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					error: action.payload.message
				}
			}
		case 'REQUEST_OTP_FULFILLED':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					requested: true,
					secret: action.payload.secret
				}
			}

		case 'ACTIVATE_OTP':
			return {
				...state,
				otp: {
					...state.otp,
					activated: true,
				}
			}

		// ACTIVATE_OTP
		case 'ACTIVATE_OTP_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'ACTIVATE_OTP_REJECTED': {
			return {...state, fetching: false,otpError: action.payload.response.data.message}
		}
		case 'ACTIVATE_OTP_FULFILLED': {
			return {...state, fetching: false,  activateOtp: action.payload.data}
		}
		// DEACTIVATE_OTP
		case 'DEACTIVATE_OTP_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'DEACTIVATE_OTP_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
		}
		case 'DEACTIVATE_OTP_FULFILLED': {
			return {...state, fetching: false,  deactivateOtp: action.payload.data}
		}

		case 'LOGOUT':
			return INITIAL_STATE;
	}
	return state;
}
