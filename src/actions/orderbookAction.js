import _ from 'lodash'
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
		payload: orderbook['btc'] // set only for btc at the moment
	}
}

export function getTrades() {
	return {
		type: 'GET_TRADES',
		payload: axios.get('/trade')
	}
}

export function setTrades(trades) {
	return {
		type: 'SET_TRADES',
		payload: trades['btc'] // set only for btc at the moment
	}
}

export function addTrades(trades, newTrades) {
	return {
		type: 'ADD_TRADES',
		payload: { trades, newTrades: newTrades['btc'] } // set only for btc at the moment
	}
}