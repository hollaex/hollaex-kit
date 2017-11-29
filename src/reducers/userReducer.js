const USER_DATA_KEYS = [
	'first_name',
	'last_name',
	'gender',
	'dob',
	'nationality',
	'address',
	'phone_number',
	'id_data',
	'bank_account',
];

const INITIAL_OTP_OBJECT = {
	requesting: false,
	requested: false,
	error: '',
	secret: '',
	activated: false,
};

const extractuserData = (data) => {
	const userData = {
		timestamp: Date.now()
	}
	USER_DATA_KEYS.forEach((key) => {
		if (data.hasOwnProperty(key)) {
			userData[key] = data[key];
			if (key === 'phone_number') {
				const phoneParts = data[key] ? data[key].split(' ', 2) : ['', ''];
				userData.phone_country = phoneParts[0];
				userData.phone_number = phoneParts[1];
			}
		}
	})

	return userData;
};

const sortByDate = (a, b) => {
	return new Date(a) <= new Date(b);
}

const INITIAL_STATE = {
	id: null,
	email: null,
	balance: {
		timestamp: Date.now()
	},
	crypto_wallet: {},
	userData: {
		timestamp: Date.now()
	},
	fetching: false,
	fee: 0,
	verification_level: 0,
	otp_enabled: false,
	otp: INITIAL_OTP_OBJECT
};

export default function reducer(state = INITIAL_STATE, action) {
	switch(action.type) {

		case 'SET_ME': {
			const {id, email, balance, crypto_wallet, verification_level, otp_enabled} = action.payload;
			const userData = extractuserData(action.payload);
			return {
				...state,
				fetching: false,
				fetched: true,
				id,
				email,
				balance: {
					...state.balance,
					...balance,
					timestamp: Date.now()
				},
				crypto_wallet,
				verification_level,
				userData,
				otp_enabled
			}
		}

		case 'SET_USER_DATA': {
			const userData = extractuserData(action.payload);
			return {
				...state,
				userData: {
					...state.userData,
					...userData,
				}
			}
		}
		case 'SET_BALANCE':
			return {
				...state,
				balance: {
					...state.balance,
					...action.payload,
					timestamp: Date.now()
				}
			};

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
				},
				otp_enabled: true,
			}

		case 'REVOKE_OTP':
			return {
				...state,
				otp: INITIAL_OTP_OBJECT,
				otp_enabled: false,
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
