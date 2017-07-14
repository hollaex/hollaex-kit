import axios from 'axios'
import _ from 'lodash'

export default function reducer(state={
	fetched: false,
	fetching: false,
	error: null,
	activeOrders: []
}, action) {
	switch(action.type) {
		
		// cancelOrder
		case 'CANCEL_ORDER_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'CANCEL_ORDER_REJECTED': {
			alert('Error: ' + action.payload)
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'CANCEL_ORDER_FULFILLED': {
			// alert('Order cancelled successfully')
			return {...state, fetching: false, fetched: true}
			break;
		}

		// getOrders
		case 'GET_ORDERS': {
			return {...state, activeOrders: action.payload}
			break;
		}

		// createOrder
		case 'CREATE_ORDER_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'CREATE_ORDER_REJECTED': {
			alert('Error: ' + action.payload.response.data.error)
			return {...state, fetching: false, error: action.payload}
			break;
		}
		case 'CREATE_ORDER_FULFILLED': {
			// alert('Order created successfully')
			return {...state, fetching: false, fetched: true}
			break;
		}

		// updateOrder
		case 'UPDATE_ORDER_PENDING': {
			return {...state, fetching: true, fetched: false, error: null}
			break;
		}
		case 'UPDATE_ORDER_REJECTED': {
			alert('Error: ' + action.payload.response.data.error)
			return {...state, fetching: false, error: action.payload.response.data.error}
			break;
		}
		case 'UPDATE_ORDER_FULFILLED': {
			alert('Order updated successfully')
			return {...state, fetching: false, fetched: true}
			break;
		}

		case 'UPDATE_ORDERS': {
			return {...state, activeOrders: action.payload}
			break;
		}

		
	}
	return state;
}