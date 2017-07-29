import _ from 'lodash'
import axios from 'axios'

export function getOrderbook() {
	return {
		type: 'GET_ORDERBOOK',
		payload: axios.get('/orderbook')
	}
}

export function setOrderbook(orderbook) {
	return {
		type: 'SET_ORDERBOOK',
		payload: orderbook
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
		payload: trades
	}
}