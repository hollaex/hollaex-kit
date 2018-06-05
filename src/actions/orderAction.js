import axios from 'axios';

// Set orders from websocket
export function setUserOrders(orders) {
	return {
		type: 'SET_USER_ORDERS',
		payload: orders
	};
}

export function addOrder(order) {
	return {
		type: 'ADD_ORDER',
		payload: { order }
	};
}

export function updateOrder(order) {
	return {
		type: 'UPDATE_ORDER',
		payload: { order }
	};
}

export function removeOrder(ids) {
	return {
		type: 'REMOVE_ORDER',
		payload: { ids: ids.map((item) => item.id) }
	};
}

export const submitOrder = (order) => axios.post('/order', order);
export const cancelOrder = (orderId) => ({
	type: 'CANCEL_ORDER',
	payload: axios.delete(`/user/orders/${orderId}`)
});

export const cancelAllOrders = (symbol = '') => ({
	type: 'CANCEL_ALL_ORDERS',
	payload: axios.delete(`/user/orders?symbol=${symbol}`)
});
