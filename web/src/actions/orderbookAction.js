import axios from 'axios';
import { playBackgroundAudioNotification } from '../utils/utils';

const QUICK_TRADE = 'QUICK_TRADE';
const TRADE_QUOTE_REQUEST = 'TRADE_QUOTE_REQUEST';
const TRADE_QUOTE_PERFORM = 'TRADE_QUOTE_PERFORM';
const SET_ORDERBOOK_DEPTH = 'CHANGE_ORDERBOOK_DEPTH';
export const PAIRS_TRADES_FETCHED = 'PAIRS_TRADES_FETCHED';

export const ORDERBOOK_CONSTANTS = {
	QUICK_TRADE_CANCEL: `${QUICK_TRADE}_CANCEL`,
	QUICK_TRADE_PENDING: `${QUICK_TRADE}_PENDING`,
	QUICK_TRADE_FULFILLED: `${QUICK_TRADE}_FULFILLED`,
	QUICK_TRADE_REJECTED: `${QUICK_TRADE}_REJECTED`,
	TRADE_QUOTE_REQUEST_CANCEL: `${TRADE_QUOTE_REQUEST}_CANCEL`,
	TRADE_QUOTE_REQUEST_PENDING: `${TRADE_QUOTE_REQUEST}_PENDING`,
	TRADE_QUOTE_REQUEST_FULFILLED: `${TRADE_QUOTE_REQUEST}_FULFILLED`,
	TRADE_QUOTE_REQUEST_REJECTED: `${TRADE_QUOTE_REQUEST}_REJECTED`,
	TRADE_QUOTE_PERFORM_PENDING: `${TRADE_QUOTE_PERFORM}_PENDING`,
	TRADE_QUOTE_PERFORM_FULFILLED: `${TRADE_QUOTE_PERFORM}_FULFILLED`,
	TRADE_QUOTE_PERFORM_REJECTED: `${TRADE_QUOTE_PERFORM}_REJECTED`,
	SET_ORDERBOOK_DEPTH,
};

export const setOrderbookDepth = (depth) => {
	return {
		type: SET_ORDERBOOK_DEPTH,
		payload: depth,
	};
};

export function getOrderbook() {
	return {
		type: 'GET_ORDERBOOK',
		payload: axios.get('/orderbooks'),
	};
}

export const setPairsTradesFetched = (fetched = true) => ({
	type: PAIRS_TRADES_FETCHED,
	payload: fetched,
});

export function setOrderbook(orderbook) {
	return {
		type: 'SET_ORDERBOOK',
		payload: orderbook, // set only for btc at the moment
	};
}

export function setOrderbooks(orderbooks) {
	return {
		type: 'SET_ORDERBOOKS_DATA',
		payload: orderbooks,
	};
}

export function setTrades(trades) {
	return {
		type: 'SET_TRADES_DATA',
		payload: trades,
	};
}

export function getTrades() {
	return {
		type: 'GET_TRADES',
		payload: axios.get('/trade'),
	};
}

export function addTrades(symbol, trades) {
	return {
		type: 'ADD_TRADES',
		payload: {
			symbol,
			trades,
		},
	};
}

export const changeSymbol = (symbol) => ({
	type: 'CHANGE_SYMBOL',
	payload: {
		symbol,
	},
});

export const requestQuickTrade = (data = {}) => {
	if (!data.size) {
		return {
			type: ORDERBOOK_CONSTANTS.QUICK_TRADE_CANCEL,
		};
	}
	return (dispatch) => {
		dispatch({
			type: ORDERBOOK_CONSTANTS.QUICK_TRADE_PENDING,
		});
		axios
			.post('/quick-trade', data)
			.then((body) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.QUICK_TRADE_FULFILLED,
					payload: body.data,
				});
			})
			.catch((err) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.QUICK_TRADE_REJECTED,
					payload:
						err.response && err.response.data
							? err.response.data.message
							: err.message,
				});
			});
	};
};

export const requestQuote = (data = {}) => {
	if (!data.size) {
		return {
			type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_CANCEL,
		};
	}
	return (dispatch) => {
		dispatch({
			type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_PENDING,
		});
		axios
			.post('/order/quote', data)
			.then((body) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_FULFILLED,
					payload: body.data,
				});
			})
			.catch((err) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_REQUEST_REJECTED,
					payload: {
						data: err.response ? err.response.data.data : {},
						message:
							err.response && err.response.data
								? err.response.data.message
								: err.message,
					},
				});
			});
	};
};

export const executeQuote = (token, settings) => {
	return (dispatch) => {
		dispatch({
			type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_PENDING,
		});
		axios
			.post(`/order/quote/${token}`, {})
			.then((body) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_FULFILLED,
					payload: body.data,
				});
				playBackgroundAudioNotification('quick_trade_complete', settings);
			})
			.catch((err) => {
				dispatch({
					type: ORDERBOOK_CONSTANTS.TRADE_QUOTE_PERFORM_REJECTED,
					payload: err.response ? err.response.data.message : err.message,
				});
			});
	};
};

export const setPairsData = (pairs) => ({
	type: 'SET_PAIRS_DATA',
	payload: {
		pairs,
	},
});
