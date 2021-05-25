import axios from 'axios';
import ICONS from 'config/icons';
import STRINGS from '../config/localizedStrings';
import { playBackgroundAudioNotification } from '../utils/utils';

// Set orders from websocket
export function setUserOrders(orders) {
	return {
		type: 'SET_USER_ORDERS',
		payload: orders,
	};
}

export function addOrder(order) {
	return {
		type: 'ADD_ORDER',
		payload: { order },
	};
}

export function updateOrder(order) {
	return {
		type: 'UPDATE_ORDER',
		payload: { order },
	};
}

export function removeOrder(ids = {}) {
	return {
		type: 'REMOVE_ORDER',
		payload: { ids: [ids.id] },
	};
}

export const submitOrder = (order) => axios.post('/order', order);
export const cancelOrder = (orderId, settings) => (dispatch) => {
	axios
		.delete(`/order?order_id=${orderId}`)
		.then((data) => {
			dispatch({
				type: 'CANCEL_ORDER',
				payload: data,
			});
			playBackgroundAudioNotification('cancel_order', settings);
			dispatch({
				type: 'SET_SNACK_NOTIFICATION',
				payload: {
					icon: ICONS['CLOSE_CROSS'],
					content: STRINGS['CANCEL_SUCCESS_TEXT'],
				},
			});
		})
		.catch((err) => {});
};

export const cancelAllOrders = (symbol = '', settings) => (dispatch) => {
	axios
		.delete('/order/all') //?symbol=${symbol} can be used to cancel all based on pairs
		.then((data) => {
			dispatch({
				type: 'CANCEL_ALL_ORDERS',
				payload: data,
			});
			playBackgroundAudioNotification('cancel_order', settings);
			dispatch({
				type: 'SET_SNACK_NOTIFICATION',
				payload: {
					icon: ICONS['CLOSE_CROSS'],
					content: STRINGS['CANCEL_SUCCESS_TEXT'],
				},
			});
		})
		.catch((err) => {});
};
