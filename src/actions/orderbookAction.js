import _ from 'lodash'
import axios from 'axios'

const baseURL = 'http://35.158.6.83/api/v0'

export function getOrderbook() {
	return {
		type: 'GET_ORDERBOOK',
		payload: axios.get(`${baseURL}/orderbook`)
	}
}

export function getTrades() {
	return {
		type: 'GET_TRADES',
		payload: axios.get(`${baseURL}/trade`)
	}
}