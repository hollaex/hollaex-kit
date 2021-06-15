import PhoneNumber from 'awesome-phonenumber';
import { DEFAULT_LANGUAGE, THEME_DEFAULT } from '../config/constants';
import { constructSettings } from '../utils/utils';

const USER_DATA_KEYS = [
	'full_name',
	'gender',
	'dob',
	'nationality',
	'address',
	'phone_number',
	'id_data',
	'bank_account',
	'email_verified',
];

const INITIAL_OTP_OBJECT = {
	requesting: false,
	requested: false,
	error: '',
	secret: '',
	activated: false,
};

const INITIAL_ADDRESS_OBJECT = {
	fetching: false,
	success: false,
	error: false,
};

const extractuserData = (data) => {
	const userData = {
		timestamp: Date.now(),
	};
	USER_DATA_KEYS.forEach((key) => {
		if (data.hasOwnProperty(key)) {
			userData[key] = data[key];
			if (key === 'phone_number') {
				const number = PhoneNumber(data[key]);
				userData.phone_country = `+${PhoneNumber.getCountryCodeForRegionCode(
					number.getRegionCode()
				)}`;
				userData.phone_number = number.getNumber('significant');
			}
		}
	});

	return userData;
};

const INITIAL_LIMIT_OBJECT = {
	data: [],
	fetching: false,
	fetched: false,
	error: '',
};

const INITIAL_FEES_OBJECT = {
	data: {},
	fetching: false,
	fetched: false,
	error: '',
};

const INITIAL_TRADE_VOLUME_OBJECT = {
	data: {},
	fetching: false,
	fetched: false,
	error: '',
};

const INITIAL_STATE = {
	id: null,
	email: null,
	balance: {
		timestamp: Date.now(),
	},
	wallet: [],
	userData: {
		timestamp: Date.now(),
	},
	fetching: false,
	fee: 0,
	verification_level: 0,
	otp_enabled: false,
	otp: INITIAL_OTP_OBJECT,
	fees: {
		maker_fee: 0,
		taker_fee: 0,
	},
	tokens: [],
	username: '',
	username_set: false,
	settings: {
		orderConfirmationPopup: true,
		theme: THEME_DEFAULT,
		language: DEFAULT_LANGUAGE,
		notification: {
			popup_order_confirmation: true,
			popup_order_completed: true,
			popup_order_partially_filled: true,
		},
		interface: {
			theme: THEME_DEFAULT,
			order_book_levels: 10,
		},
		chat: {
			set_username: false,
		},
		audio: {
			order_completed: true,
			order_partially_completed: true,
			public_trade: false,
		},
		risk: {
			order_portfolio_percentage: 80,
			popup_warning: true,
		},
	},
	addressRequest: INITIAL_ADDRESS_OBJECT,
	limits: INITIAL_LIMIT_OBJECT,
	feeValues: INITIAL_FEES_OBJECT,
	tradeVolumes: INITIAL_TRADE_VOLUME_OBJECT,
	affiliation: {},
	is_hap: false,
};

export default function reducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case 'SET_ME': {
			const {
				id,
				email,
				email_verified,
				balance,
				wallet,
				verification_level,
				otp_enabled,
				username,
				created_at,
				bank_account,
				address,
				id_data,
				affiliation_code,
				phone_number,
				is_hap,
				discount,
				full_name,
				gender,
				dob,
			} = action.payload;
			const userData = extractuserData(action.payload);
			const fees = action.payload.fees || state.fees;
			const settings = constructSettings(
				state.settings,
				action.payload.settings
			);
			return {
				...state,
				fetching: false,
				fetched: true,
				id,
				email,
				email_verified,
				balance: {
					...state.balance,
					...balance,
					timestamp: Date.now(),
				},
				wallet,
				verification_level,
				userData,
				otp_enabled,
				fees,
				settings,
				username,
				created_at,
				bank_account,
				address,
				id_data,
				affiliation_code,
				phone_number,
				is_hap,
				discount,
				full_name,
				dob,
				gender,
			};
		}
		case 'SET_USER_DATA': {
			const userData = extractuserData(action.payload);
			const fees = action.payload.fees || state.fees;
			const settings = constructSettings(
				state.settings,
				action.payload.settings
			);
			return {
				...state,
				userData: {
					...state.userData,
					...userData,
				},
				fees,
				settings,
			};
		}
		case 'SET_BALANCE':
			return {
				...state,
				balance: {
					...state.balance,
					...action.payload,
					timestamp: Date.now(),
				},
			};

		// WITHDRAW
		case 'PROCESS_WITHDRAW_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'PROCESS_WITHDRAW_REJECTED':
			return { ...state, fetching: false, error: action.payload };
		case 'PROCESS_WITHDRAW_FULFILLED':
			return {
				...state,
				fetching: false,
				fetched: true,
				data: action.payload.data,
			};
		// USER_IDENTITY
		case 'USER_IDENTITY_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'USER_IDENTITY_REJECTED':
			return { ...state, fetching: false, error: action.payload };
		case 'USER_IDENTITY_FULFILLED':
			return {
				...state,
				fetching: false,
				fetched: true,
				userData: action.payload.data,
			};
		// UPLOAD_FILE
		case 'UPLOAD_FILE_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'UPLOAD_FILE_REJECTED':
			return { ...state, fetching: false, error: action.payload };
		case 'UPLOAD_FILE_FULFILLED':
			return {
				...state,
				fetching: false,
				fetched: true,
				userData: action.payload.data,
			};

		// REQUEST_OTP
		case 'REQUEST_OTP_PENDING':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					requesting: true,
				},
			};
		case 'REQUEST_OTP_REJECTED':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					error: action.payload.message,
				},
			};
		case 'REQUEST_OTP_FULFILLED':
			return {
				...state,
				otp: {
					...INITIAL_OTP_OBJECT,
					requested: true,
					secret: action.payload.secret,
				},
			};

		case 'ACTIVATE_OTP':
			return {
				...state,
				otp: {
					...state.otp,
					activated: true,
				},
				otp_enabled: true,
			};

		case 'REVOKE_OTP':
			return {
				...state,
				otp: INITIAL_OTP_OBJECT,
				otp_enabled: false,
			};

		// ACTIVATE_OTP
		case 'ACTIVATE_OTP_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'ACTIVATE_OTP_REJECTED':
			return {
				...state,
				fetching: false,
				otpError: action.payload.response.data.message,
			};
		case 'ACTIVATE_OTP_FULFILLED':
			return { ...state, fetching: false, activateOtp: action.payload.data };
		// DEACTIVATE_OTP
		case 'DEACTIVATE_OTP_PENDING':
			return { ...state, fetching: true, fetched: false, error: null };
		case 'DEACTIVATE_OTP_REJECTED':
			return { ...state, fetching: false, error: action.payload.response };
		case 'DEACTIVATE_OTP_FULFILLED':
			return {
				...state,
				fetching: false,
				deactivateOtp: action.payload.data,
			};
		case 'REQUEST_TOKENS_PENDING':
			return { ...state, fetching: true, error: null, tokens: [] };
		case 'REQUEST_TOKENS_REJECTED':
			return { ...state, fetching: false, error: action.payload.response };
		case 'REQUEST_TOKENS_FULFILLED':
			return { ...state, fetching: false, tokens: action.payload.data };
		case 'TOKEN_REVOKED': {
			const tokens = [].concat(state.tokens);
			const { token } = action.payload;
			const tokenIndex = tokens.findIndex(({ id }) => id === token.id);
			if (tokenIndex > -1) {
				tokens.splice(tokenIndex, 1, token);
			}
			return { ...state, tokens };
		}
		case 'TOKEN_GENERATED':
			return {
				...state,
				tokens: [action.payload.token].concat(state.tokens),
			};
		case 'SET_USERNAME':
			return {
				...state,
				username: action.payload.username,
				username_set: action.payload.username_set,
				settings: {
					...state.settings,
					chat: {
						set_username: true,
					},
				},
			};
		// case 'REQUEST_LIMITS_PENDING':
		// 	return {
		// 		...state,
		// 		limits: {
		// 			...INITIAL_LIMIT_OBJECT,
		// 			fetching: true
		// 		}
		// 	};
		// case 'REQUEST_LIMITS_FULFILLED':
		// 	return {
		// 		...state,
		// 		limits: {
		// 			...INITIAL_LIMIT_OBJECT,
		// 			fetched: true,
		// 			data: action.payload.data.rows
		// 		}
		// 	};
		// case 'REQUEST_LIMITS_REJECTED':
		// 	return {
		// 		...state,
		// 		limits: {
		// 			...INITIAL_LIMIT_OBJECT,
		// 			error: action.payload.response
		// 		}
		// 	};

		// case 'REQUEST_FEES_PENDING':
		// 	return {
		// 		...state,
		// 		feeValues: {
		// 			...INITIAL_FEES_OBJECT,
		// 			fetching: true
		// 		}
		// 	};
		// case 'REQUEST_FEES_FULFILLED':
		// 	return {
		// 		...state,
		// 		feeValues: {
		// 			...INITIAL_FEES_OBJECT,
		// 			fetched: true,
		// 			data: action.payload.data
		// 		}
		// 	};
		// case 'REQUEST_FEES_REJECTED':
		// 	return {
		// 		...state,
		// 		feeValues: {
		// 			...INITIAL_FEES_OBJECT,
		// 			error: action.payload.response
		// 		}
		// 	};
		case 'CREATE_ADDRESS_PENDING':
			return {
				...state,
				addressRequest: {
					...INITIAL_ADDRESS_OBJECT,
					fetching: true,
				},
			};
		case 'CREATE_ADDRESS_REJECTED':
			return {
				...state,
				addressRequest: {
					...INITIAL_ADDRESS_OBJECT,
					error: action.payload.response.data.message,
				},
			};
		case 'CREATE_ADDRESS_FULFILLED':
			const { address, crypto: currency, network = null } = action.payload.data;
			const { wallet } = state;
			return {
				...state,
				wallet: [...wallet, { currency, address, network }],
				addressRequest: {
					...INITIAL_ADDRESS_OBJECT,
					success: true,
				},
			};
		case 'CLEAN_CREATE_ADDRESS':
			return {
				...state,
				addressRequest: INITIAL_ADDRESS_OBJECT,
			};
		case 'GET_TRADE_VOLUME_PENDING':
			return {
				...state,
				tradeVolumes: {
					...INITIAL_TRADE_VOLUME_OBJECT,
					fetching: true,
				},
			};
		case 'GET_TRADE_VOLUME_FULFILLED':
			return {
				...state,
				tradeVolumes: {
					...INITIAL_TRADE_VOLUME_OBJECT,
					fetched: true,
					data: action.payload.data.data,
				},
			};
		case 'GET_TRADE_VOLUME_REJECTED':
			return {
				...state,
				tradeVolumes: {
					...INITIAL_TRADE_VOLUME_OBJECT,
					error: action.payload.response,
				},
			};
		case 'REFERRAL_COUNT_FULFILLED':
			return {
				...state,
				affiliation: action.payload,
			};
		case 'REFERRAL_COUNT_REJECTED':
			return {
				...state,
				affiliation: {},
			};
		case 'LOGOUT':
			return INITIAL_STATE;
		default:
			return state;
	}
}
