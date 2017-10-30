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

// Set orders from websocket
export function setUserOrders(orders) {
	return {
		type: 'SET_USER_ORDERS',
		payload: orders,
	}
}

export function addOrder(order) {
	return {
		type: 'ADD_ORDER',
		payload: { order },
	}
}

export function updateOrder(order) {
	return {
		type: 'UPDATE_ORDER',
		payload: { order },
	}
}

export function removeOrder(ids) {
	return {
		type: 'REMOVE_ORDER',
		payload: { ids: ids.map((item) => item.id) },
	}
}

export const submitOrder = (order) => axios.post('/order', order);
export const cancelOrder = (orderId) => ({
	type: 'CANCEL_ORDER',
	payload: axios.delete(`/user/orders/${orderId}`)
});

export const cancelAllOrders = () => ({
	type: 'CANCEL_ALL_ORDERS',
	payload: axios.delete('/user/orders'),
});
