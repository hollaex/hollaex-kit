import { ACTION_KEYS } from '../actions/walletActions';

const INITIAL_API_OBJECT = {
	data: [],
	count: 0,
	loading: false,
	fetched: false,
	page: 1,
	isRemaining: false,
	error: '',
};

const INITIAL_VERIFICATION_OBJECT = {
	loading: false,
	ready: false,
	message: '',
	error: '',
};

const INITIAL_DELETE_WHITDRAWALS_MSG = {
	dismissed: false,
	error: '',
};

const INITIAL_BTC_WHITDRAWALS_FEE = {
	loading: false,
	ready: false,
	error: '',
	min: 0.0001,
	max: 0.1,
	optimal: 0.0001,
};

const joinData = (stateData = [], payloadData = []) =>
	stateData.concat(payloadData);

const INITIAL_STATE = {
	orderHistory: INITIAL_API_OBJECT,
	trades: INITIAL_API_OBJECT,
	latestUserTrades: [],
	deposits: INITIAL_API_OBJECT,
	withdrawals: INITIAL_API_OBJECT,
	logins: INITIAL_API_OBJECT,
	depositVerification: INITIAL_VERIFICATION_OBJECT,
	btcFee: INITIAL_BTC_WHITDRAWALS_FEE,
	withdrawalCancelData: INITIAL_DELETE_WHITDRAWALS_MSG,
};

export default function reducer(state = INITIAL_STATE, { type, payload }) {
	switch (type) {
		// USER_TRADES
		case ACTION_KEYS.USER_TRADES_PENDING: {
			const { page = 1 } = payload;
			const data = page > 1 ? state.trades.data : INITIAL_API_OBJECT.data;
			return {
				...state,
				trades: {
					...INITIAL_API_OBJECT,
					loading: true,
					data,
				},
			};
		}
		case ACTION_KEYS.USER_TRADES_REJECTED:
			return {
				...state,
				trades: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					error: payload,
				},
			};
		case ACTION_KEYS.USER_TRADES_FULFILLED:
			return {
				...state,
				trades: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					count: payload.count,
					page: payload.page,
					isRemaining: payload.isRemaining,
					data: joinData(state.trades.data, payload.data),
				},
			};

		case ACTION_KEYS.ORDER_HISTORY_PENDING: {
			const { page = 1 } = payload;
			const data = page > 1 ? state.orderHistory.data : INITIAL_API_OBJECT.data;
			return {
				...state,
				orderHistory: {
					...INITIAL_API_OBJECT,
					loading: true,
					data,
				},
			};
		}
		case ACTION_KEYS.ORDER_HISTORY_REJECTED:
			return {
				...state,
				orderHistory: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					error: payload,
				},
			};
		case ACTION_KEYS.ORDER_HISTORY_FULFILLED:
			return {
				...state,
				orderHistory: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					count: payload.count,
					page: payload.page,
					isRemaining: payload.isRemaining,
					data: joinData(state.orderHistory.data, payload.data),
				},
			};

		case ACTION_KEYS.ADD_USER_TRADES: {
			// check if we have trades from DB
			const tradesData = joinData(payload.trades, state.trades.data);
			const newCount = state.trades.count + payload.trades.length;
			return {
				...state,
				trades: {
					...state.trades,
					count: newCount,
					data: tradesData,
				},
				latestUserTrades: tradesData.slice(0, 10),
			};
		}

		// DEPOSIT VERIFICATION
		case ACTION_KEYS.DEPOSIT_VERIFICATION_PENDING:
			return {
				...state,
				depositVerification: {
					...INITIAL_VERIFICATION_OBJECT,
					loading: true,
				},
			};
		case ACTION_KEYS.DEPOSIT_VERIFICATION_FULFILLED:
			return {
				...state,
				depositVerification: {
					...INITIAL_VERIFICATION_OBJECT,
					ready: true,
					message: payload.message,
				},
			};
		case ACTION_KEYS.DEPOSIT_VERIFICATION_REJECTED:
			return {
				...state,
				depositVerification: {
					...INITIAL_VERIFICATION_OBJECT,
					error: payload.message,
				},
			};

		//Delete Withdrawal
		case ACTION_KEYS.WITHDRAWAL_CANCEL_PENDING:
			return {
				...state,
				withdrawalCancelData: {
					...INITIAL_DELETE_WHITDRAWALS_MSG,
					error: '',
					dismissed: false,
				},
			};
		case ACTION_KEYS.WITHDRAWAL_CANCEL_FULFILLED:
			return {
				...state,
				withdrawalCancelData: {
					...INITIAL_DELETE_WHITDRAWALS_MSG,
					error: '',
					dismissed: payload.dismissed,
				},
			};
		case ACTION_KEYS.WITHDRAWAL_CANCEL_REJECTED:
			return {
				...state,
				withdrawalCancelData: {
					...INITIAL_DELETE_WHITDRAWALS_MSG,
					error: payload.message,
					dismissed: false,
				},
			};
		// USER_TRADES
		case ACTION_KEYS.USER_DEPOSITS_PENDING: {
			const { page = 1 } = payload;
			const data = page > 1 ? state.deposits.data : INITIAL_API_OBJECT.data;
			return {
				...state,
				deposits: {
					...INITIAL_API_OBJECT,
					loading: true,
					data,
				},
			};
		}
		case ACTION_KEYS.USER_DEPOSITS_REJECTED:
			return {
				...state,
				deposits: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					error: payload,
				},
			};
		case ACTION_KEYS.USER_DEPOSITS_FULFILLED:
			return {
				...state,
				deposits: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					count: payload.count,
					page: payload.page,
					isRemaining: payload.isRemaining,
					data: joinData(state.deposits.data, payload.data),
				},
			};

		// USER_TRADES
		case ACTION_KEYS.USER_WITHDRAWALS_PENDING: {
			const { page = 1 } = payload;
			const data = page > 1 ? state.withdrawals.data : INITIAL_API_OBJECT.data;
			return {
				...state,
				withdrawals: {
					...INITIAL_API_OBJECT,
					loading: true,
					data,
				},
			};
		}
		case ACTION_KEYS.USER_WITHDRAWALS_REJECTED:
			return {
				...state,
				withdrawals: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					error: payload,
				},
			};
		case ACTION_KEYS.USER_WITHDRAWALS_FULFILLED:
			return {
				...state,
				withdrawals: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					count: payload.count,
					page: payload.page,
					isRemaining: payload.isRemaining,
					data: joinData(state.withdrawals.data, payload.data),
				},
			};
		case ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_PENDING:
			return {
				...state,
				btcFee: {
					...INITIAL_BTC_WHITDRAWALS_FEE,
					loading: true,
				},
			};
		// USER_LOGINS
		case ACTION_KEYS.USER_LOGINS_PENDING: {
			const { page = 1 } = payload;
			const data = page > 1 ? state.logins.data : INITIAL_API_OBJECT.data;
			return {
				...state,
				logins: {
					...INITIAL_API_OBJECT,
					loading: true,
					data,
				},
			};
		}
		case ACTION_KEYS.USER_LOGINS_REJECTED:
			return {
				...state,
				logins: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					error: payload,
				},
			};
		case ACTION_KEYS.USER_LOGINS_FULFILLED:
			return {
				...state,
				logins: {
					...INITIAL_API_OBJECT,
					loading: false,
					fetched: true,
					count: payload.count,
					page: payload.page,
					isRemaining: payload.isRemaining,
					data: joinData(state.logins.data, payload.data),
				},
			};
		case ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_FULFILLED:
			return {
				...state,
				btcFee: {
					...INITIAL_BTC_WHITDRAWALS_FEE,
					loading: false,
					ready: true,
					...payload,
				},
			};
		case ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_REJECTED:
			return {
				...state,
				btcFee: {
					...INITIAL_BTC_WHITDRAWALS_FEE,
					loading: false,
				},
			};
		case 'LOGOUT':
			return INITIAL_STATE;
		default:
			return state;
	}
}
