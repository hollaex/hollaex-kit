import axios from 'axios';
import querystring from 'query-string';
// import { all } from 'bluebird';

export const ACTION_KEYS = {
	ADD_USER_TRADES: 'ADD_USER_TRADES',
	USER_TRADES_PENDING: 'USER_TRADES_PENDING',
	USER_TRADES_FULFILLED: 'USER_TRADES_FULFILLED',
	USER_TRADES_REJECTED: 'USER_TRADES_REJECTED',
	ORDER_HISTORY_PENDING: 'ORDER_HISTORY_PENDING',
	ORDER_HISTORY_FULFILLED: 'ORDER_HISTORY_FULFILLED',
	ORDER_HISTORY_REJECTED: 'ORDER_HISTORY_REJECTED',
	USER_DEPOSITS_PENDING: 'USER_DEPOSITS_PENDING',
	USER_DEPOSITS_FULFILLED: 'USER_DEPOSITS_FULFILLED',
	USER_DEPOSITS_REJECTED: 'USER_DEPOSITS_REJECTED',
	USER_WITHDRAWALS_PENDING: 'USER_WITHDRAWALS_PENDING',
	USER_WITHDRAWALS_FULFILLED: 'USER_WITHDRAWALS_FULFILLED',
	USER_WITHDRAWALS_REJECTED: 'USER_WITHDRAWALS_REJECTED',
	USER_LOGINS_PENDING: 'USER_LOGINS_PENDING',
	USER_LOGINS_FULFILLED: 'USER_LOGINS_FULFILLED',
	USER_LOGINS_REJECTED: 'USER_LOGINS_REJECTED',
	USER_WITHDRAWALS_BTC_FEE_PENDING: 'USER_WITHDRAWALS_BTC_FEE_PENDING',
	USER_WITHDRAWALS_BTC_FEE_FULFILLED: 'USER_WITHDRAWALS_BTC_FEE_FULFILLED',
	USER_WITHDRAWALS_BTC_FEE_REJECTED: 'USER_WITHDRAWALS_BTC_FEE_REJECTED',
	DEPOSIT_VERIFICATION_PENDING: 'DEPOSIT_VERIFICATION_PENDING',
	DEPOSIT_VERIFICATION_FULFILLED: 'DEPOSIT_VERIFICATION_FULFILLED',
	DEPOSIT_VERIFICATION_REJECTED: 'DEPOSIT_VERIFICATION_REJECTED',
	WITHDRAWAL_CANCEL_PENDING: 'WITHDRAWAL_CANCEL_PENDING',
	WITHDRAWAL_CANCEL_FULFILLED: 'WITHDRAWAL_CANCEL_FULFILLED',
	WITHDRAWAL_CANCEL_REJECTED: 'WITHDRAWAL_CANCEL_REJECTED',
};

const ENDPOINTS = {
	TRADES: '/user/trades',
	ORDERS: '/orders',
	DEPOSITS: '/user/deposits',
	WITHDRAWALS: '/user/withdrawals',
	DEPOSIT_BANK: '/user/deposit/bank',
	WITHDRAW_BANK: '/user/withdraw/bank',
	WITHDRAW: (currency) => `/user/request-withdrawal`,
	WITHDRAW_FEE: (currency) => `/user/withdrawal?currency=${currency}`,
	CANCEL_WITHDRAWAL: '/user/withdrawal',
	CONFIRM_WITHDRAWAL: '/user/confirm-withdrawal',
	CHECK_TRANSACTION: '/user/check-transaction',
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
					payload: body.data,
				});
			})
			.catch((err) => {
				const payload = err.response.data || { message: err.message };
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_BTC_FEE_REJECTED,
					payload,
				});
			});
	};
};

export const withdrawalCancel = (transactionId) => {
	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.WITHDRAWAL_CANCEL_PENDING });
		axios
			.delete(ENDPOINTS.CANCEL_WITHDRAWAL, {
				data: { id: parseInt(transactionId.transactionId, 10) },
			})
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.WITHDRAWAL_CANCEL_FULFILLED,
					payload: body.data,
				});
			})
			.catch((err) => {
				const payload = err.response.data || { message: err.message };
				dispatch({
					type: ACTION_KEYS.WITHDRAWAL_CANCEL_REJECTED,
					payload,
				});
			});
	};
};

export const addUserTrades = (trades) => ({
	type: ACTION_KEYS.ADD_USER_TRADES,
	payload: {
		trades,
	},
});

export const getUserTrades = ({ symbol, limit = 50, page = 1, ...rest }) => {
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
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_TRADES_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const getUserOrders = ({
	symbol,
	limit = 50,
	page = 1,
	start_date,
	end_date,
	open,
	...rest
}) => {
	let dataParams = { page, limit };
	if (symbol) {
		dataParams.symbol = symbol;
	}

	if (start_date) {
		dataParams.start_date = start_date;
	}

	if (end_date) {
		dataParams.end_date = end_date;
	}

	if (open !== undefined) {
		dataParams.open = open;
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
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_TRADES_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const getOrdersHistory = ({
	symbol,
	limit = 50,
	page = 1,
	start_date,
	end_date,
	open,
	...rest
}) => {
	let dataParams = { page, limit };
	if (symbol) {
		dataParams.symbol = symbol;
	}

	if (start_date) {
		dataParams.start_date = start_date;
	}

	if (end_date) {
		dataParams.end_date = end_date;
	}

	if (open !== undefined) {
		dataParams.open = open;
	}
	const query = querystring.stringify(dataParams);

	return (dispatch) => {
		dispatch({ type: ACTION_KEYS.ORDER_HISTORY_PENDING, payload: { page } });
		axios
			.get(`${ENDPOINTS.ORDERS}?${query}`)
			.then((body) => {
				dispatch({
					type: ACTION_KEYS.ORDER_HISTORY_FULFILLED,
					payload: {
						...body.data,
						page,
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.ORDER_HISTORY_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const downloadUserTrades = (key) => {
	const query = querystring.stringify({
		format: 'csv',
	});
	let path = ENDPOINTS.TRADES;
	if (key === 'orders') {
		path = ENDPOINTS.ORDERS;
	}
	if (key === 'deposit') {
		path = ENDPOINTS.DEPOSITS;
	} else if (key === 'withdrawal') {
		path = ENDPOINTS.WITHDRAWALS;
	}

	return (dispatch) => {
		axios
			.get(`${path}?${query}`)
			.then((res) => {
				const url = window.URL.createObjectURL(new Blob([res.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `user_${key}.csv`);
				document.body.appendChild(link);
				link.click();
			})
			.catch((err) => {
				// dispatch({
				// 	type: ACTION_KEYS.USER_TRADES_REJECTED,
				// 	payload: err.response
				// });
			});
	};
};

const getParamsByStatus = (status) => {
	switch (status) {
		case 'dismissed':
			return { dismissed: true };
		case 'rejected':
			return { rejected: true };
		case 'completed':
			return { status: true };
		case 'pending':
			return { waiting: true };
		default:
			return {};
	}
};

export const getUserDeposits = ({
	limit = 50,
	page = 1,
	status,
	currency,
	...rest
}) => {
	const statusParams = getParamsByStatus(status);
	const query = querystring.stringify({
		page,
		limit,
		...statusParams,
		...(currency ? { currency } : {}),
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
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserDeposits({ limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_DEPOSITS_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const getUserWithdrawals = ({
	limit = 50,
	page = 1,
	status,
	currency,
	...rest
}) => {
	const statusParams = getParamsByStatus(status);
	const query = querystring.stringify({
		page,
		limit,
		...statusParams,
		...(currency ? { currency } : {}),
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
						isRemaining: body.data.count > page * limit,
					},
				});
				// if (body.data.count > page * limit) {
				// 	dispatch(getUserWithdrawals({ limit, page: page + 1 }));
				// }
			})
			.catch((err) => {
				dispatch({
					type: ACTION_KEYS.USER_WITHDRAWALS_REJECTED,
					payload: err.response,
				});
			});
	};
};

export const performConfirmWithdrawal = (token) => {
	return axios.post(ENDPOINTS.CONFIRM_WITHDRAWAL, { token });
};

export const searchTransaction = (params) => {
	const query = querystring.stringify(params);
	return axios.get(`${ENDPOINTS.CHECK_TRANSACTION}?${query}`);
};
