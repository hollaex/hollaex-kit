import axios from 'axios'
import _ from 'lodash'

const baseURL = 'http://localhost:10010/api/v0';


export function createOrder(side, size, price) {
	let body
	if(price) {
		price = Number(price)
		body = {side, size, price}
	}
	body = {side, size, price}
	return {
		type: 'CREATE_ORDER',
		payload: axios.post(`${baseURL}/order`, body)
	}
}

export function updateOrder(orderID, orderQty, price) {
	return {
		type: 'UPDATE_ORDER',
		payload: axios.put(`${baseURL}/order`, {
			orderID: orderID, 
			orderQty: Number(orderQty),
			price: Number(price)
		})
	}	
}

export function cancelOrder(ID) {
	return {
		type: 'CANCEL_ORDER',
		payload: axios.delete(`${baseURL}/order`, {data: {orderID:ID, text:""}})
	}
}

export function cancelAllOrders() {
	return {
		type: 'CANCEL_ORDER',
		payload: axios.delete(`${baseURL}/order/all`)
	}

}

export function getOrders(orders) {
	return {
		type: 'GET_ORDERS',
		payload: orders
	}
}

export function addOrder(activeOrders, order) {
	activeOrders.unshift(order)
	return {
		type: 'UPDATE_ORDERS',
		payload: activeOrders
	}
}

export function removeOrder(activeOrders, order) {
	let orders = _.filter(activeOrders, o => {
		return o.orderID != order.orderID
	})

	activeOrders.push(order)
	return {
		type: 'UPDATE_ORDERS',
		payload: orders
	}
}