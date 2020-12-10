import axios from 'axios';
import querystring from 'query-string';
// import { all } from 'bluebird';

export const ACTION_KEYS = {
	ADD_USER_TRADES: 'ADD_USER_TRADES',
	USER_TRADES_PENDING: 'USER_TRADES_PENDING',
	USER_TRADES_FULFILLED: 'USER_TRADES_FULFILLED',
	USER_TRADES_REJECTED: 'USER_TRADES_REJECTED',
	USER_DEPOSITS_PENDING: 'USER_DEPOSITS_PENDING',
	USER_DEPOSITS_FULFILLED: 'USER_DEPOSITS_FULFILLED',
	USER_DEPOSITS_REJECTED: 'USER_DEPOSITS_REJECTED',
	USER_WITHDRAWALS_PENDING: 'USER_WITHDRAWALS_PENDING',
	USER_WITHDRAWALS_FULFILLED: 'USER_WITHDRAWALS_FULFILLED',
	USER_WITHDRAWALS_REJECTED: 'USER_WITHDRAWALS_REJECTED',
	USER_WITHDRAWALS_BTC_FEE_PENDING: 'USER_WITHDRAWALS_BTC_FEE_PENDING',
	USER_WITHDRAWALS_BTC_FEE_FULFILLED: 'USER_WITHDRAWALS_BTC_FEE_FULFILLED',
	USER_WITHDRAWALS_BTC_FEE_REJECTED: 'USER_WITHDRAWALS_BTC_FEE_REJECTED',
	DEPOSIT_VERIFICATION_PENDING: 'DEPOSIT_VERIFICATION_PENDING',
	DEPOSIT_VERIFICATION_FULFILLED: 'DEPOSIT_VERIFICATION_FULFILLED',
	DEPOSIT_VERIFICATION_REJECTED: 'DEPOSIT_VERIFICATION_REJECTED',
	WITHDRAWAL_CANCEL_PENDING: 'WITHDRAWAL_CANCEL_PENDING',
	WITHDRAWAL_CANCEL_FULFILLED: 'WITHDRAWAL_CANCEL_FULFILLED',
	WITHDRAWAL_CANCEL_REJECTED: 'WITHDRAWAL_CANCEL_REJECTED'
};

const ENDPOINTS = {
	TRADES: '/user/trades',
	DEPOSITS: '/user/deposits',
	WITHDRAWALS: '/user/withdrawals',
	DEPOSIT_BANK: '/user/deposit/bank',
	WITHDRAW_BANK: '/user/withdraw/bank',
	WITHDRAW: (currency) => `/user/request-withdrawal`,
	WITHDRAW_FEE: (currency) => `/user/withdraw/${currency}/fee`,
	CANCEL_WITHDRAWAL: '/user/withdrawals',
	CONFIRM_WITHDRAWAL: '/user/confirm-withdrawal'
};

export const performWithdraw = (currency, values) => {
	return axios.post(ENDPOINTS.WITHDRAW(currency), values);
};

export const requestWithdrawFee = (currency = 'btc') => {
	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_PENDING });
		axios
			.get(ENDPOINTS.WITHDRAW_FEE(currency))
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_FULFILLED,
					payload: body.data
				});
			})
			.catch((err) => {
				const payload = err.response.data || { message: err.message };
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_REJECTED,
					payload
				});
			});
	};
};

export const withdrawalCancel = (transactionId) => {
	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.WITHDRAWAL_CANCEL_PENDING });
		axios
			.delete(ENDPOINTS.CANCEL_WITHDRAWAL, {data: { transaction_id: parseInt(transactionId.transactionId, 10)}} )
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.WITHDRAWAL_CANCEL_FULFILLED,
					payload: body.data
				});
			})
			.catch((err) => {
				const payload = err.response.data || { message: err.message };
				dispatch({
					type: ACTION_KEYS.WITHDRAWAL_CANCEL_REJECTED,
					payload
				});
			});
	};
};

export const addUserTrades = (trades) => ({
	type: ACTION_KEYS.ADD_USER_TRADES,
	payload: {
		trades
	}
});

export const getUserTrades = ({
	symbol,
	limit = 50,
	page = 1,
	...rest
}) => {
	let dataParams = { page, limit };
	if (symbol) {
		dataParams.symbol = symbol;
	}
	const query = querystring.stringify(dataParams);

	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_TRADES_PENDING, payload: { page } });
		axios
			.get(`${ENDPOINTS.TRADES}?${query}`)
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.USER_TRADES_FULFILLED,
					payload: {
						...body.data,
						page,
						isRemaining: body.data.count > page * limit
					}
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_TRADES_REJECTED,
					payload: err.response
				});
			});
	};
};

export const downloadUserTrades = (key) => {
	const query = querystring.stringify({
		format: 'csv'
	});
	let path = ENDPOINTS.TRADES;
	if (key === 'deposit') {
		path = ENDPOINTS.DEPOSITS;
	} else if (key === 'withdrawal') {
		path = ENDPOINTS.WITHDRAWALS
	}

	return (dispatch) => {
		axios
			.get(`${path}?${query}`)
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement('a'); link.href = url;
				link.setAttribute('download', `user_${key}.csv`);
				document.body.appendChild(link); link.click();
			})
			.catch((err) => {
				// dispatch({
				// 	type: ACTION_KEYS.USER_TRADES_REJECTED,
				// 	payload: err.response
				// });
			});
	};
};

export const getUserDeposits = ({ limit = 50, page = 1, ...rest }) => {
	const query = querystring.stringify({
		page,
		limit
	});

	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_DEPOSITS_PENDING, payload: { page } });
		axios
			.get(`${ENDPOINTS.DEPOSITS}?${query}`)
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.USER_DEPOSITS_FULFILLED,
					payload: {
						...body.data,
						page,
						isRemaining: body.data.count > page * limit
					}
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserDeposits({ limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_DEPOSITS_REJECTED,
					payload: err.response
				});
			});
	};
};

export const getUserWithdrawals = ({ limit = 50, page = 1, ...rest }) => {
	const query = querystring.stringify({
		page,
		limit
	});

	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_WITHDRAWALS_PENDING, payload: { page } });
		axios
			.get(`${ENDPOINTS.WITHDRAWALS}?${query}`)
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_FULFILLED,
					payload: {
						...body.data,
						page,
						isRemaining: body.data.count > page * limit
					}
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserWithdrawals({ limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_REJECTED,
					payload: err.response
				});
			});
	};
};

export const performConfirmWithdrawal = (token) => {
	return axios.post(ENDPOINTS.CONFIRM_WITHDRAWAL, { token });
};
