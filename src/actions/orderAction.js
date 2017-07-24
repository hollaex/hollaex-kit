import axios from 'axios'
import _ from 'lodash'

const baseURL = 'http://35.158.6.83/api/v0'


export function createOrder(side, type, size, price) {
	let body
	if(price) {
		price = Number(price)
		body = {side, size, price}
	}
	body = {side, type, size, price}
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