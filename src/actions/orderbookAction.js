import axios from 'axios'

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
