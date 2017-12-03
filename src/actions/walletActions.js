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
  DEPOSIT_VERIFICATION_PENDING: 'DEPOSIT_VERIFICATION_PENDING',
  DEPOSIT_VERIFICATION_FULFILLED: 'DEPOSIT_VERIFICATION_FULFILLED',
  DEPOSIT_VERIFICATION_REJECTED: 'DEPOSIT_VERIFICATION_REJECTED',
}

const ENDPOINTS = {
  TRADES: '/user/trades',
  DEPOSITS: '/user/deposits',
  WITHDRAWALS: '/user/withdrawals',
  DEPOSIT_BANK: '/user/deposit/bank',
  WITHDRAW_BANK: '/user/withdraw/bank',
}

export const performDeposit = (values) => {
  return axios.post('/deposit', values);
}

export const performWithdraw = (values) => {
  return axios.post('/withdraw', values);
}

export const requestFiatDeposit = (amount) => {
  return axios.get(`${ENDPOINTS.DEPOSIT_BANK}?amount=${amount}`);
}

export const requestFiatWithdraw = (values) => {
  return axios.post(ENDPOINTS.WITHDRAW_BANK, values);
}

export const verifyFiatDeposit = (deposit_id, status) => {
  return ((dispatch) => {
		dispatch({ type: ACTION_KEYS.DEPOSIT_VERIFICATION_PENDING });
		axios.get(`${ENDPOINTS.DEPOSIT_BANK}/${deposit_id}?status=${status}`)
			.then((body) => {
				dispatch({
				    type: ACTION_KEYS.DEPOSIT_VERIFICATION_FULFILLED,
				    payload: body.data,
				});
			})
			.catch((err) => {
        const payload = err.response.data || { message: err.message };
				dispatch({
				    type: ACTION_KEYS.DEPOSIT_VERIFICATION_REJECTED,
				    payload
				});
			})
	});
}

export const addUserTrades = (trades) => ({
  type: ACTION_KEYS.ADD_USER_TRADES,
  payload: trades,
});

export const getUserTrades = ({ symbol = 'btc', limit = 100, page = 1, ...rest }) => {
	const query = querystring.stringify({
		symbol,
		page,
		limit,
	});

  return ((dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_TRADES_PENDING, payload: { page } });
		axios.get(`${ENDPOINTS.TRADES}?${query}`)
			.then((body) => {
				dispatch({
				    type: ACTION_KEYS.USER_TRADES_FULFILLED,
				    payload: body.data,
				});
				if (body.data.count > page * limit) {
					dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				}
			})
			.catch((err) => {
				dispatch({
				    type: ACTION_KEYS.USER_TRADES_REJECTED,
				    payload: err.response
				});
			})
	});
}

export const getUserDeposits = ({ limit = 100, page = 1, ...rest }) => {
	const query = querystring.stringify({
		page,
		limit,
	});

  return ((dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_DEPOSITS_PENDING, payload: { page } });
		axios.get(`${ENDPOINTS.DEPOSITS}?${query}`)
			.then((body) => {
				dispatch({
				    type: ACTION_KEYS.USER_DEPOSITS_FULFILLED,
				    payload: body.data,
				});
				if (body.data.count > page * limit) {
					dispatch(getUserDeposits({ limit, page: page + 1 }));
				}
			})
			.catch((err) => {
				dispatch({
				    type: ACTION_KEYS.USER_DEPOSITS_REJECTED,
				    payload: err.response
				});
			})
	});
}

export const getUserWithdrawals = ({ limit = 100, page = 1, ...rest }) => {
	const query = querystring.stringify({
		page,
		limit,
	});

  return ((dispatch) => {
		dispatch({ type: ACTION_KEYS.USER_WITHDRAWALS_PENDING, payload: { page } });
		axios.get(`${ENDPOINTS.WITHDRAWALS}?${query}`)
			.then((body) => {
				dispatch({
				    type: ACTION_KEYS.USER_WITHDRAWALS_FULFILLED,
				    payload: body.data,
				});
				if (body.data.count > page * limit) {
					dispatch(getUserWithdrawals({ limit, page: page + 1 }));
				}
			})
			.catch((err) => {
				dispatch({
				    type: ACTION_KEYS.USER_WITHDRAWALS_REJECTED,
				    payload: err.response
				});
			})
	});
}
