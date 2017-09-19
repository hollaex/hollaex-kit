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

export default function reducer(state={
	id: null,
	email: null,
	balance: {},
	crypto_wallet: {},
	userData: {},
	fetching: false,
	fee: 0,
	verification_level: 0,
	trades: INITIAL_API_OBJECT,
}, action) {
	switch(action.type) {
		// GETME user profile
		case 'GET_ME_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'GET_ME_REJECTED': {
			return {...state, fetching: false, error: action.payload.response.data.error}
		}
		case 'GET_ME_FULFILLED': {
			var {id, email, balance, crypto_wallet, bank_account_number, bank_name, verification_level} = action.payload.data
			const userData = extractuserData(action.payload.data);
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet, bank_account_number, bank_name, verification_level, userData}
		}

		case 'SET_ME': {
			let {id, email, balance, crypto_wallet, verification_level} = action.payload
			const userData = extractuserData(action.payload)
			return {...state, fetching: false, fetched: true, id, email, balance, crypto_wallet, userData, verification_level}
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
		case 'REQUEST_OTP_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
		}
		case 'REQUEST_OTP_REJECTED': {
			return {...state, fetching: false,error: action.payload.response}
		}
		case 'REQUEST_OTP_FULFILLED': {
			return {...state, fetching: false,otp: action.payload.data}
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

	}
	return state;
}
