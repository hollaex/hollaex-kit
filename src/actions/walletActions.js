import axios from 'axios';
import querystring from 'query-string';
// import { all } from 'bluebird';

export const performDeposit = (values) => {
  return axios.post('/deposit', values);
}

export const performWithdraw = (values) => {
  return axios.post('/withdraw', values);
}

export const getUserTrades = ({ symbol = 'btc', limit = 100, page = 1 }) =>  {
	const query = querystring.stringify({
		symbol,
		page,
		limit,
	});

	return ((dispatch) => {
		dispatch({ type: 'USER_TRADES_PENDING', payload: { page } });
		axios.get(`/user/trades?${query}`)
			.then((body) => {
				dispatch({
				    type: 'USER_TRADES_FULFILLED',
				    payload: body.data,
				});
				if (body.data.count > page * limit) {
					dispatch(getUserTrades({ symbol, limit, page: page + 1 }));
				}
			})
			.catch((err) => {
				dispatch({
				    type: 'USER_TRADES_REJECTED',
				    payload: err.response
				});
			})
	});
}

export const addUserTrades = (trades) => ({
  type: 'ADD_USER_TRADES',
  payload: trades,
});
