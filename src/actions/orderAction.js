import axios from 'axios'
import _ from 'lodash'

const baseURL = 'http://35.158.6.83/api/v0'

const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGlAYWxpLmNvbSIsImlzcyI6ImJpdGhvbGxhLmNvbSIsImV4cGlyeSI6MTUwMTA4MDM4NzcwOCwiaWF0IjoxNTAxMDgwMzg3fQ.7aORI0an_Yym6WFAB261yky4WiQaKpx7888sIzid_Z4'

axios.defaults.headers.common['Authorization'] = token;
axios.defaults.headers.post['Content-Type'] = 'application/json';

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