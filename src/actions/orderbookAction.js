import axios from 'axios'

const QUICK_TRADE = 'QUICK_TRADE';

export const ORDERBOOK_CONSTANTS = {
	QUICK_TRADE_PENDING: `${QUICK_TRADE}_PENDING`,
	QUICK_TRADE_FULFILLED: `${QUICK_TRADE}_FULFILLED`,
	QUICK_TRADE_REJECTED: `${QUICK_TRADE}_REJECTED`,
}
export function getOrderbook() {
	return {
		type: 'GET_ORDERBOOK',
		payload: axios.get('/orderbooks')
	}
}

export function setOrderbook(orderbook) {
	return {
		type: 'SET_ORDERBOOK',
		payload: orderbook // set only for btc at the moment
	}
}

export function getTrades() {
	return {
		type: 'GET_TRADES',
		payload: axios.get('/trade')
	}
}

export function addTrades(trades) {
	return {
		type: 'ADD_TRADES',
		payload: trades // set only for btc at the moment
	}
}

export const changeSymbol = (symbol) => ({
	type: 'CHANGE_SYMBOL',
	payload: {
		symbol,
	},
});

export const requestQuickTrade = (data = {}) => {
	return ((dispatch) => {
		dispatch({
		    type: ORDERBOOK_CONSTANTS.QUICK_TRADE_PENDING
		});
		axios.post('/quick-trade', data)
			.then((body) => {
				dispatch({
				    type: ORDERBOOK_CONSTANTS.QUICK_TRADE_FULFILLED,
				    payload: body.data
				});
			})
			.catch((err) => {
				dispatch({
				    type: ORDERBOOK_CONSTANTS.QUICK_TRADE_REJECTED,
				    payload: err.response ? err.response.data : err.message
				});
			})
	});
}
