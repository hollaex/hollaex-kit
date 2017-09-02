import axios from 'axios'
import _ from 'lodash'

// const baseURL = 'http://35.158.6.83/api/v0'

export function createOrder(side, type, size, price) {
	let body
	if(price) {
		price = Number(price)
		body = {side, type, size, price, symbol: 'btc'}
	}
	else{
		body = {side, type, size, symbol: 'btc'}
	}
	return {
		type: 'CREATE_ORDER',
		payload: axios.post('/order', body)
	}
}

export function getOrders() {
	return {
		type: 'GET_ORDERS',
		payload: axios.get('/user/orders'),
	}
}

export function cancelOrder(orderid) {
	return {
		type: 'CANCEL_ORDER',
		payload: axios.delete(`/user/orders/${orderid}`),
	}
}
export function cancelAllOrders() {
	return {
		type: 'CANCEL_ALL_ORDERS',
		payload: axios.delete('/user/orders'),
	}
}

// Set orders from websocket
export function setUserOrders(orders) {
	return {
		type: 'SET_USER_ORDERS',
		payload: orders,
	}
}

export function addOrder(activeOrders, order) {
	return {
		type: 'ADD_ORDER',
		payload: {activeOrders, order},
	}
}